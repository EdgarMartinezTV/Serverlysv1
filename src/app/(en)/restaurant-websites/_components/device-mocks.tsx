import Image from "next/image";
import { Instrument_Serif } from "next/font/google";
import { cn } from "@/lib/utils";
import type { LandingCopy } from "../_i18n";

/**
 * Coded device mockups of the Lumbre demo for the hero.
 *
 * STATIC ART: `aria-hidden` on the stage, no focusable children. The real,
 * operable version is /restaurant-websites/demo — that is where "it works"
 * is proved, not here.
 *
 * Every size inside a screen is in `cqw` (container-query width units) so the
 * whole screen scales as one picture with its frame, at any breakpoint, with
 * no JavaScript and no transform: scale (which would blur text).
 *
 * Lumbre's palette is deliberately NOT Serverlys blue — it is a client site,
 * and showing a restaurant brand is the point.
 */

export const lumbreSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], display: "swap" });

export const EMBER = "#e2642b";
const CHAR = "#14100d";
const CREAM = "#f6efe6";

type Mock = LandingCopy["hero"]["mock"];

function Thumb({ src, className }: { src: string; className?: string }) {
  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <Image src={src} alt="" fill sizes="120px" className="object-cover" />
    </span>
  );
}

/** Desktop browser showing the Lumbre homepage. */
/** `eager` only where it is above the fold (the hero); everywhere else it lazy-loads. */
export function LaptopMock({ mock, eager = false }: { mock: Mock; eager?: boolean }) {
  const dishes = [
    { src: "/restaurant/churrasco.jpg", name: mock.dishes[0], price: "$38" },
    { src: "/restaurant/chicken.jpg", name: mock.dishes[1], price: "$27" },
    { src: "/restaurant/tartare.jpg", name: mock.dishes[2], price: "$19" },
  ];
  return (
    <div className="rounded-[14px] bg-[#1c1d22] p-[6px] shadow-[0_40px_90px_-20px_rgb(0_0_0/0.75),0_0_0_1px_rgb(255_255_255/0.08)]">
      <div className="@container overflow-hidden rounded-[9px]" style={{ background: CHAR }}>
        {/* Browser chrome */}
        <div className="flex items-center gap-[1cqw] bg-[#26272d] px-[1.6cqw] py-[1.1cqw]">
          <span className="flex gap-[0.6cqw]">
            <i className="size-[1cqw] rounded-full bg-[#ff5f57]" />
            <i className="size-[1cqw] rounded-full bg-[#febc2e]" />
            <i className="size-[1cqw] rounded-full bg-[#28c840]" />
          </span>
          <span className="mx-auto rounded-full bg-[#34353c] px-[2.4cqw] py-[0.45cqw] text-[1.2cqw] text-white/70">
            serverlys.com/restaurant-websites/demo
          </span>
        </div>

        {/* Site */}
        <div className="relative aspect-[16/8.6]">
          <Image
            src="/restaurant/hero-chef.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 640px, 90vw"
            className="object-cover object-[60%_40%]"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(20_16_13/0.95)_0%,rgb(20_16_13/0.7)_45%,rgb(20_16_13/0.15)_100%)]" />
          <div className="relative flex h-full flex-col px-[3.6cqw] pt-[2.4cqw]">
            <div className="flex items-center justify-between">
              <span
                className={cn(lumbreSerif.className, "text-[2.6cqw] tracking-[0.18em]")}
                style={{ color: CREAM }}
              >
                LUMBRE
              </span>
              <span className="flex items-center gap-[2.4cqw] text-[1.25cqw] text-white/75">
                <span>{mock.menu}</span>
                <span>{mock.order}</span>
                <span
                  className="rounded-full px-[1.6cqw] py-[0.6cqw] font-semibold"
                  style={{ background: EMBER, color: CHAR }}
                >
                  {mock.reserve}
                </span>
              </span>
            </div>
            <div className="mt-auto mb-[3.4cqw] max-w-[56%]">
              <p className="text-[1.2cqw] tracking-[0.14em] uppercase" style={{ color: EMBER }}>
                {mock.tagline}
              </p>
              <p
                className={cn(lumbreSerif.className, "mt-[0.8cqw] text-[6cqw] leading-[0.95]")}
                style={{ color: CREAM }}
              >
                {mock.headline}
              </p>
              <div className="mt-[2cqw] flex gap-[1cqw] text-[1.3cqw] font-semibold">
                <span className="rounded-full px-[2cqw] py-[0.9cqw]" style={{ background: EMBER, color: CHAR }}>
                  {mock.order}
                </span>
                <span className="rounded-full px-[2cqw] py-[0.9cqw] text-white ring-1 ring-white/40">
                  {mock.reserve}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[1.6cqw] px-[3.6cqw] py-[2.4cqw]">
          {dishes.map((d) => (
            <div key={d.name} className="flex items-center gap-[1.2cqw]">
              <Thumb src={d.src} className="size-[5cqw] shrink-0 rounded-[0.8cqw]" />
              <span className="min-w-0">
                <span className="block truncate text-[1.35cqw] font-semibold" style={{ color: CREAM }}>
                  {d.name}
                </span>
                <span className="block text-[1.2cqw]" style={{ color: EMBER }}>
                  {d.price}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Phone showing the Lumbre menu with two items in the order. */
export function PhoneMock({ mock, categories }: { mock: Mock; categories: readonly string[] }) {
  const rows = [
    { src: "/restaurant/churrasco.jpg", name: mock.dishes[0], price: "$38.00", qty: 1 },
    { src: "/restaurant/tacos.jpg", name: "Tacos de asada", price: "$16.00", qty: 1 },
    { src: "/restaurant/chicken.jpg", name: mock.dishes[1], price: "$27.00", qty: 0 },
    { src: "/restaurant/salmon.jpg", name: "Salmón", price: "$31.00", qty: 0 },
    { src: "/restaurant/shrimp-rice.jpg", name: "Camarones", price: "$29.00", qty: 0 },
  ];
  return (
    <div className="rounded-[28px] bg-[#1c1d22] p-[5px] shadow-[0_30px_70px_-15px_rgb(0_0_0/0.8),0_0_0_1px_rgb(255_255_255/0.1)]">
      <div className="@container relative aspect-[9/19] overflow-hidden rounded-[23px]" style={{ background: CHAR }}>
        <div className="mx-auto mt-[3cqw] h-[5cqw] w-[30cqw] rounded-full bg-black" />
        <div className="flex items-center justify-between px-[6cqw] pt-[5cqw]">
          <span className={cn(lumbreSerif.className, "text-[7.5cqw] tracking-[0.16em]")} style={{ color: CREAM }}>
            LUMBRE
          </span>
          <span className="relative">
            <svg viewBox="0 0 24 24" className="size-[8cqw] text-white/85" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span
              className="absolute -top-[1.5cqw] -right-[2cqw] flex size-[5.5cqw] items-center justify-center rounded-full text-[3.4cqw] font-bold"
              style={{ background: EMBER, color: CHAR }}
            >
              2
            </span>
          </span>
        </div>
        <div className="mt-[5cqw] flex gap-[2cqw] overflow-hidden pl-[6cqw] text-[3.6cqw] whitespace-nowrap">
          {categories.slice(0, 3).map((c, i) => (
            <span
              key={c}
              className={cn("rounded-full px-[3.4cqw] py-[1.6cqw]", i === 1 ? "font-semibold" : "text-white/70 ring-1 ring-white/15")}
              style={i === 1 ? { background: CREAM, color: CHAR } : undefined}
            >
              {c}
            </span>
          ))}
        </div>
        <ul className="mt-[4cqw] flex flex-col gap-[3.4cqw] px-[6cqw]">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center gap-[3.4cqw]">
              <Thumb src={r.src} className="size-[16cqw] shrink-0 rounded-[3cqw]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[4.2cqw] font-semibold" style={{ color: CREAM }}>
                  {r.name}
                </span>
                <span className="mt-[0.6cqw] block text-[3.6cqw] text-white/60">{r.price}</span>
              </span>
              <span
                className="flex size-[8cqw] shrink-0 items-center justify-center rounded-full text-[4.4cqw] font-bold"
                style={r.qty ? { background: EMBER, color: CHAR } : { color: CREAM, boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.3)" }}
              >
                {r.qty ? "1" : "+"}
              </span>
            </li>
          ))}
        </ul>
        <div
          className="absolute inset-x-[5cqw] bottom-[6cqw] rounded-full py-[3.6cqw] text-center text-[4cqw] font-semibold"
          style={{ background: EMBER, color: CHAR }}
        >
          {mock.viewOrder}
        </div>
      </div>
    </div>
  );
}
