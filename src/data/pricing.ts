import { billing } from "./company";

/**
 * Hosting plans — figures taken from the live WHMCS store (screenshot supplied
 * by Edgar, 2026-09-11; re-verified against the live store 2026-09-16), which
 * is the only authority on price.
 *
 * ✅ RESOLVED: the conflict this file carried since 2026-09-08 is settled. The
 * legacy /pricing page and the /cloud-hosting page disagreed; the store agrees
 * with /cloud-hosting, so /pricing was stale and its figures are gone.
 *
 * ⚠ TERM REMOVED 2026-09-16, on Edgar's instruction. These figures are a
 * MONTHLY rate and are presented as such. The store card still carries the
 * legacy "With a 3yrs term (37% savings)" strapline, and the site deliberately
 * no longer repeats it — nothing on this site may describe these prices as a
 * three-year, annual or any other committed term. The prices themselves did
 * not change, so every figure below still matches the store to the cent.
 *
 * `monthly` is the advertised monthly rate. `standard` is the rate it
 * discounts — what the plan renews at. `standard` is not printed on the store
 * card; it is derived as monthly / (1 - savings), and all four derive to the
 * exact figures the /cloud-hosting page published independently:
 *
 *     Starter   7.95 / 0.63 = 12.62   ✓        Plus     11.95 / 0.75 = 15.93   ✓
 *     Turbo    17.95 / 0.84 = 21.37   ✓        Business 23.95 / 0.88 = 27.22   ✓
 *
 * Two independent sources agreeing to the cent is why these are safe to print.
 *
 * ⚠ BOTH NUMBERS, ALWAYS. Showing the promotional rate without the standard
 * rate is the exact practice Serverlys sells against, and it is also the only
 * thing that still anchors the saving now that the term is gone. Never render
 * `monthly` alone.
 *
 * ⚠ Starter carries a $2.95 setup fee and the other three do not. It is a real
 * charge at checkout, so a card that omits it understates the first invoice.
 *
 * ⚠ Only the CLOUD group was re-verified against the store screenshot. The
 * earlier finding that all three groups share one price list is carried
 * forward; re-shoot the WordPress and WooCommerce stores before launch.
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
  /** Advertised monthly rate. No term is attached to it — see the header. */
  monthly: number;
  /** Undiscounted monthly rate the saving is measured against; the renewal rate. */
  standard: number;
  /** Saving against the standard rate, as a fraction (0.37 = 37%). */
  savings: number;
  /** One-off charge at checkout. Starter only. */
  setupFee?: number;
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

