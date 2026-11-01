"use client";

import { useState } from "react";
import { t as tx } from "@/i18n/t";

/**
 * Pause / play for the hero's looping motion (WCAG 2.2.2: anything that moves
 * for more than five seconds needs a way to stop it). Stamps data-paused on the
 * element with id `targetId`; globals.css pauses every animation inside it.
 * Hidden for reduced-motion users, who get no motion in the first place.
 */
export function MotionToggle({ targetId }: { targetId: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-label={paused ? tx("Play animation") : tx("Pause animation")}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        const el = document.getElementById(targetId);
        if (el) {
          if (next) el.setAttribute("data-paused", "");
          else el.removeAttribute("data-paused");
        }
      }}
      className="inline-flex size-9 items-center justify-center rounded-full text-white/80 ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hidden"
    >
      {paused ? (
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
          <path d="M5 3.5v9l7.5-4.5L5 3.5Z" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
          <rect x="4" y="3.5" width="2.6" height="9" rx="0.8" fill="currentColor" />
          <rect x="9.4" y="3.5" width="2.6" height="9" rx="0.8" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
