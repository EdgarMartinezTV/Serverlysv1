import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * /website-development product screens for the Features block — one per
 * stage of a project: the written scope, the staged copy under review, and
 * the deploy onto Serverlys servers. All for the site-wide demo client,
 * Hearth Bakery, so they read as one project. Fully populated on purpose: an
 * empty frame reads as "coming soon".
 *
 * Decorative: the feature copy beside each screen carries the meaning.
 */

function Window({
  url,
  children,
  className,
  dark = false,
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-2xl shadow-[0_24px_60px_-12px_rgb(0_0_0/0.35)]",
        dark
          ? "bg-[#0d1117] ring-1 ring-white/10"
          : "bg-white ring-1 ring-black/[0.07]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b px-4 py-2.5",
          dark ? "border-white/10 bg-white/[0.03]" : "border-black/[0.06] bg-[#f6f7f9]",
        )}
      >
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span
          className={cn(
            "mx-auto min-w-0 max-w-[75%] flex-1 truncate rounded-md px-3 py-1 text-center text-[11px]",
            dark
              ? "bg-black/40 text-white/55"
              : "bg-white text-[#5f6368] ring-1 ring-black/[0.06]",
          )}
        >
          {url}
        </span>
        <span className="w-[46px]" />
      </div>
      {children}
    </div>
  );
}

/* ── 1. Written scope with a fixed price ────────────────────────────────── */

