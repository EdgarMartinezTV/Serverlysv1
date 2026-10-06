import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { ChatMock, CallMock, AutomationMock } from "@/components/product-ui/mocks";
import { NavIcon } from "@/components/navigation/nav-icons";
import { pageMetadata, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { billing } from "@/data/company";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

const PATH = "/ai-tools";

export const metadata = pageMetadata({
  title: "AI Tools — which one solves which problem | Serverlys",
  description:
    "ConvoAI, CallFlow and Automations compared by the problem each one fixes, with an honest note on where AI is the wrong answer.",
  path: PATH,
});

/**
 * AI tools.
 *
 * NOT a second /ai-agents page. That page sells the category; this one is a
 * CHOOSER — someone who knows they have a problem and does not know which of
 * the three products addresses it. So the spine is symptom → tool, and it
 * includes the cases where the answer is "none of these", because a chooser
 * that always chooses is a brochure.
 */
const TOOLS = [
  {
    name: "ConvoAI",
    href: "https://convoai.cloud/",
    icon: "chat" as const,
    symptom: "People arrive on your website, do not find the answer, and leave.",
    does: "Answers questions on the site in a conversation, using what you told it about your business, and captures the lead when it cannot finish the job.",
    good: ["Repetitive pre-sales questions", "Out-of-hours enquiries", "Qualifying before a human calls back"],
    visual: <ChatMock />,
  },
  {
    name: "CallFlow",
    href: "https://callflow.serverlys.com/",
    icon: "phone" as const,
    symptom: "The phone rings out and the caller phones the next name on the list.",
    does: "Answers the call, handles the routine questions, takes the details or books the appointment, and sends you the summary.",
    good: ["Evenings, weekends and holidays", "Overflow when you are already on a call", "Trades, clinics and anyone on a job"],
    visual: <CallMock />,
  },
  {
    name: "Automations",
    href: "/automations",
    icon: "bolt" as const,
    symptom: "The same information gets typed into three systems by hand.",
    does: "Moves data between the tools you already pay for and takes the routine action, on a trigger, without anyone remembering to do it.",
    good: ["Lead from form into CRM", "Invoice chasing", "Anything that begins 'every time X happens, someone has to'"],
    visual: <AutomationMock />,
  },
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "Do I need all three?",
    answer:
      "Almost certainly not at once. Start with whichever symptom is costing you the most right now — usually the missed calls or the missed enquiries — and add the others when the first one is settled and you can see what it changed.",
    scopes: [PATH],
  },
  {
    question: "Will it sound like a robot?",
    answer:
      "It will sound like software, and it should say so in the first sentence. Agents that pretend to be human erode trust the moment a caller works it out, and disclosure rules are tightening in several jurisdictions. The measure that matters is whether the caller got what they needed, not whether they were fooled.",
    scopes: [PATH],
  },
  {
    question: "What happens when it cannot help?",
    answer:
      "It hands over, and the hand-over path is the part worth testing hardest. A caller who asks for a person should reach a person without repeating themselves, and an agent that answers every question with 'someone will get back to you' is a worse voicemail.",
    scopes: [PATH],
  },
  {
    question: "Is my business data used to train a public model?",
    answer:
      "What you give an agent is used to answer your customers, not to train a general model. If you have a specific compliance requirement about where data is processed and retained, raise it before setup rather than after — it is a configuration question, and it is easier to answer up front.",
    scopes: [PATH],
  },
];

