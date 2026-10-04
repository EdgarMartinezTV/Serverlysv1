"use client";

import { useRef } from "react";
import Link from "next/link";
import { billing } from "@/data/company";
import { tlds } from "@/data/tlds";
import { ChevronLeft, ChevronRight, Grid } from "@/components/ref/kit";

/** The scrolling extension rail inside the dark Popular band. Prices from data/tlds. */
export function PopularRail({
  title,
  cta,
  check,
}: {
  title: string;
  cta: { label: string; href: string };
  check: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const nudge = (dir: number) => track.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <>
      <Grid>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="dn-popular-heading" className="display-md max-w-[560px] text-white">
              {title}
            </h2>
            <Link
              href={cta.href}
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-body font-semibold text-white hover:text-primary-on-dark"
            >
              {cta.label} <span aria-hidden="true">→</span>
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
                className="grid size-12 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-colors duration-fast hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>
      </Grid>

      <ul
        ref={track}
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 md:px-10 xl:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tlds.map((t, i) => (
          <li
            key={t.tld}
            className={`flex w-[280px] shrink-0 snap-start flex-col rounded-2xl p-6 ${
              i === 0 ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white" : "bg-canvas"
            }`}
          >
            <p className="flex items-center justify-between">
              <span className={`text-[34px] leading-10 font-semibold tracking-[-0.03em] ${i === 0 ? "text-white" : "text-fg"}`}>{t.tld}</span>
              {i === 0 && <span className="rounded-md bg-white/15 px-2 py-0.5 text-micro font-semibold text-white">Most recognised</span>}
            </p>
            <p className={`mt-2 flex-1 text-small ${i === 0 ? "text-fg-on-brand-muted" : "text-fg-secondary"}`}>
              {t.note ?? "A general-purpose extension."}
            </p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className={`text-[30px] leading-9 font-semibold tracking-[-0.03em] ${i === 0 ? "text-white" : "text-fg"}`}>
                ${t.price.toFixed(2)}
              </span>
              <span className={`text-small ${i === 0 ? "text-fg-on-brand-muted" : "text-fg-secondary"}`}>/1st yr</span>
            </p>
            <Link
              href={billing.searchDomain(`example${t.tld}`)}
              className={`mt-4 flex h-12 items-center justify-center rounded-md text-body font-semibold transition-colors duration-fast ${
                i === 0 ? "bg-white text-fg hover:bg-ink-100" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              {check}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
