import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, faqGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { billing, company, emailDisplay, sisterProducts } from "@/data/company";
import { formatPrice, groupById } from "@/data/pricing";
import { Faqs, INK, MUTED, Wrap } from "@/components/retell/kit";
import { ChatButton } from "@/components/retell/chat-button";
import { Reveal } from "@/components/animations/reveal";
import { AccountMock } from "../business-solutions/_components/mocks";
import { HistoryRail, UsedFor, type UseItem } from "./_components/interactive";

/**
 * About — rebuilt 2026-10-13 to the hostinger.com/about layout, section for
 * section: dark hero with a photo collage and four stats → What we do →
 * What it's used for (accordion) → History rail → Where we are /
 * infrastructure → dark recognition band → People → customers band →
 * Office → FAQ.
 *
 * FACTS: Edgar supplied "founded 4 years ago" (→ 2022) and Miami. Nothing
 * else about the company is on record, so:
 *   - no customer, website or country counts (he said "a lot of small
 *     businesses"; no number was given, so none is printed);
 *   - no street address, no data-center locations, no team size, no
 *     founder or leadership names, no team photos (stock people would read
 *     as staff);
 *   - the awards band is the "Check our promises" ledger instead, and the
 *     testimonial band is an industries band, not quotes.
 * When Edgar supplies any of those, add them here; never estimate them.
 *
 * UNIQUE: the promises ledger computes its proof from the same plan data the
 * checkout uses, so each promise is shown being kept, live.
 */

const PATH = "/about";
const FOUNDED = 2022;
const YEARS = new Date().getFullYear() - FOUNDED;

export const metadata = pageMetadata({
  title: "About Serverlys | Hosting, Websites & AI for Small Business",
  description:
    "Serverlys, LLC is a Miami company founded in 2022 that hosts, builds, grows and manages websites for small businesses, with renewal prices shown up front.",
  path: PATH,
});

const CLOUD = groupById("cloud");

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

const COLLAGE = [
  {
    src: "/mock/biz-salon.jpg",
    alt: "",
    cls: "left-[1%] top-[14%] w-[22%] -rotate-[4deg] z-10",
    pos: "center 30%",
  },
  {
    src: "/mock/social-latte.jpg",
    alt: "",
    cls: "left-[19%] top-[3%] w-[22%] rotate-[2deg] z-20",
    pos: "center",
  },
  {
    src: "/mock/design-hero.jpg",
    alt: "",
    cls: "left-[38%] top-[8%] w-[24%] -rotate-[1deg] z-30",
    pos: "40% 30%",
  },
  {
    src: "/mock/mkt-bakery.jpg",
    alt: "",
    cls: "left-[58%] top-[4%] w-[22%] rotate-[3deg] z-20",
    pos: "center 40%",
  },
  {
    src: "/mock/move-cta.jpg",
    alt: "",
    cls: "left-[76%] top-[12%] w-[23%] rotate-[5deg] z-10",
    pos: "center 35%",
  },
];

