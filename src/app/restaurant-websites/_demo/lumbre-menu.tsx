"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES, MENU, money, type MenuItem, type Tag } from "./menu";
import { fill, useLumbre } from "./state";
import { CHAR, IVORY, MUTED_LIGHT, display } from "./theme";
import { Eyebrow } from "./lumbre-ui";

/**
 * The interactive menu, set like a printed carte: a section index, dietary
 * filters (toggle buttons), and an editorial list with dotted price leaders.
 * Add puts a dish in the order; a dish with a required choice (steak
 * temperature) opens a native <dialog> for it. The section index is shared
 * state, so the signature dishes above can open the menu on one section.
 */
export function LumbreMenu() {
  const { copy, locale, filter, setFilter, category, setCategory, add, announce } = useLumbre();
  const m = copy.menu;
  const [choosing, setChoosing] = useState<MenuItem | null>(null);

  const shown = MENU.filter(
    (item) => (category === "all" || item.category === category) && (!filter || item.tags.includes(filter)),
  );

  const onAdd = (item: MenuItem) => {
    if (item.options) return setChoosing(item);
    add(item, null);
    announce(fill(copy.cart.added, { item: item.name[locale] }));
  };

  const FILTERS: { tag: Tag; label: string }[] = [
    { tag: "veg", label: m.veg },
    { tag: "gf", label: m.gf },
    { tag: "spicy", label: m.spicy },
  ];

  return (
    <section id="menu" aria-labelledby="lumbre-menu-heading" className="py-28 lg:py-40" style={{ background: IVORY, color: CHAR }}>
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center">
          <Eyebrow>{m.label}</Eyebrow>
          <h2
            id="lumbre-menu-heading"
            className={cn(display.className, "mt-7 text-[clamp(52px,7vw,112px)] leading-[0.9] font-light tracking-[-0.02em] outline-none")}
          >
            {m.title}
          </h2>
          <p className="mt-6 max-w-[520px] text-[16px] leading-[1.7]" style={{ color: MUTED_LIGHT }}>
            {m.intro}
          </p>
        </div>

        <div className="mt-14 flex flex-col items-center gap-6">
          <div
            role="group"
            aria-label={m.categoriesLabel}
            className="-mx-5 flex max-w-[calc(100%+40px)] gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:max-w-full sm:flex-wrap sm:justify-center sm:px-0"
          >
            {[{ id: "all" as const, label: { en: m.all, es: m.all } }, ...CATEGORIES].map((c) => {
              const on = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    display.className,
                    "relative h-12 shrink-0 px-4 text-[22px] italic transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#696D55]",
                    on ? "text-[#111411]" : "text-[#55574C] hover:text-[#111411]",
                  )}
                >
                  {c.label[locale]}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-4 bottom-1.5 h-px origin-left bg-[#696D55] transition-transform duration-500",
                      on ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              );
            })}
          </div>
          <div role="group" aria-label={m.filtersLabel} className="flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => {
              const on = filter === f.tag;
              return (
                <button
                  key={f.tag}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(on ? null : f.tag)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full px-4 font-display text-[12px] font-semibold tracking-[0.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#696D55]",
                    on ? "bg-[#111411] text-[#F4EFE6]" : "text-[#111411]/75 ring-1 ring-[#111411]/20 ring-inset hover:ring-[#111411]/45",
                  )}
                >
                  <TagMark tag={f.tag} light={on} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="mx-auto mt-16 max-w-[460px] border-y border-[#111411]/12 py-10 text-center">
            <p className={cn(display.className, "text-[26px] italic")}>{m.empty}</p>
            <button
              type="button"
              onClick={() => {
                setFilter(null);
                setCategory("all");
              }}
              className="mt-4 font-display text-[12px] font-semibold tracking-[0.16em] text-[#696D55] uppercase underline underline-offset-4"
            >
              {m.clear}
            </button>
          </div>
        ) : (
          <ul key={`${category}-${filter}`} className="rw-fade mt-16 grid gap-x-16 border-t border-[#111411]/12 lg:grid-cols-2">
            {shown.map((item) => (
              <li key={item.id} className="group grid grid-cols-[72px_1fr_auto] items-start gap-x-5 border-b border-[#111411]/12 py-7 sm:grid-cols-[96px_1fr_auto] sm:gap-x-6">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.photo}
                    alt={item.name[locale]}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <h3 className={cn(display.className, "text-[25px] leading-[1.1] sm:text-[28px]")}>{item.name[locale]}</h3>
                    <span aria-hidden="true" className="mb-1.5 hidden h-px flex-1 border-b border-dotted border-[#111411]/30 sm:block" />
                    <span className="ml-auto font-display text-[15px] font-medium tabular-nums sm:ml-0">{money(item.price)}</span>
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: MUTED_LIGHT }}>
                    {item.description[locale]}
                  </p>
                  {(item.tags.length > 0 || item.popular) && (
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                      {item.popular && (
                        <li className="font-display text-[11px] font-semibold tracking-[0.16em] text-[#696D55] uppercase">{m.popular}</li>
                      )}
                      {item.tags.map((t) => (
                        <li key={t} className="inline-flex items-center gap-1.5 font-display text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: MUTED_LIGHT }}>
                          <TagMark tag={t} />
                          {t === "veg" ? m.veg : t === "gf" ? m.gf : m.spicy}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onAdd(item)}
                  aria-label={fill(m.addAria, { item: item.name[locale] })}
                  className="flex size-11 items-center justify-center self-center rounded-full ring-1 ring-[#111411]/25 transition-all duration-300 hover:bg-[#111411] hover:text-[#F4EFE6] hover:ring-[#111411] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#696D55]"
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <OptionsDialog item={choosing} onClose={() => setChoosing(null)} />
    </section>
  );
}

/** Dietary marks: shape AND colour, so they read without colour vision. */
function TagMark({ tag, light }: { tag: Tag; light?: boolean }) {
  const color = light ? "#F4EFE6" : tag === "veg" ? "#4d6b3c" : tag === "gf" ? "#8a6a3e" : "#a3402a";
  if (tag === "veg")
    return (
      <svg viewBox="0 0 10 10" aria-hidden="true" className="size-2.5" fill={color}>
        <path d="M5 0C8 2 9 6 5 10 1 6 2 2 5 0Z" />
      </svg>
    );
  if (tag === "gf")
    return (
      <svg viewBox="0 0 10 10" aria-hidden="true" className="size-2.5" fill="none" stroke={color} strokeWidth="1.6">
        <circle cx="5" cy="5" r="3.6" />
      </svg>
    );
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" className="size-2.5" fill={color}>
      <path d="M5 0 9.5 9H.5Z" />
    </svg>
  );
}

function OptionsDialog({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { copy, locale, add, announce } = useLumbre();
  const ref = useRef<HTMLDialogElement>(null);
  const [choice, setChoice] = useState(1);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);

  const o = copy.options;
  return (
    <dialog
      ref={ref}
      onClose={() => {
        setChoice(1);
        setQty(1);
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-labelledby="lumbre-options-title"
      className="m-auto w-[min(460px,calc(100vw-32px))] bg-[#FAF8F3] p-0 text-[#111411] shadow-[0_40px_100px_-30px_rgb(0_0_0/0.6)] backdrop:bg-[#111411]/70 backdrop:backdrop-blur-sm"
    >
      {item?.options && (
        <form
          method="dialog"
          onSubmit={() => {
            add(item, choice, qty);
            announce(fill(copy.cart.added, { item: item.name[locale] }));
          }}
        >
          <div className="relative aspect-[16/9]">
            <Image src={item.photo} alt="" fill sizes="460px" className="object-cover" />
          </div>
          <div className="p-7">
            <h2 id="lumbre-options-title" className={cn(display.className, "text-[34px] leading-none")}>
              {item.name[locale]}
            </h2>
            <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: MUTED_LIGHT }}>
              {item.description[locale]}
            </p>
            <fieldset className="mt-6">
              <legend className="flex w-full items-center justify-between font-display text-[12px] font-semibold tracking-[0.14em] uppercase">
                {item.options.label[locale]}
                <span className="text-[11px] tracking-[0.12em] text-[#696D55]">{o.required}</span>
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {item.options.choices.map((c, i) => (
                  <label key={c.en} className="relative">
                    <input type="radio" name="option" checked={choice === i} onChange={() => setChoice(i)} className="peer sr-only" />
                    <span className="flex h-12 cursor-pointer items-center justify-center px-2 text-center text-[14px] ring-1 ring-[#111411]/18 transition-colors peer-checked:bg-[#111411] peer-checked:text-[#F4EFE6] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#696D55]">
                      {c[locale]}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-display text-[12px] font-semibold tracking-[0.14em] uppercase" id="lumbre-qty-label">
                {o.quantity}
              </span>
              <Stepper
                value={qty}
                onChange={setQty}
                labelledBy="lumbre-qty-label"
                decreaseLabel={fill(copy.cart.decrease, { item: item.name[locale] })}
                increaseLabel={fill(copy.cart.increase, { item: item.name[locale] })}
              />
            </div>
            <div className="mt-7 grid grid-cols-[auto_1fr] gap-2">
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="h-13 rounded-full px-6 py-3.5 font-display text-[12px] font-semibold tracking-[0.14em] uppercase ring-1 ring-[#111411]/20 hover:bg-[#111411]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#696D55]"
              >
                {o.cancel}
              </button>
              <button
                type="submit"
                className="h-13 rounded-full bg-[#111411] py-3.5 font-display text-[12px] font-semibold tracking-[0.14em] text-[#F4EFE6] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#696D55]"
              >
                {o.add} · {money(item.price * qty)}
              </button>
            </div>
          </div>
        </form>
      )}
    </dialog>
  );
}

export function Stepper({
  value,
  onChange,
  labelledBy,
  min = 1,
  max = 20,
  decreaseLabel = "−",
  increaseLabel = "+",
  dark = false,
}: {
  value: number;
  onChange: (n: number) => void;
  labelledBy?: string;
  min?: number;
  max?: number;
  decreaseLabel?: string;
  increaseLabel?: string;
  dark?: boolean;
}) {
  const btn = cn(
    "flex size-9 items-center justify-center rounded-full text-[17px] leading-none transition-colors disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2",
    dark
      ? "ring-1 ring-[#F4EFE6]/25 hover:bg-[#F4EFE6]/10 focus-visible:outline-[#C8A97E]"
      : "ring-1 ring-[#111411]/20 hover:bg-[#111411]/5 focus-visible:outline-[#696D55]",
  );
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex items-center gap-3">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={decreaseLabel}>
        −
      </button>
      <output aria-live="polite" className="w-6 text-center font-display text-[15px] font-semibold tabular-nums">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={increaseLabel}>
        +
      </button>
    </div>
  );
}
