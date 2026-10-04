"use client";

import { useEffect, useState } from "react";

/**
 * "Find a domain extension" filter for the price table. Hides rows by their
 * data-tld attribute, so the table itself stays server-rendered and fully
 * readable without JavaScript.
 */
export function TldFilter() {
  const [q, setQ] = useState("");

  useEffect(() => {
    const needle = q.trim().toLowerCase().replace(/^\./, "");
    document.querySelectorAll<HTMLElement>("#tld-prices [data-tld]").forEach((el) => {
      const tld = (el.dataset.tld ?? "").toLowerCase().replace(/^\./, "");
      el.hidden = needle !== "" && !tld.includes(needle);
    });
  }, [q]);

  return (
    <div className="mx-auto mt-8 max-w-[420px]">
      <label htmlFor="tld-filter" className="sr-only">
        Find a domain extension
      </label>
      <div className="flex items-center gap-2.5 rounded-xl bg-canvas px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-primary">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 shrink-0 text-fg-muted">
          <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m14 14 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          id="tld-filter"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a domain extension"
          className="h-12 min-w-0 flex-1 bg-transparent text-body text-fg placeholder:text-fg-muted focus:outline-none"
        />
      </div>
    </div>
  );
}
