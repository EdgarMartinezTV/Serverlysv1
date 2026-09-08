import { cn } from "@/lib/utils";

/**
 * Horizontal rhythm for the whole site. Gutters are intentional per breakpoint
 * rather than a single padding value: 20px on phones (edge-to-edge feels
 * cramped below that), 32px from tablet, 40px from desktop.
 */
export function Container({
  children,
  width = "content",
  className,
}: {
  children: React.ReactNode;
  width?: "content" | "narrow";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10",
        width === "content" ? "max-w-[1200px]" : "max-w-[760px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
