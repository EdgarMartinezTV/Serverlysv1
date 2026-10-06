"use client";

import Image from "next/image";
import { memo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedAfterMount } from "./use-reduced";

/**
 * The "Make the right impression" composition: a full desktop mail client in
 * a glass frame and a phone in a glass frame, layered over a folded brand-blue
 * card and a pale card — and it plays. The cursor opens New mail, addresses
 * Alex, the subject and message type, a PDF attaches, the signature drops in,
 * Send; Sent Items ticks up, and the email arrives on Alex's phone as a
 * notification, then lands at the top of his inbox.
 *
 * Sized in container units so the whole composition scales as one picture.
 * One clock (motion's useAnimationFrame, real elapsed time) drives it; panes
 * that never change are memoised. No live blur: glass is tint + highlight.
 * Reduced motion: a still, finished frame. Decorative (aria-hidden).
 */

const DUR = 16000;
const T = {
  newMail: 1100,
  compose: 1350,
  toClick: 2000,
  toType: [2100, 2900] as const,
  suggest: 2650,
  pick: 3200,
  subjClick: 3500,
  subjType: [3600, 4400] as const,
  bodyType: [4600, 6500] as const,
  attach: 5700,
  sig: 6700,
  send: 7600,
  sent: 7850,
  bump: 8050,
  notify: 8700,
  land: 9700,
  verified: 10600,
  reset: 15500,
};

const TO = "alex@clientstudio.com";
const SUBJECT = "Following up on our proposal";
const BODY =
  "Hi Alex,\nThanks for your time yesterday. I've attached the proposal with the timeline and pricing for phase one.\nHappy to walk you through it this week.";
const typed = (text: string, t: number, [a, b]: readonly [number, number]) =>
  t <= a
    ? ""
    : t >= b
      ? text
      : text.slice(0, Math.round(((t - a) / (b - a)) * text.length));

type Pt = { x: number; y: number };
const CURSOR: Record<string, Pt> = {
  // Measured from the rendered composition (data-cursor targets), in % of the stage.
  rest: { x: 55, y: 72 },
  newMail: { x: 8.5, y: 30.6 },
  to: { x: 45.4, y: 44.7 },
  suggest: { x: 47.5, y: 49.4 },
  subject: { x: 46.5, y: 48.4 },
  body: { x: 49, y: 60 },
  send: { x: 40.6, y: 37.2 },
};

