import Image from "next/image";
import { cn } from "@/lib/utils";
import { BrandIcon } from "@/components/retell/brands";

/**
 * /migrations product screens for the Features block — one move, start to
 * finish, for a demo client, Juniper & Pine (a home-goods shop moving its
 * WooCommerce store): the copy in progress, the staged copy being checked,
 * and the switch-over with the speed difference. Fully populated on purpose.
 *
 * Decorative: the feature copy beside each screen carries the meaning.
 */

const SITE = "juniperandpine.com";

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-white p-4 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.45)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5 text-emerald-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

/* ── 1. The move, in progress ───────────────────────────────────────────── */

export function MoveProgressMock({ className }: { className?: string }) {
  const steps = [
    { label: "Files", detail: "18,204 files · 3.1 GB", pct: 100 },
    { label: "Database", detail: "wp_juniper · 412 MB", pct: 100 },
    { label: "Email", detail: "6 mailboxes · 9,870 messages", pct: 72 },
    { label: "SSL certificate", detail: "Issues when DNS switches", pct: 0 },
  ];
  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b border-black/[0.07] pb-2.5">
        <div className="flex items-center gap-2">
          <BrandIcon slug="woocommerce" className="size-6" />
          <div>
            <p className="text-[13px] font-semibold text-[#202124]">
              Migration · {SITE}
            </p>
            <p className="text-[10px] text-[#5f6368]">
              From old host → Serverlys Turbo Cloud
            </p>
          </div>
        </div>
        <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-sky-700">
          Copying
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {steps.map((s) => (
          <li key={s.label}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-medium text-[#202124]">
                {s.pct === 100 ? (
                  <Check />
                ) : (
                  <span className="size-3.5 rounded-full ring-2 ring-[#dadce0]" />
                )}
                {s.label}
              </span>
              <span className="tabular text-[#5f6368]">
                {s.pct === 0 ? "Waiting" : `${s.pct}%`}
              </span>
            </div>
            <p className="mt-0.5 ml-5 text-[9.5px] text-[#80868b]">{s.detail}</p>
            <div className="mt-1 ml-5 h-1.5 overflow-hidden rounded-full bg-[#eceef1]">
              <div
                className={cn(
                  "h-full rounded-full",
                  s.pct === 100 ? "bg-emerald-500" : "bg-primary",
                )}
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 p-2 text-[10.5px] font-medium text-emerald-800">
        <span className="size-2 rounded-full bg-emerald-500" />
        Your live site is still on the old host and taking orders.
      </p>
    </Card>
  );
}

/* ── 2. The staged copy, checked before anything switches ───────────────── */

export function StagingCheckMock({ className }: { className?: string }) {
  const checks = [
    "Home, shop and 214 product pages load",
    "Test order placed and refunded",
    "Contact form delivers to inbox",
    "Logins and customer accounts work",
    "Redirects and image paths intact",
  ];
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.07]">
        <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f6f7f9] px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="mx-auto truncate rounded-md bg-white px-3 py-1 text-[11px] text-[#5f6368] ring-1 ring-black/[0.06]">
            staging-juniperandpine.serverlys.site
          </span>
        </div>
        <div className="bg-amber-400 px-3 py-1 text-[10px] font-semibold text-amber-950">
          STAGED COPY · check it before we switch
        </div>
        <div className="bg-[#f7f5f0]">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="font-display text-[12px] font-bold tracking-[0.16em] text-[#2f3a2f] uppercase">
              Juniper &amp; Pine
            </span>
            <span className="flex gap-3 text-[10px] text-[#55604f]">
              <span>Shop</span>
              <span>Candles</span>
              <span>Linen</span>
              <span className="font-semibold">Cart (1)</span>
            </span>
          </div>
          <div className="relative h-[130px]">
            <Image
              src="/mock/sofa.jpg"
              alt=""
              fill
              sizes="520px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
            <div className="absolute inset-y-0 left-4 flex flex-col justify-center text-white">
              <p className="text-[18px] leading-tight font-semibold">
                Slow living,
                <br />
                made at home.
              </p>
              <span className="mt-2 w-max rounded bg-white px-2 py-1 text-[10px] font-semibold text-[#2f3a2f]">
                Shop the autumn edit
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            {[
              ["chair", "Oak lounge chair", "$420"],
              ["mug", "Stoneware mug", "$28"],
              ["bottle", "Amber diffuser", "$36"],
            ].map(([src, n, p]) => (
              <div key={n}>
                <div className="relative aspect-square overflow-hidden rounded-md">
                  <Image
                    src={`/mock/${src}.jpg`}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-1 truncate text-[10px] text-[#2f3a2f]">{n}</p>
                <p className="text-[10px] font-semibold text-[#2f3a2f]">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -right-3 -bottom-10 hidden w-[230px] rounded-xl bg-white p-3 shadow-[0_18px_40px_-8px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.06] sm:block lg:-right-8">
        <p className="text-[10px] font-semibold tracking-[0.08em] text-[#80868b] uppercase">
          Pre-switch checks
        </p>
        <ul className="mt-1.5 space-y-1">
          {checks.map((c) => (
            <li
              key={c}
              className="flex items-start gap-1.5 text-[10.5px] leading-snug text-[#3c4043]"
            >
              <Check />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── 3. The switch, and what changed ────────────────────────────────────── */

export function CutoverMock({ className }: { className?: string }) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between border-b border-black/[0.07] pb-3">
        <div>
          <p className="text-[9.5px] font-semibold tracking-[0.14em] text-primary uppercase">
            Switched · Tue 6:00 AM
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#202124]">
            {SITE} is on Serverlys
          </p>
        </div>
        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-700">
          0 min downtime
        </span>
      </div>
      <div className="mt-3 rounded-lg bg-[#f8f9fa] p-3 font-mono text-[10px] leading-relaxed text-[#3c4043]">
        <p>
          <span className="text-[#80868b]">A record</span> 198.51.100.24 →{" "}
          <span className="font-semibold text-primary">203.0.113.40</span>
        </p>
        <p>
          <span className="text-[#80868b]">MX</span> → Serverlys mail · no messages lost
        </p>
        <p>
          <span className="text-[#80868b]">SSL</span> issued · valid 90 days ✓
        </p>
      </div>
      <p className="mt-3 text-[9.5px] font-semibold tracking-[0.08em] text-[#80868b] uppercase">
        Page load, mobile
      </p>
      <div className="mt-1.5 space-y-2">
        {[
          ["Old host", 4.1, "bg-rose-400"],
          ["Serverlys", 1.3, "bg-emerald-500"],
        ].map(([k, v, c]) => (
          <div key={k as string} className="flex items-center gap-2">
            <span className="w-16 text-[10.5px] text-[#5f6368]">{k}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eceef1]">
              <div
                className={cn("h-full rounded-full", c as string)}
                style={{ width: `${((v as number) / 4.5) * 100}%` }}
              />
            </div>
            <span className="tabular w-9 text-right text-[11px] font-semibold text-[#202124]">
              {v}s
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10.5px] leading-snug text-[#3c4043]">
        Your old hosting stays exactly as it was until you choose to cancel it.
      </p>
    </Card>
  );
}
