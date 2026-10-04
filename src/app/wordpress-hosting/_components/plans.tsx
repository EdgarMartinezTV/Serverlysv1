import Link from "next/link";
import { formatPrice, groupById } from "@/data/pricing";
import { Grid, Headline } from "@/components/ref/kit";
import { PlanCard } from "@/components/ref/plan-card";

const GROUP = groupById("wordpress");

const WHY: Record<string, string> = {
  starter: "One WordPress site on unlimited NVMe, domain and SSL included.",
  plus: "Seven sites and ~25,000 monthly visits, room for a blog and a shop.",
  turbo: "Unlimited sites and 6 GB RAM. The tier most WordPress projects settle on.",
  business: "8 GB RAM and ~100,000 monthly visits, for busy WooCommerce stores.",
};

/** Plans — the shared PlanCard grid, same card as /pricing and /cloud-hosting. */
export function Plans() {
  if (!GROUP) return null;
  const starter = GROUP.plans.find((p) => p.tier === "starter");
  return (
    <section id="plans" aria-labelledby="wp-plans-heading" className="scroll-mt-14 bg-canvas-secondary py-16 lg:py-24">
      <Grid>
        <Headline
          id="wp-plans-heading"
          title="Explore managed WordPress plans"
          description="Premium performance, free migration and support, with the renewal rate printed on every card."
          className="mb-10 xl:mb-12"
        />
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {GROUP.plans.map((plan) => (
            <li key={plan.tier}>
              <PlanCard plan={plan} group={GROUP} why={WHY[plan.tier]} cta="Choose plan" />
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <Link href="/pricing#compare-heading" className="inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:text-primary-hover">
            View all features
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
              <path d="M5 11 11 5M6.5 5H11v4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </Link>
          <p className="max-w-[720px] text-micro text-fg-muted">
            Unlimited storage and bandwidth are subject to fair use: sized for websites, not
            file distribution or backup archives.
            {starter?.setupFee ? ` Starter carries a one-off ${formatPrice(starter.setupFee)} setup fee.` : ""}
          </p>
        </div>
      </Grid>
    </section>
  );
}
