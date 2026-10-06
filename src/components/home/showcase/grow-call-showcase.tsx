"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useLoop } from "./use-loop";

/**
 * Grow, second row: CallFlow picking up a call the owner could not.
 *
 * Three surfaces stacked like a set of real screens: the business phone in
 * front, on a live call CallFlow is answering, with the transcript appearing
 * as it is spoken; behind it, the bookings calendar and the call summary the
 * owner receives. As the call ends, the slot fills and the summary lands —
 * "takes the details, books the slot and leaves you a transcript".
 *
 * Decorative (aria-hidden) with a figcaption. Stops off-screen; under
 * prefers-reduced-motion it shows the finished call.
 */

type Turn = { from: "caller" | "agent"; text: string };

const CALL: readonly Turn[] = [
  { from: "agent", text: "Crumb & Co., good evening. How can I help?" },
  { from: "caller", text: "Hi, can I book a cake tasting this weekend?" },
  { from: "agent", text: "Saturday at 10:30 is open. Can I take your name?" },
  { from: "caller", text: "Maria Gómez." },
  { from: "agent", text: "Booked, Maria. You'll get a text to confirm." },
];

/*
 * Steps: 0 ringing → 1 answered → 2..6 one turn each → 7 booked (slot fills)
 * → 8 summary lands → 9 hold → 10 reset.
 */
const STEPS = [1300, 700, 1500, 1500, 1600, 1100, 1500, 900, 900, 2600, 600] as const;

function frame(step: number) {
  return {
    ringing: step === 0,
    turns: Math.max(0, Math.min(CALL.length, step - 1)),
    booked: step >= 7 && step <= 9,
    summary: step >= 8 && step <= 9,
    ended: step >= 7,
    seconds: [0, 0, 6, 13, 20, 24, 29, 31, 31, 31, 31][step],
  };
}

