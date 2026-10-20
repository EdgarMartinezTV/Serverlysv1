"use client";

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block, PageDoc } from "@/lib/bio/schema";
import { CATALOG, summary } from "@/lib/bio/catalog";
import { isLive } from "@/lib/bio/validate";
import { Icon } from "@/components/dashboard/icons";

type Props = {
  doc: PageDoc;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (from: number, to: number) => void;
  onToggleHidden: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onAdd: () => void;
  /** Inline edits from the card (title / URL), coalesced by the caller. */
  onPatch: (id: string, patch: Record<string, string>, coalesce: string) => void;
  /** Clicks per block over the last 7 days (published pages only). */
  clicks: Record<string, number> | null;
};

/**
 * The ordered block list. Drag with a pointer, or focus a handle and use
 * Space + arrow keys (dnd-kit's keyboard sensor) — reordering never needs a mouse.
 */
export function BlocksPanel(p: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const ids = p.doc.blocks.map((b) => b.id);

  function onDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    p.onMove(ids.indexOf(String(e.active.id)), ids.indexOf(String(e.over.id)));
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <button type="button" onClick={p.onAdd} className="btn h-11 bg-primary text-small text-white hover:bg-primary-hover" data-add-block>
        <Icon name="plus" size={16} /> Add link or block
      </button>
      {p.doc.blocks.length === 0 ? <p className="rounded-sm bg-canvas-secondary p-4 text-center text-small text-fg-muted">No blocks yet. Add a link to get started.</p> : null}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        accessibility={{
          screenReaderInstructions: { draggable: "To reorder, press space or enter to pick up the block, use the arrow keys to move it, then press space or enter to drop it." },
        }}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2" aria-label="Blocks on this page">
            {p.doc.blocks.map((b) => (
              <Row key={b.id} block={b} selected={b.id === p.selectedId} {...p} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {p.doc.trash.length ? (
        <details className="mt-4 rounded-sm bg-canvas-secondary p-3">
          <summary className="cursor-pointer text-small font-semibold text-fg">Recently deleted ({p.doc.trash.length})</summary>
          <ul className="mt-2 flex flex-col gap-1">
            {p.doc.trash.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-2 text-small">
                <span className="truncate">
                  {CATALOG[b.type].label}: {summary(b)}
                </span>
                <button type="button" onClick={() => p.onRestore(b.id)} className="shrink-0 font-semibold text-primary hover:underline" aria-label={`Restore ${CATALOG[b.type].label}: ${summary(b)}`}>
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

const INLINE_URL = new Set(["link", "featured", "booking"]);

function Row({ block, selected, onSelect, onToggleHidden, onDuplicate, onDelete, onPatch, clicks }: Props & { block: Block; selected: boolean }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const live = isLive(block);
  const scheduled = Boolean(block.schedule.start || block.schedule.end);
  const inline = INLINE_URL.has(block.type);
  const b = block as Block & { title?: string; url?: string };
  const count = clicks ? (clicks[block.id] ?? 0) : undefined;
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-stretch gap-1 rounded-[20px] bg-surface p-2 shadow-e1 ring-1 transition-shadow ${selected ? "ring-2 ring-primary" : "ring-line hover:shadow-e2"} ${isDragging ? "z-10 shadow-e4" : ""}`}
      data-block-row={block.id}
    >
      <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} aria-label={`Reorder ${CATALOG[block.type].label}: ${summary(block)}`} className="grid w-7 shrink-0 cursor-grab place-items-center rounded-sm text-fg-muted hover:bg-canvas-inset active:cursor-grabbing" data-drag-handle>
        <Icon name="drag" size={16} />
      </button>
      <div className={`min-w-0 flex-1 py-1 ${block.hidden ? "opacity-55" : ""}`}>
        {inline ? (
          <>
            <input
              value={b.title ?? ""}
              onChange={(e) => onPatch(block.id, { title: e.target.value }, `${block.id}.title`)}
              placeholder="Title"
              aria-label="Link title"
              maxLength={120}
              className="w-full rounded-[6px] bg-transparent px-1 py-0.5 text-small font-semibold text-fg outline-none placeholder:text-fg-muted hover:bg-canvas-secondary focus:bg-canvas-secondary"
            />
            <input
              value={b.url ?? ""}
              onChange={(e) => onPatch(block.id, { url: e.target.value }, `${block.id}.url`)}
              placeholder="URL"
              aria-label="Link URL"
              inputMode="url"
              maxLength={2048}
              className="w-full rounded-[6px] bg-transparent px-1 py-0.5 text-[13px] text-fg-secondary outline-none placeholder:text-fg-muted hover:bg-canvas-secondary focus:bg-canvas-secondary"
            />
          </>
        ) : (
          <button type="button" onClick={() => onSelect(block.id)} className="block w-full px-1 text-left" aria-pressed={selected}>
            <span className="block truncate text-small font-semibold text-fg">{summary(block)}</span>
            <span className="block text-[12px] text-fg-muted">{CATALOG[block.type].label}</span>
          </button>
        )}
        <div className="mt-1 flex items-center gap-0.5 text-fg-muted">
          <button type="button" onClick={() => onSelect(block.id)} aria-label={`Edit details of ${summary(block)}`} title="Thumbnail, style, schedule…" className={`grid size-7 place-items-center rounded-[6px] hover:bg-canvas-inset hover:text-fg ${selected ? "text-primary" : ""}`}>
            <Icon name="edit" size={15} />
          </button>
          <button type="button" onClick={() => onSelect(block.id)} aria-label={scheduled ? "Scheduled — edit schedule" : "Schedule"} title={scheduled ? (live ? "Scheduled (live now)" : "Scheduled (not live now)") : "Schedule"} className={`grid size-7 place-items-center rounded-[6px] hover:bg-canvas-inset hover:text-fg ${scheduled ? "text-warning" : ""}`}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" />
            </svg>
          </button>
          {count !== undefined ? (
            <span className="ml-1 inline-flex items-center gap-1 text-[12px]" title="Clicks, last 7 days">
              <Icon name="chart" size={13} /> {count} {count === 1 ? "click" : "clicks"}
            </span>
          ) : null}
          <span className="ml-auto" />
          <button type="button" onClick={() => onDuplicate(block.id)} aria-label="Duplicate block" title="Duplicate" className="grid size-7 place-items-center rounded-[6px] hover:bg-canvas-inset hover:text-fg">
            <Icon name="copy" size={15} />
          </button>
          <button type="button" onClick={() => onDelete(block.id)} aria-label="Delete block" title="Delete" className="grid size-7 place-items-center rounded-[6px] hover:bg-error-soft hover:text-error">
            <Icon name="trash" size={15} />
          </button>
        </div>
      </div>
      <div className="flex shrink-0 items-start pt-1.5 pr-1">
        <button
          type="button"
          role="switch"
          aria-checked={!block.hidden}
          aria-label={block.hidden ? "Show block" : "Hide block"}
          onClick={() => onToggleHidden(block.id)}
          className={`relative h-6 w-10 rounded-full transition-colors ${block.hidden ? "bg-line-strong" : "bg-success-fill"}`}
        >
          <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow-e2 transition-[left] ${block.hidden ? "left-0.5" : "left-[18px]"}`} />
        </button>
      </div>
    </li>
  );
}
