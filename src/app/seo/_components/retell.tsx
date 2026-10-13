import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import type { Faq } from "@/data/faqs";
import { formatSeoPrice, seoFromPrice, seoOrderUrl, seoPlans } from "@/data/seo-plans";
import { Reveal } from "@/components/animations/reveal";
import { ChatButton } from "./chat-button";
import { ArticleMock, AuditMock, RankTrackerMock } from "./mocks";

/**
 * /seo below the hero — 2026-10-13, rebuilt to the Retell AI receptionists
 * page section for section:
 *
 *   trust bar → How it works (four tall cards) → Use cases (alternating
 *   photo rows) → navy band → three statement cards → Features (sticky
 *   tabs, visual, stacked features) → tools marquee → pricing panel → FAQ
 *   → related solutions → full-bleed photo CTA.
 *
 * WHAT IS LEFT OUT, ON PURPOSE:
 *   - Retell's client-logo bar and "4,000 businesses" count. Serverlys has no
 *     SEO client roster or count to show; the bar names the tools instead.
 *   - Retell's testimonial stack. No real Serverlys SEO testimonials exist
 *     and check-reviews.mjs forbids placeholders. Add it when they do.
 *   - Retell's compliance claims (SOC 2, HIPAA, GDPR). The three cards here
 *     carry Serverlys's own commitments instead.
 *
 * Photography: real Unsplash photos (public/mock/CREDITS.md) of small-business
 * owners at work. Every feature named is one a plan in data/seo-plans.ts sells.
 */

const INK = "text-[#0b1530]";
const MUTED = "text-[#5b6472]";
const PANEL = "bg-[#f4f4f7]";

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-[13px] font-medium text-primary", className)}>{children}</p>
  );
}

function Heading({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "mx-auto mt-4 max-w-[760px] text-center font-display text-[32px] leading-[1.15] font-normal tracking-[-0.025em] sm:text-[40px] lg:text-[46px]",
        INK,
        className,
      )}
    >
      {children}
    </h2>
  );
}

function Wrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1120px] px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

