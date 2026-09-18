import { Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { billing } from "@/data/company";

/**
 * Migration explainer.
 *
 * Purpose: this is the single largest objection to changing host — fear of
 * downtime. The section exists to answer it concretely (staging first, you
 * approve, DNS last), not to decorate the page with a process graphic.
 *
 * ── BAND DESIGN, matched to the "Done for you" services rail ────────────────
 *
 * Same treatment, deliberately: dark ground, two ambient glow pools, a header
 * row with the action pulled up beside it, and translucent plates ringed in
 * white at 10%. The rules that band documents apply here for the same reasons:
 *
 *   · The GROUND stays `surface="dark"`'s own `bg-canvas-dark` (ink-950). Do
 *     not add a `bg-*` in className to tint it — `cn` is a plain join with no
 *     tailwind-merge, so two `bg-*` utilities on one element resolve by
 *     stylesheet order rather than by what you wrote last, and the override
 *     silently does nothing. The colour belongs in the glow.
 *   · The glow is hue 240 and stays there. Tinting the ramp toward white to
 *     warm it produces periwinkle, which is the complaint that triggered the
 *     brand retune. Both pools are `primary` at low alpha.
 *
 * ⚠ BAND RHYTHM is why `tone` exists. No two dark bands may touch, and this
 * section appears on four pages:
 *
 *   /            PricingBand (light) → here → FaqSection (light)      → dark ✓
 *   /hosting     PricingBand (light) → here → FaqSection (light)      → dark ✓
 *   /website-design  ShowcaseSplit (DARK) → here                      → subtle
 *
 * That third page is the reason this is not simply hard-coded to dark: the band
 * directly above it is already dark, so the dark treatment would run two of them
 * together and erase the boundary. Check the neighbours before adding a fifth
 * usage — `tone` is a layout decision about the PAGE, not a preference.
 *
 * ⚠ These cards are NOT links, so they carry no ↗ affordance and no hover
 * state. The services rail's cards are each an <a>; copying its arrow here
 * would promise a destination that does not exist. The numbered step keeps the
 * top row the services card gives to its icon.
 */
const STEPS = [
  {
    title: "Tell us where it lives now",
    body: "Send us the current host login, or just the domain. No sales call required.",
  },
  {
    title: "We move it to staging",
    body: "Site, database and email are copied to a temporary URL, usually within a business day.",
  },
  {
    title: "You check it properly",
    body: "Click through it on the staging URL. We fix anything that looks wrong before go-live.",
  },
  {
    title: "We switch DNS when you say",
    body: "Your old host keeps serving until propagation finishes, so there is no gap in service.",
  },
] as const;

export function Migration({
  tone = "dark",
}: {
  /**
   * `dark` is the services-rail treatment. `subtle` is the light band this used
   * to be, kept for pages where a dark section already sits directly above.
   */
  tone?: "dark" | "subtle";
} = {}) {
  const dark = tone === "dark";

  return (
    <Section
      id="migration"
      surface={dark ? "dark" : "subtle"}
      spacing="base"
      width="wide"
      labelledBy="migration-heading"
      className="relative isolate overflow-hidden"
    >
      {/* Bright at BOTH outer edges, darkest through the middle. A single
          corner pool measures a luminance spread of ~10 across the band and
          reads flat; two opposing pools give the ~58 that makes the plates
          look like they are floating rather than pasted on. */}
      {dark && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-0 -z-10 h-full w-[26rem] rounded-full bg-primary/50 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-0 -z-10 h-full w-[26rem] rounded-full bg-primary/45 blur-3xl"
          />
        </>
      )}

      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          id="migration-heading"
          eyebrow="Switching host"
          title="Move an existing site without downtime"
          lede="Migration is free and handled by our team. Nothing points at Serverlys until you have seen the site working."
          tone={dark ? "dark" : "light"}
          accent="neutral"
        />
        <div className="shrink-0">
          <Button href={billing.sales} variant={dark ? "inverse" : "secondary"}>
            Ask about migrating
          </Button>
        </div>
      </Reveal>

      <Reveal delay={80} className="mt-12">
        {/* Still an <ol>. These are ordered steps and the order is the content —
            the numbers are not decoration, so the list stays a list. */}
        <ol className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className={cn(
                "flex min-h-81 flex-col gap-2 rounded-xl p-6 ring-1 ring-inset",
                dark
                  ? "bg-canvas-dark/50 ring-white/10"
                  : "bg-white shadow-e1 ring-line",
              )}
            >
              <span
                className={cn(
                  "tabular inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-small font-semibold ring-1 ring-inset",
                  dark
                    ? "bg-white/12 text-white ring-white/20"
                    : "bg-primary-soft text-primary ring-transparent",
                )}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className={cn("mt-4 text-body-lg", dark ? "text-fg-on-dark" : "text-fg")}>
                {step.title}
              </h3>
              <p
                className={cn(
                  "text-small leading-5",
                  dark ? "text-fg-on-dark-muted" : "text-fg-secondary",
                )}
              >
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
