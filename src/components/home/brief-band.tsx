"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SeraIcon, SeraMark } from "@/components/sera/sera-mark";
import { useSeraOptional } from "@/components/sera/sera-provider";
import { company, billing } from "@/data/company";
import { cn } from "@/lib/utils";

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
const PROMPTS = [
  "Move my WordPress site over without downtime",
  "A store that can take orders this month",
  "Answer the enquiries my site already gets",
  "Something faster than the host I am on now",
] as const;

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

  return (
    <section
      aria-labelledby="brief-heading"
      className="relative isolate overflow-hidden bg-canvas-secondary py-14 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgb(34_126_255/0.10)_0%,transparent_70%)]"
      />

      <Container className="relative">
        <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
          <span className="font-mono text-caption uppercase text-primary">
            Not sure what you need?
          </span>
          <h2 id="brief-heading" className="mt-4 text-h1 text-fg">
            Describe it in one line.
            {/*
              Solid brand blue rather than the old `to-violet-600` gradient:
              clipped-text gradients cannot be contrast-checked by
              validate-tokens.mjs, and every stop light enough to read as a
              gradient fell under 4.5:1 on this band. `primary` is 8.59:1.
            */}
            <span className="block text-primary">We will tell you what it takes.</span>
          </h2>
          <p className="mt-5 text-body-lg text-fg-secondary">
            {sera
              ? "Sera answers straight away, from the real plans and prices — and hands you to a person the moment that is the better answer."
              : "A real person reads this and replies with the plan, the timeline and the price. No sales sequence."}
          </p>
        </div>

        {/* ── The panel ──────────────────────────────────────────────────── */}
        <div className="mx-auto mt-9 max-w-2xl">
          <div className="overflow-hidden rounded-xl bg-canvas shadow-e4 ring-1 ring-line">
            {/* The same fading brand hairline the guarantee strip carries. */}
            <div
              aria-hidden="true"
              className="h-0.5 w-full bg-[linear-gradient(90deg,transparent,var(--color-primary)_16%,var(--color-primary)_84%,transparent)]"
            />

            {/*
              Who is going to answer. Only rendered when Sera is actually
              mounted — claiming an assistant is standing by and then opening a
              mail client would be the exact dishonesty this file was written to
              avoid.
            */}
            {sera && (
              <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
                <SeraMark className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-small font-medium text-fg">Sera</span>
                <span className="text-small text-fg-muted">·</span>
                <span className="text-small text-fg-secondary">AI agent</span>
                <span className="ml-auto flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-success-fill"
                  />
                  <span className="text-caption text-fg-muted">Answers in seconds</span>
                </span>
              </div>
            )}

            <div className="p-3">
              <label htmlFor="brief" className="sr-only">
                What are you building?
              </label>
              <textarea
                id="brief"
                name="brief"
                rows={2}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                /*
                  ⚠ ENTER SENDS, SHIFT+ENTER NEWLINES — the convention every
                  chat input uses, and this is now a chat input. Only wired
                  when Sera is present: with the mail fallback there is nothing
                  to submit to, and hijacking Enter to open a mail client from
                  a textarea would be a surprise.
                */
                onKeyDown={(event) => {
                  if (!sera) return;
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    askSera();
                  }
                }}
                placeholder="I run a cleaning company and need a site that books jobs…"
                className="min-h-16 w-full resize-none rounded-lg bg-transparent px-3 py-2 text-body text-fg placeholder:text-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />

              <ul className="mt-1 flex flex-wrap gap-2 px-1">
                {PROMPTS.map((prompt) => {
                  const active = trimmed === prompt;
                  return (
                    <li key={prompt}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => setDraft(prompt)}
                        className={cn(
                          /* 44px minimum below `sm` — see stage-deck. */
                          "inline-flex min-h-11 items-center rounded-full px-3 py-1.5 text-left text-small transition-colors duration-fast ease-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-0",
                          active
                            ? "bg-primary text-fg-on-brand"
                            : "bg-canvas-secondary text-fg-secondary ring-1 ring-inset ring-line hover:bg-primary-soft hover:text-primary",
                        )}
                      >
                        {prompt}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-3 flex items-center justify-between gap-3 px-1">
                <p className="text-caption text-fg-muted">
                  {sera ? "Enter to send · Shift + Enter for a new line" : "Opens your mail client"}
                </p>

                {/*
                  ⚠ TWO CONTROLS, ONE RENDERED. With Sera this is a button that
                  opens the conversation; without it, the original link to mail.
                  Not one control with a conditional handler — a `<button>` and
                  an `<a>` are different things to a screen reader and to a
                  middle click, and the label has to match which one it is.
                */}
                {sera ? (
                  <Button onClick={askSera} size="lg" className="shrink-0">
                    Ask Sera
                    <SeraIcon name="arrowRight" className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button href={mailHref} external size="lg" className="shrink-0">
                    Send brief
                  </Button>
                )}
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-small text-fg-muted">
            Prefer to write instead?{" "}
            <a
              href={mailHref}
              className="inline-block rounded-sm py-1 text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Email the team
            </a>
            , use{" "}
            <a
              href={billing.sales}
              className="inline-block rounded-sm py-1 text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              the contact form
            </a>{" "}
            or call {company.phone}.
          </p>
        </div>
      </Container>
    </section>
  );
}
