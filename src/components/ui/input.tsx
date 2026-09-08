import { cn } from "@/lib/utils";
import { describedBy, fieldIds } from "./field";

/**
 * Text-entry controls.
 *
 * The border is the control boundary, so it uses `line-input` (3.19:1) rather
 * than the decorative `line` token — WCAG 1.4.11 requires 3:1 for boundaries
 * that identify a control.
 *
 * `invalid` drives both the visual state and `aria-invalid`; the two can never
 * disagree because they come from one prop.
 */

/**
 * The ring COLOUR is applied by exactly one of CONTROL_VALID / CONTROL_INVALID,
 * never both. Putting `ring-line-input` in the base and layering `ring-error`
 * on top is a class conflict — the winner is decided by stylesheet order, not
 * by which class comes last in the attribute, so the error state silently
 * failed to appear. Splitting them removes the conflict entirely.
 */
const CONTROL_BASE =
  "w-full rounded-sm bg-surface text-body text-fg " +
  "ring-1 ring-inset placeholder:text-fg-muted " +
  "transition-[box-shadow,background-color] duration-fast ease-hover " +
  "focus:outline-none focus:ring-2 " +
  "disabled:cursor-not-allowed disabled:bg-canvas-inset disabled:text-fg-muted";

const CONTROL_VALID = "ring-line-input hover:ring-line-strong focus:ring-primary";
const CONTROL_INVALID = "ring-error hover:ring-error focus:ring-error";

const control = (invalid?: boolean) =>
  [CONTROL_BASE, invalid ? CONTROL_INVALID : CONTROL_VALID].join(" ");

type Shared = {
  name: string;
  invalid?: boolean;
  hasDescription?: boolean;
  idPrefix?: string;
  className?: string;
};

export function Input({
  name,
  invalid,
  hasDescription,
  idPrefix,
  className,
  ...rest
}: Shared & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "className">) {
  const { id } = fieldIds(name, idPrefix);
  return (
    <input
      id={id}
      name={name}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy(name, {
        description: hasDescription,
        error: invalid,
        idPrefix,
      })}
      className={cn(control(invalid), "h-11 px-3.5", className)}
      {...rest}
    />
  );
}

export function Textarea({
  name,
  invalid,
  hasDescription,
  idPrefix,
  className,
  rows = 5,
  ...rest
}: Shared &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "className">) {
  const { id } = fieldIds(name, idPrefix);
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy(name, {
        description: hasDescription,
        error: invalid,
        idPrefix,
      })}
      className={cn(control(invalid), "resize-y px-3.5 py-2.5", className)}
      {...rest}
    />
  );
}

/**
 * Native <select>. The chevron is a background image on the control so the
 * element stays native — native selects give correct mobile pickers and
 * keyboard behaviour that a custom listbox has to re-implement badly.
 */
export function Select({
  name,
  invalid,
  hasDescription,
  idPrefix,
  className,
  children,
  ...rest
}: Shared & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name" | "className">) {
  const { id } = fieldIds(name, idPrefix);
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy(name, {
          description: hasDescription,
          error: invalid,
          idPrefix,
        })}
        className={cn(
          control(invalid),
          "h-11 cursor-pointer appearance-none pl-3.5 pr-10",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 12 12"
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 h-3 w-3 -translate-y-1/2 text-fg-muted"
      >
        <path
          d="M2.5 4.5 6 8l3.5-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
