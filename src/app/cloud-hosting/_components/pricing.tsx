import Link from "next/link";
import { groupById } from "@/data/pricing";
import { Grid, Headline } from "@/components/ref/kit";
import { PlanCard } from "@/components/ref/plan-card";
import { PRICING_HEAD } from "../_content";
import { MatchBanner } from "./match-banner";

const GROUP = groupById("cloud");

const WHY: Record<string, string> = {
  starter: "One site on unlimited NVMe, with the domain and SSL already in the price.",
  plus: "Seven sites and ~25,000 monthly visits, with room to grow into.",
  turbo: "Unlimited sites and 6 GB RAM. The tier most projects settle on.",
  business: "8 GB RAM and ~100,000 monthly visits, for peak-season traffic.",
};

const EXTRAS = [
  {
    title: "Search-ready from day one",
    body: "Free SSL, fast NVMe pages and clean URLs, the basics Google and AI search reward.",
  },
  {
    title: "Analytics in one click",
    body: "Google Analytics integration is included on every plan, no plugin hunt.",
  },
  {
    title: "A chat agent, free",
    body: "ConvoAI answers your visitors day and night, included with every plan.",
  },
] as const;

/**
 * Plans — 2026-10-03. The shared PlanCard grid (same card as /pricing) in
 * place of the single-plan slider, then three included extras and the
 * "find the right plan" banner, which opens Sera.
 */
export function Pricing() {
  if (!GROUP) return null;
  return (
    <section
      id="pricing"
      aria-labelledby="cloud-pricing-heading"
      className="scroll-mt-14 bg-canvas-secondary py-16 lg:py-24"
    >
      <Grid>
        <Headline
          id="cloud-pricing-heading"
          title="Choose the right cloud hosting plan"
          description={PRICING_HEAD.description}
          className="mb-10 xl:mb-12"
        />

        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {GROUP.plans.map((plan) => (
            <li key={plan.tier}>
              <PlanCard
                plan={plan}
                group={GROUP}
                why={WHY[plan.tier]}
                cta={PRICING_HEAD.cta}
              />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <Link
            href="/pricing#compare-heading"
            className="inline-flex min-h-11 items-center gap-1.5 text-small font-semibold text-primary hover:text-primary-hover"
          >
            View all features
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
              <path
                d="M5 11 11 5M6.5 5H11v4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <p className="max-w-[720px] text-micro text-fg-muted">
            {PRICING_HEAD.disclaimer}
          </p>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {EXTRAS.map((e) => (
            <li key={e.title} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{e.title}</h3>
              <p className="mt-2 text-small text-fg-secondary">{e.body}</p>
            </li>
          ))}
        </ul>

        <MatchBanner />
      </Grid>
    </section>
  );
}
