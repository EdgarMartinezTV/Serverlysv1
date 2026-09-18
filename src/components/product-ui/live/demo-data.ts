/**
 * Demonstration data for the interactive product surfaces.
 *
 * These components are REAL React UI with real state, real controls and real
 * keyboard behaviour — they are not screenshots. What they are not is a live
 * view of a visitor's account: a marketing page has no session, so there is
 * nothing to read. Everything below is therefore a scripted dataset, and every
 * surface that renders it carries a visible "Live demo" marker so a reader is
 * never invited to mistake it for their own numbers.
 *
 * Rule for anything added here: it must be plausible for a Serverlys customer
 * and consistent with what the site sells elsewhere (plan names come from
 * pricing.ts, TLD prices from tlds.ts). Never invent a capability the product
 * does not have just because it renders well.
 */

export type SiteStatus = "online" | "building" | "attention";

export type DemoSite = {
  id: string;
  domain: string;
  plan: string;
  status: SiteStatus;
  /** Platform badge shown in the list. */
  stack: "WordPress" | "WooCommerce" | "Static";
  /** Monthly visit series, oldest → newest. 12 points. */
  visits: readonly number[];
  storageUsedGb: number;
  storageTotalGb: number;
  /** Median server response, ms. */
  responseMs: number;
  uptimePct: number;
  ssl: { issuer: string; renewsInDays: number };
  backup: { lastAt: string; sizeMb: number };
  phpVersion: string;
  /** Blocked malicious requests in the last 24h. */
  threatsBlocked: number;
};

export const demoSites: readonly DemoSite[] = [
  {
    id: "northlight",
    domain: "northlight.studio",
    plan: "Turbo Cloud",
    status: "online",
    stack: "WordPress",
    visits: [3100, 3400, 3250, 3900, 4300, 4150, 4800, 5200, 5050, 5600, 6100, 6400],
    storageUsedGb: 14.2,
    storageTotalGb: 60,
    responseMs: 118,
    uptimePct: 99.99,
    ssl: { issuer: "Let's Encrypt", renewsInDays: 46 },
    backup: { lastAt: "02:14", sizeMb: 812 },
    phpVersion: "8.3",
    threatsBlocked: 1284,
  },
  {
    id: "harborgoods",
    domain: "harborgoods.com",
    plan: "Business Ecommerce",
    status: "online",
    stack: "WooCommerce",
    visits: [
      7400, 7900, 8600, 8200, 9100, 9800, 9400, 10600, 11200, 10900, 12400, 13100,
    ],
    storageUsedGb: 38.9,
    storageTotalGb: 90,
    responseMs: 143,
    uptimePct: 99.98,
    ssl: { issuer: "Let's Encrypt", renewsInDays: 12 },
    backup: { lastAt: "02:20", sizeMb: 2140 },
    phpVersion: "8.3",
    threatsBlocked: 3902,
  },
  {
    id: "cedarclinic",
    domain: "cedarclinic.org",
    plan: "Plus Cloud",
    status: "attention",
    stack: "WordPress",
    visits: [1800, 1750, 1900, 2100, 2050, 2300, 2250, 2400, 2600, 2550, 2700, 2900],
    storageUsedGb: 6.4,
    storageTotalGb: 30,
    responseMs: 206,
    uptimePct: 99.94,
    ssl: { issuer: "Let's Encrypt", renewsInDays: 3 },
    backup: { lastAt: "02:06", sizeMb: 344 },
    phpVersion: "8.1",
    threatsBlocked: 517,
  },
];

/** Formats a visit count the way the console does: 6.4k, 13.1k, 940. */
export function compactCount(value: number): string {
  if (value < 1000) return String(Math.round(value));
  return `${(value / 1000).toFixed(1)}k`;
}

/** Percentage change between the last two points of a series. */
export function trend(series: readonly number[]): number {
  if (series.length < 2) return 0;
  const prev = series[series.length - 2];
  const last = series[series.length - 1];
  if (!prev) return 0;
  return ((last - prev) / prev) * 100;
}
