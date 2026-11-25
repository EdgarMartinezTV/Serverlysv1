import Link from "next/link";
import { t as tx } from "@/i18n/t";
import { lh } from "@/i18n/href";
import { FEATURES, WHAT_IS } from "../_content";

/**
 * The static bands of /whois-lookup, measured off hostinger.com/whois at
 * 1440 and 390: three centred feature columns (40px icon tile, 18/26 title,
 * 16/24 body) on white with 48px (32px phone) padding, then the 48/56 split
 * with a 600px illustration. The illustration is drawn here in HTML/SVG —
 * an illustrative record card, never a real person's data.
 */

const wrap = "mx-auto w-full max-w-[1440px] px-4 md:px-10 xl:px-20";

export function Features() {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className={`${wrap} grid gap-10 md:grid-cols-3 md:gap-6`}>
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col items-center text-center">
            <span className="grid size-10 place-items-center rounded-lg bg-[#f2f3f6] text-[#18181a]">
              <FeatureIcon name={f.icon} />
            </span>
            <h3 className="mt-6 text-[18px] leading-[26px] font-semibold tracking-[-0.09px] text-[#18181a]">
              {tx(f.title)}
            </h3>
            <p className="mt-2 max-w-[420px] text-[16px] leading-6 text-black/75">
              {f.runs.map((r, i) =>
                "href" in r ? (
                  <Link
                    key={i}
                    href={lh(r.href)}
                    className="font-semibold text-black/60 underline hover:text-[#18181a]"
                  >
                    {tx(r.text)}
                  </Link>
                ) : (
                  <span key={i}>{tx(r.text)}</span>
                ),
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WhatIs() {
  return (
    <section aria-labelledby="whois-what-heading" className="bg-white py-14 md:py-20">
      <div className={`${wrap} grid items-center gap-10 lg:grid-cols-2 lg:gap-20`}>
        <div>
          <h2
            id="whois-what-heading"
            className="max-w-[560px] text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-[#18181a] md:text-[48px] md:leading-[56px] md:tracking-[-0.24px]"
          >
            {tx(WHAT_IS.title)}
          </h2>
          <p className="mt-6 max-w-[560px] text-[16px] leading-6 text-[#18181a]">
            {tx(WHAT_IS.body)}
          </p>
          <h3 className="mt-6 text-[18px] leading-[26px] font-semibold tracking-[-0.1px] text-[#18181a] md:text-[20px] md:leading-7">
            {tx(WHAT_IS.howTitle)}
          </h3>
          <p className="mt-2 max-w-[560px] text-[16px] leading-6 text-[#18181a]">
            {tx(WHAT_IS.how)}
          </p>
        </div>
        <Illustration />
      </div>
    </section>
  );
}

/** An illustrative WHOIS record card on a dotted field. Decorative only. */
function Illustration() {
  const pill =
    "inline-flex items-center gap-2 rounded-full bg-brand-300/70 px-4 py-2 text-[14px] font-semibold text-white md:px-5 md:text-[16px]";
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[600px]">
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(0,0,0,0.12)_1.2px,transparent_1.2px)] [background-size:18px_18px] [mask-image:radial-gradient(closest-side,black_55%,transparent)]" />
      <div className="absolute inset-[13%_8%_12%_8%] overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-4 bg-brand-50/70 px-[8%] py-[7%]">
          <span className="grid aspect-square w-[20%] shrink-0 place-items-center rounded-xl bg-brand-100">
            <svg viewBox="0 0 40 40" className="w-[62%] fill-white">
              <circle cx="20" cy="14" r="8" />
              <path d="M4 38c1-9 8-14 16-14s15 5 16 14z" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[22px] leading-tight font-bold text-brand-900 md:text-[30px]">
              Jane Doe
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-brand-900 md:text-[16px]">
              www.
              <span className="inline-block h-4 w-20 rounded-full border-2 border-brand-900 md:w-28" />
              .com
            </span>
          </span>
        </div>
        <div className="px-[8%] py-[7%]">
          <p className="text-[15px] font-bold text-brand-900 md:text-[20px]">
            WHOIS search results
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className={pill}>
              <PhoneIcon /> +1 000 000 000
            </span>
            <span className={pill}>
              <HomeIcon /> 100 Main St
            </span>
            <span className={pill}>
              <GlobeIcon className="size-4" /> US
            </span>
            <span className={pill}>
              <MailIcon /> jane@
              <span className="inline-block h-3 w-8 rounded-full border-2 border-white" />
              .com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function FeatureIcon({ name }: { name: "globe" | "globe-search" | "history" }) {
  if (name === "globe") return <GlobeIcon className="size-6" />;
  if (name === "globe-search")
    return (
      <svg viewBox="0 0 24 24" className="size-6" {...stroke}>
        <path d="M20 11.5A8.5 8.5 0 1 0 11.5 20" />
        <path d="M3 11.5h17M11.5 3c2.3 2.4 3.4 5.2 3.4 8.5M11.5 3C9.2 5.4 8 8.2 8 11.5s1.2 6.1 3.5 8.5" />
        <circle cx="17.5" cy="17.5" r="2.6" />
        <path d="m19.5 19.5 2 2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="size-6" {...stroke}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" />
      <path d="M3 3.5V7h3.5M12 7.5V12l3 2" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" {...stroke}>
      <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" {...stroke}>
      <path d="m3 11 9-7 9 7M5 10v10h14V10M10 20v-6h4v6" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
