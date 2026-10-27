"use client";

import { cn } from "@/lib/utils";
import { formatPrice, orderUrl, quote, type Plan, type PlanGroup } from "@/data/pricing";
import { Check } from "./kit";
import { useTerm } from "./term";

/**
 * The reference's plan card, shared by /ecommerce-hosting and /pricing.
 *
 * Measured shape: max 360px wide, 16px radius, a discount pill top-right, the
 * name, one line of description, the struck monthly price, the term's rate at
 * 32/40 semibold beside "/mo", a full-width CTA, the "today you pay" line, a
 * rule, then the feature list. The featured tier is inverted to the dark surface.
 *
 * Two rules are enforced here rather than left to callers: a discounted rate
 * never renders without the monthly price it discounts, and a setup fee is
 * printed because it is a real charge at checkout.
 */

/** The featured tier is inverted, as the reference inverts its first card. */
/**
 * 2026-10-03 card, after the reference's pricing page: saving pill in the
 * corner, standard rate struck through above the price, CTA, renewal line,
 * then the RESOURCES that differ per tier and the "Why this plan?" note.
 *
 * The 13-line store feature list is identical on every tier, so it is no
 * longer repeated inside each card: /pricing prints it once under the grid
 * (see `IncludedEverywhere`). Both numbers stay on every card, per the rule
 * in data/pricing.ts.
 */
/**
 * Cards in one row share their rows (CSS subgrid): the badge row, name, summary,
 * prices, CTA and everything after line up across the grid even when the
 * featured card's pills wrap to a second line. Callers put this on the <li>
 * wrapping each card; the card itself spans the same 13 rows.
 */
export const PLAN_CARD_ITEM = "row-span-13 grid grid-rows-subgrid gap-y-0";

/**
 * 2026-10-26: priced for the term picked in the nearest <TermSelect> (Hostinger's
 * /pricing). The saving is against paying monthly for the same months, the struck
 * figure is the monthly price, and the line under the button says what is charged
 * today and that the term renews at the same price — which is what WHMCS does.
 */
