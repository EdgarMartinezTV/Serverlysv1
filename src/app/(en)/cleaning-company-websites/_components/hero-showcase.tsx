import Image from "next/image";
import { StageParallax } from "./stage-parallax";
import { cn } from "@/lib/utils";
import type { CleaningCopy } from "../_i18n";

type Mock = CleaningCopy["hero"]["mock"];
type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

const TEAL = "#0f766e";

/**
 * The hero's product showcase: Brisa Clean Co. (fictional) on a laptop and a
 * phone, with the quote-request story looping in CSS (globals.css, "cl-").
 *
 * A SERVER component: React never hydrates this markup. The only script is
 * StageParallax (stage-parallax.tsx), which writes --px/--py/--sy on the
 * stage; each layer moves by its own --depth. Decorative: aria-hidden, no
 * focusable content.
 */
export function HeroShowcase({ mock }: { mock: Mock }) {
  const chip = (label: string, icon: React.ReactNode, cls: string, vars: Vars) => (
    <div className={cn("cl-layer absolute z-30", cls)} style={vars}>
      <div className="cl-pop" style={vars}>
        <div className="cl-float flex items-center gap-2 rounded-full bg-white/90 py-1.5 pr-3.5 pl-1.5 text-[clamp(10px,1.1cqw,13px)] font-semibold whitespace-nowrap text-[#0b1530] shadow-[0_14px_34px_-14px_rgb(11_21_48/0.45)] ring-1 ring-black/5 backdrop-blur" style={vars}>
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-white">{icon}</span>
          {label}
        </div>
      </div>
    </div>
  );

  const field = (label: string, value: string, cls: string) => (
    <div className="flex h-[7.4cqw] items-center justify-between rounded-[1.6cqw] bg-[#f3f6f8] px-[2.6cqw]">
      <span className="text-[2.5cqw] text-[#5b6472]">{label}</span>
      <span className={cn("text-[2.7cqw] font-semibold text-[#0b1530]", cls)}>{value}</span>
    </div>
  );

  return (
    <div id="cl-stage" aria-hidden="true" className="cl-stage relative mx-auto aspect-[1.18] w-full max-w-[680px] select-none [container-type:inline-size]">
      {/* Laptop */}
      <div className="cl-layer absolute top-[6%] left-0 w-[84%]" style={{ "--depth": 10, "--lift": 18 } as Vars}>
        <div className="cl-rise [--d:120ms]">
          <div className="[transform:perspective(1600px)_rotateY(-9deg)_rotateX(5deg)] [transform-origin:left_center]">
            <div className="rounded-t-[2.2cqw] bg-[#1d2330] p-[1.1cqw] shadow-[0_40px_80px_-30px_rgb(11_21_48/0.55)]">
              <div className="overflow-hidden rounded-[0.9cqw] bg-white">
                <div className="flex items-center justify-between px-[2.4cqw] py-[1.4cqw]">
                  <span className="flex items-center gap-[0.8cqw] text-[1.9cqw] font-bold text-[#0b1530]">
                    <span className="size-[2.2cqw] rounded-full" style={{ background: TEAL }} />
                    {mock.brand}
                  </span>
                  <span className="flex items-center gap-[2cqw] text-[1.45cqw] text-[#5b6472]">
                    {mock.nav.map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                    <span className="rounded-full px-[1.6cqw] py-[0.6cqw] font-semibold text-white" style={{ background: TEAL }}>
                      {mock.cta}
                    </span>
                  </span>
                </div>
                <div className="relative aspect-[16/7.4]">
                  <Image src="/cleaning/kitchen-bright.jpg" alt="" fill sizes="(min-width: 1024px) 560px, 80vw" loading="eager" className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(255_255_255/0.95)_0%,rgb(255_255_255/0.8)_45%,rgb(255_255_255/0)_75%)]" />
                  <div className="absolute top-1/2 left-[4%] max-w-[50%] -translate-y-1/2">
                    <p className="text-[3.6cqw] leading-[1.05] font-bold tracking-[-0.02em] text-[#0b1530]">{mock.headline}</p>
                    <p className="mt-[1cqw] text-[1.6cqw] text-[#3b4452]">{mock.sub}</p>
                    <span className="mt-[1.6cqw] inline-block rounded-full px-[2cqw] py-[0.9cqw] text-[1.5cqw] font-semibold text-white" style={{ background: TEAL }}>
                      {mock.cta}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-[1.2cqw] p-[1.6cqw]">
                  {["/cleaning/living-bright.jpg", "/cleaning/office-open.jpg", "/cleaning/bedroom-crisp.jpg"].map((src) => (
                    <span key={src} className="relative aspect-[16/10] overflow-hidden rounded-[0.8cqw]">
                      <Image src={src} alt="" fill sizes="160px" className="object-cover" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-auto h-[1.6cqw] w-[108%] -translate-x-[3.7%] rounded-b-[1.4cqw] bg-[linear-gradient(180deg,#cfd5df,#9aa3b2)]" />
          </div>
          {/* Owner's notification on the laptop */}
          <div className="cl-notif absolute top-[16%] right-[3%] z-10 flex w-[42%] items-center gap-[1.2cqw] rounded-[1.4cqw] bg-white p-[1.4cqw] shadow-[0_18px_40px_-16px_rgb(11_21_48/0.5)] ring-1 ring-black/5">
            <span className="flex size-[4.4cqw] shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
              <svg viewBox="0 0 20 20" className="size-[2.4cqw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10h12M10 4v12" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[1.75cqw] font-semibold text-[#0b1530]">{mock.notif}</span>
              <span className="block truncate text-[1.5cqw] text-[#5b6472]">{mock.notifDetail}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="cl-layer absolute right-[2%] bottom-0 z-20 w-[36%]" style={{ "--depth": 22, "--lift": -26 } as Vars}>
        <div className="cl-rise [--d:320ms]">
          <div className="rounded-[5.4cqw] bg-[#0b1530] p-[1.3cqw] shadow-[0_40px_80px_-24px_rgb(11_21_48/0.6)] [container-type:inline-size]">
            <div className="relative overflow-hidden rounded-[4.4cqw] bg-white px-[6cqw] pt-[10cqw] pb-[7cqw]">
              <div className="absolute top-[2.6cqw] left-1/2 h-[4.4cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-[#0b1530]" />
              <p className="flex items-center gap-[2cqw] text-[5cqw] font-bold text-[#0b1530]">
                <span className="size-[4.6cqw] rounded-full" style={{ background: TEAL }} />
                {mock.brand}
              </p>
              <p className="mt-[5cqw] text-[6.6cqw] font-bold tracking-[-0.02em] text-[#0b1530]">{mock.quoteTitle}</p>
              <div className="relative mt-[4cqw] flex flex-col gap-[2.6cqw] [container-type:normal]">
                {field(mock.bedrooms, mock.bedroomsValue, "cl-v1")}
                {field(mock.baths, mock.bathsValue, "cl-v2")}
                {field(mock.service, mock.serviceValue, "cl-v3")}
                {field(mock.zip, mock.zipValue, "cl-v4")}
                {/* The tapping finger: one row pitch (7.4 + 2.6) tall, moved row by row. */}
                <span className="cl-finger pointer-events-none absolute top-0 right-[6%] flex h-[10cqw] w-[10cqw] items-center justify-center">
                  <span className="size-[7.5cqw] rounded-full bg-[#0b1530]/25 ring-2 ring-white" />
                </span>
              </div>
              <div className="cl-est mt-[4cqw] flex items-baseline justify-between">
                <span className="text-[5cqw] text-[#5b6472]">{mock.estimateLabel}</span>
                <span className="text-[7.4cqw] font-bold" style={{ color: TEAL }}>
                  {mock.estimate}
                </span>
              </div>
              <div className="relative mt-[4cqw]">
                <span className="cl-press flex h-[17cqw] items-center justify-center rounded-full text-[5.4cqw] font-semibold text-white" style={{ background: TEAL }}>
                  {mock.button}
                </span>
                <span className="cl-tap absolute top-1/2 left-1/2 -mt-[9cqw] -ml-[9cqw] size-[18cqw] rounded-full bg-white/60" />
              </div>
              <p className="mt-[3cqw] text-center text-[3.6cqw] text-[#5b6472]">{mock.sample}</p>
              {/* Confirmation */}
              <div className="cl-toast absolute inset-x-[4cqw] bottom-[4cqw] rounded-[4cqw] bg-[#0b1530] p-[5cqw] text-white shadow-2xl">
                <p className="flex items-center gap-[2.4cqw] text-[5.4cqw] font-semibold">
                  <span className="flex size-[8cqw] items-center justify-center rounded-full bg-[#34d399] text-[#0b1530]">
                    <svg viewBox="0 0 20 20" className="size-[5cqw]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
                    </svg>
                  </span>
                  {mock.toastTitle}
                </p>
                <p className="mt-[1.6cqw] text-[4.4cqw] text-white/75">{mock.toastBody}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {chip(
        mock.chips.mobile,
        <svg viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="6" y="2.5" width="8" height="15" rx="2" />
          <path d="M9 15h2" strokeLinecap="round" />
        </svg>,
        "top-[0%] left-[6%]",
        { "--depth": 30, "--d": "900ms", "--t": "6.5s" } as Vars,
      )}
      {chip(
        mock.chips.seo,
        <svg viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="9" cy="9" r="5" />
          <path d="m13 13 4 4" />
        </svg>,
        "top-[2%] right-[4%]",
        { "--depth": -24, "--d": "1050ms", "--t": "7.2s" } as Vars,
      )}
      {chip(
        mock.chips.booking,
        <svg viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
          <path d="M3 8.5h14M7 2.5v3M13 2.5v3" />
        </svg>,
        "bottom-[12%] left-[-2%]",
        { "--depth": -34, "--d": "1200ms", "--t": "5.8s" } as Vars,
      )}
      {chip(
        mock.chips.leads,
        <svg viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 14 8 9l3 3 6-6M13 6h4v4" />
        </svg>,
        "bottom-[40%] left-[36%]",
        { "--depth": 40, "--d": "1350ms", "--t": "6.8s" } as Vars,
      )}
      <StageParallax target="cl-stage" />
    </div>
  );
}
