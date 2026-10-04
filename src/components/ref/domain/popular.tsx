"use client";

import { useRef } from "react";
import Link from "next/link";
import { billing } from "@/data/company";
import { tlds } from "@/data/tlds";
import { ChevronLeft, ChevronRight, Grid } from "../kit";
import { POPULAR } from "./copy";

/**
 * "Choose from the most popular domains" — the reference's `h-cards-carousel-section`.
 *
 * REBUILT to the reference after a first version got this wrong in four ways:
 * it centred the heading, used translucent white/10 cards in a fixed 4-column
 * grid, and had no carousel. Measured at 1440:
 *
 *   band     full-bleed dark (#251951 there, `canvas-deep` here), 80px padding
 *   heading  48/56 white, LEFT aligned, wrapping to two lines
 *   link     "Compare all TLD prices" directly under the heading
 *   arrows   circular prev/next, top RIGHT, translucent on the dark band
 *   cards    WHITE, ~293px wide, 16px radius, 24px gutter, in a horizontal
 *            track that deliberately bleeds off the right edge
 *   card     TLD name, one line of description, price + /1st yr, then a
 *            full-width filled button
 *
 * The reference strikes a "was" price above each promo. We do not run a domain
 * promo, so there is nothing to strike — inventing one would be the exact
 * practice this site positions against. Prices are `data/tlds.ts`.
 *
 * A real scroll container, not a transform carousel: it stays swipeable on
 * touch, keyboard-scrollable, and degrades to a plain scroller without JS.
 */
export function Popular() {
  const track = useRef<HTMLUListElement>(null);

  /** One card plus its gutter. */
  const nudge = (dir: number) => track.current?.scrollBy({ left: dir * 317, behavior: "smooth" });

  return (
    <section
      aria-labelledby="dn-popular-heading"
      className="overflow-hidden bg-canvas-deep py-14 md:py-16 xl:py-20"
    >
      <Grid>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2
              id="dn-popular-heading"
              className="max-w-[560px] text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-white lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]"
            >
              {POPULAR.title}
            </h2>
            <Link
              href={POPULAR.cta.href}
              className="mt-4 inline-flex min-h-11 items-center text-body text-white underline decoration-from-font hover:text-primary-on-dark"
            >
              {POPULAR.cta.label}
            </Link>
          </div>

          <div className="flex gap-3">
            {[
              { label: "Previous extensions", dir: -1, Icon: ChevronLeft },
              { label: "More extensions", dir: 1, Icon: ChevronRight },
            ].map(({ label, dir, Icon }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => nudge(dir)}
                className="grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors duration-fast hover:bg-white/20"
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>
      </Grid>

      {/* The track bleeds past the grid's right gutter, as the reference's does.
          `pr-20` keeps the last card reachable once scrolled. */}
      <ul
        ref={track}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-2 md:px-10 xl:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tlds.map((t) => (
          <li
            key={t.tld}
            className="flex w-[293px] shrink-0 snap-start flex-col rounded-2xl bg-canvas p-6"
          >
            <p className="text-[32px] leading-10 font-semibold tracking-[-0.16px] text-fg">
              {t.tld}
            </p>
            <p className="mt-2 flex-1 text-body text-fg-secondary">
              {t.note ?? "A general-purpose extension."}
            </p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-[32px] leading-10 font-semibold tracking-[-0.16px] text-fg">
                ${t.price.toFixed(2)}
              </span>
              <span className="text-body text-fg-secondary">/1st yr</span>
            </p>
            <a
              href={billing.registerDomain}
              className="mt-4 flex h-12 items-center justify-center rounded-md bg-primary text-[16px] font-semibold text-white transition-colors duration-fast hover:bg-primary-hover"
            >
              {POPULAR.check}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
