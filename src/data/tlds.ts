/**
 * TLDs Serverlys sells, with real first-year registration prices taken from the
 * live /register-domain and /transfer-domain pages (both agree).
 *
 * These are STANDARD registration prices. They are not a quote:
 *  · premium/aftermarket names are priced by the registry and are labelled as
 *    premium by WHMCS at checkout;
 *  · renewal is charged at the published renewal rate, not the promo rate.
 * The UI must never present a price here as a guaranteed checkout total.
 */
export type Tld = {
  /** Including the leading dot. */
  tld: string;
  /** First-year registration price, USD. */
  price: number;
  /** Yearly renewal price, USD. */
  renew: number;
  /**
   * One-year transfer-in price, USD (includes the year a transfer adds). Live
   * WHMCS value only: the static snapshot has none, so callers must handle
   * it being absent.
   */
  transfer?: number;
  /** Shown as a hint under the TLD chip. */
  note?: string;
  /** Included in the default alternate-suggestion set. */
  suggest: boolean;
  /**
   * WHMCS TLD categories (Setup → Domain Pricing → category). They drive the
   * category tabs on /domain-name-results. Live values come from
   * GetTLDPricing via lib/domains/pricing; these are the 2026-11-01 snapshot.
   */
  categories?: readonly string[];
};

/**
 * Every TLD configured in WHMCS (tbldomainpricing), with its USD register and
 * renew prices — read from the live install on 2026-11-01. WHMCS is the
 * authority; if a price changes there, change it here. The first eight are the
 * featured set (`tlds`) shown in rails and cards; the rest appear in the full
 * price table and are recognised by the search parser.
 */
export const allTlds: readonly Tld[] = [
  { tld: ".com", price: 17.95, renew: 20.95, note: "Most recognised", suggest: true, categories: ["Popular"] },
  { tld: ".net", price: 18.95, renew: 23.95, note: "Technical, infrastructure", suggest: true, categories: ["Popular"] },
  { tld: ".org", price: 19.95, renew: 24.95, note: "Non-profit, community", suggest: true, categories: ["Popular"] },
  { tld: ".name", price: 12.95, renew: 15.95, note: "Personal", suggest: true, categories: ["Other"] },
  { tld: ".eu", price: 11.95, renew: 15.95, note: "European presence", suggest: true, categories: ["Popular"] },
  { tld: ".info", price: 37.95, renew: 46.95, note: "Informational", suggest: false, categories: ["Popular"] },
  { tld: ".website", price: 37.95, renew: 37.95, suggest: false, categories: ["Technology"] },
  { tld: ".design", price: 82.95, renew: 98.95, note: "Studios and agencies", suggest: false, categories: ["Services"] },
  { tld: ".us", price: 11.95, renew: 14.95, note: "United States presence", suggest: false, categories: ["Popular"] },
  { tld: ".xyz", price: 23.95, renew: 28.95, suggest: false, categories: ["Popular", "Novelty"] },
  { tld: ".biz", price: 30.95, renew: 37.95, note: "Business", suggest: false, categories: ["Popular"] },
  { tld: ".rocks", price: 28.95, renew: 30.95, suggest: false, categories: ["Novelty"] },
  { tld: ".club", price: 28.95, renew: 34.95, note: "Clubs and communities", suggest: false, categories: ["Popular"] },
  { tld: ".cloud", price: 36.95, renew: 54.95, note: "Cloud and SaaS", suggest: false, categories: ["Technology"] },
  { tld: ".pro", price: 44.95, renew: 54.95, note: "Professionals", suggest: false, categories: ["Other"] },
  { tld: ".blog", price: 32.95, renew: 39.95, note: "Blogs", suggest: false, categories: ["Popular", "Technology"] },
  { tld: ".live", price: 44.95, renew: 52.95, note: "Streaming and events", suggest: false, categories: ["Other"] },
  { tld: ".me", price: 26.95, renew: 28.95, note: "Personal brands", suggest: false, categories: ["Popular"] },
  { tld: ".shop", price: 49.95, renew: 59.95, note: "Online stores", suggest: false, categories: ["Shopping"] },
  { tld: ".social", price: 48.95, renew: 53.95, note: "Social and community", suggest: false, categories: ["Leisure and Recreation"] },
  { tld: ".online", price: 50.95, renew: 50.95, suggest: false, categories: ["Popular", "Technology"] },
  { tld: ".tv", price: 42.95, renew: 50.95, note: "Video and media", suggest: false, categories: ["Other"] },
  { tld: ".site", price: 53.95, renew: 53.95, suggest: false, categories: ["Popular", "Technology"] },
  { tld: ".io", price: 80.95, renew: 95.95, note: "Tech startups", suggest: false, categories: ["Popular"] },
  { tld: ".store", price: 75.95, renew: 75.95, note: "Online stores", suggest: false, categories: ["Shopping"] },
  { tld: ".host", price: 170.95, renew: 202.95, note: "Hosting providers", suggest: false, categories: ["Technology"] },
];

/** The featured eight: rails, cards and hero chips. */
export const tlds: readonly Tld[] = allTlds.slice(0, 8);

export const tldSet = new Set(allTlds.map((t) => t.tld));

export function priceFor(tld: string): number | null {
  return allTlds.find((t) => t.tld === tld)?.price ?? null;
}

/** TLDs offered as alternates when the searched name is taken. */
export function suggestionTlds(exclude: string): readonly Tld[] {
  return allTlds.filter((t) => t.suggest && t.tld !== exclude);
}

export const cheapestTld = allTlds.reduce((a, b) => (a.price <= b.price ? a : b));

/**
 * Category tabs for a TLD list, in display order: "Popular" first, the rest
 * alphabetically with "Other" last. "All" is added by the UI.
 */
export function tldCategories(list: readonly Tld[]): string[] {
  const set = new Set(list.flatMap((t) => t.categories ?? []));
  return [...set].sort((a, b) => {
    const rank = (c: string) => (c === "Popular" ? 0 : c === "Other" ? 2 : 1);
    return rank(a) - rank(b) || a.localeCompare(b);
  });
}

/** TLDs in a category ("All" → every TLD), in list order. */
export function tldsInCategory(list: readonly Tld[], category: string): Tld[] {
  return category === "All" ? [...list] : list.filter((t) => t.categories?.includes(category));
}

/**
 * Extensions where a hosting plan bought on annual (or longer) billing makes
 * the domain free for the first year — WHMCS tblproducts.freedomaintlds on
 * every cloud, WordPress and WooCommerce plan, verified with a real cart on
 * 2026-11-01 (Turbo Cloud annual + .com: domain line $0.00).
 */
export const FREE_WITH_HOSTING: readonly string[] = [".com", ".net", ".org", ".biz", ".info"];
