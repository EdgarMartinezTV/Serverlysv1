import Link from "next/link";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import type { Faq } from "@/data/faqs";
import { ChatButton } from "./chat-button";
import {
  AuditMock,
  ContentMock,
  PerformanceMock,
  RankTrackerMock,
  ReportMock,
  SeraChatMock,
  SerpMock,
} from "./mocks";

/**
 * SEO page — 2026-10-13 rebuild to the DreamHost SEO Marketing page's
 * anatomy, section for section:
 *
 *   hero (back link, pill, display headline, CTA + price line, visual)
 *   → black "made easy" bento → blue three-plan band → chat split
 *   → testimonials slot → black "included in every plan" (two groups)
 *   → light "ongoing" group → image CTA → black FAQ.
 *
 * Where the reference shows stock photos, this page shows coded product
 * mockups (./mocks.tsx), all for one demo client.
 *
 * ⚠ THREE THINGS DELIBERATELY DIFFER FROM THE REFERENCE:
 *   - NO PRICES. Serverlys has no published SEO pricing; the plan cards say
 *     "Quoted after your audit" (Edgar's call, 2026-10-13). Put real numbers
 *     in PLANS when they exist.
 *   - NO TESTIMONIALS. There are no real Serverlys SEO reviews and
 *     check-reviews.mjs forbids placeholders; that slot carries commitments.
 *   - NO NAMED ROLES. The reference lists an SEO Manager, Strategist, etc.
 *     The team list here is the work covered, not job titles we can't verify.
 */

const AUDIT = billing.sales;

/* ── Icons (24px line set) ───────────────────────────────────────────────── */

const ICONS = {
  team: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-1a2.5 2.5 0 1 0 0-5M3 19c.6-3 3-4.5 6-4.5s5.4 1.5 6 4.5m1.5-4.4c2.3.3 4 1.7 4.5 4.4",
  loop: "M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3m13-2v2a3 3 0 0 1-3 3H4",
  report: "M4 4v16h16M8 16v-4m4 4V8m4 8v-6",
  pen: "M14.5 4.5l5 5L9 20H4v-5L14.5 4.5ZM12 7l5 5",
  call: "M6 4h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2Z",
  scan: "M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3m0 8v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3m3-4h10",
  sitemap: "M12 4v5m0 0H6v4m6-4h6v4M10 3h4v4h-4zM4 13h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z",
  target: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0-4a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z",
  console: "M4 5h16v14H4zM4 9h16M8 13l2 2-2 2m4 0h4",
  chart: "M4 20V10m5.3 10V4m5.4 16v-7M20 20v-4",
  code: "M8 8l-4 4 4 4m8-8 4 4-4 4M14 5l-4 14",
  redirect: "M4 12h11m0 0-4-4m4 4-4 4M19 5v14",
  bolt: "M13 3 5 13h6l-1 8 8-10h-6l1-8Z",
  chat: "M4 5h16v11H9l-5 4V5Z",
  page: "M6 3h8l4 4v14H6V3Zm8 0v4h4M9 12h6m-6 4h6",
  key: "M15 9a3 3 0 1 1-3 3m3-3-9 9v3h3l1-1v-2h2v-2h2",
  doc: "M7 3h7l4 4v14H7zM10 11h5m-5 4h5",
  schema: "M3 6h18v12H3zM3 10h18M7 6v4",
  unlink: "M9 15l-2 2a3 3 0 0 1-4-4l2-2m10-2 2-2a3 3 0 0 0-4-4l-2 2M3 3l18 18",
  image: "M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9.5h.01",
  pin: "M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  store: "M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9c0 1.7 1.3 3 3 3s2.7-1.3 2.7-3c0 1.7 1.3 3 2.3 3s2.3-1.3 2.3-3c0 1.7 1 3 2.7 3s3-1.3 3-3M10 20v-5h4v5",
  layout: "M4 4h16v16H4zM4 9h16M9 9v11",
  move: "M4 8h13l-3-3M20 16H7l3 3",
  shield: "M12 3 5 6v5c0 4.4 3 7.9 7 10 4-2.1 7-5.6 7-10V6l-7-3Zm-3 9 2 2 4-4.5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4m8-4v4M8 14h2m4 0h2m-8 3h2",
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

function Wrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-8", className)}>{children}</div>
  );
}

const DISPLAY = "font-display font-bold tracking-[-0.03em]";

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

