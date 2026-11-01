import type { AbuseIcon as Name } from "../_content";

/**
 * Category glyphs. Same spec as components/navigation/nav-icons: 24×24
 * viewBox, 1.6 stroke, round caps and joins, no fills, currentColor.
 */
const PATHS: Record<Name, React.ReactNode> = {
  copyright: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.6a3.5 3.5 0 1 0 0 4.8" />
    </>
  ),
  speech: (
    <>
      <path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11l-4 3.5v-3.5h-.5a2 2 0 0 1-2-2v-8Z" />
      <path d="M12 8v3.5M12 14h.01" />
    </>
  ),
  privacy: (
    <>
      <path d="M3 12s3.3-6 9-6c1.6 0 3 .5 4.2 1.2M21 12s-3.3 6-9 6c-1.6 0-3-.5-4.2-1.2" />
      <path d="M9.9 14.1a3 3 0 0 1 4.2-4.2" />
      <path d="m4 20 16-16" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-2.5Z" />
      <path d="M12 8.5v4M12 15.5h.01" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m6 6 12 12" />
    </>
  ),
  card: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M3.5 9.5h17M7 14.5h3" />
    </>
  ),
  hook: (
    <>
      <path d="M15 3.5v9.5a5 5 0 0 1-10 0v-2.5l2.5 2" />
      <circle cx="15" cy="3.5" r="0.01" />
      <path d="M13 6.5h4" />
    </>
  ),
  bug: (
    <>
      <rect x="7.5" y="8" width="9" height="11.5" rx="4.5" />
      <path d="M12 8v11.5M9.5 8a2.5 2.5 0 0 1 5 0M7.5 13H4M20 13h-3.5M7.8 10 5 8M16.2 10 19 8M7.8 16.5 5 18.5M16.2 16.5l2.8 2" />
    </>
  ),
  box: (
    <>
      <path d="M4 7.5 12 3.5l8 4v9l-8 4-8-4v-9Z" />
      <path d="m4 7.5 8 4 8-4M12 11.5v9" />
    </>
  ),
  dots: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
    </>
  ),
};

export function AbuseIcon({ name, className }: { name: Name; className?: string }) {
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
