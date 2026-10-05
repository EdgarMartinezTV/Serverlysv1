import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { Grid, ShieldCheck } from "@/components/ref/kit";
import { lowestRate, planGroups } from "@/data/pricing";
import { faqGraph, pageMetadata, productGraph } from "@/lib/seo";
import { FAQS, FAQ_HEAD, HERO } from "./_content";
import { Plans } from "./_components/plans";
import { Compare } from "./_components/compare";

/**
 * Plans & pricing.
 *
 * A 1:1 rebuild of hostinger.com/pricing, screenshotted and measured first.
 * Geometry: dark hero band 652px tall with a 56/64 centred h1 at -0.28px
 * capped to 646px, a trust row, then category pills in two centred rows; the
 * plan band is #f5f5f6 with 48px padding; compare table 48px; FAQ band 80px.
 *
 * Two of the reference's controls are deliberately absent because ours would
 * be theatre — the term dropdown (we sell no terms) and the agency toggle (we
 * publish no agency rates). Both are explained in _content.ts.
 *
 * Every figure comes from data/pricing.ts and data/tlds.ts. The plan card is
 * the shared components/ref/plan-card, the same one /ecommerce-hosting uses,
 * so the two pages cannot drift apart on what a plan costs.
 */

const PATH = "/pricing";

const TITLE = `Serverlys pricing | Hosting and domains from $${lowestRate.toFixed(2)}/mo`;
const DESCRIPTION =
  "Cloud, WordPress and ecommerce hosting plus domains, with the renewal rate shown beside the monthly rate on every plan. 30-day money-back guarantee.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const RATES = planGroups.flatMap((g) => g.plans.map((p) => p.monthly));

const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) =>
      b.type === "ul" ? b.items.join(" ") : b.runs.map((r) => r.text).join(""),
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  scopes: [PATH],
}));

/** Small inline icons for the hero trust row. */
function Support({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2M4.5 14h2.2v4.5H5.6A1.1 1.1 0 0 1 4.5 17.4V14zm14.8 0h-2.2v4.5h1.1a1.1 1.1 0 0 0 1.1-1.1V14z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cancel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M19.5 12a7.5 7.5 0 1 1-2.4-5.5M19.5 4.5V9h-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TRUST_ICONS = { shield: ShieldCheck, support: Support, cancel: Cancel } as const;

export default function PricingPage() {
  return (
    /** globals.css balances headings; the reference wraps normally. */
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd
        data={productGraph({
          name: "Serverlys hosting plans",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...RATES),
          highPrice: Math.max(...RATES),
          offerCount: RATES.length,
        })}
      />
      <JsonLd data={faqGraph(FAQ_TEXT, "/pricing")} />

      {/* Dark hero. The category pills live inside it, as on the reference,
          which is why <Plans> renders both the pills and the panel below. */}
      {/* Plans sits OUTSIDE <Grid> on purpose: it renders the pills (which are
          gridded) and then the plan panel, which has to reach both edges. Put
          it inside the Grid and the light band renders inset. */}
      <section
        aria-labelledby="pricing-heading"
        className="relative isolate overflow-hidden bg-canvas-abyss pt-20 xl:pt-28"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_120%,rgb(0_0_255/0.55)_0%,transparent_70%)]"
        />
        <Grid>
          <h1
            id="pricing-heading"
            className="display-xl mx-auto max-w-[760px] text-center text-white"
          >
            {HERO.title}
          </h1>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {HERO.trust.map((t) => {
              const Icon = TRUST_ICONS[t.icon];
              return (
                <li
                  key={t.label}
                  className="flex items-center gap-2 text-body text-white/85"
                >
                  <Icon className="size-5 shrink-0" />
                  {t.label}
                </li>
              );
            })}
          </ul>
        </Grid>

        <Plans />
      </section>

      <Compare />

      <Faqs
        idPrefix="pr"
        title={FAQ_HEAD.title}
        description={FAQ_HEAD.description}
        items={FAQS}
      />
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: PATH },
        ]}
      />
    </div>
  );
}
