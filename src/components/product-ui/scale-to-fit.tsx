"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shrinks its content uniformly when the column is narrower than the width
 * the content was designed at — the way a photo of a device shrinks, rather
 * than the device re-flowing into a shape no device has (a laptop with a
 * portrait screen).
 *
 * At or above `designWidth` it does nothing: the content lays out at 100%.
 * Below it, the content is laid out at exactly `designWidth` and scaled down,
 * and the wrapper takes the scaled height so the page flows around it.
 * Transforms keep hit-testing, so anything interactive inside still works.
 *
 * Measured with ResizeObserver only (it reports on observe), so no state is
 * set synchronously in an effect.
 */
export function ScaleToFit({
  designWidth,
  children,
  className,
}: {
  designWidth: number;
  children: React.ReactNode;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(null);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const observer = new ResizeObserver(() => {
      const scale = Math.min(1, o.clientWidth / designWidth);
      setFit(scale < 1 ? { scale, height: i.offsetHeight * scale } : null);
    });
    observer.observe(o);
    observer.observe(i);
    return () => observer.disconnect();
  }, [designWidth]);

  return (
    <div ref={outer} className={className} style={fit ? { height: fit.height } : undefined}>
      <div
        ref={inner}
        style={
          fit
            ? { width: designWidth, transform: `scale(${fit.scale})`, transformOrigin: "top left" }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
