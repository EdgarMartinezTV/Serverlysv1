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
 *  · No pause control, by request (2026-10-05) — note this sits below WCAG
 *    2.2.2 for motion over five seconds. It stops itself while off-screen or
 *    in a hidden tab.
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
/** Cards further back are washed out toward the page, as in the reference. */
const WASH = ["opacity-0", "opacity-[0.15]", "opacity-[0.45]"] as const;

/*
 * One cycle, timed against the reference video (25 fps, ~4 s per site):
 *   type   ~45 characters a second
 *   hold   the finished request sits
 *   send   the send button presses
 *   clear  the text fades out of the bar
 *   switch the card at the BACK rises from below into the front slot; the
 *          others each step back one place; a copy fades out at the top
 *   settle a beat with the bar empty before the next request types
 */
type Phase = "type" | "hold" | "send" | "clear" | "switch" | "settle";
const TYPE_MS = 22;
const AFTER: Record<Exclude<Phase, "type">, number> = {
  hold: 1400,
  send: 260,
  clear: 170,
  switch: 520,
  settle: 380,
};
const EASE = "cubic-bezier(0.2,0.8,0.2,1)";

export function BuildShowcase() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<Phase>("type");
  const [cycle, setCycle] = useState(0);
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
  const running = visible && !reduced;
  const shown = reduced ? prompt.length : typed;

  useEffect(() => {
    if (!running) return;
    let next: () => void;
    let wait: number;
    if (phase === "type") {
      if (typed < prompt.length) {
        next = () => setTyped((n) => n + 1);
        wait = TYPE_MS;
      } else {
        next = () => setPhase("hold");
        wait = 0;
      }
    } else {
      wait = AFTER[phase];
      next = {
        hold: () => setPhase("send"),
        send: () => setPhase("clear"),
        clear: () => {
          // The BACK card comes forward, so the deck steps backwards.
          setActive((a) => (a - 1 + SITES.length) % SITES.length);
          setTyped(0);
          setCycle((c) => c + 1);
          setPhase("switch");
        },
        switch: () => setPhase("settle"),
        settle: () => setPhase("type"),
      }[phase];
    }
    const t = window.setTimeout(next, wait);
    return () => window.clearTimeout(t);
  }, [running, phase, typed, prompt.length]);

  const entering = running && phase === "switch";

  return (
    <figure ref={root} className="relative mx-auto w-full max-w-[680px]">
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
            const rising = entering && pos === 0;
            return (
              <SiteCard
                key={site.key}
                site={site}
                className={cn(
                  POSITIONS[pos],
                  // The rising card is animated, everything else transitions
                  // one slot back on the same curve and clock.
                  rising
                    ? "animate-[deckEnter_520ms_cubic-bezier(0.2,0.8,0.2,1)_both]"
                    : "transition-transform duration-[520ms] motion-reduce:transition-none",
                )}
                style={rising ? undefined : { transitionTimingFunction: EASE }}
                wash={WASH[pos]}
              />
            );
          })}
          {/* Where the rising card used to sit: a copy fading out at the back. */}
          {entering && (
            <SiteCard
              key={`ghost-${cycle}`}
              site={SITES[active]}
              className={cn(POSITIONS[2], "animate-[deckGhost_450ms_ease-out_both]")}
              wash={WASH[2]}
            />
          )}
        </div>

        {/* The request, overlapping the front card's lower edge. */}
        <div className="absolute inset-x-[3%] bottom-0 z-40 rounded-[22px] bg-gradient-to-r from-[#00c46a] via-primary to-[#7c5cff] p-[2px] shadow-[0_18px_40px_-20px_rgb(0_0_255/0.45)]">
          <div className="flex items-center gap-4 rounded-[20px] bg-white py-3 pl-5 pr-3 sm:py-4 sm:pl-7 sm:pr-4">
            <p
              className={cn(
                "min-h-[2lh] flex-1 font-display text-[15px] leading-snug tracking-[-0.01em] text-fg transition-opacity duration-150 sm:text-[20px]",
                running && phase === "clear" && "opacity-0",
              )}
            >
              {prompt.slice(0, shown)}
              {running && (phase === "type" || phase === "settle") && (
                <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-pulse bg-primary" />
              )}
            </p>
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl transition-[background-color,color,transform] duration-200 sm:size-[52px]",
                running && phase === "send"
                  ? "scale-95 bg-primary text-white"
                  : "bg-brand-100 text-primary",
              )}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

    </figure>
  );
}

function SiteCard({
  site,
  className,
  style,
  wash,
}: {
  site: Site;
  className?: string;
  style?: React.CSSProperties;
  wash: string;
}) {
  return (
    <div
      style={style}
      className={cn(
        "@container absolute inset-0 origin-top overflow-hidden rounded-[18px] bg-canvas-inset",
        "shadow-[0_24px_60px_-28px_rgb(15_23_42/0.45),0_0_0_1px_rgb(15_23_42/0.06)]",
        className,
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

      {/* Depth: cards further back wash out toward the page. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-white transition-opacity duration-[520ms] motion-reduce:transition-none",
          wash,
        )}
      />
    </div>
  );
}