export function ScopeMock({ className }: { className?: string }) {
  const lines = [
    ["Online cake orders with 48-hour lead time", "6 h"],
    ["Pickup-slot calendar, closed Mondays", "4 h"],
    ["Stripe checkout with deposit option", "3 h"],
    ["Order emails to customer and kitchen", "2 h"],
    ["Staged review and two rounds of changes", "3 h"],
  ];
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
            Project scope · v2
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#202124]">
            Hearth Bakery · Cake orders
          </p>
        </div>
        <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
          Awaiting approval
        </span>
      </div>
      <table className="mt-3 w-full text-[11.5px]">
        <tbody>
          {lines.map(([item, hrs]) => (
            <tr key={item} className="border-b border-black/[0.05]">
              <td className="py-2 pr-3 text-[#3c4043]">
                <span className="mr-2 inline-block size-1.5 rounded-full bg-primary align-middle" />
                {item}
              </td>
              <td className="tabular py-2 text-right text-[#5f6368]">{hrs}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-[10.5px] leading-snug text-[#5f6368]">
          <p>18 hours at $129/hr</p>
          <p>Runs on your Serverlys hosting plan</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#5f6368]">Fixed price</p>
          <p className="tabular text-[22px] leading-none font-semibold text-[#202124]">
            $2,322
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <span className="flex-1 rounded-md bg-primary py-2 text-center text-[11.5px] font-semibold text-white">
          Approve scope
        </span>
        <span className="rounded-md px-3 py-2 text-[11.5px] font-semibold text-[#3c4043] ring-1 ring-black/[0.1]">
          Ask a question
        </span>
      </div>
    </div>
  );
}

/* ── 2. Staged copy under review, with comments ─────────────────────────── */

function Pin({ n, className }: { n: number; className?: string }) {
  return (
    <span
      className={cn(
        "absolute flex size-6 items-center justify-center rounded-full rounded-bl-none bg-primary text-[10px] font-bold text-white shadow-lg ring-2 ring-white",
        className,
      )}
    >
      {n}
    </span>
  );
}

export function StagingMock({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <Window url="staging.hearthbakery.com/order">
        <div className="flex items-center justify-between bg-amber-400 px-3 py-1 text-[10px] font-semibold text-amber-950">
          <span>STAGING · not visible to customers</span>
          <span>Build #14</span>
        </div>
        <div className="bg-[#fbf8f3]">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="font-display text-[12px] font-bold tracking-[0.18em] text-[#3b2a1a] uppercase">
              Hearth
            </span>
            <span className="flex gap-3 text-[10px] text-[#6d5d4b]">
              <span>Breads</span>
              <span className="font-semibold text-[#3b2a1a]">Order a cake</span>
              <span>Visit</span>
            </span>
          </div>
          <div className="grid grid-cols-[1fr_1.1fr] gap-3 px-4 pb-4">
            <div className="relative h-[150px] overflow-hidden rounded-lg">
              <Image
                src="/mock/bread.jpg"
                alt=""
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
            <div className="relative text-[#3b2a1a]">
              <p className="text-[14px] leading-tight font-semibold">
                Custom birthday cake
              </p>
              <p className="mt-0.5 text-[10.5px] text-[#6d5d4b]">
                From $45 · 48 hours’ notice
              </p>
              <p className="mt-2.5 text-[9.5px] font-semibold tracking-[0.08em] text-[#6d5d4b] uppercase">
                Pickup day
              </p>
              <div className="mt-1 grid grid-cols-5 gap-1 text-center text-[10px]">
                {["Tue 14", "Wed 15", "Thu 16", "Fri 17", "Sat 18"].map((d, i) => (
                  <span
                    key={d}
                    className={cn(
                      "rounded-md py-1",
                      i === 3
                        ? "bg-[#3b2a1a] text-white"
                        : i === 0
                          ? "text-[#b8ab99] line-through"
                          : "bg-white ring-1 ring-black/[0.08]",
                    )}
                  >
                    {d}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 text-[9.5px] font-semibold tracking-[0.08em] text-[#6d5d4b] uppercase">
                Size
              </p>
              <div className="mt-1 flex gap-1 text-[10px]">
                {["6 in · $45", "8 in · $68", "10 in · $95"].map((s, i) => (
                  <span
                    key={s}
                    className={cn(
                      "rounded-md px-2 py-1",
                      i === 1
                        ? "bg-[#3b2a1a] text-white"
                        : "bg-white ring-1 ring-black/[0.08]",
                    )}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span className="mt-3 block rounded-md bg-[#3b2a1a] py-1.5 text-center text-[11px] font-semibold text-white">
                Pay $20 deposit
              </span>
              <Pin n={2} className="-top-2 right-1" />
            </div>
          </div>
          <Pin n={1} className="top-[86px] left-[30%]" />
        </div>
      </Window>

      {/* Review thread */}
      <div className="absolute -right-3 -bottom-10 hidden w-[230px] rounded-xl bg-white p-3 shadow-[0_18px_40px_-8px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.06] sm:block lg:-right-8">
        <p className="text-[10px] font-semibold tracking-[0.08em] text-[#80868b] uppercase">
          Review · 2 comments
        </p>
        {[
          [
            "M",
            "#7b1fa2",
            "Maya (Hearth)",
            "Can Tuesday show as sold out instead of crossed off?",
          ],
          [
            "S",
            "#0000ff",
            "Serverlys",
            "Done in build #15. Deposit is now $20 on every size.",
          ],
        ].map(([l, c, who, text]) => (
          <div key={who} className="mt-2 flex gap-2">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
              style={{ background: c }}
            >
              {l}
            </span>
            <p className="text-[10.5px] leading-snug text-[#3c4043]">
              <span className="font-semibold text-[#202124]">{who}</span>
              <br />
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 3. Deploy onto Serverlys servers ───────────────────────────────────── */

export function DeployMock({ className }: { className?: string }) {
  const log = [
    ["15:02:11", "Approved by Maya Ortiz", "text-emerald-300"],
    ["15:02:14", "Snapshot of live site saved", "text-white/70"],
    ["15:02:19", "Deploying build #15 → hearthbakery.com", "text-white/70"],
    ["15:02:41", "Database migration 0007_cake_orders ✓", "text-white/70"],
    ["15:02:44", "SSL certificate valid · 84 days left", "text-white/70"],
    ["15:02:47", "Health check 200 OK · 312 ms", "text-white/70"],
    ["15:02:47", "Live. Rollback kept for 30 days", "text-emerald-300"],
  ];
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <Window url="deploy · hearthbakery.com" dark>
        <div className="p-4 font-mono text-[10.5px] leading-[1.7]">
          {log.map(([t, line, c], i) => (
            <p key={i} className="flex gap-3">
              <span className="text-white/35">{t}</span>
              <span className={c}>{line}</span>
            </p>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-white/10 p-4">
          {[
            ["Response time", "312 ms"],
            ["Backups", "Daily · 30 kept"],
            ["Orders today", "17"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-lg bg-white/[0.04] p-2.5 ring-1 ring-white/[0.06]"
            >
              <p className="text-[9.5px] text-white/50">{k}</p>
              <p className="mt-0.5 text-[13px] font-semibold text-white">{v}</p>
            </div>
          ))}
        </div>
      </Window>
      <div className="absolute -bottom-6 -left-3 hidden items-center gap-2.5 rounded-xl bg-white py-2 pr-3.5 pl-2 shadow-[0_18px_40px_-8px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.06] sm:flex lg:-left-8">
        <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className="leading-tight">
          <span className="block text-[11px] font-semibold text-[#202124]">
            New order · $68
          </span>
          <span className="block text-[10px] text-[#5f6368]">
            8 in birthday cake · pickup Fri
          </span>
        </span>
      </div>
    </div>
  );
}
