import { billing } from "@/data/company";
import { Band, Grid, Headline } from "../kit";
import { tlds } from "@/data/tlds";
import { TABLE } from "./copy";

/**
 * "Compare domain extension prices" — the reference's TLD table.
 *
 * TWO LAYOUTS, not one table in a scroller. A five-column table needs ~560px
 * and a phone has 343px of content, so the first attempt set `min-w-[560px]`
 * inside `overflow-x-auto` — which pushed the whole PAGE to a 513px
 * scrollWidth and failed the repo's own mobile overflow check. Below `md` each
 * extension is its own stacked card; from `md` up it is the reference's table.
 * Same data either way, no horizontal scroll at any width.
 *
 * The reference has First year / Renews at / Transfer columns. `data/tlds.ts`
 * holds first-year registration prices ONLY, and that file's header is
 * explicit that renewal is charged at the published renewal rate rather than
 * the promo rate. So the renewal column says where the real number comes from
 * instead of carrying one we do not have — the site's standing rule is that a
 * term price never renders beside an invented renewal.
 *
 * ⚠ Add renewal and transfer prices to `data/tlds.ts` and this can show all
 * three columns as the reference does.
 */
export function TldTable() {
  return (
    <Band id="tld-prices" labelledBy="dn-table-heading" className="scroll-mt-24">
      <Grid>
        <Headline id="dn-table-heading" title={TABLE.title} className="mb-8 xl:mb-12" />

        {/* Phone: one card per extension. */}
        <ul className="flex flex-col gap-3 md:hidden">
          {tlds.map((t) => (
            <li key={t.tld} className="rounded-2xl bg-canvas-secondary p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[20px] leading-7 font-semibold tracking-[-0.1px] text-fg">
                  {t.tld}
                </p>
                <p className="text-body font-semibold text-fg">
                  ${t.price.toFixed(2)}
                  <span className="font-normal text-fg-secondary"> /1st yr</span>
                </p>
              </div>
              <p className="mt-1 text-[14px] leading-5 text-fg-secondary">
                {t.note ?? "General purpose"} · {TABLE.columns.renew}: {TABLE.renewNote}
              </p>
              <a
                href={billing.registerDomain}
                className="mt-3 inline-flex min-h-11 items-center rounded-md px-3 text-body font-semibold text-primary hover:bg-primary-soft"
              >
                Register {t.tld}
              </a>
            </li>
          ))}
        </ul>

        {/* md and up: the reference's table. */}
        <table className="hidden w-full border-collapse text-left md:table">
          <thead>
            <tr className="border-b border-line">
              {[
                TABLE.columns.tld,
                TABLE.columns.first,
                TABLE.columns.renew,
                TABLE.columns.note,
              ].map((c) => (
                <th key={c} scope="col" className="py-4 text-[14px] leading-5 font-semibold text-fg">
                  {c}
                </th>
              ))}
              <th scope="col" className="py-4">
                <span className="sr-only">Register</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tlds.map((t) => (
              <tr key={t.tld} className="border-b border-line-subtle">
                <th scope="row" className="py-2 text-body font-semibold text-fg">
                  {t.tld}
                </th>
                <td className="py-2 text-body text-fg">${t.price.toFixed(2)}</td>
                <td className="py-2 text-body text-fg-muted">{TABLE.renewNote}</td>
                <td className="py-2 text-body text-fg-secondary">{t.note ?? "—"}</td>
                <td className="py-2 text-right">
                  {/* min-h-11 so the control clears the 44px touch target the
                      repo's mobile check enforces; a bare text link does not. */}
                  <a
                    href={billing.registerDomain}
                    className="inline-flex min-h-11 items-center rounded-md px-3 text-body font-semibold text-primary hover:bg-primary-soft"
                  >
                    Register
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Grid>
    </Band>
  );
}
