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
  /** Shown as a hint under the TLD chip. */
  note?: string;
  /** Included in the default alternate-suggestion set. */
  suggest: boolean;
};

export const tlds: readonly Tld[] = [
  { tld: ".com", price: 14.95, note: "Most recognised", suggest: true },
  { tld: ".net", price: 16.95, note: "Technical, infrastructure", suggest: true },
  { tld: ".org", price: 16.95, note: "Non-profit, community", suggest: true },
  { tld: ".name", price: 11.95, note: "Personal", suggest: true },
  { tld: ".eu", price: 9.95, note: "European presence", suggest: true },
  { tld: ".info", price: 27.95, note: "Informational", suggest: false },
  { tld: ".website", price: 39.95, suggest: false },
  { tld: ".design", price: 61.95, note: "Studios and agencies", suggest: false },
];

export const tldSet = new Set(tlds.map((t) => t.tld));

export function priceFor(tld: string): number | null {
  return tlds.find((t) => t.tld === tld)?.price ?? null;
}

/** TLDs offered as alternates when the searched name is taken. */
export function suggestionTlds(exclude: string): readonly Tld[] {
  return tlds.filter((t) => t.suggest && t.tld !== exclude);
}

export const cheapestTld = tlds.reduce((a, b) => (a.price <= b.price ? a : b));
