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
      className="mx-auto mt-14 flex w-full max-w-[840px] flex-col gap-5 sm:flex-row sm:gap-[30px]"
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
        className="h-[50px] w-full min-w-0 shrink-0 rounded-full sm:h-[60px] sm:flex-1 bg-white px-[30px] text-[18px] text-[#18181a] placeholder:text-[#6d6d73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      />
      <button
        type="submit"
        className="h-[50px] w-full shrink-0 rounded-full bg-brand-950 px-10 text-[18px] sm:h-[60px] font-light text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-[189px]"
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
        <div className="-mt-4 mb-10 flex flex-wrap items-center justify-center gap-3 md:justify-start text-[16px] text-[#18181a]">
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

/**
 * Topic links with the reference's dropdowns: hovering a topic (or pressing
 * its chevron) opens "View all" plus that topic's tutorials. One open at a
 * time; Escape, a click outside or leaving the item closes it.
 */
export function TopicMenu({
  topics,
}: {
  topics: ReadonlyArray<{ label: string; anchor: string; items: ReadonlyArray<{ title: string; href: string }> }>;
}) {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.("[data-topic-menu]")) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <ul data-topic-menu className="hidden h-full shrink-0 items-stretch text-[14px] lg:flex">
      <li className="flex">
        <a href="#all" className="flex items-center border-b-2 border-primary px-4 text-primary">
          All Tutorials
        </a>
      </li>
      {topics.map((t) => {
        const isOpen = open === t.anchor;
        const panel = `topic-menu-${t.anchor}`;
        return (
          <li
            key={t.anchor}
            className="relative flex"
            onMouseEnter={() => setOpen(t.anchor)}
            onMouseLeave={() => setOpen((o) => (o === t.anchor ? null : o))}
          >
            <a
              href={`#all/${t.anchor}`}
              onClick={() => setOpen(null)}
              className={cn(
                "flex items-center border-b-2 border-transparent pl-4 hover:text-primary",
                isOpen ? "text-primary" : "text-[#58585e]",
              )}
            >
              {t.label}
            </a>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panel}
              aria-label={`${t.label} tutorials`}
              // A mouse click lands after hover already opened it, so it keeps
              // the menu open; Enter/Space (detail 0) toggles it.
              onClick={(e) => setOpen(isOpen && e.detail === 0 ? null : t.anchor)}
              className="flex items-center pr-3 pl-1.5 text-[#58585e] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
            >
              <svg aria-hidden viewBox="0 0 16 16" className={cn("size-4 transition-transform", isOpen && "rotate-180")}>
                <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              id={panel}
              hidden={!isOpen}
              className="absolute top-full left-0 z-30 w-[260px] rounded-lg border border-[#e3e4e8] bg-white py-2 shadow-[0_8px_24px_rgb(29_30_32/0.12)]"
            >
              <a
                href={`#all/${t.anchor}`}
                onClick={() => setOpen(null)}
                className="flex items-center justify-between px-4 py-2.5 font-semibold text-primary hover:bg-[#f4f5ff]"
              >
                View all
                <svg aria-hidden viewBox="0 0 16 16" className="size-4">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div className="my-1 border-t border-[#e3e4e8]" />
              <ul>
                {t.items.map((it) => (
                  <li key={it.href}>
                    <a href={it.href} className="block px-4 py-2 leading-5 text-[#18181a] hover:bg-[#f4f5ff] hover:text-primary">
                      {it.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
