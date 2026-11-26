import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BLACK_FRIDAY,
  blackFridayActive,
  formatPrice,
  groupById,
  quote,
} from "@/data/pricing";
import { NameField } from "./name-field";

/**
 * /start — the paid-search / ads landing page. LAYOUT follows
 * shopify.com/free-trial section for section (captured 2026-11-25):
 *
 *   tilted photo-collage hero + centred white headline card + black form card
 *   → wordmark strip → 2×2 grey feature cards with a chip and a mock
 *   → large quote → rounded brand CTA box repeating the form → FAQ with black
 *   plus buttons → logo + legal-links footer.
 *
 * Copy, offer, photos and mocks are Serverlys' own. HONESTY RULES:
 *  · No customer logos or customer testimonials — we have no verified ones.
 *    The strip names the software the plans run (true of every plan), and the
 *    quote is signed by the Serverlys team, as a promise.
 *  · Prices come from data/pricing.ts (live WHMCS figures) and always appear
 *    with what they renew at. Serverlys has no free trial; the risk-reversal is
 *    the real 30-day money-back guarantee (/refund-policy).
 *  · Photos are real Unsplash stock (public/mock/CREDITS.md) — no AI images.
 *
 * Indexable since 2026-11-26 (Edgar asked for it to be submitted to Search
 * Console); listed in data/routes.ts, so it is in the sitemap.
 */
export const metadata: Metadata = {
  title: "Start your website today",
  description:
    "Hosting, a domain and a secure website — online in minutes, with a 30-day money-back guarantee.",
  alternates: { canonical: "/start" },
};

const sale = blackFridayActive();
const pct = Math.round(BLACK_FRIDAY.pct * 100);
const starter = groupById("cloud")!.plans[0];
const q = quote(starter, "annually");
const perMonth = q.bf ? q.bf.perMonth : q.perMonth;
const today = q.bf ? q.bf.today : q.today;

/* ── Icons ───────────────────────────────────────────────────────────────── */

