"use client";

import { useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { NavColumn, NavFeature, NavLink } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { cn } from "@/lib/utils";

/**
 * Mega menu / dropdown panel.
 *
 * This is a DISCLOSURE navigation menu (W3C APG), not a menubar: the triggers
 * are real buttons revealing groups of ordinary links. That is the correct
 * pattern for site navigation — a `role="menu"` would promise application-menu
 * semantics that links do not deliver.
 *
 * Keyboard contract:
 *   Enter / Space / ArrowDown on trigger  open and focus the first link
 *   ArrowDown / ArrowUp inside            move between links
 *   Home / End                            first / last link
 *   Escape                                close and restore focus to trigger
 *   Tab                                   leaves naturally; the header closes it
 *
 * Closed panels use `hidden`, so their links leave both the tab order and the
 * accessibility tree — not merely `opacity-0`.
 */

/** Every focusable link currently inside the panel, in DOM order. */
function panelLinks(panel: HTMLElement | null): HTMLElement[] {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll<HTMLElement>("a[href]"));
}

export function MegaPanel({
  id,
  labelledBy,
  open,
  columns,
  feature,
  registerPanel,
  onClose,
  onNavigate,
}: {
  id: string;
  labelledBy: string;
  open: boolean;
  columns: readonly NavColumn[];
  feature?: NavFeature;
  /** Callback ref — the header keeps the node so it can focus the first link. */
  registerPanel: (el: HTMLDivElement | null) => void;
  onClose: (restoreFocus: boolean) => void;
  onNavigate: () => void;
}) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const wide = columns.length > 1 || Boolean(feature);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const links = panelLinks(localRef.current);
    if (links.length === 0) return;
    const index = links.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        links[index < 0 || index === links.length - 1 ? 0 : index + 1]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        links[index <= 0 ? links.length - 1 : index - 1]?.focus();
        break;
      case "Home":
        e.preventDefault();
        links[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        links[links.length - 1]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        onClose(true);
        break;
    }
  };

  return (
    <div
      id={id}
      ref={(el) => {
        localRef.current = el;
        registerPanel(el);
      }}
      aria-labelledby={labelledBy}
      hidden={!open}
      onKeyDown={onKeyDown}
      /**
       * Always left-0. Which ancestor that resolves against is the header's
       * decision: WIDE panels anchor to the <nav> (so they can never run off
       * either viewport edge at any desktop width), NARROW dropdowns anchor to
       * their own trigger. Anchoring a wide panel to a right-hand trigger and
       * aligning it `end` overflowed the LEFT edge at 1440 — and a negative
       * left offset does not increase scrollWidth, so an overflow check on the
       * document alone will not catch it.
       */
      className="absolute left-0 top-full z-10 pt-2"
    >
      <div
        className={cn(
          // `motion-safe` so the entrance is skipped under reduced-motion
          // without needing a second rule to undo it.
          "rounded-xl bg-surface p-2 shadow-e5 ring-1 ring-line",
          "motion-safe:animate-[megaIn_180ms_cubic-bezier(0.16,1,0.3,1)]",
          wide
            ? "grid w-[min(46rem,calc(100vw-3rem))] gap-1 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
            : "w-[min(20rem,calc(100vw-3rem))]",
          feature && "md:grid-cols-[1fr_1fr_0.9fr]",
        )}
      >
        {columns.map((col) => (
          <div key={col.heading} className="p-2">
            <p className="px-3 pb-2 font-mono text-caption uppercase text-fg-muted">
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

        {feature && <FeaturePanel feature={feature} onNavigate={onNavigate} />}
      </div>
    </div>
  );
}

function FeaturePanel({
  feature,
  onNavigate,
}: {
  feature: NavFeature;
  onNavigate: () => void;
}) {
  return (
    <div className="p-2">
      <div className="flex h-full flex-col rounded-lg bg-canvas-secondary p-4">
        <p className="font-mono text-caption uppercase text-primary">
          {feature.eyebrow}
        </p>
        <p className="mt-2 text-body-lg font-semibold text-fg">{feature.title}</p>
        <p className="mt-1.5 flex-1 text-small text-fg-secondary">
          {feature.description}
        </p>
        <Link
          href={resolveNavTarget(feature.href).href}
          onClick={onNavigate}
          className="mt-4 inline-flex items-center gap-1.5 rounded-sm text-small font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {feature.linkLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

function MegaLink({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  const soon = link.status === "soon";

  const body = (
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
    "group block rounded-lg px-3 py-2.5 transition-colors duration-fast " +
    "hover:bg-canvas-secondary focus-visible:bg-canvas-secondary " +
    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary";

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onNavigate}
      >
        {body}
      </a>
    );
  }

  // Pages that do not exist yet render as text, not links. Linking to a 404
  // from every page of the site wastes crawl budget and sends people nowhere.
  const target = resolveNavTarget(link.href);
  if (target.mode === "text") {
    return <span className={`${classes} cursor-default`}>{body}</span>;
  }

  return (
    <Link href={target.href} className={classes} onClick={onNavigate}>
      {body}
    </Link>
  );
}

export { panelLinks };
