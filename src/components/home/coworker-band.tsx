import Link from "next/link";
import { ArrowRight, CtaButton, Grid } from "@/components/ref/kit";

/**
 * "Your AI co-worker. Free with every plan."
 *
 * The reference implements this as a SCROLL-STACK, not a grid: five sibling
 * cards, each `position: sticky; top: 72px`, so as you scroll each card pins
 * under the header and the next one slides over it. Measured off the live page
 * — `.homepage-overlapping-cards__card` × 5, all sticky at top 72px, which is
 * exactly our header height.
 *
 * Why that shape rather than a row: five cards side by side are five things to
 * read at once. Stacked, each one gets the full width for as long as it takes
 * to scroll past it, which is the point — the band is a sequence, not a menu.
 *
 * Built in pure CSS. `position: sticky` needs no scroll listener, no
 * IntersectionObserver and no JS at all, so this adds nothing to the main
 * thread and behaves correctly before hydration. The stack degrades to a plain
 * vertical list wherever sticky is unsupported.
 *
 * MOTION: the offset per card is 12px so the stack reads as depth rather than
 * a jump, and `prefers-reduced-motion` users get the same layout — there is no
 * transition to suppress, because nothing animates. The stacking IS the scroll
 * position.
 *
 * The five cards describe ConvoAI, which we ship. The reference also claims
 * "85% of issues solved without a human" — their measured figure, not ours, so
 * it is deliberately absent.
 */
const CARDS = [
  {
    title: "Answer",
    body: "It handles the questions that make up most of a site's volume — hours, pricing, stock, delivery — day and night.",
  },
  {
    title: "Capture",
    body: "It writes down the name and the intent, so an enquiry is never just a missed message.",
  },
  {
    title: "Escalate",
    body: "When it should not attempt something, a person receives the whole conversation rather than a summary.",
  },
  {
    title: "Stay honest",
    body: "It says when it does not know, and tells customers they are talking to an assistant. No invented policies, no guessed prices.",
  },
  {
    title: "Trigger work",
    body: "A conversation can start an automation — a booking, a ticket, a follow-up — without you wiring it up.",
  },
] as const;

export function CoworkerBand() {
  return (
    <section
      aria-labelledby="coworker-heading"
      className="bg-canvas-abyss py-14 md:py-16 xl:py-20"
    >
      <Grid>
        <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <h2
            id="coworker-heading"
            className="text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-ink-50 lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]"
          >
            Your AI co-worker. Free with every plan.
          </h2>
          <p className="mt-4 text-body text-fg-on-dark-secondary">
            ConvoAI answers your customers day and night, and hands anything it should not attempt
            to a person with the full transcript.
          </p>
          <div className="mt-8">
            <CtaButton href="/convoai" tone="light">
              Start a chat
            </CtaButton>
          </div>
        </div>

        {/*
         * The stack. Each <li> is sticky at the header's 72px, and the trailing
         * spacer gives the last card room to pin before the band ends —
         * without it the final card unpins early and the sequence reads as
         * broken at the bottom.
         */}
        <ol className="mt-12">
          {CARDS.map((c, i) => (
            <li
              key={c.title}
              style={{ top: `calc(4.5rem + ${i * 12}px)`, zIndex: i + 1 }}
              className="sticky mb-6"
            >
              <div className="flex flex-col gap-3 rounded-2xl bg-canvas-deep p-8 ring-1 ring-white/10 md:flex-row md:items-start md:gap-10 md:p-10">
                <p className="flex items-center gap-4 md:w-[280px] md:shrink-0">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-small font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="text-[24px] leading-8 font-normal tracking-[-0.12px] text-white">
                    {c.title}
                  </span>
                </p>
                <p className="flex-1 text-body text-fg-on-dark-secondary">{c.body}</p>
              </div>
            </li>
          ))}
          <li aria-hidden className="h-24" />
        </ol>

        <div className="flex flex-col items-center gap-3 text-center">
          <p className="max-w-[720px] text-body text-fg-on-dark-secondary">
            Same agent, more ways to grow: connect it to automations so a conversation becomes a
            booking, a ticket or a follow-up.
          </p>
          <Link
            href="/automations"
            className="inline-flex min-h-11 items-center gap-1.5 text-body font-semibold text-primary-on-dark hover:text-white"
          >
            Learn more
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Grid>
    </section>
  );
}
