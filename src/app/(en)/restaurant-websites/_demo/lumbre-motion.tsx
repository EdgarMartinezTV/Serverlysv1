"use client";

import { useEffect } from "react";

/**
 * The demo's one motion driver: renders nothing, runs one IntersectionObserver
 * for every `[data-reveal]` and one rAF-throttled scroll handler for every
 * `[data-parallax]` inside `[data-lumbre]`.
 *
 * One observer instead of a component per element lets the editorial sections
 * stay server components: they mark elements with attributes and ship no JS.
 * The CSS in globals.css does the animating; this only flips
 * `data-revealed` and writes `--py`.
 *
 * Reduced motion: reveals still flip (the CSS has no hidden state under
 * reduce), parallax never starts. Everything is torn down on unmount.
 */
export function LumbreMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-lumbre]");
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "true");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const layers = [...root.querySelectorAll<HTMLElement>("[data-parallax]")];
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of layers) {
        const box = (el.parentElement ?? el).getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) continue;
        // -1 when the frame's centre is a screen below centre, +1 a screen above.
        const progress = (vh / 2 - (box.top + box.height / 2)) / vh;
        el.style.setProperty("--py", `${(progress * Number(el.dataset.parallax || 0)).toFixed(1)}px`);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    if (!reduce && layers.length > 0) {
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
