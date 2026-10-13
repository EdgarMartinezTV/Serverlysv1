"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ── "What Serverlys is used for" — accordion with a matching photo ─────── */

export type UseItem = {
  title: string;
  body: string;
  links: readonly (readonly [string, string])[];
  photo: { src: string; alt: string };
};

export function UsedFor({ items }: { items: readonly UseItem[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
      <div className="relative aspect-[4/4.4] overflow-hidden rounded-2xl bg-brand-100">
        {items.map((it, i) => (
          <Image
            key={it.title}
            src={it.photo.src}
            alt={it.photo.alt}
            fill
            sizes="(min-width: 1024px) 540px, 100vw"
            className={cn(
              "object-cover motion-safe:transition-opacity motion-safe:duration-500",
              open === i ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>
      <div>
        <h2
          id="about-used-heading"
          className="text-[36px] leading-[1.15] font-normal tracking-[-0.025em] text-[#0b1530] lg:text-[46px]"
        >
          What Serverlys is used for
        </h2>
        <ul className="mt-8 border-t border-black/[0.1]">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.title} className="border-b border-black/[0.1]">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`used-${i}`}
                    onClick={() => setOpen(i)}
                    className="flex w-full items-center justify-between py-5 text-left text-[19px] text-[#0b1530] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {it.title}
                    <span
                      aria-hidden="true"
                      className="text-[22px] leading-none text-[#5b6472]"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div id={`used-${i}`} hidden={!isOpen} className="pb-6">
                  <p className="text-[15px] leading-[1.65] text-[#3c4350]">{it.body}</p>
                  <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14px] font-semibold">
                    {it.links.map(([label, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="text-primary hover:text-primary-hover"
                      >
                        {label} →
                      </Link>
                    ))}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ── History rail with prev/next arrows ─────────────────────────────────── */

export function HistoryRail({
  items,
}: {
  items: readonly { year: string; body: string }[];
}) {
  const rail = useRef<HTMLOListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (el)
      el.scrollBy({
        left: dir * Math.min(el.clientWidth * 0.8, 520),
        behavior: "smooth",
      });
  };
  const btn =
    "flex size-10 items-center justify-center rounded-full bg-[#f1f2f5] text-[#0b1530] transition-colors hover:bg-brand-50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <h2
          id="about-history-heading"
          className="text-[36px] leading-[1.15] font-normal tracking-[-0.025em] text-[#0b1530] lg:text-[46px]"
        >
          History and evolution
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scroll(-1)}
            className={btn}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scroll(1)}
            className={btn}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <ol
        ref={rail}
        className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it) => (
          <li
            key={it.year + it.body}
            className="w-[78%] shrink-0 snap-start rounded-2xl bg-[#f4f4f7] px-6 py-8 text-center sm:w-[300px]"
          >
            <p className="text-[34px] leading-none tracking-[-0.02em] text-[#0b1530]">
              {it.year}
            </p>
            <p className="mt-5 text-[15px] leading-[1.6] text-[#3c4350]">{it.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
