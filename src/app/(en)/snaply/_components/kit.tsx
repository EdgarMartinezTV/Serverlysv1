import Image from "next/image";
import { cn } from "@/lib/utils";
import { t as tx } from "@/i18n/t";

/**
 * Shared Snaply visuals. Every image is a real capture of the extension's own
 * UI (Snaply repo: docs/publishing/store-assets/raw) — no mocks of features it
 * does not have, no AI art.
 */

export function Eyebrow({ children, dark = false, className }: { children: string; dark?: boolean; className?: string }) {
  return dark ? (
    <p className={cn("flex w-fit items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-brand-200 ring-1 ring-white/10", className)}>
      <span className="size-1.5 rounded-full bg-accent-on-dark shadow-[0_0_10px_var(--color-accent-on-dark)]" />
      {tx(children)}
    </p>
  ) : (
    <p className={cn("flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_1px_2px_rgb(15_23_42/0.06),0_0_0_1px_var(--color-brand-100)]", className)}>
      <span className="size-1.5 rounded-full bg-primary" />
      {tx(children)}
    </p>
  );
}

/** A real capture in a light browser window. */
export function BrowserShot({
  src,
  alt,
  width,
  height,
  url,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 760px, 100vw",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  url: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[14px] bg-white shadow-[0_40px_80px_-30px_rgb(0_0_60/0.45),0_0_0_1px_rgb(15_23_42/0.08)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-[#e6e9f0] bg-[#f6f7fa] px-3.5 py-2">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex h-6 w-[min(60%,340px)] items-center justify-center gap-1.5 truncate rounded-md bg-white px-3 text-[11px] text-[#64748b] ring-1 ring-[#e6e9f0]">
          <SnaplyMark className="size-3 shrink-0" />
          {tx(url)}
        </span>
      </div>
      <Image src={src} alt={tx(alt)} width={width} height={height} priority={priority} sizes={sizes} className="block h-auto w-full" />
    </figure>
  );
}

/** A real capture shown as a floating extension panel (popup / recorder). */
export function PanelShot({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[18px] bg-white shadow-[0_40px_70px_-24px_rgb(0_0_60/0.55),0_0_0_1px_rgb(15_23_42/0.08)]",
        className,
      )}
    >
      <Image src={src} alt={tx(alt)} width={width} height={height} priority={priority} sizes="380px" className="block h-auto w-full" />
    </figure>
  );
}

/** Snaply's own mark — public/snaply/snaply-mark.svg, the extension icon. */
export function SnaplyMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/snaply/snaply-mark.svg" alt="" aria-hidden="true" className={className} />;
}

export function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

export function Glyph({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** Icon paths used across the page (24×24, stroke). */
export const G = {
  camera: "M4 8h3l2-3h6l2 3h3v11H4ZM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  crop: "M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14",
  page: "M7 3h10v18H7zM10 7h4M10 11h4M10 15h2",
  pointer: "M4 4l7 17 2.5-7.5L21 11Z",
  video: "M3 7h12v10H3ZM15 10l6-3v10l-6-3",
  pen: "M4 20l4-1 11-11-3-3L5 16ZM14 6l3 3",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6Z",
  bug: "M8 9h8v7a4 4 0 0 1-8 0ZM9 9V7a3 3 0 0 1 6 0v2M4 13h4M16 13h4M5 8l3 2M19 8l-3 2M5 19l3-2M19 19l-3-2",
  layout: "M3 4h18v16H3ZM3 9h18M9 9v11",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2ZM4 19V5",
  chat: "M4 5h16v11H9l-5 4Z",
  lock: "M6 11h12v9H6ZM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  cloudOff: "M3 3l18 18M7 18h10a4 4 0 0 0 1.5-7.7A6 6 0 0 0 8 7.3M5.2 9.5A4.5 4.5 0 0 0 7 18",
  user: "M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  gif: "M4 6h16v12H4ZM9 10H7v4h2v-1.5M12 10v4M15 14v-4h2M15 12h1.5",
};
