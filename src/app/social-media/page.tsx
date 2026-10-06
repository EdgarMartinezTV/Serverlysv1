import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { ChatMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { SocialPlanner } from "../website-design/_components/shots";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

const PATH = "/social-media";
const DESCRIPTION =
  "Social media planning, content and scheduling handled for you — in a voice that sounds like your business rather than a marketing department.";

export const metadata = pageMetadata({
  title: "Social Media Management | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

export default function SocialMediaPage() {
  const faqs = faqsFor("/");
  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "Social media management",
          serviceType: "Social media management",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd data={faqGraph(faqs, "/social-media")} />
      <ProductHero
        eyebrow="Social media"
        title="Show up without it eating your week"
        lede="The hard part is not writing one post. It is writing the ninetieth while running the business. We plan, produce and schedule; you approve."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Social media" }]}
        specs={[
          { label: "Cadence", value: "Weekly" },
          { label: "Approval", value: "Yours" },
          { label: "Channels", value: "Where you are" },
          { label: "Contract", value: "Rolling" },
        ]}
        primary={{ label: "Talk about your channels", href: billing.sales }}
        secondary={{ label: "See marketing", href: "/marketing" }}
        visual={<SocialPlanner />}
      />
      <FeatureGrid
        eyebrow="How it works"
        title="Planned, not improvised"
        surface="light"
        columns={3}
        items={[
          { label: "A plan you can see", detail: "Next month's posts, before the month starts.", icon: "book" },
          { label: "Your voice", detail: "Written to sound like you, not like an agency.", icon: "chat" },
          { label: "You approve", detail: "Nothing publishes without a sign-off.", icon: "shield" },
          { label: "Scheduled", detail: "Posted at the times your audience is actually there.", icon: "compass" },
          { label: "Replies handled", detail: "Comments and messages answered, not left sitting.", icon: "lifebuoy" },
          { label: "Reported", detail: "What reached people, and what it led to.", icon: "chart" },
        ]}
      />
      <ShowcaseSplit
        id="dm"
        eyebrow="The messages"
        title="Most social enquiries arrive as a DM"
        body="And they arrive in the evening. An agent can answer the routine ones immediately so the enquiry does not go cold before morning."
        cta={{ label: "See ConvoAI", href: "https://convoai.cloud/" }}
        visual={<ChatMock />}
        side="right"
        surface="dark"
      />
      <FaqSection items={faqs} />
      <FinalCta />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Social media", path: PATH }]} />
    </>
  );
}
