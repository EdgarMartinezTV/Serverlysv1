"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useLoop } from "./use-loop";

/**
 * Grow, first row: ConvoAI working on a real small-business site at 2am.
 *
 * The chat window is the REAL ConvoAI messenger, rebuilt from its source
 * (ConvoAI repo, src/server/widget/convoai-widget.js v6.0.0, byte-identical
 * to what convoai.cloud serves, checked 2026-10-25): the dark speech-bubble
 * launcher with its three hopping dots and unread badge, the white pop-out
 * welcome line, the 400px white panel with its avatar header, the welcome
 * intro (avatar, name, tagline, three marks, "AI assistant" fact), grey bot
 * bubbles with "Name • AI Agent • Just now", brand-coloured visitor bubbles,
 * the typing bubble with the mark's three coloured dots, the composer with
 * its paperclip and round send button, and the privacy/"Powered by ConvoAI" footer. The dots fold into an
 * x while open. Accent is convoai.cloud's own Ocean Blue, #2F6BFF, and the dot colours
 * are the ones the widget derives from it. With no logo set, the widget shows
 * the ConvoAI mark as the avatar, as here. Change that file, change this.
 *
 * Shown as configured with Home off and the lead card off (both real
 * settings), so the launcher opens straight into the conversation.
 *
 * Every measurement is the widget's own pixel value times `--u`, so
 * proportions stay exact at any width.
 *
 * Decorative (aria-hidden) with a figcaption. Stops off-screen; under
 * prefers-reduced-motion it shows the finished conversation, no cursor.
 */

const BRAND = "#2F6BFF";
const INK = "#14161a";
const MUTED = "#6c6f74";
const LINE = "rgba(9,14,21,0.08)";
/** The launcher's dots, and the intro marks and typing dots, as the widget derives them from BRAND. */
const DOTS = ["#14c3c3", "#4f86ff", "#ff8a3d"] as const;
const MARKS = ["#bfc20f", "#2f6bff", "#e07a12"] as const;
const AGENT = "Crumb & Co.";
const TAGLINE = "Breads, cakes & pastries";
const WELCOME = "Hi! Looking for something sweet? Ask me anything.";
const GREETING =
  "Hi! I'm the Crumb & Co. assistant. Ask me about our breads, cakes or opening hours.";

type Msg = { role: "user" | "bot"; text: string };

