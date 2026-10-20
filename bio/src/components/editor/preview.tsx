"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Block, PageDoc } from "@/lib/bio/schema";
import { BioPage, type EditorHooks } from "@/components/bio/renderer";
import { CATALOG } from "@/lib/bio/catalog";
import { Icon } from "@/components/dashboard/icons";

export type Device = "phone" | "tablet" | "desktop";
const WIDTH: Record<Device, number> = { phone: 390, tablet: 768, desktop: 1280 };
const HEIGHT: Record<Device, number> = { phone: 780, tablet: 1024, desktop: 800 };

type Props = {
  doc: PageDoc;
  device: Device;
  pageId: string;
  pageUrl: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onText: (path: string, value: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

/**
 * Inline-editable text. Uncontrolled while focused (React never rewrites the
 * node under the caret); synced from the document when it isn't.
 */
function Editable({ path, value, multiline, placeholder, onText }: { path: string; value: string; multiline?: boolean; placeholder?: string; onText: (p: string, v: string) => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== value) el.textContent = value;
  }, [value]);
  if (!path) return <>{value}</>;
  return (
    <span
      ref={ref}
      role="textbox"
      aria-label={placeholder ?? "Edit text"}
      aria-multiline={multiline || undefined}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck
      data-editable={path}
      data-placeholder={placeholder}
      className="sbio-editable"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
        if (e.key === "Escape") (e.target as HTMLElement).blur();
      }}
      onInput={(e) => onText(path, (e.target as HTMLElement).textContent ?? "")}
      onPaste={(e) => {
        // Plain text only, whatever the browser's support for plaintext-only.
        e.preventDefault();
        document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
      }}
    />
  );
}

function Wrapper({ block, selected, children, p }: { block: Block; selected: boolean; children: ReactNode; p: Props }) {
  const i = p.doc.blocks.findIndex((b) => b.id === block.id);
  return (
    <div
      className={`sbio-sel ${selected ? "is-selected" : ""} ${block.hidden ? "is-hidden" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        p.onSelect(block.id);
      }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          p.onSelect(block.id);
        }
      }}
      tabIndex={0}
      role="group"
      aria-label={`${CATALOG[block.type].label} block${block.hidden ? " (hidden)" : ""}`}
      data-preview-block={block.id}
    >
      {selected ? (
        <div className="sbio-toolbar" onClick={(e) => e.stopPropagation()}>
          <span className="sbio-toolbar-label">{CATALOG[block.type].label}</span>
          <button type="button" aria-label="Move up" disabled={i <= 0} onClick={() => p.onMove(block.id, -1)}>
            ↑
          </button>
          <button type="button" aria-label="Move down" disabled={i < 0 || i >= p.doc.blocks.length - 1} onClick={() => p.onMove(block.id, 1)}>
            ↓
          </button>
          <button type="button" aria-label="Duplicate" onClick={() => p.onDuplicate(block.id)}>
            <Icon name="copy" size={14} />
          </button>
          <button type="button" aria-label="Delete" onClick={() => p.onDelete(block.id)}>
            <Icon name="trash" size={14} />
          </button>
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function Preview(p: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const [avail, setAvail] = useState(900);
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAvail(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const w = WIDTH[p.device];
  const scale = Math.min(1, (avail - 32) / w);
  const h = HEIGHT[p.device];

  const hooks: EditorHooks = {
    wrap: (block, node) => (
      <Wrapper key={block.id} block={block} selected={block.id === p.selectedId} p={p}>
        {node}
      </Wrapper>
    ),
    text: (path, value, opts) => <Editable path={path} value={value} multiline={opts?.multiline} placeholder={opts?.placeholder} onText={p.onText} />,
  };

  return (
    <div ref={outer} className="flex min-h-0 flex-1 justify-center overflow-auto bg-canvas-inset px-4 py-6" onClick={() => p.onSelect(null)}>
      <div style={{ width: w * scale, height: h * scale }} className="shrink-0">
        <div
          className={`sbio-device sbio-device-${p.device}`}
          style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}
          data-device={p.device}
        >
          <div className="sbio-screen">
            <BioPage doc={p.doc} ctx={{ mode: "preview", pageId: p.pageId, pageUrl: p.pageUrl, editor: hooks }} />
          </div>
        </div>
      </div>
    </div>
  );
}
