"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { SeraMark } from "@/components/sera/sera-mark";
import { useReducedAfterMount } from "./use-reduced";

/**
 * The two photo-led story sections near the end of /business-email, as live
 * product UI instead of flat screenshots:
 *  · DomainStage — a domain search types the name, results land, the cursor
 *    adds it, and the mailbox on it is created.
 *  · SeraStage — Sera's widget answers "which plan fits my team?" with the
 *    real Business Plus figures from the WHMCS catalogue.
 * Both run on one tick clock while on screen; reduced motion shows the final
 * frame. The business (brightleaf.co, Jordan) is the page's demo persona.
 * motion only; brand palette only.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const TICK = 120;

/** A looping tick counter that only runs on screen. */
function useTicks(length: number, finalTick: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useReducedAfterMount();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setInterval(() => setTick((n) => (n + 1) % length), TICK);
    return () => window.clearInterval(t);
  }, [inView, reduced, length]);
  // Below 440px the stages switch to their phone layout (see --u), so the
  // cursor needs that layout's targets.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 440));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, t: reduced ? finalTick : tick, reduced, narrow };
}

function Cursor({ x, y, press }: { x: string; y: string; press?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute z-30 w-[calc(var(--u)*6)] drop-shadow-[0_calc(var(--u)*0.8)_calc(var(--u)*1.2)_rgb(0_0_80/0.35)]"
      initial={false}
      animate={{ left: x, top: y, scale: press ? 0.82 : 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 15 }}
    >
      <path
        d="M4 2.5 20 13l-7 1.3 4 7.6-2.9 1.5-3.8-7.6L4 21Z"
        fill="#0b0b3b"
        stroke="#fff"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function Tick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

const glass =
  "absolute rounded-[calc(var(--u)*2.6)] bg-white text-[#0f172a] shadow-[0_0_0_calc(var(--u)*0.2)_rgb(0_0_255/0.06),0_calc(var(--u)*3)_calc(var(--u)*7)_-2cqw_rgb(4_11_60/0.35)]";

/* ── Domain search ─────────────────────────────────────────────────── */

const NAME = "brightleaf";
const RESULTS = [
  { tld: ".co", free: true },
  { tld: ".com", free: false },
  { tld: ".net", free: true },
];

export function DomainStage() {
  const { ref, t, narrow } = useTicks(84, 66);
  const typed = NAME.slice(0, Math.max(0, Math.min(NAME.length, t - 5)));
  const typing = t >= 5 && t < 5 + NAME.length;
  const results = t >= 18;
  const added = t >= 32;
  const toastDomain = t >= 36;
  const toastMailbox = t >= 46;
  const cursor =
    t < 22 || t >= 36
      ? { x: "86%", y: "96%" }
      : narrow
        ? { x: "85%", y: "67.7%" }
        : { x: "58.5%", y: "70.5%" };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="@container relative mx-auto aspect-[1/1.06] w-full max-w-[540px] select-none max-sm:aspect-[1/1.3]"
      style={{ fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="absolute inset-0 [--u:1cqw] @max-[440px]:[--u:1.4cqw]">
      <div className="absolute -inset-[6%] -z-10 rounded-[calc(var(--u)*8)] bg-[radial-gradient(55%_55%_at_55%_45%,rgb(31_85_255/0.22),transparent_70%)]" />
      <div className="absolute left-[12%] right-[4%] top-0 h-[80%] overflow-hidden rounded-[calc(var(--u)*5)] shadow-[0_calc(var(--u)*4)_calc(var(--u)*8)_-4cqw_rgb(4_11_60/0.35)]">
        <Image
          src="/email/owner-phone.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 460px, 90vw"
          className="object-cover object-[50%_20%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(4_11_34/0.35),transparent_40%)]" />
      </div>

      {/* Registered chip, top-left over the photo edge */}
      <AnimatePresence>
        {toastDomain && (
          <motion.div
            key="chip"
            className={cn(glass, "left-0 top-[9%] flex items-center gap-[calc(var(--u)*1.8)] rounded-full py-[calc(var(--u)*1.6)] pl-[calc(var(--u)*1.6)] pr-[calc(var(--u)*3)] text-[calc(var(--u)*2.9)] font-semibold")}
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="flex size-[calc(var(--u)*5.2)] items-center justify-center rounded-full bg-primary text-white">
              <svg viewBox="0 0 24 24" className="size-[calc(var(--u)*3)]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.8 2.5 15.2 0 18M12 3c-2.5 2.8-2.5 15.2 0 18" />
              </svg>
            </span>
            brightleaf.co is yours
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search card */}
      <div className={cn(glass, "bottom-[3%] left-0 w-[70%] p-[calc(var(--u)*3.6)] @max-[440px]:w-full")}>
        <p className="text-[calc(var(--u)*4)] font-semibold tracking-[-0.01em]">Find your domain</p>
        <p className="mt-[calc(var(--u)*0.6)] text-[calc(var(--u)*2.5)] text-[#64748b]">The address your email will live at</p>
        <div
          className={cn(
            "mt-[calc(var(--u)*2.6)] flex items-center gap-[calc(var(--u)*1.8)] rounded-[calc(var(--u)*1.6)] px-[calc(var(--u)*2.4)] py-[calc(var(--u)*2)] text-[calc(var(--u)*3)] ring-[calc(var(--u)*0.25)] transition-shadow",
            typing ? "ring-primary shadow-[0_0_0_calc(var(--u)*0.9)_rgb(0_0_255/0.1)]" : "ring-[#e2e8f0]",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-[calc(var(--u)*3.4)] shrink-0 text-[#94a3b8]" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="flex-1 truncate">
            {typed ? <span className="font-medium">{typed}</span> : <span className="text-[#94a3b8]">yourbusiness</span>}
            {typing && <span className="ml-[calc(var(--u)*0.2)] inline-block h-[calc(var(--u)*3.2)] w-[calc(var(--u)*0.3)] translate-y-[calc(var(--u)*0.5)] animate-pulse bg-primary" />}
          </span>
          <span className="rounded-[calc(var(--u)*1)] bg-primary px-[calc(var(--u)*2)] py-[calc(var(--u)*1)] text-[calc(var(--u)*2.5)] font-semibold text-white">Search</span>
        </div>

        <ul className="mt-[calc(var(--u)*2)] flex min-h-[calc(var(--u)*25)] flex-col gap-[calc(var(--u)*1.2)]">
          {results &&
            RESULTS.map((r, i) => {
              const isAdded = r.tld === ".co" && added;
              return (
                <motion.li
                  key={r.tld}
                  className={cn(
                    "flex items-center justify-between rounded-[calc(var(--u)*1.4)] px-[calc(var(--u)*2.2)] py-[calc(var(--u)*1.5)] text-[calc(var(--u)*2.9)]",
                    r.tld === ".co" ? "bg-[linear-gradient(90deg,var(--color-brand-50),#fff)] ring-[calc(var(--u)*0.2)] ring-brand-100" : "bg-[#f8fafc]",
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.12, ease: EASE }}
                >
                  <span className={cn("font-semibold", !r.free && "text-[#94a3b8] line-through decoration-[calc(var(--u)*0.2)]")}>
                    {NAME}
                    <span className={r.free ? "text-primary" : undefined}>{r.tld}</span>
                  </span>
                  {r.free ? (
                    <span className="flex items-center gap-[calc(var(--u)*1.6)]">
                      {r.tld === ".co" && (
                        <span className="rounded-full bg-[#dcfce7] px-[calc(var(--u)*1.6)] py-[calc(var(--u)*0.4)] text-[calc(var(--u)*2.2)] font-semibold text-[#15803d]">
                          Available
                        </span>
                      )}
                      <span
                        data-target={r.tld === ".co" ? "add" : undefined}
                        className={cn(
                          "flex items-center gap-[calc(var(--u)*0.8)] rounded-[calc(var(--u)*1)] px-[calc(var(--u)*2)] py-[calc(var(--u)*0.9)] text-[calc(var(--u)*2.4)] font-semibold transition-colors duration-300",
                          isAdded ? "bg-[#16a34a] text-white" : r.tld === ".co" ? "bg-primary text-white" : "text-primary ring-[calc(var(--u)*0.2)] ring-inset ring-brand-200",
                        )}
                      >
                        {isAdded && <Tick className="size-[calc(var(--u)*2.6)]" />}
                        {isAdded ? "Added" : "Add"}
                      </span>
                    </span>
                  ) : (
                    <span className="text-[calc(var(--u)*2.4)] text-[#94a3b8]">Taken</span>
                  )}
                </motion.li>
              );
            })}
        </ul>
      </div>

      {/* Mailbox toast */}
      <AnimatePresence>
        {toastMailbox && (
          <motion.div
            key="toast"
            className={cn(glass, "bottom-[36%] right-0 flex w-[44%] @max-[440px]:bottom-auto @max-[440px]:top-[15%] @max-[440px]:w-[66%] items-center gap-[calc(var(--u)*2.2)] p-[calc(var(--u)*2.6)]")}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <span className="flex size-[calc(var(--u)*7)] shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-[0_0_0_calc(var(--u)*1)_rgb(22_163_74/0.15)]">
              <Tick className="size-[calc(var(--u)*3.6)]" />
            </span>
            <span className="min-w-0">
              <span className="block text-[calc(var(--u)*2.9)] font-semibold">Mailbox created</span>
              <span className="block truncate text-[calc(var(--u)*2.5)] text-[#64748b]">jordan@brightleaf.co</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <Cursor x={cursor.x} y={cursor.y} press={t >= 29 && t < 32} />
      </div>
    </div>
  );
}

/* ── Sera ──────────────────────────────────────────────────────────── */

const CHIPS = ["I want to move my email", "Which email plan fits my team?", "Help me set up Outlook"];
const QUESTION = CHIPS[1];

function Dots() {
  return (
    <span className="flex items-center gap-[calc(var(--u)*0.8)] py-[calc(var(--u)*0.6)]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-[calc(var(--u)*1.4)] rounded-full bg-primary/60"
          animate={{ y: [0, "-0.8cqw", 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

export function SeraStage() {
  const { ref, t, narrow } = useTicks(90, 70);
  const chips = t >= 6 && t < 22;
  const asked = t >= 22;
  const thinking = t >= 26 && t < 38;
  const answered = t >= 38;
  const card = t >= 44;
  const cursor =
    t < 12
      ? { x: "92%", y: "98%" }
      : t < 26
        ? narrow
          ? { x: "69.7%", y: "58%" }
          : { x: "75%", y: "64.5%" }
        : { x: "84%", y: "93%" };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="@container relative mx-auto aspect-[1/0.92] w-full max-w-[560px] select-none max-sm:aspect-[1/1.3]"
      style={{ fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="absolute inset-0 [--u:1cqw] @max-[440px]:[--u:1.4cqw]">
      <div className="absolute -inset-[6%] -z-10 rounded-[calc(var(--u)*8)] bg-[radial-gradient(55%_55%_at_45%_50%,rgb(31_85_255/0.2),transparent_70%)]" />
      <div className="absolute left-0 top-[6%] h-[72%] w-[72%] overflow-hidden @max-[440px]:h-[60%] rounded-[calc(var(--u)*5)] shadow-[0_calc(var(--u)*4)_calc(var(--u)*8)_-4cqw_rgb(4_11_60/0.35)]">
        <Image
          src="/email/laptop-email.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, 72vw"
          className="object-cover object-[30%_50%]"
        />
      </div>

      {/* Widget */}
      <div className={cn(glass, "right-0 top-0 flex h-[90%] w-[54%] @max-[440px]:h-[82%] @max-[440px]:w-[80%] flex-col overflow-hidden rounded-[calc(var(--u)*3.4)]")}>
        <div className="flex items-center gap-[calc(var(--u)*2)] bg-[linear-gradient(120deg,#0f1f4d,#071230)] px-[calc(var(--u)*3)] py-[calc(var(--u)*2.6)] text-white">
          <span className="relative flex size-[calc(var(--u)*6.4)] items-center justify-center rounded-full bg-primary">
            <SeraMark className="size-[calc(var(--u)*4.4)]" />
            <span className="absolute -bottom-[calc(var(--u)*0.2)] -right-[calc(var(--u)*0.2)] size-[calc(var(--u)*1.9)] rounded-full bg-[#22c55e] ring-[calc(var(--u)*0.4)] ring-[#0b1838]" />
          </span>
          <span className="flex-1">
            <span className="block text-[calc(var(--u)*3.1)] font-semibold leading-tight">Sera</span>
            <span className="block text-[calc(var(--u)*2.2)] text-white/60">Serverlys assistant</span>
          </span>
          <span className="text-[calc(var(--u)*3.4)] text-white/50">×</span>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-[calc(var(--u)*1.8)] overflow-hidden bg-[#f8fafc] px-[calc(var(--u)*2.6)] pb-[calc(var(--u)*2)] [mask-image:linear-gradient(to_bottom,transparent,black_14%)]">
          <div className="flex items-end gap-[calc(var(--u)*1.4)]">
            <span className="flex size-[calc(var(--u)*4.6)] shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <SeraMark className="size-[calc(var(--u)*3.2)]" />
            </span>
            <p className="rounded-[calc(var(--u)*2)] rounded-bl-[calc(var(--u)*0.6)] bg-white px-[calc(var(--u)*2.4)] py-[calc(var(--u)*1.8)] text-[calc(var(--u)*2.6)] leading-snug shadow-[0_calc(var(--u)*0.3)_calc(var(--u)*1)_rgb(15_23_42/0.06)]">
              Hi, I&apos;m Sera. How can I help with your email today?
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {chips && (
              <motion.div
                key="chips"
                className="flex flex-col items-end gap-[calc(var(--u)*1.2)]"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                {CHIPS.map((c, i) => (
                  <motion.span
                    key={c}
                    data-target={c === QUESTION ? "chip" : undefined}
                    className={cn(
                      "rounded-full px-[calc(var(--u)*2.4)] py-[calc(var(--u)*1.2)] text-[calc(var(--u)*2.4)] font-medium ring-[calc(var(--u)*0.25)] ring-inset transition-colors",
                      c === QUESTION && t >= 19 ? "bg-primary text-white ring-primary" : "bg-white text-primary ring-brand-200",
                    )}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: EASE }}
                  >
                    {c}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {asked && (
            <motion.p
              layout
              className="ml-auto max-w-[80%] rounded-[calc(var(--u)*2)] rounded-br-[calc(var(--u)*0.6)] bg-primary px-[calc(var(--u)*2.4)] py-[calc(var(--u)*1.8)] text-[calc(var(--u)*2.6)] leading-snug text-white"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {QUESTION} We&apos;re 5 people.
            </motion.p>
          )}

          {thinking && (
            <motion.div layout className="flex items-end gap-[calc(var(--u)*1.4)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="flex size-[calc(var(--u)*4.6)] shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <SeraMark className="size-[calc(var(--u)*3.2)]" />
              </span>
              <span className="rounded-[calc(var(--u)*2)] bg-white px-[calc(var(--u)*2.4)] py-[calc(var(--u)*1.4)] shadow-[0_calc(var(--u)*0.3)_calc(var(--u)*1)_rgb(15_23_42/0.06)]">
                <Dots />
              </span>
            </motion.div>
          )}

          {answered && (
            <motion.div
              layout
              className="flex items-end gap-[calc(var(--u)*1.4)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <span className="flex size-[calc(var(--u)*4.6)] shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <SeraMark className="size-[calc(var(--u)*3.2)]" />
              </span>
              <div className="flex-1 rounded-[calc(var(--u)*2)] rounded-bl-[calc(var(--u)*0.6)] bg-white p-[calc(var(--u)*2.2)] text-[calc(var(--u)*2.6)] leading-snug shadow-[0_calc(var(--u)*0.3)_calc(var(--u)*1)_rgb(15_23_42/0.06)]">
                Business Plus fits a team of 5: one mailbox each and 45 GB of storage.
                <AnimatePresence>
                  {card && (
                    <motion.div
                      className="mt-[calc(var(--u)*1.8)] rounded-[calc(var(--u)*1.6)] bg-[linear-gradient(150deg,#0f1f4d,#071230)] p-[calc(var(--u)*2)] text-white"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <span className="flex items-baseline justify-between">
                        <span className="text-[calc(var(--u)*2.6)] font-semibold">Business Plus</span>
                        <span className="text-[calc(var(--u)*3.4)] font-semibold">
                          $7.95<span className="text-[calc(var(--u)*2.2)] font-normal text-white/60">/mo</span>
                        </span>
                      </span>
                      <span className="mt-[calc(var(--u)*1)] block text-[calc(var(--u)*2.2)] text-[#7dd3fc]">5 accounts · 45 GB</span>
                      <span className="mt-[calc(var(--u)*1.6)] block rounded-[calc(var(--u)*1)] bg-primary py-[calc(var(--u)*1.2)] text-center text-[calc(var(--u)*2.4)] font-semibold">
                        Choose plan
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-[calc(var(--u)*1.6)] border-t border-[#e2e8f0] bg-white px-[calc(var(--u)*2.6)] py-[calc(var(--u)*2)]">
          <span className="flex-1 text-[calc(var(--u)*2.4)] text-[#94a3b8]">Message Sera…</span>
          <span className="flex size-[calc(var(--u)*5)] items-center justify-center rounded-full bg-primary text-white">
            <svg viewBox="0 0 16 16" className="size-[calc(var(--u)*2.6)]" fill="currentColor" aria-hidden="true">
              <path d="M2 2.5 14 8 2 13.5l1.6-5.5L2 2.5Zm1.6 5.5H9" />
            </svg>
          </span>
        </div>
      </div>

      {/* Human hand-off chip */}
      <motion.div
        className={cn(glass, "bottom-[3%] left-[2%] flex w-[42%] items-center @max-[440px]:w-[70%] gap-[calc(var(--u)*2)] p-[calc(var(--u)*2.2)] pr-[calc(var(--u)*3.2)]")}
        initial={false}
        animate={{ opacity: answered ? 1 : 0.0, y: answered ? 0 : 14 }}
        transition={{ duration: 0.6, delay: answered ? 0.6 : 0, ease: EASE }}
      >
        <span className="flex size-[calc(var(--u)*6)] items-center justify-center rounded-full bg-brand-50 text-primary">
          <svg viewBox="0 0 24 24" className="size-[calc(var(--u)*3.6)]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
          </svg>
        </span>
        <span>
          <span className="block text-[calc(var(--u)*2.7)] font-semibold">A person is one tap away</span>
          <span className="block text-[calc(var(--u)*2.3)] text-[#64748b]">Sera hands off to the team</span>
        </span>
      </motion.div>

      <Cursor x={cursor.x} y={cursor.y} press={t >= 18 && t < 21} />
      </div>
    </div>
  );
}
