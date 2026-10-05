import Link from "next/link";
import { JsonLd } from "@/components/ui/json-ld";
import { breadcrumbGraph } from "@/lib/seo";

/**
 * The page's breadcrumb — VISIBLE trail and BreadcrumbList JSON-LD from ONE
 * array, so the two cannot disagree.
 *
 * WHY IT SITS AT THE BOTTOM (decided 2026-10-04). Visible crumbs were removed
 * from the top of every page on 2026-09-11 on request; the JSON-LD stayed, so
 * 48 pages described a breadcrumb nobody could see — markup that does not
 * match visible content. Edgar chose this Apple-style strip: the last thing in
 * <main>, on the footer's own surface and gutters, so it reads as the footer's
 * first row and no hero changes.
 *
 * Render it as the LAST child of the page's outermost element. Pass every
 * ancestor in order with the current page last; the current page is not a
 * link and carries aria-current, per the APG breadcrumb pattern.
 */
export function PageBreadcrumbs({
  trail,
}: {
  trail: ReadonlyArray<{ name: string; path: string }>;
}) {
  return (
    <>
      <JsonLd data={breadcrumbGraph(trail)} />
      <div className="bg-[#f5f5f6] font-display">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto w-full max-w-mega border-b border-line px-5 py-4 sm:px-8 lg:px-20"
        >
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small">
            {trail.map((item, i) => {
              const current = i === trail.length - 1;
              return (
                <li key={item.path} className="flex items-center gap-2">
                  {i > 0 && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-3.5 w-3.5 text-fg-muted"
                    >
                      <path
                        d="m6 4 4 4-4 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {current ? (
                    <span aria-current="page" className="text-fg">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      href={item.path}
                      className="inline-flex min-h-6 items-center text-fg-secondary underline-offset-4 hover:text-fg hover:underline"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </>
  );
}
