import { cn } from "@/lib/utils";
import { formatPrice, groupById, orderUrl, type Plan } from "@/data/pricing";
import { Check, Grid, Headline } from "@/components/ref/kit";
import { COMPARE } from "../_content";

/**
 * "Compare our plans" — the reference's `h-compare-table`, 48px band with a
 * centred 48/56 heading.
 *
 * Built from `data/pricing.ts`, so it cannot disagree with the cards above it.
 * The rows deliberately lead with BOTH rates: the monthly rate people pay now and
 * the standard rate it renews at. A compare table that shows only the promo
 * figure is the thing this site sells against.
 *
 * Stacked per plan below `md` — an 8-row × 4-column matrix at 343px would need
 * horizontal scrolling, which the repo's mobile check rejects.
 */
/**
 * Compare table — 2026-10-03, after the reference.
 *
 * A sticky plan header (name, monthly rate, button) that stays under the site
 * header while the rows scroll, then rows in collapsible groups: Pricing and
 * Resources open, the shared feature list collapsed (it is identical on every
 * tier, so it is a ✓ in every column — worth having, not worth the scroll).
 * Native <details>, so the groups work without JavaScript.
 */
export function Compare() {
  const g = groupById("cloud");
  if (!g) return null;

  const cell = (p: Plan, key: (typeof COMPARE.rows)[number]["key"]) => {
    switch (key) {
      case "monthly":
        return `${formatPrice(p.monthly)}/mo`;
      case "standard":
        return `${formatPrice(p.standard)}/mo`;
      case "setupFee":
        return p.setupFee ? formatPrice(p.setupFee) : "None";
      default:
        return p.specs[key];
    }
  };

  const groups: Array<{ title: string; open: boolean; rows: Array<{ label: string; values: (p: Plan) => React.ReactNode }> }> = [
    {
      title: "Pricing",
      open: true,
      rows: COMPARE.rows
        .filter((r) => ["monthly", "standard", "setupFee"].includes(r.key))
        .map((r) => ({ label: r.label, values: (p: Plan) => cell(p, r.key) })),
    },
    {
      title: "Resources",
      open: true,
      rows: COMPARE.rows
        .filter((r) => !["monthly", "standard", "setupFee"].includes(r.key))
        .map((r) => ({ label: r.label, values: (p: Plan) => cell(p, r.key) })),
    },
    {
      title: "Included on every plan",
      open: false,
      rows: g.plans[0].includes.map((f) => ({
        label: f,
        values: () => (
          <>
            <Check className="size-5 text-success-fill" />
            <span className="sr-only">Included</span>
          </>
        ),
      })),
    },
  ];

  const cols = "grid grid-cols-[minmax(12rem,1.2fr)_repeat(4,minmax(0,1fr))] gap-x-6";

  return (
    <section aria-labelledby="compare-heading" className="scroll-mt-24 bg-canvas py-16 lg:py-24">
      <Grid>
        <Headline
          id="compare-heading"
          title={COMPARE.title}
          description={COMPARE.description}
          className="mb-10 xl:mb-14"
        />

        {/* Phone: one block per plan. */}
        <ul className="flex flex-col gap-4 md:hidden">
          {g.plans.map((p) => (
            <li key={p.tier} className={cn("rounded-2xl p-5", p.popular ? "bg-brand-50 ring-1 ring-brand-200" : "bg-canvas-secondary")}>
              <p className="text-[20px] leading-7 font-semibold tracking-[-0.01em] text-fg">{p.name}</p>
              <dl className="mt-3 flex flex-col gap-2">
                {COMPARE.rows.map((r) => (
                  <div key={r.key} className="flex justify-between gap-4 text-small">
                    <dt className="text-fg-secondary">{r.label}</dt>
                    <dd className="text-right font-medium text-fg">{cell(p, r.key)}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={orderUrl(g, p)}
                className="mt-4 flex h-11 items-center justify-center rounded-md bg-primary text-small font-semibold text-white hover:bg-primary-hover"
              >
                Get started
              </a>
            </li>
          ))}
        </ul>

        {/*
          ONE TABLE PER GROUP, not one around everything. The groups collapse,
          and <details> is not a legal child of role="table" — the old single
          table left every rowgroup without a table parent (axe:
          aria-required-children / -parent). Each group is now a complete
          table whose sr-only header row names the plans, so a screen reader
          still hears "Starter, NVMe storage, 50 GB" per cell; the sticky
          header below is the SIGHTED version of that row, and carries the CTAs.
        */}
        <div className="hidden md:block">
          {/* Sticky plan header */}
          <div className="sticky top-18 z-20 bg-canvas pt-4 pb-5 shadow-[0_1px_0_var(--color-line)]">
            <div className={cols}>
              <span aria-hidden="true" />
              {g.plans.map((p) => (
                <div key={p.tier} className="min-w-0">
                  <p className="flex items-center gap-2 text-body font-semibold text-fg">
                    {p.name}
                    {p.popular && (
                      <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-micro font-semibold text-primary">
                        Popular
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-small text-fg-secondary">
                    <span className="font-semibold text-fg">{formatPrice(p.monthly)}</span>/mo
                  </p>
                  <a
                    href={orderUrl(g, p)}
                    className={cn(
                      "mt-3 flex h-10 items-center justify-center rounded-md text-small font-semibold transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      p.popular ? "bg-primary text-white hover:bg-primary-hover" : "bg-fg text-white hover:bg-ink-800",
                    )}
                  >
                    Get started
                  </a>
                </div>
              ))}
            </div>
          </div>

          {groups.map((grp) => (
            <details key={grp.title} open={grp.open} className="group/cmp border-t border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span className="text-body font-semibold text-fg">{grp.title}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 text-fg">
                  <path d="M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M8 3v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="group-open/cmp:hidden" />
                </svg>
              </summary>
              <div role="table" aria-label={`${grp.title}: compare cloud hosting plans`}>
                <div role="rowgroup" className="sr-only">
                  <div role="row">
                    <span role="columnheader">Feature</span>
                    {g.plans.map((p) => (
                      <span role="columnheader" key={p.tier}>
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              <div role="rowgroup">
                {grp.rows.map((r) => (
                  <div key={r.label} role="row" className={cn(cols, "items-center border-t border-line-subtle py-4")}>
                    <span role="rowheader" className="text-small text-fg-secondary">{r.label}</span>
                    {g.plans.map((p) => (
                      <span role="cell" key={p.tier} className="flex min-w-0 items-center text-small text-fg">
                        {r.values(p)}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              </div>
            </details>
          ))}
          <div className="border-t border-line" />
        </div>
      </Grid>
    </section>
  );
}
