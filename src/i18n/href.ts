import { isSpanish } from "./t";
import { ES_PATHS, esPath } from "./paths";
import { WHMCS_PATH } from "@/lib/analytics/attribution";
import { company } from "@/data/company";
import { publicEnv } from "@/lib/env";

/**
 * lh(): localise a link target. On English pages it returns its argument
 * untouched (English HTML stays byte-identical). On /es pages:
 *   - a site path with a Spanish twin → its /es twin ("/hosting" → "/es/hosting")
 *   - a WHMCS path (cart, client area…) → same URL + language=spanish, which
 *     WHMCS stores in the session, so checkout continues in Spanish
 * Anything else (anchors, external sites, untranslated pages) is unchanged.
 */
export function lh<T>(href: T): T {
  if (typeof href !== "string" || !isSpanish()) return href;
  return localizeHref(href) as T;
}

const ORIGINS = new Set([company.url, publicEnv.billingOrigin].map((o) => o.replace(/\/+$/, "")));

export function localizeHref(href: string): string {
  let origin = "";
  let rest = href;
  if (/^https?:\/\//.test(href)) {
    const m = href.match(/^(https?:\/\/[^/?#]+)(.*)$/);
    if (!m || !ORIGINS.has(m[1])) return href;
    origin = m[1];
    rest = m[2] || "/";
  } else if (!href.startsWith("/") || href.startsWith("//")) {
    return href;
  }
  const cut = rest.search(/[?#]/);
  const path = cut === -1 ? rest : rest.slice(0, cut);
  const tail = cut === -1 ? "" : rest.slice(cut);
  if (WHMCS_PATH.test(path)) {
    if (/[?&]language=/.test(tail)) return href;
    const hash = tail.indexOf("#");
    const query = hash === -1 ? tail : tail.slice(0, hash);
    const frag = hash === -1 ? "" : tail.slice(hash);
    return `${origin}${path}${query ? `${query}&` : "?"}language=spanish${frag}`;
  }
  const clean = path.length > 1 ? path.replace(/\/+$/, "") : path;
  if (!origin && ES_PATHS.has(clean)) return `${esPath(clean)}${tail}`;
  return href;
}
