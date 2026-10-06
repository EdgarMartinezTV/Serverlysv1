"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type Story = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
};

const PER_PAGE = 10;

/**
 * The "All stories" list: title with a category chip, excerpt, date and
 * byline, ten to a page with numbered pagination.
 *
 * Every story is in the HTML; pages other than the current one are only
 * hidden. So every article stays linked from this page for crawlers, which
 * is what keeps the archive from orphaning old posts.
 */
export function StoryList({ stories }: { stories: readonly Story[] }) {
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement>(null);
  const pages = Math.max(1, Math.ceil(stories.length / PER_PAGE));

  const go = (n: number) => {
    setPage(n);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={top} className="scroll-mt-24">
      <ul className="mt-10">
        {stories.map((s, i) => (
          <li key={s.slug} hidden={Math.floor(i / PER_PAGE) + 1 !== page} className="py-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Link
                href={`/blog/${s.slug}`}
                className="font-display text-[20px] font-normal leading-snug tracking-[-0.01em] text-fg transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {s.title}
              </Link>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-caption font-medium text-primary">{s.category}</span>
            </div>
            <p className="mt-2 line-clamp-2 max-w-[880px] text-small text-fg-secondary">{s.description}</p>
            <p className="mt-3 text-caption font-semibold text-fg">
              {s.date} <span aria-hidden="true" className="mx-1 text-fg-muted">•</span> By {s.author}
            </p>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <nav aria-label="All stories pages" className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => go(n)}
              aria-current={n === page ? "page" : undefined}
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                n === page ? "bg-primary text-white" : "text-fg hover:bg-brand-50 hover:text-primary",
              )}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => go(Math.min(pages, page + 1))}
            disabled={page === pages}
            aria-label="Next page"
            className="flex size-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-brand-50 hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 3.5 4.5 4.5L6 12.5" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
}
