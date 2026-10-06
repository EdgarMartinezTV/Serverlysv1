"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useLoop } from "./use-loop";

/**
 * Grow, first row: ConvoAI working on a real small-business site at 2am.
 *
 * The chat window is the REAL ConvoAI widget, rebuilt from its source
 * (ConvoAI repo, static/js/convoai-widget.js — byte-identical to what
 * convoai.cloud serves, checked 2026-10-05): the #18181b window, the zinc
 * bot bubbles with "Name · time" under them, the accent-coloured visitor
 * bubbles, the three-dot typing indicator, the rounded input with its round
 * send button, the "Privacy Policy · Powered by ConvoAI" footer, and the
 * white launcher whose chat icon turns into a chevron while open. Accent is
 * convoai.cloud's own, #2292A4. Change that file, change this.
 *
 * Every measurement is the widget's own pixel value times `--u`, the scale at
 * which a 380px widget fits this mockup, so proportions stay exact at any
 * width.
 *
 * Decorative (aria-hidden) with a figcaption. Stops off-screen; under
 * prefers-reduced-motion it shows the finished conversation, no cursor.
 */

const ACCENT = "#2292A4";
const AGENT = "Crumb & Co.";
const GREETING = "Hi! I'm the Crumb & Co. assistant. Ask me about our breads, cakes or opening hours.";

type Msg = { role: "user" | "bot"; text: string; time: string };

const MESSAGES: readonly Msg[] = [
  { role: "user", text: "Do you do custom cakes for Saturday?", time: "02:04 AM" },
  {
    role: "bot",
    text: "We do! Order by Thursday 6pm for Saturday pickup. Want me to start one for you?",
    time: "02:04 AM",
  },
  { role: "user", text: "Yes please, chocolate, for 12 people.", time: "02:05 AM" },
  {
    role: "bot",
    text: "Done. I've sent your order to the team, and they'll confirm the price by 9am.",
    time: "02:05 AM",
  },
];

/*
 * Steps (ms each holds). The cursor's part — rest, travel, click — is
 * unchanged from the first version.
 *  0 page at rest        1 cursor to the launcher    2 click
 *  3 open, greeting      4 visitor types message 1   5 sent
 *  6 agent typing        7 agent reply 1             8 visitor types message 2
 *  9 sent               10 agent typing             11 agent reply 2
 * 12 closes, reset
 */
const STEPS = [900, 950, 260, 1100, 1450, 350, 1100, 1900, 1400, 350, 1000, 3400, 700] as const;
const SHOWN = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4] as const;
const COMPOSE: Partial<Record<number, number>> = { 4: 0, 8: 2 };
const CHAR_MS = 32;

/** Widget pixels → this mockup. 380px widget ≈ 45.8cqw. */
const u = (px: number) => `calc(var(--u) * ${px})`;

