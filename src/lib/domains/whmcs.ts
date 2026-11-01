import { createHmac } from "node:crypto";
import { priceFor } from "@/data/tlds";
import { parseDomainInput } from "./normalize";
import { rdapProvider } from "./rdap";
import { whmcsConfig } from "@/lib/env";
import type { DomainProvider, DomainResult } from "./types";

/**
 * WHMCS availability provider — the PRODUCTION authority.
 *
 * It asks WHMCS the way the WHMCS cart itself does: POST
 * `index.php?rp=/domain/check` inside a cart session. That endpoint answers
 * through the install's Domain Lookup Provider (the registrar), so a result
 * here is exactly what the customer will see at checkout, with the price and
 * the premium flag WHMCS will charge.
 *
 * WHY NOT THE API'S `DomainWhois`. It was wired first and verified live on
 * 2026-10-05: it reads raw WHOIS through WHMCS's whois server table, which is
 * wrong for some of the TLDs we sell. `.info` hits a server that replies "TLD
 * is not supported" and `.website` replies "is available for registration" in
 * wording WHMCS does not match; both came back "unavailable" for a name the
 * registry and the cart agree is free. The cart endpoint got all eight right.
 *
 * ┌─ CONFIGURATION ──────────────────────────────────────────────────────────┐
 * │ WHMCS_API_URL         its origin locates the install: the cart base is   │
 * │                       this URL minus `/includes/api.php`. In production │
 * │                       it is the INTERNAL proxy address,                  │
 * │                       http://webhosting_billing-proxy/billing/...        │
 * │ WHMCS_API_IDENTIFIER  } kept for API actions; the cart check needs no    │
 * │ WHMCS_API_SECRET      } credentials, only a session and its CSRF token.  │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * The response shape is an internal contract of the WHMCS cart, not a
 * versioned API, so anything unrecognised falls back to RDAP for that name
 * (whose results link to the WHMCS search, never straight into the cart)
 * rather than guessing. Re-verify after a WHMCS upgrade.
 */

type CartSession = { cookie: string; token: string; expiresAt: number };

/** Well inside PHP's default 24-minute session lifetime. */
const SESSION_TTL_MS = 10 * 60_000;

/**
 * ┌─ SPEED (2026-11-01) ──────────────────────────────────────────────────────┐
 * │ PHP LOCKS A SESSION PER REQUEST. With one shared cart session, parallel  │
 * │ lookups queued behind each other inside WHMCS: measured 12 names = 8.4s  │
 * │ on one session vs ~3.0s spread over several. So lookups run on a POOL of │
 * │ sessions, each lookup on the least-busy one.                             │
 * │                                                                          │
 * │ Opening a session costs ~0.9s, so the pool is kept warm: a background    │
 * │ refresh reopens it before it expires, and a cold pool opens all members  │
 * │ in parallel — a visitor never waits for a session open after the first.  │
 * │                                                                          │
 * │ SPOTLIGHT BATCH: `type=spotlight` answers for every Spotlight TLD (WHMCS │
 * │ setting SpotlightTLDs, 8 today) in ONE call through the registrar        │
 * │ (~1.0s for 8). Used whenever 2+ requested names are spotlight TLDs; the  │
 * │ set is learned from WHMCS's own answer, so editing the setting needs no  │
 * │ code change. The setting is NOT widened from here: the WHMCS cart shows  │
 * │ those TLDs as tiles.                                                     │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
const POOL_SIZE = 6;
const REFRESH_EVERY_MS = 8 * 60_000;

type Slot = { session: Promise<CartSession> | null; busy: number };
const pool: Slot[] = Array.from({ length: POOL_SIZE }, () => ({ session: null, busy: 0 }));
let refreshTimer: ReturnType<typeof setInterval> | null = null;
/** Spotlight TLDs, learned from WHMCS's spotlight answers. Null until seen. */
let spotlightTlds: Set<string> | null = null;

function cartBase(apiUrl: string) {
  return apiUrl.replace(/\/includes\/api\.php$/, "");
}

async function openSession(base: string, signal?: AbortSignal): Promise<CartSession> {
  // Follow redirects: the PUBLIC origin 301s cart.php -> /cart (the clean-URL
  // proxy), and treating that hop as a failure silently dropped every lookup
  // to RDAP. The session cookie is set by the final 200, which is what we read.
  const res = await fetch(`${base}/cart.php?a=add&domain=register`, {
    redirect: "follow",
    cache: "no-store",
    signal,
  });
  const html = await res.text();
  const cookie = res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  const token = /name="token" value="([a-f0-9]+)"/.exec(html)?.[1];
  if (!res.ok || !cookie || !token) throw new Error("Could not open a WHMCS cart session.");
  return { cookie, token, expiresAt: Date.now() + SESSION_TTL_MS };
}

function reopen(slot: Slot, base: string) {
  // Not tied to any caller's signal: a visitor navigating away must not leave
  // a half-opened session behind for the next one.
  const opening = openSession(base);
  slot.session = opening;
  opening.catch(() => {
    if (slot.session === opening) slot.session = null;
  });
  return opening;
}

