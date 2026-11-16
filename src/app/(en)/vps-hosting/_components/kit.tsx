import { cn } from "@/lib/utils";

/**
 * Local atoms for /vps-hosting — the reference (hostinger.com/vps-hosting,
 * measured at 1440 on 2026-11-16) uses its own grid on this page, not the
 * 540/768/1600 one in components/ref/kit.tsx:
 *
 *   container 1440 · gutter 80 (40 for the plan row) · bands 48 or 80 tall
 *   h2 48/56 regular, second line in rgb(121,121,128) · body 16/24
 *   secondary text white/75 · cards #101011-ish at r16
 */

export const MUTED = "text-[#79797f]";
export const SOFT = "text-white/75";

export function Wrap({ children, className, narrow }: { children: React.ReactNode; className?: string; narrow?: boolean }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px]", narrow ? "px-4 md:px-10" : "px-4 md:px-10 xl:px-20", className)}>
      {children}
    </div>
  );
}

export function Band({
  children,
  labelledBy,
  pad = "md",
  className,
  id,
}: {
  children: React.ReactNode;
  labelledBy: string;
  pad?: "md" | "lg";
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative isolate bg-black", pad === "lg" ? "py-14 xl:py-20" : "py-10 xl:py-12", className)}
    >
      {children}
    </section>
  );
}

const H2 = "text-[32px] leading-[40px] md:text-[40px] md:leading-[48px] xl:text-[48px] xl:leading-[56px] font-normal tracking-[-0.02em] text-white";

/** Two-tone heading: white first line, grey second line. */
export function TwoTone({ id, title, muted, className }: { id: string; title: string; muted?: string; className?: string }) {
  return (
    <h2 id={id} className={cn(H2, className)}>
      {title}
      {muted && (
        <>
          <br />
          <span className={MUTED}>{muted}</span>
        </>
      )}
    </h2>
  );
}

/** Heading left (740 wide), lede right (420), bottom-aligned — the reference's split header. */
export function SplitHead({
  id,
  title,
  muted,
  lede,
  aside,
}: {
  id: string;
  title: string;
  muted: string;
  lede?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between xl:gap-10">
      <TwoTone id={id} title={title} muted={muted} className="xl:max-w-[740px]" />
      {lede && <p className={cn("text-[16px] leading-6 xl:w-[420px] xl:shrink-0", SOFT)}>{lede}</p>}
      {aside}
    </div>
  );
}

export function CenterHead({ id, title, muted, className }: { id: string; title: string; muted?: string; className?: string }) {
  return <TwoTone id={id} title={title} muted={muted} className={cn("mx-auto max-w-[720px] text-center", className)} />;
}

/** 48px button, r12, 40px side padding, 16/24 semibold. */
export function Btn({
  href,
  children,
  tone = "white",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "white" | "primary" | "outline";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-xl px-10 text-[16px] leading-6 font-semibold transition-colors duration-150",
        tone === "white" && "bg-white text-[#18181a] hover:bg-[#e6e6ea]",
        tone === "primary" && "bg-primary text-white hover:bg-brand-500",
        tone === "outline" && "border border-white/90 text-white hover:bg-white/10",
        className,
      )}
    >
      {children}
    </a>
  );
}

/* ---------------------------------------------------------------- icons -- */

type I = { className?: string };
const svg = (className?: string) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className,
});

export const Icon = {
  check: ({ className }: I) => (
    <svg {...svg(className)}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  ),
  shield: ({ className }: I) => (
    <svg {...svg(className)}><path d="M12 21s7-3.2 7-9V5.6L12 3 5 5.6V12c0 5.8 7 9 7 9z" /><path d="M9 12l2.2 2.2L15.4 10" /></svg>
  ),
  cpu: ({ className }: I) => (
    <svg {...svg(className)}><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></svg>
  ),
  ram: ({ className }: I) => (
    <svg {...svg(className)}><rect x="3" y="7" width="18" height="10" rx="1.5" /><path d="M7 17v2M11 17v2M15 17v2M7 10.5h2v3H7zM11 10.5h2v3h-2zM15 10.5h2v3h-2z" /></svg>
  ),
  disk: ({ className }: I) => (
    <svg {...svg(className)}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 10.5h8M8 14h5" /><circle cx="15.5" cy="17.5" r="0.6" fill="currentColor" /></svg>
  ),
  ip: ({ className }: I) => (
    <svg {...svg(className)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" /></svg>
  ),
  globe: ({ className }: I) => (
    <svg {...svg(className)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" /></svg>
  ),
  resize: ({ className }: I) => (
    <svg {...svg(className)}><path d="M4 8V4h4M20 16v4h-4M4 4l6 6M20 20l-6-6M16 4h4v4M8 20H4v-4" /></svg>
  ),
  headset: ({ className }: I) => (
    <svg {...svg(className)}><path d="M4 14v-2a8 8 0 0116 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></svg>
  ),
  terminal: ({ className }: I) => (
    <svg {...svg(className)}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3M12.5 15H17" /></svg>
  ),
  key: ({ className }: I) => (
    <svg {...svg(className)}><circle cx="8" cy="15" r="4" /><path d="M11 12l8-8M16 7l2 2M14 9l2 2" /></svg>
  ),
  life: ({ className }: I) => (
    <svg {...svg(className)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6" /></svg>
  ),
  backup: ({ className }: I) => (
    <svg {...svg(className)}><path d="M4 12a8 8 0 108-8 8.2 8.2 0 00-6 2.7" /><path d="M4 4v3.5h3.5" /><path d="M12 8v4l2.5 2" /></svg>
  ),
  box: ({ className }: I) => (
    <svg {...svg(className)}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></svg>
  ),
  search: ({ className }: I) => (
    <svg {...svg(className)}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>
  ),
  star: ({ className }: I) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5z" /></svg>
  ),
  chevron: ({ className }: I) => (
    <svg {...svg(className)}><path d="M6 9l6 6 6-6" /></svg>
  ),
  arrow: ({ className }: I) => (
    <svg {...svg(className)}><path d="M9 6l6 6-6 6" /></svg>
  ),
};

export type IconName = keyof typeof Icon;
