import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check, CtaButton } from "./kit";
import { Grid } from "./kit";

/**
 * The reference's `h-image-section-two-cols`.
 *
 * One component because the reference uses this band five times on
 * /woocommerce-hosting alone — launch, speed, security, managed, migration —
 * varying only which side the media sits on and whether the surface is light
 * or the deep brand band. Building five near-identical sections instead would
 * have guaranteed they drifted apart.
 *
 * Measured at 1440: 80px vertical padding, a 600/600 grid with an 80px gutter
 * and a 40px row gap, heading 48/56 at -0.24px capped to the column, body and
 * list items 16/24.
 *
 * The reference's dark variant is #251951; ours is `canvas-deep`, which is the
 * brand ramp's 950 step rather than a one-off purple.
 */

export type Run = { text: string; bold?: boolean; href?: string };

export function Split({
  id,
  title,
  description,
  paragraphs,
  items,
  cta,
  media,
  reverse = false,
  tone = "light",
  className,
}: {
  id: string;
  title: string;
  description?: string;
  /** Used instead of `items` where the reference runs prose, not a checklist. */
  paragraphs?: readonly string[];
  items?: readonly (readonly Run[])[];
  cta?: { label: string; href: string };
  media: React.ReactNode;
  /** Media on the left. */
  reverse?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <section
      aria-labelledby={id}
      className={cn("py-14 md:py-16 xl:py-20", dark ? "bg-canvas-deep" : "bg-canvas", className)}
    >
      <Grid>
        <div className="grid gap-10 xl:grid-cols-2 xl:items-center xl:gap-x-20">
          <div className={cn("flex flex-col", reverse && "xl:order-2")}>
            <h2
              id={id}
              className={cn(
                "text-[36px] leading-[44px] font-normal tracking-[-0.18px] lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]",
                dark ? "text-white" : "text-fg",
              )}
            >
              {title}
            </h2>

            {description && (
              <p
                className={cn(
                  "mt-4 text-body",
                  dark ? "text-fg-on-dark-secondary" : "text-fg",
                )}
              >
                {description}
              </p>
            )}

            {paragraphs?.map((p) => (
              <p
                key={p}
                className={cn(
                  "mt-4 text-body",
                  dark ? "text-fg-on-dark-secondary" : "text-fg",
                )}
              >
                {p}
              </p>
            ))}

            {items && (
              <ul className="mt-6 flex flex-col gap-3">
                {items.map((runs, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex items-start gap-3 text-body",
                      dark ? "text-fg-on-dark-secondary" : "text-fg",
                    )}
                  >
                    <Check
                      className={cn(
                        "mt-0.5 size-5 shrink-0",
                        dark ? "text-white" : "text-success-fill",
                      )}
                    />
                    <span>
                      {runs.map((run, j) =>
                        run.href ? (
                          <Link
                            key={j}
                            href={run.href}
                            className={cn(
                              "font-semibold underline decoration-from-font",
                              dark ? "text-white" : "text-primary hover:text-primary-hover",
                            )}
                          >
                            {run.text}
                          </Link>
                        ) : run.bold ? (
                          <b key={j} className={cn("font-semibold", dark && "text-white")}>
                            {run.text}
                          </b>
                        ) : (
                          <span key={j}>{run.text}</span>
                        ),
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {cta && (
              <div className="mt-8">
                <CtaButton href={cta.href} tone={dark ? "light" : "primary"}>
                  {cta.label}
                </CtaButton>
              </div>
            )}
          </div>

          <div className={cn(reverse && "xl:order-1")}>{media}</div>
        </div>
      </Grid>
    </section>
  );
}
