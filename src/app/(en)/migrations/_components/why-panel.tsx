import { cn } from "@/lib/utils";
import { Check } from "@/components/ref/kit";
import { t as tx } from "@/i18n/t";

/**
 * Media for the "Why migrate?" content switch.
 *
 * The same checklist as before, running instead of sitting finished: the four
 * steps tick over 1.2s apart, the bar tracks them, and the pill turns from
 * "Migrating" to "Complete" with the last one, on a 10s loop.
 *
 * Every moving part is a pair of layers stacked in one grid cell, cross-faded
 * by opacity alone — nothing animates a width, a colour or a layout property,
 * so the whole thing composites on the GPU and never reflows the column of
 * copy beside it. Sharing the cell is also what keeps the row from jumping
 * when "Waiting" (7ch) becomes "Done" (4ch).
 *
 * Choreography, the delays and the reduced-motion contract all live in
 * globals.css under "Migration checklist panel" — read that before retiming
 * anything here. This stays a server component; there is no JS in it.
 *
 * Decorative: aria-hidden, and the accordion beside it carries the meaning.
 */
const WHY_STEPS = [
  "Files copied",
  "Database imported",
  "SSL reissued",
  "DNS ready",
] as const;

/** Per-row offset on the shared timeline. Row 1 runs on the beat. */
const STEP_DELAY = ["", "why-step-2", "why-step-3", "why-step-4"] as const;

function Spinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
      />
      <path
        d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WhyPanel({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--color-brand-100)_0%,var(--color-brand-50)_55%,var(--color-brand-400)_55%,var(--color-brand-500)_100%)]",
        className,
      )}
    >
      <div className="absolute inset-x-[10%] top-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-e5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-medium text-fg">{tx("Migration checklist")}</p>

          <span className="grid justify-items-end">
            <span className="animate-why-pending why-step-4 col-start-1 row-start-1 flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-ui leading-4 font-semibold text-primary">
              <Spinner className="animate-why-spin size-3" />
              {tx("Migrating")}
            </span>
            <span className="animate-why-done why-step-4 col-start-1 row-start-1 flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-ui leading-4 font-semibold text-success">
              <Check className="size-3" />
              {tx("Complete")}
            </span>
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {WHY_STEPS.map((step, i) => (
            <span
              key={step}
              className="flex items-center justify-between text-[13px] text-fg"
            >
              <span className="flex items-center gap-2">
                <span className="relative grid size-4 shrink-0 place-items-center">
                  {/* Not animated: the green disc covers it. Fading this out
                      as the disc fades in leaves the row dotless for a beat. */}
                  <span className="absolute inset-0 rounded-full border border-line-strong bg-white" />
                  <span
                    className={cn(
                      "animate-why-done absolute inset-0 grid place-items-center rounded-full bg-success-fill text-white",
                      STEP_DELAY[i],
                    )}
                  >
                    <Check className="size-3" />
                  </span>
                </span>
                {tx(step)}
              </span>

              <span className="grid justify-items-end">
                <span
                  className={cn(
                    "animate-why-pending col-start-1 row-start-1 text-fg-muted",
                    STEP_DELAY[i],
                  )}
                >
                  {tx("Waiting")}
                </span>
                <span
                  className={cn(
                    "animate-why-done col-start-1 row-start-1 text-success",
                    STEP_DELAY[i],
                  )}
                >
                  {tx("Done")}
                </span>
              </span>
            </span>
          ))}
        </div>

        <span className="mt-5 block h-1.5 overflow-hidden rounded-full bg-ink-100">
          <span className="animate-why-progress block h-full w-full rounded-full bg-primary" />
        </span>
      </div>
    </div>
  );
}
