import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * /website-design product screens for the Features block — one per stage:
 * the style guide, the built homepage (desktop and phone), and the analytics
 * that go live at launch. All for one demo client, Ridgeline Roofing, so they
 * read as one project; the photo inside the homepage is a real one
 * (public/mock/CREDITS.md), the UI around it is drawn in code.
 *
 * Decorative: the feature copy beside each screen carries the meaning.
 */

const BRAND = "#c2410c"; // Ridgeline's orange
const INKY = "#1c1917";

function Window({
  url,
  children,
  className,
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.07]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f6f7f9] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto min-w-0 max-w-[75%] flex-1 truncate rounded-md bg-white px-3 py-1 text-center text-[11px] text-[#5f6368] ring-1 ring-black/[0.06]">
          {url}
        </span>
        <span className="w-[46px]" />
      </div>
      {children}
    </div>
  );
}

/* ── 1. Web style guide ─────────────────────────────────────────────────── */

export function StyleGuideMock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-white p-5 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.45)]",
        className,
      )}
    >
      <div className="flex items-start justify-between border-b border-black/[0.07] pb-3">
        <div>
          <p className="text-[9.5px] font-semibold tracking-[0.14em] text-primary uppercase">
            Web style guide · v1
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#202124]">
            Ridgeline Roofing &amp; Repair
          </p>
        </div>
        <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
          Approved
        </span>
      </div>

      <p className="mt-3 text-[9.5px] font-semibold tracking-[0.1em] text-[#80868b] uppercase">
        Colour
      </p>
      <div className="mt-1.5 grid grid-cols-5 gap-1.5">
        {[
          [BRAND, "Ember", "#C2410C"],
          [INKY, "Slate", "#1C1917"],
          ["#78716c", "Stone", "#78716C"],
          ["#f5f5f4", "Chalk", "#F5F5F4"],
          ["#0f766e", "Pine", "#0F766E"],
        ].map(([c, n, hex]) => (
          <div key={n}>
            <span
              className="block h-9 rounded-md ring-1 ring-black/[0.06]"
              style={{ background: c }}
            />
            <p className="mt-1 text-[9.5px] font-semibold text-[#202124]">{n}</p>
            <p className="font-mono text-[8.5px] text-[#80868b]">{hex}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[9.5px] font-semibold tracking-[0.1em] text-[#80868b] uppercase">
        Type
      </p>
      <div className="mt-1.5 rounded-lg bg-[#fafaf9] p-3">
        <p
          className="font-display text-[22px] leading-none font-bold tracking-[-0.02em]"
          style={{ color: INKY }}
        >
          Roofs done right, first time.
        </p>
        <p className="mt-1.5 text-[11px] leading-snug text-[#57534e]">
          Body · 16/26 · Licensed and insured roofing for homes across Travis County
          since 2009.
        </p>
      </div>

      <p className="mt-3 text-[9.5px] font-semibold tracking-[0.1em] text-[#80868b] uppercase">
        Buttons
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <span
          className="rounded-md px-3 py-1.5 text-[11px] font-semibold text-white"
          style={{ background: BRAND }}
        >
          Get a free quote
        </span>
        <span
          className="rounded-md px-3 py-1.5 text-[11px] font-semibold ring-1"
          style={{ color: INKY, borderColor: INKY }}
        >
          Call (512) 555-0148
        </span>
        <span
          className="text-[11px] font-semibold underline underline-offset-2"
          style={{ color: BRAND }}
        >
          See our work →
        </span>
      </div>
    </div>
  );
}

/* ── 2. Homepage on desktop and phone ───────────────────────────────────── */

export function HomepageMock({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative pb-10", className)}>
      <Window url="ridgelineroofing.com">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5">
          <span
            className="text-[12px] font-bold tracking-[0.06em]"
            style={{ color: INKY }}
          >
            RIDGELINE<span style={{ color: BRAND }}>.</span>
          </span>
          <span className="hidden gap-3 text-[10px] text-[#57534e] sm:flex">
            <span>Roof repair</span>
            <span>Replacement</span>
            <span>Gutters</span>
            <span>Reviews</span>
          </span>
          <span
            className="rounded px-2 py-1 text-[10px] font-semibold text-white"
            style={{ background: BRAND }}
          >
            Free quote
          </span>
        </div>
        <div className="relative h-[190px]">
          <Image
            src="/mock/design-leads.jpg"
            alt=""
            fill
            sizes="520px"
            className="object-cover object-[50%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <div className="absolute inset-y-0 left-4 flex max-w-[60%] flex-col justify-center text-white">
            <p className="text-[9px] font-semibold tracking-[0.14em] uppercase opacity-85">
              Austin · Licensed &amp; insured
            </p>
            <p className="mt-1 text-[20px] leading-[1.05] font-bold tracking-[-0.02em]">
              Roofs done right, first time.
            </p>
            <div className="mt-2.5 flex gap-1.5">
              <span
                className="rounded px-2 py-1 text-[10px] font-semibold"
                style={{ background: BRAND }}
              >
                Get a free quote
              </span>
              <span className="rounded bg-white/15 px-2 py-1 text-[10px] font-semibold ring-1 ring-white/40">
                (512) 555-0148
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          {[
            ["Roof repair", "Leaks and storm damage, same week"],
            ["Replacement", "Shingle, metal and tile"],
            ["Gutters", "Seamless, cleaned and guarded"],
          ].map(([t, d]) => (
            <div
              key={t}
              className="rounded-lg bg-[#fafaf9] p-2.5 ring-1 ring-black/[0.05]"
            >
              <p className="text-[11px] font-semibold" style={{ color: INKY }}>
                {t}
              </p>
              <p className="mt-0.5 text-[9.5px] leading-snug text-[#78716c]">{d}</p>
            </div>
          ))}
        </div>
      </Window>

      {/* Phone */}
      <div className="absolute right-2 bottom-0 hidden w-[132px] overflow-hidden rounded-[22px] bg-white p-1.5 shadow-[0_24px_50px_-10px_rgb(0_0_0/0.5)] ring-1 ring-black/10 sm:block lg:-right-6">
        <div className="overflow-hidden rounded-[17px] bg-white">
          <div className="flex items-center justify-between px-2.5 py-1.5">
            <span className="text-[8.5px] font-bold" style={{ color: INKY }}>
              RIDGELINE<span style={{ color: BRAND }}>.</span>
            </span>
            <span className="h-[2px] w-3 rounded bg-[#1c1917] shadow-[0_3px_0_#1c1917]" />
          </div>
          <div className="relative h-[110px]">
            <Image
              src="/mock/design-leads.jpg"
              alt=""
              fill
              sizes="140px"
              className="object-cover object-[55%_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
            <p className="absolute inset-x-2 bottom-2 text-[11px] leading-[1.05] font-bold text-white">
              Roofs done right, first time.
            </p>
          </div>
          <div className="space-y-1 p-2">
            <span
              className="block rounded py-1 text-center text-[8.5px] font-semibold text-white"
              style={{ background: BRAND }}
            >
              Get a free quote
            </span>
            <span
              className="block rounded py-1 text-center text-[8.5px] font-semibold ring-1 ring-black/15"
              style={{ color: INKY }}
            >
              Tap to call
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 3. First month after launch ────────────────────────────────────────── */

export function LaunchMock({ className }: { className?: string }) {
  const bars = [12, 18, 15, 22, 27, 25, 31, 36, 34, 41, 39, 46, 52, 49];
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <Window url="analytics · ridgelineroofing.com">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-[#202124]">First 30 days</p>
            <span className="rounded bg-[#f1f3f4] px-1.5 py-0.5 text-[10px] text-[#5f6368]">
              Since launch
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ["Quote requests", "38"],
              ["Calls from site", "54"],
              ["Mobile visitors", "71%"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-[#f8f9fa] p-2.5">
                <p className="text-[9.5px] text-[#5f6368]">{k}</p>
                <p className="tabular text-[18px] font-semibold text-[#202124]">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-20 items-end gap-1">
            {bars.map((b, i) => (
              <span
                key={i}
                className="flex-1 rounded-t"
                style={{
                  height: `${(b / 52) * 100}%`,
                  background: i === bars.length - 1 ? BRAND : "#fed7aa",
                }}
              />
            ))}
          </div>
          <p className="mt-1 flex justify-between text-[9px] text-[#80868b]">
            <span>Week 1</span>
            <span>Week 2</span>
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              ["Performance", 98],
              ["Accessibility", 100],
              ["Best practices", 100],
              ["SEO", 100],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col items-center gap-1">
                <span className="flex size-10 items-center justify-center rounded-full text-[12px] font-semibold text-emerald-700 ring-[3px] ring-emerald-500">
                  {v}
                </span>
                <span className="text-center text-[8.5px] leading-tight text-[#5f6368]">
                  {k}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Window>
      <div className="absolute -top-5 -right-2 hidden items-center gap-2.5 rounded-xl bg-white py-2 pr-3.5 pl-2 shadow-[0_18px_40px_-8px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.06] sm:flex lg:-right-6">
        <span
          className="flex size-8 items-center justify-center rounded-lg text-white"
          style={{ background: BRAND }}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 5h16v11H9l-5 4V5Z" />
          </svg>
        </span>
        <span className="leading-tight">
          <span className="block text-[11px] font-semibold text-[#202124]">
            New quote request
          </span>
          <span className="block text-[10px] text-[#5f6368]">
            Roof repair · Round Rock · 2m
          </span>
        </span>
      </div>
    </div>
  );
}
