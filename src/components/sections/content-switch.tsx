"use client";

import { useRef, useState } from "react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { NavIcon } from "@/components/navigation/nav-icons";
import type { NavIconName } from "@/data/navigation";
import { cn } from "@/lib/utils";

export type SwitchItem = {
  label: string;
  body: string;
  icon: NavIconName;
  /** Replaces the shared visual while this item is selected. */
  visual?: React.ReactNode;
};

/**
 * Content switch — a vertical list of topics beside one panel that swaps.
 *
 * The reference uses this three times on its WordPress page, which is why it is
 * a component rather than three hand-built bands.
 *
 * A real WAI-ARIA tablist, not a list of buttons that happen to toggle: Up and
 * Down move between tabs, Home and End jump to the ends, and roving tabindex
 * means Tab leaves the group instead of stepping through every topic. Selection
 * follows focus, which is correct here because switching is instant and has no
 * cost — there is nothing to load and nothing to undo.
 *
 * `visual` is optional per item AND at the band level. Where an item brings its
 * own, it replaces the shared one; where it does not, the shared visual stays
 * put rather than blanking, because a panel that empties on some tabs reads as
 * broken rather than as deliberate.
 */
export function ContentSwitch({
  eyebrow,
  title,
  lede,
  items,
  visual,
  cta,
  side = "right",
  surface = "light",
  id,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  items: readonly SwitchItem[];
  /** Shared panel content, used by any item without its own. */
  visual?: React.ReactNode;
  cta?: { label: string; href: string };
  side?: "left" | "right";
  surface?: "light" | "subtle" | "dark";
  id?: string;
}) {
  const [index, setIndex] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const dark = surface === "dark";
  const active = items[index] ?? items[0];

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = items.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    tabs.current[next]?.focus();
  };

  const headingId = id ? `${id}-heading` : undefined;

  return (
    <Section id={id} surface={surface} spacing="base" width="wide" labelledBy={headingId}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        id={headingId}
        tone={dark ? "dark" : "light"}
      />

      <div
        className={cn(
          "mt-12 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14",
          side === "left" && "lg:[&>*:first-child]:order-2",
        )}
      >
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label={title}
          onKeyDown={onKeyDown}
          className={cn("flex flex-col", dark ? "divide-line-on-dark" : "divide-line-subtle", "divide-y")}
        >
          {items.map((item, i) => {
            const selected = i === index;
            return (
              <button
                key={item.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`${id}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setIndex(i)}
                className={cn(
                  "flex items-start gap-3.5 px-2 py-5 text-left transition-colors duration-fast",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  dark
                    ? "focus-visible:outline-primary-on-dark"
                    : "focus-visible:outline-primary",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-fast",
                    selected
                      ? dark
                        ? "bg-primary/25 text-primary-on-dark"
                        : "bg-primary-soft text-primary"
                      : dark
                        ? "bg-white/8 text-fg-on-dark-muted"
                        : "bg-canvas-inset text-fg-muted",
                  )}
                >
                  <NavIcon name={item.icon} />
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-h4 transition-colors duration-fast",
                      selected
                        ? dark
                          ? "text-white"
                          : "text-fg"
                        : dark
                          ? "text-fg-on-dark-secondary"
                          : "text-fg-secondary",
                    )}
                  >
                    {item.label}
                  </span>
                  {/* The body belongs to the OPEN topic only. Showing all four
                      at once turns the switch into a plain list and removes the
                      reason it exists. */}
                  <span
                    className={cn(
                      "block overflow-hidden text-body transition-all duration-normal ease-hover",
                      dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
                      selected ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    {item.body}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${index}`}
          tabIndex={0}
          className="min-w-0 outline-none"
        >
          {active.visual ?? visual}
        </div>
      </div>

      {cta && (
        <div className="mt-10">
          <Button href={cta.href} variant={dark ? "inverse" : "primary"} size="lg">
            {cta.label}
          </Button>
        </div>
      )}
    </Section>
  );
}
