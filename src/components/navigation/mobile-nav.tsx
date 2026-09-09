"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, isActivePath, type NavLink } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { billing, company } from "@/data/company";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wordmark } from "@/components/layout/wordmark";
import { cn } from "@/lib/utils";

/**
 * Mobile navigation drawer.
 *
 * FULL-VIEWPORT overlay, PORTALLED to document.body. Both choices fix real bugs:
 *
 *   1. It previously sat at `top-16`, assuming the header was flush with the
 *      viewport top. The announcement bar pushes the header down, so the drawer
 *      landed in the wrong place.
 *   2. The header uses `backdrop-filter`, which makes it a containing block for
 *      `fixed` descendants — so a `fixed inset-0` child of the header is sized
 *      against the 64px header box, not the viewport. Portalling to <body>
 *      escapes that containing block entirely.
 *
 * Covering the header means the drawer needs its own close control, which is
 * also the more standard mobile pattern.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // No `mounted` guard is needed: createPortal only runs when `open` is true,
  // and `open` can only become true from a click — i.e. never during the
  // server render. Guarding with a setState-in-effect would just add a
  // cascading render.

  // Close on navigation — adjusted during render, not in an effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setExpanded(null);
  }

  // Lock background scroll, restoring the exact previous value.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes; Tab cycles inside the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      // offsetParent is null for anything inside a collapsed (inert) section.
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
  }, [open]);

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
      <div
        ref={panelRef}
        tabIndex={-1}
        id="mobile-nav-panel"
        className="absolute inset-0 flex flex-col bg-surface outline-none motion-safe:animate-[sheetIn_220ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* The drawer covers the site header, so it carries its own. */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line-subtle px-5 sm:px-8">
          <Wordmark tone="dark" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              toggleRef.current?.focus();
            }}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-fg-secondary transition-colors duration-fast hover:bg-canvas-inset hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          <ul className="flex flex-col divide-y divide-line-subtle">
            {primaryNav.map((item) => {
              if (!("columns" in item) || !item.columns) {
                const href = (item as { href: string }).href;
                const active = isActivePath(href, pathname);
                return (
                  <li key={item.label}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 items-center text-body-lg font-semibold",
                        active ? "text-primary" : "text-fg",
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
                    className="flex min-h-14 w-full items-center justify-between gap-4 text-left text-body-lg font-semibold text-fg"
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 text-fg-muted transition-transform duration-normal ease-hover",
                        isExpanded && "rotate-180",
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
                  </button>

                  {/* grid 0fr→1fr animates to intrinsic height: no JS
                      measurement, no layout jump. */}
                  <div
                    id={sectionId}
                    inert={!isExpanded}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-slow ease-hover",
                      isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-3">
                        {item.columns.map((col) => (
                          <div key={col.heading} className="pb-2">
                            <p className="pb-1 font-mono text-caption uppercase text-fg-muted">
                              {col.heading}
                            </p>
                            <ul className="flex flex-col">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <MobileLink link={link} pathname={pathname} />
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

          <div className="mt-6 flex flex-col gap-3">
            <Button href={billing.store("cloud-hosting")} size="lg" block>
              Get started
            </Button>
            <Button href={billing.login} variant="secondary" size="lg" block>
              Log in
            </Button>
            <a
              href={company.phoneHref}
              className="inline-flex min-h-11 items-center justify-center text-small text-fg-muted"
            >
              Talk to us — <span className="tabular">&nbsp;{company.phone}</span>
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
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-fg-secondary transition-colors duration-fast hover:bg-canvas-inset hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
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

function MobileLink({ link, pathname }: { link: NavLink; pathname: string }) {
  const soon = link.status === "soon";
  const active = !link.external && isActivePath(link.href, pathname);

  const inner = (
    <span
      className={cn(
        "flex min-h-11 items-center gap-2 py-1.5 text-body",
        active ? "font-medium text-primary" : "text-fg-secondary",
      )}
    >
      {link.label}
      {soon && <Badge tone="warning">Soon</Badge>}
    </span>
  );

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  const target = resolveNavTarget(link.href);
  if (target.mode === "text") return <span>{inner}</span>;
  return (
    <Link href={target.href} aria-current={active ? "page" : undefined}>
      {inner}
    </Link>
  );
}
