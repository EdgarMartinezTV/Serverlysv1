import Image from "next/image";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { JsonLd } from "@/components/ui/json-ld";
import { Reveal } from "@/components/animations/reveal";
import { Icon, type IconName } from "@/components/retell/icons";
import { faqGraph, pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import { formatPrice, groupById } from "@/data/pricing";
import { EarningsCalculator } from "./_components/earnings-calculator";
import {
  CONVO_MONTHLY,
  CONVO_MONTHLY_VALUE,
  CONVO_TOTAL,
  FAQS,
  HOSTING_MAX,
  HOSTING_MIN,
  HOSTING_MIN_VALUE,
  PCT,
  PROMISES,
  STEPS,
  TERMS,
  USES,
} from "./_content";

/**
 * /affiliates — the affiliate program. First built 2026-10-25 on the shared
 * Retell-style kit, then given its own premium layout the same day on
 * Edgar's ask: a dark brand-blue hero with an illustrated affiliate panel, an
 * asymmetric commission bento, a live earnings calculator, framed photo
 * cards and an editorial FAQ.
 *
 * Design rules carried over from the rest of the site, deliberately:
 *  - The hero does NOT animate in (LCP; see the reveal note in globals.css).
 *    Only below-fold sections use <Reveal>.
 *  - On dark surfaces: solid fills are `primary` (#0000ff), accent text is
 *    brand-400 and nothing lighter, hairlines are white/10.
 *  - Headings carry an explicit colour, because globals.css sets h1–h6 colour
 *    on the element and would otherwise paint them near-black on the dark bands.
 *
 * Every number comes from _content.ts (TERMS) or data/pricing.ts. The hero
 * panel is an illustration, aria-hidden, and its rows are the program's real
 * rates rather than invented totals.
 *
 * ⚠ NOINDEX until Edgar launches the program publicly. Flip `index` here and
 * `indexable` in data/routes.ts together, and add the footer link.
 */

const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], display: "swap" });
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";
const INK = "text-[#0b1530]";
const MUTED = "text-[#5b6472]";

const PATH = "/affiliates";
const DESCRIPTION = `Earn ${PCT(TERMS.hostingFirstPayment)} of the first payment on Serverlys hosting and ${PCT(TERMS.convoShare)} of ConvoAI Pro for ${TERMS.convoMonths} months. Free to join, paid monthly.`;

export const metadata = pageMetadata({
  title: "Affiliate Program — Earn Recommending Serverlys | Serverlys",
  description: DESCRIPTION,
  path: PATH,
  index: false,
});

const CLOUD = groupById("cloud");

/* ── Small parts ─────────────────────────────────────────────────────────── */

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={cn(
        "inline-flex w-max items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase",
        dark
          ? "bg-white/[0.06] text-white/75 ring-1 ring-white/10"
          : "bg-[#0b1530]/[0.04] text-[#0b1530]/70 ring-1 ring-[#0b1530]/[0.06]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", dark ? "bg-brand-400" : "bg-primary")}
      />
      {children}
    </p>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
    </svg>
  );
}

/** Pill CTA with the arrow in its own island, which shifts on hover. */
function PillCta({
  href,
  children,
  tone = "blue",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "blue" | "white";
}) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex h-14 items-center gap-4 rounded-full pr-2 pl-7 text-[15px] font-semibold transition-transform duration-500 active:scale-[0.98]",
        EASE,
        tone === "blue"
          ? "bg-primary text-white shadow-[0_10px_30px_-10px_rgb(0_0_255/0.7)] hover:bg-brand-700"
          : "bg-white text-[#0b1530] hover:bg-white/90",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400",
      )}
    >
      {children}
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105",
          EASE,
          tone === "blue" ? "bg-white/15" : "bg-[#0b1530]/[0.06]",
        )}
      >
        <Arrow />
      </span>
    </a>
  );
}

