import Link from "next/link";
import { cn } from "@/lib/utils";

export type OverlapLink = { label: string; href: string };

/**
 * The page's repeating unit: one wide rounded panel, product surface on one
 * side and the argument on the other.
 *
 * Four stage bands use it, so the alignment, radius and the way the media
 * bleeds to the panel edge are decided once. `mediaSide` alternates down the
 * page — two consecutive panels with media on the same side read as a list;
 * alternating them reads as a rhythm.
 *
 * `tone` selects the foreground set, and the two are not interchangeable:
 * fg-muted (ink-500) fails on the dark panel and fg-on-dark-muted (ink-400)
 * fails on the light one. Passing the wrong tone is a contrast bug, not a
 * styling preference, which is why the surface and the text tokens are chosen
 * together here rather than at each call site.
 *
 * The link list is a real <ul> of real links. The reference renders the same
 * thing as a set of divs with click handlers; those are invisible to a screen
 * reader's link list and unopenable in a new tab.
 */
export function OverlapCard({
  eyebrow,
  eyebrowSlot,
  title,
  body,
  links,
  media,
  footer,
  mediaSide = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  /**
   * Renders in the eyebrow's place. For a panel about a product with its own
   * brand, the mark belongs here — a wordmark set in our type is not that
   * product's logo. Takes precedence over `eyebrow`.
   */
  eyebrowSlot?: React.ReactNode;
  title: string;
  body: string;
  links?: readonly OverlapLink[];
  media: React.ReactNode;
  footer?: React.ReactNode;
  mediaSide?: "left" | "right";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "grid items-center gap-8 overflow-hidden rounded-2xl p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10",
        dark
          ? "bg-canvas-abyss shadow-e4"
          : "bg-canvas shadow-e2 ring-1 ring-inset ring-line-subtle",
        className,
      )}
    >
      <div className={cn("min-w-0", mediaSide === "right" && "lg:order-2")}>{media}</div>

      <div className={cn("min-w-0", mediaSide === "right" && "lg:order-1")}>
        {eyebrowSlot ??
          (eyebrow && (
            <span
              className={cn(
                "font-mono text-caption uppercase",
                dark ? "text-primary-on-dark" : "text-primary",
              )}
            >
              {eyebrow}
            </span>
          ))}

        <h3 className={cn("mt-3 text-h2", dark ? "text-white" : "text-fg")}>{title}</h3>

        <p
          className={cn(
            "mt-4 text-body-lg",
            dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
          )}
        >
          {body}
        </p>

        {links && links.length > 0 && (
          <ul
            className={cn(
              "mt-7 divide-y",
              dark ? "divide-line-on-dark" : "divide-line-subtle",
            )}
          >
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "group/row flex items-center justify-between gap-4 py-3 text-body transition-colors duration-fast ease-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                    dark
                      ? "text-fg-on-dark hover:text-primary-on-dark focus-visible:outline-primary-on-dark"
                      : "text-fg hover:text-primary focus-visible:outline-primary",
                  )}
                >
                  {link.label}
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 transition-transform duration-fast ease-hover group-hover/row:translate-x-1"
                  >
                    <path
                      d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {footer && <div className="mt-7">{footer}</div>}
      </div>
    </div>
  );
}