export function InboxShowcase() {
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.3 });
  const reduced = useReducedAfterMount();
  const [t, setT] = useState(0);
  const clock = useRef(0);
  const shown = useRef(0);

  useAnimationFrame((_, delta) => {
    if (!inView || reduced) return;
    clock.current = (clock.current + Math.min(delta, 250)) % DUR;
    if (clock.current - shown.current >= 40 || clock.current < shown.current) {
      shown.current = clock.current;
      setT(clock.current);
    }
  });
  const now = reduced ? 12000 : t;
  const loop = now < T.reset;

  const cursor =
    now < T.newMail - 500
      ? CURSOR.rest
      : now < T.toClick - 450
        ? CURSOR.newMail
        : now < T.pick - 300
          ? now < T.suggest + 150
            ? CURSOR.to
            : CURSOR.suggest
          : now < T.bodyType[0] - 100
            ? CURSOR.subject
            : now < T.send - 500
              ? CURSOR.body
              : now < T.sent + 400
                ? CURSOR.send
                : CURSOR.rest;
  const press = [T.newMail, T.toClick, T.pick, T.subjClick, T.send].some(
    (m) => now >= m && now < m + 170,
  );

  return (
    <div
      ref={stage}
      aria-hidden="true"
      className="@container relative isolate aspect-[16/10.6] w-full select-none [contain:layout_paint]"
      style={{
        fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <Backdrop />

      {/* Desktop, in glass */}
      <Glass className="absolute left-[3%] top-[17%] w-[72%] rounded-[2.2cqw] p-[1.3cqw]">
        <DesktopClient now={now} live={loop} />
      </Glass>

      {/* Phone, in glass */}
      <motion.div
        className="absolute left-[69.5%] top-[33%] z-20 w-[22%]"
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Glass className="rounded-[3cqw] p-[0.9cqw]">
          <PhoneInbox now={now} />
        </Glass>
      </motion.div>

      {/* Delivered callout */}
      <AnimatePresence>
        {now >= T.verified && loop && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute left-[52%] top-[86%] z-30 flex items-center gap-[0.9cqw] rounded-full bg-white py-[0.6cqw] pl-[0.6cqw] pr-[1.4cqw] text-[1.15cqw] shadow-[0_1.2cqw_3cqw_-1cqw_rgb(0_0_120/0.35),0_0_0_0.06cqw_rgb(15_23_42/0.06)]"
          >
            <span className="flex size-[2.2cqw] items-center justify-center rounded-full bg-success-fill text-white">
              <Check className="size-[1.2cqw]" />
            </span>
            <span className="font-semibold text-[#0f172a]">Delivered</span>
            <span className="text-[#64748b]">from jordan@brightleaf.co</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor */}
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute z-40 w-[1.7cqw]"
          animate={{
            left: `${cursor.x}%`,
            top: `${cursor.y}%`,
            scale: press ? 0.8 : 1,
            opacity: loop ? 1 : 0,
          }}
          transition={{
            left: { type: "spring", stiffness: 60, damping: 15 },
            top: { type: "spring", stiffness: 60, damping: 15 },
            scale: { duration: 0.12 },
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full drop-shadow-[0_0.2cqw_0.3cqw_rgb(0_0_0/0.35)]"
          >
            <path
              d="M5 2.5 19 13l-6.2.9 3.7 6.9-2.7 1.4-3.6-7L5 19.5Z"
              fill="#0b0b10"
              stroke="#fff"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    </div>
  );
}

/* ═══ Backdrop: folded brand card + pale card ═════════════════════════ */

const Backdrop = memo(function Backdrop() {
  return (
    <>
      {/* Pale card, lower left */}
      <div className="absolute left-[19%] top-[60%] h-[39%] w-[47%] rounded-[2.4cqw] bg-[linear-gradient(160deg,#dbe8ff,#cdeefa)] shadow-[0_2cqw_4cqw_-2cqw_rgb(0_0_120/0.15)]" />
      {/* Folded brand card, upper right */}
      <div className="absolute left-[27%] top-[3%] h-[64%] w-[62%]">
        {/* shadow as its own layer: a drop-shadow filter on the clipped card cost ~8 fps */}
        <div className="absolute inset-x-[3%] bottom-0 top-[30%] rounded-[2.6cqw] shadow-[0_3cqw_4cqw_-1cqw_rgb(0_0_160/0.32)]" />
        <div className="absolute inset-0 rounded-[2.6cqw] bg-[linear-gradient(150deg,#3a8dff_0%,var(--color-brand-500)_55%,var(--color-primary)_100%)] [clip-path:polygon(0_0,82%_0,100%_26%,100%_100%,0_100%)]" />
        {/* paper grain */}
        <div className="absolute inset-0 rounded-[2.6cqw] opacity-[0.12] [clip-path:polygon(0_0,82%_0,100%_26%,100%_100%,0_100%)] [background-image:radial-gradient(rgb(255_255_255/0.9)_0.06cqw,transparent_0.07cqw)] [background-size:0.5cqw_0.5cqw]" />
        {/* the curl */}
        <div className="absolute right-0 top-0 h-[26%] w-[18%] rounded-bl-[2cqw] bg-[linear-gradient(225deg,transparent_48%,#9cc6ff_50%,#5ea2ff_62%,var(--color-brand-500)_100%)] shadow-[-0.6cqw_0.8cqw_1.4cqw_-0.4cqw_rgb(0_0_120/0.35)] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
      </div>
    </>
  );
});

function Glass({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative bg-[linear-gradient(140deg,rgb(255_255_255/0.92),rgb(255_255_255/0.62)_45%,rgb(255_255_255/0.8))] shadow-[0_3cqw_6cqw_-2cqw_rgb(0_0_90/0.28),inset_0_0_0_0.1cqw_rgb(255_255_255/0.95)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ═══ Desktop client ══════════════════════════════════════════════════ */

function DesktopClient({ now, live }: { now: number; live: boolean }) {
  const composing = live && now >= T.compose && now < T.sent;
  const sentCount = live && now >= T.bump ? 25 : 24;
  return (
    <div className="relative overflow-hidden rounded-[1cqw] bg-white text-[0.95cqw] text-[#1f2937] shadow-[0_0_0_0.06cqw_rgb(15_23_42/0.1)]">
      <TitleBar />
      <Ribbon now={now} />
      <div className="grid h-[38cqw] grid-cols-[4%_17%_27%_1fr_21%]">
        <Rail />
        <Folders sentCount={sentCount} />
        <MessageList />
        <div className="relative min-w-0 border-r border-[#edf0f4]">
          <AnimatePresence mode="wait" initial={false}>
            {composing ? <Compose key="c" now={now} /> : <Reading key="r" />}
          </AnimatePresence>
        </div>
        <CalendarPane />
      </div>
      <AnimatePresence>
        {live && now >= T.sent && now < T.sent + 2600 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute bottom-[3%] left-[46%] flex items-center gap-[0.8cqw] rounded-[0.6cqw] bg-[#1f2937] px-[1.2cqw] py-[0.7cqw] text-white shadow-[0_1cqw_2cqw_-0.8cqw_rgb(0_0_0/0.5)]"
          >
            <Check className="size-[1.1cqw] text-[#4ade80]" />
            Message sent
            <span className="ml-[0.6cqw] font-semibold text-brand-300">Undo</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TitleBar = memo(function TitleBar() {
  return (
    <div className="flex items-center gap-[1cqw] bg-[#f5f6f8] px-[1cqw] py-[0.55cqw]">
      <span className="relative size-[1.5cqw] overflow-hidden rounded-[0.3cqw]">
        <Image
          src="/brand/logo-mark-transparent.png"
          alt=""
          fill
          sizes="24px"
          className="object-contain"
        />
      </span>
      <span className="font-semibold text-primary">Mail</span>
      <span className="mx-auto flex w-[34%] items-center gap-[0.6cqw] rounded-[0.4cqw] bg-white px-[0.8cqw] py-[0.35cqw] text-[#6b7280] shadow-[0_0_0_0.06cqw_#dfe3e9]">
        <Icon
          d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14ZM20 20l-4-4"
          className="size-[1cqw]"
        />{" "}
        Search
      </span>
      <span className="flex items-center gap-[1.2cqw] text-[#4b5563]">
        <Icon d="M4 5h16v12H8l-4 3Z" className="size-[1.1cqw]" />
        <Icon
          d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"
          className="size-[1.1cqw]"
        />
        <Icon
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1-2 3.4-.2-.1a1.6 1.6 0 0 0-1.8 0 1.6 1.6 0 0 0-.9 1.5V22h-4v-.3a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8 0l-.1.1-2-3.4.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H4v-4h.3a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1 2-3.4.1.1a1.6 1.6 0 0 0 1.8 0 1.6 1.6 0 0 0 1-1.5V2h4v.3a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8 0l.1-.1 2 3.4-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1h.3v4h-.3a1.6 1.6 0 0 0-1.5 1Z"
          className="size-[1.1cqw]"
        />
        <Avatar src="/email/avatars/mia.webp" className="size-[1.7cqw]" />
        <span className="ml-[0.4cqw] flex gap-[1.1cqw] text-[#6b7280]">
          <Icon d="M5 12h14" className="size-[1cqw]" />
          <Icon d="M6 6h12v12H6Z" className="size-[0.9cqw]" />
          <Icon d="M6 6l12 12M18 6 6 18" className="size-[1cqw]" />
        </span>
      </span>
    </div>
  );
});

function Ribbon({ now }: { now: number }) {
  const pressed = now >= T.newMail && now < T.newMail + 170;
  return (
    <div className="border-b border-[#e5e8ee] bg-[#fafbfc]">
      <div className="flex items-center gap-[1.6cqw] px-[1.4cqw] pt-[0.4cqw] text-[0.95cqw] text-[#4b5563]">
        <Icon d="M4 7h16M4 12h16M4 17h16" className="size-[1.1cqw]" />
        <span className="border-b-[0.18cqw] border-primary pb-[0.3cqw] font-semibold text-[#111827]">
          Home
        </span>
        <span className="pb-[0.3cqw]">View</span>
        <span className="pb-[0.3cqw]">Help</span>
        <span className="ml-auto flex items-center gap-[0.5cqw] pb-[0.3cqw] text-[0.88cqw]">
          <span className="rounded-full bg-success-soft px-[0.6cqw] font-semibold text-success">
            Encrypted · TLS
          </span>
          <span className="font-semibold text-primary">jordan@brightleaf.co</span>
        </span>
      </div>
      <div className="flex items-center gap-[1.05cqw] px-[1cqw] py-[0.55cqw] text-[#374151]">
        <motion.span
          animate={{ scale: pressed ? 0.94 : 1 }}
          data-cursor="newMail"
          className="flex items-center overflow-hidden rounded-[0.4cqw] bg-primary font-semibold text-white shadow-[0_0.4cqw_0.8cqw_-0.4cqw_rgb(0_0_255/0.6)]"
        >
          <span className="flex items-center gap-[0.5cqw] px-[0.9cqw] py-[0.45cqw]">
            <Icon d="M3 6h18v12H3ZM3 7l9 6 9-6" className="size-[1.05cqw]" /> New mail
          </span>
          <span className="border-l border-white/30 px-[0.45cqw] py-[0.45cqw]">
            <Icon d="m6 9 6 6 6-6" className="size-[0.8cqw]" />
          </span>
        </motion.span>
        {[
          "M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13",
          "M4 7h16v3H4ZM5 10v10h14V10M10 14h4",
          "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z",
          "m4 20 7-7M14 4l6 6-7 7-6-6Z",
        ].map((d) => (
          <Icon key={d} d={d} className="size-[1.15cqw] text-[#4b5563]" />
        ))}
        <span className="h-[1.4cqw] w-px bg-[#e2e5ea]" />
        {[
          "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-1",
          "M7 14 2 9l5-5M12 14 7 9l5-5M7 9h9a5 5 0 0 1 0 10h-1",
          "M15 14l5-5-5-5M20 9H9a5 5 0 0 0 0 10h1",
        ].map((d) => (
          <Icon key={d} d={d} className="size-[1.15cqw] text-brand-500" />
        ))}
        <span className="h-[1.4cqw] w-px bg-[#e2e5ea]" />
        <span className="flex items-center gap-[0.4cqw]">
          <Icon
            d="M13 3 4 14h7l-1 7 9-11h-7Z"
            className="size-[1.1cqw] text-[#eab308]"
          />{" "}
          Quick steps
        </span>
        <span className="flex items-center gap-[0.4cqw]">
          <Icon
            d="M3 7h18v12H3ZM3 8l9 6 9-6"
            className="size-[1.1cqw] text-brand-500"
          />{" "}
          Read / Unread
        </span>
        <Icon d="M12 3v18M5 4h11l-2 4 2 4H5" className="size-[1.1cqw] text-[#ef4444]" />
        <Icon
          d="M12 8v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z"
          className="size-[1.1cqw] text-[#4b5563]"
        />
        <span className="text-[#6b7280]">···</span>
      </div>
    </div>
  );
}

const Rail = memo(function Rail() {
  const icons = [
    { d: "M3 6h18v12H3ZM3 7l9 6 9-6", on: true },
    { d: "M4 6h16v14H4ZM4 10h16M9 3v4M15 3v4" },
    {
      d: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M17 14a5 5 0 0 1 4 6",
    },
    { d: "m5 12 4 4 10-10" },
    { d: "M4 4h7v7H4ZM13 4h7v7h-7ZM4 13h7v7H4ZM13 13h7v7h-7Z" },
  ];
  return (
    <div className="flex flex-col items-center gap-[1.4cqw] border-r border-[#edf0f4] bg-[#f7f8fa] pt-[1.2cqw]">
      {icons.map((i) => (
        <span
          key={i.d}
          className={cn("relative flex", i.on ? "text-primary" : "text-[#6b7280]")}
        >
          {i.on && (
            <span className="absolute -left-[0.95cqw] top-0 h-full w-[0.2cqw] rounded-full bg-primary" />
          )}
          <Icon d={i.d} className="size-[1.2cqw]" />
        </span>
      ))}
    </div>
  );
});

const FOLDERS = [
  {
    label: "Inbox",
    count: "14",
    d: "M3 13h4l1.5 2h7L17 13h4M3 13l2.5-7h13L21 13v6H3Z",
    on: true,
  },
  { label: "Drafts", d: "M4 20h4L19 9l-4-4L4 16Z" },
  { label: "Sent Items", sent: true, d: "m4 12 16-8-6 16-2.5-6.5Z" },
  { label: "Deleted Items", d: "M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13" },
  { label: "Junk Email", d: "M12 3 3 20h18ZM12 10v4M12 17h.01" },
  { label: "Archive", d: "M4 7h16v3H4ZM5 10v10h14V10M10 14h4" },
  { label: "Clients", d: "M3 7h7l2 2h9v10H3Z" },
];

function Folders({ sentCount }: { sentCount: number }) {
  return (
    <div className="min-w-0 border-r border-[#edf0f4] px-[0.6cqw] pt-[0.8cqw]">
      <p className="flex items-center gap-[0.5cqw] px-[0.5cqw] py-[0.35cqw] font-medium text-[#374151]">
        <Icon d="m6 9 6 6 6-6" className="size-[0.85cqw]" /> Favorites
      </p>
      <p className="flex items-center gap-[0.6cqw] py-[0.35cqw] pl-[2cqw] text-[#4b5563]">
        <Icon d="M3 7h7l2 2h9v10H3Z" className="size-[1cqw]" /> Invoices
      </p>
      <p className="mt-[0.4cqw] flex items-center gap-[0.5cqw] truncate px-[0.5cqw] py-[0.35cqw] font-medium text-[#374151]">
        <Icon d="m6 9 6 6 6-6" className="size-[0.85cqw]" /> jordan@brightleaf.co
      </p>
      {FOLDERS.map((f) => (
        <div
          key={f.label}
          className={cn(
            "flex items-center gap-[0.6cqw] rounded-[0.35cqw] py-[0.42cqw] pl-[1.6cqw] pr-[0.6cqw]",
            f.on ? "bg-brand-100/70 font-semibold text-[#111827]" : "text-[#4b5563]",
          )}
        >
          <Icon d={f.d} className="size-[1cqw]" />
          <span className="flex-1 truncate">{f.label}</span>
          {f.count && <span className="font-semibold text-primary">{f.count}</span>}
          {f.sent && (
            <motion.span
              key={sentCount}
              initial={{ scale: 1.7, color: "#0000ff" }}
              animate={{ scale: 1, color: "#9ca3af" }}
              transition={{ duration: 0.6 }}
              className="tabular-nums"
            >
              {sentCount}
            </motion.span>
          )}
        </div>
      ))}
      <p className="mt-[0.8cqw] flex items-center gap-[0.6cqw] px-[0.5cqw] font-medium text-primary">
        <Icon d="M12 5v14M5 12h14" className="size-[1cqw]" /> Add account
      </p>
    </div>
  );
}

const MESSAGES = [
  {
    group: null,
    av: "/email/avatars/sara.webp",
    name: "Sara Okafor",
    subject: "Logo files: final versions",
    preview: "Attached in every format you asked for…",
    time: "10:24 AM",
    pin: true,
    state: "pinned",
  },
  {
    group: "Today",
    av: "/email/avatars/ethan.webp",
    name: "Alex Rivera",
    subject: "Great meeting yesterday",
    preview: "Could you send over the proposal and…",
    time: "9:41 AM",
    state: "selected",
  },
  {
    group: "Yesterday",
    ini: "MB",
    tone: "bg-brand-900",
    name: "Maya Brooks",
    subject: "Q4 brand refresh",
    preview: "Can you share a link to the moodboards…",
    time: "4:12 PM",
    state: "flag",
  },
  {
    group: null,
    ini: "TK",
    tone: "bg-accent-on-dark",
    name: "Taylor Kim",
    subject: "Lunch on Thursday",
    preview: "Works for me, see you at noon…",
    time: "1:05 PM",
    rsvp: true,
  },
  {
    group: null,
    ini: "RP",
    tone: "bg-success-fill",
    name: "Riley Park",
    subject: "Invoice #2291 paid",
    preview: "Payment received, thank you…",
    time: "11:30 AM",
    clip: true,
  },
];

const MessageList = memo(function MessageList() {
  return (
    <div className="min-w-0 overflow-hidden border-r border-[#edf0f4]">
      <div className="flex items-center gap-[1.4cqw] px-[1cqw] pb-[0.4cqw] pt-[0.8cqw]">
        <span className="border-b-[0.18cqw] border-primary pb-[0.25cqw] font-semibold text-[#111827]">
          Focused
        </span>
        <span className="pb-[0.25cqw] text-[#6b7280]">Other</span>
        <Icon
          d="M4 6h16M7 12h10M10 18h4"
          className="ml-auto size-[1.05cqw] text-[#6b7280]"
        />
      </div>
      {MESSAGES.map((m) => (
        <div key={m.name}>
          {m.group && (
            <p className="flex items-center gap-[0.5cqw] px-[1cqw] pb-[0.2cqw] pt-[0.5cqw] text-[0.88cqw] font-medium text-[#374151]">
              <Icon d="m6 9 6 6 6-6" className="size-[0.8cqw]" /> {m.group}
            </p>
          )}
          <div
            className={cn(
              "flex gap-[0.7cqw] px-[1cqw] py-[0.6cqw]",
              m.state === "selected" &&
                "bg-brand-100/70 shadow-[inset_0.2cqw_0_0_var(--color-primary)]",
              m.state === "pinned" &&
                "bg-brand-50/80 shadow-[inset_0.2cqw_0_0_var(--color-primary)]",
              m.state === "flag" && "bg-[#fffbe6]",
            )}
          >
            {m.av ? (
              <Avatar src={m.av} className="size-[2.2cqw]" />
            ) : (
              <span
                className={cn(
                  "flex size-[2.2cqw] shrink-0 items-center justify-center rounded-full text-[0.8cqw] font-semibold text-white",
                  m.tone,
                )}
              >
                {m.ini}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-[0.4cqw]">
                <span className="truncate font-semibold text-[#111827]">{m.name}</span>
                {m.pin && (
                  <Icon
                    d="M14 3l7 7-4 1-4 4-1 5-8-8 5-1 4-4Z"
                    className="ml-auto size-[0.95cqw] text-primary"
                  />
                )}
                {m.state === "flag" && (
                  <Icon
                    d="M5 21V4h11l-2 4 2 4H5"
                    className="ml-auto size-[0.95cqw] text-[#ef4444]"
                  />
                )}
              </span>
              <span className="flex items-center justify-between gap-[0.4cqw]">
                <span
                  className={cn(
                    "truncate",
                    m.state === "selected" || m.state === "pinned"
                      ? "font-medium text-primary"
                      : "text-[#1f2937]",
                  )}
                >
                  {m.subject}
                </span>
                <span className="shrink-0 text-[0.82cqw] text-[#6b7280]">{m.time}</span>
              </span>
              <span className="flex items-center gap-[0.3cqw] truncate text-[0.88cqw] text-[#6b7280]">
                {m.preview}
                {m.clip && (
                  <Icon
                    d="M8.5 12.5 15 6a3 3 0 1 1 4 4l-8 8a5 5 0 0 1-7-7l7-7"
                    className="size-[0.85cqw] shrink-0"
                  />
                )}
              </span>
              {m.rsvp && (
                <span className="mt-[0.4cqw] flex w-fit items-center gap-[0.6cqw] rounded-[0.4cqw] bg-[#f3f4f6] px-[0.6cqw] py-[0.25cqw] text-[0.85cqw]">
                  <Icon
                    d="M4 6h16v14H4ZM4 10h16"
                    className="size-[0.85cqw] text-[#6b7280]"
                  />{" "}
                  Thu, 12:00 PM
                  <span className="font-semibold text-primary">RSVP</span>
                </span>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
});

const Reading = memo(function Reading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 p-[1.2cqw]"
    >
      <p className="flex flex-wrap items-center gap-[0.6cqw] text-[1.35cqw] font-semibold text-[#111827]">
        Great meeting yesterday
        <span className="rounded-[0.3cqw] bg-brand-50 px-[0.5cqw] text-[0.8cqw] font-semibold text-primary ring-[0.06cqw] ring-brand-200">
          Clients
        </span>
        <span className="rounded-[0.3cqw] bg-success-soft px-[0.5cqw] text-[0.8cqw] font-semibold text-success ring-[0.06cqw] ring-success/30">
          Follow up
        </span>
      </p>
      <div className="mt-[1cqw] flex items-start gap-[0.7cqw]">
        <span className="relative">
          <Avatar src="/email/avatars/ethan.webp" className="size-[2.6cqw]" />
          <span className="absolute -bottom-[0.1cqw] -right-[0.1cqw] size-[0.85cqw] rounded-full border-[0.15cqw] border-white bg-success-fill" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="flex items-center justify-between">
            <span className="font-semibold text-[#111827]">Alex Rivera</span>
            <span className="flex gap-[0.7cqw] text-brand-500">
              <Icon
                d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-1"
                className="size-[1cqw]"
              />
              <Icon
                d="M15 14l5-5-5-5M20 9H9a5 5 0 0 0 0 10h1"
                className="size-[1cqw]"
              />
            </span>
          </span>
          <span className="block text-[0.85cqw] text-[#6b7280]">
            To: jordan@brightleaf.co · Tue 10/6 9:41 AM
          </span>
        </span>
      </div>
      <div className="mt-[1.1cqw] space-y-[0.7cqw] leading-[1.55] text-[#374151]">
        <p>Hi Jordan,</p>
        <p>
          Great meeting yesterday. Could you send over the proposal and the timeline for
          phase one?
        </p>
        <p>
          Thanks,
          <br />
          Alex
        </p>
      </div>
      <div className="mt-[1.1cqw] flex gap-[0.6cqw]">
        {["Reply", "Reply all", "Forward"].map((b) => (
          <span
            key={b}
            className="rounded-[0.4cqw] px-[0.8cqw] py-[0.35cqw] font-medium text-[#374151] shadow-[0_0_0_0.06cqw_#d7dbe2]"
          >
            {b}
          </span>
        ))}
      </div>
      <div className="mt-[1.2cqw] flex items-center gap-[0.7cqw] rounded-[0.5cqw] px-[0.8cqw] py-[0.6cqw] shadow-[0_0_0_0.06cqw_#e5e8ee]">
        <Avatar src="/email/avatars/mia.webp" className="size-[2cqw]" />
        <span className="min-w-0 flex-1 truncate">
          <span className="font-medium">Jordan Miles</span>{" "}
          <span className="text-[#6b7280]">Hi Alex, lovely to meet you…</span>
        </span>
        <span className="text-[0.82cqw] text-[#6b7280]">Mon</span>
      </div>
      <p className="mt-[0.8cqw] flex items-center gap-[0.5cqw] px-[0.8cqw] text-[0.88cqw] font-medium text-[#4b5563]">
        <Icon d="m6 9 6 6 6-6" className="size-[0.85cqw]" /> See 2 more messages
      </p>
    </motion.div>
  );
});

function Compose({ now }: { now: number }) {
  const to = typed(TO, now, T.toType);
  const picked = now >= T.pick;
  const subject = typed(SUBJECT, now, T.subjType);
  const body = typed(BODY, now, T.bodyType);
  const caret = (on: boolean) =>
    on && (
      <span className="ml-[0.08cqw] inline-block h-[1.1em] w-[0.12cqw] translate-y-[0.2em] animate-pulse bg-primary" />
    );
  const pressed = now >= T.send && now < T.send + 170;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex flex-col p-[1cqw]"
    >
      <div className="flex items-center gap-[0.7cqw]">
        <motion.span
          animate={{ scale: pressed ? 0.92 : 1 }}
          data-cursor="send"
          className="flex items-center gap-[0.5cqw] rounded-[0.4cqw] bg-primary px-[1cqw] py-[0.4cqw] font-semibold text-white shadow-[0_0.4cqw_0.8cqw_-0.4cqw_rgb(0_0_255/0.6)]"
        >
          <Icon d="m3 11 18-8-6 18-3-7Z" className="size-[1cqw]" /> Send
        </motion.span>
        <span className="text-[#6b7280]">Discard</span>
        <span className="ml-auto flex items-center gap-[0.4cqw] text-[0.85cqw] text-success">
          <Icon d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z" className="size-[0.95cqw]" />{" "}
          Encrypted
        </span>
      </div>
      <Row label="From">
        <span className="inline-flex items-center gap-[0.45cqw] rounded-full bg-brand-50 py-[0.15cqw] pl-[0.2cqw] pr-[0.7cqw] font-medium text-primary">
          <Avatar src="/email/avatars/mia.webp" className="size-[1.5cqw]" />{" "}
          jordan@brightleaf.co
        </span>
      </Row>
      <div className="relative">
        <Row label="To">
          {picked ? (
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="inline-flex items-center gap-[0.45cqw] rounded-full bg-[#eef1f5] py-[0.15cqw] pl-[0.2cqw] pr-[0.8cqw] font-medium"
            >
              <Avatar src="/email/avatars/ethan.webp" className="size-[1.5cqw]" /> Alex
              Rivera
            </motion.span>
          ) : (
            <span>
              {to}
              {caret(now >= T.toClick && now < T.pick)}
            </span>
          )}
        </Row>
        <AnimatePresence>
          {now >= T.suggest && !picked && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              data-cursor="suggest"
              className="absolute left-[12%] top-[90%] z-10 flex w-[70%] items-center gap-[0.7cqw] rounded-[0.6cqw] bg-white px-[0.8cqw] py-[0.55cqw] shadow-[0_0_0_0.06cqw_rgb(15_23_42/0.1),0_1.2cqw_2.4cqw_-1cqw_rgb(15_23_42/0.35)]"
            >
              <Avatar src="/email/avatars/ethan.webp" className="size-[2.2cqw]" />
              <span className="leading-tight">
                <span className="block font-semibold">Alex Rivera</span>
                <span className="block text-[0.85cqw] text-[#6b7280]">{TO}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Row label="Subject">
        <span className="font-medium">
          {subject}
          {caret(now >= T.subjClick && now < T.bodyType[0])}
        </span>
      </Row>
      <div
        data-cursor="body"
        className="min-h-0 flex-1 overflow-hidden whitespace-pre-line pt-[0.8cqw] leading-[1.55] text-[#374151]"
      >
        {body}
        {caret(now >= T.bodyType[0] && now < T.sig)}
        <AnimatePresence>
          {now >= T.attach && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="mt-[0.7cqw] flex w-fit items-center gap-[0.6cqw] rounded-[0.5cqw] py-[0.35cqw] pl-[0.35cqw] pr-[1cqw] shadow-[0_0_0_0.06cqw_#dfe3e9]"
            >
              <span className="flex size-[2cqw] items-center justify-center rounded-[0.35cqw] bg-[#dc2626] text-[0.68cqw] font-bold text-white">
                PDF
              </span>
              <span className="leading-tight">
                <span className="block text-[0.9cqw] font-medium text-[#111827]">
                  Proposal_Brightleaf.pdf
                </span>
                <span className="block text-[0.78cqw] text-[#9ca3af]">2.4 MB</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {now >= T.sig && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className="mt-[0.7cqw] flex items-center gap-[0.7cqw] border-t border-[#eef0f4] pt-[0.6cqw]"
            >
              <span className="flex size-[2.3cqw] items-center justify-center rounded-[0.45cqw] bg-gradient-to-br from-brand-400 to-primary text-[1.1cqw] font-bold text-white">
                B
              </span>
              <span className="leading-tight">
                <span className="block font-semibold text-[#111827]">Jordan Miles</span>
                <span className="block text-[0.85cqw] text-[#6b7280]">
                  Founder, Brightleaf ·{" "}
                  <span className="text-primary">brightleaf.co</span>
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      data-cursor={label.toLowerCase()}
      className="flex min-h-[2.5cqw] items-center gap-[0.8cqw] border-b border-[#eef0f4]"
    >
      <span className="w-[3.6cqw] shrink-0 text-[#6b7280]">{label}</span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </div>
  );
}

const CalendarPane = memo(function CalendarPane() {
  const days = [
    ["S", 4],
    ["M", 5],
    ["T", 6],
    ["W", 7],
    ["T", 8],
    ["F", 9],
    ["S", 10],
  ] as const;
  const events = [
    { time: "All day", title: "Studio offsite", bar: "bg-accent-on-dark" },
    {
      time: "9:00 AM",
      sub: "1h",
      title: "Brand review",
      room: "Room 2",
      bar: "bg-primary",
    },
    {
      time: "11:30 AM",
      sub: "30 min",
      title: "Call with Alex",
      room: "Online",
      bar: "bg-brand-400",
      soon: true,
    },
    {
      time: "2:30 PM",
      sub: "1h",
      title: "Proposal walkthrough",
      room: "Room 1",
      bar: "bg-success-fill",
    },
  ];
  return (
    <div className="min-w-0 overflow-hidden bg-[#fbfcfd] px-[0.9cqw] pt-[0.8cqw]">
      <div className="flex items-center gap-[1cqw]">
        <span className="border-b-[0.18cqw] border-primary pb-[0.25cqw] font-semibold text-[#111827]">
          Calendar
        </span>
        <span className="pb-[0.25cqw] text-[#6b7280]">To-Do</span>
      </div>
      <p className="mt-[0.8cqw] flex items-center justify-between font-semibold text-[#111827]">
        October <span className="font-normal text-[#9ca3af]">···</span>
      </p>
      <div className="mt-[0.5cqw] grid grid-cols-7 text-center text-[0.8cqw]">
        {days.map(([d, n], i) => (
          <span
            key={i}
            className="flex flex-col items-center gap-[0.3cqw] text-[#6b7280]"
          >
            {d}
            <span
              className={cn(
                "flex size-[1.7cqw] items-center justify-center rounded-full text-[0.85cqw]",
                n === 6 ? "bg-primary font-semibold text-white" : "text-[#374151]",
              )}
            >
              {n}
            </span>
          </span>
        ))}
      </div>
      <p className="mt-[0.9cqw] text-[0.88cqw] font-semibold text-[#111827]">
        Today · Tue, Oct 6
      </p>
      <div className="mt-[0.5cqw] flex flex-col gap-[0.55cqw]">
        {events.map((e) => (
          <div key={e.title} className="flex gap-[0.6cqw]">
            <span className={cn("w-[0.25cqw] shrink-0 rounded-full", e.bar)} />
            <span className="w-[3.6cqw] shrink-0 text-[0.8cqw] leading-tight text-[#6b7280]">
              {e.time}
              {e.sub && <span className="block">{e.sub}</span>}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[0.88cqw] font-medium text-[#111827]">
                {e.title}
              </span>
              {e.room && (
                <span className="block truncate text-[0.78cqw] text-[#6b7280]">
                  {e.room}
                </span>
              )}
              {e.soon && (
                <span className="mt-[0.3cqw] inline-block rounded-full bg-primary px-[0.6cqw] text-[0.75cqw] font-semibold text-white">
                  in 38 min
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-[0.9cqw] flex items-center gap-[0.4cqw] text-[0.88cqw] font-medium text-primary">
        <Icon d="M12 5v14M5 12h14" className="size-[0.9cqw]" /> New event
      </p>
    </div>
  );
});

/* ═══ Phone: Alex's inbox ═════════════════════════════════════════════ */

const PHONE_MAIL = [
  {
    ini: "OE",
    tone: "bg-[#e5e7eb] text-[#6b7280]",
    name: "Other emails",
    subject: "Northwind, Relecloud, Alpine…",
    time: "",
    count: 2,
    muted: true,
  },
  {
    av: "/email/avatars/sara.webp",
    name: "Sara Okafor",
    subject: "Workshop photos",
    preview: "Here are the shots from Thursday…",
    time: "9:30 AM",
  },
  {
    ini: "MB",
    tone: "bg-brand-900",
    name: "Maya Brooks",
    subject: "Lunch at Café 9",
    preview: "Can't wait to see you and catch up!",
    time: "8:47 AM",
    rsvp: true,
  },
  {
    ini: "RP",
    tone: "bg-success-fill",
    name: "Riley Park",
    subject: "Invoice #2291 paid",
    preview: "Payment received, thank you…",
    time: "8:13 AM",
  },
  {
    ini: "TK",
    tone: "bg-accent-on-dark",
    name: "Taylor Kim",
    subject: "Re: workshop agenda",
    preview: "Works for me, see you then…",
    time: "Mon",
  },
];

function PhoneInbox({ now }: { now: number }) {
  const banner = now >= T.notify && now < T.land && now < T.reset;
  const landed = now >= T.land && now < T.reset;
  return (
    <div className="relative aspect-[9/18.5] overflow-hidden rounded-[2.2cqw] bg-white text-[0.82cqw] text-[#111827] shadow-[0_0_0_0.06cqw_rgb(15_23_42/0.12)]">
      {/* Blue header */}
      <div className="bg-[linear-gradient(180deg,var(--color-primary),var(--color-brand-500))] px-[0.9cqw] pb-[0.8cqw] pt-[0.6cqw] text-white">
        <div className="flex items-center justify-between text-[0.75cqw] font-semibold">
          <span>9:41</span>
          <span className="flex items-center gap-[0.3cqw]">
            <span className="flex items-end gap-[0.08cqw]">
              {[0.35, 0.55, 0.75, 0.95].map((h) => (
                <span
                  key={h}
                  className="w-[0.16cqw] rounded-[0.04cqw] bg-white"
                  style={{ height: `${h * 0.7}cqw` }}
                />
              ))}
            </span>
            100%
          </span>
        </div>
        <div className="mt-[0.7cqw] flex items-center gap-[0.6cqw]">
          <span className="relative size-[1.9cqw] overflow-hidden rounded-full bg-white">
            <Image
              src="/email/avatars/ethan.webp"
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          </span>
          <span className="text-[1.25cqw] font-semibold">Inbox</span>
          <span className="ml-auto flex gap-[0.8cqw]">
            <Icon
              d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"
              className="size-[1.1cqw]"
            />
            <Icon
              d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14ZM20 20l-4-4"
              className="size-[1.1cqw]"
            />
          </span>
        </div>
        <div className="mt-[0.7cqw] flex items-center gap-[0.4cqw] text-[0.8cqw] font-semibold">
          <span className="rounded-full bg-white px-[0.8cqw] py-[0.2cqw] text-primary">
            Focused
          </span>
          <span className="px-[0.5cqw] text-white/85">Other</span>
          <span className="ml-auto rounded-full bg-white/15 px-[0.7cqw] py-[0.2cqw]">
            Filter
          </span>
        </div>
      </div>

      {/* List */}
      <div className="relative">
        <AnimatePresence initial={false}>
          {landed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 170, damping: 22 }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ backgroundColor: "rgb(224 234 255)" }}
                animate={{ backgroundColor: "rgb(240 245 255)" }}
                transition={{ duration: 2 }}
                className="flex gap-[0.6cqw] border-b border-[#f1f3f6] px-[0.9cqw] py-[0.7cqw] shadow-[inset_0.2cqw_0_0_var(--color-primary)]"
              >
                <Avatar src="/email/avatars/mia.webp" className="size-[2.2cqw]" />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-[0.3cqw] font-semibold">
                      Jordan Miles
                      <span className="flex size-[0.9cqw] items-center justify-center rounded-full bg-primary text-white">
                        <Check className="size-[0.6cqw]" />
                      </span>
                    </span>
                    <span className="text-[0.72cqw] font-semibold text-primary">
                      now
                    </span>
                  </span>
                  <span className="block truncate font-semibold">{SUBJECT}</span>
                  <span className="flex items-center gap-[0.3cqw] truncate text-[0.75cqw] text-[#6b7280]">
                    Thanks for your time yesterday…
                    <Icon
                      d="M8.5 12.5 15 6a3 3 0 1 1 4 4l-8 8a5 5 0 0 1-7-7l7-7"
                      className="size-[0.75cqw] shrink-0"
                    />
                  </span>
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <PhoneList />
      </div>

      {/* Notification banner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ y: "-130%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-130%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="absolute inset-x-[0.6cqw] top-[0.6cqw] z-10 rounded-[1cqw] bg-white p-[0.7cqw] shadow-[0_1cqw_2cqw_-0.6cqw_rgb(0_0_60/0.45),0_0_0_0.06cqw_rgb(15_23_42/0.06)]"
          >
            <div className="flex items-center gap-[0.4cqw] text-[0.7cqw] text-[#6b7280]">
              <span className="flex size-[1.2cqw] items-center justify-center rounded-[0.3cqw] bg-primary">
                <Icon
                  d="M3 6h18v12H3ZM3 7l9 6 9-6"
                  className="size-[0.8cqw] text-white"
                />
              </span>
              <span className="font-semibold uppercase tracking-[0.04em]">Mail</span>
              <span className="ml-auto">now</span>
            </div>
            <div className="mt-[0.45cqw] flex items-center gap-[0.5cqw]">
              <Avatar src="/email/avatars/mia.webp" className="size-[1.9cqw]" />
              <span className="min-w-0 leading-tight">
                <span className="block font-semibold">Jordan Miles</span>
                <span className="block truncate text-[0.78cqw]">{SUBJECT}</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB + tab bar */}
      <span className="absolute bottom-[12%] right-[6%] flex size-[2.8cqw] items-center justify-center rounded-full bg-primary text-white shadow-[0_0.6cqw_1.2cqw_-0.4cqw_rgb(0_0_255/0.7)]">
        <Icon d="M4 20h4L19 9l-4-4L4 16Z" className="size-[1.2cqw]" />
      </span>
      <div className="absolute inset-x-0 bottom-0 border-t border-[#eef0f4] bg-white pb-[0.6cqw] pt-[0.5cqw]">
        <div className="flex justify-around text-[0.7cqw]">
          {[
            { l: "Email", d: "M3 6h18v12H3ZM3 7l9 6 9-6", on: true },
            { l: "Search", d: "M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14ZM20 20l-4-4" },
            { l: "Calendar", d: "M4 6h16v14H4ZM4 10h16M9 3v4M15 3v4" },
          ].map((tab) => (
            <span
              key={tab.l}
              className={cn(
                "flex flex-col items-center gap-[0.15cqw]",
                tab.on ? "text-primary" : "text-[#6b7280]",
              )}
            >
              <Icon d={tab.d} className="size-[1.15cqw]" />
              {tab.l}
            </span>
          ))}
        </div>
        <span className="mx-auto mt-[0.5cqw] block h-[0.25cqw] w-[5cqw] rounded-full bg-[#111827]/80" />
      </div>
    </div>
  );
}

const PhoneList = memo(function PhoneList() {
  return (
    <>
      {PHONE_MAIL.map((m) => (
        <div
          key={m.name}
          className="flex gap-[0.6cqw] border-b border-[#f1f3f6] px-[0.9cqw] py-[0.7cqw]"
        >
          {m.av ? (
            <Avatar src={m.av} className="size-[2.2cqw]" />
          ) : (
            <span
              className={cn(
                "flex size-[2.2cqw] shrink-0 items-center justify-center rounded-full text-[0.72cqw] font-semibold text-white",
                m.tone,
              )}
            >
              {m.muted ? (
                <Icon d="M3 6h18v12H3ZM3 7l9 6 9-6" className="size-[1cqw]" />
              ) : (
                m.ini
              )}
            </span>
          )}
          <span className="min-w-0 flex-1 leading-tight">
            <span className="flex items-center justify-between">
              <span
                className={cn("truncate", m.muted ? "text-[#374151]" : "font-semibold")}
              >
                {m.name}
              </span>
              {m.time && <span className="text-[0.72cqw] text-primary">{m.time}</span>}
              {m.count && (
                <span className="rounded-[0.25cqw] bg-brand-100 px-[0.35cqw] text-[0.7cqw] font-semibold text-primary">
                  {m.count}
                </span>
              )}
            </span>
            <span
              className={cn(
                "block truncate",
                m.muted ? "text-[0.75cqw] text-[#6b7280]" : "font-medium",
              )}
            >
              {m.subject}
            </span>
            {m.preview && (
              <span className="block truncate text-[0.75cqw] text-[#6b7280]">
                {m.preview}
              </span>
            )}
            {m.rsvp && (
              <span className="mt-[0.35cqw] flex w-fit items-center gap-[0.4cqw] rounded-full bg-[#f3f4f6] px-[0.5cqw] py-[0.15cqw] text-[0.7cqw]">
                <span className="size-[0.7cqw] rounded-[0.15cqw] bg-brand-500" />{" "}
                Tomorrow, 11 am
                <span className="font-semibold text-primary">RSVP</span>
              </span>
            )}
          </span>
        </div>
      ))}
    </>
  );
});

/* ═══ Primitives ══════════════════════════════════════════════════════ */

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

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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
