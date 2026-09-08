/**
 * Brand glyphs for the three social accounts Serverlys actually has.
 * Decorative — the accessible name comes from the link's own label — so each
 * is aria-hidden.
 */
export function SocialIcon({ name }: { name: "X" | "Instagram" | "TikTok" }) {
  const common = {
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    className: "h-4 w-4",
  };

  if (name === "X") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M17.53 3h3.07l-6.7 7.66L21.75 21h-5.9l-4.62-6.04L5.94 21H2.86l7.16-8.19L2.5 3h6.05l4.18 5.52L17.53 3Zm-1.08 16.15h1.7L7.63 4.76H5.8l10.65 14.39Z" />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg {...common} fill="currentColor">
      <path d="M16.5 2h-3v13.1a2.6 2.6 0 1 1-2.1-2.55V9.4a5.9 5.9 0 1 0 5.1 5.84V8.9a6.7 6.7 0 0 0 3.9 1.25V7.1a3.9 3.9 0 0 1-3.9-3.9V2Z" />
    </svg>
  );
}
