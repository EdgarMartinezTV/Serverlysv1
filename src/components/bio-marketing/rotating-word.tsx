"use client";

import { useEffect, useState } from "react";

/** The reference's cycling last word ("…trusted by musicians / creators / …"). */
export function RotatingWord({
  words,
  className,
}: {
  words: readonly string[];
  className?: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span
      className={`relative inline-grid justify-items-center ${className ?? ""}`}
      aria-live="polite"
    >
      {/* Every word occupies the same grid cell so the line never reflows. */}
      {words.map((w, n) => (
        <span
          key={w}
          aria-hidden={n !== i}
          className={`col-start-1 row-start-1 transition-all duration-500 ${n === i ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
