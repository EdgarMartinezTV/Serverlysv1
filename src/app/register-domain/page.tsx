import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/ui/json-ld";
import { DomainSearchApp } from "@/components/domain/domain-search-app";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { tlds, cheapestTld } from "@/data/tlds";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, productGraph } from "@/lib/seo";

const PATH = "/register-domain";

const DESCRIPTION =
  "Search and register a domain name. Free WHOIS privacy on every domain, renewal rates published up front, and no charge for DNS management.";

export const metadata = pageMetadata({
  title: `Register a Domain — search names from $${cheapestTld.price.toFixed(2)}/yr | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

const INCLUDED = [
  ["Free WHOIS privacy", "Your details stay out of the public record, at no cost."],
  ["Full DNS management", "Records, subdomains and redirects, included."],
  ["Auto-renew, off by default", "Nothing renews silently without your say-so."],
  ["Published renewal rates", "The year-two price is on the page, not in the terms."],
] as const;

export default function RegisterDomainPage() {
  const faqs = faqsFor(PATH);
  const prices = tlds.map((t) => t.price);

  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Register a domain", path: PATH },
        ])}
      />
      <JsonLd
        data={productGraph({
          name: "Domain registration",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
        })}
      />
      <JsonLd data={faqGraph(faqs)} />

      {/* The search IS the page — it gets the fold, on a light surface so the
          input is the brightest thing on screen. */}
      <section className="border-b border-line bg-canvas-secondary">
        <Container className="pb-14 pt-8 sm:pb-16 sm:pt-10">
          <Breadcrumbs
            trail={[{ name: "Home", href: "/" }, { name: "Register a domain" }]}
          />
          <div className="mt-10 max-w-2xl">
            <span className="font-mono text-caption uppercase text-primary">
              Domains
            </span>
            <h1 className="mt-4 text-h1 text-fg">Find the name first</h1>
            <p className="mt-5 text-body-lg text-fg-secondary">
              Availability is checked live against the domain registry. Free WHOIS
              privacy on everything we register.
            </p>
          </div>

          <div className="mt-10">
            <DomainSearchApp />
          </div>
        </Container>
      </section>

      <Section labelledBy="tld-heading">
        <SectionHeader
          id="tld-heading"
          eyebrow="Pricing"
          title="Extensions and first-year prices"
          lede="Standard registration prices. Premium names are priced by the registry and labelled as premium before checkout."
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tlds.map((t) => (
            <li
              key={t.tld}
              className="flex items-baseline justify-between gap-4 rounded-lg bg-surface p-4 ring-1 ring-inset ring-line"
            >
              <span>
                <span className="block font-mono text-body font-medium text-fg">
                  {t.tld}
                </span>
                {t.note && (
                  <span className="mt-0.5 block text-small text-fg-muted">
                    {t.note}
                  </span>
                )}
              </span>
              <span className="tabular shrink-0 text-body font-semibold text-fg">
                ${t.price.toFixed(2)}
                <span className="block text-right text-small font-normal text-fg-muted">
                  /yr
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section surface="subtle" labelledBy="included-heading">
        <SectionHeader
          id="included-heading"
          eyebrow="Every domain"
          title="What comes with the name"
          lede="The things some registrars charge extra for."
        />
        <dl className="mt-10 grid gap-8 sm:grid-cols-2">
          {INCLUDED.map(([term, detail]) => (
            <div key={term}>
              <dt className="text-body font-semibold text-fg">{term}</dt>
              <dd className="mt-1.5 text-small text-fg-secondary">{detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
