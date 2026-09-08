import Link from "next/link";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

/**
 * The only button in the system.
 *
 * Renders <button>, or an <a> via next/link when `href` is set (a plain <a>
 * with correct rel for external URLs).
 *
 * DO NOT pass a `className` that overrides `display` or `color` — it collides
 * with the base classes and the winner is decided by stylesheet order, not by
 * you. This has already caused one shipped bug. Add a variant instead; to hide
 * responsively, wrap the button: <span className="hidden sm:block">.
 */

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "text" | "inverse" | "inverseOutline";

export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium " +
  "whitespace-nowrap transition-colors duration-fast ease-hover " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  /** The single highest-intent action in a view. Aim for one. */
  primary:
    "bg-primary text-white shadow-e2 hover:bg-primary-hover active:bg-primary-active " +
    "focus-visible:outline-primary",
  /** Companion to primary. Solid surface so it holds its own on tinted bands. */
  secondary:
    "bg-surface text-fg ring-1 ring-inset ring-line shadow-e1 " +
    "hover:bg-canvas-secondary hover:ring-line-strong active:bg-canvas-inset " +
    "focus-visible:outline-primary",
  /** Transparent with a brand edge. For secondary CTAs on tinted surfaces. */
  outline:
    "bg-transparent text-primary ring-1 ring-inset ring-primary/35 " +
    "hover:bg-primary-soft hover:ring-primary/60 active:bg-primary-soft-active " +
    "focus-visible:outline-primary",
  /** Low emphasis. Dense UI, toolbars, nav. */
  ghost:
    "text-fg-secondary hover:bg-canvas-inset hover:text-fg active:bg-line " +
    "focus-visible:outline-primary",
  /** Reads as a link, behaves as a button. No box until focus. */
  text:
    "px-0 text-primary underline-offset-4 hover:text-primary-hover hover:underline " +
    "active:text-primary-active focus-visible:outline-primary",
  /** Dark bands only. */
  inverse:
    "bg-white text-fg hover:bg-canvas-inset active:bg-line focus-visible:outline-white",
  /** Dark bands only — outlined counterpart to `inverse`. */
  inverseOutline:
    "bg-transparent text-white ring-1 ring-inset ring-line-on-dark " +
    "hover:bg-surface-dark-hover hover:ring-line-on-dark-hover active:bg-surface-dark-active focus-visible:outline-white",
};

/** Heights meet the 40px+ comfortable touch target; `sm` is 36px for dense UI. */
const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-small",
  md: "h-11 px-5 text-small",
  lg: "h-12 px-6 text-body",
};

/** `text` variant must not carry button padding. */
const TEXT_SIZES: Record<ButtonSize, string> = {
  sm: "h-auto text-small",
  md: "h-auto text-small",
  lg: "h-auto text-body",
};

type CommonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Full width below `sm`, auto above — the standard mobile CTA pattern. */
  block?: boolean;
  /** Shows a spinner, blocks interaction, and sets aria-busy. */
  loading?: boolean;
  className?: string;
};

type AsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

export function Button(props: AsButton | AsLink) {
  const {
    children,
    variant = "primary",
    size = "md",
    block = false,
    loading = false,
    className,
    ...rest
  } = props as CommonProps & Record<string, unknown>;

  const classes = cn(
    BASE,
    VARIANTS[variant],
    variant === "text" ? TEXT_SIZES[size] : SIZES[size],
    block && "w-full sm:w-auto",
    className,
  );

  if (typeof rest.href === "string") {
    const { href, external, ...anchorProps } = rest as {
      href: string;
      external?: boolean;
    } & Record<string, unknown>;
    const isExternal = external ?? /^https?:\/\//.test(href);

    if (isExternal) {
      const { target, rel, ...others } = anchorProps as Record<string, string>;
      return (
        <a
          href={href}
          className={classes}
          target={target ?? "_blank"}
          rel={rel ?? "noopener noreferrer"}
          {...others}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={classes}
      aria-busy={loading || undefined}
      disabled={loading || buttonProps.disabled}
      {...buttonProps}
    >
      {loading && <Spinner size={size === "lg" ? "md" : "sm"} />}
      {children}
    </button>
  );
}

/**
 * Icon-only button. Square, and an accessible name is REQUIRED — there is no
 * visible text to fall back on, so `label` is not optional.
 */
export function IconButton({
  children,
  label,
  variant = "ghost",
  size = "md",
  className,
  ...rest
}: {
  children: React.ReactNode;
  label: string;
  variant?: Exclude<ButtonVariant, "text">;
  size?: ButtonSize;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        BASE,
        VARIANTS[variant],
        "shrink-0 p-0",
        size === "sm" && "h-9 w-9",
        size === "md" && "h-11 w-11",
        size === "lg" && "h-12 w-12",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
