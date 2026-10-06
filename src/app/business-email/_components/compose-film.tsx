"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useInView } from "motion/react";
import { useReducedAfterMount } from "./use-reduced";
import { cn } from "@/lib/utils";

/**
 * A looping product film, played like a video: a real-looking mail app where
 * the cursor addresses a message, the subject and body type out, the
 * branded signature drops in, Send is pressed — and the email lands in the
 * client's inbox, opened, with the sender's own domain verified.
 *
 * One clock drives every frame (motion's useAnimationFrame), so the film is
 * deterministic, loops seamlessly, pauses while off screen, and shows a
 * video-style progress bar. Under prefers-reduced-motion it renders a single
 * finished frame. Decorative (aria-hidden); the section copy carries meaning.
 */

const DUR = 15000;

const TO = "alex@clientstudio.com";
const SUBJECT = "Following up on our proposal";
const BODY = [
  "Hi Alex,",
  "Thanks for your time yesterday. I've attached the proposal with the timeline and pricing for phase one.",
  "Happy to walk you through it this week.",
];
const BODY_TEXT = BODY.join("\n");

/* Timeline (ms). */
const T = {
  toClick: 1300,
  toType: [1500, 2600] as const,
  suggest: 2350,
  pick: 2900,
  subjClick: 3350,
  subjType: [3500, 4700] as const,
  bodyType: [4950, 7350] as const,
  sig: 7500,
  sendHover: 8250,
  sendPress: 8500,
  sendOut: 8950,
  inbox: 9150,
  arrive: 9950,
  openClick: 10850,
  open: 11050,
  delivered: 11700,
  fadeOut: 14550,
};

const typed = (text: string, t: number, [a, b]: readonly [number, number]) =>
  t <= a
    ? ""
    : t >= b
      ? text
      : text.slice(0, Math.round(((t - a) / (b - a)) * text.length));

type Pt = { x: number; y: number };

