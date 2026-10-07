"use client";

import { motion } from "motion/react";
import { InboxShowcase } from "./inbox-showcase";
import { useReducedAfterMount } from "./use-reduced";

/**
 * "Make the right impression" — a light, product-launch composition: the
 * headline arrives word by word, "impression" carries a slow brand shimmer,
 * and InboxShowcase (desktop + phone in glass over layered brand cards) rises
 * into place and plays. motion (motion.dev) only; brand palette only.
 */

const WORDS = ["Make", "the", "right"];

export function ImpressionStage() {
  const reduced = useReducedAfterMount();
  const reveal = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: "0.45em", filter: "blur(10px)" },
          whileInView: { opacity: 1, y: "0em", filter: "blur(0px)" },
          viewport: { once: true, amount: 0.6 },
          transition: {
            duration: 0.9,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <div className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,var(--color-brand-50)_55%,#ffffff_100%)]">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[-10%] -z-10 h-[60%] w-[min(1200px,120vw)] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_30%,rgb(31_85_255/0.10),transparent_70%)]"
      />
      <div className="mx-auto flex max-w-[1280px] flex-col items-center px-5 pb-20 pt-20 sm:px-8 lg:px-10 lg:pb-28 lg:pt-28">
        <motion.p
          {...reveal(0)}
          className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_1px_2px_rgb(15_23_42/0.06),0_0_0_1px_var(--color-brand-100)]"
        >
          <span className="size-1.5 rounded-full bg-primary" />
          Your domain, your inbox
        </motion.p>
        <h2
          id="impression"
          className="mt-6 text-center font-display text-[42px] font-normal leading-[1.02] tracking-[-0.035em] text-fg sm:text-[64px] lg:text-[80px]"
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
              className="inline-block bg-[linear-gradient(110deg,var(--color-primary)_20%,var(--color-brand-400)_40%,#22d3ee_55%,var(--color-primary)_80%)] bg-[length:250%_100%] bg-clip-text pb-[0.08em] text-transparent"
              animate={reduced ? undefined : { backgroundPositionX: ["100%", "-150%"] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              impression
            </motion.span>
          </motion.span>
        </h2>
        <motion.p
          {...reveal(5)}
          className="mx-auto mt-6 max-w-[600px] text-center text-body-lg text-fg-secondary"
        >
          Every email you send says something about your business. Stand out with your
          own domain and a signature that reflects your brand.
        </motion.p>

        <motion.div
          className="relative mx-auto mt-12 w-full max-w-[min(1180px,max(680px,calc((100svh-110px)*1.51)))] sm:mt-16"
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0, y: 70, scale: 0.96 },
                whileInView: { opacity: 1, y: 0, scale: 1 },
                viewport: { once: true, amount: 0.2 },
                transition: {
                  duration: 1.3,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1] as const,
                },
              })}
        >
          <InboxShowcase />
        </motion.div>
      </div>
    </div>
  );
}
