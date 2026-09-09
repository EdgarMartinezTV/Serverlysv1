"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { billing } from "@/data/company";
import { primaryNav, isActiveItem, isActivePath } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/layout/wordmark";
import { MegaPanel, panelLinks } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

/**
 * Sticky site header.
 *
 * Owns which panel is open (exactly one at a time), the scrolled state, and
 * top-level keyboard navigation. The panels themselves handle intra-panel keys.
 *
 * Pointer contract:
 *   · Hover opens — but ONLY for a mouse. On touch, `pointerenter` fires just
 *     before `click`, so hover-to-open would open the panel and the click would
 *     immediately close it. Guarding on pointerType fixes that class of bug.
 *   · A short close delay lets the pointer travel diagonally from trigger to
 *     panel without the panel vanishing underneath it.
 *
 * Layering: header z-50 · panel z-10 within the header · mobile drawer z-40,
 * i.e. below the header so its own close button stays reachable.
 */
export function SiteHeader() {
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const pathname = usePathname();
  const baseId = useId();

  // Close on navigation. Adjusted during render, not in an effect, so the
  // stale-open panel never paints after a route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
  }

  // Elevation once the page has moved — grounds the sticky bar without a
  // permanent shadow competing with the content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dismiss on an outside pointer press.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(null), 150);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  const closePanel = useCallback((label: string, restoreFocus: boolean) => {
    setOpen(null);
    if (restoreFocus) triggerRefs.current[label]?.focus();
  }, []);

  /** Open via keyboard: move focus into the panel once it has rendered. */
  const openAndFocus = useCallback((label: string) => {
    setOpen(label);
    requestAnimationFrame(() => {
      panelLinks(panelRefs.current[label] ?? null)[0]?.focus();
    });
  }, []);

  /** Left/Right move between top-level triggers, as in a menubar. */
  const moveTrigger = useCallback((currentLabel: string, delta: 1 | -1) => {
    const labels = primaryNav.map((i) => i.label);
    const i = labels.indexOf(currentLabel);
    const next = labels[(i + delta + labels.length) % labels.length];
    const el = triggerRefs.current[next];
    if (el) {
      el.focus();
    } else {
      // The target is a plain link (e.g. Pricing), not a disclosure trigger.
      headerRef.current
        ?.querySelector<HTMLElement>(`[data-nav-link="${next}"]`)
        ?.focus();
    }
    setOpen(null);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 bg-canvas/85 backdrop-blur-md",
        "transition-shadow duration-normal ease-hover",
        scrolled ? "shadow-e2 ring-1 ring-line" : "ring-1 ring-line-subtle",
      )}
      onBlur={(e) => {
        // Focus left the header entirely (Tab past the last panel link).
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-desktop items-center gap-2 px-5 sm:px-8 lg:px-10">
        <Wordmark tone="dark" priority />

        <nav
          aria-label="Main"
          /* `relative h-16` makes the nav the positioning context for wide
             panels, and gives them a `top-full` that lands exactly on the
             header's bottom edge. */
          className="relative ml-6 hidden h-16 lg:flex lg:items-center lg:gap-0.5"
        >
          {primaryNav.map((item, index) => {
            const active = isActiveItem(item, pathname);

            // Plain link (no panel).
            if (!("columns" in item) || !item.columns) {
              const href = (item as { href: string }).href;
              const target = resolveNavTarget(href);
              return (
                <Link
                  key={item.label}
                  href={target.href}
                  data-nav-link={item.label}
                  aria-current={isActivePath(href, pathname) ? "page" : undefined}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      moveTrigger(item.label, 1);
                    } else if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      moveTrigger(item.label, -1);
                    }
                  }}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-small font-medium transition-colors duration-fast",
                    active
                      ? "text-primary"
                      : "text-fg-secondary hover:bg-canvas-inset hover:text-fg",
                  )}
                >
                  {item.label}
                  {active && <ActiveMarker />}
                </Link>
              );
            }

            const panelId = `${baseId}-panel-${index}`;
            const triggerId = `${baseId}-trigger-${index}`;
            const isOpen = open === item.label;
            // A multi-column panel anchors to the <nav> so it cannot overflow
            // either viewport edge; a single-column dropdown is narrow enough
            // to anchor to its own trigger, which reads better.
            const wide = item.columns.length > 1 || Boolean(item.feature);

            return (
              <div
                key={item.label}
                className={wide ? undefined : "relative"}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  cancelClose();
                  setOpen(item.label);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== "mouse") return;
                  scheduleClose();
                }}
              >
                <button
                  ref={(el) => {
                    triggerRefs.current[item.label] = el;
                  }}
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => (isOpen ? setOpen(null) : setOpen(item.label))}
                  onKeyDown={(e) => {
                    switch (e.key) {
                      case "ArrowDown":
                        e.preventDefault();
                        openAndFocus(item.label);
                        break;
                      case "ArrowRight":
                        e.preventDefault();
                        moveTrigger(item.label, 1);
                        break;
                      case "ArrowLeft":
                        e.preventDefault();
                        moveTrigger(item.label, -1);
                        break;
                      case "Escape":
                        if (isOpen) {
                          e.preventDefault();
                          closePanel(item.label, true);
                        }
                        break;
                    }
                  }}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-md px-3 py-2 text-small font-medium transition-colors duration-fast",
                    isOpen
                      ? "bg-canvas-inset text-fg"
                      : active
                        ? "text-primary"
                        : "text-fg-secondary hover:bg-canvas-inset hover:text-fg",
                  )}
                >
                  {item.label}
                  <Chevron open={isOpen} />
                  {active && !isOpen && <ActiveMarker />}
                </button>

                <MegaPanel
                  id={panelId}
                  labelledBy={triggerId}
                  open={isOpen}
                  columns={item.columns}
                  feature={item.feature}
                  registerPanel={(el) => {
                    panelRefs.current[item.label] = el;
                  }}
                  onClose={(restore) => closePanel(item.label, restore)}
                  onNavigate={() => setOpen(null)}
                />
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Wrapped rather than given `hidden` directly: overriding `display`
              on Button collides with its base `inline-flex`. */}
          <span className="hidden sm:block">
            <Button href={billing.login} variant="ghost" size="sm">
              Log in
            </Button>
          </span>
          <Button href={billing.store("cloud-hosting")} size="sm">
            Get started
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

/** Underline marking the current section. Decorative — `aria-current` is the
    programmatic signal, so this is hidden from assistive tech. */
function ActiveMarker() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
    />
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={cn(
        "h-3 w-3 text-fg-muted transition-transform duration-normal ease-hover",
        open && "rotate-180",
      )}
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
