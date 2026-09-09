import Link from "next/link";
import { announcement } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { lowestAnnualRate, formatPrice } from "@/data/pricing";
import { DismissAnnouncement } from "./dismiss-announcement";

/**
 * Promotional bar above the header.
 *
 * Server-rendered: the price comes from the pricing data, never a hard-coded
 * string, so it cannot drift from the plan cards.
 *
 * It scrolls away rather than sticking — a permanently pinned promo eats
 * vertical space on phones and competes with the header for attention.
 *
 * No-flash dismissal: a blocking script in the root layout stamps
 * data-announcement="dismissed" on <html> before first paint, and CSS hides
 * the bar. Rendering it and hiding it after hydration would flash the bar on
 * every page load for people who already dismissed it.
 */
export function AnnouncementBar() {
  if (!announcement.enabled) return null;

  return (
    <div
      data-announcement-bar=""
      /* Brand-coloured rather than dark: with a dark hero below, a dark bar
         above the white header banded dark → light → dark, which reads as
         noise. White on `primary` is 5.41:1. */
      className="relative bg-primary text-white"
    >
      <div className="mx-auto flex w-full max-w-desktop items-center justify-center gap-x-3 px-12 py-2.5 sm:px-14">
        <p className="text-center text-small">
          <span className="font-medium text-white">
            Cloud hosting from{" "}
            <span className="tabular">{formatPrice(lowestAnnualRate)}</span>/mo
          </span>
          <span className="hidden sm:inline">
            {" "}
            — free domain, free SSL and free migration included.
          </span>{" "}
          <Link
            href={resolveNavTarget(announcement.href).href}
            className="inline-block whitespace-nowrap py-1 font-semibold text-white underline underline-offset-2 transition-colors hover:text-brand-100"
          >
            {announcement.linkLabel}
            <span aria-hidden="true"> →</span>
          </Link>
        </p>
      </div>
      <DismissAnnouncement />
    </div>
  );
}
