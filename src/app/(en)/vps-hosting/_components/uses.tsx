"use client";

import { useState } from "react";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";
import { USES, USES_HEAD } from "../_content";
import { Btn, Icon, SOFT, SplitHead, Wrap } from "./kit";

/**
 * "Run what you need" — the reference's expanding card row. At 1440: five
 * cards in a 1280 row, 420 tall, 8px apart; the open one is 454 wide with a
 * brand gradient, the closed ones share the rest and show the title only.
 * Hover, focus or click opens a card. Below xl every card is open and stacked,
 * since a 200px column cannot hold the copy.
 */
export function Uses() {
  const [open, setOpen] = useState(0);
  return (
    <section aria-labelledby="vps-uses-heading" className="bg-black py-12">
      <Wrap>
        <SplitHead id="vps-uses-heading" title={USES_HEAD.title} muted={USES_HEAD.titleMuted} lede={USES_HEAD.lede} />
        <ul className="mt-12 flex flex-col gap-2 xl:h-[420px] xl:flex-row">
          {USES.map((u, i) => {
            const active = open === i;
            return (
              <li
                key={u.title}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-8 transition-[flex-grow,background-color] duration-500 ease-out xl:min-w-0 xl:basis-0",
                  active ? "xl:grow-[2.3]" : "cursor-pointer xl:grow",
                  active
                    ? "bg-[linear-gradient(160deg,#0b1a5c_0%,#0000ff_100%)]"
                    : "bg-white/[0.05] max-xl:bg-[linear-gradient(160deg,#0b1a5c_0%,#0000ff_100%)]",
                )}
              >
                <h3 className="text-[20px] leading-7 text-white">
                  <button type="button" aria-expanded={active} className="text-left outline-offset-4">
                    {u.title}
                  </button>
                </h3>
                <div className={cn("transition-opacity duration-300 xl:w-[390px]", active ? "opacity-100" : "xl:invisible xl:opacity-0")}>
                  <p className={cn("mt-3 text-[14px] leading-5", SOFT)}>{u.body}</p>
                  <p className="mt-4 flex flex-wrap items-center gap-2 text-[14px] leading-5 text-white">
                    {USES_HEAD.stackLabel}
                    {u.stack.map((s) => (
                      <span key={s} className="rounded-md bg-white/15 px-2 py-0.5 text-[12px] leading-4">
                        {s}
                      </span>
                    ))}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {u.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-3 text-[14px] leading-5 text-white">
                        <Icon.check className="size-4 shrink-0 text-[#4ade80]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Btn href={billing.sales} tone="outline" className="mt-8" >
                    {USES_HEAD.cta}
                  </Btn>
                </div>
              </li>
            );
          })}
        </ul>
      </Wrap>
    </section>
  );
}
