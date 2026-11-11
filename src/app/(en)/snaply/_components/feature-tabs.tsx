"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedAfterMount } from "../../business-email/_components/use-reduced";
import { Check, G, Glyph } from "./kit";
import { t as tx } from "@/i18n/t";
import { lh } from "@/i18n/href";

/**
 * The dark chaptered feature panel, same mechanics as business-email's
 * FeatureShowcase: pills fill as each chapter plays (auto-advance, paused on
 * hover/focus and off screen, none under reduced motion), and each chapter's
 * scene is a REAL Snaply capture with small glass cards naming what is shown.
 * Every claim matches the Chrome Web Store listing.
 */

const CHAPTER_MS = 6500;
const EASE = [0.16, 1, 0.3, 1] as const;

type Chapter = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  points: readonly string[];
  image: { src: string; alt: string; w: number; h: number; fit: "cover" | "panel" };
  chips: ReadonlyArray<{ icon: string; title: string; detail: string; at: string }>;
};

const CHAPTERS: readonly Chapter[] = [
  {
    id: "capture",
    label: "Screenshots",
    eyebrow: "One click each",
    title: "Four ways to capture",
    body: "The visible area, an area you drag, a single element on the page, or the whole scrolling page stitched into one image.",
    points: [
      "Full page handles sticky headers and puts the page back",
      "Real resolution on high-DPI and Retina screens",
      "PNG or JPEG, copy to clipboard, rename before saving",
    ],
    image: { src: "/snaply/select.jpg", alt: "Selecting an area of a web page with Snaply", w: 1600, h: 1000, fit: "cover" },
    chips: [
      { icon: G.crop, title: "Select area", detail: "760 × 540 px", at: "left-[6%] top-[10%]" },
      { icon: G.page, title: "Full page", detail: "Stitched, sticky header once", at: "bottom-[8%] right-[5%]" },
    ],
  },
  {
    id: "editor",
    label: "Editor",
    eyebrow: "Point at it, then send it",
    title: "Mark it up in seconds",
    body: "Every screenshot opens in the editor: arrows, boxes, text, highlighter and numbered steps, with undo all the way back.",
    points: [
      "Blur and pixelate anything distracting",
      "Redact boxes burned into the exported file",
      "Crop, rotate and resize before you share",
    ],
    image: { src: "/snaply/editor.jpg", alt: "The Snaply editor with annotations and a redacted field", w: 1600, h: 1000, fit: "cover" },
    chips: [
      { icon: G.pen, title: "Numbered steps", detail: "Arrows, text, highlighter", at: "left-[5%] bottom-[10%]" },
      { icon: G.shield, title: "Redacted", detail: "Flattened on export", at: "right-[5%] top-[10%]" },
    ],
  },
  {
    id: "record",
    label: "Recording",
    eyebrow: "Tab, window or screen",
    title: "Record and explain it once",
    body: "Record the current tab with its sound, any tab, a window, your entire screen or just your webcam, with your microphone and a webcam bubble.",
    points: [
      "Pause, resume and a countdown before you start",
      "Written to disk in one-second chunks, recoverable after a crash",
      "Trim, cut and export WebM, MP4 or a short GIF",
    ],
    image: { src: "/snaply/recorder.png", alt: "The Snaply recorder settings", w: 545, h: 500, fit: "panel" },
    chips: [
      { icon: G.video, title: "Recording", detail: "Mic + webcam bubble", at: "left-[5%] top-[12%]" },
      { icon: G.gif, title: "Export", detail: "WebM · MP4 · GIF", at: "right-[5%] bottom-[10%]" },
    ],
  },
  {
    id: "private",
    label: "Private",
    eyebrow: "Nothing leaves your computer",
    title: "Your captures stay yours",
    body: "Snaply has no account, no servers and no analytics. Everything is kept in Chrome on your own machine until you download or share it.",
    points: [
      "No sign-up, no tracking, no ads",
      "Its pages are blocked from contacting the internet",
      "No remote code, only the package Google reviewed",
    ],
    image: { src: "/snaply/library.jpg", alt: "Snaply Projects, where captures are kept on your computer", w: 1600, h: 1000, fit: "cover" },
    chips: [
      { icon: G.cloudOff, title: "0 uploads", detail: "Stored in Chrome, on this device", at: "left-[5%] bottom-[10%]" },
      { icon: G.lock, title: "No account", detail: "Install and use", at: "right-[5%] top-[10%]" },
    ],
  },
];

