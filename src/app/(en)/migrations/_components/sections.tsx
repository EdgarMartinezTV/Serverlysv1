import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BEST_TERM, BLACK_FRIDAY, blackFridayActive, formatPrice, groupById, quote } from "@/data/pricing";
import { Check, CtaButton, Cursor, Grid, ShieldCheck } from "@/components/ref/kit";
import { PLAN_CARD_ITEM, PlanCard } from "@/components/ref/plan-card";
import { TermProvider } from "@/components/ref/term";
import { t as tx } from "@/i18n/t";
import { lh } from "@/i18n/href";
import { AI_TOOLS, BANNER, HERO, HOW, PRICING_HEAD, SAVINGS, STEPS, WHY } from "../_content";
import { SavingsTable, WhyAccordion } from "./interactive";
import { WhyPanel } from "./why-panel";

/**
 * /migrations bands, measured off hostinger.com/website-migration at 1440:
 * 1280 content box (80px gutters), hero h1 48/56 with a coloured first line,
 * band headings 48/56 centred, card titles 20/28, body 16/24 and 14/22.
 * The reference's black is #000 and its navy bands #120e2b-ish; ours are
 * black and `canvas-abyss` (#061433), glows and fills in the logo blue.
 */

const H2 = "text-[36px] leading-[44px] font-normal tracking-[-0.03em] lg:text-[48px] lg:leading-[56px]";
const BF = blackFridayActive();
const BF_PCT = `${Math.round(BLACK_FRIDAY.pct * 100)}%`;

const CLOUD = groupById("cloud");
/** Three tiers with the featured one centred, as the reference shows. */
const TIERS = ["plus", "turbo", "business"] as const;
const PLANS = (CLOUD?.plans ?? []).filter((p) => (TIERS as readonly string[]).includes(p.tier));

/* ── Hero (black) ───────────────────────────────────────────────────────── */
export function Hero() {
  const first = PLANS[0];
  const q = first ? quote(first, BEST_TERM) : null;
  const struck = q ? (q.bf ? q.perMonth : q.monthlyRate) : 0;
  const price = q ? (q.bf ? q.bf.perMonth : q.perMonth) : 0;

  return (
    <section aria-labelledby="wm-hero-heading" className="overflow-hidden bg-black">
      <Grid className="grid items-center gap-10 pt-10 pb-14 md:pt-14 xl:grid-cols-[1fr_minmax(0,600px)] xl:gap-16 xl:pt-[72px] xl:pb-20">
        <div className="flex flex-col items-start">
          <h1 id="wm-hero-heading" className="max-w-[600px] text-[36px] leading-[44px] font-normal tracking-[-0.03em] text-white md:text-[48px] md:leading-[56px]">
            {BF ? (
              <>
                <span className="block text-brand-400">{tx(`Up to ${BF_PCT} off`)}</span>
                {tx(HERO.bfTitle)}
              </>
            ) : (
              <>
                <span className="text-brand-400">{tx(HERO.accent)}</span> {tx(HERO.title)}
              </>
            )}
          </h1>

          <ul className="mt-6 flex flex-col gap-2.5">
            {HERO.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[16px] leading-6 text-white">
                <Check className="mt-0.5 size-5 shrink-0 text-brand-400" />
                {tx(b)}
              </li>
            ))}
          </ul>

          {q && (
            <p className="mt-8 flex items-center gap-2 text-[16px] leading-6 text-white">
              {tx(HERO.from)}
              <s className="text-white/60">{formatPrice(struck)}</s>
              <span className="inline-flex h-8 items-center rounded-md bg-primary px-2.5 font-semibold text-white">
                {tx(`${formatPrice(price)}/mo`)}
              </span>
            </p>
          )}

          <CtaButton href="#pricing" tone="light" className="mt-6 w-full sm:w-auto">
            {tx(BF ? HERO.cta : HERO.ctaEvergreen)}
          </CtaButton>
          <p className="mt-4 flex items-center gap-2 text-[14px] leading-5 text-white/80">
            <ShieldCheck className="size-5 shrink-0" />
            {tx(HERO.guarantee)}
          </p>
        </div>

        <HeroArt className="mx-auto w-full max-w-[600px]" />
      </Grid>
    </section>
  );
}