export function Hero() {
  return (
    <section aria-labelledby="seo-hero-heading" className="overflow-hidden bg-white pt-8 pb-20 lg:pt-10 lg:pb-28">
      <Wrap>
        <Link
          href="/business-solutions"
          className="inline-flex items-center gap-2.5 text-body-lg text-fg transition-colors hover:text-primary"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
          See all business services
        </Link>

        <div className="mt-6 grid [&>*]:min-w-0 items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-small font-bold uppercase tracking-[0.02em] text-primary">
              Services: SEO marketing
            </span>
            <h1
              id="seo-hero-heading"
              className={cn(DISPLAY, "mt-5 text-[44px] leading-[1.08] text-fg sm:text-[60px] lg:text-[76px] lg:leading-[1.12]")}
            >
              Get found by the people ready to buy
            </h1>
            <p className="mt-7 max-w-[600px] text-[20px] leading-[1.6] text-fg">
              We fix what stops search engines reading your site, then go after the searches
              that bring in customers, not just traffic.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <ChatButton />
              <a href="#plans" className="text-[22px] text-primary transition-colors hover:text-primary-hover">
                Every plan starts with an <span className="font-bold">audit</span>
              </a>
            </div>
          </div>

          <div className="relative px-2 sm:px-6 lg:px-0">
            <PerformanceMock />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ── 2. Black "made easy" bento ──────────────────────────────────────────── */

function DarkCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl bg-[#121212] p-7 sm:p-10 lg:p-14", className)}>{children}</div>;
}

export function MadeEasy() {
  return (
    <section aria-labelledby="seo-easy-heading" className="bg-black py-20 text-white lg:py-28">
      <Wrap>
        <div className="text-center">
          <h2 id="seo-easy-heading" className={cn(DISPLAY, "text-[36px] leading-[1.1] text-white sm:text-[48px] lg:text-[64px]")}>
            Search engine optimization, made simple
          </h2>
          <p className="mx-auto mt-6 max-w-[720px] text-body-lg text-white/90">
            You run the business. We do the work that gets it found, and show you what it earned.
          </p>
        </div>

        <div className="mx-auto mt-14 flex max-w-[1200px] flex-col gap-8">
          <DarkCard className="grid [&>*]:min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <AuditMock />
            <div>
              <Icon name="team" className="size-12 text-[#a855f7]" />
              <h3 className={cn(DISPLAY, "mt-6 text-[28px] leading-tight text-white lg:text-[32px]")}>
                One team, from audit to report
              </h3>
              <p className="mt-5 text-body-lg leading-[1.75] text-white/90">
                SEO is several disciplines at once. The same team covers all of them on your site,
                so nothing falls between a developer, a writer and an analyst.
              </p>
              <ul className="mt-7 flex flex-col gap-3">
                {["Technical SEO", "Keyword research & strategy", "On-page optimization", "Content writing", "Speed & Core Web Vitals"].map((r) => (
                  <li key={r} className="flex items-center gap-4 text-body-lg">
                    <span aria-hidden="true" className="text-[26px] leading-none font-light text-[#a855f7]">+</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </DarkCard>

          <div className="grid [&>*]:min-w-0 gap-8 lg:grid-cols-2">
            <DarkCard>
              <Icon name="loop" className="size-12 text-primary-on-dark" />
              <h3 className={cn(DISPLAY, "mt-6 text-[28px] leading-tight text-white lg:text-[32px]")}>
                Improvements every month
              </h3>
              <p className="mt-5 text-body-lg leading-[1.75] text-white/90">
                Once the audit fixes are in, the work moves to what compounds: new pages for the
                searches you are missing, better answers on the pages you have, and the upkeep that
                keeps both readable.
              </p>
              <ContentMock className="mt-8" />
            </DarkCard>
            <DarkCard>
              <Icon name="report" className="size-12 text-[#f59e0b]" />
              <h3 className={cn(DISPLAY, "mt-6 text-[28px] leading-tight text-white lg:text-[32px]")}>
                Monthly strategy & reporting
              </h3>
              <p className="mt-5 text-body-lg leading-[1.75] text-white/90">
                A report every month in plain English: what moved, what did not, and why. Every
                number ties back to visits, calls or orders, and the next month’s plan follows from it.
              </p>
              <ReportMock className="mt-8" />
            </DarkCard>
          </div>

          <DarkCard className="grid [&>*]:min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Icon name="pen" className="size-12 text-[#14b8a6]" />
              <h3 className={cn(DISPLAY, "mt-6 text-[28px] leading-tight text-white lg:text-[32px]")}>
                Content built for your market
              </h3>
              <p className="mt-5 text-body-lg leading-[1.75] text-white/90">
                Pages written around the searches your customers actually make, from service pages
                to in-depth guides. The wider your market, the more ground the content covers.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-2xl text-center ring-1 ring-[#c9d1d9]/70">
                <thead>
                  <tr>
                    <th className="border-r border-b border-[#c9d1d9]/70 bg-black p-2.5 sm:p-5" />
                    {PLANS.map((p) => (
                      <th key={p.name} className="border-b border-[#c9d1d9]/70 bg-black p-2.5 text-body font-bold sm:p-5 sm:text-body-lg [&:not(:last-child)]:border-r">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CONTENT_ROWS.map((row, ri) => (
                    <tr key={row.label}>
                      <th
                        scope="row"
                        className={cn(
                          "border-r border-[#c9d1d9]/70 bg-black p-2.5 text-right align-middle sm:p-5",
                          ri < CONTENT_ROWS.length - 1 && "border-b",
                        )}
                      >
                        <span className="block text-body font-bold sm:text-body-lg">{row.label}</span>
                        <span className="block text-small text-white/80 sm:text-body">{row.sub}</span>
                      </th>
                      {row.cells.map((c, ci) => (
                        <td
                          key={ci}
                          className={cn(
                            "border-[#c9d1d9]/70 p-2.5 text-small font-bold text-[#2dd4bf] sm:p-5 sm:text-body-lg",
                            ci < row.cells.length - 1 && "border-r",
                            ri < CONTENT_ROWS.length - 1 && "border-b",
                          )}
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DarkCard>
        </div>
      </Wrap>
    </section>
  );
}

const CONTENT_ROWS = [
  { label: "Market", sub: "where you rank", cells: ["City", "Region", "Nationwide"] },
  { label: "Pages", sub: "service & location", cells: ["✓", "✓", "✓"] },
  { label: "Guides", sub: "in-depth articles", cells: ["—", "✓", "✓"] },
] as const;

/* ── 3. Blue plans band ──────────────────────────────────────────────────── */

const PLANS = [
  {
    name: "Local",
    blurb: "For a business serving one city or area that wants to show up when nearby customers search.",
    targeting: "Local",
    extras: ["Google Business Profile optimization", "Service pages for your area"],
  },
  {
    name: "Growth",
    blurb: "For businesses ready to compete across a wider region, with more searches and more content.",
    targeting: "Regional",
    extras: ["New service & landing pages", "In-depth guides each month"],
  },
  {
    name: "National",
    blurb: "For brands competing nationwide on a broad set of searches, where authority decides rankings.",
    targeting: "National",
    extras: ["Topic hubs & long-form guides", "Earned-mention outreach"],
  },
] as const;

const PLAN_COMMON = [
  "Technical audit & fixes",
  "Keyword research & strategy",
  "On-page optimization",
  "Structured data (schema)",
  "Search Console & analytics setup",
  "Monthly report & strategy call",
];

function Tick() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-1 size-3.5 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

export function Plans() {
  return (
    <section id="plans" aria-labelledby="seo-plans-heading" className="scroll-mt-24 bg-primary py-20 text-white lg:py-28">
      <Wrap>
        <div className="text-center">
          <h2 id="seo-plans-heading" className={cn(DISPLAY, "text-[36px] leading-[1.1] text-white sm:text-[48px] lg:text-[64px]")}>
            SEO plans scoped to your market
          </h2>
          <p className="mx-auto mt-7 max-w-[760px] text-body-lg">
            Three starting points. The audit decides which one fits, and you see the quote before
            any work begins.
          </p>
          <p className="mt-10 text-body-lg font-bold">No rank promises. No bought links. Ever.</p>
        </div>

        <div className="mx-auto mt-12 grid [&>*]:min-w-0 max-w-[1260px] gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <article key={p.name} className="flex flex-col rounded-3xl bg-white p-7 text-fg shadow-[0_10px_30px_-10px_rgb(0_0_0/0.3)]">
              <h3 className={cn(DISPLAY, "text-[24px] tracking-[-0.01em]")}>{p.name}</h3>
              <p className="mt-2 min-h-[72px] text-body leading-relaxed text-fg">{p.blurb}</p>
              <p className="mt-6 text-body font-semibold">Pricing</p>
              <p className={cn(DISPLAY, "mt-1 text-[32px] leading-tight text-primary")}>Quoted after audit</p>
              <a
                href={AUDIT}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-xl text-body-lg font-semibold text-primary ring-2 ring-primary transition-colors hover:bg-primary hover:text-white"
              >
                Request an audit
              </a>
              <hr className="my-6 border-line" />
              <ul className="flex flex-col gap-2.5 text-small">
                <li className="flex gap-2.5">
                  <Tick />
                  <span>
                    <b>{p.targeting}</b> targeting
                  </span>
                </li>
                {p.extras.map((e) => (
                  <li key={e} className="flex gap-2.5">
                    <Tick />
                    <b className="font-semibold">{e}</b>
                  </li>
                ))}
                {PLAN_COMMON.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Tick />
                    <span className="border-b border-dashed border-line">{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-body text-white/90">
          Plan contents are a starting point. Your audit sets the final scope.
        </p>
      </Wrap>
    </section>
  );
}

/* ── 4. Chat split ───────────────────────────────────────────────────────── */

export function ChatSplit() {
  return (
    <section aria-labelledby="seo-chat-heading" className="bg-[#f4f5f9] py-20 lg:py-28">
      <Wrap className="grid [&>*]:min-w-0 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <SeraChatMock />
        <div>
          <h2 id="seo-chat-heading" className={cn(DISPLAY, "text-[44px] leading-[1.1] text-fg sm:text-[60px] lg:text-[76px]")}>
            Talk to us about your SEO
          </h2>
          <p className="mt-7 text-[22px] leading-[1.55] text-fg">
            Ask Sera anything about your site and get an answer straight away. A person on the team
            reads every conversation and follows up.
          </p>
          <div className="mt-10 flex flex-col items-start gap-5">
            <ChatButton icon>Chat with us</ChatButton>
            <a
              href={AUDIT}
              className="inline-flex h-14 items-center gap-2.5 rounded-xl px-8 text-body-lg font-semibold text-fg ring-[3px] ring-fg ring-inset transition-colors hover:bg-fg hover:text-white"
            >
              <Icon name="calendar" className="size-5" />
              Request an audit
            </a>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ── 5. Commitments (the reference's testimonials slot) ──────────────────── */

const COMMITMENTS = [
  {
    quote:
      "We will never promise you position one. Nobody outside Google controls rankings. We commit to the work, and we report honestly on the result.",
    by: "No ranking guarantees",
  },
  {
    quote:
      "White hat only. No bought links, no link networks, nothing that could earn your site a penalty. Authority is earned or it is not worth having.",
    by: "No shortcuts",
  },
] as const;

export function Commitments() {
  return (
    <section aria-labelledby="seo-promise-heading" className="bg-white py-20 lg:py-32">
      <Wrap className="grid [&>*]:min-w-0 items-center gap-12 lg:grid-cols-2 lg:gap-12">
        <div className="lg:pl-[12%]">
          <Icon name="shield" className="size-28 text-primary [stroke-width:2.4]" />
          <p className="mt-6 text-[22px] font-bold uppercase tracking-[0.01em] text-primary">Our commitments</p>
          <h2 id="seo-promise-heading" className={cn(DISPLAY, "mt-2 text-[44px] leading-[1.12] text-fg lg:text-[60px]")}>
            What you can hold us to
          </h2>
        </div>
        <div className="flex flex-col gap-8">
          {COMMITMENTS.map((c) => (
            <figure key={c.by} className="rounded-3xl bg-white p-8 shadow-[0_8px_40px_-6px_rgb(16_24_40/0.12)] ring-1 ring-black/[0.03] sm:p-12">
              <blockquote className="text-body-lg leading-[1.75] text-fg">“{c.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center gap-2.5 text-body-lg font-bold text-fg">
                <Icon name="shield" className="size-6 text-primary" />
                {c.by}
              </figcaption>
            </figure>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ── 6–7. Feature groups ─────────────────────────────────────────────────── */

type Feature = { icon: IconName; title: string; body: string; tag?: string; href?: string };

const SETUP: Feature[] = [
  { icon: "call", title: "Kickoff call", body: "A call to agree on your goals, your market and the customers you want more of, so the strategy starts from the business, not a keyword tool." },
  { icon: "scan", title: "Technical audit", body: "A full crawl of your site: what search engines can't reach, can't read or don't trust, ranked by what to fix first." },
  { icon: "sitemap", title: "Sitemap & robots.txt", body: "We generate an XML sitemap and review robots.txt so search engines can find and crawl every page that matters." },
  { icon: "target", title: "Keyword research", body: "The searches your customers actually make, sorted by intent, so effort goes where it brings in buyers." },
];

const SETUP_MORE: Feature[] = [
  { icon: "redirect", title: "404s & redirects", body: "Broken URLs are redirected to the right page and your 404 page is set up to send visitors somewhere useful." },
  { icon: "chart", title: "Analytics setup", body: "Traffic, calls and form fills tracked properly, so every report ties rankings to real results." },
  { icon: "console", title: "Search Console setup", body: "Your site verified in Google Search Console, giving you a direct view of how Google indexes and ranks it." },
];

const ONGOING: Feature[] = [
  { icon: "calendar", title: "Monthly strategy call", body: "A call every month to walk through the report, agree on priorities and adjust the plan as your business changes." },
  { icon: "report", title: "Monthly report", body: "Where you rank, what changed and why, in plain English. Track progress and see where the next month’s effort goes." },
  { icon: "page", title: "Page optimization", body: "We review your most important pages and improve titles, headings, copy and internal links to make them more relevant." },
  { icon: "key", title: "Keyword optimization", body: "We keep checking the searches you target, so effort shifts to the ones that bring the most qualified visitors." },
  { icon: "doc", title: "Content creation", body: "Original pages and articles written for your customers and your keywords, published on your site every month." },
  { icon: "schema", title: "Rich results & schema", body: "Structured data that lets search engines show your hours, ratings, prices and FAQs right in the results." },
];

const ONGOING_MORE: Feature[] = [
  { icon: "unlink", title: "Broken link repair", body: "We find and fix broken links before search engines treat your site as neglected or unsafe." },
  { icon: "image", title: "Image alt text", body: "Descriptive alt text on your images, improving accessibility and helping images show up in search." },
  { icon: "pin", title: "Market targeting", body: "Depending on your plan, keyword strategy is focused on your city, your region or the whole country." },
  { icon: "store", title: "Google Business Profile", body: "Your profile completed and kept accurate, so you show up properly in local results and on Maps." },
];

const ADDONS: Feature[] = [
  { icon: "layout", title: "Website rebuild", tag: "Optional add-on", href: "/website-design", body: "When the site itself is the problem, we rebuild it with structure, metadata and speed done from the start. Cheaper than retrofitting." },
  { icon: "move", title: "Faster hosting", tag: "Optional add-on", href: "/migrations", body: "A slow server holds rankings back. We can move your site to Serverlys hosting, free, with no downtime." },
];

function FeatureItem({ f, dark, accent }: { f: Feature; dark: boolean; accent: string }) {
  return (
    <div>
      <h4 className={cn(DISPLAY, "flex items-center gap-4 text-[22px] tracking-[-0.01em] sm:text-[24px]", dark ? "text-white" : "text-fg")}>
        <Icon name={f.icon} className={cn("size-7", accent)} />
        {f.title}
      </h4>
      {f.tag && <p className="mt-3 text-body-lg text-[#a855f7]">{f.tag}</p>}
      <p className={cn("text-body-lg leading-[1.75]", f.tag ? "mt-1" : "mt-4", dark ? "text-white/90" : "text-fg")}>
        {f.body}
      </p>
      {f.href && (
        <Link href={f.href} className="mt-2 inline-block text-body font-semibold text-primary hover:text-primary-hover">
          Learn more →
        </Link>
      )}
    </div>
  );
}

function Group({
  title,
  items,
  dark,
  bar,
  accent,
}: {
  title: string;
  items: Feature[];
  dark: boolean;
  bar: string;
  accent: string;
}) {
  return (
    <div className="grid [&>*]:min-w-0 gap-10 lg:grid-cols-[440px_1fr] lg:gap-0">
      <h3 className={cn(DISPLAY, "text-[40px] leading-[1.2] lg:pl-[18%] lg:text-[60px] lg:leading-[1.25]", dark ? "text-white" : "text-fg")}>
        {title}
      </h3>
      <div className="relative lg:pl-[88px]">
        <span aria-hidden="true" className={cn("absolute top-0 bottom-0 left-0 hidden w-2 rounded-full lg:block", bar)} />
        <div className="grid [&>*]:min-w-0 gap-x-12 gap-y-12 sm:grid-cols-2">
          {items.map((f) => (
            <FeatureItem key={f.title} f={f} dark={dark} accent={accent} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Included() {
  return (
    <section aria-labelledby="seo-included-heading" className="bg-black py-20 text-white lg:py-28">
      <Wrap>
        <div className="text-center">
          <h2 id="seo-included-heading" className={cn(DISPLAY, "text-[36px] leading-[1.1] text-white sm:text-[48px] lg:text-[64px]")}>
            Included in every plan
          </h2>
          <p className="mx-auto mt-6 max-w-[620px] text-body-lg leading-[1.75] text-white/90">
            Everything a site needs to be read, understood and ranked by search engines like Google.
          </p>
        </div>
        <div className="mt-16 lg:mt-24">
          <Group
            title="Setup & audit"
            items={SETUP}
            dark
            bar="bg-gradient-to-b from-[#14b8a6] to-[#0a6cff]"
            accent="text-[#2dd4bf]"
          />
        </div>
        <div className="mt-20 grid [&>*]:min-w-0 items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <SerpMock />
          <div className="flex flex-col gap-12">
            {SETUP_MORE.map((f) => (
              <FeatureItem key={f.title} f={f} dark accent="text-[#2dd4bf]" />
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

export function Ongoing() {
  return (
    <section aria-labelledby="seo-ongoing-heading" className="bg-white py-20 lg:py-28">
      <Wrap>
        <h2 id="seo-ongoing-heading" className="sr-only">
          Ongoing SEO optimization
        </h2>
        <Group
          title="Ongoing SEO optimization"
          items={ONGOING}
          dark={false}
          bar="bg-gradient-to-b from-[#a855f7] to-[#0a6cff]"
          accent="text-[#a855f7]"
        />
        <div className="mt-20 grid [&>*]:min-w-0 items-center gap-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-12">
            {ONGOING_MORE.map((f) => (
              <FeatureItem key={f.title} f={f} dark={false} accent="text-[#a855f7]" />
            ))}
          </div>
          <RankTrackerMock />
        </div>
        <div className="mt-20 grid [&>*]:min-w-0 gap-12 lg:grid-cols-2 lg:gap-12">
          {ADDONS.map((f) => (
            <FeatureItem key={f.title} f={f} dark={false} accent="text-[#a855f7]" />
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ── 8. CTA card ─────────────────────────────────────────────────────────── */

export function CtaCard() {
  return (
    <section aria-labelledby="seo-cta-heading" className="bg-[linear-gradient(to_bottom,#fff_0,#fff_50%,#000_50%,#000_100%)]">
      <Wrap>
        <div className="relative overflow-hidden rounded-2xl bg-[#0b0d12] px-6 py-24 text-center lg:py-32">
          {/* Backdrop: the page's own product screens, tilted and dimmed */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-45">
            <div className="absolute top-8 -left-24 w-[560px] -rotate-6">
              <RankTrackerMock />
            </div>
            <div className="absolute -right-20 -bottom-28 w-[600px] rotate-[5deg]">
              <SerpMock />
            </div>
            <div className="absolute top-[-90px] right-[18%] hidden w-[380px] rotate-[3deg] xl:block">
              <ReportMock className="bg-[#16171b]" />
            </div>
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(11_13_18/0.92)_0%,rgb(11_13_18/0.7)_55%,rgb(11_13_18/0.35)_100%)]" />
          <div className="relative">
            <h2 id="seo-cta-heading" className={cn(DISPLAY, "text-[36px] leading-[1.1] text-white sm:text-[48px] lg:text-[64px]")}>
              Ready to be found?
            </h2>
            <p className="mx-auto mt-4 max-w-[640px] text-body-lg text-white/90">
              Tell us about your business and we will start with an audit of where you stand.
            </p>
            <div className="mt-9 flex justify-center">
              <ChatButton />
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ── 9. FAQ ──────────────────────────────────────────────────────────────── */

export function Faqs({ items }: { items: readonly Faq[] }) {
  return (
    <section aria-labelledby="seo-faq-heading" className="bg-black pt-24 pb-24 text-white lg:pt-32 lg:pb-32">
      <Wrap className="grid [&>*]:min-w-0 gap-10 lg:grid-cols-2 lg:gap-14">
        <h2 id="seo-faq-heading" className={cn(DISPLAY, "text-[36px] leading-[1.15] text-white lg:text-[60px]")}>
          Frequently asked questions
        </h2>
        <div className="border-t border-white/20">
          {items.map((f) => (
            <details key={f.question} className="group border-b border-white/20">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-9 text-[20px] font-bold tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                {f.question}
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 shrink-0 transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M12 4v16M4 12h16" />
                </svg>
              </summary>
              <p className="-mt-3 pb-9 text-body-lg leading-[1.75] text-white/80">{f.answer}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
