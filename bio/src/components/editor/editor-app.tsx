"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import type { Block, BlockType, PageDoc, Theme } from "@/lib/bio/schema";
import { newBlock, parseDoc } from "@/lib/bio/schema";
import { newId } from "@/lib/bio/catalog";
import { Icon, type IconName } from "@/components/dashboard/icons";
import { Logo } from "@/components/ui/logo";
import { init, insertBlock, moveBlock, reducer, removeBlock, restoreBlock, setPath, updateBlock, type Section } from "./state";
import { Preview, type Device } from "./preview";
import { BlocksPanel } from "./panels/blocks-panel";
import { AddPanel } from "./panels/add-panel";
import { AppearancePanel } from "./panels/appearance-panel";
import { AnalyticsPanel, ProfilePanel, SeoPanel, SettingsPanel, SocialPanel } from "./panels/page-panels";
import { BlockProperties } from "./block-fields";
import { PublishDialog } from "./publish-dialog";
import { IconButton } from "./controls";

export type EditorPage = {
  id: string;
  name: string;
  username: string | null;
  status: "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "SUSPENDED";
  draftVersion: number;
  hasPublished: boolean;
  notifyLeads: boolean;
  templateId: string | null;
  draftDiffers: boolean;
};

type Props = {
  page: EditorPage;
  initialDoc: PageDoc;
  templates: Array<{ id: string; name: string; category: string }>;
  verified: boolean;
  appUrl: string;
  wizard: boolean;
  /** Username typed on the marketing page's claim box, offered at publish. */
  claim?: string;
};

const SECTIONS: Array<{ id: Section; label: string; icon: IconName }> = [
  { id: "profile", label: "Profile", icon: "user" },
  { id: "blocks", label: "Links", icon: "link" },
  { id: "social", label: "Social", icon: "share" },
  { id: "add", label: "Content", icon: "plus" },
  { id: "appearance", label: "Appearance", icon: "palette" },
  { id: "seo", label: "SEO", icon: "search" },
  { id: "analytics", label: "Analytics", icon: "chart" },
  { id: "settings", label: "Settings", icon: "settings" },
];

type Save = "saved" | "dirty" | "saving" | "error" | "conflict";

