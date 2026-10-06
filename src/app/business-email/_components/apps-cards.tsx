"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedAfterMount } from "./use-reduced";
import { Avatar, Check, Icon } from "./inbox-showcase";

/**
 * "Works with the apps you already use", after the reference's card style:
 * a light card, a soft brand-gradient panel holding product UI that crops off
 * the panel edge, floating chips and a cursor — and a title and line below.
 * Each panel plays a short loop while on screen (motion only).
 */

const EASE = [0.16, 1, 0.3, 1] as const;

function useLoopStep(steps: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedAfterMount();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % steps), ms);
    return () => window.clearInterval(t);
  }, [inView, reduced, steps, ms]);
  return { ref, step: reduced ? steps - 1 : step, reduced };
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="@container relative aspect-[1/1] overflow-hidden rounded-[22px] bg-[radial-gradient(90%_70%_at_100%_100%,var(--color-brand-300),transparent_70%),linear-gradient(160deg,var(--color-brand-50),var(--color-brand-100)_60%,var(--color-brand-200))] select-none"
      style={{
        fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function Cursor({ x, y, press }: { x: string; y: string; press?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="absolute z-20 w-[9cqw] drop-shadow-[0_1cqw_1.5cqw_rgb(0_0_80/0.3)]"
      animate={{ left: x, top: y, scale: press ? 0.85 : 1 }}
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

const card =
  "absolute rounded-[3.4cqw] bg-white text-[3.6cqw] text-[#0f172a] shadow-[0_0_0_0.3cqw_rgb(0_0_255/0.06),0_4cqw_8cqw_-3cqw_rgb(0_0_120/0.3)]";

/* ── 1 · Webmail in your browser ───────────────────────────────────── */

function WebmailPanel() {
  const { ref, step } = useLoopStep(4, 1500);
  const rows = [
    { av: "/email/avatars/ethan.webp", n: "Alex Rivera", s: "Great meeting yesterday" },
    {
      av: "/email/avatars/sara.webp",
      n: "Sara Okafor",
      s: "Logo files: final versions",
    },
    { ini: "MB", n: "Maya Brooks", s: "Q4 brand refresh" },
  ];
  return (
    <div ref={ref}>
      <Panel>
        <div
          className={cn(
            card,
            "left-[12%] top-[12%] h-[100%] w-[100%] overflow-hidden rounded-r-none p-0",
          )}
        >
          <div className="flex items-center gap-[2cqw] border-b border-[#eef0f4] bg-[#f6f7f9] px-[3.5cqw] py-[2.4cqw]">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span
                key={c}
                className="size-[2.4cqw] rounded-full"
                style={{ background: c }}
              />
            ))}
            <span className="ml-[2cqw] flex flex-1 items-center gap-[1.4cqw] rounded-[1.6cqw] bg-white px-[2.4cqw] py-[1.2cqw] text-[3cqw] text-[#64748b] shadow-[0_0_0_0.2cqw_#e5e8ee]">
              <Icon
                d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z"
                className="size-[3cqw] text-success"
              />{" "}
              mail.brightleaf.co
            </span>
          </div>
          <div className="px-[4cqw] pt-[3cqw]">
            <p className="flex items-center justify-between font-semibold">
              Inbox{" "}
              <span className="mr-[14cqw] rounded-full bg-primary px-[2cqw] text-[2.8cqw] text-white">
                {step >= 1 ? 3 : 2}
              </span>
            </p>
            <div className="mt-[2cqw] space-y-[1.6cqw]">
              <AnimatePresence initial={false}>
                {step >= 1 && (
                  <motion.div
                    key="new"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-[2.4cqw] rounded-[2cqw] bg-brand-50 px-[2.4cqw] py-[2cqw] shadow-[inset_0.6cqw_0_0_var(--color-primary)]">
                      <Avatar src="/email/avatars/mia.webp" className="size-[7cqw]" />
                      <span className="min-w-0 leading-tight">
                        <span className="block font-semibold">Jordan Miles</span>
                        <span className="block truncate text-[3.2cqw] text-[#475569]">
                          Proposal attached
                        </span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {rows.map((r) => (
                <div
                  key={r.n}
                  className="flex items-center gap-[2.4cqw] px-[2.4cqw] py-[1.4cqw]"
                >
                  {r.av ? (
                    <Avatar src={r.av} className="size-[7cqw]" />
                  ) : (
                    <span className="flex size-[7cqw] shrink-0 items-center justify-center rounded-full bg-brand-900 text-[2.6cqw] font-semibold text-white">
                      {r.ini}
                    </span>
                  )}
                  <span className="min-w-0 leading-tight">
                    <span className="block font-semibold">{r.n}</span>
                    <span className="block truncate text-[3.2cqw] text-[#64748b]">
                      {r.s}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <motion.div
          className={cn(
            card,
            "bottom-[8%] left-[6%] flex items-center gap-[2.4cqw] px-[3.4cqw] py-[2.6cqw]",
          )}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="flex size-[8cqw] items-center justify-center rounded-[2.2cqw] bg-primary text-white">
            <Icon d="M3 5h18v12H3ZM8 21h8M12 17v4" className="size-[4.4cqw]" />
          </span>
          <span className="leading-tight">
            <span className="block text-[3cqw] text-[#64748b]">Nothing to install</span>
            <span className="block font-semibold">Any browser</span>
          </span>
        </motion.div>
        <Cursor
          x={step >= 1 ? "62%" : "70%"}
          y={step >= 1 ? "44%" : "62%"}
          press={step === 2}
        />
      </Panel>
    </div>
  );
}

/* ── 2 · Outlook and Apple Mail ────────────────────────────────────── */

function DesktopAppPanel() {
  const { ref, step } = useLoopStep(5, 1300);
  const fields = [
    ["Account type", "IMAP"],
    ["Incoming", "mail.serverlys.com"],
    ["Outgoing", "mail.serverlys.com"],
  ];
  return (
    <div ref={ref}>
      <Panel>
        <div
          className={cn(
            card,
            "left-[12%] top-[12%] w-[100%] rounded-r-none p-[4.4cqw]",
          )}
        >
          <p className="flex items-center gap-[2.4cqw] font-semibold">
            <span className="flex size-[7.5cqw] items-center justify-center rounded-[2cqw] bg-gradient-to-br from-brand-400 to-primary text-white">
              <Icon d="M3 6h18v12H3ZM3 7l9 6 9-6" className="size-[4.2cqw]" />
            </span>
            Add account
          </p>
          <div className="mt-[3.4cqw] space-y-[2cqw] pr-[14cqw]">
            <div className="rounded-[2cqw] px-[3cqw] py-[2.2cqw] shadow-[0_0_0_0.25cqw_var(--color-primary),0_0_0_1.2cqw_rgb(0_0_255/0.08)]">
              <span className="block text-[2.8cqw] text-[#64748b]">Email address</span>
              <span className="font-medium">jordan@brightleaf.co</span>
            </div>
            {fields.map(([k, v], i) => (
              <motion.div
                key={k}
                animate={{ opacity: step > i ? 1 : 0.35 }}
                className="flex items-center justify-between rounded-[2cqw] bg-[#f4f6fa] px-[3cqw] py-[2cqw] text-[3.2cqw]"
              >
                <span className="text-[#64748b]">{k}</span>
                <span className="flex items-center gap-[1.4cqw] font-medium">
                  {v}
                  {step > i && <Check className="size-[3.2cqw] text-success" />}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={cn(
                card,
                "bottom-[8%] left-[6%] flex items-center gap-[2.6cqw] px-[3.6cqw] py-[2.8cqw]",
              )}
            >
              <span className="flex size-[8cqw] items-center justify-center rounded-full bg-success-fill text-white">
                <Check className="size-[4.4cqw]" />
              </span>
              <span className="leading-tight">
                <span className="block text-[3cqw] text-[#64748b]">Folders synced</span>
                <span className="block font-semibold">
                  Inbox 14 · Sent 25 <span className="text-success">✓</span>
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <Cursor
          x="74%"
          y={step < 4 ? `${46 + Math.min(step, 3) * 9}%` : "78%"}
          press={step === 3}
        />
      </Panel>
    </div>
  );
}

/* ── 3 · On your phone ─────────────────────────────────────────────── */

function PhonePanel() {
  const { ref, step } = useLoopStep(3, 1900);
  return (
    <div ref={ref}>
      <Panel>
        <div className="absolute left-1/2 top-[10%] w-[60%] -translate-x-1/2 rounded-[9cqw] bg-[#0d0e12] p-[1.6cqw] shadow-[0_6cqw_10cqw_-4cqw_rgb(0_0_90/0.45)]">
          <div className="relative h-[120cqw] overflow-hidden rounded-[7.6cqw] bg-[linear-gradient(180deg,var(--color-brand-800),var(--color-brand-500)_55%,var(--color-brand-300))]">
            <span className="absolute left-1/2 top-[2.4cqw] h-[4.4cqw] w-[16cqw] -translate-x-1/2 rounded-full bg-black" />
            <p className="mt-[14cqw] text-center text-[3.2cqw] font-medium text-white/80">
              Tuesday, October 6
            </p>
            <p className="text-center text-[15cqw] font-semibold leading-none tracking-[-0.03em] text-white">
              9:41
            </p>
            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  initial={{ y: -30, opacity: 0, scale: 0.92 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="mx-[3cqw] mt-[7cqw] rounded-[4cqw] bg-white/90 p-[3cqw] text-[3cqw] text-[#0f172a]"
                >
                  <p className="flex items-center gap-[1.6cqw] text-[2.6cqw] text-[#64748b]">
                    <span className="flex size-[4cqw] items-center justify-center rounded-[1.2cqw] bg-primary">
                      <Icon
                        d="M3 6h18v12H3ZM3 7l9 6 9-6"
                        className="size-[2.6cqw] text-white"
                      />
                    </span>
                    MAIL <span className="ml-auto">now</span>
                  </p>
                  <div className="mt-[1.6cqw] flex items-center gap-[2cqw]">
                    <Avatar src="/email/avatars/ethan.webp" className="size-[7cqw]" />
                    <span className="min-w-0 leading-tight">
                      <span className="block font-semibold">Alex Rivera</span>
                      <span className="block truncate text-[#475569]">
                        Can we start on Monday?
                      </span>
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <motion.div
          className={cn(
            card,
            "bottom-[8%] left-[6%] flex items-center gap-[2.4cqw] px-[3.4cqw] py-[2.6cqw]",
          )}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Avatar src="/email/avatars/mia.webp" className="size-[9cqw]" />
          <span className="leading-tight">
            <span className="block text-[3cqw] text-[#64748b]">
              Reply sent from iPhone
            </span>
            <span className="flex items-center gap-[1.2cqw] font-semibold">
              jordan@brightleaf.co <Check className="size-[3.2cqw] text-success" />
            </span>
          </span>
        </motion.div>
        <AnimatePresence>
          {step >= 2 && (
            <motion.span
              initial={{ scale: 0.3, opacity: 0.7 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute left-[48%] top-[58%] size-[10cqw] rounded-full bg-white"
            />
          )}
        </AnimatePresence>
      </Panel>
    </div>
  );
}

const CARDS = [
  {
    Panel: WebmailPanel,
    title: "Webmail in your browser",
    body: "Open your inbox from any computer. Nothing to install, nothing to configure.",
  },
  {
    Panel: DesktopAppPanel,
    title: "Outlook and Apple Mail",
    body: "Add your account with IMAP and SMTP, and your folders stay in sync everywhere.",
  },
  {
    Panel: PhonePanel,
    title: "On your phone",
    body: "Read and reply from the mail app on iPhone or Android, the moment a customer writes.",
  },
];

export function AppsCards() {
  return (
    <ul className="mt-14 grid gap-6 text-left md:grid-cols-3">
      {CARDS.map(({ Panel: P, title, body }, i) => (
        <motion.li
          key={title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
          className="rounded-[28px] bg-white p-4 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_0_0_1px_var(--color-brand-100)]"
        >
          <P />
          <div className="px-3 pb-3 pt-6">
            <h3 className="text-h4 font-semibold text-fg">{title}</h3>
            <p className="mt-2 text-body text-fg-secondary">{body}</p>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
