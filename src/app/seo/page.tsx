import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { SeoMock, HostingMock, SitePreviewMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph } from "@/lib/seo";

const PATH = "/seo";
const DESCRIPTION =
  "Technical and content SEO for small businesses: fix what is broken, earn the terms that bring buyers, and report honestly on what changed.";

export const metadata = pageMetadata({
  title: "SEO — get found by people ready to buy | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

export default function SeoPage() {
  const faqs = faqsFor("/");
  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "SEO", path: PATH }])} />
      <JsonLd data={faqGraph(faqs)} />
      <ProductHero
        eyebrow="SEO"
        title="Rank for the searches that end in an order"
        lede="Position one for a term nobody buys on is worth nothing. We go after the searches with intent behind them, and fix the technical problems stopping you from ranking at all."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "SEO" }]}
        specs={[
          { label: "Starts with", value: "An audit" },
          { label: "Reporting", value: "Monthly" },
          { label: "Approach", value: "White hat" },
          { label: "Claims", value: "No rank promises" },
        ]}
        primary={{ label: "Request an audit", href: billing.sales }}
        secondary={{ label: "See website design", href: "/website-design" }}
        visual={<SeoMock />}
      />
      <FeatureGrid
        eyebrow="What we work on"
        title="Three things, in this order"
        lede="Technical problems first — content cannot rank on a site search engines struggle to read."
        surface="light"
        columns={3}
        items={[
          { label: "Technical", detail: "Crawlability, speed, structured data, broken links.", icon: "wrench" },
          { label: "Content", detail: "Pages that answer what people actually search for.", icon: "book" },
          { label: "Authority", detail: "Earned mentions, not bought links.", icon: "chart" },
          { label: "Core Web Vitals", detail: "Measured on real hardware, not a lab score.", icon: "gauge" },
          { label: "Local", detail: "Where a physical location genuinely matters.", icon: "compass" },
          { label: "Honest reporting", detail: "What moved, what did not, and why.", icon: "shield" },
        ]}
      />
      <ShowcaseSplit
        id="speed"
        eyebrow="Speed is technical SEO"
        title="A slow site loses twice"
        body="It ranks worse and converts worse. Hosting is part of the fix, which is why we start by looking at what the server is doing before rewriting anything."
        cta={{ label: "See hosting", href: "/hosting" }}
        visual={<HostingMock />}
        side="right"
        surface="subtle"
        bleed
      />
      <ShowcaseSplit
        id="pages"
        eyebrow="The pages themselves"
        title="Built to be found, not retrofitted"
        body="When we build the site, the structure, metadata and internal linking are done as part of the build. Retrofitting SEO onto a finished site is always more expensive."
        cta={{ label: "See website design", href: "/website-design" }}
        visual={<SitePreviewMock />}
        side="left"
        surface="dark"
      />
      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
