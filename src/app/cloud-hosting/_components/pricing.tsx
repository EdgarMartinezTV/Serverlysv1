"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  formatPrice,
  formatSavings,
  groupById,
  orderUrl,
  type Plan,
} from "@/data/pricing";
import { PRICING_HEAD } from "../_content";
import { ArrowUpRight, Check, Grid, Headline, PillLabel } from "@/components/ref/kit";

/**
 * "Personalize your plan" — the reference's plan configurator, driven by our
 * own cloud plans.
 *
 * The SHAPE is the reference's: a three-stop— now four-stop — slider rather
 * than a tab row, labels above the track, and a caret under the active stop
 * pointing into the resource panel. One control framing the tiers as a
 * continuum you slide along, not four products to compare.
 *
 * The CONTENT is `data/pricing.ts`, which is the single source of truth for
 * what we charge (read off the live WHMCS store). Nothing here hardcodes a
 * price, a spec or a checkout URL — read that file's header before changing
 * any figure, and note two rules it sets that this component honours:
 *
 *  · `monthly` is NEVER rendered alone. The standard rate is struck through
 *    beside it and repeated in the renewal line, because a promotional rate
 *    without the rate it renews at is the practice this company sells against.
 *  · Starter's $2.95 setup fee is printed. It is a real charge at checkout, so
 *    omitting it understates the first invoice.
 *
 * Implemented as a real `<input type="range">` so keyboard and screen-reader
 * users get arrow-key stepping for free. The visible track, dots and caret are
 * painted underneath; the input itself is transparent and sits on top.
 *
 * Measured geometry (1440): card 1024 wide, 32px radius, 56px padding, two
 * 432px columns 48px apart. Track 36px tall, 24px radius. Resource panel
 * 16px below the track with a caret centred on the active stop.
 */

const GROUP = groupById("cloud");
const PLANS: readonly Plan[] = GROUP?.plans ?? [];

/** Slider labels — the tier word, not the full plan name. */
const TAB_LABELS: Record<string, string> = {
  starter: "Starter",
  plus: "Plus",
  turbo: "Turbo",
  business: "Business",
};

/**
 * The reference bolds the figure and leaves its unit in regular weight ("**4**
 * CPU cores"). Our specs arrive as whole phrases, so the leading token is
 * split off as the figure — which lands correctly on every value the store
 * publishes, including "Unlimited websites" and "~10,000 monthly visits".
 */
function splitLeading(spec: string): { value: string; label: string } {
  const at = spec.indexOf(" ");
  if (at === -1) return { value: spec, label: "" };
  return { value: spec.slice(0, at), label: spec.slice(at + 1) };
}

function resourceRows(plan: Plan) {
  return [
    splitLeading(plan.specs.sites),
    splitLeading(plan.specs.visits),
    { value: plan.specs.memory, label: "RAM" },
    { value: plan.specs.storage, label: "storage" },
    { value: plan.specs.transfer, label: "bandwidth" },
  ];
}

