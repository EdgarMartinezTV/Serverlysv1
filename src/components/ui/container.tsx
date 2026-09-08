import { cn } from "@/lib/utils";

/**
 * Horizontal rhythm for the whole site. Containers own gutters; sections and
 * components never set their own horizontal padding.
 *
 * Gutters are per-breakpoint by intent, not a single value:
 *   20px mobile  — tighter feels cramped, wider wastes a narrow viewport
 *   32px tablet
 *   40px desktop
 */
export type ContainerWidth = "reading" | "hero" | "content" | "wide";

const WIDTHS: Record<ContainerWidth, string> = {
  /** Long-form prose. ~72ch measure — legal pages, blog bodies. */
  reading: "max-w-reading",
  /** Focused bands where full width would stretch the composition. */
  hero: "max-w-hero",
  /** The default page width. */
  content: "max-w-desktop",
  /** Feature grids that benefit from extra room at large viewports. */
  wide: "max-w-wide",
};

export function Container({
  children,
  width = "content",
  className,
}: {
  children: React.ReactNode;
  width?: ContainerWidth;
  className?: string;
}) {
  return (
    <div
      className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", WIDTHS[width], className)}
    >
      {children}
    </div>
  );
}
