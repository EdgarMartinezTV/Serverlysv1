"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, type NavLink } from "@/data/navigation";
import { billing, company } from "@/data/company";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Mobile navigation drawer.
 *
 * This is a real dialog, not a shown/hidden div: it locks background scroll,
 * traps Tab within itself, closes on Escape, and restores focus to the toggle
 * on close. Sections are disclosure accordions so the whole IA is reachable
 * without a nested-menu dead end.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close on navigation — adjusted during render, not in an effect, so the
  // drawer never paints in its stale-open state after a route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setExpanded(null);
  }

  // Lock background scroll while open, and restore the exact previous value.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Escape to close, and a simple Tab cycle within the panel.
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

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
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

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-950 lg:hidden"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
          {open ? (
            <path
              d="m5 5 10 10M15 5 5 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 6h14M3 10h14M3 14h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-x-0 bottom-0 top-16 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          {/* Scrim. Pointer-only dismissal; Escape is the keyboard path. */}
          <div
            className="absolute inset-0 bg-ink-950/20"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={panelRef}
            id="mobile-nav-panel"
            tabIndex={-1}
            className="absolute inset-x-0 top-0 max-h-full overflow-y-auto overscroll-contain bg-white pb-8 shadow-e5 outline-none"
          >
            <nav aria-label="Mobile" className="px-5 pt-4 sm:px-8">
              <ul className="flex flex-col divide-y divide-ink-100">
                {primaryNav.map((item) => {
                  if (!("columns" in item) || !item.columns) {
                    const link = item as { label: string; href: string };
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="flex min-h-12 items-center py-3 text-heading-3 text-ink-950"
                        >
                          {link.label}
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
                        className="flex min-h-12 w-full items-center justify-between py-3 text-left text-heading-3 text-ink-950"
                      >
                        {item.label}
                        <svg
                          viewBox="0 0 12 12"
                          aria-hidden="true"
                          className={cn(
                            "h-3.5 w-3.5 text-ink-500 transition-transform duration-[--duration-base]",
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

                      <div id={sectionId} hidden={!isExpanded} className="pb-3">
                        {item.columns.map((col) => (
                          <div key={col.heading} className="pb-2">
                            <p className="pb-1 text-label font-mono uppercase text-ink-500">
                              {col.heading}
                            </p>
                            <ul className="flex flex-col">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <MobileLink link={link} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
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
                  className="pt-1 text-center text-body-sm text-ink-500"
                >
                  Talk to us — {company.phone}
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function MobileLink({ link }: { link: NavLink }) {
  const soon = link.status === "soon";
  const inner = (
    <span className="flex min-h-11 items-center gap-2 py-1.5 text-body text-ink-700">
      {link.label}
      {soon && <Badge tone="warn">Soon</Badge>}
    </span>
  );

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={link.href}>{inner}</Link>;
}
