"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SeraIcon, SeraMark } from "@/components/sera/sera-mark";
import { useSeraOptional } from "@/components/sera/sera-provider";
import { company } from "@/data/company";

/**
 * Brief band — "tell us what you are building".
 *
 * ── WHY THIS NOW OPENS SERA ─────────────────────────────────────────────────
 *
 * The header of this file used to read: "The reference layout puts an AI prompt
 * box here. We do not have an agent that can provision an account from a
 * sentence, so shipping a box that looks like one would be a lie told in the
 * first screen and a half." That was correct when it was written, and it is why
 * the send was a `mailto:` — an honest handoff instead of a fake agent.
 *
 * ⚠ THAT CONSTRAINT NO LONGER HOLDS. Sera exists. It reads the sentence,
 * classifies the intent, answers from the knowledge tools rather than from
 * memory, opens the right page, marks the plan it recommends, and collects a
 * migration or project request that only a human tap can file. The box that
 * looked like an agent is now backed by one, so the honest version of this
 * interaction has changed — and a mailto is now the WORSE answer, because it
 * asks the visitor to leave for a mail client when an answer is one keystroke
 * away.
 *
 * ⚠ THE MAILTO IS STILL HERE, AS THE FALLBACK. Nothing was removed. This uses
 * `useSeraOptional`, which is the documented pattern for site chrome rather
 * than widget internals: if the provider is not mounted — a page outside the
 * root layout, a test harness — the button degrades to exactly the mail
 * handoff it always was instead of throwing and taking the homepage with it.
 * The "prefer email" line below is also unchanged, for anyone who would rather
 * write than chat.
 *
 * ── WHY IT LOOKS LIKE THIS ──────────────────────────────────────────────────
 *
 * ⚠ SERA'S IDENTITY IS INSIDE THE PANEL, BEFORE THE CLICK. The old button said
 * "Send brief", which told the visitor nothing about what would happen — and
 * what happens now is that a chat panel opens and starts talking. A control
 * that opens a conversation has to say so first; a surprise assistant is the
 * pattern everyone has learned to close.
 *
 * The panel is one contained object with a brand hairline at its top edge —
 * deliberately the SAME device as the guarantee strip under the hero, because
 * this site should have one visual language for "a prepared surface", not a new
 * one per section. `shadow-e4` is the token DESIGN_SYSTEM.md §6 assigns to
 * "prominent panels", and `rounded-xl` is what §5 assigns to "large panels" —
 * the previous `rounded-2xl` is the hero-media radius and read a step softer
 * than the system intends for something this size.
 *
 * The chips moved INSIDE the panel. Outside it they read as a separate row of
 * controls that happened to sit underneath; inside, the whole thing reads as
 * one place where you say what you need.
 *
 * The chips still REPLACE the draft rather than appending. Appending produced
 * run-on briefs in testing, and a chip reads as "start here", not "add this".
 */
