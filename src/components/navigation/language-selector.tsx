"use client";

import { useEffect, useRef, useState } from "react";
import { Chevron } from "./nav-icons";
import { cn } from "@/lib/utils";

/**
 * Locale control.
 *
 * Serverlys ships one locale today (ARCHITECTURE.md: "No i18n — single
 * locale"). Rather than render a dead control that opens nothing, this is a
 * real disclosure that states plainly what is available. When locales are
 * added, extend LOCALES and wire the hrefs — the markup does not change.
 */
const LOCALES = [{ code: "en", label: "English", region: "International" }] as const;

export function LanguageSelector({ onDark = false }: { onDark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          // 40px tall, 16px padding, 16px / 600 label — the target's own
          // language control, and the same metrics the header CTA now runs.
          "flex min-h-10 items-center gap-2 rounded-lg px-4 text-body font-semibold transition-colors duration-fast",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          onDark
            ? "text-fg-on-dark-secondary hover:bg-white/10 hover:text-white focus-visible:outline-white"
            : "text-fg-secondary hover:bg-canvas-inset hover:text-fg focus-visible:outline-primary",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full text-micro font-bold ring-1 ring-inset",
            onDark ? "ring-white/25 text-white" : "ring-line-strong text-fg-secondary",
          )}
        >
          E
        </span>
        EN
        <Chevron
          className={cn(
            "h-[1.125rem] w-[1.125rem] transition-transform",
            open && "rotate-180",
          )}
        />
        <span className="sr-only">Change language. Current language: English</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl bg-surface p-2 shadow-e5 ring-1 ring-line">
          <ul>
            {LOCALES.map((l) => (
              <li key={l.code}>
                <span
                  aria-current="true"
                  className="flex items-center justify-between gap-3 rounded-lg bg-canvas-secondary px-3 py-2.5"
                >
                  <span>
                    <span className="block text-small font-medium text-fg">
                      {l.label}
                    </span>
                    <span className="block text-caption text-fg-muted">{l.region}</span>
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="h-4 w-4 text-primary"
                  >
                    <path
                      d="m3.5 8.5 3 3 6-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </li>
            ))}
          </ul>
          <p className="px-3 pb-1 pt-2.5 text-caption text-fg-muted">
            English is the only language we publish in today.
          </p>
        </div>
      )}
    </div>
  );
}
