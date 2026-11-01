"use client";

/**
 * Domain search — 2026-10-03 rebuild, after hostinger.com/domain-name-search.
 *
 * THE BAR: one white pill on the navy hero — search icon, the field, a clear
 * button, a "Name ideas" button and a round arrow submit — with a soft brand
 * ring that brightens on focus. A typewriter placeholder cycles real examples
 * (static under reduced motion). "/" focuses it from anywhere on the page.
 *
 * THE DROPDOWN (a WAI-ARIA combobox): opens on focus. Empty → recent searches
 * and a few starting points. Typing → a live preview of the name on every
 * extension we sell, with its first-year price from data/tlds, before any
 * network call. "Name ideas" → variations of the typed words. ↑ ↓ Enter Esc
 * all work; picking a row searches that exact name.
 *
 * THE RESULTS (2026-11-01): Hostinger's results page — see domain-results.tsx.
 * In "hero" mode the bar does not search in place: it navigates to
 * /domain-name-results?domain=…, which mounts this component in "results" mode.
 *
 * Nothing here invents availability or prices: the dropdown says "check",
 * not "available", and only the registry answer drives the verdict. The live
 * check, error states, rate limiting, recent searches and saved names are the
 * same contracts as before (scripts/test-domain-search.mjs).
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DomainResults } from "./domain-results";
import { useRouter } from "next/navigation";
import { parseDomainInput } from "@/lib/domains/normalize";
import {
  checkDomains,
  prefetchCheck,
  recentSearches,
  recentStore,
  shortlist,
  shortlistStore,
  type ShortlistItem,
} from "@/lib/domains/client";
import type { CheckError, DomainResult } from "@/lib/domains/types";
import { allTlds as staticAll, tlds as staticTlds, tldCategories, type Tld } from "@/data/tlds";
import { refreshCartCount } from "@/lib/domains/cart";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { t as tx } from "@/i18n/t";

type Phase =
  | { kind: "idle" }
  | { kind: "loading"; query: string }
  /** `partial`: the exact answer is in, the alternates are still coming. */
  | { kind: "results"; query: string; results: DomainResult[]; source: string; partial?: boolean; altFailed?: boolean }
  | { kind: "error"; query: string; error: CheckError };

type Option = { id: string; domain: string; label: string; hint: string; kind: "check" | "recent" | "idea" };

const EXAMPLES = ["hearthbakery.com", "northlight.studio", "fernandfold.shop", "yourname.com", "cedarclinic.org"];


/** Variations of what was typed — local, instant, and labelled as ideas. */
function nameIdeas(sld: string): string[] {
  const base = sld.replace(/[^a-z0-9-]/g, "").slice(0, 40);
  if (!base) return [];
  const out = [base, `get${base}`, `${base}hq`, `the${base}`, `${base}co`, `my${base}`, `${base}online`, `${base}studio`];
  return [...new Set(out)].filter((s) => s.length <= 63);
}

function sldOf(raw: string): string {
  const p = parseDomainInput(raw);
  return p.ok ? p.sld : raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[./\s]/)[0];
}

/**
 * Props, all optional:
 *   tlds     the featured list with live WHMCS prices (dropdown, default-extension chips)
 *   catalog  every TLD on sale with prices + WHMCS categories (results tabs)
 *   mode     "hero"    → submitting navigates to /domain-name-results?domain=… (Hostinger's flow)
 *            "results" → the results page itself: searches run here
 *            "inline"  → search and results on the same page (/transfer-domain)
 */
