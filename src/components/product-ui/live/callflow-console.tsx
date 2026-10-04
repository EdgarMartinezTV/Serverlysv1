"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { DemoBadge } from "./shell";

/**
 * CallFlow — the voice receptionist, as a playable call.
 *
 * The product's whole claim is what happens between the phone ringing and a
 * booking existing. A screenshot cannot show that, because the thing being sold
 * is the sequence. So this is a transport: press play and the call advances
 * turn by turn, the status changes as it goes, and the appointment panel fills
 * in from the transcript rather than being drawn there from the start.
 *
 * It never autoplays. Motion that starts on its own is hostile in a page a
 * person is reading, and under `prefers-reduced-motion` an auto-running
 * timeline is exactly the thing being asked not to happen.
 */

type Turn = {
  from: "caller" | "agent";
  text: string;
  /** Milliseconds this turn holds before the next one arrives. */
  hold: number;
};

const CALL: readonly Turn[] = [
  {
    from: "agent",
    text: "Good afternoon, Cedar Clinic — this is the front desk.",
    hold: 1900,
  },
  {
    from: "caller",
    text: "Hi, I'd like to book a check-up for next week.",
    hold: 1800,
  },
  {
    from: "agent",
    text: "Of course. Are mornings or afternoons easier for you?",
    hold: 1700,
  },
  { from: "caller", text: "Mornings. Tuesday if you have it.", hold: 1600 },
  {
    from: "agent",
    text: "Tuesday the 16th, 9:40am is open. Can I take your name?",
    hold: 2000,
  },
  { from: "caller", text: "Dana Whitfield. My number's on this phone.", hold: 1700 },
  {
    from: "agent",
    text: "Booked, Dana — 9:40am Tuesday. You'll get a text to confirm.",
    hold: 2000,
  },
];

/** What the agent has extracted at each point in the call. */
const EXTRACTION: ReadonlyArray<{ after: number; label: string; value: string }> = [
  { after: 2, label: "Intent", value: "New appointment" },
  { after: 4, label: "Slot", value: "Tue 16th · 9:40am" },
  { after: 6, label: "Caller", value: "Dana Whitfield" },
  { after: 7, label: "Outcome", value: "Booked · SMS sent" },
];