export function PlanCard({ plan, group, why, cta }: { plan: Plan; group: PlanGroup; why?: string; cta: string }) {
  const dark = Boolean(plan.popular);
  const { term } = useTerm();
  const q = quote(plan, term);
  const pill = dark
    ? q.savePct ? `Most popular · ${q.savePct}% off` : "Most popular"
    : q.savePct ? `${q.savePct}% off` : "No commitment";

  const resources = [
    plan.specs.sites,
    plan.specs.visits,
    `${plan.specs.memory} RAM`,
    `${plan.specs.storage} storage`,
    `${plan.specs.transfer} bandwidth`,
  ];

  return (
    <div
      data-sera-target={`${group.id}-${plan.tier}`}
      className={cn(
        "relative row-span-13 grid grid-rows-subgrid gap-y-0 overflow-hidden rounded-2xl p-6",
        dark
          ? "bg-[linear-gradient(180deg,var(--color-brand-950)_0%,#040a1c_100%)] shadow-e5"
          : "bg-canvas ring-1 ring-line",
      )}
    >
      {dark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(80%_100%_at_50%_0%,rgb(0_0_255/0.5)_0%,transparent_70%)]"
        />
      )}

      <div className="relative flex flex-wrap items-center justify-between gap-2">
        {/* Every hosting order gets ConvoAI Essentials (WHMCS hook convoai_hosting_bundle.php). */}
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-micro font-semibold",
            dark ? "bg-success-fill text-white" : "bg-success-soft text-success",
          )}
        >
          <span aria-hidden="true">✦</span> New: ConvoAI AI chat included
        </span>
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-micro font-semibold",
            dark ? "bg-white/15 text-white" : "bg-brand-50 text-primary",
          )}
        >
          {pill}
        </span>
      </div>
      <h3 className={cn("relative mt-2 text-[20px] leading-7 font-semibold tracking-[-0.01em]", dark ? "text-white" : "text-fg")}>
        {plan.name}
      </h3>
      <p className={cn("relative mt-1.5 min-h-10 text-small", dark ? "text-fg-on-dark-secondary" : "text-fg-secondary")}>
        {plan.summary}
      </p>

      {/* Struck monthly price; kept (invisible) on the monthly term so rows stay aligned. */}
      <p
        className={cn("relative mt-5 text-small line-through", dark ? "text-fg-on-dark-muted" : "text-fg-muted", !q.savePct && "invisible")}
        aria-hidden={!q.savePct}
      >
        <span className="sr-only">Monthly price </span>
        {formatPrice(q.monthlyRate)}
      </p>
      <p className="relative flex items-baseline gap-1">
        <span className={cn("tabular text-[40px] leading-none font-semibold tracking-[-0.03em]", dark ? "text-white" : "text-fg")}>
          {formatPrice(q.perMonth)}
        </span>
        <span className={cn("text-body", dark ? "text-fg-on-dark-secondary" : "text-fg-secondary")}>/mo</span>
      </p>

      <a
        href={orderUrl(group, plan, q.key)}
        className={cn(
          "relative mt-6 flex h-12 w-full items-center justify-center rounded-md text-body font-semibold transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2",
          dark
            ? "bg-primary text-white hover:bg-primary-hover focus-visible:outline-white"
            : "text-primary ring-1 ring-inset ring-primary hover:bg-primary-soft focus-visible:outline-primary",
        )}
      >
        {cta}
      </a>

      <p className={cn("relative mt-3 text-micro", dark ? "text-fg-on-dark-muted" : "text-fg-muted")}>
        {q.months === 1
          ? `Today you pay ${formatPrice(q.today)}${q.setup ? `, including a one-off ${formatPrice(q.setup)} setup fee` : ""}. Renews at ${formatPrice(q.total)}/mo. Cancel anytime.`
          : `Today you pay ${formatPrice(q.today)} for ${q.months} months. Renews at the same price. Cancel anytime.`}
        <span className={cn("mt-1.5 flex items-center gap-1.5 font-medium", dark ? "text-white" : "text-fg")}>
          {q.freeDomain ? (
            <>
              <Check className={cn("size-3.5 shrink-0", dark ? "text-primary-on-dark" : "text-success-fill")} />
              Free domain for the first year
            </>
          ) : (
            <span className={dark ? "text-fg-on-dark-muted" : "text-fg-muted"}>Free domain on 12 months or longer</span>
          )}
        </span>
      </p>

      <span aria-hidden className={cn("relative my-6 block h-px", dark ? "bg-white/12" : "bg-line")} />

      <p className={cn("relative text-small font-semibold", dark ? "text-white" : "text-fg")}>Resources</p>
      <ul className="relative mt-3 flex flex-col gap-2.5">
        {resources.map((f) => (
          <li key={f} className={cn("flex items-start gap-2.5 text-small", dark ? "text-white" : "text-fg")}>
            <Check className={cn("mt-0.5 size-4 shrink-0", dark ? "text-primary-on-dark" : "text-success-fill")} />
            <span className="flex-1">{f}</span>
          </li>
        ))}
      </ul>

      <p className={cn("relative mt-6 text-small font-semibold", dark ? "text-white" : "text-fg")}>Included</p>
      <p className={cn("relative mt-2 text-small", dark ? "text-fg-on-dark-secondary" : "text-fg-secondary")}>
        Free SSL, daily backups, free migration and ConvoAI Essentials AI website chat, the same on every plan.
      </p>

      {why && (
        <div className="relative self-end pt-6">
          <div className={cn("rounded-xl p-4", dark ? "bg-white/[0.07]" : "bg-canvas-secondary")}>
            <p className={cn("text-small font-semibold", dark ? "text-primary-on-dark" : "text-primary")}>
              Why this plan?
            </p>
            <p className={cn("mt-1 text-small", dark ? "text-white" : "text-fg")}>{why}</p>
          </div>
        </div>
      )}
    </div>
  );
}