function Arrow({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} fill="none">
      <path d="M4 10h11m-4-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none">
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Hero collage ────────────────────────────────────────────────────────── */

type Tile =
  | { kind: "photo"; src: string; h: number; pos?: string }
  | { kind: "stats"; h: number }
  | { kind: "site"; h: number }
  | { kind: "ssl"; h: number };

/** Five columns, staggered by offset, rotated as one sheet (as the reference). */
const COLUMNS: { offset: number; tiles: Tile[] }[] = [
  {
    offset: -120,
    tiles: [
      { kind: "stats", h: 300 },
      { kind: "photo", src: "/mock/biz-designer.jpg", h: 360 },
      { kind: "photo", src: "/mock/mkt-foodtruck.jpg", h: 300 },
      { kind: "photo", src: "/mock/biz-kitchen.jpg", h: 320 },
    ],
  },
  {
    offset: 40,
    tiles: [
      { kind: "photo", src: "/mock/mkt-garden.jpg", h: 330 },
      { kind: "photo", src: "/mock/headphones.jpg", h: 260 },
      { kind: "photo", src: "/mock/site-cafe.jpg", h: 300 },
      { kind: "photo", src: "/mock/biz-salon.jpg", h: 340 },
    ],
  },
  {
    offset: -60,
    tiles: [
      { kind: "photo", src: "/mock/mkt-bakery.jpg", h: 380 },
      { kind: "photo", src: "/mock/sneaker.jpg", h: 300 },
      { kind: "site", h: 250 },
      { kind: "photo", src: "/mock/site-studio.jpg", h: 320 },
    ],
  },
  {
    offset: -40,
    tiles: [
      { kind: "photo", src: "/mock/watch.jpg", h: 280 },
      { kind: "photo", src: "/mock/care-vet.jpg", h: 340, pos: "30% 50%" },
      { kind: "ssl", h: 220 },
      { kind: "photo", src: "/mock/serum.jpg", h: 320 },
    ],
  },
  {
    offset: -160,
    tiles: [
      { kind: "photo", src: "/mock/care-mechanic.jpg", h: 360, pos: "80% 50%" },
      { kind: "photo", src: "/mock/mug.jpg", h: 260 },
      { kind: "photo", src: "/mock/mkt-bikes.jpg", h: 340 },
      { kind: "photo", src: "/mock/biz-designer.jpg", h: 300, pos: "70% 50%" },
    ],
  },
];

function TileBox({ tile, eager }: { tile: Tile; eager: boolean }) {
  const base = "relative w-full overflow-hidden rounded-[22px] shadow-[0_10px_40px_rgba(0,0,0,0.18)]";
  if (tile.kind === "photo") {
    return (
      <div className={base} style={{ height: tile.h }}>
        <Image
          src={tile.src}
          alt=""
          fill
          sizes="320px"
          loading={eager ? "eager" : "lazy"}
          className="object-cover"
          style={{ objectPosition: tile.pos ?? "50% 50%" }}
        />
      </div>
    );
  }
  if (tile.kind === "stats") {
    return (
      <div className={`${base} bg-[#f4f4f2] p-6`} style={{ height: tile.h }}>
        <p className="text-[13px] text-black/50">Visitors this week</p>
        <p className="mt-1 font-display text-[40px] leading-none text-black">2,481</p>
        <p className="mt-2 text-[13px] font-semibold text-emerald-700">↗ 18%</p>
        <svg viewBox="0 0 260 90" className="absolute inset-x-6 bottom-6" fill="none" aria-hidden="true">
          <path d="M0 70 C30 60 40 30 70 40 S110 85 140 55 S190 10 220 25 S250 30 260 12" stroke="#0000ff" strokeWidth="3" />
          <path d="M0 80 C40 75 70 70 100 74 S170 60 200 66 S240 58 260 60" stroke="#0000ff" strokeOpacity=".25" strokeWidth="2" strokeDasharray="4 6" />
        </svg>
      </div>
    );
  }
  if (tile.kind === "site") {
    return (
      <div className={`${base} bg-white p-5`} style={{ height: tile.h }}>
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-black/15" />
          <span className="size-2.5 rounded-full bg-black/15" />
          <span className="size-2.5 rounded-full bg-black/15" />
        </div>
        <div className="mt-4 rounded-lg bg-black/[0.04] px-3 py-2 text-[13px] text-black/60">🔒 yourbakery.com</div>
        <p className="mt-5 font-display text-[26px] leading-tight text-black">Fresh bread, daily.</p>
        <span className="mt-4 inline-block rounded-full bg-black px-4 py-2 text-[13px] font-semibold text-white">Order now</span>
        <span className="absolute bottom-5 right-5 flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700">
          <span className="size-2 rounded-full bg-emerald-500" /> Online
        </span>
      </div>
    );
  }
  return (
    <div className={`${base} flex flex-col justify-center gap-3 bg-[#0000ff] p-6 text-white`} style={{ height: tile.h }}>
      <span className="grid size-10 place-items-center rounded-full bg-white text-[#0000ff]">
        <Check className="size-5" />
      </span>
      <p className="font-display text-[26px] leading-tight">SSL secured</p>
      <p className="text-[13px] text-white/75">Issued automatically</p>
    </div>
  );
}

function Collage() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[#d9d6d2]">
      <div
        className="absolute left-1/2 top-1/2 flex gap-5"
        style={{ width: 1820, transform: "translate(-50%, -52%) rotate(-12deg)" }}
      >
        {COLUMNS.map((col, ci) => (
          <div key={ci} className="flex flex-1 flex-col gap-5" style={{ marginTop: col.offset }}>
            {col.tiles.map((t, ti) => (
              <TileBox key={ti} tile={t} eager={ti < 2} />
            ))}
          </div>
        ))}
      </div>
      {/* Soft wash so the card and white logo always read, like the reference. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/10" />
    </div>
  );
}

/* ── Feature cards ───────────────────────────────────────────────────────── */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-black shadow-sm">
      {children}
    </span>
  );
}

function ChatMock() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[12%] top-[16%] h-[78%] w-[76%] overflow-hidden rounded-t-xl border border-black/10 bg-white shadow-md">
        <div className="flex items-center gap-1.5 border-b border-black/10 px-3 py-2">
          <span className="size-2 rounded-full bg-black/15" />
          <span className="size-2 rounded-full bg-black/15" />
          <span className="size-2 rounded-full bg-black/15" />
          <span className="ml-3 text-[10px] text-black/45">yourcafe.com</span>
        </div>
        <div className="relative h-[60%]">
          <Image src="/mock/site-cafe.jpg" alt="" fill sizes="400px" className="object-cover" />
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          <span className="h-10 rounded bg-black/[0.06]" />
          <span className="h-10 rounded bg-black/[0.06]" />
          <span className="h-10 rounded bg-black/[0.06]" />
        </div>
      </div>
      <div className="absolute bottom-[10%] right-[8%] w-[46%] space-y-2 rounded-2xl bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
        <p className="ml-auto w-fit rounded-2xl rounded-br-sm bg-[#0000ff] px-3 py-1.5 text-[11px] text-white">Are you open on Sunday?</p>
        <p className="w-fit rounded-2xl rounded-bl-sm bg-black/[0.06] px-3 py-1.5 text-[11px] text-black">Yes — 8am to 2pm. Want me to book a table?</p>
      </div>
    </div>
  );
}