export function FeatureTabs({ cta }: { cta: { label: string; href: string } }) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.35 });
  const reduced = useReducedAfterMount();
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const [cycle, setCycle] = useState(0);
  const base = useId();
  const playing = inView && !hold && !reduced;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      setActive((a) => (a + 1) % CHAPTERS.length);
      setCycle((c) => c + 1);
    }, CHAPTER_MS);
    return () => window.clearTimeout(t);
  }, [playing, active, cycle]);

  const choose = (i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  };
  const ch = CHAPTERS[active];

  return (
    <div
      ref={root}
      className="relative"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)}
      onBlurCapture={() => setHold(false)}
    >
      <div className="mx-auto max-w-[760px] text-center">
        <p className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-brand-200 ring-1 ring-white/10">
          <span className="size-1.5 rounded-full bg-accent-on-dark shadow-[0_0_10px_var(--color-accent-on-dark)]" />
          {tx("What Snaply does")}
        </p>
        <h2 id="features-title" className="mt-6 font-display text-[38px] font-normal leading-[1.05] tracking-[-0.03em] text-white sm:text-[56px]">
          {tx("Everything a screen capture tool ")}
          <span className="text-brand-300">{tx("should be")}</span>
        </h2>
      </div>

      <div
        role="tablist"
        aria-label={tx("Snaply features")}
        className="relative mx-auto mt-12 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-white/[0.06] p-1.5 ring-1 ring-white/10 [scrollbar-width:none]"
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          const next = (active + (e.key === "ArrowRight" ? 1 : CHAPTERS.length - 1)) % CHAPTERS.length;
          choose(next);
          document.getElementById(`${base}-tab-${next}`)?.focus();
        }}
      >
        {CHAPTERS.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.id}
              id={`${base}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${base}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => choose(i)}
              className={cn(
                "relative isolate h-11 shrink-0 overflow-hidden rounded-full px-5 text-small font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-6",
                on ? "text-fg" : "text-white/75 hover:text-white",
              )}
            >
              {on && (
                <motion.span layoutId={`${base}-pill`} className="absolute inset-0 -z-10 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              {on && !reduced && (
                <motion.span
                  key={cycle}
                  className="absolute inset-y-0 left-0 -z-10 rounded-full bg-brand-100"
                  initial={{ width: "0%" }}
                  animate={{ width: playing ? "100%" : undefined }}
                  transition={{ duration: CHAPTER_MS / 1000, ease: "linear" }}
                />
              )}
              {tx(c.label)}
            </button>
          );
        })}
      </div>

      <div className="relative mt-8">
        <div aria-hidden="true" className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[48px] bg-[radial-gradient(60%_70%_at_70%_50%,rgb(0_0_255/0.35),transparent_70%)]" />
        <div className="rounded-[30px] bg-[linear-gradient(140deg,rgb(148_180_255/0.45),rgb(255_255_255/0.06)_35%,rgb(34_211_238/0.25))] p-px">
          <div
            id={`${base}-panel`}
            role="tabpanel"
            aria-labelledby={`${base}-tab-${active}`}
            className="grid overflow-hidden rounded-[29px] bg-[linear-gradient(160deg,#0d1a3d,#071230_55%,#050d24)] lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="relative flex min-h-[420px] flex-col justify-center p-8 sm:p-12 lg:p-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <p className="text-caption font-semibold uppercase tracking-[0.14em] text-accent-on-dark">{tx(ch.eyebrow)}</p>
                  <h3 className="mt-4 font-display text-[30px] font-normal leading-[1.1] tracking-[-0.025em] text-white sm:text-[40px]">{tx(ch.title)}</h3>
                  <p className="mt-4 max-w-[440px] text-body text-white/65">{tx(ch.body)}</p>
                  <ul className="mt-7 flex flex-col gap-3.5">
                    {ch.points.map((p, i) => (
                      <motion.li
                        key={p}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: EASE }}
                        className="flex items-start gap-3 text-body text-white/85"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-primary text-white shadow-[0_0_14px_rgb(31_85_255/0.6)]">
                          <Check className="size-3" />
                        </span>
                        {tx(p)}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
              <a
                href={lh(cta.href)}
                className="group mt-9 inline-flex h-12 w-fit items-center gap-2 rounded-md bg-white px-6 text-body font-semibold text-primary shadow-[0_10px_30px_-10px_rgb(31_85_255/0.8)] transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {tx(cta.label)}
                <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5">
                  <path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Scene: a real capture with glass chips */}
            <div className="relative min-h-[340px] overflow-hidden bg-[radial-gradient(80%_80%_at_60%_40%,rgb(31_85_255/0.35),transparent_70%)] lg:min-h-[560px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={ch.id}
                  className="absolute inset-0 flex items-center justify-center p-6 sm:p-10"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <div
                    className={cn(
                      "overflow-hidden bg-white shadow-[0_40px_80px_-24px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.15)]",
                      ch.image.fit === "panel" ? "w-[62%] max-w-[380px] rounded-[18px]" : "w-full rounded-[14px]",
                    )}
                  >
                    <Image src={ch.image.src} alt={tx(ch.image.alt)} width={ch.image.w} height={ch.image.h} sizes="(min-width: 1024px) 640px, 100vw" className="block h-auto w-full" />
                  </div>
                </motion.div>
              </AnimatePresence>
              <div aria-hidden="true" className="absolute inset-0">
                <AnimatePresence mode="wait">
                  <motion.div key={ch.id} className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.25 } }}>
                    {ch.chips.map((c, i) => (
                      <motion.div
                        key={c.title}
                        initial={{ opacity: 0, y: 22, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.35 + i * 0.3 }}
                        className={cn(
                          "absolute flex items-center gap-2.5 rounded-2xl bg-white/[0.94] px-3.5 py-2.5 text-[12.5px] text-[#0f172a] shadow-[0_20px_40px_-14px_rgb(0_0_40/0.7),0_0_0_1px_rgb(255_255_255/0.6)] backdrop-blur",
                          c.at,
                        )}
                      >
                        <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-white">
                          <Glyph d={c.icon} className="size-4" />
                        </span>
                        <span>
                          <span className="block font-semibold">{tx(c.title)}</span>
                          <span className="block text-[#64748b]">{tx(c.detail)}</span>
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
