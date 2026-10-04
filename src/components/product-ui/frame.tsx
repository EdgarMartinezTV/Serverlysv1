import { cn } from "@/lib/utils";

/**
 * Product framing.
 *
 * The gap analysis found our mockups read as diagrams rather than software,
 * partly because nothing was framed — no window, no chrome, no sense of an
 * application. These wrappers supply that.
 *
 * All framing is decorative: the copy beside a mock carries the meaning, so
 * frames are aria-hidden and mocks must never be the only place information
 * appears.
 */

export function BrowserFrame({
  url,
  children,
  className,
  tone = "light",
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-xl shadow-e5",
        dark
          ? "bg-surface-dark-elevated ring-1 ring-inset ring-white/10"
          : "bg-surface ring-1 ring-line",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b px-3.5 py-2.5",
          dark ? "border-white/10 bg-white/[0.03]" : "border-line-subtle bg-canvas-secondary",
        )}
      >
        <span className="flex gap-1.5">
          {["bg-red-500/45", "bg-amber-500/45", "bg-green-500/45"].map((c) => (
            <span key={c} className={cn("h-2.5 w-2.5 rounded-full", c)} />
          ))}
        </span>
        <span
          className={cn(
            "ml-2 flex-1 truncate rounded-md px-2.5 py-1 font-mono text-caption",
            dark
              ? "bg-black/30 text-fg-on-dark-muted ring-1 ring-inset ring-white/8"
              : "bg-surface text-fg-muted ring-1 ring-line-subtle",
          )}
        >
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

/**
 * Application shell — sidebar + topbar + content.
 *
 * This is the chrome that was missing. Software has navigation; a panel of
 * statistics does not.
 */
export function AppFrame({
  nav,
  active,
  title,
  action,
  children,
  className,
}: {
  nav: ReadonlyArray<{ label: string; icon: React.ReactNode }>;
  active: string;
  title: string;
  action?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-xl bg-surface shadow-e5 ring-1 ring-line",
        className,
      )}
    >
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-[8.5rem] shrink-0 flex-col gap-0.5 border-r border-line-subtle bg-canvas-secondary p-2.5 sm:flex">
          <span className="mb-2 px-2 text-ui text-fg-muted font-semibold">
            Serverlys
          </span>
          {nav.map((item) => (
            <span
              key={item.label}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-ui",
                item.label === active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-fg-muted",
              )}
            >
              <span className="shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-line-subtle px-4 py-2.5">
            <span className="text-small font-semibold text-fg">{title}</span>
            {action && (
              <span className="rounded-md bg-primary px-2.5 py-1 text-ui font-medium text-white">
                {action}
              </span>
            )}
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** A phone, for the voice product. */
export function PhoneFrame({
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
        "w-[15rem] shrink-0 overflow-hidden rounded-[1.75rem] bg-canvas-abyss p-2 shadow-e5 ring-1 ring-inset ring-white/15",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.375rem] bg-surface">
        <span className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-fg/15" />
        <div className="px-3.5 pb-4 pt-7">{children}</div>
      </div>
    </div>
  );
}