/** Starburst behind a design-editor selection frame holding the move in progress. */
function HeroArt({ className }: { className?: string }) {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 200 : 250;
    return `${(300 + Math.cos(a) * r).toFixed(1)},${(250 + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 600 500" fill="none" aria-hidden className={className}>
      <defs>
        <linearGradient id="wm-burst" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f3bff" />
          <stop offset="1" stopColor="#061a4d" />
        </linearGradient>
      </defs>
      <polygon points={pts} fill="url(#wm-burst)" transform="rotate(-8 300 250)" />

      {/* Selection frame with handles */}
      <rect x="150" y="96" width="300" height="300" stroke="#5f8bff" strokeWidth="2" />
      {[
        [150, 96],
        [450, 96],
        [150, 396],
        [450, 396],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 8} y={y - 8} width="16" height="16" fill="#fff" stroke="#5f8bff" strokeWidth="2" />
      ))}

      {/* Old host → Serverlys */}
      <g transform="translate(176 130)">
        <rect width="248" height="232" rx="14" fill="#fff" />
        <circle cx="20" cy="20" r="4" fill="#c7d2fe" />
        <circle cx="34" cy="20" r="4" fill="#c7d2fe" />
        <circle cx="48" cy="20" r="4" fill="#c7d2fe" />
        <rect x="16" y="40" width="96" height="70" rx="10" fill="#f1f3f8" />
        <text x="64" y="70" textAnchor="middle" fontSize="11" fontFamily="inherit" fill="#5b6478">Old host</text>
        <rect x="40" y="80" width="48" height="6" rx="3" fill="#d7dbe6" />
        <rect x="136" y="40" width="96" height="70" rx="10" fill="#eef3ff" stroke="#0000ff" strokeWidth="1.5" />
        <text x="184" y="70" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="inherit" fill="#0000ff">Serverlys</text>
        <rect x="160" y="80" width="48" height="6" rx="3" fill="#c7d2fe" />
        <circle cx="124" cy="75" r="13" fill="#0000ff" />
        <path d="M118 75h11m-4-4l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="16" y="140" fontSize="13" fontWeight="600" fontFamily="inherit" fill="#0b1220">Migration in progress</text>
        <text x="232" y="140" textAnchor="end" fontSize="12" fontFamily="inherit" fill="#5b6478">76%</text>
        <rect x="16" y="152" width="216" height="8" rx="4" fill="#e6ebff" />
        <rect x="16" y="152" width="164" height="8" rx="4" fill="#0000ff" />
        {["Files", "Database", "Email"].map((t, i) => (
          <g key={t} transform={`translate(${16 + i * 74} 180)`}>
            <rect width="68" height="28" rx="14" fill={i < 2 ? "#e7f8ef" : "#eef3ff"} />
            <text x="34" y="18" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="inherit" fill={i < 2 ? "#0a7a43" : "#0000ff"}>{t}</text>
          </g>
        ))}
      </g>

      {/* Offer pill */}
      <g transform="rotate(-10 470 420)">
        <rect x="360" y="396" width="210" height="52" rx="26" fill="#fff" />
        <text x="465" y="429" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="inherit" fill="#0000ff">
          {BF ? `Up to ${BF_PCT} off` : "Free migration"}
        </text>
      </g>
    </svg>
  );
}

/* ── Pricing (black) ────────────────────────────────────────────────────── */
export function Pricing() {
  if (!CLOUD) return null;
  return (
    <section id="pricing" aria-labelledby="wm-pricing-heading" className="scroll-mt-20 bg-black pb-14 md:pb-16 xl:pb-20">
      <Grid>
        <div className="flex flex-col items-center text-center">
          <h2 id="wm-pricing-heading" className={cn(H2, "text-white")}>
            {tx(BF ? PRICING_HEAD.bfTitle : PRICING_HEAD.title)}
          </h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] leading-5 text-white/80">
            {PRICING_HEAD.trust.map((t, i) => (
              <li key={t} className="flex items-center gap-2">
                {i === 0 ? <ShieldCheck className="size-4" /> : <Check className="size-4" />}
                {tx(t)}
              </li>
            ))}
          </ul>
        </div>

        <TermProvider initial={BEST_TERM}>
          <ul className="mx-auto mt-10 grid max-w-[1112px] gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PLANS.map((plan) => (
              <li key={plan.tier} className={PLAN_CARD_ITEM}>
                <PlanCard
                  plan={plan}
                  group={CLOUD}
                  surface="dark"
                  why={plan.popular ? tx("The most headroom for the price. A good long-term home for a growing site.") : undefined}
                  cta={tx(PRICING_HEAD.cta)}
                />
              </li>
            ))}
          </ul>
        </TermProvider>

        <div className="mt-8 flex flex-col items-center gap-3 text-center text-micro text-white/70">
          <p>
            {tx(`${PRICING_HEAD.compare} `)}
            <Link href={lh("/pricing")} className="underline decoration-from-font">
              {tx(PRICING_HEAD.compareLink)}
            </Link>
            .
          </p>
          <p className="max-w-[930px]">{tx(PRICING_HEAD.upfront)}</p>
        </div>
      </Grid>
    </section>
  );
}

/* ── "All it takes is two steps" ────────────────────────────────────────── */
function FormIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M5 7h14M5 12h10M5 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function DoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.6 12.2l2.3 2.3 4.5-4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const STEP_ICONS = { cursor: Cursor, form: FormIcon, check: DoneIcon } as const;

export function Steps() {
  return (
    <section aria-labelledby="wm-steps-heading" className="bg-canvas py-14 md:py-16 xl:py-20">
      <Grid>
        <h2 id="wm-steps-heading" className={cn(H2, "mx-auto max-w-[680px] text-center text-fg")}>
          {tx(STEPS.title)}
        </h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-3 xl:mt-12 xl:gap-6">
          {STEPS.items.map((s) => {
            const Icon = STEP_ICONS[s.icon];
            return (
              <li key={s.title} className="rounded-2xl bg-canvas-secondary p-6">
                <span className="grid size-8 place-items-center rounded-md bg-brand-50 text-primary ring-1 ring-brand-100">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-[20px] leading-7 text-fg">{tx(s.title)}</h3>
                <p className="mt-2 text-[16px] leading-6 text-fg-secondary">{tx(s.body)}</p>
              </li>
            );
          })}
        </ul>
      </Grid>
    </section>
  );
}

/* ── "See how site migration works" (navy, one big screen) ──────────────── */
export function How() {
  const rows: [string, string, boolean][] = [
    ["Website files", "3.0 GB", true],
    ["Database", "harbor_wp · 412 MB", true],
    ["SSL certificate", "Issued", true],
    ["Email accounts", "12 mailboxes", false],
  ];
  return (
    <section aria-labelledby="wm-how-heading" className="bg-canvas-abyss py-14 md:py-16 xl:py-20">
      <Grid>
        <h2 id="wm-how-heading" className={cn(H2, "text-center text-white")}>
          {tx(HOW.title)}
        </h2>
        <div aria-hidden className="mt-10 overflow-hidden rounded-2xl bg-white xl:mt-12">
          <div className="flex items-center justify-between border-b border-line-subtle px-5 py-3">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-ink-200" />
              <span className="size-2.5 rounded-full bg-ink-200" />
              <span className="size-2.5 rounded-full bg-ink-200" />
            </span>
            <Image src="/brand/logo.webp" alt="" width={1653} height={409} sizes="110px" className="h-6 w-auto" />
            <span className="w-[42px]" />
          </div>
          <div className="grid gap-8 px-6 py-10 md:px-12 md:py-14 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="rounded-2xl p-6 ring-1 ring-line">
              <p className="text-[18px] leading-7 font-semibold text-fg">{tx("Request a migration")}</p>
              <p className="text-[13px] text-fg-muted">{tx("Takes about two minutes")}</p>
              <div className="mt-5 space-y-3 text-[13px]">
                {[
                  ["Website address", "harborgoods.com"],
                  ["Current host", "Another provider"],
                  ["Platform", "WordPress + WooCommerce"],
                  ["Access", "cPanel login, shared securely"],
                ].map(([k, v]) => (
                  <span key={k} className="block">
                    <span className="text-[12px] font-semibold text-fg-secondary">{tx(k)}</span>
                    <span className="mt-1 block rounded-lg bg-canvas-secondary px-3 py-2.5 text-fg ring-1 ring-line">{tx(v)}</span>
                  </span>
                ))}
              </div>
              <span className="mt-5 flex h-11 items-center justify-center rounded-lg bg-primary text-[14px] font-semibold text-white">{tx("Submit request")}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <svg viewBox="0 0 200 120" className="w-[200px]">
                <path d="M30 110h140M50 110V40h60v70M120 30h60M150 30v80M120 30l30-20 30 20" stroke="#c7d2fe" strokeWidth="2" fill="none" />
                <rect x="62" y="56" width="36" height="28" rx="4" fill="#eef3ff" stroke="#0000ff" strokeWidth="1.5" />
                <path d="M74 70h12m-4-4l4 4-4 4" stroke="#0000ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <p className="mt-4 text-[18px] leading-7 font-semibold text-fg">{tx("Moving your site to Serverlys")}</p>
              <p className="text-[13px] text-fg-muted">{tx("Your site stays live on the old host until you approve the switch.")}</p>
              <div className="mt-5 h-2 w-full max-w-[360px] overflow-hidden rounded-full bg-brand-50">
                <span className="block h-full w-[76%] rounded-full bg-primary" />
              </div>
              <ul className="mt-6 w-full max-w-[360px] space-y-2 text-left text-[13px]">
                {rows.map(([k, v, done]) => (
                  <li key={k} className="flex items-center justify-between rounded-lg bg-canvas-secondary px-3 py-2">
                    <span>
                      <span className="block text-fg">{tx(k)}</span>
                      <span className="text-[12px] text-fg-muted">{tx(v)}</span>
                    </span>
                    {done ? (
                      <span className="grid size-5 place-items-center rounded-full bg-success-fill text-white">
                        <Check className="size-3" />
                      </span>
                    ) : (
                      <span className="size-5 rounded-full border-2 border-brand-100 [border-top-color:var(--color-primary)]" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── "Why migrate to Serverlys?" — media left, accordion right ──────────── */
export function Why() {
  return (
    <section aria-labelledby="wm-why-heading" className="bg-canvas py-14 md:py-16 xl:py-20">
      <Grid>
        <h2 id="wm-why-heading" className={cn(H2, "text-center text-fg")}>
          {tx(WHY.title)}
        </h2>
        <div className="mt-10 grid gap-10 xl:mt-12 xl:grid-cols-2 xl:items-center xl:gap-20">
          <WhyPanel className="aspect-[600/440] w-full" />
          <WhyAccordion />
        </div>
      </Grid>
    </section>
  );
}

/* ── Savings table ──────────────────────────────────────────────────────── */
export function Savings() {
  return (
    <section aria-labelledby="wm-savings-heading" className="bg-canvas pb-14 md:pb-16 xl:pb-20">
      <Grid>
        <div className="flex flex-col items-center text-center">
          <h2 id="wm-savings-heading" className={cn(H2, "text-fg")}>
            {tx(SAVINGS.title)}
          </h2>
          <p className="mt-4 text-[16px] leading-6 text-fg-secondary">{tx(SAVINGS.description)}</p>
        </div>
        <div className="mt-10">
          <SavingsTable brand={<Image src="/brand/logo.webp" alt="Serverlys" width={1653} height={409} sizes="130px" className="h-6 w-auto md:h-8" />} />
        </div>
      </Grid>
    </section>
  );
}

/* ── AI tools (navy) ────────────────────────────────────────────────────── */
function ToolArt({ id }: { id: string }) {
  if (id === "chat")
    return (
      <div className="flex h-full flex-col justify-end gap-2 bg-[linear-gradient(160deg,#1f55ff,#061a4d)] p-5">
        <span className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-white px-3 py-2 text-[12px] text-fg">{tx("Do you ship to Canada?")}</span>
        <span className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/15 px-3 py-2 text-[12px] text-white">{tx("Yes! Orders to Canada arrive in 3–5 days, and shipping is free over $75.")}</span>
      </div>
    );
  if (id === "channels")
    return (
      <div className="grid h-full place-items-center bg-[linear-gradient(160deg,#dbe6ff,#9db6ff)] p-5">
        <div className="flex w-full max-w-[240px] flex-col gap-2">
          {[
            ["WhatsApp", "New order question"],
            ["Email", "Return request #2041"],
            ["Website", "Opening hours?"],
          ].map(([c, m]) => (
            <span key={c} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[12px] shadow-e3">
              <span className="font-semibold text-fg">{tx(c)}</span>
              <span className="text-fg-muted">{tx(m)}</span>
            </span>
          ))}
        </div>
      </div>
    );
  return (
    <div className="grid h-full place-items-center bg-[linear-gradient(160deg,#5f8bff,#0000ff)] p-5">
      <div className="flex items-center gap-2 text-[12px]">
        {["Form sent", "Saved to CRM", "Team notified"].map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className="rounded-lg bg-white px-2.5 py-2 font-semibold text-fg shadow-e3">{tx(s)}</span>
            {i < 2 && <span className="text-white">→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AiTools() {
  return (
    <section aria-labelledby="wm-ai-heading" className="bg-canvas-abyss py-14 md:py-16 xl:py-20">
      <Grid>
        <h2 id="wm-ai-heading" className={cn(H2, "mx-auto max-w-[640px] text-center text-white")}>
          {tx(AI_TOOLS.title)}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3 xl:mt-12">
          {AI_TOOLS.items.map((t) => (
            <li key={t.id}>
              <a href={/^https?:/.test(t.href) ? t.href : lh(t.href)} className="group block">
                <div aria-hidden className="aspect-[410/260] overflow-hidden rounded-2xl">
                  <ToolArt id={t.id} />
                </div>
                <h3 className="mt-5 text-[18px] leading-7 text-white group-hover:underline">{tx(t.title)}</h3>
                <p className="mt-2 text-[14px] leading-[22px] text-white/75">{tx(t.body)}</p>
              </a>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
}

/* ── Money-back band (navy) ─────────────────────────────────────────────── */
export function Banner() {
  return (
    <section aria-labelledby="wm-banner-heading" className="bg-canvas-abyss">
      <Grid className="flex flex-col items-center border-t border-white/10 py-14 text-center md:py-16 xl:py-20">
        <h2 id="wm-banner-heading" className="text-[32px] leading-10 font-normal tracking-[-0.02em] text-white lg:text-[36px] lg:leading-[44px]">
          {tx(BANNER.title)}
        </h2>
        <p className="mt-5 max-w-[676px] text-[14px] leading-[22px] text-white/85">
          {tx(BANNER.body)}{" "}
          <Link href={lh(BANNER.linkHref)} className="font-semibold text-white underline decoration-from-font">
            {tx(BANNER.linkLabel)}
          </Link>{" "}
          {tx(BANNER.bodyTail)}
        </p>
        <CtaButton href="#pricing" tone="on-dark" className="mt-8">
          {tx(BANNER.cta)}
        </CtaButton>
      </Grid>
    </section>
  );
}
