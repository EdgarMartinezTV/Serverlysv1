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
        "relative isolate overflow-hidden py-14 sm:py-24 lg:py-28",
        surface === "light" && "bg-canvas",
        surface === "subtle" && "bg-canvas-secondary",
        dark && "bg-canvas-abyss",
      )}
    >
      {dark && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(55%_55%_at_25%_60%,rgb(0_0_255/0.4)_0%,transparent_70%)]"
          />
        </>
      )}

      <Container width="wide" className="relative">
        <div
          className={cn(
            "grid items-center gap-12 lg:gap-20",
            bleed ? "lg:grid-cols-[0.85fr_1.15fr]" : "lg:grid-cols-2",
            /* `bleed` now only widens the visual column; the negative margins
               that pushed it past the gutter clip inside the framed stage. */
          )}
        >
          <div className={cn(side === "left" && "lg:order-2")}>
            <span
              className={cn(
                "inline-flex rounded-md px-2.5 py-1 text-small font-medium",
                dark ? "bg-white/10 text-white" : "bg-brand-50 text-primary",
              )}
            >
              {eyebrow}
            </span>
            <h2
              id={id ? `${id}-heading` : undefined}
              className={cn("display-md mt-5", dark ? "text-white" : "text-fg")}
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
                        "inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
                        dark ? "bg-white/10 text-white" : "bg-brand-50 text-primary",
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
            )}
          >
            {/* Same framing as ProductHero: a tiled brand stage, so every
                visual reads as a composed product shot (2026-10-03). */}
            <div
              className={cn(
                "relative isolate overflow-hidden rounded-3xl p-5 sm:p-8",
                dark ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-brand-50",
              )}
            >
              {!dark && (
                <div aria-hidden="true" className="absolute inset-0 -z-10 grid grid-cols-4 grid-rows-3">
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i} className={[1, 4, 6, 11].includes(i) ? "bg-brand-100" : ""} />
                  ))}
                </div>
              )}
              <div className="drop-shadow-[0_24px_40px_rgb(0_0_60/0.16)]">{visual}</div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
