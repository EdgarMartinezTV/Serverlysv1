import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * Page-local building blocks for the hosting family (/hosting, managed,
 * shared, VPS, dedicated, alternatives). Kept here rather than in
 * components/ so the shared section kit stays untouched; the grammar matches
 * the rebuilt product pages (2026-10-03).
 */

/** A section band. `dark` is the brand abyss with a logo-blue glow, never the
    near-black ink of `<Section surface="dark">`. */
export function Band({
  tone = "light",
  id,
  labelledBy,
  className,
  children,
}: {
  tone?: "light" | "subtle" | "dark";
  id?: string;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative isolate scroll-mt-14 overflow-hidden py-16 lg:py-24",
        tone === "light" && "bg-canvas",
        tone === "subtle" && "bg-canvas-secondary",
        tone === "dark" && "bg-canvas-abyss",
        className,
      )}
    >
      {tone === "dark" && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_55%_at_20%_100%,rgb(0_0_255/0.45),transparent_70%),radial-gradient(40%_40%_at_90%_0%,rgb(0_0_255/0.25),transparent_70%)]"
        />
      )}
      <Container width="wide">{children}</Container>
    </section>
  );
}

/** Centred section heading in the shared display style. */
export function Heading({
  id,
  title,
  lede,
  dark = false,
  align = "center",
}: {
  id?: string;
  title: string;
  lede?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-[760px]", align === "center" && "mx-auto text-center")}>
      <h2 id={id} className={cn("display-md", dark ? "text-white" : "text-fg")}>
        {title}
      </h2>
      {lede && (
        <p className={cn("mt-4 text-body-lg", dark ? "text-fg-on-dark-secondary" : "text-fg-secondary")}>
          {lede}
        </p>
      )}
    </div>
  );
}

/** Small sentence-case label pill (replaces mono uppercase captions). */
export function Pill({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: "brand" | "success" | "neutral" | "on-dark" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-md px-2 py-0.5 text-micro font-semibold",
        tone === "brand" && "bg-brand-50 text-primary",
        tone === "success" && "bg-success-soft text-success",
        tone === "neutral" && "bg-canvas-secondary text-fg-secondary",
        tone === "warning" && "bg-warning-soft text-warning",
        tone === "on-dark" && "bg-white/15 text-white",
      )}
    >
      {children}
    </span>
  );
}

/** Green tick in a circle. */
export function Tick() {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success-fill text-white">
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3">
        <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** A pale tiled brand stage, the frame every rebuilt page puts visuals on. */
export function Stage({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative isolate overflow-hidden rounded-3xl bg-brand-50 p-5 sm:p-8", className)}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 grid grid-cols-4 grid-rows-3">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={[1, 4, 6, 11].includes(i) ? "bg-brand-100" : ""} />
        ))}
      </div>
      <div className="drop-shadow-[0_24px_40px_rgb(0_0_60/0.16)]">{children}</div>
    </div>
  );
}
