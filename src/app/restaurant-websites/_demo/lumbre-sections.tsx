import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LuxCopy } from "./copy-lux";
import { Film } from "./lumbre-film";
import { Eyebrow, Lines } from "./lumbre-ui";
import { CHAR, MUTED_LIGHT, SOFT, display } from "./theme";

/**
 * The editorial sections of the Lumbre demo. SERVER components: they render
 * once, ship no JavaScript of their own, and mark elements for the shared
 * motion driver (lumbre-motion.tsx) with `data-reveal` / `data-parallax`.
 * Only the films are client islands.
 */

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

const WRAP = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12";
const BTN_FILL =
  "inline-flex h-14 items-center justify-center rounded-full bg-[#C8A97E] px-8 font-display text-[13px] font-semibold tracking-[0.16em] text-[#111411] uppercase transition-colors duration-300 hover:bg-[#F4EFE6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A97E]";
const BTN_GHOST =
  "inline-flex h-14 items-center justify-center rounded-full px-8 font-display text-[13px] font-semibold tracking-[0.16em] text-[#F4EFE6] uppercase ring-1 ring-[#F4EFE6]/40 transition-colors duration-300 ring-inset hover:bg-[#F4EFE6]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A97E]";

/* ── A · Hero ──────────────────────────────────────────────────────────── */

export function LumbreHero({ lux }: { lux: LuxCopy }) {
  const h = lux.hero;
  return (
    <section
      id="lumbre-top"
      aria-labelledby="lumbre-hero-heading"
      className="lb-enter lb-grain relative isolate flex h-svh min-h-[640px] items-end overflow-hidden text-[#F4EFE6]"
      style={{ background: CHAR }}
    >
      <Film name="lumbre-hero" pauseLabel={h.pause} playLabel={h.play} controlClassName="right-5 bottom-6 sm:right-10 sm:bottom-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(17_20_17/0.65)_0%,rgb(17_20_17/0)_22%,rgb(17_20_17/0)_45%,rgb(17_20_17/0.88)_100%),linear-gradient(90deg,rgb(17_20_17/0.7)_0%,rgb(17_20_17/0.15)_60%,rgb(17_20_17/0)_100%)]"
      />
      <div data-parallax="140" className={cn(WRAP, "relative z-10 pb-24 sm:pb-28 lg:pb-32")}>
        <Eyebrow dark className="lb-rise [--d:150ms]">
          {h.eyebrow}
        </Eyebrow>
        <h1
          id="lumbre-hero-heading"
          className={cn(display.className, "mt-7 text-[clamp(54px,10.4vw,172px)] leading-[0.88] font-light tracking-[-0.025em]")}
        >
          <Lines lines={h.lines} italicFrom={1} />
        </h1>
        <p className="lb-slide mt-8 max-w-[500px] text-[16px] leading-[1.7] text-[#F4EFE6]/80 [--d:750ms] sm:text-[18px]">{h.sub}</p>
        <div className="lb-rise mt-10 flex flex-col gap-3 [--d:900ms] sm:flex-row">
          <a href="#reserve" className={BTN_FILL}>
            {h.reserve}
          </a>
          <a href="#menu" className={BTN_GHOST}>
            {h.explore}
          </a>
        </div>
      </div>
      <a
        href="#story"
        className="lb-rise absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 font-display text-[10px] tracking-[0.3em] text-[#F4EFE6]/70 uppercase [--d:1400ms] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A97E] lg:flex"
      >
        {h.scroll}
        <span aria-hidden="true" className="relative h-14 w-px overflow-hidden bg-[#F4EFE6]/20">
          <span className="lb-scroll-dot absolute inset-x-0 top-0 h-1/2 bg-[#C8A97E]" />
        </span>
      </a>
    </section>
  );
}

/* ── B · Story ─────────────────────────────────────────────────────────── */