/** Read straight off the live store. `standard` is derived — see the note above. */
const RATES = {
  starter: { monthly: 7.95, standard: 12.62, savings: 0.37, setupFee: 2.95 },
  plus: { monthly: 11.95, standard: 15.93, savings: 0.25 },
  turbo: { monthly: 17.95, standard: 21.37, savings: 0.16 },
  business: { monthly: 23.95, standard: 27.22, savings: 0.12 },
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

/** Per the store card. The old 3/4/5/6 came from the stale /pricing page. */
const MEMORY = {
  starter: "2 GB",
  plus: "4 GB",
  turbo: "6 GB",
  business: "8 GB",
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

/**
 * Display names, verified against the live store (screenshots supplied by
 * Edgar, 2026-09-11). NOT derived from the tier key — the WooCommerce store
 * names its tiers Starter/Growth/Pro/Enterprise, so a
 * `${tier} ${groupName}` template produced "Plus Ecommerce" for a plan the
 * store calls "WooCommerce Growth". The SLUGS below encode those same words,
 * which is independent confirmation of the mapping.
 *
 * ⚠ Only cloud and ecommerce are store-verified. WordPress still follows the
 * old template and needs its store re-shot before launch.
 */
const NAMES: Record<string, Record<PlanTier, string>> = {
  cloud: {
    starter: "Starter Cloud",
    plus: "Plus Cloud",
    turbo: "Turbo Cloud",
    business: "Business Cloud",
  },
  wordpress: {
    starter: "Starter WordPress",
    plus: "Plus WordPress",
    turbo: "Turbo WordPress",
    business: "Business WordPress",
  },
  ecommerce: {
    starter: "WooCommerce Starter",
    plus: "WooCommerce Growth",
    turbo: "WooCommerce Pro",
    business: "WooCommerce Enterprise",
  },
};

/**
 * Which tier the store badges MOST POPULAR. Not the same tier in every group:
 * the cloud store marks Turbo, the WooCommerce store marks Growth. This was
 * hardcoded to `turbo` and put the badge on the wrong card for ecommerce.
 */
const POPULAR: Record<string, PlanTier> = {
  cloud: "turbo",
  wordpress: "turbo",
  ecommerce: "plus",
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

/**
 * The store's own feature list, in its own order and its own words — including
 * the shouted FREEs, which are how the store writes them.
 *
 * Identical on all four tiers. The three lines that DO differ per tier
 * (websites, monthly visits, RAM) live in `specs` and are rendered separately,
 * so nothing here repeats them.
 *
 * ⚠ "CloudFlare/Railgun" IS A KNOWN-INACCURATE LINE, kept deliberately.
 * Cloudflare retired Railgun in 2023, and `components/sections/included.tsx`
 * excludes it for exactly that reason — its header comment says listing it
 * would be inaccurate. The two lists therefore disagree on purpose: this one
 * mirrors what the WHMCS store sells, and the store is the thing that has to
 * change first. Fix it there, then here. ("CloudFlare" is also the pre-2016
 * spelling of the company.)
 */
const INCLUDES = [
  "Unlimited NVMe Storage",
  "Unmetered Bandwidth",
  "CloudFlare/Railgun",
  "Google Analytics integration",
  "FREE cPanel",
  "FREE WP Install",
  "FREE Auto SSL Certificate",
  "FREE LiteSpeed Caching",
  "FREE Website Migration",
  "FREE Daily Backups",
  "LiteSpeed Website Cache",
  "Auto Website Updates",
  "30-Day Money-Back Guarantee",
] as const;

/** Ecommerce uses store-facing wording for the same underlying resources. */
const COPY = {
  cloud: {
    storage: "Unlimited NVMe",
    transfer: "Unmetered",
    includes: INCLUDES,
  },
  wordpress: {
    storage: "Unlimited NVMe",
    transfer: "Unmetered",
    includes: INCLUDES,
  },
  ecommerce: {
    storage: "Unlimited NVMe",
    transfer: "Unmetered",
    /*
     * Three lines differ from INCLUDES because the WooCommerce store words
     * them for stores rather than sites: "Store Migrator" not "Website
     * Migration", "LiteSpeed Store Cache" not "Website Cache", "Auto Store
     * Updates" not "Website Updates". Same underlying features — this is the
     * per-group wording the COPY map exists for.
     */
    includes: INCLUDES.map((f) =>
      f === "FREE Website Migration"
        ? "FREE Store Migrator"
        : f === "LiteSpeed Website Cache"
          ? "LiteSpeed Store Cache"
          : f === "Auto Website Updates"
            ? "Auto Store Updates"
            : f,
    ),
  },
} as const;

function buildPlans(id: keyof typeof COPY): readonly Plan[] {
  return TIERS.map((tier) => ({
    tier,
    name: NAMES[id][tier],
    summary: SUMMARIES[id][tier],
    ...RATES[tier],
    slug: SLUGS[id][tier],
    popular: tier === POPULAR[id],
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
    plans: buildPlans("cloud"),
  },
  {
    id: "wordpress",
    label: "WordPress hosting",
    group: "wordpress-hosting",
    blurb: "Tuned for WordPress, with LiteSpeed caching and automatic core updates.",
    plans: buildPlans("wordpress"),
  },
  {
    id: "ecommerce",
    label: "Ecommerce hosting",
    group: "woocommerce-hosting",
    blurb: "WooCommerce-ready stores, built for checkout speed under load.",
    plans: buildPlans("ecommerce"),
  },
];

export function groupById(id: string): PlanGroup | undefined {
  return planGroups.find((g) => g.id === id);
}

/** Checkout URL for a plan. Always route through this — never hand-build one. */
export function orderUrl(group: PlanGroup, plan: Plan): string {
  return billing.order(group.group, plan.slug);
}

/**
 * Lowest advertised monthly rate across all groups, for "starting at" copy.
 *
 * Carries no term. Copy built on it should still put the standard rate within
 * reach of the reader — a bare "from $7.95/mo" is the advertising this company
 * positions itself against.
 */
export const lowestRate = Math.min(
  ...planGroups.flatMap((g) => g.plans.map((p) => p.monthly)),
);

/** "37%" — the discount against the standard rate. */
export function formatSavings(plan: Plan): string {
  return `${Math.round(plan.savings * 100)}%`;
}

/**
 * Spec values are deliberately terse because each is rendered against its own
 * <dt> label ("Storage: Unlimited NVMe"). Repeating the noun forces a wrap in
 * the plan cards, which breaks row alignment across the grid.
 */
export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
