"use client";

import Image from "next/image";
import { useRef } from "react";
import { ConvoAiLogo } from "@/components/layout/convoai-logo";
import { cn } from "@/lib/utils";
import { useLoop } from "./use-loop";

/**
 * Grow, first row: ConvoAI working on a real small-business site at 2am.
 *
 * A bakery's homepage in a browser, on a pale gradient plate. A cursor goes to
 * the chat launcher and clicks; the ConvoAI widget opens and a visitor asks
 * about a custom cake. The agent answers from the bakery's own details, takes
 * the order request and hands it to the team — the claims on this row, shown
 * rather than told.
 *
 * Decorative (aria-hidden) with a figcaption. Stops off-screen; under
 * prefers-reduced-motion it shows the finished conversation, no cursor.
 */

type Msg = { from: "visitor" | "agent"; text: string };

const MESSAGES: readonly Msg[] = [
  { from: "visitor", text: "Hi! Do you do custom cakes for Saturday?" },
  {
    from: "agent",
    text: "We do. Order by Thursday 6pm for Saturday pickup. Want me to start one for you?",
  },
  { from: "visitor", text: "Yes please, chocolate, for 12 people." },
  {
    from: "agent",
    text: "Done. I've sent it to the team; they'll confirm by 9am with the price.",
  },
];

/*
 * Steps (ms each holds):
 *  0 page at rest          1 cursor travels to the launcher
 *  2 click                 3 widget open, empty
 *  4 visitor 1             5 agent typing
 *  6 agent 1               7 visitor 2
 *  8 agent typing          9 agent 2 + handover chip
 * 10 widget closes, reset
 */
const STEPS = [900, 950, 260, 650, 1150, 1000, 1900, 1400, 950, 3400, 650] as const;

/** How many messages are visible, and whether the agent is typing, per step. */
function frame(step: number) {
  const shown = [0, 0, 0, 0, 1, 1, 2, 3, 3, 4, 4][step];
  const typing = step === 5 || step === 8;
  return { shown, typing, open: step >= 3 && step <= 9, handover: step === 9 };
}

