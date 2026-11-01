/**
 * In-code product visuals for the cloud hosting page.
 *
 * The reference fills these slots with proprietary raster art and video. Those
 * files are Hostinger's, so they are rebuilt here in HTML/SVG instead — same
 * composition, same readings, our palette. That also matches how the rest of
 * this site does product imagery (see components/product-ui), and it keeps the
 * page free of files that can 404 or blur on a retina screen.
 *
 * All decorative: each is aria-hidden, and the surrounding copy carries the
 * meaning. Figures are illustrative.
 */
import { cn } from "@/lib/utils";
import { Check } from "@/components/ref/kit";

/* ── shared pieces ──────────────────────────────────────────────────────── */

/** The dark, diagonally banded stage the comparison panels float on. */
function Stage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-canvas-deep",
        className,
      )}
    >
      {/* Two lighter diagonal bands, as on the reference stage. */}
      <span className="absolute -inset-x-1/4 top-0 h-1/2 -skew-y-12 bg-white/[0.04]" />
      <span className="absolute -inset-x-1/4 bottom-0 h-1/3 -skew-y-12 bg-white/[0.03]" />
      <div className="relative w-[62%]">{children}</div>
    </div>
  );
}

/** A floating white readout panel. */
function Readout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-b from-white to-ink-100 p-4 shadow-e4 ring-1 ring-white/60",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] leading-5 font-medium text-fg">{children}</p>;
}

/** Ring gauge. `value` 0–100. */
function Gauge({
  value,
  label,
  tone,
  caption,
}: {
  value: number;
  label: string;
  tone: "success" | "primary";
  caption: string;
}) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative size-[68px]">
        <svg viewBox="0 0 68 68" className="size-full -rotate-90">
          <circle
            cx="34"
            cy="34"
            r={r}
            fill="none"
            strokeWidth="6"
            className="stroke-ink-200"
          />
          <circle
            cx="34"
            cy="34"
            r={r}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * c} ${c}`}
            className={tone === "success" ? "stroke-success-fill" : "stroke-primary"}
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "text-[15px] leading-4 font-semibold",
              tone === "success" ? "text-success" : "text-fg",
            )}
          >
            {label}
          </span>
          <span className="text-ui leading-3 text-fg-muted">{caption}</span>
        </span>
      </div>
    </div>
  );
}

/** Jittery-but-deterministic sparkline. No Math.random — SSR must match. */
function Spark({ seed, className }: { seed: number; className?: string }) {
  const pts = Array.from({ length: 22 }, (_, i) => {
    const y = 10 + 6 * Math.sin(i * 0.9 + seed) + 3 * Math.sin(i * 2.3 + seed * 2);
    return `${(i / 21) * 88},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg
      viewBox="0 0 88 22"
      className={cn("h-5 w-full", className)}
      preserveAspectRatio="none"
    >
      <polyline
        points={pts}
        fill="none"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="stroke-primary"
      />
    </svg>
  );
}

function ActiveDot() {
  return <span className="inline-block size-2 rounded-full bg-success-fill" />;
}

/* ── comparison card panels ─────────────────────────────────────────────── */

/** Cloud hosting — page speed and disk usage. */
export function PerformancePanel({ className }: { className?: string }) {
  return (
    <Stage className={className}>
      <Readout>
        <PanelTitle>Performance</PanelTitle>
        <div className="mt-3 flex items-start justify-around">
          <Gauge value={99} label="99" tone="success" caption="" />
          <Gauge value={79} label="79%" tone="primary" caption="used" />
        </div>
        <div className="mt-1 flex items-start justify-around text-ui leading-4 text-fg-secondary">
          <span>Page speed</span>
          <span>Disk usage</span>
        </div>
      </Readout>
    </Stage>
  );
}

/** Shared hosting — uptime. */
export function StatusPanel({ className }: { className?: string }) {
  return (
    <Stage className={className}>
      <Readout>
        <PanelTitle>Website status</PanelTitle>
        <p className="mt-1.5 flex items-center gap-1.5 text-ui leading-4 font-semibold tracking-wide text-success uppercase">
          <ActiveDot />
          Active
        </p>
        <svg
          viewBox="0 0 100 34"
          className="mt-2 h-[52px] w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ch-uptime" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-success-fill)"
                stopOpacity="0.45"
              />
              <stop
                offset="100%"
                stopColor="var(--color-success-fill)"
                stopOpacity="0.05"
              />
            </linearGradient>
          </defs>
          <path
            d="M0 8 L30 8 L46 10 L62 8 L100 8 L100 34 L0 34 Z"
            fill="url(#ch-uptime)"
          />
          <path
            d="M0 8 L30 8 L46 10 L62 8 L100 8"
            fill="none"
            strokeWidth="1.2"
            className="stroke-success-fill"
          />
        </svg>
        <p className="mt-1 text-right text-ui leading-4 text-fg-muted">
          Last 30 days uptime 99.90%
        </p>
      </Readout>
    </Stage>
  );
}

