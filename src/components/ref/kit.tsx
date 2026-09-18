import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Layout + atom kit for the reference-built product pages.
 *
 * Shared by /cloud-hosting and /ecommerce-hosting, both of which mirror a
 * Hostinger page to the pixel at the owner's instruction. Those references
 * use a different grid and type scale than the rest of this site: a 16/40/80px
 * gutter ramp against 540/768/1600px container caps, and fixed type steps
 * rather than the fluid clamps in globals.css. Reproducing that through the
 * site's <Section>/<Container> primitives would have meant bending those for
 * two pages, so the measurements live here instead and the site primitives
 * stay untouched.
 *
 * Every number below was measured off the live reference at 390 / 768 / 1024 /
 * 1280 / 1440px — not estimated.
 *
 * This is also the one place on the site that breaks the design system's "no
 * arbitrary values in components" rule, and it does so on purpose: the whole
 * point of these pages is to match an external reference to the pixel, so the
 * reference's numbers ARE the spec. Promoting them to tokens would imply the
 * rest of the site should use them, which it should not.
 *
 * Breakpoint map:
 *
 *   base        <768   16px gutters, 540 cap, 56px bands, 36/44 headings
 *   md         ≥768    40px gutters, 768 cap, 64px bands
 *   lg        ≥1024    48/56 headings, 80/88 banner heading
 *   xl        ≥1280    80px gutters, 1600 cap, 80px bands, multi-column
 */

