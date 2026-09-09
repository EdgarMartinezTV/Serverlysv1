import Link from "next/link";
import type { MegaItem } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { NavIcon, ArrowUpRight } from "./nav-icons";
import { cn } from "@/lib/utils";

/**
 * One mega-menu entry: icon, title, optional badge, description.
 *
 * Renders as plain text — not a link — when the destination has no page yet
 * and no honest interim target. Linking every page of the site to a 404 wastes
 * crawl budget and sends people nowhere; `resolveNavTarget` owns that decision.
 */
const BADGE_TONE = {
  brand: "bg-primary/20 text-primary-on-dark ring-primary/30",
  success: "bg-success-fill/15 text-success-fill ring-success-fill/25",
  warning: "bg-warning-fill/15 text-warning-fill ring-warning-fill/25",
  neutral: "bg-white/10 text-fg-on-dark-secondary ring-white/15",
} as const;

export function MegaMenuItem({
  item,
  onNavigate,
}: {
  item: MegaItem;
  onNavigate: () => void;
}) {
  const target = resolveNavTarget(item.href);
  const interactive = item.external || target.mode === "link";

  const body = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 shrink-0 transition-colors duration-fast",
          interactive
            ? "text-fg-on-dark-muted group-hover/item:text-primary-on-dark"
            : "text-fg-on-dark-muted/60",
        )}
      >
        <NavIcon name={item.icon} className="h-[1.125rem] w-[1.125rem]" />
      </span>

      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={cn(
              "text-small font-semibold transition-colors duration-fast",
              interactive ? "text-white" : "text-fg-on-dark-secondary",
            )}
          >
            {item.label}
          </span>
          {item.badge && (
            <span
              className={cn(
                "whitespace-nowrap rounded-full px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase ring-1 ring-inset",
                BADGE_TONE[item.badge.tone],
              )}
            >
              {item.badge.text}
            </span>
          )}
          {item.external && (
            <span aria-hidden="true" className="text-fg-on-dark-muted">
              <ArrowUpRight className="h-3 w-3" />
            </span>
          )}
        </span>
        <span className="mt-1 block text-small leading-snug text-fg-on-dark-muted">
          {item.description}
        </span>
      </span>
    </>
  );

  const classes =
    "group/item flex gap-3 rounded-xl px-2.5 py-2.5 transition-colors duration-fast " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  if (!interactive) {
    return <span className={cn(classes, "cursor-default")}>{body}</span>;
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={cn(classes, "hover:bg-white/[0.05]")}
      >
        {body}
      </a>
    );
  }

  return (
    <Link
      href={target.href}
      onClick={onNavigate}
      className={cn(classes, "hover:bg-white/[0.05]")}
    >
      {body}
    </Link>
  );
}
