import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Breadcrumb trail.
 *
 * A real <nav aria-label="Breadcrumb"> with an ordered list — the order is
 * meaningful, so <ol> is correct. The current page is the last item, marked
 * `aria-current="page"` and NOT a link: linking a page to itself is noise for
 * everyone and a dead target for keyboard users.
 *
 * Separators are decorative and hidden from assistive tech, which would
 * otherwise announce a slash between every crumb.
 */
export function Breadcrumbs({
  trail,
  tone = "light",
  className,
}: {
  /** Every ancestor, in order. The final entry is the current page. */
  trail: ReadonlyArray<{ name: string; href?: string }>;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.name} className="flex items-center gap-2">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className={cn(
                    "rounded-sm text-small transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                    tone === "dark"
                      ? "text-fg-on-dark-muted hover:text-white focus-visible:outline-white"
                      : "text-fg-muted hover:text-fg focus-visible:outline-primary",
                  )}
                >
                  {crumb.name}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "text-small",
                    tone === "dark" ? "text-fg-on-dark-secondary" : "text-fg-secondary",
                  )}
                >
                  {crumb.name}
                </span>
              )}
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "select-none text-small",
                    tone === "dark" ? "text-fg-on-dark-muted" : "text-fg-muted",
                  )}
                >
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
