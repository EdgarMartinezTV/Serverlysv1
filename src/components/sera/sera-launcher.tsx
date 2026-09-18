"use client";

import { forwardRef } from "react";
import styles from "./sera.module.css";
import { SeraIcon, SeraMark } from "./sera-mark";
import { useSera } from "./sera-provider";

/**
 * The floating button.
 *
 * A PILL WITH A WORD ON IT, not a bare circle. A circle with a glyph is the
 * genre convention and it is also the reason people ignore these: it could be
 * chat, help, feedback or a cookie tool, and the only way to find out costs a
 * click. "Ask Sera" says what it is before anyone commits. It collapses to the
 * mark alone below `sm`, where the pill would eat a third of the viewport
 * width.
 *
 * It carries `aria-expanded` and `aria-controls` because it is a disclosure,
 * and it is the element focus returns to when the panel closes — see
 * `sera-root.tsx`.
 */

export const SeraLauncher = forwardRef<HTMLButtonElement>(function SeraLauncher(_props, ref) {
  const { isOpen, toggle, unread } = useSera();

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls="sera-panel"
      aria-label={isOpen ? "Collapse Sera" : "Ask Sera, the Serverlys assistant"}
      className={
        `${styles.launcher} ${isOpen ? styles.launcherHidden : ""} ` +
        "group relative inline-flex items-center justify-center rounded-full bg-primary " +
        "text-small font-medium text-white shadow-e4 " +
        "transition-colors duration-fast ease-hover hover:bg-primary-hover " +
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
        (isOpen ? "h-12 w-12" : "gap-2.5 px-3 py-3 sm:pr-5")
      }
    >
      {/*
        OPEN: a plain circular chevron-down, matching the reference's collapse
        control. CLOSED: the mark with a label beside it, because a bare circle
        could be chat, help, feedback or a cookie tool and the only way to find
        out costs a click.
      */}
      {isOpen ? (
        <SeraIcon name="chevronDown" className="h-5 w-5" />
      ) : (
        <>
          <span className="relative inline-flex h-6 w-6 items-center justify-center">
            <SeraMark className="h-6 w-6" />
          </span>
          <span className="hidden sm:inline">Ask Sera</span>
        </>
      )}

      {/*
        A reply that landed after the panel was closed gets a COUNT, because a
        number is the only thing that tells someone whether it is worth
        reopening. Otherwise the availability indicator: it says Sera is
        answering — NOT that a person is. The panel header spells that out in
        words rather than leaving a green dot to imply staffing.
      */}
      {!isOpen && unread > 0 && (
        <span
          className={
            "absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center " +
            "rounded-full bg-success-fill px-1 text-caption font-semibold text-white ring-2 ring-canvas tabular"
          }
        >
          <span aria-hidden="true">{unread}</span>
          <span className="sr-only">
            {unread} new {unread === 1 ? "reply" : "replies"} from Sera
          </span>
        </span>
      )}

      {!isOpen && unread === 0 && (
        <span className="absolute right-1 top-1 inline-flex h-2.5 w-2.5" aria-hidden="true">
          <span
            className={`${styles.ping} absolute inline-flex h-full w-full rounded-full bg-success-fill`}
          />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success-fill ring-2 ring-primary" />
        </span>
      )}
    </button>
  );
});
