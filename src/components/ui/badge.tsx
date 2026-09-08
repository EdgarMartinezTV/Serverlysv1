import { cn } from "@/lib/utils";

/**
 * Small status marker. `tone` carries meaning and is never chosen for looks:
 *   brand   — informational / product marker
 *   success — active, included, operational
 *   warn    — not yet available ("Coming soon")
 *   neutral — quiet metadata
 */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "brand" | "success" | "warn" | "neutral";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "text-label font-mono uppercase",
        tone === "brand" && "bg-brand-50 text-brand-700",
        tone === "success" && "bg-success-50 text-success-600",
        tone === "warn" && "bg-warn-50 text-warn-600",
        tone === "neutral" && "bg-ink-100 text-ink-600",
        className,
      )}
    >
      {children}
    </span>
  );
}
