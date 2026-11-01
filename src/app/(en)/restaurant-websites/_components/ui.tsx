/**
 * The few kit tokens the restaurant pages' CLIENT components need.
 *
 * Copied from components/retell/kit.tsx rather than imported: kit.tsx is a
 * server module that loads a font and pulls in half a dozen sections, and
 * importing it from a "use client" file would ship all of that to the browser
 * for two colour strings and a tick. Keep the values identical to the kit.
 */
export const INK = "text-[#0b1530]";
export const MUTED = "text-[#5b6472]";

export function Tick({ onBlue }: { onBlue?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 size-[18px] shrink-0">
      <circle cx="10" cy="10" r="9" fill={onBlue ? "#fff" : "#0b1530"} />
      <path
        d="m6 10.2 2.6 2.6L14 7.4"
        fill="none"
        stroke={onBlue ? "var(--color-primary)" : "#fff"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
