"use client";

import { announcement } from "@/data/navigation";

export const ANNOUNCEMENT_KEY = `serverlys.announcement.${announcement.version}`;

/**
 * Dismiss control for the announcement bar.
 *
 * Sets the dataset attribute the CSS rule keys off, so the bar disappears
 * immediately, then persists the choice. Storage is wrapped because Safari
 * private mode throws on localStorage writes — a failed write must not break
 * the click.
 */
export function DismissAnnouncement() {
  return (
    <button
      type="button"
      aria-label="Dismiss announcement"
      onClick={() => {
        document.documentElement.dataset.announcement = "dismissed";
        try {
          window.localStorage.setItem(ANNOUNCEMENT_KEY, "dismissed");
        } catch {
          /* private mode — the bar still closes for this session */
        }
      }}
      className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-3"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
        <path
          d="m4 4 8 8M12 4l-8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
