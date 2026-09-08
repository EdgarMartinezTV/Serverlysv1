import { domainProviderName } from "@/lib/env";
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

export function rateLimit(key: string): { ok: boolean; retryAfterSeconds: number } {
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
