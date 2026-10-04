/**
 * Sera's mark and the handful of icons the widget needs.
 *
 * Inline SVG, drawn here, for the same reason the rest of the site does it
 * (`components/navigation/nav-icons.tsx`): there is no icon library in this
 * project, six glyphs do not justify adding one, and inline paths cost nothing
 * on the critical path and cannot 404.
 *
 * THE MARK IS NOT A LOGO. It is a four-point spark on a ring — an assistant
 * glyph, distinct from the Serverlys wordmark, so that nothing in this feature
 * can be mistaken for the brand identity or start drifting into a second one.
 * `data/company.ts` records that the only Serverlys mark is
 * `images/logo/logo.webp`; this sits beside it, never in place of it.
 */

export function SeraMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.3" opacity="0.35" />
      <path
        d="M12 5.4c.55 3.1 1.85 4.55 5.05 5.1v.05c-3.2.55-4.5 1.95-5.05 5.05-.55-3.1-1.9-4.5-5.05-5.05v-.05c3.15-.55 4.5-2 5.05-5.1Z"
        fill="currentColor"
      />
      <circle cx="17.4" cy="17.4" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/** Launcher glyph — the mark inside its brand-blue disc. */
export function SeraAvatar({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-white ${className}`}
    >
      <SeraMark className="h-[62%] w-[62%]" />
    </span>
  );
}

const PATHS: Record<string, React.ReactNode> = {
  close: <path d="M6 6l12 12M18 6 6 18" />,
  minimise: <path d="M6 12h12" />,
  send: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  alert: <path d="M12 8v5m0 3.5v.01M10.3 3.9 2.6 17.1A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
  arrow: <path d="M7 17 17 7M9 7h8v8" />,
  refresh: <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8M21 4v4h-4M21 12a9 9 0 0 1-15.3 6.4L3 16M3 20v-4h4" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" />,
  arrowRight: <path d="M5 12h13M12 6l6 6-6 6" />,
  arrowUp: <path d="M12 19V6M6 12l6-6 6 6" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  /* Option-tile glyphs, matching the reference's set: a spark for the headline
     action, then lightning / magnifier / envelope across the three tiles. */
  spark: (
    <path
      d="M12 3.2c.7 3.9 2.3 5.7 6.3 6.4v.05c-4 .7-5.6 2.45-6.3 6.35-.7-3.9-2.35-5.65-6.3-6.35v-.05c3.95-.7 5.6-2.5 6.3-6.4Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  bolt: <path d="M13 2.6 5.2 13.4h5.4l-.6 8 7.8-10.8h-5.4l.6-8Z" />,
  search: <g><circle cx="10.8" cy="10.8" r="6.4" /><path d="M15.5 15.5 20.5 20.5" /></g>,
  mail: (
    <g>
      <rect x="2.9" y="5.1" width="18.2" height="13.8" rx="2.4" />
      <path d="m3.6 6.6 8.4 6 8.4-6" />
    </g>
  ),
  chevronDown: <path d="M6 9l6 6 6-6" />,
  /* Three dots. Filled rather than stroked — at 4px a stroked circle is mush. */
  /* The reference draws GIF as a labelled tile, not a glyph. */
  /* Square, not a circle-with-a-square. The stop control sits inside a button
     that is already round; a second ring around the glyph reads as a target
     inside a target. */
  stop: <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" stroke="none" />,
  /* 2026-10-03 panel upgrade */
  compose: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />,
  thumbUp: <path d="M7 10v11M15 5.9 14 10h5.6a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 18.2 21H7V10l4-8a2.5 2.5 0 0 1 4 3.9Z" />,
  thumbDown: <path d="M17 14V3M9 18.1 10 14H4.4a2 2 0 0 1-2-2.3l1.4-7A2 2 0 0 1 5.8 3H17v11l-4 8a2.5 2.5 0 0 1-4-3.9Z" />,
  copy: <path d="M9 9h11v11H9zM5 15H4V4h11v1" />,
  tag: <path d="M3 12V4h8l10 10-8 8L3 12Zm5-4h.01" />,
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />,
  wallet: <path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 0V6a2 2 0 0 1 2-2h11M16 13h.01" />,
  globe: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />,
};

export type SeraIconName = keyof typeof PATHS;

export function SeraIcon({
  name,
  className = "h-4 w-4",
}: {
  name: SeraIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
