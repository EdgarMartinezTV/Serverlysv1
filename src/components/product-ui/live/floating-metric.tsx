import { cn } from "@/lib/utils";

/**
 * A card that sits ON a product surface rather than beside it.
 *
 * This is the depth device the page uses most: it turns a single flat panel
 * into three planes without any extra chrome. Deliberately small — a floating
 * card that competes with the interface underneath just hides it.
 *
 * `aria-hidden`, and every caller must state the same fact in prose or in the
 * component it annotates. These cards overlap other content, so a screen reader
 * meeting them in source order would hear a number with no context.
 */

const ACCENTS = {
  brand: { dot: "bg-primary", ring: "ring-primary/25" },
  cyan: { dot: "bg-cyan-400", ring: "ring-cyan-500/25" },
  green: { dot: "bg-success-fill", ring: "ring-green-500/25" },
  violet: { dot: "bg-violet-500", ring: "ring-violet-500/25" },
} as const;

export function FloatingMetric({
  label,
  value,
  trend,
  accent = "brand",
  className,
}: {
  label: string;
  value: string;
  trend?: string;
  accent?: keyof typeof ACCENTS;
  className?: string;
}) {
  const tone = ACCENTS[accent];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex-col gap-0.5 rounded-xl bg-surface/95 px-3.5 py-2.5 shadow-e5 ring-1 backdrop-blur-sm",
        tone.ring,
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)} />
        <span className="font-mono text-ui uppercase tracking-[0.1em] text-fg-muted">
          {label}
        </span>
      </span>
      <span className="tabular text-h4 font-semibold leading-none text-fg">
        {value}
      </span>
      {trend && <span className="text-ui text-fg-muted">{trend}</span>}
    </div>
  );
}
