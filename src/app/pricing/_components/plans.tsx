"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import { groupById } from "@/data/pricing";
import { tlds } from "@/data/tlds";
import { Check, Grid } from "@/components/ref/kit";
import { PlanCard } from "@/components/ref/plan-card";
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
                  "h-10 rounded-full px-4 text-[14px] leading-5 font-semibold transition-colors duration-fast",
                  on ? "bg-ink-50 text-fg" : "bg-white/10 text-white hover:bg-white/20",
                )}
              >
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
        className="bg-canvas-secondary py-12"
      >
        <Grid>
          <h2 className="text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-fg lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]">
            {band.title}
          </h2>

          <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-body text-fg-secondary">
            <span className="font-semibold text-fg">{INCLUDES_LABEL}</span>
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
                  <Link
                    href={billing.searchDomain(`example${t.tld}`)}
                    className="mt-4 flex h-12 items-center justify-center rounded-md border border-primary text-[16px] font-semibold text-primary transition-colors duration-fast hover:bg-primary-soft"
                  >
                    Check availability
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <>
              {/* The reference puts a term select here; we sell no terms. */}
              <p className="mt-8 text-[14px] leading-5 text-fg-muted">{TERM_NOTE}</p>
              <PlanGrid group={active} />
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
