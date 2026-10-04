"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";


/**
 * On-page nav: a floating pill pinned under the header, dark segment for the
 * section being read (same control as the homepage stage rail). Anchors, not
 * tabs — clicking scrolls.
 */
export function PillNav({ items }: { items: readonly { id: string; label: string }[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(
      (e): e is HTMLElement => !!e,
    );
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  /* On narrow screens the pill scrolls sideways; keep the current item in it. */
  useEffect(() => {
    /* Scroll the pill only, never the page (scrollIntoView would also move
       the window when the nav is off screen). */
    const link = document.querySelector<HTMLElement>(`[data-pill-nav="${active}"]`);
    const list = link?.closest("ul");
    if (!link || !list) return;
    const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="On this page"
      className="pointer-events-none sticky top-18 z-30 -mb-16 bg-transparent py-3"
    >
      <ul className="pointer-events-auto mx-auto flex w-fit max-w-[calc(100vw-2rem)] gap-1 overflow-x-auto rounded-full bg-canvas/90 p-1.5 shadow-e3 ring-1 ring-line backdrop-blur-md">
        {items.map((i) => (
          <li key={i.id} className="shrink-0">
            <a
              href={`#${i.id}`}
              data-pill-nav={i.id}
              aria-current={active === i.id ? "true" : undefined}
              className={cn(
                "inline-flex min-h-10 items-center rounded-full px-4 text-small font-semibold transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                active === i.id
                  ? "bg-fg text-white"
                  : "text-fg hover:bg-canvas-secondary",
              )}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
