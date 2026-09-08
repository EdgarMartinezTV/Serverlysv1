"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, type NavItem, type NavLink } from "@/data/navigation";
import { billing } from "@/data/company";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wordmark } from "./wordmark";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

/**
 * Sticky site header with an accessible mega menu.
 *
 * Interaction contract:
 *   - Pointer: hover opens, with a short close delay so diagonal travel from
 *     the trigger to the panel does not dismiss it.
 *   - Keyboard: the trigger is a real <button aria-expanded aria-controls>.
 *     Enter/Space toggles, Escape closes and returns focus to the trigger.
 *   - Focus leaving the header group closes the panel.
 *   - Route change closes everything.
 */
export function SiteHeader() {
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pathname = usePathname();
  const baseId = useId();

  // Close on navigation. Adjusted during render rather than in an effect:
  // an effect here would render the stale-open panel first, then immediately
  // re-render to close it. See react.dev "You Might Not Need an Effect".
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
  }

  // Subtle border/shadow once the page has moved — grounds the sticky bar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dismiss on outside pointer press.
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
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  const closeAndRestoreFocus = useCallback((label: string) => {
    setOpen(null);
    triggerRefs.current[label]?.focus();
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 bg-canvas/85 backdrop-blur-md transition-shadow duration-normal",
        scrolled ? "shadow-e2 ring-1 ring-line/70" : "ring-1 ring-line-subtle",
      )}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          closeAndRestoreFocus(open);
        }
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-2 px-5 sm:px-8 lg:px-10">
        <Wordmark tone="dark" priority />

        {/* Desktop navigation */}
        <nav
          aria-label="Main"
          className="ml-6 hidden lg:flex lg:items-center lg:gap-0.5"
        >
          {primaryNav.map((item) => {
            if (!("columns" in item) || !item.columns) {
              const link = item as Extract<NavItem, { href: string }>;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-small font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-fg-secondary hover:bg-canvas-inset hover:text-fg",
                  )}
                >
                  {link.label}
                </Link>
              );
            }

            const panelId = `${baseId}-${item.label}`;
            const isOpen = open === item.label;

            return (
              <div
                key={item.label}
                className="relative"
                onPointerEnter={() => {
                  cancelClose();
                  setOpen(item.label);
                }}
                onPointerLeave={scheduleClose}
              >
                <button
                  ref={(el) => {
                    triggerRefs.current[item.label] = el;
                  }}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : item.label)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-2 text-small font-medium transition-colors",
                    isOpen
                      ? "bg-canvas-inset text-fg"
                      : "text-fg-secondary hover:bg-canvas-inset hover:text-fg",
                  )}
                >
                  {item.label}
                  <Chevron open={isOpen} />
                </button>

                <MegaPanel
                  id={panelId}
                  open={isOpen}
                  columns={item.columns}
                  onNavigate={() => setOpen(null)}
                />
              </div>
            );
          })}
        </nav>

        {/* Right-hand actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Wrapped rather than given `hidden` directly: overriding `display`
              on the Button would collide with its base `inline-flex`. */}
          <span className="hidden sm:block">
            <Button href={billing.login} variant="ghost" size="sm">
              Log in
            </Button>
          </span>
          <Button href={billing.store("cloud-hosting")} variant="primary" size="sm">
            Get started
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
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

function MegaPanel({
  id,
  open,
  columns,
  onNavigate,
}: {
  id: string;
  open: boolean;
  columns: NonNullable<Extract<NavItem, { columns: unknown }>["columns"]>;
  onNavigate: () => void;
}) {
  return (
    <div
      id={id}
      // `hidden` (not just opacity) so links are removed from the tab order
      // and the accessibility tree when the panel is closed.
      hidden={!open}
      className="absolute left-0 top-full pt-2"
    >
      <div
        className={cn(
          "w-[min(44rem,calc(100vw-4rem))] rounded-xl bg-white p-2 shadow-e5 ring-1 ring-line",
          "grid gap-1",
          columns.length > 1 ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        {columns.map((col) => (
          <div key={col.heading} className="p-2">
            <p className="px-3 pb-2 text-caption font-mono uppercase text-fg-muted">
              {col.heading}
            </p>
            <ul className="flex flex-col">
              {col.links.map((link) => (
                <li key={link.label}>
                  <MegaLink link={link} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MegaLink({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  const soon = link.status === "soon";

  const content = (
    <>
      <span className="flex items-center gap-2">
        <span className="text-small font-medium text-fg group-hover:text-primary">
          {link.label}
        </span>
        {soon && <Badge tone="warning">Soon</Badge>}
        {link.external && (
          <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3 text-fg-muted">
            <path
              d="M4 2h6v6M10 2 3 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {link.description && (
        <span className="mt-0.5 block text-small leading-snug text-fg-muted">
          {link.description}
        </span>
      )}
    </>
  );

  const classes =
    "group block rounded-lg px-3 py-2.5 transition-colors hover:bg-canvas-secondary focus-visible:bg-canvas-secondary";

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={classes} onClick={onNavigate}>
      {content}
    </Link>
  );
}
