"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSitePathname } from "@/i18n/use-site-pathname";
import {
  primaryNav,
  isActivePath,
  type MegaCategory,
  type MegaItem,
} from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { billing } from "@/data/company";
import { Wordmark } from "@/components/layout/wordmark";
import { NavIcon, Chevron, ArrowUpRight } from "./nav-icons";
import { cn } from "@/lib/utils";
import { t as tx } from "@/i18n/t";
import { lh } from "@/i18n/href";
import { LocalePanel, LocaleTrigger } from "./language-selector";

/**
 * Mobile navigation, laid out on hostinger.com's mobile menu (measured at
 * 390px on 2026-11-17): a white sheet under the announcement bar with the
 * logo and a close button; Pricing; the PRODUCTS group (icon, label, small
 * chevron); then Solutions and Resources as single rows. Each opens a screen
 * titled "‹ NAME" listing items as title + one line, groups split by a rule.
 * Locale and "My account" sit in a bar at the bottom.
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
  const pathname = useSitePathname();
  const [langOpen, setLangOpen] = useState(false);
  // Where the sheet starts: under the announcement bar while it is on screen,
  // as on hostinger.com. Measured when the menu opens.
  const [top, setTop] = useState(0);
  const langListId = useId();

  // Collapse sections on navigation — adjusted during render, not in an
  // effect. Closing the drawer itself is SiteHeader's job: it owns `open`.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setExpanded(null);
  }
  // Reopening starts at the root screen, not the category left open last time.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) {
      setExpanded(null);
      setLangOpen(false);
    }
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
    // The chat launcher floats over the bottom-right corner, where the
    // sheet's "My account" sits; hide it while the menu is open.
    const chat = document.getElementById("convoai-widget-host");
    chat?.style.setProperty("visibility", "hidden");
    return () => {
      document.body.style.overflow = previous;
      chat?.style.removeProperty("visibility");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (langOpen) {
          setLangOpen(false);
          return;
        }
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
  }, [open, onOpenChange, langOpen]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const screen = expanded ? findScreen(expanded) : null;

  const drawer = (
    <div
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      style={{ top }}
      role="dialog"
      aria-modal="true"
      aria-label={tx("Site menu")}
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
        className="absolute inset-0 flex flex-col overflow-hidden bg-white font-display text-[#1d1e20] outline-none motion-safe:animate-[sheetIn_220ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* hostinger.com: logo left, close right, on every screen; "back"
            lives in the screen itself, as its small uppercase title. */}
        <div className="flex h-[58px] shrink-0 items-center justify-between px-6">
          {/* Wordmark pins itself to the top of a flex row (self-start); the
              wrapper is what the row centres, level with the close button. */}
          <div className="flex">
            <Wordmark tone="dark" className="h-8" />
          </div>
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              toggleRef.current?.focus();
            }}
            aria-label={tx("Close menu")}
            className="-mr-2.5 inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-fast hover:bg-[#f2f3f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-6 w-6">
              <path d="m4.5 4.5 11 11M15.5 4.5l-11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="relative flex-1">
          {/* ROOT: Pricing; the PRODUCTS group with icons; then each other
              menu as one row that opens its own screen. */}
          <nav
            aria-label={tx("Mobile")}
            inert={!!screen}
            className={cn(
              "absolute inset-0 overflow-y-auto overscroll-contain px-6 pb-8 transition-transform duration-slow ease-hover",
              screen && "-translate-x-full",
            )}
          >
            <ul className="border-b border-[#dadce0] py-3">
              {primaryNav
                .filter((item) => !item.categories)
                .map((item) => {
                  const target = resolveNavTarget(item.href);
                  const active = isActivePath(item.href, pathname);
                  return (
                    <li key={item.label}>
                      <Link
                        href={lh(target.href)}
                        aria-current={active ? "page" : undefined}
                        className={cn("flex h-12 items-center text-[17px] leading-6", active && "text-primary")}
                      >
                        {tx(item.label)}
                      </Link>
                    </li>
                  );
                })}
            </ul>

            {primaryNav
              .filter((item) => item.categories && item.label === "Products")
              .map((item) => (
                <section key={item.label} className="border-b border-[#dadce0] py-4">
                  <h2 className="pb-2 text-[12px] leading-5 font-semibold tracking-[0.04em] text-[#36344d] uppercase">
                    {tx(item.railLabel)}
                  </h2>
                  <ul>
                    {item.categories!.map((c) => (
                      <li key={c.id}>
                        <Row onClick={() => setExpanded(`cat::${c.id}`)} icon={c.icon}>
                          {tx(c.label)}
                        </Row>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

            <ul className="py-3">
              {primaryNav
                .filter((item) => item.categories && item.label !== "Products")
                .map((item) => (
                  <li key={item.label}>
                    <Row onClick={() => setExpanded(`sec::${item.label}`)}>{tx(item.label)}</Row>
                  </li>
                ))}
            </ul>
          </nav>

          {/* SUB SCREEN — slides in from the right: "‹ TITLE", then the items
              (title + one line), groups split by a rule and a small heading. */}
          <div
            inert={!screen}
            aria-hidden={!screen}
            className={cn(
              "absolute inset-0 overflow-y-auto overscroll-contain px-6 pb-10 transition-transform duration-slow ease-hover",
              screen ? "translate-x-0" : "translate-x-full",
            )}
          >
            {screen && (
              <>
                <button
                  type="button"
                  onClick={() => setExpanded(null)}
                  className="-ml-1 flex h-11 items-center gap-2 pr-2 text-[12px] leading-5 font-semibold tracking-[0.04em] text-[#36344d] uppercase focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Chevron className="h-4 w-4 rotate-90" />
                  <span className="sr-only">{tx("Back")}: </span>
                  {tx(screen.title)}
                </button>
                {screen.groups.map((g, i) => (
                  <section key={`${g.heading}-${i}`} className={cn(i > 0 && "mt-3 border-t border-[#dadce0] pt-5")}>
                    {i > 0 && (
                      <h3 className="mb-1 text-[12px] leading-5 font-semibold tracking-[0.04em] text-[#36344d] uppercase">
                        {tx(g.heading)}
                      </h3>
                    )}
                    <ul>
                      {g.items.map((entry) => (
                        <li key={entry.label}>
                          <MobileItem item={tx(entry)} pathname={tx(pathname)} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </>
            )}
          </div>

          {/* LANGUAGE SHEET — hostinger.com's mobile locale picker: the
              desktop panel as a full-height sheet over the menu. */}
          {langOpen && (
            <div className="absolute inset-0 z-10 flex flex-col bg-white motion-safe:animate-[localeSheetIn_200ms_cubic-bezier(0.16,1,0.3,1)]">
              <LocalePanel id={langListId} autoFocusSearch onPicked={() => setLangOpen(false)} className="flex-1 px-4 sm:px-8" />
            </div>
          )}
        </div>

        {/* Bottom bar, as on hostinger.com: locale left, account right. */}
        <div className="flex h-[64px] shrink-0 items-center justify-between border-t border-[#dadce0] px-4">
          <LocaleTrigger open={langOpen} controls={langListId} onClick={() => setLangOpen((v) => !v)} />
          <a
            href={lh(billing.login)}
            className="flex h-10 items-center gap-2 rounded-full px-3 text-[14px] leading-6 font-semibold hover:bg-[#f2f3f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="8.5" r="3.5" />
              <path d="M5 19.5a7 7 0 0 1 14 0" />
            </svg>
            {tx("My account")}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => {
          if (!open) {
            const header = toggleRef.current?.closest("header");
            setTop(Math.max(0, Math.round(header?.getBoundingClientRect().top ?? 0)));
          }
          onOpenChange(!open);
        }}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? tx("Close menu") : tx("Open menu")}
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

      {open && tx(createPortal(drawer, document.body))}
    </>
  );
}

/**
 * `expanded` is "cat::<product category id>" for a product screen, or
 * "sec::<menu label>" for a whole menu (Solutions, Resources) on one screen,
 * each of its categories becoming a group as on hostinger.com.
 */
function findScreen(key: string): { title: string; groups: ReadonlyArray<{ heading: string; items: readonly MegaItem[] }> } | null {
  const [kind, id] = key.split("::");
  if (kind === "cat") {
    const products = primaryNav.find((i) => i.label === "Products");
    const c = products?.categories?.find((x) => x.id === id);
    return c ? { title: c.label, groups: c.groups } : null;
  }
  const item = primaryNav.find((i) => i.label === id);
  if (!item?.categories) return null;
  return {
    title: item.label,
    groups: item.categories.flatMap((c: MegaCategory) =>
      c.groups.map((g, j) => ({ heading: j === 0 ? c.label : g.heading, items: g.items })),
    ),
  };
}

/** A root row: optional icon, label, small grey chevron. */
function Row({ onClick, icon, children }: { onClick: () => void; icon?: MegaCategory["icon"]; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center gap-3 text-left text-[17px] leading-6 focus-visible:outline-2 focus-visible:outline-primary"
    >
      {icon && <NavIcon name={icon} className="h-5 w-5 shrink-0" />}
      <span className="flex-1">{children}</span>
      <Chevron className="h-4 w-4 shrink-0 -rotate-90 text-[#6d7081]" />
    </button>
  );
}

function MobileItem({ item, pathname }: { item: MegaItem; pathname: string }) {
  const target = resolveNavTarget(item.href);
  const interactive = item.external || target.mode === "link";
  const active = !item.external && isActivePath(item.href, pathname);

  const inner = (
    <span className="-mx-2 block rounded-lg px-2 py-2.5 active:bg-[#f2f3f6]">
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "text-[16px] leading-6 font-medium",
            active ? "text-primary" : interactive ? "text-[#1d1e20]" : "text-fg-muted",
          )}
        >
          {tx(item.label)}
        </span>
        {item.badge && (
          <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-micro leading-4 font-semibold text-primary ring-1 ring-inset ring-brand-100">
            {tx(item.badge.text)}
          </span>
        )}
        {item.external && (
          <span aria-hidden="true" className="text-fg-muted">
            <ArrowUpRight className="h-3 w-3" />
          </span>
        )}
      </span>
      <span className="mt-0.5 block text-[14px] leading-5 text-[#6d7081]">{tx(item.description)}</span>
    </span>
  );

  if (!interactive || item.linkable === false) return <span>{tx(inner)}</span>;
  if (item.external) {
    return (
      <a href={lh(item.href)} target="_blank" rel="noopener noreferrer">
        {tx(inner)}
      </a>
    );
  }
  return (
    <Link href={lh(target.href)} aria-current={active ? "page" : undefined}>
      {tx(inner)}
    </Link>
  );
}