/** Keep every pool member fresh, so no visitor pays for a session open. */
function keepWarm(base: string) {
  if (refreshTimer) return;
  refreshTimer = setInterval(() => {
    for (const slot of pool) if (slot.busy === 0) void reopen(slot, base).catch(() => {});
  }, REFRESH_EVERY_MS);
  // Never keep the process alive just for this.
  (refreshTimer as { unref?: () => void }).unref?.();
}

/** The least-busy slot, its session opened (or reopened) if needed. */
async function acquire(base: string, fresh: boolean): Promise<{ slot: Slot; session: CartSession }> {
  keepWarm(base);
  // A cold pool: open every member at once (in parallel), not one per caller.
  if (pool.every((s) => !s.session)) for (const s of pool) void reopen(s, base).catch(() => {});
  const slot = pool.reduce((a, b) => (b.busy < a.busy ? b : a));
  slot.busy++;
  try {
    let current = !fresh && slot.session ? await slot.session.catch(() => null) : null;
    if (!current || current.expiresAt <= Date.now()) current = await reopen(slot, base);
    return { slot, session: current };
  } catch (err) {
    slot.busy--;
    throw err;
  }
}

type CartResult = {
  domainName?: string;
  isAvailable?: boolean;
  isRegistered?: boolean;
  isValidDomain?: boolean;
  isPremium?: boolean;
  pricing?: Record<string, { register?: string }>;
};

async function lookup(
  base: string,
  domain: string,
  type: "domain" | "spotlight",
  signal: AbortSignal,
): Promise<CartResult[] | null> {
  for (const fresh of [false, true]) {
    const { slot, session } = await acquire(base, fresh);
    try {
      const res = await fetch(`${base}/index.php?rp=/domain/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
          Cookie: session.cookie,
        },
        body: new URLSearchParams({ token: session.token, a: "checkDomain", domain, type }),
        cache: "no-store",
        signal,
      });
      // An expired session or token comes back as an empty body, not an error
      // status: retry once on a fresh session before giving up.
      const text = await res.text();
      try {
        const data = JSON.parse(text) as { result?: unknown };
        if (Array.isArray(data.result)) return data.result as CartResult[];
      } catch {}
    } finally {
      slot.busy--;
    }
  }
  return null;
}

/** "$14.95 USD" → 14.95 */
function parsePrice(value: string | undefined): number | null {
  const n = Number.parseFloat((value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function baseRow(domain: string): Omit<DomainResult, "status"> {
  const parsed = parseDomainInput(domain);
  const tld = parsed.ok && parsed.tld ? parsed.tld : "";
  return { domain, sld: parsed.ok ? parsed.sld : domain, tld, price: priceFor(tld), source: "whmcs" };
}

/** WHMCS's answer for exactly `domain` → our row. Null when WHMCS did not answer. */
function toRow(domain: string, results: CartResult[] | null): DomainResult | null {
  if (!results) return null;
  const row = baseRow(domain);
  // For a TLD the install does not sell, WHMCS silently answers for the same
  // name on its default TLD instead. Only an exact match is an answer.
  const hit = results.find((r) => r.domainName?.toLowerCase() === domain);
  if (!hit || hit.isValidDomain === false) {
    return { ...row, price: null, status: "unsupported" };
  }
  const price = parsePrice(hit.pricing?.["1"]?.register) ?? row.price;
  if (hit.isPremium) {
    return {
      ...row,
      price,
      status: "unknown",
      reason: "Premium name: the registry sets its price. Search it in the cart to see it.",
    };
  }
  if (hit.isAvailable === true) return { ...row, price, status: "available" };
  if (hit.isRegistered === true || hit.isAvailable === false) {
    return { ...row, price, status: "registered" };
  }
  return {
    ...row,
    status: "unknown",
    reason: "The billing system did not answer definitively.",
  };
}

async function settle(domain: string, row: DomainResult | null, signal: AbortSignal): Promise<DomainResult> {
  if (row) return row;
  // WHMCS did not answer: a registry answer beats a dead end, and RDAP rows
  // route Register through the WHMCS search, which checks again.
  const [fallback] = await rdapProvider.check([domain], signal);
  return fallback;
}

async function safeLookup(base: string, domain: string, type: "domain" | "spotlight", signal: AbortSignal) {
  try {
    return await lookup(base, domain, type, signal);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    return null;
  }
}

/* ── Batch endpoint (the fast path) ────────────────────────────────────────
 * billing/serverlys_domaincheck.php (source: ~/Desktop/whmcs/domain-batch-
 * 2026-11-01/) answers ONE name on MANY extensions in ONE call through the
 * same Domain Lookup Provider the cart uses — measured from production:
 * 14 extensions 1.3s, all 26 in 2.4s, vs 3–11s through per-name cart calls.
 * Auth: X-Serverlys-Key = HMAC-SHA256("serverlys-domaincheck-v1", API secret);
 * the cPanel side stores only that derived key. A 404 (file removed, key
 * mismatch — e.g. local dev with placeholder credentials) parks the batch path
 * for 10 minutes and everything goes through the cart path below. */
const BATCH_PARK_MS = 10 * 60_000;
let batchParkedUntil = 0;

type BatchRow = { domain?: string; status?: string; premium?: boolean };

async function batchLookup(
  base: string,
  secret: string,
  sld: string,
  domains: string[],
  signal: AbortSignal,
): Promise<Map<string, DomainResult> | null> {
  if (Date.now() < batchParkedUntil) return null;
  const tlds = domains.map((d) => baseRow(d).tld).filter(Boolean);
  if (!tlds.length || tlds.length > 30) return null;
  try {
    const res = await fetch(`${base}/serverlys_domaincheck.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Serverlys-Key": createHmac("sha256", secret).update("serverlys-domaincheck-v1").digest("hex"),
      },
      body: new URLSearchParams({ sld, tlds: tlds.join(",") }),
      cache: "no-store",
      signal,
    });
    if (res.status === 404) {
      batchParkedUntil = Date.now() + BATCH_PARK_MS;
      return null;
    }
    const data = (await res.json()) as { result?: string; results?: BatchRow[] };
    if (data.result !== "success" || !Array.isArray(data.results)) return null;
    const out = new Map<string, DomainResult>();
    for (const r of data.results) {
      const domain = (r.domain ?? "").toLowerCase();
      if (!domains.includes(domain)) continue;
      const row = baseRow(domain);
      if (r.premium) {
        out.set(domain, {
          ...row,
          status: "unknown",
          reason: "Premium name: the registry sets its price. Search it in the cart to see it.",
        });
      } else if (r.status === "available for registration") out.set(domain, { ...row, status: "available" });
      else if (r.status === "registered" || r.status === "reserved") out.set(domain, { ...row, status: "registered" });
      else if (r.status === "tld not supported") out.set(domain, { ...row, price: null, status: "unsupported" });
      // "unknown" is left out: the cart path below asks again for that name.
    }
    return out;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    return null;
  }
}