function PriceMock() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
        <p className="text-[12px] text-black/55">Starter Cloud · 12 months</p>
        <p className="mt-1 font-display text-[22px] text-black">{formatPrice(today)} today</p>
        <svg viewBox="0 0 240 70" className="mt-3 w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="pm" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#0000ff" stopOpacity=".25" />
              <stop offset="1" stopColor="#0000ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 50 H120 L130 30 H240 V70 H0Z" fill="url(#pm)" />
          <path d="M0 50 H120 L130 30 H240" stroke="#0000ff" strokeWidth="2.5" />
        </svg>
        <div className="mt-2 flex justify-between text-[11px] text-black/50">
          <span>Year 1</span>
          <span>Year 2</span>
        </div>
      </div>
      <div className="absolute bottom-[14%] right-[10%] rounded-xl bg-white px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
        <p className="text-[11px] text-black/55">Renews at</p>
        <p className="font-display text-[18px] text-black">{formatPrice(q.total)}/yr</p>
      </div>
    </div>
  );
}

function WordPressMock() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 text-center shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-[#21759b] font-display text-[20px] font-bold text-white">W</span>
        <p className="mt-3 text-[13px] font-semibold text-black">WordPress installed</p>
        <p className="text-[11px] text-black/55">yourstore.com · just now</p>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-[11px] font-semibold text-white">
          Open dashboard <Arrow className="size-3" />
        </span>
      </div>
      <div className="absolute left-[10%] top-[18%] size-24 -rotate-6 overflow-hidden rounded-2xl shadow-lg">
        <Image src="/mock/sneaker.jpg" alt="" fill sizes="96px" className="object-cover" />
      </div>
      <div className="absolute bottom-[14%] right-[10%] size-24 rotate-6 overflow-hidden rounded-2xl shadow-lg">
        <Image src="/mock/watch.jpg" alt="" fill sizes="96px" className="object-cover" />
      </div>
    </div>
  );
}

