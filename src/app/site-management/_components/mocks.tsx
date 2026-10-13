import Image from "next/image";
import { cn } from "@/lib/utils";
import { BrandIcon } from "@/components/retell/brands";

/**
 * /site-management product screens for the Features block — one week of
 * ServerCare on a demo client, Bright Smile Dental: updates applied, the
 * site watched, a content change done, and the report that says so. Fully
 * populated on purpose: an empty frame reads as "coming soon".
 *
 * Decorative: the feature copy beside each screen carries the meaning.
 */

const SITE = "brightsmiledental.com";

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

function Pill({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "info";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-semibold",
        tone === "ok" && "bg-emerald-50 text-emerald-700",
        tone === "warn" && "bg-amber-50 text-amber-700",
        tone === "info" && "bg-sky-50 text-sky-700",
      )}
    >
      {children}
    </span>
  );
}

/* ── 1. Updates applied ─────────────────────────────────────────────────── */

export function UpdatesMock({ className }: { className?: string }) {
  const rows = [
    ["WordPress core", "6.6.2 → 6.6.3", "ok", "Updated"],
    ["WooCommerce", "9.3.1 → 9.3.3", "ok", "Updated"],
    ["Yoast SEO", "23.5 → 23.6", "ok", "Updated"],
    ["Contact Form 7", "5.9.8 → 6.0", "warn", "Held: testing"],
    ["Astra theme", "4.8.1 → 4.8.3", "ok", "Updated"],
    ["Wordfence", "7.11.6 → 7.11.7", "ok", "Updated"],
  ] as const;
  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b border-black/[0.07] pb-2.5">
        <div className="flex items-center gap-2">
          <BrandIcon slug="wordpress" className="size-5" />
          <div>
            <p className="text-[13px] font-semibold text-[#202124]">
              Updates · this week
            </p>
            <p className="text-[10px] text-[#5f6368]">{SITE} · backup taken first</p>
          </div>
        </div>
        <Pill tone="ok">5 of 6 applied</Pill>
      </div>
      <ul className="mt-1">
        {rows.map(([name, ver, tone, label]) => (
          <li
            key={name}
            className="flex items-center gap-3 border-b border-black/[0.04] py-2 last:border-0"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11.5px] font-medium text-[#202124]">
                {name}
              </span>
              <span className="block font-mono text-[9.5px] text-[#80868b]">{ver}</span>
            </span>
            <Pill tone={tone}>{label}</Pill>
          </li>
        ))}
      </ul>
      <p className="mt-2 rounded-lg bg-amber-50/70 p-2 text-[10.5px] leading-snug text-amber-900">
        Contact Form 7 6.0 changes how forms send. Held until we have checked your
        appointment form works on it.
      </p>
    </Card>
  );
}

/* ── 2. Watched: uptime, security, speed ────────────────────────────────── */

export function MonitorMock({ className }: { className?: string }) {
  const days = Array.from({ length: 30 }, (_, i) => (i === 17 ? "warn" : "ok"));
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-[#202124]">{SITE}</p>
          <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-700">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-emerald-500" />
            </span>
            Online · 214 ms
          </span>
        </div>
        <p className="mt-3 text-[9.5px] font-semibold tracking-[0.08em] text-[#80868b] uppercase">
          Uptime · last 30 days
        </p>
        <div className="mt-1.5 flex gap-[3px]">
          {days.map((d, i) => (
            <span
              key={i}
              className={cn(
                "h-7 flex-1 rounded-[2px]",
                d === "ok" ? "bg-emerald-400" : "bg-amber-400",
              )}
            />
          ))}
        </div>
        <p className="mt-1 flex justify-between text-[9px] text-[#80868b]">
          <span>Sep 14</span>
          <span>Oct 1 · 4 min outage, alert sent</span>
          <span>Today</span>
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["Malware scan", "Clean", "ok"],
            ["SSL certificate", "71 days", "ok"],
            ["Broken links", "0 found", "ok"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-[#f8f9fa] p-2">
              <p className="text-[9.5px] text-[#5f6368]">{k}</p>
              <p className="text-[12.5px] font-semibold text-emerald-700">{v}</p>
            </div>
          ))}
        </div>
      </Card>
      <div className="absolute -right-2 -bottom-8 hidden w-[220px] rounded-xl bg-[#111827] p-3 text-white shadow-[0_18px_40px_-8px_rgb(0_0_0/0.45)] sm:block lg:-right-6">
        <p className="flex items-center justify-between text-[10px] text-white/60">
          <span>ServerCare alert</span>
          <span>Oct 1 · 02:14</span>
        </p>
        <p className="mt-1 text-[11px] leading-snug">
          <span className="font-semibold text-amber-300">Down 4 min:</span> host
          restart. Site back up at 02:18, no action needed.
        </p>
      </div>
    </div>
  );
}

