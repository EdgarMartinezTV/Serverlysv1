import type { NavIconName } from "@/data/navigation";

/**
 * Navigation icon set.
 *
 * Hand-built rather than pulled from a library: the project has zero runtime
 * dependencies, and adding one for sixteen glyphs is not a trade worth making.
 *
 * Every icon shares one specification so the set reads as a system —
 * 24×24 viewBox, 1.6 stroke, round caps and joins, no fills, currentColor.
 * A new icon MUST follow that spec or it will look foreign next to the others.
 */
const PATHS: Record<NavIconName, React.ReactNode> = {
  sparkles: (
    <>
      <path d="M12 3.5 13.6 8 18 9.6 13.6 11.2 12 15.7 10.4 11.2 6 9.6 10.4 8 12 3.5Z" />
      <path d="M18.5 15.5 19.2 17.4 21 18.1 19.2 18.8 18.5 20.7 17.8 18.8 16 18.1 17.8 17.4 18.5 15.5Z" />
    </>
  ),
  server: (
    <>
      <rect x="3.5" y="4.5" width="17" height="6" rx="2" />
      <rect x="3.5" y="13.5" width="17" height="6" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5a13 13 0 0 1 0 17 13 13 0 0 1 0-17Z" />
    </>
  ),
  layout: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M9.5 9.5v10" />
    </>
  ),
  cart: (
    <>
      <path d="M3.5 4.5h2l2 10h10l2-7H7" />
      <circle cx="9" cy="18.5" r="1.2" />
      <circle cx="17" cy="18.5" r="1.2" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </>
  ),
  phone: (
    <path d="M7.5 3.5h3l1.5 4.5-2.2 1.5a11 11 0 0 0 4.7 4.7l1.5-2.2 4.5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  chat: (
    <path d="M4.5 5.5h15a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H10l-4.5 3.5V15.5H4.5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6v5.5c0 4 2.9 7.6 7 8.9 4.1-1.3 7-4.9 7-8.9V6l-7-2.5Z" />
      <path d="m9.2 11.8 2 2 3.6-4" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 16.5a8.5 8.5 0 1 1 16 0" />
      <path d="m12 12.5 4-3.5" />
      <circle cx="12" cy="16.5" r="1.2" />
    </>
  ),
  wrench: (
    <path d="M14.5 3.5a5 5 0 0 0-4.6 6.9L3.9 16.4a2 2 0 0 0 2.8 2.8l6-6a5 5 0 0 0 6.3-6.4l-2.9 2.9-2.5-2.5 2.9-2.9a5 5 0 0 0-1.9-.8Z" />
  ),
  chart: (
    <>
      <path d="M4 19.5h16" />
      <path d="M7 16V10M12 16V5.5M17 16v-8" />
    </>
  ),
  book: (
    <>
      <path d="M5 4.5h9a3 3 0 0 1 3 3v12a2.5 2.5 0 0 0-2.5-2.5H5v-12.5Z" />
      <path d="M5 4.5a1.5 1.5 0 0 0 0 3h1" />
    </>
  ),
  lifebuoy: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="m6 6 3.5 3.5M18 6l-3.5 3.5M6 18l3.5-3.5M18 18l-3.5-3.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-1.8 4.2L9 15l1.8-4.2L15 9Z" />
    </>
  ),
  bolt: <path d="M13 3.5 5.5 13.5h5l-1 7 8-10.5h-5l.5-6.5Z" />,
};

export function NavIcon({
  name,
  className = "h-5 w-5",
}: {
  name: NavIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}

/** Chevron used by the nav triggers. Separate: it rotates, icons do not. */
export function Chevron({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

export function ArrowUpRight({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 2h6v6M10 2 3 9" />
    </svg>
  );
}
