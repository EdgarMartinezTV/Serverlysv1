import { cn } from "@/lib/utils";
import { SeraMark } from "@/components/sera/sera-mark";
import { MockPhoto } from "@/components/ui/mock-photo";

/**
 * SEO page mockups — coded product screens in the slots where the reference
 * page uses stock photography.
 *
 * Every mock is populated: real-looking numbers, real query strings, real
 * issue names. An empty frame reads as "coming soon"; a full one reads as
 * software. All of it belongs to one fictional client, Hearth Bakery
 * (hearthbakery.com, the demo business used across the site), so the page
 * tells one story: audit → fixes → rankings → report.
 *
 * Decorative: the copy beside each mock carries the meaning, so every root
 * is aria-hidden.
 */

/* ── Shared chrome ───────────────────────────────────────────────────────── */

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
        "overflow-hidden rounded-2xl shadow-[0_24px_60px_-12px_rgb(0_0_0/0.28)]",
        dark
          ? "bg-surface-dark-elevated ring-1 ring-white/10"
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
            "mx-auto flex min-w-0 max-w-[70%] flex-1 items-center justify-center gap-1.5 truncate rounded-md px-3 py-1 text-[11px]",
            dark
              ? "bg-black/40 text-white/55"
              : "bg-white text-[#5f6368] ring-1 ring-black/[0.06]",
          )}
        >
          <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="currentColor">
            <path d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-4A1.5 1.5 0 0 1 4.5 7H5Zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2Z" />
          </svg>
          <span className="truncate">{url}</span>
        </span>
        <span className="w-[46px]" />
      </div>
      {children}
    </div>
  );
}

function Delta({ v, dark = false }: { v: string; dark?: boolean }) {
  const up = v.startsWith("+") || v.startsWith("▲");
  return (
    <span
      className={cn(
        "tabular inline-flex items-center rounded px-1.5 py-0.5 text-[10.5px] font-semibold",
        up
          ? dark
            ? "bg-emerald-400/15 text-emerald-300"
            : "bg-emerald-50 text-emerald-700"
          : dark
            ? "bg-rose-400/15 text-rose-300"
            : "bg-rose-50 text-rose-700",
      )}
    >
      {v}
    </span>
  );
}

