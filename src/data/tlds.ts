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
  /** Shown as a hint under the TLD chip. */
  note?: string;
  /** Included in the default alternate-suggestion set. */
  suggest: boolean;
};

/**
 * Every TLD configured in WHMCS (tbldomainpricing), with its USD register and
 * renew prices — read from the live install on 2026-11-01. WHMCS is the
 * authority; if a price changes there, change it here. The first eight are the
 * featured set (`tlds`) shown in rails and cards; the rest appear in the full
 * price table and are recognised by the search parser.
 */
export const allTlds: readonly Tld[] = [
  { tld: ".com", price: 14.95, renew: 14.95, note: "Most recognised", suggest: true },
  { tld: ".net", price: 16.95, renew: 16.95, note: "Technical, infrastructure", suggest: true },
  { tld: ".org", price: 16.95, renew: 16.95, note: "Non-profit, community", suggest: true },
  { tld: ".name", price: 11.95, renew: 11.95, note: "Personal", suggest: true },
  { tld: ".eu", price: 9.95, renew: 9.95, note: "European presence", suggest: true },
  { tld: ".info", price: 27.95, renew: 27.95, note: "Informational", suggest: false },
  { tld: ".website", price: 39.95, renew: 39.95, suggest: false },
  { tld: ".design", price: 61.95, renew: 61.95, note: "Studios and agencies", suggest: false },
  { tld: ".us", price: 11.95, renew: 11.95, note: "United States presence", suggest: false },
  { tld: ".xyz", price: 16.95, renew: 16.95, suggest: false },
  { tld: ".biz", price: 21.95, renew: 21.95, note: "Business", suggest: false },
  { tld: ".rocks", price: 21.95, renew: 21.95, suggest: false },
  { tld: ".club", price: 22.95, renew: 22.95, note: "Clubs and communities", suggest: false },
  { tld: ".cloud", price: 26.95, renew: 26.95, note: "Cloud and SaaS", suggest: false },
  { tld: ".pro", price: 31.95, renew: 31.95, note: "Professionals", suggest: false },
  { tld: ".blog", price: 34.95, renew: 34.95, note: "Blogs", suggest: false },
  { tld: ".live", price: 35.95, renew: 35.95, note: "Streaming and events", suggest: false },
  { tld: ".me", price: 38.95, renew: 38.95, note: "Personal brands", suggest: false },
  { tld: ".shop", price: 41.95, renew: 41.95, note: "Online stores", suggest: false },
  { tld: ".social", price: 41.95, renew: 41.95, note: "Social and community", suggest: false },
  { tld: ".online", price: 44.95, renew: 44.95, suggest: false },
  { tld: ".tv", price: 44.95, renew: 44.95, note: "Video and media", suggest: false },
  { tld: ".site", price: 46.95, renew: 46.95, suggest: false },
  { tld: ".io", price: 69.95, renew: 69.95, note: "Tech startups", suggest: false },
  { tld: ".store", price: 69.95, renew: 69.95, note: "Online stores", suggest: false },
  { tld: ".host", price: 116.95, renew: 116.95, note: "Hosting providers", suggest: false },
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
