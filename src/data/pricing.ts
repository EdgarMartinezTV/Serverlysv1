import { billing } from "./company";

/**
 * Hosting plans — verified against the live pricing page and the live WHMCS
 * store links (~/Desktop/Archive/pricing, /cloud-hosting, /wordpress-hosting,
 * /store-hosting).
 *
 * Two prices are real and distinct and BOTH must be shown:
 *   monthly  — the promotional rate on a month-to-month term
 *   annual   — the promotional rate when paying for a year up front
 *   renewal  — what it costs from term two onward
 *
 * Showing the renewal rate next to the promo rate is an explicit Serverlys
 * commercial position ("we show the renewal rate rather than hiding it in the
 * terms"). Never render a promo price without its renewal price.
 *
 * ⚠ UNRESOLVED SOURCE CONFLICT (found 2026-09-08). The legacy /pricing and
 * /cloud-hosting pages state DIFFERENT figures for the same plans. Annual promo
 * rates agree; monthly, renewal and RAM do not:
 *
 *   tier      annual   monthly(/pricing → /cloud)  renewal(/pricing → /cloud)  RAM
 *   Starter   $2.19    $2.91  →  $7.95             $11.64 →  $12.62            3 → 2 GB
 *   Plus      $3.79    $5.05  →  $11.95            $16.84 →  $15.93            4 → 4 GB
 *   Turbo     $5.84    $7.78  →  $17.95            $25.94 →  $21.37            5 → 6 GB
 *   Business  $8.76    $11.68 →  $23.95            $38.94 →  $27.22            6 → 8 GB
 *
 * The figures below follow /pricing. WHMCS is the only authority — reconcile
 * against the live store before launch. The renewal rate is a published
 * commercial commitment, so publishing the wrong one is not a cosmetic error.
 *
 * The WHMCS slugs are legacy and do NOT match the display names — the mapping
 * below was verified from the live pages, not inferred. Changing a `slug`
 * breaks checkout for that plan.
 */

export type PlanTier = "starter" | "plus" | "turbo" | "business";

export type Plan = {
  tier: PlanTier;
  name: string;
  summary: string;
  monthly: number;
  annual: number;
  renewal: number;
  /** WHMCS plan slug within the group. */
  slug: string;
  popular?: boolean;
  specs: {
    sites: string;
    visits: string;
    memory: string;
    storage: string;
    transfer: string;
  };
  includes: readonly string[];
};

export type PlanGroup = {
  id: string;
  label: string;
  /** WHMCS product group slug. */
  group: string;
  blurb: string;
  plans: readonly Plan[];
};

/** Promo/renewal figures are identical across groups on the live site. */
const RATES = {
  starter: { monthly: 2.91, annual: 2.19, renewal: 11.64 },
  plus: { monthly: 5.05, annual: 3.79, renewal: 16.84 },
  turbo: { monthly: 7.78, annual: 5.84, renewal: 25.94 },
  business: { monthly: 11.68, annual: 8.76, renewal: 38.94 },
} as const;

const SITES = {
  starter: "1 website",
  plus: "7 websites",
  turbo: "Unlimited websites",
  business: "Unlimited websites",
} as const;

const VISITS = {
  starter: "~10,000 monthly visits",
  plus: "~25,000 monthly visits",
  turbo: "~50,000 monthly visits",
  business: "~100,000 monthly visits",
} as const;

const MEMORY = {
  starter: "3 GB",
  plus: "4 GB",
  turbo: "5 GB",
  business: "6 GB",
} as const;

const TIERS: readonly PlanTier[] = ["starter", "plus", "turbo", "business"];

