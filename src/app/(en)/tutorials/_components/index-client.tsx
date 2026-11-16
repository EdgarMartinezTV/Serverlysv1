"use client";

import { useEffect, useMemo, useState } from "react";
import { tutorialCategories, tutorials, type Tutorial } from "@/data/tutorials";
import { cn } from "@/lib/utils";
import { categoryAnchor } from "./tutorial-ui";
import { CardGrid } from "./index-ui";

/**
 * The hero search and the "All tutorials" grid talk through the URL hash so
 * both work without JavaScript-only state: `#all/<category>` filters, and a
 * search sets `#all` and broadcasts the query.
 */
const EVENT = "tutorials:search";
const PER_PAGE = 9;

export function HeroSearch() {
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      action="#all"
      onSubmit={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(EVENT, { detail: q }));
        document.getElementById("all")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="mx-auto mt-14 flex w-full max-w-[840px] flex-col gap-4 sm:flex-row sm:gap-[30px]"
    >
      <label htmlFor="tutorial-search" className="sr-only">
        Search tutorials
      </label>
      <input
        id="tutorial-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search tutorials"
        className="h-[60px] min-w-0 flex-1 rounded-full bg-white px-[30px] text-[18px] text-[#18181a] placeholder:text-[#6d6d73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      />
      <button
        type="submit"
        className="h-[60px] shrink-0 rounded-full bg-brand-950 px-10 text-[18px] font-light text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-[189px]"
      >
        Search
      </button>
    </form>
  );
}

const ANCHORS = new Map(tutorialCategories.map((c) => [categoryAnchor(c), c]));

function readHash(): Tutorial["category"] | null {
  const m = window.location.hash.match(/^#all\/([a-z0-9-]+)$/);
  return (m && ANCHORS.get(m[1])) || null;
}

export function AllTutorials() {
  const [category, setCategory] = useState<Tutorial["category"] | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const sync = () => {
      const c = readHash();
      if (window.location.hash.startsWith("#all")) {
        setCategory(c);
        setPage(0);
        if (c) document.getElementById("all")?.scrollIntoView({ block: "start" });
      }
    };
    const onSearch = (e: Event) => {
      setQuery(String((e as CustomEvent).detail ?? ""));
      setCategory(null);
      setPage(0);
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener(EVENT, onSearch);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener(EVENT, onSearch);
    };
  }, []);

  const list = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const newest = [...tutorials].sort((a, b) => b.published.localeCompare(a.published));
    return newest.filter((t) => {
      if (category && t.category !== category) return false;
      if (!words.length) return true;
      const hay = `${t.title} ${t.summary} ${t.category} ${t.steps.map((s) => s.title).join(" ")}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [category, query]);

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = list.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const go = (p: number) => {
    setPage(p);
    document.getElementById("all")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mt-[52px]">
      {(category || query) && (
        <div className="-mt-4 mb-10 flex flex-wrap items-center gap-3 text-[16px] text-[#18181a]">
          <span>
            Showing {list.length} {list.length === 1 ? "tutorial" : "tutorials"}
            {category && <> in <b className="font-semibold">{category}</b></>}
            {query && <> matching <b className="font-semibold">“{query}”</b></>}
          </span>
          <a
            href="#all"
            onClick={() => {
              setCategory(null);
              setQuery("");
            }}
            className="inline-flex h-9 items-center rounded-full bg-brand-950 px-4 text-[14px] text-white hover:bg-black"
          >
            Show all
          </a>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {list.length} tutorials shown
      </p>

      {shown.length ? (
        <CardGrid items={shown} byline />
      ) : (
        <p className="py-16 text-center text-[18px] text-[#797980]">
          No tutorial matches that yet. Try a shorter search, or ask support, which reaches a person.
        </p>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-current={i === page ? "page" : undefined}
              onClick={() => go(i)}
              className={cn(
                "grid size-[30px] place-items-center rounded-md text-[14px] transition-colors",
                i === page ? "bg-primary font-semibold text-white" : "text-[#18181a] hover:bg-brand-50",
              )}
            >
              {i + 1}
            </button>
          ))}
          {page < pages - 1 && (
            <button type="button" onClick={() => go(page + 1)} className="ml-2 text-[14px] font-semibold text-primary hover:underline">
              Next
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
