"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { STACK, STACK_HEAD, type StackItem } from "../_content";
import { Icon, SOFT, SplitHead, Wrap } from "./kit";

type Tab = (typeof STACK_HEAD.tabs)[number];

/**
 * "Choose your stack" — reference at 1440: pill tabs (40 tall) left, a 284px
 * search box right, a "trending" row of six 411×106 gradient cards, a sort
 * control, then 411×126 description cards in threes and a "View more" toggle.
 *
 * Names only, as text monograms: no third-party logos are reproduced. The
 * cards are informational (root means anything installs), not one-click
 * installers, so they are not links.
 */
export function Stack() {
  const [tab, setTab] = useState<Tab>("Applications");
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);

  const items = STACK[tab];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return Object.values(STACK)
      .flat()
      .filter((i) => `${i.name} ${i.tag} ${i.body}`.toLowerCase().includes(s));
  }, [items, q]);
  const searching = q.trim().length > 0;
  const shown = all || searching ? filtered : filtered.slice(0, 6);

  return (
    <section aria-labelledby="vps-stack-heading" className="bg-black py-12">
      <Wrap>
        <SplitHead id="vps-stack-heading" title={STACK_HEAD.title} muted={STACK_HEAD.titleMuted} lede={STACK_HEAD.lede} />

        <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Stack type" className="flex flex-wrap gap-2">
            {STACK_HEAD.tabs.map((t) => (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={tab === t && !searching}
                onClick={() => {
                  setTab(t);
                  setQ("");
                  setAll(false);
                }}
                className={cn(
                  "h-10 rounded-full px-4 text-[14px] leading-5 font-semibold transition-colors",
                  tab === t && !searching ? "bg-white text-[#18181a]" : "bg-[#18181a] text-white hover:bg-[#232327]",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <label className="flex h-[42px] items-center gap-3 rounded-xl border border-white/20 px-4 md:w-[284px]">
            <Icon.search className="size-5 shrink-0 text-white" />
            <span className="sr-only">{STACK_HEAD.search}</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={STACK_HEAD.search}
              className="w-full bg-transparent text-[14px] leading-5 text-white outline-none placeholder:text-white/70"
            />
          </label>
        </div>

        {!searching && (
          <>
            <p className="mt-6 flex items-center gap-2 text-[16px] leading-6 text-white">
              <Icon.star className="size-4" />
              {STACK_HEAD.featuredLabel}
            </p>
            <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.slice(0, 6).map((i) => (
                <li
                  key={i.name}
                  className="relative overflow-hidden rounded-2xl bg-[#101011] p-4 ring-1 ring-white/5"
                >
                  <div aria-hidden className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(70%_120%_at_100%_100%,rgb(0_0_255/0.85),transparent_70%)]" />
                  <div className="relative flex items-center gap-4">
                    <Mono name={i.name} />
                    <p className="flex-1 text-[16px] leading-6 font-semibold text-white">{i.name}</p>
                  </div>
                  <span className={cn("relative mt-3 inline-block rounded-full bg-[#18181a] px-3 py-1 text-[14px] leading-5 font-semibold", SOFT)}>
                    {i.tag}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-6 flex justify-end">
          <p className="flex h-[42px] w-full items-center justify-between rounded-xl border border-white/20 px-3 text-[14px] leading-6 text-white md:w-[284px]">
            {searching ? `Results (${filtered.length})` : `${STACK_HEAD.sortLabel} (${items.length})`}
            <Icon.chevron className="size-4" />
          </p>
        </div>

        {shown.length === 0 ? (
          <p className={cn("mt-6 text-[16px] leading-6", SOFT)}>{STACK_HEAD.empty}</p>
        ) : (
          <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((i) => (
              <Card key={`${i.name}-${i.tag}`} item={i} />
            ))}
          </ul>
        )}

        {!searching && filtered.length > 6 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              aria-expanded={all}
              onClick={() => setAll((v) => !v)}
              className="flex items-center gap-2 text-[16px] leading-6 font-semibold text-white"
            >
              {all ? STACK_HEAD.less : STACK_HEAD.more}
              <Icon.chevron className={cn("size-4 transition-transform", all && "rotate-180")} />
            </button>
          </div>
        )}
      </Wrap>
    </section>
  );
}

function Mono({ name }: { name: string }) {
  return (
    <span aria-hidden className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-white text-[13px] font-bold text-primary">
      {name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}
    </span>
  );
}

function Card({ item }: { item: StackItem }) {
  return (
    <li className="rounded-2xl bg-[#101011] p-4 ring-1 ring-white/5">
      <div className="flex items-center gap-4">
        <Mono name={item.name} />
        <p className="flex-1 text-[16px] leading-6 font-semibold text-white">{item.name}</p>
      </div>
      <p className={cn("mt-3 line-clamp-2 text-[16px] leading-6", SOFT)}>{item.body}</p>
    </li>
  );
}
