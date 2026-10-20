import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Serverlys button — same variants and shape as the marketing site's
 * components/ui/button.tsx (12px radius, 600 label, flat primary), cut down
 * to what the app uses.
 */
export type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active",
  secondary: "bg-surface text-fg ring-1 ring-inset ring-line hover:bg-canvas-secondary hover:ring-line-strong",
  outline: "bg-transparent text-primary ring-1 ring-inset ring-primary/35 hover:bg-primary-soft",
  ghost: "text-fg-secondary hover:bg-canvas-inset hover:text-fg",
  danger: "bg-error-fill text-white hover:bg-error",
};
const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-small",
  md: "h-11 px-4 text-[0.9375rem]",
  lg: "h-12 px-6 text-body",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `btn ${VARIANTS[variant]} ${SIZES[size]} ${extra}`.trim();
}

type Common = { variant?: Variant; size?: Size };

export function Button({ variant, size, className = "", ...rest }: Common & ComponentProps<"button">) {
  return <button type="button" className={buttonClass(variant, size, className)} {...rest} />;
}

export function ButtonLink({ variant, size, className = "", ...rest }: Common & ComponentProps<typeof Link>) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />;
}
