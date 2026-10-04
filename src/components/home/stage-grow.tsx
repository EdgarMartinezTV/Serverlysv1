import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { ConvoChat } from "@/components/product-ui/live/convo-chat";
import { CallFlowConsole } from "@/components/product-ui/live/callflow-console";
import { sisterProducts } from "@/data/company";
import { ConvoAiLogo } from "@/components/layout/convoai-logo";
import { StageRow } from "./stage-row";
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
      surface="light"
      spacing="tight"
      width="wide"
      labelledBy="grow-heading"
      className="scroll-mt-16"
    >
      <Reveal>
        <h2 id="grow-heading" className="display-md mx-auto max-w-[900px] text-center text-fg">
          {stage.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-[620px] text-center text-body-lg text-fg-secondary">
          {stage.lede}
        </p>
      </Reveal>

      <div className="mt-14 flex flex-col gap-20 sm:mt-16 lg:gap-28">
        <Reveal>
          <StageRow
            mediaSide="right"
            brandSlot={<ConvoAiLogo tone="light" className="h-7 w-auto" />}
            title="The 2am enquiry gets an answer at 2am"
            body={`${convo?.description ?? "Answers your customers, day and night."} Trained on your own pages, so it answers about your prices and your hours. Ask it something.`}
            links={[
              { label: "How the chat agent works", href: "/convoai" },
              { label: "Automations that follow up", href: "/automations" },
              ...(convo ? [{ label: "Open ConvoAI", href: convo.href, external: true }] : []),
            ]}
            media={<ConvoChat tone="light" />}
          />
        </Reveal>

        <Reveal>
          <StageRow
            mediaSide="left"
            icon="phone"
            title="And the missed call gets picked up"
            body={`${callflow?.description ?? "Picks up the phone when you cannot."} It takes the details, books the slot and leaves you a transcript instead of a voicemail.`}
            links={[
              { label: "What CallFlow handles", href: "/callflow-ai" },
              { label: "Marketing that feeds it", href: "/marketing" },
              ...(callflow ? [{ label: "Open CallFlow", href: callflow.href, external: true }] : []),
            ]}
            media={<CallFlowConsole />}
          />
        </Reveal>
      </div>
    </Section>
  );
}
