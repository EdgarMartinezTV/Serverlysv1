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
  return { ref, t: reduced ? finalTick : tick, reduced };
}

function Cursor({ x, y, press }: { x: string; y: string; press?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute z-30 w-[6cqw] drop-shadow-[0_0.8cqw_1.2cqw_rgb(0_0_80/0.35)]"
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
  "absolute rounded-[2.6cqw] bg-white text-[#0f172a] shadow-[0_0_0_0.2cqw_rgb(0_0_255/0.06),0_3cqw_7cqw_-2cqw_rgb(4_11_60/0.35)]";

/* ── Domain search ─────────────────────────────────────────────────── */

const NAME = "brightleaf";
const RESULTS = [
  { tld: ".co", free: true },
  { tld: ".com", free: false },
  { tld: ".net", free: true },
];

export function DomainStage() {
  const { ref, t } = useTicks(84, 66);
  const typed = NAME.slice(0, Math.max(0, Math.min(NAME.length, t - 5)));
  const typing = t >= 5 && t < 5 + NAME.length;
  const results = t >= 18;
  const added = t >= 32;
  const toastDomain = t >= 36;
  const toastMailbox = t >= 46;
  const cursor =
    t < 22 || t >= 36
      ? { x: "86%", y: "96%" }
      : { x: "58.5%", y: "70.5%" };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="@container relative mx-auto aspect-[1/1.06] w-full max-w-[540px] select-none"
      style={{ fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="absolute -inset-[6%] -z-10 rounded-[8cqw] bg-[radial-gradient(55%_55%_at_55%_45%,rgb(31_85_255/0.22),transparent_70%)]" />
      <div className="absolute left-[12%] right-[4%] top-0 h-[80%] overflow-hidden rounded-[5cqw] shadow-[0_4cqw_8cqw_-4cqw_rgb(4_11_60/0.35)]">
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
            className={cn(glass, "left-0 top-[9%] flex items-center gap-[1.8cqw] rounded-full py-[1.6cqw] pl-[1.6cqw] pr-[3cqw] text-[2.9cqw] font-semibold")}
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="flex size-[5.2cqw] items-center justify-center rounded-full bg-primary text-white">
              <svg viewBox="0 0 24 24" className="size-[3cqw]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.8 2.5 15.2 0 18M12 3c-2.5 2.8-2.5 15.2 0 18" />
              </svg>
            </span>
            brightleaf.co is yours
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search card */}
      <div className={cn(glass, "bottom-[3%] left-0 w-[70%] p-[3.6cqw]")}>
        <p className="text-[4cqw] font-semibold tracking-[-0.01em]">Find your domain</p>
        <p className="mt-[0.6cqw] text-[2.5cqw] text-[#64748b]">The address your email will live at</p>
        <div
          className={cn(
            "mt-[2.6cqw] flex items-center gap-[1.8cqw] rounded-[1.6cqw] px-[2.4cqw] py-[2cqw] text-[3cqw] ring-[0.25cqw] transition-shadow",
            typing ? "ring-primary shadow-[0_0_0_0.9cqw_rgb(0_0_255/0.1)]" : "ring-[#e2e8f0]",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-[3.4cqw] shrink-0 text-[#94a3b8]" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="flex-1 truncate">
            {typed ? <span className="font-medium">{typed}</span> : <span className="text-[#94a3b8]">yourbusiness</span>}
            {typing && <span className="ml-[0.2cqw] inline-block h-[3.2cqw] w-[0.3cqw] translate-y-[0.5cqw] animate-pulse bg-primary" />}
          </span>
          <span className="rounded-[1cqw] bg-primary px-[2cqw] py-[1cqw] text-[2.5cqw] font-semibold text-white">Search</span>
        </div>

        <ul className="mt-[2cqw] flex min-h-[25cqw] flex-col gap-[1.2cqw]">
          {results &&
            RESULTS.map((r, i) => {
              const isAdded = r.tld === ".co" && added;
              return (
                <motion.li
                  key={r.tld}
                  className={cn(
                    "flex items-center justify-between rounded-[1.4cqw] px-[2.2cqw] py-[1.5cqw] text-[2.9cqw]",
                    r.tld === ".co" ? "bg-[linear-gradient(90deg,var(--color-brand-50),#fff)] ring-[0.2cqw] ring-brand-100" : "bg-[#f8fafc]",
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.12, ease: EASE }}
                >
                  <span className={cn("font-semibold", !r.free && "text-[#94a3b8] line-through decoration-[0.2cqw]")}>
                    {NAME}
                    <span className={r.free ? "text-primary" : undefined}>{r.tld}</span>
                  </span>
                  {r.free ? (
                    <span className="flex items-center gap-[1.6cqw]">
                      {r.tld === ".co" && (
                        <span className="rounded-full bg-[#dcfce7] px-[1.6cqw] py-[0.4cqw] text-[2.2cqw] font-semibold text-[#15803d]">
                          Available
                        </span>
                      )}
                      <span
                        className={cn(
                          "flex items-center gap-[0.8cqw] rounded-[1cqw] px-[2cqw] py-[0.9cqw] text-[2.4cqw] font-semibold transition-colors duration-300",
                          isAdded ? "bg-[#16a34a] text-white" : r.tld === ".co" ? "bg-primary text-white" : "text-primary ring-[0.2cqw] ring-inset ring-brand-200",
                        )}
                      >
                        {isAdded && <Tick className="size-[2.6cqw]" />}
                        {isAdded ? "Added" : "Add"}
                      </span>
                    </span>
                  ) : (
                    <span className="text-[2.4cqw] text-[#94a3b8]">Taken</span>
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
            className={cn(glass, "bottom-[36%] right-0 flex w-[44%] items-center gap-[2.2cqw] p-[2.6cqw]")}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <span className="flex size-[7cqw] shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-[0_0_0_1cqw_rgb(22_163_74/0.15)]">
              <Tick className="size-[3.6cqw]" />
            </span>
            <span className="min-w-0">
              <span className="block text-[2.9cqw] font-semibold">Mailbox created</span>
              <span className="block truncate text-[2.5cqw] text-[#64748b]">jordan@brightleaf.co</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <Cursor x={cursor.x} y={cursor.y} press={t >= 29 && t < 32} />
    </div>
  );
}

/* ── Sera ──────────────────────────────────────────────────────────── */

const CHIPS = ["I want to move my email", "Which email plan fits my team?", "Help me set up Outlook"];
const QUESTION = CHIPS[1];

function Dots() {
  return (
    <span className="flex items-center gap-[0.8cqw] py-[0.6cqw]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-[1.4cqw] rounded-full bg-primary/60"
          animate={{ y: [0, "-0.8cqw", 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

export function SeraStage() {
  const { ref, t } = useTicks(90, 70);
  const chips = t >= 6 && t < 22;
  const asked = t >= 22;
  const thinking = t >= 26 && t < 38;
  const answered = t >= 38;
  const card = t >= 44;
  const cursor =
    t < 12 ? { x: "92%", y: "98%" } : t < 26 ? { x: "75%", y: "64.5%" } : { x: "84%", y: "93%" };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="@container relative mx-auto aspect-[1/0.92] w-full max-w-[560px] select-none"
      style={{ fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="absolute -inset-[6%] -z-10 rounded-[8cqw] bg-[radial-gradient(55%_55%_at_45%_50%,rgb(31_85_255/0.2),transparent_70%)]" />
      <div className="absolute left-0 top-[6%] h-[72%] w-[72%] overflow-hidden rounded-[5cqw] shadow-[0_4cqw_8cqw_-4cqw_rgb(4_11_60/0.35)]">
        <Image
          src="/email/laptop-email.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, 72vw"
          className="object-cover object-[30%_50%]"
        />
      </div>

      {/* Widget */}
      <div className={cn(glass, "right-0 top-0 flex h-[90%] w-[54%] flex-col overflow-hidden rounded-[3.4cqw]")}>
        <div className="flex items-center gap-[2cqw] bg-[linear-gradient(120deg,#0f1f4d,#071230)] px-[3cqw] py-[2.6cqw] text-white">
          <span className="relative flex size-[6.4cqw] items-center justify-center rounded-full bg-primary">
            <SeraMark className="size-[4.4cqw]" />
            <span className="absolute -bottom-[0.2cqw] -right-[0.2cqw] size-[1.9cqw] rounded-full bg-[#22c55e] ring-[0.4cqw] ring-[#0b1838]" />
          </span>
          <span className="flex-1">
            <span className="block text-[3.1cqw] font-semibold leading-tight">Sera</span>
            <span className="block text-[2.2cqw] text-white/60">Serverlys assistant</span>
          </span>
          <span className="text-[3.4cqw] text-white/50">×</span>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-[1.8cqw] overflow-hidden bg-[#f8fafc] px-[2.6cqw] pb-[2cqw] [mask-image:linear-gradient(to_bottom,transparent,black_14%)]">
          <div className="flex items-end gap-[1.4cqw]">
            <span className="flex size-[4.6cqw] shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <SeraMark className="size-[3.2cqw]" />
            </span>
            <p className="rounded-[2cqw] rounded-bl-[0.6cqw] bg-white px-[2.4cqw] py-[1.8cqw] text-[2.6cqw] leading-snug shadow-[0_0.3cqw_1cqw_rgb(15_23_42/0.06)]">
              Hi, I&apos;m Sera. How can I help with your email today?
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {chips && (
              <motion.div
                key="chips"
                className="flex flex-col items-end gap-[1.2cqw]"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                {CHIPS.map((c, i) => (
                  <motion.span
                    key={c}
                    className={cn(
                      "rounded-full px-[2.4cqw] py-[1.2cqw] text-[2.4cqw] font-medium ring-[0.25cqw] ring-inset transition-colors",
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
              className="ml-auto max-w-[80%] rounded-[2cqw] rounded-br-[0.6cqw] bg-primary px-[2.4cqw] py-[1.8cqw] text-[2.6cqw] leading-snug text-white"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {QUESTION} We&apos;re 5 people.
            </motion.p>
          )}

          {thinking && (
            <motion.div layout className="flex items-end gap-[1.4cqw]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="flex size-[4.6cqw] shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <SeraMark className="size-[3.2cqw]" />
              </span>
              <span className="rounded-[2cqw] bg-white px-[2.4cqw] py-[1.4cqw] shadow-[0_0.3cqw_1cqw_rgb(15_23_42/0.06)]">
                <Dots />
              </span>
            </motion.div>
          )}

          {answered && (
            <motion.div
              layout
              className="flex items-end gap-[1.4cqw]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <span className="flex size-[4.6cqw] shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <SeraMark className="size-[3.2cqw]" />
              </span>
              <div className="flex-1 rounded-[2cqw] rounded-bl-[0.6cqw] bg-white p-[2.2cqw] text-[2.6cqw] leading-snug shadow-[0_0.3cqw_1cqw_rgb(15_23_42/0.06)]">
                Business Plus fits a team of 5: one mailbox each and 45 GB of storage.
                <AnimatePresence>
                  {card && (
                    <motion.div
                      className="mt-[1.8cqw] rounded-[1.6cqw] bg-[linear-gradient(150deg,#0f1f4d,#071230)] p-[2cqw] text-white"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <span className="flex items-baseline justify-between">
                        <span className="text-[2.6cqw] font-semibold">Business Plus</span>
                        <span className="text-[3.4cqw] font-semibold">
                          $7.95<span className="text-[2.2cqw] font-normal text-white/60">/mo</span>
                        </span>
                      </span>
                      <span className="mt-[1cqw] block text-[2.2cqw] text-[#7dd3fc]">5 accounts · 45 GB</span>
                      <span className="mt-[1.6cqw] block rounded-[1cqw] bg-primary py-[1.2cqw] text-center text-[2.4cqw] font-semibold">
                        Choose plan
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-[1.6cqw] border-t border-[#e2e8f0] bg-white px-[2.6cqw] py-[2cqw]">
          <span className="flex-1 text-[2.4cqw] text-[#94a3b8]">Message Sera…</span>
          <span className="flex size-[5cqw] items-center justify-center rounded-full bg-primary text-white">
            <svg viewBox="0 0 16 16" className="size-[2.6cqw]" fill="currentColor" aria-hidden="true">
              <path d="M2 2.5 14 8 2 13.5l1.6-5.5L2 2.5Zm1.6 5.5H9" />
            </svg>
          </span>
        </div>
      </div>

      {/* Human hand-off chip */}
      <motion.div
        className={cn(glass, "bottom-[3%] left-[2%] flex w-[42%] items-center gap-[2cqw] p-[2.2cqw] pr-[3.2cqw]")}
        initial={false}
        animate={{ opacity: answered ? 1 : 0.0, y: answered ? 0 : 14 }}
        transition={{ duration: 0.6, delay: answered ? 0.6 : 0, ease: EASE }}
      >
        <span className="flex size-[6cqw] items-center justify-center rounded-full bg-brand-50 text-primary">
          <svg viewBox="0 0 24 24" className="size-[3.6cqw]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
          </svg>
        </span>
        <span>
          <span className="block text-[2.7cqw] font-semibold">A person is one tap away</span>
          <span className="block text-[2.3cqw] text-[#64748b]">Sera hands off to the team</span>
        </span>
      </motion.div>

      <Cursor x={cursor.x} y={cursor.y} press={t >= 18 && t < 21} />
    </div>
  );
}
