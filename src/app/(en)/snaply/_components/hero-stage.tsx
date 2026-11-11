"use client";

import { motion } from "motion/react";
import { useReducedAfterMount } from "../../business-email/_components/use-reduced";
import { BrowserShot, Check, G, Glyph, PanelShot } from "./kit";
import { t as tx } from "@/i18n/t";

/**
 * Hero composition, in the same family as the business-email hero: a folded
 * brand slab behind, the real Snaply editor in a browser window, the real
 * popup floating over its edge, and two small status chips that describe
 * things the extension genuinely does (redaction flattened on export, the
 * capture saved locally). motion only; reduced motion = static.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroStage() {
  const reduced = useReducedAfterMount();
  const enter = (delay: number, y = 40) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE },
        };
  const float = (amp: number, dur: number) =>
    reduced ? {} : { animate: { y: [0, -amp, 0] }, transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <div className="relative mx-auto w-full max-w-[760px] pb-10 pt-6 sm:pb-16 sm:pt-10">
      {/* Folded brand slab */}
      <div aria-hidden="true" className="absolute right-[2%] top-0 h-[78%] w-[74%] rounded-[28px] bg-[linear-gradient(135deg,#3d6bff,#0000e0)] [clip-path:polygon(0_0,86%_0,100%_14%,100%_100%,0_100%)]" />
      <div aria-hidden="true" className="absolute right-[2%] top-0 h-[14%] w-[11%] rounded-bl-[18px] bg-[linear-gradient(225deg,#c9d6ff,#8aa6ff)] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
      <div aria-hidden="true" className="absolute bottom-[2%] left-[10%] h-[30%] w-[62%] rounded-[24px] bg-brand-100" />

      {/* Editor */}
      <motion.div {...enter(0.1)} className="relative w-[90%]">
        <BrowserShot
          src="/snaply/editor.jpg"
          alt="The Snaply editor: an annotated screenshot with an arrow, numbered steps, a highlight box and a redacted API key"
          width={1600}
          height={1000}
          url="Snaply editor"
          priority
        />
      </motion.div>

      {/* Popup */}
      <motion.div {...enter(0.35, 60)} className="absolute -bottom-2 right-0 w-[34%] sm:bottom-0">
        <motion.div {...float(8, 6)}>
          <PanelShot src="/snaply/popup.png" alt="The Snaply popup with four screenshot modes and Record screen" width={575} height={800} priority />
        </motion.div>
      </motion.div>

      {/* Chips */}
      <motion.div {...enter(0.7, 20)} className="absolute left-[-2%] top-[46%] hidden sm:block">
        <motion.div {...float(6, 7)} className="flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 text-[13px] shadow-[0_18px_40px_-14px_rgb(0_0_60/0.45),0_0_0_1px_rgb(15_23_42/0.06)] backdrop-blur">
          <span className="flex size-8 items-center justify-center rounded-xl bg-[#111827] text-white">
            <Glyph d={G.shield} className="size-4" />
          </span>
          <span>
            <span className="block font-semibold text-fg">{tx("API key redacted")}</span>
            <span className="block text-fg-muted">{tx("Flattened into the export")}</span>
          </span>
        </motion.div>
      </motion.div>

      <motion.div {...enter(0.9, 20)} className="absolute bottom-[8%] left-[6%] hidden sm:block">
        <motion.div {...float(5, 8)} className="flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 text-[13px] shadow-[0_18px_40px_-14px_rgb(0_0_60/0.45),0_0_0_1px_rgb(15_23_42/0.06)] backdrop-blur">
          <span className="flex size-8 items-center justify-center rounded-full bg-success-fill text-white">
            <Check className="size-4" />
          </span>
          <span>
            <span className="block font-semibold text-fg">{tx("Saved on this computer")}</span>
            <span className="block text-fg-muted">{tx("PNG · 1280 × 800 · nothing uploaded")}</span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
