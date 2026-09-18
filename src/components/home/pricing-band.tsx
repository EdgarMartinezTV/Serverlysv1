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

const GROUPS = [
  {
    heading: "Build with",
    keys: ["sites", "visits", "memory"] as const,
  },
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
          <h2 id="pricing-heading" className="text-h1 text-fg">
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

        <ul className="mt-14 grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {shown.map((plan, i) => {
            if (!plan) return null;
            const featured = plan.popular;
            return (
              <Reveal as="li" key={plan.slug} delay={i * 80} className="flex">
                <article
                  // The price is sized in `cqi`, so the card has to be the query
                  // container. Without this the price falls back to viewport
                  // units and stops tracking the column it has to fit inside.
                  style={{ containerType: "inline-size" }}
                  className={cn(
                    "relative flex w-full flex-col rounded-2xl p-7 sm:p-8",
                    featured
                      ? "bg-canvas-abyss text-fg-on-dark-secondary shadow-e5 xl:-mt-4 xl:pb-12"
                      : "bg-surface shadow-e2 ring-1 ring-line",
                  )}
                >
                  {featured && (
                    <>
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 rounded-2xl bg-[radial-gradient(70%_60%_at_50%_0%,rgb(34_126_255/0.35)_0%,transparent_70%)]"
                      />
                      <span className="relative mb-4 inline-flex w-fit items-center rounded-full bg-white/12 px-3 py-1 font-mono text-caption uppercase text-white ring-1 ring-inset ring-white/20">
                        Most popular
                      </span>
                    </>
                  )}

                  <div className="relative">
                    <h3 className={cn("text-h3", featured ? "text-white" : "text-fg")}>
                      {plan.name}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 min-h-11 text-small",
                        featured ? "text-fg-on-dark-muted" : "text-fg-secondary",
                      )}
                    >
                      {plan.summary}
                    </p>

                    <p className="mt-6 flex items-baseline gap-1.5">
                      <span
                        className={cn(
                          "tabular text-display",
                          featured ? "text-white" : "text-fg",
                        )}
                        /* Sized from the CARD, not the viewport. Two bugs lived
                           here: `1.9rem+1.5vw` has no space around the `+`, which
                           is invalid inside clamp(), so the whole declaration was
                           dropped and the price rendered at the raw --text-display
                           size (80px) — wide enough that "$23.95" shoved "/mo"
                           outside the card between 1280px and ~1390px, where the
                           4-up grid starts but the container has not caught up.
                           Even spaced correctly, a vw-driven size cannot track a
                           grid-driven column, so it is `cqi`: 24% of the card's
                           content box, floored at 2.25rem and capped at the 3rem
                           this always meant to cap at. The widest price the store
                           sells ($23.95 + "/mo") fits every card width the grid
                           produces, down to 320px. */
                        style={{ fontSize: "clamp(2.25rem, 24cqi, 3rem)" }}
                      >
                        {formatPrice(plan.monthly)}
                      </span>
                      <span
                        className={cn(
                          "text-body",
                          featured ? "text-fg-on-dark-muted" : "text-fg-muted",
                        )}
                      >
                        /mo
                      </span>
                    </p>

                    {/* No term is attached to this price any more (2026-09-16).
                        The saving is measured against the standard rate printed
                        directly below, which is what keeps the claim meaningful. */}
                    <p
                      className={cn(
                        "mt-2 inline-flex w-fit items-center rounded-md px-2 py-1 text-small font-medium",
                        featured
                          ? "bg-white/12 text-white"
                          : "bg-warning-soft text-warning",
                      )}
                    >
                      Save {formatSavings(plan)} on the standard rate
                    </p>

                    <p
                      className={cn(
                        "mt-2 text-small",
                        featured ? "text-fg-on-dark-muted" : "text-fg-muted",
                      )}
                    >
                      Standard rate{" "}
                      <span
                        className={cn(
                          "tabular font-medium",
                          featured ? "text-white" : "text-fg-secondary",
                        )}
                      >
                        {formatPrice(plan.standard)}/mo
                      </span>
                      {plan.setupFee
                        ? ` · ${formatPrice(plan.setupFee)} setup fee`
                        : " · no setup fee"}
                    </p>

                    <Button
                      href={orderUrl(cloud, plan)}
                      variant={featured ? "inverse" : "secondary"}
                      size="lg"
                      className="mt-7 w-full"
                    >
                      Choose {plan.name}
                    </Button>

                    {GROUPS.map((group) => (
                      <div key={group.heading} className="mt-8">
                        <p
                          className={cn(
                            "font-mono text-caption uppercase",
                            featured ? "text-fg-on-dark-muted" : "text-fg-muted",
                          )}
                        >
                          {group.heading}
                        </p>
                        <dl className="mt-3 flex flex-col gap-2.5">
                          {group.keys.map((k) => (
                            <div
                              key={k}
                              className="flex justify-between gap-3 text-small"
                            >
                              <dt
                                className={
                                  featured ? "text-fg-on-dark-muted" : "text-fg-muted"
                                }
                              >
                                {k === "sites"
                                  ? "Websites"
                                  : k === "visits"
                                    ? "Traffic"
                                    : "Memory"}
                              </dt>
                              <dd
                                className={cn(
                                  "text-right font-medium",
                                  featured ? "text-white" : "text-fg",
                                )}
                              >
                                {plan.specs[k]}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ))}

                    <div className="mt-7">
                      <p
                        className={cn(
                          "font-mono text-caption uppercase",
                          featured ? "text-fg-on-dark-muted" : "text-fg-muted",
                        )}
                      >
                        Included
                      </p>
                      <ul className="mt-3 flex flex-col gap-2">
                        {plan.includes.map((inc) => (
                          <li key={inc} className="flex items-center gap-2 text-small">
                            <svg
                              viewBox="0 0 16 16"
                              aria-hidden="true"
                              className={cn(
                                "h-4 w-4 shrink-0",
                                featured ? "text-accent-on-dark" : "text-success-fill",
                              )}
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
                            <span
                              className={
                                featured
                                  ? "text-fg-on-dark-secondary"
                                  : "text-fg-secondary"
                              }
                            >
                              {inc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

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
