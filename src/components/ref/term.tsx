"use client";

import { createContext, useContext, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { BEST_TERM, DEFAULT_TERM, TERMS, type TermKey } from "@/data/pricing";

/**
 * The billing term every plan card on the page is priced for, after
 * Hostinger's /pricing: one select re-prices the whole grid. Terms are the
 * ones WHMCS sells (see TERM_PRICES in data/pricing.ts).
 *
 * Without a provider, cards price for DEFAULT_TERM, so a page that has no
 * selector still shows a real, purchasable term.
 */
const TermContext = createContext<{ term: TermKey; setTerm: (t: TermKey) => void }>({
  term: DEFAULT_TERM,
  setTerm: () => {},
});

export function TermProvider({ children, initial = DEFAULT_TERM }: { children: React.ReactNode; initial?: TermKey }) {
  const [term, setTerm] = useState<TermKey>(initial);
  return <TermContext.Provider value={{ term, setTerm }}>{children}</TermContext.Provider>;
}

export function useTerm() {
  return useContext(TermContext);
}

/** "12 months plan" select, right-aligned above the grid like the reference. */
export function TermSelect({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const { term, setTerm } = useTerm();
  const id = useId();
  return (
    <div className={cn("relative inline-flex", className)}>
      <label htmlFor={id} className="sr-only">
        Billing term
      </label>
      <select
        id={id}
        value={term}
        onChange={(e) => setTerm(e.target.value as TermKey)}
        className={cn(
          "h-12 w-full min-w-[220px] cursor-pointer appearance-none rounded-xl pr-11 pl-4 text-body font-medium transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          tone === "dark"
            ? "bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15"
            : "bg-canvas text-fg ring-1 ring-inset ring-line hover:ring-fg-muted",
        )}
      >
        {TERMS.map((t) => (
          <option key={t.key} value={t.key} className="text-fg">
            {t.label} plan{t.key === BEST_TERM ? " · Best value" : ""}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={cn("pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2", tone === "dark" ? "text-white" : "text-fg")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
