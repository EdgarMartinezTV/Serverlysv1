import { CtaButton, Grid } from "@/components/ref/kit";
import { billing } from "@/data/company";
import { BANNER } from "../_content";

/**
 * The closing banner.
 *
 * The notched shape is not a clip-path on the reference — it is two stacked
 * gradients, and reproducing it that way is what keeps the notch painting the
 * PAGE colour rather than punching a transparent hole:
 *
 *   · the lower layer fades in the panel colour between 15% and 85% of the
 *     width, so the banner is inset from the page edges without a wrapper;
 *   · the upper layer runs at 315° and paints the page colour over the first
 *     20% and last 20%, which cuts the top-left and bottom-right corners off
 *     at 45°.
 *
 * Both are `linear-gradient` with hard stops, so there is no actual gradient
 * anywhere — just two flat regions per layer.
 *
 * The overline is the h2 and the big line is a <p>: the heading carries the
 * offer and the display line is presentation.
 *
 * The reference followed this with a Google / HostAdvice / WPBeginner ratings
 * strip. It was removed with the rest of the borrowed proof — those are ratings
 * of a competitor and, unlike a testimonial, there is no version of them that
 * could be made true for us.
 */
export function Banner() {
  return (
    <section aria-labelledby="n8n-banner-heading" className="bg-canvas-dark">
      <div className="bg-[linear-gradient(315deg,var(--color-canvas-dark),var(--color-canvas-dark)_20%,transparent_20%,transparent_80%,var(--color-canvas-dark)_80%),linear-gradient(to_right,var(--color-canvas-dark),var(--color-canvas-dark)_15%,var(--color-surface-dark)_15%,var(--color-surface-dark)_85%,var(--color-canvas-dark)_85%)] py-20">
        <Grid>
          <div className="mx-auto flex max-w-[676px] flex-col items-center text-center">
            <h2
              id="n8n-banner-heading"
              className="text-[18px] leading-[26px] font-semibold tracking-[-0.09px] text-fg-on-dark"
            >
              {BANNER.overline}
            </h2>
            <p className="mt-4 text-[28px] leading-9 font-normal tracking-[-0.14px] text-fg-on-dark lg:text-[36px] lg:leading-[44px] lg:tracking-[-0.18px]">
              {BANNER.title}
            </p>
            <CtaButton href={billing.sales} tone="on-dark" className="mt-8">
              {BANNER.cta}
            </CtaButton>
          </div>
        </Grid>
      </div>
    </section>
  );
}
