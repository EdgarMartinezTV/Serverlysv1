import { ProductHero } from "@/components/sections/product-hero";
import { ProductFit } from "@/components/sections/product-fit";
import { Included } from "@/components/sections/included";
import { Migration } from "@/components/sections/migration";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { PricingTable } from "@/components/pricing/pricing-table";
import { Section, SectionHeader } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/json-ld";
import { billing } from "@/data/company";
import { groupById, formatPrice } from "@/data/pricing";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, productGraph } from "@/lib/seo";

const PATH = "/cloud-hosting";

/**
 * Cloud hosting product page.
 *
 * Conversion objective: plan selection. The visitor arriving here has usually
 * already decided they want cloud, or is deciding between cloud and something
 * else — so the page qualifies (hero specs, honest comparison), substantiates
 * (what is included), prices, then removes the switching objection.
 *
 * Sections omitted deliberately:
 *  · Social proof — no genuine testimonials exist. The legacy site's are
 *    invented brands, and fabricated proof on a trust page is worse than none.
 *  · Competitor comparison — unverifiable, and it ages badly. The comparison
 *    here is against our own range, which is checkable and more useful.
 */
const cloud = groupById("cloud");
const prices = cloud?.plans.map((p) => p.annual) ?? [0];
const low = Math.min(...prices);
const high = Math.max(...prices);

const TITLE = "Cloud Hosting — auto-scaling plans from " + formatPrice(low) + "/mo";
const DESCRIPTION =
  "Auto-scaling cloud hosting with free migration, free SSL, daily backups and unmetered transfer. Renewal pricing shown next to introductory pricing.";

export const metadata = pageMetadata({
  title: `${TITLE} | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

// Two levels only. An intermediate "Hosting" crumb would have to point at
// /pricing, which is not built yet — a breadcrumb to a 404 is worse than a
// shorter trail. Restore the middle crumb when that page ships.
const BREADCRUMB = [
  { name: "Home", path: "/" },
  { name: "Cloud hosting", path: PATH },
];

export default function CloudHostingPage() {
  const faqs = faqsFor(PATH);
  const turbo = cloud?.plans.find((p) => p.popular);

  return (
    <>
      <JsonLd data={breadcrumbGraph(BREADCRUMB)} />
      <JsonLd
        data={productGraph({
          name: "Serverlys Cloud Hosting",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: low,
          highPrice: high,
        })}
      />
      <JsonLd data={faqGraph(faqs)} />

      <ProductHero
        eyebrow="Cloud hosting"
        title="Servers that grow with your traffic"
        lede="Auto-scaling infrastructure for sites whose traffic moves. A spike absorbs into the plan instead of throttling your site or producing a surprise invoice."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Cloud hosting" }]}
        specs={[
          { label: "From", value: `${formatPrice(low)}/mo` },
          { label: "Storage", value: "Unlimited NVMe" },
          { label: "Transfer", value: "Unmetered" },
          { label: "Migration", value: "Free" },
        ]}
        primary={{ label: "Choose a plan", href: "#plans" }}
        secondary={{ label: "Talk to an expert", href: billing.sales }}
      />

      <ProductFit />
      <Included />

      <Section id="plans" labelledBy="plans-heading" spacing="base">
        <SectionHeader
          id="plans-heading"
          eyebrow="Plans"
          title="Cloud hosting pricing"
          lede={
            turbo
              ? `Every tier shows what it renews at. ${turbo.name} is the usual choice — ${formatPrice(turbo.annual)}/mo now, ${formatPrice(turbo.renewal)}/mo from year two.`
              : "Every tier shows what it renews at."
          }
          align="center"
        />
        <div className="mt-12">
          <PricingTable only="cloud" />
        </div>
      </Section>

      <Migration />
      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
