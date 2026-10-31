import { useId } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { BLACK_FRIDAY, groupById, formatPrice, quote, type Plan } from "@/data/pricing";

/**
 * Black Friday homepage hero — 2026-10-31, on Edgar's request ("a hero section
 * exactly like hostinger.com"). Their campaign layout, our content:
 *
 *   giant centred headline → sale badge with an "ENDS DEC 7" sticker → one
 *   price line → one white button → the guarantee, with 3D shapes round it.
 *
 * ⚠ THE OFFER IS THE REAL ONE: WHMCS promotion BLACKFRIDAY, 37% off the first
 * payment of every hosting, email and ConvoAI Pro plan until Dec 7, applied to
 * every cart by a WHMCS hook (see BLACK_FRIDAY in data/pricing.ts). The
 * figures here come from quote(), which uses WHMCS's rounding, and the regular
 * price and renewal sit right under the headline price.
 *
 * ⚠ NO SEARCH BAR. Hostinger runs a domain search under the nav; Edgar removed
 * domain search from this hero on 2026-10-03 and kept it out again here.
 *
 * ⚠ THE SHAPES ARE CODE. No images (house rule: no AI-generated art). Each %
 * is SVG strokes stacked into an extrusion, then a gradient face and a rim
 * highlight, so it reads as a glossy 3D object at any size.
 *
 * After the campaign, put <Hero /> back in app/page.tsx; this file can stay.
 */

const STARTER = groupById("cloud")?.plans.find((p) => p.tier === "starter") as Plan;
/* Lowest per-month figure in the sale: Starter on 36 months. */
const LONG = quote(STARTER, "triennially");
const MONTHLY = quote(STARTER, "monthly");
const PCT = `${Math.round(BLACK_FRIDAY.pct * 100)}%`;

