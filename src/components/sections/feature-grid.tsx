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
          className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgb(0_0_255/0.35)_0%,transparent_70%)]"
        />
      )}
      <Container width="wide" className="relative">
        <Reveal className="mx-auto max-w-[760px] text-center">
          {/* `eyebrow` kept in the API, no longer rendered (2026-10-03). */}
          <span className="sr-only">{eyebrow}</span>
          <h2
            id={id ? `${id}-heading` : undefined}
            className={cn("display-md", dark ? "text-white" : "text-fg")}
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
            "mt-12 grid gap-4 sm:grid-cols-2",
            columns === 3 && "lg:grid-cols-3",
            columns === 4 && "lg:grid-cols-4",
          )}
        >
          {items.map((item, i) => (
            <Reveal as="li" key={item.label} delay={(i % 4) * 60}>
              <div
                className={cn(
                  "h-full rounded-2xl p-6",
                  dark ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-canvas-secondary",
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-white"
                >
                  <NavIcon name={item.icon} className="h-5 w-5" />
                </span>
                <h3
                  className={cn(
                    "mt-6 text-body-lg font-medium",
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
