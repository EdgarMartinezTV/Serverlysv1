import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { ConvoChat } from "@/components/product-ui/live/convo-chat";
import { CallFlowConsole } from "@/components/product-ui/live/callflow-console";
import { sisterProducts } from "@/data/company";
import { ConvoAiLogo } from "@/components/layout/convoai-logo";
import { OverlapCard } from "./overlap-card";
import { stageById } from "./stages";

const stage = stageById("grow");
const convo = sisterProducts.find((product) => product.name === "ConvoAI");
const callflow = sisterProducts.find((product) => product.name === "CallFlow");

/**
 * Stage 3 — Grow.
 *
 * Two panels, and both media are operable. Type into the chat and it answers;
 * start the call console and it runs. That is the argument the section is
 * making — these are products you already have access to, not a roadmap — so a
 * static mock here would undercut the copy it sits next to.
 *
 * Panel tones are set by what the media needs, not by rhythm. ConvoChat has a
 * light tone and sits on the light panel; CallFlowConsole is dark-only, so its
 * panel is dark. Putting the dark console on a light panel produced a floating
 * black rectangle with no relationship to the card around it.
 *
 * The cross-links carry py-1.5 to clear WCAG 2.5.8's 24px target floor. As
 * bare text they measured 17px tall, and they are standalone links rather than
 * links inside a sentence, so the inline exception does not cover them.
 *
 * Both products live on their own domains, so their CTAs are external links.
 * The OverlapCard link list uses next/link, which would try to client-navigate
 * a cross-origin href — the cross-links here go in the body copy and the
 * footer instead, where they can carry the right rel and target.
 */
export function StageGrow() {
  return (
    <Section
      id={stage.id}
      surface="subtle"
      spacing="base"
      width="wide"
      labelledBy="grow-heading"
      className="scroll-mt-8"
    >
      <Reveal>
        <SectionHeader
          eyebrow="03 · Grow"
          title={stage.heading}
          lede={stage.lede}
          id="grow-heading"
        />
      </Reveal>

      <div className="mt-12 flex flex-col gap-5">
        <Reveal>
          <OverlapCard
            tone="light"
            mediaSide="right"
            eyebrowSlot={<ConvoAiLogo tone="light" className="h-7 w-auto" />}
            title="The enquiry that arrives at 2am gets an answer at 2am"
            body={`${convo?.description ?? "Answers your customers, day and night."} Trained on your own pages, so it answers about your prices and your hours rather than in general terms. Ask it something.`}
            links={[
              { label: "How the chat agent works", href: "/convoai" },
              { label: "AI agents for your site", href: "/ai-agents" },
              { label: "Automations that follow up", href: "/automations" },
            ]}
            media={<ConvoChat tone="light" />}
            footer={
              convo && (
                <a
                  href={convo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-6 items-center py-1.5 text-small text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                  Open {convo.name} at convoai.cloud
                </a>
              )
            }
          />
        </Reveal>

        <Reveal delay={80}>
          <OverlapCard
            tone="dark"
            mediaSide="left"
            eyebrow="CallFlow"
            title="And the call you missed gets picked up"
            body={`${callflow?.description ?? "Picks up the phone when you cannot."} It takes the details, books the slot and leaves you a transcript instead of a voicemail you have to call back.`}
            links={[
              { label: "What CallFlow handles", href: "/callflow-ai" },
              { label: "Marketing that feeds it", href: "/marketing" },
              { label: "Get found first", href: "/seo" },
            ]}
            media={<CallFlowConsole />}
            footer={
              callflow && (
                <a
                  href={callflow.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-6 items-center py-1.5 text-small text-primary-on-dark underline underline-offset-2 hover:text-white"
                >
                  Open {callflow.name} at callflow.serverlys.com
                </a>
              )
            }
          />
        </Reveal>
      </div>
    </Section>
  );
}
