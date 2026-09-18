"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Horizontal card rail with scroll snapping.
 *
 * A real scroll container, not a transform carousel. That means it already
 * works with a trackpad, a touch swipe, a scrollbar drag, shift+wheel and the
 * arrow keys once a card is focused — the arrow buttons are an addition for
 * mouse users, not the only way through. A transform carousel would have had to
 * reimplement every one of those, and would trap keyboard users on card one.
 *
 * Overflowing cards are NOT hidden from assistive tech. They are in the DOM,
 * focusable, and reachable by tabbing, which scrolls them into view for free.
 *
 * `aria-hidden` on the buttons' wrapper would be wrong, so the buttons carry
 * real labels and go `disabled` at each end rather than silently doing nothing.
 */
export function CardRail({
  label,
  children,
  className,
  tone = "light",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  /**
   * `on-dark` swaps the arrows to the reversed outline. The default `outline`
   * is brand-on-white — on a dark band it is a near-invisible blue ring on
   * near-black. This is a token choice, not a style preference.
   */
  tone?: "light" | "on-dark";
}) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const measure = useCallback(() => {
    const node = track.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setAtStart(node.scrollLeft <= 2);
    // 2px of slack: sub-pixel layout means scrollLeft rarely lands on `max`.
    setAtEnd(node.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    measure();
    const node = track.current;
    if (!node) return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure]);

  const page = (direction: 1 | -1) => {
    const node = track.current;
    if (!node) return;
    // One viewport-width short of a full page, so a card stays on screen as an
    // anchor rather than the whole set being replaced.
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrowVariant = tone === "on-dark" ? "inverseOutline" : "outline";

  return (
    <div className={cn("relative", className)}>
      <div className="mb-4 flex justify-end gap-2">
        <IconButton
          label={`Scroll ${label} left`}
          variant={arrowVariant}
          disabled={atStart}
          onClick={() => page(-1)}
        >
          <Chevron direction="left" />
        </IconButton>
        <IconButton
          label={`Scroll ${label} right`}
          variant={arrowVariant}
          disabled={atEnd}
          onClick={() => page(1)}
        >
          <Chevron direction="right" />
        </IconButton>
      </div>

      <ul
        ref={track}
        onScroll={measure}
        aria-label={label}
        /* scroll-pl-* MUST match the px-* gutter. Without it, snap-mandatory
           aligns the first card's left edge to the CONTAINER's left edge and
           the browser silently parks the track at scrollLeft = gutter width —
           so the rail loads already scrolled, the first card sits flush to the
           viewport edge, and the "scroll left" arrow is enabled on a rail that
           is at its start. Caught by test-home.mjs asserting the arrow is
           disabled on load. */
        className="-mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-pl-8 sm:px-8 lg:-mx-10 lg:scroll-pl-10 lg:px-10"
      >
        {children}
      </ul>
    </div>
  );
}

/** A rail item. Fixed basis so the snap points are even at every breakpoint. */
export function CardRailItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="w-[min(20rem,78vw)] shrink-0 snap-start sm:w-80">{children}</li>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <path
        d={direction === "left" ? "M10 3 5 8l5 5" : "m6 3 5 5-5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