/* ── 3. A content change, done ──────────────────────────────────────────── */

export function ChangeRequestMock({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b border-black/[0.07] pb-2.5">
        <p className="text-[13px] font-semibold text-[#202124]">
          Request #128 · Holiday hours
        </p>
        <Pill tone="ok">Done · 25 min</Pill>
      </div>
      <div className="mt-3 flex gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-[10px] font-semibold text-white">
          L
        </span>
        <p className="rounded-lg rounded-tl-none bg-[#f6f7f9] p-2 text-[10.5px] leading-snug text-[#3c4043]">
          <span className="font-semibold text-[#202124]">Lena (Bright Smile)</span>
          <br />
          Can you add our holiday hours to the homepage and close online booking Dec
          24–26? Photo of Dr. Patel attached for the team page too.
        </p>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_92px] gap-3 rounded-lg ring-1 ring-black/[0.06]">
        <div className="p-2.5">
          <p className="text-[9.5px] font-semibold tracking-[0.08em] text-[#80868b] uppercase">
            Live on site
          </p>
          <p className="mt-1 text-[11.5px] font-semibold text-[#0f766e]">
            Holiday hours
          </p>
          <p className="text-[10px] leading-snug text-[#3c4043]">
            Dec 24–26 closed · Dec 27 9am–1pm
            <br />
            Online booking reopens Dec 27
          </p>
        </div>
        <div className="relative overflow-hidden rounded-r-lg">
          <Image
            src="/mock/care-dental.jpg"
            alt=""
            fill
            sizes="100px"
            className="object-cover object-[40%_30%]"
          />
        </div>
      </div>
      <p className="mt-2.5 flex items-center justify-between text-[10px] text-[#5f6368]">
        <span>Content hours this month</span>
        <span className="font-semibold text-[#202124]">0.4 of 2 used</span>
      </p>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#eceef1]">
        <div className="h-full w-[20%] rounded-full bg-primary" />
      </div>
    </Card>
  );
}

/* ── 4. The report ──────────────────────────────────────────────────────── */

export function CareReportMock({ className }: { className?: string }) {
  const scores = [
    ["Performance", 94],
    ["Accessibility", 98],
    ["Best practices", 100],
    ["SEO", 100],
  ] as const;
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between border-b border-black/[0.07] pb-3">
        <div>
          <p className="text-[9.5px] font-semibold tracking-[0.14em] text-primary uppercase">
            ServerCare report
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#202124]">
            Bright Smile Dental · Oct 1–14
          </p>
        </div>
        <Pill tone="info">Bi-weekly</Pill>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Uptime", "99.99%"],
          ["Updates", "11 applied"],
          ["Backups", "14 of 14"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-[#f8f9fa] p-2">
            <p className="text-[9.5px] text-[#5f6368]">{k}</p>
            <p className="text-[14px] font-semibold text-[#202124]">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {scores.map(([k, v]) => (
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
      <ul className="mt-3 space-y-1 text-[10.5px] leading-snug text-[#3c4043]">
        <li>✓ Holiday hours added, booking closed Dec 24–26</li>
        <li>✓ Homepage images compressed: 1.9 MB → 410 KB</li>
        <li>• Contact Form 7 6.0 held: retest scheduled Oct 16</li>
      </ul>
    </Card>
  );
}
