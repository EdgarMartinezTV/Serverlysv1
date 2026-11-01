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
  return lookup(R.use(DictContext) as Dict | null, v) as T;
}
