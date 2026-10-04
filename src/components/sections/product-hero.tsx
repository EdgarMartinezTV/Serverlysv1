import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

/**
 * Product page hero.
 *
 * Same visual family as the homepage hero — dark band, layered light source,
 * technical grid — and it now carries a PRODUCT VISUAL. A hero of heading,
 * paragraph and two buttons was the pattern the gap analysis called out; every
 * page hero here shows the software it is selling.
 *
 * The spec row lets someone qualify the product in about two seconds without
 * scrolling.
 */
export function ProductHero({
  eyebrow,
  eyebrowSlot,
  title,
  lede,
  breadcrumb,
  specs,
  primary,
  secondary,
  visual,
  tone = "light",
}: {
  eyebrow: string;
  /**
   * Replaces the eyebrow text. A product with its own brand should show its own
   * mark here — setting another company's name in our mono face is a wordmark
   * we invented, not their logo. `eyebrow` is still required: it stays the
   * accessible fallback and the value every other page uses.
   */
  eyebrowSlot?: React.ReactNode;
  title: string;
  lede: string;
  breadcrumb: ReadonlyArray<{ name: string; href?: string }>;
  specs?: ReadonlyArray<{ label: string; value: string }>;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /** Rendered to the right on desktop, below the copy on mobile. */
  visual?: React.ReactNode;
  /**
   * `dark` is the site's own product-hero treatment: abyss ground, layered
   * glow, masked grid.
   *
   * `light` matches the reference's product heroes, which carry NO background
   * of their own — the hero simply sits on the page's white. Use it when the
   * visual is a supplied image rather than a code-built mock: rendered art is
   * almost always composed on white, and a white-edged picture on a near-black
   * band reads as pasted on no matter how it is framed. That is exactly what
   * happened with the WordPress hero.
   */
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        dark ? "bg-canvas-abyss" : "bg-canvas",
      )}
    >
      {dark ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_110%,rgb(0_0_255/0.55)_0%,transparent_70%)]"
          />
        </>
      ) : (
        /* One soft brand wash, nothing else. A grid or a hard gradient behind a
           white-backed image puts texture right where the image's edge is and
           undoes the blend the light tone exists to create. */
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]"
        />
      )}

      {/* `wide` (1440) rather than the 1200 default: the reference's hero runs a
          1280 content column inside 80px gutters, which makes its visual ~700px
          — half the viewport. At 1200 ours measured 559px and read as a
          thumbnail beside the heading rather than as the other half of the
          composition. */}
      <Container
        width="wide"
        className="relative pb-16 pt-6 sm:pb-20 lg:pb-24 lg:pt-10"
      >
        <Breadcrumbs trail={breadcrumb} tone={dark ? "dark" : "light"} />

        <div
          className={cn(
            "mt-10 grid gap-12",
            visual ? "lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14" : "",
          )}
        >
          <div className={visual ? "" : "max-w-3xl"}>
            {eyebrowSlot ?? (
              <span
                className={cn(
                  "inline-flex rounded-md px-2.5 py-1 text-small font-medium",
                  dark ? "bg-white/10 text-white" : "bg-brand-50 text-primary",
                )}
              >
                {eyebrow}
              </span>
            )}
            <h1 className={cn("display-lg mt-5", dark ? "text-white" : "text-fg")}>{title}</h1>
            <p
              className={cn(
                "mt-5 max-w-xl text-body-lg",
                dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
              )}
            >
              {lede}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                href={primary.href}
                variant={dark ? "inverse" : "primary"}
                size="lg"
                block
              >
                {primary.label}
              </Button>
              <Button
                href={secondary.href}
                variant={dark ? "inverseOutline" : "outline"}
                size="lg"
                block
              >
                {secondary.label}
              </Button>
            </div>

            {specs && (
              <dl
                className={cn(
                  "mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-7 sm:grid-cols-4",
                  dark ? "border-line-on-dark" : "border-line",
                )}
              >
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt
                      className={cn(
                        "text-small",
                        dark ? "text-fg-on-dark-muted" : "text-fg-muted",
                      )}
                    >
                      {spec.label}
                    </dt>
                    <dd
                      className={cn(
                        "mt-1.5 text-body font-semibold",
                        dark ? "text-white" : "text-fg",
                      )}
                    >
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* No negative margin on the visual. The reference's hero image stops
              AT the gutter — measured 80px from the viewport edge at 1440 —
              rather than running off the side of the page. Pulling it out made
              the image look cropped by the window instead of composed in it. */}
          {/* 2026-10-03: the visual sits on a pale tiled brand stage with angled
              slabs, the framing every rebuilt product page uses, so a dark
              console or a light mock both read as a composed product shot. */}
          {visual && (
            <Reveal delay={80}>
              <div className="relative isolate overflow-hidden rounded-3xl bg-brand-50 p-5 sm:p-8">
                <div aria-hidden="true" className="absolute inset-0 -z-10 grid grid-cols-4 grid-rows-3">
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i} className={[1, 4, 6, 11].includes(i) ? "bg-brand-100" : ""} />
                  ))}
                </div>
                <div aria-hidden="true" className="absolute top-0 right-[8%] -z-10 h-[30%] w-[40%] bg-brand-300/70 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />
                <div aria-hidden="true" className="absolute bottom-0 left-[14%] -z-10 h-[18%] w-[34%] bg-brand-400/60 [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]" />
                <div className="drop-shadow-[0_24px_40px_rgb(0_0_60/0.18)]">{visual}</div>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
