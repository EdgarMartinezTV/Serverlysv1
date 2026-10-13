import Link from "next/link";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import { Check, CtaButton, Grid, Headline } from "@/components/ref/kit";
import {
  formatSeoPrice,
  seoCompare,
  seoFromPrice,
  seoOrderUrl,
  seoPlans,
} from "@/data/seo-plans";
import { ChatButton } from "./chat-button";
import { Reveal } from "@/components/animations/reveal";
import {
  ArticleMock,
  AuditMock,
  BusinessProfileMock,
  LocalPackMock,
  PerformanceMock,
  RankTicker,
  RankTrackerMock,
  ReportPaperMock,
  SeraChatMock,
  SerpMock,
} from "./mocks";

/**
 * SEO services page.
 *
 * LAYOUT follows the DreamHost SEO Marketing page section for section (hero →
 * dark bento → plans → chat split → commitments → included → growth & elite
 * → closing CTA → FAQ), rebuilt 2026-10-13 a second time in the SITE'S OWN
 * design language: Grid/Headline from the ref kit, display type at 500,
 * rounded-md buttons, the ink-900 dark band, and the same light/dark-popular
 * plan card as /pricing. Stock-photo slots are coded mockups (./mocks.tsx).
 *
 * PLANS AND PRICES come from `data/seo-plans.ts`, a copy of the WHMCS store.
 * Every feature named on this page is one a plan in that file sells; when the
 * page says "every plan", it means SEO Starter, which the others contain.
 *
 * KEYWORDS: the page targets "SEO services", "small business SEO", "local
 * SEO", "SEO packages/pricing", "technical SEO" and "link building", each in a
 * heading where it is honestly the subject of the section. No hidden text, no
 * keyword lists.
 *
 * NO TESTIMONIALS: there are no real Serverlys SEO reviews and
 * check-reviews.mjs forbids placeholders; that slot carries commitments.
 */

const SECTION = "py-16 lg:py-24";

/* ── Icons (24px line set) ───────────────────────────────────────────────── */

const ICONS = {
  team: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-1a2.5 2.5 0 1 0 0-5M3 19c.6-3 3-4.5 6-4.5s5.4 1.5 6 4.5m1.5-4.4c2.3.3 4 1.7 4.5 4.4",
  loop: "M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3m13-2v2a3 3 0 0 1-3 3H4",
  report: "M4 4v16h16M8 16v-4m4 4V8m4 8v-6",
  pen: "M14.5 4.5l5 5L9 20H4v-5L14.5 4.5ZM12 7l5 5",
  scan: "M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3m0 8v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3m3-4h10",
  sitemap: "M12 4v5m0 0H6v4m6-4h6v4M10 3h4v4h-4zM4 13h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z",
  target:
    "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0-4a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z",
  heading: "M5 5v14M13 5v14M5 12h8M17 9l2-1v11",
  redirect: "M4 12h11m0 0-4-4m4 4-4 4M19 5v14",
  doc: "M7 3h7l4 4v14H7zM10 11h5m-5 4h5",
  schema: "M3 6h18v12H3zM3 10h18M7 6v4",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  image: "M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9.5h.01",
  pin: "M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  store:
    "M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9c0 1.7 1.3 3 3 3s2.7-1.3 2.7-3c0 1.7 1.3 3 2.3 3s2.3-1.3 2.3-3c0 1.7 1 3 2.7 3s3-1.3 3-3M10 20v-5h4v5",
  compare: "M4 20V8m6 12V4m6 16v-9m4 9H2",
  funnel: "M3 5h18l-7 8v6l-4 2v-8L3 5Z",
  ab: "M4 18 7.5 6h1L12 18M5.2 14h5.6M15 6h3a2.5 2.5 0 0 1 0 5h-3V6Zm0 5h3.5a3.5 3.5 0 0 1 0 7H15v-7Z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4m8-4v4M8 14h2m4 0h2m-8 3h2",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c.8-4 3.6-6 7-6s6.2 2 7 6",
  layout: "M4 4h16v16H4zM4 9h16M9 9v11",
  move: "M4 8h13l-3-3M20 16H7l3 3",
  shield: "M12 3 5 6v5c0 4.4 3 7.9 7 10 4-2.1 7-5.6 7-10V6l-7-3Zm-3 9 2 2 4-4.5",
} as const;

