import { formatPrice, groupById, planGroups } from "@/data/pricing";
import { products, startingPrice, upcomingProducts } from "@/data/products";
import { billing } from "@/data/company";

/**
 * Hosting facts, derived from the site's own pricing data.
 *
 * NOTHING IS RESTATED HERE. Every figure comes out of `data/pricing.ts`, which
 * is the file the pricing pages render from and the one carrying the provenance
 * note about where the numbers came from. If Sera had its own copy of the price
 * list, the day it drifted would be the day Sera started quoting a price the
 * checkout will not honour — and the visitor would have been told it by
 * something that speaks for the company.
 *
 * ⚠ BOTH NUMBERS, ALWAYS. `data/pricing.ts` carries a standing rule that the
 * monthly rate is never shown without the standard rate beside it, because a
 * headline price without its renewal is the exact practice Serverlys sells
 * against. That rule binds Sera too, which is why `renewsAt` is not optional in
 * the shape below and why the system prompt repeats it.
 */

export type PlanFact = {
  tier: string;
  name: string;
  summary: string;
  /** Advertised monthly price. No term is attached to it. */
  monthlyPrice: string;
  /** The rate it renews at. Never omit this when quoting `monthlyPrice`. */
  renewsAt: string;
  savings: string;
  setupFee?: string;
  sites: string;
  visits: string;
  memory: string;
  storage: string;
  transfer: string;
  includes: readonly string[];
  orderUrl: string;
};

export type PlanGroupFact = {
  id: string;
  label: string;
  blurb: string;
  storeUrl: string;
  plans: readonly PlanFact[];
};

function toPlanFact(groupSlug: string, plan: (typeof planGroups)[number]["plans"][number]): PlanFact {
  return {
    tier: plan.tier,
    name: plan.name,
    summary: plan.summary,
    monthlyPrice: `${formatPrice(plan.monthly)}/mo`,
    renewsAt: `${formatPrice(plan.standard)}/mo standard rate`,
    savings: `${Math.round(plan.savings * 100)}% off the standard rate`,
    setupFee: plan.setupFee ? `${formatPrice(plan.setupFee)} one-off setup fee` : undefined,
    sites: plan.specs.sites,
    visits: plan.specs.visits,
    memory: plan.specs.memory,
    storage: plan.specs.storage,
    transfer: plan.specs.transfer,
    includes: plan.includes,
    orderUrl: billing.order(groupSlug, plan.slug),
  };
}

/** Every plan group, or one by id ("cloud" | "wordpress" | "ecommerce"). */
export function hostingPlans(groupId?: string): PlanGroupFact[] {
  const groups = groupId ? [groupById(groupId)].filter(Boolean) : [...planGroups];
  return (groups as typeof planGroups[number][]).map((group) => ({
    id: group.id,
    label: group.label,
    blurb: group.blurb,
    storeUrl: billing.store(group.group),
    plans: group.plans.map((plan) => toPlanFact(group.group, plan)),
  }));
}

/**
 * The product grid, including the tiers that are NOT buyable yet.
 *
 * `available: false` is carried through rather than filtered out, because the
 * question "do you do VPS?" has an honest answer that is neither yes nor no.
 * Hiding them would make Sera say "we do not offer that", which is wrong; a
 * purchase link would be worse. See the `status: "soon"` note in data/products.
 */
export function hostingProducts() {
  const live = products.map((product) => {
    const from = startingPrice(product);
    return {
      name: product.name,
      page: product.href,
      summary: product.summary,
      highlights: product.points,
      startingFrom: from === null ? undefined : `${formatPrice(from)}/mo`,
      available: true,
    };
  });

  const soon = upcomingProducts.map((product) => ({
    name: product.name,
    page: product.href,
    summary: product.summary,
    highlights: [] as readonly string[],
    startingFrom: undefined,
    available: false,
    note: "Announced but not yet purchasable. Do not offer to sell this.",
  }));

  return [...live, ...soon];
}
