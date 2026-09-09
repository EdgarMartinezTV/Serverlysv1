import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Container } from "@/components/ui/container";
import { DomainSearchApp } from "@/components/domain/domain-search-app";
import { JsonLd } from "@/components/ui/json-ld";
import { DomainMock, SitePreviewMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { tlds, cheapestTld } from "@/data/tlds";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, productGraph } from "@/lib/seo";

const PATH = "/domain-name";
const DESCRIPTION =
  "Search and register a domain name with free WHOIS privacy, DNS management included and renewal rates published up front. Availability read live from the registry.";

export const metadata = pageMetadata({
  title: `Domain Names — register from $${cheapestTld.price.toFixed(2)}/yr | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

export default function DomainNamePage() {
  const faqs = faqsFor("/register-domain");
  const prices = tlds.map((t) => t.price);

  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Domain names", path: PATH }])} />
      <JsonLd
        data={productGraph({
          name: "Serverlys Domain Registration",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
        })}
      />
      <JsonLd data={faqGraph(faqs)} />

      <ProductHero
        eyebrow="Domains"
        title="The name comes first"
        lede="Availability read live from the registry, free WHOIS privacy on everything we register, and DNS management included rather than sold back to you."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Domain names" }]}
        specs={[
          { label: "From", value: `$${cheapestTld.price.toFixed(2)}/yr` },
          { label: "WHOIS privacy", value: "Free" },
          { label: "DNS", value: "Included" },
          { label: "Availability", value: "Live" },
        ]}
        primary={{ label: "Search a name", href: "#search" }}
        secondary={{ label: "Transfer a domain", href: `${billing.root}/cart.php?a=add&domain=transfer` }}
        visual={<DomainMock />}
      />

      {/* The real search, not a picture of one. */}
      <section id="search" className="border-b border-line bg-canvas-secondary">
        <Container className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-caption uppercase text-primary">Search</span>
            <h2 className="mt-4 text-h2 text-fg">Find out if it is free</h2>
            <p className="mx-auto mt-4 max-w-md text-body-lg text-fg-secondary">
              Checked against the registry, not a guess.
            </p>
          </div>
          <div className="mt-10">
            <DomainSearchApp />
          </div>
        </Container>
      </section>

      <FeatureGrid
        eyebrow="Every domain"
        title="What comes with the name"
        lede="The things some registrars price separately."
        surface="light"
        columns={4}
        items={[
          { label: "WHOIS privacy", detail: "Your details stay out of the public record, free.", icon: "shield" },
          { label: "DNS management", detail: "Records, subdomains and redirects included.", icon: "wrench" },
          { label: "Auto-renew off by default", detail: "Nothing renews silently without your say-so.", icon: "book" },
          { label: "Published renewal rates", detail: "Year two is on the page, not in the terms.", icon: "chart" },
        ]}
      />

      <ShowcaseSplit
        id="site"
        eyebrow="Then the site"
        title="A name is not a website yet"
        body="Point it at hosting you already have, or let us build the site behind it. Annual hosting plans include the first year of the domain."
        cta={{ label: "See website design", href: "/website-design" }}
        visual={<SitePreviewMock />}
        side="left"
        surface="subtle"
      />

      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
