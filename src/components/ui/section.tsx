import { cn } from "@/lib/utils";
import { Container } from "./container";

/**
 * A page band. Owns vertical rhythm and surface colour so no section invents
 * its own spacing. Three surfaces only:
 *   light  — the default canvas
 *   subtle — a quiet step used to separate adjacent light sections
 *   dark   — reserved for infrastructure/proof bands and the footer
 */
export function Section({
  children,
  surface = "light",
  spacing = "base",
  as: Tag = "section",
  id,
  labelledBy,
  className,
}: {
  children: React.ReactNode;
  surface?: "light" | "subtle" | "dark";
  spacing?: "base" | "tight" | "loose";
  as?: "section" | "div" | "footer";
  id?: string;
  labelledBy?: string;
  className?: string;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        surface === "light" && "bg-canvas text-ink-800",
        surface === "subtle" && "bg-canvas-subtle text-ink-800",
        surface === "dark" && "bg-canvas-dark text-ink-300",
        spacing === "tight" && "py-14 sm:py-16",
        spacing === "base" && "py-20 sm:py-24 lg:py-28",
        spacing === "loose" && "py-24 sm:py-32 lg:py-40",
        className,
      )}
    >
      <Container>{children}</Container>
    </Tag>
  );
}

/**
 * Standard section header. Keeps eyebrow/heading/lede typography identical
 * everywhere, and wires the heading id used by the parent's aria-labelledby.
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  id,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  id?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        align === "center" ? "mx-auto max-w-[680px]" : "max-w-[680px]",
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-label font-mono uppercase",
            tone === "dark" ? "text-brand-400" : "text-brand-600",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className={cn(
          "text-display-3",
          tone === "dark" ? "text-white" : "text-ink-950",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "text-body-lg",
            tone === "dark" ? "text-ink-300" : "text-ink-600",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