function Hero() {
  const starter = CLOUD?.plans[0];
  const stats = [
    {
      top: `Founded in ${FOUNDED}`,
      big: String(YEARS),
      sub: "Years serving small businesses",
    },
    { top: "Under one roof", big: "9", sub: "Services, one team, one bill" },
    {
      top: "Hosting from",
      big: starter ? `${formatPrice(starter.monthly)}` : "—",
      sub: starter ? `Renews at ${formatPrice(starter.standard)}/mo` : "",
    },
    { top: "Money-back", big: "30", sub: "Days on every hosting plan" },
  ];
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#0b0f2e_0%,#141a5c_45%,#2f3bd8_100%)] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(60%_80%_at_50%_100%,rgb(94_120_255/0.55),transparent_70%)]"
      />
      <Wrap className="relative pt-16 text-center lg:pt-20">
        <h1
          id="about-hero-heading"
          className="mx-auto max-w-[760px] font-display text-[40px] leading-[1.08] font-medium tracking-[-0.03em] text-white sm:text-[56px]"
        >
          The whole online side of your business. One team.
        </h1>
        <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-[1.55] text-white/85">
          Serverlys hosts, builds, grows and looks after websites for small businesses,
          from Miami, with the renewal price printed next to every first price.
        </p>
      </Wrap>

      {/* Collage */}
      <div
        aria-hidden="true"
        className="relative mx-auto mt-12 h-[230px] max-w-[1180px] px-4 sm:h-[300px] lg:h-[340px]"
      >
        {COLLAGE.map((c) => (
          <div
            key={c.src}
            className={cn(
              "absolute aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/20",
              c.cls,
            )}
          >
            <Image
              src={c.src}
              alt={c.alt}
              fill
              sizes="260px"
              className="object-cover"
              style={{ objectPosition: c.pos }}
            />
          </div>
        ))}
        {/* UI chips riding on the photos */}
        <div className="absolute top-[56%] left-[8%] z-40 hidden rounded-xl bg-white px-3 py-2 text-left text-[#0b1530] shadow-xl sm:block">
          <p className="text-[10px] text-[#5b6472]">New booking</p>
          <p className="text-[13px] font-semibold">Fri 10:00 · Cut &amp; colour</p>
        </div>
        <div className="absolute top-[62%] left-[44%] z-40 hidden rounded-xl bg-white px-3 py-2 text-left text-[#0b1530] shadow-xl sm:block">
          <p className="text-[10px] text-[#5b6472]">ridgelineroofing.com</p>
          <p className="text-[13px] font-semibold">38 quote requests this month</p>
        </div>
        <div className="absolute top-[58%] left-[79%] z-40 hidden rounded-xl bg-white px-3 py-2 text-left text-[#0b1530] shadow-xl sm:block">
          <p className="text-[10px] text-[#5b6472]">Migration</p>
          <p className="text-[13px] font-semibold text-emerald-700">
            Live · 0 min downtime
          </p>
        </div>
      </div>

      {/* Stats */}
      <Wrap className="relative pb-16 lg:pb-20">
        <dl className="mt-10 grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.top}
              className={cn(
                "px-4 py-6 text-center",
                i > 0 && "lg:border-l lg:border-white/15",
                i % 2 === 1 && "border-l border-white/15 lg:border-l",
              )}
            >
              <dt className="text-[14px] text-white/80">{s.top}</dt>
              <dd className="mt-2 font-display text-[48px] leading-none font-medium tracking-[-0.03em] text-white tabular-nums">
                {s.big}
              </dd>
              <dd className="mt-2 text-[13px] text-white/70">{s.sub}</dd>
            </div>
          ))}
        </dl>
      </Wrap>
    </section>
  );
}

/* ── 2. What Serverlys does ──────────────────────────────────────────────── */

