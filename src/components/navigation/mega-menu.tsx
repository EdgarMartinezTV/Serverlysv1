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
 * position, so nothing flashes or jumps. Panel width is fixed to the viewport
 * so moving between top-level menus does not resize the surface either.
 *
 * The promo column drops below xl. At 1280px and under, a 300px fixed column
 * took a third of the panel away from the links people opened the menu to
 * reach, and the target hides it at the same point.
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
      /* GEOMETRY, matching the target to the pixel: the panel is centred on the
         VIEWPORT rather than the container, spans the viewport less a 16px
         margin each side up to 1600px, and opens 8px below the 72px bar. It is
         deliberately far wider than the 1200px content column — three columns
         of items need real width or every description wraps to four lines. */
      className="absolute left-1/2 top-full z-10 w-[calc(100vw-2rem)] max-w-mega -translate-x-1/2 pt-2"
    >
      <div
        className={cn(
          "max-h-[calc(100vh-6rem)] overflow-auto rounded-2xl bg-canvas shadow-[0_24px_60px_-12px_rgb(0_0_0/0.35)]",
          "motion-safe:animate-[megaIn_180ms_cubic-bezier(0.16,1,0.3,1)]",
        )}
      >
        {/* Flex, not grid: the rail and the promo are FIXED widths (240 / 300)
            and the content takes whatever is left. A three-column grid made the
            content column collapse on narrow laptops instead of the promo. */}
        <div className="flex gap-6 p-6">
          {/* ── Zone 1: category rail ──────────────────────────────────── */}
          <div className="flex w-60 shrink-0 flex-col gap-5">
            {/* 12px / 600 / 16px line box — the target's eyebrow exactly.
                `text-caption` alone is 12/16.8 (the site's 1.4 ratio). */}
            <p className="text-caption uppercase leading-4 font-semibold tracking-[0.04em] text-fg">
              {railLabel}
            </p>
            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label={`${railLabel} categories`}
              onKeyDown={onRailKeyDown}
              className="flex flex-col gap-1"
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
                    /* Click only — measured off the reference: hovering a rail
                       item there leaves the panel content unchanged, and only a
                       click swaps it. This had an onMouseEnter too, which meant
                       the panel rewrote itself as the pointer crossed the rail
                       on its way to a link. */
                    onClick={() => setActiveId(c.id)}
                    /* A PILL, not a rounded rectangle. The target's rail is
                       fully rounded and the difference is obvious side by side. */
                    /* 14px / 20px line box in a 32px pill (6+20+6), and the
                       weight carries the active state — 600 selected, 400 at
                       rest, as measured on the target. A flat font-medium made
                       every row look selected and the 21px line box pushed the
                       pill to 33px. */
                    className={cn(
                      "flex items-center gap-3 rounded-full px-3 py-1.5 text-left text-small leading-5 transition-colors duration-fast",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      selected
                        ? "bg-brand-50 font-semibold text-fg"
                        : "font-normal text-fg hover:bg-ink-100",
                    )}
                  >
                    <NavIcon
                      name={c.icon}
                      className={cn(
                        "h-5 w-5 shrink-0",
                        selected ? "text-primary" : "text-fg",
                      )}
                    />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div aria-hidden="true" className="w-px shrink-0 bg-line" />

          {/* ── Zone 2: grouped content ────────────────────────────────── */}
          <div
            role="tabpanel"
            id={`${baseId}-region-${category.id}`}
            aria-labelledby={`${baseId}-rail-${category.id}`}
            tabIndex={0}
            className="flex min-w-0 flex-1 flex-col gap-6 outline-none"
          >
            {category.groups.map((group, gi) => (
              <section
                key={group.heading}
                className={cn("flex flex-col gap-6", gi > 0 && "border-t border-line pt-7")}
              >
                <h3 className="text-caption uppercase leading-4 font-semibold tracking-[0.04em] text-fg">
                  {group.heading}
                </h3>
                {/* auto-fit at a 264px floor, exactly as the target: columns
                    appear and disappear with the panel width instead of
                    snapping at two fixed breakpoints. */}
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(16.5rem,1fr))] gap-x-10 gap-y-7">
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
          <div className="hidden min-h-[30rem] w-[20rem] shrink-0 xl:block">
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
