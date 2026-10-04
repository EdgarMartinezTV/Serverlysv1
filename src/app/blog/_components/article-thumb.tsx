import { cn } from "@/lib/utils";

/**
 * A coded thumbnail per article category (2026-10-03). Each one is a small,
 * legible product moment for the subject — a PageSpeed dial for Performance,
 * a padlock check for Security — so the blog grid reads like a real
 * publication instead of a wall of identical text cards. Decorative only:
 * every thumbnail is aria-hidden and carries no claim about the article.
 */
export function ArticleThumb({
  category,
  className,
  size = "md",
}: {
  category: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const big = size === "lg";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative isolate flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br",
        TONE[category] ?? TONE.default,
        className,
      )}
    >
      <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-white/10 [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]" />
      <div className={cn("rounded-xl bg-white shadow-e4", big ? "w-[62%] p-5" : "w-[70%] p-3")}>
        <Scene category={category} big={big} />
      </div>
    </div>
  );
}

const TONE: Record<string, string> = {
  Hosting: "from-brand-500 to-brand-700",
  Performance: "from-brand-300 to-brand-500",
  Security: "from-brand-700 to-brand-950",
  WordPress: "from-brand-400 to-brand-600",
  Domains: "from-brand-200 to-brand-400",
  "Getting started": "from-brand-300 to-brand-600",
  Ecommerce: "from-brand-500 to-brand-800",
  AI: "from-brand-600 to-brand-900",
  default: "from-brand-400 to-brand-700",
};

function Tick() {
  return (
    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-success-fill text-white">
      <svg viewBox="0 0 16 16" fill="none" className="size-2.5">
        <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Scene({ category, big }: { category: string; big: boolean }) {
  const t = big ? "text-small" : "text-[10px]";
  switch (category) {
    case "Performance":
      return (
        <div className="flex items-center gap-3">
          <div className={cn("relative shrink-0", big ? "size-16" : "size-10")}>
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-canvas-secondary)" strokeWidth="11" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-success-fill)" strokeWidth="11" strokeDasharray="241 252" strokeLinecap="round" />
            </svg>
            <span className={cn("absolute inset-0 flex items-center justify-center font-semibold text-success", big ? "text-body-lg" : "text-[12px]")}>96</span>
          </div>
          <div className={cn("min-w-0", t)}>
            <p className="font-semibold text-fg">PageSpeed</p>
            <p className="text-fg-muted">LCP 1.2 s · CLS 0.01</p>
          </div>
        </div>
      );
    case "Security":
      return (
        <div className={cn("flex flex-col gap-1.5", t)}>
          {["SSL certificate", "Firewall", "Malware scan"].map((r) => (
            <p key={r} className="flex items-center justify-between gap-2 text-fg">
              {r}
              <Tick />
            </p>
          ))}
        </div>
      );
    case "WordPress":
      return (
        <div className={cn("flex items-center gap-2.5", t)}>
          <span className={cn("inline-flex shrink-0 items-center justify-center rounded-full border-2 border-fg font-bold text-fg", big ? "size-10 text-body-lg" : "size-7 text-[12px]")}>W</span>
          <div>
            <p className="font-semibold text-fg">Updated to 6.8</p>
            <p className="text-fg-muted">Backup taken first</p>
          </div>
        </div>
      );
    case "Domains":
      return (
        <p className={cn("flex items-center gap-2 text-fg", big ? "text-h4" : "text-small")}>
          <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0 text-primary", big ? "size-6" : "size-4")}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span className="truncate">
            yourbrand<span className="font-semibold">.com</span>
          </span>
        </p>
      );
    case "Ecommerce":
      return (
        <div className={cn("flex items-center justify-between gap-2", t)}>
          <span>
            <span className="block font-semibold text-fg">New order #1042</span>
            <span className="text-fg-muted">2 items · paid</span>
          </span>
          <span className="font-semibold text-fg">$50.00</span>
        </div>
      );
    case "AI":
      return (
        <div className={cn("flex flex-col gap-1.5", t)}>
          <p className="ml-auto w-fit rounded-lg rounded-br-sm bg-primary px-2 py-1 text-white">Open on Sunday?</p>
          <p className="w-fit rounded-lg rounded-bl-sm bg-canvas-secondary px-2 py-1 text-fg">Yes, 9am to 1pm.</p>
        </div>
      );
    case "Getting started":
      return (
        <div className={cn("flex flex-col gap-1.5", t)}>
          {[["Pick a plan", true], ["Point the domain", true], ["Launch", false]].map(([s, d]) => (
            <p key={s as string} className="flex items-center gap-2 text-fg">
              {d ? <Tick /> : <span className="size-4 shrink-0 rounded-full border-2 border-brand-200" />}
              {s}
            </p>
          ))}
        </div>
      );
    default:
      return (
        <div className={cn("flex flex-col", big ? "gap-3" : "gap-2", t)}>
          <p className="flex items-center justify-between font-semibold text-fg">
            yoursite.com
            <span className="flex items-center gap-1 font-medium text-success">
              <span className="size-1.5 rounded-full bg-success-fill" />
              Online
            </span>
          </p>
          <div className={cn("flex items-end gap-1", big ? "h-12" : "h-7")}>
            {[40, 55, 45, 70, 60, 85, 75, 92].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} className={cn("flex-1 rounded-sm", i === 7 ? "bg-primary" : "bg-brand-200")} />
            ))}
          </div>
          {big && (
            <div className="grid grid-cols-3 gap-2 border-t border-line-subtle pt-3">
              {[["SSL", "Active"], ["Storage", "NVMe"], ["Backups", "Daily"]].map(([k, v]) => (
                <span key={k}>
                  <span className="block text-micro text-fg-muted">{k}</span>
                  <span className="font-semibold text-fg">{v}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      );
  }
}