const MESSAGES: readonly Msg[] = [
  { role: "user", text: "Do you do custom cakes for Saturday?" },
  {
    role: "bot",
    text: "We do! Order by Thursday 6pm for Saturday pickup. Want me to start one for you?",
  },
  { role: "user", text: "Yes please, chocolate, for 12 people." },
  {
    role: "bot",
    text: "Done. I've sent your order to the team, and they'll confirm the price by 9am.",
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
const STEPS = [
  900, 950, 260, 1100, 1450, 350, 1100, 1900, 1400, 350, 1000, 3400, 700,
] as const;
const SHOWN = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4] as const;
const COMPOSE: Partial<Record<number, number>> = { 4: 0, 8: 2 };
const CHAR_MS = 32;

/** Widget pixels → this mockup. */
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
    composing === undefined || typed.step !== step
      ? ""
      : MESSAGES[composing].text.slice(0, typed.chars);
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
        A bakery&apos;s website at 2:04am with the ConvoAI chat widget. A visitor opens
        it, asks about a custom cake for Saturday, and the agent answers and sends the
        order to the team.
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

            {/* ── ConvoAI messenger: pop-out welcome line (.cw-pop.cw-text) ── */}
            <div
              className="absolute"
              style={{
                right: u(20),
                bottom: u(88),
                maxWidth: u(300),
                padding: `${u(12)} ${u(16)}`,
                background: "#fff",
                color: INK,
                borderRadius: `${u(20)} ${u(20)} ${u(6)} ${u(20)}`,
                boxShadow:
                  "0 6px 30px rgba(9,14,21,0.16), 0 0 0 1px rgba(9,14,21,0.04)",
                fontFamily: FONT,
                fontSize: u(15),
                lineHeight: 1.4,
                transformOrigin: "bottom right",
                transition:
                  "transform 460ms cubic-bezier(0.34,1.56,0.64,1), opacity 160ms ease-out",
                opacity: open ? 0 : 1,
                transform: open ? `translate(${u(8)}, ${u(12)}) scale(0.35)` : "none",
              }}
            >
              {WELCOME}
            </div>

            {/* ── ConvoAI messenger: panel (.cw-panel) ── */}
            <div
              className="absolute flex flex-col overflow-hidden"
              style={{
                right: u(20),
                bottom: u(92),
                top: u(20),
                width: u(400),
                background: "#fff",
                color: INK,
                borderRadius: u(24),
                boxShadow: "0 5px 40px rgba(9,14,21,0.16)",
                fontFamily: FONT,
                fontSize: u(14),
                lineHeight: 1.4,
                transformOrigin: "bottom right",
                transition:
                  "transform 300ms cubic-bezier(0,1.2,1,1), opacity 83ms ease-out",
                opacity: open ? 1 : 0,
                transform: open ? "none" : `translateY(${u(16)}) scale(0.96)`,
              }}
            >
              {/* .cw-head.cw-scrolled — the thread here always overflows */}
              <div
                className="relative z-[2] flex shrink-0 items-center bg-white"
                style={{
                  height: u(64),
                  gap: u(8),
                  padding: `0 ${u(13)} 0 ${u(16)}`,
                  boxShadow: `0 1px 0 ${LINE}, 0 4px 12px rgba(9,14,21,.04)`,
                }}
              >
                <Avatar size={32} radius={8} dot={10} ring={2} />
                <span className="min-w-0 flex-1" style={{ paddingLeft: u(4) }}>
                  <span
                    className="block truncate font-semibold"
                    style={{ fontSize: u(14), lineHeight: 1.1 }}
                  >
                    {AGENT}
                  </span>
                  <span
                    className="block truncate"
                    style={{ fontSize: u(12.7), lineHeight: 1.45, color: MUTED }}
                  >
                    {TAGLINE}
                  </span>
                </span>
                {[
                  <g key="more">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </g>,
                  <path key="close" d={X_PATH} />,
                ].map((icon) => (
                  <span
                    key={icon.key}
                    className="flex shrink-0 items-center justify-center"
                    style={{ width: u(38), height: u(38), color: MUTED }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ width: u(18), height: u(18) }}
                    >
                      {icon}
                    </svg>
                  </span>
                ))}
              </div>

              {/* .cw-thread — scrolled to the newest message, older content leaves the top */}
              <div
                className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden"
                style={{ padding: `${u(14)} ${u(16)} ${u(16)}` }}
              >
                {/* .cw-intro */}
                <div
                  className="flex shrink-0 flex-col items-center text-center"
                  style={{ padding: `${u(12)} ${u(8)} ${u(18)}` }}
                >
                  <Avatar size={56} radius={16} dot={13} ring={3} shadow />
                  <span
                    className="font-semibold"
                    style={{
                      marginTop: u(12),
                      fontSize: u(17),
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {AGENT}
                  </span>
                  <span style={{ marginTop: u(2), fontSize: u(13), color: MUTED }}>
                    {TAGLINE}
                  </span>
                  <span className="flex" style={{ gap: u(4), marginTop: u(10) }}>
                    {MARKS.map((c) => (
                      <span
                        key={c}
                        className="rounded-full"
                        style={{ width: u(5), height: u(5), background: c }}
                      />
                    ))}
                  </span>
                  <span
                    className="inline-flex items-center rounded-full"
                    style={{
                      gap: u(6),
                      marginTop: u(12),
                      padding: `${u(5)} ${u(10)}`,
                      fontSize: u(12),
                      color: MUTED,
                      background: "#f7f7f8",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ width: u(12), height: u(12) }}
                    >
                      <path d="M11 2h2v3h4a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h4zM9 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                    </svg>
                    AI assistant · a person can step in
                  </span>
                </div>

                {/* .cw-day */}
                <span
                  className="shrink-0 self-center"
                  style={{
                    fontSize: u(12),
                    color: MUTED,
                    margin: `${u(4)} 0 ${u(14)}`,
                  }}
                >
                  Today
                </span>

                <Message role="bot" text={GREETING} first />
                {MESSAGES.slice(0, shown).map((m, i) => (
                  <Message key={i} role={m.role} text={m.text} />
                ))}

                {/* .cw-typing — a .cw-msg, so it enters like one; `.cw-msg + .cw-msg`
                    beats `.cw-typing`'s 16px, leaving it 4px under the visitor's turn.
                    Grey bot bubble with the mark's lime / teal / orange dots, as in
                    convoai.cloud's own messenger mockups (checked 2026-10-11). */}
                {typing && (
                  <span
                    className="flex shrink-0 animate-[cwIn_260ms_cubic-bezier(0.16,1,0.3,1)_both] self-start"
                    style={{ marginTop: u(4) }}
                  >
                    <span
                      className="flex items-center"
                      style={{
                        gap: u(4),
                        height: u(44),
                        padding: `0 ${u(18)}`,
                        borderRadius: u(20),
                        background: "#f5f5f5",
                      }}
                    >
                      {MARKS.map((c, i) => (
                        <span
                          key={c}
                          className="animate-[cwBlink_1.2s_ease-in-out_infinite_both] rounded-full"
                          style={{
                            width: u(7),
                            height: u(7),
                            background: c,
                            animationDelay: `${i * 150}ms`,
                          }}
                        />
                      ))}
                    </span>
                  </span>
                )}
              </div>

              {/* .cw-compose */}
              <div
                className="shrink-0 bg-white"
                style={{ padding: `0 ${u(16)} ${u(8)}` }}
              >
                <div
                  className="flex items-end transition-shadow duration-150"
                  style={{
                    gap: u(8),
                    padding: `${u(8)} ${u(8)} ${u(8)} ${u(16)}`,
                    borderRadius: u(16),
                    boxShadow: draft
                      ? "0 0 0 1px rgba(9,14,21,0.22), 0 2px 12px rgba(9,14,21,0.06)"
                      : "0 0 0 1px rgba(9,14,21,0.1), 0 2px 8px rgba(9,14,21,0.04)",
                  }}
                >
                  <span
                    className="min-w-0 flex-1 truncate"
                    style={{
                      fontSize: u(14),
                      lineHeight: u(21),
                      padding: `${u(5)} 0 ${u(6)}`,
                      color: draft ? INK : MUTED,
                    }}
                  >
                    {draft || "Ask a question…"}
                    {draft && (
                      <span
                        className="ml-px inline-block animate-pulse"
                        style={{
                          width: 1,
                          height: "1.1em",
                          background: INK,
                          verticalAlign: "-0.2em",
                        }}
                      />
                    )}
                  </span>
                  {/* .cw-attach */}
                  <span
                    className="flex shrink-0 items-center justify-center"
                    style={{ width: u(32), height: u(32), color: MUTED }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ width: u(18), height: u(18) }}
                    >
                      <path d="M16.5 6.5v10a4.5 4.5 0 0 1-9 0V5a3 3 0 0 1 6 0v10.5a1.5 1.5 0 0 1-3 0V6.5H9v9a3 3 0 0 0 6 0V5a4.5 4.5 0 0 0-9 0v11.5a6 6 0 0 0 12 0v-10z" />
                    </svg>
                  </span>
                  {/* .cw-send — enabled (brand) once there is a draft */}
                  <span
                    className="flex shrink-0 items-center justify-center rounded-full text-white transition-colors duration-150"
                    style={{
                      width: u(32),
                      height: u(32),
                      background: draft ? BRAND : "rgba(9,14,21,0.1)",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ width: u(16), height: u(16) }}
                    >
                      <path d={ARROW_UP} />
                    </svg>
                  </span>
                </div>
              </div>

              {/* .cw-legal */}
              <div
                className="shrink-0 text-center"
                style={{
                  fontSize: u(12),
                  color: MUTED,
                  padding: `${u(8)} ${u(16)} ${u(12)}`,
                }}
              >
                By chatting with us, you agree to our{" "}
                <span className="underline underline-offset-2">Privacy Policy</span>
                <span
                  className="block opacity-80"
                  style={{ marginTop: u(2), fontSize: u(11) }}
                >
                  Powered by{" "}
                  <span className="underline underline-offset-2">ConvoAI</span>
                </span>
              </div>
            </div>

            {/* ── ConvoAI messenger: launcher (.cw-launcher) — speech bubble, tail to the corner ── */}
            <span
              className="absolute flex items-center justify-center"
              style={{
                right: u(20),
                bottom: u(20),
                width: u(56),
                height: u(56),
                background: "#111111",
                borderRadius: open ? "50%" : `50% 50% ${u(14)} 50%`,
                boxShadow: "0 1px 6px rgba(0,0,0,0.08), 0 8px 28px rgba(0,0,0,0.22)",
                transition:
                  "transform 220ms cubic-bezier(0.33,0,0,1), border-radius 320ms cubic-bezier(0.65,0,0.35,1)",
                transform: pressed ? "scale(0.94)" : "none",
              }}
            >
              {/* .cw-dots — fold into an x while open */}
              <span className="relative" style={{ width: u(30), height: u(8) }}>
                {DOTS.map((c, i) => {
                  const ease = "320ms cubic-bezier(0.65,0,0.35,1)";
                  const bar = open && i !== 1;
                  return (
                    <span
                      key={c}
                      className={cn(
                        "absolute",
                        !open &&
                          "animate-[cwHop_6s_cubic-bezier(0.33,0,0.2,1)_infinite]",
                      )}
                      style={{
                        top: bar ? u(2.75) : 0,
                        left: bar ? u(5) : u(i * 11),
                        width: bar ? u(20) : u(8),
                        height: bar ? u(2.5) : u(8),
                        borderRadius: u(4),
                        background: open ? "#fff" : c,
                        opacity: open && i === 1 ? 0 : 1,
                        transform: bar
                          ? `rotate(${i === 0 ? 45 : -45}deg)`
                          : open
                            ? "scale(0)"
                            : undefined,
                        animationDelay: `${1200 + i * 120}ms`,
                        transition: `left ${ease}, top ${ease}, width ${ease}, height ${ease}, transform ${ease}, opacity 200ms, background-color 200ms`,
                      }}
                    />
                  );
                })}
              </span>
              {/* .cw-badge — the unread welcome line */}
              <span
                className="absolute text-center font-semibold text-white"
                style={{
                  top: u(-3),
                  left: u(-3),
                  minWidth: u(18),
                  height: u(18),
                  padding: `0 ${u(5)}`,
                  borderRadius: u(9),
                  background: "#e5484d",
                  fontFamily: FONT,
                  fontSize: u(11),
                  lineHeight: u(18),
                  boxShadow: `0 0 0 ${u(2)} #fff`,
                  opacity: open ? 0 : 1,
                }}
              >
                1
              </span>
            </span>

            {/* Cursor — same path, timing and click as before */}
            {!reduced && (
              <svg
                viewBox="0 0 24 24"
                className={cn(
                  "absolute size-[4.4cqw] drop-shadow-[0_2px_4px_rgb(0_0_0/0.35)]",
                  step !== 0 &&
                    "transition-[left,top,opacity,transform] duration-[900ms] ease-[cubic-bezier(0.45,0,0.2,1)]",
                  cursorAtLauncher
                    ? "left-[92.4%] top-[91.4%]"
                    : "left-[60%] top-[48%]",
                  pressed ? "scale-90" : "scale-100",
                  cursorHidden ? "opacity-0 duration-200" : "opacity-100",
                )}
              >
                <path
                  d="M5 2.5 19 13l-6.2.9 3.7 6.9-2.7 1.4-3.6-7L5 19.5Z"
                  fill="#111"
                  stroke="#fff"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}

const FONT =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';
const X_PATH =
  "M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z";
const ARROW_UP =
  "M12 4a1 1 0 0 1 .7.3l6 6a1 1 0 1 1-1.4 1.4L13 7.4V19a1 1 0 1 1-2 0V7.4l-4.3 4.3a1 1 0 0 1-1.4-1.4l6-6A1 1 0 0 1 12 4z";

/** .cw-head-avatar / .cw-intro-avatar with the green online dot. */
function Avatar({
  size,
  radius,
  dot,
  ring,
  shadow,
}: {
  size: number;
  radius: number;
  dot: number;
  ring: number;
  shadow?: boolean;
}) {
  return (
    <span className="relative shrink-0">
      <span
        className="relative block overflow-hidden bg-[#f5f5f5]"
        style={{
          width: u(size),
          height: u(size),
          borderRadius: u(radius),
          boxShadow: shadow ? "0 6px 20px rgba(9,14,21,.12)" : undefined,
        }}
      >
        <Image
          src="/brand/convoai-favicon.png"
          alt=""
          fill
          sizes="56px"
          className="object-cover"
        />
      </span>
      <span
        className="absolute rounded-full bg-[#22c55e]"
        style={{
          right: u(-2),
          bottom: u(-2),
          width: u(dot),
          height: u(dot),
          boxShadow: `0 0 0 ${u(ring)} #fff`,
        }}
      />
    </span>
  );
}

/** .cw-msg (.cw-bot / .cw-user) + .cw-meta. Turns alternate, so each is a new group. */
function Message({
  role,
  text,
  first,
}: {
  role: Msg["role"];
  text: string;
  first?: boolean;
}) {
  const bot = role === "bot";
  return (
    <div
      className={cn(
        "flex shrink-0 animate-[cwIn_260ms_cubic-bezier(0.16,1,0.3,1)_both] flex-col",
        bot ? "self-start" : "items-end self-end",
      )}
      style={{ maxWidth: "80%", marginTop: first ? 0 : u(16) }}
    >
      <span
        style={{
          padding: `${u(12)} ${u(16)}`,
          borderRadius: u(20),
          fontSize: u(14),
          lineHeight: 1.4,
          background: bot ? "#f5f5f5" : BRAND,
          color: bot ? INK : "#fff",
        }}
      >
        {text}
      </span>
      <span
        style={{
          fontSize: u(12),
          color: MUTED,
          margin: bot ? `${u(6)} 0 0 ${u(16)}` : `${u(6)} ${u(16)} 0 0`,
        }}
      >
        {bot ? `${AGENT} • AI Agent • Just now` : "Just now"}
      </span>
    </div>
  );
}
