import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { SeoMock, ChatMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, serviceGraph } from "@/lib/seo";

const PATH = "/marketing";
const DESCRIPTION =
  "Marketing judged on enquiries and orders rather than impressions — search, email and the channels that actually work for small businesses.";

export const metadata = pageMetadata({
  title: "Marketing — measured in enquiries, not clicks | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

export default function MarketingPage() {
  const faqs = faqsFor("/");
  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "Digital marketing",
          serviceType: "Digital marketing",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Marketing", path: PATH }])} />
      <JsonLd data={faqGraph(faqs)} />
      <ProductHero
        eyebrow="Marketing"
        title="Judged on enquiries, not impressions"
        lede="Reach is easy to buy and easy to report. We measure the things that change the business: enquiries received, orders placed, and what each one cost."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Marketing" }]}
        specs={[
          { label: "Measured on", value: "Enquiries" },
          { label: "Channels", value: "Search + email" },
          { label: "Reporting", value: "Monthly" },
          { label: "Contract", value: "Rolling" },
        ]}
        primary={{ label: "Talk about your goals", href: billing.sales }}
        secondary={{ label: "See SEO", href: "/seo" }}
        visual={<SeoMock />}
      />
      <FeatureGrid
        eyebrow="What we run"
        title="Fewer channels, done properly"
        lede="Most small businesses do better with two channels run well than six run thinly."
        surface="light"
        columns={3}
        items={[
          { label: "Search", detail: "Earned rankings for terms with buying intent.", icon: "compass" },
          { label: "Email", detail: "To people who already know you — the cheapest channel you own.", icon: "mail" },
          { label: "Landing pages", detail: "Built for one action, not a general brochure.", icon: "layout" },
          { label: "Tracking that works", detail: "So you can tell which channel produced the order.", icon: "chart" },
          { label: "Content", detail: "Pages that answer real questions and rank on them.", icon: "book" },
          { label: "Honest reporting", detail: "Including the months that did not work.", icon: "shield" },
        ]}
      />
      <ShowcaseSplit
        id="capture"
        eyebrow="After the click"
        title="Traffic you do not answer is wasted spend"
        body="Getting someone to the site is the expensive part. An agent that answers immediately is often the cheapest improvement available to a campaign."
        cta={{ label: "See ConvoAI", href: "/convoai" }}
        visual={<ChatMock />}
        side="left"
        surface="dark"
        bleed
      />
      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
