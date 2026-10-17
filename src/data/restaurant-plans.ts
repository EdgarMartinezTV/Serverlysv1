/**
 * Restaurant website plans — /restaurant-websites (and /es/restaurant-websites).
 *
 * PRICES set by Edgar on 2026-10-16: a one-time setup fee plus a monthly plan.
 * The per-plan INCLUSIONS (page counts, update allowances, locations) were
 * drafted with the page and are the commercial terms the page publishes, so
 * change them here and nowhere else — the cards, the comparison table, the
 * Service schema and /llms.txt all read from this file.
 *
 * There is no WHMCS product for these plans yet, so every plan CTA goes to
 * the consultation form on the page rather than to a cart. When products are
 * created, add a `pid` and point the cards at the cart like design-plans.ts.
 */

export type RestaurantPlanId = "starter" | "growth" | "pro";

export type RestaurantPlan = {
  id: RestaurantPlanId;
  name: string;
  /** One-time setup fee, USD. */
  setup: number;
  /** Monthly plan, USD. */
  monthly: number;
  pages: number;
  /** Menu, hours and specials update requests included each month. */
  updates: number;
  locations: number;
};

export const restaurantPlans: readonly RestaurantPlan[] = [
  { id: "starter", name: "Starter", setup: 699, monthly: 49.95, pages: 5, updates: 2, locations: 1 },
  { id: "growth", name: "Growth", setup: 1299, monthly: 149.95, pages: 10, updates: 6, locations: 1 },
  { id: "pro", name: "Restaurant Pro", setup: 1999, monthly: 299.95, pages: 20, updates: 12, locations: 3 },
];

export const restaurantPlanIds = restaurantPlans.map((p) => p.id);

export const formatSetup = (n: number) => `$${n.toLocaleString("en-US")}`;
export const formatMonthly = (n: number) => `$${n.toFixed(2)}`;

export const restaurantFromSetup = Math.min(...restaurantPlans.map((p) => p.setup));
export const restaurantFromMonthly = Math.min(...restaurantPlans.map((p) => p.monthly));
