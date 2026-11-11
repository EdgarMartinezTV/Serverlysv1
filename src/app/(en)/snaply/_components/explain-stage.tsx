"use client";

import { motion } from "motion/react";
import { useReducedAfterMount } from "../../business-email/_components/use-reduced";
import { BrowserShot, Eyebrow, PanelShot } from "./kit";
import { t as tx, tc } from "@/i18n/t";

/**
 * The launch-style statement band, built like business-email's "Make the right
 * impression": the headline arrives word by word, the last word carries the
 * brand shimmer, and a composition of real Snaply captures rises into place —
 * area selection in the browser, the recorder panel, and Projects behind.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const WORDS = ["Capture", "anything.", "Explain"];

export function ExplainStage() {
  const reduced = useReducedAfterMount();
  const reveal = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: "0.45em", filter: "blur(10px)" },
          whileInView: { opacity: 1, y: "0em", filter: "blur(0px)" },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.9, delay: i * 0.08, ease: EASE },
        };
  const rise = (delay: number, y = 70) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 1.2, delay, ease: EASE },
        };

  return (
    <div className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,var(--color-brand-50)_55%,#ffffff_100%)]">
      <div aria-hidden="true" className="absolute left-1/2 top-[-10%] -z-10 h-[60%] w-[min(1200px,120vw)] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_30%,rgb(31_85_255/0.10),transparent_70%)]" />
      <div className="mx-auto flex max-w-[1280px] flex-col items-center px-5 pb-28 pt-20 sm:px-8 lg:px-10 lg:pb-40 lg:pt-28">
        <motion.div {...reveal(0)}>
          <Eyebrow>Screenshots and screen recording</Eyebrow>
        </motion.div>
        <h2 id="explain" className="mt-6 text-center font-display text-[42px] font-normal leading-[1.02] tracking-[-0.035em] text-fg sm:text-[64px] lg:text-[80px]">
          {WORDS.map((w, i) => (
            <motion.span key={w} {...reveal(i + 1)} className="mr-[0.24em] inline-block">
              {tc("snaply", w)}
            </motion.span>
          ))}
          <motion.span {...reveal(4)} className="inline-block">
            <motion.span
              className="inline-block bg-[linear-gradient(110deg,var(--color-primary)_20%,var(--color-brand-400)_40%,#22d3ee_55%,var(--color-primary)_80%)] bg-[length:250%_100%] bg-clip-text pb-[0.08em] text-transparent"
              animate={reduced ? undefined : { backgroundPositionX: ["100%", "-150%"] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              {tx("everything.")}
            </motion.span>
          </motion.span>
        </h2>
        <motion.p {...reveal(5)} className="mx-auto mt-6 max-w-[620px] text-center text-body-lg text-fg-secondary">
          {tx("Most explanations go faster with a screenshot, and most screenshots go faster with an arrow on them. Snaply is for every moment you would otherwise type out what you are looking at.")}
        </motion.p>

        <div className="relative mx-auto mt-14 w-full max-w-[1080px] sm:mt-20">
          {/* Layered brand cards behind */}
          <div aria-hidden="true" className="absolute left-[8%] top-[-6%] h-[70%] w-[64%] rounded-[32px] bg-[linear-gradient(135deg,#3d6bff,#0000e0)] [clip-path:polygon(0_0,88%_0,100%_12%,100%_100%,0_100%)]" />
          <div aria-hidden="true" className="absolute bottom-[-5%] right-[4%] h-[46%] w-[48%] rounded-[32px] bg-brand-100" />

          <motion.div {...rise(0.15)} className="relative ml-auto w-[84%]">
            <BrowserShot
              src="/snaply/select.jpg"
              alt="Selecting part of a web page with Snaply, with the size of the selection shown"
              width={1600}
              height={1000}
              url="Select area · 760 × 540"
              sizes="(min-width: 1024px) 900px, 100vw"
            />
          </motion.div>

          <motion.div {...rise(0.4, 90)} className="absolute bottom-[-8%] left-0 w-[30%] min-w-[150px]">
            <PanelShot src="/snaply/recorder.png" alt="The Snaply recorder: this tab, screen or camera, with microphone and webcam options" width={545} height={500} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
