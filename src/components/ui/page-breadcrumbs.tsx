import { JsonLd } from "@/components/ui/json-ld";
import { breadcrumbGraph } from "@/lib/seo";

/**
 * The page's BreadcrumbList JSON-LD.
 *
 * HISTORY. 2026-09-11 visible crumbs were removed from the top of every page;
 * 2026-10-04 they came back as an Apple-style strip above the footer;
 * 2026-10-31 Edgar removed that strip site-wide ("Remove this from the
 * footer ... remove it from any pages as well").
 *
 * The structured data stays: it is what Google uses to show the
 * "serverlys.com › Hosting › …" path in results instead of a bare URL, and
 * it describes the page's real position in the site. If a visible trail is
 * ever wanted again, render it here from the same `trail` so the two cannot
 * disagree (see git history before 2026-10-31 for the strip).
 *
 * Keep it as the LAST child of the page's outermost element. Pass every
 * ancestor in order with the current page last.
 */
export function PageBreadcrumbs({
  trail,
}: {
  trail: ReadonlyArray<{ name: string; path: string }>;
}) {
  return <JsonLd data={breadcrumbGraph(trail)} />;
}
