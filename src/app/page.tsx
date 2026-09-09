import { Hero } from "@/components/home/hero";
import { PlanFinder } from "@/components/home/plan-finder";
import { SplitCards } from "@/components/home/split-cards";
import { ToolsTabs } from "@/components/home/tools-tabs";
import { Essentials } from "@/components/home/essentials";
import { AiBand } from "@/components/home/ai-band";
import { PricingBand } from "@/components/home/pricing-band";
import { TrustBar } from "@/components/sections/trust-bar";
import { Technology } from "@/components/sections/technology";
import { Migration } from "@/components/sections/migration";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph } from "@/lib/seo";
import { company } from "@/data/company";

export const metadata = pageMetadata({
  title: `${company.name} — ${company.tagline}`,
  description: company.description,
  path: "/",
});

/**
 * Homepage.
 *
 * Section order follows the reconstruction target:
 *   hero + domain search → guarantees → plan finder → offer/product pair →
 *   tabbed showcase → essentials grid → dark AI band → pricing →
 *   infrastructure → migration → FAQ → closing CTA.
 *
 * Conversion objective is unchanged: plan selection, or a domain search at the
 * top of the funnel.
 */
export default function HomePage() {
  const faqs = faqsFor("/");

  return (
    <>
      <JsonLd data={faqGraph(faqs)} />

      <Hero />
      <TrustBar />
      <PlanFinder />
      <SplitCards />
      <ToolsTabs />
      <Essentials />
      <AiBand />
      <PricingBand />
      <Technology />
      <Migration />
      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
