import { CtaButton, Grid } from "@/components/ref/kit";
import { billing } from "@/data/company";
import { RELIABILITY } from "../_content";
import { RunLogArt } from "./visuals";

/**
 * "The same steps, every single time".
 *
 * Occupies the slot the reference used for a data-centre map. Server locations
 * are a VPS concern and mean nothing for a managed automation service, so the
 * band now carries the page's actual claim — that automations remove the
 * missed step — and the world map went with it.
 *
 * ⚠ READ THE COPY BEFORE EDITING IT. This band deliberately does NOT say
 * nothing ever fails. It says human error goes away and that real failures are
 * retried, recorded and escalated. That distinction is the difference between
 * a promise we can keep and one we cannot, and it is the whole reason the
 * three points below are about visibility rather than perfection.
 *
 * Geometry is the reference's: one 1280-wide `surface-dark` panel at a 16px
 * radius, a 600/600 grid with an 80px gutter and 48px of internal padding.
 */
export function Reliability() {
  return (
    <section aria-labelledby="n8n-reliability-heading" className="bg-canvas-dark py-12 xl:py-12">
      <Grid>
        <div className="overflow-hidden rounded-2xl bg-surface-dark">
          <div className="grid items-center gap-10 p-6 md:p-10 xl:grid-cols-2 xl:gap-x-20 xl:py-12 xl:pr-0 xl:pl-12">
            <div className="flex flex-col">
              <h2
                id="n8n-reliability-heading"
                className="text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-fg-on-dark"
              >
                {RELIABILITY.title}
              </h2>
              <p className="mt-4 text-body text-fg-on-dark-secondary">
                {RELIABILITY.body}
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {RELIABILITY.points.map((p) => (
                  <li key={p.label} className="text-body text-fg-on-dark-secondary">
                    <b className="font-semibold text-fg-on-dark">{p.label}</b> — {p.detail}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <CtaButton href={billing.sales} tone="on-dark">
                  {RELIABILITY.cta}
                </CtaButton>
              </div>
            </div>

            <RunLogArt className="xl:pr-12" />
          </div>
        </div>
      </Grid>
    </section>
  );
}
