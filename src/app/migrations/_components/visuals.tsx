import { cn } from "@/lib/utils";
import { Check } from "@/components/ref/kit";

/**
 * Hero media for the migration page.
 *
 * The reference composes a stock portrait, product cut-outs, two confirmation
 * chips and a progress donut. The portrait and products are Hostinger's files,
 * so this rebuilds the parts that carry the meaning — the two chips and the
 * progress readout — on a brand field.
 *
 * Decorative: aria-hidden, and the copy beside it carries the meaning.
 */
export function MigrationPanel({ className }: { className?: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800",
        className,
      )}
    >
      {["Website link", "Migration form"].map((label, i) => (
        <div
          key={label}
          style={{ top: `${16 + i * 15}%` }}
          className="absolute left-[6%] flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-e4"
        >
          <span className="text-[14px] leading-5 font-semibold text-fg">{label}</span>
          <span className="grid size-5 place-items-center rounded-full bg-success-fill text-white">
            <Check className="size-3.5" />
          </span>
        </div>
      ))}

      <div className="absolute right-[5%] bottom-[10%] flex w-[56%] items-center gap-4 rounded-xl bg-white/95 p-4 shadow-e5">
        <div className="relative size-[68px] shrink-0">
          <svg viewBox="0 0 68 68" className="size-full -rotate-90">
            <circle
              cx="34"
              cy="34"
              r={r}
              fill="none"
              strokeWidth="7"
              className="stroke-ink-200"
            />
            <circle
              cx="34"
              cy="34"
              r={r}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${0.76 * c} ${c}`}
              className="stroke-primary"
            />
          </svg>
        </div>
        <span>
          <span className="block text-[15px] leading-6 font-semibold text-fg">
            Migration in progress
          </span>
          <span className="block text-[13px] leading-5 text-fg-secondary">
            2.3GB out of 3GB
          </span>
        </span>
      </div>
    </div>
  );
}

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
        "relative overflow-hidden rounded-2xl bg-canvas-secondary",
        className,
      )}
    >
      <div className="absolute inset-x-[10%] top-1/2 -translate-y-1/2 rounded-xl bg-white/80 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-medium text-fg">Migration checklist</p>

          <span className="grid justify-items-end">
            <span className="animate-why-pending why-step-4 col-start-1 row-start-1 flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-ui leading-4 font-semibold text-primary">
              <Spinner className="animate-why-spin size-3" />
              Migrating
            </span>
            <span className="animate-why-done why-step-4 col-start-1 row-start-1 flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-ui leading-4 font-semibold text-success">
              <Check className="size-3" />
              Complete
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
                {step}
              </span>

              <span className="grid justify-items-end">
                <span
                  className={cn(
                    "animate-why-pending col-start-1 row-start-1 text-fg-muted",
                    STEP_DELAY[i],
                  )}
                >
                  Waiting
                </span>
                <span
                  className={cn(
                    "animate-why-done col-start-1 row-start-1 text-success",
                    STEP_DELAY[i],
                  )}
                >
                  Done
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
