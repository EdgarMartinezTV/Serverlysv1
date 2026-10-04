import { SeraMark } from "@/components/sera/sera-mark";
import { MockPhoto } from "@/components/ui/mock-photo";
import { CtaButton } from "@/components/ref/kit";

/**
 * The closing banner — layout from the reference's `h-banner-with-image`.
 *
 * ⚠ COPY IS OUR OWN. This shipped with the reference's headline verbatim
 * ("Imagined it. Now make it real."), which is copied ad copy, not a layout.
 * Replaced 2026-10-03. Do not restore it; measured geometry is fair to match,
 * someone else's slogan is not.
 *
 * The layout below is not an approximation of the reference; it is its measured
 * box model, read off the live page at 375 / 768 / 1024 / 1025 / 1280 / 1440
 * and reproduced value for value:
 *
 *   section   overflow:hidden, no padding, no min-height of its own
 *   wrapper   max-width 1600, margin 0 auto, flex, gap 48, min-height 550
 *             <1025  flex-direction column, align-items center
 *             ≥1025  flex-direction row, padding-left 80, padding-right 0
 *   left      max-width 530, width 100%
 *             <1025  margin 0 auto,     padding 64 16 0
 *             ≥1025  margin 0 auto 0 0, padding 80 0
 *   copy      description max-width 360, margin-top 12 (<1025) / 16 (≥1025)
 *   button    margin-top 24; ≥768 row + width fit-content;
 *             ≥1025 margin-top auto + padding-top 24
 *   right     width 100%, max-width 690
 *             ≥1025  flex, justify-content end, height max-content, margin auto 0
 *   image     natural aspect at the column's width — no crop, no scale
 *
 * THREE THINGS THE REFERENCE DOES NOT DO, and this therefore does not either:
 *
 *  · It does not position the artwork absolutely. Both columns are in normal
 *    flow, and the artwork's left edge is wherever the flex gap puts it.
 *  · It does not crop. The image keeps its natural aspect and is never
 *    `object-cover`; at 1440 the measured box is 690×553 against a 1440×1154
 *    source, which is the whole picture scaled down.
 *  · It does not bleed PAST the right edge. The right column ends exactly at
 *    the wrapper's right edge (measured right = 1440 at a 1440 viewport)
 *    because the wrapper carries `padding-right: 0`. Flush, not overflowing.
 *
 * WHY NO FADE OR CROP IS NEEDED. The reference's artwork is authored on its
 * own band colour (band `rgb(103, 61, 230)`, artwork background
 * `rgb(102, 60, 229)`), so its rectangle is invisible and the layout can place
 * it raw. `botton-section.png` solves the same problem differently and better:
 * it is a cut-out — RGBA, ~23% fully transparent — so the band shows through
 * wherever the artwork is not, and it sits on ANY background colour without a
 * seam. Do not add a mask or a scale crop here; there is nothing to hide, and
 * either would move the artwork off the reference's geometry.
 *
 * Note the filename spelling: `botton-section.png`, not "bottom". That is what
 * the file is called.
 *
 * `min-[1025px]` rather than Tailwind's `lg` (1024px): the reference switches at
 * `width >= 1025px`, and at exactly 1024 it is still the stacked layout.
 */
export function ImaginedCta() {
  return (
    <section aria-labelledby="imagined-heading" className="relative isolate overflow-hidden bg-primary">
      {/* 2026-10-03: the AI "STAND OUT" photograph is gone. The art is now a
          coded browser (a small bakery site), a domain pill and a Sera prompt,
          layered the way the reference layers its own, in the site's type. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-10 w-[60%] bg-white/[0.06] [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-10 w-[35%] bg-white/[0.05] [clip-path:polygon(45%_0,100%_0,100%_100%,0_100%)]"
      />
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-24">
        <div>
          <h2 id="imagined-heading" className="display-lg text-white">
            Pick a plan.
            <span className="block">We move your site free.</span>
          </h2>
          <p className="mt-5 max-w-[380px] text-body text-white/85">
            30-day money-back guarantee. Free migration. The renewal price shown before you buy.
          </p>
          <div className="mt-10">
            <CtaButton href="/pricing" tone="light">
              Choose a plan
            </CtaButton>
          </div>
        </div>

        <div aria-hidden="true" className="relative mx-auto w-full max-w-[520px] pb-10 lg:mr-0">
          <div className="overflow-hidden rounded-2xl bg-white shadow-e5 ring-1 ring-white/30">
            <div className="flex items-center justify-between bg-[#1b1206] px-5 py-3 text-micro text-white/80">
              <span className="flex gap-4">
                <span>Home</span>
                <span>Menu</span>
                <span>Order</span>
              </span>
              <span className="font-semibold tracking-[0.2em] text-white">HEARTH</span>
              <span>Cart (2)</span>
            </div>
            <div className="relative h-[230px] overflow-hidden p-6 sm:h-[260px]">
              <div className="absolute inset-0">
                <MockPhoto src="bread" className="h-full" sizes="520px" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
              <p className="relative mt-8 max-w-[260px] text-[30px] leading-[1.05] font-semibold tracking-[-0.03em] text-white sm:text-[34px]">
                Fresh bread, every morning
              </p>
              <span className="relative mt-5 inline-flex rounded-full bg-white px-4 py-2 text-micro font-semibold text-[#1b1206]">
                Order for pickup
              </span>
            </div>
          </div>

          <div className="absolute -top-5 -left-4 flex items-center gap-2.5 rounded-xl bg-white/95 py-2.5 pr-4 pl-2.5 shadow-e4 backdrop-blur sm:-left-8">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-white">
              <svg viewBox="0 0 24 24" fill="none" className="size-4">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <span className="text-body text-fg">
              hearthbakery<span className="font-semibold">.com</span>
            </span>
          </div>

          <div className="absolute right-0 bottom-0 flex w-[82%] items-center gap-3 rounded-xl bg-white py-2 pr-2 pl-4 shadow-e5 ring-2 ring-brand-200 sm:-right-6">
            <SeraMark className="h-4 w-4 shrink-0 text-primary" />
            <span className="flex-1 truncate text-small text-fg">Create a website for my bakery</span>
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <svg viewBox="0 0 16 16" fill="none" className="size-4">
                <path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
