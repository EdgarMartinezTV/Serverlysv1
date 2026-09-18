import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/animations/reveal";
import { NavIcon } from "@/components/navigation/nav-icons";
import type { NavIconName } from "@/data/navigation";
import { cn } from "@/lib/utils";

/**
 * Capability grid.
 *
 * Deliberately NOT a card grid: items sit on the section ground separated by
 * rules, because the gap analysis counted seven card systems on one page and
 * a rounded rectangle had become the answer to every layout question.
 */
export function FeatureGrid({
  eyebrow,
  title,
  lede,
  items,
  surface = "light",
  columns = 3,
  id,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  items: ReadonlyArray<{ label: string; detail: string; icon: NavIconName }>;
  surface?: "light" | "subtle" | "dark";
  columns?: 2 | 3 | 4;
  id?: string;
}) {
  const dark = surface === "dark";
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={cn(
        "relative isolate overflow-hidden py-14 sm:py-24 lg:py-28",
        surface === "light" && "bg-canvas",
        surface === "subtle" && "bg-canvas-secondary",
        dark && "bg-canvas-abyss",
      )}
    >
      {dark && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgb(34_126_255/0.18)_0%,transparent_70%)]"
        />
      )}
      <Container className="relative">
        <Reveal className="max-w-2xl">
          <span
            className={cn(
              "font-mono text-caption uppercase",
              dark ? "text-accent-on-dark" : "text-primary",
            )}
          >
            {eyebrow}
          </span>
          <h2
            id={id ? `${id}-heading` : undefined}
            className={cn("mt-4 text-h2", dark ? "text-white" : "text-fg")}
          >
            {title}
          </h2>
          {lede && (
            <p
              className={cn(
                "mt-5 text-body-lg",
                dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
              )}
            >
              {lede}
            </p>
          )}
        </Reveal>

        <ul
          className={cn(
            "mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2",
            columns === 3 && "lg:grid-cols-3",
            columns === 4 && "lg:grid-cols-4",
          )}
        >
          {items.map((item, i) => (
            <Reveal as="li" key={item.label} delay={(i % 4) * 60}>
              <div
                className={cn(
                  "border-t pt-5",
                  dark ? "border-line-on-dark" : "border-line",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(dark ? "text-accent-on-dark" : "text-primary")}
                >
                  <NavIcon name={item.icon} className="h-5 w-5" />
                </span>
                <h3
                  className={cn(
                    "mt-4 text-h4",
                    dark ? "text-white" : "text-fg",
                  )}
                >
                  {item.label}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-small",
                    dark ? "text-fg-on-dark-muted" : "text-fg-secondary",
                  )}
                >
                  {item.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
