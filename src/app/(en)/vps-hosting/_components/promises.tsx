import { cn } from "@/lib/utils";
import { PROMISES, PROMISES_HEAD } from "../_content";
import { CenterHead, SOFT } from "./kit";

/**
 * The reference's review wall: an endless rail of 450×240 cards (24 padding,
 * 48px round avatar, 16/24 body, 16px apart) drifting left, faded at both
 * edges. Same rail, carrying commitments instead of reviews — Serverlys has no
 * collected customer reviews and VPS has no customers yet (see _content.ts).
 *
 * The list is rendered twice so the -50% translate loops seamlessly; the
 * second copy is aria-hidden. Hover pauses it; reduced motion stops it and
 * turns the rail into a normal horizontal scroller.
 */
export function Promises() {
  return (
    <section aria-labelledby="vps-promises-heading" className="overflow-hidden bg-black py-14 xl:py-20">
      <style>{`
        @keyframes vps-rail { to { transform: translateX(-50%); } }
        .vps-rail { animation: vps-rail 70s linear infinite; }
        .vps-rail:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .vps-rail { animation: none; }
          .vps-rail-wrap { overflow-x: auto; }
          .vps-rail-copy { display: none; }
        }
      `}</style>
      <div className="px-4 md:px-10">
        <CenterHead id="vps-promises-heading" title={PROMISES_HEAD.title} muted={PROMISES_HEAD.titleMuted} />
      </div>
      <div className="vps-rail-wrap mt-12 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="vps-rail flex w-max gap-4">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 || undefined} className={cn("flex gap-4", copy === 1 && "vps-rail-copy")}>
              {PROMISES.map((p) => (
                <li key={p.title} className="h-[240px] w-[320px] shrink-0 rounded-2xl bg-[#121213] p-6 md:w-[450px]">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="inline-flex size-12 items-center justify-center rounded-full bg-primary text-[15px] font-semibold text-white">
                      {p.mark}
                    </span>
                    <h3 className="text-[16px] leading-6 font-semibold text-white">{p.title}</h3>
                  </div>
                  <p className={cn("mt-6 text-[16px] leading-6", SOFT)}>{p.body}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
