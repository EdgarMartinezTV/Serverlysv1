"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * Sticky in-page anchor rail.
 *
 * The reference puts one under the hero of every product page, and it does the
 * same job the homepage stage rail does: name the page's parts up front and
 * keep them one click away once the reader is deep in it.
 *
 * Generalised from the homepage's StageNav rather than copied — the scroll-spy
 * band, the z-index below the header, and the reason for both are identical,
 * and two copies of that reasoning would drift.
 *
 * ⚠ Scope it. `sticky` is bounded by the scrolling ancestor, so the rail and
 * the sections it points at must share one wrapper or the rail follows the
 * reader into the footer offering to scroll them back to finished sections.
 */
export function SectionNav({ items }: { items: readonly { id: string; label: string }[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // A band root margin, not a threshold: these sections are taller than the
    // viewport and can never cross a 0.5 ratio, so a threshold leaves the rail
    // permanently dead.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-18 z-30 border-b border-line-subtle bg-canvas/85 backdrop-blur-md"
    >
      <Container>
        <ul className="-mx-1 flex items-center gap-2 overflow-x-auto py-3">
          {items.map((item) => {
            const current = active === item.id;
            return (
              <li key={item.id} className="shrink-0 px-1">
                <a
                  href={`#${item.id}`}
                  aria-current={current ? "true" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-small transition-colors duration-fast ease-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    current
                      ? "bg-primary text-fg-on-brand"
                      : "text-fg-secondary hover:bg-primary-soft hover:text-primary",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors duration-fast",
                      current ? "bg-fg-on-brand" : "bg-line-strong",
                    )}
                  />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}