function Photo({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 540px, 100vw",
  position = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  position?: string;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}

/* ── 2. Trust bar ────────────────────────────────────────────────────────── */

const TOOLS = [
  "Search Console",
  "Business Profile",
  "Analytics",
  "PageSpeed",
  "Schema.org",
];

export function TrustBar() {
  return (
    <section
      aria-label="Tools we work in"
      className="border-b border-black/[0.06] bg-white py-10 lg:py-12"
    >
      <Wrap className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <p className={cn("max-w-[360px] text-[18px] leading-snug lg:text-[19px]", INK)}>
          Done in the tools Google itself uses to judge your site.
        </p>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {TOOLS.map((t) => (
            <li
              key={t}
              className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.01em] text-[#1f2937] opacity-80"
            >
              <span aria-hidden="true" className="grid size-5 grid-cols-2 gap-[2px]">
                <span className="rounded-[2px] bg-[#4285f4]" />
                <span className="rounded-[2px] bg-[#ea4335]" />
                <span className="rounded-[2px] bg-[#fbbc04]" />
                <span className="rounded-[2px] bg-[#34a853]" />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ── 3. How it works ─────────────────────────────────────────────────────── */

const STEPS = [
  {
    title: "Audit the site",
    body: "We crawl every page and check what Google can and can't read: broken links, missing titles, slow images, crawl and sitemap problems. You get the list, ranked by what to fix first.",
  },
  {
    title: "Research the searches that sell",
    body: "Keyword research built around your services and your area, up to 10 keywords on Starter, 25 on Growth and unlimited on Elite, chosen for the searches that end in a call or an order.",
  },
  {
    title: "Fix, optimize and publish",
    body: "Titles, meta descriptions, headings and images fixed; your Google Business Profile optimized; and on Growth and Elite, new blog content and backlink outreach every month.",
  },
  {
    title: "Report what it earned",
    body: "A monthly SEO report shows where you rank and what changed. Growth adds keyword tracking and Elite adds a white-labeled report with an ROI summary.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="seo-how-heading" className="bg-white py-20 lg:py-28">
      <Wrap>
        <Label className="text-center">How it works</Label>
        <Heading
          id="seo-how-heading"
          className="max-w-[560px] text-[24px] sm:text-[28px] lg:text-[30px]"
        >
          From audit to rankings, on the site you already have.
        </Heading>
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 80}
              className={cn(
                "flex min-h-[300px] flex-col justify-between rounded-2xl p-6 lg:min-h-[400px]",
                PANEL,
              )}
            >
              <h3
                className={cn(
                  "text-[24px] leading-[1.2] font-normal tracking-[-0.02em]",
                  INK,
                )}
              >
                {s.title}
              </h3>
              <p className={cn("mt-10 text-[14px] leading-[1.6]", MUTED)}>{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}

/* ── 4. Use cases ────────────────────────────────────────────────────────── */

const USES = [
  {
    title: "Show up first on Google Maps",
    body: "When someone nearby searches for what you sell, the map pack decides who gets the call. We optimize your Google Business Profile, your location signals and your local listings so you are in it: one location on Starter, up to three on Growth, multi-location on Elite.",
    src: "/mock/seo-local.jpg",
    alt: "A barber trimming a customer’s hair in his shop",
    position: "center 35%",
  },
  {
    title: "Fix what stops Google reading your site",
    body: "Broken links, missing titles, slow pages and crawl errors quietly cost you rankings. Every plan starts with a technical audit and the fixes; Growth adds 404s, redirects, Core Web Vitals and speed optimization.",
    src: "/mock/seo-technical.jpg",
    alt: "A smiling restaurant owner working on a laptop at a table in his restaurant",
    position: "center 40%",
  },
  {
    title: "Publish content that ranks",
    body: "Pages and posts written around what your customers actually search for. Growth publishes an optimized blog post every month with schema and internal linking; Elite publishes up to four, from a full content strategy.",
    src: "/mock/seo-content.jpg",
    alt: "A florist arranging a bouquet of fresh flowers",
    position: "center 45%",
  },
  {
    title: "Earn links that build authority",
    body: "Links from trusted sites tell Google you are worth ranking. Starter builds them from local directories, Growth adds manual outreach for niche links, and Elite adds guest posts and PR backlinks. White-hat only.",
    src: "/mock/seo-links.jpg",
    alt: "A café owner working on a laptop at her counter",
    position: "center 40%",
  },
  {
    title: "See exactly what it earned",
    body: "Every month you get a report in plain English: where you rank, what moved, what did not and what comes next. On Elite, a dedicated SEO manager walks you through it, with optional bi-weekly strategy meetings.",
    src: "/mock/seo-reports.jpg",
    alt: "A woman smiling at her laptop in a café",
    position: "center 40%",
  },
];

export function UseCases() {
  return (
    <section aria-labelledby="seo-uses-heading" className="bg-white pb-20 lg:pb-28">
      <Wrap>
        <Label className="text-center">What we handle</Label>
        <Heading id="seo-uses-heading">
          What your SEO plan handles from month one
        </Heading>
        <div className="mt-14 flex flex-col gap-14 lg:mt-20 lg:gap-20">
          {USES.map((u, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal
                key={u.title}
                className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <Photo
                  src={u.src}
                  alt={u.alt}
                  position={u.position}
                  className={cn(
                    "relative aspect-[3/2] rounded-xl",
                    flip && "lg:order-2",
                  )}
                />
                <div className={cn("lg:pt-2", flip && "lg:order-1")}>
                  <h3
                    className={cn(
                      "max-w-[420px] text-[28px] leading-[1.18] font-normal tracking-[-0.02em] lg:text-[32px]",
                      INK,
                    )}
                  >
                    {u.title}
                  </h3>
                  <hr className="my-7 border-black/[0.08] lg:my-9" />
                  <p className={cn("text-[15px] leading-[1.65]", MUTED)}>{u.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}

/* ── 5. Navy band ────────────────────────────────────────────────────────── */

export function NavyBand() {
  return (
    <section aria-labelledby="seo-navy-heading" className="px-2">
      <div className="rounded-[20px] bg-[#0b1530] py-16 text-white lg:py-20">
        <Wrap className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-[13px] font-medium text-[#f5a524]">
              Built for small businesses, not agency dashboards
            </p>
            <h2
              id="seo-navy-heading"
              className="mt-5 max-w-[560px] font-display text-[32px] leading-[1.15] font-normal tracking-[-0.025em] text-white lg:text-[40px]"
            >
              SEO, hosting and your website, under one roof
            </h2>
            <p className="mt-8 max-w-[520px] text-[16px] leading-[1.6] text-white/80">
              Serverlys hosts websites, builds them and ranks them, so the team doing
              your SEO can fix the server, the code and the content without a three-way
              handoff.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-[300px] text-[15px] leading-[1.55] text-white/85">
              <span className="text-[#f5a524]">White-hat only</span> and{" "}
              <span className="text-[#f5a524]">billed monthly</span>. Plans start at{" "}
              <span className="text-[#f5a524]">{formatSeoPrice(seoFromPrice)}/mo</span>.
            </p>
            <a
              href="#plans"
              className="mt-6 inline-flex h-10 items-center rounded-md bg-white px-5 text-[14px] font-semibold text-[#0b1530] transition-colors hover:bg-white/85"
            >
              See SEO plans
            </a>
          </div>
        </Wrap>
      </div>
    </section>
  );
}

/* ── 6. Statement cards (the reference's compliance cards) ───────────────── */

const PROMISES = [
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
    body: "Every monthly report says what moved, what did not and why, tied to visits, calls and orders rather than vanity charts.",
  },
];

export function Promises() {
  return (
    <section aria-labelledby="seo-promise-heading" className="bg-white py-20 lg:py-28">
      <Wrap>
        <Label className="text-center">Our commitments</Label>
        <p
          id="seo-promise-heading"
          className={cn(
            "mx-auto mt-6 max-w-[880px] text-center text-[18px] leading-snug lg:text-[20px]",
            INK,
          )}
        >
          SEO is full of promises nobody can keep. These are the ones we can keep, on
          every plan.
        </p>
        <ul className="mt-12 grid gap-3 lg:grid-cols-3">
          {PROMISES.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 80}
              className={cn(
                "flex min-h-[260px] flex-col justify-between rounded-2xl p-6 lg:min-h-[300px]",
                PANEL,
              )}
            >
              <h3
                className={cn(
                  "text-[24px] leading-[1.2] font-normal tracking-[-0.02em]",
                  INK,
                )}
              >
                {p.title}
              </h3>
              <p
                className={cn(
                  "mt-10 max-w-[340px] text-[15px] leading-[1.6]",
                  "text-[#2b3442]",
                )}
              >
                {p.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ── 7. Features: sticky tabs, visual, stacked features ─────────────────── */

const GROUPS = [
  {
    tab: "Starter",
    visual: <AuditMock />,
    backdrop: "/mock/seo-technical.jpg",
    features: [
      [
        "Technical audit and fixes",
        "A full audit of your site with the technical SEO basics fixed: titles, headings, meta descriptions, sitemap and robots.txt.",
      ],
      [
        "Google Business Profile",
        "Your profile completed and optimized, with local SEO for one location so you show up in the map pack.",
      ],
      [
        "Image optimization",
        "Alt tags and compression on your images: faster pages, better accessibility and a chance to rank in image search.",
      ],
    ],
  },
  {
    tab: "Growth",
    visual: <ArticleMock />,
    backdrop: "/mock/seo-content.jpg",
    features: [
      [
        "A blog post every month",
        "One optimized post a month, written around your keyword strategy and linked into the pages that sell.",
      ],
      [
        "Schema and content silos",
        "Advanced on-page SEO: structured data, internal linking and content silos that tell Google what each page is about.",
      ],
      [
        "Backlink outreach",
        "Manual outreach for high-quality niche links, plus competitor analysis to find the gaps worth taking.",
      ],
    ],
  },
  {
    tab: "Elite",
    visual: <RankTrackerMock />,
    backdrop: "/mock/seo-reports.jpg",
    features: [
      [
        "A dedicated SEO manager",
        "One person who owns your account, with optional bi-weekly strategy meetings and a white-labeled ROI report.",
      ],
      [
        "Conversion rate optimization",
        "A CRO audit with suggestions and ongoing A/B tests on calls to action and titles, so more visitors become customers.",
      ],
      [
        "High-authority links",
        "Guest posts, PR backlinks and manual outreach, plus a full technical audit every three months.",
      ],
    ],
  },
];

export function Features() {
  return (
    <section aria-labelledby="seo-features-heading" className="bg-white pb-20 lg:pb-28">
      <Wrap>
        <Label className="text-center">Features</Label>
        <Heading id="seo-features-heading">
          Why small businesses choose Serverlys for SEO
        </Heading>
        <div className="mt-14 flex flex-col gap-20 lg:mt-20 lg:gap-28">
          {GROUPS.map((g) => (
            <div
              key={g.tab}
              className="grid gap-8 lg:grid-cols-[120px_1fr_1fr] lg:gap-10"
            >
              <ul
                className="hidden lg:sticky lg:top-28 lg:block lg:self-start"
                aria-hidden="true"
              >
                {GROUPS.map((t) => (
                  <li
                    key={t.tab}
                    className={cn(
                      "mb-6 inline-flex rounded-full px-3 py-1.5 text-[13px] font-medium",
                      t.tab === g.tab ? "bg-brand-50 text-primary" : "text-brand-300",
                    )}
                  >
                    {t.tab}
                  </li>
                ))}
              </ul>
              <Reveal className="relative overflow-hidden rounded-xl lg:sticky lg:top-28 lg:self-start">
                <Photo
                  src={g.backdrop}
                  alt=""
                  className="absolute inset-0"
                  sizes="(min-width: 1024px) 460px, 100vw"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#0b1530]/55 backdrop-blur-[2px]"
                />
                <div className="relative p-5 sm:p-8">{g.visual}</div>
              </Reveal>
              <div>
                <p className="mb-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-[13px] font-medium text-primary lg:hidden">
                  SEO {g.tab}
                </p>
                {g.features.map(([title, body], i) => (
                  <div
                    key={title}
                    className={cn(i > 0 && "mt-8 border-t border-black/[0.08] pt-8")}
                  >
                    <h3
                      className={cn(
                        "text-[20px] leading-snug font-normal tracking-[-0.01em]",
                        INK,
                      )}
                    >
                      {title}
                    </h3>
                    <p className={cn("mt-4 text-[14px] leading-[1.65]", MUTED)}>
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ── 8. Tools marquee (the reference's integrations) ─────────────────────── */

const ROW_A = [
  "WordPress",
  "WooCommerce",
  "Google Search Console",
  "Google Analytics",
  "Google Business Profile",
  "Bing Webmaster Tools",
  "Google Maps",
];
const ROW_B = [
  "Schema.org",
  "PageSpeed Insights",
  "Core Web Vitals",
  "XML sitemaps",
  "robots.txt",
  "Local directories",
  "Internal linking",
];

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul
        className={cn(
          "seo-ticker flex w-max gap-4",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {[0, 1].flatMap((copy) =>
          items.map((t) => (
            <li
              key={`${copy}-${t}`}
              className="flex shrink-0 items-center gap-2.5 px-6 py-2 text-[16px] font-medium whitespace-nowrap text-[#374151]"
            >
              <span aria-hidden="true" className="size-2 rounded-full bg-primary/70" />
              {t}
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

export function Tools() {
  return (
    <section aria-labelledby="seo-tools-heading" className="bg-white pb-20 lg:pb-28">
      <Wrap>
        <Label className="text-center">Tools</Label>
        <Heading id="seo-tools-heading" className="max-w-[520px]">
          The tools and platforms we work in
        </Heading>
        <div className="mt-8 flex justify-center">
          <a
            href="#plans"
            className="inline-flex h-10 items-center rounded-md bg-[#0b1530] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#1b2750]"
          >
            See what’s included
          </a>
        </div>
      </Wrap>
      <div aria-hidden="true" className="mt-14 flex flex-col gap-4">
        <MarqueeRow items={ROW_A} />
        <MarqueeRow items={ROW_B} reverse />
      </div>
    </section>
  );
}

/* ── 9. Pricing panel ────────────────────────────────────────────────────── */

function Tick({ onBlue }: { onBlue?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 size-[18px] shrink-0">
      <circle cx="10" cy="10" r="9" fill={onBlue ? "#fff" : "#0b1530"} />
      <path
        d="m6 10.2 2.6 2.6L14 7.4"
        fill="none"
        stroke={onBlue ? "var(--color-primary)" : "#fff"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PLAN_ICONS: Record<string, string> = {
  starter:
    "M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  growth: "M4 19 10 13l4 4 6-8M15 9h5v5",
  elite: "M5 21V9l7-5 7 5v12M9 21v-6h6v6",
};

export function Pricing() {
  return (
    <section
      id="plans"
      aria-labelledby="seo-plans-heading"
      className="scroll-mt-20 bg-[#f7f7f8] py-20 lg:py-28"
    >
      <Wrap>
        <Label className="text-center">Pricing</Label>
        <Heading id="seo-plans-heading">
          SEO packages and pricing, billed monthly
        </Heading>
        <div className="mt-14 grid gap-3 rounded-[24px] bg-[#ececef] p-3 lg:grid-cols-3">
          {seoPlans.map((p, i) => {
            const blue = Boolean(p.popular);
            const prev = seoPlans[i - 1];
            return (
              <Reveal
                as="article"
                key={p.id}
                delay={i * 80}
                className={cn(
                  "flex flex-col rounded-[18px] p-7",
                  blue ? "bg-primary text-white" : "bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg shadow-sm",
                    blue ? "bg-white text-primary" : "bg-white text-primary",
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={PLAN_ICONS[p.id]} />
                  </svg>
                </span>
                <h3
                  className={cn(
                    "mt-7 flex items-center gap-2 text-[22px] font-semibold tracking-[-0.01em]",
                    blue ? "text-white" : INK,
                  )}
                >
                  {p.name}
                  {blue && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">
                      Most popular
                    </span>
                  )}
                </h3>
                <p
                  className={cn(
                    "mt-2 min-h-12 text-[14px] leading-[1.55]",
                    blue ? "text-white/80" : MUTED,
                  )}
                >
                  {p.summary}
                </p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span
                    className={cn(
                      "tabular text-[40px] leading-none font-semibold tracking-[-0.03em]",
                      blue ? "text-white" : INK,
                    )}
                  >
                    {formatSeoPrice(p.price)}
                  </span>
                  <span className={blue ? "text-white/80" : MUTED}>/mo</span>
                </p>
                <a
                  href={seoOrderUrl(p)}
                  className={cn(
                    "mt-6 flex h-11 items-center justify-center rounded-md text-[14px] font-semibold transition-colors",
                    blue
                      ? "bg-white text-[#0b1530] hover:bg-white/90"
                      : "bg-white text-[#0b1530] ring-1 ring-black/[0.08] hover:bg-[#f7f7f8]",
                  )}
                >
                  Get {p.name}
                </a>
                <p
                  className={cn(
                    "mt-7 text-[13px] font-semibold",
                    blue ? "text-white" : INK,
                  )}
                >
                  {prev ? `Everything in ${prev.name}, plus` : "What’s included"}
                </p>
                <ul className="mt-4 flex flex-col gap-3.5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className={cn(
                        "flex gap-3 text-[14px] leading-[1.5]",
                        blue ? "text-white" : "text-[#2b3442]",
                      )}
                    >
                      <Tick onBlue={blue} />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
        <p className={cn("mt-8 text-center text-[14px]", MUTED)}>
          Not sure which plan fits?{" "}
          <a
            href={billing.sales}
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Ask the team for a recommendation
          </a>
          .
        </p>
      </Wrap>
    </section>
  );
}

/* ── 10. FAQ ─────────────────────────────────────────────────────────────── */

export function Faqs({ items }: { items: readonly Faq[] }) {
  return (
    <section aria-labelledby="seo-faq-heading" className="bg-[#f7f7f8] pb-20 lg:pb-28">
      <Wrap>
        <Label className="text-center">FAQ</Label>
        <Heading id="seo-faq-heading">Frequently asked questions.</Heading>
        <div className="mt-14 border-t border-black/[0.08]">
          {items.map((f) => (
            <details key={f.question} className="group border-b border-black/[0.08]">
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[18px] leading-snug font-normal tracking-[-0.01em] sm:text-[20px] [&::-webkit-details-marker]:hidden",
                  INK,
                )}
              >
                {f.question}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eceef2] transition-colors group-open:bg-primary group-open:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-open:rotate-45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className={cn("max-w-[820px] pb-7 text-[15px] leading-[1.7]", MUTED)}>
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ── 11. Related solutions ───────────────────────────────────────────────── */

const RELATED = [
  ["Website design", "/website-design"],
  ["Free site migration", "/migrations"],
  ["WordPress hosting", "/wordpress-hosting"],
  ["Cloud hosting", "/cloud-hosting"],
  ["Ecommerce hosting", "/ecommerce-hosting"],
  ["Social media", "/social-media"],
] as const;

export function Related() {
  return (
    <section aria-labelledby="seo-related-heading" className="bg-white py-14">
      <Wrap>
        <Label className="text-center">
          <span id="seo-related-heading">Related solutions</span>
        </Label>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {RELATED.map(([label, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex rounded-md bg-[#f1f2f5] px-3.5 py-2 text-[14px] font-medium text-[#0b1530] transition-colors hover:bg-brand-50 hover:text-primary"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ── 12. Full-bleed photo CTA ────────────────────────────────────────────── */

export function PhotoCta() {
  return (
    <section aria-labelledby="seo-cta-heading" className="bg-white px-2 pb-2">
      <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-[20px] px-5 py-16 lg:min-h-[640px]">
        <Image
          src="/mock/seo-cta.jpg"
          alt="A café owner checking orders on a tablet at her counter"
          fill
          sizes="100vw"
          className="object-cover object-[70%_40%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/10" />
        <div className="relative flex min-h-[340px] w-full max-w-[360px] flex-col justify-between bg-[#f7f7f9] p-5 shadow-[0_20px_60px_-10px_rgb(0_0_0/0.35)]">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="seo-cta-heading"
              className={cn(
                "text-[22px] leading-[1.2] font-normal tracking-[-0.02em]",
                INK,
              )}
            >
              Get found by the customers already searching for you
            </h2>
            <div className="relative size-[76px] shrink-0 overflow-hidden rounded-md">
              <Image
                src="/mock/seo-local.jpg"
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <p className={cn("text-[14px] leading-snug", INK)}>
              Start with an audit of where you stand. Plans from{" "}
              {formatSeoPrice(seoFromPrice)}/mo.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="#plans"
                className="inline-flex h-9 items-center rounded-[4px] bg-[#0b1530] px-3.5 text-[13px] font-semibold text-white hover:bg-[#1b2750]"
              >
                See SEO plans
              </a>
              <ChatButton size="sm">Ask Sera</ChatButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
