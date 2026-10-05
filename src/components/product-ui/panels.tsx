import { cn } from "@/lib/utils";

/**
 * Serverlys product-UI panels.
 *
 * Built in HTML/CSS/SVG rather than shipped as screenshots: they stay crisp at
 * any density, weigh nothing, cannot 404, and — importantly — depict the real
 * product surfaces (cPanel-style hosting, domain search, ConvoAI, uptime,
 * migration) rather than a generic dashboard.
 *
 * Every figure is illustrative and labelled as such where it could be mistaken
 * for live data. No invented uptime percentage or customer count appears.
 *
 * These are decorative: each is aria-hidden and the surrounding section
 * supplies the meaning in text.
 */

function Chrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-line-subtle bg-canvas-secondary px-3 py-2">
      <span className="flex gap-1" aria-hidden="true">
        {["bg-red-500/50", "bg-amber-500/50", "bg-green-500/50"].map((c) => (
          <span key={c} className={cn("h-2 w-2 rounded-full", c)} />
        ))}
      </span>
      <span className="ml-1 truncate rounded bg-surface px-2 py-0.5 font-mono text-ui text-fg-muted ring-1 ring-line-subtle">
        {label}
      </span>
    </div>
  );
}

function Shell({
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
        "overflow-hidden rounded-xl bg-surface shadow-e4 ring-1 ring-line",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Hosting control panel — resource usage at a glance. */
export function HostingPanel({ className }: { className?: string }) {
  const bars = [42, 58, 35, 71, 49, 63, 38];
  return (
    <Shell className={className}>
      <Chrome label="serverlys.com" />
      <div className="p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-ui font-semibold text-fg">Cloud · Turbo</span>
          <span className="rounded-full bg-success-soft px-1.5 py-0.5 text-ui text-success font-semibold">
            Live
          </span>
        </div>
        <dl className="mt-2.5 grid grid-cols-3 gap-1.5">
          {[
            ["CPU", "18%"],
            ["RAM", "1.4 GB"],
            ["Disk", "6.2 GB"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md bg-canvas-secondary px-1.5 py-1">
              <dt className="text-ui text-fg-muted font-semibold">{k}</dt>
              <dd className="tabular text-ui font-semibold text-fg">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex h-9 items-end gap-1">
          {bars.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 rounded-sm bg-primary/25 [&:nth-child(4)]:bg-primary"
            />
          ))}
        </div>
      </div>
    </Shell>
  );
}

/** Domain search — mirrors the real search on /register-domain. */
export function DomainPanel({ className }: { className?: string }) {
  return (
    <Shell className={className}>
      <div className="p-3.5">
        <div className="flex items-center gap-1.5 rounded-lg bg-canvas-secondary px-2 py-1.5 ring-1 ring-line">
          <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0 text-fg-muted">
            <circle
              cx="7"
              cy="7"
              r="4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="m10.5 10.5 3 3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-ui text-fg">yourbusiness</span>
        </div>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {[
            [".com", "$14.95", true],
            [".net", "$16.95", true],
            [".org", "—", false],
          ].map(([tld, price, free]) => (
            <li
              key={tld as string}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5",
                free ? "bg-success-soft" : "bg-canvas-secondary",
              )}
            >
              <span className="font-mono text-ui text-fg">{tld}</span>
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "text-ui font-semibold",
                    free ? "text-success" : "text-fg-muted",
                  )}
                >
                  {free ? "Available" : "Taken"}
                </span>
                <span className="tabular text-ui font-semibold text-fg">
                  {price}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}

/** ConvoAI — the real Serverlys AI chat product. */
export function ConvoPanel({ className }: { className?: string }) {
  return (
    <Shell className={className}>
      <div className="flex items-center gap-2 border-b border-line-subtle px-3 py-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-ui font-bold text-white">
          C
        </span>
        <span className="text-ui font-semibold text-fg">ConvoAI</span>
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-success-fill" />
      </div>
      <div className="flex flex-col gap-2 p-3.5">
        <p className="max-w-[85%] rounded-lg rounded-tl-sm bg-canvas-secondary px-2 py-1.5 text-ui text-fg-secondary">
          Do you take bookings on Sundays?
        </p>
        <p className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-primary px-2 py-1.5 text-ui text-white">
          We do — 10am to 4pm. Shall I book you in?
        </p>
        <span className="flex gap-1 pl-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-fg-muted/50" />
          ))}
        </span>
      </div>
    </Shell>
  );
}

/** Uptime / status. Values are illustrative, not live telemetry. */
export function UptimePanel({ className }: { className?: string }) {
  return (
    <Shell className={className}>
      <div className="p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-ui font-semibold text-fg">Status</span>
          <span className="flex items-center gap-1 text-ui text-success font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-success-fill" />
            Operational
          </span>
        </div>
        <svg
          viewBox="0 0 120 34"
          className="mt-3 h-10 w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 24 L15 20 L30 26 L45 14 L60 18 L75 9 L90 15 L105 7 L120 11 V34 H0 Z"
            fill="url(#spark)"
          />
          <path
            d="M0 24 L15 20 L30 26 L45 14 L60 18 L75 9 L90 15 L105 7 L120 11"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-2 flex gap-0.5">
          {Array.from({ length: 22 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-3 flex-1 rounded-[1px]",
                i === 13 ? "bg-warning-fill/60" : "bg-success-fill/50",
              )}
            />
          ))}
        </div>
      </div>
    </Shell>
  );
}

/** Migration progress — the free service, shown as steps. */
export function MigrationPanel({ className }: { className?: string }) {
  const steps = [
    ["Files copied", true],
    ["Database moved", true],
    ["Staging ready", true],
    ["DNS switch", false],
  ] as const;
  return (
    <Shell className={className}>
      <div className="p-3.5">
        <p className="text-ui font-semibold text-fg">Migration</p>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {steps.map(([label, done]) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full",
                  done ? "bg-success-fill text-white" : "bg-canvas-inset text-fg-secondary",
                )}
              >
                {done ? (
                  <svg viewBox="0 0 16 16" className="h-2 w-2">
                    <path
                      d="m3.5 8.5 3 3 6-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="h-1 w-1 rounded-full bg-current" />
                )}
              </span>
              <span
                className={cn(
                  "text-ui",
                  done ? "text-fg-secondary" : "text-fg-muted",
                )}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-md bg-primary-soft px-2 py-1 text-ui text-primary">
          You approve before DNS changes.
        </p>
      </div>
    </Shell>
  );
}
