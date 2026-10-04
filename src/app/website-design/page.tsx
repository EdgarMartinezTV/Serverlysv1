import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { Migration } from "@/components/sections/migration";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { SeoMock, ChatMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, serviceGraph } from "@/lib/seo";
import { BakerySite } from "./_components/shots";

const PATH = "/website-design";
const DESCRIPTION =
  "Custom website design built to convert, hosted on Serverlys infrastructure, with the AI agent and analytics wired in from day one.";

export const metadata = pageMetadata({
  title: "Website Design — sites built to convert | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

export default function WebsiteDesignPage() {
  const faqs = faqsFor("/");

  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "Website design",
          serviceType: "Website design",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Website design", path: PATH }])} />
      <JsonLd data={faqGraph(faqs)} />

      <ProductHero
        eyebrow="Website design"
        title="A site that does a job"
        lede="Most small-business sites look fine and convert badly. We design around the two or three actions that actually matter to your business, then build the rest to support them."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Website design" }]}
        specs={[
          { label: "Built on", value: "Serverlys" },
          { label: "Includes", value: "Hosting" },
          { label: "Agent", value: "Optional" },
          { label: "Handover", value: "You own it" },
        ]}
        primary={{ label: "Start a project", href: billing.sales }}
        secondary={{ label: "See hosting", href: "/hosting" }}
        visual={<BakerySite />}
      />

      <FeatureGrid
        eyebrow="How we work"
        title="Design decisions with a reason behind them"
        lede="Every choice should trace back to something the business needs to happen."
        surface="light"
        columns={3}
        items={[
          { label: "Start with the action", detail: "Book, order, call or enquire — the page is built around it.", icon: "compass" },
          { label: "Fast by construction", detail: "Built on the same stack we host, so it is quick from day one.", icon: "gauge" },
          { label: "Accessible by default", detail: "Keyboard, contrast and semantics are not a later pass.", icon: "shield" },
          { label: "Content you can edit", detail: "WordPress if you want to change it yourself.", icon: "layout" },
          { label: "Measured", detail: "Analytics and search visibility wired in at launch.", icon: "chart" },
          { label: "You own the result", detail: "The site and the domain are yours, not licensed back.", icon: "book" },
        ]}
      />

      <ShowcaseSplit
        id="found"
        eyebrow="Getting found"
        title="A beautiful site nobody visits is a brochure"
        body="Technical SEO is part of the build, not an upsell afterwards: structure, speed, metadata and internal linking are done as the site is made."
        cta={{ label: "See SEO", href: "/seo" }}
        visual={<SeoMock />}
        side="right"
        surface="subtle"
      />

      <ShowcaseSplit
        id="agent"
        eyebrow="After launch"
        title="Someone has to answer the enquiries"
        body="A site that works generates questions. Add ConvoAI and they get answered in the moment rather than accumulating in an inbox."
        cta={{ label: "See ConvoAI", href: "/convoai" }}
        visual={<ChatMock />}
        side="left"
        surface="dark"
      />

      {/* Subtle, not the dark services-rail treatment: the ShowcaseSplit
          directly above this one is already `surface="dark"`, and two dark
          bands in a row erase the boundary between them. */}
      <Migration tone="subtle" />
      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
