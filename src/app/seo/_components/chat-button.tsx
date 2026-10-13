"use client";

import { cn } from "@/lib/utils";
import { useSeraOptional } from "@/components/sera/sera-provider";

/**
 * "Chat with us" — opens Sera. Like the header's Ask Sera pill, it degrades
 * into a real link to the support page when the provider is not mounted, so
 * the page's primary action is never inert.
 */
export function ChatButton({
  children = "Chat with us",
  className,
  icon = false,
  tone = "primary",
}: {
  children?: React.ReactNode;
  className?: string;
  icon?: boolean;
  /** primary: filled blue. ghost: outlined, on light. on-dark: white outline. */
  tone?: "primary" | "ghost" | "on-dark";
}) {
  const sera = useSeraOptional();
  const classes = cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-md px-8 text-body font-semibold transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    tone === "primary" && "bg-primary text-white hover:bg-primary-hover",
    tone === "ghost" && "text-fg ring-1 ring-inset ring-line-strong hover:bg-canvas-secondary",
    tone === "on-dark" && "text-white ring-1 ring-inset ring-white/30 hover:bg-white/10 focus-visible:outline-white",
    className,
  );
  const body = (
    <>
      {icon && (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5h16v11H9l-5 4V5Z" />
          <path d="M8 9h8M8 12.5h5" />
        </svg>
      )}
      {children}
    </>
  );
  if (!sera) {
    return (
      <a href="/support" className={classes}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" onClick={sera.open} className={classes}>
      {body}
    </button>
  );
}
