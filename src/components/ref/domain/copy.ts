/**
 * Copy for the two domain bands that are pure data — the popular-TLD grid and
 * the price table. Both render `data/tlds.ts` and read identically on every
 * domain page, so the strings live here rather than being repeated in four
 * page content files.
 */
export const POPULAR = {
  title: "Choose from the most popular domains",
  cta: { label: "Compare all TLD prices", href: "#tld-prices" },
  check: "Check availability",
};

export const TABLE = {
  title: "Compare domain extension prices",
  columns: {
    tld: "Domain extension",
    first: "First year",
    renew: "Renews at",
    note: "Best for",
  },
  /**
   * data/tlds.ts holds first-year prices only. Renewal is deliberately NOT
   * invented — the site's standing rule is that a term price never renders
   * without the rate it renews at, so this column says where the real number
   * comes from instead of guessing one.
   */
  renewNote: "Shown at checkout",
};
