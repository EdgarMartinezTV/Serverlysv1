"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { fillLux, type LuxCopy } from "./copy-lux";
import { trackDemo, useLumbre } from "./state";
import { CHAR, SOFT, display } from "./theme";
import { Eyebrow, Lines } from "./lumbre-ui";

/** Grid placement per photo: an uneven editorial rhythm on desktop, squares in pairs on a phone. */
const LAYOUT = [
  "lg:col-span-7 lg:row-span-2 aspect-[4/3] lg:aspect-auto",
  "lg:col-span-5 aspect-square lg:aspect-[4/3]",
  "lg:col-span-5 aspect-square lg:aspect-[4/3]",
  "lg:col-span-4 aspect-square lg:aspect-[3/4]",
  "lg:col-span-4 aspect-square lg:aspect-[3/4] lg:mt-16",
  "lg:col-span-4 aspect-square lg:aspect-[3/4]",
  "lg:col-span-5 aspect-square lg:aspect-[4/3]",
  "lg:col-span-7 aspect-[16/9]",
];

/**
 * H · Gallery with a lightbox. The lightbox is a native modal <dialog>: focus
 * is trapped and returns to the photo that opened it, Escape closes, the
 * arrow keys and a horizontal swipe move between photos.
 */
export function LumbreGallery({ lux }: { lux: LuxCopy }) {
  const { locale } = useLumbre();
  const g = lux.gallery;
  const items = g.items;
  const ref = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
  }, [index]);

  const open = (i: number) => {
    setIndex(i);
    trackDemo("gallery_open", locale);
  };
  const step = (delta: number) => setIndex((cur) => (cur === null ? cur : (cur + delta + items.length) % items.length));

  return (
    <section id="gallery" aria-labelledby="lumbre-gallery-heading" className="py-28 lg:py-40" style={{ background: SOFT, color: CHAR }}>
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>{g.label}</Eyebrow>
            <h2
              id="lumbre-gallery-heading"
              data-reveal="mask"
              className={cn(display.className, "mt-8 text-[clamp(48px,6vw,96px)] leading-[0.92] font-light tracking-[-0.02em] outline-none")}
            >
              <Lines lines={[g.title]} />
            </h2>
          </div>
        </div>
        <ul className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5">
          {items.map((item, i) => (
            <li key={item.src} data-reveal="image" style={{ "--reveal-delay": `${(i % 3) * 120}ms` } as React.CSSProperties} className={cn("relative overflow-hidden", i === 0 || i === 7 ? "col-span-2" : "col-span-1", LAYOUT[i])}>
              <button
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                type="button"
                onClick={() => open(i)}
                aria-label={fillLux(g.open, { alt: item.alt })}
                className="group absolute inset-0 block size-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#C8A97E]"
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes={i === 0 || i === 7 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 34vw, 50vw"}
                  className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-[1.05]"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-[#111411]/0 transition-colors duration-500 group-hover:bg-[#111411]/20" />
                <span
                  aria-hidden="true"
                  className="absolute right-4 bottom-4 flex size-10 scale-90 items-center justify-center rounded-full bg-[#FAF8F3]/90 text-[#111411] opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
                >
                  <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M8 3H3v5M12 17h5v-5M3 3l6 6M17 17l-6-6" />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={ref}
        aria-label={g.label}
        onClose={() => {
          const last = index;
          setIndex(null);
          if (last !== null) triggers.current[last]?.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-[#0b0d0b]/97 p-0 text-[#F4EFE6] backdrop:bg-black/80"
      >
        {index !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <p className="font-display text-[12px] tracking-[0.2em] text-[#9C9A90] uppercase tabular-nums" aria-live="polite">
                {fillLux(g.counter, { n: index + 1, total: items.length })}
              </p>
              <button
                type="button"
                autoFocus
                onClick={() => ref.current?.close()}
                aria-label={g.close}
                className="flex size-11 items-center justify-center rounded-full ring-1 ring-[#F4EFE6]/25 hover:bg-[#F4EFE6]/10 focus-visible:outline-2 focus-visible:outline-[#C8A97E]"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>
            </div>
            <figure className="relative mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col px-5 pb-6 sm:px-20">
              <div key={index} className="rw-fade relative min-h-0 flex-1">
                <Image src={items[index].src} alt={items[index].alt} fill sizes="100vw" className="object-contain" />
              </div>
              <figcaption className={cn(display.className, "mt-5 text-center text-[22px] italic")}>{items[index].alt}</figcaption>
              {(
                [
                  [-1, g.prev, "left-1 sm:left-5", "M12.5 4 6.5 10l6 6"],
                  [1, g.next, "right-1 sm:right-5", "m7.5 4 6 6-6 6"],
                ] as const
              ).map(([d, label, pos, path]) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => step(d)}
                  aria-label={label}
                  className={cn(
                    "absolute top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#111411]/60 ring-1 ring-[#F4EFE6]/20 backdrop-blur-sm hover:bg-[#111411] focus-visible:outline-2 focus-visible:outline-[#C8A97E]",
                    pos,
                  )}
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={path} />
                  </svg>
                </button>
              ))}
            </figure>
          </div>
        )}
      </dialog>
    </section>
  );
}
