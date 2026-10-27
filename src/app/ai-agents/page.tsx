import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { TextButtonBand } from "@/components/sections/text-button-band";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { ChatMock, AutomationMock } from "@/components/product-ui/mocks";
import { ConvoChat } from "@/components/product-ui/live/convo-chat";
import { CallFlowConsole } from "@/components/product-ui/live/callflow-console";
import { PanelCard, PricingPanel, INK, MUTED } from "@/components/retell/kit";
import { billing } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { aiAgentPlans, convoPro, formatAgentPrice } from "@/data/ai-agent-plans";
import { canonical, pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

/**
 * /ai-agents — the AI hub. Expanded 2026-10-26 from ~620 words into the full
 * hub: how it works, channels, voice, handover, use cases, plans and ten FAQs.
 *
 * Prices and tier contents come from data/ai-agent-plans.ts (sources and
 * as-of date are recorded there); nothing on this page restates a figure by
 * hand. FAQs live in data/faqs.ts under the "/ai-agents" scope and feed both
 * the accordion and the FAQPage schema, so the two cannot drift apart.
 *
 * Facts rules for this page: no testimonials, ratings, customer counts or
 * results; features only as the live convoai.cloud and callflow.serverlys.com
 * pages state them; global brand, no local targeting.
 */

const PATH = "/ai-agents";
const PRO = formatAgentPrice(convoPro.monthly ?? 0);
const DESCRIPTION = `AI agents that answer customers in chat, WhatsApp, email and by phone, capture the lead and hand off to a person. Included with hosting; Pro is ${PRO}/month.`;

export const metadata = pageMetadata({
  title: "AI Agents for Small Business — Chat & Phone | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

const PLAN_ICON = {
  essentials: "layout",
  pro: "growth",
  enterprise: "building",
  callflow: "phone",
} as const;

/** Offers only for plans with a published price. Quoted plans get none. */
function agentServiceGraph() {
  const priced = aiAgentPlans.filter((p) => p.monthly !== null);
  return {
    ...serviceGraph({
      name: "AI agents for customer chat and calls",
      serviceType: "AI customer service agent",
      description: DESCRIPTION,
      path: PATH,
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "ConvoAI plans",
      itemListElement: priced.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.summary,
        price: (p.monthly ?? 0).toFixed(2),
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: (p.monthly ?? 0).toFixed(2),
          priceCurrency: "USD",
          unitCode: "MON",
        },
        itemOffered: { "@type": "Service", name: p.name, url: canonical(PATH) },
      })),
    },
  };
}