export function BriefBand() {
  const [draft, setDraft] = useState("");
  const sera = useSeraOptional();
  const trimmed = draft.trim();

  /*
   * The fallback target, computed regardless of whether Sera is available —
   * it is what the button becomes when it is not, and keeping it unconditional
   * means there is no branch where the control has nowhere to go.
   */
  const mailHref = trimmed
    ? `mailto:${company.email}?subject=${encodeURIComponent(
        "Project brief",
      )}&body=${encodeURIComponent(trimmed)}`
    : `mailto:${company.email}?subject=${encodeURIComponent("Project brief")}`;

  /*
   * ⚠ OPEN, THEN SEND, IN THAT ORDER AND IN ONE TICK. `send` appends the
   * visitor's message and starts the turn; `open` reveals the panel. Sending
   * first would start an answer streaming into a panel nobody can see, and the
   * unread badge would fire for a message the visitor just wrote themselves.
   *
   * No `startWorkflow`. It is tempting to map "Move my WordPress site over" to
   * WEBSITE_MIGRATION and skip a step, but the chips are STARTING POINTS the
   * visitor edits — forcing a workflow from text they may have rewritten would
   * open a migration request for someone asking about a store. Sera classifies
   * it; that is the job it is good at.
   */
  const askSera = () => {
    if (!sera) return;
    sera.open();
    /*
     * ⚠ AN EMPTY DRAFT STILL OPENS SERA, IT JUST SENDS NOTHING.
     *
     * The first version disabled the button until something was typed, which
     * is the right rule for a chat composer and the wrong one for this. On a
     * screenshot of a freshly-loaded homepage the section's primary CTA
     * rendered greyed out — `disabled` applies `opacity-50`, so a visitor
     * meets the main action looking broken and has to guess that typing
     * revives it.
     *
     * It was also the wrong COLOUR: `bg-primary` at half opacity over white
     * lands on a pale periwinkle, which is exactly the lavender that was just
     * removed from the rest of the site.
     *
     * Opening with nothing typed is a perfectly good outcome — the panel's own
     * quick actions take over from there, and "Ask Sera" is then simply true.
     */
    if (trimmed) {
      sera.send(trimmed, { label: "Homepage brief" });
      setDraft("");
    }
  };

  /*
   * ── 2026-10-03 RE-COMPOSITION ─────────────────────────────────────────────
   * Edgar asked for this band to read as one calm prompt: a mark, a two-line
   * headline, ONE input with an arrow, one helper line. The chips, the
   * "Sera · AI agent" header row, the mono eyebrow and the long lede all went;
   * together they made the band read as a form instead of an invitation. The
   * mail fallback is unchanged — without Sera mounted, the arrow becomes the
   * mailto link it always was.
   *
   * The gradient line is BLUE ONLY (brand-900 → brand-600 → brand-500). Every
   * stop is ≥ 5.5:1 on this band, which is what the old violet-ended gradient
   * version could not say, and violet stays off-brand.
   */
  return (
    <section
      aria-labelledby="brief-heading"
      className="relative isolate overflow-hidden bg-brand-50 py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_0%_0%,rgb(148_180_255/0.55)_0%,transparent_60%),radial-gradient(50%_70%_at_100%_100%,rgb(148_180_255/0.5)_0%,transparent_60%),linear-gradient(180deg,rgb(255_255_255/0.6),rgb(255_255_255/0))]"
      />

      <Container className="relative">
        <div className="mx-auto flex max-w-[880px] flex-col items-center text-center">
          <SeraMark className="h-10 w-10 text-fg" />
          <h2
            id="brief-heading"
            className="display-lg mt-6 text-fg"
          >
            Tell us your idea.
            <span className="block bg-[linear-gradient(90deg,var(--color-brand-900),var(--color-brand-600)_45%,var(--color-brand-500))] bg-clip-text pb-1 text-transparent">
              Sera tells you what it takes.
            </span>
          </h2>

          <form
            className="mt-10 w-full max-w-[850px]"
            onSubmit={(event) => {
              event.preventDefault();
              askSera();
            }}
          >
            <label htmlFor="brief" className="sr-only">
              What do you want to build?
            </label>
            <div className="flex items-center gap-2 rounded-xl bg-canvas p-1.5 pl-5 shadow-e2 ring-1 ring-brand-200 transition-shadow duration-fast focus-within:ring-2 focus-within:ring-primary">
              <input
                id="brief"
                name="brief"
                type="text"
                autoComplete="off"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="What do you want to build?"
                className="h-11 min-w-0 flex-1 bg-transparent text-body-lg text-fg placeholder:text-fg-secondary focus:outline-none"
              />
              {/*
                ⚠ TWO CONTROLS, ONE RENDERED. With Sera this is a submit button
                that opens the conversation; without it, the original link to
                mail. A `<button>` and an `<a>` are different things to a screen
                reader and to a middle click, so the label matches which it is.
              */}
              {sera ? (
                <button
                  type="submit"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors duration-fast ease-hover hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="sr-only">Ask Sera</span>
                  <SeraIcon name="arrowRight" className="h-5 w-5" />
                </button>
              ) : (
                <a
                  href={mailHref}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors duration-fast ease-hover hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="sr-only">Send brief by email</span>
                  <SeraIcon name="arrowRight" className="h-5 w-5" />
                </a>
              )}
            </div>
          </form>

          <p className="mt-4 text-small text-fg-secondary">
            {sera
              ? "Get a plan and the real price in seconds. Free, no signup."
              : `A person replies with the plan and the price. Or call ${company.phone}.`}
          </p>
        </div>
      </Container>
    </section>
  );
}
