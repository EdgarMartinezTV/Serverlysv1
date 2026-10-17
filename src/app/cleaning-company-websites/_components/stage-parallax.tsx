"use client";

import { useEffect } from "react";

/**
 * Depth for the hero showcase, without hydrating it: finds the stage by id and
 * writes --px/--py (pointer, fine pointers only) and --sy (scroll) on it. One
 * rAF per frame at most, nothing under reduced motion, cleaned up on unmount.
 */
export function StageParallax({ target }: { target: string }) {
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frame = 0;
    let px = 0;
    let py = 0;
    const flush = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const sy = Math.max(-1, Math.min(1, box.top / window.innerHeight));
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
      el.style.setProperty("--sy", sy.toFixed(3));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
      queue();
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", queue, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", queue);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target]);
  return null;
}
