import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/animations/reveal";
import { resolveNavTarget } from "@/data/routes";
import { NavIcon } from "@/components/navigation/nav-icons";
import type { NavIconName } from "@/data/navigation";
import { cn } from "@/lib/utils";

/**
 * Copy beside a product visual.
 *
 * The gap analysis flagged that we repeated one two-column pattern; this
 * component exists so the variation is DELIBERATE and parameterised rather
 * than re-hand-built each time: side, surface, visual bleed and emphasis are
 * all props, and callers alternate them.
 *
 * `bleed` lets the visual break its column on wide viewports — the target
 * layers and overlaps where we previously boxed everything.
 */
export function ShowcaseSplit({
  eyebrow,
  title,
  body,
  points,
  cta,
  visual,
  side = "right",
  surface = "light",
  bleed = false,
  id,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points?: ReadonlyArray<{ label: string; detail: string; icon: NavIconName }>;
  cta?: { label: string; href: string; external?: boolean };
  visual: React.ReactNode;
  side?: "left" | "right";
  surface?: "light" | "subtle" | "dark";
  bleed?: boolean;
  id?: string;
}) {
  const dark = surface === "dark";
  const target = cta ? resolveNavTarget(cta.href) : null;

  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={cn(
        "relative isolate overflow-hidden py-20 sm:py-24 lg:py-28",
        surface === "light" && "bg-canvas",
        surface === "subtle" && "bg-canvas-secondary",
        dark && "bg-canvas-abyss",
      )}
    >
      {dark && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_0%,rgb(34_126_255/0.22)_0%,transparent_68%)]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-50" />
        </>
      )}

      <Container className="relative">
        <div
          className={cn(
            "grid items-center gap-12 lg:gap-16",
            bleed ? "lg:grid-cols-[0.85fr_1.15fr]" : "lg:grid-cols-2",
          )}
        >
          <div className={cn(side === "left" && "lg:order-2")}>
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
            <p
              className={cn(
                "mt-5 max-w-lg text-body-lg",
                dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
              )}
            >
              {body}
            </p>

            {points && (
              <ul className="mt-8 flex flex-col gap-5">
                {points.map((p) => (
                  <li key={p.label} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 shrink-0",
                        dark ? "text-accent-on-dark" : "text-primary",
                      )}
                    >
                      <NavIcon name={p.icon} className="h-[1.125rem] w-[1.125rem]" />
                    </span>
                    <span>
                      <span
                        className={cn(
                          "block text-body font-semibold",
                          dark ? "text-white" : "text-fg",
                        )}
                      >
                        {p.label}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-small",
                          dark ? "text-fg-on-dark-muted" : "text-fg-secondary",
                        )}
                      >
                        {p.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {cta && target && (
              <div className="mt-9">
                {cta.external ? (
                  <a
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-sm text-body font-medium underline-offset-4 transition-colors hover:underline",
                      "focus-visible:outline-2 focus-visible:outline-offset-4",
                      dark
                        ? "text-white focus-visible:outline-white"
                        : "text-primary hover:text-primary-hover focus-visible:outline-primary",
                    )}
                  >
                    {cta.label}
                    <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <Link
                    href={target.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-sm text-body font-medium underline-offset-4 transition-colors hover:underline",
                      "focus-visible:outline-2 focus-visible:outline-offset-4",
                      dark
                        ? "text-white focus-visible:outline-white"
                        : "text-primary hover:text-primary-hover focus-visible:outline-primary",
                    )}
                  >
                    {cta.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          <Reveal
            className={cn(
              side === "left" && "lg:order-1",
              // Break the column on wide viewports so the visual reads as a
              // moment rather than a boxed illustration.
              bleed && side === "right" && "lg:-mr-16 xl:-mr-24",
              bleed && side === "left" && "lg:-ml-16 xl:-ml-24",
            )}
          >
            {visual}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
