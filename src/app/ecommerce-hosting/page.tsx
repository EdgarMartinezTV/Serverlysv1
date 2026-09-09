import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { Migration } from "@/components/sections/migration";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Section, SectionHeader } from "@/components/ui/section";
import { PricingTable } from "@/components/pricing/pricing-table";
import { JsonLd } from "@/components/ui/json-ld";
import { HostingMock, SitePreviewMock, ChatMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { groupById, formatPrice } from "@/data/pricing";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, productGraph } from "@/lib/seo";

const PATH = "/ecommerce-hosting";
const DESCRIPTION =
  "WooCommerce-ready hosting built for checkout speed under load, with free migration to staging, daily backups and renewal pricing shown up front.";

const group = groupById("ecommerce");
const prices = group?.plans.map((p) => p.annual) ?? [0];

export const metadata = pageMetadata({
  title: `Ecommerce Hosting — WooCommerce from ${formatPrice(Math.min(...prices))}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

export default function EcommerceHostingPage() {
  const faqs = faqsFor(PATH);

  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Ecommerce hosting", path: PATH }])} />
      <JsonLd
        data={productGraph({
          name: "Serverlys Ecommerce Hosting",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
        })}
      />
      <JsonLd data={faqGraph(faqs)} />

      <ProductHero
        eyebrow="Ecommerce hosting"
        title="Checkout that holds up on your best day"
        lede="Store pages cache badly by nature — a cart cannot be served from cache. What matters is a database that stays responsive while orders land together."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Ecommerce hosting" }]}
        specs={[
          { label: "From", value: `${formatPrice(Math.min(...prices))}/mo` },
          { label: "Built for", value: "WooCommerce" },
          { label: "Transfer", value: "Unmetered" },
          { label: "Backups", value: "Daily" },
        ]}
        primary={{ label: "Choose a plan", href: "#plans" }}
        secondary={{ label: "Move my store", href: billing.sales }}
        visual={<SitePreviewMock />}
      />

      <FeatureGrid
        eyebrow="Built for stores"
        title="Where a store actually slows down"
        lede="It is rarely the homepage. It is the cart, the checkout and the admin while an import is running."
        surface="light"
        columns={3}
        items={[
          { label: "Uncached paths stay fast", detail: "Cart and checkout are never served from cache — they need real headroom.", icon: "gauge" },
          { label: "Database headroom", detail: "Concurrent orders hit the database, not the page cache.", icon: "server" },
          { label: "No transfer overage", detail: "A campaign that works does not produce a surprise invoice.", icon: "chart" },
          { label: "Daily backups", detail: "Restore a store to this morning, free.", icon: "shield" },
          { label: "Free SSL", detail: "Required for payments, included and auto-renewed.", icon: "shield" },
          { label: "Staged migration", detail: "Place a test order on staging before anything cuts over.", icon: "compass" },
        ]}
      />

      <ShowcaseSplit
        id="resources"
        eyebrow="Visibility"
        title="See the load before your customers do"
        body="Resource use and security posture are in the panel, per store. When an import or a campaign is pushing the database, you can see it rather than infer it from complaints."
        cta={{ label: "See what is included", href: "/hosting" }}
        visual={<HostingMock />}
        side="right"
        surface="subtle"
        bleed
      />

      <ShowcaseSplit
        id="support"
        eyebrow="Fewer abandoned carts"
        title="Answer the question that stops the order"
        body="Most abandoned carts are a question nobody answered: delivery, sizing, returns. ConvoAI answers those in the moment and passes the rest to a person."
        cta={{ label: "See ConvoAI", href: "https://convoai.cloud/", external: true }}
        visual={<ChatMock />}
        side="left"
        surface="dark"
      />

      <Section id="plans" labelledBy="plans-heading" spacing="base">
        <SectionHeader
          id="plans-heading"
          eyebrow="Plans"
          title="Ecommerce hosting pricing"
          lede="Every tier shows what it renews at, next to what it costs today."
          align="center"
        />
        <div className="mt-12">
          <PricingTable only="ecommerce" />
        </div>
      </Section>

      <Migration />
      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