/** The page's horizontal rhythm. Nothing inside a band sets its own gutters. */
export function Grid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[540px] px-4 md:max-w-[768px] md:px-10 xl:max-w-[1600px] xl:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A page band. Owns vertical rhythm and surface. */
export function Band({
  children,
  id,
  labelledBy,
  surface = "light",
  className,
}: {
  children: React.ReactNode;
  id?: string;
  labelledBy?: string;
  surface?: "light" | "subtle";
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "py-14 md:py-16 xl:py-20",
        surface === "subtle" ? "bg-canvas-secondary" : "bg-canvas",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Centred band heading. `title` is 36/44 up to 1024 and 48/56 above; the lede
 * is capped at 736px, which is the reference's number.
 *
 * The title cap is 720px where the reference's is 646px, and that is deliberate.
 * Google now serves a DM Sans cut about 10% wider than the one the reference
 * self-hosts ("grows with you" at 80px: 548px for us, 494px for them), so a
 * 646px measure breaks these headings a word earlier than the reference does.
 * 720px is 646 scaled by that ratio, which reproduces the reference's actual
 * line breaks — "…which one / fits you?", "…run a / growing project",
 * "…website owners / worldwide" — in the font we can actually serve. Matching
 * the rendered result beats matching the number.
 */
export function Headline({
  title,
  description,
  id,
  tone = "light",
  className,
  children,
}: {
  title: string;
  description?: string;
  id?: string;
  /** `dark` is for /automations, whose every band sits on the dark canvas. */
  tone?: "light" | "dark";
  className?: string;
  children?: React.ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <h2
        id={id}
        className={cn(
          "max-w-[720px] text-[36px] leading-[44px] font-normal tracking-[-0.18px] lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]",
          dark ? "text-fg-on-dark" : "text-fg",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-[736px] text-body",
            dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

/**
 * The reference's one button shape: 48px tall, 8px radius, 48px side padding.
 *
 * `on-dark` exists because /automations is built on a near-black canvas where
 * `light` — the white pill used inside the dark SPLIT band — is far too loud as
 * a page's main call to action.
 *
 * The FILL IS THE LOGO BLUE, brand-600 (#0000ff), same as every button on the
 * light pages and the header. A lighter step was tried first and read violet:
 * hue 240 tinted toward white is periwinkle, and the page as a whole stopped
 * looking like Serverlys. Contrast is carried by the label, not the edge —
 * white on #0000ff is 8.59:1, against 5.50:1 on brand-500 — so the button is
 * unambiguously legible even though its 2.25:1 boundary against the canvas is
 * soft. Hover lifts to brand-500 (white still 5.50:1) rather than darkening,
 * which is the wrong direction on a dark surface.
 */
export function CtaButton({
  href,
  children,
  tone = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "primary" | "light" | "on-dark";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-md px-12 text-body font-semibold transition-colors duration-fast",
        tone === "primary" && "bg-primary text-white hover:bg-primary-hover",
        tone === "light" && "bg-white text-fg hover:bg-ink-100",
        tone === "on-dark" && "bg-primary text-white hover:bg-brand-500",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Inline link with a trailing arrow, as used by the comparison cards. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-body font-semibold text-primary hover:text-primary-hover",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-fast group-hover:translate-x-0.5" />
    </Link>
  );
}

/**
 * The reference's pill label. Brand (SAVE 71%) and success (NEW / FREE) are a
 * 10% tint of the text colour over white; `on-dark` is the inverted-card
 * variant, a translucent white tint carrying the brand's dark-band step —
 * brand-600 on a dark surface is only 2.1:1.
 */
export function PillLabel({
  children,
  tone = "brand",
  className,
}: {
  children: React.ReactNode;
  tone?: "brand" | "success" | "on-dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-micro font-semibold",
        tone === "brand" && "bg-primary-soft text-primary",
        tone === "success" && "bg-success-soft text-success",
        tone === "on-dark" && "bg-white/15 text-primary-on-dark",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ==========================================================================
   Icons — only the ones this page uses, at the reference's weights.
   ======================================================================== */

export function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M4.5 10.5l3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M4 10h11m0 0l-4.25-4.25M15 10l-4.25 4.25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M6.5 13.5l7-7m0 0H7.75m5.75 0v5.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InfoCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 9v4.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="6.6" r="0.85" fill="currentColor" />
    </svg>
  );
}

export function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 21s7-3.2 7-9V5.6L12 3 5 5.6V12c0 5.8 7 9 7 9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2.2 2.2L15.4 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Bolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M13.5 3L5.5 13.4h5.2L10 21l8.2-10.6h-5.3L13.5 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Gear({ className }: { className?: string }) {
  /* Short, thick teeth close to the rim — long thin spokes read as a sun. */
  const teeth = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const [cx, cy] = [Math.cos(a), Math.sin(a)];
    return `M${(12 + cx * 7.4).toFixed(2)} ${(12 + cy * 7.4).toFixed(2)}L${(12 + cx * 9.6).toFixed(2)} ${(12 + cy * 9.6).toFixed(2)}`;
  }).join("");
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="6.3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <path d={teeth} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Plus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Minus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M2.5 8h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M12 3l1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" fill="currentColor" />
    </svg>
  );
}

export function Store({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M4 9.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.5M3 9.5h18L19.2 4.6A1 1 0 0 0 18.3 4H5.7a1 1 0 0 0-.9.6L3 9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 20v-5h6v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Gift({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M3.5 8.5h17V12h-17V8.5zM5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7M12 8.5V20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M12 8.5S10.8 4 8.6 4a2.3 2.3 0 0 0 0 4.5H12zm0 0S13.2 4 15.4 4a2.3 2.3 0 0 1 0 4.5H12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Cursor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M5 4l6.2 15.5 2.1-5.6 5.7-2.1L5 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Megaphone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M4 10.5v3a1 1 0 0 0 1 1h2.5L14 19V5L7.5 9.5H5a1 1 0 0 0-1 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M17.5 9a4.2 4.2 0 0 1 0 6M7.5 14.5V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Trend({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M4 16.5l4.5-5 3.5 3 7-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M14.5 6.5H19v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path d="M7.5 4.5L13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Rating stars — five filled squares with a star knocked out.
 *
 * The reference paints these in Trustpilot's green (#00B67A) because it is
 * showing a Trustpilot rating. The Trustpilot attribution has been removed
 * from this page, so the green was borrowed branding attached to nothing and
 * the only hardcoded hex in the page: they are brand blue now.
 */
export function RatingStars({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-[22px]">
          <rect width="24" height="24" className="fill-primary" />
          <path
            fill="currentColor"
            className="text-canvas"
            d="M12 4.2l2.2 5.1 5.3.4-4 3.6 1.2 5.3L12 15.9l-4.7 2.7 1.2-5.3-4-3.6 5.3-.4L12 4.2z"
          />
        </svg>
      ))}
    </span>
  );
}
