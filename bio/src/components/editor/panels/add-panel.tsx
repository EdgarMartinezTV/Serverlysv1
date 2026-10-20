"use client";

import type { BlockType } from "@/lib/bio/schema";
import { CATALOG, GROUPS } from "@/lib/bio/catalog";

/** The block palette, grouped. Adding inserts after the selected block. */
export function AddPanel({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div className="flex flex-col gap-5 p-4">
      {GROUPS.map((g) => (
        <section key={g.id}>
          <h3 className="mb-2 text-caption uppercase text-fg-muted">{g.label}</h3>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(CATALOG) as BlockType[])
              .filter((t) => CATALOG[t].group === g.id)
              .map((t) => (
                <button key={t} type="button" onClick={() => onAdd(t)} data-add={t} className="flex items-start gap-2 rounded-md bg-surface p-2.5 text-left ring-1 ring-line transition hover:ring-primary hover:shadow-e2">
                  <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-sm bg-primary-soft text-[14px]">
                    {CATALOG[t].glyph}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-small font-semibold text-fg">{CATALOG[t].label}</span>
                    <span className="block text-[12px] leading-snug text-fg-muted">{CATALOG[t].description}</span>
                  </span>
                </button>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
