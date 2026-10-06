"use client";

import Image from "next/image";
import { memo, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedAfterMount } from "./use-reduced";

/**
 * "Make the right impression" — an 18-second product film, played like video.
 *
 *  Act 1 · desktop. Jordan's mail app (three panes, real folders, labels,
 *  attachments). A compose sheet rises over it; the cursor addresses Alex from
 *  an autocomplete, the subject and message type out, a PDF attaches, the
 *  branded signature drops in, Send. The sheet flies into "Sent".
 *  Act 2 · phone. The camera pulls back, an iPhone rises into frame, the email
 *  arrives as a lock-screen notification, is tapped and opens — the sender's
 *  own domain verified.
 *
 * Everything is sized in container units (cqw) so the film scales as one
 * picture, like a video, at any width. One clock (motion's useAnimationFrame)
 * drives every frame: deterministic, seamless loop, paused off screen, still
 * finished frame under prefers-reduced-motion. Decorative (aria-hidden).
 */

const DUR = 18000;
const T = {
  sheetIn: 500,
  toClick: 1500,
  toType: [1650, 2600] as const,
  suggest: 2300,
  pick: 2950,
  subjClick: 3350,
  subjType: [3500, 4500] as const,
  bodyType: [4700, 6900] as const,
  attach: 5900,
  sig: 7050,
  sendPress: 7950,
  fly: 8250,
  sentBump: 8800,
  toast: 8850,
  pullBack: 9900,
  phoneIn: 10100,
  notify: 11000,
  tap: 12700,
  open: 12900,
  verified: 14200,
  fadeOut: 17400,
};

const TO = "alex@clientstudio.com";
const SUBJECT = "Following up on our proposal";
const BODY = [
  "Hi Alex,",
  "Thanks for your time yesterday. I've attached the proposal with the timeline and pricing for phase one.",
  "Happy to walk you through it this week.",
];
const BODY_TEXT = BODY.join("\n");

const typed = (text: string, t: number, [a, b]: readonly [number, number]) =>
  t <= a
    ? ""
    : t >= b
      ? text
      : text.slice(0, Math.round(((t - a) / (b - a)) * text.length));

