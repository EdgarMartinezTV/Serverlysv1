"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedAfterMount } from "./use-reduced";
import {
  Avatar,
  Backdrop,
  Check,
  Glass,
  Icon,
  MessageList,
  Rail,
  TitleBar,
} from "./inbox-showcase";

/**
 * Hero composition — the same product, staging and craft as the
 * "Make the right impression" showcase (desktop client + phone in glass over
 * the folded brand card), telling the chapter before it: setting up.
 *
 *  1. The client opens on a "Create your mailbox" sheet. The cursor picks the
 *     domain from a dropdown, the address types out, Create.
 *  2. The sheet resolves into the inbox; welcome mail and the first client
 *     messages stream in; folder counts tick up.
 *  3. The phone, signed in to the same address, lights up with the new mail.
 *
 * One clock (motion's useAnimationFrame), container units throughout,
 * reduced motion = still finished frame. Decorative (aria-hidden).
 */

const DUR = 15000;
const T = {
  domainClick: 1200,
  dropdown: 1400,
  pick: 2200,
  userClick: 2700,
  userType: [2850, 3650] as const,
  create: 4300,
  ready: 4700,
  stream: [5300, 7300] as const,
  phone: 7600,
  reset: 14400,
};

const CURSOR = {
  // Measured from the rendered sheet (data-cursor targets), in % of the stage.
  rest: { x: 62, y: 74 },
  domain: { x: 38.8, y: 46.4 },
  option: { x: 38.9, y: 50.6 },
  user: { x: 38.8, y: 54.7 },
  create: { x: 42, y: 61.3 },
};

const USER = "jordan";
const typed = (text: string, t: number, [a, b]: readonly [number, number]) =>
  t <= a
    ? ""
    : t >= b
      ? text
      : text.slice(0, Math.round(((t - a) / (b - a)) * text.length));

