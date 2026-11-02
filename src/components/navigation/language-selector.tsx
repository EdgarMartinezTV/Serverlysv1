"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isSpanish, t as tx } from "@/i18n/t";
import { twinOf } from "@/i18n/paths";
import { publicEnv } from "@/lib/env";

/**
 * "Select location & language" — modelled on hostinger.com's locale picker,
 * with the two locales Serverlys ships: English (default) and Spanish (es-419).
 *
 *   Trigger  40px pill: 18px round flag + two-letter code, no chevron.
 *            Transparent at rest; a 15% tint + 1px ring on hover / open.
 *   Desktop  400px white popover under the trigger (right-aligned, 8px gap,
 *            16px radius, 16px padding): title, 40px search, 40px rows.
 *   Mobile   the same panel as a full-height sheet inside the menu, opened
 *            from the trigger in the menu's bottom bar.
 *
 * Country and language names are endonyms and are never translated.
 * Choosing a locale opens the same page in that language (or that language's
 * home page) and tells WHMCS, so cart, client area and emails follow.
 * English stays the default: nothing switches without a click.
 */
export const LOCALES = [
  { code: "en", short: "EN", country: "United States", language: "English", whmcs: "english" },
  { code: "es", short: "ES", country: "Latinoamérica", language: "Español", whmcs: "spanish" },
] as const;

type Locale = (typeof LOCALES)[number];

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

function useLocaleState() {
  const es = isSpanish();
  const current: Locale = es ? LOCALES[1] : LOCALES[0];
  const pathname = usePathname() || "/";
  const twin = twinOf(pathname);
  const hrefFor = (code: Locale["code"]) => (twin ? twin[code] : code === "es" ? "/es" : "/");
  return { current, hrefFor };
}

/* ── Flags ───────────────────────────────────────────────────────────── */

function FlagUS() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="block h-full w-full">
      <defs>
        <clipPath id="sv-flag-us">
          <circle cx="8" cy="8" r="8" />
        </clipPath>
      </defs>
      <g clipPath="url(#sv-flag-us)">
        <rect width="16" height="16" fill="#F0F0F0" />
        {[0, 2.46, 4.92, 7.38, 9.84, 12.3, 14.76].map((y) => (
          <rect key={y} y={y} width="16" height="1.23" fill="#D80027" />
        ))}
        <rect width="8" height="8.6" fill="#0052B4" />
        {[
          [1.6, 1.5], [4, 1.5], [6.4, 1.5],
          [2.8, 3.2], [5.2, 3.2],
          [1.6, 4.9], [4, 4.9], [6.4, 4.9],
          [2.8, 6.6], [5.2, 6.6],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.45" fill="#F0F0F0" />
        ))}
      </g>
    </svg>
  );
}

/** Latin America has no single flag: a globe centred on the Americas. */
function FlagLatam() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="block h-full w-full">
      <defs>
        <clipPath id="sv-flag-latam">
          <circle cx="8" cy="8" r="8" />
        </clipPath>
      </defs>
      <g clipPath="url(#sv-flag-latam)">
        <rect width="16" height="16" fill="#338AF3" />
        <path
          d="M4.2 2.2c1.6-.6 3.5-.4 4.6.4.6.5.3 1.3-.4 1.6-.8.3-.9 1-.3 1.5.7.6 1.9.5 2.5 1.2.5.6.2 1.4.6 2 .5.8 1.5 1 1.6 2 .1 1.2-.9 2.3-1.7 3.1-.5.5-1.3.4-1.4-.3-.2-1.1.2-2.3-.5-3.1-.6-.7-1.8-.6-2.3-1.4-.5-.7-.1-1.7-.6-2.4-.5-.6-1.5-.6-1.9-1.3-.4-.9.6-2.9-.2-3.3Z"
          fill="#6DA544"
        />
      </g>
    </svg>
  );
}

export function LocaleFlag({ code, ring = "light" }: { code: Locale["code"]; ring?: "light" | "dark" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-[18px] w-[18px] shrink-0 overflow-hidden rounded-full border",
        ring === "dark" ? "border-white/15" : "border-black/10",
      )}
    >
      {code === "en" ? <FlagUS /> : <FlagLatam />}
    </span>
  );
}

/* ── Trigger ─────────────────────────────────────────────────────────── */

