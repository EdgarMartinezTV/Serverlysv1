import Image from "next/image";
import Link from "next/link";
import { billing } from "@/data/company";
import {
  ArrowRight,
  Band,
  Check,
  CtaButton,
  Cursor,
  Grid,
  Headline,
  ShieldCheck,
} from "@/components/ref/kit";
import { AI_TOOLS, BANNER, HERO, HOW, SAVINGS, STEPS } from "../_content";

/**
 * The migration page's own bands. Everything shared with the other reference
 * pages (grid, type scale, the content-switch, the FAQ band) comes from
 * components/ref/*; these are the shapes unique to this reference.
 *
 * All measured off the live page at 1440 before being written:
 *   hero            1280 grid, h1 36/44 at -0.18px (NOT the 48/56 the hosting
 *                   pages use), copy column 500px
 *   content-cards   white band, 80px padding, three cards across the 1280
 *   video section   #110c29, 80px padding, h2 48/56 centred near-white
 *   compare table   48px band (not 80), h2 48/56 centred
 *   ai tools        #110c29, 80px padding, h2 48/56 centred, wraps two lines
 *   closing CTA     #110c29, 80px padding, 676px centred column
 *
 * Our dark equivalent for #110c29 is `canvas-abyss`.
 */

/** Small icon set this page needs beyond the shared kit. */
function FormIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4.5 6.5h15M4.5 12h10M4.5 17.5h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.5 12.2l2.4 2.4 4.6-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEP_ICONS = { cursor: Cursor, form: FormIcon, check: CheckCircle } as const;

/* ── hero ───────────────────────────────────────────────────────────────── */

