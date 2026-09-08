import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { billing } from "@/data/company";
import { groupById, formatPrice, orderUrl } from "@/data/pricing";

/**
 * Homepage hero.
 *
 * Conversion objective: get the visitor into the plan selection with the
 * renewal price already understood, so the price is not a surprise at
 * checkout. That is the one thing Serverlys does differently from the rest of
 * the category, so it is the headline rather than a footnote.
 *
 * The right-hand card is a real plan with real numbers pulled from the pricing
 * data — not a decorative mock. If pricing changes, this changes with it.
 */
export function Hero() {
  const cloud = groupById("cloud");
  const featured = cloud?.plans.find((p) => p.popular) ?? cloud?.plans[0];

  return (
    <section className="relative overflow-hidden border-b border-line-subtle bg-canvas">
      {/* Restrained background: a single soft brand wash, no gradient soup. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,var(--color-primary-soft)_0%,transparent_70%)]"
      />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Copy */}
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-caption font-mono uppercase text-primary ring-1 ring-primary/20">
              <span
                className="h-1.5 w-1.5 rounded-full bg-success-fill"
                aria-hidden="true"
              />
              Renewal price shown up front
            </span>

            <h1 className="text-display text-fg">
              Hosting that shows you the renewal price before you buy.
            </h1>

            <p className="max-w-xl text-body-lg text-fg-secondary">
              Managed cloud, WordPress and ecommerce hosting with free migration, free
              SSL and daily backups. Year-two pricing is printed next to year-one
              pricing, so the real cost is on the page rather than in the terms.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button href="#plans" size="lg" block>
                See plans and renewal prices
              </Button>
              <Button href={billing.sales} variant="secondary" size="lg" block>
                Talk to an expert
              </Button>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-small text-fg-muted">
              {["Free migration", "30-day money back", "No setup fees"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Real plan card */}
          {cloud && featured && (
            <div className="lg:justify-self-end">
              <div className="w-full rounded-xl bg-white p-6 shadow-e4 ring-1 ring-line sm:p-7 lg:max-w-[400px]">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-h4 text-fg">{featured.name}</p>
                  <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-caption font-mono uppercase text-primary">
                    Most popular
                  </span>
                </div>
                <p className="mt-1 text-small text-fg-muted">{featured.summary}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="tabular text-h2 text-fg">
                    {formatPrice(featured.annual)}
                  </span>
                  <span className="text-body text-fg-muted">/mo</span>
                </div>
                <p className="mt-1.5 text-small text-fg-muted">
                  On an annual term. Renews at{" "}
                  <span className="tabular font-medium text-fg-secondary">
                    {formatPrice(featured.renewal)}/mo
                  </span>
                  .
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line-subtle pt-5">
                  {[
                    ["Websites", featured.specs.sites],
                    ["Traffic", featured.specs.visits],
                    ["Memory", featured.specs.memory],
                    ["Storage", featured.specs.storage],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-caption font-mono uppercase text-fg-muted">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-small text-fg">{value}</dd>
                    </div>
                  ))}
                </dl>

                <Button
                  href={orderUrl(cloud, featured)}
                  size="lg"
                  className="mt-6 w-full"
                >
                  Get {featured.name}
                </Button>
                <p className="mt-3 text-center text-small text-fg-muted">
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
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