/** VPS hosting — CPU and memory. */
export function ResourcePanel({ className }: { className?: string }) {
  return (
    <Stage className={className}>
      <Readout>
        <PanelTitle>Resource usage</PanelTitle>
        {[
          { k: "CPU", v: "55%", seed: 0.4 },
          { k: "Memory", v: "650 MB", seed: 2.1 },
        ].map((row) => (
          <div key={row.k} className="mt-3 flex items-center gap-3">
            <span className="w-[62px] shrink-0">
              <span className="block text-ui leading-3 text-fg-secondary">{row.k}</span>
              <span className="block text-[13px] leading-5 font-semibold text-fg">
                {row.v}
              </span>
            </span>
            <Spark seed={row.seed} className="flex-1" />
          </div>
        ))}
      </Readout>
    </Stage>
  );
}

/* ── bento card panels ──────────────────────────────────────────────────── */

/** "Your data, protected" — two security rows on a lavender field. */
export function SecurityPanel({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex flex-col justify-center gap-3 px-10", className)}
    >
      {[
        { label: "SSL certificate", strong: true },
        { label: "Firewall protection", strong: false },
      ].map((row) => (
        <div
          key={row.label}
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 shadow-e2",
            row.strong ? "opacity-100" : "opacity-90",
          )}
        >
          <span className="flex items-center gap-2 text-[14px] leading-5 text-fg">
            <span className="grid size-[18px] place-items-center rounded-full bg-success-fill text-white">
              <Check className="size-3" />
            </span>
            {row.label}
          </span>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-ui leading-4 font-bold tracking-wide text-white uppercase",
              row.strong ? "bg-success-fill" : "bg-success-fill/70",
            )}
          >
            Active
          </span>
        </div>
      ))}
    </div>
  );
}

/** "Fast under real traffic" — status strip plus a PageSpeed gauge. */
export function SpeedPanel({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative flex items-center px-8", className)}>
      <div className="w-[62%] rounded-lg bg-white/70 p-3">
        <PanelTitle>Website status</PanelTitle>
        <p className="mt-1 flex items-center gap-1.5 text-ui leading-4 font-semibold tracking-wide text-success uppercase">
          <ActiveDot />
          Active
        </p>
        <span className="mt-2 block h-6 rounded bg-primary/10" />
      </div>
      <div className="-ml-8 rounded-xl bg-white p-3 shadow-e4">
        <p className="text-center text-ui leading-4 text-fg-secondary">PageSpeed</p>
        <div className="mt-1">
          <Gauge value={99} label="99" tone="success" caption="" />
        </div>
      </div>
    </div>
  );
}

/**
 * "What is cloud hosting?" media — a storefront on a brand field with a live
 * traffic reading floating over it, as on the reference.
 */
export function StorePanel({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-800",
        className,
      )}
    >
      {/* Browser card, bled off the bottom-right like the reference. */}
      <div className="absolute top-[14%] left-[14%] w-[78%] overflow-hidden rounded-t-xl bg-white shadow-e5">
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="flex flex-col gap-[3px]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-[2px] w-3.5 rounded bg-fg" />
            ))}
          </span>
          <span className="flex items-center gap-2 text-fg">
            <svg viewBox="0 0 20 20" fill="none" className="size-3.5">
              <circle cx="9" cy="9" r="5.4" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M13.2 13.2l3.3 3.3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <svg viewBox="0 0 20 20" fill="none" className="size-3.5">
              <path
                d="M2.5 3h2l2 8.5h8l1.8-6H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="15.5" r="1.2" fill="currentColor" />
              <circle cx="13.5" cy="15.5" r="1.2" fill="currentColor" />
            </svg>
          </span>
        </div>
        <div className="bg-gradient-to-b from-brand-100 to-white px-4 pt-5 pb-4">
          <p className="text-[20px] leading-6 font-bold text-fg">
            Your Trail.
            <br />
            Our Gear.
          </p>
          <div className="mt-4 flex gap-1.5">
            {["Shop all", "Color", "Size", "Type", "Price"].map((f) => (
              <span
                key={f}
                className="rounded border border-line bg-white px-1.5 py-1 text-ui leading-3 text-fg-secondary"
              >
                {f}
              </span>
            ))}
          </div>
          <p className="mt-3 text-ui leading-3 font-medium text-fg-secondary">
            Products
          </p>
          <div className="mt-1.5 grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-14 rounded-md bg-gradient-to-b from-brand-100 to-brand-200"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating traffic reading. */}
      <div className="absolute right-[6%] bottom-[18%] w-[38%] rounded-xl bg-white/95 p-3 shadow-e5">
        <p className="text-ui leading-4 text-fg-secondary">Page views</p>
        <p className="flex items-baseline gap-1">
          <span className="text-[20px] leading-7 font-semibold text-fg">1.934</span>
          {/* A positive delta reads as success, not as the dark-band accent. */}
          <span className="text-ui leading-4 font-medium text-success">+32%</span>
        </p>
        <svg
          viewBox="0 0 100 28"
          className="mt-1 h-7 w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ch-views" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d="M0 24 L18 20 L34 22 L52 13 L70 15 L86 7 L100 4 L100 28 L0 28 Z"
            fill="url(#ch-views)"
          />
          <path
            d="M0 24 L18 20 L34 22 L52 13 L70 15 L86 7 L100 4"
            fill="none"
            strokeWidth="1.4"
            className="stroke-primary"
          />
        </svg>
      </div>
    </div>
  );
}

