"use client";

import { useEffect, useState } from "react";
import { MockPhoto } from "@/components/ui/mock-photo";
import { SeraMark } from "@/components/sera/sera-mark";
import { cn } from "@/lib/utils";

/**
 * Automations hero visual — 2026-10-03 (v3, animated).
 *
 * A composed product shot (workflow editor + three floating cards) that plays
 * one real execution of the enquiry → booking workflow on a loop:
 *
 *   typing → message → chat node fires → packet → AI Agent thinks (sub-ports
 *   pulse) → packet → Route → packets split → Calendar + CRM fire → booking
 *   card slides in, SMS/CRM tick, run counter +1 → hold → reset.
 *
 * Driven by one `step` counter and a duration table, so the choreography is
 * readable in one place. Packets are SVG <animateMotion> dots re-keyed per
 * run so they restart cleanly. The canvas box has the viewBox's aspect, so
 * the dots are never distorted.
 *
 * Reduced motion: renders the finished run and never ticks.
 */

type N = { id: string; x: number; y: number; w: number; title: string; icon: string; tone?: "agent" | "trigger" };

/* Positions in % of the 640×360 canvas. */
const NODES: N[] = [
  { id: "chat", x: 2, y: 40, w: 16, title: "Chat", icon: "chat", tone: "trigger" },
  { id: "agent", x: 22, y: 40, w: 26, title: "AI Agent", icon: "agent", tone: "agent" },
  { id: "route", x: 51, y: 40, w: 19, title: "Route", icon: "if" },
  { id: "cal", x: 76, y: 12, w: 22, title: "Calendar", icon: "cal" },
  { id: "crm", x: 76, y: 66, w: 22, title: "CRM", icon: "sheet" },
];

/* Node mid-line ≈ top% × 360 + 22 in viewBox units (single-row nodes). */
const W_CHAT_AGENT = "M 115 166 C 128 166, 128 166, 141 166";
const W_AGENT_ROUTE = "M 307 166 C 314 166, 320 166, 326 166";
const W_ROUTE_CAL = "M 448 166 C 468 166, 466 65, 486 65";
const W_ROUTE_CRM = "M 448 166 C 468 166, 466 260, 486 260";
const WIRES = [W_CHAT_AGENT, W_AGENT_ROUTE, W_ROUTE_CAL, W_ROUTE_CRM];
const SUBPORTS = [173, 224, 275];

/* The timeline. Index = step; value = how long that step lasts (ms). */
const STEPS = [
  700, //  0 idle
  1300, // 1 customer typing
  700, //  2 message arrives
  700, //  3 chat node fires
  700, //  4 packet → agent
  1800, // 5 agent thinking
  600, //  6 packet → route
  600, //  7 route fires
  800, //  8 packets → calendar + crm
  700, //  9 calendar + crm fire
  700, // 10 booking card in
  2600, // 11 hold (done)
];
const DONE = 11;

const MESSAGE = "Can you do a deep clean this Friday? 3 bed in Coral Gables.";

function Icon({ name, className = "size-4" }: { name: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {name === "chat" && <path d="M5 6h14v9H9l-4 3V6Z" {...p} />}
      {name === "agent" && (
        <>
          <rect x="5" y="8" width="14" height="10" rx="3" {...p} />
          <path d="M12 4v4M9 13h.01M15 13h.01" {...p} strokeWidth={2.4} />
        </>
      )}
      {name === "if" && <path d="M6 4v6a4 4 0 0 0 4 4h8M14 10l4 4-4 4M6 20v-4" {...p} />}
      {name === "cal" && (
        <>
          <rect x="4" y="5" width="16" height="15" rx="2" {...p} />
          <path d="M4 10h16M9 3v4M15 3v4" {...p} />
        </>
      )}
      {name === "sheet" && (
        <>
          <rect x="5" y="4" width="14" height="16" rx="2" {...p} />
          <path d="M5 10h14M5 15h14M11 4v16" {...p} />
        </>
      )}
      {name === "sms" && <path d="M4 5h16v11H8l-4 3V5ZM8 10h8" {...p} />}
      {name === "mem" && <path d="M6 7c0-1.7 2.7-3 6-3s6 1.3 6 3v10c0 1.7-2.7 3-6 3s-6-1.3-6-3V7Zm0 5c0 1.7 2.7 3 6 3s6-1.3 6-3" {...p} />}
    </svg>
  );
}

