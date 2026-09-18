import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { NavIcon } from "@/components/navigation/nav-icons";
import type { NavIconName } from "@/data/navigation";
import { cn } from "@/lib/utils";

/**
 * A grid of what a plan includes, each line with its own icon.
 *
 * Distinct from FeatureGrid: this is the reference's "services" band — denser,
 * four across, and used for a list of protections rather than a handful of
 * headline selling points.
 */
export function ServicesGrid({
  eyebrow,
  title,
  lede,
  items,
  surface = "light",
  className,
  id,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  items: readonly { label: string; detail: string; icon: NavIconName }[];
  surface?: "light" | "subtle" | "dark";
  /**
   * Ground override. `surface` picks the correct FOREGROUND tokens and must
   * still be set — this only swaps the background beneath them, so a dark band
   * can sit on the blue abyss rather than the neutral near-black without the
   * text tokens going wrong.
   */
  className?: string;
  id?: string;
}) {
  const dark = surface === "dark";
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <Section
      id={id}
      surface={surface}
      spacing="base"
      width="wide"
      labelledBy={headingId}
      className={className}
    >
      <Reveal>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          lede={lede}
          id={headingId}
          tone={dark ? "dark" : "light"}
        />
      </Reveal>

      <ul className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal as="li" key={item.label} delay={(i % 4) * 70}>
            <span
              aria-hidden="true"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl",
                dark
                  ? "bg-primary/20 text-primary-on-dark ring-1 ring-inset ring-primary/25"
                  : "bg-primary-soft text-primary",
              )}
            >
              <NavIcon name={item.icon} />
            </span>
            <h3 className={cn("mt-4 text-h4", dark ? "text-white" : "text-fg")}>
              {item.label}
            </h3>
            <p
              className={cn(
                "mt-2 text-body",
                dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
              )}
            >
              {item.detail}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
