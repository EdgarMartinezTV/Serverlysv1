import { AppFrame } from "./frame";
import { NavIcon } from "@/components/navigation/nav-icons";
import { cn } from "@/lib/utils";

/**
 * Serverlys control panel.
 *
 * The single most important visual on the site: it is the thing a customer
 * would actually log into, and its absence was the largest finding in the gap
 * analysis — the page described software without ever showing any.
 *
 * Deliberately dense. Real panels carry navigation, several data regions and
 * a working list; three statistics in a box reads as a diagram.
 *
 * Figures are illustrative of SHAPE, not measurements, and none of them is a
 * claim: no uptime percentage, no customer count, no revenue.
 */
const NAV = [
  { label: "Overview", icon: <NavIcon name="gauge" /> },
  { label: "Websites", icon: <NavIcon name="layout" /> },
  { label: "Domains", icon: <NavIcon name="globe" /> },
  { label: "AI agents", icon: <NavIcon name="sparkles" /> },
  { label: "Automations", icon: <NavIcon name="bolt" /> },
  { label: "Email", icon: <NavIcon name="mail" /> },
  { label: "Support", icon: <NavIcon name="lifebuoy" /> },
] as const;

const SITES = [
  ["hartley-bakery.com", "Turbo Cloud", "ok", "1.2k"],
  ["northshore-dental.co", "WordPress", "ok", "840"],
  ["studio-mfa.com", "Turbo Cloud", "build", "2.6k"],
  ["kerr-supplies.com", "Ecommerce", "ok", "5.1k"],
] as const;

export function DashboardMock({ className }: { className?: string }) {
  return (
    <AppFrame
      nav={NAV}
      active="Overview"
      title="Overview"
      action="Add website"
      className={className}
    >
      {/* Metric row */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {[
          ["Websites", "4", "of unlimited"],
          ["Domains", "6", "2 renewing"],
          ["AI agents", "2", "answering"],
          ["Automations", "5", "running"],
        ].map(([label, value, sub]) => (
          <div key={label} className="rounded-lg bg-canvas-secondary p-2.5">
            <p className="font-mono text-[0.5625rem] uppercase text-fg-muted">{label}</p>
            <p className="tabular mt-1 text-h4 leading-none text-fg">{value}</p>
            <p className="mt-1 text-[0.625rem] text-fg-muted">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        {/* Sites table — the working list that makes it read as software */}
        <div className="overflow-hidden rounded-lg ring-1 ring-line-subtle">
          <div className="flex items-center justify-between border-b border-line-subtle bg-canvas-secondary px-3 py-1.5">
            <span className="text-[0.625rem] font-semibold text-fg">Websites</span>
            <span className="font-mono text-[0.5625rem] text-fg-muted">Last 24h</span>
          </div>
          <table className="w-full">
            <tbody>
              {SITES.map(([domain, plan, state, visits]) => (
                <tr key={domain} className="border-b border-line-subtle last:border-0">
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          state === "ok" ? "bg-success-fill" : "bg-warning-fill",
                        )}
                      />
                      <span className="truncate font-mono text-[0.625rem] text-fg">
                        {domain}
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-2 text-right">
                    <span className="rounded bg-canvas-inset px-1.5 py-0.5 text-[0.5625rem] text-fg-secondary">
                      {plan}
                    </span>
                  </td>
                  <td className="tabular px-3 py-2 text-right text-[0.625rem] text-fg-secondary">
                    {visits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Traffic + activity */}
        <div className="flex flex-col gap-3">
          <div className="rounded-lg bg-canvas-secondary p-3">
            <p className="font-mono text-[0.5625rem] uppercase text-fg-muted">
              Requests · 24h
            </p>
            <svg viewBox="0 0 120 40" className="mt-2 h-12 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 30 L12 26 L24 31 L36 18 L48 22 L60 12 L72 17 L84 9 L96 14 L108 7 L120 11 V40 H0 Z"
                fill="url(#dashFill)"
              />
              <path
                d="M0 30 L12 26 L24 31 L36 18 L48 22 L60 12 L72 17 L84 9 L96 14 L108 7 L120 11"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <ul className="flex flex-col gap-1.5">
            {[
              ["Backup completed", "02:00", "success"],
              ["ConvoAI handled 12 chats", "09:14", "brand"],
              ["SSL renewed · kerr-supplies", "yesterday", "success"],
            ].map(([text, when, tone]) => (
              <li
                key={text}
                className="flex items-center gap-2 rounded-lg bg-canvas-secondary px-2.5 py-1.5"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    tone === "success" ? "bg-success-fill" : "bg-primary",
                  )}
                />
                <span className="min-w-0 flex-1 truncate text-[0.625rem] text-fg-secondary">
                  {text}
                </span>
                <span className="font-mono text-[0.5625rem] text-fg-muted">{when}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppFrame>
  );
}