type IconName = keyof typeof ICONS;

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

/** Icon in a soft tile — the site's feature-icon treatment. */
function IconTile({ name, dark = false }: { name: IconName; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
        dark
          ? "bg-white/[0.06] text-primary-on-dark ring-1 ring-white/10"
          : "bg-brand-50 text-primary",
      )}
    >
      <Icon name={name} className="size-5" />
    </span>
  );
}

function Eyebrow({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2.5 py-1 text-small font-medium",
        dark ? "bg-white/10 text-primary-on-dark" : "bg-brand-50 text-primary",
      )}
    >
      {children}
    </span>
  );
}

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

export function Hero() {
  return (
    <section
      aria-labelledby="seo-hero-heading"
      className="relative overflow-hidden bg-canvas pt-12 pb-20 lg:pt-16 lg:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[620px] w-[760px] rounded-full bg-[radial-gradient(closest-side,var(--color-brand-100),transparent)] opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(15_23_42/0.07)_1px,transparent_0)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_75%_40%,#000,transparent)]"
      />
      <Grid className="relative">
        <div className="grid items-center gap-16 [&>*]:min-w-0 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <Eyebrow>SEO services for small businesses</Eyebrow>
            <h1 id="seo-hero-heading" className="display-xl mt-5 text-fg">
              SEO services that bring in customers, not just traffic
            </h1>
            <p className="mt-6 max-w-[560px] text-body-lg text-fg-secondary">
              Keyword research, on-page and local SEO, technical fixes and link
              building, done for you and reported every month. Rank for the searches
              that end in a call or an order.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {[
                "Google Business Profile and local SEO on every plan",
                "A monthly SEO report you can actually read",
                "White-hat only. No rank guarantees, no link schemes",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-body text-fg">
                  <Check className="size-4 shrink-0 text-success-fill" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-body text-fg">
              Plans from{" "}
              <span className="tabular text-[28px] font-semibold tracking-[-0.03em]">
                {formatSeoPrice(seoFromPrice)}
              </span>
              <span className="text-fg-secondary">/mo</span>
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <CtaButton href="#plans">See SEO plans</CtaButton>
              <ChatButton tone="ghost">Ask Sera</ChatButton>
            </div>
          </div>

          <div className="relative px-2 pb-6 sm:px-8 sm:pb-20 lg:px-4">
            <PerformanceMock />
            <p className="mt-24 hidden text-right text-micro text-fg-muted sm:block">
              Example: a demo client’s dashboard, for illustration.
            </p>
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── 2. Dark bento ───────────────────────────────────────────────────────── */

function DarkCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-surface-dark-elevated p-7 ring-1 ring-white/[0.08] sm:p-10 lg:p-12",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DarkCardHead({
  icon,
  title,
  body,
}: {
  icon: IconName;
  title: string;
  body: string;
}) {
  return (
    <>
      <IconTile name={icon} dark />
      <h3 className="display-md mt-6 text-fg-on-dark">{title}</h3>
      <p className="mt-4 text-body-lg text-fg-on-dark-secondary">{body}</p>
    </>
  );
}

export function MadeEasy() {
  return (
    <section
      aria-labelledby="seo-easy-heading"
      className={cn("relative overflow-hidden bg-surface-dark", SECTION)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_100%_at_50%_0%,rgb(0_0_255/0.28)_0%,transparent_70%)]"
      />
      <RankTicker className="relative -mt-4 mb-14 lg:mb-20" />
      <Grid className="relative">
        <Headline
          id="seo-easy-heading"
          tone="dark"
          title="Search engine optimization, done for you"
          description="You run the business. We do the SEO work that gets it found, and show you what it earned."
        />

        <div className="mx-auto mt-12 flex max-w-[1280px] flex-col gap-6 lg:mt-16">
          <Reveal>
            <DarkCard className="grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-2 lg:gap-14">
              <AuditMock />
              <div>
                <DarkCardHead
                  icon="team"
                  title="One team, from audit to report"
                  body="SEO is several disciplines at once. The same team covers all of them on your site, so nothing falls between a developer, a writer and an analyst."
                />
                <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {[
                    "Technical SEO",
                    "Keyword research",
                    "On-page optimization",
                    "Local SEO",
                    "Content writing",
                    "Link building",
                  ].map((r) => (
                    <li
                      key={r}
                      className="flex items-center gap-2.5 text-body text-fg-on-dark"
                    >
                      <Check className="size-4 shrink-0 text-primary-on-dark" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </DarkCard>
          </Reveal>

          <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-2">
            <Reveal>
              <DarkCard className="h-full">
                <DarkCardHead
                  icon="loop"
                  title="Improvements every month"
                  body="Once the audit fixes are in, the work moves to what compounds: new content for the searches you are missing, better pages for the ones you have."
                />
                <ArticleMock className="mt-8" />
              </DarkCard>
            </Reveal>
            <Reveal delay={120}>
              <DarkCard className="h-full">
                <DarkCardHead
                  icon="report"
                  title="A monthly SEO report"
                  body="What moved, what did not, and why. Growth adds keyword tracking; Elite adds an ROI summary, white-labeled for you."
                />
                <ReportPaperMock className="mt-8" />
              </DarkCard>
            </Reveal>
          </div>

          <DarkCard className="grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <DarkCardHead
                icon="pen"
                title="More reach with every plan"
                body="Keywords, locations, content and links all scale with the plan, so the work grows with the market you want to win."
              />
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                <CompareTable dark />
              </div>
            </div>
          </DarkCard>
        </div>
      </Grid>
    </section>
  );
}

/* ── Comparison table (dark bento + plans band share it) ─────────────────── */

function CompareTable({ dark = false }: { dark?: boolean }) {
  const line = dark ? "border-white/10" : "border-line";
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl ring-1",
        dark ? "ring-white/10" : "bg-canvas ring-line",
      )}
    >
      <table className="w-full text-left">
        <caption className="sr-only">SEO plan comparison</caption>
        <thead>
          <tr
            className={cn(
              "border-b",
              line,
              dark ? "bg-white/[0.03]" : "bg-canvas-secondary",
            )}
          >
            <th scope="col" className="p-3 sm:p-4">
              <span className="sr-only">Feature</span>
            </th>
            {seoPlans.map((p) => (
              <th
                key={p.id}
                scope="col"
                className={cn(
                  "p-3 text-small font-semibold sm:p-4 sm:text-body",
                  dark
                    ? p.popular
                      ? "text-primary-on-dark"
                      : "text-fg-on-dark"
                    : p.popular
                      ? "text-primary"
                      : "text-fg",
                )}
              >
                {p.name.replace("SEO ", "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {seoCompare.map((row) => (
            <tr key={row.label} className={cn("border-b last:border-0", line)}>
              <th
                scope="row"
                className={cn(
                  "p-3 text-small font-medium sm:p-4",
                  dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
                )}
              >
                {row.label}
              </th>
              {row.values.map((v, i) => (
                <td
                  key={i}
                  className={cn(
                    "p-3 text-small sm:p-4",
                    v === "—"
                      ? dark
                        ? "text-white/30"
                        : "text-fg-muted"
                      : dark
                        ? "font-medium text-fg-on-dark"
                        : "font-medium text-fg",
                  )}
                >
                  {v === "✓" ? (
                    <>
                      <Check
                        className={cn(
                          "size-4",
                          dark ? "text-primary-on-dark" : "text-success-fill",
                        )}
                      />
                      <span className="sr-only">Included</span>
                    </>
                  ) : v === "—" ? (
                    <>
                      <span aria-hidden="true">—</span>
                      <span className="sr-only">Not included</span>
                    </>
                  ) : (
                    v
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── 3. Plans ────────────────────────────────────────────────────────────── */

export function Plans() {
  return (
    <section
      id="plans"
      aria-labelledby="seo-plans-heading"
      className={cn("scroll-mt-14 bg-canvas-secondary", SECTION)}
    >
      <Grid>
        <Headline
          id="seo-plans-heading"
          title="SEO packages and pricing"
          description="From local visibility to national reach. Every plan is billed monthly, with no rank promises and no link schemes."
          className="mb-10 xl:mb-12"
        />

        <ul className="mx-auto grid max-w-[1280px] gap-4 [&>*]:min-w-0 lg:grid-cols-3">
          {seoPlans.map((plan, i) => {
            const dark = Boolean(plan.popular);
            const prev = seoPlans[i - 1];
            return (
              <Reveal as="li" key={plan.id} delay={i * 90}>
                <article
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-2xl p-6 sm:p-7",
                    dark
                      ? "bg-[linear-gradient(180deg,var(--color-brand-950)_0%,#040a1c_100%)] shadow-e5"
                      : "bg-canvas ring-1 ring-line",
                  )}
                >
                  {dark && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(80%_100%_at_50%_0%,rgb(0_0_255/0.5)_0%,transparent_70%)]"
                    />
                  )}
                  <div className="relative flex min-h-6 justify-end">
                    {dark && (
                      <span className="rounded-md bg-white/15 px-2 py-0.5 text-micro font-semibold text-white">
                        Most popular
                      </span>
                    )}
                  </div>
                  <h3
                    className={cn(
                      "relative mt-1 text-[22px] leading-7 font-semibold tracking-[-0.01em]",
                      dark ? "text-white" : "text-fg",
                    )}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={cn(
                      "relative mt-2 min-h-12 text-small",
                      dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
                    )}
                  >
                    {plan.summary}
                  </p>
                  <p className="relative mt-6 flex items-baseline gap-1">
                    <span
                      className={cn(
                        "tabular text-[44px] leading-none font-semibold tracking-[-0.035em]",
                        dark ? "text-white" : "text-fg",
                      )}
                    >
                      {formatSeoPrice(plan.price)}
                    </span>
                    <span
                      className={cn(
                        "text-body",
                        dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
                      )}
                    >
                      /mo
                    </span>
                  </p>
                  <a
                    href={seoOrderUrl(plan)}
                    className={cn(
                      "relative mt-6 flex h-12 w-full items-center justify-center rounded-md text-body font-semibold transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2",
                      dark
                        ? "bg-primary text-white hover:bg-primary-hover focus-visible:outline-white"
                        : "text-primary ring-1 ring-inset ring-primary hover:bg-primary-soft focus-visible:outline-primary",
                    )}
                  >
                    Get {plan.name}
                  </a>
                  <p
                    className={cn(
                      "relative mt-3 text-micro",
                      dark ? "text-fg-on-dark-muted" : "text-fg-muted",
                    )}
                  >
                    Billed monthly in USD.
                  </p>
                  <span
                    aria-hidden
                    className={cn(
                      "relative my-6 block h-px",
                      dark ? "bg-white/12" : "bg-line",
                    )}
                  />
                  <p
                    className={cn(
                      "relative mb-3 text-small font-semibold",
                      dark ? "text-white" : "text-fg",
                    )}
                  >
                    {prev ? `Everything in ${prev.name}, plus` : "What’s included"}
                  </p>
                  <ul className="relative flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className={cn(
                          "flex items-start gap-2.5 text-small",
                          dark ? "text-white" : "text-fg",
                        )}
                      >
                        <Check
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            dark ? "text-primary-on-dark" : "text-success-fill",
                          )}
                        />
                        <span className="flex-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <p className="mt-10 text-center text-small text-fg-secondary">
          Not sure which plan fits?{" "}
          <a
            href={billing.sales}
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Ask the team for a recommendation
          </a>
          .
        </p>
      </Grid>
    </section>
  );
}

/* ── 4. Chat split ───────────────────────────────────────────────────────── */

export function ChatSplit() {
  return (
    <section aria-labelledby="seo-chat-heading" className={cn("bg-canvas", SECTION)}>
      <Grid className="grid items-center gap-12 [&>*]:min-w-0 lg:grid-cols-2 lg:gap-20">
        <SeraChatMock />
        <div>
          <Eyebrow>Talk to an SEO specialist</Eyebrow>
          <h2 id="seo-chat-heading" className="display-lg mt-5 text-fg">
            Not sure where your SEO stands? Ask.
          </h2>
          <p className="mt-5 text-body-lg text-fg-secondary">
            Ask Sera about your site and get an answer straight away. A person on the
            team reads every conversation and follows up with next steps to get you more
            traffic.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ChatButton icon>Chat with us</ChatButton>
            <a
              href={billing.sales}
              className="inline-flex h-12 items-center gap-2 rounded-md px-6 text-body font-semibold text-fg ring-1 ring-inset ring-line-strong transition-colors hover:bg-canvas-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Icon name="calendar" className="size-5 text-primary" />
              Message the team
            </a>
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── 5. Commitments (the reference's testimonials slot) ──────────────────── */

const COMMITMENTS = [
  {
    title: "No ranking guarantees",
    body: "Nobody outside Google controls rankings, and anyone promising position one is guessing or gaming it. We commit to the work and report honestly on the result.",
  },
  {
    title: "White-hat only",
    body: "No paid link schemes, no private blog networks, nothing that could earn your site a penalty. Links come from real directories, real outreach and real press.",
  },
  {
    title: "Reports in plain English",
    body: "Every monthly report says what moved, what did not and why, tied back to visits, calls and orders rather than vanity charts.",
  },
] as const;

export function Commitments() {
  return (
    <section
      aria-labelledby="seo-promise-heading"
      className={cn("border-t border-line-subtle bg-canvas", SECTION)}
    >
      <Grid className="grid gap-12 [&>*]:min-w-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow>Our commitments</Eyebrow>
          <h2 id="seo-promise-heading" className="display-lg mt-5 text-fg">
            What you can hold us to
          </h2>
          <p className="mt-5 max-w-[440px] text-body-lg text-fg-secondary">
            SEO is full of promises nobody can keep. These are the ones we can.
          </p>
        </div>
        <ul className="flex flex-col gap-4">
          {COMMITMENTS.map((c) => (
            <li
              key={c.title}
              className="flex gap-5 rounded-2xl bg-canvas p-6 ring-1 ring-line sm:p-8"
            >
              <IconTile name="shield" />
              <div>
                <h3 className="text-body-lg font-semibold text-fg">{c.title}</h3>
                <p className="mt-2 text-body text-fg-secondary">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
}

/* ── 6–7. Feature groups ─────────────────────────────────────────────────── */

type Feature = {
  icon: IconName;
  title: string;
  body: string;
  tag?: string;
  href?: string;
};

/* SEO Starter's contents — what "every plan" includes. */
const FOUNDATIONS: Feature[] = [
  {
    icon: "scan",
    title: "SEO audit & fixes",
    body: "A technical audit of your site, then the fixes: what search engines can't reach, can't read or don't trust, in order of impact.",
  },
  {
    icon: "target",
    title: "Keyword research",
    body: "The searches your customers actually make, chosen for intent, so effort goes where it brings in buyers.",
  },
  {
    icon: "heading",
    title: "On-page optimization",
    body: "Titles, meta descriptions and headings written for your target keywords and for the people clicking them.",
  },
  {
    icon: "sitemap",
    title: "Sitemap & robots.txt",
    body: "An XML sitemap and a clean robots.txt so search engines can find and crawl every page that matters.",
  },
];

const LOCAL: Feature[] = [
  {
    icon: "store",
    title: "Google Business Profile",
    body: "Your profile completed and optimized, so you show up properly in the local pack and on Google Maps.",
  },
  {
    icon: "pin",
    title: "Local SEO",
    body: "Location signals across your site and listings: one location on Starter, up to three on Growth, multi-location on Elite.",
  },
  {
    icon: "image",
    title: "Image optimization",
    body: "Alt tags and compression on your images: faster pages, better accessibility, and a chance to rank in image search.",
  },
  {
    icon: "link",
    title: "Local backlinks",
    body: "A backlink strategy built on the local directories your customers and Google already trust.",
  },
];

const GROWTH: Feature[] = [
  {
    icon: "schema",
    title: "Schema & internal linking",
    body: "Advanced on-page SEO: structured data, internal links and content silos that tell Google what each page is about.",
  },
  {
    icon: "compare",
    title: "Competitor analysis",
    body: "What the businesses ranking above you are doing, and the gaps you can take from them.",
  },
  {
    icon: "redirect",
    title: "Technical SEO fixes",
    body: "404s, redirects and Core Web Vitals fixed, with speed optimization so pages load fast on mobile.",
  },
  {
    icon: "doc",
    title: "Monthly blog content",
    body: "An optimized blog post every month on Growth, up to four on Elite, written around your keyword strategy.",
  },
  {
    icon: "link",
    title: "Backlink outreach",
    body: "Manual outreach for high-quality niche links on Growth; guest posts and PR backlinks on Elite.",
  },
  {
    icon: "report",
    title: "Keyword tracking",
    body: "Rankings for every target keyword tracked and reported monthly, so you can see exactly what moved.",
  },
];

const ELITE: Feature[] = [
  {
    icon: "person",
    title: "Dedicated SEO manager",
    body: "One person who owns your account, with optional bi-weekly strategy meetings.",
  },
  {
    icon: "layout",
    title: "Landing page optimization",
    body: "Custom optimization of the pages that sell your services and products.",
  },
  {
    icon: "funnel",
    title: "Conversion rate optimization",
    body: "A CRO audit with suggestions, so more of the traffic you earn turns into enquiries.",
  },
  {
    icon: "ab",
    title: "A/B testing",
    body: "Ongoing tests on calls to action and page titles, keeping what wins.",
  },
];

const ADDONS: Feature[] = [
  {
    icon: "layout",
    title: "Website design",
    tag: "Pairs well",
    href: "/website-design",
    body: "When the site itself is holding you back, we rebuild it with structure, metadata and speed done from the start.",
  },
  {
    icon: "move",
    title: "Free migration to Serverlys",
    tag: "Pairs well",
    href: "/migrations",
    body: "A slow server holds rankings back. We move your site to fast Serverlys hosting for free, with no downtime.",
  },
];

function FeatureItem({ f, dark }: { f: Feature; dark: boolean }) {
  return (
    <div className="flex gap-4">
      <IconTile name={f.icon} dark={dark} />
      <div>
        <h4
          className={cn(
            "text-body-lg font-semibold",
            dark ? "text-fg-on-dark" : "text-fg",
          )}
        >
          {f.title}
        </h4>
        {f.tag && (
          <p className="mt-1 text-micro font-semibold uppercase tracking-[0.06em] text-primary">
            {f.tag}
          </p>
        )}
        <p
          className={cn(
            "mt-1.5 text-body",
            dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
          )}
        >
          {f.body}
        </p>
        {f.href && (
          <Link
            href={f.href}
            className="mt-2 inline-flex min-h-11 items-center gap-1 text-small font-semibold text-primary hover:text-primary-hover sm:min-h-0"
          >
            Learn more <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function Group({
  eyebrow,
  title,
  lede,
  items,
  dark,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  items: Feature[];
  dark: boolean;
}) {
  return (
    <div className="grid gap-10 [&>*]:min-w-0 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-16">
      <div>
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        <h3 className={cn("display-md mt-4", dark ? "text-fg-on-dark" : "text-fg")}>
          {title}
        </h3>
        <p
          className={cn(
            "mt-4 text-body",
            dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
          )}
        >
          {lede}
        </p>
      </div>
      <div className="relative lg:pl-12">
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-0 hidden w-1 rounded-full bg-gradient-to-b from-brand-400 to-brand-600 lg:block"
        />
        <div className="grid gap-x-10 gap-y-9 [&>*]:min-w-0 sm:grid-cols-2">
          {items.map((f) => (
            <FeatureItem key={f.title} f={f} dark={dark} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Included() {
  return (
    <section
      aria-labelledby="seo-included-heading"
      className={cn("relative overflow-hidden bg-surface-dark", SECTION)}
    >
      <Grid className="relative">
        <Headline
          id="seo-included-heading"
          tone="dark"
          title="What’s included in every SEO plan"
          description="Everything in SEO Starter comes with every plan: the technical, on-page and local SEO a site needs to be found on Google."
        />
        <div className="mt-14 lg:mt-20">
          <Group
            eyebrow="Technical & on-page SEO"
            title="The foundations"
            lede="Content cannot rank on a site search engines struggle to read, so this is where every plan starts."
            items={FOUNDATIONS}
            dark
          />
        </div>
        <div className="mt-16 grid items-center gap-12 [&>*]:min-w-0 lg:mt-24 lg:grid-cols-2 lg:gap-16">
          <Reveal className="grid items-end gap-4 [&>*]:min-w-0 lg:grid-cols-[1fr_210px]">
            <LocalPackMock />
            <div className="animate-float-slow hidden lg:block lg:-mb-8">
              <BusinessProfileMock />
            </div>
          </Reveal>
          <div>
            <Eyebrow dark>Local SEO</Eyebrow>
            <h3 className="display-md mt-4 text-fg-on-dark">
              Show up when nearby customers search
            </h3>
            <div className="mt-8 flex flex-col gap-8">
              {LOCAL.map((f) => (
                <FeatureItem key={f.title} f={f} dark />
              ))}
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}

export function Ongoing() {
  return (
    <section aria-labelledby="seo-growth-heading" className={cn("bg-canvas", SECTION)}>
      <Grid>
        <Headline
          id="seo-growth-heading"
          title="Link building, content and growth SEO"
          description="What SEO Growth and SEO Elite add on top of the foundations."
          className="mb-14 lg:mb-20"
        />
        <Group
          eyebrow="SEO Growth"
          title="Content, links and technical SEO that compound"
          lede="Growth adds the work that pulls ahead of competitors: more keywords, monthly content and real backlink outreach."
          items={GROWTH}
          dark={false}
        />
        <div className="mt-16 grid items-center gap-12 [&>*]:min-w-0 lg:mt-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>SEO Elite</Eyebrow>
            <h3 className="display-md mt-4 text-fg">
              A dedicated SEO manager for national reach
            </h3>
            <p className="mt-4 text-body text-fg-secondary">
              Unlimited keyword focus, a full content strategy and high-authority link
              building, with someone who owns your results.
            </p>
            <div className="mt-8 flex flex-col gap-8">
              {ELITE.map((f) => (
                <FeatureItem key={f.title} f={f} dark={false} />
              ))}
            </div>
          </div>
          <Reveal className="relative">
            <RankTrackerMock />
            <div className="animate-float-slow -mt-3 ml-auto hidden w-[78%] lg:block">
              <SerpMock className="scale-[0.98]" />
            </div>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-6 [&>*]:min-w-0 lg:mt-20 lg:grid-cols-2">
          {ADDONS.map((f) => (
            <div key={f.title} className="rounded-2xl bg-canvas-secondary p-6 sm:p-8">
              <FeatureItem f={f} dark={false} />
            </div>
          ))}
        </div>
      </Grid>
    </section>
  );
}

/* ── 8. Closing CTA ──────────────────────────────────────────────────────── */

export function CtaCard() {
  return (
    <section aria-labelledby="seo-cta-heading" className="bg-canvas pb-16 lg:pb-24">
      <Grid>
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(180deg,var(--color-brand-950)_0%,#040a1c_100%)] px-6 py-20 text-center lg:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
          >
            <div className="absolute top-10 -left-24 w-[560px] -rotate-6">
              <RankTrackerMock />
            </div>
            <div className="absolute -right-20 -bottom-28 w-[600px] rotate-[5deg]">
              <SerpMock />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(4_10_28/0.94)_0%,rgb(4_10_28/0.75)_55%,rgb(4_10_28/0.4)_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(0_0_255/0.45)_0%,transparent_70%)]"
          />
          <div className="relative">
            <h2 id="seo-cta-heading" className="display-lg text-fg-on-dark">
              Ready to get found on Google?
            </h2>
            <p className="mx-auto mt-4 max-w-[600px] text-body-lg text-fg-on-dark-secondary">
              Pick a plan and we start with an audit of where you stand, or ask Sera
              which plan fits.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CtaButton href="#plans" tone="on-dark">
                See SEO plans
              </CtaButton>
              <ChatButton tone="on-dark">Ask Sera</ChatButton>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}