async function checkMany(domains: string[], signal: AbortSignal, base: string, secret: string): Promise<DomainResult[]> {
  // Fast path: one batch call per second-level name.
  const bySldAll = new Map<string, string[]>();
  for (const d of domains) {
    const sld = baseRow(d).sld;
    bySldAll.set(sld, [...(bySldAll.get(sld) ?? []), d]);
  }
  const answered = new Map<string, DomainResult>();
  await Promise.all(
    [...bySldAll].map(async ([sld, group]) => {
      if (sld.includes(".")) return;
      const got = await batchLookup(base, secret, sld, group, signal);
      if (got) for (const [d, r] of got) answered.set(d, r);
    }),
  );
  const rest = domains.filter((d) => !answered.has(d));
  if (rest.length === 0) return domains.map((d) => answered.get(d)!);
  const slow = await checkManyViaCart(rest, signal, base);
  const slowMap = new Map(rest.map((d, i) => [d, slow[i]]));
  return domains.map((d) => answered.get(d) ?? slowMap.get(d)!);
}

/** The per-name cart path: session pool + spotlight batch. Fallback only. */
async function checkManyViaCart(domains: string[], signal: AbortSignal, base: string): Promise<DomainResult[]> {
  // Group by second-level name: a spotlight call answers for one name.
  const bySld = new Map<string, string[]>();
  for (const d of domains) {
    const sld = baseRow(d).sld;
    bySld.set(sld, [...(bySld.get(sld) ?? []), d]);
  }

  const answers = new Map<string, Promise<DomainResult>>();
  for (const [sld, group] of bySld) {
    const inSpotlight = spotlightTlds ? group.filter((d) => spotlightTlds!.has(baseRow(d).tld)) : group;
    const batch = group.length >= 2 && !sld.includes(".") ? inSpotlight : [];
    const spotlight =
      batch.length >= 2
        ? safeLookup(base, `${sld}.com`, "spotlight", signal).then((rows) => {
            if (rows) spotlightTlds = new Set(rows.map((r) => baseRow((r.domainName ?? "").toLowerCase()).tld).filter(Boolean));
            return rows;
          })
        : null;
    // Until the spotlight set is known, everything is also asked singly; once
    // known, only the names the batch cannot answer are.
    const batched = new Set(spotlightTlds ? batch : []);
    for (const d of group) {
      if (batched.has(d) && spotlight) {
        answers.set(
          d,
          spotlight.then((rows) =>
            rows?.some((r) => r.domainName?.toLowerCase() === d)
              ? settle(d, toRow(d, rows), signal)
              : safeLookup(base, d, "domain", signal).then((r) => settle(d, toRow(d, r), signal)),
          ),
        );
      } else {
        answers.set(d, safeLookup(base, d, "domain", signal).then((r) => settle(d, toRow(d, r), signal)));
      }
    }
  }
  return Promise.all(domains.map((d) => answers.get(d)!));
}

export function createWhmcsProvider(): DomainProvider | null {
  const config = whmcsConfig();
  if (!config) return null;
  const base = cartBase(config.url);
  return {
    name: "whmcs",
    async check(domains, signal) {
      return checkMany(domains, signal, base, config.secret);
    },
  };
}
