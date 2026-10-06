"use client";

import { cn } from "@/lib/utils";

/**
 * Chrome for the INTERACTIVE product surfaces.
 *
 * Deliberately separate from `product-ui/frame.tsx`. Those frames are
 * `aria-hidden` decoration wrapped around static art. Everything in this
 * directory is operable — it has focusable controls — so hiding it from
 * assistive technology would strand keyboard users inside a subtree they can
 * still tab into. These wrappers are therefore exposed, labelled, and carry a
 * visible "Live demo" marker.
 *
 * The marker is not decoration either. These consoles render convincing
 * numbers; without it a reader could reasonably take them for their own.
 */

export function DemoBadge({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-ui font-semibold",
        tone === "dark"
          ? "bg-white/10 text-fg-on-dark-secondary ring-1 ring-inset ring-white/15"
          : // fg-secondary, not fg-muted: muted is 4.41:1 on canvas-inset at
            // 11px — a WCAG AA failure Lighthouse flagged on /hosting.
            "bg-canvas-inset text-fg-secondary ring-1 ring-inset ring-line",
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-success-fill motion-safe:animate-pulse"
      />
      Live demo
    </span>
  );
}

/**
 * A windowed application surface.
 *
 * `label` names the region for screen readers; `title` is what a sighted
 * reader sees in the title bar.
 */
export function ConsoleShell({
  label,
  title,
  toolbar,
  children,
  tone = "light",
  frameless = false,
  className,
}: {
  label: string;
  title: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  tone?: "light" | "dark";
  /**
   * Drop the window chrome (rounding, shadow, ring, traffic lights) when the
   * console is shown INSIDE another frame — a laptop screen with its own
   * browser bar. Two sets of traffic lights read as a window in a window.
   */
  frameless?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <section
      aria-label={label}
      className={cn(
        // A size container: consoles lay out by their own width (see
        // hosting-console), which keeps them correct inside a scaled frame.
        "@container overflow-hidden",
        frameless
          ? dark
            ? "bg-surface-dark-elevated"
            : "bg-surface"
          : dark
            ? "rounded-xl bg-surface-dark-elevated shadow-e5 ring-1 ring-inset ring-white/10"
            : "rounded-xl bg-surface shadow-e5 ring-1 ring-line",
        className,
      )}
    >
      <header
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-3 py-2.5 sm:px-4",
          dark
            ? "border-white/10 bg-white/[0.03]"
            : "border-line-subtle bg-canvas-secondary",
        )}
      >
        <span aria-hidden="true" className={cn("hidden gap-1.5", !frameless && "sm:flex")}>
          {["bg-red-500/45", "bg-amber-500/45", "bg-green-500/45"].map((c) => (
            <span key={c} className={cn("h-2.5 w-2.5 rounded-full", c)} />
          ))}
        </span>
        <span
          className={cn(
            "truncate text-small font-semibold",
            dark ? "text-white" : "text-fg",
          )}
        >
          {title}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {toolbar}
          <DemoBadge tone={tone} />
        </div>
      </header>
      {children}
    </section>
  );
}

/**
 * Segmented control. A real radio group: arrow keys move between options and
 * only the active option is in the tab order, which is the WAI-ARIA pattern
 * for a set of mutually exclusive choices.
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  tone = "light",
  size = "sm",
}: {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  tone?: "light" | "dark";
  size?: "xs" | "sm";
}) {
  const dark = tone === "dark";

  function onKeyDown(event: React.KeyboardEvent) {
    const index = options.findIndex((o) => o.value === value);
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = options.length - 1;
    else return;
    event.preventDefault();
    onChange(options[(next + options.length) % options.length].value);
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-md p-0.5",
        dark ? "bg-white/[0.06] ring-1 ring-inset ring-white/10" : "bg-canvas-inset",
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              /* min-h-6 = 24px, the project's floor for an interactive target
                 (scripts/test-nav.mjs asserts it). These are real radio
                 buttons inside the simulated console, and they used to clear
                 it only by accident: `text-[11px]` with no leading class
                 inherited a 1.65 line-height, which happened to add up to
                 26px. Moving to the `text-ui` step set an intentional 1.45 and
                 the tabs fell to 24px-minus. The floor is now stated rather
                 than inherited, so the type step and the target size stop
                 being coupled. */
              "inline-flex min-h-6 items-center rounded-[5px] font-medium transition-colors duration-fast ease-hover",
              "focus-visible:outline-2 focus-visible:outline-offset-1",
              size === "xs"
                ? "px-2 py-1 text-ui"
                : "px-2.5 py-1 text-ui",
              dark
                ? active
                  ? "bg-white/15 text-white focus-visible:outline-white"
                  : "text-fg-on-dark-muted hover:text-white focus-visible:outline-white"
                : active
                  ? "bg-surface text-fg shadow-e1 focus-visible:outline-primary"
                  : "text-fg-secondary hover:text-fg focus-visible:outline-primary",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Sparkline.
 *
 * Drawn as an SVG path from the real series rather than shipped as an image, so
 * it stays sharp, weighs nothing, and changes when the selected site changes.
 * Purely illustrative — every value it encodes is also written out as text
 * beside it, so it is `aria-hidden`.
 */
export function Sparkline({
  series,
  className,
  stroke = "text-primary",
  fill = "text-primary/12",
}: {
  series: readonly number[];
  className?: string;
  stroke?: string;
  fill?: string;
}) {
  const width = 100;
  const height = 30;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;

  const points = series.map((value, index) => {
    const x = (index / (series.length - 1)) * width;
    const y = height - ((value - min) / span) * (height - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <polygon
        points={`0,${height} ${points.join(" ")} ${width},${height}`}
        className={cn("fill-current", fill)}
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className={cn("stroke-current", stroke)}
      />
    </svg>
  );
}

/** A labelled value. The unit of information in every console. */
export function Metric({
  label,
  value,
  sub,
  tone = "light",
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "rounded-lg p-3",
        dark ? "bg-white/[0.04] ring-1 ring-inset ring-white/8" : "bg-canvas-secondary",
      )}
    >
      <dt
        className={cn(
          "text-ui font-semibold",
          dark ? "text-fg-on-dark-muted" : "text-fg-muted",
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1.5 tabular text-body font-semibold",
          dark ? "text-white" : "text-fg",
        )}
      >
        {value}
      </dd>
      {sub && (
        <dd
          className={cn(
            "mt-0.5 text-ui",
            dark ? "text-fg-on-dark-muted" : "text-fg-muted",
          )}
        >
          {sub}
        </dd>
      )}
    </div>
  );
}
