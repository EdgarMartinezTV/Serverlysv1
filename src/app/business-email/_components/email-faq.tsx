"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SeraOpenButton } from "@/components/sera/sera-open-button";
import { useReducedAfterMount } from "./use-reduced";

/**
 * "Before you buy" for /business-email: a sticky intro with a help card on
 * the left, numbered accordion cards on the right. Answers stay in the DOM
 * when closed (height 0, inert) so the text always matches the FAQPage
 * structured data that page.tsx emits from the same FAQS array.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function EmailFaq({
  items,
  supportEmail,
}: {
  items: readonly { question: string; answer: string }[];
  supportEmail: string;
}) {
  const [open, setOpen] = useState(0);
  const reduced = useReducedAfterMount();
  const base = useId();

  return (
    <section aria-labelledby="faq-heading" className="relative isolate overflow-hidden bg-canvas">
      <div
        aria-hidden="true"
        className="absolute -left-40 top-20 -z-10 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(31_85_255/0.08),transparent)]"
      />
      <div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-28">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_1px_2px_rgb(15_23_42/0.06),0_0_0_1px_var(--color-brand-100)]">
            <span className="size-1.5 rounded-full bg-primary" />
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-5 font-display text-[36px] font-normal leading-[1.08] tracking-[-0.03em] text-fg sm:text-[52px]"
          >
            Before you <span className="text-primary">buy</span>
          </h2>
          <p className="mt-4 max-w-[400px] text-body-lg text-fg-secondary">
            The things people actually ask us, answered plainly.
          </p>

          <div className="relative mt-10 overflow-hidden rounded-3xl bg-[linear-gradient(160deg,#0f1f4d,#071230_60%,#040b22)] p-7 text-white shadow-[0_30px_60px_-30px_rgb(4_11_34/0.7)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(31_85_255/0.55),transparent)]"
            />
            <p className="relative text-h4 font-semibold">Still have a question?</p>
            <p className="relative mt-2 text-small text-white/70">
              Ask Sera now, or write to the team and a real person will answer.
            </p>
            <div className="relative mt-6 flex flex-wrap items-center gap-4">
              <SeraOpenButton onDark label="Ask Sera" />
              <a
                href={`mailto:${supportEmail}`}
                className="text-small font-semibold text-[#bfd2ff] underline-offset-4 hover:text-white hover:underline"
              >
                {supportEmail}
              </a>
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {items.map((f, i) => {
            const isOpen = open === i;
            const panelId = `${base}-p${i}`;
            const btnId = `${base}-b${i}`;
            return (
              <li
                key={f.question}
                className={cn(
                  "rounded-2xl bg-white transition-shadow duration-300",
                  isOpen
                    ? "shadow-[0_20px_44px_-24px_rgb(0_0_255/0.35)] ring-1 ring-brand-200"
                    : "shadow-[0_1px_2px_rgb(15_23_42/0.04)] ring-1 ring-line hover:ring-brand-200",
                )}
              >
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center gap-4 rounded-2xl px-5 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-6"
                  >
                    <span
                      className={cn(
                        "font-mono text-caption tabular-nums transition-colors",
                        isOpen ? "text-primary" : "text-fg-muted",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-body-lg font-medium text-fg">{f.question}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        isOpen ? "rotate-45 bg-primary text-white" : "bg-brand-50 text-primary",
                      )}
                    >
                      <svg viewBox="0 0 16 16" className="size-3.5">
                        <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  inert={!isOpen}
                  className="overflow-hidden"
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE }}
                >
                  <p className="px-5 pb-6 pl-[3.25rem] text-body text-fg-secondary sm:px-6 sm:pl-[3.75rem]">
                    {f.answer}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
