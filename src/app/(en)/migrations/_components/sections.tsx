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
import { MockPhoto } from "@/components/ui/mock-photo";

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
    <section aria-labelledby="wm-hero-heading" className="relative isolate -mt-18 overflow-hidden bg-black">
      <Grid className="grid items-center gap-10 pt-28 pb-14 md:pt-32 xl:min-h-[730px] xl:grid-cols-[1fr_minmax(0,600px)] xl:gap-16 xl:pt-32 xl:pb-16">
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
    <section id="pricing" aria-labelledby="wm-pricing-heading" className="scroll-mt-20 bg-black pt-12 pb-14 md:pt-16 md:pb-16 xl:pt-24 xl:pb-20">
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

/* ── "See how site migration works" (navy, one big screen) ──────────────
 * The reference plays a recording of its migration wizard: a wide white
 * screen, the product bar on top, ONE small summary card in the middle, the
 * step progress bar and Back / Submit at the foot. Same composition here, with
 * the fields our request actually asks for. */
export function How() {
  return (
    <section aria-labelledby="wm-how-heading" className="bg-canvas-abyss py-14 md:py-16 xl:py-20">
      <Grid>
        <h2 id="wm-how-heading" className={cn(H2, "text-center text-white")}>
          {tx(HOW.title)}
        </h2>
        <div aria-hidden className="mt-10 flex flex-col overflow-hidden rounded-2xl bg-white xl:mt-12 xl:aspect-[1440/700]">
          <div className="flex items-center justify-between border-b border-line-subtle px-5 py-3">
            <span className="w-[60px]" />
            <Image src="/brand/logo.webp" alt="" width={1653} height={409} sizes="110px" className="h-6 w-auto" />
            <span className="flex w-[60px] justify-end gap-3 text-fg-secondary">
              <svg viewBox="0 0 20 20" className="size-4" fill="none"><rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M7 8h6M7 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <svg viewBox="0 0 20 20" className="size-4" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M8.2 8a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.6M10 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 py-12">
            <div className="w-full max-w-[380px]">
              <p className="text-[16px] leading-6 font-semibold text-fg">{tx("Migration summary")}</p>
              <div className="mt-3 rounded-xl p-4 ring-1 ring-line">
                <p className="text-[11px] text-fg-muted">{tx("You are migrating the content of")}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-fg">https://harborgoods.com</span>
                  <span className="flex items-center gap-1.5 text-fg-muted">
                    <svg viewBox="0 0 20 20" className="size-4" fill="none"><path d="M4 10h11m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="grid size-7 place-items-center rounded-md bg-brand-50">
                      <Image src="/brand/logo.webp" alt="" width={1653} height={409} sizes="20px" className="h-2 w-auto object-cover object-left" />
                    </span>
                  </span>
                </div>
                <div className="mt-4 space-y-3 border-t border-line-subtle pt-3 text-[12px]">
                  {[
                    ["Website on Serverlys", "harborgoods.com"],
                    ["Plan", "Turbo Cloud"],
                    ["Platform", "WordPress"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span>
                        <span className="block text-fg-muted">{tx(k)}</span>
                        <span className="font-semibold text-fg">{tx(v)}</span>
                      </span>
                      {k !== "Platform" && <span className="rounded-md px-2 py-1 text-[11px] font-semibold text-primary ring-1 ring-brand-100">{tx("Change")}</span>}
                    </div>
                  ))}
                </div>
                <p className="mt-4 flex gap-2 rounded-lg bg-canvas-secondary p-3 text-[11px] leading-4 text-fg-secondary">
                  <svg viewBox="0 0 20 20" className="size-4 shrink-0" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M10 9v4M10 6.5v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  {tx("Only change your DNS once we tell you the migration is complete.")}
                </p>
              </div>
              <p className="mt-3 flex gap-2 text-[11px] leading-4 text-fg-secondary">
                <svg viewBox="0 0 20 20" className="size-4 shrink-0" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M10 6v4l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                <span>
                  {tx("A WordPress migration ")}<b className="text-fg">{tx("usually takes under two hours")}</b>
                  {tx(". Your website keeps working as usual on your old host while we work.")}
                </span>
              </p>
            </div>
          </div>

          <div>
            <div className="h-1.5 bg-brand-50">
              <span className="block h-full w-[86%] bg-primary" />
            </div>
            <div className="flex items-center justify-center gap-[clamp(2rem,20vw,22rem)] py-3">
              <span className="rounded-md px-3 py-1.5 text-[12px] font-semibold text-fg-secondary ring-1 ring-line">← {tx("Back")}</span>
              <span className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-semibold text-white">{tx("Submit request")} →</span>
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
          <StoreMedia />
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

/* ── AI tools (navy) ────────────────────────────────────────────────────
 * The reference's cards are tall photo compositions with one piece of
 * product UI floating on the photo. Same here: licensed product photos
 * (public/mock, Unsplash) under UI we draw. */
function ToolArt({ id }: { id: string }) {
  if (id === "chat")
    return (
      <div className="relative h-full">
        <MockPhoto src="coffee" sizes="(min-width:1280px) 460px, 90vw" className="absolute inset-0 size-full" />
        <div className="absolute inset-x-5 top-5 flex flex-col gap-2">
          <span className="self-end rounded-2xl rounded-br-sm bg-white px-3.5 py-2.5 text-[13px] text-fg shadow-e4">{tx("Are you open on Sunday?")}</span>
          <span className="max-w-[88%] rounded-2xl rounded-bl-sm bg-primary px-3.5 py-2.5 text-[13px] text-white shadow-e4">
            {tx("Yes! Sundays 8am to 2pm. Want me to book a table for brunch?")}
          </span>
        </div>
        <span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-[12px] font-semibold text-fg shadow-e4">
          <span className="size-2 rounded-full bg-success-fill" />{tx("ConvoAI · answering")}
        </span>
      </div>
    );
  if (id === "channels")
    return (
      <div className="relative h-full">
        <MockPhoto src="bread-sliced" sizes="(min-width:1280px) 460px, 90vw" className="absolute inset-0 size-full" />
        <div className="absolute inset-x-5 top-5 rounded-xl bg-white/95 p-2 shadow-e4">
          {[
            ["WhatsApp", "Can I order a cake for Friday?"],
            ["Email", "Wholesale price list, please"],
            ["Website", "Do you have gluten-free bread?"],
          ].map(([c, m]) => (
            <span key={c} className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-[12px]">
              <span className="font-semibold text-fg">{tx(c)}</span>
              <span className="truncate text-fg-muted">{tx(m)}</span>
            </span>
          ))}
        </div>
      </div>
    );
  return (
    <div className="relative h-full bg-[linear-gradient(150deg,#5f8bff,#0000ff)]">
      <div className="absolute inset-y-0 right-0 w-[45%] bg-white/10 [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]" />
      <div className="absolute inset-x-5 top-5 rounded-xl bg-white px-3 py-2.5 text-[12px] text-fg-secondary shadow-e4">{tx("When a booking form arrives…")}</div>
      <div className="absolute inset-x-8 top-[72px] bottom-5 overflow-hidden rounded-xl bg-white shadow-e5">
        <MockPhoto src="checkout" sizes="380px" className="h-[45%] w-full" />
        <div className="space-y-2 p-3 text-[12px]">
          {["Saved to your customer list", "Added to the calendar", "Team notified on email"].map((t) => (
            <span key={t} className="flex items-center gap-2 text-fg">
              <span className="grid size-4 place-items-center rounded-full bg-success-fill text-white"><Check className="size-2.5" /></span>
              {tx(t)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AiTools() {
  return (
    <section aria-labelledby="wm-ai-heading" className="bg-canvas-abyss py-14 md:py-16 xl:py-20">
      <Grid>
        <h2 id="wm-ai-heading" className={cn(H2, "mx-auto max-w-[646px] text-center text-white")}>
          {tx(AI_TOOLS.title)}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3 xl:mt-12">
          {AI_TOOLS.items.map((t) => (
            <li key={t.id}>
              <a href={/^https?:/.test(t.href) ? t.href : lh(t.href)} className="group block">
                <div aria-hidden className="aspect-square overflow-hidden rounded-2xl">
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

/* ── "Why migrate" media: a store built on Serverlys, as the reference
 * composes its builder shot — tinted panel with a diagonal, a dark tool rail,
 * the store's hero photo, a floating status card and a product card. */
function StoreMedia() {
  return (
    <div aria-hidden className="relative aspect-[600/600] w-full overflow-hidden rounded-2xl bg-brand-100">
      <div className="absolute inset-0 bg-brand-400 [clip-path:polygon(100%_0,100%_100%,0_100%,0_78%,62%_0)]" />
      <div className="absolute top-[17%] right-0 bottom-[9%] left-[11%] overflow-hidden rounded-l-xl shadow-e5">
        <div className="absolute inset-y-0 left-0 z-10 flex w-[12%] flex-col items-center gap-3 bg-[#16161a] pt-4">
          <span className="grid size-8 place-items-center rounded-md bg-white/10 text-[11px] font-bold text-white">W</span>
          <span className="grid size-8 place-items-center rounded-md bg-primary">
            <svg viewBox="0 0 20 20" className="size-4" fill="none"><path d="M4 10h12M10 4v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          </span>
        </div>
        <MockPhoto src="serum" sizes="(min-width:1280px) 560px, 90vw" className="absolute inset-0 size-full" position="center 40%" />
        <div className="absolute inset-y-0 right-[6%] z-10 flex flex-col items-end justify-center text-right">
          <p className="font-serif text-[clamp(28px,4.2vw,64px)] leading-[0.95] font-bold text-white drop-shadow">{tx("Glow")}<br />{tx("Daily")}</p>
          <span className="mt-4 border border-white/80 px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-white">{tx("SHOP NOW")}</span>
        </div>
      </div>
      <div className="absolute top-[5%] left-[37%] z-20 w-[46%] rounded-xl bg-white/90 p-4 text-center shadow-e5 backdrop-blur">
        <p className="text-[14px] font-semibold text-fg">{tx("Site migrated")}</p>
        <span className="mt-2 block h-1.5 rounded-full bg-primary" />
        <p className="mt-2 text-[11px] text-fg-muted">{tx("Files, database and email · 100%")}</p>
      </div>
      <div className="absolute bottom-[4%] left-[4%] z-20 w-[32%] rounded-xl bg-white p-2.5 text-center shadow-e5">
        <MockPhoto src="bottle" sizes="200px" className="aspect-[4/3] w-full rounded-lg" />
        <p className="mt-2 font-serif text-[14px] font-bold text-fg">{tx("Face serum")}</p>
        <p className="text-[12px] text-fg-secondary">$42.00</p>
        <span className="mt-2 block rounded-md bg-[#8a9a5b] py-1 text-[10px] font-semibold tracking-[0.1em] text-white">{tx("ADD TO CART")}</span>
      </div>
    </div>
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
