import { Check, Grid, ShieldCheck } from "@/components/ref/kit";
import { BLACK_FRIDAY, formatPrice, groupById, quote, type Plan } from "@/data/pricing";
import { GlossyPercent } from "@/components/home/glossy-percent";
import { MotionToggle } from "./motion-toggle";
import { t as tx } from "@/i18n/t";

/**
 * Black Friday product intro (2026-10-31) for /cloud-hosting, /wordpress-hosting
 * and /ecommerce-hosting. Edgar: "match exactly like hostinger has their intro"
 * (hostinger.com/cloud-hosting, /wordpress-hosting, /woocommerce-hosting all use
 * the same template).
 * Their layout, our offer and art: black band running under the nav, a coloured
 * discount line over a white headline, the page's own checklist, "From <struck>
 * <red price tag>", a white Claim deal button and the guarantee; on the right a
 * 3D % inside a starburst with design-tool selection handles, a tilted sale
 * sticker and a pause button for the motion.
 *
 * ⚠ THE NUMBERS ARE THE REAL OFFER (WHMCS promotion BLACKFRIDAY via quote()):
 * the tag is Starter Cloud on 36 months, the struck figure that term's regular
 * per-month price, and the line under it says what is charged today and what
 * it renews at. No Trustpilot / ratings bar — none exist for Serverlys.
 */

const PCT = `${Math.round(BLACK_FRIDAY.pct * 100)}%`;

export type BlackFridayProductHeroProps = {
  /** Section id; also what the pause button targets. */
  id: string;
  /** Plan group whose entry plan is priced: "cloud" | "wordpress" | "ecommerce". */
  groupId: string;
  headline: string;
  bullets: readonly string[];
  guarantee?: string;
  /** Where Claim deal scrolls to: the page's plan grid. */
  ctaHref: string;
};

/** Irregular 12-point burst, like a sale sticker. */
const BURST = (() => {
  const pts: string[] = [];
  const n = 12;
  const radii = [50, 41, 49, 38, 50, 43, 47, 37, 50, 42, 48, 39];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2 + 0.12;
    const r = i % 2 === 0 ? radii[(i / 2) % radii.length] : 30 + ((i * 7) % 6);
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
})();

export function BlackFridayProductHero({ id, groupId, headline, bullets, guarantee = "30-day money-back guarantee", ctaHref }: BlackFridayProductHeroProps) {
  const starter = groupById(groupId)?.plans.find((p) => p.tier === "starter") as Plan;
  const LONG = quote(starter, "triennially");
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="relative isolate -mt-18 overflow-hidden bg-black pt-32 pb-16 lg:pt-36 lg:pb-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_78%_45%,rgb(0_0_255/0.35)_0%,transparent_70%)]"
      />
      <Grid>
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 xl:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-display text-[clamp(2.5rem,1.6rem+3vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.035em] text-brand-400">
              {tx(PCT)}{tx(" off")}</p>
            <h1
              id={headingId}
              className="mt-1 max-w-[560px] font-display text-[clamp(2.5rem,1.6rem+3vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.035em] text-white"
            >
              {tx(headline)}
            </h1>
            <ul className="mt-8 flex flex-col gap-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-body text-white">
                  <Check className="size-4 shrink-0 text-brand-400" />
                  {tx(b)}
                </li>
              ))}
            </ul>

            <p className="mt-10 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-body text-white">
              <span>{tx("From")}</span>
              <s className="text-white/80">
                <span className="sr-only">{tx("regular price ")}</span>
                {tx(formatPrice(LONG.perMonth))}
              </s>
              {LONG.bf && (
                <span className="relative inline-flex items-center rounded-r-lg rounded-l-md bg-error-fill py-1.5 pr-3 pl-5 font-semibold text-white [clip-path:polygon(10px_0,100%_0,100%_100%,10px_100%,0_50%)]">
                  <span aria-hidden="true" className="absolute top-1/2 left-2.5 size-1.5 -translate-y-1/2 rounded-full bg-black/80" />
                  <span className="sr-only">{tx("Black Friday price ")}</span>
                  {tx(formatPrice(LONG.bf.perMonth))}{tx("/mo")}</span>
              )}
            </p>
            {LONG.bf && (
              <p className="mt-2 max-w-[520px] text-small text-white/70">
                {tx(starter.name)}{tx(" on 36 months: ")}{tx(formatPrice(LONG.bf.today))}{tx(" today (regular ")}{tx(formatPrice(LONG.today))}{tx("), renews at")}{" "}
                {tx(formatPrice(LONG.total))}. {tx(PCT)}{tx(" off your first payment until ")}{tx(BLACK_FRIDAY.endsLabel)}.
              </p>
            )}

            <a
              href={ctaHref}
              className="mt-8 inline-flex h-12 min-w-[185px] items-center justify-center rounded-md bg-white px-8 text-body font-semibold text-fg transition-colors hover:bg-canvas-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >{tx("Claim deal")}</a>
            <p className="mt-4 flex items-center gap-2 text-body text-white">
              <ShieldCheck className="size-4 shrink-0" />
              {tx(guarantee)}
            </p>
          </div>

          <BurstArt targetId={tx(id)} />
        </div>
      </Grid>
    </section>
  );
}

function BurstArt({ targetId }: { targetId: string }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[480px] lg:max-w-[540px]">
      <div aria-hidden="true" className="absolute inset-0">
        {/* Starburst */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
          <defs>
            <linearGradient id={`${targetId}-burst`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1f55ff" />
              <stop offset="0.55" stopColor="#0b2080" />
              <stop offset="1" stopColor="#061433" />
            </linearGradient>
          </defs>
          <polygon points={BURST} fill={`url(#${targetId}-burst)`} />
        </svg>

        {/* Selection frame with handles, like the art is being edited */}
        <div className="absolute inset-[22%] border-2 border-[#5f8bff]">
          {["-top-2 -left-2", "-top-2 -right-2", "-bottom-2 -left-2", "-bottom-2 -right-2"].map((pos) => (
            <span key={pos} className={`absolute size-3.5 border-2 border-[#5f8bff] bg-white sm:size-4 ${pos}`} />
          ))}
        </div>

        {/* The % */}
        <div className="absolute inset-[18%] flex items-center justify-center">
          <div className="w-[88%] -rotate-[10deg] animate-float">
            <GlossyPercent tone="blue" />
          </div>
        </div>

        {/* Tilted sale sticker */}
        <span className="absolute right-[4%] bottom-[20%] -rotate-[12deg] rounded-full bg-error-fill px-5 py-2 font-display text-[clamp(1.25rem,0.9rem+1.2vw,1.75rem)] font-semibold tracking-[-0.02em] text-white shadow-[0_14px_30px_-12px_rgb(231_58_71/0.8)] animate-float-slow">
          {tx(PCT)}{tx(" off")}</span>
      </div>

      <div className="absolute right-0 bottom-0 sm:-right-4">
        <MotionToggle targetId={tx(targetId)} />
      </div>
    </div>
  );
}
