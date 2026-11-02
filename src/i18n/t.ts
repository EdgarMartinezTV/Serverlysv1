import * as React from "react";
import { DictContext } from "./context";
import { lookup } from "./lookup";

/**
 * t(): the site's translation call — one function for Server and browser components.
 *
 * ENGLISH IS THE SOURCE. Every argument is the English text itself; t() returns it
 * unchanged unless the page being rendered is a Spanish (/es) page, so English
 * output is byte-for-byte what it was before i18n. Non-strings (React nodes,
 * numbers, objects) always pass through, so t() can safely wrap any JSX child.
 *
 * WHERE THE SPANISH COMES FROM.
 *   Server Components — React's server build has no useState, which is how we know
 *     we are in the RSC layer. The dictionary lives in a per-request store (React
 *     cache — the pattern next-intl uses for static rendering) that /es layouts and
 *     pages fill via setLocale("es") from i18n/rsc.ts.
 *   Browser components — DictContext, which only the /es layout provides
 *     (i18n/es-provider.tsx); with no provider t() is a no-op.
 * The package.json "imports" + react-server condition was tried first (2026-11-01)
 * and Turbopack did not apply it, hence the runtime check.
 */
type Dict = Readonly<Record<string, string>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const R = React as any;
const IS_RSC = typeof R.useState !== "function";

export const rscStore: (() => { dict: Dict | null }) | null = IS_RSC ? R.cache(() => ({ dict: null })) : null;

export function t<T>(v: T): T {
  if (typeof v !== "string") return v;
  if (IS_RSC) return lookup(rscStore!().dict, v) as T;
  // use() is not bound by the rules of hooks (it may be called conditionally);
  // t() is only ever called while rendering.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return lookup(R.use(DictContext) as Dict | null, v) as T;
}

/** Whether the current render is a Spanish (/es) page — Server or browser component. */
export function isSpanish(): boolean {
  if (IS_RSC) return rscStore!().dict !== null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return R.use(DictContext) !== null;
}

/**
 * tc(): t() with a layout context. Looks up "<ctx>|<English>" first, so one place
 * can use shorter Spanish where the English-sized box has no room (e.g. footer
 * links that are full page titles elsewhere), then falls back to t().
 * English output is unchanged: with no dictionary it returns its argument.
 */
export function tc<T>(ctx: string, v: T): T {
  if (typeof v !== "string") return v;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dict = (IS_RSC ? rscStore!().dict : R.use(DictContext)) as Dict | null;
  const hit = dict?.[`${ctx}|${v.trim()}`];
  return hit === undefined ? t(v) : (hit as T);
}