const SUMMARIES: Record<string, Record<PlanTier, string>> = {
  cloud: {
    starter: "Perfect for a single cloud site",
    plus: "Ideal for growing websites",
    turbo: "Best value for high-traffic sites",
    business: "Maximum power for demanding sites",
  },
  wordpress: {
    starter: "Perfect for a single WordPress site",
    plus: "Ideal for growing websites",
    turbo: "Best value for high-traffic sites",
    business: "Maximum power for demanding sites",
  },
  ecommerce: {
    starter: "Perfect for your first online store",
    plus: "Ideal for growing stores",
    turbo: "Best value for high-traffic stores",
    business: "Maximum power for demanding stores",
  },
};

/** Legacy WHMCS slugs, verified from the live store links. */
const SLUGS: Record<string, Record<PlanTier, string>> = {
  cloud: {
    starter: "starter-cloud",
    plus: "plus-cloud",
    turbo: "turbo-cloud",
    business: "business-cloud",
  },
  wordpress: {
    starter: "your-wordpress-journey-begins-here",
    plus: "wordpress-grow",
    turbo: "wordpress-pro",
    business: "wordpress-powerhouse",
  },
  ecommerce: {
    starter: "woocommerce-starter",
    plus: "woocommerce-growth",
    turbo: "woocommerce-pro",
    business: "woocommerce-enterprise",
  },
};

/** Ecommerce uses store-facing wording for the same underlying resources. */
const COPY = {
  cloud: {
    storage: "Unlimited NVMe",
    transfer: "Unlimited",
    includes: ["Free domain & SSL", "Free daily backups", "Free migration"],
  },
  wordpress: {
    storage: "Unlimited NVMe",
    transfer: "Unlimited",
    includes: ["Free domain & SSL", "Free daily backups", "Free migration"],
  },
  ecommerce: {
    storage: "Unlimited",
    transfer: "Unlimited",
    includes: ["Free domain & security", "Free daily backups", "Free migration"],
  },
} as const;

function buildPlans(id: keyof typeof COPY, displayName: string): readonly Plan[] {
  return TIERS.map((tier) => ({
    tier,
    name: `${tier[0].toUpperCase()}${tier.slice(1)} ${displayName}`,
    summary: SUMMARIES[id][tier],
    ...RATES[tier],
    slug: SLUGS[id][tier],
    popular: tier === "turbo",
    specs: {
      sites: SITES[tier],
      visits: VISITS[tier],
      memory: MEMORY[tier],
      storage: COPY[id].storage,
      transfer: COPY[id].transfer,
    },
    includes: COPY[id].includes,
  }));
}

export const planGroups: readonly PlanGroup[] = [
  {
    id: "cloud",
    label: "Cloud hosting",
    group: "cloud-hosting",
    blurb: "Auto-scaling infrastructure for sites with variable or growing traffic.",
    plans: buildPlans("cloud", "Cloud"),
  },
  {
    id: "wordpress",
    label: "WordPress hosting",
    group: "wordpress-hosting",
    blurb: "Tuned for WordPress, with LiteSpeed caching and automatic core updates.",
    plans: buildPlans("wordpress", "WordPress"),
  },
  {
    id: "ecommerce",
    label: "Ecommerce hosting",
    group: "woocommerce-hosting",
    blurb: "WooCommerce-ready stores, built for checkout speed under load.",
    plans: buildPlans("ecommerce", "Ecommerce"),
  },
];

export function groupById(id: string): PlanGroup | undefined {
  return planGroups.find((g) => g.id === id);
}

/** Checkout URL for a plan. Always route through this — never hand-build one. */
export function orderUrl(group: PlanGroup, plan: Plan): string {
  return billing.order(group.group, plan.slug);
}

/** Lowest advertised rate across all groups, for "starting at" copy. */
export const lowestAnnualRate = Math.min(
  ...planGroups.flatMap((g) => g.plans.map((p) => p.annual)),
);

/**
 * Spec values are deliberately terse because each is rendered against its own
 * <dt> label ("Storage: Unlimited NVMe"). Repeating the noun forces a wrap in
 * the plan cards, which breaks row alignment across the grid.
 */
export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
