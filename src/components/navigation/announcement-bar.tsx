import Link from "next/link";
import { announcement } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { DismissAnnouncement } from "./dismiss-announcement";

/**
 * Promotional bar above the header.
 *
 * It leads with the voice agent rather than a price. "Cloud hosting from
 * $7.95/mo" is the same sentence every host at the top of the results page is
 * running, so it reads as wallpaper; a phone that answers itself is the thing
 * competitors here do not have, and it is a claim you can go and hear.
 *
 * SURFACE: the Serverlys blue ramp, deep to bright, deliberately NOT the hero's
 * abyss. The bar used to share the hero's ground, which made it disappear into
 * the page on the homepage — the one page it most needs to be seen on.
 *
 * Every stop is checked against white text: brand-800 9.49:1, brand-700 7.58:1,
 * brand-600 5.41:1. ⚠ The ramp stops at brand-600. brand-500 (#227eff) is the
 * brand's signature blue and the obvious next stop, but white on it is 3.82:1
 * and fails AA — a brighter bar would be a less readable one.
 *
 * The waveform uses --color-accent-on-dark (cyan-400), the palette's designated
 * accent for dark surfaces, at 4.2:1 on brand-700. Written with the custom
 * property prefix on purpose: the token validator scans prose as well as
 * classes, and a bare "accent-…" preceded by a space parses as a Tailwind
 * accent utility and fails the build. The logo's green was the first
 * choice as a direct brand echo, but #14a06b lands at 1.6–2.8:1 on this blue
 * and simply disappeared.
 *
 * The waveform is five divs and a keyframe — no image, nothing on the critical
 * path, and it says "voice" faster than the sentence next to it does. Under
 * `prefers-reduced-motion` the bars hold their staggered heights and simply
 * stop moving, so the shape still reads.
 *
 * It scrolls away rather than sticking — a pinned promo eats vertical space on
 * phones and competes with the header.
 *
 * No-flash dismissal: a blocking script in the root layout stamps
 * data-announcement="dismissed" on <html> before first paint and CSS hides the
 * bar. Rendering then hiding after hydration would flash it on every load for
 * people who already closed it.
 */

/** Static heights first, so the waveform survives reduced motion. */
const BARS = [
  { height: "h-1.5", delay: "0ms" },
  { height: "h-3", delay: "140ms" },
  { height: "h-4", delay: "70ms" },
  { height: "h-2.5", delay: "210ms" },
  { height: "h-1.5", delay: "280ms" },
] as const;

export function AnnouncementBar() {
  if (!announcement.enabled) return null;

  return (
    <div
      data-announcement-bar=""
      className="relative bg-gradient-to-r from-brand-800 via-brand-700 to-primary text-fg-on-brand"
    >
      <div className="mx-auto flex w-full max-w-desktop items-center justify-center gap-x-3 px-12 py-2.5 sm:px-14">
        <span className="hidden shrink-0 items-center rounded-full bg-white/20 px-2 py-0.5 text-micro text-fg-on-brand ring-1 ring-inset ring-white/30 sm:inline-flex font-semibold">
          {announcement.badge}
        </span>

        <span
          aria-hidden="true"
          className="hidden shrink-0 items-end gap-[3px] sm:flex"
        >
          {BARS.map((bar) => (
            <span
              key={bar.delay}
              style={{ animationDelay: bar.delay }}
              className={`animate-voice-bar w-[3px] rounded-full bg-accent-on-dark ${bar.height}`}
            />
          ))}
        </span>

        <p className="text-center text-small">
          <span className="font-medium text-fg-on-brand">
            <span className="sm:hidden">{announcement.titleShort}</span>
            <span className="hidden sm:inline">{announcement.title}</span>
          </span>
          {/* An em dash, not a space. Without it the two clauses read as one
              run-on sentence: "...answers your phone CallFlow books the job". */}
          <span className="hidden text-fg-on-brand-muted md:inline">
            {" — "}
            {announcement.detail}
          </span>
          {/* Below md the detail clause is hidden, which used to drop the
              separator with it and butt the link straight onto the headline:
              "Your phone, answered by AI Hear it →". The separator is the
              link's, not the detail's, so it has to survive the detail. */}
          <span aria-hidden="true" className="px-1.5 text-fg-on-brand-muted">
            ·
          </span>
          <Link
            href={resolveNavTarget(announcement.href).href}
            className="inline-block whitespace-nowrap rounded-sm py-1 font-semibold text-fg-on-brand underline underline-offset-2 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="sm:hidden">{announcement.linkLabelShort}</span>
            <span className="hidden sm:inline">{announcement.linkLabel}</span>
            <span aria-hidden="true"> →</span>
          </Link>
        </p>
      </div>
      <DismissAnnouncement />
    </div>
  );
}
