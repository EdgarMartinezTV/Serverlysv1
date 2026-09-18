import { CtaButton, Grid } from "@/components/ref/kit";
import { BANNER } from "../_content";

/**
 * The reference's `h-text-button-section` — a centred 676px column on the pale
 * lavender surface, 80px of vertical padding, CTA 32px under the heading.
 */
export function Banner() {
  return (
    <section
      aria-labelledby="ecom-banner-heading"
      className="bg-canvas-secondary py-14 md:py-16 xl:py-20"
    >
      <Grid>
        <div className="mx-auto flex max-w-[676px] flex-col items-center text-center">
          <h2
            id="ecom-banner-heading"
            className="text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-fg lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]"
          >
            {BANNER.title}
          </h2>
          <div className="mt-8">
            <CtaButton href="#pricing">{BANNER.cta}</CtaButton>
          </div>
        </div>
      </Grid>
    </section>
  );
}
