"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * The reference's stats band: each digit is a vertical strip of 0–9 that
 * rolls to its value when the band scrolls into view, left to right.
 *
 * ⚠ Real numbers only — every figure here is the WHMCS Email Solutions
 * catalogue (2026-10-06). The reference shows customer counts and open
 * rates; we have no verified equivalents and do not invent them.
 */
export type Stat = { prefix?: string; value: string; suffix?: string; label: string };

function Digit({ d, delay, run }: { d: number; delay: number; run: boolean }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-top leading-none">
      <motion.span
        className="flex flex-col"
        initial={{ y: "0%" }}
        animate={{ y: run ? `${-d * 10}%` : "0%" }}
        transition={{ delay, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1em] leading-none">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function StatsRoll({ stats }: { stats: readonly Stat[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const run = inView || !!reduced;

  return (
    <dl
      ref={ref}
      className="grid grid-cols-2 divide-white/10 lg:grid-cols-4 lg:divide-x"
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="flex flex-col gap-4 px-2 py-8 text-center min-[400px]:px-6 lg:py-4"
        >
          <dt className="mx-auto max-w-[220px] text-small text-white/75">{s.label}</dt>
          <dd className="whitespace-nowrap font-display text-[34px] font-medium leading-none tracking-[-0.02em] text-white min-[400px]:text-[40px] sm:text-[52px]">
            <span className="sr-only">
              {s.prefix}
              {s.value}
              {s.suffix}
            </span>
            <span aria-hidden="true" className="inline-flex items-baseline">
              {s.prefix}
              {[...s.value].map((ch, k) =>
                /\d/.test(ch) ? (
                  <Digit
                    key={k}
                    d={Number(ch)}
                    delay={reduced ? 0 : i * 0.12 + k * 0.08}
                    run={run}
                  />
                ) : (
                  <span key={k}>{ch}</span>
                ),
              )}
              {s.suffix && (
                <span className="ml-1 text-[0.55em] font-normal text-white/80">
                  {s.suffix}
                </span>
              )}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
