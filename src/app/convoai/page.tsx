import { ProductHero } from "@/components/sections/product-hero";
import { ConvoAiLogo } from "@/components/layout/convoai-logo";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { ConvoChat } from "@/components/product-ui/live/convo-chat";
import { AutomationMock, SitePreviewMock } from "@/components/product-ui/mocks";
import { billing, sisterProducts } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, serviceGraph } from "@/lib/seo";

const PATH = "/convoai";
const DESCRIPTION =
  "ConvoAI is the Serverlys AI chatbot: trained on your own site, it answers customers around the clock, captures the lead and hands the rest to a person.";

export const metadata = pageMetadata({
  title: "AI Chatbot for Your Business — ConvoAI | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

export default function ConvoAiPage() {
  const faqs = faqsFor(PATH);
  const convo = sisterProducts.find((p) => p.name === "ConvoAI");

  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "ConvoAI — AI chatbot",
          serviceType: "AI chatbot",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "ConvoAI", path: PATH }])} />
      <JsonLd data={faqGraph(faqs)} />

      <ProductHero
        eyebrow="ConvoAI"
        eyebrowSlot={
          <ConvoAiLogo tone="light" decorative={false} className="h-9 w-auto" />
        }
        title="An AI chatbot that answers before you wake up"
        lede="An AI chatbot trained on your own site. It handles the questions that make up most of your volume, and it knows which ones it should not attempt."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "AI agents", href: "/ai-agents" }, { name: "ConvoAI" }]}
        specs={[
          { label: "Trained on", value: "Your website" },
          { label: "Captures", value: "Name + intent" },
          { label: "Escalates", value: "With transcript" },
          { label: "Runs", value: "Continuously" },
        ]}
        primary={{ label: "Open ConvoAI", href: convo?.href ?? billing.sales }}
        secondary={{ label: "Ask what it can do", href: billing.sales }}
        visual={<ConvoChat tone="light" />}
      />

      <FeatureGrid
        eyebrow="How it behaves"
        title="Useful, and honest about its limits"
        lede="An agent that bluffs costs more than one that says it will fetch a person."
        surface="light"
        columns={3}
        items={[
          { label: "Grounded in your site", detail: "It reads your pages, so answers match what you publish.", icon: "book" },
          { label: "Says when it does not know", detail: "No invented policies, no guessed prices.", icon: "shield" },
          { label: "Introduces itself", detail: "Customers are told they are talking to an assistant.", icon: "chat" },
          { label: "Captures the detail", detail: "The order, the date, the contact — written down.", icon: "compass" },
          { label: "Hands over cleanly", detail: "A person receives the full conversation, not a summary.", icon: "lifebuoy" },
          { label: "Works with automations", detail: "The conversation can start a workflow.", icon: "bolt" },
        ]}
      />

      <ShowcaseSplit
        id="site"
        eyebrow="On your site"
        title="It lives where your customers already are"
        body="It sits on the site you already have — WordPress, a store, or a site we built — and needs no change to how the rest of the page works."
        cta={{ label: "See website design", href: "/website-design" }}
        visual={<SitePreviewMock />}
        side="left"
        surface="subtle"
      />

      <ShowcaseSplit
        id="after"
        eyebrow="After the chat"
        title="The conversation becomes a record"
        body="A finished conversation triggers the workflow: the record is created, the right person is notified, and the booking reaches the calendar."
        cta={{ label: "See automations", href: "/automations" }}
        visual={<AutomationMock />}
        side="right"
        surface="dark"
        bleed
      />

      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