export function LumbreStory({ lux }: { lux: LuxCopy }) {
  const s = lux.story;
  return (
    <section id="story" aria-labelledby="lumbre-story-heading" className="overflow-hidden py-28 lg:py-44" style={{ background: SOFT, color: CHAR }}>
      <div className={cn(WRAP, "grid gap-20 lg:grid-cols-12 lg:gap-8")}>
        <div className="lg:col-span-5 lg:pt-10">
          <Eyebrow>{s.label}</Eyebrow>
          <h2
            id="lumbre-story-heading"
            data-reveal="mask"
            className={cn(display.className, "mt-8 text-[clamp(52px,6.4vw,104px)] leading-[0.92] font-light tracking-[-0.02em] outline-none")}
          >
            <Lines lines={s.title.split(". ").map((l, i, a) => (i < a.length - 1 ? `${l}.` : l))} italicFrom={1} />
          </h2>
          <p data-reveal className={cn(display.className, "mt-10 max-w-[520px] text-[26px] leading-[1.35] italic sm:text-[30px]")}>
            {s.lead}
          </p>
          <p data-reveal className="mt-7 max-w-[500px] text-[16px] leading-[1.8]" style={{ color: MUTED_LIGHT }}>
            {s.body}
          </p>
          <dl className="mt-14 grid gap-8 border-t border-[#111411]/12 pt-10 sm:grid-cols-3 sm:gap-6">
            {s.facts.map((f, i) => (
              <div key={f.k} data-reveal style={{ "--reveal-delay": `${i * 120}ms` } as Vars}>
                <dt className="font-display text-[11px] font-semibold tracking-[0.22em] text-[#696D55] uppercase">{f.k}</dt>
                <dd className={cn(display.className, "mt-2 text-[21px] leading-[1.25]")}>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative pb-16 lg:col-span-6 lg:col-start-7 lg:pb-24">
          <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden">
            <div data-parallax="-50" className="absolute inset-x-0 -inset-y-[8%]">
              <Image src="/restaurant/room-moody.jpg" alt={s.photoAlt} fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div
            data-reveal="image"
            style={{ "--reveal-delay": "250ms" } as Vars}
            className="absolute bottom-0 -left-3 aspect-[4/5] w-[44%] overflow-hidden ring-[10px] ring-[#FAF8F3] sm:-left-10 lg:-left-28"
          >
            <Image src="/restaurant/fine-table.jpg" alt={s.insetAlt} fill sizes="(min-width: 1024px) 22vw, 44vw" className="object-cover" />
          </div>
          <p aria-hidden="true" className={cn(display.className, "absolute top-8 -right-6 hidden text-[13px] tracking-[0.4em] text-[#696D55] [writing-mode:vertical-rl] sm:block")}>
            LUMBRE · DORAL
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── D · The fire (immersive film) ─────────────────────────────────────── */

export function LumbreFire({ lux }: { lux: LuxCopy }) {
  const f = lux.fire;
  return (
    <section
      id="fire"
      aria-labelledby="lumbre-fire-heading"
      className="lb-grain relative isolate flex min-h-[92svh] items-center overflow-hidden py-28 text-[#F4EFE6]"
      style={{ background: CHAR }}
    >
      <Film name="lumbre-fire" lazy pauseLabel={lux.hero.pause} playLabel={lux.hero.play} />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_30%_50%,rgb(17_20_17/0.82)_0%,rgb(17_20_17/0.45)_60%,rgb(17_20_17/0.3)_100%),linear-gradient(180deg,rgb(17_20_17)_0%,transparent_18%,transparent_82%,rgb(17_20_17)_100%)]"
      />
      <div className={cn(WRAP, "relative z-10")}>
        <Eyebrow dark>{f.label}</Eyebrow>
        <h2
          id="lumbre-fire-heading"
          data-reveal="mask"
          className={cn(display.className, "mt-8 text-[clamp(52px,9vw,156px)] leading-[0.9] font-light tracking-[-0.025em] outline-none")}
        >
          <Lines lines={f.lines} italicFrom={1} accent="#C8A97E" />
        </h2>
        <p data-reveal className="mt-10 max-w-[480px] text-[17px] leading-[1.75] text-[#F4EFE6]/80">
          {f.body}
        </p>
      </div>
    </section>
  );
}

/* ── E · Chef & philosophy ─────────────────────────────────────────────── */

export function LumbreChef({ lux }: { lux: LuxCopy }) {
  const c = lux.chef;
  return (
    <section aria-labelledby="lumbre-chef-heading" className="overflow-hidden py-28 lg:py-44" style={{ background: SOFT, color: CHAR }}>
      <div className={cn(WRAP, "grid items-center gap-16 lg:grid-cols-12 lg:gap-8")}>
        <div className="lg:col-span-6">
          {/* Landscape on purpose: the still is a 1080p film frame, and a portrait
              crop would upscale it past sharp. */}
          <div data-reveal="image" className="relative aspect-[4/3] overflow-hidden">
            <div data-parallax="-40" className="absolute inset-x-0 -inset-y-[7%]">
              <Image src="/restaurant/still-chef-hands.jpg" alt={c.photoAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[55%_45%]" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Eyebrow>{c.label}</Eyebrow>
          <p className="mt-6 inline-flex rounded-full px-3.5 py-1.5 font-display text-[12px] font-medium ring-1 ring-[#696D55]/40" style={{ color: MUTED_LIGHT }}>
            {c.sample}
          </p>
          <h2
            id="lumbre-chef-heading"
            data-reveal="mask"
            className={cn(display.className, "mt-8 text-[clamp(48px,5.4vw,84px)] leading-[0.95] font-light tracking-[-0.02em] outline-none")}
          >
            <Lines lines={[c.name]} />
          </h2>
          <p className="mt-3 font-display text-[12px] font-semibold tracking-[0.22em] text-[#696D55] uppercase">{c.role}</p>
          <blockquote data-reveal className={cn(display.className, "mt-10 border-l border-[#C8A97E] pl-7 text-[30px] leading-[1.25] italic sm:text-[36px]")}>
            {c.quote}
          </blockquote>
          <p data-reveal className="mt-8 max-w-[480px] text-[16px] leading-[1.8]" style={{ color: MUTED_LIGHT }}>
            {c.bio}
          </p>
          <ol className="mt-12 grid gap-7 border-t border-[#111411]/12 pt-10">
            {c.principles.map((p, i) => (
              <li key={p.k} data-reveal style={{ "--reveal-delay": `${i * 100}ms` } as Vars} className="grid grid-cols-[48px_1fr] gap-x-4">
                <span className={cn(display.className, "text-[28px] leading-none text-[#696D55] italic")}>0{i + 1}</span>
                <span>
                  <span className={cn(display.className, "block text-[24px] leading-tight")}>{p.k}</span>
                  <span className="mt-1 block text-[15px] leading-[1.6]" style={{ color: MUTED_LIGHT }}>
                    {p.v}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ── I · Final call ────────────────────────────────────────────────────── */

export function LumbreFinale({ lux }: { lux: LuxCopy }) {
  const f = lux.finale;
  return (
    <section
      aria-labelledby="lumbre-finale-heading"
      className="lb-grain relative isolate flex min-h-[88svh] items-center justify-center overflow-hidden px-5 py-28 text-center text-[#F4EFE6]"
      style={{ background: CHAR }}
    >
      <div aria-hidden="true" data-parallax="90" className="absolute inset-x-0 -inset-y-[14%] -z-20">
        <Image src="/restaurant/still-flames.jpg" alt="" fill sizes="100vw" className="object-cover object-[70%_50%]" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,rgb(17_20_17/0.55)_0%,rgb(17_20_17/0.85)_100%)]" />
      <div className="relative z-10 max-w-[1100px]">
        <Eyebrow dark className="justify-center">
          {f.label}
        </Eyebrow>
        <h2
          id="lumbre-finale-heading"
          data-reveal="mask"
          className={cn(display.className, "mt-8 text-[clamp(60px,11vw,184px)] leading-[0.88] font-light tracking-[-0.03em] outline-none")}
        >
          <Lines lines={f.lines} italicFrom={1} accent="#C8A97E" />
        </h2>
        <p data-reveal className="mx-auto mt-10 max-w-[460px] text-[17px] leading-[1.7] text-[#F4EFE6]/80">
          {f.body}
        </p>
        <div data-reveal className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <a href="#reserve" className={BTN_FILL}>
            {f.reserve}
          </a>
          <a href="tel:+13055550142" className="inline-flex min-h-11 items-center font-display text-[14px] font-medium text-[#F4EFE6]/85 underline-offset-[6px] hover:underline">
            {f.call}
          </a>
        </div>
      </div>
    </section>
  );
}
