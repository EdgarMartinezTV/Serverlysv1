"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Scroll reveal.
 *
 * A CALLBACK ref rather than useRef: this component is polymorphic over its
 * element (`div`, `section`, `li`, `article`), and a single RefObject cannot be
 * typed across that union. The callback also lets the observer attach the
 * moment the node exists, with no effect and no extra render.
 *
 * The visual work lives in CSS (`[data-reveal]` in globals.css) inside a
 * `prefers-reduced-motion: no-preference` block. That ordering matters: under
 * reduced motion the element has no hidden initial state at all, so content can
 * never be stranded invisible if the observer never fires — with JS disabled,
 * in a crawler, or if hydration fails.
 *
 * Observers disconnect after firing; reveals are one-shot.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  /** Stagger in ms. Keep under ~240 or a grid feels sluggish to scan. */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  className?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const attach = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      if (!node || revealed) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setRevealed(true);
              observerRef.current?.disconnect();
            }
          }
        },
        // Fire just before the element is fully in view so the motion has
        // resolved by the time it is being read.
        { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
      );
      observerRef.current.observe(node);
    },
    [revealed],
  );

  const style = delay
    ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
    : undefined;

  const props = {
    ref: attach,
    "data-reveal": "",
    "data-revealed": revealed ? "true" : undefined,
    style,
    className,
  };

  if (Tag === "li") return <li {...props}>{children}</li>;
  if (Tag === "section") return <section {...props}>{children}</section>;
  if (Tag === "article") return <article {...props}>{children}</article>;
  return <div {...props}>{children}</div>;
}
