"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { planGroups, formatPrice, orderUrl, type PlanGroup } from "@/data/pricing";

/**
 * The store sells one discounted monthly rate against one standard rate, and
 * since 2026-09-16 no term is attached to either. The old "annual vs monthly"
 * toggle described a price list that no longer exists — see the note at the
 * top of data/pricing.ts.
 */
type Term = "monthly" | "standard";

/**
 * Plan selection — the primary conversion surface of the site.
 *
 * Two independent controls:
 *   1. Product group (Cloud / WordPress / Ecommerce) — a real WAI-ARIA
 *      tablist with roving tabindex and Left/Right/Home/End key support.
 *   2. Billing term — a radiogroup, because "monthly vs annual" is a choice
 *      between two labelled options, not an on/off switch.
 *
 * The renewal price renders in every state. There is deliberately no code
 * path that shows a promotional price on its own.
 */
export function PricingTable({ only }: { only?: string } = {}) {
  // Single-product mode: a product page already knows its group, so the
  // tablist would be a control with one meaningful option. The billing-term
  // radiogroup still applies and is still rendered.
  const groups = only ? planGroups.filter((g) => g.id === only) : planGroups;
  const single = groups.length === 1;

  const [groupId, setGroupId] = useState(groups[0].id);
  const [term, setTerm] = useState<Term>("monthly");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const active = groups.find((g) => g.id === groupId) ?? groups[0];
  const activeIndex = groups.findIndex((g) => g.id === active.id);

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const last = groups.length - 1;
    let next: number | null = null;

    if (e.key === "ArrowRight") next = activeIndex === last ? 0 : activeIndex + 1;
    else if (e.key === "ArrowLeft") next = activeIndex === 0 ? last : activeIndex - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;

    if (next !== null) {
      e.preventDefault();
      setGroupId(groups[next].id);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Controls */}
      <div className="flex flex-col items-center gap-5">
        {!single && (
          <div
            role="tablist"
            aria-label="Hosting type"
            onKeyDown={onTabKeyDown}
            className="flex w-full max-w-full gap-1 overflow-x-auto rounded-lg bg-canvas-inset p-1 sm:w-auto"
          >
            {groups.map((g, i) => {
              const selected = g.id === active.id;
              return (
                <button
                  key={g.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${baseId}-tab-${g.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${g.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setGroupId(g.id)}
                  className={cn(
                    "min-h-10 whitespace-nowrap rounded-md px-4 text-small font-medium transition-colors",
                    selected
                      ? "bg-white text-fg shadow-e1"
                      : "text-fg-secondary hover:text-fg",
                  )}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        )}

        <fieldset className="flex items-center gap-3">
          <legend className="sr-only-focusable">Rate shown</legend>
          <div className="flex gap-1 rounded-lg bg-canvas-inset p-1">
            {(
              [
                ["monthly", "Monthly rate"],
                ["standard", "Standard rate"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={cn(
                  "flex min-h-9 cursor-pointer items-center rounded-md px-3.5 text-small font-medium transition-colors",
                  "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
                  term === value
                    ? "bg-white text-fg shadow-e1"
                    : "text-fg-secondary hover:text-fg",
                )}
              >
                <input
                  type="radio"
                  name="billing-term"
                  value={value}
                  checked={term === value}
                  onChange={() => setTerm(value)}
                  className="sr-only-focusable"
                />
                {label}
              </label>
            ))}
          </div>
          <span className="text-small text-success">Save up to 25% annually</span>
        </fieldset>
      </div>

      {/* Panels */}
      {groups.map((g) => (
        <div
          key={g.id}
          role={single ? undefined : "tabpanel"}
          id={single ? undefined : `${baseId}-panel-${g.id}`}
          aria-labelledby={single ? undefined : `${baseId}-tab-${g.id}`}
          hidden={g.id !== active.id}
          tabIndex={single ? undefined : 0}
          className="outline-none"
        >
          <p className="mb-6 text-center text-body text-fg-secondary">{g.blurb}</p>
          <PlanGrid group={g} term={term} />
        </div>
      ))}
    </div>
  );
}

function PlanGrid({ group, term }: { group: PlanGroup; term: Term }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {group.plans.map((plan) => {
        const price = term === "monthly" ? plan.monthly : plan.standard;
        return (
          <li key={plan.slug} className="flex">
            <div
              /*
               * ⚠ THE TARGET IS `<group>-<tier>`, NOT `plan.slug`. The slug is
               * the WHMCS store's marketing string — the Starter WordPress plan
               * is "your-wordpress-journey-begins-here" — and asking a model to
               * infer which tier that is invites exactly the wrong card being
               * highlighted. `group.id` and `plan.tier` are clean enums that
               * marketing copy cannot move, so "wordpress-starter" means the
               * same card today and after the store is re-shot.
               *
               * This attribute is an API, not a styling hook: Sera resolves a
               * plan to it and the widget marks whatever carries it — see
               * `lib/sera/highlight.ts`. The alternative is a CSS selector,
               * which means Sera knowing that the third card in a grid is Turbo
               * — true until somebody reorders the grid, and then Sera
               * confidently points at the wrong price.
               */
              data-sera-target={`${group.id}-${plan.tier}`}
              className={cn(
                "relative flex w-full flex-col rounded-xl bg-white p-6",
                plan.popular
                  ? "shadow-e4 ring-2 ring-primary"
                  : "shadow-e2 ring-1 ring-line",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-caption font-mono uppercase text-white">
                  Most popular
                </span>
              )}

              <h3 className="text-h4 text-fg">{plan.name}</h3>
              {/* Two lines reserved so every card's price block starts at the same y. */}
              <p className="mt-1 min-h-14 text-small text-fg-muted">{plan.summary}</p>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="tabular text-h2 text-fg">{formatPrice(price)}</span>
                <span className="text-small text-fg-muted">/mo</span>
              </div>
              {/* Non-negotiable: the discounted rate never appears alone. When
                  the monthly rate is showing, the standard rate shows beside it;
                  when the standard rate is showing, there is nothing to hide. */}
              <p className="mt-1.5 text-small text-fg-muted">
                {term === "monthly" ? (
                  <>
                    Standard rate{" "}
                    <span className="tabular font-medium text-fg-secondary">
                      {formatPrice(plan.standard)}/mo
                    </span>
                  </>
                ) : (
                  <>The rate every plan renews at</>
                )}
                {plan.setupFee ? ` · ${formatPrice(plan.setupFee)} setup fee` : null}
              </p>

              <Button
                href={orderUrl(group, plan)}
                variant={plan.popular ? "primary" : "secondary"}
                size="lg"
                className="mt-5 w-full"
                aria-label={`Choose ${plan.name}`}
              >
                Choose plan
              </Button>

              <dl className="mt-6 flex flex-col gap-2.5 border-t border-line-subtle pt-5 text-small">
                {[
                  ["Websites", plan.specs.sites],
                  ["Traffic", plan.specs.visits],
                  ["Memory", plan.specs.memory],
                  ["Storage", plan.specs.storage],
                  ["Transfer", plan.specs.transfer],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <dt className="text-fg-muted">{label}</dt>
                    <dd className="text-right font-medium text-fg">{value}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-5 flex flex-col gap-2 border-t border-line-subtle pt-5">
                {plan.includes.map((inc) => (
                  <li
                    key={inc}
                    className="flex items-center gap-2 text-small text-fg-secondary"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-success-fill"
                    >
                      <path
                        d="m3.5 8.5 3 3 6-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {inc}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
