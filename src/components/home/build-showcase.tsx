"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The Build-stage visual: a deck of real-looking customer sites with a
 * request being typed into a prompt bar over the front one. Every few seconds
 * the front site goes to the back of the deck and the next request types out.
 *
 * Built in code rather than as a video: sharp at any density, a few KB of JS
 * instead of megabytes, and the text stays text.
 *
 * Content rules:
 *  · The requests are things Serverlys actually does — free migration and
 *    building sites (Sera files both). Nothing here claims an AI builder.
 *  · Photos are products and places only (public/mock/CREDITS.md); no people,
 *    no logos.
 *
 * Accessibility:
 *  · The moving picture is decoration (aria-hidden); the figure carries one
 *    sentence describing it.
 *  · It moves for longer than five seconds, so it has a real pause control
 *    (WCAG 2.2.2), and it pauses itself while off-screen or in a hidden tab.
 *  · prefers-reduced-motion: no cycling and no typing — the first site with
 *    its request shown whole.
 */

type Site = {
  key: string;
  image: string;
  /** Where the subject is, so the crop keeps it in frame. */
  focus: string;
  brand: string;
  links: [string, string];
  accent: { label: string; className: string };
  prompt: string;
  hero: React.ReactNode;
  /** Legibility wash over the photo, matched to where the type sits. */
  wash: string;
};

const SITES: readonly Site[] = [
  {
    key: "furniture",
    image: "/mock/site-furniture.jpg",
    focus: "50% 70%",
    brand: "harbor goods",
    links: ["Shop", "Journal"],
    accent: { label: "Cart (2)", className: "bg-[#e7efe9] text-[#1f4d3a]" },
    prompt: "Move my WooCommerce store to Serverlys without any downtime.",
    wash: "bg-gradient-to-b from-white/10 via-transparent to-transparent",
    hero: (
      <>
        {/* Headline on the wall above the sofa; offer on the floor below it. */}
        <p className="absolute left-[6%] top-[19%] font-display text-[6.2cqw] font-semibold leading-[0.95] tracking-[-0.04em] text-[#1d2a24]">
          Sit down. Stay a while.
        </p>
        <p className="absolute left-[6%] top-[29%] text-[1.9cqw] text-[#1d2a24]/70">
          The Marlow sofa · velvet, six colours
        </p>
        <div className="absolute bottom-[19%] left-[6%] flex items-center gap-[1.6cqw]">
          <span className="rounded-full bg-[#1f4d3a] px-[2.4cqw] py-[0.9cqw] text-[1.7cqw] font-semibold text-white">
            Shop the collection
          </span>
          <span className="rounded-full bg-white/85 px-[2.4cqw] py-[0.9cqw] text-[1.7cqw] font-semibold text-[#1d2a24]">
            Free delivery
          </span>
        </div>
      </>
    ),
  },
  {
    key: "studio",
    image: "/mock/site-studio.jpg",
    focus: "50% 45%",
    brand: "northlight.studio",
    links: ["Projects", "Studio"],
    accent: { label: "Contact", className: "bg-[#efe9df] text-[#5b4630]" },
    prompt: "Build a portfolio site for my architecture studio.",
    wash: "bg-gradient-to-t from-black/55 via-black/10 to-transparent",
    hero: (
      <div className="absolute bottom-[19%] left-[6%] max-w-[70%] text-white">
        <p className="text-[1.8cqw] font-medium uppercase tracking-[0.18em] text-white/80">
          Residential · 2026
        </p>
        <p className="mt-[1.2cqw] font-display text-[7.6cqw] font-medium leading-[0.98] tracking-[-0.035em]">
          Houses that hold
          <br />
          the evening light.
        </p>
      </div>
    ),
  },
  {
    key: "cafe",
    image: "/mock/site-cafe.jpg",
    focus: "45% 50%",
    brand: "ember & bean",
    links: ["Menu", "Visit"],
    accent: { label: "Order ahead", className: "bg-[#f6e7da] text-[#7a3e17]" },
    prompt: "Set up my café's site with online ordering and a fast checkout.",
    wash: "bg-gradient-to-r from-black/60 via-black/25 to-transparent",
    hero: (
      <div className="absolute left-[6%] top-[22%] max-w-[72%] text-white">
        <p className="font-display text-[8.8cqw] font-semibold italic leading-[0.92] tracking-[-0.04em]">
          Slow coffee,
          <br />
          fast mornings.
        </p>
        <p className="mt-[2cqw] text-[1.9cqw] text-white/80">Open 7am · Roasted in-house</p>
        <span className="mt-[2cqw] inline-block rounded-full bg-[#f2c49b] px-[2.4cqw] py-[0.9cqw] text-[1.7cqw] font-semibold text-[#3b1d08]">
          See the menu
        </span>
      </div>
    ),
  },
];

