"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The hero "film", after the reference's hero (Hostinger email marketing):
 * a gradient title card whose words blur in, a brand card, a setup scene
 * where a cursor picks the domain and creates the mailbox, then the live
 * inbox with new mail arriving — on a loop.
 *
 * Built with motion (motion.dev). Runs only while on screen; under
 * prefers-reduced-motion it shows the final inbox scene, still.
 */

type Scene = "title" | "brand" | "setup" | "inbox";
const ORDER: readonly Scene[] = ["title", "brand", "setup", "inbox"];
const LENGTH: Record<Scene, number> = {
  title: 2600,
  brand: 1900,
  setup: 5200,
  inbox: 6200,
};
const EASE = [0.16, 1, 0.3, 1] as const;

const sceneMotion = {
  initial: { opacity: 0, filter: "blur(14px)", scale: 1.03 },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
  exit: {
    opacity: 0,
    filter: "blur(14px)",
    scale: 0.985,
    transition: { duration: 0.45, ease: "easeIn" as const },
  },
};

export function HeroFilm() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [scene, setScene] = useState<Scene>("title");
  const running = inView && !reduced;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      setScene((s) => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length]);
    }, LENGTH[scene]);
    return () => window.clearTimeout(t);
  }, [running, scene]);

  const shown: Scene = reduced ? "inbox" : scene;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="relative aspect-[16/11] w-full overflow-hidden rounded-[28px] bg-[linear-gradient(125deg,var(--color-brand-50)_0%,var(--color-brand-100)_50%,var(--color-brand-200)_100%)] shadow-[0_40px_90px_-40px_rgb(0_0_255/0.45)]"
    >
      <AnimatePresence mode="wait">
        {shown === "title" && <TitleCard key="title" />}
        {shown === "brand" && <BrandCard key="brand" />}
        {shown === "setup" && <SetupScene key="setup" />}
        {shown === "inbox" && <InboxScene key="inbox" live={running} />}
      </AnimatePresence>
    </div>
  );
}

/* ── 1 · Title card ─────────────────────────────────────────────────── */
function TitleCard() {
  const words = [
    { w: "Your", hi: false },
    { w: "domain.", hi: true },
    { w: "Your", hi: false },
    { w: "inbox.", hi: false },
  ];
  return (
    <motion.div
      {...sceneMotion}
      className="absolute inset-0 flex items-center justify-center p-8"
    >
      <p className="text-center font-display text-[clamp(28px,4.4vw,56px)] font-normal leading-[1.1] tracking-[-0.03em] text-[var(--color-brand-950)]">
        {words.map((x, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.25 + i * 0.16, duration: 0.7, ease: EASE }}
            className={cn(
              "inline-block",
              i === 2 && "ml-0",
              x.hi &&
                "bg-gradient-to-r from-primary to-brand-400 bg-clip-text text-transparent",
            )}
          >
            {x.w}
            {i < words.length - 1 && <>&nbsp;</>}
            {i === 1 && <br />}
          </motion.span>
        ))}
      </p>
    </motion.div>
  );
}

/* ── 2 · Brand card ─────────────────────────────────────────────────── */
function BrandCard() {
  return (
    <motion.div
      {...sceneMotion}
      className="absolute inset-0 flex items-center justify-center gap-[3%] p-8"
    >
      <motion.div
        initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="relative size-[clamp(40px,7vw,72px)] shrink-0"
      >
        <Image
          src="/brand/logo-square.png"
          alt=""
          fill
          sizes="72px"
          className="object-contain"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
        className="flex items-center gap-[0.5em] font-display text-[clamp(22px,3.4vw,40px)] font-semibold tracking-[0.08em] text-[var(--color-brand-950)]"
      >
        SERVERLYS <span className="h-[1.1em] w-px bg-[var(--color-brand-950)]/50" />
        <span className="whitespace-nowrap font-normal tracking-[-0.01em]">
          Business Email
        </span>
      </motion.p>
    </motion.div>
  );
}

