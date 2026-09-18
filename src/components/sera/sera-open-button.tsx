"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./sera.module.css";
import { SeraMark } from "./sera-mark";
import { useSeraOptional } from "./sera-provider";

/**
 * The "Ask Sera" pill in the site header, replacing the old checkout CTA.
 *
 * This is the ONE piece of Sera that lives in the existing site chrome. Its
 * shape is measured from the reference — 40px tall, 8px/16px padding, 8px gap,
 * fully rounded, transparent fill, a 24px mark beside a 14px semibold label,
 * and a 1px gradient ring. The styling is in `sera.module.css`; the note there
 * explains why this is not the design system's `Button`.
 *
 * ⚠ IT DEGRADES INTO A REAL LINK. `useSeraOptional` returns null when the
 * provider is not mounted — a page rendered outside the root layout, a future
 * refactor that moves the mount, a test harness. In that case this becomes a
 * link to the support page rather than a control that silently does nothing.
 * The header's primary action must never be inert: a dead CTA in the site
 * chrome reads as the site being broken, not as a missing chat widget.
 */
export function SeraOpenButton({
  onDark = false,
  block = false,
  label = "Ask Sera",
  onOpen,
}: {
  /** The header is over a dark hero band. Flips the label to white. */
  onDark?: boolean;
  /** Full width, for the mobile drawer. */
  block?: boolean;
  label?: string;
  /** Runs before the panel opens — the mobile drawer uses it to close itself. */
  onOpen?: () => void;
}) {
  const sera = useSeraOptional();

  const className = cn(
    styles.headerCta,
    onDark ? styles.headerCtaOnDark : styles.headerCtaOnLight,
    block && styles.headerCtaBlock,
  );

  const content = (
    <>
      <SeraMark className="h-6 w-6 shrink-0" />
      {label}
    </>
  );

  if (!sera) {
    return (
      <Link href="/support" className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      aria-expanded={sera.isOpen}
      aria-controls="sera-panel"
      onClick={() => {
        onOpen?.();
        sera.open();
      }}
    >
      {content}
    </button>
  );
}
