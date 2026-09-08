import { cn } from "@/lib/utils";

/**
 * Checkbox and Radio.
 *
 * Both keep the NATIVE input (styled with `appearance-none`) rather than
 * re-implementing a control with divs and ARIA. Native gives correct keyboard
 * behaviour, form participation, and — for radios — arrow-key group navigation
 * for free. The custom mark is a sibling revealed by `peer-checked`.
 *
 * The whole <label> is the hit target, so the row clears the 24px minimum even
 * though the box itself is 20px.
 */

const BOX =
  "peer h-5 w-5 shrink-0 appearance-none bg-surface ring-1 ring-inset ring-line-input " +
  "transition-colors duration-fast ease-hover " +
  "checked:bg-primary checked:ring-primary " +
  "hover:ring-line-strong checked:hover:bg-primary-hover " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
  "disabled:cursor-not-allowed disabled:bg-canvas-inset disabled:ring-line";

const ROW =
  "group flex min-h-11 cursor-pointer items-start gap-3 py-1.5 " +
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60";

function Labels({ label, description }: { label: string; description?: string }) {
  return (
    <span className="flex flex-col">
      <span className="text-small font-medium text-fg">{label}</span>
      {description && <span className="text-small text-fg-muted">{description}</span>}
    </span>
  );
}

export function Checkbox({
  label,
  description,
  className,
  ...rest
}: {
  label: string;
  description?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className">) {
  return (
    <label className={cn(ROW, className)}>
      <span className="relative mt-0.5 flex items-center justify-center">
        <input type="checkbox" className={cn(BOX, "rounded-xs")} {...rest} />
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity duration-fast peer-checked:opacity-100"
        >
          <path
            d="m3.5 8.5 3 3 6-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <Labels label={label} description={description} />
    </label>
  );
}

export function Radio({
  label,
  description,
  className,
  ...rest
}: {
  label: string;
  description?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className">) {
  return (
    <label className={cn(ROW, className)}>
      <span className="relative mt-0.5 flex items-center justify-center">
        <input type="radio" className={cn(BOX, "rounded-full")} {...rest} />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-2 w-2 rounded-full bg-white opacity-0 transition-opacity duration-fast peer-checked:opacity-100"
        />
      </span>
      <Labels label={label} description={description} />
    </label>
  );
}

/**
 * Groups related checkboxes or radios. A <fieldset>/<legend> is required for a
 * radio group — without it, screen readers announce each option with no idea
 * what question it answers.
 */
export function ChoiceGroup({
  legend,
  description,
  error,
  children,
  className,
}: {
  legend: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("flex flex-col gap-1", className)}>
      <legend className="mb-1 text-small font-medium text-fg">{legend}</legend>
      {description && <p className="mb-1 text-small text-fg-muted">{description}</p>}
      {children}
      {error && (
        <p role="alert" className="mt-1 text-small text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
