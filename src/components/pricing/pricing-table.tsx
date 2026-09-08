"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  planGroups,
  formatPrice,
  orderUrl,
  type PlanGroup,
} from "@/data/pricing";

type Term = "annual" | "monthly";

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
export function PricingTable() {
  const [groupId, setGroupId] = useState(planGroups[0].id);
  const [term, setTerm] = useState<Term>("annual");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const active = planGroups.find((g) => g.id === groupId) ?? planGroups[0];
  const activeIndex = planGroups.findIndex((g) => g.id === active.id);

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const last = planGroups.length - 1;
    let next: number | null = null;

    if (e.key === "ArrowRight") next = activeIndex === last ? 0 : activeIndex + 1;
    else if (e.key === "ArrowLeft") next = activeIndex === 0 ? last : activeIndex - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;

    if (next !== null) {
      e.preventDefault();
      setGroupId(planGroups[next].id);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Controls */}
      <div className="flex flex-col items-center gap-5">
        <div
          role="tablist"
          aria-label="Hosting type"
          onKeyDown={onTabKeyDown}
          className="flex w-full max-w-full gap-1 overflow-x-auto rounded-lg bg-ink-100 p-1 sm:w-auto"
        >
          {planGroups.map((g, i) => {
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
                  "min-h-10 whitespace-nowrap rounded-md px-4 text-body-sm font-medium transition-colors",
                  selected
                    ? "bg-white text-ink-950 shadow-e1"
                    : "text-ink-600 hover:text-ink-900",
                )}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        <fieldset className="flex items-center gap-3">
          <legend className="sr-only-focusable">Billing term</legend>
          <div className="flex gap-1 rounded-lg bg-ink-100 p-1">
            {(
              [
                ["annual", "Annual"],
                ["monthly", "Monthly"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={cn(
                  "flex min-h-9 cursor-pointer items-center rounded-md px-3.5 text-body-sm font-medium transition-colors",
                  "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-600",
                  term === value
                    ? "bg-white text-ink-950 shadow-e1"
                    : "text-ink-600 hover:text-ink-900",
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
          <span className="text-body-sm text-success-600">Save up to 25% annually</span>
        </fieldset>
      </div>

      {/* Panels */}
      {planGroups.map((g) => (
        <div
          key={g.id}
          role="tabpanel"
          id={`${baseId}-panel-${g.id}`}
          aria-labelledby={`${baseId}-tab-${g.id}`}
          hidden={g.id !== active.id}
          tabIndex={0}
          className="outline-none"
        >
          <p className="mb-6 text-center text-body text-ink-600">{g.blurb}</p>
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
        const price = term === "annual" ? plan.annual : plan.monthly;
        return (
          <li key={plan.slug} className="flex">
            <div
              className={cn(
                "relative flex w-full flex-col rounded-xl bg-white p-6",
                plan.popular
                  ? "shadow-e4 ring-2 ring-brand-500"
                  : "shadow-e2 ring-1 ring-ink-200",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-label font-mono uppercase text-white">
                  Most popular
                </span>
              )}

              <h3 className="text-heading-2 text-ink-950">{plan.name}</h3>
              {/* Two lines reserved so every card's price block starts at the same y. */}
              <p className="mt-1 min-h-14 text-body-sm text-ink-500">{plan.summary}</p>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="tabular text-display-3 text-ink-950">
                  {formatPrice(price)}
                </span>
                <span className="text-body-sm text-ink-500">/mo</span>
              </div>
              {/* Non-negotiable: the renewal rate always accompanies the promo rate. */}
              <p className="mt-1.5 text-body-sm text-ink-500">
                Renews at{" "}
                <span className="tabular font-medium text-ink-700">
                  {formatPrice(plan.renewal)}/mo
                </span>
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

              <dl className="mt-6 flex flex-col gap-2.5 border-t border-ink-100 pt-5 text-body-sm">
                {[
                  ["Websites", plan.specs.sites],
                  ["Traffic", plan.specs.visits],
                  ["Memory", plan.specs.memory],
                  ["Storage", plan.specs.storage],
                  ["Transfer", plan.specs.transfer],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <dt className="text-ink-500">{label}</dt>
                    <dd className="text-right font-medium text-ink-800">{value}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-5 flex flex-col gap-2 border-t border-ink-100 pt-5">
                {plan.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-2 text-body-sm text-ink-700">
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-success-500"
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
