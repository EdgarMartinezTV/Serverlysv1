import { cn } from "@/lib/utils";

/**
 * Field wiring.
 *
 * IDs are derived deterministically from `name` rather than from `useId`, so
 * every form primitive stays a SERVER component. Forms on this site must work
 * with JavaScript disabled (they post directly to WHMCS), and nothing here
 * should require hydration to be labelled correctly.
 *
 * If two forms on one page ever share a field name, pass `idPrefix`.
 */
export function fieldIds(name: string, idPrefix?: string) {
  const base = idPrefix ? `${idPrefix}-${name}` : name;
  return {
    id: base,
    descriptionId: `${base}-description`,
    errorId: `${base}-error`,
  };
}

/** Builds the aria-describedby value for the states actually present. */
export function describedBy(
  name: string,
  opts: { description?: boolean; error?: boolean; idPrefix?: string },
) {
  const { descriptionId, errorId } = fieldIds(name, opts.idPrefix);
  const ids = [opts.description && descriptionId, opts.error && errorId].filter(
    Boolean,
  );
  return ids.length ? ids.join(" ") : undefined;
}

/**
 * Label + control + description + error, in the correct order and correctly
 * associated. The visible label is mandatory — a placeholder is not a label.
 */
export function Field({
  name,
  label,
  description,
  error,
  success,
  required,
  idPrefix,
  children,
  className,
}: {
  name: string;
  label: string;
  description?: string;
  error?: string;
  /** Confirmation text shown when the field validated cleanly. */
  success?: string;
  required?: boolean;
  idPrefix?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { id, descriptionId, errorId } = fieldIds(name, idPrefix);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-small font-medium text-fg">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ml-0.5 text-error">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-small text-fg-muted">
          {description}
        </p>
      )}

      {children}

      {/* Live region so a client-side validation message is announced without
          moving focus. Rendered even when empty so the region already exists. */}
      <p
        id={errorId}
        role="alert"
        aria-live="polite"
        className={cn("text-small text-error", !error && "hidden")}
      >
        {error}
      </p>

      {success && !error && (
        <p className="flex items-center gap-1.5 text-small text-success">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 shrink-0">
            <path
              d="m3.5 8.5 3 3 6-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {success}
        </p>
      )}
    </div>
  );
}
