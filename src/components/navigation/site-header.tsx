"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, isActiveItem, isActivePath } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { Wordmark } from "@/components/layout/wordmark";
import { MegaMenu, panelLinks } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { LanguageSelector } from "./language-selector";
import { AccountButton } from "./account-button";
import { SeraOpenButton } from "@/components/sera/sera-open-button";
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
 * GEOMETRY follows the target exactly: a 72px bar on a near-full-bleed
 * container (2230px), logo hard left, nav 32px after it with 24px between
 * items, utilities hard right. Top-level items are PLAIN TEXT — the pill
 * backgrounds this used to paint on hover made the bar read as a toolbar of
 * buttons rather than a menu, which was the single biggest visual difference
 * from the target.
 *
 * LAYERING: backdrop z-40 → header z-50 → panel z-10 within the header, and
 * the bar's own three clusters at z-20 so the panel — which now opens only 8px
 * below the bar — cannot cover the triggers that opened it.
 *
 * ⚠ Those three carry z-20 WITHOUT `position: relative`. A z-index applies to a
 * static flex item, but `relative` would additionally make the nav a containing
 * block for the absolutely-positioned mega panel — which is anchored to the
 * header container so it can centre on the VIEWPORT. Adding `relative` here
 * once shifted every panel 320px left of centre. The
 * backdrop is rendered as a SIBLING of <header>, not a child: the header uses
 * backdrop-blur, which would become a containing block for a fixed child and
 * trap it inside the 64px bar.
 *
 * POINTER: CLICK ONLY. Hover does not open a panel.
 *
 * That is measured from the reference, not assumed — dispatching a full mouse
 * hover at its trigger leaves the panel shut (6 links in the band before and
 * after), while a real click opens it (22) and a second click closes it again.
 * Ours used to open on hover for a mouse, which is the one behaviour that
 * differed.
 *
 * Click-only is also the better behaviour, which is why the hover path is gone
 * rather than kept behind a flag:
 *   · a hover menu opens itself when the pointer merely crosses the bar on its
 *     way somewhere else, and these panels are large enough to cover the page;
 *   · touch has no hover, so click was always the real interaction on half the
 *     traffic — `pointerenter` fires immediately before `click` there, so
 *     hover-to-open would open then instantly close;
 *   · it removes the close-delay timer that existed only to let a pointer
 *     travel from trigger to panel without the panel vanishing mid-journey.
 *
 * Escape and outside-click still close. `aria-expanded` is kept on every
 * trigger — the reference ships none, and that is a gap in theirs, not a
 * detail to copy.
 */
/**
 * Routes whose hero is a dark band, where the bar sits transparently over it
 * and switches to light text.
 *
 * A route only belongs here if its FIRST band is dark. `/cloud-hosting` was on
 * this list when its hero was a dark band; that page's hero is now white, and
 * light nav text on it measured 1.9:1 — so it came off. If you make a hero
 * dark, add the route; if you make one light, remove it. Getting this wrong is
 * invisible in a scrolled screenshot, because the bar is correct everywhere
 * except the top 8px of scroll.
 */
const OVERLAY_ROUTES = new Set(["/"]);

