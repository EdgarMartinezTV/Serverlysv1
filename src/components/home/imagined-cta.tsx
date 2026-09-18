import Image from "next/image";
import { CtaButton } from "@/components/ref/kit";

/**
 * "Imagined it. Now make it real." — the reference's closing
 * `h-banner-with-image`.
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
    <section aria-labelledby="imagined-heading" className="overflow-hidden bg-primary">
      <div className="mx-auto flex min-h-[550px] w-full max-w-[1600px] flex-col items-center gap-12 min-[1025px]:flex-row min-[1025px]:items-stretch min-[1025px]:pl-20 min-[1025px]:pr-0">
        <div className="relative z-[1] mx-auto flex w-full max-w-[530px] flex-col px-4 pb-0 pt-16 min-[1025px]:ml-0 min-[1025px]:mr-auto min-[1025px]:px-0 min-[1025px]:py-20">
          <h2
            id="imagined-heading"
            className="text-[40px] leading-[48px] font-normal tracking-[-0.2px] text-white lg:text-[64px] lg:leading-[72px] lg:tracking-[-0.32px]"
          >
            Imagined it.
            <span className="block">Now make it real.</span>
          </h2>
          <p className="mt-3 max-w-[360px] text-body text-white min-[1025px]:mt-4">
            30-day money-back guarantee. Free migration. The renewal price shown before you buy.
          </p>
          {/*
            `mt-auto` at ≥1025 is what pins the button to the bottom of a
            550px-tall column — which is the reason the left column is a flex
            column rather than a plain block.
          */}
          <div className="mt-6 flex w-full flex-col gap-2 md:w-fit md:flex-row min-[1025px]:mt-auto min-[1025px]:pt-6">
            <CtaButton href="/pricing" tone="light">
              Get started
            </CtaButton>
          </div>
        </div>

        <div className="w-full max-w-[690px] min-[1025px]:my-auto min-[1025px]:flex min-[1025px]:h-max min-[1025px]:justify-end">
          <Image
            src="/Hosting-images/botton-section.png"
            alt="A Serverlys-built website in a browser: a yourbusiness.com domain search above a live homepage reading Stand Out, with a prompt to create a website for your business"
            width={1532}
            height={1027}
            sizes="(min-width: 1025px) 690px, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
