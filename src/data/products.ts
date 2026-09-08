import { planGroups } from "./pricing";

/**
 * Hosting products for the homepage grid.
 *
 * Content is taken from the live site's own product descriptions. Prices are
 * derived from `pricing.ts` rather than repeated here, so a price change moves
 * both places at once.
 *
 * `status: "soon"` products are real — the live site marks Shared, VPS and
 * Dedicated as Coming Soon. They stay listed because they carry demand signal,
 * but they must never render a purchase CTA.
 */
export type Product = {
  name: string;
  href: string;
  summary: string;
  /** Short, concrete capabilities — not marketing adjectives. */
  points: readonly string[];
  /** Pricing group id, when the product is buyable today. */
  group?: string;
  status: "live" | "soon";
};

export const products: readonly Product[] = [
  {
    name: "Cloud hosting",
    href: "/cloud-hosting",
    summary: "Auto-scaling infrastructure for sites with variable or growing traffic.",
    points: ["Scales with traffic", "NVMe storage", "Free domain & SSL"],
    group: "cloud",
    status: "live",
  },
  {
    name: "WordPress hosting",
    href: "/wordpress-hosting",
    summary: "Tuned for WordPress, with LiteSpeed caching and automatic core updates.",
    points: ["LiteSpeed cache", "Automatic updates", "Free migration"],
    group: "wordpress",
    status: "live",
  },
  {
    name: "Ecommerce hosting",
    href: "/store-hosting",
    summary: "WooCommerce-ready stores, built for checkout speed under load.",
    points: ["WooCommerce ready", "Store caching", "Daily backups"],
    group: "ecommerce",
    status: "live",
  },
  {
    name: "Managed hosting",
    href: "/managed-hosting",
    summary: "Any tier, with our team handling security, updates and monitoring.",
    points: ["We patch and update", "Proactive monitoring", "Human support"],
    status: "live",
  },
];

/** Not yet purchasable. Listed for intent, never with a buy CTA. */
export const upcomingProducts = [
  {
    name: "Shared hosting",
    href: "/shared-hosting",
    summary: "Brochure sites and blogs, at the lowest entry price.",
  },
  {
    name: "VPS hosting",
    href: "/vps-hosting",
    summary: "Root access and dedicated resources.",
  },
  {
    name: "Dedicated servers",
    href: "/dedicated-servers",
    summary: "Single-tenant hardware for sustained load.",
  },
] as const;

/** Lowest annual rate for a product's pricing group, or null if not buyable. */
export function startingPrice(product: Product): number | null {
  if (!product.group) return null;
  const group = planGroups.find((g) => g.id === product.group);
  if (!group) return null;
  return Math.min(...group.plans.map((p) => p.annual));
}
