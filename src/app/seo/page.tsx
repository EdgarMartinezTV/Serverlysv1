import { JsonLd } from "@/components/ui/json-ld";
import { faqsFor } from "@/data/faqs";
import { formatSeoPrice, seoFromPrice, seoOrderUrl, seoPlans } from "@/data/seo-plans";
import { canonical, pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { Hero } from "./_components/hero";
import {
  Faqs,
  Features,
  HowItWorks,
  NavyBand,
  PhotoCta,
  Pricing,
  Promises,
  Related,
  Tools,
  TrustBar,
  UseCases,
} from "./_components/retell";

const PATH = "/seo";
const DESCRIPTION = `SEO services for small businesses: keyword research, local SEO, Google Business Profile, technical fixes, link building and monthly reports. From ${formatSeoPrice(seoFromPrice)}/mo.`;

export const metadata = pageMetadata({
  title: `SEO Services for Small Business | From ${formatSeoPrice(seoFromPrice)}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

/**
 * Service schema with the real plan prices as an OfferCatalog, so the page
 * can surface as a priced service. Prices come from data/seo-plans.ts (the
 * WHMCS store) — the same array the plan cards render.
 */
function seoServiceGraph() {
  const base = serviceGraph({
    name: "SEO services for small businesses",
    serviceType: "Search engine optimization",
    description: DESCRIPTION,
    path: PATH,
  });
  return {
    ...base,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "SEO plans",
      itemListElement: seoPlans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        description: plan.summary,
        url: seoOrderUrl(plan),
        price: plan.price.toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: plan.price.toFixed(2),
          priceCurrency: "USD",
          unitCode: "MON",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: 1,
            unitCode: "MON",
          },
        },
        itemOffered: { "@type": "Service", name: plan.name, url: canonical(PATH) },
      })),
    },
  };
}

/** Section order and rationale: see ./_components/retell.tsx and ./_components/hero.tsx. */
export default function SeoPage() {
  const faqs = faqsFor(PATH);
  return (
    <>
      <JsonLd data={seoServiceGraph()} />
      <JsonLd data={faqGraph(faqs, PATH)} />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <UseCases />
      <NavyBand />
      <Promises />
      <Features />
      <Tools />
      <Pricing />
      <Faqs items={faqs} />
      <Related />
      <PhotoCta />
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "SEO services", path: PATH },
        ]}
      />
    </>
  );
}
