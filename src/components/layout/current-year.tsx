"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * The current year, read in the browser.
 *
 * The footer is a server component on pages built ahead of time, so a year
 * computed there is the BUILD year and stays wrong from 1 January until the
 * next deploy. The server snapshot is that build-time year, which keeps
 * hydration matching; the client snapshot then corrects it.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  return useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => buildYear,
  );
}