export function ComposeFilm({ className }: { className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { amount: 0.35 });
  const reduced = useReducedAfterMount();
  const [t, setT] = useState(0);
  const clock = useRef(0);
  const shown = useRef(0);

  useAnimationFrame((_, delta) => {
    if (!inView || reduced) return;
    clock.current = (clock.current + Math.min(delta, 50)) % DUR;
    // ~30 fps of React state is plenty; motion animates the in-betweens.
    if (clock.current - shown.current >= 33 || clock.current < shown.current) {
      shown.current = clock.current;
      setT(clock.current);
    }
  });

  const now = reduced ? 8000 : t;
  const scene = now < T.inbox ? "compose" : "inbox";

  /* Cursor targets, measured from the real elements. */
  const toRef = useRef<HTMLDivElement>(null);
  const suggestRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLSpanElement>(null);
  const newMailRef = useRef<HTMLDivElement>(null);
  const [pts, setPts] = useState<Record<string, Pt>>({});
  useLayoutEffect(() => {
    const f = frame.current;
    if (!f) return;
    const box = f.getBoundingClientRect();
    const next: Record<string, Pt> = {};
    const all: Array<[string, React.RefObject<HTMLElement | null>]> = [
      ["to", toRef],
      ["suggest", suggestRef],
      ["subject", subjectRef],
      ["body", bodyRef],
      ["send", sendRef],
      ["newMail", newMailRef],
    ];
    for (const [k, r] of all) {
      const el = r.current;
      if (!el) continue;
      const b = el.getBoundingClientRect();
      next[k] = {
        x: ((b.left + b.width * 0.35 - box.left) / box.width) * 100,
        y: ((b.top + b.height * 0.6 - box.top) / box.height) * 100,
      };
    }
    setPts((p) => ({ ...p, ...next }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, now >= T.suggest, now >= T.arrive]);

  const target: Pt | undefined =
    now < T.toClick
      ? pts.to
      : now < T.pick - 250
        ? now < T.suggest + 150
          ? pts.to
          : pts.suggest
        : now < T.subjClick
          ? pts.subject
          : now < T.bodyType[0]
            ? pts.subject
            : now < T.sendHover - 400
              ? pts.body
              : now < T.inbox
                ? pts.send
                : now < T.openClick - 500
                  ? { x: 62, y: 62 }
                  : pts.newMail;
  const pressing = [T.toClick, T.pick, T.subjClick, T.sendPress, T.openClick].some(
    (m) => now >= m && now < m + 160,
  );

  const fade =
    now < 450
      ? now / 450
      : now > T.fadeOut
        ? Math.max(0, 1 - (now - T.fadeOut) / 450)
        : 1;

  return (
    <div
      ref={frame}
      aria-hidden="true"
      className={cn(
        "relative aspect-[16/10] w-full select-none overflow-hidden rounded-[22px] bg-[linear-gradient(140deg,var(--color-brand-100),var(--color-brand-50)_45%,#fff)] font-sans text-[#111827] shadow-[0_50px_100px_-30px_rgb(0_0_255/0.55),0_0_0_1px_rgb(255_255_255/0.12)]",
        className,
      )}
    >
      <div
        className="absolute inset-0 transition-opacity duration-150"
        style={{ opacity: fade }}
      >
        <AnimatePresence>
          {scene === "compose" ? (
            <ComposeScene
              key="c"
              now={now}
              toRef={toRef}
              suggestRef={suggestRef}
              subjectRef={subjectRef}
              bodyRef={bodyRef}
              sendRef={sendRef}
            />
          ) : (
            <InboxScene key="i" now={now} newRef={newMailRef} />
          )}
        </AnimatePresence>
      </div>

      {/* Cursor */}
      {!reduced && target && (
        <motion.div
          className="pointer-events-none absolute z-30 size-[clamp(14px,1.9vw,24px)]"
          animate={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            scale: pressing ? 0.82 : 1,
            opacity: now > T.sendOut - 50 && now < T.arrive + 300 ? 0 : fade,
          }}
          transition={{
            left: { type: "spring", stiffness: 70, damping: 16 },
            top: { type: "spring", stiffness: 70, damping: 16 },
            scale: { duration: 0.12 },
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-full drop-shadow-[0_2px_3px_rgb(0_0_0/0.35)]"
          >
            <path
              d="M5 2.5 19 13l-6.2.9 3.7 6.9-2.7 1.4-3.6-7L5 19.5Z"
              fill="#111"
              stroke="#fff"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      {/* Video-style progress */}
      <div className="absolute inset-x-0 bottom-0 z-40 h-[3px] bg-black/10">
        <div className="h-full bg-primary" style={{ width: `${(now / DUR) * 100}%` }} />
      </div>
    </div>
  );
}

/* ── Scene 1: composing ─────────────────────────────────────────────── */

function ComposeScene({
  now,
  toRef,
  suggestRef,
  subjectRef,
  bodyRef,
  sendRef,
}: {
  now: number;
  toRef: React.RefObject<HTMLDivElement | null>;
  suggestRef: React.RefObject<HTMLDivElement | null>;
  subjectRef: React.RefObject<HTMLDivElement | null>;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  sendRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const to = typed(TO, now, T.toType);
  const picked = now >= T.pick;
  const subject = typed(SUBJECT, now, T.subjType);
  const body = typed(BODY_TEXT, now, T.bodyType);
  const caret = (on: boolean) =>
    on && (
      <span className="ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[0.18em] animate-pulse bg-primary" />
    );
  const sending = now >= T.sendPress;
  const leaving = now >= T.sendOut;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={
        leaving
          ? { opacity: 0, y: -70, x: 90, scale: 0.86, rotate: -2, filter: "blur(6px)" }
          : { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0, filter: "blur(0px)" }
      }
      transition={
        leaving
          ? { duration: 0.5, ease: [0.55, 0, 0.75, 0.1] }
          : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
      }
      className="absolute inset-[5%] flex flex-col overflow-hidden rounded-[14px] bg-white text-[clamp(9px,1.12vw,14.5px)] shadow-[0_30px_70px_-25px_rgb(15_23_42/0.45),0_0_0_1px_rgb(15_23_42/0.06)]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-[0.8em] border-b border-[#eef0f4] bg-[#f7f8fa] px-[1.4em] py-[0.8em]">
        <span className="flex gap-[0.45em]">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              className="size-[0.85em] rounded-full"
              style={{ background: c }}
            />
          ))}
        </span>
        <span className="mx-auto font-semibold text-[#374151]">New Message</span>
        <span className="w-[3.5em]" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-[1.6em] pt-[0.4em]">
        {/* From */}
        <Row label="From">
          <span className="inline-flex items-center gap-[0.5em] rounded-full bg-brand-50 py-[0.2em] pl-[0.25em] pr-[0.7em] font-medium text-primary">
            <Avatar src="/email/avatars/mia.webp" className="size-[1.6em]" />
            Jordan Miles &lt;jordan@brightleaf.co&gt;
          </span>
        </Row>

        {/* To */}
        <div ref={toRef} className="relative">
          <Row label="To">
            {picked ? (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className="inline-flex items-center gap-[0.45em] rounded-full bg-[#f1f3f6] py-[0.2em] pl-[0.25em] pr-[0.7em] font-medium"
              >
                <Avatar src="/email/avatars/ethan.webp" className="size-[1.6em]" />
                Alex Rivera
              </motion.span>
            ) : (
              <span className="text-[#111827]">
                {to}
                {caret(now >= T.toClick && now < T.pick)}
              </span>
            )}
          </Row>
          <AnimatePresence>
            {now >= T.suggest && !picked && (
              <motion.div
                ref={suggestRef}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="absolute left-[4.6em] top-[88%] z-10 flex w-[52%] items-center gap-[0.7em] rounded-[0.7em] bg-white px-[0.8em] py-[0.6em] shadow-[0_18px_40px_-12px_rgb(15_23_42/0.35),0_0_0_1px_rgb(15_23_42/0.06)]"
              >
                <Avatar src="/email/avatars/ethan.webp" className="size-[2.3em]" />
                <span className="leading-tight">
                  <span className="block font-semibold">Alex Rivera</span>
                  <span className="block text-[#6b7280]">{TO}</span>
                </span>
                <span className="ml-auto rounded-full bg-brand-50 px-[0.6em] py-[0.1em] text-[0.85em] font-medium text-primary">
                  Recent
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Subject */}
        <div ref={subjectRef}>
          <Row label="Subject">
            <span className="font-medium">
              {subject}
              {caret(now >= T.subjClick && now < T.bodyType[0])}
            </span>
          </Row>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          className="min-h-0 flex-1 overflow-hidden whitespace-pre-line pt-[0.8em] leading-[1.55] text-[#374151] [&>*]:shrink-0"
        >
          {body}
          {caret(now >= T.bodyType[0] && now < T.sig)}
          <AnimatePresence>
            {now >= T.sig && (
              <motion.div
                initial={{ opacity: 0, y: 14, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                className="mt-[0.7em] flex items-center gap-[0.8em] border-t border-[#f0f1f4] pt-[0.7em]"
              >
                <span className="flex size-[2.4em] shrink-0 items-center justify-center rounded-[0.55em] bg-gradient-to-br from-brand-400 to-primary text-[1.2em] font-bold text-white">
                  B
                </span>
                <span className="leading-tight">
                  <span className="block font-semibold text-[#111827]">
                    Jordan Miles
                  </span>
                  <span className="block text-[#6b7280]">Founder, Brightleaf</span>
                  <span className="block font-medium text-primary">brightleaf.co</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toolbar */}
        <div className="mt-auto flex items-center gap-[1.1em] border-t border-[#f0f1f4] py-[0.9em] text-[#6b7280]">
          <motion.span
            ref={sendRef}
            animate={{
              scale: now >= T.sendPress && now < T.sendPress + 160 ? 0.93 : 1,
              boxShadow:
                now >= T.sendHover && !sending
                  ? "0 0 0 4px rgb(0 0 255 / 0.18)"
                  : "0 0 0 0px rgb(0 0 255 / 0)",
            }}
            className="inline-flex items-center gap-[0.5em] rounded-[0.6em] bg-primary px-[1.3em] py-[0.55em] font-semibold text-white"
          >
            {sending ? (
              <>
                <span className="size-[1em] animate-spin rounded-full border-2 border-white/35 border-t-white" />{" "}
                Sending
              </>
            ) : (
              <>
                Send
                <svg viewBox="0 0 24 24" className="size-[1.05em]" fill="currentColor">
                  <path d="m3 11 18-8-6 18-3-7Z" />
                </svg>
              </>
            )}
          </motion.span>
          {[
            "M4 7h16M4 12h10M4 17h7",
            "M8.5 12.5 15 6a3 3 0 1 1 4 4l-8 8a5 5 0 0 1-7-7l7-7",
            "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18ZM9 10h.01M15 10h.01M9 15a4 4 0 0 0 6 0",
          ].map((d) => (
            <svg
              key={d}
              viewBox="0 0 24 24"
              className="size-[1.25em]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={d} />
            </svg>
          ))}
          <span className="ml-auto flex items-center gap-[0.4em] text-[0.9em]">
            <svg
              viewBox="0 0 24 24"
              className="size-[1.1em] text-success"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z" />
            </svg>
            Encrypted · TLS
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[2.7em] items-center gap-[1em] border-b border-[#f0f1f4] py-[0.35em]">
      <span className="w-[3.6em] shrink-0 text-[#9aa1ad]">{label}</span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </div>
  );
}

function Avatar({ src, className }: { src: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-[#e5e7eb]",
        className,
      )}
    >
      <Image src={src} alt="" fill sizes="48px" className="object-cover" />
    </span>
  );
}

/* ── Scene 2: it lands in the client's inbox ────────────────────────── */

const OTHERS = [
  {
    initials: "MB",
    tone: "bg-brand-900",
    name: "Maya Brooks",
    subject: "Q4 brand refresh — moodboards",
    time: "9:12 AM",
  },
  {
    avatar: "/email/avatars/sara.webp",
    name: "Sara Okafor",
    subject: "Logo files: final versions",
    time: "Yesterday",
  },
  {
    initials: "TK",
    tone: "bg-brand-400",
    name: "Taylor Kim",
    subject: "Re: workshop agenda",
    time: "Mon",
  },
  {
    initials: "RP",
    tone: "bg-[#64748b]",
    name: "Riley Park",
    subject: "Invoice #2291",
    time: "Mon",
  },
];

function InboxScene({
  now,
  newRef,
}: {
  now: number;
  newRef: React.RefObject<HTMLDivElement | null>;
}) {
  const arrived = now >= T.arrive;
  const opened = now >= T.open;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-[5%] flex flex-col overflow-hidden rounded-[14px] bg-white text-[clamp(8.5px,1.05vw,13.5px)] shadow-[0_30px_70px_-25px_rgb(15_23_42/0.45),0_0_0_1px_rgb(15_23_42/0.06)]"
    >
      <div className="flex items-center gap-[0.8em] border-b border-[#eef0f4] bg-[#f7f8fa] px-[1.4em] py-[0.8em]">
        <span className="flex gap-[0.45em]">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              className="size-[0.85em] rounded-full"
              style={{ background: c }}
            />
          ))}
        </span>
        <span className="mx-auto font-semibold text-[#374151]">
          Inbox — alex@clientstudio.com
        </span>
        <span className="w-[3.5em]" />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[42%_1fr]">
        {/* List */}
        <div className="overflow-hidden border-r border-[#eef0f4]">
          <div className="flex items-center justify-between px-[1.2em] py-[0.8em]">
            <span className="font-semibold">Inbox</span>
            <span className="rounded-full bg-primary px-[0.6em] text-[0.85em] font-semibold text-white">
              {arrived ? 3 : 2}
            </span>
          </div>
          <AnimatePresence initial={false}>
            {arrived && (
              <motion.div
                ref={newRef}
                layout
                initial={{ opacity: 0, height: 0, x: -24 }}
                animate={{ opacity: 1, height: "auto", x: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                className={cn(
                  "border-t border-[#f2f3f6] px-[1.2em] py-[0.8em]",
                  opened
                    ? "bg-brand-50 shadow-[inset_3px_0_0_var(--color-primary)]"
                    : "bg-brand-50/60",
                )}
              >
                <div className="flex items-center gap-[0.7em]">
                  <Avatar src="/email/avatars/mia.webp" className="size-[2.4em]" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold">Jordan Miles</span>
                      <span className="shrink-0 text-[0.85em] font-medium text-primary">
                        now
                      </span>
                    </span>
                    <span className="block truncate font-medium">{SUBJECT}</span>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {OTHERS.map((m) => (
            <motion.div
              layout
              key={m.name}
              className="border-t border-[#f2f3f6] px-[1.2em] py-[0.8em]"
            >
              <div className="flex items-center gap-[0.7em]">
                {m.avatar ? (
                  <Avatar src={m.avatar} className="size-[2.4em]" />
                ) : (
                  <span
                    className={cn(
                      "flex size-[2.4em] shrink-0 items-center justify-center rounded-full text-[0.9em] font-semibold text-white",
                      m.tone,
                    )}
                  >
                    {m.initials}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[#374151]">{m.name}</span>
                    <span className="shrink-0 text-[0.85em] text-[#9aa1ad]">
                      {m.time}
                    </span>
                  </span>
                  <span className="block truncate text-[#6b7280]">{m.subject}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reading pane */}
        <div className="relative min-w-0 p-[1.6em]">
          <AnimatePresence>
            {opened ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[1.25em] font-semibold leading-snug">{SUBJECT}</p>
                <div className="mt-[1em] flex items-center gap-[0.8em]">
                  <Avatar src="/email/avatars/mia.webp" className="size-[2.8em]" />
                  <span className="min-w-0 leading-tight">
                    <span className="flex items-center gap-[0.4em] font-semibold">
                      Jordan Miles
                      <span className="inline-flex items-center gap-[0.25em] rounded-full bg-success-soft px-[0.5em] py-[0.05em] text-[0.8em] font-semibold text-success">
                        <svg
                          viewBox="0 0 16 16"
                          className="size-[1em]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m3.5 8.5 3 3 6-7" />
                        </svg>
                        brightleaf.co
                      </span>
                    </span>
                    <span className="block text-[#6b7280]">
                      jordan@brightleaf.co · to me
                    </span>
                  </span>
                </div>
                <div className="mt-[1.2em] space-y-[0.8em] leading-[1.6] text-[#374151]">
                  {BODY.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <div className="mt-[1.1em] flex items-center gap-[0.8em] border-t border-[#f0f1f4] pt-[0.9em]">
                  <span className="flex size-[2.6em] items-center justify-center rounded-[0.55em] bg-gradient-to-br from-brand-400 to-primary font-bold text-white">
                    B
                  </span>
                  <span className="leading-tight">
                    <span className="block font-semibold">Jordan Miles</span>
                    <span className="block text-[#6b7280]">
                      Founder, Brightleaf ·{" "}
                      <span className="text-primary">brightleaf.co</span>
                    </span>
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center gap-[0.6em] text-[#9aa1ad]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-[3em]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <path d="M3 6h18v12H3ZM3 7l9 6 9-6" />
                </svg>
                Select a message to read
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {now >= T.delivered && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="absolute bottom-[1.4em] right-[1.4em] flex items-center gap-[0.6em] rounded-full bg-[#0b1020] py-[0.5em] pl-[0.5em] pr-[1em] font-medium text-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.5)]"
              >
                <span className="flex size-[1.6em] items-center justify-center rounded-full bg-success-fill">
                  <svg
                    viewBox="0 0 16 16"
                    className="size-[0.95em]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                </span>
                Delivered · sent from your own domain
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
