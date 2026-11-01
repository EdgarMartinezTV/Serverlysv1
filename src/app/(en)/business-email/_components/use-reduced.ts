"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

const noop = () => () => {};

/**
 * prefers-reduced-motion, but only after hydration. motion's hook reads the
 * media query on the client's first render, which the server cannot know —
 * so a film that renders a different frame for reduced motion would not
 * match the server HTML. Server and hydration render say `false`; the very
 * next render applies the real preference.
 */
export function useReducedAfterMount(): boolean {
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const reduced = useReducedMotion();
  return mounted && !!reduced;
}
