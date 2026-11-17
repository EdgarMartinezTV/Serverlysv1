/**
 * How a navigation entry should render — the CLIENT-SAFE half of the route
 * registry.
 *
 * Why this is its own file: `resolveNavTarget` is called by the header, the
 * mobile nav and other client components. It used to live in `routes.ts`,
 * which imports the TLD catalog and the full EN+ES copy of every industry
 * page, so importing it from a client component shipped ~280KB of route data
 * to every visitor on every page. This module imports nothing.
 *
 * `routes.ts` remains the source of truth: it checks at load (build, sitemap,
 * every server render) that NAV_OVERRIDES matches its unbuilt routes, and
 * throws if they drift. When you mark a route `built: false`, add it here.
 *
 * `link`   → a real <a>/<Link> to `href`
 * `text`   → not a link: the page does not exist and has no honest interim
 *            destination, and linking to a 404 wastes crawl budget on every
 *            page of the site while sending visitors nowhere.
 */

/**
 * Every route in routes.ts with `built: false`, mapped to its `interim`
 * destination, or to null when it has none (rendered as text).
 */
export const NAV_OVERRIDES: Readonly<Record<string, string | null>> = {};

export function resolveNavTarget(path: string): {
  mode: "link" | "text";
  href: string;
} {
  // External URLs and in-page anchors are never registry-managed.
  if (/^https?:\/\//.test(path) || path.startsWith("#")) {
    return { mode: "link", href: path };
  }
  // Unknown paths are assumed real — the registry describes the site, it does
  // not gate it, and a missing entry should not silently break a link.
  if (!Object.prototype.hasOwnProperty.call(NAV_OVERRIDES, path)) {
    return { mode: "link", href: path };
  }
  const interim = NAV_OVERRIDES[path];
  if (interim) return { mode: "link", href: interim };
  return { mode: "text", href: path };
}
