import Link from "next/link";
import { Container } from "@/components/ui/container";
import { DomainSearch } from "@/components/domain/domain-search";
import { groupById, formatPrice } from "@/data/pricing";

/**
 * Homepage hero.
 *
 * Conversion objective: put the visitor into one of two funnels — a domain
 * search (top of funnel) or plan selection — with the twelve-month cost already
 * understood.
 *
 * Art direction: a dark band with a layered brand light source and a fine
 * technical grid, both CSS. No stock photography and no fabricated product
 * screenshot — for an infrastructure company the honest hero image is the
 * pricing itself, so the right-hand panel IS the visual, built from real plan
 * data. If pricing changes, the hero changes with it.
 *
 * The layout is deliberately asymmetric (7/5) rather than a centred
 * heading-paragraph-button stack.
 */
export function Hero() {
  const cloud = groupById("cloud");
  const plan = cloud?.plans.find((p) => p.popular) ?? cloud?.plans[0];

  // Real arithmetic over twelve months. Computed, never hard-coded.
  const onPromo = plan ? plan.monthly * 12 : 0;
  const atStandard = plan ? plan.standard * 12 : 0;

  return (
    <section className="relative isolate overflow-hidden bg-canvas-dark">
      {/* Layered background: brand light source, then a technical grid. */}
      <div aria-hidden="true" className="absolute inset-0 bg-hero-glow" />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />

      <Container className="relative pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Copy + primary interaction */}
          <div className="flex flex-col items-start lg:col-span-7">
            <span className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] py-1.5 pl-2.5 pr-3.5 font-mono text-caption uppercase text-fg-on-dark-secondary ring-1 ring-inset ring-white/15">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-success-fill"
              />
              Renewal pricing, shown up front
            </span>

            {/* The explicit space matters: `block` breaks the line visually
                but contributes no whitespace, so without it the accessible
                name reads "honestly.Including year two." */}
            <h1 className="mt-6 text-display text-white">
              Hosting priced honestly.{" "}
              <span className="block text-fg-on-dark-secondary">
                Including year two.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-body-lg text-fg-on-dark-secondary">
              Managed cloud, WordPress and ecommerce hosting. Free migration, free SSL
              and daily backups on every plan.
            </p>

            <div className="mt-9 w-full max-w-xl">
              <DomainSearch tone="dark" />
              <p className="mt-3 text-small text-fg-on-dark-muted">
                Free domain for the first year on annual plans. Free WHOIS privacy,
                always.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link
                href="#plans"
                className="inline-flex items-center gap-1.5 rounded-sm text-body font-medium text-white underline-offset-4 transition-colors hover:text-primary-on-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Compare plans
                <span aria-hidden="true">→</span>
              </Link>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {["Free migration", "30-day money back"].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-small text-fg-on-dark-muted"
                  >
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The differentiator, made concrete. This panel is the hero image. */}
          {plan && (
            <div className="mx-auto w-full max-w-lg lg:col-span-5 lg:mx-0 lg:max-w-none lg:pt-2">
              <figure className="rounded-2xl bg-white/[0.04] p-1.5 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
                <div className="rounded-xl bg-surface-dark-elevated p-6 shadow-e5 ring-1 ring-inset ring-white/[0.06] sm:p-7">
                  <figcaption className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-caption uppercase text-fg-on-dark-muted">
                      What you actually pay
                    </span>
                    <span className="text-small text-fg-on-dark-secondary">
                      {plan.name}
                    </span>
                  </figcaption>

                  <dl className="mt-6 flex flex-col gap-5">
                    <CostRow
                      term="At the promotional rate"
                      monthly={plan.monthly}
                      total={onPromo}
                      emphasis
                    />
                    <div className="h-px bg-white/10" />
                    <CostRow
                      term="At the standard rate"
                      monthly={plan.standard}
                      total={atStandard}
                    />
                  </dl>

                  <p className="mt-6 border-t border-white/10 pt-5 text-small text-fg-on-dark-muted">
                    Most hosts show you the first number. We show you both — before
                    checkout, not in the terms.
                  </p>
                </div>
              </figure>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function CostRow({
  term,
  monthly,
  total,
  emphasis,
}: {
  term: string;
  monthly: number;
  total: number;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <dt className="text-small text-fg-on-dark-muted">{term}</dt>
        <dd
          className={`tabular mt-1 ${emphasis ? "text-h2 text-white" : "text-h3 text-fg-on-dark-secondary"}`}
        >
          {formatPrice(monthly)}
          <span className="text-body font-normal text-fg-on-dark-muted">/mo</span>
        </dd>
      </div>
      <span className="tabular pb-1 text-small text-fg-on-dark-muted">
        {formatPrice(total)} / 12 mo
      </span>
    </div>
  );
}

function CheckIcon() {
  return (
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
  );
}
