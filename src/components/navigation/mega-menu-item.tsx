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
/* Soft sentence-case pills (2026-10-03). The brand/success tones are a FILL
   with white text rather than tinted text, which is what kept "Live" reading
   as a label instead of a status light. */
const BADGE_TONE = {
  brand: "bg-primary/45 text-white ring-primary/50",
  success: "bg-success-fill/25 text-white ring-success-fill/35",
  warning: "bg-warning-fill/20 text-white ring-warning-fill/30",
  neutral: "bg-white/10 text-white/80 ring-white/15",
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
            ? "text-white/80 group-hover/item:text-white"
            : "text-white/40",
        )}
      >
        <NavIcon name={item.icon} className="h-5 w-5" />
      </span>

      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={cn(
              "text-body font-semibold leading-6 transition-colors duration-fast",
              interactive ? "text-white" : "text-fg-on-dark-secondary",
            )}
          >
            {item.label}
          </span>
          {item.badge && (
            <span
              className={cn(
                // 12px / 600 / 16px — the target's badge is the same size as its
                // group eyebrow. Ours was 9px, which read as a footnote next to
                // a 14px title rather than a label.
                "whitespace-nowrap rounded-md px-2 py-0.5 text-micro font-semibold leading-4 ring-1 ring-inset",
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
        <span className="mt-1 block text-small leading-[1.45] text-white/70">
          {item.description}
        </span>
      </span>
    </>
  );

  /* -m-2 p-2 is the target's exact trick: the hover background extends 8px
     past the text on every side, so the GRID gap (24px row / 40px column) is
     the real gap between two items' text, not the gap between two hover
     rectangles. Dropping the negative margin makes the grid look twice as
     loose as the original.

     `flex-1 min-w-0` is what makes it the target's SIZE. Without it the <a> is
     a shrink-to-fit flex item inside its <li>, so every row was only as wide as
     its own text — measured at 292/321/339/344px against a 353.5px track, a
     ragged right edge and a hover rectangle that stopped short. With it the
     margin box fills the track and the border box lands at 369.5px, matching
     the target's uniform 368.5px. It is also why descriptions now wrap across
     the full column instead of sitting on one short line. */
  const classes =
    "group/item -m-2.5 flex min-w-0 flex-1 gap-3.5 rounded-xl p-2.5 transition-colors duration-fast " +
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
        className={cn(classes, "hover:bg-white/[0.06]")}
      >
        {body}
      </a>
    );
  }

  return (
    <Link
      href={target.href}
      onClick={onNavigate}
      className={cn(classes, "hover:bg-white/[0.06]")}
    >
      {body}
    </Link>
  );
}