/** A glowing data packet travelling a wire once. */
function Packet({ path, dur }: { path: string; dur: number }) {
  const motion = (
    <animateMotion dur={`${dur}ms`} fill="freeze" path={path} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
  );
  return (
    <g>
      <circle r="9" fill="rgb(34 197 94 / 0.25)">{motion}</circle>
      <circle r="4.5" fill="rgb(74 222 128)">{motion}</circle>
    </g>
  );
}

function useTimeline() {
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    const t = setTimeout(sync, 0);
    mq.addEventListener("change", sync);
    return () => {
      clearTimeout(t);
      mq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => {
      if (step >= STEPS.length - 1) {
        setStep(0);
        setCycle((c) => c + 1);
      } else setStep(step + 1);
    }, STEPS[step]);
    return () => clearTimeout(t);
  }, [step, reduced]);

  return { step: reduced ? DONE : step, cycle, reduced };
}

export function HeroCanvas() {
  const { step, cycle, reduced } = useTimeline();

  /* Everything below is derived from `step`. */
  const fired: Record<string, boolean> = {
    chat: step >= 3,
    agent: step >= 6,
    route: step >= 7,
    cal: step >= 9,
    crm: step >= 9,
  };
  const active = step === 3 ? ["chat"] : step === 5 ? ["agent"] : step === 7 ? ["route"] : step === 9 ? ["cal", "crm"] : [];
  const running = step >= 3 && step < DONE - 1;
  const typing = step === 1;
  const messageShown = step >= 2;
  const bookingIn = step >= 10;
  const runs = 142 + cycle + (step >= 10 ? 1 : 0);
  const doneCount = Object.values(fired).filter(Boolean).length;

  return (
    <div aria-hidden="true" className="relative isolate px-0 py-6 sm:px-6 sm:pt-36 sm:pb-24">
      {/* Stage: blue light + angled slabs, as on the other heroes */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_55%_55%,rgb(0_0_255/0.45),transparent_70%)]" />
      <div className="absolute top-0 right-[6%] -z-10 hidden h-[34%] w-[42%] bg-primary/30 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] sm:block" />
      <div className="absolute bottom-0 left-[10%] -z-10 hidden h-[22%] w-[38%] bg-primary/25 [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)] sm:block" />

      {/* ── Editor window ─────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl bg-[#0b1530] shadow-[0_30px_80px_rgb(0_0_40/0.6)] ring-1 ring-white/10">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="truncate text-small font-semibold text-white">Enquiry → booking</span>
          <span className="hidden rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-white/70 sm:inline">Fern &amp; Fold Cleaning</span>
          <span className="ml-auto flex items-center gap-2">
            <span className="hidden text-[11px] text-white/60 sm:inline">Active</span>
            <span className="inline-flex h-4 w-7 items-center rounded-full bg-success-fill p-0.5">
              <span className="ml-auto size-3 rounded-full bg-white" />
            </span>
            <span
              className={cn(
                "hidden items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold text-white transition-colors duration-300 sm:inline-flex",
                running ? "bg-success-fill/90" : "bg-primary",
              )}
            >
              {running && <span className="size-1.5 animate-pulse rounded-full bg-white" />}
              {running ? "Executing…" : "Test workflow"}
            </span>
          </span>
        </div>

        <div className="flex">
          {/* Node palette */}
          <div className="hidden w-11 shrink-0 flex-col items-center gap-3 border-r border-white/10 py-4 text-white/50 sm:flex">
            {["chat", "agent", "cal", "sheet", "sms", "mem"].map((n, i) => (
              <span key={n} className={`inline-flex size-7 items-center justify-center rounded-lg ${i === 1 ? "bg-primary text-white" : ""}`}>
                <Icon name={n} />
              </span>
            ))}
          </div>

          {/* Canvas */}
          <div className="relative min-w-0 flex-1 [background-image:radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="relative aspect-[640/360] w-full">
              <svg viewBox="0 0 640 360" preserveAspectRatio="none" className="absolute inset-0 size-full">
                {WIRES.map((d, i) => {
                  const lit = i === 0 ? fired.chat : i === 1 ? fired.agent : fired.route;
                  return (
                    <path
                      key={d}
                      d={d}
                      fill="none"
                      stroke={lit ? "rgb(34 197 94 / 0.95)" : "rgb(255 255 255 / 0.22)"}
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                      style={{ transition: "stroke 300ms" }}
                    />
                  );
                })}
                {SUBPORTS.map((x) => (
                  <path
                    key={x}
                    d={`M ${x} 188 L ${x} 266`}
                    fill="none"
                    stroke={step === 5 ? "rgb(125 160 255 / 0.9)" : "rgb(255 255 255 / 0.3)"}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    vectorEffect="non-scaling-stroke"
                    className={step === 5 && !reduced ? "animate-[dash_600ms_linear_infinite]" : ""}
                  />
                ))}

                {/* Packets, re-keyed per run so each restarts */}
                {!reduced && step === 4 && <Packet key={`a${cycle}`} path={W_CHAT_AGENT} dur={600} />}
                {!reduced && step === 6 && <Packet key={`b${cycle}`} path={W_AGENT_ROUTE} dur={500} />}
                {!reduced && step === 8 && <Packet key={`c${cycle}`} path={W_ROUTE_CAL} dur={700} />}
                {!reduced && step === 8 && <Packet key={`d${cycle}`} path={W_ROUTE_CRM} dur={700} />}
              </svg>

              {NODES.map((n) => {
                const isActive = active.includes(n.id);
                const thinking = n.id === "agent" && step === 5;
                return (
                  <div
                    key={n.id}
                    style={{ left: `${n.x}%`, top: `${n.y}%`, width: `${n.w}%` }}
                    className={cn(
                      "absolute rounded-xl px-2 py-2 ring-1 transition-[box-shadow,transform] duration-300 sm:px-2.5",
                      n.tone === "agent" ? "bg-primary text-white ring-white/30" : "bg-[#131f42] text-white ring-white/15",
                      isActive && "scale-[1.04] shadow-[0_0_0_4px_rgb(34_197_94/0.35),0_0_30px_rgb(34_197_94/0.35)]",
                      !isActive && n.tone === "agent" && "shadow-[0_0_0_4px_rgb(0_0_255/0.25)]",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex size-5 shrink-0 items-center justify-center rounded-md sm:size-6 ${n.tone === "agent" ? "bg-white/20" : "bg-white/10"}`}>
                        {thinking ? (
                          <span className="size-3 animate-spin rounded-full border-2 border-white/40 [border-top-color:white]" />
                        ) : (
                          <Icon name={n.icon} className="size-3 sm:size-3.5" />
                        )}
                      </span>
                      <span className="truncate text-[10px] font-semibold sm:text-[12px]">{n.title}</span>
                    </div>
                    <span
                      className={cn(
                        "absolute -top-2 -right-2 inline-flex items-center gap-0.5 rounded-full bg-success-fill px-1.5 py-0.5 text-[8px] font-bold text-white shadow transition-[opacity,transform] duration-300 sm:text-[9px]",
                        fired[n.id] ? "scale-100 opacity-100" : "scale-50 opacity-0",
                      )}
                    >
                      ✓ 1
                    </span>
                  </div>
                );
              })}

              {/* Agent sub-nodes */}
              {(
                [
                  ["Model", "agent", 27],
                  ["Memory", "mem", 35],
                  ["Tool", "cal", 43],
                ] as const
              ).map(([label, icon, x], i) => (
                <div key={label} style={{ left: `${x - 5}%`, top: "72%" }} className="absolute flex w-[10%] flex-col items-center gap-1">
                  <span
                    style={{ transitionDelay: step === 5 ? `${i * 200}ms` : "0ms" }}
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full ring-1 transition-[background-color,box-shadow] duration-300 sm:size-8",
                      step === 5 ? "bg-brand-500 text-white shadow-[0_0_16px_rgb(31_85_255/0.8)] ring-white/50" : "bg-[#131f42] text-white/80 ring-white/20",
                    )}
                  >
                    <Icon name={icon} className="size-3 sm:size-4" />
                  </span>
                  <span className="hidden text-center text-[8px] leading-tight text-white/60 sm:block">{label}</span>
                </div>
              ))}

              {/* What the agent extracted, shown while it thinks */}
              <div
                className={cn(
                  "absolute top-[17%] left-[22%] w-[30%] rounded-lg bg-[#0b1530]/95 px-2 py-1.5 text-[9px] text-white/85 ring-1 ring-white/15 transition-[opacity,transform] duration-300 sm:text-[10px]",
                  step === 5 ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                )}
              >
                Booking · Fri · 3 bed · Coral Gables
              </div>
            </div>
          </div>
        </div>

        {/* Execution footer */}
        <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2 text-[10px] text-white/60 sm:text-[11px]">
          {running ? (
            <span className="flex items-center gap-1.5 text-primary-on-dark">
              <span className="size-3 animate-spin rounded-full border-2 border-white/30 [border-top-color:white]" />
              Running · step {Math.min(5, doneCount + 1)} of 5
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-success-fill">
              <span className="size-1.5 rounded-full bg-success-fill" />
              {step < 3 ? "Waiting for a trigger" : "Last run succeeded"}
            </span>
          )}
          <span>{step >= DONE - 1 ? "09:04 · 1.8 s" : "09:03"}</span>
          <span className="ml-auto hidden sm:inline">5 nodes · 0 errors</span>
        </div>
      </div>

      {/* ── Floating: the message that starts it ───────────────────── */}
      <div className="absolute top-0 left-0 hidden w-64 rounded-2xl bg-white p-3.5 shadow-e5 sm:block">
        <p className="flex items-center gap-2 text-[11px] font-semibold text-fg">
          <span className="inline-flex size-6 items-center justify-center rounded-lg bg-primary text-white">
            <SeraMark className="size-3.5" />
          </span>
          New chat · fernandfold.com
          <span className="ml-auto text-[10px] font-normal text-fg-muted">09:03</span>
        </p>
        <div className="mt-2.5 min-h-[52px]">
          {typing && (
            <span className="inline-flex gap-1 rounded-xl rounded-tl-sm bg-canvas-secondary px-3 py-3">
              {[0, 150, 300].map((d) => (
                <span key={d} style={{ animationDelay: `${d}ms` }} className="size-1.5 animate-bounce rounded-full bg-fg-muted" />
              ))}
            </span>
          )}
          {messageShown && (
            <p className="rounded-xl rounded-tl-sm bg-canvas-secondary px-3 py-2 text-[12px] leading-snug text-fg motion-safe:animate-[ddIn_300ms_ease-out]">
              {MESSAGE}
            </p>
          )}
        </div>
        <p className="mt-1.5 flex items-center justify-between text-[10px] text-fg-muted">
          <span className={cn("transition-opacity duration-300", step >= 3 ? "opacity-100" : "opacity-0")}>
            <span className="text-success">●</span> Sent to workflow
          </span>
          Maria L.
        </p>
      </div>

      {/* ── Floating: the booking it creates ───────────────────────── */}
      <div
        className={cn(
          "absolute right-0 bottom-0 hidden w-72 overflow-hidden rounded-2xl bg-white shadow-e5 transition-[opacity,transform] duration-500 ease-out sm:flex",
          bookingIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <div className="relative w-24 shrink-0">
          <div className="absolute inset-0">
            <MockPhoto src="house" className="h-full" sizes="256px" position="center 60%" eager />
          </div>
        </div>
        <div className="min-w-0 p-3">
          <p className="text-[10px] font-semibold text-primary">Booked automatically</p>
          <p className="text-small font-semibold text-fg">Deep clean · Maria L.</p>
          <p className="mt-0.5 text-[11px] text-fg-secondary">Fri, Oct 9 · 9:00 AM – 12:00 PM</p>
          <div className="mt-2 flex items-center gap-2 text-[10px]">
            {["SMS sent", "Added to CRM"].map((t, i) => (
              <span
                key={t}
                style={{ transitionDelay: bookingIn ? `${300 + i * 250}ms` : "0ms" }}
                className={cn("flex items-center gap-1 text-success transition-opacity duration-300", bookingIn ? "opacity-100" : "opacity-0")}
              >
                <span className="size-1.5 rounded-full bg-success-fill" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating: this week ────────────────────────────────────── */}
      <div className="absolute top-6 right-0 hidden items-center gap-3 rounded-2xl bg-[#0b1530]/95 px-4 py-3 shadow-e5 ring-1 ring-white/15 backdrop-blur md:flex">
        <svg viewBox="0 0 60 24" className="h-6 w-14" aria-hidden="true">
          <path d="M0 18 L10 14 L20 16 L30 9 L40 11 L50 5 L60 3" fill="none" stroke="rgb(34 197 94)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-[11px] leading-tight text-white/70">
          <span key={runs} className="tabular block text-body font-semibold text-white motion-safe:animate-[ddIn_300ms_ease-out]">
            {runs} runs
          </span>
          this week · 0 failed
        </span>
      </div>
    </div>
  );
}
