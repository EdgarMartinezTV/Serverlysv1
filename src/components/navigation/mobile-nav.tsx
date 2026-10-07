"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SeraOpenButton } from "@/components/sera/sera-open-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  primaryNav,
  isActivePath,
  type MegaCategory,
  type MegaItem,
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
  // Reopening starts at the root screen, not the category left open last time.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setExpanded(null);
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

  const drill = expanded ? findCategory(expanded) : null;

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
        className="absolute inset-0 flex flex-col overflow-hidden bg-canvas font-display outline-none motion-safe:animate-[sheetIn_220ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-8">
          {drill ? (
            <button
              type="button"
              onClick={() => setExpanded(null)}
              className="-ml-2 inline-flex h-11 items-center gap-1.5 rounded-lg px-2 text-body font-medium text-fg focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Chevron className="h-5 w-5 rotate-90" />
              Back
            </button>
          ) : (
            <Wordmark tone="dark" className="h-10" />
          )}
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              toggleRef.current?.focus();
            }}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-fg transition-colors duration-fast hover:bg-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-6 w-6">
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

        <div className="relative flex-1">
          {/* ROOT — the reference's drill-down: top-level links, then each
              menu's categories as large rows that open their own screen. */}
          <nav
            aria-label="Mobile"
            inert={!!drill}
            className={cn(
              "absolute inset-0 overflow-y-auto overscroll-contain px-5 pb-8 sm:px-8 transition-transform duration-slow ease-hover",
              drill && "-translate-x-full",
            )}
          >
            {primaryNav.map((item, i) => {
              if (!item.categories) {
                const target = resolveNavTarget(item.href);
                const active = isActivePath(item.href, pathname);
                return (
                  <div key={item.label} className={cn("border-b border-line", i > 0 && "pt-2")}>
                    <Link
                      href={target.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-16 items-center text-[18px] leading-6",
                        active ? "text-primary" : "text-fg",
                      )}
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              }
              return (
                <section key={item.label} className="border-b border-line py-5">
                  <h2 className="pb-2 text-small font-semibold uppercase tracking-[0.02em] text-fg-secondary">
                    {item.railLabel}
                  </h2>
                  <ul>
                    {item.categories.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setExpanded(`${item.label}::${c.id}`)}
                          className="flex min-h-14 w-full items-center gap-4 text-left text-[18px] leading-6 text-fg focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <NavIcon name={c.icon} className="h-6 w-6 shrink-0" />
                          <span className="flex-1">{c.label}</span>
                          <Chevron className="h-5 w-5 shrink-0 -rotate-90" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}

            <div className="mt-7 flex flex-col gap-3">
              {/*
                Matches the desktop header. `onOpen` closes the drawer first —
                opening the chat panel behind an open full-screen drawer would
                put it somewhere the visitor cannot see it.
              */}
              <SeraOpenButton block onOpen={() => onOpenChange(false)} />
              <Button href={billing.login} variant="secondary" size="lg" block>
                Client login
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
              <span className="flex items-center gap-2 text-small text-fg-secondary">
                <span
                  aria-hidden="true"
                  className="flex h-4 w-4 items-center justify-center rounded-full text-micro font-bold text-fg ring-1 ring-inset ring-line-strong"
                >
                  E
                </span>
                English
              </span>
              <a
                href={company.phoneHref}
                className="tabular text-small text-fg-secondary underline underline-offset-4"
              >
                {company.phone}
              </a>
            </div>
          </nav>

          {/* CATEGORY SCREEN — slides in from the right. */}
          <div
            inert={!drill}
            aria-hidden={!drill}
            className={cn(
              "absolute inset-0 overflow-y-auto overscroll-contain px-5 pb-10 sm:px-8 transition-transform duration-slow ease-hover",
              drill ? "translate-x-0" : "translate-x-full",
            )}
          >
            {drill && (
              <>
                <p className="pt-2 text-small font-semibold uppercase tracking-[0.02em] text-fg-secondary">
                  {drill.railLabel}
                </p>
                <h2 className="mt-1 flex items-center gap-3 text-[24px] font-medium leading-8 tracking-[-0.01em] text-fg">
                  <NavIcon name={drill.category.icon} className="h-6 w-6 text-primary" />
                  {drill.category.label}
                </h2>
                {drill.category.groups.map((g) => (
                  <section key={g.heading} className="mt-7">
                    <h3 className="text-caption font-semibold uppercase tracking-[0.04em] text-fg-secondary">
                      {g.heading}
                    </h3>
                    <ul className="mt-3 flex flex-col gap-1">
                      {g.items.map((entry) => (
                        <li key={entry.label}>
                          <MobileItem item={entry} pathname={pathname} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
                <MobilePromo promo={drill.category.promo} />
              </>
            )}
          </div>
        </div>
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

/** `expanded` holds "<menu label>::<category id>" while a category is open. */
function findCategory(key: string) {
  const [label, id] = key.split("::");
  const item = primaryNav.find((i) => i.label === label);
  const category = item?.categories?.find((c) => c.id === id);
  return item?.categories && category ? { railLabel: item.railLabel, category } : null;
}

/** The category's promo, as the reference's card at the foot of the screen. */
function MobilePromo({ promo }: { promo: MegaCategory["promo"] }) {
  const target = resolveNavTarget(promo.cta.href);
  const cls =
    "mt-4 flex h-11 w-full items-center justify-center rounded-lg bg-white text-body font-semibold text-fg";
  return (
    <div className="mt-8 rounded-2xl bg-[linear-gradient(165deg,#2a5bff,var(--color-primary)_55%,#0000d6)] p-5 text-white">
      <p className="text-caption font-semibold uppercase tracking-[0.04em] text-white/85">{promo.eyebrow}</p>
      <p className="mt-3 text-[20px] font-medium leading-[26px]">{promo.title}</p>
      <p className="mt-2 text-small text-white/85">{promo.body}</p>
      {promo.cta.external ? (
        <a href={promo.cta.href} target="_blank" rel="noopener noreferrer" className={cls}>
          {promo.cta.label}
        </a>
      ) : (
        <Link href={target.href} className={cls}>
          {promo.cta.label}
        </Link>
      )}
    </div>
  );
}

function MobileItem({ item, pathname }: { item: MegaItem; pathname: string }) {
  const target = resolveNavTarget(item.href);
  const interactive = item.external || target.mode === "link";
  const active = !item.external && isActivePath(item.href, pathname);

  const inner = (
    <span className="-mx-2 flex min-h-12 items-start gap-3.5 rounded-xl px-2 py-3 active:bg-ink-50">
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-fg">
        <NavIcon name={item.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "text-body font-semibold",
              active ? "text-primary" : interactive ? "text-fg" : "text-fg-muted",
            )}
          >
            {item.label}
          </span>
          {item.badge && (
            <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-micro leading-4 font-semibold text-primary ring-1 ring-inset ring-brand-100">
              {item.badge.text}
            </span>
          )}
          {item.external && (
            <span aria-hidden="true" className="text-fg-muted">
              <ArrowUpRight className="h-3 w-3" />
            </span>
          )}
        </span>
        <span className="mt-1 block text-small leading-snug text-fg-secondary">
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
