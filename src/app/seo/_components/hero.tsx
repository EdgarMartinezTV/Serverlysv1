import Image from "next/image";
import { Instrument_Serif } from "next/font/google";
import { cn } from "@/lib/utils";
import { Grid } from "@/components/ref/kit";
import { formatSeoPrice, seoFromPrice } from "@/data/seo-plans";

/* The hero headline's display serif — scoped to this page, not the site. */
const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], display: "swap" });

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

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

/*
 * Built to the Retell AI receptionists hero, element for element: a
 * full-bleed, dimmed photograph of a real person at work; a very large,
 * tightly set serif headline top left; and a block bottom right with a small
 * caps line, one paragraph, a white pill button and a row of badges.
 *
 * What the reference fills with proof Serverlys does not have is filled with
 * fact instead: the "5.0 on G2" line is the real starting price, and the G2
 * award badges are what every plan includes — labelled "Every plan" so they
 * never read as awards. Never put a rating or an award here until one exists.
 *
 * LCP: the photo is the largest element, so it loads eagerly at high
 * priority. Nothing in this section animates in — see the reveal/LCP note.
 */
const BADGES = [
  { label: "Local SEO", icon: "pin" },
  { label: "Technical SEO", icon: "scan" },
  { label: "Link building", icon: "link" },
  { label: "Reporting", icon: "report" },
] as const satisfies readonly { label: string; icon: IconName }[];

function PlanBadge({ label, icon }: { label: string; icon: IconName }) {
  return (
    <li className="relative w-[86px] shrink-0">
      <svg
        viewBox="0 0 64 72"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 size-full drop-shadow-[0_6px_14px_rgb(0_0_0/0.35)]"
      >
        <path d="M4 4h56v44L32 68 4 48Z" fill="#fff" />
        <path d="M4 44 32 60l28-16v6L32 66 4 50Z" fill="var(--color-brand-600)" />
        <path d="M4 50l28 16 28-16v-2L32 64 4 48Z" fill="#34d399" />
      </svg>
      <span className="relative flex h-[96px] flex-col items-center pt-2.5 text-center">
        <span className="text-[6.5px] font-bold tracking-[0.08em] text-fg-muted uppercase">
          Every plan
        </span>
        <Icon name={icon} className="mt-0.5 size-4 text-primary" />
        <span className="mt-1 px-1 text-[9.5px] leading-[1.1] font-bold whitespace-nowrap text-fg">
          {label}
        </span>
      </span>
    </li>
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="seo-hero-heading"
      className="relative isolate flex min-h-[680px] overflow-hidden bg-[#0b0d10] text-white sm:min-h-[760px] lg:min-h-[calc(100svh-72px)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 left-0 -z-20 lg:left-[24%]"
      >
        <Image
          src="/mock/seo-hero.jpg"
          alt="A small business owner in an apron smiling at his phone behind his shop counter"
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          quality={80}
          className="object-cover object-[58%_30%] lg:object-[40%_30%]"
        />
      </div>
      {/* Desktop: the photo sits in the right three quarters and fades into the
          ground on its left edge, so the headline sets on shadow, not a face. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[24%] -z-10 hidden w-[26%] bg-[linear-gradient(90deg,#0b0d10,transparent)] lg:block"
      />
      {/* Dim the whole frame, then deepen where the type sits. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_0_0/0.35)_0%,transparent_32%,transparent_55%,rgb(0_0_0/0.55)_100%),linear-gradient(90deg,rgb(0_0_0/0.35)_0%,transparent_55%)]"
      />

      <Grid className="flex flex-col justify-between gap-16 pt-16 pb-14 sm:pt-20 lg:pt-24 lg:pb-20">
        <h1
          id="seo-hero-heading"
          className={cn(
            serif.className,
            "max-w-[11ch] text-[56px] leading-[0.98] font-normal tracking-[-0.035em] text-white sm:text-[80px] lg:max-w-[980px] lg:text-[96px] xl:text-[110px]",
          )}
        >
          SEO Services That Get You Found on Google
        </h1>

        <div className="max-w-[560px] lg:ml-[50%] lg:max-w-[600px]">
          <p className="flex items-center gap-2 text-small font-medium tracking-[0.02em] text-white/90 uppercase">
            From {formatSeoPrice(seoFromPrice)}/mo
            <span aria-hidden="true" className="text-white/50">
              ·
            </span>
            Billed monthly
          </p>
          <p className="mt-4 text-[19px] leading-[1.45] text-white/95 lg:text-[21px]">
            Rank for the searches your customers already make. We fix your site,
            optimize your Google Business Profile, publish content and build links, then
            report what it earned every month.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-5">
            <a
              href="#plans"
              className="inline-flex h-[54px] items-center justify-center rounded-full bg-white px-8 text-body font-semibold text-[#0b0d10] transition-colors duration-fast hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              See SEO plans
            </a>
            <ul className="flex flex-wrap gap-2" aria-label="Included in every plan">
              {BADGES.map((b) => (
                <PlanBadge key={b.label} label={b.label} icon={b.icon} />
              ))}
            </ul>
          </div>
        </div>
      </Grid>
    </section>
  );
}
