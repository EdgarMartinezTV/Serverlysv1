import { cn } from "@/lib/utils";
import { Container, type ContainerWidth } from "./container";

/**
 * A page band. Owns vertical rhythm and surface colour so no section invents
 * its own spacing.
 *
 * Three surfaces only:
 *   light   the default canvas
 *   subtle  a quiet step, to separate two adjacent light sections
 *   dark    reserved for proof/infrastructure bands and the footer
 *
 * `surface` also selects the correct foreground tokens. On the dark band,
 * fg-muted (ink-500) would fail contrast — the surface contract is what stops
 * that mistake being possible.
 */
export function Section({
  children,
  surface = "light",
  spacing = "base",
  width = "content",
  as: Tag = "section",
  id,
  labelledBy,
  className,
}: {
  children: React.ReactNode;
  surface?: "light" | "subtle" | "dark";
  spacing?: "tight" | "base" | "loose";
  width?: ContainerWidth;
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
        surface === "light" && "bg-canvas text-fg-secondary",
        surface === "subtle" && "bg-canvas-secondary text-fg-secondary",
        surface === "dark" && "bg-canvas-dark text-fg-on-dark-secondary",
        spacing === "tight" && "py-14 sm:py-16",
        spacing === "base" && "py-20 sm:py-24 lg:py-28",
        spacing === "loose" && "py-24 sm:py-32 lg:py-40",
        className,
      )}
    >
      <Container width={width}>{children}</Container>
    </Tag>
  );
}

/**
 * Standard section header — keeps eyebrow/heading/lede typography identical
 * everywhere and wires the heading id used by the parent's aria-labelledby.
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
        "flex max-w-[680px] flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "font-mono text-caption uppercase",
            tone === "dark" ? "text-primary-on-dark" : "text-primary",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2 id={id} className={cn("text-h2", tone === "dark" ? "text-white" : "text-fg")}>
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "text-body-lg",
            tone === "dark" ? "text-fg-on-dark-secondary" : "text-fg-secondary",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
