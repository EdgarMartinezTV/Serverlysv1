import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { groupById, formatPrice, orderUrl } from "@/data/pricing";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * Pricing band.
 *
 * Reproduces the target's three-up layout with a dark, highlighted middle card
 * and grouped feature lists beneath each price.
 *
 * ⚠ Serverlys sells FOUR cloud tiers, not three. Rather than hide a
 * purchasable product to fit the layout, the three headline tiers are shown
 * and the fourth is named explicitly in the footnote with a link to the full
 * table. Silently dropping a tier from the homepage would cost real orders.
 *
 * Every price is read from the pricing data, and the renewal rate appears on
 * every card — that commitment survives the redesign.
 */
const BADGES = [
  "30-day money-back guarantee",
  "Free migration",
  "Renewal price shown",
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

  // Starter, Turbo (highlighted), Business — the three headline tiers.
  const shown = ["starter", "turbo", "business"].map((tier) =>
    cloud.plans.find((p) => p.tier === tier),
  );
  const omitted = cloud.plans.find((p) => p.tier === "plus");

  return (
    <section
      id="plans"
      aria-labelledby="pricing-heading"
      className="relative isolate overflow-hidden bg-canvas-secondary py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_0%,rgb(34_126_255/0.08)_0%,transparent_70%)]"
      />
      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="pricing-heading" className="text-h1 text-fg">
            Choose the plan that <span className="block">matches what you run</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-body-lg text-fg-secondary">
            Introductory pricing on the left of every card, the renewal rate beside it.
            No setup fees, on any tier.
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

        <ul className="mt-14 grid items-start gap-5 lg:grid-cols-3">
          {shown.map((plan, i) => {
            if (!plan) return null;
            const featured = plan.popular;
            return (
              <Reveal as="li" key={plan.slug} delay={i * 80} className="flex">
                <article
                  className={cn(
                    "relative flex w-full flex-col rounded-2xl p-7 sm:p-8",
                    featured
                      ? "bg-canvas-abyss text-fg-on-dark-secondary shadow-e5 lg:-mt-4 lg:pb-12"
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
                        style={{ fontSize: "clamp(2.25rem,1.9rem+1.5vw,3rem)" }}
                      >
                        {formatPrice(plan.annual)}
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
                    <p
                      className={cn(
                        "mt-1.5 text-small",
                        featured ? "text-fg-on-dark-muted" : "text-fg-muted",
                      )}
                    >
                      Renews at{" "}
                      <span
                        className={cn(
                          "tabular font-medium",
                          featured ? "text-white" : "text-fg-secondary",
                        )}
                      >
                        {formatPrice(plan.renewal)}/mo
                      </span>
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
          {omitted && (
            <>
              A fourth tier,{" "}
              <span className="font-medium text-fg-secondary">{omitted.name}</span> at{" "}
              <span className="tabular">{formatPrice(omitted.annual)}</span>/mo, sits
              between Starter and Turbo.{" "}
            </>
          )}
          Introductory rates apply to the first term.{" "}
          <a
            href={billing.root}
            className="rounded-sm font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            See every tier and term
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
