"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { stages, type StageId } from "./stages";
import { cn } from "@/lib/utils";

/**
 * The four stage bands, plus the rail that heads them.
 *
 * ── WHY THIS REPLACED THE OLD StageNav ──────────────────────────────────────
 *
 * The rail used to be a scroll-spy: four anchors that highlighted whichever
 * band you had scrolled to. That is the right behaviour on a desktop, where
 * all four bands are cheap to render and the rail is a shortcut. On a phone it
 * was the single most expensive thing on the page — the four bands measured
 * 7,453px of a 23,574px document, 32% of the whole homepage, and the rail sat
 * pinned above them costing another 120px while doing nothing a thumb could
 * use.
 *
 * Below `sm` the rail is now a TAB LIST and only the selected band is in flow.
 * The same 120px of chrome now switches between four panels instead of
 * narrating a scroll position, and the mobile document loses roughly 5,200px.
 * Nothing is hidden that was not already four screens below the fold.
 *
 * At `sm` and up NOTHING changes: every band renders, the rail goes back to
 * being anchors, and the scroll-spy runs exactly as it did.
 *
 * ── HOW VISIBILITY IS DRIVEN ────────────────────────────────────────────────
 *
 * By `data-inactive` on the panel wrapper plus a media query in globals.css,
 * NOT by a `hidden` class and not by conditional rendering. Three reasons, in
 * order of how badly each alternative failed:
 *
 *   1. NO LAYOUT SHIFT. The server has no viewport, so a `useState(false)`
 *      that flips to "mobile" after hydration would render all four bands,
 *      then collapse to one — a ~5,000px jump on first paint, on the exact
 *      device the change exists to help. The attribute ships in the HTML, so
 *      the first paint on a phone is already correct.
 *   2. STILL THERE FOR CRAWLERS. Conditional rendering would drop three
 *      quarters of the stage copy out of the mobile DOM. `display: none` keeps
 *      it in the document.
 *   3. STILL USABLE WITHOUT JS. The rail renders real `<a href="#grow">`
 *      anchors on the server. With scripting off, the `:has(:target)` rule in
 *      globals.css reveals whichever band you navigate to, so the rail
 *      degrades to what it always was. With scripting on we preventDefault and
 *      swap the attribute instead, so tapping a tab does not push a hash onto
 *      the history stack or scroll the page.
 */
export function StageDeck({
  panels,
}: {
  panels: Record<StageId, ReactNode>;
}) {
  const first = stages[0]!.id;

  /**
   * The tab selection. Only consulted below `sm`.
   *
   * ⚠ Initialised to the first stage and NOT to null. Null would mean "no
   * panel active", which on mobile means a blank 120px rail above nothing at
   * all until the visitor taps something.
   */
  const [selected, setSelected] = useState<StageId>(first);

  /**
   * The scroll-spy highlight, desktop only. Separate from `selected` on
   * purpose: they answer different questions ("which did you tap" vs "which
   * are you reading") and merging them made the desktop rail fight the mobile
   * one during a resize.
   */
  const [scrolled, setScrolled] = useState<StageId | null>(null);

  /** True below `sm`, where the rail is a tab list. */
  const [tabbed, setTabbed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639.98px)");
    const sync = () => setTabbed(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /*
   * Scroll-spy. Unchanged from the old StageNav, including the root margin and
   * the reason for it: a stage band is taller than the viewport, so it can
   * never cross a 0.5 threshold and a threshold-based observer would leave the
   * rail dead. The band collapses the viewport to a line just above the middle
   * and marks whichever section crosses it.
   *
   * It does not run while tabbed — with one panel in flow there is nothing to
   * spy on, and leaving it running made the pill flicker as the single visible
   * panel scrolled past the line.
   */
  useEffect(() => {
    if (tabbed) return;
    const targets = stages
      .map((stage) => document.getElementById(stage.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setScrolled(entry.target.id as StageId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [tabbed]);

  // Desktop shows the first stage as current until the reader scrolls into one,
  // so the control never renders with nothing selected.
  const current = tabbed ? selected : (scrolled ?? first);

  return (
    <div data-stage-deck="">
      <nav
        data-stage-rail=""
        aria-label="Stages"
        className="pointer-events-none sticky top-18 z-30 py-3"
      >
        <Container>
          <ul
            /* `role=tablist` only when it IS one. Announcing four anchors as
               tabs on a desktop, where they scroll rather than switch, would
               describe behaviour that is not there. */
            role={tabbed ? "tablist" : undefined}
            className="pointer-events-auto mx-auto grid w-full max-w-md grid-cols-4 gap-1 rounded-full bg-canvas/90 p-1.5 shadow-e3 ring-1 ring-line backdrop-blur-md sm:flex sm:w-fit sm:max-w-none sm:items-center"
          >
            {stages.map((stage) => {
              const active = current === stage.id;
              return (
                <li key={stage.id} className="min-w-0 sm:shrink-0" role={tabbed ? "presentation" : undefined}>
                  <a
                    href={`#${stage.id}`}
                    role={tabbed ? "tab" : undefined}
                    aria-selected={tabbed ? active : undefined}
                    aria-controls={tabbed ? `${stage.id}-panel` : undefined}
                    aria-current={!tabbed && active ? "true" : undefined}
                    onClick={(e) => {
                      if (!tabbed) return;
                      /* Swap the panel in place. Without preventDefault the
                         browser would also jump to the anchor, which on a tab
                         list means scrolling to a panel that is already under
                         your thumb. */
                      e.preventDefault();
                      setSelected(stage.id);
                    }}
                    className={cn(
                      /* min-h-11 = 44px, the platform minimum touch target, and
                         only below `sm`: with a mouse the 33px pill is the right
                         density, with a thumb it is not. Height alone clears it —
                         these pills are already wide enough. */
                      "flex min-h-11 w-full items-center justify-center rounded-full px-2 py-2 text-small font-semibold sm:inline-flex sm:w-auto sm:px-5 sm:text-body transition-colors duration-fast ease-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-0",
                      active
                        ? "bg-fg text-white"
                        : "text-fg hover:bg-canvas-secondary",
                    )}
                  >
                    {stage.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </Container>
      </nav>

      {stages.map((stage) => (
        <div
          key={stage.id}
          id={`${stage.id}-panel`}
          data-stage-panel=""
          /* Ships in the SSR HTML — see the note above on layout shift. The
             media query in globals.css is what makes it mean anything, so this
             attribute is inert at `sm` and up. */
          data-inactive={selected === stage.id ? undefined : ""}
        >
          {panels[stage.id]}
        </div>
      ))}
    </div>
  );
}
