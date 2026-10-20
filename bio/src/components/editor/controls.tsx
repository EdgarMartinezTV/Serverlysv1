"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Small, consistent form controls for the editor panels. Every control is a
 * real labelled input — panels must be fully operable by keyboard.
 */

export function Group({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-line-subtle px-4 py-4 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-caption uppercase text-fg-muted">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function TextField({ label, value, onChange, placeholder, hint, type = "text", maxLength = 120, error, inputMode, hideLabel }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; type?: string; maxLength?: number; error?: string; inputMode?: "url" | "email" | "tel" | "text"; hideLabel?: boolean }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={hideLabel ? "sr-only" : "text-small font-medium text-fg"}>
        {label}
      </label>
      <input id={id} type={type} value={value} placeholder={placeholder} maxLength={maxLength} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} className="field min-h-10 text-small" />
      {error ? <p className="text-[12px] text-error">{error}</p> : hint ? <p className="text-[12px] text-fg-muted">{hint}</p> : null}
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 3, maxLength = 400 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; maxLength?: number }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-small">
        <label htmlFor={id} className="font-medium text-fg">
          {label}
        </label>
        <span id={`${id}-count`} className="text-fg-muted tabular-nums">
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea id={id} aria-describedby={`${id}-count`} value={value} rows={rows} placeholder={placeholder} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} className="field min-h-0 text-small" />
    </div>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-3">
      <label htmlFor={id} className="text-small text-fg">
        {label}
        {hint ? <span className="block text-[12px] text-fg-muted">{hint}</span> : null}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-line-strong"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow-e2 transition-[left] ${checked ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export function Segmented<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void }) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="mb-1 text-small font-medium text-fg">{label}</legend>
      <div className="flex flex-wrap gap-1 rounded-sm bg-canvas-inset p-1">
        {options.map((o) => (
          <label key={String(o.value)} className={`flex-1 cursor-pointer rounded-[6px] px-2 py-1.5 text-center text-[13px] font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary ${o.value === value ? "bg-surface text-fg shadow-e1" : "text-fg-muted hover:text-fg"}`}>
            <input type="radio" className="sr-only" checked={o.value === value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function SelectField<T extends string | number>({ label, value, options, onChange, hideLabel }: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void; hideLabel?: boolean }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={hideLabel ? "sr-only" : "text-small font-medium text-fg"}>
        {label}
      </label>
      <select id={id} value={String(value)} onChange={(e) => onChange((typeof value === "number" ? Number(e.target.value) : e.target.value) as T)} className="field min-h-10 text-small">
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ColorField({ label, value, onChange, allowEmpty, emptyLabel = "Theme default" }: { label: string; value: string; onChange: (v: string) => void; allowEmpty?: boolean; emptyLabel?: string }) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  const shown = draft !== value && !/^#[0-9a-f]{6}$/i.test(draft) ? draft : value;
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-small text-fg">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {allowEmpty && value ? (
          <button type="button" className="text-[12px] text-fg-muted hover:text-fg" onClick={() => onChange("")}>
            Reset
          </button>
        ) : null}
        <input
          aria-label={`${label} hex value`}
          value={allowEmpty && !value ? "" : shown}
          placeholder={allowEmpty ? emptyLabel : "#000000"}
          onChange={(e) => {
            const v = e.target.value.trim();
            setDraft(v);
            if (/^#[0-9a-f]{6}$/i.test(v)) onChange(v.toLowerCase());
          }}
          className="field min-h-9 w-[104px] px-2 font-mono text-[12px]"
        />
        <input id={id} type="color" value={value || "#ffffff"} onChange={(e) => onChange(e.target.value)} className="size-9 cursor-pointer rounded-sm border border-line bg-transparent p-0.5" />
      </div>
    </div>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, unit = "" }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex justify-between text-small text-fg">
        {label}
        <span className="text-fg-muted tabular-nums">
          {value}
          {unit}
        </span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-primary" />
    </div>
  );
}

export function IconButton({ label, onClick, children, disabled, pressed }: { label: string; onClick: () => void; children: ReactNode; disabled?: boolean; pressed?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={`grid size-9 shrink-0 place-items-center rounded-sm text-fg-secondary transition-colors hover:bg-canvas-inset hover:text-fg disabled:opacity-40 ${pressed ? "bg-primary-soft text-primary" : ""}`}
    >
      {children}
    </button>
  );
}