export function LocaleTrigger({
  open,
  onDark = false,
  controls,
  onClick,
  buttonRef,
}: {
  open: boolean;
  onDark?: boolean;
  controls: string;
  onClick: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  const { current } = useLocaleState();
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={controls}
      aria-label={`${tx("Select location & language")}: ${current.country}, ${current.language}`}
      onClick={onClick}
      className={cn(
        "flex h-10 items-center rounded-full px-4 text-[14px] font-semibold leading-6 transition-[background-color,box-shadow] duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        onDark
          ? cn(
              "text-white hover:bg-white/15 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.15)] focus-visible:outline-white",
              open && "bg-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.15)]",
            )
          : cn(
              "text-fg hover:bg-black/10 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1)] focus-visible:outline-primary",
              open && "bg-black/10 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]",
            ),
      )}
    >
      <LocaleFlag code={current.code} ring={onDark ? "dark" : "light"} />
      <span className="px-2">{current.short}</span>
    </button>
  );
}

/* ── Panel (title, search, list) ─────────────────────────────────────── */

const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function LocalePanel({
  id,
  onPicked,
  className,
  listClassName,
  autoFocusSearch = false,
}: {
  id: string;
  /** Hostinger focuses search in the mobile sheet only, not the desktop popover. */
  autoFocusSearch?: boolean;
  onPicked: () => void;
  className?: string;
  listClassName?: string;
}) {
  const { current, hrefFor } = useLocaleState();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (autoFocusSearch) searchRef.current?.focus({ preventScroll: true });
  }, [autoFocusSearch]);

  const shown = useMemo(() => {
    const q = fold(query);
    if (!q) return LOCALES;
    return LOCALES.filter((l) => fold(`${l.country} ${l.language} ${l.short}`).includes(q));
  }, [query]);

  return (
    <div className={cn("flex min-h-0 flex-col gap-2 p-4 text-fg", className)}>
      <p id={titleId} className="py-2.5 text-[16px] font-semibold leading-6">
        {tx("Select location & language")}
      </p>

      <label
        className={cn(
          "flex h-10 shrink-0 items-center gap-2 rounded-xl bg-white px-3",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.1)] transition-shadow duration-150",
          "focus-within:shadow-[0_0_0_1px_var(--color-primary),0_0_0_4px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]",
        )}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 text-[#58585e]">
          <circle cx="10.5" cy="10.5" r="6.75" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m15.5 15.5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tx("Search")}
          aria-label={tx("Search")}
          autoComplete="off"
          data-1p-ignore="true"
          data-lpignore="true"
          className="min-w-0 flex-1 bg-transparent text-[14px] leading-6 text-fg outline-none placeholder:text-[#58585e]"
        />
      </label>

      <ul
        id={id}
        role="listbox"
        aria-labelledby={titleId}
        className={cn("flex min-h-0 flex-col gap-1 overflow-y-auto overscroll-contain", listClassName)}
      >
        {shown.map((l) => {
          const selected = l.code === current.code;
          return (
            <li key={l.code} role="option" aria-selected={selected}>
              <a
                href={hrefFor(l.code)}
                hrefLang={l.code}
                lang={l.code}
                aria-current={selected ? "true" : undefined}
                onClick={(e) => {
                  if (selected) e.preventDefault();
                  else syncWhmcsLanguage(l.whmcs);
                  onPicked();
                }}
                className={cn(
                  "flex h-10 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-[background] duration-150",
                  "hover:bg-black/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
                  selected && "bg-black/5",
                )}
              >
                <LocaleFlag code={l.code} />
                <span className="flex min-w-0 items-center gap-2 text-[14px] font-medium leading-6">
                  <span className="truncate text-[#18181a]">{l.country}</span>
                  <span className="truncate text-[#9d9ea4]">{l.language}</span>
                </span>
              </a>
            </li>
          );
        })}
        {shown.length === 0 && (
          <li className="px-3 py-2 text-[14px] leading-6 text-[#9d9ea4]">{tx("No results")}</li>
        )}
      </ul>
    </div>
  );
}

/* ── Desktop header control ──────────────────────────────────────────── */

export function LanguageSelector({ onDark = false }: { onDark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
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
      <LocaleTrigger
        open={open}
        onDark={onDark}
        controls={listId}
        buttonRef={triggerRef}
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-30 mt-2 flex max-h-[444px] w-[400px] flex-col rounded-2xl bg-white",
            "shadow-[0_8px_16px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.1)]",
            "origin-top motion-safe:animate-[localeIn_150ms_cubic-bezier(0.16,1,0.3,1)]",
          )}
        >
          <LocalePanel id={listId} onPicked={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
