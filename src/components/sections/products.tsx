import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { products, upcomingProducts, startingPrice } from "@/data/products";
import { formatPrice } from "@/data/pricing";

/**
 * Product grid.
 *
 * Purpose: route the visitor to the right workload. Hosting buyers arrive
 * knowing what they run (a store, a WordPress site) rather than which tier they
 * want, so the grid is organised by workload, not by price.
 *
 * Treatment: each card carries a brand rule that fills on hover — a single
 * moving element rather than a card that lifts, scales and glows at once.
 * The whole card is a link via a stretched overlay, so there is one target and
 * no nested interactive elements.
 */
export function Products() {
  return (
    <Section surface="subtle" labelledBy="products-heading">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          id="products-heading"
          eyebrow="Hosting"
          title="Pick the workload, not the tier"
          lede="Every product runs on the same infrastructure. What differs is how it is tuned and who maintains it."
        />
        <Link
          href="/pricing"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-body font-medium text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Compare every plan
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2">
        {products.map((product) => {
          const from = startingPrice(product);
          return (
            <li key={product.name} className="flex">
              <article className="group relative flex w-full flex-col overflow-hidden rounded-lg bg-surface shadow-e1 ring-1 ring-line transition-shadow duration-normal ease-hover hover:shadow-e4 focus-within:ring-2 focus-within:ring-primary">
                {/* Brand rule that fills on hover — the card's one animation. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-normal ease-entrance group-hover:scale-x-100 group-focus-within:scale-x-100"
                />

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-h4 text-fg">
                    <Link
                      href={product.href}
                      className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-small text-fg-secondary">{product.summary}</p>

                  <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                    {product.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-1.5 font-mono text-caption uppercase text-fg-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full bg-primary"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                    {from !== null ? (
                      <p className="text-small text-fg-muted">
                        From{" "}
                        <span className="tabular text-body font-semibold text-fg">
                          {formatPrice(from)}
                        </span>
                        /mo
                      </p>
                    ) : (
                      <p className="text-small text-fg-muted">
                        Available on every tier
                      </p>
                    )}
                    <span
                      aria-hidden="true"
                      className="text-small font-medium text-primary transition-transform duration-normal ease-hover group-hover:translate-x-0.5"
                    >
                      Explore →
                    </span>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      {/* Upcoming products: listed for intent, deliberately without a CTA. */}
      <div className="mt-6 rounded-lg border border-dashed border-line-strong p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-fg-secondary">
            <span className="font-medium text-fg">In development.</span> Not orderable
            yet — talk to us if you need one now.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {upcomingProducts.map((p) => (
              <li key={p.name}>
                <Link
                  href={p.href}
                  className="inline-flex min-h-9 items-center gap-2 rounded-sm text-small text-fg-secondary transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {p.name}
                  <Badge tone="warning">Soon</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
