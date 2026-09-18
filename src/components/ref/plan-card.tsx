import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice, formatSavings, orderUrl, type Plan, type PlanGroup } from "@/data/pricing";
import { Check, PillLabel } from "./kit";

/**
 * The reference's plan card, shared by /ecommerce-hosting and /pricing.
 *
 * Measured shape: max 360px wide, 16px radius, a discount pill top-right, the
 * name, one line of description, the struck standard rate, the monthly rate at
 * 32/40 semibold beside "/mo", a full-width CTA, the renewal line, a rule,
 * then the feature list. The featured tier is inverted to the dark surface.
 *
 * Two rules from data/pricing.ts's header are enforced here rather than left
 * to callers: `monthly` never renders without the standard rate beside it, and
 * a plan's setup fee is printed because it is a real charge at checkout.
 */

/** The featured tier is inverted, as the reference inverts its first card. */
export function PlanCard({ plan, group, why, cta }: { plan: Plan; group: PlanGroup; why?: string; cta: string }) {
  const dark = Boolean(plan.popular);

  return (
    <div
      /*
       * Addressable by Sera as `<group>-<tier>`, deliberately NOT `plan.slug`.
       * See the note in `pricing/pricing-table.tsx` for why the store's
       * marketing slug is the wrong identity to hand a model.
       */
      data-sera-target={`${group.id}-${plan.tier}`}
      className={cn(
        "flex h-full flex-col rounded-2xl p-6",
        dark ? "bg-canvas-deep" : "bg-canvas ring-1 ring-line",
      )}
    >
      <div className="mb-3 flex justify-end">
        <PillLabel tone={dark ? "on-dark" : "brand"}>SAVE {formatSavings(plan)}</PillLabel>
      </div>

      <h3
        className={cn(
          "text-[20px] leading-7 font-semibold tracking-[-0.1px]",
          dark ? "text-white" : "text-fg",
        )}
      >
        {plan.name}
      </h3>
      <p className={cn("mt-2 text-[14px] leading-5", dark ? "text-fg-on-dark-secondary" : "text-fg")}>
        {plan.summary}
      </p>

      <p className={cn("mt-6 text-[14px] leading-5 line-through", dark ? "text-fg-on-dark-muted" : "text-fg-muted")}>
        {formatPrice(plan.standard)}
      </p>
      <p className="flex items-baseline gap-1">
        <span
          className={cn(
            "text-[32px] leading-10 font-semibold tracking-[-0.16px]",
            dark ? "text-white" : "text-fg",
          )}
        >
          {formatPrice(plan.monthly)}
        </span>
        <span className={cn("text-body", dark ? "text-fg-on-dark-secondary" : "text-fg")}>
          /mo
        </span>
      </p>

      <Link
        href={orderUrl(group, plan)}
        className={cn(
          "mt-6 flex h-12 w-full items-center justify-center rounded-md text-[16px] font-semibold transition-colors duration-fast",
          dark
            ? "bg-primary text-white hover:bg-primary-hover"
            : "border border-primary text-primary hover:bg-primary-soft",
        )}
      >
        {cta}
      </Link>

      <p className={cn("mt-3 text-[14px] leading-5", dark ? "text-fg-on-dark-muted" : "text-fg-muted")}>
        Renews at {formatPrice(plan.standard)}/mo
        {plan.setupFee ? `, plus a one-off ${formatPrice(plan.setupFee)} setup fee` : ""}.
      </p>

      <span
        aria-hidden
        className={cn("my-6 block h-px", dark ? "bg-white/15" : "bg-line")}
      />

      <ul className="flex flex-col gap-3">
        {[plan.specs.sites, plan.specs.visits, `${plan.specs.memory} RAM`, ...plan.includes].map(
          (f) => (
            <li
              key={f}
              className={cn(
                "flex items-start gap-2 text-[16px] leading-5",
                dark ? "text-fg-on-dark-secondary" : "text-fg",
              )}
            >
              <Check
                className={cn("mt-px size-4 shrink-0", dark ? "text-white" : "text-success-fill")}
              />
              <span className="flex-1">{f}</span>
            </li>
          ),
        )}
      </ul>

      {why && (
        <div className={cn("mt-6 rounded-xl p-4", dark ? "bg-white/[0.07]" : "bg-canvas-secondary")}>
          <p
            className={cn(
              "text-[14px] leading-5 font-semibold",
              dark ? "text-primary-on-dark" : "text-primary",
            )}
          >
            Why this plan?
          </p>
          <p className={cn("mt-1 text-[14px] leading-5", dark ? "text-white" : "text-fg")}>{why}</p>
        </div>
      )}
    </div>
  );
}
