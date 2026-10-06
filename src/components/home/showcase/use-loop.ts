"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Shared clock for the homepage's animated product mockups.
 *
 * `durations[i]` is how long step i holds before the next; after the last step
 * it loops to 0. The loop only runs while the mockup is on screen in a visible
 * tab, and never under prefers-reduced-motion — then `reduced` is true and the
 * caller renders its final, complete frame instead.
 *
 * Reduced motion and visibility are external state: subscribed to, never read
 * during render, so server and client agree on the first paint.
 */
export function useLoop(durations: readonly number[], root: RefObject<Element | null>) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    mq.addEventListener("change", sync);
    let inView = false;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      setVisible(inView && !document.hidden);
    });
    if (root.current) io.observe(root.current);
    // The observer does not re-fire when a tab comes back, so resume here.
    const onVis = () => setVisible(inView && !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const raf = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", sync);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [root]);

  const running = visible && !reduced;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(
      () => setStep((s) => (s + 1) % durations.length),
      durations[step],
    );
    return () => window.clearTimeout(t);
  }, [running, step, durations]);

  return { step, reduced };
}
