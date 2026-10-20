"use client";

import { useEffect, useState } from "react";
import type { PageDoc, Theme } from "@/lib/bio/schema";
import { FONTS } from "@/lib/bio/schema";
import { FONT_META, FONT_PAIRS } from "@/lib/bio/fonts";
import { PALETTES, applyPalette } from "@/lib/bio/presets";
import { contrast } from "@/lib/bio/color";
import { ColorField, Group, Segmented, SelectField, Slider, Toggle } from "../controls";
import { ImageField } from "../image-field";

type Props = {
  doc: PageDoc;
  pageId: string;
  setTheme: (fn: (t: Theme) => Theme, coalesce?: string) => void;
  setProfile: (patch: Partial<PageDoc["profile"]>) => void;
  setSocialPosition: (p: PageDoc["socials"]["position"]) => void;
  templates: Array<{ id: string; name: string; category: string }>;
  currentTemplate: string | null;
  onSwitchTemplate: (id: string, replaceContent: boolean) => Promise<void>;
  onRestoreVersion: (id: string) => Promise<void>;
};

type Version = { id: string; kind: string; label: string; createdAt: string };
type Style = { id: string; name: string; theme: Theme };

export function AppearancePanel(p: Props) {
  const t = p.doc.theme;
  const set = <K extends keyof Theme>(k: K, v: Theme[K], c?: string) => p.setTheme((th) => ({ ...th, [k]: v }), c);
  const bg = (patch: Partial<Theme["background"]>, c?: string) => p.setTheme((th) => ({ ...th, background: { ...th.background, ...patch } }), c);
  const btn = (patch: Partial<Theme["button"]>, c?: string) => p.setTheme((th) => ({ ...th, button: { ...th.button, ...patch } }), c);
  const lay = (patch: Partial<Theme["layout"]>) => p.setTheme((th) => ({ ...th, layout: { ...th.layout, ...patch } }));
  const mob = (patch: Partial<Theme["mobile"]>, c?: string) => p.setTheme((th) => ({ ...th, mobile: { ...th.mobile, ...patch } }), c);

  const btnContrast = contrast(t.button.color, t.button.text);
  const textBg = t.background.kind === "gradient" ? t.background.from : t.background.color;
  const textContrast = contrast(t.text, textBg);

  return (
    <div>
      <TemplateSwitcher {...p} />

      <Group title="Colour palette">
        <div className="grid grid-cols-5 gap-2">
          {PALETTES.map((pal) => {
            const b = pal.theme.background;
            const swatch = b.kind === "gradient" ? `linear-gradient(${b.angle ?? 180}deg, ${b.from}, ${b.to})` : b.color;
            return (
              <button key={pal.name} type="button" title={pal.name} aria-label={`Apply ${pal.name} palette`} onClick={() => p.setTheme((th) => applyPalette(th, pal))} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-sm ring-1 ring-line hover:ring-primary" style={{ background: swatch }}>
                <span className="h-1.5 w-6 rounded-full" style={{ background: pal.theme.button.color }} />
                <span className="h-1.5 w-4 rounded-full" style={{ background: pal.theme.text }} />
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Background">
        <Segmented label="Type" value={t.background.kind} options={[{ value: "solid", label: "Solid" }, { value: "gradient", label: "Gradient" }, { value: "image", label: "Image" }, { value: "avatar", label: "Photo blur" }]} onChange={(v) => bg({ kind: v })} />
        {t.background.kind === "avatar" ? (
          <>
            <p className="text-[12px] text-fg-muted">Your profile photo, softly blurred behind the whole page.</p>
            <Slider label="Darken" value={t.background.overlay} min={0} max={80} onChange={(v) => bg({ overlay: v }, "bg.overlay")} unit="%" />
            <ColorField label="Fallback colour" value={t.background.color} onChange={(v) => bg({ color: v }, "bg.color")} />
          </>
        ) : null}
        {t.background.kind === "solid" ? <ColorField label="Colour" value={t.background.color} onChange={(v) => bg({ color: v }, "bg.color")} /> : null}
        {t.background.kind === "gradient" ? (
          <>
            <ColorField label="From" value={t.background.from} onChange={(v) => bg({ from: v }, "bg.from")} />
            <ColorField label="To" value={t.background.to} onChange={(v) => bg({ to: v }, "bg.to")} />
            <Slider label="Angle" value={t.background.angle} min={0} max={360} step={5} onChange={(v) => bg({ angle: v }, "bg.angle")} unit="°" />
          </>
        ) : null}
        {t.background.kind === "image" ? (
          <>
            <ImageField label="Background image" value={t.background.image} onChange={(v) => bg({ image: v })} kind="background" pageId={p.pageId} />
            <Segmented label="Anchor photo" value={t.background.position} options={[{ value: "top", label: "Top" }, { value: "center", label: "Center" }, { value: "bottom", label: "Bottom" }]} onChange={(v) => bg({ position: v })} />
            <Slider label="Darken" value={t.background.overlay} min={0} max={80} onChange={(v) => bg({ overlay: v }, "bg.overlay")} unit="%" />
            <ColorField label="Fallback colour" value={t.background.color} onChange={(v) => bg({ color: v }, "bg.color")} />
          </>
        ) : null}
      </Group>

      <Group title="Colours">
        <ColorField label="Text" value={t.text} onChange={(v) => set("text", v, "text")} />
        <ColorField label="Secondary text" value={t.muted} onChange={(v) => set("muted", v, "muted")} />
        <ColorField label="Accent" value={t.accent} onChange={(v) => set("accent", v, "accent")} />
        <ColorField label="Cards" value={t.card} onChange={(v) => set("card", v, "card")} />
        {t.background.kind !== "image" && textContrast < 4.5 ? <p className="rounded-sm bg-warning-soft px-3 py-2 text-[12px] text-warning">Text contrast is {textContrast.toFixed(1)}:1 — below the 4.5:1 that keeps it readable for everyone.</p> : null}
      </Group>

      <Group title="Fonts">
        <div className="grid grid-cols-2 gap-2">
          {FONT_PAIRS.map((pair) => {
            const on = pair.heading === t.headingFont && pair.body === t.bodyFont;
            return (
              <button key={pair.name} type="button" aria-pressed={on} onClick={() => p.setTheme((th) => ({ ...th, headingFont: pair.heading, bodyFont: pair.body }))} className={`rounded-sm p-2 text-left ring-1 ${on ? "bg-primary-soft ring-primary" : "ring-line hover:ring-line-strong"}`}>
                <span className="block truncate text-[15px] text-fg" style={{ fontFamily: FONT_META[pair.heading].stack }}>
                  {pair.name}
                </span>
                <span className="block truncate text-[11px] text-fg-muted">
                  {FONT_META[pair.heading].label} + {FONT_META[pair.body].label}
                </span>
              </button>
            );
          })}
        </div>
        <SelectField label="Headings" value={t.headingFont} onChange={(v) => set("headingFont", v)} options={FONTS.map((f) => ({ value: f, label: FONT_META[f].label }))} />
        <SelectField label="Body" value={t.bodyFont} onChange={(v) => set("bodyFont", v)} options={FONTS.map((f) => ({ value: f, label: FONT_META[f].label }))} />
      </Group>

      <Group title="Buttons">
        <div className="grid grid-cols-3 gap-1.5">
          {(["fill", "outline", "soft", "hard-shadow", "glass", "torn", "wavy"] as const).map((s) => (
            <button key={s} type="button" aria-pressed={t.button.style === s} onClick={() => btn({ style: s })} className={`flex flex-col items-center gap-1 rounded-sm p-1.5 text-[11px] ring-1 ${t.button.style === s ? "bg-primary-soft text-primary ring-primary" : "text-fg-muted ring-line hover:ring-line-strong"}`}>
              <span
                aria-hidden="true"
                className="h-4 w-full rounded"
                style={
                  s === "fill"
                    ? { background: "#101011" }
                    : s === "outline"
                      ? { border: "2px solid #101011" }
                      : s === "soft"
                        ? { background: "#dfe3ea" }
                        : s === "hard-shadow"
                          ? { background: "#fff", border: "2px solid #101011", boxShadow: "2px 2px 0 #101011" }
                          : s === "wavy"
                            ? { background: "#101011", WebkitMask: "radial-gradient(3px at 50% 0,#0000 97%,#000) 50% 0/8px 51% repeat-x,radial-gradient(3px at 50% 100%,#0000 97%,#000) 50% 100%/8px 51% repeat-x" }
                            : s === "torn"
                            ? { background: "#101011", clipPath: "polygon(0 12%,10% 0,22% 14%,35% 2%,50% 12%,64% 0,78% 14%,90% 3%,100% 12%,100% 88%,88% 100%,74% 86%,60% 100%,46% 88%,32% 100%,18% 87%,6% 100%,0 88%)" }
                            : { background: "linear-gradient(135deg,#c6c6cc,#f1f1f3)" }
                }
              />
              {s === "hard-shadow" ? "Retro" : s === "torn" ? "Torn paper" : s === "wavy" ? "Wavy" : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <Slider label="Corner radius" value={t.button.radius} min={0} max={40} onChange={(v) => btn({ radius: v }, "btn.radius")} unit="px" />
        <ColorField label="Button colour" value={t.button.color} onChange={(v) => btn({ color: v }, "btn.color")} />
        <ColorField label="Button text" value={t.button.text} onChange={(v) => btn({ text: v }, "btn.text")} />
        {btnContrast < 4.5 && (t.button.style === "fill" || t.button.style === "hard-shadow") ? <p className="rounded-sm bg-warning-soft px-3 py-2 text-[12px] text-warning">Button text contrast is {btnContrast.toFixed(1)}:1 — aim for 4.5:1 or more.</p> : null}
        <Segmented label="Shadow" value={t.button.shadow} options={[{ value: "none", label: "None" }, { value: "sm", label: "Soft" }, { value: "md", label: "Strong" }]} onChange={(v) => btn({ shadow: v })} />
        <SelectField
          label="Animation"
          value={t.button.animation}
          onChange={(v) => btn({ animation: v })}
          options={[
            { value: "none", label: "None" },
            { value: "lift", label: "Lift on hover (all buttons)" },
            { value: "fade", label: "Fade in on load" },
            { value: "pulse", label: "Pulse (highlighted links)" },
            { value: "wobble", label: "Wobble (highlighted links)" },
            { value: "shine", label: "Shine (highlighted links)" },
          ]}
        />
      </Group>

      <Group title="Header">
        <Segmented label="Layout" value={p.doc.profile.layout} options={[{ value: "classic", label: "Classic" }, { value: "cover", label: "Cover" }, { value: "hero", label: "Hero" }]} onChange={(v) => p.setProfile({ layout: v })} />
        <Segmented label="Profile photo" value={p.doc.profile.avatarShape} options={[{ value: "circle", label: "Circle" }, { value: "rounded", label: "Rounded" }, { value: "square", label: "Square" }]} onChange={(v) => p.setProfile({ avatarShape: v })} />
        <Segmented label="Social icons" value={p.doc.socials.position} options={[{ value: "top", label: "Top" }, { value: "bottom", label: "Bottom" }, { value: "hidden", label: "Hidden" }]} onChange={p.setSocialPosition} />
      </Group>

      <Group title="Layout & spacing">
        <Segmented label="Content width" value={t.layout.width} options={[{ value: "narrow", label: "Narrow" }, { value: "normal", label: "Normal" }, { value: "wide", label: "Wide" }]} onChange={(v) => lay({ width: v })} />
        <Segmented label="Spacing" value={t.layout.spacing} options={[{ value: "compact", label: "Compact" }, { value: "normal", label: "Normal" }, { value: "relaxed", label: "Relaxed" }]} onChange={(v) => lay({ spacing: v })} />
        <Segmented label="Alignment" value={t.layout.align} options={[{ value: "center", label: "Centered" }, { value: "left", label: "Left" }]} onChange={(v) => lay({ align: v })} />
        <Segmented label="On desktop" value={t.layout.desktop} options={[{ value: "full", label: "Full page" }, { value: "card", label: "Card" }]} onChange={(v) => lay({ desktop: v })} />
      </Group>

      <Group title="Mobile adjustments">
        <Slider label="Text size on phones" value={Math.round(t.mobile.fontScale * 100)} min={85} max={115} onChange={(v) => mob({ fontScale: v / 100 }, "mob.scale")} unit="%" />
        <Toggle label="Compact spacing on phones" checked={t.mobile.compact} onChange={(v) => mob({ compact: v })} />
      </Group>

      <SavedStyles theme={t} onApply={(th) => p.setTheme(() => th)} />
      <Versions pageId={p.pageId} onRestore={p.onRestoreVersion} />
    </div>
  );
}

function TemplateSwitcher({ templates, currentTemplate, onSwitchTemplate }: Props) {
  const [id, setId] = useState(currentTemplate ?? templates[0]?.id ?? "");
  const [replace, setReplace] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <Group title="Template">
      <SelectField label="Switch template" value={id} onChange={setId} options={templates.map((x) => ({ value: x.id, label: x.name }))} />
      <Toggle label="Also replace my content" hint="Off: keep your profile, links and blocks — only the design changes." checked={replace} onChange={setReplace} />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy || !id}
          onClick={async () => {
            if (replace && !confirm("Replace your blocks with the template's sample content? You can restore the current version from Version history.")) return;
            setBusy(true);
            try {
              await onSwitchTemplate(id, replace);
            } finally {
              setBusy(false);
            }
          }}
          className="btn h-9 bg-fg px-3 text-[13px] text-white hover:bg-ink-800"
        >
          {busy ? "Applying…" : "Apply template"}
        </button>
        <a href={`/t/${id}`} target="_blank" rel="noreferrer" className="btn h-9 px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary">
          Preview
        </a>
      </div>
    </Group>
  );
}

function SavedStyles({ theme, onApply }: { theme: Theme; onApply: (t: Theme) => void }) {
  const [styles, setStyles] = useState<Style[] | null>(null);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    fetch("/api/styles")
      .then((r) => r.json())
      .then((d) => setStyles(d.styles ?? []))
      .catch(() => setStyles([]));
  }, []);
  return (
    <Group title="Saved styles">
      <p className="text-[12px] text-fg-muted">Save this look to reuse it on your other pages.</p>
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr("");
          const res = await fetch("/api/styles", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: name || "My style", theme }) });
          const d = await res.json();
          if (!res.ok) return setErr(d.error ?? "Couldn't save");
          setStyles((s) => [d, ...(s ?? [])]);
          setName("");
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Style name" aria-label="Style name" maxLength={60} className="field min-h-9 text-small" />
        <button className="btn h-9 shrink-0 px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary">Save</button>
      </form>
      {err ? <p className="text-[12px] text-error">{err}</p> : null}
      {styles?.map((s) => (
        <div key={s.id} className="flex items-center justify-between gap-2 text-small">
          <span className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="size-5 shrink-0 rounded-full ring-1 ring-line" style={{ background: s.theme.background.kind === "gradient" ? `linear-gradient(${s.theme.background.from}, ${s.theme.background.to})` : s.theme.background.color }} />
            <span className="truncate">{s.name}</span>
          </span>
          <span className="flex shrink-0 gap-3">
            <button type="button" className="font-semibold text-primary hover:underline" onClick={() => onApply(s.theme)}>
              Apply
            </button>
            <button
              type="button"
              className="text-fg-muted hover:text-error"
              aria-label={`Delete style ${s.name}`}
              onClick={async () => {
                await fetch(`/api/styles?id=${s.id}`, { method: "DELETE" });
                setStyles((x) => x?.filter((y) => y.id !== s.id) ?? null);
              }}
            >
              Delete
            </button>
          </span>
        </div>
      ))}
    </Group>
  );
}

function Versions({ pageId, onRestore }: { pageId: string; onRestore: (id: string) => Promise<void> }) {
  const [list, setList] = useState<Version[] | null>(null);
  const load = () =>
    fetch(`/api/pages/${pageId}/versions`)
      .then((r) => r.json())
      .then((d) => setList(d.versions ?? []));
  return (
    <Group title="Version history">
      <p className="text-[12px] text-fg-muted">Every publish and template switch is saved. Restoring replaces the draft; your current draft is saved first.</p>
      {list === null ? (
        <button type="button" onClick={load} className="btn h-9 w-fit px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary">
          Show history
        </button>
      ) : list.length === 0 ? (
        <p className="text-small text-fg-muted">Nothing yet — history starts with your first publish.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {list.map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-2 text-small">
              <span className="min-w-0">
                <span className="block truncate text-fg">{v.label || v.kind}</span>
                <span className="text-[12px] text-fg-muted">{new Date(v.createdAt).toLocaleString()}</span>
              </span>
              <button
                type="button"
                className="shrink-0 font-semibold text-primary hover:underline"
                onClick={async () => {
                  await onRestore(v.id);
                  await load();
                }}
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </Group>
  );
}
