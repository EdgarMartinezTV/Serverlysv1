"use client";

import { useCallback, useId, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { upload, type Kind } from "./upload";

const ASPECT: Record<Exclude<Kind, "file">, number | undefined> = { avatar: 1, cover: 2.4, image: undefined, background: undefined };

/**
 * Image input: upload → crop/reposition dialog → server re-encodes (sharp)
 * and returns a /media URL. A pasted https URL is accepted too.
 */
export function ImageField({ label, value, onChange, kind = "image", pageId, aspect }: { label: string; value: string; onChange: (url: string) => void; kind?: Exclude<Kind, "file">; pageId: string; aspect?: number }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ file: File; src: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [url, setUrl] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <span id={id} className="text-small font-medium text-fg">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-sm bg-canvas-inset ring-1 ring-line">
          {value ? <img src={value} alt="" className="size-full object-cover" /> : <span className="text-[11px] text-fg-muted">None</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-describedby={id} onClick={() => input.current?.click()} className="btn h-9 px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary" disabled={busy}>
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          <button type="button" onClick={() => setUrlMode((v) => !v)} className="btn h-9 px-3 text-[13px] text-fg-secondary hover:bg-canvas-inset">
            URL
          </button>
          {value ? (
            <button type="button" onClick={() => onChange("")} className="btn h-9 px-3 text-[13px] text-error hover:bg-error-soft">
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        tabIndex={-1}
        aria-label={`${label} file`}
        data-upload={kind}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setError("");
          if (f.type === "image/gif") {
            // Cropping would flatten an animation — upload GIFs as-is.
            setBusy(true);
            upload(f, kind, pageId)
              .then((u) => onChange(u.url))
              .catch((err) => setError(err.message))
              .finally(() => setBusy(false));
            return;
          }
          setFile({ file: f, src: URL.createObjectURL(f) });
        }}
      />
      {urlMode ? (
        <div className="flex gap-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" aria-label={`${label} URL`} className="field min-h-9 text-small" />
          <button
            type="button"
            className="btn h-9 bg-primary px-3 text-[13px] text-white"
            onClick={() => {
              if (!/^https:\/\/\S+$/i.test(url.trim())) return setError("Use an https:// image URL");
              onChange(url.trim());
              setUrl("");
              setUrlMode(false);
              setError("");
            }}
          >
            Use
          </button>
        </div>
      ) : null}
      {error ? <p className="text-[12px] text-error" role="alert">{error}</p> : null}
      {file ? (
        <CropDialog
          src={file.src}
          aspect={aspect ?? ASPECT[kind]}
          round={kind === "avatar"}
          onCancel={() => {
            URL.revokeObjectURL(file.src);
            setFile(null);
          }}
          onConfirm={async (area) => {
            setBusy(true);
            try {
              const u = await upload(file.file, kind, pageId, area);
              onChange(u.url);
              URL.revokeObjectURL(file.src);
              setFile(null);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
              setFile(null);
            } finally {
              setBusy(false);
            }
          }}
        />
      ) : null}
    </div>
  );
}

function CropDialog({ src, aspect, round, onCancel, onConfirm }: { src: string; aspect?: number; round: boolean; onCancel: () => void; onConfirm: (a: Area | null) => void }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [free, setFree] = useState(aspect === undefined);
  const [area, setArea] = useState<Area | null>(null);
  const onComplete = useCallback((_: Area, px: Area) => setArea(px), []);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Crop image">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-xl bg-surface shadow-e5">
        <div className="relative h-[360px] bg-ink-950">
          <Cropper image={src} crop={crop} zoom={zoom} aspect={free ? undefined : (aspect ?? 4 / 3)} cropShape={round ? "round" : "rect"} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onComplete} showGrid={!round} objectFit="contain" />
        </div>
        <div className="flex flex-col gap-3 p-4">
          <label className="flex items-center gap-3 text-small text-fg">
            Zoom
            <input type="range" min={1} max={4} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-primary" />
          </label>
          {aspect === undefined ? (
            <label className="flex items-center gap-2 text-small text-fg">
              <input type="checkbox" checked={!free} onChange={(e) => setFree(!e.target.checked)} className="accent-primary" /> Lock to 4:3
            </label>
          ) : null}
          <p className="text-[12px] text-fg-muted">Drag to reposition. The image is resized and converted to WebP; location data in the photo is removed.</p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="btn h-10 px-4 text-small text-fg ring-1 ring-line hover:bg-canvas-secondary">
              Cancel
            </button>
            <button type="button" onClick={() => onConfirm(free && zoom === 1 && crop.x === 0 && crop.y === 0 ? null : area)} className="btn h-10 bg-primary px-4 text-small text-white hover:bg-primary-hover" data-crop-confirm>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Non-image file (PDF, ZIP, MP3, EPUB). */
export function FileField({ value, fileName, onChange, pageId }: { value: string; fileName: string; onChange: (v: { src: string; fileName: string; bytes: number }) => void; pageId: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <span className="text-small font-medium text-fg">File</span>
      <p className="text-small text-fg-muted">{value ? fileName || "Uploaded file" : "PDF, ZIP, MP3, MP4 or EPUB, up to 20 MB."}</p>
      <button type="button" onClick={() => input.current?.click()} className="btn h-9 w-fit px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary" disabled={busy}>
        {busy ? "Uploading…" : value ? "Replace file" : "Upload file"}
      </button>
      <input
        ref={input}
        type="file"
        className="sr-only"
        tabIndex={-1}
        aria-label="File to share"
        accept=".pdf,.zip,.mp3,.mp4,.epub,application/pdf,application/zip,audio/mpeg,video/mp4,application/epub+zip"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setBusy(true);
          setError("");
          try {
            const u = await upload(f, "file", pageId);
            onChange({ src: u.url, fileName: u.fileName, bytes: u.bytes });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
          }
        }}
      />
      {error ? <p className="text-[12px] text-error" role="alert">{error}</p> : null}
    </div>
  );
}
