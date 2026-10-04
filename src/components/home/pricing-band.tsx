import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { groupById, formatPrice, formatSavings, orderUrl } from "@/data/pricing";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * Pricing band.
 *
 * Four cards — Starter, Plus, Turbo, Business — with Turbo highlighted, which
 * is exactly what the WHMCS store shows and how it marks Most Popular.
 *
 * ⚠ It renders `cloud.plans` whole. It does NOT pick tiers. An earlier version
 * showed three and pushed Plus into a footnote to fit a three-up layout
 * borrowed from elsewhere, which hid a purchasable product from the homepage.
 * If a fifth tier is ever added to the data it appears here automatically; the
 * layout bends to the product, never the other way round.
 *
 * Every price is read from the pricing data. Each card carries THREE figures,
 * not one: the monthly rate, the saving, and the standard rate that saving is
 * measured against — plus the setup fee where one applies. The fourth figure,
 * the term the rate required, was removed on 2026-09-16: these are monthly
 * prices and the site no longer claims otherwise.
 * A lone "$7.95/mo" is the advertising this company positions itself against,
 * so the card is built so that it cannot be rendered on its own.
 */
const BADGES = [
  "30-day money-back guarantee",
  "Free migration",
  "Standard rate shown",
] as const;


export function PricingBand() {
  const cloud = groupById("cloud");
  if (!cloud) return null;

  // Every tier the store sells, in the store's order. Not a selection.
  const shown = cloud.plans;

  return (
    <section
      id="plans"
      aria-labelledby="pricing-heading"
      className="relative isolate overflow-hidden bg-canvas-secondary py-14 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_0%,rgb(34_126_255/0.08)_0%,transparent_70%)]"
      />
      <Container width="wide" className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="pricing-heading" className="display-lg text-fg">
            Choose the plan that <span className="block">matches what you run</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-body-lg text-fg-secondary">
            The monthly rate on every card, the standard rate it discounts
            beside it, and the setup fee where one applies.
          </p>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {BADGES.map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 text-small text-fg-secondary"
              >
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="h-4 w-4 text-success-fill"
                >
                  <path
                    d="m3.5 8.5 3 3 6-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* 2026-10-03 card grammar, after the reference: saving pill in the
            corner, the standard rate struck through above the price, an
            outline button, the renewal line, a rule, then the three specs
            that actually differ per tier as a checklist. Both numbers are
            still on every card (see data/pricing.ts: never `monthly` alone). */}
        <ul className="mt-14 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shown.map((plan, i) => {
            if (!plan) return null;
            const featured = plan.popular;
            return (
              <Reveal as="li" key={plan.slug} delay={i * 80} className="flex">
                <article
                  className={cn(
                    "relative flex w-full flex-col overflow-hidden rounded-2xl p-6",
                    featured
                      ? "bg-[linear-gradient(180deg,var(--color-brand-950)_0%,#040a1c_100%)] text-fg-on-dark-secondary shadow-e5"
                      : "bg-surface ring-1 ring-line",
                  )}
                >
                  {featured && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(80%_100%_at_50%_0%,rgb(0_0_255/0.45)_0%,transparent_70%)]"
                    />
                  )}

                  <div className="relative flex items-start justify-between gap-3">
                    <h3 className={cn("text-body-lg font-semibold", featured ? "text-white" : "text-fg")}>
                      {plan.name}
                    </h3>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-2 py-0.5 text-micro font-semibold",
                        featured ? "bg-white/15 text-white" : "bg-brand-50 text-primary",
                      )}
                    >
                      {featured ? `Most popular · ${formatSavings(plan)} off` : `${formatSavings(plan)} off`}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "relative mt-1.5 min-h-10 text-small",
                      featured ? "text-fg-on-dark-muted" : "text-fg-secondary",
                    )}
                  >
                    {plan.summary}
                  </p>

                  <p
                    className={cn(
                      "relative mt-5 text-small line-through",
                      featured ? "text-fg-on-dark-muted" : "text-fg-muted",
                    )}
                  >
                    <span className="sr-only">Standard rate </span>
                    {formatPrice(plan.standard)}
                  </p>
                  <p className="relative flex items-baseline gap-1">
                    <span
                      className={cn(
                        "tabular text-[40px] leading-none font-semibold tracking-[-0.03em]",
                        featured ? "text-white" : "text-fg",
                      )}
                    >
                      {formatPrice(plan.monthly)}
                    </span>
                    <span className={cn("text-body", featured ? "text-fg-on-dark-muted" : "text-fg-muted")}>
                      /mo
                    </span>
                  </p>

                  <Button
                    href={orderUrl(cloud, plan)}
                    variant={featured ? "primary" : "outline"}
                    size="md"
                    className="relative mt-6 w-full"
                  >
                    Choose plan
                  </Button>

                  <p
                    className={cn(
                      "relative mt-3 text-micro",
                      featured ? "text-fg-on-dark-muted" : "text-fg-muted",
                    )}
                  >
                    Renews at {formatPrice(plan.standard)}/mo.
                    {plan.setupFee ? ` ${formatPrice(plan.setupFee)} one-off setup fee.` : " No setup fee."}
                  </p>

                  <div
                    className={cn(
                      "relative mt-6 border-t pt-6",
                      featured ? "border-white/10" : "border-line",
                    )}
                  >
                    <ul className="flex flex-col gap-3">
                      {[plan.specs.sites, plan.specs.visits, `${plan.specs.memory} memory`, "Unlimited NVMe storage", "Free SSL and daily backups"].map((spec) => (
                        <li key={spec} className="flex items-center gap-2.5 text-small">
                          <svg
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                            className={cn("h-4 w-4 shrink-0", featured ? "text-primary-on-dark" : "text-success-fill")}
                          >
                            <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className={featured ? "text-white" : "text-fg"}>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        {/* The store's feature list is identical on all four tiers (see
            data/pricing.ts), so it is printed once here rather than four times
            inside the cards, where it buried the three rows that differ. */}
        <Reveal className="mt-10 rounded-2xl bg-surface p-7 ring-1 ring-line sm:p-8">
          <h3 className="text-h4 text-fg">Every plan includes</h3>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown[0].includes.map((inc) => (
              <li key={inc} className="flex items-center gap-2 text-small text-fg-secondary">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-success-fill"
                >
                  <path
                    d="m3.5 8.5 3 3 6-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {inc}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h3 className="text-h4 font-medium text-fg">Need more from your hosting?</h3>
            <p className="mt-1 text-small text-fg-secondary">
              Root access and dedicated resources are coming with VPS hosting. Tell us what you
              need and we will size it.
            </p>
          </div>
          <Button href="/vps-hosting" variant="outline" size="sm" className="shrink-0 bg-white">
            See VPS hosting
          </Button>
        </div>

        <p className="mt-10 text-center text-small text-fg-muted">
          All four cloud tiers, at the monthly rate.{" "}
          <a
            href={billing.root}
            className="inline-block rounded-sm py-1 font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            See every tier
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
