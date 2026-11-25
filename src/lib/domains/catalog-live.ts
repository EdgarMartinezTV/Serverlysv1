import "server-only";
import { tldBySlug, tldCatalog, type TldEntry } from "@/data/tld-catalog";
import { getTldPricing } from "@/lib/domains/pricing";

/**
 * The /tld catalog (copy, rules, FAQs) with LIVE WHMCS prices laid over it.
 *
 * data/tld-catalog keeps a price snapshot only as the fallback for when WHMCS
 * cannot be reached; every page that shows a catalog price reads it through
 * here, so a price changed in WHMCS shows on /tld/<ext> within a minute
 * (lib/domains/pricing caches the WHMCS call for 60s).
 */
export async function liveCatalog(): Promise<TldEntry[]> {
  const { all } = await getTldPricing();
  const live = new Map(all.map((t) => [t.tld, t]));
  return tldCatalog.map((e) => {
    const p = live.get(`.${e.slug}`);
    return p ? { ...e, register: p.price, renew: p.renew, transfer: p.transfer ?? p.renew } : e;
  });
}

export async function liveTldBySlug(slug: string): Promise<TldEntry | undefined> {
  if (!tldBySlug(slug)) return undefined;
  return (await liveCatalog()).find((e) => e.slug === slug);
}