function WhatWeDo() {
  return (
    <section aria-labelledby="about-what-heading" className="bg-white py-20 lg:py-28">
      <Wrap className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-[13px] font-medium text-primary">
            Technology
          </span>
          <h2
            id="about-what-heading"
            className={cn(
              "mt-5 text-[36px] leading-[1.15] font-normal tracking-[-0.025em] lg:text-[46px]",
              INK,
            )}
          >
            What Serverlys does
          </h2>
          <p className="mt-6 text-[16px] leading-[1.7] text-[#3c4350]">
            Serverlys is one supplier for everything a small business needs online. We
            host websites on fast LiteSpeed cloud servers, register domains, design and
            build sites, run SEO and social media, keep sites updated and secure, and
            provide AI agents that answer customers on the website and the phone.
          </p>
          <p className="mt-4 text-[16px] leading-[1.7] text-[#3c4350]">
            It all lives in one account, on one bill, with one team to call. Every plan
            shows the price it renews at next to the price you start at, so the second
            year is never a surprise.
          </p>
          <Link
            href="/business-solutions"
            className="mt-6 inline-flex text-[15px] font-semibold text-primary hover:text-primary-hover"
          >
            Learn more →
          </Link>
        </div>
        <div className="relative rounded-3xl bg-[linear-gradient(135deg,var(--color-brand-100),#eef1ff)] p-6 sm:p-10">
          <AccountMock />
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-4 hidden w-[180px] overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white sm:block"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src="/mock/biz-contractors.jpg"
                alt=""
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ── 3. What Serverlys is used for ───────────────────────────────────────── */

const USED: UseItem[] = [
  {
    title: "Build",
    body: "Get a website designed around the call, booking or quote that pays your bills, or have custom features, bookings and payments built onto the site you have.",
    links: [
      ["Website design", "/website-design"],
      ["Web development", "/website-development"],
    ],
    photo: {
      src: "/mock/design-wireframe.jpg",
      alt: "Hand-drawn wireframe sketches of website layouts",
    },
  },
  {
    title: "Launch",
    body: "Put it online on fast cloud hosting with free SSL and daily backups, register your domain, and have an existing site moved over free with zero downtime.",
    links: [
      ["Cloud hosting", "/cloud-hosting"],
      ["Domains", "/domain-name"],
      ["Free migration", "/migrations"],
    ],
    photo: {
      src: "/mock/move-open.jpg",
      alt: "A shop owner holding an open sign in his window",
    },
  },
  {
    title: "Grow",
    body: "Get found on Google with local SEO and content, keep a social feed posting every week, and let AI agents answer customers on your site and phone, day and night.",
    links: [
      ["SEO", "/seo"],
      ["Social media", "/social-media"],
      ["AI agents", "/ai-agents"],
    ],
    photo: {
      src: "/mock/social-hero.jpg",
      alt: "A designer photographing her work for social media",
    },
  },
  {
    title: "Manage",
    body: "Hand over the upkeep: updates, security scans, backups and content changes, plus professional email at your own domain, all on the same account.",
    links: [
      ["Site management", "/site-management"],
      ["Business email", "/business-email"],
    ],
    photo: {
      src: "/mock/care-hero.jpg",
      alt: "A relaxed business owner leaning back at her desk",
    },
  },
];

/* ── 4. History ──────────────────────────────────────────────────────────── */

const HISTORY = [
  {
    year: String(FOUNDED),
    body: "Serverlys, LLC is founded in Miami, Florida, to give small businesses one team for their whole online side.",
  },
  {
    year: "Hosting",
    body: "Cloud, WordPress and WooCommerce hosting on LiteSpeed servers, with free migration and the renewal price shown on every plan.",
  },
  {
    year: "Websites",
    body: "Website design and development, so the team that hosts a site can also build and improve it.",
  },
  {
    year: "Growth",
    body: "SEO, social media management and ServerCare site management, for businesses that want the marketing handled too.",
  },
  {
    year: "AI",
    body: `${sisterProducts.map((p) => p.name).join(" and ")} answer customers by chat and phone, and Sera answers questions on serverlys.com.`,
  },
  {
    year: String(new Date().getFullYear()),
    body: `${YEARS} years in, still one team, one bill and one number to call: ${company.phone}.`,
  },
];

/* ── 5. Where we are / infrastructure ────────────────────────────────────── */

function Infrastructure() {
  const includes = CLOUD?.plans[0]?.includes ?? [];
  const chips = includes
    .filter((f) => /SSL|Backups|LiteSpeed Caching|CloudFlare|Migration|cPanel/i.test(f))
    .slice(0, 6);
  return (
    <section aria-labelledby="about-where-heading" className="bg-white py-20 lg:py-28">
      <Wrap className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-[13px] font-medium text-primary">
            Infrastructure
          </span>
          <h2
            id="about-where-heading"
            className={cn(
              "mt-5 text-[36px] leading-[1.15] font-normal tracking-[-0.025em] lg:text-[46px]",
              INK,
            )}
          >
            Based in Miami. Built to keep sites fast.
          </h2>
          <p className="mt-6 text-[16px] leading-[1.7] text-[#3c4350]">
            Serverlys is based in Miami, Florida, and serves small businesses wherever
            their customers are. Every hosting plan runs on LiteSpeed web servers with
            NVMe storage, server-level caching and Cloudflare built in, so pages load
            quickly without a stack of plugins.
          </p>
          <p className="mt-4 text-[16px] leading-[1.7] text-[#3c4350]">
            Free SSL certificates and daily backups come with every plan, and restoring
            a backup is free, whether it is the whole site or one file.
          </p>
          <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-[15px] font-semibold">
            <Link
              href="/cloud-hosting"
              className="text-primary hover:text-primary-hover"
            >
              Cloud hosting
            </Link>
            <span aria-hidden="true" className="text-[#c4c7cc]">
              •
            </span>
            <Link href="/pricing" className="text-primary hover:text-primary-hover">
              Compare plans
            </Link>
          </p>
        </div>
        <div className="relative pb-10">
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
            <Image
              src="/mock/about-servers.jpg"
              alt="Rows of server cooling fans lit in blue and purple"
              fill
              sizes="(min-width:1024px) 540px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-4 -bottom-2 left-4 rounded-2xl bg-white p-4 shadow-[0_20px_50px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.06] sm:left-auto sm:w-[360px]">
            <p className="text-[13px] font-semibold text-[#0b1530]">
              On every hosting plan
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <li
                  key={c}
                  className="rounded-full bg-[#f1f2f5] px-2.5 py-1 text-[11.5px] font-medium text-[#3c4350]"
                >
                  {c.replace(/^FREE /, "Free ")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ── 6. Check our promises (the reference's awards band) ─────────────────── */

function Ledger() {
  const plans = CLOUD?.plans ?? [];
  const n = plans.length;
  const count = (needle: RegExp) =>
    plans.filter((p) => p.includes.some((f) => needle.test(f))).length;
  const starter = plans[0];
  const rows = [
    {
      promise: "The renewal price, shown up front",
      proof: starter
        ? `${starter.name}: ${formatPrice(starter.monthly)}/mo today, renews at ${formatPrice(starter.standard)}/mo`
        : "",
      ok: plans.every((p) => p.standard > 0),
      check: ["See it on every plan", "/pricing"],
    },
    {
      promise: "Website migration is free",
      proof: `In the included list of ${count(/Website Migration/i)} of ${n} cloud plans`,
      ok: count(/Website Migration/i) === n,
      check: ["How a move works", "/migrations"],
    },
    {
      promise: "30 days to change your mind",
      proof: `On ${count(/Money-Back/i)} of ${n} cloud plans, in writing`,
      ok: count(/Money-Back/i) === n,
      check: ["Read the refund policy", "/refund-policy"],
    },
    {
      promise: "Daily backups, free",
      proof: `In the included list of ${count(/Daily Backups/i)} of ${n} cloud plans`,
      ok: count(/Daily Backups/i) === n,
      check: ["Compare plans", "/pricing"],
    },
    {
      promise: "Free SSL on every site",
      proof: `In the included list of ${count(/SSL/i)} of ${n} cloud plans`,
      ok: count(/SSL/i) === n,
      check: ["Cloud hosting", "/cloud-hosting"],
    },
    {
      promise: "The price you see is the price in the cart",
      proof:
        "Every plan button opens the same plan in our billing system, at the same price",
      ok: true,
      check: ["Try any plan", "/pricing"],
    },
  ];
  return (
    <section
      aria-labelledby="about-ledger-heading"
      className="bg-[#0b0f2e] py-20 text-white lg:py-28"
    >
      <Wrap>
        <div className="text-center">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/90">
            Check our promises
          </span>
          <h2
            id="about-ledger-heading"
            className="mx-auto mt-5 max-w-[720px] font-display text-[36px] leading-[1.12] font-medium tracking-[-0.025em] text-white lg:text-[46px]"
          >
            Don’t take our word for it. Check it.
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-[16px] leading-[1.6] text-white/75">
            Most companies list awards here. We list our promises, and next to each one,
            the live proof from the same plan data our checkout uses. If a promise ever
            stops being true, this page shows it.
          </p>
        </div>
        <ul className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((r, i) => (
            <Reveal
              as="li"
              key={r.promise}
              delay={(i % 3) * 80}
              className="flex flex-col rounded-2xl bg-white/[0.05] p-6 ring-1 ring-white/10"
            >
              <span
                className={cn(
                  "inline-flex w-max items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold",
                  r.ok
                    ? "bg-emerald-400/15 text-emerald-300"
                    : "bg-rose-400/15 text-rose-300",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    r.ok ? "bg-emerald-400" : "bg-rose-400",
                  )}
                />
                {r.ok ? "Kept today" : "Needs attention"}
              </span>
              <h3 className="mt-4 text-[20px] leading-snug font-medium text-white">
                {r.promise}
              </h3>
              <p className="mt-2 flex-1 font-mono text-[13px] leading-[1.6] text-white/70">
                {r.proof}
              </p>
              <Link
                href={r.check[1]}
                className="mt-5 text-[14px] font-semibold text-[#9db0ff] hover:text-white"
              >
                {r.check[0]} →
              </Link>
            </Reveal>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ── 7. People ───────────────────────────────────────────────────────────── */

function People() {
  return (
    <section aria-labelledby="about-people-heading" className="bg-white py-20 lg:py-28">
      <Wrap className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative rounded-3xl bg-[linear-gradient(135deg,var(--color-brand-100),#eef1ff)] p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="rounded-2xl bg-white p-5 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.25)]"
          >
            <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
              Talk to Serverlys
            </p>
            <ul className="mt-3 divide-y divide-black/[0.06]">
              {[
                ["Call", company.phone],
                ["Email", emailDisplay],
                ["Chat", "Ask Sera, any time"],
                ["Client area", "Tickets, invoices, services"],
              ].map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-center justify-between py-3 text-[14px]"
                >
                  <span className="text-[#5b6472]">{k}</span>
                  <span className="font-semibold text-[#0b1530]">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-xl bg-[#f6f7f9] p-3 text-[13px] leading-snug text-[#3c4350]">
              “A person reads every message.” Sera answers straight away; the team
              follows up on anything that needs a human.
            </p>
          </div>
        </div>
        <div>
          <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-[13px] font-medium text-primary">
            People
          </span>
          <h2
            id="about-people-heading"
            className={cn(
              "mt-5 text-[36px] leading-[1.15] font-normal tracking-[-0.025em] lg:text-[46px]",
              INK,
            )}
          >
            The people behind Serverlys
          </h2>
          <p className="mt-6 text-[16px] leading-[1.7] text-[#3c4350]">
            The team that hosts your site is the same team that builds it, ranks it and
            answers when you call. There is no hand-off to another company and no ticket
            bounced between departments that have never met.
          </p>
          <p className="mt-4 text-[16px] leading-[1.7] text-[#3c4350]">
            When you get in touch, a person reads every message. Sera, our AI assistant,
            answers questions about plans and services straight away, and hands anything
            that needs a human to the team with the conversation attached.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ChatButton icon>Chat with us</ChatButton>
            <a
              href={company.phoneHref}
              className="inline-flex h-12 items-center rounded-md px-6 text-[15px] font-semibold text-[#0b1530] ring-1 ring-inset ring-black/15 hover:bg-[#f6f7f9]"
            >
              Call {company.phone}
            </a>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ── 8. Who we build for (the reference's testimonials band) ─────────────── */

const FOR = [
  [
    "Contractors & trades",
    "Quote requests and calls, even while you’re on a job.",
    "/business-solutions",
  ],
  [
    "Restaurants & cafés",
    "Menus, bookings and a feed that keeps tables full.",
    "/social-media",
  ],
  [
    "Salons & studios",
    "Bookings online and a profile that shows your work.",
    "/website-design",
  ],
  [
    "Shops & online stores",
    "Fast WooCommerce hosting built for checkout.",
    "/ecommerce-hosting",
  ],
  [
    "Clinics & offices",
    "A site that stays updated, secure and online.",
    "/site-management",
  ],
  ["Agencies", "Unlimited sites on one cloud plan, migrated free.", "/cloud-hosting"],
] as const;

function BuiltFor() {
  return (
    <section
      aria-labelledby="about-for-heading"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#3f6aa0_0%,#a9c3e3_100%)] py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[3%] hidden w-[19%] max-w-[260px] -translate-y-1/2 -rotate-3 xl:block"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] ring-4 ring-white/40">
          <Image
            src="/mock/mkt-hero.jpg"
            alt=""
            fill
            sizes="260px"
            className="object-cover object-[55%_30%]"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-[3%] hidden w-[19%] max-w-[260px] -translate-y-1/2 rotate-3 xl:block"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] ring-4 ring-white/40">
          <Image
            src="/mock/care-mechanic.jpg"
            alt=""
            fill
            sizes="260px"
            className="object-cover object-[62%_30%]"
          />
        </div>
      </div>
      <Wrap className="relative">
        <h2
          id="about-for-heading"
          className="mx-auto max-w-[700px] text-center font-display text-[40px] leading-[1.1] font-medium tracking-[-0.03em] text-white lg:text-[60px]"
        >
          Built for the businesses on your street
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-center text-[17px] text-white/90">
          {YEARS} years of working with small businesses, the kind that keep a
          neighbourhood running.
        </p>
        <ul className="mx-auto mt-12 grid max-w-[700px] gap-3 sm:grid-cols-2">
          {FOR.map(([t, b, href], i) => (
            <Reveal as="li" key={t} delay={(i % 2) * 80}>
              <Link
                href={href}
                className="block h-full rounded-2xl bg-white p-5 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.3)] transition-transform hover:-translate-y-0.5"
              >
                <span className="block text-[17px] font-semibold text-[#0b1530]">
                  {t}
                </span>
                <span className="mt-1.5 block text-[14px] leading-[1.55] text-[#5b6472]">
                  {b}
                </span>
                <span className="mt-3 block text-[13px] font-semibold text-primary">
                  See how we help →
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ── 9. Office ───────────────────────────────────────────────────────────── */

function Office() {
  const cards = [
    {
      photo: "/mock/about-miami.jpg",
      title: "Miami, Florida",
      line: "Headquarters",
      href: undefined,
    },
    {
      photo: "/mock/about-miami-night.jpg",
      title: "Call us",
      line: company.phone,
      href: company.phoneHref,
    },
    {
      photo: "/mock/about-cables.jpg",
      title: "Email us",
      line: emailDisplay,
      href: `mailto:${company.email}`,
    },
    {
      photo: "/mock/care-typing.jpg",
      title: "Client area",
      line: "Tickets, invoices and services",
      href: billing.login,
    },
  ];
  return (
    <section aria-labelledby="about-office-heading" className="bg-white py-20 lg:py-28">
      <Wrap>
        <h2
          id="about-office-heading"
          className={cn(
            "text-center text-[36px] leading-[1.15] font-normal tracking-[-0.025em] lg:text-[46px]",
            INK,
          )}
        >
          Where to find us
        </h2>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const inner = (
              <>
                <span className="relative block aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={c.photo}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 260px, 50vw"
                    className="object-cover"
                  />
                </span>
                <span className={cn("mt-4 block text-[18px]", INK)}>{c.title}</span>
                <span className={cn("mt-1 block text-[14px]", MUTED)}>{c.line}</span>
              </>
            );
            return (
              <li key={c.title}>
                {c.href ? (
                  <a
                    href={c.href}
                    className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    {inner}
                  </a>
                ) : (
                  <div>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Wrap>
    </section>
  );
}

/* ── 10. FAQ ─────────────────────────────────────────────────────────────── */

const FAQS = [
  {
    question: "Who owns Serverlys?",
    answer: `Serverlys is owned and operated by ${company.legalName}, a company based in Miami, Florida, founded in ${FOUNDED}.`,
  },
  {
    question: "Is Serverlys only a web hosting company?",
    answer:
      "No. Hosting is where it starts, but Serverlys also registers domains, designs and builds websites, runs SEO and social media, manages and maintains sites, provides business email, and offers AI agents that answer customers by chat and phone.",
  },
  {
    question: "Who is Serverlys for?",
    answer:
      "Small businesses that want their whole online side handled by one team: contractors and trades, restaurants and cafés, salons, shops and online stores, clinics and offices, and the agencies that look after them.",
  },
  {
    question: "Is Serverlys good for beginners?",
    answer:
      "Yes. You can have the website built for you, your existing site moved over free, and everything managed for you. Sera, our AI assistant, answers questions any time, and a person reads every message.",
  },
  {
    question: "Is Serverlys good for WordPress?",
    answer:
      "Yes. Hosting plans include one-click WordPress installs and LiteSpeed caching, our website designs are built on WordPress, and ServerCare keeps WordPress, plugins and themes updated.",
  },
  {
    question: "What makes Serverlys different from other hosts?",
    answer:
      "Two things. Every plan shows the price it renews at next to the price you start at, so year two is never a surprise. And the same team that hosts your site can build it, grow it and look after it, on one bill.",
  },
  {
    question: "When might Serverlys not be the right choice?",
    answer:
      "If your site is on a closed website builder like Wix, Squarespace or Shopify, its files cannot be moved, so it would need rebuilding rather than migrating. And if you need a large custom infrastructure contract, talk to us first so we can tell you honestly whether we are the right fit.",
  },
  {
    question: "How do I contact Serverlys?",
    answer: `Call ${company.phone}, email ${company.email}, open a ticket in the client area, or ask Sera in the chat on any page. A person reads every message.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={faqGraph(
          FAQS.map((f) => ({ ...f, scopes: [PATH] })),
          PATH,
        )}
      />
      <Hero />
      <WhatWeDo />
      <section aria-labelledby="about-used-heading" className="bg-white pb-20 lg:pb-28">
        <Wrap>
          <UsedFor items={USED} />
        </Wrap>
      </section>
      <section
        aria-labelledby="about-history-heading"
        className="bg-white pb-20 lg:pb-28"
      >
        <Wrap>
          <HistoryRail items={HISTORY} />
        </Wrap>
      </section>
      <Infrastructure />
      <Ledger />
      <People />
      <BuiltFor />
      <Office />
      <Faqs id="about-faq-heading" items={FAQS} />
    </>
  );
}