export function EditorApp({ page: initialPage, initialDoc, templates, verified, appUrl, wizard, claim }: Props) {
  const [state, dispatch] = useReducer(reducer, initialDoc, init);
  const [page, setPage] = useState(initialPage);
  const [section, setSection] = useState<Section>(wizard ? "profile" : "blocks");
  const [device, setDevice] = useState<Device>("phone");
  const [save, setSave] = useState<Save>("saved");
  const [saveError, setSaveError] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [dirtySincePublish, setDirtySincePublish] = useState(initialPage.draftDiffers);
  const [clicks, setClicks] = useState<Record<string, number> | null>(null);
  useEffect(() => {
    if (!initialPage.hasPublished) return;
    fetch(`/api/pages/${initialPage.id}/stats`)
      .then((r) => r.json())
      .then((d: { topLinks?: Array<{ blockId: string; clicks: number }> }) => {
        const map: Record<string, number> = {};
        for (const l of d.topLinks ?? []) map[l.blockId] = l.clicks;
        // Every published block shows a count, zero included.
        setClicks(map);
      })
      .catch(() => {});
  }, [initialPage.id, initialPage.hasPublished]);
  const version = useRef(initialPage.draftVersion);
  const savedDoc = useRef(initialDoc);
  const inflight = useRef<Promise<boolean> | null>(null);
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  });

  const { doc, selectedId } = state;
  const selected = doc.blocks.find((b) => b.id === selectedId) ?? null;
  const pageUrl = page.username ? `${appUrl}/${page.username}` : appUrl;

  /* ── autosave ─────────────────────────────────────────────────────────── */

  const flush = useCallback(async (): Promise<boolean> => {
    if (inflight.current) await inflight.current;
    const current = stateRef.current.doc;
    if (current === savedDoc.current) return true;
    setSave("saving");
    const p = (async () => {
      try {
        const res = await fetch(`/api/pages/${page.id}/draft`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ doc: current, version: version.current }) });
        const d = await res.json().catch(() => ({}));
        if (res.status === 409) {
          setSave("conflict");
          setSaveError(d.error);
          return false;
        }
        if (!res.ok) {
          setSave("error");
          setSaveError(d.error ?? "Couldn't save");
          return false;
        }
        version.current = d.version;
        savedDoc.current = current;
        setSave(stateRef.current.doc === current ? "saved" : "dirty");
        setDirtySincePublish(true);
        return true;
      } catch {
        setSave("error");
        setSaveError("You're offline — changes will save when the connection returns.");
        return false;
      } finally {
        inflight.current = null;
      }
    })();
    inflight.current = p;
    return p;
  }, [page.id]);

  useEffect(() => {
    if (doc === savedDoc.current) return;
    if (save === "conflict") return;
    const t = setTimeout(() => void flush(), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, flush]);

  useEffect(() => {
    const onOnline = () => save === "error" && void flush();
    const onBefore = (e: BeforeUnloadEvent) => {
      if (stateRef.current.doc !== savedDoc.current) e.preventDefault();
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("beforeunload", onBefore);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("beforeunload", onBefore);
    };
  }, [flush, save]);

  const markDirty = () => setSave((s) => (s === "conflict" ? s : "dirty"));
  const change = (fn: (d: PageDoc) => PageDoc, coalesce?: string) => {
    dispatch({ type: "change", fn, coalesce });
    markDirty();
  };
  const undo = () => {
    dispatch({ type: "undo" });
    markDirty();
  };
  const redo = () => {
    dispatch({ type: "redo" });
    markDirty();
  };

  /* ── keyboard: undo / redo / save ─────────────────────────────────────── */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const inField = (e.target as HTMLElement)?.closest?.("input, textarea, select, [contenteditable]");
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        void flush();
      } else if (e.key.toLowerCase() === "z" && !inField) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (e.key.toLowerCase() === "y" && !inField) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flush]);

  /* ── document operations ──────────────────────────────────────────────── */

  const select = (id: string | null) => dispatch({ type: "select", id });

  function addBlock(type: BlockType) {
    const id = newId();
    let block: Block = newBlock(type, id);
    if (type === "qr") block = { ...block, url: "" } as Block;
    change((d) => insertBlock(d, block, selectedId));
    select(id);
    setSection("blocks");
    setMobileView("edit");
  }
  function duplicate(id: string) {
    const b = doc.blocks.find((x) => x.id === id);
    if (!b) return;
    const copy = { ...structuredClone(b), id: newId() } as Block;
    change((d) => insertBlock(d, copy, id));
    select(copy.id);
  }
  function remove(id: string) {
    change((d) => removeBlock(d, id));
    if (selectedId === id) select(null);
  }
  function move(id: string, dir: -1 | 1) {
    const i = doc.blocks.findIndex((b) => b.id === id);
    change((d) => moveBlock(d, i, i + dir));
  }

  async function serverReplace(url: string, body?: object) {
    await flush();
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body ?? {}) });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error ?? "Failed");
    const next = parseDoc(d.doc);
    // The server bumped draftVersion; re-read it so autosave stays in step.
    const fresh = await fetch(`/api/pages/${page.id}/draft`).then((r) => r.json());
    version.current = fresh.version;
    savedDoc.current = next;
    // savedDoc === the replaced doc, so autosave sees nothing to write.
    dispatch({ type: "replace", doc: next });
    setSave("saved");
  }

  /* ── render ───────────────────────────────────────────────────────────── */

  const saveLabel = { saved: "All changes saved", dirty: "Unsaved changes", saving: "Saving…", error: saveError || "Save failed", conflict: saveError || "Edited elsewhere" }[save];

  const panel = (() => {
    switch (section) {
      case "profile":
        return <ProfilePanel doc={doc} pageId={page.id} set={(patch, c) => change((d) => ({ ...d, profile: { ...d.profile, ...patch } }), c)} />;
      case "blocks":
        return (
          <BlocksPanel
            doc={doc}
            selectedId={selectedId}
            onSelect={(id) => select(id)}
            onMove={(from, to) => change((d) => moveBlock(d, from, to))}
            onToggleHidden={(id) => change((d) => updateBlock(d, id, (b) => ({ ...b, hidden: !b.hidden })))}
            onDuplicate={duplicate}
            onDelete={remove}
            onRestore={(id) => change((d) => restoreBlock(d, id))}
            onAdd={() => setSection("add")}
            onPatch={(id, patch, c) => change((d) => updateBlock(d, id, (b) => ({ ...b, ...patch }) as Block), c)}
            clicks={clicks}
          />
        );
      case "social":
        return <SocialPanel doc={doc} setSocials={(patch) => change((d) => ({ ...d, socials: { ...d.socials, ...patch } }), "socials")} />;
      case "add":
        return <AddPanel onAdd={addBlock} />;
      case "appearance":
        return (
          <AppearancePanel
            doc={doc}
            pageId={page.id}
            setTheme={(fn: (t: Theme) => Theme, c?: string) => change((d) => ({ ...d, theme: fn(d.theme) }), c)}
            setProfile={(patch) => change((d) => ({ ...d, profile: { ...d.profile, ...patch } }))}
            setSocialPosition={(position) => change((d) => ({ ...d, socials: { ...d.socials, position } }))}
            templates={templates}
            currentTemplate={page.templateId}
            onSwitchTemplate={async (templateId, replaceContent) => {
              await serverReplace(`/api/pages/${page.id}/template`, { templateId, replaceContent });
              setPage((p) => ({ ...p, templateId }));
            }}
            onRestoreVersion={(versionId) => serverReplace(`/api/pages/${page.id}/versions`, { versionId })}
          />
        );
      case "seo":
        return <SeoPanel doc={doc} pageId={page.id} url={pageUrl} set={(patch, c) => change((d) => ({ ...d, seo: { ...d.seo, ...patch } }), c)} />;
      case "analytics":
        return <AnalyticsPanel pageId={page.id} published={page.status === "PUBLISHED"} />;
      case "settings":
        return (
          <SettingsPanel
            doc={doc}
            page={page}
            appUrl={appUrl}
            setSettings={(patch) => change((d) => ({ ...d, settings: { ...d.settings, ...patch } }))}
            onUsername={(u) => setPage((p) => ({ ...p, username: u }))}
            onUnpublish={async () => {
              const res = await fetch(`/api/pages/${page.id}/unpublish`, { method: "POST" });
              if (res.ok) setPage((p) => ({ ...p, status: "UNPUBLISHED" }));
            }}
            onRevert={async () => {
              await serverReplace(`/api/pages/${page.id}/revert`);
              setDirtySincePublish(false);
            }}
          />
        );
    }
  })();

  const properties = selected ? (
    <BlockProperties
      key={selected.id}
      block={selected}
      pageId={page.id}
      set={(patch, c) => change((d) => updateBlock(d, selected.id, (b) => ({ ...b, ...patch }) as Block), c)}
    />
  ) : (
    <div className="p-5 text-small text-fg-muted">
      <p className="font-semibold text-fg">Nothing selected</p>
      <p className="mt-1">Click a block in the preview — or in the Links list — to edit its content, typography, colours, spacing, animation and visibility here.</p>
      <p className="mt-4">Tip: click any text in the preview to edit it in place.</p>
      <ul className="mt-4 flex flex-col gap-1">
        <li>
          <kbd className="rounded bg-canvas-inset px-1">⌘/Ctrl Z</kbd> undo · <kbd className="rounded bg-canvas-inset px-1">⇧⌘Z</kbd> redo
        </li>
        <li>
          <kbd className="rounded bg-canvas-inset px-1">⌘/Ctrl S</kbd> save now
        </li>
      </ul>
    </div>
  );

  return (
    <div className="flex h-dvh flex-col bg-canvas-secondary">
      {/* top bar */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-surface px-3">
        <Link href="/dashboard/pages" className="grid size-9 place-items-center rounded-sm text-fg-secondary hover:bg-canvas-inset" aria-label="Back to my pages">
          <Icon name="arrowLeft" />
        </Link>
        <div className="hidden sm:block">
          <Logo />
        </div>
        <div className="min-w-0 sm:ml-3">
          <p className="truncate text-small font-semibold text-fg">{page.name}</p>
          <p className={`flex items-center gap-1 truncate text-[12px] ${save === "error" || save === "conflict" ? "text-error" : "text-fg-muted"}`} role="status" aria-live="polite" data-save-state={save}>
            {save === "saved" ? <Icon name="check" size={12} /> : null}
            {saveLabel}
            {save === "conflict" ? (
              <button type="button" className="ml-1 underline" onClick={() => location.reload()}>
                Reload
              </button>
            ) : null}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <IconButton label="Undo" onClick={undo} disabled={!state.past.length}>
            <Icon name="undo" />
          </IconButton>
          <IconButton label="Redo" onClick={redo} disabled={!state.future.length}>
            <Icon name="redo" />
          </IconButton>
          <div className="mx-1 hidden items-center gap-0.5 rounded-sm bg-canvas-inset p-0.5 md:flex" role="group" aria-label="Preview device">
            {(["phone", "tablet", "desktop"] as const).map((d) => (
              <IconButton key={d} label={`${d[0].toUpperCase()}${d.slice(1)} preview`} onClick={() => setDevice(d)} pressed={device === d}>
                <Icon name={d} />
              </IconButton>
            ))}
          </div>
          <a href={`/preview/${page.id}`} target="_blank" rel="noreferrer" onClick={() => void flush()} className="btn hidden h-9 px-3 text-small text-fg ring-1 ring-line hover:bg-canvas-secondary sm:inline-flex">
            Preview
          </a>
          {page.status === "PUBLISHED" && page.username ? (
            <a href={pageUrl} target="_blank" rel="noreferrer" className="btn hidden h-9 px-3 text-small text-fg-secondary hover:bg-canvas-inset lg:inline-flex" title="Open the live page">
              <Icon name="external" size={16} /> Live
            </a>
          ) : null}
          <button type="button" onClick={() => setPublishOpen(true)} className="btn h-9 bg-primary px-4 text-small text-white hover:bg-primary-hover" data-publish>
            {page.status === "PUBLISHED" ? (dirtySincePublish ? "Republish" : "Published") : "Publish"}
          </button>
        </div>
      </header>

      {wizard ? (
        <div className="flex items-center justify-between gap-3 border-b border-line bg-primary-soft px-4 py-2 text-small">
          <span>
            <strong className="text-fg">Step 2 of 3 — Customize.</strong> Add your name, photo and links. Everything saves automatically.
          </span>
          <span className="flex shrink-0 gap-2">
            <Link href="/dashboard/new" className="btn h-8 px-3 text-[13px] text-fg ring-1 ring-line hover:bg-surface">
              Back
            </Link>
            <button type="button" className="btn h-8 bg-primary px-3 text-[13px] text-white" onClick={() => setPublishOpen(true)}>
              Continue to publish
            </button>
          </span>
        </div>
      ) : null}

      {/* mobile edit/preview switch */}
      <div className="flex border-b border-line bg-surface lg:hidden" role="tablist" aria-label="Editor view">
        {(["edit", "preview"] as const).map((v) => (
          <button key={v} role="tab" type="button" aria-selected={mobileView === v} onClick={() => setMobileView(v)} className={`flex-1 py-2.5 text-small font-semibold ${mobileView === v ? "border-b-2 border-primary text-primary" : "text-fg-muted"}`}>
            {v === "edit" ? "Edit" : "Preview"}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* left: section rail + panel */}
        <div className={`min-h-0 w-full flex-col border-r border-line bg-surface lg:flex lg:w-[380px] lg:shrink-0 ${mobileView === "edit" ? "flex" : "hidden"}`}>
          <nav aria-label="Editor sections" className="grid shrink-0 grid-cols-4 gap-1 border-b border-line px-2 py-2 sm:grid-cols-8 lg:grid-cols-4">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                aria-current={section === s.id ? "true" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-sm px-1 py-1.5 text-[11px] font-semibold ${section === s.id ? "bg-primary-soft text-primary" : "text-fg-muted hover:bg-canvas-inset hover:text-fg"}`}
                data-section={s.id}
              >
                <Icon name={s.icon} size={18} />
                {s.label}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {panel}
            {/* On small screens the properties panel lives under the list. */}
            {selected && section === "blocks" ? <div className="border-t-4 border-canvas-secondary xl:hidden">{properties}</div> : null}
          </div>
        </div>

        {/* centre: preview */}
        <div className={`min-h-0 min-w-0 flex-1 flex-col lg:flex ${mobileView === "preview" ? "flex" : "hidden"}`}>
          <Preview
            doc={doc}
            device={device}
            pageId={page.id}
            pageUrl={pageUrl}
            selectedId={selectedId}
            onSelect={(id) => {
              select(id);
              if (id) setSection("blocks");
            }}
            onText={(path, value) => change((d) => setPath(d, path, value), `text:${path}`)}
            onMove={move}
            onDuplicate={duplicate}
            onDelete={remove}
          />
        </div>

        {/* right: contextual properties */}
        <aside aria-label="Properties" className="hidden min-h-0 w-[320px] shrink-0 overflow-y-auto border-l border-line bg-surface xl:block">
          {properties}
        </aside>
      </div>

      {publishOpen ? (
        <PublishDialog
          pageId={page.id}
          username={page.username}
          suggested={claim}
          appUrl={appUrl}
          verified={verified}
          beforePublish={flush}
          onClose={() => setPublishOpen(false)}
          onPublished={(u) => {
            setPage((p) => ({ ...p, username: u, status: "PUBLISHED", hasPublished: true }));
            setDirtySincePublish(false);
          }}
          onFix={(blockId) => {
            setPublishOpen(false);
            if (blockId) {
              select(blockId);
              setSection("blocks");
            } else setSection("profile");
          }}
        />
      ) : null}
    </div>
  );
}
