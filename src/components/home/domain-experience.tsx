import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { HeroDomainSearch } from "@/components/domain/hero-domain-search";
import { tlds, cheapestTld } from "@/data/tlds";
import { billing } from "@/data/company";

/**
 * Domain search, as a band rather than a field.
 *
 * The composition is deliberately different from every other section on the
 * page: a dark inset panel on a light canvas, full width, with the search as
 * the single focal element and the price list underneath as supporting
 * evidence. Nothing is beside it — a domain search competing with a column of
 * marketing copy is a form, not an experience.
 *
 * Prices come from `tlds.ts`, which holds the real published registration
 * rates. They are first-year registration prices and say so: presenting one as
 * a guaranteed checkout total would be wrong for premium names, which the
 * registry prices separately.
 */
export function DomainExperience() {
  return (
    <section
      aria-labelledby="domain-experience-title"
      className="bg-canvas py-14 sm:py-24 lg:py-28"
    >
      <Container width="wide">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-2xl bg-canvas-abyss px-5 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            {/* Light, kept off-centre so the panel does not read as a box. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(58%_62%_at_22%_0%,rgb(34_126_255/0.34)_0%,transparent_70%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(40%_46%_at_92%_100%,rgb(34_211_238/0.14)_0%,transparent_72%)]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />

            <div className="relative mx-auto max-w-2xl text-center">
              <span className="font-mono text-caption uppercase text-primary-on-dark">
                Domains
              </span>
              <h2 id="domain-experience-title" className="mt-4 text-h1 text-white">
                Start with the name.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-body-lg text-fg-on-dark-secondary">
                Check it here — this is a live registry lookup, not a suggestion engine.
                Free for the first year on any annual plan, and WHOIS privacy is
                included rather than sold back to you.
              </p>

              <div className="mt-8">
                <HeroDomainSearch />
              </div>
            </div>

            {/* Price list. A real table of what each extension costs. */}
            <div className="relative mt-12">
              <h3 className="text-center font-mono text-caption uppercase text-fg-on-dark-muted">
                First-year registration
              </h3>
              <ul className="mx-auto mt-4 grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4">
                {tlds.map((entry) => (
                  <li key={entry.tld}>
                    <Link
                      href="/register-domain"
                      className="flex h-full flex-col gap-0.5 rounded-lg bg-white/[0.06] px-3 py-2.5 ring-1 ring-inset ring-white/12 transition-colors duration-fast hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span className="font-mono text-body font-semibold text-white">
                        {entry.tld}
                      </span>
                      <span className="tabular text-small text-fg-on-dark-secondary">
                        ${entry.price.toFixed(2)}
                        <span className="text-fg-on-dark-muted">/yr</span>
                      </span>
                      {entry.note && (
                        <span className="text-micro text-fg-on-dark-muted">
                          {entry.note}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="flex flex-wrap justify-center gap-3">
                  <Button href="/register-domain" variant="inverse">
                    Full domain search
                  </Button>
                  <Button href={billing.transferDomain} variant="inverseOutline">
                    Transfer a domain in
                  </Button>
                </div>
                <p className="max-w-lg text-center text-small text-fg-on-dark-muted">
                  From ${cheapestTld.price.toFixed(2)}/yr. Standard registration prices
                  — premium names are priced by the registry and renewals are charged at
                  the published renewal rate.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