export default function AiAgentsPage() {
  const faqs = faqsFor(PATH);

  return (
    <>
      <JsonLd data={agentServiceGraph()} />
      <JsonLd data={faqGraph(faqs, PATH)} />

      <ProductHero
        eyebrow="AI agents"
        title="The enquiry that arrives at 2am"
        lede="Most enquiries are routine and most arrive when nobody is there. Serverlys agents answer them in the moment — in the chat on your website, on WhatsApp, by email and on the phone — capture what matters, and escalate the ones that need you."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "AI agents" }]}
        specs={[
          { label: "Chat", value: "ConvoAI" },
          { label: "Voice", value: "CallFlow" },
          { label: "Handover", value: "To a person" },
          { label: "Chat from", value: "$0 with hosting" },
        ]}
        primary={{ label: "See plans", href: "#plans" }}
        secondary={{ label: "Talk to us", href: billing.sales }}
        visual={<ChatMock />}
      />

      <FeatureGrid
        eyebrow="End to end"
        title="Answer, qualify, capture, hand over"
        lede="An agent that only answers is a search box. The value is in what happens after the answer: the customer gets what they came for, and you get a record of who they are and what they need."
        surface="light"
        columns={4}
        items={[
          { label: "Answer", detail: "Hours, delivery, pricing, availability — in the moment, in the customer’s language.", icon: "chat" },
          { label: "Qualify", detail: "Work out what the person actually needs before anyone on your team spends time on it.", icon: "compass" },
          { label: "Capture", detail: "Name, contact and intent saved to the built-in CRM contacts, not lost in a chat log.", icon: "book" },
          { label: "Hand over", detail: "Anything unusual reaches a person in the same inbox, with the conversation attached.", icon: "lifebuoy" },
        ]}
      />

      <FeatureGrid
        id="how-it-works"
        eyebrow="How it works"
        title="Live on your website without a developer"
        lede="Website chat is where most customers start, so it is where ConvoAI starts. Setting it up is four steps, and none of them needs code."
        surface="subtle"
        columns={4}
        items={[
          {
            label: "1. Add it to your site",
            detail: "Paste one script tag from the ConvoAI dashboard into your website. On Serverlys hosting, your ConvoAI account is created when the hosting goes live.",
            icon: "layout",
          },
          {
            label: "2. Give it your content",
            detail: "Write quick answers for the questions you hear every day. On Pro, upload your documents to the knowledge base and the agent answers from them.",
            icon: "book",
          },
          {
            label: "3. Decide where it stops",
            detail: "Choose what the agent should never answer alone — refunds, complaints, anything unusual — and the message it gives before it connects a person.",
            icon: "lifebuoy",
          },
          {
            label: "4. Add channels when you are ready",
            detail: "The website chat works on its own. When you want more, Pro puts the same agent on WhatsApp and email, and CallFlow answers the phone.",
            icon: "bolt",
          },
        ]}
      />

      <ShowcaseSplit
        id="chat"
        eyebrow="ConvoAI · website chat"
        title="Chat that ends in a booking"
        body="ConvoAI sits in the messenger on your website and answers visitors from the content you gave it, in your tone. Hallucination prevention is built in, so when it does not have an answer it says so instead of inventing one. When the conversation turns into an order or a booking, it records the contact and tells you. Try the demo: it is scripted, but it follows the same path."
        points={[
          { label: "Answers from your content", detail: "Quick answers on every plan; your documents through the Pro knowledge base.", icon: "sparkles" },
          { label: "Captures the lead", detail: "Name, need and contact land in the built-in CRM contacts.", icon: "book" },
          { label: "Speaks their language", detail: "Detects the customer’s language and replies in it, across more than 30.", icon: "globe" },
        ]}
        cta={{ label: "See ConvoAI", href: "https://convoai.cloud/" }}
        visual={<ConvoChat />}
        side="right"
        surface="light"
        bleed
      />

      <FeatureGrid
        id="channels"
        eyebrow="Channels"
        title="Website first. WhatsApp and email when you need them."
        lede="One agent, trained once, answering wherever your customers already write to you. Chat, WhatsApp and email conversations land in one shared inbox for your team."
        surface="subtle"
        columns={4}
        items={[
          { label: "Website chat", detail: "The messenger on your site, with AI auto-replies. Included on every plan, starting with Essentials.", icon: "layout" },
          { label: "WhatsApp", detail: "From Pro, through Meta’s official Cloud API, with rich templates: media, buttons and lists.", icon: "chat" },
          { label: "Email", detail: "From Pro, the same agent answers your email channel with the same knowledge.", icon: "mail" },
          { label: "Phone", detail: "CallFlow answers your business line, books, transfers and sends an SMS follow-up.", icon: "phone" },
        ]}
      />

      <ShowcaseSplit
        id="voice"
        eyebrow="CallFlow · voice"
        title="The phone still rings"
        body="A missed call is a lost customer far more often than a missed email. CallFlow is an AI receptionist for your business line: it answers, handles the routine questions from your knowledge base, books into your calendar, and transfers to a person when the call needs one. Setup is your business details, then the voice, routing and calendar, then forwarding your existing number or taking a new one."
        points={[
          { label: "Books while on the call", detail: "Real-time calendar sync with Google, Outlook, Cal.com and others.", icon: "book" },
          { label: "Warm transfer", detail: "Passes the caller to your team with the context, not a cold redirect.", icon: "lifebuoy" },
          { label: "Nothing lost after", detail: "Recording, searchable transcript, post-call analysis and an SMS follow-up.", icon: "chart" },
        ]}
        cta={{ label: "See CallFlow", href: "https://callflow.serverlys.com/" }}
        visual={<div className="flex justify-center"><CallFlowConsole /></div>}
        side="left"
        surface="dark"
      />

      <ShowcaseSplit
        id="handover"
        eyebrow="Handover"
        title="It knows when to stop"
        body="The agent is there to take the routine off your hands, not to stand between your customers and you. When it reaches something it should not handle, it tells the customer, offers a person, and passes the conversation across with everything already said — so your team answers the actual question instead of asking it again."
        points={[
          { label: "Instant human handoff", detail: "Included on every ConvoAI plan, with a fallback message you write.", icon: "lifebuoy" },
          { label: "One shared inbox", detail: "Your whole team works from one inbox, so the handover lands where they already are.", icon: "mail" },
          { label: "Honest about what it is", detail: "It introduces itself as an assistant, on chat and on the phone.", icon: "shield" },
        ]}
        visual={<ChatMock />}
        side="right"
        surface="light"
      />

      <FeatureGrid
        id="use-cases"
        eyebrow="Use cases"
        title="What it handles, by type of business"
        lede="The questions differ by trade; the shape is the same. Answer the routine, take the booking or the order, and pass the rest to you."
        surface="subtle"
        columns={3}
        items={[
          {
            label: "Restaurants and cafés",
            detail: "Opening hours, the menu, dietary questions, delivery areas and table bookings — on the website chat at dinner time and on the phone when the kitchen is busy.",
            icon: "cart",
          },
          {
            label: "Clinics and practices",
            detail: "New appointments booked straight into the calendar, opening times and directions, and a warm transfer to the front desk for anything clinical.",
            icon: "shield",
          },
          {
            label: "Trades and home services",
            detail: "The enquiry that arrives while you are on a job: what needs doing, where, and when to call back, captured as a contact instead of a missed call.",
            icon: "wrench",
          },
          {
            label: "Shops and ecommerce",
            detail: "Delivery, returns and stock questions answered in chat, with Pro’s product catalog and WhatsApp for customers who prefer to message.",
            icon: "cart",
          },
          {
            label: "Salons and studios",
            detail: "Prices, services and availability, then a booking through Pro’s smart agenda, without the phone interrupting the appointment in the chair.",
            icon: "sparkles",
          },
          {
            label: "Agencies and professional services",
            detail: "Qualify the enquiry before the first meeting — what they need, budget and timing — with lead scoring and tags in the Pro CRM pipeline.",
            icon: "compass",
          },
        ]}
      />

      <ShowcaseSplit
        id="automation"
        eyebrow="Automations"
        title="What happens after the conversation"
        body="The agent is a trigger. What follows — creating the record, notifying the right person, adding it to the calendar — runs as a workflow you can see and change. ConvoAI Pro includes automation workflows and webhooks for Zapier, Make and n8n; for anything bigger, Serverlys builds and runs it for you."
        cta={{ label: "See automations", href: "/automations" }}
        visual={<AutomationMock />}
        side="left"
        surface="dark"
      />

      <PricingPanel
        id="ai-plans-heading"
        title="AI agent plans and pricing"
        columns={4}
        footnote={
          <>
            ConvoAI prices in USD, plus tax. No contracts. Not sure whether you
            need chat, voice or both?{" "}
            <a
              href={billing.sales}
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Ask the team
            </a>
            .
          </>
        }
      >
        {aiAgentPlans.map((p, i) => {
          const blue = p.id === "pro";
          return (
            <PanelCard
              key={p.id}
              delay={i * 80}
              blue={blue}
              icon={PLAN_ICON[p.id]}
              name={p.name}
              badge={p.id === "essentials" ? "With hosting" : undefined}
              summary={p.summary}
              price={
                <div>
                  <p className="flex items-baseline gap-1">
                    <span
                      className={cn(
                        "tabular leading-none font-semibold tracking-[-0.03em]",
                        p.monthly === null ? "text-[28px]" : "text-[40px]",
                        blue ? "text-white" : INK,
                      )}
                    >
                      {p.monthly === null ? "Custom" : formatAgentPrice(p.monthly)}
                    </span>
                    {p.monthly !== null && (
                      <span className={blue ? "text-white/80" : MUTED}>/mo</span>
                    )}
                  </p>
                  <p className={cn("mt-2 text-[13px]", blue ? "text-white/80" : MUTED)}>
                    {p.priceNote}
                  </p>
                </div>
              }
              cta={p.cta}
              listTitle={p.listTitle}
              list={p.features}
            />
          );
        })}
      </PricingPanel>

      <TextButtonBand
        id="compare"
        eyebrow="Choosing"
        title="Chat, voice, or neither?"
        body="AI is not the answer to every problem. The AI tools page compares ConvoAI, CallFlow and Automations by the problem each one fixes, and says plainly where AI is the wrong answer."
        cta={{ label: "Compare AI tools", href: "/ai-tools" }}
        surface="light"
      />

      <FaqSection items={faqs} surface="subtle" />
      <FinalCta />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "AI agents", path: PATH }]} />
    </>
  );
}
