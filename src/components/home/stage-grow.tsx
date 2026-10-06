import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { GrowChatShowcase } from "./showcase/grow-chat-showcase";
import { GrowCallShowcase } from "./showcase/grow-call-showcase";
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
 * Two rows, each with a realistic animated mockup (2026-10-05, replacing the
 * interactive chat and call consoles, which read as basic UI): ConvoAI working
 * on a bakery's site at 2am, and CallFlow answering that bakery's phone, the
 * booking and call summary landing beside it. See components/home/showcase.
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
            body={`${convo?.description ?? "Answers your customers, day and night."} Trained on your own pages, so it answers about your prices and your hours.`}
            links={[
              { label: "How the chat agent works", href: "https://convoai.cloud/", external: true },
              { label: "Automations that follow up", href: "/automations" },
              ...(convo ? [{ label: "Open ConvoAI", href: convo.href, external: true }] : []),
            ]}
            media={<GrowChatShowcase />}
            bareMedia
          />
        </Reveal>

        <Reveal>
          <StageRow
            mediaSide="left"
            icon="phone"
            title="And the missed call gets picked up"
            body={`${callflow?.description ?? "Picks up the phone when you cannot."} It takes the details, books the slot and leaves you a transcript instead of a voicemail.`}
            links={[
              { label: "What CallFlow handles", href: "https://callflow.serverlys.com/", external: true },
              { label: "Marketing that feeds it", href: "/marketing" },
              ...(callflow ? [{ label: "Open CallFlow", href: callflow.href, external: true }] : []),
            ]}
            media={<GrowCallShowcase />}
            bareMedia
          />
        </Reveal>
      </div>
    </Section>
  );
}
