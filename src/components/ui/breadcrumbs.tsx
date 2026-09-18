/**
 * Breadcrumb trail — REMOVED FROM EVERY PAGE (2026-09-11, on request).
 *
 * This renders nothing. The component and its props are kept rather than
 * deleted because 37 call sites pass a `trail` (16 directly, 21 through
 * <ProductHero breadcrumb={…}>), and those trails are real page-hierarchy
 * data worth keeping in the source. Gutting the one renderer removes the
 * visible "Home / Hosting" from all of them at once and makes restoring it a
 * single-file change; excising the prop from 37 files would be a large diff
 * for the same visual result and a much harder revert.
 *
 * The previous implementation was a <nav aria-label="Breadcrumb"> wrapping an
 * <ol>, with the current page last, marked `aria-current="page"` and not
 * linked, and decorative separators hidden from assistive tech. Restore that
 * markup here if the trail comes back — see git history.
 *
 * ⚠ This does NOT touch the BreadcrumbList JSON-LD emitted by
 * `breadcrumbGraph()` in lib/seo.ts. That is invisible on the page and is what
 * Google uses to draw the breadcrumb path in a search result, so it stays. If
 * you want the trail gone from search results too, that is a separate change
 * in lib/seo.ts and every page's <JsonLd> block.
 */
type BreadcrumbsProps = {
  /** Every ancestor, in order. The final entry is the current page. */
  trail: ReadonlyArray<{ name: string; href?: string }>;
  tone?: "light" | "dark";
  className?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Breadcrumbs(props: BreadcrumbsProps) {
  return null;
}
