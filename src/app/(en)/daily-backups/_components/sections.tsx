import Link from "next/link";
import { BEST_TERM, groupById } from "@/data/pricing";
import { CtaButton, Grid } from "@/components/ref/kit";
import { PLAN_CARD_ITEM, PlanCard } from "@/components/ref/plan-card";
import { TermProvider } from "@/components/ref/term";
import { t as tx } from "@/i18n/t";
import { lh } from "@/i18n/href";
import { HERO, HOW, PLANS_HEAD, REASONS, SPLIT, WHY, WHY_HEAD } from "../_content";
import { CalendarArt, ContentsArt, FileArt, HackArt, HeroArt, UpdateArt } from "./art";

/**
 * /daily-backups bands — the same layout as /free-ssl. Measurements are the reference's at 1440 (see _content.ts):
 * 1280 content box with 80px gutters, band headings 48/56 centred, split
 * headings 48/56 left, row headings 20/28, body 16/24.
 */

const H2 = "text-[36px] leading-[44px] font-normal tracking-[-0.03em] text-fg lg:text-[48px] lg:leading-[56px]";

/* ── Hero: deep band, copy left, art right ─────────────────────────────── */
export function Hero() {
  return (
    <section aria-labelledby="bk-hero-heading" className="overflow-hidden bg-canvas-deep">
      <Grid className="grid items-center gap-10 pt-12 pb-14 md:pt-16 xl:grid-cols-2 xl:gap-20 xl:py-[72px]">
        <div className="flex flex-col items-start">
          <h1
            id="bk-hero-heading"
            className="max-w-[560px] text-[40px] leading-[48px] font-normal tracking-[-0.03em] text-white md:text-[56px] md:leading-[64px]"
          >
            {tx(HERO.title)}
          </h1>
          <p className="mt-6 max-w-[520px] text-[16px] leading-6 text-white/85">{tx(HERO.lede)}</p>
          <CtaButton href="#plans" tone="on-dark" className="mt-8 w-full sm:w-auto">
            {tx(HERO.cta)}
          </CtaButton>
        </div>
        <HeroArt className="mx-auto w-full max-w-[560px]" />
      </Grid>
    </section>
  );
}

/* ── Plans: three cards, the featured one inverted in the middle ──────── */
const GROUP = groupById("cloud");
/** The reference shows three tiers with the featured one centred; cloud marks Turbo popular. */
const TIERS = ["plus", "turbo", "business"] as const;

export function Plans() {
  if (!GROUP) return null;
  const plans = GROUP.plans.filter((p) => (TIERS as readonly string[]).includes(p.tier));
  return (
    <section id="plans" aria-labelledby="bk-plans-heading" className="scroll-mt-20 bg-canvas py-14 md:py-16 xl:py-20">
      <Grid>
        <div className="flex flex-col items-center text-center">
          <h2 id="bk-plans-heading" className={`${H2} max-w-[760px]`}>
            {tx(PLANS_HEAD.title)}
          </h2>
          <p className="mt-4 max-w-[736px] text-[16px] leading-6 text-fg-secondary">{tx(PLANS_HEAD.description)}</p>
        </div>

        <TermProvider initial={BEST_TERM}>
          <ul className="mx-auto mt-10 grid max-w-[1112px] gap-4 md:grid-cols-2 xl:mt-12 xl:grid-cols-3">
            {plans.map((plan) => (
              <li key={plan.tier} className={PLAN_CARD_ITEM}>
                <PlanCard plan={plan} group={GROUP} why={WHY[plan.tier] ? tx(WHY[plan.tier]) : undefined} cta={tx(PLANS_HEAD.cta)} />
              </li>
            ))}
          </ul>
        </TermProvider>

        <div className="mt-8 flex flex-col items-center gap-3 text-center text-micro text-fg-secondary">
          <p>
            {tx("Compare every plan and billing term on the ")}
            <Link href={lh("/pricing")} className="underline decoration-from-font">
              {tx("pricing page")}
            </Link>
            .
          </p>
          <p className="max-w-[930px]">{tx(PLANS_HEAD.upfront)}</p>
        </div>
      </Grid>
    </section>
  );
}

/* ── Paid vs free: art left, prose right, on the tinted surface ────────── */
export function Difference() {
  return (
    <section aria-labelledby="bk-diff-heading" className="bg-brand-50 py-14 md:py-16 xl:py-20">
      <Grid className="grid items-center gap-10 xl:grid-cols-2 xl:gap-20">
        <ContentsArt className="mx-auto w-full max-w-[540px]" />
        <div>
          <h2 id="bk-diff-heading" className={`${H2} max-w-[520px]`}>
            {tx(SPLIT.title)}
          </h2>
          <div className="mt-6 flex flex-col gap-6 text-[16px] leading-6 text-fg">
            {SPLIT.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{tx(p)}</p>
            ))}
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── Why: centred heading, four rows alternating art left / right ──────── */
const REASON_ART = { hacked: HackArt, update: UpdateArt, deleted: FileArt, calm: CalendarArt } as const;

export function Reasons() {
  return (
    <section aria-labelledby="bk-why-heading" className="bg-canvas py-14 md:py-16 xl:py-20">
      <Grid>
        <h2 id="bk-why-heading" className={`${H2} mx-auto max-w-[640px] text-center`}>
          {tx(WHY_HEAD.title)}
        </h2>
        <ul className="mt-10 flex flex-col gap-14 xl:mt-12 xl:gap-20">
          {REASONS.map((r, i) => {
            const Art = REASON_ART[r.id];
            const artLeft = i % 2 === 0;
            return (
              <li key={r.id} className="grid items-center gap-8 xl:grid-cols-2 xl:gap-20">
                <Art className={`mx-auto w-full max-w-[600px] ${artLeft ? "" : "xl:order-2"}`} />
                <div className={artLeft ? "" : "xl:order-1"}>
                  <h3 className="text-[20px] leading-7 font-semibold text-fg">{tx(r.title)}</h3>
                  <p className="mt-2 max-w-[560px] text-[16px] leading-6 text-fg">{tx(r.body)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Grid>
    </section>
  );
}

/* ── How it works: three numbered cards ─────────────────────────────────── */
export function How() {
  return (
    <section aria-labelledby="bk-how-heading" className="bg-canvas pt-6 pb-14 md:pb-16 xl:pb-20">
      <Grid>
        <h2 id="bk-how-heading" className={`${H2} text-center`}>
          {tx(HOW.title)}
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-3 xl:mt-12">
          {HOW.steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl p-6 ring-1 ring-line">
              <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-brand-50 px-1.5 text-[24px] leading-8 font-medium text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-[20px] leading-7 text-fg">{tx(s.title)}</h3>
              <p className="mt-2 text-[16px] leading-6 text-fg-secondary">{tx(s.body)}</p>
            </li>
          ))}
        </ol>
      </Grid>
    </section>
  );
}
