import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { Migration } from "@/components/sections/migration";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { PricingTable } from "@/components/pricing/pricing-table";
import { Section, SectionHeader } from "@/components/ui/section";
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
 * Conversion objective: plan selection. Every section either moves toward that
 * (hero, plans, final CTA) or removes a specific objection blocking it
 * (trust bar = risk, migration = downtime fear, FAQ = price/refund doubt).
 * There is no section here that exists only because landing pages have one.
 */
export default function HomePage() {
  const faqs = faqsFor("/");

  return (
    <>
      <JsonLd data={faqGraph(faqs)} />

      <Hero />
      <TrustBar />

      <Section id="plans" labelledBy="plans-heading" spacing="base">
        <SectionHeader
          id="plans-heading"
          eyebrow="Plans"
          title="Simple, honest pricing"
          lede="Pick the workload, not the marketing tier. Every plan shows what it renews at."
          align="center"
        />
        <div className="mt-12">
          <PricingTable />
        </div>
      </Section>

      <Migration />
      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
