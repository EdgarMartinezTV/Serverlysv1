import type { Block, PageDoc } from "@/lib/bio/schema";
import { LIMITS } from "@/lib/bio/schema";

/**
 * Editor state: the document plus an undo/redo history.
 *
 * Typing produces one change per keystroke; `coalesce` merges consecutive
 * changes with the same key inside 1s into ONE history entry, so undo steps
 * back a word-burst, not a letter.
 */

export type Section = "profile" | "blocks" | "social" | "add" | "appearance" | "seo" | "analytics" | "settings";

export type EditorState = {
  doc: PageDoc;
  past: PageDoc[];
  future: PageDoc[];
  selectedId: string | null;
  lastKey: string | null;
  lastAt: number;
};

export type Action =
  | { type: "change"; fn: (d: PageDoc) => PageDoc; coalesce?: string }
  | { type: "replace"; doc: PageDoc }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "select"; id: string | null };

const HISTORY = 100;

export function init(doc: PageDoc): EditorState {
  return { doc, past: [], future: [], selectedId: null, lastKey: null, lastAt: 0 };
}

export function reducer(s: EditorState, a: Action): EditorState {
  switch (a.type) {
    case "change": {
      const next = a.fn(s.doc);
      if (next === s.doc) return s;
      const now = Date.now();
      const merge = a.coalesce && a.coalesce === s.lastKey && now - s.lastAt < 1000;
      return {
        ...s,
        doc: next,
        past: merge ? s.past : [...s.past, s.doc].slice(-HISTORY),
        future: [],
        lastKey: a.coalesce ?? null,
        lastAt: now,
      };
    }
    case "replace":
      return { ...s, doc: a.doc, past: [...s.past, s.doc].slice(-HISTORY), future: [], lastKey: null };
    case "undo": {
      const prev = s.past.at(-1);
      if (!prev) return s;
      return { ...s, doc: prev, past: s.past.slice(0, -1), future: [s.doc, ...s.future], lastKey: null };
    }
    case "redo": {
      const next = s.future[0];
      if (!next) return s;
      return { ...s, doc: next, past: [...s.past, s.doc], future: s.future.slice(1), lastKey: null };
    }
    case "select":
      return { ...s, selectedId: a.id };
  }
}

/* ── document helpers (pure) ───────────────────────────────────────────── */

export function updateBlock(doc: PageDoc, id: string, patch: Partial<Block> | ((b: Block) => Block)): PageDoc {
  return { ...doc, blocks: doc.blocks.map((b) => (b.id === id ? (typeof patch === "function" ? patch(b) : ({ ...b, ...patch } as Block)) : b)) };
}

export function insertBlock(doc: PageDoc, block: Block, afterId?: string | null): PageDoc {
  const i = afterId ? doc.blocks.findIndex((b) => b.id === afterId) : -1;
  const blocks = [...doc.blocks];
  blocks.splice(i >= 0 ? i + 1 : blocks.length, 0, block);
  return { ...doc, blocks };
}

export function removeBlock(doc: PageDoc, id: string): PageDoc {
  const b = doc.blocks.find((x) => x.id === id);
  if (!b) return doc;
  return { ...doc, blocks: doc.blocks.filter((x) => x.id !== id), trash: [b, ...doc.trash].slice(0, LIMITS.trash) };
}

export function restoreBlock(doc: PageDoc, id: string): PageDoc {
  const b = doc.trash.find((x) => x.id === id);
  if (!b) return doc;
  return { ...doc, trash: doc.trash.filter((x) => x.id !== id), blocks: [...doc.blocks, b] };
}

export function moveBlock(doc: PageDoc, from: number, to: number): PageDoc {
  if (from === to || from < 0 || to < 0 || from >= doc.blocks.length || to >= doc.blocks.length) return doc;
  const blocks = [...doc.blocks];
  const [m] = blocks.splice(from, 1);
  blocks.splice(to, 0, m);
  return { ...doc, blocks };
}

/** Set a value at a dotted path: "profile.name", "block.<id>.title". */
export function setPath(doc: PageDoc, path: string, value: string): PageDoc {
  const [head, ...rest] = path.split(".");
  if (head === "profile") return { ...doc, profile: { ...doc.profile, [rest[0]]: value } };
  if (head === "block") return updateBlock(doc, rest[0], { [rest[1]]: value } as Partial<Block>);
  return doc;
}
