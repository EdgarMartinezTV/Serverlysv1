"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Minus, Plus, Spark, Trend } from "@/components/ref/kit";
import { t as tx } from "@/i18n/t";
import { SAVINGS, WHY } from "../_content";

/* Icons the shared kit does not have. */
function Gauge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M4.5 16.5a8 8 0 1 1 15 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 13.5l3.5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="14" r="1.4" fill="currentColor" />
    </svg>
  );
}
function Chat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4 3.5v-3.5h0a2 2 0 0 1-1.5-2v-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.5 9.5h7M8.5 12.5h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 12.2l2.4 2.4 4.6-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = { gauge: Gauge, spark: Spark, trend: Trend, chat: Chat, check: CheckCircle } as const;

/**
 * "Why migrate to Serverlys?" — the reference's h-content-switch as it is on
 * this page: media LEFT, a single-open accordion RIGHT, rows 16px with a
 * leading icon and a +/− on the right.
 */
export function WhyAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {WHY.items.map((item, i) => {
        const Icon = ICONS[item.icon];
        const isOpen = i === open;
        return (
          <div key={item.title} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`wm-why-panel-${i}`}
                id={`wm-why-button-${i}`}
                onClick={() => setOpen(i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-5 shrink-0 text-fg" />
                  <span className="text-[16px] leading-6 text-fg">{tx(item.title)}</span>
                </span>
                <span aria-hidden className="shrink-0 text-fg">
                  {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                </span>
              </button>
            </h3>
            {isOpen && (
              <div id={`wm-why-panel-${i}`} role="region" aria-labelledby={`wm-why-button-${i}`} className="pb-5">
                <p className="text-[14px] leading-[22px] text-fg">{tx(item.body)}</p>
                <a href={WHY.ctaHref} className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:text-primary-hover">
                  {tx(WHY.cta)}
                  <ArrowRight className="size-4" />
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * "With Serverlys, save every year" — the reference's compare table: a
 * highlighted brand column on the left, the market column on the right, the
 * lower rows fading out behind a "See all features" toggle.
 */
const FOLD = 4;

export function SavingsTable({ brand }: { brand: React.ReactNode }) {
  const [all, setAll] = useState(false);
  const rows = SAVINGS.rows;
  return (
    <div>
      <div className="relative mx-auto max-w-[868px]">
        <div className="grid grid-cols-[1fr_minmax(0,0.75fr)] md:grid-cols-[520px_1fr]">
          {/* Brand column */}
          <div className="relative z-10 rounded-2xl bg-brand-50/60 ring-2 ring-primary">
            <div className="flex h-14 items-center px-4 md:h-[78px] md:px-6">{brand}</div>
            <div className="flex h-14 items-center border-t border-line px-4 text-[14px] font-semibold text-fg md:px-6 md:text-[18px]">
              {tx(SAVINGS.brandNote)}
            </div>
            {rows.map((r, i) => (
              <div
                key={r.feature}
                className={cn(
                  "flex h-14 items-center justify-between gap-3 border-t border-line px-4 md:px-6",
                  !all && i >= FOLD && "hidden",
                )}
              >
                <span className="text-[13px] leading-5 font-medium text-fg md:text-[14px]">{tx(r.feature)}</span>
                <span className="hidden shrink-0 items-center gap-1.5 text-[13px] text-fg-secondary sm:inline-flex">
                  <span className="grid size-4 place-items-center rounded-full bg-success-fill text-white">
                    <Check className="size-3" />
                  </span>
                  {tx(SAVINGS.included)}
                </span>
                <span className="grid size-4 shrink-0 place-items-center rounded-full bg-success-fill text-white sm:hidden">
                  <Check className="size-3" />
                </span>
              </div>
            ))}
          </div>
          {/* Market column */}
          <div className="my-px rounded-r-2xl ring-1 ring-line">
            <div className="flex h-14 items-center px-4 text-[13px] font-semibold text-fg md:h-[78px] md:px-6 md:text-[14px]">{tx(SAVINGS.market)}</div>
            <div className="flex h-14 items-center border-t border-line px-4 text-[13px] font-semibold text-fg md:px-6 md:text-[14px]">{tx(SAVINGS.marketNote)}</div>
            {rows.map((r, i) => (
              <div key={r.feature} className={cn("flex h-14 items-center border-t border-line px-4 text-[13px] text-fg md:px-6 md:text-[14px]", !all && i >= FOLD && "hidden")}>
                {tx(r.market)}
              </div>
            ))}
          </div>
        </div>
        {!all && <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-b from-transparent to-canvas" />}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          aria-expanded={all}
          onClick={() => setAll((v) => !v)}
          className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-fg hover:text-primary"
        >
          {tx(all ? SAVINGS.less : SAVINGS.more)}
          <svg viewBox="0 0 16 16" aria-hidden className={cn("size-3.5 transition-transform", all && "rotate-180")}>
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
