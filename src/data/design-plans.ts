import { billing } from "./company";

/**
 * Website design plans — one-time project prices, set by Edgar on
 * 2026-10-13 ("our price plans, just $100 less" than DreamHost's custom web
 * design tiers). Starting prices: every project is scoped in writing first.
 *
 * Each plan is a WHMCS product in the "website-design" group (pids 33/34/35,
 * added 2026-10-13), so the call to action is a direct cart link. They are a
 * different offer from the store's monthly "Contractor Website Plans" (pids
 * 23/24).
 */

export type DesignPlan = {
  id: "starter" | "plus" | "pro";
  name: string;
  /** WHMCS product id in the "website-design" group. */
  pid: number;
  /** One-time starting price in USD. */
  price: number;
  subpages: number;
  summary: string;
};

export const designPlans: readonly DesignPlan[] = [
  {
    id: "starter",
    name: "Starter",
    pid: 33,
    price: 1399,
    subpages: 5,
    summary:
      "For a new or smaller business: a custom homepage, the core pages and a blog ready to rank.",
  },
  {
    id: "plus",
    name: "Plus",
    pid: 34,
    price: 1899,
    subpages: 10,
    summary:
      "For a bigger site with more services to show, more content and some custom functionality.",
  },
  {
    id: "pro",
    name: "Pro",
    pid: 35,
    price: 2699,
    subpages: 15,
    summary:
      "For content-heavy sites with lots of pages, products and more complex requirements.",
  },
];

/** What every plan includes, besides its subpage count. */
export const designIncludes = [
  "100% custom homepage",
  "WordPress implementation",
  "Web style guide",
  "SEO-friendly blog",
  "Analytics setup",
] as const;

export const designFeatures = (plan: DesignPlan) => [
  designIncludes[0],
  `${plan.subpages} subpages`,
  ...designIncludes.slice(1),
];

export const designOrderUrl = (plan: DesignPlan) =>
  `${billing.root}/cart.php?a=add&pid=${plan.pid}&carttpl=Serverlys`;

export const formatDesignPrice = (n: number) => `$${n.toLocaleString("en-US")}`;

export const designFromPrice = Math.min(...designPlans.map((p) => p.price));