function MigrationMock() {
  const items = ["Files", "Databases", "Email", "SSL"];
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
      <div className="rounded-xl bg-white px-4 py-3 text-center shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
        <p className="text-[11px] text-black/50">From</p>
        <p className="text-[13px] font-semibold text-black">Your current host</p>
      </div>
      <svg viewBox="0 0 300 40" className="w-[78%]" fill="none" aria-hidden="true">
        <path d="M150 0V14M37 40V20H263V40M150 14V40M112 20V40M188 20V40" stroke="#000" strokeOpacity=".15" strokeWidth="1.5" />
      </svg>
      <div className="flex gap-3">
        {items.map((i) => (
          <span key={i} className="grid h-12 w-16 place-items-center rounded-xl bg-white text-[11px] font-semibold text-black shadow-sm">
            {i}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 10 22" className="h-6" fill="none" aria-hidden="true">
        <path d="M5 0v20m-4-4 4 4 4-4" stroke="#0000ff" strokeWidth="1.5" />
      </svg>
      <div className="flex items-center gap-2 rounded-xl bg-[#0000ff] px-4 py-3 text-white shadow-[0_12px_32px_rgba(0,0,255,0.3)]">
        <Image src="/brand/logo-mark-transparent.png" alt="" width={20} height={20} className="size-5 brightness-0 invert" />
        <span className="text-[13px] font-semibold">Moved to Serverlys</span>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    chip: "AI website chat",
    title: "A chat assistant on your site",
    body: "ConvoAI Essentials answers visitor questions on your website, and it comes with every hosting plan.",
    mock: <ChatMock />,
  },
  {
    chip: "Honest renewals",
    title: "The price you see is the price you keep",
    body: "Every plan shows its renewal price before you buy. No surprise jump in year two.",
    mock: <PriceMock />,
  },
  {
    chip: "One-click WordPress",
    title: "Your site, live in minutes",
    body: "WordPress installs in one click and your SSL certificate is issued automatically.",
    mock: <WordPressMock />,
  },
  {
    chip: "Free migration",
    title: "Already online? We move it",
    body: "Files, databases and email moved by our team, at no charge, on every hosting plan.",
    mock: <MigrationMock />,
  },
];

/* Software every plan runs — a fact about the plans, not an endorsement. */
const STACK: { name: string; cls: string }[] = [
  { name: "WordPress", cls: "font-serif text-[30px] font-bold tracking-tight" },
  { name: "WooCommerce", cls: "font-display text-[26px] font-bold tracking-tight" },
  { name: "cPanel", cls: "font-display text-[30px] font-semibold italic" },
  { name: "LiteSpeed", cls: "font-display text-[26px] font-extrabold uppercase tracking-tight" },
  { name: "NVMe", cls: "font-mono text-[28px] font-bold" },
  { name: "PHP 8", cls: "font-serif text-[30px] font-bold italic" },
  { name: "MySQL", cls: "font-display text-[28px] font-bold tracking-wide" },
];

const FAQS = [
  {
    q: "What is Serverlys and how does it work?",
    a: "Serverlys gives you everything a business website needs in one account: hosting, your domain, a free SSL certificate, email and daily backups. Type the name you want above, pick a plan, and WordPress installs in one click.",
  },
  {
    q: "How much does Serverlys cost?",
    a: sale
      ? `Starter Cloud is ${formatPrice(perMonth)}/mo on a 12-month plan during Black Friday — ${pct}% off your first payment until ${BLACK_FRIDAY.endsLabel} (${formatPrice(today)} today). It renews at ${formatPrice(q.total)}/yr. There is no free trial; instead, every hosting plan has a 30-day money-back guarantee.`
      : `Starter Cloud is ${formatPrice(perMonth)}/mo on a 12-month plan (${formatPrice(today)} today) and renews at the same price. There is no free trial; instead, every hosting plan has a 30-day money-back guarantee.`,
  },
  {
    q: "Can I use my own domain name with Serverlys?",
    a: "Yes. Register a new name with us — free for the first year on plans of 12 months or longer — or point a domain you already own at your Serverlys hosting.",
  },
  {
    q: "Do I need to be a designer or developer to use Serverlys?",
    a: "No. WordPress installs in one click, SSL is automatic, and we move an existing site for you. Our tutorials are written for people who have never built a website.",
  },
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function StartPage() {
  return (
    <div className="bg-white text-black">
      {/* 1 · Hero */}
      <section className="relative isolate flex min-h-[760px] flex-col items-center overflow-hidden px-4 pb-24 pt-8 lg:min-h-[900px]">
        <Collage />
        <Link href="/" aria-label="Serverlys home" className="relative z-10 rounded-full bg-white px-7 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <Image src="/brand/logo.webp" alt="Serverlys" width={1653} height={409} priority sizes="220px" className="h-11 w-auto" />
        </Link>

        <div className="relative z-10 mt-[120px] w-full max-w-[480px] lg:mt-[170px]">
          <div className="rounded-[32px] bg-white px-7 pb-7 pt-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            {sale && (
              <p className="mb-3 inline-block rounded-full bg-[#0000ff] px-3 py-1 text-[12px] font-semibold text-white">
                Black Friday · {pct}% off until {BLACK_FRIDAY.endsLabel}
              </p>
            )}
            <h1 className="font-display text-[34px] font-medium leading-[1.08] tracking-[-0.02em] text-black sm:text-[40px]">
              Your business starts with Serverlys
            </h1>
            <p className="mt-3 text-[15px] leading-snug text-black/70">
              Get online for <strong className="font-semibold text-black">{formatPrice(perMonth)}/month</strong>
              {sale ? ` — ${pct}% off your first payment` : ""}. Renews at {formatPrice(q.total)}/yr.
              Free domain for the first year.
            </p>
          </div>
          <div className="mt-2 rounded-[32px] bg-black px-3 pb-3 pt-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <p className="px-4 font-display text-[20px] font-medium">Start your website</p>
            <p className="px-4 pb-3 text-[11px] text-white/60">We check your domain instantly. 30-day money-back guarantee on hosting.</p>
            <NameField id="start-hero" variant="dark" />
          </div>
        </div>
      </section>

      {/* 2 · Wordmark strip */}
      <section aria-label="Software every plan runs" className="mx-auto max-w-[1300px] px-6 py-14">
        <ul className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6 text-black lg:justify-between">
          {STACK.map((s) => (
            <li key={s.name} className={s.cls}>
              {s.name}
            </li>
          ))}
        </ul>
      </section>

      {/* 3 · 2×2 feature cards */}
      <section className="mx-auto grid max-w-[1100px] gap-x-6 gap-y-14 px-6 pb-20 pt-6 md:grid-cols-2">
        {FEATURES.map((f) => (
          <article key={f.chip}>
            <div aria-hidden="true" className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#f2f2f0]">
              <Chip>{f.chip}</Chip>
              {f.mock}
            </div>
            <h2 className="mt-5 px-2 text-[20px] font-medium text-black">{f.title}</h2>
            <p className="mt-1 px-2 text-[19px] leading-snug text-black/55">{f.body}</p>
          </article>
        ))}
      </section>

      {/* 4 · Quote — a promise from the team, not a customer testimonial. */}
      <section className="mx-auto max-w-[1100px] px-6 py-16">
        <div className="border-t border-black/10 pt-16">
          <blockquote className="max-w-[900px] font-display text-[34px] font-medium leading-[1.15] tracking-[-0.015em] text-black sm:text-[46px]">
            <span className="-ml-[0.4em]">“</span>We print the renewal price next to the sale price. If you would not be happy paying it, you should know before you buy.”
          </blockquote>
          <p className="mt-4 text-[19px] text-black/50">The Serverlys team</p>
        </div>
      </section>

      {/* 5 · CTA box */}
      <section className="mx-auto max-w-[1100px] px-6 py-16">
        <div className="flex flex-col items-center rounded-[28px] bg-[#0000ff] px-6 py-20 text-center text-white">
          <Image src="/brand/logo-mark-transparent.png" alt="" width={64} height={64} className="size-16 brightness-0 invert" />
          <h2 className="mt-6 font-display text-[34px] font-medium leading-[1.12] tracking-[-0.015em] text-white sm:text-[46px]">
            No risk, 30 days to decide.
            <br />
            Start for {formatPrice(perMonth)}/month.
          </h2>
          <p className="mt-4 text-[15px] text-white/85">
            {sale ? `${pct}% off your first payment until ${BLACK_FRIDAY.endsLabel}. ` : ""}Renews at {formatPrice(q.total)}/yr.
          </p>
          <div className="mt-7 w-full max-w-[400px]">
            <NameField id="start-footer" variant="light" />
          </div>
          <p className="mt-5 text-[11px] text-white/65">Domains are not refundable once registered.</p>
        </div>
      </section>

      {/* 6 · FAQ */}
      <section className="mx-auto max-w-[1100px] px-6 py-16">
        <h2 className="font-display text-[40px] font-medium tracking-[-0.015em] text-black">Questions?</h2>
        <div className="mt-8 border-b border-black/15">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-t border-black/15 first:border-t-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[20px] text-black [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-black text-white transition-transform group-open:rotate-45">
                  <svg viewBox="0 0 20 20" className="size-4" fill="none">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-[860px] pb-6 text-[17px] leading-relaxed text-black/60">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 7 · Footer */}
      <footer className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-6 px-6 pb-20 pt-16">
        <Link href="/" aria-label="Serverlys home">
          <Image src="/brand/logo-mark-transparent.png" alt="Serverlys" width={36} height={36} className="size-9" />
        </Link>
        <nav aria-label="Legal" className="flex flex-wrap gap-8 text-[14px] text-black">
          <Link href="/terms-of-service" className="hover:underline">Terms of Service</Link>
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link href="/refund-policy" className="hover:underline">Refund Policy</Link>
          <Link href="/sitemap" className="hover:underline">Sitemap</Link>
        </nav>
      </footer>
    </div>
  );
}
