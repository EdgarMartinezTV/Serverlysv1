import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { AutomationCanvas } from "@/components/product-ui/live/automation-canvas";
import { OverlapCard } from "./overlap-card";

/**
 * "Put AI to work for you" — the band between the pricing table and the
 * services rail.
 *
 * This is the AI that works on the BUSINESS, and it is deliberately separated
 * from the AI in the Grow stage, which works on the CUSTOMER. ConvoAI answers
 * the visitor; this runs the follow-up nobody remembers to do. They were one
 * section in the first pass and the section made no argument, because "AI" was
 * the only thing the two halves had in common.
 *
 * The canvas is operable: start it and each node runs in sequence with its real
 * input and output. That is the whole claim — an automation is a sequence of
 * steps you can watch, not a black box you are asked to trust.
 */
export function AiWorkBand() {
  return (
    <Section surface="light" spacing="base" width="wide" labelledBy="ai-work-heading">
      <Reveal>
        <SectionHeader
          eyebrow="AI"
          title="Put AI to work for you"
          lede="Not a chatbot bolted to the corner of the page. The repeat work around the site — routing, chasing, reporting — handed to something that does it the same way every time."
          id="ai-work-heading"
          align="center"
        />
      </Reveal>

      <Reveal delay={80} className="mt-12">
        <OverlapCard
          tone="dark"
          mediaSide="right"
          eyebrow="Included with hosting"
          title="Automations"
          body="A new enquiry goes to the right inbox, the invoice chases itself, and the weekly report writes itself. Press play on the canvas — every node shows what went in and what came out."
          links={[
            { label: "Automations", href: "/automations" },
            { label: "AI agents", href: "/ai-agents" },
            { label: "AI tools", href: "/ai-tools" },
            { label: "How we build them with you", href: "/our-process" },
          ]}
          media={<AutomationCanvas tone="dark" />}
        />
      </Reveal>
    </Section>
  );
}
