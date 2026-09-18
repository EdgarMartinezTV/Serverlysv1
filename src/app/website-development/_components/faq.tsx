import { Band, Grid, Heading } from "./kit";
import { FAQS } from "../_content";

/**
 * The reference's closing FAQ — black band, 48px heading, a rule-separated
 * accordion with a +/− affordance on the right.
 *
 * Built on <details>/<summary> rather than a React disclosure, on purpose:
 * it is open-able with JavaScript off (which is how most AI crawlers read this
 * page — see SEO.md), it is keyboard- and screen-reader-correct with no ARIA
 * of our own, and the browser owns the expanded state.
 *
 * ⚠ The ANSWERS are DreamHost's operational policy, reproduced verbatim on
 * instruction. See the warning block in `_content.ts`.
 */
export function Faq() {
  return (
    <Band tone="black" labelledBy="wd-faq" className="py-16 lg:py-24">
      {/* TWO COLUMNS, measured: the heading sits in the left 8 (x=32, w=672)
          and the accordion in the right 8 (x=736, w=672). Built as one centred
          column first, which put the heading above the list and made the band
          read completely differently from the reference. */}
      <Grid className="gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-8">
          <Heading level={2} step="h2sm" id="wd-faq">
            {FAQS.title}
          </Heading>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-8">
          <div className="border-t border-white/15">
            {FAQS.items.map((item) => (
              <details
                key={item.q}
                className="group border-b border-white/15 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-10 text-left text-[1.125rem] font-medium leading-[1.6] lg:text-[1.25rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="relative h-6 w-6 shrink-0 text-white"
                  >
                    {/* Horizontal bar always; the vertical one rotates away on
                        open, so + becomes − without swapping icons. */}
                    <span className="absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-6 w-0.5 -translate-x-1/2 bg-current transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="pb-10 pr-10 text-[1rem] leading-[1.6] text-white/80 [text-wrap:initial] lg:text-[1.125rem]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Grid>
    </Band>
  );
}
