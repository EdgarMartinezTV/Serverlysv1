import Link from "next/link";
import { ArrowUpRight, Grid, Headline } from "@/components/ref/kit";
import { TUTORIALS } from "../_content";
import { TutorialArt } from "./visuals";

/**
 * "Want to dive deeper into n8n hosting?".
 *
 * Measured at 1440: three cards under a centred 48/56 heading, each a 16:9
 * thumbnail over an 18/26 semibold title, then a filled 48px "See all".
 *
 * ONE DELIBERATE DEPARTURE: the reference's three cards are 360px wide with a
 * 74.67px gutter, which leaves them 51px short of the page grid's right edge —
 * an artefact of the carousel they live in. Here they fill three equal columns
 * of the 1280 grid, so the row lines up with every other band on the page.
 * Matching the artefact would have been the only place on the page where a
 * band stops short of the grid for no visible reason.
 *
 * The thumbnails are drawn (see visuals.tsx): the reference's are YouTube
 * stills carrying photographs of a Hostinger presenter.
 */
export function Tutorials() {
  return (
    <section aria-labelledby="n8n-tutorials-heading" className="bg-canvas-dark py-12 xl:py-12">
      <Grid>
        <Headline
          id="n8n-tutorials-heading"
          title={TUTORIALS.title}
          tone="dark"
          className="mb-10 xl:mb-12"
        />

        <ul className="grid gap-6 md:grid-cols-3">
          {TUTORIALS.cards.map((card) => (
            <li key={card.key}>
              <Link href={card.href} className="group flex flex-col gap-4">
                <TutorialArt
                  kind={card.key}
                  className="overflow-hidden rounded-lg ring-1 ring-line-on-dark transition-transform duration-fast group-hover:-translate-y-0.5"
                />
                <h3 className="text-center text-[18px] leading-[26px] font-semibold tracking-[-0.09px] text-fg-on-dark group-hover:underline">
                  {card.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Link
            href={TUTORIALS.ctaHref}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-12 text-body font-semibold text-white transition-colors duration-fast hover:bg-brand-500"
          >
            {TUTORIALS.cta}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </Grid>
    </section>
  );
}
