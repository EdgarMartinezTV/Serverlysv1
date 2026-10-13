"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Features, scroll-driven — the reference's Build / Deploy / Monitor block.
 *
 * ONE tab rail and ONE visual stay pinned (lg+) while the feature groups
 * scroll past on the right; whichever group crosses the middle of the
 * viewport becomes active, the matching tab lights up and its visual
 * cross-fades in. Clicking a tab scrolls to that group.
 *
 * The previous version rendered a full rail and a sticky visual per group,
 * so three rails stacked and the panels jumped as one sticky released and the
 * next caught. Below lg there is no pinning: each group shows its own visual
 * inline, which is what a phone needs anyway.
 *
 * Reduced motion: the cross-fade is a plain opacity transition behind
 * `motion-safe`, so the swap is instant when motion is reduced.
 */

export type FeatureGroup = {
  tab: string;
  backdrop: string;
  visual: React.ReactNode;
  features: readonly (readonly [string, string])[];
};

function Visual({ group, className }: { group: FeatureGroup; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <Image
        src={group.backdrop}
        alt=""
        fill
        sizes="(min-width: 1024px) 460px, 100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#0b1530]/55 backdrop-blur-[2px]"
      />
      <div className="relative p-5 sm:p-8">{group.visual}</div>
    </div>
  );
}

export function FeaturesScroller({
  groups,
  tabPrefix,
}: {
  groups: readonly FeatureGroup[];
  tabPrefix?: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = refs.current.indexOf(entry.target as HTMLDivElement);
            if (i >= 0) setActive(i);
          }
        }
      },
      // A thin band across the middle of the viewport: exactly one group is
      // "in" it at a time, so the active tab never flickers between two.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const go = (i: number) => {
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[120px_1fr_1fr] lg:gap-10">
      {/* Tab rail — pinned */}
      <div className="hidden lg:block">
        <ul className="sticky top-32 flex flex-col items-start gap-5">
          {groups.map((g, i) => (
            <li key={g.tab}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={active === i ? "true" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  active === i
                    ? "bg-brand-50 text-primary"
                    : "text-brand-300 hover:text-primary",
                )}
              >
                {g.tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Visual — pinned, cross-fades between groups */}
      <div className="hidden lg:block">
        <div aria-hidden="true" className="sticky top-32 grid">
          {groups.map((g, i) => (
            <Visual
              key={g.tab}
              group={g}
              className={cn(
                "[grid-area:1/1] motion-safe:transition-[opacity,transform] motion-safe:duration-500",
                active === i
                  ? "opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0",
              )}
            />
          ))}
        </div>
      </div>

      {/* Feature groups — scroll */}
      <div className="flex flex-col gap-16 lg:gap-0">
        {groups.map((g, i) => (
          <div
            key={g.tab}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="lg:flex lg:min-h-[78vh] lg:flex-col lg:justify-center lg:py-10"
          >
            <p className="mb-4 inline-flex self-start rounded-full bg-brand-50 px-3 py-1 text-[13px] font-medium text-primary">
              {tabPrefix ? `${tabPrefix} ${g.tab}` : g.tab}
            </p>
            <Visual group={g} className="mb-8 lg:hidden" />
            {g.features.map(([title, body], j) => (
              <div
                key={title}
                className={cn(j > 0 && "mt-8 border-t border-black/[0.08] pt-8")}
              >
                <h3 className="text-[20px] leading-snug font-normal tracking-[-0.01em] text-[#0b1530]">
                  {title}
                </h3>
                <p className="mt-4 text-[14px] leading-[1.65] text-[#5b6472]">{body}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
