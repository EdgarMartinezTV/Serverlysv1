"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MANAGE_HEAD, MANAGE_TABS } from "../_content";
import { SOFT, SplitHead, Wrap } from "./kit";

/**
 * "Manage your VPS with AI" slot, reference at 1440: split header, then a
 * 1280×480 r24 plate — pill tabs (42 tall, r30) and a 36/44 heading on the
 * left, a 576px art panel on the right with a terminal and a chat panel over
 * a brand glow.
 *
 * The reference sells an AI agent; we have none for servers. The same layout
 * now shows what the MANAGED plan does: the chat is our support team, the
 * terminal shows the fix it applied.
 */
export function Manage() {
  const [i, setI] = useState(0);
  const t = MANAGE_TABS[i];
  return (
    <section aria-labelledby="vps-manage-heading" className="bg-black py-14 xl:py-20">
      <Wrap>
        <SplitHead id="vps-manage-heading" title={MANAGE_HEAD.title} muted={MANAGE_HEAD.titleMuted} lede={MANAGE_HEAD.lede} />

        <div className="mt-12 grid gap-8 rounded-3xl bg-[#121213] p-6 md:p-12 xl:grid-cols-[1fr_576px] xl:gap-10 xl:p-6 xl:pl-12">
          <div className="xl:pt-6">
            <div role="tablist" aria-label="What managed covers" className="flex flex-wrap gap-2">
              {MANAGE_TABS.map((m, j) => (
                <button
                  key={m.tab}
                  role="tab"
                  type="button"
                  id={`vps-manage-tab-${j}`}
                  aria-selected={i === j}
                  aria-controls="vps-manage-panel"
                  onClick={() => setI(j)}
                  className={cn(
                    "h-[42px] rounded-full border px-4 text-[14px] leading-5 text-[#dedee2] transition-colors",
                    i === j ? "border-primary bg-black" : "border-transparent bg-[#222225] hover:bg-[#2c2c30]",
                  )}
                >
                  {m.tab}
                </button>
              ))}
            </div>
            <div id="vps-manage-panel" role="tabpanel" aria-labelledby={`vps-manage-tab-${i}`} className="mt-12 xl:max-w-[454px]">
              <h3 className="text-[28px] leading-9 font-normal tracking-[-0.02em] text-white md:text-[36px] md:leading-[44px]">{t.title}</h3>
              <p className="mt-4 text-[16px] leading-6 text-[#dedee2]">{t.body}</p>
            </div>
          </div>

          <div aria-hidden className="relative h-[360px] overflow-hidden rounded-2xl bg-[#0d1140] bg-[radial-gradient(55%_70%_at_0%_55%,rgb(31_85_255/0.75),transparent_70%),radial-gradient(55%_60%_at_100%_0%,rgb(31_85_255/0.7),transparent_70%),radial-gradient(60%_60%_at_100%_100%,rgb(0_0_255/0.55),transparent_70%)] md:h-[432px]">
            <div className="absolute top-6 left-6 h-[300px] w-[78%] rounded-lg bg-[#121214] p-3 font-mono text-[10px] leading-[15px] text-white/80 shadow-2xl ring-1 ring-white/10 md:left-8">
              <div className="mb-3 flex gap-1.5">
                <span className="size-2 rounded-full bg-white/25" />
                <span className="size-2 rounded-full bg-white/25" />
                <span className="size-2 rounded-full bg-white/25" />
              </div>
              {t.lines.map((l, k) => (
                <p key={k} className={cn("whitespace-pre", l.startsWith("root@") ? "text-white" : "text-white/60")}>
                  {l || " "}
                </p>
              ))}
              <p className="text-white">root@vps:~# <span className="inline-block h-3 w-1.5 animate-pulse bg-white/70 align-middle" /></p>
            </div>
            <div className="absolute right-4 bottom-4 w-[56%] rounded-xl bg-[#26262b] p-3 text-[11px] leading-4 shadow-2xl ring-1 ring-white/10 md:right-6 md:bottom-6 md:w-[48%]">
              <p className="mb-3 flex items-center gap-2 text-[12px] text-white">
                <span className="size-2 rounded-full bg-[#4ade80]" /> Serverlys support
              </p>
              <p className="ml-6 rounded-lg bg-white/10 p-2.5 text-white">{t.ask}</p>
              <p className={cn("mt-3 mr-6 rounded-lg bg-black/40 p-2.5", SOFT)}>{t.reply}</p>
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
