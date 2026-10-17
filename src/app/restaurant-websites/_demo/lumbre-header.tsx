"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PATHS } from "../_i18n";
import type { LuxCopy } from "./copy-lux";
import { useLumbre } from "./state";
import { CHAMPAGNE, CHAR, IVORY, display } from "./theme";

const SECTIONS = [
  ["#story", "story"],
  ["#menu", "menu"],
  ["#fire", "fire"],
  ["#private", "privateDining"],
  ["#gallery", "gallery"],
] as const;

/**
 * The restaurant's header, overlaid on the hero film.
 *
 * Transparent while the hero is on screen, then a solid charcoal bar. The
 * Serverlys strip on top says what this is and collapses once the visitor
 * scrolls, so the frame is there on arrival without sitting on the experience.
 * On phones the section links live in a full-screen <dialog> (focus trapped,
 * Escape closes) and Reserve stays visible in the bar.
 */
export function LumbreHeader({ lux }: { lux: LuxCopy }) {
  const { locale, count, setCartOpen } = useLumbre();
  const n = lux.nav;
  const other = locale === "en" ? "es" : "en";
  const [solid, setSolid] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const hero = document.getElementById("lumbre-top");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), { rootMargin: "-90px 0px 0px 0px", threshold: 0 });
    // Watch a 1px line near the hero's bottom: solid once it scrolls under the bar.
    const marker = document.createElement("div");
    marker.style.cssText = "position:absolute;left:0;right:0;bottom:12%;height:1px;pointer-events:none";
    hero.appendChild(marker);
    io.observe(marker);
    return () => {
      io.disconnect();
      marker.remove();
    };
  }, []);

  const closeMenu = () => menuRef.current?.close();

  const link = "rounded-full px-3.5 py-2 text-[13px] tracking-[0.08em] uppercase transition-colors hover:text-[#C8A97E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A97E]";

  return (
    <header className="fixed inset-x-0 top-0 z-40 font-display" style={{ color: IVORY }}>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
          solid ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
        )}
        aria-hidden={solid || undefined}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="flex items-center justify-center gap-x-3 border-b border-[#F4EFE6]/10 bg-[#111411]/55 px-5 py-2 text-center text-[12px] text-[#F4EFE6]/80 backdrop-blur-sm">
            <span>{lux.frame.strip}</span>
            <Link
              href={`${PATHS[locale].landing}#review`}
              tabIndex={solid ? -1 : undefined}
              className="hidden shrink-0 font-semibold text-[#C8A97E] underline-offset-4 hover:underline sm:inline"
            >
              {lux.frame.stripCta} →
            </Link>
          </p>
        </div>
      </div>

      <nav
        aria-label={n.label}
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          solid ? "border-[#F4EFE6]/10 bg-[#111411]/92 backdrop-blur-md" : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center gap-3 px-5 sm:px-8 lg:px-12">
          <a
            href="#lumbre-top"
            aria-label={n.home}
            className={cn(display.className, "text-[26px] leading-none tracking-[0.32em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A97E]")}
          >
            LUMBRE
          </a>

          <ul className="ml-auto hidden items-center lg:flex">
            {SECTIONS.map(([href, key]) => (
              <li key={href}>
                <a href={href} className={link}>
                  {n[key]}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-4">
            <Link
              href={PATHS[other].demo}
              hrefLang={other}
              lang={other}
              aria-label={n.switchAria}
              className={cn(link, "hidden px-2.5 sm:inline-flex")}
            >
              {n.switchLabel}
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className={cn(link, "relative hidden items-center gap-2 sm:inline-flex")}
            >
              {n.order}
              {count > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full text-[11px] font-semibold tracking-normal tabular-nums" style={{ background: CHAMPAGNE, color: CHAR }}>
                  {count}
                </span>
              )}
            </button>
            <a
              href="#reserve"
              className="inline-flex h-10 items-center rounded-full px-5 text-[12px] font-semibold tracking-[0.14em] uppercase ring-1 ring-[#C8A97E] transition-colors hover:bg-[#C8A97E] hover:text-[#111411] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A97E]"
            >
              {n.reserve}
            </a>
            <button
              type="button"
              onClick={() => menuRef.current?.showModal()}
              aria-label={n.open}
              aria-haspopup="dialog"
              className="flex size-10 items-center justify-center rounded-full hover:bg-[#F4EFE6]/10 focus-visible:outline-2 focus-visible:outline-[#C8A97E] lg:hidden"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M4 8h16M8 16h12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <dialog
        ref={menuRef}
        aria-label={n.label}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) closeMenu();
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-[#111411] p-0 text-[#F4EFE6] backdrop:bg-black/60"
      >
        <div className="flex h-full flex-col px-6 pt-5 pb-[max(28px,env(safe-area-inset-bottom))]">
          <div className="flex h-[52px] items-center justify-between">
            <span className={cn(display.className, "text-[24px] tracking-[0.32em]")}>LUMBRE</span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label={n.close}
              className="flex size-11 items-center justify-center rounded-full ring-1 ring-[#F4EFE6]/20 focus-visible:outline-2 focus-visible:outline-[#C8A97E]"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
          <ul className="mt-12 flex flex-col gap-1">
            {[...SECTIONS, ["#reserve", "reserve"] as const].map(([href, key], i) => (
              <li key={href}>
                <a href={href} className={cn(display.className, "flex items-baseline gap-4 py-2 text-[44px] leading-none font-light")}>
                  <span className="font-display text-[12px] tracking-[0.2em] text-[#C8A97E] tabular-nums">0{i + 1}</span>
                  {n[key]}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-3 text-[14px]">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                setCartOpen(true);
              }}
              className="h-12 rounded-full px-6 font-semibold ring-1 ring-[#F4EFE6]/25"
            >
              {n.order}
              {count > 0 ? ` · ${count}` : ""}
            </button>
            <Link href={PATHS[other].demo} hrefLang={other} lang={other} aria-label={n.switchAria} className="h-12 rounded-full px-6 leading-[48px] font-semibold ring-1 ring-[#F4EFE6]/25">
              {n.switchLabel}
            </Link>
          </div>
        </div>
      </dialog>
    </header>
  );
}

/**
 * The Serverlys frame inside the experience: a small floating control that
 * opens a card with the pitch. Discreet by default, never over the content's
 * own controls (it sits bottom-left; the order button sits right).
 */
export function DemoBadge({ lux }: { lux: LuxCopy }) {
  const { locale } = useLumbre();
  const f = lux.frame;
  const [open, setOpen] = useState(false);
  const cardId = "lumbre-demo-card";
  return (
    <div className="fixed bottom-4 left-4 z-40 font-display sm:bottom-6 sm:left-6">
      {open && (
        <div id={cardId} role="region" aria-label={f.pillLabel} className="mb-3 w-[min(340px,calc(100vw-32px))] rounded-[22px] bg-[#FAF8F3] p-6 text-[#111411] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#696D55] uppercase">{f.pillLabel}</p>
          <p className={cn(display.className, "mt-3 text-[26px] leading-[1.1]")}>{f.pillTitle}</p>
          <p className="mt-3 text-[14px] leading-[1.55] text-[#55574C]">{f.pillBody}</p>
          <Link
            href={`${PATHS[locale].landing}#review`}
            className="mt-5 flex h-12 items-center justify-center rounded-full bg-[#111411] text-[14px] font-semibold text-[#F4EFE6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111411]"
          >
            {f.pillCta}
          </Link>
          <Link href={PATHS[locale].landing} className="mt-3 block text-center text-[13px] font-semibold text-[#55574C] underline underline-offset-4">
            ← {f.pillBack}
          </Link>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? cardId : undefined}
        className="flex h-11 items-center gap-2.5 rounded-full bg-[#111411]/80 pr-4 pl-1.5 text-[12px] font-semibold text-[#F4EFE6] ring-1 ring-[#F4EFE6]/15 backdrop-blur-md transition-colors hover:bg-[#111411] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A97E]"
      >
        <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-[#0000ff] text-[13px] font-bold text-white">
          S
        </span>
        <span className="max-sm:sr-only">{open ? f.pillClose : f.pillLabel}</span>
        <span className="sm:sr-only">{open ? f.pillClose : f.pillOpen}</span>
      </button>
    </div>
  );
}
