import Image from "next/image";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { Reveal } from "@/components/animations/reveal";
import { ClaimForm } from "@/components/bio-marketing/claim-form";
import { RotatingWord } from "@/components/bio-marketing/rotating-word";
import { FaqRows } from "@/components/bio-marketing/faq-rows";
import { ShareCards } from "@/components/bio-marketing/share-cards";
import { ProductFan } from "@/components/bio-marketing/product-fan";
import { LeadsArt } from "@/components/bio-marketing/leads-art";
import { breadcrumbTrail } from "@/data/routes";
import { publicEnv } from "@/lib/env";
import { canonical, faqGraph, pageMetadata } from "@/lib/seo";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";
import { FAQS } from "./_content";

/**
 * /bio — Serverlys Bio landing page.
 *
 * STRUCTURE AND MOTION FOLLOW linktr.ee's HOMEPAGE (Edgar, 2026-10-19: "the
 * same home page as Linktree, with the animation just like that, branded to
 * Serverlys"). Measured off the reference: full-width colour bands ~830–910px
 * tall, 80px/800 display headings at −1.6px tracking, a username "claim" box in
 * the hero and the closing band, and the signature hero animation — a tall
 * column of cards drifting upward forever (their `home-hero-tower-up`).
 *
 * Branded, not copied: Serverlys blue / navy / lime bands instead of their
 * lime / blue / maroon; every card shows a REAL Serverlys Bio template screen
 * (public/bio/templates, captured from the app); all copy is ours.
 *
 * Deliberately left out — we can't truthfully say them: the user count ("70M+"),
 * the creator/brand logo wall, the "As featured in" press row and the
 * customer-quote carousel. The "trusted by" band becomes "built for" with the
 * same rotating word.
 *
 * Motion is decoration only and is off under prefers-reduced-motion (keyframes
 * live in globals.css). Nothing above the fold fades in — the hero copy is the
 * LCP element and must paint immediately.
 */

const PATH = "/bio";
const TITLE = "Free Link in Bio Tool | Serverlys Bio";
const DESCRIPTION =
  "Create a free link-in-bio page for Instagram, TikTok and everywhere else. 45 templates, analytics, lead forms and QR codes. No credit card, no paid plans.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const WRAP = "mx-auto w-full max-w-[1296px] px-5 sm:px-10";
const H_XL =
  "font-display font-extrabold tracking-[-0.02em] text-[44px] leading-[1.02] sm:text-[64px] lg:text-[80px] lg:leading-[1.07]";
const H_L =
  "font-display font-extrabold tracking-[-0.02em] text-[38px] leading-[1.05] sm:text-[52px] lg:text-[64px]";

function appGraph(appUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${canonical(PATH)}#app`,
    name: "Serverlys Bio",
    url: canonical(PATH),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: DESCRIPTION,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${company.url}/#organization` },
    sameAs: [appUrl],
  };
}

/* Hero tower: real template screens in colour cards (two copies → seamless loop). */
const TOWER: ReadonlyArray<{ id: string; bg: string }> = [
  { id: "personal-golden-hour", bg: "#ccff00" },
  { id: "restaurant-bakery", bg: "#e0eaff" },
  { id: "creator-travel", bg: "#061433" },
  { id: "store-goods", bg: "#ffd7e8" },
  { id: "music-zine", bg: "#ccff00" },
  { id: "beauty-glow", bg: "#1f55ff" },
  { id: "fitness-surf", bg: "#e8efd6" },
  { id: "podcast-show", bg: "#ffffff" },
];

const STRIP = [
  "restaurant-bistro",
  "barber-street",
  "coach-career",
  "real-estate-agent",
  "creator-aura",
  "photo-coast",
  "events-community",
  "music-dj",
  "store-boutique",
  "fitness-swim",
  "services-legal",
  "freelance-artist",
] as const;