export function BlackFridayHero() {
  return (
    <section className="relative isolate -mt-18 overflow-hidden bg-black">
      {/* Ground: black at the top (under the nav), sinking into logo blue. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(80%_60%_at_80%_110%,rgb(31_85_255/0.75)_0%,transparent_70%),radial-gradient(60%_50%_at_10%_115%,rgb(0_0_255/0.55)_0%,transparent_70%),linear-gradient(180deg,#000_0%,#020617_35%,#061433_70%,#0b2080_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-dark opacity-40" />

      {/* Floating 3D shapes. Every one sits fully inside the band at every
          width (Edgar, 2026-10-31): the bottom pair live in the corners, and the
          content's bottom padding is taller than they are below lg, where the
          corners are not clear of the centred text. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[17%] ml-[250px] hidden w-[110px] rotate-[14deg] md:block lg:ml-[330px] lg:w-[130px] xl:ml-[420px] xl:w-[160px]">
          <div className="animate-float">
            <GlossyPercent tone="dark" />
          </div>
        </div>
        <div className="absolute bottom-6 right-[5%] w-[130px] -rotate-[18deg] sm:bottom-8 sm:w-[170px] lg:right-[6%] lg:w-[200px] xl:right-[9%] xl:w-[240px]">
          <div className="animate-float-slow">
            <GlossyPercent tone="blue" />
          </div>
        </div>
        <div className="absolute bottom-8 left-[4%] hidden w-[140px] rotate-[24deg] opacity-80 sm:block lg:left-[6%] lg:w-[170px] xl:left-[10%] xl:w-[200px]">
          <div className="animate-float-slow [animation-delay:-4s]">
            <GlossyPercent tone="ghost" />
          </div>
        </div>
        <div className="absolute left-[9%] top-[30%] hidden w-[64px] -rotate-12 lg:block">
          <div className="animate-float [animation-delay:-2s]">
            <GlossyPercent tone="red" />
          </div>
        </div>
      </div>

      <Container width="wide" className="relative pb-48 pt-36 sm:pb-60 sm:pt-44 lg:pb-52">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="font-display text-[clamp(3.5rem,1.6rem+7.4vw,8.25rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
            Black Friday
          </h1>

          {/* Sale badge: red slab with the scalloped "ENDS DEC 7" sticker
              biting into its left edge, like a price tag slapped on. */}
          <p className="relative mt-3 inline-flex items-center sm:mt-4">
            <span className="sr-only">{PCT} off, ends {BLACK_FRIDAY.endsLabel}</span>
            <span
              aria-hidden="true"
              className="absolute -left-[0.7em] top-1/2 z-10 flex size-[clamp(4.25rem,2.6rem+4vw,6.5rem)] -translate-y-1/2 -rotate-[18deg] items-center justify-center text-[clamp(1rem,0.6rem+1vw,1.5rem)]"
            >
              <Scallop />
              <span className="relative font-display font-bold uppercase leading-[0.9] tracking-[-0.02em] text-fg">
                Ends
                <br />
                <span className="whitespace-nowrap text-[0.8em]">{BLACK_FRIDAY.endsLabel}</span>
              </span>
            </span>
            <span
              aria-hidden="true"
              className="rounded-[clamp(0.75rem,0.4rem+0.8vw,1.25rem)] bg-error-fill py-[0.06em] pl-[1.45em] pr-[0.3em] sm:pl-[1.15em] font-display text-[clamp(2.75rem,1.2rem+5.2vw,6rem)] font-bold leading-[1.05] tracking-[-0.04em] text-white shadow-[0_18px_40px_-16px_rgb(231_58_71/0.7)]"
            >
              {PCT} OFF
            </span>
          </p>

          <p className="mt-7 text-body-lg font-medium text-white sm:mt-9">
            Hosting, email and ConvoAI Pro. Get online from{" "}
            {formatPrice(LONG.bf?.perMonth ?? LONG.perMonth)}/mo.
          </p>
          <p className="mt-1.5 max-w-[620px] text-small text-fg-on-dark-secondary">
            Starter Cloud on 36 months: {formatPrice(LONG.bf?.today ?? LONG.today)} today (regular{" "}
            {formatPrice(LONG.today)}), renews at {formatPrice(LONG.total)}. Or monthly:{" "}
            {formatPrice(MONTHLY.bf?.today ?? MONTHLY.today)} first month incl. setup, then{" "}
            {formatPrice(MONTHLY.total)}/mo. {PCT} off applies to your first payment.
          </p>

          <div className="mt-8">
            <Button href="/pricing" variant="inverse" size="lg">
              Claim deal
            </Button>
          </div>

          <p className="mt-6 flex items-center gap-2 text-body font-medium text-white">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
              <path
                d="M8 1.5 2.75 3.5v4c0 3.2 2.2 5.6 5.25 7 3.05-1.4 5.25-3.8 5.25-7v-4L8 1.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="m5.75 8.1 1.6 1.6 2.9-3.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            30-day money-back guarantee
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ── The sticker ──────────────────────────────────────────────────────────── */

/** 16-point scalloped seal, white, with a soft drop so it sits ON the badge. */
function Scallop() {
  const points = 16;
  const r1 = 50;
  const r2 = 44;
  const d = Array.from({ length: points * 2 }, (_, i) => {
    const a = (Math.PI * i) / points - Math.PI / 2;
    const r = i % 2 === 0 ? r1 : r2;
    return `${i === 0 ? "M" : "L"}${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-[0_8px_14px_rgb(0_0_0/0.35)]">
      <path d={`${d} Z`} fill="#fff" strokeLinejoin="round" stroke="#fff" strokeWidth="5" />
    </svg>
  );
}

/* ── Glossy 3D percent sign ───────────────────────────────────────────────── */

type Tone = "blue" | "dark" | "red" | "ghost";

const TONES: Record<Tone, { side: string; face: [string, string, string]; rim: string; rimOpacity: number }> = {
  // Logo blue, lit from the top left.
  blue: { side: "#00006e", face: ["#7aa2ff", "#1f55ff", "#0000c8"], rim: "#ffffff", rimOpacity: 0.55 },
  // Black lacquer with a blue rim light, the shape beside the headline.
  dark: { side: "#000000", face: ["#3a3d4a", "#111218", "#000000"], rim: "#5f8bff", rimOpacity: 0.9 },
  // Sale red, small accent.
  red: { side: "#7a0614", face: ["#ff8a92", "#e73a47", "#be1025"], rim: "#ffffff", rimOpacity: 0.6 },
  // Pale and translucent, the out-of-focus one at the bottom left.
  ghost: { side: "#9db0e8", face: ["#ffffff", "#dfe6ff", "#aebdf2"], rim: "#ffffff", rimOpacity: 0.8 },
};

/** The % as three strokes: two rings and the slash. Shared by every layer. */
function PercentStrokes({ stroke, width }: { stroke: string; width: number }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round">
      <circle cx="58" cy="56" r="30" />
      <circle cx="142" cy="144" r="30" />
      <path d="M150 34 50 166" />
    </g>
  );
}

function GlossyPercent({ tone }: { tone: Tone }) {
  const id = useId().replace(/:/g, "");
  const t = TONES[tone];
  const depth = 14;
  return (
    <svg viewBox="-10 -10 230 230" className="block h-auto w-full overflow-visible">
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.face[0]} />
          <stop offset="0.45" stopColor={t.face[1]} />
          <stop offset="1" stopColor={t.face[2]} />
        </linearGradient>
        <radialGradient id={`s${id}`} cx="0.3" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Contact shadow */}
      <ellipse cx="108" cy="212" rx="78" ry="9" fill="#000" opacity="0.35" />
      {/* Extrusion: the same strokes stepped down-right, darkest at the back. */}
      {Array.from({ length: depth }, (_, i) => {
        const o = depth - i;
        return (
          <g key={i} transform={`translate(${o * 0.9} ${o * 1.1})`} opacity={0.6 + (i / depth) * 0.4}>
            <PercentStrokes stroke={t.side} width={30} />
          </g>
        );
      })}
      {/* Face */}
      <PercentStrokes stroke={`url(#f${id})`} width={30} />
      {/* Specular bloom across the face */}
      <PercentStrokes stroke={`url(#s${id})`} width={30} />
      {/* Rim light along the top-left edges */}
      <g transform="translate(-4 -5)" opacity={t.rimOpacity}>
        <g fill="none" stroke={t.rim} strokeWidth="3" strokeLinecap="round">
          <path d="M34 44a30 30 0 0 1 40-16" />
          <path d="M118 132a30 30 0 0 1 40-16" />
          <path d="M150 34 118 76" />
        </g>
      </g>
    </svg>
  );
}
