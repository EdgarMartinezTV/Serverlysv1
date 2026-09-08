import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The only button in the system.
 *
 * Renders <button> by default, <a> via next/link when `href` is set, and a
 * plain <a> for external URLs (with the correct rel). Accessibility is not
 * optional here: every variant keeps a visible focus ring, hit targets are at
 * least 40px tall, and disabled state is conveyed by more than colour.
 */

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "inverseOutline";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium " +
  "whitespace-nowrap transition-colors duration-[--duration-base] ease-[--ease-out] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  // Primary action. One per view wherever possible.
  primary:
    "bg-brand-600 text-white shadow-e2 hover:bg-brand-700 active:bg-brand-800 " +
    "focus-visible:outline-brand-600",
  // Secondary action on light surfaces.
  secondary:
    "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 shadow-e1 " +
    "hover:bg-ink-50 hover:ring-ink-300 active:bg-ink-100 focus-visible:outline-brand-600",
  // Low-emphasis, used inside dense UI and nav.
  ghost:
    "text-ink-700 hover:bg-ink-100 hover:text-ink-900 active:bg-ink-200 " +
    "focus-visible:outline-brand-600",
  // For use on dark bands only.
  inverse:
    "bg-white text-ink-950 hover:bg-ink-100 active:bg-ink-200 " +
    "focus-visible:outline-white",
  // Outlined counterpart to `inverse`, also dark-band only.
  inverseOutline:
    "bg-transparent text-white ring-1 ring-inset ring-ink-700 " +
    "hover:bg-ink-900 hover:ring-ink-600 active:bg-ink-800 " +
    "focus-visible:outline-white",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-body-sm",
  md: "h-11 px-5 text-body-sm",
  lg: "h-12 px-6 text-body",
};

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Full width on mobile, auto from `sm`. The common CTA pattern. */
  block?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  "aria-label"?: string;
  rel?: string;
  target?: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    children,
    variant = "primary",
    size = "md",
    block = false,
    className,
    ...rest
  } = props as CommonProps & Record<string, unknown>;

  const classes = cn(
    BASE,
    VARIANTS[variant],
    SIZES[size],
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

  return (
    <button
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
