import { BLACK_FRIDAY, TERMS, formatPrice, groupById, planGroups, quote } from "@/data/pricing";
import { FREE_WITH_HOSTING } from "@/data/tlds";
import { products, startingPrice, upcomingProducts } from "@/data/products";
import { billing } from "@/data/company";

/**
 * Hosting facts, derived from the site's own pricing data.
 *
 * NOTHING IS RESTATED HERE. Every figure comes out of `data/pricing.ts`, which
 * is the file the pricing pages render from and the one carrying the provenance
 * note about where the numbers came from. If ConvoAI had its own copy of the price
 * list, the day it drifted would be the day ConvoAI started quoting a price the
 * checkout will not honour — and the visitor would have been told it by
 * something that speaks for the company.
 *
 * ⚠ BOTH NUMBERS, ALWAYS. `data/pricing.ts` carries a standing rule that the
 * monthly rate is never shown without the standard rate beside it, because a
 * headline price without its renewal is the exact practice Serverlys sells
 * against. That rule binds ConvoAI too, which is why `renewsAt` is not optional in
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
  /** Black Friday first-payment prices while the sale runs (WHMCS code BLACKFRIDAY, auto-applied in the cart). */
  blackFriday?: string;
  /** Every billing term: total, per-month equivalent, setup, free domain — so "from $X/mo" headlines can be explained. */
  terms: string;
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
    /* WHMCS renews every term at that term's own price; `standard` is not a renewal rate (see pricing.ts). */
    renewsAt: `${formatPrice(plan.monthly)}/mo on the monthly term; longer terms renew at the same term price`,
    savings: `${Math.round(plan.savings * 100)}% off the standard rate`,
    blackFriday: (() => {
      const m = quote(plan, "monthly");
      const y = quote(plan, "annually");
      const t = quote(plan, "triennially");
      if (!m.bf || !y.bf || !t.bf) return undefined;
      const pm = (total: number, months: number) => formatPrice(Math.round((total / months) * 100) / 100);
      return `Black Friday until ${BLACK_FRIDAY.endsLabel}: ${Math.round(BLACK_FRIDAY.pct * 100)}% off the first payment, applied automatically at checkout. Monthly term: first payment ${formatPrice(m.bf.today)} in total${m.bf.setup ? ` (this ALREADY INCLUDES the ${formatPrice(plan.setupFee ?? 0)} setup fee — nothing else is added)` : ""}, then ${formatPrice(plan.monthly)}/mo. Paying 12 months up front: ${formatPrice(y.bf.today)} today (works out to ${pm(y.bf.today, 12)}/mo; regular ${formatPrice(y.total)}), free domain included. Paying 36 months up front: ${formatPrice(t.bf.today)} today (works out to ${pm(t.bf.today, 36)}/mo — this is the "from ${pm(t.bf.today, 36)}/mo" headline on the site; regular ${formatPrice(t.total)}), free domain included. Each term renews at its regular price.`;
    })(),
    terms: `Billing terms (regular prices): ${TERMS.map((t) => {
      const q = quote(plan, t.key);
      return `${q.label}: ${formatPrice(q.total)}${t.months > 1 ? ` for ${t.months} months (${formatPrice(q.perMonth)}/mo)` : "/mo"}${q.setup ? ` + ${formatPrice(q.setup)} one-off setup` : ""}${q.freeDomain ? ", free domain for the first year" : ", no free domain"}`;
    }).join("; ")}. Every term renews at that same term price. Free domain = ${FREE_WITH_HOSTING.join(", ")} for the first year on 12-month or longer billing; the monthly term does not include one.`,
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
 * Hiding them would make ConvoAI say "we do not offer that", which is wrong; a
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