/** Deck positions: front, middle, back. */
const POSITIONS = [
  "z-30 translate-y-0 scale-100",
  "z-20 -translate-y-[6%] scale-[0.94]",
  "z-10 -translate-y-[11.5%] scale-[0.88]",
] as const;
const DIM = ["opacity-0", "opacity-100 bg-black/15", "opacity-100 bg-black/35"] as const;

const TYPE_MS = 34;
const HOLD_MS = 2600;

export function BuildShowcase() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLElement>(null);

  // Reduced motion and on-screen state are external — subscribe, never read
  // during render (the server cannot know either).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    mq.addEventListener("change", sync);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden));
    if (root.current) io.observe(root.current);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    // First reading arrives through the same callbacks on the next frame.
    const raf = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", sync);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const prompt = SITES[active].prompt;
  const running = !paused && visible && !reduced;
  const shown = reduced ? prompt.length : typed;

  useEffect(() => {
    if (!running) return;
    if (typed < prompt.length) {
      const t = window.setTimeout(() => setTyped((n) => n + 1), TYPE_MS);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setActive((a) => (a + 1) % SITES.length);
      setTyped(0);
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [running, typed, prompt.length]);

  return (
    <figure ref={root} className="relative mx-auto mb-10 w-full max-w-[680px] sm:mb-0">
      <figcaption className="sr-only">
        Example sites hosted on Serverlys — a furniture store, an architecture studio and a café —
        with the request that started each one.
      </figcaption>

      {/* Bottom padding is less than the prompt bar's height, so the bar
          overlaps the front card's lower edge by ~30px (phone) / ~55px. */}
      <div aria-hidden="true" className="relative pb-[58px] pt-[8%] sm:pb-[66px]">
        {/* The deck. The front card's box sets the height; the others stack behind it. */}
        <div className="relative aspect-[16/10]">
          {SITES.map((site, i) => {
            const pos = (i - active + SITES.length) % SITES.length;
            return (
              <div
                key={site.key}
                className={cn(
                  "@container absolute inset-0 origin-top overflow-hidden rounded-[18px] bg-canvas-inset",
                  "shadow-[0_24px_60px_-28px_rgb(15_23_42/0.45),0_0_0_1px_rgb(15_23_42/0.06)]",
                  "transition-[transform,box-shadow] duration-[800ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] motion-reduce:transition-none",
                  POSITIONS[pos],
                )}
              >
                <Image
                  src={site.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 680px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: site.focus }}
                />
                <div className={cn("absolute inset-0", site.wash)} />

                {/* Site navigation */}
                <div className="absolute inset-x-[2.6%] top-[3.6%] flex items-center justify-between rounded-[1.6cqw] bg-white/95 px-[3cqw] py-[1.5cqw] shadow-[0_1px_2px_rgb(15_23_42/0.08)]">
                  <span className="font-display text-[2.3cqw] font-semibold tracking-[-0.02em] text-[#141414]">
                    {site.brand}
                  </span>
                  <span className="flex items-center gap-[2.6cqw] text-[1.75cqw] font-medium text-[#3a3a3a]">
                    <span>{site.links[0]}</span>
                    <span>{site.links[1]}</span>
                    <span className={cn("rounded-[1cqw] px-[1.8cqw] py-[0.7cqw] font-semibold", site.accent.className)}>
                      {site.accent.label}
                    </span>
                  </span>
                </div>

                {site.hero}

                {/* Depth: cards further back read darker. */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 transition-opacity duration-[800ms] motion-reduce:transition-none",
                    DIM[pos],
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* The request, overlapping the front card's lower edge. */}
        <div className="absolute inset-x-[3%] bottom-0 z-40 rounded-[22px] bg-gradient-to-r from-[#00c46a] via-primary to-[#7c5cff] p-[2px] shadow-[0_18px_40px_-20px_rgb(0_0_255/0.45)]">
          <div className="flex items-center gap-4 rounded-[20px] bg-white py-3 pl-5 pr-3 sm:py-4 sm:pl-7 sm:pr-4">
            <p className="min-h-[2lh] flex-1 font-display text-[15px] leading-snug tracking-[-0.01em] text-fg sm:text-[20px]">
              {prompt.slice(0, shown)}
              {running && shown < prompt.length && (
                <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-pulse bg-primary" />
              )}
            </p>
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 sm:size-[52px]",
                shown >= prompt.length ? "bg-primary text-white" : "bg-brand-100 text-primary",
              )}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play the example sites animation" : "Pause the example sites animation"}
          className="absolute -bottom-10 right-2 flex size-8 sm:-bottom-2 sm:-right-3 items-center justify-center rounded-full bg-canvas-inset text-fg-secondary transition-colors duration-fast hover:bg-line hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {paused ? (
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              <path d="M5 3.5v9l7.5-4.5L5 3.5Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              <rect x="4" y="3.5" width="2.6" height="9" rx="0.8" />
              <rect x="9.4" y="3.5" width="2.6" height="9" rx="0.8" />
            </svg>
          )}
        </button>
      )}
    </figure>
  );
}