/** Smooth-ish polyline path from values, scaled into a w×h box. */
function path(values: number[], w: number, h: number, max: number) {
  const step = w / (values.length - 1);
  return values
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`,
    )
    .join(" ");
}

/* ── 1. Hero: search performance dashboard ──────────────────────────────── */

const CLICKS = [
  210, 226, 219, 248, 262, 255, 291, 318, 305, 342, 371, 398, 386, 421, 447, 468,
];
const IMPRESSIONS = [
  6.1, 6.4, 6.2, 6.9, 7.3, 7.1, 7.8, 8.4, 8.2, 8.9, 9.6, 10.1, 9.9, 10.7, 11.2, 11.8,
];

export function PerformanceMock({ className }: { className?: string }) {
  const W = 520;
  const H = 128;
  const clicks = path(CLICKS, W, H, 500);
  const impr = path(IMPRESSIONS, W, H, 12.5);
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <Window url="search.serverlys.com/hearthbakery.com/performance">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-[132px] shrink-0 flex-col gap-0.5 border-r border-black/[0.06] bg-[#fafbfc] p-2.5 sm:flex">
            <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#80868b]">
              hearthbakery.com
            </p>
            {[
              ["Overview", false],
              ["Performance", true],
              ["Pages", false],
              ["Keywords", false],
              ["Site audit", false],
              ["Core Web Vitals", false],
              ["Reports", false],
            ].map(([label, active]) => (
              <span
                key={label as string}
                className={cn(
                  "rounded-md px-2 py-1.5 text-[11px]",
                  active ? "bg-brand-50 font-semibold text-primary" : "text-[#3c4043]",
                )}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-[#202124]">
                Search performance
              </p>
              <span className="flex gap-1">
                {["7d", "28d", "3m", "6m"].map((r) => (
                  <span
                    key={r}
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px]",
                      r === "3m"
                        ? "bg-[#202124] text-white"
                        : "text-[#5f6368] ring-1 ring-black/[0.08]",
                    )}
                  >
                    {r}
                  </span>
                ))}
              </span>
            </div>

            {/* Metric tiles */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                {
                  k: "Total clicks",
                  v: "5,736",
                  d: "+41%",
                  c: "bg-primary text-white",
                },
                {
                  k: "Impressions",
                  v: "131K",
                  d: "+37%",
                  c: "bg-[#5e35b1] text-white",
                },
                {
                  k: "Average CTR",
                  v: "4.4%",
                  d: "+0.9",
                  c: "bg-white text-[#202124] ring-1 ring-black/[0.08]",
                },
                {
                  k: "Avg. position",
                  v: "9.2",
                  d: "▲ 6.1",
                  c: "bg-white text-[#202124] ring-1 ring-black/[0.08]",
                },
              ].map((m) => (
                <div key={m.k} className={cn("rounded-lg px-2.5 py-2", m.c)}>
                  <p className="text-[10px] opacity-80">{m.k}</p>
                  <p className="tabular mt-0.5 text-[17px] font-semibold leading-tight">
                    {m.v}
                  </p>
                  <p className="tabular text-[10px] opacity-80">{m.d} vs prev.</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="relative mt-3 rounded-lg ring-1 ring-black/[0.06]">
              <svg
                viewBox={`0 0 ${W} ${H + 18}`}
                className="block h-auto w-full"
                preserveAspectRatio="none"
              >
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    x2={W}
                    y1={(H / 3) * i + 0.5}
                    y2={(H / 3) * i + 0.5}
                    stroke="#eceef1"
                  />
                ))}
                <defs>
                  <linearGradient id="seo-clicks-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#0000ff" stopOpacity="0.16" />
                    <stop offset="1" stopColor="#0000ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`${clicks} L${W},${H} L0,${H} Z`}
                  fill="url(#seo-clicks-fill)"
                />
                <path
                  d={impr}
                  pathLength={1}
                  className="seo-draw seo-draw-late"
                  fill="none"
                  stroke="#5e35b1"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d={clicks}
                  pathLength={1}
                  className="seo-draw"
                  fill="none"
                  stroke="#0000ff"
                  strokeWidth="2.25"
                  strokeLinejoin="round"
                />
                <circle
                  cx={W * (12 / 15)}
                  cy={H - (386 / 500) * H}
                  r="4"
                  fill="#fff"
                  stroke="#0000ff"
                  strokeWidth="2"
                />
                {["Jul", "Aug", "Sep", "Oct"].map((m, i) => (
                  <text
                    key={m}
                    x={8 + i * (W / 4)}
                    y={H + 13}
                    fontSize="10"
                    fill="#80868b"
                  >
                    {m}
                  </text>
                ))}
              </svg>
              <div className="absolute top-[18%] right-[13%] rounded-md bg-[#202124] px-2 py-1 text-[10px] leading-tight text-white shadow-lg">
                <p className="font-semibold">Sep 24</p>
                <p className="tabular text-white/80">386 clicks · 9.9K impr.</p>
              </div>
            </div>

            {/* Top queries */}
            <table className="mt-3 w-full text-[11px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.06em] text-[#80868b]">
                  <th className="pb-1 font-medium">Top queries</th>
                  <th className="pb-1 text-right font-medium">Clicks</th>
                  <th className="pb-1 text-right font-medium">Position</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["sourdough bread near me", "812", "2.1", "+5"],
                  ["custom birthday cake", "644", "3.4", "+9"],
                  ["gluten free bakery austin", "391", "4.0", "+12"],
                  ["wedding cake tasting", "207", "6.8", "+3"],
                ].map(([q, c, p, d]) => (
                  <tr key={q} className="border-t border-black/[0.05]">
                    <td className="py-1.5 text-[#202124]">{q}</td>
                    <td className="tabular py-1.5 text-right text-[#3c4043]">{c}</td>
                    <td className="py-1.5 text-right">
                      <span className="tabular mr-1.5 text-[#3c4043]">{p}</span>
                      <Delta v={d} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Window>

      {/* Floating: Business Profile + a new review */}
      <div className="animate-float-slow absolute -bottom-20 -left-6 hidden w-[214px] sm:block lg:-left-24">
        <BusinessProfileMock />
      </div>
      <div className="animate-float absolute -top-20 -right-3 hidden sm:block lg:-right-6">
        <ReviewToast />
      </div>
    </div>
  );
}

/* ── 2. Site audit report ───────────────────────────────────────────────── */

export function AuditMock({ className }: { className?: string }) {
  const issues = [
    { label: "Pages missing a meta description", n: 14, sev: "warn", done: true },
    { label: "Broken internal links (404)", n: 6, sev: "error", done: true },
    { label: "Images without alt text", n: 37, sev: "warn", done: true },
    { label: "Duplicate title tags", n: 4, sev: "warn", done: true },
    { label: "Render-blocking scripts", n: 3, sev: "error", done: false },
    { label: "Missing LocalBusiness schema", n: 1, sev: "notice", done: false },
  ] as const;
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <Window
      url="search.serverlys.com/hearthbakery.com/audit"
      dark
      className={className}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="relative size-[84px] shrink-0">
            <svg viewBox="0 0 84 84" className="size-full -rotate-90">
              <circle
                cx="42"
                cy="42"
                r={r}
                fill="none"
                stroke="rgb(255 255 255 / 0.08)"
                strokeWidth="8"
              />
              <circle
                cx="42"
                cy="42"
                r={r}
                fill="none"
                stroke="#34d399"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${c * 0.91} ${c}`}
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="tabular text-[22px] font-bold leading-none text-white">
                91
              </span>
              <span className="text-[9px] text-white/50">site health</span>
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white">
              Technical audit · 48 pages crawled
            </p>
            <p className="mt-0.5 text-[11px] text-white/55">
              Was 58 at kickoff · re-crawled Oct 9
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
              <span className="rounded bg-rose-400/15 px-1.5 py-0.5 text-rose-300">
                2 errors
              </span>
              <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-amber-300">
                3 warnings
              </span>
              <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-emerald-300">
                61 fixed
              </span>
            </div>
          </div>
        </div>

        <ul className="mt-4 divide-y divide-white/[0.06] rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06]">
          {issues.map((i) => (
            <li key={i.label} className="flex items-center gap-2.5 px-3 py-2">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  i.sev === "error"
                    ? "bg-rose-400"
                    : i.sev === "warn"
                      ? "bg-amber-400"
                      : "bg-sky-400",
                )}
              />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[11.5px]",
                  i.done ? "text-white/45 line-through" : "text-white/90",
                )}
              >
                {i.label}
              </span>
              <span className="tabular text-[11px] text-white/50">{i.n}</span>
              {i.done ? (
                <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-300">
                  Fixed
                </span>
              ) : (
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9.5px] font-semibold text-white/70">
                  In progress
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Window>
  );
}