export function Pricing() {
  const [index, setIndex] = useState(() => {
    const popular = PLANS.findIndex((p) => p.popular);
    return popular === -1 ? 0 : popular;
  });
  const plan = PLANS[index];
  const sliderId = useId();

  if (!GROUP || !plan) return null;

  /**
   * One stop geometry, shared by the dots and the caret so they can never
   * drift apart. The active dot is 20px, inset 8px from the track's rounded
   * end, so stop 0 sits 18px in and the usable span is (100% - 36px).
   */
  const stopLeft = (i: number) =>
    `calc(18px + (100% - 36px) * ${i / (PLANS.length - 1)})`;

  return (
    <section
      id="pricing"
      aria-labelledby="cloud-pricing-heading"
      className="scroll-mt-24 bg-canvas-secondary py-14 md:py-16 xl:py-20"
    >
      <Grid>
        <Headline
          id="cloud-pricing-heading"
          title={PRICING_HEAD.title}
          description={PRICING_HEAD.description}
          className="mb-6 md:mb-8"
        />

        <div className="mx-auto grid w-full max-w-[1024px] gap-6 rounded-[32px] bg-canvas px-6 py-8 xl:grid-cols-2 xl:gap-x-12 xl:gap-y-6 xl:p-14">
          {/* ── Left: identity, slider, raw capacity ─────────────────── */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[24px] leading-8 font-semibold tracking-[-0.12px] text-fg">
                  {plan.name}
                </h3>
                {/* Not on the reference, but the store marks Turbo — dropping
                    it would lose real information the buyer acts on. */}
                {plan.popular && <PillLabel>Most popular</PillLabel>}
              </div>
              <p className="text-body text-fg">{plan.summary}</p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Labels sit 6px inside the track so the first and last centre
                  over their dots rather than over the track's rounded ends. */}
              <div className="hidden px-1.5 xl:flex" aria-hidden>
                {PLANS.map((p, i) => (
                  <span
                    key={p.tier}
                    className={
                      "flex-1 text-[14px] leading-5 font-semibold " +
                      (i === index ? "text-primary" : "text-fg") +
                      (i === 0
                        ? " text-left"
                        : i === PLANS.length - 1
                          ? " text-right"
                          : " text-center")
                    }
                  >
                    {TAB_LABELS[p.tier] ?? p.name}
                  </span>
                ))}
              </div>

              <div className="relative h-9 rounded-3xl bg-ink-50">
                {PLANS.map((p, i) => (
                  <span
                    key={p.tier}
                    aria-hidden
                    style={{ left: stopLeft(i) }}
                    className={
                      "pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full " +
                      (i === index ? "size-5 bg-primary" : "size-2 bg-ink-300")
                    }
                  />
                ))}
                <label htmlFor={sliderId} className="sr-only">
                  Plan tier
                </label>
                <input
                  id={sliderId}
                  type="range"
                  min={0}
                  max={PLANS.length - 1}
                  step={1}
                  value={index}
                  onChange={(e) => setIndex(Number(e.target.value))}
                  aria-valuetext={plan.name}
                  className="absolute inset-0 h-9 w-full cursor-pointer appearance-none rounded-3xl bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ring [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
                />
              </div>

              {/* Resource panel. The caret is a rotated square clipped by the
                  panel's own top edge — same trick as the reference. */}
              <div className="relative pt-4">
                <span
                  aria-hidden
                  className="absolute top-[9px] size-4 -translate-x-1/2 rotate-45 rounded-[3px] bg-ink-50"
                  style={{ left: stopLeft(index) }}
                />
                <div className="relative rounded-2xl bg-ink-50 p-6">
                  <p className="mb-3 hidden text-micro font-semibold tracking-[0.08em] text-fg-muted uppercase xl:block">
                    Resources
                  </p>
                  <ul className="flex flex-col gap-3">
                    {resourceRows(plan).map((r) => (
                      <li
                        key={r.label + r.value}
                        className="flex items-start justify-between gap-2 text-[16px] leading-5 text-fg"
                      >
                        <span>
                          <b className="text-[14px] leading-5 font-semibold">{r.value}</b>
                          {r.label ? ` ${r.label}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: price and inclusions ──────────────────────────── */}
          <div className="flex flex-col gap-6 rounded-2xl bg-canvas xl:gap-8 xl:border xl:border-line xl:px-8 xl:py-12">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] leading-5 text-fg line-through">
                  {formatPrice(plan.standard)}
                </span>
                <PillLabel>SAVE {formatSavings(plan)}</PillLabel>
              </div>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-[32px] leading-10 font-semibold tracking-[-0.16px] text-fg">
                  {formatPrice(plan.monthly)}
                </span>
                <span className="text-body text-fg">/mo</span>
              </p>
            </div>

            <div>
              <Link
                href={orderUrl(GROUP, plan)}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[16px] font-semibold text-white transition-colors duration-fast hover:bg-primary-hover"
              >
                {PRICING_HEAD.cta}
              </Link>
              <p className="mt-3 text-[14px] leading-5 text-fg-muted">
                {formatPrice(plan.standard)}/mo when you renew
                {plan.setupFee ? `, plus a one-off ${formatPrice(plan.setupFee)} setup fee` : ""}.
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              {plan.includes.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[16px] leading-5 text-fg">
                  <Check className="mt-px size-4 shrink-0 text-success-fill" />
                  <span className="flex-1">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-body font-semibold text-primary hover:text-primary-hover"
          >
            {PRICING_HEAD.compare}
            <ArrowUpRight className="size-4" />
          </Link>
          <p className="mt-4 max-w-[930px] text-center text-micro text-fg-secondary">
            {PRICING_HEAD.disclaimer}
          </p>
        </div>
      </Grid>
    </section>
  );
}