function Shot({
  id,
  className,
  sizes = "260px",
  priority,
}: {
  id: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/bio/templates/${id}.webp`}
      alt=""
      width={585}
      height={1140}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto w-full", className)}
    />
  );
}

function Pill({
  href,
  children,
  tone,
}: {
  href: string;
  children: React.ReactNode;
  tone: "lime" | "dark" | "light" | "blue";
}) {
  const tones = {
    lime: "bg-[#ccff00] text-[#101011]",
    dark: "bg-[#101011] text-white",
    light: "bg-white text-[#101011]",
    blue: "bg-[#0000ff] text-white",
  } as const;
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-14 items-center rounded-full px-8 text-[16px] font-semibold transition-transform hover:scale-[1.04]",
        tones[tone],
      )}
    >
      {children}
    </a>
  );
}

export default function BioLanding() {
  const app = publicEnv.bioAppUrl;
  const signup = `${app}/signup`;
  const host = app.replace(/^https?:\/\//, "");

  return (
    <>
      <JsonLd data={appGraph(app)} />
      <JsonLd
        data={faqGraph(
          FAQS.map((f) => ({ ...f, scopes: [PATH] })),
          PATH,
        )}
      />

      {/* ── 1 · Hero: claim box + the upward-drifting tower ─────────────── */}
      <section
        aria-labelledby="bio-hero"
        className="overflow-hidden bg-[#0000ff] text-white"
      >
        <div
          className={cn(
            WRAP,
            "grid items-center gap-10 py-14 lg:min-h-[820px] lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:py-0",
          )}
        >
          <div>
            <h1 id="bio-hero" className={cn(H_XL, "text-white")}>
              A link in bio built for your business.
            </h1>
            <p className="mt-6 max-w-[560px] text-[18px] leading-[28px] text-white/85">
              One free link for everything you share, sell and book — on Instagram,
              TikTok, YouTube, WhatsApp and everywhere else your customers find you.
            </p>
            <div className="mt-9">
              <ClaimForm appUrl={app} tone="light" />
            </div>
            <p className="mt-4 text-[14px] text-white/70">
              Free forever. No credit card. No paid plans.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="bio-tower-wrap relative h-[520px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)] lg:h-[820px]"
          >
            <div className="bio-tower flex flex-col gap-5">
              {[...TOWER, ...TOWER].map((c, i) => (
                <div
                  key={i}
                  className="mx-auto w-[300px] shrink-0 rounded-[32px] p-6 sm:w-[400px] sm:p-8"
                  style={{ background: c.bg }}
                >
                  <div className="mx-auto w-[62%] overflow-hidden rounded-[22px] shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)]">
                    <Shot id={c.id} sizes="250px" priority={i < 2} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2 · Create and customize ─────────────────────────────────────── */}
      <section
        aria-labelledby="bio-create"
        className="overflow-hidden bg-[#ccff00] text-[#061433]"
      >
        <div
          className={cn(
            WRAP,
            "grid items-center gap-12 py-20 lg:min-h-[830px] lg:grid-cols-2 lg:py-0",
          )}
        >
          <div
            aria-hidden="true"
            className="relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[520px]"
          >
            <div
              className="bio-float absolute top-[6%] left-[4%] w-[40%] -rotate-6 overflow-hidden rounded-[24px] shadow-e5"
              style={{ "--r": "-6deg" } as React.CSSProperties}
            >
              <Shot id="restaurant-bakery" />
            </div>
            <div className="absolute top-0 left-[30%] w-[44%] overflow-hidden rounded-[26px] shadow-e5">
              <Shot id="creator-aura" />
            </div>
            <div
              className="bio-float absolute top-[14%] right-[2%] w-[38%] rotate-6 overflow-hidden rounded-[24px] shadow-e5 [animation-delay:-3s]"
              style={{ "--r": "6deg" } as React.CSSProperties}
            >
              <Shot id="music-acoustic" />
            </div>
          </div>
          <Reveal>
            <h2 id="bio-create" className={H_L}>
              Create and customize your page in minutes
            </h2>
            <p className="mt-6 max-w-[540px] text-[18px] leading-[28px]">
              Start from 45 templates, then drop in links, products, bookings, videos
              and a contact form. Change colours, fonts, buttons and backgrounds until
              it looks like you — every change saves as you go.
            </p>
            <div className="mt-9">
              <Pill href={signup} tone="dark">
                Get started for free
              </Pill>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3 · Share anywhere ───────────────────────────────────────────── */}
      <section
        aria-labelledby="bio-share"
        className="overflow-hidden bg-[#061433] text-white"
      >
        <div
          className={cn(
            WRAP,
            "grid items-center gap-12 py-20 lg:min-h-[870px] lg:grid-cols-2 lg:py-0",
          )}
        >
          <Reveal>
            <h2 id="bio-share" className={cn(H_L, "text-[#8fb3ff]")}>
              Share your page anywhere you like!
            </h2>
            <p className="mt-6 max-w-[540px] text-[18px] leading-[28px] text-white/85">
              Put your {host} link in every bio, story and email signature. Then print
              your QR code on menus, cards and packaging to bring offline customers to
              the same page.
            </p>
            <div className="mt-9">
              <Pill href={signup} tone="lime">
                Get started for free
              </Pill>
            </div>
          </Reveal>
          <ShareCards host={host} />
        </div>
      </section>

      {/* ── 4 · Analyze ──────────────────────────────────────────────────── */}
      <section aria-labelledby="bio-analyze" className="bg-[#e8efd6] text-[#101011]">
        <div
          className={cn(
            WRAP,
            "grid items-center gap-12 py-20 lg:min-h-[880px] lg:grid-cols-2 lg:py-0",
          )}
        >
          <div
            aria-hidden="true"
            className="mx-auto grid w-full max-w-[460px] grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-3"
          >
            <Reveal className="flex aspect-[1.7/1] items-center gap-3 rounded-[24px] bg-[#0000ff] p-4 text-white sm:gap-4 sm:p-6">
              <svg
                viewBox="0 0 100 60"
                className="h-12 w-16 shrink-0 text-[#ccff00] sm:h-16 sm:w-24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M2 50 C 20 50, 22 10, 40 20 S 60 55, 75 25 S 92 8, 98 6" />
              </svg>
              <span>
                <span className="block font-display text-[30px] leading-none">
                  1,248
                </span>
                <span className="text-[13px] font-semibold text-[#ccff00]">
                  Link clicks
                </span>
              </span>
            </Reveal>
            <Reveal
              delay={80}
              className="flex flex-col items-center justify-center rounded-[24px] bg-white p-4 text-center"
            >
              <span className="font-display text-[30px] leading-none text-[#0000ff]">
                38
              </span>
              <span className="mt-1 text-[13px] font-semibold">New leads</span>
            </Reveal>
            <Reveal
              delay={160}
              className="flex flex-col items-center justify-center rounded-[24px] bg-[#ccff00] p-4 text-center"
            >
              <span className="font-display text-[30px] leading-none">6.2%</span>
              <span className="mt-1 text-[13px] font-semibold">Click-through</span>
            </Reveal>
            <Reveal
              delay={240}
              className="flex min-w-0 items-center gap-3 rounded-[24px] bg-[#061433] p-4 text-white sm:gap-4 sm:p-6"
            >
              <span className="relative size-10 shrink-0 rounded-full bg-[#1f55ff] sm:size-16">
                <span className="absolute top-[30%] left-[55%] size-3 rounded-full bg-[#ccff00] ring-4 ring-[#ccff00]/30" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] text-white/70">Top source</span>
                <span className="block truncate font-display text-[18px] leading-none sm:text-[26px]">
                  Instagram
                </span>
              </span>
            </Reveal>
            <p className="col-span-2 text-center text-[12px] text-[#101011]/60">
              Example dashboard
            </p>
          </div>
          <Reveal>
            <h2 id="bio-analyze" className={H_L}>
              Analyze your audience and keep them engaged
            </h2>
            <p className="mt-6 max-w-[540px] text-[18px] leading-[28px]">
              See views, unique visitors and clicks on every link, where your traffic
              comes from and which devices it uses — counted from real visits, with bots
              filtered out and no cookies on your visitors.
            </p>
            <div className="mt-9">
              <Pill href={signup} tone="blue">
                Get started for free
              </Pill>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 5 · Built for (the reference's "trusted by" band, made honest) ─ */}
      <section
        aria-labelledby="bio-built"
        className="overflow-hidden bg-[#f3f3f1] py-20 text-[#101011] lg:py-28"
      >
        <div className={WRAP}>
          <h2
            id="bio-built"
            className="mx-auto max-w-[920px] text-center font-display text-[36px] leading-[1.08] font-extrabold tracking-[-0.02em] sm:text-[48px]"
          >
            One free link built for
            <br />
            <RotatingWord
              className="text-[#0000ff]"
              words={[
                "restaurants",
                "creators",
                "barbers",
                "coaches",
                "musicians",
                "online stores",
                "salons",
                "photographers",
              ]}
            />
          </h2>
        </div>
        <div aria-hidden="true" className="bio-strip-wrap mt-14 overflow-hidden">
          <div className="bio-strip flex w-max gap-5 pl-5">
            {[...STRIP, ...STRIP].map((id, i) => (
              <div
                key={i}
                className={cn(
                  "w-[220px] shrink-0 overflow-hidden sm:w-[250px]",
                  i % 3 === 1 ? "rounded-full" : "rounded-[32px]",
                )}
              >
                <Shot
                  id={id}
                  className={
                    i % 3 === 1
                      ? "aspect-square object-cover object-top"
                      : "aspect-[250/310] object-cover object-top"
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 text-center">
          <a
            href={`${app}/templates`}
            className="text-[16px] font-semibold text-[#0000ff] hover:underline"
          >
            Browse all 45 templates →
          </a>
        </p>
      </section>

      {/* ── 6 · Bento ────────────────────────────────────────────────────── */}
      <section
        aria-label="What you can put on your page"
        className="bg-[#f3f3f1] pb-20 text-[#101011]"
      >
        <div
          className={cn(WRAP, "grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2")}
        >
          <div className="flex flex-col gap-3">
            <Reveal className="flex min-h-[330px] flex-col justify-between rounded-[32px] bg-[#e0eaff] p-8">
              <div aria-hidden="true" className="flex gap-3">
                {["creator-neon", "podcast-studio", "music-artist"].map((id, i) => (
                  <div
                    key={id}
                    className={cn(
                      "overflow-hidden rounded-[18px]",
                      i === 2 ? "w-[42%]" : "w-[28%]",
                    )}
                  >
                    <Shot id={id} className="aspect-square object-cover object-top" />
                  </div>
                ))}
              </div>
              <p className="mt-8 font-display text-[26px] leading-[1.15] font-bold">
                Share every type of content — links, videos, music, files and more
              </p>
            </Reveal>
            <Reveal
              delay={80}
              className="flex min-h-[330px] flex-col justify-between rounded-[32px] bg-[#ccff00] p-8"
            >
              <ProductFan />
              <p className="mt-8 font-display text-[26px] leading-[1.15] font-bold">
                Show products and services, and link each one to the checkout you
                already use
              </p>
            </Reveal>
          </div>
          <Reveal
            delay={120}
            className="flex min-h-[672px] flex-col justify-between overflow-hidden rounded-[32px] bg-[#0000ff] p-8 text-white"
          >
            <LeadsArt />
            <p className="mt-8 font-display text-[26px] leading-[1.15] font-bold">
              Grow your audience with email signups and contact forms — every lead lands
              in your dashboard
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 7 · Fast, friendly, free ─────────────────────────────────────── */}
      <section
        aria-labelledby="bio-fast"
        className="bg-[#f3f3f1] pb-24 text-center text-[#101011]"
      >
        <div className={WRAP}>
          <h2
            id="bio-fast"
            className="mx-auto max-w-[760px] font-display text-[38px] leading-[1.06] font-extrabold tracking-[-0.02em] sm:text-[56px]"
          >
            The fast, friendly and free link in bio tool.
          </h2>
          <div className="mt-8">
            <Pill href={signup} tone="blue">
              Create your free page
            </Pill>
          </div>
        </div>
      </section>

      {/* ── 8 · Questions? Answered ──────────────────────────────────────── */}
      <section aria-labelledby="bio-faq" className="bg-[#061433] py-20 lg:py-28">
        <div className={WRAP}>
          <h2
            id="bio-faq"
            className="text-center font-display text-[40px] leading-[1.05] font-extrabold tracking-[-0.02em] text-[#8fb3ff] sm:text-[56px]"
          >
            Questions? Answered
          </h2>
          <div className="mt-12">
            <FaqRows items={FAQS} />
          </div>
        </div>
      </section>

      {/* ── 9 · Jumpstart ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="bio-jump"
        className="relative overflow-hidden bg-[#0000ff] py-28 text-center text-white"
      >
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 w-[260px] -rotate-12 overflow-hidden rounded-[32px] opacity-60 sm:w-[320px]"
        >
          <Shot id="creator-aura" />
        </div>
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-12 w-[220px] rotate-12 overflow-hidden rounded-[32px] opacity-60 sm:w-[280px]"
        >
          <Shot id="restaurant-juice" />
        </div>
        <div className={cn(WRAP, "relative")}>
          <h2
            id="bio-jump"
            className="mx-auto max-w-[760px] font-display text-[40px] leading-[1.05] font-extrabold tracking-[-0.02em] text-[#ccff00] sm:text-[56px]"
          >
            Jumpstart your corner of the internet today
          </h2>
          <div className="mt-10 flex justify-center">
            <ClaimForm appUrl={app} tone="light" cta="Claim your page" />
          </div>
        </div>
      </section>

      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
