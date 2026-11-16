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
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_45%_at_50%_100%,rgb(0_0_255/0.45),transparent_75%),radial-gradient(40%_30%_at_50%_55%,rgb(0_0_255/0.2),transparent_75%)]" />
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

        <div className="relative mx-auto mt-6 aspect-square w-full max-w-[560px]">
          <Globe />
          <span className="absolute top-[44%] left-[30%] rounded bg-white px-2 py-1.5 text-[12px] leading-4 font-semibold text-black">
            {PLACE_HEAD.them}
          </span>
          <span className="absolute top-[34%] left-[55%] rounded bg-primary px-2 py-1.5 text-[12px] leading-4 font-semibold text-white">
            {PLACE_HEAD.you}
          </span>
        </div>

        <ul className="mt-10 grid gap-10 text-center md:grid-cols-3 md:gap-8">
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

/**
 * Dotted sphere, orthographic projection of a lat/long dot lattice. Pure
 * geometry, computed at build time — no map data, so no borders to get wrong
 * and nothing implying where our servers are.
 */
function Globe() {
  const R = 270;
  const C = 280;
  const tilt = (20 * Math.PI) / 180;
  const dots: { x: number; y: number; o: number }[] = [];
  for (let lat = -80; lat <= 80; lat += 6) {
    const phi = (lat * Math.PI) / 180;
    const n = Math.max(6, Math.round(60 * Math.cos(phi)));
    for (let k = 0; k < n; k++) {
      const lam = (k / n) * 2 * Math.PI;
      const x = Math.cos(phi) * Math.sin(lam);
      const y0 = Math.sin(phi);
      const z0 = Math.cos(phi) * Math.cos(lam);
      const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
      if (z <= 0.05) continue;
      dots.push({ x: C + x * R, y: C - y * R, o: Math.min(0.9, 0.08 + z * z * 0.9) });
    }
  }
  return (
    <svg viewBox="0 0 560 560" aria-hidden className="size-full">
      <defs>
        <radialGradient id="vps-globe" cx="50%" cy="50%" r="50%">
          <stop offset="0.86" stopColor="#050508" />
          <stop offset="1" stopColor="#5f8bff" stopOpacity="0.22" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={R + 4} fill="url(#vps-globe)" stroke="white" strokeOpacity="0.35" strokeWidth="2" style={{ filter: "drop-shadow(0 0 18px rgb(255 255 255 / 0.18))" }} />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r="1.6" fill="white" fillOpacity={d.o.toFixed(2)} />
      ))}
      <path d="M200 262 Q 260 200 330 208" fill="none" stroke="#5f8bff" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="200" cy="262" r="5" fill="white" />
      <circle cx="330" cy="208" r="5" fill="#0000ff" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}
