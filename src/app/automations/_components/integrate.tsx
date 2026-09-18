import { Check, CtaButton, Grid } from "@/components/ref/kit";
import { billing } from "@/data/company";
import { INTEGRATE } from "../_content";
import { IntegrateArt } from "./visuals";

/**
 * "Connects the tools you already pay for" — the reference's two-column band.
 *
 * Measured at 1440: a 600/600 grid with an 80px gutter inside the 1280 grid,
 * heading 36/44 at -0.18px (this band keeps 36/44 at every width; only the
 * centred band headings step up to 48/56), body 16/24, then a wrapping row of
 * 14/20 checked chips and a 48px CTA.
 *
 * This band carries the `integrations` anchor, and the rail's "Integrations"
 * label points here. The reference's own rail did NOT line up with its bands —
 * "Workflows" pointed at this one and "Integrations" at an unrelated one — and
 * that was not worth reproducing once the page stopped being a clone.
 */
export function Integrate() {
  return (
    <section
      id="integrations"
      aria-labelledby="n8n-integrate-heading"
      className="scroll-mt-32 bg-canvas-dark py-12 xl:py-12"
    >
      <Grid>
        <div className="grid gap-10 xl:grid-cols-2 xl:items-center xl:gap-x-20">
          <div className="flex flex-col">
            <h2
              id="n8n-integrate-heading"
              className="text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-fg-on-dark"
            >
              {INTEGRATE.title}
            </h2>

            <p className="mt-4 text-body text-fg-on-dark-secondary">{INTEGRATE.body}</p>

            {/* Chips wrap rather than sitting in a grid: the reference fits
                three on one line at 1440 and one on the next, which is what a
                flex wrap does for free at every width in between. */}
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-3">
              {INTEGRATE.chips.map((chip) => (
                <li
                  key={chip}
                  className="flex items-center gap-2 text-[14px] leading-5 text-fg-on-dark-secondary"
                >
                  <Check className="size-5 shrink-0 text-success-fill" />
                  {chip}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <CtaButton href={billing.sales} tone="on-dark">
                {INTEGRATE.cta}
              </CtaButton>
            </div>
          </div>

          <IntegrateArt className="rounded-2xl" />
        </div>
      </Grid>
    </section>
  );
}
