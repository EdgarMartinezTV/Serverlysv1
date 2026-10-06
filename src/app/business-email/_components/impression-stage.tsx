"use client";

import { motion } from "motion/react";
import { ImpressionFilm } from "./impression-film";
import { useReducedAfterMount } from "./use-reduced";

/**
 * "Make the right impression" — the stage around ImpressionFilm.
 *
 * Lit like a product launch: a beam of brand light from above, a horizon arc
 * glowing under the film, a faint perspective grid and film grain so the dark
 * reads as a material rather than a flat fill. The headline arrives word by
 * word out of blur and "impression" carries a slow brand shimmer.
 *
 * motion (motion.dev) only. Brand palette only: brand blues, cyan accent on
 * dark, success green. Reduced motion: everything rendered in place, still.
 */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const WORDS = ["Make", "the", "right"];

export function ImpressionStage() {
  const reduced = useReducedAfterMount();
  const reveal = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: "0.45em", filter: "blur(12px)" },
          whileInView: { opacity: 1, y: "0em", filter: "blur(0px)" },
          viewport: { once: true, amount: 0.6 },
          transition: {
            duration: 0.9,
            delay: i * 0.09,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <div className="relative isolate overflow-hidden bg-[#030a1f]">
      {/* Beam from above */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[-20%] -z-10 h-[90%] w-[min(1400px,140vw)] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_0%,rgb(31_85_255/0.55),rgb(0_0_255/0.18)_45%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 h-[55%] w-[46%] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_38%,rgb(148_180_255/0.05)_44%,rgb(148_180_255/0.14)_50%,rgb(148_180_255/0.05)_56%,transparent_62%)]"
      />
      {/* Perspective grid */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[55%] [background-image:linear-gradient(rgb(148_180_255/0.08)_1px,transparent_1px),linear-gradient(90deg,rgb(148_180_255/0.08)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:linear-gradient(to_top,black,transparent)] [transform:perspective(900px)_rotateX(60deg)] [transform-origin:bottom]"
      />
      {/* Horizon glow under the film */}
      <div
        aria-hidden="true"
        className="absolute bottom-[-46%] left-1/2 -z-10 aspect-square w-[min(1700px,170vw)] -translate-x-1/2 rounded-full border-t border-brand-300/40 bg-[#030a1f] shadow-[0_-2px_40px_rgb(95_139_255/0.45),0_-60px_160px_-20px_rgb(0_0_255/0.6)]"
      />
      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="mx-auto flex max-w-[1240px] flex-col items-center px-5 pb-24 pt-24 sm:px-8 lg:px-10 lg:pb-32 lg:pt-32">
        <motion.p
          {...reveal(0)}
          className="flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-brand-200 ring-1 ring-white/10"
        >
          <span className="size-1.5 rounded-full bg-accent-on-dark shadow-[0_0_10px_var(--color-accent-on-dark)]" />
          Your domain, your inbox
        </motion.p>
        <h2
          id="impression"
          className="mt-6 text-center font-display text-[42px] font-normal leading-[1.02] tracking-[-0.035em] text-white sm:text-[64px] lg:text-[84px]"
        >
          {WORDS.map((w, i) => (
            <motion.span
              key={w}
              {...reveal(i + 1)}
              className="mr-[0.24em] inline-block"
            >
              {w}
            </motion.span>
          ))}
          <motion.span {...reveal(4)} className="inline-block">
            <motion.span
              className="inline-block bg-[linear-gradient(110deg,var(--color-brand-300)_20%,#ffffff_42%,var(--color-accent-on-dark)_58%,var(--color-brand-300)_80%)] bg-[length:250%_100%] bg-clip-text text-transparent"
              animate={reduced ? undefined : { backgroundPositionX: ["100%", "-150%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              impression
            </motion.span>
          </motion.span>
        </h2>
        <motion.p
          {...reveal(5)}
          className="mx-auto mt-6 max-w-[600px] text-center text-body-lg text-white/65"
        >
          Every email you send says something about your business. Stand out with your
          own domain and a signature that reflects your brand.
        </motion.p>

        <motion.div
          className="relative mx-auto mt-16 w-full max-w-[min(1140px,calc((100svh-120px)*1.6))] sm:mt-20"
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0, y: 80, scale: 0.94, rotateX: 18 },
                whileInView: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: {
                  duration: 1.4,
                  delay: 0.25,
                  ease: [0.16, 1, 0.3, 1] as const,
                },
              })}
          style={{ transformPerspective: 1800 }}
        >
          <ImpressionFilm />
        </motion.div>
      </div>
    </div>
  );
}
