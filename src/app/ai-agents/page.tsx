import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { ChatMock, CallMock, AutomationMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

const PATH = "/ai-agents";
const DESCRIPTION =
  "Serverlys AI agents answer your customers in chat and on the phone, capture the lead, book the appointment and hand the rest to a person.";

export const metadata = pageMetadata({
  title: "AI Agents for Small Business — Chat & Phone | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

/** The AI hub: what the agents do end to end, and where each product fits. */
export default function AiAgentsPage() {
  const faqs = faqsFor(PATH);

  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "AI agents for customer chat and calls",
          serviceType: "AI customer service agent",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd data={faqGraph(faqs, "/ai-agents")} />

      <ProductHero
        eyebrow="AI agents"
        title="The enquiry that arrives at 2am"
        lede="Most enquiries are routine and most arrive when nobody is there. Serverlys agents answer them in the moment, capture what matters, and escalate the ones that need you."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "AI agents" }]}
        specs={[
          { label: "Chat", value: "ConvoAI" },
          { label: "Voice", value: "CallFlow" },
          { label: "Handover", value: "To a person" },
          { label: "Trained on", value: "Your site" },
        ]}
        primary={{ label: "See ConvoAI", href: "/convoai" }}
        secondary={{ label: "Talk to us", href: billing.sales }}
        visual={<ChatMock />}
      />

      <FeatureGrid
        eyebrow="End to end"
        title="Answer, qualify, capture, hand over"
        lede="An agent that only answers is a search box. The value is in what happens after the answer."
        surface="light"
        columns={4}
        items={[
          { label: "Answer", detail: "Hours, delivery, pricing, availability — in the moment.", icon: "chat" },
          { label: "Qualify", detail: "Work out what the person actually needs.", icon: "compass" },
          { label: "Capture", detail: "Name, contact and intent recorded, not lost.", icon: "book" },
          { label: "Hand over", detail: "Anything unusual reaches a person, with context.", icon: "lifebuoy" },
        ]}
      />

      <ShowcaseSplit
        id="chat"
        eyebrow="ConvoAI"
        title="Chat that ends in a booking"
        body="It reads your site, learns your business, and answers in your tone. When the conversation turns into an order or a booking, it records it and tells you."
        points={[
          { label: "Trained on your site", detail: "Answers about your business, not the internet's.", icon: "sparkles" },
          { label: "Captures the lead", detail: "Name, need and contact land in the panel and your inbox.", icon: "book" },
          { label: "Knows when to stop", detail: "Refunds and complaints go to a person, with the transcript.", icon: "lifebuoy" },
        ]}
        cta={{ label: "See ConvoAI", href: "/convoai" }}
        visual={<ChatMock />}
        side="right"
        surface="subtle"
        bleed
      />

      <ShowcaseSplit
        id="voice"
        eyebrow="CallFlow"
        title="The phone still rings"
        body="A missed call is a lost customer far more often than a missed email. CallFlow answers, handles the routine, and takes a proper message when it cannot."
        cta={{ label: "See CallFlow", href: "/callflow-ai" }}
        visual={<div className="flex justify-center"><CallMock /></div>}
        side="left"
        surface="dark"
      />

      <ShowcaseSplit
        id="automation"
        eyebrow="Automations"
        title="What happens after the conversation"
        body="The agent is a trigger. What follows — creating the record, notifying the right person, adding it to the calendar — runs as a workflow you can see and change."
        cta={{ label: "See automations", href: "/automations" }}
        visual={<AutomationMock />}
        side="right"
        surface="dark"
      />

      <FaqSection items={faqs} />
      <FinalCta />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "AI agents", path: PATH }]} />
    </>
  );
}
