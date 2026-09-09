import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { Migration } from "@/components/sections/migration";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Section, SectionHeader } from "@/components/ui/section";
import { PricingTable } from "@/components/pricing/pricing-table";
import { JsonLd } from "@/components/ui/json-ld";
import { HostingMock, SitePreviewMock, AutomationMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { groupById, formatPrice } from "@/data/pricing";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, productGraph } from "@/lib/seo";

const PATH = "/wordpress-hosting";
const DESCRIPTION =
  "Managed WordPress hosting with server-level LiteSpeed caching, automatic core updates and free migration. Renewal pricing published beside the first-year price.";

const group = groupById("wordpress");
const prices = group?.plans.map((p) => p.annual) ?? [0];

export const metadata = pageMetadata({
  title: `WordPress Hosting — managed plans from ${formatPrice(Math.min(...prices))}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

export default function WordPressHostingPage() {
  const faqs = faqsFor(PATH);

  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "WordPress hosting", path: PATH }])} />
      <JsonLd
        data={productGraph({
          name: "Serverlys WordPress Hosting",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
        })}
      />
      <JsonLd data={faqGraph(faqs)} />

      <ProductHero
        eyebrow="WordPress hosting"
        title="WordPress, already tuned"
        lede="Caching configured at server level, core updates applied for you, and a nightly backup that restores in one click when a plugin misbehaves."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "WordPress hosting" }]}
        specs={[
          { label: "From", value: `${formatPrice(Math.min(...prices))}/mo` },
          { label: "Cache", value: "LiteSpeed" },
          { label: "Core updates", value: "Automatic" },
          { label: "Migration", value: "Free" },
        ]}
        primary={{ label: "Choose a plan", href: "#plans" }}
        secondary={{ label: "Move my site", href: billing.sales }}
        visual={<SitePreviewMock />}
      />

      <FeatureGrid
        eyebrow="Managed for you"
        title="The maintenance nobody remembers to do"
        lede="A WordPress site does not usually fail because of hosting. It fails because something was not updated, or a backup was never tested."
        surface="light"
        columns={3}
        items={[
          { label: "Core updates", detail: "Applied for you, then the site is checked for a render.", icon: "bolt" },
          { label: "Plugin control stays yours", detail: "We do not push plugin updates — that is how working sites break.", icon: "wrench" },
          { label: "Nightly backups", detail: "Restore in a click. Free, and no support ticket.", icon: "shield" },
          { label: "LiteSpeed cache", detail: "Server-level, not a plugin you have to configure.", icon: "gauge" },
          { label: "Free SSL", detail: "Issued and renewed automatically.", icon: "shield" },
          { label: "Staging first", detail: "Migrations land on a staging URL you approve.", icon: "compass" },
        ]}
      />

      <ShowcaseSplit
        id="resources"
        eyebrow="Under the hood"
        title="You can see what the site is doing"
        body="Resource use, security posture and every backup are visible in the panel — not hidden behind a support request. When a plugin starts eating memory, you can tell."
        points={[
          { label: "Live resource use", detail: "CPU, memory and storage, per site.", icon: "gauge" },
          { label: "Security at a glance", detail: "Certificate status, malware scan, firewall.", icon: "shield" },
          { label: "Restore points", detail: "Every nightly backup, ready to roll back.", icon: "book" },
        ]}
        cta={{ label: "See what is included", href: "/hosting" }}
        visual={<HostingMock />}
        side="right"
        surface="subtle"
        bleed
      />

      <ShowcaseSplit
        id="automation"
        eyebrow="Beyond hosting"
        title="Let the site answer for itself"
        body="Add ConvoAI and the enquiries arriving through your WordPress contact form get answered, qualified and recorded — instead of sitting in an inbox until Monday."
        cta={{ label: "See AI agents", href: "/ai-agents" }}
        visual={<AutomationMock />}
        side="left"
        surface="dark"
      />

      <Section id="plans" labelledBy="plans-heading" spacing="base">
        <SectionHeader
          id="plans-heading"
          eyebrow="Plans"
          title="WordPress hosting pricing"
          lede="Every tier shows what it renews at, next to what it costs today."
          align="center"
        />
        <div className="mt-12">
          <PricingTable only="wordpress" />
        </div>
      </Section>

      <Migration />
      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