export function DomainSearchApp({
  tlds = staticTlds,
  catalog = staticAll,
  mode = "inline",
}: { tlds?: readonly Tld[]; catalog?: readonly Tld[]; mode?: "hero" | "results" | "inline" } = {}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [preferredTld, setPreferredTld] = useState(".com");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [validation, setValidation] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [ideas, setIdeas] = useState(false);
  const [active, setActive] = useState(-1);
  const categories = useMemo(() => tldCategories(catalog), [catalog]);
  const [category, setCategory] = useState<string>("Popular");
  /** Rows a category tab checked after the first answer, keyed by domain. */
  const [extra, setExtra] = useState<Record<string, DomainResult>>({});
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const tabAbortRef = useRef<AbortController | null>(null);
  const recent = useSyncExternalStore(recentStore.subscribe, recentStore.getSnapshot, recentStore.getServerSnapshot);
  const saved = useSyncExternalStore(shortlistStore.subscribe, shortlistStore.getSnapshot, shortlistStore.getServerSnapshot);
  const [slow, setSlow] = useState(false);
  const [retryIn, setRetryIn] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  /* Enter follows a row only when the row was chosen with the keyboard. A
     pointer resting where the dropdown opens would otherwise hover a row and
     silently swap the searched extension. */
  const keyboardPick = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const errorId = `${baseId}-error`;
  const listId = `${baseId}-list`;

  /* ── Typewriter placeholder ─────────────────────────────────────────── */
  const [ph, setPh] = useState("Type the domain you want");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    let n = 0;
    let deleting = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = EXAMPLES[i % EXAMPLES.length];
      n += deleting ? -1 : 1;
      setPh(`Try ${word.slice(0, n)}`);
      if (!deleting && n === word.length) {
        deleting = true;
        t = setTimeout(tick, 1600);
        return;
      }
      if (deleting && n === 0) {
        deleting = false;
        i += 1;
      }
      t = setTimeout(tick, deleting ? 35 : 75);
    };
    t = setTimeout(tick, 1200);
    return () => clearTimeout(t);
  }, []);

  /* ── "/" focuses the bar ────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key !== "/" || el.closest("input,textarea,[contenteditable='true']")) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Speed: warm what the next search will need ───────────────────── */
  // Hero bars hand off to the results page: have its code ready before Enter.
  useEffect(() => {
    if (mode === "hero") router.prefetch("/domain-name-results");
  }, [mode, router]);

  // A pause in typing pre-checks the exact name (one lookup, own rate-limit
  // budget), so by the time Search is pressed its answer is usually cached.
  const prefetched = useRef<string | null>(null);
  useEffect(() => {
    const raw = value.trim();
    if (raw.length < 3 || /\s/.test(raw)) return;
    const p = parseDomainInput(raw);
    if (!p.ok || p.sld.length < 2 || p.sld.includes(".")) return;
    const tld = p.tld ?? preferredTld;
    const name = `${p.sld}${tld}`;
    if (prefetched.current === name) return;
    const t = setTimeout(() => {
      prefetched.current = name;
      prefetchCheck(name, [tld]);
    }, 550);
    return () => clearTimeout(t);
  }, [value, preferredTld]);

  /* ── Close the dropdown on outside click ───────────────────────────── */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (retryIn <= 0) return;
    const t = setTimeout(() => setRetryIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [retryIn]);

  useEffect(() => {
    if (phase.kind !== "loading") return;
    const t = setTimeout(() => setSlow(true), 3500);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => () => abortRef.current?.abort(), []);

  /* Deep link: ?domain=name.tld runs that search on arrival. */
  const runRef = useRef<(q: string) => void>(() => {});
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("domain");
    if (mode === "results") void refreshCartCount();
    if (!d) return;
    if (mode === "hero") {
      // Old shareable links (/domain-name?domain=x) now belong to the results page.
      router.replace(`/domain-name-results?domain=${encodeURIComponent(d)}`);
      return;
    }
    const t = setTimeout(() => {
      setValue(d);
      runRef.current(d);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- arrival only
  }, []);

  const run = useCallback(
    async (rawQuery: string, retry = false) => {
      const parsed = parseDomainInput(rawQuery);
      if (!parsed.ok) {
        setValidation(parsed.message);
        inputRef.current?.focus();
        return;
      }
      setValidation(null);
      setOpen(false);
      setIdeas(false);

      const query = parsed.tld ? `${parsed.sld}${parsed.tld}` : `${parsed.sld}${preferredTld}`;
      if (mode === "hero") {
        recentStore.set(recentSearches.add(query));
        // Start the lookup NOW, not after the next page loads: the results
        // page's own request joins it (server in-flight dedupe) or hits cache.
        prefetchCheck(query);
        router.push(`/domain-name-results?domain=${encodeURIComponent(query)}`);
        return;
      }
      // Re-submitting the search on screen, or the one still loading (a
      // double-clicked Search), is a no-op; an explicit retry is not.
      if (!retry && (phase.kind === "results" || phase.kind === "loading") && phase.query === query) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setSlow(false);
      setCategory(categories.includes("Popular") ? "Popular" : "All");
      tabAbortRef.current?.abort();
      setExtra({});
      setLoadingCategory(null);
      setPhase({ kind: "loading", query });

      /*
       * Two requests in parallel: the exact name alone (one lookup, ~1s — or
       * instant if typing already warmed it) and the full first set. The exact
       * answer renders the moment it lands; the alternates fill in after. The
       * full request includes the exact name too, but the server collapses the
       * duplicate onto the same lookup, so WHMCS is asked once.
       */
      const exactTld = parsed.tld ?? preferredTld;
      const fullP = checkDomains(query, controller.signal);
      const exactP = checkDomains(query, controller.signal, [exactTld]);
      let shown = false;

      const first = await Promise.race([exactP, fullP.then(() => null)]);
      if (controller.signal.aborted) return;
      if (first && first.ok && first.data.results.length > 0) {
        shown = true;
        setPhase({ kind: "results", query, results: first.data.results, source: first.data.source, partial: true });
      }

      const outcome = await fullP;
      if (controller.signal.aborted) return;

      if (outcome.ok) {
        setPhase({ kind: "results", query, results: outcome.data.results, source: outcome.data.source });
        // The extension and the outcome, never the name itself — a domain
        // someone is checking can be their own name or an unannounced brand.
        const exact = outcome.data.results[0];
        track("domain_search", {
          search_tld: exact?.tld,
          availability: exact?.status,
          result_count: outcome.data.results.length,
          source: outcome.data.source,
        });
        // Shareable: the address bar now opens straight onto these results.
        window.history.replaceState(null, "", `?domain=${encodeURIComponent(query)}${window.location.hash}`);
        recentStore.set(recentSearches.add(query));
      } else if (shown && first && first.ok) {
        // The exact answer is on screen; only the alternates failed. Keep it,
        // and let the tabs say so rather than replacing a good answer with an error.
        setPhase({ kind: "results", query, results: first.data.results, source: first.data.source, altFailed: true });
      } else {
        if (outcome.error.kind === "network" && outcome.error.message === "Search cancelled.") return;
        setPhase({ kind: "error", query, error: outcome.error });
        if (outcome.error.kind === "rate_limited") setRetryIn(outcome.error.retryAfterSeconds);
      }
    },
    [phase, preferredTld, mode, router, categories],
  );

  /* ── Category tabs: check the extensions this tab has not checked yet ── */
  const onCategory = useCallback(
    async (c: string) => {
      setCategory(c);
      if (phase.kind !== "results") return;
      const sldNow = phase.results[0]?.sld ?? phase.query.split(".")[0];
      const known = new Set([...phase.results.map((r) => r.domain), ...Object.keys(extra)]);
      const missing = (c === "All" ? catalog : catalog.filter((t) => t.categories?.includes(c)))
        .map((t) => t.tld)
        .filter((t) => !known.has(`${sldNow}${t}`));
      if (!missing.length) return;
      tabAbortRef.current?.abort();
      const controller = new AbortController();
      tabAbortRef.current = controller;
      setLoadingCategory(c);
      const outcome = await checkDomains(phase.query, controller.signal, missing.slice(0, 16));
      if (controller.signal.aborted) return;
      setLoadingCategory(null);
      if (outcome.ok) {
        setExtra((prev) => {
          const next = { ...prev };
          for (const r of outcome.data.results) next[r.domain] = r;
          return next;
        });
      }
    },
    [phase, extra, catalog],
  );

  useEffect(() => {
    runRef.current = (q: string) => void run(q);
  }, [run]);

  /* ── Dropdown options ───────────────────────────────────────────────── */
  const sld = sldOf(value);
  const options: Option[] = useMemo(() => {
    if (ideas && sld) {
      return nameIdeas(sld).slice(0, 6).map((s, i) => ({
        id: `${baseId}-o${i}`,
        domain: `${s}${preferredTld}`,
        label: `${s}${preferredTld}`,
        hint: "Idea",
        kind: "idea" as const,
      }));
    }
    if (!value.trim()) {
      const start = recent.length ? recent : EXAMPLES.slice(0, 3);
      return start.slice(0, 5).map((d, i) => ({
        id: `${baseId}-o${i}`,
        domain: d,
        label: d,
        hint: recent.length ? "Recent" : "Example",
        kind: "recent" as const,
      }));
    }
    if (!sld || /\s/.test(value.trim())) return [];
    const typedTld = parseDomainInput(value);
    const first = typedTld.ok && typedTld.tld ? typedTld.tld : preferredTld;
    const ordered = [first, ...tlds.map((t) => t.tld).filter((t) => t !== first)];
    return ordered.slice(0, 6).map((tld, i) => {
      const price = tlds.find((t) => t.tld === tld)?.price;
      return {
        id: `${baseId}-o${i}`,
        domain: `${sld}${tld}`,
        label: `${sld}${tld}`,
        hint: price ? `$${price.toFixed(2)} /1st yr` : "Check",
        kind: "check" as const,
      };
    });
  }, [ideas, sld, value, recent, preferredTld, baseId, tlds]);

  const choose = (o: Option) => {
    setValue(o.domain);
    void run(o.domain);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      keyboardPick.current = true;
      setOpen(true);
      setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      keyboardPick.current = true;
      setActive((a) => Math.max(-1, a - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setIdeas(false);
      setActive(-1);
    } else if (e.key === "Enter" && open && keyboardPick.current && active >= 0 && options[active]) {
      e.preventDefault();
      choose(options[active]);
    }
  };

  const onToggleSave = useCallback((result: DomainResult) => {
    shortlistStore.set(shortlist.toggle({ domain: result.domain, price: result.price }));
  }, []);

  const isSaved = (domain: string) => saved.some((s) => s.domain === domain);
  const busy = phase.kind === "loading";
  const featured = phase.kind === "results" ? phase.results[0] : undefined;
  const resultMap = useMemo(() => {
    const m = new Map<string, DomainResult>();
    if (phase.kind === "results") for (const r of phase.results) m.set(r.domain, r);
    for (const [d, r] of Object.entries(extra)) if (!m.has(d)) m.set(d, r);
    return m;
  }, [phase, extra]);
  const showDropdown = open && options.length > 0 && !busy;
  const normalized = parseDomainInput(value);
  const cleaned =
    normalized.ok && value.trim() && value.trim().toLowerCase() !== `${normalized.sld}${normalized.tld ?? ""}`
      ? `${normalized.sld}${normalized.tld ?? preferredTld}`
      : null;

  return (
    <div className="flex flex-col gap-6">
      {/* ── The bar ────────────────────────────────────────────────────── */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (open && keyboardPick.current && active >= 0 && options[active]) return choose(options[active]);
          void run(value);
        }}
        className="flex flex-col gap-3"
      >
        <div ref={wrapRef} className="relative">
          <label htmlFor={`${baseId}-input`} className="sr-only">{tx("Search for a domain name")}</label>
          <div
            className={cn(
              "flex h-16 items-center gap-2 rounded-full bg-white pr-2 pl-5 shadow-[0_10px_40px_rgb(0_0_60/0.25)] ring-2 transition-[box-shadow,ring-color] duration-200",
              validation
                ? "ring-error"
                : "ring-brand-300 focus-within:shadow-[0_0_0_6px_rgb(31_85_255/0.25),0_10px_40px_rgb(0_0_60/0.25)] focus-within:ring-primary",
            )}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0 text-fg">
              <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="m13.5 13.5 3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              id={`${baseId}-input`}
              name="query"
              type="text"
              role="combobox"
              aria-expanded={showDropdown}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={showDropdown && active >= 0 ? options[active]?.id : undefined}
              inputMode="url"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="search"
              value={value}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              onChange={(e) => {
                setValue(e.target.value);
                setOpen(true);
                setActive(-1);
                keyboardPick.current = false;
                if (ideas && !e.target.value.trim()) setIdeas(false);
                if (validation) setValidation(null);
              }}
              aria-invalid={validation ? true : undefined}
              aria-describedby={validation ? errorId : undefined}
              placeholder={tx(ph)}
              className="h-12 min-w-0 flex-1 bg-transparent text-body-lg text-fg outline-none placeholder:text-fg-muted"
            />

            {value && (
              <button
                type="button"
                onClick={() => {
                  setValue("");
                  setIdeas(false);
                  inputRef.current?.focus();
                }}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-canvas-secondary hover:text-fg focus-visible:outline-2 focus-visible:outline-primary"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
                  <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className="sr-only">{tx("Clear search")}</span>
              </button>
            )}

            {!value && (
              <kbd className="hidden shrink-0 rounded-md bg-canvas-secondary px-2 py-1 text-micro font-semibold text-fg-muted ring-1 ring-line sm:inline-block">
                /
              </kbd>
            )}

            <button
              type="button"
              aria-expanded={ideas}
              aria-controls={listId}
              onClick={() => {
                if (!sld) {
                  inputRef.current?.focus();
                  return;
                }
                setIdeas((v) => !v);
                setOpen(true);
                setActive(-1);
              }}
              className={cn(
                "group/ideas inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-small font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                ideas ? "bg-brand-50 text-primary ring-1 ring-brand-200" : "bg-canvas-secondary text-fg hover:bg-brand-50 hover:text-primary",
              )}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4">
                <circle cx="8.5" cy="9.5" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="m12.5 13.5 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M15.5 2.5 16.2 4.3 18 5l-1.8.7-.7 1.8-.7-1.8L13 5l1.8-.7Z" fill="currentColor" />
              </svg>
              <span className="hidden sm:inline">{tx("Name ideas")}</span>
              <span className="sr-only sm:hidden">{tx("Name ideas")}</span>
            </button>

            <button
              type="submit"
              aria-busy={busy || undefined}
              disabled={busy}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-e2 transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-95 disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {busy ? (
                <Spinner size="sm" className="text-white" />
              ) : (
                <svg viewBox="0 0 16 16" aria-hidden="true" className="size-5">
                  <path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span className="sr-only">{busy ? tx("Searching") : tx("Search")}</span>
            </button>
          </div>

          {/* ── Dropdown ─────────────────────────────────────────────── */}
          {showDropdown && (
            <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-3xl bg-white text-left shadow-[0_24px_60px_rgb(0_0_60/0.3)] ring-1 ring-line motion-safe:animate-[ddIn_160ms_cubic-bezier(0.22,1,0.36,1)]">
              <p className="flex items-center justify-between px-5 pt-4 pb-2 text-micro font-semibold text-fg-muted">
                <span>
                  {ideas
                    ? tx(`Ideas from “${sld}”`)
                    : value.trim()
                      ? tx("Check this name on")
                      : recent.length
                        ? tx("Recent searches")
                        : tx("Try one of these")}
                </span>
                <span className="hidden font-normal sm:inline">{tx("↑ ↓ to move · Enter to check")}</span>
              </p>
              <ul id={listId} role="listbox" aria-label={tx("Domain suggestions")} className="max-h-[min(420px,60vh)] overflow-y-auto pb-2">
                {options.map((o, i) => {
                  const dot = o.label.indexOf(".");
                  return (
                    <li
                      key={o.id}
                      id={o.id}
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => {
                        keyboardPick.current = false;
                        setActive(i);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        choose(o);
                      }}
                      className={cn(
                        "mx-2 flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 transition-colors",
                        i === active ? "bg-brand-50" : "hover:bg-canvas-secondary",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-flex size-9 shrink-0 items-center justify-center rounded-xl",
                          o.kind === "recent" ? "bg-canvas-secondary text-fg-muted" : "bg-brand-50 text-primary",
                        )}
                      >
                        {o.kind === "recent" ? (
                          <svg viewBox="0 0 16 16" className="size-4"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M8 5v3l2 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                        ) : o.kind === "idea" ? (
                          <svg viewBox="0 0 16 16" className="size-4"><path d="M8 1.5 9.2 5 12.5 6.2 9.2 7.4 8 10.9 6.8 7.4 3.5 6.2 6.8 5Z" fill="currentColor" /></svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" className="size-4"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" strokeWidth="1.8" /></svg>
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-body text-fg">
                        {dot > 0 ? (
                          <>
                            <span className="font-medium">{o.label.slice(0, dot)}</span>
                            <span className="font-semibold text-primary">{o.label.slice(dot)}</span>
                          </>
                        ) : (
                          tx(o.label)
                        )}
                      </span>
                      <span className="shrink-0 text-small text-fg-secondary">{tx(o.hint)}</span>
                      <span aria-hidden="true" className={cn("shrink-0 text-fg-muted transition-opacity", i === active ? "opacity-100" : "opacity-0")}>
                        ↵
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <p id={errorId} role="alert" className={cn("rounded-lg bg-white/95 px-3 py-2 text-small text-error", !validation && "hidden")}>
          {tx(validation)}
        </p>

        {cleaned && !validation && (
          <p className="text-small text-fg-on-dark-secondary">{tx("We'll search ")}<span className="font-semibold text-white">{tx(cleaned)}</span>
          </p>
        )}

        {/* Default extension for a bare name. */}
        <fieldset className="flex flex-wrap items-center justify-center gap-2">
          <legend className="sr-only">{tx("Preferred extension")}</legend>
          <span className="mr-1 text-small text-fg-on-dark-secondary">{tx("Default extension")}</span>
          {tlds
            .filter((t) => t.suggest)
            .map((t) => (
              <label
                key={t.tld}
                className={cn(
                  "inline-flex min-h-9 cursor-pointer items-center rounded-full px-3.5 text-small font-medium transition-colors",
                  "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white",
                  preferredTld === t.tld ? "bg-white text-primary" : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/20",
                )}
              >
                <input
                  type="radio"
                  name="preferred-tld"
                  value={t.tld}
                  checked={preferredTld === t.tld}
                  onChange={() => setPreferredTld(t.tld)}
                  className="sr-only-focusable"
                />
                {tx(t.tld)}
              </label>
            ))}
        </fieldset>
      </form>

      {/* ── Recent (idle) ──────────────────────────────────────────────── */}
      {phase.kind === "idle" && recent.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-small text-fg-on-dark-secondary">{tx("Recent")}</span>
          {recent.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setValue(q);
                void run(q);
              }}
              className="inline-flex min-h-9 items-center rounded-full bg-white/10 px-3.5 text-small text-white ring-1 ring-white/15 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {tx(q)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => recentStore.set(recentSearches.clear())}
            className="inline-flex min-h-9 items-center rounded-sm px-2 text-small text-fg-on-dark-secondary underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >{tx("Clear")}</button>
        </div>
      )}

      {/* ── Results ────────────────────────────────────────────────────── */}
      <div aria-live="polite" aria-busy={busy}>
        {(busy || phase.kind !== "idle") && (
          <div className="rounded-3xl bg-white p-4 text-left shadow-[0_24px_60px_rgb(0_0_60/0.25)] sm:p-6">
            {busy && (
              <div>
                <p className="mb-4 flex items-center gap-2.5 text-small text-fg-secondary">
                  <Spinner size="sm" />{tx("Checking ")}{tx(phase.query)}{tx(" and alternatives with the registry…")}</p>
                <ul className="flex flex-col gap-3">
                  <li className="h-24 animate-pulse rounded-2xl bg-brand-50" />
                  {tx(Array.from({ length: 4 }, (_, i) => (
                    <li key={i} className="h-16 animate-pulse rounded-2xl bg-canvas-inset" />
                  )))}
                </ul>
                {slow && <p className="mt-4 text-small text-fg-muted">{tx("Still going — some registries are slower than others.")}</p>}
              </div>
            )}

            {phase.kind === "error" && (
              <ErrorState error={tx(phase.error)} retryIn={tx(retryIn)} onRetry={() => void run(phase.query)} />
            )}

            {phase.kind === "results" && phase.results.length === 0 && (
              <div role="status" className="rounded-2xl bg-canvas-secondary p-5">
                <p className="text-body font-medium text-fg">{tx("No results came back for ")}{tx(phase.query)}</p>
                <p className="mt-1.5 text-small text-fg-secondary">{tx("That is unusual rather than expected. The name may use an extension no registry answered for.")}</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Button type="button" variant="secondary" size="md" onClick={() => void run(phase.query, true)}>{tx("Try again")}</Button>
                  <Button href={`${billing.root}/cart.php?a=add&domain=register`} variant="ghost" size="md">{tx("Search in the cart instead")}</Button>
                </div>
              </div>
            )}

            {phase.kind === "results" && featured && (
              <DomainResults
                query={featured.domain}
                results={tx(resultMap)}
                catalog={tx(catalog)}
                categories={tx(categories)}
                category={category}
                onCategory={(c) => void onCategory(c)}
                loadingCategory={tx(loadingCategory)}
                source={tx(phase.source)}
                partial={tx(phase.partial)}
                altFailed={tx(phase.altFailed)}
                onRetry={() => void run(phase.query, true)}
                isSaved={tx(isSaved)}
                onToggleSave={onToggleSave}
                similar={
                  featured.status === "registered" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-small font-semibold text-fg">
                        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 text-primary"><path d="M8 1.5 9.2 5 12.5 6.2 9.2 7.4 8 10.9 6.8 7.4 3.5 6.2 6.8 5Z" fill="currentColor" /></svg>{tx("Similar names to check")}</span>
                      {nameIdeas(featured.sld)
                        .slice(1, 5)
                        .map((x) => `${x}${featured.tld}`)
                        .map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => {
                              setValue(d);
                              void run(d);
                            }}
                            className="inline-flex min-h-9 items-center rounded-full bg-brand-50 px-3.5 text-small font-medium text-primary transition-colors hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            {tx(d)}
                          </button>
                        ))}
                    </div>
                  )
                }
              />
            )}

            {phase.kind === "results" && phase.results.length > 0 && phase.results.every((r) => r.status === "unknown") && (
              <p className="mt-4 rounded-xl bg-warning-soft p-4 text-small text-warning">{tx("No registry answered just now. This is usually temporary — try again in a moment, or search from the cart directly.")}</p>
            )}
          </div>
        )}
      </div>

      {/* ── Shortlist ──────────────────────────────────────────────────── */}
      {saved.length > 0 && <Shortlist items={tx(saved)} />}
    </div>
  );
}

function ErrorState({ error, retryIn, onRetry }: { error: CheckError; retryIn: number; onRetry: () => void }) {
  const limited = error.kind === "rate_limited";
  const blocked = limited && retryIn > 0;

  return (
    <div role="alert" className="rounded-2xl bg-error-soft p-5 ring-1 ring-inset ring-error/25">
      <p className="text-body font-medium text-fg">
        {error.kind === "unconfigured" ? tx("Domain search is unavailable") : tx("That search did not complete")}
      </p>
      <p className="mt-1.5 text-small text-fg-secondary">{tx(error.message)}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {error.kind !== "unconfigured" && (
          <Button type="button" variant="secondary" size="md" onClick={onRetry} disabled={tx(blocked)}>
            {blocked ? tx(`Try again in ${retryIn}s`) : tx("Try again")}
          </Button>
        )}
        <Button href={`${billing.root}/cart.php?a=add&domain=register`} variant="ghost" size="md">{tx("Search in the cart instead")}</Button>
      </div>
    </div>
  );
}

function Shortlist({ items }: { items: ShortlistItem[] }) {
  const total = items.reduce((sum, i) => sum + (i.price ?? 0), 0);

  return (
    <section aria-labelledby="shortlist-heading" className="rounded-3xl bg-white p-5 text-left shadow-e4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 id="shortlist-heading" className="text-h4 text-fg">{tx("Saved names (")}{tx(items.length)})
        </h3>
        <button
          type="button"
          onClick={() => shortlistStore.set(shortlist.clear())}
          className="min-h-9 rounded-sm text-small text-fg-muted underline underline-offset-4 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >{tx("Clear all")}</button>
      </div>

      <ul className="mt-4 flex flex-col divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.domain} className="flex items-center justify-between gap-4 py-3">
            <span className="min-w-0 break-all text-body text-fg">{tx(item.domain)}</span>
            <span className="flex shrink-0 items-center gap-3">
              {item.price !== null && <span className="tabular text-small text-fg-secondary">${tx(item.price.toFixed(2))}</span>}
              <a
                href={`${billing.root}/cart.php?a=add&domain=register&query=${encodeURIComponent(item.domain)}`}
                className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-small font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >{tx("Register")}<span className="sr-only"> {tx(item.domain)}</span>
              </a>
              <button
                type="button"
                onClick={() => shortlistStore.set(shortlist.remove(item.domain))}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-canvas-inset hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
                  <path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className="sr-only">{tx("Remove ")}{tx(item.domain)}</span>
              </button>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-small text-fg-muted">
        <span className="tabular font-medium text-fg">${tx(total.toFixed(2))}</span>{tx(" first year, before tax. Registration completes in your Serverlys cart — each name is added there when you press Register.")}</p>
    </section>
  );
}
