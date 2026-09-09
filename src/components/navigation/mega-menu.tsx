"use client";

import { useId, useRef, useState } from "react";
import type { MegaCategory } from "@/data/navigation";
import { NavIcon } from "./nav-icons";
import { MegaMenuItem } from "./mega-menu-item";
import { MegaMenuPromo } from "./mega-menu-promo";
import { cn } from "@/lib/utils";

/**
 * Mega menu panel — three zones, as in the target.
 *
 *   rail     a vertical category list with an obvious active state
 *   content  grouped items in a multi-column grid, divided by rules
 *   promo    a category-specific promotional card
 *
 * The rail is a real vertical WAI-ARIA tablist: Up/Down move between
 * categories, Home/End jump, and each tab controls the content region. Roving
 * tabindex keeps Tab moving on to the content rather than through six rail
 * items.
 *
 * Switching category swaps content in place — the panel keeps its size and
 * position, so nothing flashes or jumps. Panel width is fixed to the container
 * so moving between top-level menus does not resize the surface either.
 */
export function MegaMenu({
  railLabel,
  categories,
  panelId,
  labelledBy,
  open,
  registerPanel,
  onClose,
  onNavigate,
}: {
  railLabel: string;
  categories: readonly MegaCategory[];
  panelId: string;
  labelledBy: string;
  open: boolean;
  registerPanel: (el: HTMLDivElement | null) => void;
  onClose: (restoreFocus: boolean) => void;
  onNavigate: () => void;
}) {
  const [activeId, setActiveId] = useState(categories[0].id);
  const railRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const index = Math.max(
    0,
    categories.findIndex((c) => c.id === activeId),
  );
  const category = categories[index] ?? categories[0];

  const onRailKeyDown = (e: React.KeyboardEvent) => {
    const last = categories.length - 1;
    // Derive from the FOCUSED tab, not the selected one. The rail also selects
    // on mouseEnter, so a keyboard user whose cursor happens to rest over a
    // different category would otherwise have focus and selection diverge and
    // the arrow keys would jump somewhere unexpected.
    const focusedIndex = railRefs.current.findIndex(
      (el) => el === document.activeElement,
    );
    const from = focusedIndex >= 0 ? focusedIndex : index;

    let next: number | null = null;
    if (e.key === "ArrowDown") next = from === last ? 0 : from + 1;
    else if (e.key === "ArrowUp") next = from === 0 ? last : from - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActiveId(categories[next].id);
    railRefs.current[next]?.focus();
  };

  return (
    <div
      id={panelId}
      ref={registerPanel}
      aria-labelledby={labelledBy}
      hidden={!open}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          onClose(true);
        }
      }}
      /* Centred on the VIEWPORT, not the container: the panel is deliberately
         wider than the 1200px content column so three columns of items get
         real width and descriptions sit on two lines, as in the target. */
      className="absolute left-1/2 top-full z-10 w-[min(88rem,calc(100vw-2.5rem))] -translate-x-1/2 pt-3"
    >
      <div
        className={cn(
          "overflow-hidden rounded-2xl bg-canvas-abyss/95 shadow-e5 ring-1 ring-inset ring-white/10 backdrop-blur-xl",
          "motion-safe:animate-[megaIn_180ms_cubic-bezier(0.16,1,0.3,1)]",
        )}
      >
        <div className="grid gap-0 lg:grid-cols-[15.5rem_minmax(0,1fr)_19rem]">
          {/* ── Zone 1: category rail ──────────────────────────────────── */}
          <div className="border-white/10 p-4 lg:border-r">
            <p className="px-3 pb-2 pt-1 font-mono text-caption uppercase text-fg-on-dark-muted">
              {railLabel}
            </p>
            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label={`${railLabel} categories`}
              onKeyDown={onRailKeyDown}
              className="flex flex-col gap-0.5"
            >
              {categories.map((c, i) => {
                const selected = c.id === category.id;
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      railRefs.current[i] = el;
                    }}
                    role="tab"
                    type="button"
                    id={`${baseId}-rail-${c.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-region-${c.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(c.id)}
                    onMouseEnter={() => setActiveId(c.id)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl px-3 text-small font-medium transition-colors duration-fast",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                      selected
                        ? "bg-white/[0.09] text-white ring-1 ring-inset ring-white/10"
                        : "text-fg-on-dark-secondary hover:bg-white/[0.05] hover:text-white",
                    )}
                  >
                    <NavIcon
                      name={c.icon}
                      className={cn(
                        "h-[1.125rem] w-[1.125rem] shrink-0",
                        selected ? "text-primary-on-dark" : "text-fg-on-dark-muted",
                      )}
                    />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Zone 2: grouped content ────────────────────────────────── */}
          <div
            role="tabpanel"
            id={`${baseId}-region-${category.id}`}
            aria-labelledby={`${baseId}-rail-${category.id}`}
            tabIndex={0}
            className="p-5 outline-none lg:p-6"
          >
            {category.groups.map((group, gi) => (
              <section
                key={group.heading}
                className={cn(gi > 0 && "mt-6 border-t border-white/10 pt-6")}
              >
                <h3 className="px-2.5 pb-3 font-mono text-caption uppercase text-fg-on-dark-muted">
                  {group.heading}
                </h3>
                <ul className="grid gap-x-5 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((item) => (
                    <li key={item.label} className="flex">
                      <MegaMenuItem item={item} onNavigate={onNavigate} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* ── Zone 3: promotional panel ──────────────────────────────── */}
          <div className="border-white/10 p-4 lg:border-l">
            <MegaMenuPromo promo={category.promo} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Every focusable link inside a panel, in DOM order. Used for keyboard entry. */
export function panelLinks(panel: HTMLElement | null): HTMLElement[] {
  if (!panel) return [];
  return Array.from(
    panel.querySelectorAll<HTMLElement>('a[href], button:not([tabindex="-1"])'),
  );
}
