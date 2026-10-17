"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Locale } from "../_i18n";
import { formatTime } from "./availability";
import { HOURS } from "./menu";
import { LumbreProvider, useLumbre, useNow } from "./state";
import { LumbreMenu } from "./lumbre-menu";
import { CartButton, CartDrawer } from "./lumbre-cart";
import { LumbreReserve } from "./lumbre-reserve";
import { LumbreAssistant } from "./lumbre-assistant";
import { CHAR, CREAM, EMBER, serif } from "./theme";

/** The Lumbre restaurant site itself — everything between the demo bar and the pitch. */
export function LumbreApp({ locale }: { locale: Locale }) {
  return (
    <LumbreProvider locale={locale}>
      <LumbreNav />
      <LumbreHero />
      <LumbreMenu />
      <LumbreReserve />
      <LumbreAssistant />
      <LumbreVisit />
      <CartButton />
      <CartDrawer />
    </LumbreProvider>
  );
}

function LumbreNav() {
  const { copy, count, setCartOpen } = useLumbre();
  const n = copy.nav;
  const links = [
    ["#menu", n.menu],
    ["#reserve", n.reserve],
    ["#assistant", n.assistant],
    ["#visit", n.visit],
  ] as const;
  return (
    <nav
      aria-label={n.label}
      data-stage-rail=""
      className="sticky top-18 z-30 border-b border-white/10 backdrop-blur-md"
      style={{ background: "rgb(20 16 13 / 0.92)", color: CREAM }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-4 px-5 sm:px-8">
        <a href="#lumbre-top" className={cn(serif.className, "text-[22px] tracking-[0.18em] focus-visible:outline-2 focus-visible:outline-white")}>
          LUMBRE
        </a>
        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="rounded-full px-3.5 py-2 text-[14px] text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#reserve" className="ml-auto rounded-full px-3.5 py-2 text-[13px] font-semibold text-white ring-1 ring-white/30 md:hidden">
          {n.reserve}
        </a>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ background: EMBER, color: CHAR }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2" />
          </svg>
          <span>{n.order}</span>
          {count > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full text-[11px] tabular-nums" style={{ background: CHAR, color: CREAM }}>
              {count}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

function LumbreHero() {
  const { copy, goTo, setCartOpen, count } = useLumbre();
  const h = copy.hero;
  const now = useNow();
  const today = now ? HOURS[now.getDay()] : undefined;
  return (
    <>
      <section id="lumbre-top" aria-labelledby="lumbre-hero-heading" className="relative isolate flex min-h-[560px] items-end overflow-hidden text-white sm:min-h-[640px]" style={{ background: CHAR }}>
        <Image src="/restaurant/hero-chef.jpg" alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover object-[65%_45%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(20_16_13/0.94)_0%,rgb(20_16_13/0.6)_55%,rgb(20_16_13/0.2)_100%),linear-gradient(0deg,rgb(20_16_13)_0%,transparent_45%)]" />
        <div className="mx-auto w-full max-w-[1200px] px-5 pt-24 pb-14 sm:px-8 lg:pb-20">
          <p className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: EMBER }}>
            {h.eyebrow}
          </p>
          <h1 id="lumbre-hero-heading" className={cn(serif.className, "mt-4 max-w-[760px] text-[56px] leading-[0.95] text-current sm:text-[84px]")} style={{ color: CREAM }}>
            {h.title}
          </h1>
          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.6] text-white/80">{h.body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => (count > 0 ? setCartOpen(true) : goTo("menu"))}
              className="h-[52px] rounded-full px-7 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ background: EMBER, color: CHAR }}
            >
              {h.order}
            </button>
            <button
              type="button"
              onClick={() => goTo("reserve")}
              className="h-[52px] rounded-full px-7 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {h.reserve}
            </button>
            <button
              type="button"
              onClick={() => goTo("assistant")}
              className="h-[52px] rounded-full px-5 text-[15px] font-semibold text-white/85 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {h.ask} →
            </button>
          </div>
        </div>
      </section>
      <div className="border-t border-white/10 text-white" style={{ background: CHAR }}>
        <dl className="mx-auto grid w-full max-w-[1200px] gap-x-8 gap-y-4 px-5 py-6 text-[14px] sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          <Info label={copy.info.today} value={now === null ? "…" : today ? `${formatTime(today.open)} – ${formatTime(today.close)}` : copy.info.closedToday} />
          <Info label={copy.info.address} value={copy.info.addressValue} />
          <Info label={copy.info.parking} value={copy.info.parkingValue} />
          <Info label={copy.info.phone} value="(305) 555-0142" />
        </dl>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] tracking-[0.12em] text-white/50 uppercase">{label}</dt>
      <dd className="mt-1 font-medium text-white/90">{value}</dd>
    </div>
  );
}