export function HeroShowcase() {
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
  const ready = now >= T.ready;

  const cursor =
    now < T.domainClick - 600
      ? CURSOR.rest
      : now < T.pick - 350
        ? CURSOR.domain
        : now < T.userClick - 350
          ? CURSOR.option
          : now < T.create - 450
            ? CURSOR.user
            : now < T.ready + 200
              ? CURSOR.create
              : CURSOR.rest;
  const press = [T.domainClick, T.pick, T.userClick, T.create].some(
    (m) => now >= m && now < m + 170,
  );

  return (
    <div
      ref={stage}
      aria-hidden="true"
      className="@container relative isolate aspect-[16/12] w-full select-none [contain:layout_paint]"
      style={{
        fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <Backdrop />

      <Glass className="absolute left-[2%] top-[14%] w-[80%] rounded-[2.2cqw] p-[1.3cqw]">
        <div className="relative overflow-hidden rounded-[1cqw] bg-white text-[1.05cqw] text-[#1f2937] shadow-[0_0_0_0.06cqw_rgb(15_23_42/0.1)]">
          <TitleBar />
          <div className="grid h-[44cqw] grid-cols-[5%_21%_1fr]">
            <Rail />
            <HeroFolders now={now} />
            <div className="relative min-w-0">
              <AnimatePresence initial={false}>
                {ready ? (
                  <StreamingInbox key="inbox" now={now} />
                ) : (
                  <MessageListGhost key="ghost" />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Create-mailbox sheet */}
          <AnimatePresence>
            {!ready && loop && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.35 } }}
                className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b1430]/[0.08]"
              >
                <SetupSheet now={now} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Glass>

      {/* Phone */}
      <motion.div
        className="absolute left-[72%] top-[34%] z-20 w-[24%]"
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Glass className="rounded-[3cqw] p-[0.9cqw]">
          <HeroPhone now={now} loop={loop} />
        </Glass>
      </motion.div>

      {/* Ready callout */}
      <AnimatePresence>
        {ready && loop && now < T.stream[1] + 3500 && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute left-[20%] top-[90%] z-30 flex items-center gap-[0.9cqw] rounded-full bg-white py-[0.6cqw] pl-[0.6cqw] pr-[1.4cqw] text-[1.25cqw] shadow-[0_1.2cqw_3cqw_-1cqw_rgb(0_0_120/0.35),0_0_0_0.06cqw_rgb(15_23_42/0.06)]"
          >
            <span className="flex size-[2.3cqw] items-center justify-center rounded-full bg-success-fill text-white">
              <Check className="size-[1.25cqw]" />
            </span>
            <span className="font-semibold text-[#0f172a]">jordan@brightleaf.co</span>
            <span className="text-[#64748b]">is ready</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!reduced && (
        <motion.div
          className="pointer-events-none absolute z-40 w-[1.9cqw]"
          animate={{
            left: `${cursor.x}%`,
            top: `${cursor.y}%`,
            scale: press ? 0.8 : 1,
            opacity: loop && now < T.ready + 600 ? 1 : 0,
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

/* ── Setup sheet ─────────────────────────────────────────────────────── */

function SetupSheet({ now }: { now: number }) {
  const open = now >= T.dropdown && now < T.pick;
  const picked = now >= T.pick;
  const user = typed(USER, now, T.userType);
  const creating = now >= T.create;
  const caret = (on: boolean) =>
    on && (
      <span className="ml-[0.06cqw] inline-block h-[1.1em] w-[0.12cqw] translate-y-[0.2em] animate-pulse bg-primary" />
    );

  return (
    <motion.div
      initial={{ y: 24, opacity: 0, scale: 0.97 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -16, opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
      className="w-[46%] rounded-[1.3cqw] bg-white p-[2cqw] shadow-[0_0_0_0.06cqw_rgb(15_23_42/0.08),0_3cqw_6cqw_-1.5cqw_rgb(11_20_48/0.4)]"
    >
      <span className="relative block size-[3cqw]">
        <Image
          src="/brand/logo-mark-transparent.png"
          alt=""
          fill
          sizes="48px"
          className="object-contain"
        />
      </span>
      <p className="mt-[1.2cqw] text-[1.8cqw] font-semibold leading-tight tracking-[-0.02em] text-[#0f172a]">
        Create your mailbox
      </p>
      <p className="mt-[0.4cqw] text-[#64748b]">
        Email at the domain your customers already know.
      </p>

      <p className="mt-[1.4cqw] text-[0.9cqw] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
        Domain
      </p>
      <div data-cursor="domain" className="relative mt-[0.4cqw]">
        <div
          className={cn(
            "flex items-center justify-between rounded-[0.6cqw] px-[1cqw] py-[0.7cqw] shadow-[0_0_0_0.08cqw_#dfe3e9]",
            open &&
              "shadow-[0_0_0_0.12cqw_var(--color-primary),0_0_0_0.45cqw_rgb(0_0_255/0.12)]",
          )}
        >
          <span
            className={
              picked
                ? "flex items-center gap-[0.5cqw] font-medium text-[#0f172a]"
                : "text-[#94a3b8]"
            }
          >
            {picked && (
              <Icon
                d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
                className="size-[1cqw] text-primary"
              />
            )}
            {picked ? "brightleaf.co" : "Select a domain"}
          </span>
          <Icon d="m6 9 6 6 6-6" className="size-[1cqw] text-[#64748b]" />
        </div>
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-[110%] z-10 overflow-hidden rounded-[0.7cqw] bg-white p-[0.4cqw] shadow-[0_0_0_0.06cqw_rgb(15_23_42/0.1),0_1.4cqw_2.6cqw_-1cqw_rgb(15_23_42/0.35)]"
            >
              {[
                { d: "brightleaf.co", tag: "Connected" },
                { d: "brightleaf.studio", tag: "" },
              ].map((o, i) => (
                <li
                  data-cursor={i === 0 ? "option" : undefined}
                  key={o.d}
                  className={cn(
                    "flex items-center justify-between rounded-[0.5cqw] px-[0.8cqw] py-[0.6cqw]",
                    i === 0 && "bg-brand-50 font-medium text-primary",
                  )}
                >
                  {o.d}
                  {o.tag && (
                    <span className="rounded-full bg-success-soft px-[0.6cqw] text-[0.8cqw] font-semibold text-success">
                      {o.tag}
                    </span>
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-[1.2cqw] text-[0.9cqw] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
        Address
      </p>
      <div
        data-cursor="user"
        className={cn(
          "mt-[0.4cqw] flex items-center rounded-[0.6cqw] px-[1cqw] py-[0.7cqw] shadow-[0_0_0_0.08cqw_#dfe3e9]",
          now >= T.userClick &&
            now < T.create &&
            "shadow-[0_0_0_0.12cqw_var(--color-primary),0_0_0_0.45cqw_rgb(0_0_255/0.12)]",
        )}
      >
        <span className="font-medium text-[#0f172a]">
          {user}
          {caret(now >= T.userClick && now < T.create)}
        </span>
        <span className="text-[#64748b]">
          @{picked ? "brightleaf.co" : "your-domain"}
        </span>
        {now >= T.userType[1] && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto flex items-center gap-[0.3cqw] text-[0.85cqw] font-semibold text-success"
          >
            <Check className="size-[0.9cqw]" /> Available
          </motion.span>
        )}
      </div>

      <motion.span
        data-cursor="create"
        animate={{ scale: now >= T.create && now < T.create + 170 ? 0.96 : 1 }}
        className="mt-[1.6cqw] flex items-center justify-center gap-[0.6cqw] rounded-[0.7cqw] bg-primary py-[0.9cqw] font-semibold text-white shadow-[0_0.6cqw_1.2cqw_-0.5cqw_rgb(0_0_255/0.7)]"
      >
        {creating ? (
          <>
            <span className="size-[1cqw] animate-spin rounded-full border-[0.18cqw] border-white/35 border-t-white" />{" "}
            Creating mailbox
          </>
        ) : (
          "Create mailbox"
        )}
      </motion.span>
      <p className="mt-[0.9cqw] flex items-center justify-center gap-[0.4cqw] text-[0.85cqw] text-[#64748b]">
        <Icon
          d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z"
          className="size-[0.9cqw] text-success"
        />{" "}
        Encrypted with TLS · works in any email app
      </p>
    </motion.div>
  );
}

/* ── Folders with live counts ───────────────────────────────────────── */

const FOLDERS = [
  {
    label: "Inbox",
    inbox: true,
    d: "M3 13h4l1.5 2h7L17 13h4M3 13l2.5-7h13L21 13v6H3Z",
  },
  { label: "Drafts", d: "M4 20h4L19 9l-4-4L4 16Z" },
  { label: "Sent Items", d: "m4 12 16-8-6 16-2.5-6.5Z" },
  { label: "Deleted Items", d: "M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13" },
  { label: "Junk Email", d: "M12 3 3 20h18ZM12 10v4M12 17h.01" },
  { label: "Archive", d: "M4 7h16v3H4ZM5 10v10h14V10M10 14h4" },
];

function HeroFolders({ now }: { now: number }) {
  const ready = now >= T.ready;
  const arrived = ready ? STREAM.filter((_, i) => now >= arriveAt(i)).length : 0;
  return (
    <div className="min-w-0 border-r border-[#edf0f4] px-[0.6cqw] pt-[0.8cqw]">
      <p className="flex items-center gap-[0.5cqw] truncate px-[0.5cqw] py-[0.35cqw] font-medium text-[#374151]">
        <Icon d="m6 9 6 6 6-6" className="size-[0.85cqw]" />
        {ready ? "jordan@brightleaf.co" : "New account"}
      </p>
      {FOLDERS.map((f) => (
        <div
          key={f.label}
          className={cn(
            "flex items-center gap-[0.6cqw] rounded-[0.35cqw] py-[0.45cqw] pl-[1.6cqw] pr-[0.6cqw]",
            f.inbox ? "bg-brand-100/70 font-semibold text-[#111827]" : "text-[#4b5563]",
          )}
        >
          <Icon d={f.d} className="size-[1cqw]" />
          <span className="flex-1 truncate">{f.label}</span>
          {f.inbox && arrived > 0 && (
            <motion.span
              key={arrived}
              initial={{ scale: 1.7 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.45 }}
              className="font-semibold text-primary tabular-nums"
            >
              {arrived}
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

/* ── Inbox filling with mail ────────────────────────────────────────── */

const STREAM = [
  {
    logo: true,
    name: "Serverlys",
    subject: "Welcome to your new mailbox",
    preview: "Connect Outlook, Apple Mail and your phone in a minute…",
    time: "now",
  },
  {
    av: "/email/avatars/ethan.webp",
    name: "Alex Rivera",
    subject: "Great meeting yesterday",
    preview: "Could you send over the proposal and…",
    time: "now",
  },
  {
    av: "/email/avatars/sara.webp",
    name: "Sara Okafor",
    subject: "Logo files: final versions",
    preview: "Attached in every format you asked for…",
    time: "now",
    clip: true,
  },
  {
    ini: "MB",
    tone: "bg-brand-900",
    name: "Maya Brooks",
    subject: "Q4 brand refresh",
    preview: "Can you share a link to the moodboards…",
    time: "now",
  },
  {
    ini: "RP",
    tone: "bg-success-fill",
    name: "Riley Park",
    subject: "Invoice #2291 paid",
    preview: "Payment received, thank you…",
    time: "now",
  },
];
const arriveAt = (i: number) =>
  T.stream[0] + (i * (T.stream[1] - T.stream[0])) / (STREAM.length - 1);

function StreamingInbox({ now }: { now: number }) {
  const shown = STREAM.filter((_, i) => now >= arriveAt(i));
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 grid grid-cols-[46%_1fr]"
    >
      <div className="min-w-0 overflow-hidden border-r border-[#edf0f4]">
        <div className="flex items-center gap-[1.4cqw] px-[1cqw] pb-[0.4cqw] pt-[0.8cqw]">
          <span className="border-b-[0.18cqw] border-primary pb-[0.25cqw] font-semibold text-[#111827]">
            Focused
          </span>
          <span className="pb-[0.25cqw] text-[#6b7280]">Other</span>
        </div>
        <p className="px-[1cqw] pb-[0.2cqw] pt-[0.3cqw] text-[0.88cqw] font-medium text-[#374151]">
          Today
        </p>
        <AnimatePresence initial={false}>
          {[...shown].reverse().map((m, i) => (
            <motion.div
              key={m.name}
              layout
              initial={{ opacity: 0, x: -24, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className={cn(
                "flex gap-[0.7cqw] px-[1cqw] py-[0.6cqw]",
                i === 0 &&
                  "bg-brand-100/70 shadow-[inset_0.2cqw_0_0_var(--color-primary)]",
              )}
            >
              {m.logo ? (
                <span className="relative flex size-[2.3cqw] shrink-0 items-center justify-center rounded-full bg-brand-50">
                  <Image
                    src="/brand/logo-mark-transparent.png"
                    alt=""
                    width={28}
                    height={28}
                    className="size-[1.6cqw] object-contain"
                  />
                </span>
              ) : m.av ? (
                <Avatar src={m.av} className="size-[2.3cqw]" />
              ) : (
                <span
                  className={cn(
                    "flex size-[2.3cqw] shrink-0 items-center justify-center rounded-full text-[0.8cqw] font-semibold text-white",
                    m.tone,
                  )}
                >
                  {m.ini}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between">
                  <span className="truncate font-semibold text-[#111827]">
                    {m.name}
                  </span>
                  <span className="text-[0.82cqw] font-semibold text-primary">
                    {m.time}
                  </span>
                </span>
                <span className="block truncate font-medium text-[#1f2937]">
                  {m.subject}
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
              </span>
              <span className="mt-[0.4cqw] size-[0.6cqw] shrink-0 rounded-full bg-primary" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Welcome message */}
      <div className="min-w-0 p-[1.4cqw]">
        <p className="text-[1.4cqw] font-semibold leading-tight text-[#111827]">
          Welcome to your new mailbox
        </p>
        <div className="mt-[1cqw] flex items-center gap-[0.7cqw]">
          <span className="flex size-[2.6cqw] items-center justify-center rounded-full bg-brand-50">
            <Image
              src="/brand/logo-mark-transparent.png"
              alt=""
              width={32}
              height={32}
              className="size-[1.8cqw] object-contain"
            />
          </span>
          <span className="leading-tight">
            <span className="block font-semibold text-[#111827]">Serverlys</span>
            <span className="block text-[0.85cqw] text-[#6b7280]">
              to jordan@brightleaf.co
            </span>
          </span>
        </div>
        <p className="mt-[1.1cqw] leading-[1.6] text-[#374151]">
          Your address is live. Every message you send now shows your own domain.
        </p>
        <div className="mt-[1.1cqw] space-y-[0.6cqw]">
          {[
            { t: "Mailbox created", s: "jordan@brightleaf.co" },
            { t: "Encrypted with TLS", s: "Webmail, IMAP, POP3 and SMTP" },
            { t: "Ready on every device", s: "Outlook, Apple Mail, iPhone, Android" },
          ].map((r, i) => (
            <motion.div
              key={r.t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.25 }}
              className="flex items-center gap-[0.7cqw] rounded-[0.6cqw] px-[0.8cqw] py-[0.55cqw] shadow-[0_0_0_0.06cqw_#e5e8ee]"
            >
              <span className="flex size-[1.7cqw] items-center justify-center rounded-full bg-success-soft text-success">
                <Check className="size-[0.95cqw]" />
              </span>
              <span className="leading-tight">
                <span className="block font-medium text-[#111827]">{r.t}</span>
                <span className="block text-[0.85cqw] text-[#6b7280]">{r.s}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/** Before the account exists: the client, faint, with nothing in it. */
function MessageListGhost() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="absolute inset-0 opacity-50 [filter:grayscale(1)]"
    >
      <MessageList />
    </motion.div>
  );
}

/* ── Phone ──────────────────────────────────────────────────────────── */

function HeroPhone({ now, loop }: { now: number; loop: boolean }) {
  const lit = now >= T.phone && loop;
  const count = lit ? STREAM.filter((_, i) => now >= arriveAt(i)).length : 0;
  return (
    <div className="relative aspect-[9/18.5] overflow-hidden rounded-[2.2cqw] bg-white text-[0.82cqw] text-[#111827] shadow-[0_0_0_0.06cqw_rgb(15_23_42/0.12)]">
      <div className="bg-[linear-gradient(180deg,var(--color-primary),var(--color-brand-500))] px-[0.9cqw] pb-[0.8cqw] pt-[0.6cqw] text-white">
        <div className="flex items-center justify-between text-[0.75cqw] font-semibold">
          <span>9:41</span>
          <span>100%</span>
        </div>
        <div className="mt-[0.7cqw] flex items-center gap-[0.6cqw]">
          <span className="relative size-[1.9cqw] overflow-hidden rounded-full bg-white">
            <Image
              src="/email/avatars/mia.webp"
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-[1.2cqw] font-semibold">Inbox</span>
            <span className="block truncate text-[0.72cqw] text-white/80">
              jordan@brightleaf.co
            </span>
          </span>
          {count > 0 && (
            <span className="ml-auto rounded-full bg-white px-[0.5cqw] text-[0.75cqw] font-bold text-primary">
              {count}
            </span>
          )}
        </div>
      </div>
      {lit ? (
        <div>
          {[...STREAM.filter((_, i) => now >= arriveAt(i))].reverse().map((m) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-[0.6cqw] border-b border-[#f1f3f6] px-[0.9cqw] py-[0.65cqw]"
            >
              {m.logo ? (
                <span className="flex size-[2.1cqw] shrink-0 items-center justify-center rounded-full bg-brand-50">
                  <Image
                    src="/brand/logo-mark-transparent.png"
                    alt=""
                    width={24}
                    height={24}
                    className="size-[1.4cqw] object-contain"
                  />
                </span>
              ) : m.av ? (
                <Avatar src={m.av} className="size-[2.1cqw]" />
              ) : (
                <span
                  className={cn(
                    "flex size-[2.1cqw] shrink-0 items-center justify-center rounded-full text-[0.7cqw] font-semibold text-white",
                    m.tone,
                  )}
                >
                  {m.ini}
                </span>
              )}
              <span className="min-w-0 flex-1 leading-tight">
                <span className="flex items-center justify-between">
                  <span className="truncate font-semibold">{m.name}</span>
                  <span className="text-[0.7cqw] font-semibold text-primary">now</span>
                </span>
                <span className="block truncate font-medium">{m.subject}</span>
                <span className="block truncate text-[0.72cqw] text-[#6b7280]">
                  {m.preview}
                </span>
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center px-[1.4cqw] pt-[5cqw] text-center">
          <span className="flex size-[4cqw] items-center justify-center rounded-full bg-brand-50">
            <Icon d="M3 6h18v12H3ZM3 7l9 6 9-6" className="size-[2cqw] text-primary" />
          </span>
          <p className="mt-[1cqw] font-semibold">Signing in…</p>
          <p className="mt-[0.3cqw] text-[0.75cqw] text-[#6b7280]">
            jordan@brightleaf.co
          </p>
          <span className="mt-[1.2cqw] size-[1.6cqw] animate-spin rounded-full border-[0.2cqw] border-brand-100 border-t-primary" />
        </div>
      )}
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
