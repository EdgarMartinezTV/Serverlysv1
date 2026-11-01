"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LuxCopy } from "./copy-lux";
import { CATEGORIES, MENU, money, type CategoryId } from "./menu";
import { useLumbre } from "./state";
import { CHAR, display } from "./theme";
import { Eyebrow } from "./lumbre-ui";

const FEATURED = ["churrasco", "ribs", "salmon", "pannacotta"] as const;

/**
 * C · Signature dishes: an editorial spread of four plates, offset like a
 * printed menu, then the category index that opens the live menu on that
 * section. Data comes from menu.ts, so a signature dish is always one you
 * can actually order below.
 */
export function LumbreSignature({ lux }: { lux: LuxCopy }) {
  const { locale, setCategory, setFilter, goTo } = useLumbre();
  const s = lux.signature;
  const dishes = FEATURED.map((id) => MENU.find((m) => m.id === id)!);

  const open = (category: CategoryId | "all") => {
    setFilter(null);
    setCategory(category);
    goTo("menu");
  };

  return (
    <section aria-labelledby="lumbre-signature-heading" className="lb-grain overflow-hidden py-28 text-[#F4EFE6] lg:py-40" style={{ background: CHAR }}>
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow dark>{s.label}</Eyebrow>
            <h2
              id="lumbre-signature-heading"
              data-reveal="mask"
              className={cn(display.className, "mt-8 text-[clamp(48px,6vw,96px)] leading-[0.92] font-light tracking-[-0.02em]")}
            >
              <span className="lb-line">
                <span>{s.title}</span>
              </span>
            </h2>
          </div>
          <p data-reveal className="max-w-[420px] text-[16px] leading-[1.75] text-[#F4EFE6]/75 lg:col-span-4 lg:col-start-9">
            {s.intro}
          </p>
        </div>

        <ul className="mt-20 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {dishes.map((dish, i) => (
            <li key={dish.id} data-reveal style={{ "--reveal-delay": `${(i % 4) * 110}ms` } as React.CSSProperties} className={cn(i % 2 === 1 && "lg:mt-24")}>
              <button
                type="button"
                onClick={() => open(dish.category)}
                className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#C8A97E]"
              >
                <span className="relative block aspect-[3/4] overflow-hidden">
                  <Image
                    src={dish.photo}
                    alt={dish.name[locale]}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 100vw"
                    className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-[1.07]"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(17_20_17/0.75)_100%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <span className="absolute inset-x-5 bottom-5 flex translate-y-3 items-center gap-2 font-display text-[11px] font-semibold tracking-[0.2em] text-[#F4EFE6] uppercase opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {s.view}
                    <span aria-hidden="true">→</span>
                  </span>
                </span>
                <span className="mt-6 flex items-baseline justify-between gap-4 border-b border-[#F4EFE6]/15 pb-4">
                  <span className={cn(display.className, "text-[28px] leading-[1.1] sm:text-[30px]")}>{dish.name[locale]}</span>
                  <span className="font-display text-[15px] font-medium text-[#C8A97E] tabular-nums">{money(dish.price)}</span>
                </span>
                <span className="mt-3 block text-[14px] leading-[1.6] text-[#F4EFE6]/65">{s.notes[dish.id]}</span>
              </button>
            </li>
          ))}
        </ul>

        <nav aria-label={s.all} className="mt-24 border-t border-[#F4EFE6]/12 pt-10">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-3">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => open(c.id)}
                  className={cn(display.className, "rounded-full px-4 py-1.5 text-[24px] italic transition-colors hover:text-[#C8A97E] focus-visible:outline-2 focus-visible:outline-[#C8A97E] sm:text-[30px]")}
                >
                  {c.label[locale]}
                </button>
              </li>
            ))}
            <li className="ml-auto">
              <button
                type="button"
                onClick={() => open("all")}
                className="inline-flex h-12 items-center gap-2 rounded-full px-6 font-display text-[12px] font-semibold tracking-[0.18em] uppercase ring-1 ring-[#C8A97E] transition-colors hover:bg-[#C8A97E] hover:text-[#111411] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A97E]"
              >
                {s.all}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
