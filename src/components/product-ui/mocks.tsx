import { AppFrame, BrowserFrame, PhoneFrame } from "./frame";
import { NavIcon } from "@/components/navigation/nav-icons";
import { cn } from "@/lib/utils";
import { MockPhoto } from "@/components/ui/mock-photo";

/**
 * Serverlys product interfaces.
 *
 * Built in HTML/CSS/SVG: resolution-independent, weightless, cannot 404, and —
 * unlike stock screenshots — they depict the actual products.
 *
 * Rules that apply to every mock here:
 *  · Decorative. Copy beside them carries the meaning; all are aria-hidden.
 *  · Illustrative of shape, never a measurement. No uptime percentage, no
 *    customer count, no revenue figure appears anywhere.
 *  · Real chrome. Navigation, tabs, states and a working list — that is what
 *    separates software from a statistics panel.
 */

const HOSTING_NAV = [
  { label: "Overview", icon: <NavIcon name="gauge" /> },
  { label: "Files", icon: <NavIcon name="layout" /> },
  { label: "Databases", icon: <NavIcon name="server" /> },
  { label: "Backups", icon: <NavIcon name="shield" /> },
  { label: "SSL", icon: <NavIcon name="shield" /> },
  { label: "Domains", icon: <NavIcon name="globe" /> },
] as const;

