"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import styles from "./sera.module.css";
import { SeraLauncher } from "./sera-launcher";
import { useSera } from "./sera-provider";

/**
 * Sera's single mount point.
 *
 * ⚠ THE PANEL IS CODE-SPLIT AND NEVER LOADED UNTIL IT IS OPENED. This is the
 * whole performance story of the feature. Every page on this site carries the
 * widget, and most visitors will never open it, so what ships on the critical
 * path is the launcher and the provider — a button and some state. The panel,
 * the composer, the message renderer and the workflow card arrive in a separate
 * chunk, on the click.
 *
 * `ssr: false` for a second reason beyond size: the panel's markup depends on a
 * conversation that exists only in the browser, so server-rendering it would
 * produce an empty shell for the client to immediately replace, and pay
 * hydration for the privilege.
 *
 * FOCUS. Opening moves focus into the composer (the composer's own
 * `autoFocus`); closing returns it to the launcher. Without the return trip a
 * keyboard user who closes the panel is dropped at the top of the document.
 */

const SeraPanel = dynamic(() => import("./sera-panel").then((module) => module.SeraPanel), {
  ssr: false,
});

/** Matches the CSS breakpoint at which the panel becomes a full-height sheet. */
const SHEET_QUERY = "(max-width: 30rem)";

export function SeraWidget() {
  /**
   * `isOpen` stays true through the exit animation and `closing` marks it —
   * both come from the provider, which owns the timer. The panel therefore
   * outlives the click by one animation without this component running an
   * effect that sets state. Unmounting immediately would make the window
   * vanish between frames, which is the cheapest-feeling thing a floating
   * panel can do.
   */
  const { isOpen, closing, close, lift } = useSera();
  const launcher = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  /* ── Focus return ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (wasOpen.current && !isOpen) launcher.current?.focus({ preventScroll: true });
    wasOpen.current = isOpen;
  }, [isOpen]);

  /* ── Background scroll lock, PHONES ONLY ──────────────────────────────── */

  /**
   * On a phone the panel is a sheet covering the viewport, and a touch drag
   * that starts on it must not scroll the marketing page underneath. The
   * transcript sets `overscroll-behavior: contain`, which stops scroll CHAINING
   * but not a drag that begins outside the scroller.
   *
   * ⚠ This is the only place Sera writes to an element it does not own. It
   * touches one property, only while the sheet is open, only under the sheet
   * breakpoint, and restores the EXACT previous inline value — not `""`, which
   * would silently delete a rule some other component had set. On desktop it
   * does nothing at all: the panel is a floating card and the page behind it
   * must stay scrollable, for the same reason the panel is not a modal.
   */
  useEffect(() => {
    if (!isOpen) return;
    if (!window.matchMedia(SHEET_QUERY).matches) return;

    const body = document.body;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [isOpen]);

  const handleClose = useCallback(() => close(), [close]);

  return (
    <div
      className={styles.root}
      /* Measured height of the cookie notice, so neither the launcher nor the
         panel lands on top of it. See `sera-provider.tsx`. */
      style={{ "--sera-lift": `${lift}px` } as React.CSSProperties}
    >
      <SeraLauncher ref={launcher} />
      {isOpen && <SeraPanel onClose={handleClose} closing={closing} />}
    </div>
  );
}