export function SiteHeader() {
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
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

  /*
   * RETRACT ON SCROLL-DOWN, below `sm` only.
   *
   * The bar is 72px and the stage rail pins another 48px directly under it, so
   * inside the stage sequence a 844px phone was spending 220px — 26% of the
   * viewport — on chrome that never changes. Scrolling down now slides the bar
   * away and scrolling up brings it back, which is the standard mobile
   * behaviour and buys back the 72px in the direction people are reading.
   *
   * The state is written to <html> rather than held in React, because the
   * stage rail has to move with it: it is `sticky top-18`, so with the bar
   * gone it would otherwise float 72px down the screen with live content
   * scrolling through the gap above it. One attribute, two elements, one
   * transition — the pairing lives in globals.css.
   *
   * ⚠ NEVER RETRACTS WITH A MENU OPEN. Hiding the bar that owns the open mega
   * panel takes the panel's triggers off screen and strands the panel; the
   * mobile drawer locks the page anyway, so there is no scroll to react to.
   *
   * The 64px floor keeps it from retracting on the elastic overscroll at the
   * very top, where `scrollY` jitters across zero and the bar flickered.
   */
  useEffect(() => {
    const root = document.documentElement;
    if (open !== null || mobileOpen) {
      delete root.dataset.headerHidden;
      return;
    }
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const down = y > last && y > 64;
      last = y;
      if (down) root.dataset.headerHidden = "";
      else delete root.dataset.headerHidden;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      delete root.dataset.headerHidden;
    };
  }, [open, mobileOpen]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);


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
        data-site-header=""
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow,transform] duration-normal ease-hover",
          transparent && "bg-transparent",
          !transparent && dark && "bg-canvas-abyss",
          /* OPAQUE once scrolled. It used to stay `bg-canvas/85` with a
             backdrop blur at every scroll position, which is fine over the
             white bands and wrong over every dark one: 85% white composited
             over an abyss panel is a washed mid-grey slab with a hard bottom
             edge, and the stage sections put a dark panel under the bar
             repeatedly on the way down the homepage. Translucency is kept
             only at the top of a non-overlay route, where what is behind the
             bar is the page's own light canvas and the blur reads as depth
             rather than as mud. */
          !dark && !scrolled && "bg-canvas/85 backdrop-blur-md ring-1 ring-line-subtle",
          !dark && scrolled && "bg-canvas shadow-e2 ring-1 ring-line",
          open && "shadow-e5",
        )}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
        }}
      >
        {/* `relative` so mega panels span the CONTAINER, not their trigger. */}
        <div className="relative mx-auto flex h-18 w-full max-w-nav items-center gap-2 px-5 sm:px-8 lg:pl-10 lg:pr-10">
          <span className="z-20 flex items-center">
            {/* h-10, not h-8, and the reason is the TAGLINE. Sampled from the
                asset: of its 409px box the "SERVERLYS" wordmark is only 129px,
                the rest going to the tagline and the full-height mark. At h-8
                that put the wordmark on screen at 10.09px against the target's
                12.78px — 27% smaller, in the largest element in the bar, which
                is most of why the whole header read smaller. h-10 renders it at
                12.62px. Matching their 147px BOX width instead would land the
                wordmark at 11.5px and miss again; the wordmark is what the eye
                reads, so that is what is matched. */}
            <Wordmark tone={dark ? "light" : "dark"} priority className="h-10" />
          </span>

          <nav
            aria-label="Main"
            className="z-20 ml-8 hidden lg:flex lg:items-center lg:gap-6"
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
                      // Measured off the target: 14px / 400 / 20px line box.
                      // `text-small` alone is 14/21 (the site's 1.5 ratio), which
                      // makes the bar's line box a pixel taller than the target's.
                      "rounded-sm py-2 text-small font-normal leading-5 transition-colors duration-fast",
                      "focus-visible:outline-2 focus-visible:outline-offset-4",
                      dark
                        ? "text-fg-on-dark-secondary hover:text-white focus-visible:outline-white"
                        : active
                          ? "text-primary focus-visible:outline-primary"
                          : "text-fg-secondary hover:text-fg focus-visible:outline-primary",
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
                <div key={item.label}>
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
                      "flex items-center gap-0.5 rounded-sm py-2 text-small font-normal leading-5 transition-colors duration-fast",
                      "focus-visible:outline-2 focus-visible:outline-offset-4",
                      dark
                        ? isOpen
                          ? "text-white focus-visible:outline-white"
                          : "text-fg-on-dark-secondary hover:text-white focus-visible:outline-white"
                        : isOpen
                          ? "text-fg focus-visible:outline-primary"
                          : active
                            ? "text-primary focus-visible:outline-primary"
                            : "text-fg-secondary hover:text-fg focus-visible:outline-primary",
                    )}
                  >
                    {item.label}
                    {/* 18px box, measured off the target's own chevron (18×18 in
                        a 24 viewBox, arrow glyph 9.4×5.4). Ours was h-2.5 — a
                        10px box whose arrow drew 5.8×2.9, barely half theirs,
                        which is most of why the bar read smaller side by side. */}
                    <Chevron
                      className={cn(
                        "h-[1.125rem] w-[1.125rem] transition-transform duration-normal ease-hover",
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

          <div className="z-20 ml-auto flex items-center gap-1 sm:gap-1.5">
            <span className="hidden sm:block">
              {/*
                Was "Get started" linking straight to the cloud-hosting store.
                Now opens Sera, which can answer the question behind the click
                and route to the right product — or file a request. Checkout is
                still one step away from every product page and from /pricing.
              */}
              <SeraOpenButton onDark={dark} />
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
