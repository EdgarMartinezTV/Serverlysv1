import { cn } from "@/lib/utils";

/**
 * Indeterminate activity indicator.
 *
 * Decorative by default — the surrounding control owns the announcement via
 * `aria-busy`, so the spinner itself is hidden from assistive tech. Pass a
 * `label` only when the spinner stands alone with no other status text.
 */
export function Spinner({
  size = "md",
  label,
  className,
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : true}
      className={cn("inline-flex items-center", className)}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className={cn(
          "animate-spin",
          size === "sm" && "h-3.5 w-3.5",
          size === "md" && "h-4 w-4",
          size === "lg" && "h-5 w-5",
        )}
      >
        <circle
          cx="8"
          cy="8"
          r="6.5"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2"
        />
        <path
          d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