export function GrowCallShowcase() {
  const root = useRef<HTMLElement>(null);
  const { step, reduced } = useLoop(STEPS, root);
  const f = reduced
    ? { ringing: false, turns: CALL.length, booked: true, summary: true, ended: true, seconds: 31 }
    : frame(step);
  const clock = `0:${String(f.seconds).padStart(2, "0")}`;

  return (
    <figure ref={root} className="@container relative w-full">
      <figcaption className="sr-only">
        A call to a bakery answered by CallFlow after hours. The caller books a cake tasting for
        Saturday at 10:30; the slot fills in the bookings calendar and the owner gets a call
        summary with the transcript.
      </figcaption>

      <div aria-hidden="true" className="relative mx-auto aspect-[10/8.4] w-full max-w-[640px]">
        {/* ── Behind, left: bookings calendar ─────────────────────────────── */}
        {/* Side cards pad their phone-facing edge: the phone covers it. */}
        <div className="absolute left-0 top-[16%] w-[40%] rounded-[2.4cqw] bg-white py-[2.6cqw] pl-[2.6cqw] pr-[9cqw] shadow-[0_24px_50px_-26px_rgb(15_23_42/0.4),0_0_0_1px_rgb(15_23_42/0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-[1.9cqw] font-semibold text-[#1f2430]">Bookings</span>
            <span className="text-[1.4cqw] text-[#6b7280]">Sat, Oct 10</span>
          </div>
          <ul className="mt-[2cqw] flex flex-col gap-[1cqw]">
            {[
              { time: "9:00", label: "Bread class", tone: "bg-[#f1f3f7] text-[#4b5260]" },
              { time: "10:30", label: "", tone: "" },
              { time: "12:00", label: "Wedding cake pickup", tone: "bg-[#f1f3f7] text-[#4b5260]" },
              { time: "14:00", label: "", tone: "" },
            ].map((slot) => {
              const fresh = slot.time === "10:30";
              return (
                <li key={slot.time} className="flex items-center gap-[1.4cqw]">
                  <span className="w-[5cqw] shrink-0 text-[1.35cqw] tabular-nums text-[#6b7280]">{slot.time}</span>
                  <span
                    className={cn(
                      "flex h-[5cqw] flex-1 items-center rounded-[1cqw] px-[1.4cqw] text-[1.35cqw] font-medium transition-[background-color,color,box-shadow] duration-500",
                      fresh
                        ? f.booked
                          ? "bg-primary-soft text-primary shadow-[inset_3px_0_0_var(--color-primary)]"
                          : "border border-dashed border-[#d7dbe3] text-[#9aa1ad]"
                        : slot.label
                          ? slot.tone
                          : "border border-dashed border-[#e3e6ec] text-[#c0c5cf]",
                    )}
                  >
                    {fresh ? (f.booked ? "Cake tasting · Maria G." : "Open") : slot.label || "Open"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Behind, right: call summary ─────────────────────────────────── */}
        <div
          className={cn(
            "absolute right-0 top-[9%] w-[40%] rounded-[2.4cqw] bg-white py-[2.6cqw] pl-[9cqw] pr-[2.6cqw] shadow-[0_24px_50px_-26px_rgb(15_23_42/0.4),0_0_0_1px_rgb(15_23_42/0.06)]",
            "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            f.summary ? "translate-y-0 opacity-100" : "translate-y-[6%] opacity-60",
          )}
        >
          <div className="flex items-center gap-[1.2cqw]">
            <span className="flex size-[4.4cqw] items-center justify-center rounded-[1.2cqw] bg-[#e8f7ee] text-[#15803d]">
              <svg viewBox="0 0 24 24" className="size-[2.4cqw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[1.7cqw] font-semibold leading-tight text-[#1f2430]">Call answered by CallFlow</span>
              <span className="block text-[1.3cqw] text-[#6b7280]">Today 7:42 PM · 0:31</span>
            </span>
          </div>
          <dl className="mt-[2cqw] grid gap-[1cqw] text-[1.35cqw]">
            {[
              ["Caller", f.summary ? "Maria Gómez" : "—"],
              ["Wants", f.summary ? "Cake tasting" : "—"],
              ["Outcome", f.summary ? "Booked Sat 10:30 · SMS sent" : "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-[1.4cqw] border-b border-[#f0f1f4] pb-[0.8cqw]">
                <dt className="text-[#6b7280]">{k}</dt>
                <dd className="truncate text-right font-medium text-[#1f2430]">{v}</dd>
              </div>
            ))}
          </dl>
          <span className="mt-[1.6cqw] inline-flex items-center gap-[0.6cqw] text-[1.35cqw] font-semibold text-primary">
            Read transcript
            <svg viewBox="0 0 16 16" className="size-[1.5cqw]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 11 11 5M6.5 5H11v4.5" />
            </svg>
          </span>
        </div>

        {/* ── Front: the phone ─────────────────────────────────────────────── */}
        <div className="absolute left-1/2 top-0 z-10 w-[34%] -translate-x-1/2">
          <div className="rounded-[6.4cqw] bg-[#0d0d0f] p-[1cqw] shadow-[0_0_0_1px_#2c2c30,0_40px_70px_-30px_rgb(15_23_42/0.6)]">
            <div className="relative flex aspect-[9/19] flex-col overflow-hidden rounded-[5.5cqw] bg-[linear-gradient(170deg,#1d2440_0%,#2a1f3d_55%,#151826_100%)] px-[2.4cqw] pb-[2.6cqw] pt-[2cqw] text-white">
              {/* Status bar + Dynamic Island */}
              <div className="flex items-center justify-between px-[1cqw] text-[1.25cqw] font-semibold">
                <span>7:42</span>
                <span className="h-[2.6cqw] w-[10cqw] rounded-full bg-black" />
                <span className="flex items-center gap-[0.5cqw]">
                  <span className="h-[1cqw] w-[1.8cqw] rounded-[0.3cqw] border border-white/80" />
                </span>
              </div>

              {/* Call header */}
              <div className="mt-[3cqw] text-center">
                <p className="text-[1.25cqw] text-white/60">Crumb &amp; Co. · Main line</p>
                <p className="mt-[0.8cqw] text-[2.6cqw] font-semibold tracking-[-0.01em]">
                  {f.summary || reduced ? "Maria Gómez" : "+1 (305) •••-0142"}
                </p>
                <p
                  className={cn(
                    "mt-[0.6cqw] flex items-center justify-center gap-[0.6cqw] text-[1.3cqw]",
                    f.ended ? "text-white/60" : "text-[#7dd3fc]",
                  )}
                >
                  {f.ringing ? (
                    <>
                      <span className="size-[0.9cqw] animate-ping rounded-full bg-[#4ade80]" />
                      Incoming call…
                    </>
                  ) : f.ended ? (
                    `Call ended · ${clock}`
                  ) : (
                    <>
                      <span className="size-[0.9cqw] animate-pulse rounded-full bg-[#7dd3fc]" />
                      CallFlow answering · {clock}
                    </>
                  )}
                </p>
              </div>

              {/* Live transcript */}
              <div className="mt-[2.4cqw] flex min-h-0 flex-1 flex-col justify-end gap-[0.9cqw] overflow-hidden">
                {CALL.slice(0, f.turns).map((t, i) => (
                  <span
                    key={i}
                    className={cn(
                      "max-w-[88%] animate-[chatIn_260ms_ease-out_both] rounded-[1.6cqw] px-[1.4cqw] py-[0.9cqw] text-[1.2cqw] leading-snug",
                      t.from === "agent"
                        ? "self-end rounded-br-[0.4cqw] bg-primary text-white"
                        : "self-start rounded-bl-[0.4cqw] bg-white/12 text-white",
                    )}
                  >
                    {t.text}
                  </span>
                ))}
              </div>

              {/* Controls */}
              <div className="mt-[2.4cqw] flex items-center justify-around">
                {["M8 5v14M16 5v14", "M4 9h16M4 15h16M9 4v16M15 4v16", "M5 10v4h3l5 4V6L8 10H5Z"].map((d) => (
                  <span key={d} className="flex size-[5.2cqw] items-center justify-center rounded-full bg-white/12">
                    <svg viewBox="0 0 24 24" className="size-[2.4cqw]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d} />
                    </svg>
                  </span>
                ))}
                <span
                  className={cn(
                    "flex size-[5.2cqw] items-center justify-center rounded-full transition-colors duration-300",
                    f.ringing ? "bg-[#22c55e]" : "bg-[#ef4444]",
                  )}
                >
                  <svg viewBox="0 0 24 24" className={cn("size-[2.6cqw] transition-transform duration-300", !f.ringing && "rotate-[135deg]")} fill="currentColor">
                    <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1Z" />
                  </svg>
                </span>
              </div>
              <span className="mx-auto mt-[2cqw] h-[0.6cqw] w-[12cqw] rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
