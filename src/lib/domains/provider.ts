import { clientIpSource, domainProviderName } from "@/lib/env";
import { rdapProvider } from "./rdap";
import { createWhmcsProvider } from "./whmcs";
import type { DomainProvider, DomainResult } from "./types";

/**
 * Provider resolution, caching and in-flight de-duplication.
 *
 * Resolution order: WHMCS when configured, otherwise RDAP, and "none" only when
 * explicitly forced. There is deliberately NO mock provider — an environment
 * without a provider returns an honest error, because a fake "available"
 * would send someone to checkout for a domain they cannot have.
 *
 * The cache and rate limiter are in-memory and therefore PER INSTANCE. That is
 * adequate for a single Easypanel container. Scaling horizontally means moving
 * both to a shared store (Redis) — otherwise limits multiply by instance count.
 */
export function resolveProvider(): DomainProvider | null {
  const name = domainProviderName();
  if (name === "none") return null;
  if (name === "whmcs") {
    // Fall back rather than fail: a misconfigured WHMCS should still let people
    // search, clearly labelled as a registry lookup.
    return createWhmcsProvider() ?? rdapProvider;
  }
  return rdapProvider;
}

type Entry = { result: DomainResult; expiresAt: number };

const cache = new Map<string, Entry>();
const inFlight = new Map<string, Promise<DomainResult>>();
const MAX_CACHE = 5000;

/** Available names get a short TTL — they can be taken at any moment. */
function ttlFor(result: DomainResult): number {
  switch (result.status) {
    case "available":
      return 60_000;
    case "registered":
      return 300_000;
    default:
      return 30_000;
  }
}

function cacheKey(provider: string, domain: string) {
  return `${provider}:${domain}`;
}

function readCache(key: string): DomainResult | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  return hit.result;
}

function writeCache(key: string, result: DomainResult) {
  if (cache.size >= MAX_CACHE) {
    // Cheap eviction: drop the oldest insertion. A true LRU is not worth the
    // bookkeeping for a cache this small and this short-lived.
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { result, expiresAt: Date.now() + ttlFor(result) });
}

/**
 * Check domains through the provider, serving cache hits and collapsing
 * concurrent duplicate lookups onto one upstream request.
 */
export async function checkDomains(
  provider: DomainProvider,
  domains: string[],
  signal: AbortSignal,
): Promise<DomainResult[]> {
  const results = new Map<string, DomainResult>();
  const misses: string[] = [];

  for (const domain of domains) {
    const key = cacheKey(provider.name, domain);
    const cached = readCache(key);
    if (cached) {
      results.set(domain, cached);
      continue;
    }
    const pending = inFlight.get(key);
    if (pending) {
      // Someone else is already asking upstream for this exact domain.
      results.set(domain, await pending);
      continue;
    }
    misses.push(domain);
  }

  if (misses.length > 0) {
    let settle: (batch: DomainResult[]) => void = () => {};
    const batchPromise = new Promise<DomainResult[]>((r) => {
      settle = r;
    });

    for (const domain of misses) {
      const key = cacheKey(provider.name, domain);
      inFlight.set(
        key,
        batchPromise.then(
          (batch) =>
            batch.find((r) => r.domain === domain) ?? {
              domain,
              sld: domain,
              tld: "",
              status: "unknown" as const,
              price: null,
              source: provider.name,
              reason: "No answer for this name.",
            },
        ),
      );
    }

    try {
      const fresh = await provider.check(misses, signal);
      settle(fresh);
      for (const result of fresh) {
        writeCache(cacheKey(provider.name, result.domain), result);
        results.set(result.domain, result);
      }
    } catch (err) {
      settle([]);
      throw err;
    } finally {
      for (const domain of misses) inFlight.delete(cacheKey(provider.name, domain));
    }
  }

  // Always return one row per requested domain, in the requested order.
  return domains.map(
    (d) =>
      results.get(d) ?? {
        domain: d,
        sld: d,
        tld: "",
        status: "unknown",
        price: null,
        source: provider.name,
        reason: "No answer for this name.",
      },
  );
}

