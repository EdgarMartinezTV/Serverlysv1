import Link from "next/link";
import { groupById } from "@/data/pricing";
import { ArrowUpRight, Grid, Headline } from "@/components/ref/kit";
import { PlanCard } from "@/components/ref/plan-card";
import { PRICING_HEAD, WHY } from "../_content";

/**
 * "Choose your managed WooCommerce plan" — the reference's plan cards, driven
 * by our own ecommerce plans.
 *
 * SHAPE is the reference's: 360px cards, one of them inverted to dark as the
 * featured tier, an offer badge top-right, price over a full-width CTA, the
 * rate/renewal line beneath it, then a ruled feature list and a "Why this
 * plan?" panel in the foot.
 *
 * The reference shows two cards; we sell four, so all four render and the
 * grid goes 4-up at 1280 rather than centring a pair. At four columns the
 * cards come out ~296px against the reference's 360 — the alternative was
 * hiding two plans, which is worse than 64px.
 *
 * CONTENT is `data/pricing.ts`. Nothing here hardcodes a price, spec or
 * checkout URL, and two rules from that file's header are honoured: `monthly` is
 * never rendered without the standard rate beside it, and Starter's $2.95
 * setup fee is printed because it is a real charge at checkout.
 */

const GROUP = groupById("ecommerce");

export function Pricing() {
  if (!GROUP) return null;

  return (
    <section
      id="pricing"
      aria-labelledby="ecom-pricing-heading"
      className="scroll-mt-14 bg-canvas-secondary py-16 lg:py-24"
    >
      <Grid>
        <Headline
          id="ecom-pricing-heading"
          title={PRICING_HEAD.title}
          description={PRICING_HEAD.description}
          className="mb-10 xl:mb-12"
        />

        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {GROUP.plans.map((plan) => (
            <li key={plan.tier}>
              <PlanCard plan={plan} group={GROUP} why={WHY[plan.tier]} cta={PRICING_HEAD.cta} />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-body font-semibold text-primary hover:text-primary-hover"
          >
            {PRICING_HEAD.compare}
            <ArrowUpRight className="size-4" />
          </Link>
          <p className="text-center text-micro text-fg-secondary">
            {PRICING_HEAD.fairUsage.lead}
            <Link href={PRICING_HEAD.fairUsage.href} className="underline decoration-from-font">
              {PRICING_HEAD.fairUsage.link}
            </Link>
            .
          </p>
          <p className="max-w-[930px] text-center text-micro text-fg-secondary">
            {PRICING_HEAD.upfront}
          </p>
        </div>
      </Grid>
    </section>
  );
}
