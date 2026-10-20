"use client";

import { useMemo, useState } from "react";
import { TEMPLATE_CATEGORIES } from "@/lib/bio/templates";
import { Icon } from "./icons";

export type GalleryItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  featured: boolean;
  thumb: React.ReactNode;
};

/**
 * Filterable template grid with a live preview dialog (the real template,
 * rendered at /t/<id>). `onChoose` is a server action bound by the caller:
 * create a page, or switch an existing page's template.
 */
export function TemplateGallery({
  items,
  chooseLabel = "Use this template",
  onChoose,
}: {
  items: GalleryItem[];
  chooseLabel?: string;
  onChoose: (id: string) => Promise<void>;
}) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<GalleryItem | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const cats = useMemo(
    () => TEMPLATE_CATEGORIES.filter((c) => items.some((i) => i.category === c.id)),
    [items],
  );
  const shown = items.filter(
    (i) =>
      (cat === "all" || i.category === cat) &&
      (!q || `${i.name} ${i.description}`.toLowerCase().includes(q.toLowerCase())),
  );

  async function choose(id: string) {
    setBusy(id);
    try {
      await onChoose(id);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
        {/* Categories: a sidebar on desktop, a swipeable row on phones. */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <label className="relative block">
            <span className="sr-only">Search templates</span>
            <Icon
              name="search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates"
              className="field rounded-full pl-9"
            />
          </label>
          <p className="mt-6 hidden text-caption uppercase text-fg-muted lg:block">
            Browse by category
          </p>
          <div
            role="tablist"
            aria-label="Template categories"
            aria-orientation="vertical"
            className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 lg:mt-3 lg:flex-col lg:overflow-visible"
          >
            {[{ id: "all", label: "All templates" }, ...cats].map((c) => (
              <button
                key={c.id}
                role="tab"
                type="button"
                aria-selected={cat === c.id}
                onClick={() => setCat(c.id)}
                className={`h-9 shrink-0 rounded-full px-4 text-left text-small font-medium ring-1 ring-inset transition-colors ${cat === c.id ? "bg-fg text-white ring-fg" : "bg-surface text-fg-secondary ring-line hover:ring-line-strong"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          {/* Linktree-style gallery: tall rounded phone renders, name underneath,
          actions on hover/focus (always visible on touch screens). */}
          <ul
            className="mt-8 grid grid-cols-[repeat(auto-fill,218px)] lg:mt-0 justify-center gap-x-6 gap-y-10 sm:justify-start"
            aria-live="polite"
          >
            {shown.map((t) => (
              <li key={t.id} className="group w-[218px]">
                <div className="relative overflow-hidden rounded-[28px] shadow-e2 ring-1 ring-line transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-e4">
                  {t.thumb}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => choose(t.id)}
                      disabled={busy !== null}
                      className="btn h-10 bg-white text-small text-fg hover:bg-canvas-inset"
                      data-template={t.id}
                    >
                      {busy === t.id ? "Setting up…" : chooseLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreview(t)}
                      className="btn h-9 text-small text-white ring-1 ring-white/60 hover:bg-white/10"
                      aria-label={`Preview ${t.name}`}
                    >
                      Preview
                    </button>
                  </div>
                  {t.featured ? (
                    <span className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 font-display text-[16px] font-semibold text-fg">
                  {t.name}
                </p>
                <p className="text-[13px] text-fg-muted">
                  {TEMPLATE_CATEGORIES.find((c) => c.id === t.category)?.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {!shown.length ? (
        <p className="mt-10 text-center text-fg-muted">No templates match.</p>
      ) : null}

      {preview ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${preview.name} preview`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close preview"
            onClick={() => setPreview(null)}
          />
          <div className="relative flex max-h-full w-full max-w-[880px] flex-col overflow-hidden rounded-xl bg-surface shadow-e5 md:flex-row">
            <iframe
              src={`/t/${preview.id}`}
              title={`${preview.name} live preview`}
              className="h-[60vh] w-full border-0 md:h-[720px] md:w-[400px]"
            />
            <div className="flex flex-col gap-3 p-6">
              <p className="text-caption uppercase text-primary">
                {TEMPLATE_CATEGORIES.find((c) => c.id === preview.category)?.label}
              </p>
              <h2 className="text-h4 font-semibold">{preview.name}</h2>
              <p className="text-body text-fg-muted">{preview.description}</p>
              <p className="text-small text-fg-muted">
                This is the live template — scroll it, open its FAQ. Every block is
                editable after you choose it.
              </p>
              <div className="mt-auto flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => choose(preview.id)}
                  disabled={busy !== null}
                  className="btn h-11 flex-1 bg-primary px-5 text-white hover:bg-primary-hover"
                >
                  {busy === preview.id ? "Setting up…" : chooseLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="btn h-11 px-4 text-fg ring-1 ring-line hover:bg-canvas-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
