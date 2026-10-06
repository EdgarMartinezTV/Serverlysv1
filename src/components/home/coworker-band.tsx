import Link from "next/link";
import { Grid } from "@/components/ref/kit";
import { SeraMark } from "@/components/sera/sera-mark";
import { CoworkerBento } from "./coworker-bento";

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
const PROMPTS = [
  "Book a cleaning for Friday morning",
  "Send the quote to my email",
  "Follow up with Tuesday's enquiries",
] as const;

/**
 * AI co-worker band — 2026-10-03 re-composition.
 *
 * Heading left, the claim and the action right; then a bento: four dark
 * capability plates at staggered heights and one lit plate that SHOWS the
 * agent answering instead of describing it. The sticky stacked list this
 * replaced made the reader scroll through five near-identical rows.
 *
 * Then "Same agent, more ways to grow": automations, with stacked task cards
 * and a tool bar as the visual. Every task named is something an automation
 * on the platform actually does (booking, quote, follow-up).
 */
export function CoworkerBand() {
  return (
    <section
      aria-labelledby="coworker-heading"
      className="relative isolate overflow-hidden bg-canvas-abyss py-20 md:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_90%_25%,rgb(0_0_255/0.6)_0%,transparent_70%),radial-gradient(50%_45%_at_80%_80%,rgb(31_85_255/0.35)_0%,transparent_70%)]"
      />
      <Grid>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <h2 id="coworker-heading" className="display-md max-w-[460px] text-white">
            Your AI co-worker. Free with every plan.
          </h2>
          <div className="lg:justify-self-end lg:max-w-[400px]">
            <p className="text-body text-fg-on-dark-secondary">
              ConvoAI answers your customers day and night, and hands anything it should not
              attempt to a person with the full transcript.
            </p>
            <Link
              href="https://convoai.cloud/"
              className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-small font-semibold text-white ring-1 ring-white/40 transition-colors duration-fast hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <SeraMark className="h-4 w-4" />
              Start a chat
            </Link>
          </div>
        </div>

        {/* ── Bento: hover/focus/tap opens a plate (see coworker-bento) ── */}
        <CoworkerBento />

        {/* ── Same agent, more ways to grow ──────────────────────────────── */}
        <div className="mt-24 grid items-center gap-14 lg:grid-cols-2">
          <div className="max-w-[460px]">
            <h3 className="display-md text-white">Same agent. More ways to grow.</h3>
            <p className="mt-4 text-body text-fg-on-dark-secondary">
              Connect it to automations, so a conversation becomes a booking, a ticket or a
              follow-up without anyone copying it across.
            </p>
            <Link
              href="/automations"
              className="group/row mt-7 flex items-center justify-between gap-4 border-b border-line-on-dark py-4 text-body-lg text-white transition-colors duration-fast hover:text-primary-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              See automations
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 transition-transform duration-fast group-hover/row:translate-x-1">
                <path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div aria-hidden="true" className="relative mx-auto h-[300px] w-full max-w-[500px]">
            <span className="absolute top-0 right-10 z-10 inline-flex size-20 items-center justify-center rounded-2xl bg-primary text-white shadow-e5 ring-1 ring-white/20">
              <SeraMark className="h-10 w-10" />
            </span>
            {PROMPTS.map((p, i) => (
              <div
                key={p}
                style={{ top: `${60 + i * 52}px`, left: `${i * 48}px`, opacity: 0.55 + i * 0.22 }}
                className="absolute right-0 max-w-[360px] rounded-2xl bg-white/90 px-5 py-4 text-body text-fg shadow-e4 backdrop-blur"
              >
                {p}
              </div>
            ))}
            <div className="absolute right-0 bottom-0 flex gap-1 rounded-2xl bg-white p-1.5 shadow-e5">
              {["Chat", "Tasks", "Files", "Apps"].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-xl px-4 py-2 text-micro font-medium ${i === 0 ? "bg-brand-50 text-primary" : "text-fg-secondary"}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}
