import { cn } from "@/lib/utils";

/**
 * Small status marker. `tone` carries meaning and is never chosen for looks:
 *   brand    informational / product marker
 *   success  active, included, operational
 *   warning  not yet available ("Coming soon")
 *   error    failed, suspended
 *   neutral  quiet metadata
 *
 * Text uses the 600 step of each ramp — the 500 steps are fills and fail
 * contrast as text.
 */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "brand" | "success" | "warning" | "error" | "neutral";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        /* Sans, sentence case, 600 — the reference's chip. This was
           `text-micro font-semibold`, which reads as a technical label
           rather than as a marketing chip. Uppercase mono is still the right
           call for the eyebrow/overline pattern, which is NOT this component;
           see the `text-caption` usages in section headers. */
        "text-small font-semibold",
        tone === "brand" && "bg-primary-soft text-primary",
        tone === "success" && "bg-success-soft text-success",
        tone === "warning" && "bg-warning-soft text-warning",
        tone === "error" && "bg-error-soft text-error",
        tone === "neutral" && "bg-canvas-inset text-fg-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}
