import { AppFrame } from "./frame";
import { NavIcon } from "@/components/navigation/nav-icons";
import { cn } from "@/lib/utils";

/**
 * Infrastructure-tier visuals.
 *
 * Same rules as mocks.tsx: decorative, aria-hidden, illustrative of shape and
 * never a measurement. Nothing here states a benchmark, an uptime figure or a
 * customer count, because none of those are verified.
 *
 * These exist so the four hosting tiers do not share one picture. A shared
 * plan, a VPS and a dedicated machine are different products, and a page that
 * illustrates all three with the same dashboard is telling the visitor they
 * are the same thing.
 */

/* ── VPS: a root shell ───────────────────────────────────────────────────── */

const SESSION: ReadonlyArray<[kind: "cmd" | "out" | "ok", text: string]> = [
  ["cmd", "ssh root@vps-31.serverlys.net"],
  ["out", "Ubuntu 24.04.1 LTS · 4 vCPU · 8 GB · 160 GB NVMe"],
  ["cmd", "systemctl status nginx"],
  ["ok", "● nginx.service — active (running)"],
  ["cmd", "node -v && psql --version"],
  ["out", "v22.11.0"],
  ["out", "psql (PostgreSQL) 16.4"],
  ["cmd", "ufw status"],
  ["ok", "Status: active · 22/tcp · 80/tcp · 443/tcp"],
];

/** Root shell. The point of a VPS is that you can type in it. */
export function TerminalMock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-xl bg-canvas-abyss shadow-e4 ring-1 ring-inset ring-white/10",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2.5">
        <span className="flex gap-1.5">
          {["bg-error-fill", "bg-warning-fill", "bg-success-fill"].map((c) => (
            <span key={c} className={cn("h-2 w-2 rounded-full opacity-70", c)} />
          ))}
        </span>
        <p className="ml-1 font-mono text-ui text-fg-on-dark-muted">
          root@vps-31 — bash
        </p>
      </div>
      <div className="flex flex-col gap-1 p-3.5 font-mono text-ui leading-relaxed">
        {SESSION.map(([kind, text], i) => (
          <p key={i} className="flex gap-2">
            {kind === "cmd" ? (
              <>
                <span className="shrink-0 text-accent-on-dark">$</span>
                <span className="text-white">{text}</span>
              </>
            ) : (
              <span
                className={cn(
                  "pl-4",
                  kind === "ok" ? "text-success-fill" : "text-fg-on-dark-muted",
                )}
              >
                {text}
              </span>
            )}
          </p>
        ))}
        <p className="flex gap-2">
          <span className="shrink-0 text-accent-on-dark">$</span>
          <span className="inline-block h-3.5 w-1.5 bg-white/70" />
        </p>
      </div>
    </div>
  );
}

/* ── Dedicated: the machine itself ───────────────────────────────────────── */