export function Hero() {
  return (
    <section
      aria-labelledby="wm-hero-heading"
      className="bg-canvas pt-9 pb-14 md:pb-16 xl:pb-20"
    >
      <Grid>
        <div className="flex flex-col items-stretch gap-8 xl:flex-row xl:items-center xl:justify-between xl:gap-x-[60px]">
          <div className="xl:w-[500px] xl:max-w-[600px] xl:shrink-0">
            <h1
              id="wm-hero-heading"
              className="text-[32px] leading-10 font-normal tracking-[-0.16px] text-fg lg:text-[36px] lg:leading-[44px] lg:tracking-[-0.18px]"
            >
              {HERO.title}
            </h1>

            <ul className="mt-6 flex flex-col gap-3">
              {HERO.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 text-body text-fg"
                >
                  <Check className="mt-0.5 size-5 shrink-0 text-success-fill" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <CtaButton href={billing.sales} className="w-full xl:w-auto">
                {HERO.cta}
              </CtaButton>
            </div>

            <p className="mt-3 flex items-center gap-2 text-body text-fg">
              <ShieldCheck className="size-5 shrink-0" />
              {HERO.guarantee}
            </p>
          </div>

          <div className="xl:max-w-[700px] xl:flex-1">
            {/* The hero artwork carries the whole story of the move — the old
                site on the left, its files in flight, the new one live on the
                right with the transfer still running. `sizes` keeps a phone
                off the full 1672px file; width/height reserve the box so the
                copy beside it does not jump. */}
            <Image
              src="/Hosting-images/migrations.png"
              alt="A website being moved to Serverlys — the current site on one screen, its pages, images, database and code in transit, and the new site live on the other with the migration 2.3GB of 3GB through"
              width={1672}
              height={941}
              priority
              sizes="(min-width: 1280px) 700px, (min-width: 768px) 688px, 100vw"
              className="h-auto w-full rounded-2xl"
            />
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── "All it takes is two steps" ────────────────────────────────────────── */

export function Steps() {
  return (
    <Band labelledBy="wm-steps-heading">
      <Grid>
        <Headline id="wm-steps-heading" title={STEPS.title} className="mb-8 xl:mb-12" />
        <ul className="grid gap-6 md:grid-cols-3">
          {STEPS.items.map((s) => {
            const Icon = STEP_ICONS[s.icon];
            return (
              <li
                key={s.title}
                className="flex flex-col rounded-2xl bg-canvas-secondary p-8"
              >
                <span className="grid size-10 place-items-center rounded-md bg-primary-soft text-fg">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-[24px] leading-8 font-normal tracking-[-0.12px] text-fg">
                  {s.title}
                </h3>
                <p className="mt-3 text-body text-fg-secondary">{s.body}</p>
              </li>
            );
          })}
        </ul>
      </Grid>
    </Band>
  );
}

/* ── "See how site migration works" (dark) ──────────────────────────────── */

export function How() {
  return (
    <section
      aria-labelledby="wm-how-heading"
      className="bg-canvas-abyss py-14 md:py-16 xl:py-20"
    >
      <Grid>
        <h2
          id="wm-how-heading"
          className="mx-auto max-w-[646px] text-center text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-ink-50 lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]"
        >
          {HOW.title}
        </h2>
        {/* The reference plays a screen capture of its migration wizard here.
            Ours is the real panel still — same information, a fraction of the
            bytes on a page this long. */}
        <Image
          src="/Hosting-images/Migration.png"
          alt="The Serverlys migration form, with a site's products, orders, media and customers transferring"
          width={1536}
          height={1024}
          sizes="(min-width: 1280px) 1120px, 100vw"
          className="mt-10 h-auto w-full rounded-2xl"
        />
      </Grid>
    </section>
  );
}

/* ── "With Serverlys, save every year" ──────────────────────────────────── */

export function Savings() {
  return (
    <Band labelledBy="wm-savings-heading" className="py-12 md:py-12 xl:py-12">
      <Grid>
        <Headline
          id="wm-savings-heading"
          title={SAVINGS.title}
          description={SAVINGS.description}
          className="mb-8 xl:mb-12"
        />

        {/* Stacked on phones, table from md — a three-column table at 343px
            forces a horizontal scroll, which the repo's mobile check rejects. */}
        <ul className="flex flex-col gap-3 md:hidden">
          {SAVINGS.rows.map((r) => (
            <li key={r.feature} className="rounded-2xl bg-canvas-secondary p-5">
              <p className="text-body font-semibold text-fg">{r.feature}</p>
              <p className="mt-1 flex items-center gap-2 text-body text-success">
                <Check className="size-4" />
                {SAVINGS.included}
              </p>
              <p className="mt-1 text-[14px] leading-5 text-fg-muted">
                {SAVINGS.columns.market}: {r.market}
              </p>
            </li>
          ))}
        </ul>

        <table className="hidden w-full border-collapse text-left md:table">
          <thead>
            <tr className="border-b border-line">
              {[
                SAVINGS.columns.feature,
                SAVINGS.columns.serverlys,
                SAVINGS.columns.market,
              ].map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="py-4 text-[14px] leading-5 font-semibold text-fg"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAVINGS.rows.map((r) => (
              <tr key={r.feature} className="border-b border-line-subtle">
                <th
                  scope="row"
                  className="py-4 text-body font-normal text-fg"
                >
                  {r.feature}
                </th>
                <td className="py-4">
                  <span className="inline-flex items-center gap-2 text-body text-success">
                    <Check className="size-4" />
                    {SAVINGS.included}
                  </span>
                </td>
                <td className="py-4 text-body text-fg-muted">{r.market}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-center">
          <Link
            href={SAVINGS.cta.href}
            className="inline-flex min-h-11 items-center gap-1.5 text-body font-semibold text-primary hover:text-primary-hover"
          >
            {SAVINGS.cta.label}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Grid>
    </Band>
  );
}

/* ── "AI tools that do more" (dark) ─────────────────────────────────────── */

export function AiTools() {
  return (
    <section
      aria-labelledby="wm-ai-heading"
      className="bg-canvas-abyss py-14 md:py-16 xl:py-20"
    >
      <Grid>
        <h2
          id="wm-ai-heading"
          className="mx-auto max-w-[646px] text-center text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-ink-50 lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]"
        >
          {AI_TOOLS.title}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {AI_TOOLS.items.map((t) => (
            <li
              key={t.title}
              className="flex flex-col rounded-2xl bg-white/[0.06] p-8 ring-1 ring-white/10"
            >
              <h3 className="text-[24px] leading-8 font-normal tracking-[-0.12px] text-white">
                {t.title}
              </h3>
              <p className="mt-3 flex-1 text-body text-fg-on-dark-secondary">
                {t.body}
              </p>
              <Link
                href={t.href}
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-body font-semibold text-primary-on-dark hover:text-white"
              >
                Learn more
                <ArrowRight className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
}

/* ── closing CTA (dark) ─────────────────────────────────────────────────── */

export function Banner() {
  return (
    <section
      aria-labelledby="wm-banner-heading"
      className="bg-canvas-abyss py-14 md:py-16 xl:py-20"
    >
      <Grid>
        <div className="mx-auto flex max-w-[676px] flex-col items-center text-center">
          <h2
            id="wm-banner-heading"
            className="text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-ink-50 lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]"
          >
            {BANNER.title}
          </h2>
          <p className="mt-4 text-body text-fg-on-dark-secondary">
            {BANNER.body}{" "}
            <Link
              href={BANNER.linkHref}
              className="font-semibold text-primary-on-dark underline decoration-from-font hover:text-white"
            >
              {BANNER.linkLabel}
            </Link>{" "}
            {BANNER.bodyTail}
          </p>
          <div className="mt-8">
            <CtaButton href="#pricing" tone="light">
              {BANNER.cta}
            </CtaButton>
          </div>
        </div>
      </Grid>
    </section>
  );
}
