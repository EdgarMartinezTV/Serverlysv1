import { cn } from "@/lib/utils";
import { formatPrice, groupById, type Plan } from "@/data/pricing";
import { Grid, Headline } from "@/components/ref/kit";
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

  return (
    <section aria-labelledby="compare-heading" className="bg-canvas py-12">
      <Grid>
        <Headline
          id="compare-heading"
          title={COMPARE.title}
          description={COMPARE.description}
          className="mb-8 xl:mb-12"
        />

        {/* Phone: one block per plan. */}
        <ul className="flex flex-col gap-4 md:hidden">
          {g.plans.map((p) => (
            <li key={p.tier} className="rounded-2xl bg-canvas-secondary p-5">
              <p className="text-[20px] leading-7 font-semibold tracking-[-0.1px] text-fg">
                {p.name}
              </p>
              <dl className="mt-3 flex flex-col gap-2">
                {COMPARE.rows.map((r) => (
                  <div key={r.key} className="flex justify-between gap-4 text-[14px] leading-5">
                    <dt className="text-fg-secondary">{r.label}</dt>
                    <dd className="text-right font-medium text-fg">{cell(p, r.key)}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-4 text-[14px] leading-5 font-semibold text-fg">
                  Plan
                </th>
                {g.plans.map((p) => (
                  <th
                    key={p.tier}
                    scope="col"
                    className={cn(
                      "py-4 text-body font-semibold",
                      p.popular ? "text-primary" : "text-fg",
                    )}
                  >
                    {p.name}
                    {p.popular && (
                      <span className="block text-micro font-normal text-fg-muted">
                        Most popular
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.rows.map((r) => (
                <tr key={r.key} className="border-b border-line-subtle">
                  <th
                    scope="row"
                    className="py-3 text-[14px] leading-5 font-normal text-fg-secondary"
                  >
                    {r.label}
                  </th>
                  {g.plans.map((p) => (
                    <td key={p.tier} className="py-3 text-body text-fg">
                      {cell(p, r.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Grid>
    </section>
  );
}
