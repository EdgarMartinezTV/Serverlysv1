"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

/**
 * The magnifier at the end of the blog's category bar. Opens a search box
 * over the bar that filters every article title as you type. Runs entirely in
 * the browser over a small index (slug, title, category) — nothing is sent.
 */
export function BlogSearch({
  index,
}: {
  index: ReadonlyArray<{ slug: string; title: string; category: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  const term = q.trim().toLowerCase();
  const hits = term
    ? index.filter((a) => a.title.toLowerCase().includes(term) || a.category.toLowerCase().includes(term)).slice(0, 8)
    : [];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the blog"
        aria-expanded={open}
        className="flex size-9 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4-4" />
        </svg>
      </button>

      {open && (
        <div className="absolute inset-0 z-20 bg-primary">
          <div className="relative mx-auto flex h-full max-w-[1280px] items-center gap-2 px-5 sm:px-8 lg:px-10">
            <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              ref={input}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  setQ("");
                }
              }}
              placeholder="Search articles"
              aria-label="Search articles"
              aria-controls={listId}
              className="h-9 min-w-0 flex-1 bg-transparent text-small font-medium text-white outline-none placeholder:text-white/70 [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setQ("");
              }}
              aria-label="Close search"
              className="flex size-9 shrink-0 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            {term && (
              <ul
                id={listId}
                className="absolute inset-x-5 top-full mt-2 overflow-hidden rounded-xl bg-canvas shadow-e4 ring-1 ring-line sm:inset-x-8 lg:inset-x-10"
              >
                {hits.length === 0 ? (
                  <li className="px-5 py-4 text-small text-fg-secondary">No articles match “{q.trim()}”.</li>
                ) : (
                  hits.map((a) => (
                    <li key={a.slug} className="border-b border-line-subtle last:border-0">
                      <Link
                        href={`/blog/${a.slug}`}
                        className="flex items-center justify-between gap-4 px-5 py-3 text-small text-fg hover:bg-brand-50 hover:text-primary"
                      >
                        <span>{a.title}</span>
                        <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-0.5 text-caption font-medium text-primary">{a.category}</span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