/** Hosting control panel: resources, security posture, recent backups. */
export function HostingMock({ className }: { className?: string }) {
  return (
    <AppFrame
      nav={HOSTING_NAV}
      active="Overview"
      title="hartley-bakery.com"
      action="Open cPanel"
      className={className}
    >
      <div className="grid grid-cols-3 gap-2.5">
        {[
          ["CPU", "18%", 18],
          ["Memory", "1.4 / 5 GB", 28],
          ["Storage", "6.2 GB", 12],
        ].map(([label, value, pct]) => (
          <div key={label as string} className="rounded-lg bg-canvas-secondary p-2.5">
            <p className="text-ui text-fg-muted font-semibold">{label}</p>
            <p className="tabular mt-1 text-small font-semibold text-fg">{value}</p>
            <span className="mt-2 block h-1 overflow-hidden rounded-full bg-line">
              <span
                style={{ width: `${pct as number}%` }}
                className="block h-full rounded-full bg-primary"
              />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg ring-1 ring-line-subtle">
          <p className="border-b border-line-subtle px-3 py-1.5 text-ui font-semibold text-fg">
            Security
          </p>
          <ul className="p-2">
            {[
              ["SSL certificate", "Valid · renews in 61 days"],
              ["Malware scan", "Clean · 04:00 today"],
              ["Firewall", "Active"],
            ].map(([k, v]) => (
              <li key={k} className="flex items-center gap-2 px-1 py-1.5">
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-success-fill text-white">
                  <svg viewBox="0 0 16 16" className="h-2 w-2">
                    <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-ui text-fg">{k}</span>
                <span className="ml-auto truncate text-ui text-fg-muted">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg ring-1 ring-line-subtle">
          <p className="border-b border-line-subtle px-3 py-1.5 text-ui font-semibold text-fg">
            Backups
          </p>
          <ul className="p-2">
            {["Today 02:00", "Yesterday 02:00", "2 days ago 02:00"].map((d, i) => (
              <li key={d} className="flex items-center gap-2 px-1 py-1.5">
                <span className="font-mono text-ui text-fg-muted">{d}</span>
                <span
                  className={cn(
                    "ml-auto rounded px-1.5 py-0.5 text-ui font-medium",
                    i === 0 ? "bg-primary/10 text-primary" : "bg-canvas-inset text-fg-secondary",
                  )}
                >
                  Restore
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppFrame>
  );
}

/** Domain search results, mirroring the real tool on /register-domain. */
export function DomainMock({ className }: { className?: string }) {
  const rows = [
    [".com", "$14.95", "available"],
    [".eu", "$9.95", "available"],
    [".io", "—", "not sold"],
    [".net", "$16.95", "available"],
    [".org", "$16.95", "taken"],
  ] as const;
  return (
    <BrowserFrame url="serverlys.com/register-domain" className={className}>
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2.5 rounded-lg bg-canvas-secondary px-3 py-2.5 ring-1 ring-line">
          <NavIcon name="globe" className="h-4 w-4 shrink-0 text-fg-muted" />
          <span className="flex-1 text-small text-fg">hartleybakery</span>
          <span className="rounded-md bg-primary px-3 py-1.5 text-ui font-medium text-white">
            Search
          </span>
        </div>
        <ul className="mt-3 flex flex-col gap-1.5">
          {rows.map(([tld, price, state]) => (
            <li
              key={tld}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2",
                state === "available" ? "bg-success-soft" : "bg-canvas-secondary",
              )}
            >
              <span className="font-mono text-ui text-fg">
                hartleybakery<span className="font-semibold">{tld}</span>
              </span>
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "text-ui font-semibold",
                    state === "available" ? "text-success" : "text-fg-muted",
                  )}
                >
                  {state}
                </span>
                <span className="tabular text-ui font-semibold text-fg">{price}</span>
                {state === "available" && (
                  <span className="rounded bg-primary px-2 py-0.5 text-ui font-medium text-white">
                    Add
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </BrowserFrame>
  );
}

/** ConvoAI: a conversation that ends in a captured booking. */
export function ChatMock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-xl bg-surface shadow-e5 ring-1 ring-line",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line-subtle px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-small font-bold text-white">
          C
        </span>
        <div className="min-w-0">
          <p className="text-small font-semibold text-fg">ConvoAI</p>
          <p className="flex items-center gap-1.5 text-caption text-fg-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success-fill" />
            Answering · hartley-bakery.com
          </p>
        </div>
        <span className="ml-auto rounded-full bg-primary-soft px-2 py-0.5 text-ui text-primary font-semibold">
          Live
        </span>
      </div>

      <div className="flex flex-col gap-2.5 p-4">
        <p className="max-w-[82%] rounded-2xl rounded-tl-md bg-canvas-secondary px-3.5 py-2 text-small text-fg-secondary">
          Do you do birthday cakes at short notice?
        </p>
        <p className="ml-auto max-w-[82%] rounded-2xl rounded-tr-md bg-primary px-3.5 py-2 text-small text-white">
          We can do 48 hours&rsquo; notice. What date were you thinking?
        </p>
        <p className="max-w-[82%] rounded-2xl rounded-tl-md bg-canvas-secondary px-3.5 py-2 text-small text-fg-secondary">
          Saturday, for 20 people
        </p>
        <p className="ml-auto max-w-[82%] rounded-2xl rounded-tr-md bg-primary px-3.5 py-2 text-small text-white">
          That works. Shall I take your name and number?
        </p>

        {/* The outcome — the thing the gap analysis said we never showed */}
        <div className="mt-1 rounded-lg bg-success-soft p-3 ring-1 ring-inset ring-success/20">
          <p className="flex items-center gap-1.5 text-ui text-success font-semibold">
            <NavIcon name="shield" className="h-3 w-3" />
            Lead captured
          </p>
          <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
            {[
              ["Name", "R. Whitfield"],
              ["Order", "Cake · 20 people"],
              ["Date", "Saturday"],
              ["Sent to", "Email + panel"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className="text-ui text-fg-muted">{k}</dt>
                <dd className="text-ui font-medium text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

/** CallFlow: an in-progress call with a live transcript. */
export function CallMock({ className }: { className?: string }) {
  return (
    <PhoneFrame className={className}>
      <div className="flex flex-col items-center">
        <span className="text-ui text-fg-muted font-semibold">
          Incoming · 00:42
        </span>
        <span className="mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <NavIcon name="phone" />
        </span>
        <p className="mt-2 text-small font-semibold text-fg">+1 (305) 555-0148</p>
        <p className="text-ui text-fg-muted">Answered by CallFlow</p>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        {[
          ["caller", "Are you open on Sunday?"],
          ["agent", "We are — 10 to 4."],
          ["caller", "Can I book a table for six?"],
          ["agent", "Booking that now."],
        ].map(([who, text], i) => (
          <p
            key={i}
            className={cn(
              "max-w-[88%] rounded-xl px-2.5 py-1.5 text-ui",
              who === "agent"
                ? "ml-auto rounded-tr-sm bg-primary text-white"
                : "rounded-tl-sm bg-canvas-secondary text-fg-secondary",
            )}
          >
            {text}
          </p>
        ))}
      </div>

      <div className="mt-3 rounded-lg bg-success-soft px-2.5 py-2">
        <p className="text-ui text-success font-semibold">Booked</p>
        <p className="mt-0.5 text-ui font-medium text-fg">Sunday 13:00 · 6 covers</p>
      </div>
    </PhoneFrame>
  );
}

/** Automation workflow: trigger → AI → branch → actions. */
export function AutomationMock({ className }: { className?: string }) {
  const nodes = [
    { label: "New enquiry", sub: "Trigger · ConvoAI", icon: "chat", tone: "brand" },
    { label: "Classify intent", sub: "AI", icon: "sparkles", tone: "accent" },
    { label: "Create record", sub: "Action", icon: "book", tone: "plain" },
    { label: "Notify owner", sub: "Action · Email", icon: "mail", tone: "plain" },
  ] as const;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-canvas-abyss p-5 shadow-e5 ring-1 ring-inset ring-white/10",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-micro text-fg-on-dark-muted font-semibold">
          Enquiry workflow
        </p>
        <span className="flex items-center gap-1.5 rounded-full bg-success-fill/15 px-2 py-0.5 text-ui text-success-fill font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-success-fill" />
          Running
        </span>
      </div>

      <ol className="mt-4 flex flex-col">
        {nodes.map((n, i) => (
          <li key={n.label}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-3 ring-1 ring-inset",
                n.tone === "accent"
                  ? "bg-cyan-400/10 ring-cyan-400/30"
                  : n.tone === "brand"
                    ? "bg-primary/15 ring-primary/30"
                    : "bg-white/[0.05] ring-white/10",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                  n.tone === "accent"
                    ? "bg-cyan-400 text-canvas-abyss"
                    : n.tone === "brand"
                      ? "bg-primary text-white"
                      : "bg-white/10 text-fg-on-dark-secondary",
                )}
              >
                <NavIcon name={n.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-small font-medium text-white">{n.label}</span>
                <span className="block text-ui text-fg-on-dark-muted font-semibold">
                  {n.sub}
                </span>
              </span>
            </div>
            {i < nodes.length - 1 && (
              <span className="ml-[1.9rem] block h-4 w-px bg-white/20" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** SEO: rankings movement and a technical checklist. */
export function SeoMock({ className }: { className?: string }) {
  const rows = [
    ["bakery near me", 3, "+4"],
    ["birthday cakes hartley", 1, "+2"],
    ["gluten free bakery", 7, "+11"],
    ["wedding cakes", 12, "-1"],
  ] as const;
  return (
    <BrowserFrame url="serverlys.com/seo" className={className}>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-small font-semibold text-fg">Rankings</p>
          <span className="font-mono text-caption text-fg-muted">Last 30 days</span>
        </div>
        <table className="mt-3 w-full">
          <tbody>
            {rows.map(([term, pos, delta]) => {
              const up = String(delta).startsWith("+");
              return (
                <tr key={term} className="border-b border-line-subtle last:border-0">
                  <td className="py-2 text-ui text-fg">{term}</td>
                  <td className="tabular py-2 text-right text-ui font-semibold text-fg">
                    #{pos}
                  </td>
                  <td className="py-2 pl-3 text-right">
                    <span
                      className={cn(
                        "tabular rounded px-1.5 py-0.5 text-ui font-medium",
                        up ? "bg-success-soft text-success" : "bg-canvas-inset text-fg-secondary",
                      )}
                    >
                      {delta}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["Core Web Vitals", "Pass"],
            ["Indexed", "48 / 48"],
            ["Broken links", "0"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-canvas-secondary p-2.5">
              <p className="text-ui text-fg-muted">{k}</p>
              <p className="mt-0.5 text-ui font-semibold text-fg">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

/** Website design: a rendered site preview inside browser chrome. */
export function SitePreviewMock({ className }: { className?: string }) {
  return (
    <BrowserFrame url="hartley-bakery.com" className={className}>
      <div className="bg-canvas-secondary">
        {/* Site header */}
        <div className="flex items-center justify-between border-b border-line-subtle bg-surface px-4 py-2.5">
          <span className="font-display text-ui font-bold uppercase tracking-[0.14em] text-fg">
            Hartley
          </span>
          <span className="hidden gap-3 sm:flex">
            {["Menu", "Order", "Visit"].map((l) => (
              <span key={l} className="text-ui text-fg-muted">
                {l}
              </span>
            ))}
          </span>
          <span className="rounded bg-fg px-2 py-0.5 text-ui font-medium text-white">
            Order
          </span>
        </div>
        {/* Site hero */}
        <div className="relative overflow-hidden px-5 py-7">
          <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_20%_0%,rgb(199_122_9/0.16)_0%,transparent_70%)]" />
          <div className="relative">
            <p className="max-w-[16rem] font-display text-h4 leading-tight text-fg">
              Bread, cakes and very good coffee.
            </p>
            <p className="mt-1.5 max-w-[14rem] text-ui text-fg-secondary">
              Baked on site every morning since 2011.
            </p>
            <span className="mt-3 inline-block rounded-md bg-fg px-2.5 py-1 text-ui font-medium text-white">
              See the menu
            </span>
          </div>
        </div>
        {/* Product row */}
        <div className="grid grid-cols-3 gap-1.5 px-5 pb-5">
          {(
            [
              ["Sourdough", "bread"],
              ["Rye", "bread-sliced"],
              ["Coffee", "coffee"],
            ] as const
          ).map(([label, photo]) => (
            <div key={label} className="overflow-hidden rounded-md bg-surface ring-1 ring-line-subtle">
              <MockPhoto src={photo} className="h-10" sizes="120px" />
              <p className="px-1.5 py-1 text-ui text-fg-secondary">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}