/* ── 3 · Setup: pick the domain, create the mailbox ─────────────────── */
function SetupScene() {
  // 0 field empty · 1 cursor at field · 2 dropdown open · 3 domain chosen
  // 4 cursor at button · 5 pressed · 6 mailbox created
  const [step, setStep] = useState(0);
  useEffect(() => {
    const at = [500, 1250, 1950, 2600, 3300, 3700];
    const ts = at.map((ms, i) => window.setTimeout(() => setStep(i + 1), ms));
    return () => ts.forEach(window.clearTimeout);
  }, []);

  const cursor =
    step <= 1
      ? { left: "34%", top: "52%" }
      : step <= 3
        ? { left: "18%", top: "66%" }
        : { left: "30%", top: "79%" };

  return (
    <motion.div {...sceneMotion} className="absolute inset-0">
      {/* Inbox behind, on the right */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
        className="absolute -right-[18%] top-[12%] w-[78%]"
      >
        <Image
          src="/email/inbox.webp"
          alt=""
          width={1440}
          height={919}
          sizes="600px"
          className="h-auto w-full rounded-xl drop-shadow-[0_30px_50px_rgb(20_20_60/0.25)]"
        />
      </motion.div>

      {/* Setup panel */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="absolute left-[5%] top-[10%] flex h-[80%] w-[46%] flex-col rounded-2xl bg-white p-[3.2%] shadow-[0_30px_60px_-24px_rgb(20_20_60/0.35)]"
      >
        <span className="relative size-[9%] min-h-6 min-w-6">
          <Image
            src="/brand/logo-square.png"
            alt=""
            fill
            sizes="32px"
            className="object-contain"
          />
        </span>
        <p className="mt-[6%] font-display text-[clamp(14px,1.9vw,24px)] leading-[1.15] tracking-[-0.02em] text-[var(--color-brand-950)]">
          Your inbox starts here, <em className="font-medium">Jordan!</em>
        </p>
        <p className="mt-[3%] text-[clamp(9px,0.95vw,12px)] text-[#6b7280]">
          Choose the domain your email will use.
        </p>

        {/* Domain select */}
        <div className="relative mt-[6%]">
          <div
            className={cn(
              "flex items-center justify-between rounded-lg border px-[5%] py-[3.5%] text-[clamp(9px,1vw,13px)] transition-colors duration-300",
              step >= 2 && step < 3
                ? "border-primary ring-2 ring-primary/20"
                : "border-[#d7dbe3]",
            )}
          >
            <span
              className={
                step >= 3
                  ? "font-medium text-[var(--color-brand-950)]"
                  : "text-[#9aa1ad]"
              }
            >
              {step >= 3 ? "brightleaf.co" : "Select a domain"}
            </span>
            <svg
              viewBox="0 0 16 16"
              className="size-[1em] text-[#6b7280]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </div>
          <AnimatePresence>
            {step === 2 && (
              <motion.ul
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-lg bg-white text-[clamp(9px,1vw,13px)] shadow-[0_16px_30px_-10px_rgb(20_20_60/0.3)] ring-1 ring-[#e5e7eb]"
              >
                {["brightleaf.co", "brightleaf.studio"].map((d, i) => (
                  <li
                    key={d}
                    className={cn(
                      "px-[5%] py-[3%]",
                      i === 0 && "bg-brand-50 font-medium text-primary",
                    )}
                  >
                    {d}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <label className="mt-[5%] flex items-center gap-[3%] text-[clamp(8px,0.9vw,11.5px)] text-[#4b5563]">
          <span className="flex size-[1.3em] items-center justify-center rounded bg-primary text-white">
            <svg
              viewBox="0 0 16 16"
              className="size-[0.9em]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3.5 8.5 3 3 6-7" />
            </svg>
          </span>
          Add a signature with my business details
        </label>

        <motion.span
          animate={{ scale: step === 5 ? 0.94 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-primary py-[4%] text-[clamp(9px,1vw,13px)] font-semibold text-white"
        >
          {step >= 6 ? "Mailbox ready" : "Create mailbox"}
        </motion.span>
      </motion.div>

      {/* Created toast */}
      <AnimatePresence>
        {step >= 6 && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute bottom-[7%] left-[38%] flex items-center gap-[0.8em] rounded-xl bg-white px-[1.2em] py-[0.8em] text-[clamp(9px,1.05vw,13.5px)] shadow-[0_24px_50px_-18px_rgb(20_20_60/0.45)]"
          >
            <span className="flex size-[2em] items-center justify-center rounded-full bg-[#22c55e] text-white">
              <svg
                viewBox="0 0 16 16"
                className="size-[1em]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block font-semibold text-[var(--color-brand-950)]">
                New mailbox created
              </span>
              <span className="block text-[#6b7280]">jordan@brightleaf.co</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor */}
      <motion.svg
        viewBox="0 0 24 24"
        className="absolute z-20 size-[clamp(16px,2.4vw,28px)] drop-shadow-[0_2px_4px_rgb(0_0_0/0.35)]"
        initial={{ left: "60%", top: "40%", opacity: 0 }}
        animate={{
          ...cursor,
          opacity: step >= 6 ? 0 : 1,
          scale: step === 2 || step === 5 ? 0.86 : 1,
        }}
        transition={{ duration: 0.65, ease: [0.45, 0, 0.2, 1] }}
      >
        <path
          d="M5 2.5 19 13l-6.2.9 3.7 6.9-2.7 1.4-3.6-7L5 19.5Z"
          fill="#111"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}

/* ── 4 · Live inbox ─────────────────────────────────────────────────── */
const ARRIVALS = [
  {
    initials: "LT",
    tone: "bg-primary",
    name: "Lucas Taylor",
    subject: "Re: revised quote for phase 2",
  },
  {
    initials: "AP",
    tone: "bg-brand-900",
    name: "Avery Patel",
    subject: "Next steps for the Q3 campaign",
  },
  {
    initials: "DS",
    tone: "bg-brand-400",
    name: "Daniel Smith",
    subject: "Onboarding documents attached",
  },
];

function InboxScene({ live }: { live: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!live) return;
    const t = window.setInterval(() => setN((x) => x + 1), 2000);
    return () => window.clearInterval(t);
  }, [live]);
  const a = ARRIVALS[n % ARRIVALS.length];

  return (
    <motion.div
      {...sceneMotion}
      className="absolute inset-0 flex items-center justify-center p-[5%]"
    >
      <motion.div
        initial={{ y: 40, rotateX: 12, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE }}
        style={{ transformPerspective: 1400 }}
        className="relative w-full"
      >
        <Image
          src="/email/inbox.webp"
          alt=""
          width={1440}
          height={919}
          sizes="(min-width: 1024px) 680px, 100vw"
          className="h-auto w-full drop-shadow-[0_30px_60px_rgb(20_20_60/0.25)]"
        />
      </motion.div>
      {live && (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={n}
            initial={{ opacity: 0, x: 40, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="absolute right-[3%] top-[7%] w-[44%] rounded-2xl bg-white/95 p-[1.6%] shadow-[0_24px_50px_-18px_rgb(15_23_42/0.45),0_0_0_1px_rgb(15_23_42/0.06)] backdrop-blur"
          >
            <div className="flex items-start gap-[0.8em] text-[clamp(9px,1vw,13px)]">
              <span
                className={cn(
                  "flex size-[2.6em] shrink-0 items-center justify-center rounded-full font-semibold text-white",
                  a.tone,
                )}
              >
                {a.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-[#111827]">
                    {a.name}
                  </span>
                  <span className="shrink-0 text-[0.85em] text-[#9aa1ad]">now</span>
                </span>
                <span className="mt-0.5 block truncate text-[#4b5563]">
                  {a.subject}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[0.85em] font-medium text-primary">
                  <span className="size-1.5 rounded-full bg-primary" /> New email
                </span>
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
