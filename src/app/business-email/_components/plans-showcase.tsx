"use client";

import { useId, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedAfterMount } from "./use-reduced";

/**
 * The plans, at product-launch quality: a team-size slider that points at the
 * plan that fits, three cards with a capacity readout (one slot per mailbox,
 * a storage bar measured against the biggest plan) and the per-mailbox price,
 * which is just price ÷ accounts. The popular plan is the dark, lit card.
 *
 * Every figure comes from PLANS in page.tsx (the WHMCS catalogue); nothing
 * here is invented. motion only; brand palette only.
 */

export type PlanCard = {
  slug: string;
  name: string;
  fit: string;
  price: number;
  storageGb: number;
  accounts: number;
  popular?: boolean;
  href: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_SLOTS = 20;

const money = (n: number) => `$${n.toFixed(2)}`;

export function PlansShowcase({
  plans,
  setupFee,
}: {
  plans: readonly PlanCard[];
  setupFee: number;
}) {
  const reduced = useReducedAfterMount();
  const sliderId = useId();
  const maxAccounts = Math.max(...plans.map((p) => p.accounts));
  const maxStorage = Math.max(...plans.map((p) => p.storageGb));
  const [team, setTeam] = useState(
    plans.find((p) => p.popular)?.accounts ?? plans[0].accounts,
  );
  const fits =
    [...plans].sort((a, b) => a.accounts - b.accounts).find((p) => p.accounts >= team) ??
    plans[plans.length - 1];

  return (
    <>
      {/* Team-size finder */}
      <div className="mx-auto mt-10 max-w-[560px] rounded-2xl bg-white/80 p-5 shadow-[0_1px_2px_rgb(15_23_42/0.06),0_12px_32px_-12px_rgb(0_0_255/0.18)] ring-1 ring-brand-100 backdrop-blur sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={sliderId} className="min-w-0 flex-1 text-small font-medium text-fg">
            How many mailboxes do you need?
          </label>
          <p className="shrink-0 text-small text-fg-secondary" aria-live="polite">
            <span className="font-display text-[28px] font-semibold leading-none tracking-[-0.02em] text-primary tabular-nums">
              {team}
            </span>{" "}
            {team === 1 ? "mailbox" : "mailboxes"}
          </p>
        </div>
        <input
          id={sliderId}
          type="range"
          min={1}
          max={maxAccounts}
          value={team}
          onChange={(e) => setTeam(Number(e.target.value))}
          aria-valuetext={`${team} mailboxes, ${fits.name} fits`}
          className="plan-range mt-4 w-full"
          style={{ "--fill": `${((team - 1) / (maxAccounts - 1)) * 100}%` } as React.CSSProperties}
        />
        <div className="relative mt-2 h-4 text-caption text-fg-muted" aria-hidden="true">
          {[1, ...plans.map((p) => p.accounts)].map((n) => (
            <span
              key={n}
              className={cn(
                "absolute -translate-x-1/2 tabular-nums",
                n === fits.accounts && "font-semibold text-primary",
              )}
              style={{ left: `calc(12px + (100% - 24px) * ${(n - 1) / (maxAccounts - 1)})` }}
            >
              {n}
            </span>
          ))}
        </div>
        <p className="mt-3 text-center text-small text-fg-secondary">
          <span className="font-semibold text-fg">{fits.name}</span> fits {team}{" "}
          {team === 1 ? "mailbox" : "mailboxes"}, at{" "}
          <span className="font-semibold text-fg">{money(fits.price)}/mo</span>.
        </p>
      </div>

      <ul className="mx-auto mt-14 grid max-w-[520px] items-stretch gap-6 lg:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-5">
        {plans.map((p, i) => (
          <Card
            key={p.slug}
            plan={p}
            index={i}
            fits={p.slug === fits.slug}
            maxStorage={maxStorage}
            setupFee={setupFee}
            reduced={reduced}
          />
        ))}
      </ul>
    </>
  );
}

function Card({
  plan: p,
  index,
  fits,
  maxStorage,
  setupFee,
  reduced,
}: {
  plan: PlanCard;
  index: number;
  fits: boolean;
  maxStorage: number;
  setupFee: number;
  reduced: boolean;
}) {
  const dark = !!p.popular;
  const perMailbox = p.price / p.accounts;
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const play = reduced || seen;

  const body = (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[23px] p-5 min-[400px]:p-7 sm:p-8",
        dark
          ? "bg-[linear-gradient(165deg,#0f1f4d,#071230_50%,#040b22)] text-white"
          : "bg-white text-fg",
      )}
    >
      {dark && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(31_85_255/0.55),transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(34_211_238/0.16),transparent)]"
          />
        </>
      )}

      <div className="relative">
        <h3 className={cn("text-h4 font-semibold", dark ? "text-white" : "text-fg")}>{p.name}</h3>
        <p className={cn("mt-1 text-small", dark ? "text-white/65" : "text-fg-secondary")}>
          {p.fit}
        </p>
      </div>

      <div className="relative mt-8 flex items-end gap-1.5">
        <span className="font-display text-[56px] font-semibold leading-[0.9] tracking-[-0.035em]">
          <span className="align-top text-[0.5em] leading-none">$</span>
          {p.price.toFixed(2)}
        </span>
        <span className={cn("pb-1 text-body", dark ? "text-white/60" : "text-fg-secondary")}>
          /mo
        </span>
      </div>
      <p
        className={cn(
          "relative mt-3 w-fit whitespace-nowrap rounded-full px-2.5 py-1 text-caption font-medium",
          dark ? "bg-white/10 text-[#7dd3fc]" : "bg-success/10 text-success",
        )}
      >
        Works out to {money(perMailbox)} per mailbox
      </p>

      <a
        href={p.href}
        className={cn(
          "group relative mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl text-body font-semibold transition-all",
          dark
            ? "bg-primary text-white shadow-[0_10px_30px_-8px_rgb(0_0_255/0.8),inset_0_1px_0_rgb(255_255_255/0.25)] hover:bg-[#1f55ff]"
            : "bg-white text-primary ring-1 ring-inset ring-primary hover:bg-primary hover:text-white",
        )}
      >
        Choose plan
        <svg
          viewBox="0 0 16 16"
          className="size-4 transition-transform group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </a>
      <p className={cn("relative mt-3 text-center text-caption", dark ? "text-white/50" : "text-fg-muted")}>
        Billed monthly · one-time {money(setupFee)} setup fee
      </p>

      {/* Capacity readout */}
      <div
        className={cn(
          "relative mt-7 rounded-2xl p-4",
          dark ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-canvas-secondary ring-1 ring-line",
        )}
      >
        <div className="flex items-baseline justify-between text-caption">
          <span className={dark ? "text-white/60" : "text-fg-secondary"}>Mailboxes</span>
          <span className="font-semibold tabular-nums">{p.accounts} accounts</span>
        </div>
        <div className="mt-2.5 grid grid-cols-10 gap-1" aria-hidden="true">
          {Array.from({ length: MAX_SLOTS }, (_, s) => {
            const on = s < p.accounts;
            return (
              <motion.span
                key={s}
                className={cn(
                  "h-2.5 rounded-[3px]",
                  on
                    ? dark
                      ? "bg-[linear-gradient(180deg,#5b8cff,var(--color-primary))] shadow-[0_0_8px_rgb(31_85_255/0.7)]"
                      : "bg-primary"
                    : dark
                      ? "bg-white/10"
                      : "bg-brand-100/70",
                )}
                {...(reduced || !on
                  ? {}
                  : {
                      initial: { opacity: 0, scale: 0.4 },
                      animate: play ? { opacity: 1, scale: 1 } : undefined,
                      transition: { duration: 0.4, delay: 0.3 + index * 0.1 + s * 0.035, ease: EASE },
                    })}
              />
            );
          })}
        </div>

        <div className="mt-4 flex items-baseline justify-between text-caption">
          <span className={dark ? "text-white/60" : "text-fg-secondary"}>Storage</span>
          <span className="font-semibold tabular-nums">{p.storageGb} GB</span>
        </div>
        <div
          className={cn("mt-2 h-2 overflow-hidden rounded-full", dark ? "bg-white/10" : "bg-brand-100/70")}
          aria-hidden="true"
        >
          <motion.div
            className={cn(
              "h-full origin-left rounded-full",
              dark
                ? "bg-[linear-gradient(90deg,var(--color-primary),#22d3ee)]"
                : "bg-[linear-gradient(90deg,var(--color-brand-400),var(--color-primary))]",
            )}
            style={{ width: `${(p.storageGb / maxStorage) * 100}%` }}
            {...(reduced
              ? {}
              : {
                  initial: { scaleX: 0 },
                  animate: play ? { scaleX: 1 } : undefined,
                  transition: { duration: 1.2, delay: 0.4 + index * 0.1, ease: EASE },
                })}
          />
        </div>
      </div>

      <ul className="relative mt-6 flex flex-col gap-3">
        {[
          `${p.accounts} email accounts`,
          `${p.storageGb} GB email storage`,
          "Email at your own domain",
          "Webmail, IMAP, POP3 and SMTP",
          "Encrypted TLS connections",
        ].map((f) => (
          <li key={f} className={cn("flex gap-2.5 text-small", dark ? "text-white/90" : "text-fg")}>
            <span
              className={cn(
                "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full",
                dark
                  ? "bg-gradient-to-br from-brand-400 to-primary text-white shadow-[0_0_12px_rgb(31_85_255/0.6)]"
                  : "bg-brand-50 text-primary",
              )}
            >
              <svg
                viewBox="0 0 16 16"
                className="size-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <motion.li
      ref={ref}
      className={cn("relative", dark && "lg:-my-5")}
      {...(reduced
        ? {}
        : {
            initial: { opacity: 0, y: 40 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.25 },
            transition: { duration: 0.9, delay: index * 0.1, ease: EASE },
          })}
    >
      {dark && (
        <div
          aria-hidden="true"
          className="absolute -inset-4 -z-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_45%,rgb(0_0_255/0.28),transparent_75%)]"
        />
      )}
      {(dark || fits) && (
        <div className="absolute inset-x-0 -top-3.5 z-10 flex justify-center gap-1.5">
          {dark && (
            <span className="rounded-full bg-[linear-gradient(110deg,var(--color-brand-400),#22d3ee)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#04102e] shadow-[0_6px_18px_-4px_rgb(34_211_238/0.6)]">
              Most popular
            </span>
          )}
          {fits && (
            <motion.span
              layoutId={reduced ? undefined : "plan-fits"}
              className="rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_6px_18px_-4px_rgb(0_0_255/0.6)]"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            >
              Fits your team
            </motion.span>
          )}
        </div>
      )}
      <motion.div
        className={cn(
          "h-full rounded-3xl p-px transition-shadow duration-300",
          dark
            ? "bg-[linear-gradient(150deg,rgb(148_180_255/0.7),rgb(255_255_255/0.08)_40%,rgb(34_211_238/0.45))] shadow-[0_30px_60px_-20px_rgb(4_11_34/0.55)]"
            : fits
              ? "bg-[linear-gradient(150deg,var(--color-primary),var(--color-brand-200))] shadow-[0_20px_50px_-24px_rgb(0_0_255/0.45)]"
              : "bg-line shadow-[0_1px_2px_rgb(15_23_42/0.04),0_12px_32px_-16px_rgb(15_23_42/0.12)] hover:shadow-[0_24px_48px_-20px_rgb(15_23_42/0.22)]",
        )}
        whileHover={reduced ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {body}
      </motion.div>
    </motion.li>
  );
}

const INCLUDED: readonly { label: string; icon: string }[] = [
  { label: "An address at your own domain", icon: "M2.5 5.5h11v7h-11zM2.5 5.5 8 9.5l5.5-4" },
  { label: "Webmail in any browser", icon: "M2 3.5h12v9H2zM2 6h12M4 4.75h.01M5.5 4.75h.01" },
  { label: "Works in Outlook and Apple Mail", icon: "M2.5 3h11v7.5h-11zM6 13h4M8 10.5V13" },
  { label: "Works on iPhone and Android", icon: "M5 1.5h6v13H5zM7.25 12.5h1.5" },
  { label: "IMAP, POP3 and secure SMTP", icon: "M3 5h8l-2-2M13 11H5l2 2" },
  { label: "Encrypted TLS connections", icon: "M4 7h8v6.5H4zM5.5 7V5a2.5 2.5 0 0 1 5 0v2" },
  { label: "Mailboxes moved with your site", icon: "M2 8h9M8 4.5 11.5 8 8 11.5M13.5 3v10" },
  { label: "Support from real people", icon: "M8 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 14c.5-2.75 2.5-4 5-4s4.5 1.25 5 4" },
  { label: "Upgrade as your team grows", icon: "M2.5 12.5 6.5 8.5l2.5 2.5 4.5-5M10 6h3.5v3.5" },
];

const SERVER_FACTS = ["mail.serverlys.com", "IMAP 993", "POP3 995", "SMTP 465 / 587", "TLS · Let's Encrypt"];

export function IncludedPanel() {
  const reduced = useReducedAfterMount();
  return (
    <motion.div
      className="mx-auto mt-16 max-w-[1080px] overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04),0_24px_60px_-28px_rgb(0_0_255/0.25)] ring-1 ring-brand-100"
      {...(reduced
        ? {}
        : {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.25 },
            transition: { duration: 0.9, ease: EASE },
          })}
    >
      <div className="px-6 pb-2 pt-9 text-center sm:px-10">
        <p className="font-display text-[26px] font-normal leading-tight tracking-[-0.02em] text-fg sm:text-[30px]">
          Every plan has <span className="text-primary">everything you need</span>
        </p>
        <p className="mt-2 text-small text-fg-secondary">
          Plans differ only in mailboxes and storage. The rest is the same on all three.
        </p>
      </div>
      <ul className="grid gap-px bg-line/60 sm:grid-cols-2 lg:grid-cols-3 [&>li]:bg-white">
        {INCLUDED.map((f) => (
          <li key={f.label} className="flex items-center gap-3.5 px-6 py-5 sm:px-8 sm:last:col-span-2 sm:last:justify-center lg:last:col-span-1 lg:last:justify-start">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(150deg,var(--color-brand-50),#fff)] text-primary ring-1 ring-brand-100">
              <svg
                viewBox="0 0 16 16"
                className="size-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={f.icon} />
              </svg>
            </span>
            <span className="text-small font-medium text-fg">{f.label}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-center gap-2 bg-[linear-gradient(165deg,#0f1f4d,#071230)] px-6 py-5">
        <span className="mr-1 flex items-center gap-2 text-caption text-white/60">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-success/70 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-success" />
          </span>
          Every mailbox runs on
        </span>
        {SERVER_FACTS.map((s) => (
          <span
            key={s}
            className="rounded-md bg-white/[0.07] px-2.5 py-1 font-mono text-[12px] text-[#bfd2ff] ring-1 ring-white/10"
          >
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