/** Outer tray + inner plate — the double bezel every card on this page sits in. */
function Bezel({
  children,
  className,
  inner,
  dark,
}: {
  children: React.ReactNode;
  className?: string;
  inner?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[2rem] p-1.5",
        dark
          ? "bg-white/[0.04] ring-1 ring-white/10"
          : "bg-[#0b1530]/[0.03] ring-1 ring-[#0b1530]/[0.05]",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-[calc(2rem-0.375rem)]",
          dark
            ? "bg-[#0a1130] shadow-[inset_0_1px_1px_rgb(255_255_255/0.08)]"
            : "bg-white shadow-[inset_0_1px_1px_rgb(255_255_255/0.9),0_1px_2px_rgb(11_21_48/0.04)]",
          inner,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Hero illustration: an affiliate panel built from the real rates ───── */

function AffiliatePanel() {
  const rows = [
    {
      what: "ConvoAI Pro",
      detail: `Payment 3 of ${TERMS.convoMonths}`,
      amount: CONVO_MONTHLY,
      state: "Pending",
    },
    {
      what: "Starter Cloud",
      detail: "First payment",
      amount: HOSTING_MIN,
      state: "Pending",
    },
    {
      what: "ConvoAI Pro",
      detail: `Payment 2 of ${TERMS.convoMonths}`,
      amount: CONVO_MONTHLY,
      state: "Available",
    },
  ];
  return (
    <div aria-hidden="true" className="relative">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(0_0_255/0.45),transparent)] blur-2xl" />
      <Bezel dark inner="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-white/80">Your affiliate link</p>
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-300/20">
            Active
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-white/[0.04] py-2.5 pr-2.5 pl-4 ring-1 ring-white/10">
          <span className="truncate font-mono text-[12.5px] text-white/85">
            serverlys.com/aff.php?aff=1024
          </span>
          <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-white">
            Copy
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2">
          {[
            ["Cookie", `${TERMS.cookieDays} days`],
            ["Hold", `${TERMS.holdDays} days`],
            ["Payout from", `$${TERMS.minPayout}`],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/[0.06]"
            >
              <dt className="text-[10.5px] tracking-[0.08em] text-white/50 uppercase">
                {k}
              </dt>
              <dd className="mt-1 text-[15px] font-medium text-white">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-[10.5px] tracking-[0.14em] text-white/45 uppercase">
          Commissions
        </p>
        <ul className="mt-2 divide-y divide-white/[0.06]">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] text-white">
                  {r.what}
                </span>
                <span className="block text-[11.5px] text-white/50">{r.detail}</span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10.5px] font-medium",
                    r.state === "Available"
                      ? "bg-brand-400/15 text-brand-300"
                      : "bg-white/[0.06] text-white/60",
                  )}
                >
                  {r.state}
                </span>
                <span className="w-14 text-right text-[14px] font-medium text-white tabular-nums">
                  {r.amount}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Bezel>
      <p className="mt-3 text-center text-[11px] text-white/35">
        Illustration of the affiliate dashboard
      </p>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function AffiliatesPage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* Hero */}
      <section
        aria-labelledby="aff-hero-heading"
        className="relative isolate overflow-hidden bg-[#050816] text-white"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(31_85_255/0.35),transparent)]" />
          <div className="absolute right-[-10%] bottom-[-30%] h-[520px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgb(0_0_255/0.3),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_70%)] bg-[size:56px_56px]" />
        </div>

        <div className="mx-auto grid w-full max-w-[1240px] gap-16 px-4 pt-20 pb-20 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20 lg:pt-28 lg:pb-24">
          <div>
            <Eyebrow dark>Serverlys affiliate program</Eyebrow>
            <h1
              id="aff-hero-heading"
              className={cn(
                serif.className,
                "mt-8 text-[52px] leading-[0.98] font-normal tracking-[-0.035em] text-white sm:text-[76px] lg:text-[88px]",
              )}
            >
              Recommend us.
              <br />
              <span className="text-brand-400">Get paid</span> every month.
            </h1>
            <p className="mt-8 max-w-[520px] text-[18px] leading-[1.6] text-white/70">
              Share your link with the people who ask you where to host a website or how
              to answer customers after hours. Earn {PCT(TERMS.hostingFirstPayment)} of
              their first hosting payment, and {PCT(TERMS.convoShare)} of ConvoAI Pro on
              each of their first {TERMS.convoMonths} payments.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <PillCta href={billing.affiliates}>Join the program</PillCta>
              <Link
                href="/affiliate-agreement"
                className="text-[14px] font-medium text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
              >
                Read the agreement
              </Link>
            </div>
            <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/55">
              {["Free to join", "No targets", "Paid monthly"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-brand-400"
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <AffiliatePanel />
        </div>

        {/* The terms, in four numbers */}
        <div className="px-4 pb-24 sm:px-8 lg:pb-28">
          <dl className="mx-auto grid max-w-[1240px] grid-cols-2 gap-px overflow-hidden rounded-[2rem] bg-white/10 ring-1 ring-white/10 lg:grid-cols-4">
            {[
              [PCT(TERMS.hostingFirstPayment), "of a hosting customer's first payment"],
              [
                `${PCT(TERMS.convoShare)} × ${TERMS.convoMonths}`,
                "ConvoAI Pro payments, recurring",
              ],
              [`${TERMS.cookieDays} days`, "between their click and their order"],
              [`$${TERMS.minPayout}`, "minimum payout, paid monthly"],
            ].map(([v, k]) => (
              <div
                key={k}
                className="flex flex-col-reverse justify-end bg-[#070c22] p-6 sm:p-8"
              >
                <dt className="mt-3 max-w-[200px] text-[13px] leading-snug text-white/55">
                  {k}
                </dt>
                <dd className="font-display text-[34px] leading-none font-semibold tracking-[-0.03em] text-white sm:text-[44px]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Commission bento */}
      <section
        aria-labelledby="aff-rates-heading"
        className="bg-[#f6f7fb] px-4 py-24 sm:px-8 lg:py-36"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <Eyebrow>Commissions</Eyebrow>
              <h2
                id="aff-rates-heading"
                className={cn(
                  "mt-6 max-w-[560px] font-display text-[38px] leading-[1.08] font-normal tracking-[-0.03em] sm:text-[52px]",
                  INK,
                )}
              >
                What every referral is worth
              </h2>
            </div>
            <p
              className={cn(
                "max-w-[440px] text-[16px] leading-[1.65] lg:justify-self-end",
                MUTED,
              )}
            >
              Every commission is held {TERMS.holdDays} days, the length of our
              money-back guarantee, then it is yours. Rates apply to what the customer
              actually pays, after any discount.
            </p>
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-12">
            {/* ConvoAI — the recurring one, given the most room */}
            <Reveal className="lg:col-span-7 lg:row-span-2">
              <div className="h-full rounded-[2rem] bg-primary/10 p-1.5 ring-1 ring-primary/15">
                <div className="relative isolate flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[linear-gradient(160deg,#1f55ff_0%,#0000ff_55%,#0000a8_100%)] p-8 text-white shadow-[inset_0_1px_1px_rgb(255_255_255/0.25)] sm:p-10">
                  <div
                    aria-hidden="true"
                    className="absolute -top-28 -right-28 -z-10 size-80 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.22),transparent)]"
                  />
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                      <Icon name="loop" className="size-5" />
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase ring-1 ring-white/20">
                      Recurring
                    </span>
                  </div>
                  <h3 className="mt-10 text-[22px] font-medium text-white">
                    ConvoAI Pro
                  </h3>
                  <p className="mt-2 max-w-[380px] text-[15px] leading-[1.6] text-white/75">
                    AI chat for a business website, with the team stepping in when
                    needed. You earn on every payment, not just the first.
                  </p>
                  <p className="mt-10 flex flex-wrap items-baseline gap-x-3">
                    <span className="font-display text-[72px] leading-none font-semibold tracking-[-0.045em] sm:text-[96px]">
                      {PCT(TERMS.convoShare)}
                    </span>
                    <span className="text-[15px] text-white/75">
                      of each payment, for {TERMS.convoMonths} payments
                    </span>
                  </p>

                  {/* 12 payments, each the same commission, stacking up */}
                  <div aria-hidden="true" className="mt-auto pt-12">
                    <div className="flex h-36 items-end gap-1.5 sm:h-48 sm:gap-2">
                      {Array.from({ length: TERMS.convoMonths }, (_, i) => (
                        <span
                          key={i}
                          className="flex-1 rounded-t-md bg-white/85"
                          style={{
                            height: `${((i + 1) / TERMS.convoMonths) * 100}%`,
                            opacity: 0.35 + (0.65 * (i + 1)) / TERMS.convoMonths,
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between text-[11px] text-white/60">
                      <span>Payment 1 · {CONVO_MONTHLY}</span>
                      <span>
                        Payment {TERMS.convoMonths} · {CONVO_TOTAL} total
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Hosting */}
            <Reveal delay={80} className="lg:col-span-5">
              <Bezel inner="p-8">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-primary">
                    <Icon name="server" className="size-5" />
                  </span>
                  <span className="text-[12px] text-[#5b6472]">Paid once</span>
                </div>
                <h3 className={cn("mt-8 text-[20px] font-medium", INK)}>Hosting</h3>
                <p className="mt-3 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-display text-[52px] leading-none font-semibold tracking-[-0.04em]",
                      INK,
                    )}
                  >
                    {PCT(TERMS.hostingFirstPayment)}
                  </span>
                  <span className={cn("text-[14px]", MUTED)}>of the first payment</span>
                </p>
                {CLOUD && (
                  <ul className="mt-7 divide-y divide-[#0b1530]/[0.06] border-t border-[#0b1530]/[0.06]">
                    {CLOUD.plans.map((p) => (
                      <li
                        key={p.tier}
                        className="flex justify-between py-2.5 text-[14px]"
                      >
                        <span className={MUTED}>{p.name}</span>
                        <span className={cn("font-medium tabular-nums", INK)}>
                          {formatPrice(p.monthly + (p.setupFee ?? 0))}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 text-[12.5px] leading-[1.55] text-[#5b6472]">
                  Cloud plans shown, setup fee included. Every cloud, WordPress and
                  ecommerce plan counts: {HOSTING_MIN} to {HOSTING_MAX}.
                </p>
              </Bezel>
            </Reveal>

            {/* Projects */}
            <Reveal delay={160} className="lg:col-span-5">
              <Bezel inner="p-8">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-primary">
                  <Icon name="team" className="size-5" />
                </span>
                <h3 className={cn("mt-8 text-[20px] font-medium", INK)}>
                  Bigger projects
                </h3>
                <p className={cn("mt-2 text-[14.5px] leading-[1.6]", MUTED)}>
                  Website design, development and voice agents are scoped, not sold in
                  the store. Introduce the client before the scope is signed and we
                  agree a referral fee in writing.
                </p>
                <a
                  href={billing.sales}
                  className="group mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-primary"
                >
                  Tell us about a referral
                  <span
                    className={cn(
                      "transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px",
                      EASE,
                    )}
                  >
                    <Arrow />
                  </span>
                </a>
              </Bezel>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section
        aria-labelledby="aff-calc-heading"
        className="bg-white px-4 py-24 sm:px-8 lg:py-36"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-[640px] text-center">
            <div className="flex justify-center">
              <Eyebrow>Do the maths</Eyebrow>
            </div>
            <h2
              id="aff-calc-heading"
              className={cn(
                "mt-6 font-display text-[38px] leading-[1.08] font-normal tracking-[-0.03em] sm:text-[52px]",
                INK,
              )}
            >
              What a year could look like
            </h2>
            <p className={cn("mt-5 text-[16px] leading-[1.65]", MUTED)}>
              Move the sliders. The arithmetic uses our own prices and nothing else.
            </p>
          </div>
          <Reveal className="mt-14">
            <div className="rounded-[2rem] bg-[#0b1530]/[0.03] p-2 ring-1 ring-[#0b1530]/[0.05]">
              <EarningsCalculator
                hostingFirstPayment={HOSTING_MIN_VALUE}
                convoPerPayment={CONVO_MONTHLY_VALUE}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section
        aria-labelledby="aff-how-heading"
        className="bg-[#f6f7fb] px-4 py-24 sm:px-8 lg:py-36"
      >
        <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>How it works</Eyebrow>
            <h2
              id="aff-how-heading"
              className={cn(
                "mt-6 font-display text-[38px] leading-[1.08] font-normal tracking-[-0.03em] sm:text-[52px]",
                INK,
              )}
            >
              Four steps. Only the first takes any effort.
            </h2>
            <div className="mt-10">
              <PillCta href={billing.affiliates}>Join the program</PillCta>
            </div>
          </div>
          <ol className="flex flex-col gap-4">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 60}>
                <Bezel inner="grid gap-4 p-7 sm:grid-cols-[88px_1fr] sm:gap-8 sm:p-9">
                  <span
                    className={cn(
                      serif.className,
                      "text-[56px] leading-none text-primary sm:text-[64px]",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      className={cn("text-[22px] font-medium tracking-[-0.01em]", INK)}
                    >
                      {s.title}
                    </h3>
                    <p className={cn("mt-3 text-[15px] leading-[1.65]", MUTED)}>
                      {s.body}
                    </p>
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Who it's for */}
      <section
        aria-labelledby="aff-uses-heading"
        className="bg-white px-4 py-24 sm:px-8 lg:py-36"
      >
        <div className="mx-auto max-w-[1240px]">
          <Eyebrow>Who it’s for</Eyebrow>
          <h2
            id="aff-uses-heading"
            className={cn(
              "mt-6 max-w-[620px] font-display text-[38px] leading-[1.08] font-normal tracking-[-0.03em] sm:text-[52px]",
              INK,
            )}
          >
            For people who already get asked
          </h2>
          <ul className="mt-16 grid gap-4 md:grid-cols-3">
            {USES.map((u, i) => (
              <Reveal as="li" key={u.title} delay={i * 80}>
                <Bezel inner="overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={u.src}
                      alt={u.alt}
                      fill
                      sizes="(min-width: 768px) 400px, 100vw"
                      className="object-cover"
                      style={{ objectPosition: u.position }}
                    />
                  </div>
                  <div className="p-7">
                    <h3
                      className={cn("text-[20px] font-medium tracking-[-0.01em]", INK)}
                    >
                      {u.title}
                    </h3>
                    <p className={cn("mt-3 text-[14.5px] leading-[1.65]", MUTED)}>
                      {u.body}
                    </p>
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* The rules */}
      <section aria-labelledby="aff-rules-heading" className="bg-white px-2 pb-2">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#050816] px-4 py-24 text-white sm:px-8 lg:py-32">
          <div
            aria-hidden="true"
            className="absolute -bottom-40 left-1/4 -z-10 h-[420px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgb(0_0_255/0.3),transparent)]"
          />
          <div className="mx-auto max-w-[1240px]">
            <Eyebrow dark>The rules</Eyebrow>
            <h2
              id="aff-rules-heading"
              className={cn(
                serif.className,
                "mt-6 max-w-[720px] text-[44px] leading-[1.02] font-normal tracking-[-0.03em] text-white sm:text-[64px]",
              )}
            >
              Terms that don’t move once you’ve joined.
            </h2>
            <ul className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] bg-white/10 ring-1 ring-white/10 md:grid-cols-3">
              {PROMISES.map((p, i) => (
                <Reveal
                  as="li"
                  key={p.title}
                  delay={i * 80}
                  className="bg-[#070c22] p-8 sm:p-10"
                >
                  <Icon
                    name={(["doc", "report", "shield"] as IconName[])[i] ?? "doc"}
                    className="size-6 text-brand-400"
                  />
                  <h3 className="mt-8 text-[20px] font-medium text-white">{p.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-[1.65] text-white/60">
                    {p.body}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        aria-labelledby="aff-faq-heading"
        className="bg-white px-4 py-24 sm:px-8 lg:py-36"
      >
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>FAQ</Eyebrow>
            <h2
              id="aff-faq-heading"
              className={cn(
                "mt-6 font-display text-[38px] leading-[1.08] font-normal tracking-[-0.03em] sm:text-[52px]",
                INK,
              )}
            >
              Questions affiliates ask
            </h2>
            <p className={cn("mt-5 max-w-[360px] text-[15px] leading-[1.65]", MUTED)}>
              The full terms are in the{" "}
              <Link
                href="/affiliate-agreement"
                className="font-medium text-primary underline decoration-primary/30 underline-offset-4"
              >
                affiliate agreement
              </Link>
              .
            </p>
          </div>
          <div className="rounded-[2rem] bg-[#0b1530]/[0.03] p-1.5 ring-1 ring-[#0b1530]/[0.05]">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white px-6 shadow-[inset_0_1px_1px_rgb(255_255_255/0.9),0_1px_2px_rgb(11_21_48/0.04)] sm:px-9">
              {FAQS.map((f, i) => (
                <details
                  key={f.question}
                  className={cn("group", i > 0 && "border-t border-[#0b1530]/[0.06]")}
                >
                  <summary
                    className={cn(
                      "flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[17px] leading-snug font-medium sm:text-[18px] [&::-webkit-details-marker]:hidden",
                      INK,
                    )}
                  >
                    {f.question}
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0b1530]/[0.05] transition-[transform,background-color] duration-500 group-open:rotate-45 group-open:bg-primary group-open:text-white",
                        EASE,
                      )}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p
                    className={cn(
                      "max-w-[640px] pb-7 text-[15px] leading-[1.7]",
                      MUTED,
                    )}
                  >
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="aff-cta-heading" className="bg-white px-2 pb-2">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#050816] px-4 py-28 text-center text-white sm:px-8 lg:py-40">
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_0_255/0.45),transparent)]"
          />
          <div className="flex justify-center">
            <Eyebrow dark>Free to join</Eyebrow>
          </div>
          <h2
            id="aff-cta-heading"
            className={cn(
              serif.className,
              "mx-auto mt-8 max-w-[860px] text-[48px] leading-[1] font-normal tracking-[-0.035em] text-white sm:text-[80px]",
            )}
          >
            Your link is one click away.
          </h2>
          <p className="mx-auto mt-6 max-w-[460px] text-[16px] leading-[1.6] text-white/65">
            Sign in, switch on the affiliate program, and start sharing. Questions
            first? Open a ticket with our billing team.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <PillCta href={billing.affiliates} tone="white">
              Join the program
            </PillCta>
            <Link
              href="/affiliate-agreement"
              className="text-[14px] font-medium text-white/70 underline decoration-white/25 underline-offset-4 hover:text-white"
            >
              Read the agreement
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