export function GrowChatShowcase() {
  const root = useRef<HTMLElement>(null);
  const { step, reduced } = useLoop(STEPS, root);
  // Stamped with the step it belongs to, so a new message never flashes the
  // previous one's length before the first frame resets it.
  const [typed, setTyped] = useState({ step: -1, chars: 0 });

  // The visitor's words go into the input a character at a time.
  const composing = !reduced ? COMPOSE[step] : undefined;
  useEffect(() => {
    if (composing === undefined) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      setTyped({ step, chars: Math.floor((now - start) / CHAR_MS) });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [composing, step]);

  const open = reduced || (step >= 3 && step <= 11);
  const shown = reduced ? MESSAGES.length : SHOWN[step];
  const typing = !reduced && (step === 6 || step === 10);
  const draft =
    composing === undefined || typed.step !== step ? "" : MESSAGES[composing].text.slice(0, typed.chars);
  // The cursor travels to the launcher and clicks (steps 1-2), then stays
  // there, invisible, until the loop restarts; it jumps home unseen.
  const cursorAtLauncher = !reduced && step >= 1;
  const cursorHidden = open || step === 12;
  const pressed = !reduced && step === 2;

  return (
    <figure
      ref={root}
      className="@container relative w-full"
      style={{ "--u": "0.1205cqw" } as React.CSSProperties}
    >
      <figcaption className="sr-only">
        A bakery&apos;s website at 2:04am with the ConvoAI chat widget. A visitor opens it, asks
        about a custom cake for Saturday, and the agent answers and sends the order to the team.
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
          <div className="relative aspect-[4/3.3]">
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

            {/* ── ConvoAI widget: window (.cw-window) ── */}
            <div
              className="absolute flex flex-col overflow-hidden text-white"
              style={{
                right: u(20),
                bottom: u(90),
                top: u(14),
                width: u(380),
                background: "#18181b",
                borderRadius: u(16),
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
                lineHeight: 1.5,
                fontSize: u(15),
                transformOrigin: "bottom right",
                transition: "opacity .3s cubic-bezier(.4,0,.2,1), transform .3s cubic-bezier(.4,0,.2,1)",
                opacity: open ? 1 : 0,
                transform: open ? "none" : `translateY(${u(20)}) scale(0.95)`,
              }}
            >
              {/* .cw-header */}
              <div className="flex shrink-0 items-center justify-between" style={{ padding: `${u(16)} ${u(20)}` }}>
                <div className="flex items-center" style={{ gap: u(12) }}>
                  <span className="relative shrink-0 overflow-hidden" style={{ width: u(32), height: u(32), borderRadius: u(8) }}>
                    <Image src="/brand/convoai-favicon.png" alt="" fill sizes="32px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block font-bold" style={{ fontSize: u(15), letterSpacing: u(-0.2) }}>
                      {AGENT}
                    </span>
                    <span className="block" style={{ fontSize: u(13), color: "#a1a1aa", marginTop: u(2) }}>
                      Ask me anything
                    </span>
                  </span>
                </div>
                <span className="flex opacity-70" style={{ gap: u(12) }}>
                  <svg viewBox="0 0 24 24" fill="#fff" style={{ width: u(20), height: u(20) }}>
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="#fff" style={{ width: u(20), height: u(20) }}>
                    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </span>
              </div>

              {/* .cw-messages — anchored to the bottom, older turns scroll off the top */}
              <div
                className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden"
                style={{ padding: `${u(20)} ${u(20)} 0`, gap: u(24) }}
              >
                <BotMessage text={GREETING} time="02:04 AM" />
                {MESSAGES.slice(0, shown).map((m, i) =>
                  m.role === "bot" ? (
                    <BotMessage key={i} text={m.text} time={m.time} />
                  ) : (
                    <div key={i} className="flex animate-[cwMsgIn_.3s_ease-out_both] flex-col">
                      <span
                        className="self-end"
                        style={{
                          maxWidth: "85%",
                          padding: `${u(12)} ${u(16)}`,
                          background: ACCENT,
                          borderRadius: u(16),
                          borderBottomRightRadius: u(4),
                        }}
                      >
                        {m.text}
                      </span>
                    </div>
                  ),
                )}
                {/* .cw-typing */}
                <div
                  className={cn("items-center self-start", typing ? "flex" : "hidden")}
                  style={{ gap: u(4), padding: `0 ${u(16)}`, marginBottom: u(20) }}
                >
                  {[-320, -160, 0].map((d) => (
                    <span
                      key={d}
                      className="animate-[cwBounce_1.4s_ease-in-out_infinite_both] rounded-full"
                      style={{ width: u(6), height: u(6), background: "#666", animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
                {!typing && <span style={{ height: u(1) }} />}
              </div>

              {/* .cw-footer-container */}
              <div className="shrink-0" style={{ padding: `${u(16)} ${u(20)} ${u(20)}` }}>
                <div
                  className="flex flex-col"
                  style={{
                    background: "#27272a",
                    border: `1px solid ${draft ? "#52525b" : "#3f3f46"}`,
                    borderRadius: u(24),
                    padding: `${u(8)} ${u(8)} ${u(8)} ${u(16)}`,
                    gap: u(8),
                  }}
                >
                  <span className="truncate" style={{ padding: `${u(4)} 0`, color: draft ? "#fff" : "#71717a" }}>
                    {draft || "Ask a question..."}
                    {draft && <span className="ml-px inline-block animate-pulse" style={{ width: 1, height: "1em", background: "#fff", verticalAlign: "-0.15em" }} />}
                  </span>
                  <span className="flex justify-end">
                    <span
                      className="flex items-center justify-center rounded-full transition-colors duration-200"
                      style={{
                        width: u(32),
                        height: u(32),
                        background: draft ? "#fff" : "#3f3f46",
                        color: draft ? "#000" : "#71717a",
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: u(16), height: u(16) }}>
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" transform="rotate(-90 12 12)" />
                      </svg>
                    </span>
                  </span>
                </div>
              </div>

              {/* .cw-powered */}
              <div className="text-center" style={{ fontSize: u(11), color: "#71717a", padding: `${u(10)} 0` }}>
                <span style={{ color: "#a1a1aa" }}>Privacy Policy</span> · Powered by{" "}
                <span style={{ color: "#a1a1aa" }}>ConvoAI</span>
              </div>
            </div>

            {/* ── ConvoAI widget: launcher (.cw-launcher) ── */}
            <span
              className="absolute flex items-center justify-center rounded-full bg-white"
              style={{
                right: u(20),
                bottom: u(20),
                width: u(56),
                height: u(56),
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "transform .2s cubic-bezier(.25,.1,.25,1)",
                transform: pressed ? "scale(0.92)" : "none",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="absolute transition-[opacity,transform] duration-200"
                style={{
                  width: u(24),
                  height: u(24),
                  opacity: open ? 0 : 1,
                  transform: open ? "rotate(90deg) scale(.5)" : "none",
                }}
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#000" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                className="absolute transition-[opacity,transform] duration-200"
                style={{
                  width: u(24),
                  height: u(24),
                  opacity: open ? 1 : 0,
                  transform: open ? "none" : "rotate(-90deg) scale(.5)",
                }}
              >
                <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="#000" />
              </svg>
            </span>

            {/* Cursor — same path, timing and click as before */}
            {!reduced && (
              <svg
                viewBox="0 0 24 24"
                className={cn(
                  "absolute size-[4.4cqw] drop-shadow-[0_2px_4px_rgb(0_0_0/0.35)]",
                  step !== 0 &&
                    "transition-[left,top,opacity,transform] duration-[900ms] ease-[cubic-bezier(0.45,0,0.2,1)]",
                  cursorAtLauncher ? "left-[92.4%] top-[91.4%]" : "left-[60%] top-[48%]",
                  pressed ? "scale-90" : "scale-100",
                  cursorHidden ? "opacity-0 duration-200" : "opacity-100",
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

/** .cw-message.cw-bot + .cw-bot-meta */
function BotMessage({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex animate-[cwMsgIn_.3s_ease-out_both] flex-col" style={{ gap: u(4) }}>
      <span
        className="self-start"
        style={{
          maxWidth: "85%",
          padding: `${u(12)} ${u(16)}`,
          background: "#27272a",
          borderRadius: u(16),
          borderBottomLeftRadius: u(4),
        }}
      >
        {text}
      </span>
      <span className="self-start" style={{ fontSize: u(11), color: "#a1a1aa", marginTop: u(4), marginLeft: u(2) }}>
        {AGENT} · {time}
      </span>
    </div>
  );
}
