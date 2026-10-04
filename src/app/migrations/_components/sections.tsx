import { MockPhoto } from "@/components/ui/mock-photo";
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
      className="bg-canvas pt-12 pb-16 lg:pt-20 lg:pb-24"
    >
      <Grid>
        <div className="flex flex-col items-stretch gap-8 xl:flex-row xl:items-center xl:justify-between xl:gap-x-[60px]">
          <div className="xl:w-[500px] xl:max-w-[600px] xl:shrink-0">
            <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-small font-medium text-primary">
              Free website migration
            </span>
            <h1 id="wm-hero-heading" className="display-lg mt-5 text-fg">
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
            {/* Coded, not a PNG (2026-10-03): the old host on the left, the
                new site live on staging on the right, the transfer between. */}
            <MoveVisual />
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
                <span className="grid size-10 place-items-center rounded-lg bg-primary text-white">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-h4 font-medium tracking-[-0.02em] text-fg">
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
      className="relative isolate overflow-hidden bg-canvas-abyss py-20 lg:py-28"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_50%_100%,rgb(0_0_255/0.5),transparent_70%)]" />
      <Grid>
        <h2 id="wm-how-heading" className="display-md mx-auto max-w-[760px] text-center text-white">
          {HOW.title}
        </h2>
        {/* The migration request as it is actually filled in, then the run
            that follows it. Coded; replaces the Migration.png still. */}
        <div aria-hidden="true" className="mx-auto mt-12 grid max-w-[1040px] gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-e5">
            <p className="text-body-lg font-semibold text-fg">Request a migration</p>
            <p className="text-small text-fg-muted">Takes about two minutes</p>
            <div className="mt-5 space-y-3 text-small">
              {[
                ["Website address", "harborgoods.com"],
                ["Current host", "Another provider"],
                ["Platform", "WordPress + WooCommerce"],
                ["Access", "cPanel login shared securely"],
              ].map(([k, v]) => (
                <label key={k} className="block">
                  <span className="text-micro font-semibold text-fg-secondary">{k}</span>
                  <span className="mt-1 block rounded-lg bg-canvas-secondary px-3 py-2.5 text-fg ring-1 ring-line">{v}</span>
                </label>
              ))}
            </div>
            <span className="mt-5 flex h-11 items-center justify-center rounded-lg bg-primary text-small font-semibold text-white">Submit request</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-white p-6 shadow-e5">
              <div className="flex items-center justify-between">
                <span>
                  <span className="block text-body-lg font-semibold text-fg">Migration in progress</span>
                  <span className="text-small text-fg-muted">2.3 GB of 3.0 GB copied to staging</span>
                </span>
                <span className="rounded-md bg-brand-50 px-2 py-0.5 text-micro font-semibold text-primary">76%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-100">
                <span className="block h-full w-[76%] rounded-full bg-primary" />
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-3 text-small">
                {[["Products", "1,284", true], ["Orders", "3,906", true], ["Media", "4.1 GB", true], ["Email", "12 mailboxes", false]].map(([k, v, done]) => (
                  <li key={k as string} className="flex items-center justify-between rounded-lg bg-canvas-secondary px-3 py-2">
                    <span><span className="block text-fg">{k}</span><span className="text-micro text-fg-muted">{v}</span></span>
                    {done ? (
                      <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-fill text-white"><Check className="size-3" /></span>
                    ) : (
                      <span className="size-5 rounded-full border-2 border-brand-200 [border-top-color:var(--color-primary)]" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white/[0.08] p-5 ring-1 ring-white/15">
              <MockPhoto src="checkout" className="size-16 shrink-0 rounded-xl" />
              <p className="text-small text-fg-on-dark-secondary">
                <span className="block font-semibold text-white">Your store keeps selling</span>
                The old host serves visitors until you check staging and approve the DNS switch.
              </p>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}

/** Hero visual: old host → staging, coded. */
function MoveVisual() {
  return (
    <div aria-hidden="true" className="relative isolate overflow-hidden rounded-3xl bg-brand-50 p-5 sm:p-8">
      <div className="absolute inset-0 -z-10 grid grid-cols-4 grid-rows-3">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={[1, 4, 6, 11].includes(i) ? "bg-brand-100" : ""} />
        ))}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="overflow-hidden rounded-xl bg-white opacity-80 shadow-e3">
          <p className="border-b border-line-subtle px-3 py-2 text-[10px] text-fg-muted">old-host.example · harborgoods.com</p>
          <MockPhoto src="sofa" className="h-24" sizes="260px" />
          <p className="px-3 py-2 text-[11px] text-fg-secondary">Current host</p>
        </div>
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-white shadow-e4">→</span>
        <div className="overflow-hidden rounded-xl bg-white shadow-e5 ring-2 ring-primary">
          <p className="flex items-center gap-1.5 border-b border-line-subtle px-3 py-2 text-[10px] text-fg-secondary">
            <span className="size-1.5 rounded-full bg-success-fill" />staging.harborgoods.com
          </p>
          <MockPhoto src="sofa" className="h-24" sizes="260px" />
          <p className="px-3 py-2 text-[11px] font-semibold text-fg">On Serverlys</p>
        </div>
      </div>
      <div className="mt-5 rounded-xl bg-white p-4 shadow-e4">
        <div className="flex items-center justify-between text-small">
          <span className="font-semibold text-fg">Migration in progress</span>
          <span className="text-micro text-fg-muted">2.3 GB of 3.0 GB</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100">
          <span className="block h-full w-[76%] rounded-full bg-primary" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-micro">
          {["Files", "Database", "SSL"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 font-semibold text-success">
              <Check className="size-3" /> {t}
            </span>
          ))}
          <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-primary">DNS when you approve</span>
        </div>
      </div>
    </div>
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
      className="relative isolate overflow-hidden bg-canvas-abyss py-20 lg:py-28"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_45%_at_50%_0%,rgb(0_0_255/0.4),transparent_70%)]" />
      <Grid>
        <h2
          id="wm-ai-heading"
          className="display-md mx-auto max-w-[760px] text-center text-white"
        >
          {AI_TOOLS.title}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {AI_TOOLS.items.map((t) => (
            <li
              key={t.title}
              className="flex flex-col rounded-2xl bg-white/[0.06] p-7 ring-1 ring-white/10"
            >
              <h3 className="text-h4 font-medium tracking-[-0.02em] text-white">
                {t.title}
              </h3>
              <p className="mt-3 flex-1 text-body text-fg-on-dark-secondary">
                {t.body}
              </p>
              <Link
                href={t.href}
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-body font-semibold text-primary-on-dark hover:text-white"
              >
                {`About ${t.title}`}
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
    <section aria-labelledby="wm-banner-heading" className="relative isolate overflow-hidden bg-primary">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[60%] bg-white/[0.06] [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]" />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[35%] bg-white/[0.05] [clip-path:polygon(45%_0,100%_0,100%_100%,0_100%)]" />
      <Grid>
        <div className="max-w-[620px] py-16 lg:py-24">
          <h2 id="wm-banner-heading" className="display-lg text-white">
            {BANNER.title}
          </h2>
          <p className="mt-5 max-w-[500px] text-body-lg text-white/85">
            {BANNER.body}{" "}
            <Link href={BANNER.linkHref} className="font-semibold text-white underline decoration-from-font">
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
