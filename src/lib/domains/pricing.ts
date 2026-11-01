import "server-only";
import { unstable_cache } from "next/cache";
import { allTlds as STATIC_TLDS, type Tld } from "@/data/tlds";
import { whmcsConfig } from "@/lib/env";

/**
 * Live TLD pricing from WHMCS — so a price changed in the WHMCS admin
 * (Setup → Products/Services → Domain Pricing) reaches the site without a
 * code change or a redeploy.
 *
 * SOURCE. The WHMCS API action `GetTLDPricing` (USD, currency id 1), called
 * with the same server-only credentials as the rest of lib/domains. Verified
 * from the production container 2026-11-01: 26 TLDs, register/renew/transfer.
 *
 * FRESHNESS. Cached for PRICING_REVALIDATE seconds, and every page that shows
 * a price sets the same `revalidate`, so the worst case after a WHMCS change
 * is about an hour. Checkout is never affected either way: the cart always
 * charges the WHMCS price, and availability results carry the price WHMCS
 * returned for that exact lookup.
 *
 * FALLBACK. `data/tlds.ts` is the fallback and the metadata source. When WHMCS
 * is unconfigured (local dev, the Docker build stage) or unreachable, the
 * static list is served — and a failed fetch THROWS inside the cache, so a
 * failure is never cached for an hour.
 *
 * MERGE RULES.
 *   - A TLD in both: WHMCS prices win; the note, `suggest` flag and order come
 *     from data/tlds.ts.
 *   - In WHMCS only (newly added for sale): appended, sorted by price, with no
 *     note and suggest=false — it appears in the full price table.
 *   - In data/tlds.ts only (removed from sale in WHMCS): dropped. A price for
 *     something the cart will not sell is worse than no price.
 */

/** Seconds. Pages that render prices export this same number as `revalidate`. */
export const PRICING_REVALIDATE = 3600;

export type TldPricing = {
  /** Every TLD on sale, featured first. */
  all: readonly Tld[];
  /** The featured eight: rails, cards, hero chips, search dropdown. */
  featured: readonly Tld[];
  cheapest: Tld;
  source: "whmcs" | "static";
};

const FEATURED_COUNT = 8;
const FETCH_TIMEOUT_MS = 5_000;

type WhmcsTld = {
  register?: Record<string, string>;
  renew?: Record<string, string>;
  categories?: string[];
};

function money(value: string | undefined): number | null {
  const n = Number.parseFloat(value ?? "");
  // WHMCS uses -1 (and sometimes 0) for "not offered for this term".
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Exported for tests: pure merge of a GetTLDPricing payload onto the static list. */
export function mergePricing(pricing: Record<string, WhmcsTld>): Tld[] {
  const live = new Map<string, { price: number; renew: number; categories?: readonly string[] }>();
  for (const [key, entry] of Object.entries(pricing)) {
    const price = money(entry.register?.["1"]);
    if (price === null) continue; // not sold for a 1-year term
    const renew = money(entry.renew?.["1"]) ?? price;
    const categories = Array.isArray(entry.categories) && entry.categories.length ? entry.categories : undefined;
    live.set(`.${key.replace(/^\./, "").toLowerCase()}`, { price, renew, ...(categories && { categories }) });
  }

  const known = STATIC_TLDS.filter((t) => live.has(t.tld)).map((t) => ({ ...t, ...live.get(t.tld)! }));
  const knownSet = new Set(known.map((t) => t.tld));
  const added = [...live.entries()]
    .filter(([tld]) => !knownSet.has(tld))
    .map(([tld, p]) => ({ tld, ...p, suggest: false }))
    .sort((a, b) => a.price - b.price);

  return [...known, ...added];
}

/** `apiUrl` is an argument so it is part of the cache key: pointing the site at a
 *  different WHMCS must never serve the previous install's prices. */
async function fetchWhmcsPricing(apiUrl: string): Promise<Tld[]> {
  const config = whmcsConfig();
  if (!config) throw new Error("WHMCS is not configured");
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      action: "GetTLDPricing",
      identifier: config.identifier,
      secret: config.secret,
      currencyid: "1",
      responsetype: "json",
    }),
    // unstable_cache below owns caching; this request itself must not be.
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const data = (await res.json()) as { result?: string; pricing?: Record<string, WhmcsTld> };
  if (data.result !== "success" || !data.pricing) throw new Error("GetTLDPricing failed");
  const merged = mergePricing(data.pricing);
  // An empty or near-empty answer is a broken install, not a price change.
  if (merged.length < 3) throw new Error("GetTLDPricing returned too few TLDs");
  return merged;
}

const cachedWhmcsPricing = unstable_cache(fetchWhmcsPricing, ["tld-pricing-v1"], {
  revalidate: PRICING_REVALIDATE,
  tags: ["tld-pricing"],
});

function shape(all: readonly Tld[], source: TldPricing["source"]): TldPricing {
  return {
    all,
    featured: all.slice(0, FEATURED_COUNT),
    cheapest: all.reduce((a, b) => (a.price <= b.price ? a : b)),
    source,
  };
}

export async function getTldPricing(): Promise<TldPricing> {
  const config = whmcsConfig();
  if (!config) return shape(STATIC_TLDS, "static");
  try {
    return shape(await cachedWhmcsPricing(config.url), "whmcs");
  } catch {
    return shape(STATIC_TLDS, "static");
  }
}
