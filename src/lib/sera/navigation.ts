import { routeFor } from "@/data/routes";
import { NAVIGABLE, type PageNav, type SectionSpec } from "./navigation-map";

/**
 * Where Sera is allowed to take the visitor, and which part of the page to
 * land on.
 *
 * WHY A MAP RATHER THAN LETTING THE MODEL PICK A URL. A hallucinated path is a
 * 404 and a hallucinated `#anchor` is a silent no-op — the page loads, nothing
 * scrolls, and the visitor is left looking at a hero while Sera says "here are
 * the plans". Both failures look like the site is broken rather than like the
 * assistant guessed. So the model chooses from this list by name and the server
 * resolves it; anything outside the list is refused.
 *
 * ⚠ EVERY ANCHOR BELOW WAS READ OFF THE RENDERED HTML, not from a component or
 * from memory. `scripts/test-sera.mjs` re-checks them against the live pages on
 * every run, so a section that gets renamed or removed fails the suite instead
 * of quietly becoming a dead scroll.
 *
 * The inventory itself lives in `navigation-map.ts` — pure data, no imports —
 * so the test suite can load it in plain Node. This file is the logic.
 *
 * `routes.ts` is still the authority on whether a page EXISTS: `resolveTarget`
 * refuses any path that is not marked `built`, because the header links to
 * several pages that are not written yet and sending someone there would be a
 * 404 with Sera's name on it.
 */

export type NavTarget = {
  path: string;
  /** Element id to scroll to, without the "#". Empty when the page top. */
  section: string;
  /** "WordPress hosting — Plans and pricing", for the visitor-facing line. */
  label: string;
};

/**
 * Resolve a model-chosen page and section to something real, or null.
 *
 * Two independent checks, and both must pass: the path is in the map above, AND
 * `routes.ts` says a page is actually built there. The second is not redundant
 * — the map is maintained by hand and a page could be removed from the site
 * without anyone remembering this file exists.
 */
export function resolveTarget(path: unknown, section?: unknown): NavTarget | null {
  if (typeof path !== "string") return null;

  const page = NAVIGABLE.find((entry) => entry.path === path);
  if (!page) return null;
  if (!routeFor(page.path)?.built) return null;

  if (typeof section !== "string" || !section) {
    return { path: page.path, section: "", label: page.label };
  }

  const match = page.sections.find((s) => s.id === section);
  /*
   * An unknown section degrades to the top of the page rather than failing the
   * whole navigation. Landing on the right page at the wrong scroll position is
   * a small miss; refusing to move at all after saying "let me show you" is a
   * visible broken promise.
   */
  if (!match) return { path: page.path, section: "", label: page.label };

  return { path: page.path, section: match.id, label: `${page.label} — ${match.label}` };
}

/** Compact catalogue handed to the model, so it picks real ids. */
export function navigationCatalogue(): string {
  return NAVIGABLE.map(
    (page) => `${page.path} (${page.label}): ${page.sections.map((s) => s.id).join(", ")}`,
  ).join(" | ");
}

export { NAVIGABLE };
export type { PageNav, SectionSpec };
