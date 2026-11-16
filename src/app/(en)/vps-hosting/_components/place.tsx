import { billing } from "@/data/company";
import { cn } from "@/lib/utils";
import { PLACE_HEAD } from "../_content";
import { Btn, Icon, SOFT, SplitHead, Wrap } from "./kit";

/**
 * "Global infrastructure" band, reference at 1440: split header with a 328px
 * location picker on the right, a ~560px dotted globe with labelled markers,
 * three centred feature columns and a white 48px button, all over a glow
 * rising from the bottom.
 *
 * We do not publish data-centre regions yet, so the picker states that, the
 * globe carries no country markers and no latency figure, and the reference's
 * "10 data centres" and "clean energy" columns are replaced with things the
 * plan is being built to do.
 */
export function Place() {
  return (
    <section aria-labelledby="vps-place-heading" className="relative isolate overflow-hidden bg-black py-12">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_45%_at_50%_100%,rgb(31_85_255/0.4),transparent_75%),radial-gradient(45%_35%_at_50%_45%,rgb(31_85_255/0.14),transparent_75%)]" />
      <Wrap>
        <SplitHead
          id="vps-place-heading"
          title={PLACE_HEAD.title}
          muted={PLACE_HEAD.titleMuted}
          aside={
            <div className="xl:w-[328px] xl:shrink-0 xl:self-start xl:pt-1">
              <p className="text-[14px] leading-5 font-semibold text-white">{PLACE_HEAD.pickerLabel}</p>
              <p className="mt-3 flex h-[42px] items-center gap-3 rounded-xl border border-white/20 px-3 text-[14px] leading-6 text-white">
                <Icon.globe className="size-4" />
                {PLACE_HEAD.pickerValue}
              </p>
              <p className="mt-2 text-[12px] leading-4 text-white/60">{PLACE_HEAD.pickerNote}</p>
            </div>
          }
        />

        <div className="relative mx-auto mt-10 aspect-square w-full max-w-[690px]">
          {/* Static dotted globe (public/vps-hosting/globe.svg), generated from
              Natural Earth land outlines. No markers on it: the two labels
              below are illustrative and name no region. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vps-hosting/globe.svg" alt="" width={690} height={690} loading="lazy" decoding="async" className="size-full" />
          <svg viewBox="0 0 690 690" aria-hidden className="absolute inset-0 size-full">
            <path d="M232 262 Q 268 230 304 263" fill="none" stroke="#5f8bff" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="232" cy="262" r="6" fill="white" />
            <circle cx="304" cy="263" r="6" fill="#0000ff" stroke="white" strokeWidth="2" />
          </svg>
          <span className="absolute top-[38%] left-[32.4%] -translate-x-full -translate-y-1/2 rounded bg-white px-2 py-1.5 text-[12px] leading-4 font-semibold text-black">
            {PLACE_HEAD.them}
          </span>
          <span className="absolute top-[35.4%] left-[42.6%] -translate-y-full rounded bg-primary px-2 py-1.5 text-[12px] leading-4 font-semibold text-white">
            {PLACE_HEAD.you}
          </span>
        </div>

        <ul className="mt-16 grid gap-10 text-center md:grid-cols-3 md:gap-8">
          {PLACE_HEAD.features.map((f, i) => {
            const Ico = [Icon.globe, Icon.resize, Icon.ip][i];
            return (
              <li key={f.title} className="flex flex-col items-center">
                <Ico className="size-6 text-white" />
                <h3 className="mt-6 text-[18px] leading-[26px] font-semibold text-white">{f.title}</h3>
                <p className={cn("mt-2 max-w-[405px] text-[16px] leading-6", SOFT)}>{f.body}</p>
              </li>
            );
          })}
        </ul>
        <div className="mt-12 flex justify-center">
          <Btn href={billing.sales}>{PLACE_HEAD.cta}</Btn>
        </div>
      </Wrap>
    </section>
  );
}
