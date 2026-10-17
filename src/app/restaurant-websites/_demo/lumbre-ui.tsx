import { cn } from "@/lib/utils";

/**
 * Typographic pieces shared by the Lumbre server sections and client islands.
 * No directive: importable from both sides without pulling either along.
 */

export type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

/** Masked headline lines; `italicFrom` sets the line where the italic voice starts. */
export function Lines({ lines, italicFrom, accent }: { lines: readonly string[]; italicFrom?: number; accent?: string }) {
  return lines.map((line, i) => (
    <span key={i} className="lb-line">
      <span
        style={{ "--i": i, ...(accent && italicFrom !== undefined && i >= italicFrom ? { color: accent } : {}) } as Vars}
        className={italicFrom !== undefined && i >= italicFrom ? "italic" : undefined}
      >
        {line}
      </span>
    </span>
  ));
}

export function Eyebrow({ children, dark, className }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-4 font-display text-[11px] font-semibold tracking-[0.28em] uppercase",
        dark ? "text-[#C8A97E]" : "text-[#696D55]",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-10 bg-[#C8A97E]" />
      {children}
    </p>
  );
}
