import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import { formatSeoPrice, seoOrderUrl, seoPlans } from "@/data/seo-plans";
import { INK, MUTED, PanelCard, PricingPanel } from "./kit";

/**
 * The three SEO plans (data/seo-plans.ts, copied from WHMCS) in the
 * Retell-style pricing panel. Shared by /seo and /marketing so the two pages
 * can never show different prices or contents for the same plans; every
 * "Get" button goes to that plan's WHMCS order page.
 */

const PLAN_ICON = { starter: "pin", growth: "growth", elite: "building" } as const;

export function SeoPlansPanel({
  id,
  title,
  label,
}: {
  id: string;
  title: string;
  label?: string;
}) {
  return (
    <PricingPanel
      id={id}
      title={title}
      label={label}
      footnote={
        <>
          Not sure which plan fits?{" "}
          <a
            href={billing.sales}
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Ask the team for a recommendation
          </a>
          .
        </>
      }
    >
      {seoPlans.map((p, i) => {
        const blue = Boolean(p.popular);
        const prev = seoPlans[i - 1];
        return (
          <PanelCard
            key={p.id}
            delay={i * 80}
            blue={blue}
            icon={PLAN_ICON[p.id]}
            name={p.name}
            badge={blue ? "Most popular" : undefined}
            summary={p.summary}
            price={
              <p className="flex items-baseline gap-1">
                <span
                  className={cn(
                    "tabular text-[40px] leading-none font-semibold tracking-[-0.03em]",
                    blue ? "text-white" : INK,
                  )}
                >
                  {formatSeoPrice(p.price)}
                </span>
                <span className={blue ? "text-white/80" : MUTED}>/mo</span>
              </p>
            }
            cta={{ label: `Get ${p.name}`, href: seoOrderUrl(p) }}
            listTitle={prev ? `Everything in ${prev.name}, plus` : "What’s included"}
            list={p.features}
          />
        );
      })}
    </PricingPanel>
  );
}