/* ── 3. Search results page with a rich result ──────────────────────────── */

export function SerpMock({ className }: { className?: string }) {
  return (
    <Window url="search · custom birthday cake austin" className={className}>
      <div className="bg-white p-4 sm:p-5">
        {/* Search box */}
        <div className="flex items-center gap-2.5 rounded-full px-4 py-2.5 shadow-[0_1px_6px_rgb(32_33_36/0.18)]">
          <svg
            viewBox="0 0 24 24"
            className="size-4 text-[#9aa0a6]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="text-[13px] text-[#202124]">
            custom birthday cake austin
          </span>
        </div>
        <div className="mt-3 flex gap-4 border-b border-black/[0.06] pb-2 text-[11px] text-[#5f6368]">
          {["All", "Maps", "Images", "Shopping", "News"].map((t, i) => (
            <span
              key={t}
              className={
                i === 0
                  ? "border-b-2 border-[#1a73e8] pb-1.5 font-semibold text-[#1a73e8]"
                  : "pb-1.5"
              }
            >
              {t}
            </span>
          ))}
        </div>

        {/* Result #1 — ours, with rich result */}
        <div className="relative mt-4 rounded-xl bg-brand-50/60 p-3 ring-1 ring-brand-100">
          <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-[9.5px] font-semibold text-white">
            Position 1
          </span>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#7a4a22] text-[10px] font-bold text-white">
              H
            </span>
            <span className="leading-tight">
              <span className="block text-[11.5px] text-[#202124]">Hearth Bakery</span>
              <span className="block text-[10.5px] text-[#4d5156]">
                https://hearthbakery.com › cakes › custom
              </span>
            </span>
          </div>
          <p className="mt-1.5 text-[15px] leading-snug text-[#1a0dab]">
            Custom Birthday Cakes in Austin — Order 48h Ahead | Hearth
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#70757a]">
            <span className="text-[#e7711b]">★★★★★</span>
            Rating: 4.9 · 212 reviews · $45 to $160
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-[#4d5156]">
            Hand-decorated birthday cakes baked the morning of pickup. Choose a size,
            flavour and design online, or book a free tasting…
          </p>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11.5px] text-[#1a0dab]">
            <span>Order a cake</span>
            <span>Flavours &amp; sizes</span>
            <span>Gluten-free options</span>
            <span>Book a tasting</span>
          </div>
          <div className="mt-2.5 divide-y divide-black/[0.06] rounded-lg bg-white ring-1 ring-black/[0.06]">
            {["How far ahead should I order?", "Do you deliver in Austin?"].map((q) => (
              <div
                key={q}
                className="flex items-center justify-between px-2.5 py-1.5 text-[11px] text-[#202124]"
              >
                {q}
                <svg
                  viewBox="0 0 24 24"
                  className="size-3.5 text-[#5f6368]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Result #2 — a competitor, plain */}
        <div className="mt-4 px-3 opacity-70">
          <span className="block text-[10.5px] text-[#4d5156]">
            https://www.cakeshopdirectory.com › tx › austin
          </span>
          <p className="mt-0.5 text-[14px] text-[#1a0dab]">
            10 Best Cake Shops in Austin, TX (2026)
          </p>
          <p className="mt-0.5 text-[11px] text-[#4d5156]">
            Compare bakeries near you by price, reviews and delivery area…
          </p>
        </div>
      </div>
    </Window>
  );
}

/* ── 4. Keyword rank tracker ───────────────────────────────────────────── */

export function RankTrackerMock({ className }: { className?: string }) {
  const rows = [
    {
      kw: "sourdough bread near me",
      vol: "2.9K",
      trend: [18, 14, 11, 7, 5, 3, 2],
      pos: 2,
      d: "+16",
    },
    {
      kw: "custom birthday cake austin",
      vol: "1.6K",
      trend: [24, 19, 12, 9, 4, 2, 1],
      pos: 1,
      d: "+23",
    },
    {
      kw: "gluten free bakery austin",
      vol: "880",
      trend: [31, 27, 20, 14, 9, 6, 4],
      pos: 4,
      d: "+27",
    },
    {
      kw: "wedding cake tasting",
      vol: "720",
      trend: [15, 14, 12, 11, 9, 8, 7],
      pos: 7,
      d: "+8",
    },
    {
      kw: "bakery catering austin",
      vol: "590",
      trend: [40, 34, 22, 18, 15, 12, 11],
      pos: 11,
      d: "+29",
    },
    {
      kw: "best croissant austin",
      vol: "1.1K",
      trend: [9, 8, 8, 6, 7, 6, 6],
      pos: 6,
      d: "+3",
    },
  ];
  return (
    <Window url="search.serverlys.com/hearthbakery.com/keywords" className={className}>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[13px] font-semibold text-[#202124]">Tracked keywords</p>
            <p className="text-[11px] text-[#5f6368]">
              Austin, TX · mobile · updated daily
            </p>
          </div>
          <div className="flex gap-1.5 text-[10.5px]">
            <span className="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
              Top 3: 3
            </span>
            <span className="rounded-md bg-brand-50 px-2 py-1 font-semibold text-primary">
              Top 10: 5
            </span>
            <span className="rounded-md bg-[#f1f3f4] px-2 py-1 font-semibold text-[#3c4043]">
              Avg. ▲ 17.7
            </span>
          </div>
        </div>

        <table className="mt-3 w-full text-[11.5px]">
          <thead>
            <tr className="border-b border-black/[0.06] text-left text-[10px] uppercase tracking-[0.06em] text-[#80868b]">
              <th className="pb-1.5 font-medium">Keyword</th>
              <th className="hidden pb-1.5 text-right font-medium sm:table-cell">
                Volume
              </th>
              <th className="hidden pb-1.5 pl-3 font-medium sm:table-cell">6 months</th>
              <th className="pb-1.5 text-right font-medium">Pos.</th>
              <th className="pb-1.5 text-right font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const max = 42;
              const pts = r.trend
                .map((v, i) => `${(i * 64) / (r.trend.length - 1)},${(v / max) * 20}`)
                .join(" ");
              return (
                <tr key={r.kw} className="border-b border-black/[0.04] last:border-0">
                  <td className="max-w-[150px] truncate py-2 pr-2 text-[#202124]">
                    {r.kw}
                  </td>
                  <td className="tabular hidden py-2 text-right text-[#5f6368] sm:table-cell">
                    {r.vol}
                  </td>
                  <td className="hidden py-2 pl-3 sm:table-cell">
                    <svg viewBox="-2 -2 68 24" className="h-5 w-16">
                      <polyline
                        points={pts}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </svg>
                  </td>
                  <td className="py-2 text-right">
                    <span
                      className={cn(
                        "tabular inline-flex size-6 items-center justify-center rounded-md text-[11px] font-bold",
                        r.pos <= 3
                          ? "bg-emerald-500 text-white"
                          : r.pos <= 10
                            ? "bg-primary text-white"
                            : "bg-[#e8eaed] text-[#3c4043]",
                      )}
                    >
                      {r.pos}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <Delta v={r.d} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Window>
  );
}

/* ── 5. Monthly report (small, for the bento) ───────────────────────────── */

export function ReportMock({ className }: { className?: string }) {
  const bars = [38, 44, 41, 52, 58, 66, 71, 83];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/[0.08]",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold text-white">September report</p>
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
          PDF · 6 pages
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Organic visits", "2,184", "+18%"],
          ["Calls from search", "63", "+11"],
          ["Online orders", "41", "+9"],
        ].map(([k, v, d]) => (
          <div key={k} className="rounded-lg bg-white/[0.04] p-2">
            <p className="text-[9.5px] text-white/50">{k}</p>
            <p className="tabular text-[15px] font-semibold text-white">{v}</p>
            <Delta v={d} dark />
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-16 items-end gap-1.5">
        {bars.map((b, i) => (
          <span
            key={i}
            className={cn(
              "flex-1 rounded-t",
              i === bars.length - 1 ? "bg-brand-400" : "bg-white/15",
            )}
            style={{ height: `${b}%` }}
          />
        ))}
      </div>
      <p className="mt-2 text-[10.5px] leading-relaxed text-white/60">
        <span className="font-semibold text-white/85">Didn’t move:</span> “wedding
        cakes” held at #12. Next month: a dedicated tasting page and two supplier
        mentions.
      </p>
    </div>
  );
}

/* ── 6. Content calendar (small, for the bento) ─────────────────────────── */

export function ContentMock({ className }: { className?: string }) {
  const items = [
    {
      t: "Gluten-free cakes: what we bake and how",
      type: "Service page",
      s: "Published",
      c: "text-emerald-300 bg-emerald-400/15",
    },
    {
      t: "Austin wedding cake tasting guide",
      type: "Article · 1,600 words",
      s: "In review",
      c: "text-amber-300 bg-amber-400/15",
    },
    {
      t: "Sourdough starter class — East Austin",
      type: "Event page",
      s: "Drafting",
      c: "text-sky-300 bg-sky-400/15",
    },
    {
      t: "Refresh: Birthday cakes (pricing, FAQ)",
      type: "Update",
      s: "Planned",
      c: "text-white/70 bg-white/10",
    },
  ];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/[0.08]",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold text-white">October content plan</p>
        <span className="text-[10px] text-white/50">4 pieces</span>
      </div>
      <ul className="mt-3 flex flex-col gap-1.5">
        {items.map((i) => (
          <li
            key={i.t}
            className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] px-2.5 py-2"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11.5px] text-white/90">{i.t}</span>
              <span className="block text-[10px] text-white/45">{i.type}</span>
            </span>
            <span
              className={cn(
                "shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-semibold",
                i.c,
              )}
            >
              {i.s}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── 7. Sera conversation about SEO ─────────────────────────────────────── */

export function SeraChatMock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-900 p-6 sm:p-10",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div className="relative mx-auto max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-15px_rgb(0_0_0/0.5)]">
        <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-4 py-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 text-primary">
            <SeraMark className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[13px] font-semibold text-[#202124]">Sera</span>
            <span className="flex items-center gap-1 text-[10.5px] text-[#5f6368]">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Serverlys assistant · a person reads every chat
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-2.5 bg-[#fafbfc] px-4 py-4 text-[12.5px] leading-relaxed">
          <p className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-white">
            My bakery site gets almost no visits from Google. Where do I even start?
          </p>
          <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[#202124] ring-1 ring-black/[0.06]">
            Start with what stops Google reading the site. On a quick look at{" "}
            <b>hearthbakery.com</b>:
            <ul className="mt-1.5 flex flex-col gap-1">
              {[
                "14 pages share the same title",
                "No LocalBusiness schema, so no hours or rating in results",
                "Largest image is 3.8 MB on mobile",
              ].map((t) => (
                <li key={t} className="flex gap-1.5">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-amber-400" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-1.5">
              A full audit would list everything and the order to fix it in.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white px-3 py-1.5 text-[11.5px] font-semibold text-primary ring-1 ring-brand-200">
              Request an audit
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-[11.5px] text-[#3c4043] ring-1 ring-black/[0.08]">
              What does it cost?
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-black/[0.06] px-3 py-2.5">
          <span className="flex-1 rounded-full bg-[#f1f3f4] px-3.5 py-2 text-[12px] text-[#80868b]">
            Ask about your site…
          </span>
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-white">
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══ Photo-backed mockups ═════════════════════════════════════════════════
   Real photography (public/mock, Unsplash — see CREDITS.md) inside UI drawn
   in code: products and places only, never a photo of a fake interface. */

function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex text-[#fbbc04]", className)} aria-hidden="true">
      {"★★★★★"}
    </span>
  );
}

/** Google-style initials avatar — reviewers without a profile photo. */
function Initial({ letter, color }: { letter: string; color: string }) {
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
      style={{ background: color }}
    >
      {letter}
    </span>
  );
}

/* ── Business Profile card (hero float, local section) ──────────────────── */

export function BusinessProfileMock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.06]",
        className,
      )}
    >
      <div className="grid h-[118px] grid-cols-[1.6fr_1fr] gap-0.5">
        <MockPhoto src="bread" className="h-full" sizes="200px" position="center 40%" />
        <div className="grid grid-rows-2 gap-0.5">
          <MockPhoto src="coffee" className="h-full" sizes="120px" />
          <div className="relative h-full">
            <MockPhoto src="bread-sliced" className="h-full" sizes="120px" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-[11px] font-semibold text-white">
              +86
            </span>
          </div>
        </div>
      </div>
      <div className="p-3.5">
        <p className="text-[15px] font-semibold leading-tight text-[#202124]">
          Hearth Bakery
        </p>
        <p className="mt-1 flex items-center gap-1 text-[11.5px] text-[#70757a]">
          <span className="font-semibold text-[#202124]">4.9</span>
          <Stars className="text-[11px]" />
          <span>(212)</span>
          <span>· Bakery</span>
        </p>
        <p className="mt-0.5 text-[11.5px]">
          <span className="font-semibold text-[#188038]">Open</span>
          <span className="text-[#70757a]"> · Closes 6 PM</span>
        </p>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[
            [
              "Website",
              "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z",
            ],
            ["Directions", "m12 3 9 9-9 9-9-9 9-9Zm-2 11v-3h4l-1.5-1.5M14 11l-1.5 1.5"],
            [
              "Call",
              "M6 4h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2Z",
            ],
          ].map(([label, d]) => (
            <span
              key={label}
              className="flex flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium text-[#1a73e8] ring-1 ring-[#dadce0]"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={d} />
              </svg>
              {label}
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2 border-t border-black/[0.06] pt-3">
          <Initial letter="M" color="#7b1fa2" />
          <p className="text-[11px] leading-snug text-[#3c4043]">
            <Stars className="mr-1 text-[10px]" />
            “Found them searching for a birthday cake, and now it’s our Saturday
            ritual.”
          </p>
        </div>
      </div>
    </div>
  );
}

/** “New review” toast — floats over the hero dashboard. */
export function ReviewToast({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex w-[248px] items-start gap-2.5 rounded-xl bg-white p-3 shadow-[0_18px_40px_-8px_rgb(0_0_0/0.3)] ring-1 ring-black/[0.06]",
        className,
      )}
    >
      <Initial letter="D" color="#0b8043" />
      <div className="min-w-0">
        <p className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#202124]">
          New 5-star review
          <span className="font-normal text-[#80868b]">2m</span>
        </p>
        <Stars className="text-[10px]" />
        <p className="mt-0.5 text-[11px] leading-snug text-[#3c4043]">
          “Best sourdough in Austin. Came in after seeing them at the top of Google.”
        </p>
      </div>
    </div>
  );
}

/* ── Local pack on a drawn map ──────────────────────────────────────────── */

function MapCanvas() {
  return (
    <svg
      viewBox="0 0 600 260"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="600" height="260" fill="#eef0eb" />
      {/* park + water */}
      <path d="M380 0h220v95c-40 10-90 4-130-14-36-16-64-44-90-81Z" fill="#c9e7c4" />
      <path
        d="M0 196c70-16 140 6 210 2s120-34 190-28 150 40 200 36v54H0Z"
        fill="#aadaff"
      />
      {/* blocks */}
      {[
        [30, 30, 90, 50],
        [140, 26, 80, 56],
        [240, 34, 100, 46],
        [40, 104, 70, 48],
        [130, 100, 110, 52],
        [270, 104, 80, 44],
        [410, 120, 70, 40],
        [500, 112, 80, 50],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#e3e5df" />
      ))}
      {/* roads */}
      <path
        d="M0 88h600M0 166h600M120 0v200M250 0v200M370 60v140M480 0v200"
        stroke="#fff"
        strokeWidth="9"
      />
      <path d="M0 88h600M120 0v200" stroke="#fde293" strokeWidth="5" />
      <path d="M0 18 600 240" stroke="#fff" strokeWidth="6" opacity="0.8" />
      <text x="134" y="84" fontSize="9" fill="#7a7f75">
        Congress Ave
      </text>
      <text x="400" y="40" fontSize="9" fill="#4f8a4a">
        Pease Park
      </text>
      <text x="40" y="236" fontSize="9" fill="#3b7fc4">
        Lady Bird Lake
      </text>
    </svg>
  );
}

function Pin({
  n,
  active,
  className,
}: {
  n: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("absolute -translate-x-1/2 -translate-y-full", className)}>
      <svg
        viewBox="0 0 28 36"
        className={cn("drop-shadow-md", active ? "size-10" : "size-8")}
      >
        <path
          d="M14 35s11-11.6 11-21A11 11 0 0 0 3 14c0 9.4 11 21 11 21Z"
          fill={active ? "#ea4335" : "#d93025"}
          stroke="#fff"
          strokeWidth="1.5"
        />
        <text
          x="14"
          y="18"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#fff"
        >
          {n}
        </text>
      </svg>
    </span>
  );
}

export function LocalPackMock({ className }: { className?: string }) {
  const results = [
    {
      n: "1",
      name: "Hearth Bakery",
      rating: "4.9",
      count: "212",
      meta: "Bakery · 0.4 mi · Open · Closes 6 PM",
      photo: "bread" as const,
      ours: true,
    },
    {
      n: "2",
      name: "Crumb & Co. Bakehouse",
      rating: "4.6",
      count: "98",
      meta: "Bakery · 1.1 mi · Open · Closes 3 PM",
      photo: "bread-sliced" as const,
    },
    {
      n: "3",
      name: "Sunrise Café",
      rating: "4.4",
      count: "341",
      meta: "Café · 1.6 mi · Open · Closes 4 PM",
      photo: "coffee" as const,
    },
  ];
  return (
    <Window url="search · bakery near me" className={className}>
      <div className="bg-white">
        <div className="px-4 pt-4 sm:px-5">
          <div className="flex items-center gap-2.5 rounded-full px-4 py-2.5 shadow-[0_1px_6px_rgb(32_33_36/0.18)]">
            <svg
              viewBox="0 0 24 24"
              className="size-4 text-[#9aa0a6]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className="text-[13px] text-[#202124]">bakery near me</span>
          </div>
          <p className="mt-3 text-[13px] font-semibold text-[#202124]">Places</p>
        </div>
        <div className="relative mx-4 mt-2 h-[150px] overflow-hidden rounded-xl ring-1 ring-black/[0.06] sm:mx-5">
          <MapCanvas />
          <Pin n="1" active className="top-[58%] left-[30%]" />
          <Pin n="2" className="top-[42%] left-[58%]" />
          <Pin n="3" className="top-[70%] left-[78%]" />
          <span className="absolute top-[28%] left-[30%] -translate-x-1/2 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#202124] shadow">
            Hearth Bakery
          </span>
        </div>
        <ul className="divide-y divide-black/[0.06] px-4 pb-2 sm:px-5">
          {results.map((r) => (
            <li
              key={r.n}
              className={cn(
                "flex items-center gap-3 py-3",
                r.ours && "-mx-2 rounded-xl bg-brand-50/70 px-2",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[13.5px] font-medium text-[#1a0dab]">
                  {r.name}
                  {r.ours && (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-white">
                      #1 in Maps
                    </span>
                  )}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#70757a]">
                  <span className="text-[#202124]">{r.rating}</span>
                  <Stars className="text-[10px]" />({r.count})
                </p>
                <p className="mt-0.5 truncate text-[11px] text-[#70757a]">{r.meta}</p>
              </div>
              <MockPhoto
                src={r.photo}
                className="size-[58px] shrink-0 rounded-lg"
                sizes="60px"
              />
            </li>
          ))}
        </ul>
      </div>
    </Window>
  );
}

/* ── Published article (content) ────────────────────────────────────────── */

export function ArticleMock({ className }: { className?: string }) {
  return (
    <Window
      url="hearthbakery.com/journal/sourdough-starter-guide"
      dark
      className={className}
    >
      <div className="bg-[#fbf8f3]">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-[#3b2a1a]">
            Hearth
          </span>
          <span className="flex gap-3 text-[10px] text-[#6d5d4b]">
            <span>Breads</span>
            <span>Cakes</span>
            <span className="font-semibold text-[#3b2a1a]">Journal</span>
          </span>
        </div>
        <div className="relative h-[150px]">
          <MockPhoto
            src="bread-sliced"
            className="h-full"
            sizes="560px"
            position="center 55%"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-x-4 bottom-3 text-white">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] opacity-80">
              Guide · 8 min read
            </p>
            <p className="mt-0.5 text-[17px] leading-tight font-semibold">
              How to keep a sourdough starter alive (and happy)
            </p>
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-[1fr_150px]">
          <div className="text-[10.5px] leading-[1.55] text-[#4a3f33]">
            <p>
              A starter is just flour, water and time, but it is alive, and it gets
              hungry. Ours is eleven years old and still bakes every loaf on the
              counter.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-[#3b2a1a]">
              1. Feed it on a schedule
            </p>
            <p className="mt-0.5">
              Equal weights of flour and water, every 12 hours at room temperature, or
              once a week from the fridge.
            </p>
          </div>
          <div className="rounded-lg bg-white p-2.5 ring-1 ring-black/[0.06]">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[#80868b]">
              Since publishing
            </p>
            <p className="tabular mt-1 text-[18px] font-semibold text-[#202124]">
              1,940
            </p>
            <p className="text-[10px] text-[#5f6368]">visits from Google</p>
            <span className="mt-1.5 inline-flex rounded bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-700">
              Featured snippet
            </span>
          </div>
        </div>
      </div>
    </Window>
  );
}

/* ── Monthly report as a paper page ─────────────────────────────────────── */

export function ReportPaperMock({ className }: { className?: string }) {
  const bars = [38, 44, 41, 52, 58, 66, 71, 83];
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <div className="absolute inset-x-6 -bottom-3 h-full rotate-[2deg] rounded-xl bg-white/10" />
      <div className="relative rounded-xl bg-white p-5 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.5)]">
        <div className="flex items-start justify-between border-b border-black/[0.07] pb-3">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-primary">
              Monthly SEO report
            </p>
            <p className="mt-0.5 text-[15px] font-semibold text-[#202124]">
              Hearth Bakery · September
            </p>
          </div>
          <span className="rounded-md bg-[#f1f3f4] px-2 py-1 text-[10px] font-semibold text-[#3c4043]">
            Page 1 of 6
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["Organic visits", "2,184", "+18%"],
            ["Calls from Google", "63", "+11"],
            ["Online orders", "41", "+9"],
          ].map(([k, v, d]) => (
            <div key={k} className="rounded-lg bg-[#f8f9fa] p-2">
              <p className="text-[9.5px] text-[#5f6368]">{k}</p>
              <p className="tabular text-[17px] font-semibold text-[#202124]">{v}</p>
              <Delta v={d} />
            </div>
          ))}
        </div>
        <div className="mt-3 flex h-16 items-end gap-1.5">
          {bars.map((b, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 rounded-t",
                i === bars.length - 1 ? "bg-primary" : "bg-brand-100",
              )}
              style={{ height: `${b}%` }}
            />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[10.5px] leading-snug text-[#3c4043]">
          <div>
            <p className="font-semibold text-[#202124]">What moved</p>
            <p className="mt-0.5">
              “custom birthday cake austin” reached #1; gluten-free page up 27 places.
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#202124]">What didn’t</p>
            <p className="mt-0.5">
              “wedding cakes” held at #12. Next: a tasting page and two supplier
              mentions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Live ranking ticker ────────────────────────────────────────────────── */

const TICKER = [
  ["custom birthday cake austin", "1", "+23"],
  ["sourdough bread near me", "2", "+16"],
  ["gluten free bakery austin", "4", "+27"],
  ["bakery catering austin", "11", "+29"],
  ["best croissant austin", "6", "+3"],
  ["wedding cake tasting", "7", "+8"],
  ["sourdough starter class", "1", "+19"],
  ["vegan cupcakes austin", "5", "+14"],
] as const;

export function RankTicker({ className }: { className?: string }) {
  const row = (copy: number) =>
    TICKER.map(([kw, pos, d]) => (
      <li
        key={`${copy}-${kw}`}
        className="flex shrink-0 items-center gap-3 rounded-full bg-white/[0.05] py-2 pr-4 pl-2 ring-1 ring-white/10"
      >
        <span
          className={cn(
            "tabular flex size-7 items-center justify-center rounded-full text-[12px] font-bold",
            Number(pos) <= 3 ? "bg-emerald-500 text-white" : "bg-primary text-white",
          )}
        >
          {pos}
        </span>
        <span className="text-[14px] whitespace-nowrap text-white/90">{kw}</span>
        <span className="tabular text-[12px] font-semibold text-emerald-300">
          ▲ {d.slice(1)}
        </span>
      </li>
    ));
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]",
        className,
      )}
    >
      <ul className="seo-ticker flex w-max gap-4">
        {row(0)}
        {row(1)}
      </ul>
    </div>
  );
}