/** A rack elevation. Hardware you do not share is the entire proposition. */
export function RackMock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-xl bg-canvas-abyss p-4 shadow-e4 ring-1 ring-inset ring-white/10",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-ui text-fg-on-dark-muted font-semibold">
          Cabinet 04 · your machine
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-fill/15 px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success-fill" />
          <span className="text-ui font-semibold uppercase text-success-fill">
            Powered
          </span>
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        {[
          { u: "4U", label: "Your server", mine: true },
          { u: "2U", label: "—", mine: false },
          { u: "1U", label: "—", mine: false },
          { u: "2U", label: "—", mine: false },
        ].map((row, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 ring-1 ring-inset",
              row.mine
                ? "bg-primary/15 ring-primary/40"
                : "bg-white/[0.03] ring-white/5",
            )}
          >
            <span className="font-mono text-ui text-fg-on-dark-muted">{row.u}</span>
            {/* Drive bays. */}
            <span className="flex gap-1">
              {Array.from({ length: 8 }).map((_, d) => (
                <span
                  key={d}
                  className={cn(
                    "h-3 w-1.5 rounded-[1px]",
                    row.mine ? "bg-primary-on-dark/70" : "bg-white/10",
                  )}
                />
              ))}
            </span>
            <span
              className={cn(
                "ml-auto text-ui",
                row.mine ? "font-semibold text-white" : "text-fg-on-dark-muted",
              )}
            >
              {row.label}
            </span>
          </div>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
        {[
          ["CPU", "2× Xeon"],
          ["RAM", "Dedicated"],
          ["Disk", "NVMe RAID"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-ui text-fg-on-dark-muted font-semibold">{k}</dt>
            <dd className="mt-0.5 text-ui font-semibold text-white">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ── Managed: who does what ──────────────────────────────────────────────── */

const DUTIES: ReadonlyArray<[task: string, owner: "us" | "you"]> = [
  ["OS patching", "us"],
  ["Web server config", "us"],
  ["PHP version and limits", "us"],
  ["Backups and restores", "us"],
  ["SSL issue and renew", "us"],
  ["Firewall and hardening", "us"],
  ["Uptime monitoring", "us"],
  ["Your application code", "you"],
  ["Your content", "you"],
];

/** Split-responsibility board. "Managed" means nothing until you see the line. */
export function ResponsibilityMock({ className }: { className?: string }) {
  return (
    <AppFrame
      nav={[
        { label: "Operations", icon: <NavIcon name="wrench" /> },
        { label: "Patching", icon: <NavIcon name="shield" /> },
        { label: "Backups", icon: <NavIcon name="shield" /> },
        { label: "Monitoring", icon: <NavIcon name="gauge" /> },
      ]}
      active="Operations"
      title="Managed operations"
      action="Runbook"
      className={className}
    >
      <div className="grid grid-cols-[1fr_auto] gap-x-3">
        <p className="pb-1.5 text-ui text-fg-muted font-semibold">Task</p>
        <p className="pb-1.5 text-right text-ui text-fg-muted font-semibold">
          Owner
        </p>
        {DUTIES.map(([task, owner]) => (
          <div key={task} className="contents">
            <p className="border-t border-line-subtle py-1.5 text-ui text-fg">
              {task}
            </p>
            <p className="border-t border-line-subtle py-1.5 text-right">
              <span
                className={cn(
                  "inline-flex rounded-full px-1.5 py-0.5 text-ui font-semibold uppercase",
                  owner === "us"
                    ? "bg-success-fill/15 text-success"
                    : "bg-canvas-inset text-fg-secondary",
                )}
              >
                {owner === "us" ? "Serverlys" : "You"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

/* ── Shared: the honest ceiling ──────────────────────────────────────────── */

/** Resource meter showing headroom, and where the tier stops. */
export function SharedLimitsMock({ className }: { className?: string }) {
  return (
    <AppFrame
      nav={[
        { label: "Usage", icon: <NavIcon name="gauge" /> },
        { label: "Sites", icon: <NavIcon name="globe" /> },
        { label: "Email", icon: <NavIcon name="mail" /> },
        { label: "Backups", icon: <NavIcon name="shield" /> },
      ]}
      active="Usage"
      title="Shared plan · usage"
      action="Upgrade"
      className={className}
    >
      <div className="flex flex-col gap-3">
        {[
          ["Visits this month", "Comfortable", 34],
          ["CPU allowance", "Comfortable", 22],
          ["Storage", "Plenty left", 18],
          ["Concurrent processes", "Watch this one", 71],
        ].map(([label, note, pct]) => (
          <div key={label as string}>
            <div className="flex items-baseline justify-between">
              <p className="text-ui font-medium text-fg">{label}</p>
              <p
                className={cn(
                  "text-ui",
                  (pct as number) > 60 ? "text-warning" : "text-fg-muted",
                )}
              >
                {note}
              </p>
            </div>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-line">
              <span
                style={{ width: `${pct as number}%` }}
                className={cn(
                  "block h-full rounded-full",
                  (pct as number) > 60 ? "bg-warning-fill" : "bg-primary",
                )}
              />
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-canvas-secondary px-3 py-2 text-ui text-fg-secondary">
        Approaching a limit tells you it is time to move up — before visitors
        notice, not after.
      </p>
    </AppFrame>
  );
}