export function GrowChatShowcase() {
  const root = useRef<HTMLElement>(null);
  const { step, reduced } = useLoop(STEPS, root);
  const f = reduced ? { shown: 4, typing: false, open: true, handover: true } : frame(step);
  const cursorAtLauncher = !reduced && step >= 1 && step <= 2;
  const pressed = !reduced && step === 2;

  return (
    <figure ref={root} className="@container relative w-full">
      <figcaption className="sr-only">
        A bakery&apos;s website at 2:04am. A visitor opens the ConvoAI chat, asks about a custom
        cake for Saturday, and the agent answers and sends the order request to the team.
      </figcaption>

      <div
        aria-hidden="true"
        className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(140deg,#eef3ff_0%,#e3ecfb_45%,#d9e6f6_100%)] p-[6cqw]"
      >
        {/* Browser */}
        <div className="overflow-hidden rounded-[2cqw] bg-white shadow-[0_30px_60px_-30px_rgb(15_23_42/0.45),0_0_0_1px_rgb(15_23_42/0.06)]">
          <div className="flex items-center gap-[1.4cqw] border-b border-[#eceef2] bg-[#f6f7f9] px-[2cqw] py-[1.3cqw]">
            <span className="flex gap-[0.8cqw]">
              <span className="size-[1.4cqw] rounded-full bg-[#ff5f57]" />
              <span className="size-[1.4cqw] rounded-full bg-[#febc2e]" />
              <span className="size-[1.4cqw] rounded-full bg-[#28c840]" />
            </span>
            <span className="mx-auto rounded-[0.8cqw] bg-white px-[3cqw] py-[0.5cqw] text-[1.55cqw] text-[#5b6170] shadow-[0_0_0_1px_rgb(15_23_42/0.06)]">
              crumbandco.com
            </span>
            <span className="w-[5cqw]" />
          </div>

          {/* The bakery's homepage */}
          <div className="relative aspect-[16/11]">
            <Image
              src="/mock/site-bakery.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
              style={{ objectPosition: "50% 75%" }}
            />
            <div className="absolute inset-x-[3%] top-[4%] flex items-center justify-between rounded-[1.2cqw] bg-white/95 px-[2.4cqw] py-[1.2cqw]">
              <span className="font-display text-[2cqw] font-semibold tracking-[-0.02em] text-[#2b1d12]">
                crumb &amp; co.
              </span>
              <span className="flex items-center gap-[2cqw] text-[1.5cqw] font-medium text-[#4a3b2f]">
                <span>Breads</span>
                <span>Cakes</span>
                <span className="rounded-[0.8cqw] bg-[#f3e6d6] px-[1.5cqw] py-[0.5cqw] font-semibold text-[#7a4a1d]">
                  Order
                </span>
              </span>
            </div>
            <p className="absolute left-[5%] top-[19%] font-display text-[5.2cqw] font-semibold leading-[0.95] tracking-[-0.04em] text-[#2b1d12]">
              Baked before
              <br />
              sunrise.
            </p>

            {/* Chat launcher */}
            <span
              className={cn(
                "absolute bottom-[5%] right-[4%] flex size-[8cqw] items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_24px_-8px_rgb(0_0_255/0.6)]",
                "transition-[transform,opacity] duration-200",
                f.open ? "scale-50 opacity-0" : pressed ? "scale-90" : "scale-100",
              )}
            >
              <svg viewBox="0 0 24 24" className="size-[3.6cqw]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12.5a7.5 7.5 0 0 1-11 6.6L4 20l1-4.4A7.5 7.5 0 1 1 20 12.5Z" />
              </svg>
            </span>

            {/* ConvoAI widget */}
            <div
              className={cn(
                "absolute bottom-[4%] right-[3%] flex h-[88%] w-[52%] origin-bottom-right flex-col overflow-hidden rounded-[2cqw] bg-white",
                "shadow-[0_24px_50px_-20px_rgb(15_23_42/0.5),0_0_0_1px_rgb(15_23_42/0.06)]",
                "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                f.open ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0",
              )}
            >
              <div className="flex items-center gap-[1.2cqw] bg-primary px-[2cqw] py-[1.6cqw] text-white">
                <span className="flex size-[4.2cqw] items-center justify-center rounded-full bg-white/20 font-display text-[1.6cqw] font-semibold">
                  C&amp;
                </span>
                <span className="min-w-0">
                  <span className="block text-[1.7cqw] font-semibold leading-tight">Crumb &amp; Co. assistant</span>
                  <span className="flex items-center gap-[0.6cqw] text-[1.3cqw] text-white/80">
                    <span className="size-[0.9cqw] rounded-full bg-[#4ade80]" />
                    Online · replies instantly
                  </span>
                </span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col justify-end gap-[1.1cqw] overflow-hidden bg-[#f7f8fb] px-[1.8cqw] py-[1.6cqw]">
                <span className="mx-auto rounded-full bg-white px-[1.4cqw] py-[0.3cqw] text-[1.2cqw] text-[#6b7280] shadow-[0_0_0_1px_rgb(15_23_42/0.05)]">
                  Today 2:04 AM
                </span>
                {MESSAGES.slice(0, f.shown).map((m, i) => (
                  <span
                    key={i}
                    className={cn(
                      "max-w-[84%] animate-[chatIn_260ms_ease-out_both] rounded-[1.6cqw] px-[1.6cqw] py-[1cqw] text-[1.45cqw] leading-snug",
                      m.from === "visitor"
                        ? "self-end rounded-br-[0.4cqw] bg-primary text-white"
                        : "self-start rounded-bl-[0.4cqw] bg-white text-[#1f2430] shadow-[0_1px_2px_rgb(15_23_42/0.08)]",
                    )}
                  >
                    {m.text}
                  </span>
                ))}
                {f.typing && (
                  <span className="flex gap-[0.6cqw] self-start rounded-[1.6cqw] rounded-bl-[0.4cqw] bg-white px-[1.6cqw] py-[1.3cqw] shadow-[0_1px_2px_rgb(15_23_42/0.08)]">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="size-[0.9cqw] animate-bounce rounded-full bg-[#9aa1ad]"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                )}
                {f.handover && (
                  <span className="flex animate-[chatIn_260ms_ease-out_both] items-center gap-[0.8cqw] self-center rounded-full bg-[#e8f7ee] px-[1.6cqw] py-[0.6cqw] text-[1.25cqw] font-semibold text-[#15803d]">
                    <svg viewBox="0 0 16 16" className="size-[1.5cqw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3.5 8.5 3 3 6-7" />
                    </svg>
                    Order request sent to the team
                  </span>
                )}
              </div>

              <div className="flex items-center gap-[1cqw] border-t border-[#eceef2] px-[1.8cqw] py-[1.2cqw]">
                <span className="flex-1 rounded-full bg-[#f2f3f6] px-[1.6cqw] py-[0.8cqw] text-[1.3cqw] text-[#9aa1ad]">
                  Type a message…
                </span>
                <span className="flex items-center gap-[0.6cqw] text-[1.05cqw] text-[#9aa1ad]">
                  by
                  <ConvoAiLogo tone="light" className="h-[1.8cqw] w-auto" />
                </span>
              </div>
            </div>

            {/* Cursor */}
            {!reduced && (
              <svg
                viewBox="0 0 24 24"
                className={cn(
                  "absolute size-[4.4cqw] drop-shadow-[0_2px_4px_rgb(0_0_0/0.35)]",
                  "transition-[left,top,opacity,transform] duration-[900ms] ease-[cubic-bezier(0.45,0,0.2,1)]",
                  cursorAtLauncher ? "left-[89%] top-[85%]" : "left-[60%] top-[48%]",
                  pressed ? "scale-90" : "scale-100",
                  f.open ? "opacity-0" : "opacity-100",
                )}
              >
                <path d="M5 2.5 19 13l-6.2.9 3.7 6.9-2.7 1.4-3.6-7L5 19.5Z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}
