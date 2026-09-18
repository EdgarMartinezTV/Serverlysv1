import { BANNER } from "../_content";
import { CtaButton } from "@/components/ref/kit";

/**
 * Closing CTA band — full-bleed brand fill, copy inset 80px from the left, and
 * a darkened logomark bleeding off the right.
 *
 * The heading is the page's one use of the 80/88 step, and it only reaches it
 * at 1024; below that it drops to 48/56. Measured, and worth keeping: at 80px
 * in a 530px column the line breaks after "that", which is the break the
 * reference has.
 */
export function Banner() {
  return (
    <section aria-labelledby="cloud-banner-heading" className="relative overflow-hidden bg-primary">
      {/* Decorative mark — two skewed slabs reading as a chevron, in the same
          role as the reference's oversized logo silhouette. */}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block">
        <span className="absolute top-0 left-[10%] h-1/2 w-[38%] -skew-x-[24deg] bg-brand-800/45" />
        <span className="absolute bottom-0 left-[34%] h-1/2 w-[38%] -skew-x-[24deg] bg-brand-800/45" />
        <span className="absolute top-[28%] left-[24%] h-[44%] w-[52%] -skew-x-[24deg] bg-brand-800/25" />
      </span>

      {/* The gutter is the WRAPPER's — putting it on the copy column instead
          eats into the 530px measure and the heading wraps to four lines. */}
      <div className="relative mx-auto flex w-full max-w-[1600px] px-4 md:px-10 xl:px-20">
        {/* 560, not the reference's 530 — see the note on Headline in kit.tsx.
            At 530 our wider DM Sans breaks this to three lines. */}
        <div className="max-w-[560px] py-16 xl:py-26">
          <h2
            id="cloud-banner-heading"
            className="text-[48px] leading-[56px] font-normal tracking-[-0.24px] text-white lg:text-[80px] lg:leading-[88px] lg:tracking-[-0.4px]"
          >
            {BANNER.title}
          </h2>
          <p className="mt-4 max-w-[360px] text-body text-white">
            {BANNER.description}
          </p>
          <div className="mt-6">
            <CtaButton href="#pricing" tone="light">
              {BANNER.cta}
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