function LumbreVisit() {
  const { copy } = useLumbre();
  const v = copy.visit;
  const now = useNow();
  return (
    <section id="visit" aria-labelledby="lumbre-visit-heading" className="scroll-mt-32 py-20 text-white lg:py-28" style={{ background: CHAR }}>
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: EMBER }}>
            {v.label}
          </p>
          <h2 id="lumbre-visit-heading" className={cn(serif.className, "mt-3 text-[44px] leading-none text-current outline-none sm:text-[60px]")}>
            {v.title}
          </h2>
          <h3 className="mt-8 text-[15px] font-semibold text-current">{v.hours}</h3>
          <table className="mt-3 w-full max-w-[420px] text-[15px]">
            <caption className="sr-only">{v.hours}</caption>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const h = HOURS[d];
                const isToday = now?.getDay() === d;
                return (
                  <tr key={d} className={cn("border-b border-white/10", isToday && "font-semibold")} aria-current={isToday ? "date" : undefined}>
                    <th scope="row" className="py-2.5 text-left font-[inherit] text-white/80">
                      {v.days[d]}
                    </th>
                    <td className="py-2.5 text-right tabular-nums" style={isToday ? { color: EMBER } : undefined}>
                      {h ? `${formatTime(h.open)} – ${formatTime(h.close)}` : v.closed}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-current">{v.find}</h3>
          <div aria-hidden="true" className="relative mt-3 aspect-[4/3] overflow-hidden rounded-[20px] bg-[#201a15] ring-1 ring-white/10">
            <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
              <rect width="400" height="300" fill="#1d1813" />
              <g stroke="#2e261f" strokeWidth="14">
                <path d="M-10 80 H410 M-10 210 H410 M90 -10 V310 M270 -10 V310" />
              </g>
              <g stroke="#3a3027" strokeWidth="5">
                <path d="M-10 145 H410 M180 -10 V310 M340 -10 V310 M30 -10 L150 310" />
              </g>
              <rect x="190" y="90" width="70" height="44" rx="4" fill="#3d5a3a" opacity="0.6" />
              <rect x="285" y="225" width="90" height="60" rx="4" fill="#2b3a4a" opacity="0.6" />
            </svg>
            <span className="absolute top-[42%] left-[55%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
              <span className={cn(serif.className, "rounded-full px-3 py-1 text-[14px] tracking-[0.12em]")} style={{ background: EMBER, color: CHAR }}>
                LUMBRE
              </span>
              <span className="h-4 w-0.5" style={{ background: EMBER }} />
              <span className="size-3 rounded-full ring-4 ring-[#e2642b]/30" style={{ background: EMBER }} />
            </span>
          </div>
          <p className="mt-4 text-[14px] leading-[1.55] text-white/60">{v.note}</p>
        </div>
      </div>
      <p className="mx-auto mt-16 w-full max-w-[1200px] px-5 text-[12px] text-white/45 sm:px-8">{copy.footer}</p>
    </section>
  );
}
