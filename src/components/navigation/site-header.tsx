"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { billing } from "@/data/company";
import { primaryNav, isActiveItem, isActivePath } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/layout/wordmark";
import { MegaMenu, panelLinks } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { LanguageSelector } from "./language-selector";
import { AccountButton } from "./account-button";
import { Chevron } from "./nav-icons";
import { cn } from "@/lib/utils";

/**
 * Site header.
 *
 * Owns which mega menu is open, the scrolled state, and top-level keyboard
 * navigation. The panel handles its own rail and content keys.
 *
 * SURFACE: the header is dark whenever a menu is open, and on routes whose
 * hero is a dark band. Opening a menu therefore puts the whole top of the page
 * into one dark field with the panel — the relationship shown in the target —
 * rather than floating a dark panel under a white bar.
 *
 * LAYERING: backdrop z-40 → header z-50 → panel z-10 within the header. The
 * backdrop is rendered as a SIBLING of <header>, not a child: the header uses
 * backdrop-blur, which would become a containing block for a fixed child and
 * trap it inside the 64px bar.
 *
 * POINTER: hover opens for a mouse only. On touch, `pointerenter` fires
 * immediately before `click`, so hover-to-open would open then instantly close
 * the panel. A short close delay lets the pointer travel to the panel.
 */
const OVERLAY_ROUTES = new Set(["/", "/cloud-hosting"]);

export function SiteHeader() {
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const pathname = usePathname();
  const baseId = useId();

  // Close on navigation — adjusted during render, not in an effect, so a stale
  // panel never paints after a route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
  }

  const dark = open !== null || (OVERLAY_ROUTES.has(pathname) && !scrolled);
  const transparent = open === null && OVERLAY_ROUTES.has(pathname) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  const closePanel = useCallback((label: string, restoreFocus: boolean) => {
    setOpen(null);
    if (restoreFocus) triggerRefs.current[label]?.focus();
  }, []);

  /** Keyboard open: move focus into the panel once it has rendered. */
  const openAndFocus = useCallback((label: string) => {
    setOpen(label);
    requestAnimationFrame(() => {
      panelLinks(panelRefs.current[label] ?? null)[0]?.focus();
    });
  }, []);

  const moveTrigger = useCallback((currentLabel: string, delta: 1 | -1) => {
    const labels = primaryNav.map((i) => i.label);
    const i = labels.indexOf(currentLabel);
    const next = labels[(i + delta + labels.length) % labels.length];
    const el =
      triggerRefs.current[next] ??
      headerRef.current?.querySelector<HTMLElement>(`[data-nav-link="${next}"]`);
    el?.focus();
    setOpen(null);
  }, []);

  return (
    <>
      {/* Page dimming. Sibling of <header> — see LAYERING above. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(null)}
        className={cn(
          "fixed inset-0 z-40 bg-canvas-abyss/55 transition-opacity duration-normal ease-hover",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow] duration-normal ease-hover",
          transparent && "bg-transparent",
          !transparent && dark && "bg-canvas-abyss",
          !dark && "bg-canvas/85 backdrop-blur-md",
          !dark && scrolled && "shadow-e2 ring-1 ring-line",
          !dark && !scrolled && "ring-1 ring-line-subtle",
          open && "shadow-e5",
        )}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
        }}
      >
        {/* `relative` so mega panels span the CONTAINER, not their trigger. */}
        <div className="relative mx-auto flex h-16 w-full max-w-desktop items-center gap-2 px-5 sm:px-8 lg:px-10">
          <Wordmark tone={dark ? "light" : "dark"} priority />

          <nav
            aria-label="Main"
            className="ml-7 hidden lg:flex lg:items-center lg:gap-0.5"
          >
            {primaryNav.map((item, index) => {
              const active = isActiveItem(item, pathname);

              if (!item.categories) {
                const target = resolveNavTarget(item.href);
                return (
                  <Link
                    key={item.label}
                    href={target.href}
                    data-nav-link={item.label}
                    aria-current={
                      isActivePath(item.href, pathname) ? "page" : undefined
                    }
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
                      "rounded-lg px-3 py-2 text-small font-medium transition-colors duration-fast",
                      dark
                        ? "text-fg-on-dark-secondary hover:bg-white/10 hover:text-white"
                        : active
                          ? "text-primary"
                          : "text-fg-secondary hover:bg-canvas-inset hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              const panelId = `${baseId}-panel-${index}`;
              const triggerId = `${baseId}-trigger-${index}`;
              const isOpen = open === item.label;

              return (
                <div
                  key={item.label}
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
                    onClick={() => setOpen(isOpen ? null : item.label)}
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
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-small font-medium transition-colors duration-fast",
                      dark
                        ? isOpen
                          ? "bg-white/10 text-white"
                          : "text-fg-on-dark-secondary hover:bg-white/10 hover:text-white"
                        : isOpen
                          ? "bg-canvas-inset text-fg"
                          : active
                            ? "text-primary"
                            : "text-fg-secondary hover:bg-canvas-inset hover:text-fg",
                    )}
                  >
                    {item.label}
                    <Chevron
                      className={cn(
                        "h-2.5 w-2.5 transition-transform duration-normal ease-hover",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  <MegaMenu
                    railLabel={item.railLabel}
                    categories={item.categories}
                    panelId={panelId}
                    labelledBy={triggerId}
                    open={isOpen}
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

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <span className="hidden sm:block">
              <Button
                href={billing.store("cloud-hosting")}
                variant={dark ? "inverse" : "primary"}
                size="sm"
              >
                Get started
              </Button>
            </span>
            <span className="hidden md:block">
              <LanguageSelector onDark={dark} />
            </span>
            <span className="hidden sm:block">
              <AccountButton onDark={dark} />
            </span>
            <MobileNav overlay={dark} open={mobileOpen} onOpenChange={setMobileOpen} />
          </div>
        </div>
      </header>
    </>
  );
}