export default function AiToolsPage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, "/ai-tools")} />

      {/* 2026-10-03: light hero, pill label, display title (was dark navy + mono). */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container width="wide" className="relative pb-16 pt-6 sm:pb-20 lg:pt-10">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "AI agents", href: "/ai-agents" },
              { name: "AI tools" },
            ]}
            tone="light"
          />
          <div className="mx-auto mt-10 max-w-3xl text-center">
            <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-small font-medium text-primary">
              AI tools
            </span>
            <h1 className="display-lg mt-5 text-fg">
              Start with the symptom, not the technology
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-body-lg text-fg-secondary">
              Three tools, three different problems. Find the one that describes
              your week — and read the last section, which is about when the
              answer is none of them.
            </p>
          </div>
        </Container>
      </section>

      {/* Symptom → tool. Full-width alternating rows, each with its own UI. */}
      {TOOLS.map((tool, i) => (
        <Section key={tool.name} surface={i % 2 === 0 ? "light" : "subtle"}>
          <div
            className={`grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <p className="flex items-center gap-2.5 text-small font-semibold text-fg">
                <span aria-hidden="true" className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-50 text-primary">
                  <NavIcon name={tool.icon} />
                </span>
                {tool.name}
              </p>
              <h2 className="display-md mt-5 text-fg">{tool.symptom}</h2>
              <p className="mt-4 max-w-[58ch] text-body-lg text-fg-secondary">{tool.does}</p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {tool.good.map((g) => (
                  <li key={g} className="flex gap-3 text-body text-fg-secondary">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {g}
                  </li>
                ))}
              </ul>
              <Button href={tool.href} className="mt-8">
                How {tool.name} works
              </Button>
            </div>
            {/* Tiled brand stage, same framing as ShowcaseSplit. */}
            <div className="relative isolate overflow-hidden rounded-3xl bg-brand-50 p-5 sm:p-8">
              <div aria-hidden="true" className="absolute inset-0 -z-10 grid grid-cols-4 grid-rows-3">
                {Array.from({ length: 12 }, (_, k) => (
                  <span key={k} className={[1, 4, 6, 11].includes(k) ? "bg-brand-100" : ""} />
                ))}
              </div>
              <div className="flex justify-center drop-shadow-[0_24px_40px_rgb(0_0_60/0.16)]">{tool.visual}</div>
            </div>
          </div>
        </Section>
      ))}

      {/* Where AI is the wrong answer. The section that makes the rest credible. */}
      <Section surface="dark" className="relative isolate overflow-hidden !bg-canvas-abyss">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_15%_30%,rgb(0_0_255/0.35),transparent_70%)]" />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <SectionHeader
            eyebrow="When not to"
            tone="dark"
            title="Where the answer is none of these"
            lede="We would rather you did not buy something that makes your business worse. These are the cases where an agent is the wrong tool."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              ["Complaints and anything emotional", "Escalate immediately. An automated response to an upset customer converts a problem into a public one."],
              ["Anything with legal, medical or financial consequence", "If being wrong has a real cost, a person makes the call and the agent takes a message."],
              ["Quoting on a job with real variables", "An agent that guesses a price commits you to it in the customer's mind."],
              ["Replacing someone who was answering well", "The case for an agent is strong when the alternative is nobody. It is weak when the alternative is a person doing it properly."],
              ["A team that will not maintain it", "An agent given stale hours and last year's prices does damage. Someone has to own it."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                <h3 className="text-body font-semibold text-white">{t}</h3>
                <p className="mt-1.5 max-w-[62ch] text-small text-fg-on-dark-secondary">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section surface="light" spacing="tight">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-50 p-7 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-h3 font-medium tracking-[-0.02em] text-fg">Still not sure which one?</h2>
            <p className="mt-2 max-w-2xl text-body text-fg-secondary">
              Describe a normal week — where enquiries come from, what gets
              missed, and what you keep retyping. We will tell you which of the
              three would change it, or that none of them would. See the{" "}
              <Link href="/ai-agents" className="font-medium text-primary hover:text-primary-hover">
                AI agents overview
              </Link>{" "}
              for how they are set up.
            </p>
          </div>
          <Button href={billing.sales}>Describe it to us</Button>
        </div>
      </Section>

      <FaqSection items={FAQS} />
      <FinalCta />
      <PageBreadcrumbs trail={[
          { name: "Home", path: "/" },
          { name: "AI agents", path: "/ai-agents" },
          { name: "AI tools", path: PATH },
        ]} />
    </>
  );
}
