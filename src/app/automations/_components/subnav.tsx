"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SUBNAV } from "../_content";

/**
 * The reference's floating in-page rail.
 *
 * Measured at 1440: a 50px pill track in `surface-dark-active`, 999px radius,
 * 8px between items, each item a 40px-tall pill at 14/20 semibold. The active
 * item inverts to white on near-black; the rest sit flush on the track.
 *
 * NOT the site's shared `SectionNav`: that one is a full-bleed bar built on the
 * site's own `Container` and light tokens, and bending it into a floating dark
 * pill would have made it worse at its own job on the pages that use it.
 *
 * The rail is `sticky`, so its scrolling ancestor bounds it — the page wraps
 * every anchored band and this rail in one element for exactly that reason.
 * See the note in page.tsx.
 *
 * Scroll-spy uses a band root margin rather than a threshold: these sections
 * are taller than the viewport and can never cross a 0.5 intersection ratio,
 * which would leave the rail permanently dead.
 */
export function SubNav() {
  const [active, setActive] = useState<string>(SUBNAV[0].id);

  useEffect(() => {
    const targets = SUBNAV.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="On this page" className="sticky top-18 z-30 bg-canvas-dark py-2.5">
      {/* Own gutters: the track is centred on the viewport, not on the grid. */}
      <div className="flex justify-start overflow-x-auto px-4 md:px-10 xl:justify-center xl:px-20">
        <ul className="flex shrink-0 items-center gap-2 rounded-full bg-surface-dark-active p-[5px]">
          {SUBNAV.map((item) => {
            const current = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current ? "true" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full px-4 text-[14px] leading-5 font-semibold whitespace-nowrap transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-on-dark",
                    current
                      ? "bg-white text-ink-950"
                      : "text-fg-on-dark hover:bg-white/10",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
