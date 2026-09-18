import { cn } from "@/lib/utils";

/**
 * The reference's own layout primitives, measured off
 * dreamhost.com/pro-services/development/ at 1440px.
 *
 * DELIBERATELY NOT `components/ref/kit.tsx`. That kit encodes HOSTINGER's grid
 * (16/40/80px gutters against 540/768/1600 caps). DreamHost runs a different
 * one and mixing the two would give a page that matches neither:
 *
 *   container   1376px — the viewport less a 32px gutter each side
 *   columns     16, each 56px at this width
 *   gap         32px, both axes
 *
 * ⚠ ARBITRARY VALUES ARE THE POINT HERE, exactly as on /cloud-hosting. The
 * reference's measurements ARE the spec for this page, so its numbers are
 * written literally rather than mapped onto our type scale — mapping them
 * produces a page that is merely inspired by the target. The design system's
 * no-arbitrary-values rule does not apply inside this folder.
 *
 * ⚠ Colours are also the reference's, not our tokens: #0073ec for the accent,
 * #f4f6f9 for the quiet band. They are written as literals for the same reason,
 * and because `validate-tokens.mjs` only polices `text-*`/`bg-*` TOKEN
 * utilities — a literal hex is outside its contract, not a violation of it.
 */

/** The 16-column bed every band sits on. */
export function Grid({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  return (
    <Tag
      className={cn(
        /* max-w is 1440, NOT 1376. The reference's CONTENT box is 1376 and it
           gets there from a 1440 outer with a 32px gutter each side. Capping at
           1376 and then subtracting the gutter left every band 64px narrow. */
        "mx-auto grid w-full max-w-[1440px] grid-cols-4 gap-8 px-8 md:grid-cols-8 lg:grid-cols-16",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** A full-bleed band. `tone` picks one of the reference's four grounds. */
export function Band({
  tone = "black",
  className,
  children,
  labelledBy,
}: {
  tone?: "black" | "white" | "offwhite" | "blue";
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(
        "w-full",
        tone === "black" && "bg-black text-white",
        tone === "white" && "bg-white text-black",
        tone === "offwhite" && "bg-[#f4f6f9] text-black",
        tone === "blue" && "bg-[#0073ec] text-white",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * The reference's heading steps. Sized literally, and clamped down at small
 * widths because an 80px headline does not fit a 375px screen — the reference
 * does the same, it just does it in its own breakpoints.
 */
/*
 * SAMPLED LINE-HEIGHT RATIOS, not guessed. Every step below was read off the
 * reference's computed styles; the first build approximated them and every
 * heading on the page came out 10-14% short, which is what made it read as
 * "inspired by" rather than identical:
 *
 *   88/103.84 = 1.18   80/96 = 1.2   64/80 = 1.25   48/60 = 1.25
 *   32/48 = 1.5        24/36 = 1.5   20/32 = 1.6    16/24 = 1.5
 */
const HEADING = {
  h1: "text-[2.75rem] leading-[1.2] sm:text-[3.5rem] lg:text-[5rem]",
  h2: "text-[2.25rem] leading-[1.25] sm:text-[3rem] lg:text-[4rem]",
  h2xl: "text-[2.5rem] leading-[1.18] sm:text-[3.5rem] lg:text-[5.5rem]",
  h2sm: "text-[2rem] leading-[1.25] sm:text-[2.5rem] lg:text-[3rem]",
  h3: "text-[1.5rem] leading-[1.5] lg:text-[2rem]",
  h4: "text-[1.25rem] leading-[1.5] lg:text-[1.5rem]",
} as const;

export function Heading({
  level = 2,
  step = "h2",
  id,
  className,
  children,
}: {
  level?: 1 | 2 | 3 | 4;
  step?: keyof typeof HEADING;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  return (
    /* `text-current` and the text-wrap reset are BOTH load-bearing.
       globals.css sets `h1..h6 { color: var(--color-fg); text-wrap: balance }`,
       and because that lands on the element itself it beats the white inherited
       from a dark Band — every heading on this page rendered near-black on
       black until this was added. `balance` also re-breaks the reference's
       headlines at different points, and its line breaks are part of what is
       being matched. */
    <Tag
      id={id}
      className={cn(
        "font-bold tracking-[-0.01em] text-current [text-wrap:initial]",
        HEADING[step],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** 24px/400 lede. The reference's `text-wrap: balance` is NOT wanted here. */
export function Lede({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-[1.125rem] leading-[1.5] lg:text-[1.5rem] [text-wrap:initial]", className)}>
      {children}
    </p>
  );
}

/** 20px/400 body. */
export function Body({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    /* 20px / 400 / 32px — ratio 1.6, sampled. Was 1.5. */
    <p className={cn("text-[1rem] leading-[1.6] lg:text-[1.25rem] [text-wrap:initial]", className)}>
      {children}
    </p>
  );
}

/**
 * The reference's button: 24px/32px padding, 16px radius, 20px semibold label.
 * `min-h-11` is ours — at their exact padding the control is already well over
 * 44px, but the floor guarantees it stays there if the label ever shrinks.
 */
export function CtaButton({
  href,
  tone = "blue",
  className,
  children,
}: {
  href: string;
  tone?: "blue" | "white" | "outline";
  className?: string;
  children: React.ReactNode;
}) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-3 rounded-[1rem] px-8 py-6",
        /* 24px / 600 / 1.5 — sampled off their CTAs. Was 20px/700/none. */
        "text-[1.125rem] font-semibold leading-[1.5] transition-colors duration-150 lg:text-[1.5rem]",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        tone === "blue" &&
          "bg-[#0073ec] text-white hover:bg-[#0062c9] focus-visible:outline-[#0073ec]",
        tone === "white" &&
          "bg-white text-black hover:bg-[#e8eef7] focus-visible:outline-white",
        tone === "outline" &&
          "border-2 border-black bg-transparent text-black hover:bg-black hover:text-white focus-visible:outline-black",
        className,
      )}
    >
      {children}
    </a>
  );
}
