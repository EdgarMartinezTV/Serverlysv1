"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedAfterMount } from "./use-reduced";
import { Avatar, Check, Icon } from "./inbox-showcase";

/**
 * The feature tabs, at product-launch quality: a heading, a tab bar whose
 * pills fill as each chapter plays (auto-advancing, paused on hover/focus and
 * off screen), and a spotlit panel where each chapter is a scene — a photo
 * with real product UI floating over it in glass, animating in.
 *
 * Every number is real: plans and storage from the WHMCS catalogue, the mail
 * server, ports and certificate issuer probed on mail.serverlys.com.
 * motion only; brand palette only; reduced motion = no auto-advance.
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
  image: string;
  imageAlt: string;
  focus: string;
};

const CHAPTERS: readonly Chapter[] = [
  {
    id: "setup",
    label: "Set-up",
    eyebrow: "Minutes, not a project",
    title: "Easy setup and migration",
    body: "Create the mailbox, add it to the apps you already use, and bring your old email with you when your site moves.",
    points: [
      "Connect Outlook, Apple Mail and your phone",
      "Existing email moved with your site",
      "Mailboxes at your own domain, ready to use",
    ],
    image: "/email/phone-email.webp",
    imageAlt: "A business owner reading her work email on her phone",
    focus: "50% 25%",
  },
  {
    id: "anywhere",
    label: "Anywhere",
    eyebrow: "One inbox, every device",
    title: "Your inbox, wherever you work",
    body: "Read in the browser, on your laptop or on your phone. Folders, read status and sent mail stay in sync everywhere.",
    points: [
      "Webmail in any browser, nothing to install",
      "IMAP and POP3 for every email app",
      "Send securely from any device with SMTP",
    ],
    image: "/email/laptop-email.webp",
    imageAlt: "A man replying to email on a laptop in a café",
    focus: "45% 50%",
  },
  {
    id: "scale",
    label: "Scale",
    eyebrow: "Grows with the team",
    title: "The inbox that scales with you",
    body: "Start with two mailboxes and move up as people join. Storage grows with the plan, and nothing is rebuilt.",
    points: [
      "From 2 accounts on Essentials to 20 on Enterprise Pro",
      "Up to 60 GB of storage for mail and attachments",
      "Move up a plan whenever the team grows",
    ],
    image: "/email/team-inbox.webp",
    imageAlt: "Two coworkers reading a shared inbox on a monitor",
    focus: "50% 40%",
  },
  {
    id: "security",
    label: "Security",
    eyebrow: "Private by default",
    title: "Encrypted on every connection",
    body: "Every connection to the mail server is encrypted, with a certificate that renews itself. Your mail stays on your domain.",
    points: [
      "TLS for webmail, IMAP, POP3 and SMTP",
      "Certificate issued and renewed automatically",
      "Real people on support when something looks wrong",
    ],
    image: "/email/owner-phone.webp",
    imageAlt: "A smiling man holding his phone",
    focus: "50% 22%",
  },
];

export function FeatureShowcase({ cta }: { cta: { label: string; href: string } }) {
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
      {/* Heading */}
      <div className="mx-auto max-w-[760px] text-center">
        <p className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-brand-200 ring-1 ring-white/10">
          <span className="size-1.5 rounded-full bg-accent-on-dark shadow-[0_0_10px_var(--color-accent-on-dark)]" />
          Built for real businesses
        </p>
        <h2
          id="features-title"
          className="mt-6 font-display text-[38px] font-normal leading-[1.05] tracking-[-0.03em] text-white sm:text-[56px]"
        >
          Everything a business inbox <span className="text-brand-300">should be</span>
        </h2>
      </div>

      {/* Tabs with progress */}
      <div
        role="tablist"
        aria-label="Business email features"
        className="relative mx-auto mt-12 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-white/[0.06] p-1.5 ring-1 ring-white/10 [scrollbar-width:none]"
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          const next =
            (active + (e.key === "ArrowRight" ? 1 : CHAPTERS.length - 1)) %
            CHAPTERS.length;
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
                "relative isolate h-11 shrink-0 overflow-hidden rounded-full px-6 text-small font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                on ? "text-fg" : "text-white/75 hover:text-white",
              )}
            >
              {on && (
                <motion.span
                  layoutId={`${base}-pill`}
                  className="absolute inset-0 -z-10 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
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
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="relative mt-8">
        <div
          aria-hidden="true"
          className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[48px] bg-[radial-gradient(60%_70%_at_70%_50%,rgb(0_0_255/0.35),transparent_70%)]"
        />
        <div className="rounded-[30px] bg-[linear-gradient(140deg,rgb(148_180_255/0.45),rgb(255_255_255/0.06)_35%,rgb(34_211_238/0.25))] p-px">
          <div
            id={`${base}-panel`}
            role="tabpanel"
            aria-labelledby={`${base}-tab-${active}`}
            className="grid overflow-hidden rounded-[29px] bg-[linear-gradient(160deg,#0d1a3d,#071230_55%,#050d24)] lg:grid-cols-[0.9fr_1.1fr]"
          >
            {/* Copy */}
            <div className="relative flex min-h-[420px] flex-col justify-center p-8 sm:p-12 lg:p-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <p className="text-caption font-semibold uppercase tracking-[0.14em] text-accent-on-dark">
                    {ch.eyebrow}
                  </p>
                  <h3 className="mt-4 font-display text-[30px] font-normal leading-[1.1] tracking-[-0.025em] text-white sm:text-[40px]">
                    {ch.title}
                  </h3>
                  <p className="mt-4 max-w-[440px] text-body text-white/65">
                    {ch.body}
                  </p>
                  <ul className="mt-7 flex flex-col gap-3.5">
                    {ch.points.map((p, i) => (
                      <motion.li
                        key={p}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.15 + i * 0.08,
                          duration: 0.45,
                          ease: EASE,
                        }}
                        className="flex items-start gap-3 text-body text-white/85"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-primary text-white shadow-[0_0_14px_rgb(31_85_255/0.6)]">
                          <Check className="size-3" />
                        </span>
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
              <a
                href={cta.href}
                className="group mt-9 inline-flex h-12 w-fit items-center gap-2 rounded-md bg-white px-6 text-body font-semibold text-primary shadow-[0_10px_30px_-10px_rgb(31_85_255/0.8)] transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {cta.label}
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            {/* Scene */}
            <div className="@container relative min-h-[380px] overflow-hidden lg:min-h-[560px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={ch.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <Image
                    src={ch.image}
                    alt={ch.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 660px, 100vw"
                    className="object-cover"
                    style={{ objectPosition: ch.focus }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,#071230_0%,rgb(7_18_48/0.35)_22%,transparent_45%),linear-gradient(0deg,rgb(5_13_36/0.55),transparent_45%)]" />
                </motion.div>
              </AnimatePresence>
              <div aria-hidden="true" className="absolute inset-0">
                <AnimatePresence mode="wait">
                  <Scene key={ch.id} id={ch.id} />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Floating product UI per chapter ─────────────────────────────────── */

function Card({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 150, damping: 20, delay }}
      className={cn(
        "absolute rounded-[1.8cqw] bg-white/[0.93] p-[2.2cqw] text-[2.15cqw] text-[#0f172a] shadow-[0_3cqw_6cqw_-2cqw_rgb(0_0_40/0.55),0_0_0_0.12cqw_rgb(255_255_255/0.6)]",
        className,
      )}
      style={{
        fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {children}
    </motion.div>
  );
}

function Scene({ id }: { id: string }) {
  if (id === "setup") return <SetupScene />;
  if (id === "anywhere") return <AnywhereScene />;
  if (id === "scale") return <ScaleScene />;
  return <SecurityScene />;
}

function Progress({ to, delay }: { to: number; delay: number }) {
  return (
    <div className="mt-[1cqw] h-[0.9cqw] overflow-hidden rounded-full bg-[#eef1f6]">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-primary"
        initial={{ width: "0%" }}
        animate={{ width: `${to}%` }}
        transition={{ duration: 2.4, delay, ease: EASE }}
      />
    </div>
  );
}

function SetupScene() {
  return (
    <>
      <Card className="left-[5%] top-[8%] w-[56%]" delay={0.25}>
        <p className="flex items-center gap-[1cqw] font-semibold">
          <span className="flex size-[4.4cqw] items-center justify-center rounded-[1cqw] bg-primary text-white">
            <Icon d="M3 6h18v12H3ZM3 7l9 6 9-6" className="size-[2.4cqw]" />
          </span>
          Add account
        </p>
        <div className="mt-[1.6cqw] space-y-[1cqw] text-[1.95cqw]">
          {[
            ["Email", "jordan@brightleaf.co"],
            ["Incoming", "mail.serverlys.com · 993 SSL"],
            ["Outgoing", "mail.serverlys.com · 465 SSL"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-[1.4cqw] rounded-[0.9cqw] bg-[#f4f6fa] px-[1.4cqw] py-[1cqw]"
            >
              <span className="text-[#64748b]">{k}</span>
              <span className="truncate font-medium">{v}</span>
            </div>
          ))}
        </div>
        <p className="mt-[1.4cqw] flex items-center gap-[0.8cqw] text-[1.95cqw] font-semibold text-success">
          <Check className="size-[2cqw]" /> Verified · syncing folders
        </p>
      </Card>
      <Card className="bottom-[9%] right-[5%] w-[48%]" delay={0.55}>
        <p className="flex items-center justify-between font-semibold">
          Moving your email
          <span className="text-[1.9cqw] font-medium text-primary">from old host</span>
        </p>
        <Progress to={86} delay={0.8} />
        <p className="mt-[1cqw] flex justify-between text-[1.85cqw] text-[#64748b]">
          <span>Inbox, Sent, Archive</span>
          <span className="tabular-nums">2,418 messages</span>
        </p>
      </Card>
    </>
  );
}

function AnywhereScene() {
  const devices = [
    { l: "Webmail", d: "M3 5h18v12H3ZM8 21h8M12 17v4" },
    { l: "Outlook", d: "M3 6h18v12H3ZM3 7l9 6 9-6" },
    { l: "Apple Mail", d: "M4 6h16v12H4ZM4 7l8 6 8-6" },
    { l: "iPhone", d: "M7 3h10v18H7ZM11 18h2" },
    { l: "Android", d: "M7 3h10v18H7ZM11 18h2" },
  ];
  return (
    <>
      <Card className="left-[5%] top-[8%] w-[60%]" delay={0.25}>
        <p className="font-semibold">Signed in on 5 devices</p>
        <div className="mt-[1.4cqw] grid grid-cols-5 gap-[1cqw]">
          {devices.map((d, i) => (
            <motion.div
              key={d.l}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.1 }}
              className="flex flex-col items-center gap-[0.6cqw] rounded-[1cqw] bg-[#f4f6fa] py-[1.2cqw] text-center text-[1.6cqw] font-medium"
            >
              <span className="relative">
                <Icon d={d.d} className="size-[3cqw] text-primary" />
                <span className="absolute -bottom-[0.3cqw] -right-[0.6cqw] flex size-[1.8cqw] items-center justify-center rounded-full bg-success-fill text-white">
                  <Check className="size-[1.1cqw]" />
                </span>
              </span>
              {d.l}
            </motion.div>
          ))}
        </div>
      </Card>
      <Card className="bottom-[9%] right-[5%] w-[52%]" delay={0.7}>
        <div className="flex items-center gap-[1.2cqw]">
          <Avatar src="/email/avatars/ethan.webp" className="size-[5cqw]" />
          <span className="min-w-0 leading-tight">
            <span className="flex items-center justify-between gap-[1cqw]">
              <span className="font-semibold">Alex Rivera</span>
              <span className="text-[1.7cqw] font-semibold text-primary">now</span>
            </span>
            <span className="block truncate font-medium">
              Re: Following up on our proposal
            </span>
            <span className="block truncate text-[1.85cqw] text-[#64748b]">
              Looks great, let&apos;s talk Thursday…
            </span>
          </span>
        </div>
        <p className="mt-[1.2cqw] flex items-center gap-[0.7cqw] text-[1.8cqw] text-[#64748b]">
          <Icon
            d="M21 12a9 9 0 1 1-6.2-8.6M21 4v5h-5"
            className="size-[1.9cqw] text-primary"
          />{" "}
          Read on phone · synced to laptop
        </p>
      </Card>
    </>
  );
}

function ScaleScene() {
  const team = [
    { a: "/email/avatars/mia.webp", n: "jordan@" },
    { a: "/email/avatars/sara.webp", n: "sara@" },
    { a: "/email/avatars/ethan.webp", n: "alex@" },
  ];
  return (
    <>
      <Card className="left-[5%] top-[8%] w-[54%]" delay={0.25}>
        <p className="flex items-center justify-between font-semibold">
          Team mailboxes
          <span className="rounded-full bg-brand-50 px-[1.2cqw] text-[1.8cqw] font-semibold text-primary">
            Business Plus
          </span>
        </p>
        <div className="mt-[1.4cqw] space-y-[0.9cqw]">
          {team.map((m, i) => (
            <motion.div
              key={m.n}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.12 }}
              className="flex items-center gap-[1.1cqw] rounded-[0.9cqw] bg-[#f4f6fa] px-[1.2cqw] py-[0.8cqw]"
            >
              <Avatar src={m.a} className="size-[3.6cqw]" />
              <span className="font-medium">
                {m.n}
                <span className="text-[#64748b]">brightleaf.co</span>
              </span>
              <Check className="ml-auto size-[2cqw] text-success" />
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-[1.1cqw] rounded-[0.9cqw] border-[0.15cqw] border-dashed border-brand-200 px-[1.2cqw] py-[0.8cqw] font-medium text-primary"
          >
            <span className="flex size-[3.6cqw] items-center justify-center rounded-full bg-brand-50">
              <Icon d="M12 5v14M5 12h14" className="size-[1.9cqw]" />
            </span>
            Add a mailbox · 3 of 5 used
          </motion.div>
        </div>
      </Card>
      <Card className="bottom-[9%] right-[5%] w-[46%]" delay={0.6}>
        <p className="flex items-center justify-between font-semibold">
          Storage
          <span className="tabular-nums text-[1.9cqw] font-medium text-[#64748b]">
            18.4 of 45 GB
          </span>
        </p>
        <Progress to={41} delay={0.8} />
        <p className="mt-[1.3cqw] flex items-center justify-between rounded-[0.9cqw] bg-brand-50 px-[1.2cqw] py-[0.9cqw] text-[1.85cqw]">
          <span>
            Enterprise Pro · <span className="font-semibold">20 accounts, 60 GB</span>
          </span>
          <span className="font-semibold text-primary">Upgrade</span>
        </p>
      </Card>
    </>
  );
}

function SecurityScene() {
  const protocols = [
    ["Webmail", "HTTPS"],
    ["IMAP", "993"],
    ["POP3", "995"],
    ["SMTP", "465 · 587"],
  ];
  return (
    <>
      <Card className="left-[5%] top-[8%] w-[52%]" delay={0.25}>
        <p className="flex items-center gap-[1.2cqw] font-semibold">
          <motion.span
            initial={{ scale: 0.6, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.4 }}
            className="flex size-[4.6cqw] items-center justify-center rounded-[1.1cqw] bg-success-fill text-white shadow-[0_0_3cqw_rgb(34_197_94/0.45)]"
          >
            <Icon
              d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z"
              className="size-[2.5cqw]"
            />
          </motion.span>
          <span className="leading-tight">
            Connection encrypted
            <span className="block text-[1.85cqw] font-medium text-[#64748b]">
              mail.serverlys.com
            </span>
          </span>
        </p>
        <div className="mt-[1.6cqw] grid grid-cols-2 gap-[0.9cqw]">
          {protocols.map(([p, port], i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.08 }}
              className="flex items-center justify-between rounded-[0.9cqw] bg-[#f4f6fa] px-[1.2cqw] py-[0.9cqw] text-[1.9cqw]"
            >
              <span className="font-medium">{p}</span>
              <span className="flex items-center gap-[0.5cqw] text-success">
                <Check className="size-[1.7cqw]" />
                <span className="tabular-nums text-[#64748b]">{port}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
      <Card className="bottom-[9%] right-[5%] w-[46%]" delay={0.6}>
        <p className="font-semibold">Certificate</p>
        <div className="mt-[1cqw] space-y-[0.7cqw] text-[1.9cqw]">
          <p className="flex justify-between">
            <span className="text-[#64748b]">Issued by</span>{" "}
            <span className="font-medium">Let&apos;s Encrypt</span>
          </p>
          <p className="flex justify-between">
            <span className="text-[#64748b]">Covers</span>{" "}
            <span className="font-medium">*.serverlys.com</span>
          </p>
          <p className="flex justify-between">
            <span className="text-[#64748b]">Renewal</span>{" "}
            <span className="font-medium text-success">Automatic</span>
          </p>
        </div>
      </Card>
    </>
  );
}
