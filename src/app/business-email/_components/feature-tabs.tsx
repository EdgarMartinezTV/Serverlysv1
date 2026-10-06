"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export type FeatureTab = {
  id: string;
  label: string;
  title: string;
  points: readonly string[];
  image: string;
  imageAlt: string;
};

/**
 * The reference's pill tabs over a panel: a heading and checklist on the left,
 * a photo on the right. A real tablist (arrow keys move between tabs).
 */
export function FeatureTabs({
  tabs,
  cta,
}: {
  tabs: readonly FeatureTab[];
  cta: { label: string; href: string };
}) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tab = tabs[active];

  return (
    <div className="mt-16">
      <div
        role="tablist"
        aria-label="Business email features"
        className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-white/[0.08] p-1.5 ring-1 ring-white/10"
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          const next =
            (active + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
          setActive(next);
          document.getElementById(`${base}-tab-${next}`)?.focus();
        }}
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            id={`${base}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${base}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "h-10 shrink-0 rounded-full px-5 text-small font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              i === active ? "bg-white text-fg" : "text-white/80 hover:text-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${active}`}
        className="mt-8 grid overflow-hidden rounded-3xl bg-white/[0.06] ring-1 ring-white/10 lg:grid-cols-2"
      >
        <div
          key={tab.id}
          className="flex animate-[chatIn_350ms_ease-out_both] flex-col justify-center p-8 sm:p-12"
        >
          <h3 className="font-display text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-white sm:text-[40px]">
            {tab.title}
          </h3>
          <ul className="mt-6 flex flex-col gap-3">
            {tab.points.map((p) => (
              <li key={p} className="flex gap-3 text-body text-white/85">
                <svg
                  viewBox="0 0 16 16"
                  className="mt-1 size-4 shrink-0 text-[#4ade80]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
          <a
            href={cta.href}
            className="mt-8 inline-flex h-12 w-fit items-center rounded-md bg-primary px-6 text-body font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {cta.label}
          </a>
        </div>
        <div className="relative min-h-[320px] lg:min-h-[460px]">
          {tabs.map((t, i) => (
            <Image
              key={t.id}
              src={t.image}
              alt={i === active ? t.imageAlt : ""}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className={cn(
                "object-cover transition-opacity duration-500",
                i === active ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
