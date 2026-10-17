"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CleaningCopy } from "../_i18n";

type Group = "all" | "win" | "show" | "found" | "run";

const ICONS: Record<string, string> = {
  services: "M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z",
  quote: "M6 3h9l4 4v14H6V3Zm9 0v4h4M9 11h7M9 15h7M9 19h4",
  booking: "M4 6h16v14H4V6Zm0 4h16M8 3v4m8-4v4m-8 7h3",
  pages: "M5 4h10l4 4v12H5V4Zm4 7h6m-6 4h6",
  areas: "M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  gallery: "M3 5h18v14H3V5Zm9 0v14M7 10l2 2-2 2m10-4-2 2 2 2",
  reviews: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z",
  maps: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14",
  call: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  bilingual: "M3 5h8M7 3v2m2.5 0C9 9 6 12 3 13m3-4c1 2 3 3.5 5 4m2 8 4-10 4 10m-6.5-3h5",
  ai: "M12 3v3m0 12v3M3 12h3m12 0h3M7 7l2 2m6 6 2 2m0-10-2 2m-6 6-2 2M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  hosting: "M4 5h16v6H4V5Zm0 8h16v6H4v-6Zm3-5h.01M7 16h.01",
};

/**
 * "Everything your cleaning website needs" — twelve feature cards with a goal
 * filter. The filter HIGHLIGHTS the cards for the chosen goal rather than
 * hiding or dimming the rest: all twelve stay in the server HTML, in the
 * reading order and at full contrast, so no content depends on a click.
 */
export function Features({ copy }: { copy: CleaningCopy["features"] }) {
  const [group, setGroup] = useState<Group>("all");
  const groups = Object.entries(copy.groups) as [Group, string][];

  return (
    <div>
      <div role="group" aria-label={copy.filterLabel} className="mt-10 flex flex-wrap justify-center gap-2">
        {groups.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={group === id}
            onClick={() => setGroup(id)}
            className={cn(
              "h-11 rounded-full px-5 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              group === id ? "bg-[#0b1530] text-white" : "bg-white text-[#2b3442] ring-1 ring-black/10 hover:ring-black/25",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {copy.items.map((f) => {
          const on = group !== "all" && f.group === group;
          return (
            <li
              key={f.id}
              data-highlighted={on || undefined}
              className={cn(
                "group relative overflow-hidden rounded-[20px] bg-white p-6 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.7,0.1,1)] hover:-translate-y-1",
                // Either state, never both: cn() does not resolve class conflicts.
                on
                  ? "-translate-y-1 shadow-[0_24px_50px_-24px_rgb(0_0_255/0.35)] ring-2 ring-primary"
                  : "ring-1 ring-black/[0.06] hover:shadow-[0_24px_50px_-24px_rgb(11_21_48/0.35)]",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute -top-16 -right-16 size-40 rounded-full bg-[radial-gradient(circle,rgb(0_0_255/0.10),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="relative flex size-11 items-center justify-center rounded-xl bg-brand-50 text-primary">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICONS[f.id]} />
                </svg>
              </span>
              <h3 className="relative mt-5 text-[18px] leading-[1.25] font-semibold text-[#0b1530]">{f.title}</h3>
              <p className="relative mt-2 text-[14px] leading-[1.6] text-[#5b6472]">{f.body}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