export function CallFlowConsole({ className }: { className?: string }) {
  /**
   * Two pieces of state, and completion is DERIVED from them rather than
   * stored. A third "done" phase would have to be written from inside the
   * advance effect, which is a synchronous setState in an effect body — a
   * cascading render, and a lint error. Deriving it means the call simply
   * stops scheduling when it runs off the end of the script, and there is no
   * way for the phase to disagree with the turn counter.
   */
  const [started, setStarted] = useState(false);
  const [turn, setTurn] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clock = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (clock.current) clearInterval(clock.current);
    timer.current = null;
    clock.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const running = started && turn < CALL.length;
  const complete = started && turn >= CALL.length;

  // Advance the transcript. Each turn schedules the next; the call ends by
  // falling off the end of the script rather than on a total duration, so
  // editing CALL cannot desynchronise the two.
  useEffect(() => {
    if (!running) return;
    timer.current = setTimeout(() => setTurn((t) => t + 1), CALL[turn].hold);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [running, turn]);

  useEffect(() => {
    if (!running) return;
    clock.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (clock.current) clearInterval(clock.current);
    };
  }, [running]);

  function start() {
    stop();
    setTurn(0);
    setSeconds(0);
    setStarted(true);
  }

  function reset() {
    stop();
    setTurn(0);
    setSeconds(0);
    setStarted(false);
  }

  const visible = CALL.slice(0, turn);
  const captured = EXTRACTION.filter((e) => turn >= e.after);
  const status = !started ? "Ready" : running ? "In call" : "Completed";

  return (
    <section
      aria-label="CallFlow voice receptionist demonstration"
      className={cn(
        "overflow-hidden rounded-xl bg-surface-dark-elevated shadow-e5 ring-1 ring-inset ring-white/10",
        className,
      )}
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/10 bg-white/[0.03] px-3.5 py-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            running ? "bg-success-fill/20" : "bg-white/8",
          )}
        >
          <svg viewBox="0 0 20 20" className="h-3 w-3 text-white">
            <path
              d="M5.5 3.5h2.2l1.1 2.8L7 7.8a8.5 8.5 0 0 0 4.6 4.6l1.5-1.8 2.8 1.1v2.2a1.6 1.6 0 0 1-1.8 1.6A12.2 12.2 0 0 1 3.9 5.3 1.6 1.6 0 0 1 5.5 3.5Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="block truncate text-small font-semibold text-white">
            Cedar Clinic · front desk
          </span>
          <span className="tabular text-ui text-fg-on-dark-muted">
            +1 (305) 555-0148 · {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </span>
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-ui font-medium",
              running
                ? "bg-success-fill/15 text-white"
                : "bg-white/8 text-fg-on-dark-secondary",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                running ? "bg-success-fill motion-safe:animate-pulse" : "bg-ink-400",
              )}
            />
            {status}
          </span>
          <DemoBadge tone="dark" />
        </span>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        {/* ── Transcript ────────────────────────────────────────────────── */}
        <div className="border-b border-white/8 p-3.5 lg:border-b-0 lg:border-r">
          <div
            role="log"
            aria-live="polite"
            aria-label="Call transcript"
            className="flex min-h-[13rem] flex-col gap-2"
          >
            {visible.length === 0 && (
              <p className="m-auto max-w-[16rem] text-center text-micro text-fg-on-dark-muted">
                Play the call to watch the agent take a booking, turn by turn.
              </p>
            )}
            {visible.map((t, i) => (
              <p
                key={i}
                className={cn(
                  "max-w-[88%] rounded-xl px-3 py-2 text-micro leading-relaxed",
                  t.from === "agent"
                    ? "self-start rounded-bl-sm bg-primary/20 text-white ring-1 ring-inset ring-primary/25"
                    : "self-end rounded-br-sm bg-white/8 text-fg-on-dark-secondary",
                )}
              >
                <span className="mb-0.5 block text-ui text-fg-on-dark-muted font-semibold">
                  {t.from === "agent" ? "CallFlow" : "Caller"}
                </span>
                {t.text}
              </p>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={running ? reset : start}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3.5 text-micro font-medium text-fg transition-colors duration-fast hover:bg-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {running ? (
                <>
                  <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5">
                    <rect x="2" y="2" width="3" height="8" fill="currentColor" />
                    <rect x="7" y="2" width="3" height="8" fill="currentColor" />
                  </svg>
                  Stop call
                </>
              ) : (
                <>
                  <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5">
                    <path d="M3 2l7 4-7 4z" fill="currentColor" />
                  </svg>
                  {complete ? "Replay call" : "Play the call"}
                </>
              )}
            </button>
            <span className="tabular text-ui text-fg-on-dark-muted">
              Turn {Math.min(turn, CALL.length)} / {CALL.length}
            </span>
          </div>
        </div>

        {/* ── What the agent captured ───────────────────────────────────── */}
        <div className="p-3.5">
          <p className="text-ui text-fg-on-dark-muted font-semibold">
            Captured from the call
          </p>
          <dl className="mt-2.5 flex flex-col gap-1.5">
            {EXTRACTION.map((row) => {
              const has = captured.includes(row);
              return (
                <div
                  key={row.label}
                  className={cn(
                    "rounded-lg px-2.5 py-2 transition-colors duration-slow ease-entrance",
                    has
                      ? "bg-white/[0.06] ring-1 ring-inset ring-white/10"
                      : "bg-white/[0.02]",
                  )}
                >
                  <dt className="text-ui text-fg-on-dark-muted font-semibold">
                    {row.label}
                  </dt>
                  <dd
                    className={cn(
                      "mt-0.5 text-micro font-medium",
                      has ? "text-white" : "text-ink-700",
                    )}
                  >
                    {has ? row.value : "—"}
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-3 rounded-lg bg-white/[0.04] p-2.5 ring-1 ring-inset ring-white/8">
            <p className="text-ui text-fg-on-dark-muted font-semibold">
              This month
            </p>
            <dl className="mt-1.5 grid grid-cols-2 gap-2">
              <div>
                <dt className="text-ui text-fg-on-dark-muted">Answered</dt>
                <dd className="tabular text-body font-semibold text-white">412</dd>
              </div>
              <div>
                <dt className="text-ui text-fg-on-dark-muted">Booked</dt>
                <dd className="tabular text-body font-semibold text-white">189</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
