import { cn } from "@/lib/utils";
import { TOOLS, TOOLS_HEAD } from "../_content";
import { CenterHead, Icon, SOFT, Wrap } from "./kit";

/**
 * "Full control" grid, reference at 1440: centred two-tone heading, then a
 * 3×2 grid of 411×170 cells with 24px padding — 24px icon, 16px gap, 18/26
 * semibold title, 16/24 body at white/75. No card fill.
 */
export function Tools() {
  return (
    <section aria-labelledby="vps-tools-heading" className="bg-black py-14 xl:py-20">
      <Wrap>
        <CenterHead id="vps-tools-heading" title={TOOLS_HEAD.title} muted={TOOLS_HEAD.titleMuted} />
        <ul className="mt-12 grid gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map((t) => {
            const Ico = Icon[t.icon];
            return (
              <li key={t.title} className="p-6">
                <Ico className="size-6 text-white" />
                <h3 className="mt-4 text-[18px] leading-[26px] font-semibold text-white">{t.title}</h3>
                <p className={cn("mt-2 max-w-[363px] text-[16px] leading-6", SOFT)}>{t.body}</p>
              </li>
            );
          })}
        </ul>
      </Wrap>
    </section>
  );
}