/** Icon chip used by the three "what is cloud hosting" cards. */
export function IconChip({
  icon: Icon,
}: {
  icon: (p: { className?: string }) => React.ReactNode;
}) {
  return (
    <span className="grid size-10 place-items-center rounded-md bg-black/5 text-fg">
      <Icon className="size-6" />
    </span>
  );
}

/**
 * "WordPress tools, built in" media.
 *
 * The reference puts a stock portrait here with two floating app chips over it.
 * We have no equivalent licensed portrait, so the chips carry the card on their
 * own against the gradient — the composition (two chips, offset, one large one
 * small) is preserved.
 */
export function WordPressField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none relative", className)}>
      <span className="absolute top-[38%] right-[34%] grid size-14 place-items-center rounded-2xl bg-primary shadow-e4">
        <svg viewBox="0 0 24 24" className="size-8 text-white">
          <path
            fill="currentColor"
            d="M12 2.5A9.5 9.5 0 1 0 21.5 12A9.51 9.51 0 0 0 12 2.5Zm-8.44 9.5a8.4 8.4 0 0 1 .73-3.44l4.02 11A8.44 8.44 0 0 1 3.56 12ZM12 20.44a8.4 8.4 0 0 1-2.38-.34l2.53-7.35 2.59 7.1a8.4 8.4 0 0 1-2.74.59Zm1.16-12.4c.51-.03.96-.08.96-.08.27-.03.24-.46-.03-.44 0 0-.82.06-1.35.06-.5 0-1.33-.06-1.33-.06-.28-.02-.31.42-.04.44 0 0 .43.05.88.08l1.37 3.75-1.92 5.76-3.2-9.51c.51-.03.96-.08.96-.08.27-.03.24-.46-.03-.44 0 0-.82.06-1.35.06h-.36A8.43 8.43 0 0 1 18.6 6.33h-.1a1.39 1.39 0 0 0-1.34 1.42c0 .68.39 1.25.8 1.93a4.3 4.3 0 0 1 .68 2.26 9.94 9.94 0 0 1-.64 2.64l-.84 2.8-3.03-9.34Zm4.98 10.5 2.48-7.18a7.5 7.5 0 0 0 .23-2.38 8.42 8.42 0 0 1-2.71 9.56Z"
          />
        </svg>
      </span>
      <span className="absolute top-[62%] right-[12%] grid size-12 place-items-center rounded-xl bg-white shadow-e4">
        <svg viewBox="0 0 24 24" fill="none" className="size-6 text-primary">
          <path
            d="M10 4.5a1.7 1.7 0 1 1 3.4 0V6h2.6a1 1 0 0 1 1 1v2.6h1.5a1.7 1.7 0 1 1 0 3.4H17V16a1 1 0 0 1-1 1h-2.6v1.5a1.7 1.7 0 1 1-3.4 0V17H7.4a1 1 0 0 1-1-1v-3h1.1a1.7 1.7 0 1 0 0-3.4H6.4V7a1 1 0 0 1 1-1H10V4.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

/** "Free, done-for-you migration" media — a transfer in flight. */
export function MigrationPanel({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative overflow-hidden", className)}>
      <span className="absolute top-8 right-8 grid size-12 place-items-center rounded-xl bg-primary shadow-e4">
        <svg viewBox="0 0 24 24" fill="none" className="size-6 text-white">
          <path
            d="M4 9h13m0 0l-3-3m3 3l-3 3M20 15H7m0 0l3-3m-3 3l3 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="absolute top-8 right-24 w-[300px] rounded-xl bg-white/95 p-4 shadow-e5">
        <p className="text-[13px] leading-5 font-semibold text-fg">
          Migration in progress
        </p>
        <p className="text-ui leading-4 text-fg-secondary">2.3GB out of 3GB</p>
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink-100">
          <span className="block h-full w-[76%] rounded-full bg-primary" />
        </span>
        <div className="mt-3 grid grid-cols-2 gap-y-1.5">
          {["Products", "Orders", "Media", "Customers"].map((k) => (
            <span
              key={k}
              className="flex items-center gap-1.5 text-ui leading-4 text-fg"
            >
              <Check className="size-3 text-primary" />
              {k}
            </span>
          ))}
        </div>
      </div>
      {/* The pale card peeking out from behind, as on the reference. */}
      <span className="absolute top-14 right-[420px] h-14 w-40 rounded-lg bg-white/25" />
    </div>
  );
}
