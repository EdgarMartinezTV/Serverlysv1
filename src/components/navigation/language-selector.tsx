"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Chevron } from "./nav-icons";
import { cn } from "@/lib/utils";
import { isSpanish } from "@/i18n/t";
import { twinOf } from "@/i18n/paths";
import { publicEnv } from "@/lib/env";
import { t as tx } from "@/i18n/t";

/**
 * Locale control: English (default) and Spanish (es-419).
 *
 * Each option links to the same page in the other language when it exists,
 * otherwise to that language's home page. Choosing also tells WHMCS (served
 * under the same origin) to switch the client area/checkout language, so the
 * cart and emails follow the visitor's choice. English stays the default:
 * nothing switches without a click.
 */
const LOCALES = [
  { code: "en", label: "English", region: "International", whmcs: "english" },
  { code: "es", label: "Español", region: "Latinoamérica", whmcs: "spanish" },
] as const;

/** Set the WHMCS session language. Same-origin in production; best-effort. */
export function syncWhmcsLanguage(lang: "english" | "spanish") {
  try {
    try {
      sessionStorage.setItem("sv-whmcs-lang", lang);
    } catch {
      /* storage blocked */
    }
    void fetch(`${publicEnv.billingOrigin.replace(/\/+$/, "")}/index.php?language=${lang}`, {
      credentials: "include",
      mode: "no-cors",
      cache: "no-store",
    }).catch(() => {});
  } catch {
    /* offline or blocked — WHMCS links on /es pages still carry language=spanish */
  }
}

export function LanguageSelector({ onDark = false }: { onDark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const es = isSpanish();
  const current = es ? "es" : "en";
  const pathname = usePathname() || "/";
  const twin = twinOf(pathname);
  const hrefFor = (code: "en" | "es") => (twin ? twin[code] : code === "es" ? "/es" : "/");

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
        </span>{es ? tx("ES") : tx("EN")}<Chevron
          className={cn(
            "h-[1.125rem] w-[1.125rem] transition-transform",
            open && "rotate-180",
          )}
        />
        <span className="sr-only">{es ? tx("Cambiar idioma. Idioma actual: español") : tx("Change language. Current language: English")}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl bg-surface p-2 shadow-e5 ring-1 ring-line">
          <ul>
            {LOCALES.map((l) => {
              const active = l.code === current;
              const inner = (
                <>
                  <span>
                    <span className="block text-small font-medium text-fg">{tx(l.label)}</span>
                    <span className="block text-caption text-fg-muted">{tx(l.region)}</span>
                  </span>
                  {active && (
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 text-primary">
                      <path
                        d="m3.5 8.5 3 3 6-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </>
              );
              return (
                <li key={l.code}>
                  {active ? (
                    <span
                      aria-current="true"
                      className="flex items-center justify-between gap-3 rounded-lg bg-canvas-secondary px-3 py-2.5"
                    >
                      {tx(inner)}
                    </span>
                  ) : (
                    <a
                      href={hrefFor(l.code)}
                      hrefLang={l.code}
                      lang={l.code}
                      onClick={() => syncWhmcsLanguage(l.whmcs)}
                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-canvas-inset"
                    >
                      {tx(inner)}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
