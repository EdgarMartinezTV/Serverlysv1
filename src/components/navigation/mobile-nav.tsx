"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SeraOpenButton } from "@/components/sera/sera-open-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  primaryNav,
  isActivePath,
  type MegaItem,
  type NavItem,
} from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { billing, company } from "@/data/company";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/layout/wordmark";
import { NavIcon, Chevron, ArrowUpRight } from "./nav-icons";
import { cn } from "@/lib/utils";

/**
 * Mobile navigation.
 *
 * A dedicated experience, not the mega menu scaled down: top-level sections
 * expand into their categories, and each category lists its items with the same
 * icon, title and description the desktop panel shows.
 *
 * FULL-VIEWPORT and PORTALLED to <body>, for two reasons that are not
 * cosmetic: the header uses backdrop-filter, which makes it a containing block
 * for fixed descendants; and the announcement bar means the header is not at
 * the viewport top. Portalling escapes both. Because it covers the header, it
 * carries its own.
 *
 * Sections animate with grid-template-rows 0fr→1fr — intrinsic height, no JS
 * measurement, no layout jump. Collapsed sections are `inert`, so their links
 * leave the tab order entirely.
 */
export function MobileNav({
  overlay = false,
  open,
  onOpenChange,
}: {
  overlay?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Collapse sections on navigation — adjusted during render, not in an
  // effect. Closing the drawer itself is SiteHeader's job: it owns `open`.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setExpanded(null);
  }

  /*
   * Above lg the drawer is hidden by CSS, but `open` would stay true — scroll
   * locked, focus trap listening — until reload. Rotating a tablet to
   * landscape with the menu open is enough to get there, so widening closes it.
   */
  useEffect(() => {
    if (!open) return;
    const wide = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (wide.matches) onOpenChange(false);
    };
    onChange();
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const drawer = (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      {/* Any link closes the drawer. A route change would too, but a link to
          the page already open changes nothing, and left it covering the page. */}
      <div
        ref={panelRef}
        tabIndex={-1}
        id="mobile-nav-panel"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a[href]")) onOpenChange(false);
        }}
        className="absolute inset-0 flex flex-col bg-canvas-abyss outline-none motion-safe:animate-[sheetIn_220ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line-on-dark px-5 sm:px-8">
          <Wordmark tone="light" />
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              toggleRef.current?.focus();
            }}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-fg-on-dark-secondary transition-colors duration-fast hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
              <path
                d="m5 5 10 10M15 5 5 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-2 sm:px-8"
        >
          <ul className="flex flex-col divide-y divide-line-on-dark">
            {primaryNav.map((item) => {
              if (!item.categories) {
                const target = resolveNavTarget(item.href);
                const active = isActivePath(item.href, pathname);
                return (
                  <li key={item.label}>
                    <Link
                      href={target.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 items-center text-body-lg font-semibold",
                        active ? "text-primary-on-dark" : "text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              const isExpanded = expanded === item.label;
              const sectionId = `mnav-${item.label}`;

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={sectionId}
                    onClick={() => setExpanded(isExpanded ? null : item.label)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 text-left text-body-lg font-semibold text-white"
                  >
                    {item.label}
                    <Chevron
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 text-fg-on-dark-muted transition-transform duration-normal ease-hover",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </button>

                  <div
                    id={sectionId}
                    inert={!isExpanded}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-slow ease-hover",
                      isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-4">
                        {(
                          item as Extract<NavItem, { categories: unknown }>
                        ).categories.map((category) => (
                          <div key={category.id} className="pb-3">
                            <p className="flex items-center gap-2 pb-2 text-micro text-fg-on-dark-muted font-semibold">
                              <NavIcon name={category.icon} className="h-3.5 w-3.5" />
                              {category.label}
                            </p>
                            <ul className="flex flex-col gap-0.5">
                              {category.groups
                                .flatMap((g) => g.items)
                                .map((entry) => (
                                  <li key={entry.label}>
                                    <MobileItem item={entry} pathname={pathname} />
                                  </li>
                                ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-7 flex flex-col gap-3">
            {/*
              Matches the desktop header. `onOpen` closes the drawer first —
              opening the chat panel behind an open full-screen drawer would
              put it somewhere the visitor cannot see it.
            */}
            <SeraOpenButton onDark block onOpen={() => onOpenChange(false)} />
            <Button href={billing.login} variant="inverseOutline" size="lg" block>
              Client login
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-line-on-dark pt-5">
            <span className="flex items-center gap-2 text-small text-fg-on-dark-muted">
              <span
                aria-hidden="true"
                className="flex h-4 w-4 items-center justify-center rounded-full text-micro font-bold text-white ring-1 ring-inset ring-white/25"
              >
                E
              </span>
              English
            </span>
            <a
              href={company.phoneHref}
              className="tabular text-small text-fg-on-dark-secondary underline underline-offset-4"
            >
              {company.phone}
            </a>
          </div>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-fast lg:hidden",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          overlay
            ? "text-fg-on-dark-secondary hover:bg-white/10 hover:text-white focus-visible:outline-white"
            : "text-fg-secondary hover:bg-canvas-inset hover:text-fg focus-visible:outline-primary",
        )}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
          <path
            d="M3 6h14M3 10h14M3 14h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && createPortal(drawer, document.body)}
    </>
  );
}

function MobileItem({ item, pathname }: { item: MegaItem; pathname: string }) {
  const target = resolveNavTarget(item.href);
  const interactive = item.external || target.mode === "link";
  const active = !item.external && isActivePath(item.href, pathname);

  const inner = (
    <span className="flex min-h-12 items-start gap-3 py-2">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-fg-on-dark-secondary ring-1 ring-inset ring-white/10"
      >
        <NavIcon name={item.icon} className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "text-small font-medium",
              active
                ? "text-primary-on-dark"
                : interactive
                  ? "text-white"
                  : "text-fg-on-dark-secondary",
            )}
          >
            {item.label}
          </span>
          {item.badge && (
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-micro leading-4 text-fg-on-dark-muted font-semibold">
              {item.badge.text}
            </span>
          )}
          {item.external && (
            <span aria-hidden="true" className="text-fg-on-dark-muted">
              <ArrowUpRight className="h-3 w-3" />
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-caption leading-snug text-fg-on-dark-muted">
          {item.description}
        </span>
      </span>
    </span>
  );

  if (!interactive) return <span>{inner}</span>;
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={target.href} aria-current={active ? "page" : undefined}>
      {inner}
    </Link>
  );
}
