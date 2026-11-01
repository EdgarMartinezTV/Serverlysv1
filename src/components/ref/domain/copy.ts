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
   * Used only by the legacy components/ref/domain/tld-table.tsx. The live
   * table (app/domain-name/_components/domain-ui.tsx) shows each TLD's real
   * renewal price from data/tlds.ts, read from WHMCS on 2026-11-01.
   */
  renewNote: "Shown at checkout",
};
