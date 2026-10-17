"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES, MENU, money, type CategoryId, type MenuItem, type Tag } from "./menu";
import { fill, useLumbre } from "./state";
import { CHAR, CREAM, EMBER, serif } from "./theme";

/**
 * The interactive menu: section tabs, dietary filters (toggle buttons) and
 * dish cards with Add. A dish with a required choice (steak temperature)
 * opens a native <dialog> for it.
 */
export function LumbreMenu() {
  const { copy, locale, filter, setFilter, add, announce } = useLumbre();
  const m = copy.menu;
  const [category, setCategory] = useState<CategoryId | "all">("all");
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
    <section id="menu" aria-labelledby="lumbre-menu-heading" className="scroll-mt-32 py-20 lg:py-28" style={{ background: CREAM, color: CHAR }}>
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <p className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: "#a4431a" }}>
          {m.label}
        </p>
        <h2 id="lumbre-menu-heading" className={cn(serif.className, "mt-3 text-[44px] leading-none text-current outline-none sm:text-[60px]")}>
          {m.title}
        </h2>
        <p className="mt-4 max-w-[520px] text-[16px] leading-[1.6] text-[#4a3f36]">{m.intro}</p>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={m.categoriesLabel} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            {[{ id: "all" as const, label: { en: m.all, es: m.all } }, ...CATEGORIES].map((c) => {
              const on = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "h-10 shrink-0 rounded-full px-4 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4431a]",
                    on ? "text-[#f6efe6]" : "text-[#3b322b] ring-1 ring-inset ring-[#14100d]/20 hover:bg-[#14100d]/5",
                  )}
                  style={on ? { background: CHAR } : undefined}
                >
                  {c.label[locale]}
                </button>
              );
            })}
          </div>
          <div role="group" aria-label={m.filtersLabel} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const on = filter === f.tag;
              return (
                <button
                  key={f.tag}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(on ? null : f.tag)}
                  className={cn(
                    "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4431a]",
                    on ? "bg-[#a4431a] text-white" : "bg-white text-[#3b322b] ring-1 ring-inset ring-[#14100d]/15 hover:ring-[#14100d]/30",
                  )}
                >
                  <TagDot tag={f.tag} light={on} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-8 text-center text-[15px] text-[#4a3f36]">
            <p>{m.empty}</p>
            <button
              type="button"
              onClick={() => {
                setFilter(null);
                setCategory("all");
              }}
              className="mt-3 font-semibold text-[#a4431a] underline underline-offset-4"
            >
              {m.clear}
            </button>
          </div>
        ) : (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((item) => (
              <li key={item.id} className="group flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_1px_2px_rgb(20_16_13/0.06),0_12px_30px_-18px_rgb(20_16_13/0.35)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.photo}
                    alt={item.name[locale]}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {item.popular && (
                    <span className="absolute top-3 left-3 rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: EMBER, color: CHAR }}>
                      {m.popular}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[18px] leading-tight font-semibold text-current">{item.name[locale]}</h3>
                    <span className="text-[16px] font-semibold tabular-nums">{money(item.price)}</span>
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#5c5047]">{item.description[locale]}</p>
                  {item.tags.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <li key={t} className="inline-flex items-center gap-1 rounded-full bg-[#f6efe6] px-2.5 py-1 text-[12px] font-medium text-[#4a3f36]">
                          <TagDot tag={t} />
                          {t === "veg" ? m.veg : t === "gf" ? m.gf : m.spicy}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto pt-4">
                  <button
                    type="button"
                    onClick={() => onAdd(item)}
                    aria-label={fill(m.addAria, { item: item.name[locale] })}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[14px] font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4431a]"
                    style={{ background: CHAR, color: CREAM }}
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M10 4v12M4 10h12" />
                    </svg>
                    {m.add}
                  </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <OptionsDialog item={choosing} onClose={() => setChoosing(null)} />
    </section>
  );
}

function TagDot({ tag, light }: { tag: Tag; light?: boolean }) {
  const color = light ? "#fff" : tag === "veg" ? "#15803d" : tag === "gf" ? "#b45309" : "#dc2626";
  return <span aria-hidden="true" className="size-2 rounded-full" style={{ background: color }} />;
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
      className="m-auto w-[min(440px,calc(100vw-32px))] rounded-[24px] bg-white p-0 text-[#14100d] shadow-2xl backdrop:bg-[#14100d]/60 backdrop:backdrop-blur-sm"
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
            <Image src={item.photo} alt="" fill sizes="440px" className="object-cover" />
          </div>
          <div className="p-6">
            <h2 id="lumbre-options-title" className="text-[22px] font-semibold">
              {item.name[locale]}
            </h2>
            <p className="mt-1 text-[14px] text-[#5c5047]">{item.description[locale]}</p>
            <fieldset className="mt-5">
              <legend className="flex w-full items-center justify-between text-[14px] font-semibold">
                {item.options.label[locale]}
                <span className="rounded-full bg-[#f6efe6] px-2 py-0.5 text-[11px] font-semibold text-[#a4431a]">{o.required}</span>
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {item.options.choices.map((c, i) => (
                  <label key={c.en} className="relative">
                    <input type="radio" name="option" checked={choice === i} onChange={() => setChoice(i)} className="peer sr-only" />
                    <span className="flex h-11 cursor-pointer items-center justify-center rounded-xl px-2 text-center text-[13px] font-semibold ring-1 ring-[#14100d]/15 peer-checked:bg-[#14100d] peer-checked:text-[#f6efe6] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#a4431a]">
                      {c[locale]}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-[14px] font-semibold" id="lumbre-qty-label">
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
            <div className="mt-6 grid grid-cols-[auto_1fr] gap-2">
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="h-12 rounded-full px-5 text-[14px] font-semibold ring-1 ring-[#14100d]/20 hover:bg-[#14100d]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4431a]"
              >
                {o.cancel}
              </button>
              <button
                type="submit"
                className="h-12 rounded-full text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4431a]"
                style={{ background: EMBER, color: CHAR }}
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
    "flex size-9 items-center justify-center rounded-full text-[18px] leading-none transition-colors disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2",
    dark ? "ring-1 ring-white/25 hover:bg-white/10 focus-visible:outline-white" : "ring-1 ring-[#14100d]/20 hover:bg-[#14100d]/5 focus-visible:outline-[#a4431a]",
  );
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex items-center gap-3">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={decreaseLabel}>
        −
      </button>
      <output aria-live="polite" className="w-6 text-center text-[15px] font-semibold tabular-nums">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={increaseLabel}>
        +
      </button>
    </div>
  );
}