const SPRING = { type: "spring", stiffness: 140, damping: 20 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

type Pt = { x: number; y: number };

export function ImpressionFilm() {
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.3 });
  const reduced = useReducedAfterMount();
  const [t, setT] = useState(0);
  const clock = useRef(0);
  const shown = useRef(0);

  useAnimationFrame((_, delta) => {
    if (!inView || reduced) return;
    // Real elapsed time (capped only for a backgrounded tab), so a slow
    // frame drops frames instead of slowing the film down.
    clock.current = (clock.current + Math.min(delta, 250)) % DUR;
    if (clock.current - shown.current >= 40 || clock.current < shown.current) {
      shown.current = clock.current;
      setT(clock.current);
    }
  });
  const now = reduced ? 15500 : t;

  /* Cursor targets, measured from the real elements. */
  const toRef = useRef<HTMLDivElement>(null);
  const suggestRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLSpanElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const [pts, setPts] = useState<Record<string, Pt>>({});
  const measureKey = `${now >= T.sheetIn + 700}-${now >= T.suggest}`;
  useLayoutEffect(() => {
    const f = stage.current;
    if (!f) return;
    const box = f.getBoundingClientRect();
    const all: Array<[string, React.RefObject<HTMLElement | null>, number, number]> = [
      ["to", toRef, 0.3, 0.55],
      ["suggest", suggestRef, 0.4, 0.5],
      ["subject", subjectRef, 0.35, 0.55],
      ["body", bodyRef, 0.55, 0.45],
      ["send", sendRef, 0.45, 0.55],
      ["sent", sentRef, 0.5, 0.5],
    ];
    const next: Record<string, Pt> = {};
    for (const [k, r, fx, fy] of all) {
      const el = r.current;
      if (!el) continue;
      const b = el.getBoundingClientRect();
      next[k] = {
        x: ((b.left + b.width * fx - box.left) / box.width) * 100,
        y: ((b.top + b.height * fy - box.top) / box.height) * 100,
      };
    }
    setPts((p) => ({ ...p, ...next }));
  }, [measureKey]);

  const act2 = now >= T.pullBack;
  const target: Pt | undefined =
    now < T.toClick - 600
      ? { x: 58, y: 70 }
      : now < T.pick - 250
        ? now < T.suggest + 200
          ? pts.to
          : pts.suggest
        : now < T.bodyType[0] - 100
          ? pts.subject
          : now < T.sendPress - 450
            ? pts.body
            : now < T.fly + 300
              ? pts.send
              : { x: 44, y: 82 };
  const pressing = [T.toClick, T.pick, T.subjClick, T.sendPress].some(
    (m) => now >= m && now < m + 170,
  );
  const fade =
    now < 400
      ? now / 400
      : now > T.fadeOut
        ? Math.max(0, 1 - (now - T.fadeOut) / 600)
        : 1;

  return (
    <div
      ref={stage}
      aria-hidden="true"
      className="@container relative isolate aspect-[16/10] w-full select-none [contain:layout_paint]"
      style={{
        fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div className="absolute inset-0" style={{ opacity: fade }}>
        {/* ── Act 1: the desktop app ─────────────────────────────────── */}
        <motion.div
          className="absolute inset-[2%_6%_6%_6%] origin-[30%_50%]"
          animate={
            act2 ? { scale: 0.86, x: "-11%", y: "2%" } : { scale: 1, x: "0%", y: "0%" }
          }
          transition={{ duration: 1.1, ease: EASE }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 rounded-[1.2cqw] bg-[#030a1f]"
            animate={{ opacity: act2 ? 0.45 : 0 }}
            transition={{ duration: 1.1, ease: EASE }}
          />
          <MailApp
            now={now}
            sentRef={sentRef}
            toRef={toRef}
            suggestRef={suggestRef}
            subjectRef={subjectRef}
            bodyRef={bodyRef}
            sendRef={sendRef}
            sentPt={pts.sent}
          />
        </motion.div>

        {/* ── Act 2: the phone ───────────────────────────────────────── */}
        <AnimatePresence>
          {now >= T.phoneIn && (
            <motion.div
              initial={{ y: "34%", x: "6%", rotate: 6, opacity: 0 }}
              animate={{ y: "0%", x: "0%", rotate: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 70, damping: 16 }}
              className="absolute right-[9%] top-[5%] z-20 w-[25%]"
            >
              <Phone now={now} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verified callout beside the phone */}
        <AnimatePresence>
          {now >= T.verified && (
            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={SPRING}
              className="absolute left-[40%] top-[58%] z-30 rounded-[1.3cqw] bg-[linear-gradient(135deg,rgb(255_255_255/0.7),rgb(255_255_255/0.15))] p-px shadow-[0_2cqw_5cqw_-1.5cqw_rgb(0_0_0/0.6)]"
            >
              <div className="flex items-center gap-[1cqw] rounded-[1.25cqw] bg-[#0b1430]/95 px-[1.4cqw] py-[1cqw]">
                <span className="flex size-[3cqw] items-center justify-center rounded-full bg-success-fill shadow-[0_0_2cqw_rgb(34_197_94/0.6)]">
                  <Check className="size-[1.6cqw] text-white" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[1.35cqw] font-semibold text-white">
                    Delivered and verified
                  </span>
                  <span className="block text-[1.1cqw] text-white/65">
                    Sent from jordan@brightleaf.co
                  </span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cursor (act 1) */}
        {!reduced && !act2 && target && (
          <motion.div
            className="pointer-events-none absolute z-40 w-[1.9cqw]"
            animate={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              scale: pressing ? 0.8 : 1,
              opacity: now > T.fly + 250 ? 0 : 1,
            }}
            transition={{
              left: { type: "spring", stiffness: 60, damping: 15 },
              top: { type: "spring", stiffness: 60, damping: 15 },
              scale: { duration: 0.12 },
              opacity: { duration: 0.3 },
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-full drop-shadow-[0_0.2cqw_0.3cqw_rgb(0_0_0/0.4)]"
            >
              <path
                d="M5 2.5 19 13l-6.2.9 3.7 6.9-2.7 1.4-3.6-7L5 19.5Z"
                fill="#0b0b10"
                stroke="#fff"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            {pressing && (
              <motion.span
                initial={{ scale: 0.2, opacity: 0.6 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute -left-[0.6cqw] -top-[0.6cqw] size-[1.6cqw] rounded-full border-[0.15cqw] border-primary"
              />
            )}
          </motion.div>
        )}
      </div>

      {/* Video timeline */}
      <div className="absolute inset-x-[6%] -bottom-[1.2cqw] h-[0.25cqw] overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-accent-on-dark"
          style={{ width: `${(now / DUR) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* ═══ Desktop mail app ═════════════════════════════════════════════════ */

const FOLDERS = [
  {
    id: "inbox",
    label: "Inbox",
    count: 12,
    d: "M3 13h4l1.5 2h7L17 13h4M3 13l2.5-7h13L21 13v6H3Z",
  },
  {
    id: "star",
    label: "Starred",
    d: "m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7Z",
  },
  { id: "sent", label: "Sent", count: 24, d: "m4 12 16-8-6 16-2.5-6.5Z" },
  { id: "drafts", label: "Drafts", count: 1, d: "M4 20h4L19 9l-4-4L4 16Z" },
  { id: "archive", label: "Archive", d: "M4 7h16v3H4ZM5 10v10h14V10M10 14h4" },
];
const LABELS = [
  { label: "Clients", c: "bg-brand-500" },
  { label: "Projects", c: "bg-accent-on-dark" },
  { label: "Invoices", c: "bg-success-fill" },
];
const LIST = [
  {
    av: "/email/avatars/sara.webp",
    name: "Sara Okafor",
    subject: "Logo files: final versions",
    preview: "Attached in every format you asked for…",
    time: "10:24",
    unread: true,
    clip: true,
    active: true,
  },
  {
    av: "/email/avatars/ethan.webp",
    name: "Alex Rivera",
    subject: "Great meeting yesterday",
    preview: "Could you send over the proposal and…",
    time: "09:41",
    unread: true,
  },
  {
    ini: "MB",
    tone: "bg-brand-900",
    name: "Maya Brooks",
    subject: "Q4 brand refresh moodboards",
    preview: "Three directions for the new look…",
    time: "Yesterday",
  },
  {
    ini: "TK",
    tone: "bg-brand-400",
    name: "Taylor Kim",
    subject: "Re: workshop agenda",
    preview: "Works for me, see you Thursday…",
    time: "Mon",
  },
  {
    ini: "RP",
    tone: "bg-[#475569]",
    name: "Riley Park",
    subject: "Invoice #2291 paid",
    preview: "Payment received, thank you…",
    time: "Mon",
    clip: true,
  },
  {
    ini: "DS",
    tone: "bg-brand-700",
    name: "Daniel Smith",
    subject: "Onboarding documents",
    preview: "Everything you need for day one…",
    time: "Sun",
  },
];

function MailApp(props: {
  now: number;
  sentRef: React.RefObject<HTMLDivElement | null>;
  toRef: React.RefObject<HTMLDivElement | null>;
  suggestRef: React.RefObject<HTMLDivElement | null>;
  subjectRef: React.RefObject<HTMLDivElement | null>;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  sendRef: React.RefObject<HTMLSpanElement | null>;
  sentPt?: Pt;
}) {
  const { now, sentRef } = props;
  const composing = now >= T.sheetIn && now < T.fly + 600;
  const sentCount = now >= T.sentBump ? 25 : 24;

  return (
    <div className="relative h-full overflow-hidden rounded-[1.2cqw] bg-white text-[1.08cqw] text-[#0f172a] shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_4cqw_8cqw_-2cqw_rgb(0_0_40/0.7),0_1cqw_2cqw_-1cqw_rgb(0_0_0/0.5)]">
      {/* Title bar */}
      <div className="flex h-[7.5%] items-center gap-[1.2cqw] border-b border-[#eef0f4] bg-[#fbfbfc] px-[1.4cqw]">
        <span className="flex gap-[0.55cqw]">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              className="size-[0.95cqw] rounded-full shadow-[inset_0_0_0_0.05cqw_rgb(0_0_0/0.12)]"
              style={{ background: c }}
            />
          ))}
        </span>
        <span className="mx-auto flex w-[38%] items-center gap-[0.7cqw] rounded-[0.7cqw] bg-[#f1f3f7] px-[1cqw] py-[0.55cqw] text-[#94a3b8]">
          <Icon
            d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14ZM20 20l-4-4"
            className="size-[1.1cqw]"
          />
          Search mail
          <span className="ml-auto rounded-[0.35cqw] bg-white px-[0.4cqw] text-[0.85cqw] text-[#94a3b8] shadow-[0_0_0_0.05cqw_#e2e8f0]">
            ⌘K
          </span>
        </span>
        <span className="flex items-center gap-[0.6cqw]">
          <Avatar src="/email/avatars/mia.webp" className="size-[2cqw]" />
        </span>
      </div>

      <div className="grid h-[92.5%] grid-cols-[18%_31%_1fr]">
        <Sidebar sentCount={sentCount} sentRef={sentRef} />
        <ListPane />
        <ReadingPane />
      </div>

      {/* Dim behind the sheet */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#0b1430]"
        animate={{ opacity: composing ? 0.07 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <ComposeSheet {...props} />

      {/* Sent toast */}
      <AnimatePresence>
        {now >= T.toast && now < T.pullBack + 600 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={SPRING}
            className="absolute bottom-[4%] left-1/2 flex -translate-x-1/2 items-center gap-[1cqw] rounded-[1cqw] bg-[#0f172a] py-[0.8cqw] pl-[0.9cqw] pr-[1.4cqw] text-white shadow-[0_1.5cqw_3cqw_-1cqw_rgb(0_0_0/0.5)]"
          >
            <span className="flex size-[1.9cqw] items-center justify-center rounded-full bg-success-fill">
              <Check className="size-[1.1cqw]" />
            </span>
            <span className="font-medium">Message sent</span>
            <span className="text-white/45">·</span>
            <span className="font-semibold text-brand-300">Undo</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══ Compose sheet ════════════════════════════════════════════════════ */

function ComposeSheet({
  now,
  toRef,
  suggestRef,
  subjectRef,
  bodyRef,
  sendRef,
  sentPt,
}: {
  now: number;
  toRef: React.RefObject<HTMLDivElement | null>;
  suggestRef: React.RefObject<HTMLDivElement | null>;
  subjectRef: React.RefObject<HTMLDivElement | null>;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  sendRef: React.RefObject<HTMLSpanElement | null>;
  sentPt?: Pt;
}) {
  if (now < T.sheetIn || now > T.fly + 900) return null;
  const to = typed(TO, now, T.toType);
  const picked = now >= T.pick;
  const subject = typed(SUBJECT, now, T.subjType);
  const body = typed(BODY_TEXT, now, T.bodyType);
  const sending = now >= T.sendPress;
  const flying = now >= T.fly;
  const caret = (on: boolean) =>
    on && (
      <span className="ml-[0.1cqw] inline-block h-[1.1em] w-[0.12cqw] translate-y-[0.2em] animate-pulse bg-primary" />
    );
  // Fly toward the Sent folder (sheet centre ≈ 50%/50% of the app).
  const fx = sentPt ? `${(sentPt.x - 50) * 1.2}%` : "-60%";
  const fy = sentPt ? `${(sentPt.y - 52) * 1.2}%` : "-20%";

  return (
    <motion.div
      initial={{ y: "40%", opacity: 0, scale: 0.96 }}
      animate={
        flying
          ? { x: fx, y: fy, scale: 0.06, opacity: 0, rotate: -8 }
          : { x: 0, y: "0%", opacity: 1, scale: 1, rotate: 0 }
      }
      transition={
        flying
          ? { duration: 0.75, ease: [0.6, 0, 0.8, 0.2] }
          : { type: "spring", stiffness: 120, damping: 20 }
      }
      className="absolute left-[23%] top-[12%] flex h-[74%] w-[54%] flex-col overflow-hidden rounded-[1.3cqw] bg-white shadow-[0_0_0_0.06cqw_rgb(15_23_42/0.08),0_3cqw_6cqw_-1.5cqw_rgb(11_20_48/0.45),0_0.8cqw_1.6cqw_-0.6cqw_rgb(11_20_48/0.2)]"
    >
      <div className="flex items-center gap-[1cqw] border-b border-[#f1f3f6] px-[1.6cqw] py-[1cqw]">
        <span className="font-semibold">New message</span>
        <span className="ml-auto flex gap-[0.9cqw] text-[#94a3b8]">
          <Icon d="M5 12h14" className="size-[1.1cqw]" />
          <Icon d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4" className="size-[1.1cqw]" />
          <Icon d="M6 6l12 12M18 6 6 18" className="size-[1.1cqw]" />
        </span>
      </div>

      <div className="px-[1.6cqw]">
        <Field label="From">
          <span className="inline-flex items-center gap-[0.55cqw] rounded-full bg-brand-50 py-[0.25cqw] pl-[0.3cqw] pr-[0.8cqw] font-medium text-primary shadow-[inset_0_0_0_0.06cqw_var(--color-brand-100)]">
            <Avatar src="/email/avatars/mia.webp" className="size-[1.7cqw]" />
            Jordan Miles · jordan@brightleaf.co
            <Icon d="m6 9 6 6 6-6" className="size-[0.9cqw]" />
          </span>
        </Field>
        <div ref={toRef} className="relative">
          <Field label="To">
            {picked ? (
              <motion.span
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                className="inline-flex items-center gap-[0.5cqw] rounded-full bg-[#f1f3f7] py-[0.25cqw] pl-[0.3cqw] pr-[0.9cqw] font-medium"
              >
                <Avatar src="/email/avatars/ethan.webp" className="size-[1.7cqw]" />
                Alex Rivera
              </motion.span>
            ) : (
              <span>
                {to}
                {caret(now >= T.toClick && now < T.pick)}
              </span>
            )}
          </Field>
          <AnimatePresence>
            {now >= T.suggest && !picked && (
              <motion.div
                ref={suggestRef}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
                className="absolute left-[11%] top-[92%] z-10 w-[62%] rounded-[1cqw] bg-white p-[0.5cqw] shadow-[0_0_0_0.06cqw_rgb(15_23_42/0.08),0_1.6cqw_3cqw_-1cqw_rgb(11_20_48/0.4)]"
              >
                <div className="flex items-center gap-[0.8cqw] rounded-[0.7cqw] bg-brand-50 px-[0.8cqw] py-[0.6cqw]">
                  <Avatar src="/email/avatars/ethan.webp" className="size-[2.4cqw]" />
                  <span className="leading-tight">
                    <span className="block font-semibold">Alex Rivera</span>
                    <span className="block text-[0.92cqw] text-[#64748b]">{TO}</span>
                  </span>
                  <span className="ml-auto text-[0.85cqw] font-medium text-primary">
                    ↵
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div ref={subjectRef}>
          <Field label="Subject">
            <span className="font-medium">
              {subject}
              {caret(now >= T.subjClick && now < T.bodyType[0])}
            </span>
          </Field>
        </div>
      </div>

      <div
        ref={bodyRef}
        className="min-h-0 flex-1 overflow-hidden whitespace-pre-line px-[1.6cqw] pt-[1.2cqw] leading-[1.65] text-[#334155]"
      >
        {body}
        {caret(now >= T.bodyType[0] && now < T.sig)}
        <AnimatePresence>
          {now >= T.attach && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={SPRING}
              className="mt-[1cqw] flex w-fit items-center gap-[0.8cqw] rounded-[0.8cqw] py-[0.5cqw] pl-[0.5cqw] pr-[1.2cqw] shadow-[0_0_0_0.06cqw_#e5e8ef,0_0.4cqw_0.8cqw_-0.4cqw_rgb(15_23_42/0.12)]"
            >
              <span className="flex size-[2.3cqw] items-center justify-center rounded-[0.5cqw] bg-gradient-to-br from-[#f97316] to-[#ef4444] text-[0.75cqw] font-bold text-white">
                PDF
              </span>
              <span className="leading-tight">
                <span className="block text-[0.98cqw] font-medium text-[#0f172a]">
                  Proposal_Brightleaf.pdf
                </span>
                <span className="block text-[0.85cqw] text-[#94a3b8]">2.4 MB</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {now >= T.sig && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="mt-[1cqw] flex items-center gap-[0.9cqw] border-t border-dashed border-[#e5e8ef] pt-[0.9cqw]"
            >
              <span className="flex size-[2.8cqw] items-center justify-center rounded-[0.6cqw] bg-gradient-to-br from-brand-400 to-primary text-[1.3cqw] font-bold text-white shadow-[0_0.5cqw_1cqw_-0.5cqw_rgb(0_0_255/0.7)]">
                B
              </span>
              <span className="leading-tight">
                <span className="block font-semibold text-[#0f172a]">Jordan Miles</span>
                <span className="block text-[0.95cqw] text-[#64748b]">
                  Founder, Brightleaf ·{" "}
                  <span className="font-medium text-primary">brightleaf.co</span>
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-[1.1cqw] border-t border-[#f1f3f6] px-[1.6cqw] py-[1cqw] text-[#94a3b8]">
        <motion.span
          ref={sendRef}
          animate={{ scale: now >= T.sendPress && now < T.sendPress + 170 ? 0.92 : 1 }}
          className="inline-flex items-center gap-[0.7cqw] rounded-[0.7cqw] bg-primary px-[1.5cqw] py-[0.7cqw] font-semibold text-white shadow-[0_0.6cqw_1.2cqw_-0.5cqw_rgb(0_0_255/0.7),inset_0_0.06cqw_0_rgb(255_255_255/0.25)]"
        >
          {sending ? (
            <>
              <span className="size-[1cqw] animate-spin rounded-full border-[0.18cqw] border-white/35 border-t-white" />{" "}
              Sending
            </>
          ) : (
            <>
              Send{" "}
              <span className="rounded-[0.3cqw] bg-white/15 px-[0.35cqw] text-[0.82cqw] font-medium">
                ⌘↵
              </span>
            </>
          )}
        </motion.span>
        {[
          "M4 7h16M4 12h10M4 17h7",
          "M8.5 12.5 15 6a3 3 0 1 1 4 4l-8 8a5 5 0 0 1-7-7l7-7",
          "M4 5h16v14H4ZM4 15l5-5 4 4 3-3 4 4",
        ].map((d) => (
          <Icon key={d} d={d} className="size-[1.25cqw]" />
        ))}
        <span className="ml-auto flex items-center gap-[0.45cqw] text-[0.92cqw]">
          <Icon
            d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z"
            className="size-[1.05cqw] text-success"
          />
          Encrypted with TLS
        </span>
      </div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[3.1cqw] items-center gap-[1cqw] border-b border-[#f1f3f6] py-[0.35cqw]">
      <span className="w-[4.6cqw] shrink-0 text-[#94a3b8]">{label}</span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </div>
  );
}

/* ═══ Phone ════════════════════════════════════════════════════════════ */

function Phone({ now }: { now: number }) {
  const notified = now >= T.notify;
  const opened = now >= T.open;
  const tapping = now >= T.tap && now < T.tap + 260;

  return (
    <div className="relative aspect-[9/19.4] rounded-[4.2cqw] bg-[linear-gradient(145deg,#2a2d35,#0d0e12_40%,#24262d)] p-[0.55cqw] shadow-[0_0_0_0.12cqw_#3a3d46,0_4cqw_8cqw_-2cqw_rgb(0_0_0/0.75),inset_0_0_0_0.1cqw_rgb(255_255_255/0.08)]">
      {/* Side buttons */}
      <span className="absolute -left-[0.25cqw] top-[18%] h-[6%] w-[0.25cqw] rounded-l bg-[#2b2e36]" />
      <span className="absolute -right-[0.25cqw] top-[24%] h-[10%] w-[0.25cqw] rounded-r bg-[#2b2e36]" />
      <div className="relative h-full overflow-hidden rounded-[3.7cqw] bg-black">
        {/* Wallpaper */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_55%_at_20%_15%,var(--color-brand-400),transparent_70%),radial-gradient(70%_50%_at_90%_80%,var(--color-accent-on-dark),transparent_70%),radial-gradient(100%_80%_at_50%_100%,var(--color-brand-800),transparent),linear-gradient(180deg,var(--color-brand-900),#020617)]" />
        {/* Status bar + Dynamic Island */}
        <div className="relative z-10 flex items-center justify-between px-[1.6cqw] pt-[1cqw] text-[0.95cqw] font-semibold text-white">
          <span>9:41</span>
          <span className="absolute left-1/2 top-[0.7cqw] h-[1.8cqw] w-[6.6cqw] -translate-x-1/2 rounded-full bg-black" />
          <span className="flex items-center gap-[0.35cqw]">
            <span className="flex items-end gap-[0.1cqw]">
              {[0.4, 0.6, 0.8, 1].map((h) => (
                <span
                  key={h}
                  className="w-[0.22cqw] rounded-[0.05cqw] bg-white"
                  style={{ height: `${h * 0.9}cqw` }}
                />
              ))}
            </span>
            <span className="h-[0.9cqw] w-[1.7cqw] rounded-[0.3cqw] border-[0.1cqw] border-white/80 p-[0.1cqw]">
              <span className="block h-full w-[80%] rounded-[0.15cqw] bg-white" />
            </span>
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {!opened ? (
            <motion.div
              key="lock"
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <p className="mt-[16%] text-center text-[1.05cqw] font-medium text-white/85">
                Tuesday, October 6
              </p>
              <p className="text-center text-[6.4cqw] font-semibold leading-none tracking-[-0.03em] text-white">
                9:41
              </p>
              <AnimatePresence>
                {notified && (
                  <motion.div
                    initial={{ y: "-60%", opacity: 0, scale: 0.92 }}
                    animate={{
                      y: "0%",
                      opacity: 1,
                      scale: tapping ? 0.96 : 1,
                      x: [0, -4, 4, -2, 0],
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      x: { duration: 0.45, delay: 0.35 },
                    }}
                    className="absolute inset-x-[5%] top-[38%] rounded-[1.6cqw] bg-white/[0.88] p-[1cqw] shadow-[0_1cqw_2cqw_-1cqw_rgb(0_0_0/0.5)]"
                  >
                    <div className="flex items-center gap-[0.6cqw] text-[0.8cqw] text-[#0f172a]/60">
                      <span className="flex size-[1.6cqw] items-center justify-center rounded-[0.45cqw] bg-gradient-to-b from-brand-400 to-primary">
                        <Icon
                          d="M3 6h18v12H3ZM3 7l9 6 9-6"
                          className="size-[1cqw] text-white"
                        />
                      </span>
                      <span className="font-semibold uppercase tracking-[0.04em]">
                        Mail
                      </span>
                      <span className="ml-auto">now</span>
                    </div>
                    <p className="mt-[0.6cqw] text-[1cqw] font-semibold text-[#0f172a]">
                      Jordan Miles
                    </p>
                    <p className="truncate text-[0.95cqw] font-medium text-[#0f172a]">
                      {SUBJECT}
                    </p>
                    <p className="line-clamp-2 text-[0.9cqw] leading-snug text-[#0f172a]/65">
                      {BODY[1]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {tapping && (
                <motion.span
                  initial={{ scale: 0.3, opacity: 0.7 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute left-[46%] top-[47%] size-[3cqw] rounded-full bg-white/80"
                />
              )}
              <span className="absolute bottom-[1.2cqw] left-1/2 h-[0.35cqw] w-[7cqw] -translate-x-1/2 rounded-full bg-white/80" />
            </motion.div>
          ) : (
            <motion.div
              key="mail"
              initial={{ opacity: 0, y: "6%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-0 bg-white pt-[3.6cqw] text-[#0f172a]"
            >
              <div className="flex items-center justify-between px-[1.3cqw] text-[0.95cqw] font-medium text-primary">
                <span>‹ Inbox</span>
                <span className="flex gap-[0.8cqw] text-[#94a3b8]">
                  <Icon d="M4 7h16v3H4ZM5 10v10h14V10" className="size-[1.1cqw]" />
                  <Icon
                    d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13"
                    className="size-[1.1cqw]"
                  />
                </span>
              </div>
              <p className="mt-[1cqw] px-[1.3cqw] text-[1.3cqw] font-semibold leading-tight tracking-[-0.01em]">
                {SUBJECT}
              </p>
              <div className="mt-[1cqw] flex items-center gap-[0.7cqw] px-[1.3cqw]">
                <Avatar src="/email/avatars/mia.webp" className="size-[2.4cqw]" />
                <span className="min-w-0 leading-tight">
                  <span className="flex items-center gap-[0.35cqw] text-[0.98cqw] font-semibold">
                    Jordan Miles
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: now >= T.verified - 300 ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
                      className="flex size-[1.1cqw] items-center justify-center rounded-full bg-primary"
                    >
                      <Check className="size-[0.7cqw] text-white" />
                    </motion.span>
                  </span>
                  <span className="block truncate text-[0.85cqw] text-[#64748b]">
                    jordan@brightleaf.co
                  </span>
                </span>
              </div>
              <div className="mt-[1.1cqw] space-y-[0.6cqw] px-[1.3cqw] text-[0.92cqw] leading-[1.55] text-[#334155]">
                {BODY.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="mx-[1.3cqw] mt-[1cqw] flex items-center gap-[0.6cqw] rounded-[0.8cqw] p-[0.5cqw] shadow-[0_0_0_0.06cqw_#e5e8ef]">
                <span className="flex size-[2cqw] items-center justify-center rounded-[0.45cqw] bg-gradient-to-br from-[#f97316] to-[#ef4444] text-[0.65cqw] font-bold text-white">
                  PDF
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block truncate text-[0.85cqw] font-medium">
                    Proposal_Brightleaf.pdf
                  </span>
                  <span className="block text-[0.75cqw] text-[#94a3b8]">2.4 MB</span>
                </span>
              </div>
              <div className="mx-[1.3cqw] mt-[1cqw] flex items-center gap-[0.6cqw] border-t border-[#f1f3f6] pt-[0.8cqw]">
                <span className="flex size-[2cqw] items-center justify-center rounded-[0.45cqw] bg-gradient-to-br from-brand-400 to-primary text-[0.95cqw] font-bold text-white">
                  B
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.88cqw] font-semibold">
                    Jordan Miles
                  </span>
                  <span className="block text-[0.78cqw] text-primary">
                    brightleaf.co
                  </span>
                </span>
              </div>
              <div className="absolute inset-x-[1.3cqw] bottom-[2.6cqw] flex items-center gap-[0.6cqw] rounded-full bg-[#f1f3f7] py-[0.45cqw] pl-[1cqw] pr-[0.45cqw] text-[0.85cqw] text-[#94a3b8]">
                Reply to Jordan…
                <span className="ml-auto flex size-[1.9cqw] items-center justify-center rounded-full bg-primary text-white">
                  <Icon d="M12 19V5M5 12l7-7 7 7" className="size-[1cqw]" />
                </span>
              </div>
              <span className="absolute bottom-[1.2cqw] left-1/2 h-[0.35cqw] w-[7cqw] -translate-x-1/2 rounded-full bg-[#0f172a]/80" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Glass reflection */}
        <span className="pointer-events-none absolute inset-0 z-20 rounded-[3.7cqw] bg-[linear-gradient(115deg,rgb(255_255_255/0.12),transparent_35%)]" />
      </div>
    </div>
  );
}

/* ═══ Primitives ══════════════════════════════════════════════════════ */

function Avatar({ src, className }: { src: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-[#e5e7eb] shadow-[0_0_0_0.08cqw_rgb(255_255_255),0_0.15cqw_0.4cqw_rgb(15_23_42/0.15)]",
        className,
      )}
    >
      <Image src={src} alt="" fill sizes="64px" className="object-cover" />
    </span>
  );
}

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

/* The panes behind the sheet never change frame to frame, so they are
   memoised: each clock tick re-renders only what actually moves. */

const Sidebar = memo(function Sidebar({
  sentCount,
  sentRef,
}: {
  sentCount: number;
  sentRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col gap-[0.25cqw] border-r border-[#eef0f4] bg-[#f8f9fb] p-[1cqw]">
      <div className="mb-[0.8cqw] flex items-center gap-[0.7cqw] rounded-[0.7cqw] p-[0.4cqw]">
        <span className="flex size-[2.1cqw] items-center justify-center rounded-[0.6cqw] bg-gradient-to-br from-brand-400 to-primary text-[1cqw] font-bold text-white">
          B
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-semibold">Brightleaf</span>
          <span className="block truncate text-[0.88cqw] text-[#64748b]">
            jordan@brightleaf.co
          </span>
        </span>
      </div>
      <span className="mb-[0.6cqw] flex items-center justify-center gap-[0.5cqw] rounded-[0.7cqw] bg-primary py-[0.7cqw] font-semibold text-white shadow-[0_0.6cqw_1.2cqw_-0.6cqw_rgb(0_0_255/0.7)]">
        <Icon d="M12 5v14M5 12h14" className="size-[1.1cqw]" /> New message
      </span>
      {FOLDERS.map((f) => {
        const active = f.id === "inbox";
        return (
          <div
            key={f.id}
            ref={f.id === "sent" ? sentRef : undefined}
            className={cn(
              "flex items-center gap-[0.7cqw] rounded-[0.6cqw] px-[0.7cqw] py-[0.55cqw]",
              active
                ? "bg-white font-semibold text-primary shadow-[0_0_0_0.05cqw_#e5e8ef,0_0.2cqw_0.5cqw_-0.2cqw_rgb(15_23_42/0.12)]"
                : "text-[#475569]",
            )}
          >
            <Icon d={f.d} className="size-[1.15cqw]" />
            <span className="flex-1">{f.label}</span>
            {f.id === "sent" ? (
              <motion.span
                key={sentCount}
                initial={{ scale: 1.6, color: "#0000ff" }}
                animate={{ scale: 1, color: "#94a3b8" }}
                transition={{ duration: 0.6 }}
                className="text-[0.9cqw] tabular-nums"
              >
                {sentCount}
              </motion.span>
            ) : (
              f.count && (
                <span
                  className={cn(
                    "text-[0.9cqw] tabular-nums",
                    active ? "text-primary" : "text-[#94a3b8]",
                  )}
                >
                  {f.count}
                </span>
              )
            )}
          </div>
        );
      })}
      <p className="mt-[1cqw] px-[0.7cqw] text-[0.8cqw] font-semibold uppercase tracking-[0.12em] text-[#94a3b8]">
        Labels
      </p>
      {LABELS.map((l) => (
        <div
          key={l.label}
          className="flex items-center gap-[0.7cqw] px-[0.7cqw] py-[0.45cqw] text-[#475569]"
        >
          <span className={cn("size-[0.8cqw] rounded-[0.25cqw]", l.c)} />
          {l.label}
        </div>
      ))}
      <div className="mt-auto rounded-[0.8cqw] bg-white p-[0.9cqw] shadow-[0_0_0_0.05cqw_#e5e8ef]">
        <div className="flex justify-between text-[0.85cqw] text-[#64748b]">
          <span>Storage</span>
          <span className="tabular-nums">18.4 of 45 GB</span>
        </div>
        <div className="mt-[0.5cqw] h-[0.45cqw] overflow-hidden rounded-full bg-[#eef1f6]">
          <div className="h-full w-[41%] rounded-full bg-gradient-to-r from-brand-400 to-primary" />
        </div>
      </div>
    </div>
  );
});

const ListPane = memo(function ListPane() {
  return (
    <div className="flex min-w-0 flex-col border-r border-[#eef0f4]">
      <div className="flex items-center justify-between px-[1.3cqw] pb-[0.6cqw] pt-[1.1cqw]">
        <span className="text-[1.45cqw] font-semibold tracking-[-0.01em]">Inbox</span>
        <span className="flex rounded-[0.6cqw] bg-[#f1f3f7] p-[0.25cqw] text-[0.88cqw] font-medium">
          <span className="rounded-[0.45cqw] bg-white px-[0.7cqw] py-[0.2cqw] shadow-[0_0.1cqw_0.3cqw_rgb(15_23_42/0.1)]">
            All
          </span>
          <span className="px-[0.7cqw] py-[0.2cqw] text-[#64748b]">Unread</span>
        </span>
      </div>
      {LIST.map((m) => (
        <div
          key={m.name}
          className={cn(
            "relative mx-[0.6cqw] mb-[0.2cqw] rounded-[0.8cqw] px-[0.8cqw] py-[0.75cqw]",
            m.active && "bg-brand-50 shadow-[0_0_0_0.06cqw_var(--color-brand-100)]",
          )}
        >
          <div className="flex items-start gap-[0.8cqw]">
            {m.av ? (
              <Avatar src={m.av} className="size-[2.5cqw]" />
            ) : (
              <span
                className={cn(
                  "flex size-[2.5cqw] shrink-0 items-center justify-center rounded-full text-[0.9cqw] font-semibold text-white",
                  m.tone,
                )}
              >
                {m.ini}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-[0.5cqw]">
                <span
                  className={cn(
                    "truncate",
                    m.unread ? "font-semibold" : "text-[#334155]",
                  )}
                >
                  {m.name}
                </span>
                <span className="shrink-0 text-[0.85cqw] text-[#94a3b8] tabular-nums">
                  {m.time}
                </span>
              </span>
              <span
                className={cn(
                  "flex items-center gap-[0.4cqw] truncate",
                  m.unread ? "font-medium text-[#0f172a]" : "text-[#475569]",
                )}
              >
                {m.subject}
                {m.clip && (
                  <Icon
                    d="M8.5 12.5 15 6a3 3 0 1 1 4 4l-8 8a5 5 0 0 1-7-7l7-7"
                    className="size-[0.95cqw] shrink-0 text-[#94a3b8]"
                  />
                )}
              </span>
              <span className="block truncate text-[0.95cqw] text-[#94a3b8]">
                {m.preview}
              </span>
            </span>
            {m.unread && (
              <span className="mt-[0.5cqw] size-[0.6cqw] shrink-0 rounded-full bg-primary" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

const ReadingPane = memo(function ReadingPane() {
  return (
    <div className="min-w-0 p-[1.8cqw]">
      <div className="flex items-center gap-[0.6cqw] text-[#94a3b8]">
        {[
          "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-1",
          "M4 7h16v3H4ZM5 10v10h14V10",
          "M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13",
        ].map((d) => (
          <span
            key={d}
            className="flex size-[2.2cqw] items-center justify-center rounded-[0.5cqw] bg-[#f6f7f9]"
          >
            <Icon d={d} className="size-[1.1cqw]" />
          </span>
        ))}
        <span className="ml-auto rounded-full bg-brand-50 px-[0.8cqw] py-[0.2cqw] text-[0.85cqw] font-medium text-primary">
          Clients
        </span>
      </div>
      <p className="mt-[1.4cqw] text-[1.7cqw] font-semibold leading-tight tracking-[-0.015em]">
        Logo files: final versions
      </p>
      <div className="mt-[1.2cqw] flex items-center gap-[0.9cqw]">
        <Avatar src="/email/avatars/sara.webp" className="size-[3cqw]" />
        <span className="leading-tight">
          <span className="block font-semibold">Sara Okafor</span>
          <span className="block text-[0.95cqw] text-[#64748b]">
            sara@creativehub.co · to me
          </span>
        </span>
        <span className="ml-auto text-[0.9cqw] text-[#94a3b8]">10:24 AM</span>
      </div>
      <div className="mt-[1.4cqw] space-y-[0.8cqw] leading-[1.6] text-[#334155]">
        <p>Hi Jordan,</p>
        <p>
          The final logo files are ready in every format you asked for, optimised for
          web and print.
        </p>
        <p>Let me know if anything needs a tweak.</p>
      </div>
      <div className="mt-[1.4cqw] grid grid-cols-2 gap-[0.8cqw]">
        {[
          { n: "Brightleaf_logo.svg", s: "84 KB", c: "from-brand-400 to-primary" },
          { n: "Brand_guide.pdf", s: "2.1 MB", c: "from-[#f97316] to-[#ef4444]" },
        ].map((a) => (
          <div
            key={a.n}
            className="flex items-center gap-[0.7cqw] rounded-[0.8cqw] p-[0.6cqw] shadow-[0_0_0_0.06cqw_#e5e8ef]"
          >
            <span
              className={cn(
                "flex size-[2.4cqw] items-center justify-center rounded-[0.5cqw] bg-gradient-to-br text-[0.75cqw] font-bold text-white",
                a.c,
              )}
            >
              {a.n.split(".")[1].toUpperCase()}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[0.95cqw] font-medium">{a.n}</span>
              <span className="block text-[0.85cqw] text-[#94a3b8]">{a.s}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
