"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import { groupById } from "@/data/pricing";
import { tlds } from "@/data/tlds";
import { Check, Grid } from "@/components/ref/kit";
import { PlanCard } from "@/components/ref/plan-card";
import { NavIcon } from "@/components/navigation/nav-icons";
import { BANDS, CTA, INCLUDES_LABEL, TABS, TERM_NOTE, WHY } from "../_content";

/**
 * The reference's category pills plus the plan band they switch.
 *
 * Measured: pills 40px tall at 40px radius, 14px/20 semibold, 10px/16px
 * padding, the active one inverted to near-black on near-white; two centred
 * rows inside the dark hero. The plan band below is #f5f5f6 with 48px of
 * padding, and the controls sit on a 1280 grid — left-aligned toggle, right
 * aligned term control.
 *
 * The pills are real tabs (`role="tablist"`, arrow keys, `aria-selected`)
 * rather than styled buttons, because they switch the panel beneath them and
 * a screen reader needs to know that.
 *
 * The rate note is a STATEMENT, not a select: we advertise one monthly rate
 * with no term attached. See the note in _content.ts.
 */
export function Plans() {
  const [active, setActive] = useState<string>(TABS[0].id);
  const band = BANDS[active];

  function onKey(e: React.KeyboardEvent, i: number) {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = TABS[(i + d + TABS.length) % TABS.length];
    setActive(next.id);
    document.getElementById(`price-tab-${next.id}`)?.focus();
  }

  return (
    <>
      {/* ── pills, still on the dark band, so they carry their own Grid ── */}
      <Grid>
        <div
          role="tablist"
          aria-label="Product category"
          className="mt-10 pb-12 flex flex-wrap items-center justify-center gap-3"
        >
          {TABS.map((t, i) => {
            const on = t.id === active;
            return (
              <button
                key={t.id}
                id={`price-tab-${t.id}`}
                role="tab"
                aria-selected={on}
                aria-controls="price-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(t.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] leading-5 font-semibold transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  on ? "bg-white text-fg" : "bg-primary/35 text-white ring-1 ring-inset ring-white/10 hover:bg-primary/55",
                )}
              >
                <NavIcon name={t.icon} className="h-4 w-4 shrink-0" />
                {t.label}
              </button>
            );
          })}
        </div>
      </Grid>

      {/* ── the panel: full-bleed, which is why it is not inside a Grid ── */}
      <section
        id="price-panel"
        role="tabpanel"
        aria-labelledby={`price-tab-${active}`}
        className="bg-canvas-secondary py-14 lg:py-20"
      >
        <Grid>
          <h2 className="display-lg text-fg">
            {band.title}
          </h2>

          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-small text-fg-secondary">
            <span className="text-fg">{INCLUDES_LABEL}</span>
            {band.includes.map((inc) => (
              <span key={inc} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-success-fill" />
                {inc}
              </span>
            ))}
          </p>

          {active === "domains" ? (
            <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {tlds.map((t) => (
                <li
                  key={t.tld}
                  className="flex flex-col rounded-2xl bg-canvas p-6 ring-1 ring-line"
                >
                  <p className="text-[24px] leading-8 font-semibold tracking-[-0.12px] text-fg">
                    {t.tld}
                  </p>
                  <p className="mt-2 flex-1 text-body text-fg-secondary">
                    {t.note ?? "A general-purpose extension."}
                  </p>
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="text-[24px] leading-8 font-semibold text-fg">
                      ${t.price.toFixed(2)}
                    </span>
                    <span className="text-[14px] leading-5 text-fg-secondary">
                      /1st yr
                    </span>
                  </p>
                  <a
                    href={billing.registerDomain}
                    className="mt-4 flex h-12 items-center justify-center rounded-md border border-primary text-[16px] font-semibold text-primary transition-colors duration-fast hover:bg-primary-soft"
                  >
                    Check availability
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <>
              {/* The reference puts a term select here; we sell no terms. */}
              <p className="mt-8 text-[14px] leading-5 text-fg-muted">{TERM_NOTE}</p>
              <PlanGrid group={active} />
              <IncludedEverywhere group={active} />
              <div className="mt-10 flex flex-col items-center gap-4 text-center">
                <p className="text-micro text-fg-muted">
                  Every price is a monthly rate. Renewal rates are printed on each card before you buy.
                </p>
                <a
                  href="#compare-heading"
                  className="inline-flex h-12 items-center rounded-md px-8 text-body font-semibold text-primary ring-1 ring-inset ring-primary transition-colors duration-fast hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Compare plans
                </a>
              </div>
            </>
          )}
        </Grid>
      </section>
    </>
  );
}

function PlanGrid({ group }: { group: string }) {
  const g = groupById(group);
  if (!g) return null;
  return (
    <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {g.plans.map((plan) => (
        <li key={plan.tier}>
          <PlanCard plan={plan} group={g} why={WHY[plan.tier]} cta={CTA} />
        </li>
      ))}
    </ul>
  );
}

/**
 * The store's feature list, printed ONCE (it is identical on every tier) and
 * grouped so it reads as three short lists rather than thirteen lines. The
 * wording is the store's own, from data/pricing.ts — sorted here, not edited.
 */
function IncludedEverywhere({ group }: { group: string }) {
  const g = groupById(group);
  if (!g) return null;
  const all = g.plans[0].includes;
  const buckets: Array<{ title: string; icon: "gauge" | "shield" | "wrench"; test: RegExp }> = [
    { title: "Speed", icon: "gauge", test: /nvme|bandwidth|litespeed|cache|caching|cloudflare/i },
    { title: "Security and backups", icon: "shield", test: /ssl|backup|money-back/i },
    { title: "Tools and help", icon: "wrench", test: /./ },
  ];
  const used = new Set<string>();
  const groups = buckets.map((b) => {
    const items = all.filter((f) => !used.has(f) && b.test.test(f));
    items.forEach((f) => used.add(f));
    return { ...b, items };
  });

  return (
    <div className="mt-6 rounded-2xl bg-canvas p-7 ring-1 ring-line sm:p-8">
      <h3 className="text-h4 font-medium text-fg">Every plan includes</h3>
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {groups.map((b) => (
          <div key={b.title}>
            <p className="flex items-center gap-2 text-small font-semibold text-fg">
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand-50 text-primary">
                <NavIcon name={b.icon} className="h-4 w-4" />
              </span>
              {b.title}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {b.items.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-small text-fg-secondary">
                  <Check className="mt-0.5 size-4 shrink-0 text-success-fill" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