// ── Rate limiting ──────────────────────────────────────────────────────────
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * The client address to rate-limit against.
 *
 * ⚠ THE ONLY QUESTION THAT MATTERS HERE IS "WHO WROTE THIS VALUE". A header the
 * caller can set is not an identity, it is a suggestion, and keying a limiter
 * on a suggestion means the limiter can be asked to look away. This function
 * therefore reads ONE position that the deployment guarantees was written by
 * our own infrastructure, and treats everything else as absent.
 *
 * WHAT THIS REPLACED, AND WHY IT WAS A REAL HOLE. The previous version tried
 * `x-real-ip` first and returned it unconditionally. `x-real-ip` has no append
 * semantics — it is one value, and there is no way to tell our proxy's copy
 * from a caller's. Rotating it gave a fresh bucket per request and defeated
 * every limit on the site: 25 requests with a rotating header all returned 200
 * where 20 was the cap. The XFF handling immediately below it was already
 * correct; the early return meant it never ran.
 *
 * `X-Forwarded-For` IS trustworthy at a known position because each proxy
 * APPENDS what it observed. With one proxy in front, the rightmost entry is our
 * Traefik's observation of the real peer, and the caller cannot write past it —
 * anything they inject lands to its LEFT. `TRUSTED_PROXY_HOPS` says how far
 * from the right that position is; see `clientIpSource`.
 *
 * FAIL CLOSED, TWICE OVER. A list shorter than the configured chain means the
 * request did not arrive the way the deployment says it does, so no identity is
 * claimed rather than a caller-supplied one being believed. And because a
 * DIRECTLY EXPOSED origin can forge even this, identity-keyed limits are not
 * the last line: `GLOBAL_CHAT` in sera/rate-limit caps the instance as a whole,
 * and no amount of header rotation moves it.
 */
export function clientKey(request: Request, scope: string): string {
  const anonymous = `${scope}:unknown`;
  const source = clientIpSource();

  // A CDN-stamped single header (Cloudflare's cf-connecting-ip). Authoritative
  // ONLY because the edge strips any inbound copy before setting its own —
  // which holds exactly as long as the origin refuses connections that did not
  // come from the CDN.
  if (source.header) {
    const stamped = request.headers.get(source.header)?.trim();
    return stamped ? `${scope}:${stamped}` : anonymous;
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return anonymous;

  const hops = forwarded.split(",").map((h) => h.trim()).filter(Boolean);
  // Count from the right: 1 hop => the last entry, 2 => the one before it.
  const index = hops.length - source.hops;
  if (index < 0) return anonymous;

  return hops[index] ? `${scope}:${hops[index]}` : anonymous;
}

/**
 * THE INSTANCE CEILING, and the reason it is inside `rateLimit` rather than at
 * the call sites.
 *
 * ⚠ NO HEADER-BASED IDENTITY SURVIVES A DIRECTLY REACHABLE ORIGIN. `clientKey`
 * reads the one X-Forwarded-For position our proxy is guaranteed to have
 * written — which is sound behind Traefik, because anything the caller injects
 * gets pushed left when Traefik appends. Reach the container directly and there
 * is no Traefik to append: the caller's own entry sits in that position, and a
 * rotating header buys a fresh bucket again. Headers cannot distinguish the two
 * cases, so this is not a bug to be coded around — it is the reason the origin
 * must be reachable ONLY through the proxy (see DEPLOY.md).
 *
 * This ceiling is the defence that does not care. It counts every call leaving
 * this instance, keyed on nothing, so a total identity bypass still cannot
 * drive the endpoint past it. Living inside `rateLimit` means no future caller
 * can forget it — there is no way to take the per-key limit without it.
 *
 * 600/minute is thirty visitors at the full per-visitor allowance: generous for
 * a site this size, and well under the volume that would get this server's IP
 * blocked by rdap.org, which is the realistic damage from an open lookup.
 */
const GLOBAL_KEY = " global";
const GLOBAL_MAX_PER_WINDOW = 600;

export function rateLimit(key: string): { ok: boolean; retryAfterSeconds: number } {
  // Checked first: a tripped ceiling must not consume the caller's own budget,
  // or a burst from elsewhere would lock out someone who did nothing.
  if (key !== GLOBAL_KEY) {
    const ceiling = rateLimitGlobal();
    if (!ceiling.ok) return ceiling;
  }

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic sweep so the map cannot grow without bound.
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}

/**
 * The ceiling's own bucket. Separate function so it reuses the same window
 * bookkeeping without recursing back through the guard above.
 */
function rateLimitGlobal(): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(GLOBAL_KEY);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(GLOBAL_KEY, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= GLOBAL_MAX_PER_WINDOW) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}
