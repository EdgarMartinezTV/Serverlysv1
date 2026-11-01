"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES, MENU, money, type Tag } from "../_demo/menu";
import { INK, MUTED, Tick } from "./ui";
import { PATHS, type ExplorerTabId, type LandingCopy, type Locale } from "../_i18n";
import { LaptopMock, PhoneMock, EMBER } from "./device-mocks";

/**
 * "What we build" — an APG tabs widget, one tab per service, each with a small
 * OPERABLE preview. The previews are real controls (they are focusable and
 * keyboard-usable), so unlike the hero art they are not aria-hidden.
 *
 * Keyboard: Left/Right move between tabs and activate them (automatic
 * activation — the panels are cheap), Home/End jump to the ends.
 */
export function ExplorerTabs({ copy, locale }: { copy: LandingCopy; locale: Locale }) {
  const e = copy.explorer;
  const [active, setActive] = useState<ExplorerTabId>("website");
  const tabs = useRef<Map<ExplorerTabId, HTMLButtonElement>>(new Map());
  const base = useId();

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const ids = e.tabs.map((t) => t.id);
    let next = -1;
    if (event.key === "ArrowRight") next = (index + 1) % ids.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + ids.length) % ids.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = ids.length - 1;
    if (next < 0) return;
    event.preventDefault();
    setActive(ids[next]);
    tabs.current.get(ids[next])?.focus();
  };

  return (
    <>
        <div
          role="tablist"
          aria-label={e.tablistLabel}
          className="-mx-5 mt-12 flex snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
        >
          {e.tabs.map((t, i) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                ref={(node) => {
                  if (node) tabs.current.set(t.id, node);
                  else tabs.current.delete(t.id);
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`${base}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(t.id)}
                onKeyDown={(ev) => onKeyDown(ev, i)}
                className={cn(
                  "inline-flex h-11 shrink-0 snap-start items-center gap-2 rounded-full px-5 text-[14px] font-semibold transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected ? "bg-[#0b1530] text-white" : "bg-[#f1f2f5] text-[#2b3442] hover:bg-[#e6e8ee]",
                )}
              >
                <TabIcon id={t.id} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${base}-panel`}
          aria-labelledby={`${base}-tab-${active}`}
          tabIndex={0}
          className="mt-10 grid items-center gap-10 rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14"
        >
          {/* Every panel's text is server-rendered and the inactive ones are
              `hidden`: rendering only the active tab left five of the six service
              descriptions out of the HTML, where search engines never saw them. */}
          {e.tabs.map((tab) => (
            <div key={tab.id} hidden={tab.id !== active} className="rw-fade min-w-0">
              <h3 className={cn("font-display text-[28px] leading-[1.15] font-normal tracking-[-0.02em] sm:text-[34px]", INK)}>
                {tab.title}
              </h3>
              <p className={cn("mt-5 text-[16px] leading-[1.65]", MUTED)}>{tab.body}</p>
              <ul className="mt-7 flex flex-col gap-3.5">
                {tab.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[15px] leading-[1.5] text-[#2b3442]">
                    <Tick />
                    {b}
                  </li>
                ))}
              </ul>
              {tab.note && (
                <p className="mt-7 flex gap-2.5 rounded-xl bg-[#fff7ed] px-4 py-3 text-[13px] leading-[1.5] text-[#7c2d12] ring-1 ring-[#fed7aa]">
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M10 6v5m0 3h.01" strokeLinecap="round" />
                  </svg>
                  <span>
                    {(tab.id === "ordering" || tab.id === "reservations") && (
                      <strong className="font-semibold">{e.external}. </strong>
                    )}
                    {tab.note}
                    {tab.id === "ai" && (
                      <>
                        {" "}
                        <a href="https://convoai.cloud/" className="font-semibold underline underline-offset-2" target="_blank" rel="noopener">
                          convoai.cloud
                        </a>
                      </>
                    )}
                  </span>
                </p>
              )}
              {tab.more && (
                <Link href={tab.more.href} className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  {tab.more.label}
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10h12m-5-5 5 5-5 5" />
                </svg>
                </Link>
              )}
            </div>
          ))}

          <div className="relative min-w-0 overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#f4f4f7,#eceef3)] p-5 sm:p-8">
            <Preview id={active} copy={copy} locale={locale} />
          </div>
        </div>
    </>
  );
}

function Preview({ id, copy, locale }: { id: ExplorerTabId; copy: LandingCopy; locale: Locale }) {
  switch (id) {
    case "website":
      return <WebsitePreview copy={copy} locale={locale} />;
    case "menu":
      return <MenuPreview copy={copy} locale={locale} />;
    case "ordering":
      return <OrderingPreview copy={copy} locale={locale} />;
    case "reservations":
      return <ReservationPreview copy={copy} />;
    case "seo":
      return <SeoPreview copy={copy} />;
    case "ai":
      return <ChatPreview copy={copy} />;
  }
}

/* ── Previews ─────────────────────────────────────────────────────────────── */

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-black/[0.06]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "h-9 rounded-full px-4 text-[13px] font-semibold transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            value === o.id ? "bg-[#0b1530] text-white" : "text-[#2b3442] hover:bg-[#f1f2f5]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function WebsitePreview({ copy, locale }: { copy: LandingCopy; locale: Locale }) {
  const [size, setSize] = useState<"desktop" | "mobile">("desktop");
  const ui = copy.explorer.ui;
  return (
    <div>
      <div className="flex justify-center">
        <Segmented
          label={ui.previewLabel}
          value={size}
          onChange={setSize}
          options={[
            { id: "desktop", label: ui.desktop },
            { id: "mobile", label: ui.mobile },
          ]}
        />
      </div>
      <div aria-hidden="true" className="mt-6 flex min-h-[330px] items-center justify-center sm:min-h-[400px]">
        {size === "desktop" ? (
          <div className="rw-fade w-full">
            <LaptopMock mock={copy.hero.mock} />
          </div>
        ) : (
          <div className="rw-fade w-[46%] max-w-[210px]">
            <PhoneMock mock={copy.hero.mock} categories={CATEGORIES.map((c) => c.label[locale])} />
          </div>
        )}
      </div>
      <p className="sr-only">{ui.previewAlt}</p>
    </div>
  );
}

const dishes = MENU.filter((m) => m.category !== "drinks");

function MenuPreview({ copy, locale }: { copy: LandingCopy; locale: Locale }) {
  const ui = copy.explorer.ui;
  const [filter, setFilter] = useState<"all" | Tag>("all");
  const shown = dishes.filter((d) => filter === "all" || d.tags.includes(filter)).slice(0, 4);
  return (
    <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.05]">
        <Segmented
          label={ui.menuFilterLabel}
          value={filter}
          onChange={setFilter}
          options={[
            { id: "all", label: ui.allDishes },
            { id: "veg", label: ui.vegetarian },
            { id: "gf", label: ui.glutenFree },
          ]}
        />
        <ul className="mt-4 flex flex-col divide-y divide-black/[0.06]" aria-live="polite">
          {shown.map((d) => (
            <li key={d.id} className="flex items-center gap-3 py-3">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                <Image src={d.photo} alt="" fill sizes="48px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate text-[14px] font-semibold", INK)}>{d.name[locale]}</span>
                <span className="flex gap-1.5 text-[11px] font-semibold">
                  {d.tags.includes("veg") && <span className="text-[#15803d]">{ui.vegetarian}</span>}
                  {d.tags.includes("gf") && <span className="text-[#b45309]">{ui.glutenFree}</span>}
                </span>
              </span>
              <span className={cn("text-[14px] font-semibold tabular-nums", INK)}>{money(d.price)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-row items-center gap-4 rounded-2xl bg-[#14100d] p-4 text-white sm:w-[150px] sm:flex-col sm:justify-center sm:text-center">
        <QrArt className="size-20 shrink-0 rounded-lg bg-white p-1.5 sm:size-[110px]" />
        <p className="text-[12px] leading-snug text-white/80">{ui.scanToView}</p>
      </div>
    </div>
  );
}

/** Decorative QR-style mark. Deliberately NOT a scannable code. */
function QrArt({ className }: { className?: string }) {
  const n = 21;
  const cells: [number, number][] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const finder = (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
      if (finder) continue;
      if (((x * 7 + y * 13 + x * y) % 5) < 2) cells.push([x, y]);
    }
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#14100d" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#14100d" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${n} ${n}`} aria-hidden="true" className={className} shapeRendering="crispEdges">
      {cells.map(([x, y]) => (
        <rect key={`${x}:${y}`} x={x} y={y} width="1" height="1" fill="#14100d" />
      ))}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}

function OrderingPreview({ copy, locale }: { copy: LandingCopy; locale: Locale }) {
  const ui = copy.explorer.ui;
  const items = ["churrasco", "tacos", "chicken"].map((id) => MENU.find((m) => m.id === id)!);
  const [qty, setQty] = useState<Record<string, number>>({ churrasco: 1, tacos: 1 });
  const count = Object.values(qty).reduce((a, b) => a + b, 0);
  const total = items.reduce((sum, i) => sum + (qty[i.id] ?? 0) * i.price, 0);
  return (
    <div className="mx-auto max-w-[420px] rounded-2xl bg-[#14100d] p-4 text-white shadow-lg">
      <ul className="flex flex-col gap-3">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-3">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
              <Image src={i.photo} alt="" fill sizes="56px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold text-[#f6efe6]">{i.name[locale]}</span>
              <span className="text-[13px] text-white/60">{money(i.price)}</span>
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => ({ ...q, [i.id]: (q[i.id] ?? 0) + 1 }))}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold text-[#14100d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ background: EMBER }}
              aria-label={`${ui.add} ${i.name[locale]}`}
            >
              + {ui.add}
              {qty[i.id] ? <span className="rounded-full bg-[#14100d]/20 px-1.5 tabular-nums">{qty[i.id]}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white/[0.07] px-4 py-3" aria-live="polite">
        <span className="text-[13px] text-white/80">
          <strong className="font-semibold text-white tabular-nums">{count}</strong> {ui.inCart} ·{" "}
          <strong className="font-semibold text-white tabular-nums">{money(total)}</strong>
        </span>
        <Link
          href={`${PATHS[locale].demo}#menu`}
          className="rounded-full bg-[#f6efe6] px-4 py-2 text-[13px] font-semibold text-[#14100d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {ui.checkout} →
        </Link>
      </div>
    </div>
  );
}

const PREVIEW_TIMES = ["6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];

function ReservationPreview({ copy }: { copy: LandingCopy }) {
  const ui = copy.explorer.ui;
  const [party, setParty] = useState(4);
  const [time, setTime] = useState("8:00 PM");
  return (
    <div className="mx-auto max-w-[440px] rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.05]">
      <div className="flex items-center justify-between">
        <span className={cn("text-[14px] font-semibold", INK)}>{ui.partySize}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setParty((p) => Math.max(1, p - 1))}
            aria-label={ui.fewer}
            className="flex size-9 items-center justify-center rounded-full text-[18px] ring-1 ring-black/15 hover:bg-[#f1f2f5] focus-visible:outline-2 focus-visible:outline-primary"
          >
            −
          </button>
          <output aria-live="polite" className={cn("w-16 text-center text-[15px] font-semibold tabular-nums", INK)}>
            {party} {ui.guests}
          </output>
          <button
            type="button"
            onClick={() => setParty((p) => Math.min(10, p + 1))}
            aria-label={ui.more}
            className="flex size-9 items-center justify-center rounded-full text-[18px] ring-1 ring-black/15 hover:bg-[#f1f2f5] focus-visible:outline-2 focus-visible:outline-primary"
          >
            +
          </button>
        </div>
      </div>
      <fieldset className="mt-5">
        <legend className={cn("text-[14px] font-semibold", INK)}>{ui.pickTime}</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {PREVIEW_TIMES.map((t) => (
            <label key={t} className="relative">
              <input
                type="radio"
                name="rw-preview-time"
                value={t}
                checked={time === t}
                onChange={() => setTime(t)}
                className="peer sr-only"
              />
              <span className="flex h-10 cursor-pointer items-center justify-center rounded-lg text-[13px] font-semibold text-[#2b3442] ring-1 ring-black/10 transition-colors peer-checked:bg-[#0b1530] peer-checked:text-white peer-checked:ring-[#0b1530] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-5 flex items-center gap-2 rounded-xl bg-[#ecfdf5] px-4 py-3 text-[13px] font-medium text-[#065f46]" aria-live="polite">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m5 10.5 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {ui.requested}: {party} {ui.guests} · {time}
      </p>
    </div>
  );
}

function SeoPreview({ copy }: { copy: LandingCopy }) {
  const ui = copy.explorer.ui;
  const [on, setOn] = useState<boolean[]>(() => ui.seoChecklist.map(() => true));
  const toggle = (i: number) => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)));
  const [verified, hoursMatch, menuLink, schema, buttons] = on;
  return (
    <div className="grid gap-5 sm:grid-cols-[1.1fr_1fr]">
      <div aria-hidden="true" className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.05]">
        <div className="relative h-24 overflow-hidden rounded-xl">
          <Image src="/restaurant/room-moody.jpg" alt="" fill sizes="300px" className="object-cover object-[50%_60%]" />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[17px] font-semibold text-[#202124]">
          Lumbre
          {verified && (
            <svg viewBox="0 0 20 20" className="size-4 text-[#1a73e8]" fill="currentColor">
              <path d="M10 1.5 12.3 3l2.7-.2.8 2.6 2.2 1.6-1 2.5 1 2.5-2.2 1.6-.8 2.6-2.7-.2L10 18.5 7.7 17l-2.7.2-.8-2.6L2 13l1-2.5L2 8l2.2-1.6.8-2.6L7.7 3 10 1.5Zm-1 11.3 5-5-1.2-1.2L9 10.4 7.2 8.6 6 9.8l3 3Z" />
            </svg>
          )}
        </p>
        <p className="text-[13px] text-[#4d5156]">{ui.seoCategory}</p>
        <p className={cn("mt-1 text-[13px] font-medium", hoursMatch ? "text-[#188038]" : "text-[#d93025]")}>
          {hoursMatch ? ui.openNow : ui.hoursDiffer}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[12px] font-medium text-[#1a73e8]">
          {[ui.directions, ui.call, ...(menuLink ? [copy.hero.mock.menu] : []), ...(buttons ? [copy.hero.mock.order, copy.hero.mock.reserve] : [])].map(
            (b) => (
              <span key={b} className="rounded-full px-3 py-1.5 ring-1 ring-[#dadce0]">
                {b}
              </span>
            ),
          )}
        </div>
        {schema && (
          <p className="mt-3 rounded-lg bg-[#f8f9fa] px-3 py-2 font-mono text-[11px] text-[#5f6368]">
            {"{ \"@type\": \"Restaurant\", \"hasMenu\": … }"}
          </p>
        )}
      </div>
      <fieldset>
        <legend className="sr-only">Local SEO</legend>
        <ul className="flex flex-col gap-2">
          {ui.seoChecklist.map((item, i) => (
            <li key={item}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-3 text-[14px] text-[#2b3442] shadow-sm ring-1 ring-black/[0.05] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary">
                <input
                  type="checkbox"
                  checked={on[i]}
                  onChange={() => toggle(i)}
                  className="size-4 accent-[#0000ff]"
                />
                {item}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
}

function ChatPreview({ copy }: { copy: LandingCopy }) {
  const ui = copy.explorer.ui;
  const [log, setLog] = useState<{ from: "guest" | "ai"; text: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const ask = (q: string, a: string) => {
    if (typing) return;
    setLog((l) => [...l, { from: "guest", text: q }]);
    setTyping(true);
    timer.current = window.setTimeout(() => {
      setLog((l) => [...l, { from: "ai", text: a }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/[0.06]">
      <div className="flex items-center gap-3 bg-[#14100d] px-4 py-3 text-white">
        <span className="flex size-8 items-center justify-center rounded-full text-[12px] font-bold text-[#14100d]" style={{ background: EMBER }}>
          L
        </span>
        <span className="flex-1">
          <span className="block text-[14px] font-semibold">Lumbre</span>
          <span className="block text-[11px] text-white/60">ConvoAI · {ui.sample}</span>
        </span>
      </div>
      <div className="flex min-h-[220px] flex-col gap-2.5 bg-[#faf8f5] p-4" role="log" aria-live="polite">
        {log.length === 0 && <p className="m-auto text-[13px] text-[#5b6472]">{ui.chatHint} ↓</p>}
        {log.map((m, i) => (
          <p
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-snug",
              m.from === "guest" ? "self-end rounded-br-md bg-[#0b1530] text-white" : "self-start rounded-bl-md bg-white text-[#2b3442] ring-1 ring-black/[0.06]",
            )}
          >
            {m.text}
          </p>
        ))}
        {typing && (
          <span className="flex gap-1 self-start rounded-2xl bg-white px-3.5 py-3 ring-1 ring-black/[0.06]" role="status" aria-label={ui.typing}>
            <i className="size-1.5 animate-pulse rounded-full bg-[#9aa1ab]" />
            <i className="size-1.5 animate-pulse rounded-full bg-[#9aa1ab] [animation-delay:150ms]" />
            <i className="size-1.5 animate-pulse rounded-full bg-[#9aa1ab] [animation-delay:300ms]" />
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-black/[0.06] p-3">
        {ui.chatPrompts.map((p) => (
          <button
            key={p.q}
            type="button"
            onClick={() => ask(p.q, p.a)}
            disabled={typing}
            className="rounded-full bg-[#f1f2f5] px-3.5 py-2 text-left text-[13px] font-medium text-[#0b1530] hover:bg-[#e6e8ee] focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60"
          >
            {p.q}
          </button>
        ))}
      </div>
    </div>
  );
}

function TabIcon({ id }: { id: ExplorerTabId }) {
  const d: Record<ExplorerTabId, string> = {
    website: "M4 5h16v11H4zM2 19h20",
    menu: "M6 3h12v18H6zM9 8h6m-6 4h6m-6 4h4",
    ordering: "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
    reservations: "M4 6h16v14H4zM4 10h16M8 3v4m8-4v4",
    seo: "M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    ai: "M4 5h16v11H9l-5 4V5Zm4 4h8m-8 3.5h5",
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={d[id]} />
    </svg>
  );
}
