import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { NavIcon, ArrowUpRight } from "@/components/navigation/nav-icons";
import type { NavIconName } from "@/data/navigation";
import { CardRail, CardRailItem } from "./card-rail";
import { billing } from "@/data/company";

/**
 * Services rail — "Done for you".
 *
 * The reference puts a second product carousel here. Ours carries the work we
 * do FOR people rather than more things to self-serve, because that is the
 * honest read of what Serverlys sells beyond a plan — and because every one of
 * these pages exists today and had no route in from the homepage before this
 * rebuild. A carousel of live pages beats a carousel of promises.
 *
 * No prices. These are scoped per project and quoting a "from" figure on a card
 * would set an anchor we cannot honour on a brief we have not read.
 *
 * ── CARD DESIGN, measured off hostinger.com's "More power when you need it"
 * carousel at 1440px (2026-09-14) ─────────────────────────────────────────────
 *
 *   card          296×324, radius 16, padding 24, translucent dark fill
 *   top row       product icon LEFT, ↗ RIGHT, space-between, 40px tall
 *   title         18px / 26px, regular weight, white
 *   description   14px / 20px, white at ~75%
 *   content       TOP-ALIGNED, with the lower third left empty on purpose
 *
 * THE BAND IS DARK BECAUSE THE CARD REQUIRES IT. The reference card is a
 * half-transparent black plate floating on a glowing ground — its title is
 * white and its description is white-at-75%, neither of which has any contrast
 * on our light `subtle` surface. Copying the card onto a light band would have
 * produced a different design that merely shared a layout. The homepage rhythm
 * still works: StageManage (light) → this (dark) → SetupsGrid (light) →
 * CoworkerBand (dark), so no two dark bands touch.
 *
 * ⚠ The ambient glow is hue 240 and stays there. The reference's is Hostinger
 * purple; tinting our ramp toward white to chase it produces periwinkle, which
 * is the exact complaint that triggered the brand retune. Solid glow stops are
 * `primary` (brand-600) at low alpha over `canvas-abyss`. See DESIGN_SYSTEM.md.
 */
const SERVICES: ReadonlyArray<{
  title: string;
  body: string;
  href: string;
  icon: NavIconName;
}> = [
  {
    title: "Website design",
    body: "A site built around what the business actually needs to say, then handed over on hosting that keeps it fast.",
    href: "/website-design",
    icon: "layout",
  },
  {
    title: "Website development",
    body: "Custom builds, integrations and the awkward bits — payment flows, portals, anything the template will not do.",
    href: "/website-development",
    icon: "wrench",
  },
  {
    title: "SEO",
    body: "The technical foundation and the pages that earn the ranking, measured against traffic rather than positions.",
    href: "/seo",
    icon: "compass",
  },
  {
    title: "Marketing",
    body: "Campaigns pointed at the site you already have, so the traffic lands somewhere that converts.",
    href: "/marketing",
    icon: "chart",
  },
  {
    title: "Social media",
    body: "Consistent presence without it becoming a daily job, feeding the same enquiry pipeline as everything else.",
    href: "/social-media",
    icon: "chat",
  },
  {
    title: "Business solutions",
    body: "Bigger projects: multi-site estates, migrations off legacy hosts, and the systems around them.",
    href: "/business-solutions",
    icon: "globe",
  },
];

export function ServicesRail() {
  return (
    <Section
      surface="dark"
      spacing="base"
      width="wide"
      labelledBy="services-heading"
      className="relative isolate overflow-hidden"
    >
      {/* NOTE: the ground is `surface="dark"`'s own `bg-canvas-dark` (ink-950),
          left alone on purpose. An earlier pass put `bg-canvas-abyss` in
          className to tint it — that silently did nothing, because `cn` is a
          plain join with no tailwind-merge and TWO `bg-*` utilities on one
          element are resolved by stylesheet order rather than by what you wrote
          last. It was measured rendering ink-950 while the class said abyss.
          Then it turned out ink-950 is the RIGHT ground anyway: abyss is lum 28
          against the reference mid-band's 19, which flattened the wash. The
          colour belongs in the glow, not in the ground. */}
      {/* Ambient glow — the reference's one real atmospheric trick, and the
          thing that makes its cards read as floating rather than pasted on.
          Sampled off the reference band: bright at BOTH outer edges, darkest
          through the middle, a luminance spread of ~58 across the width. A
          single corner pool measured a spread of 9.7 and looked flat.

          Hue 240 throughout. The reference's wash is Hostinger purple; tinting
          our ramp toward white to chase it gives periwinkle, which is the exact
          complaint that triggered the brand retune. Both pools are `primary`
          (brand-600 #0000ff) over abyss. */}
      {/* 2026-10-03: one wash rising from the bottom edge (the logo blue over
          the dark ground) instead of two side pools, so the cards sit in the
          light rather than between two lamps. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_70%_at_50%_115%,rgb(0_0_255/0.85)_0%,rgb(0_0_255/0.25)_45%,transparent_75%)]"
      />

      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[640px]">
          <h2 id="services-heading" className="display-md text-white">
            Or hand the build over entirely
          </h2>
          <p className="mt-4 text-body-lg text-fg-on-dark-secondary">
            The same team that runs the infrastructure will design it, build it and
            market it.
          </p>
        </div>
        <div className="shrink-0">
          <Button href={billing.sales} variant="inverse">
            Talk about a project
          </Button>
        </div>
      </Reveal>

      <Reveal delay={80} className="mt-12">
        <CardRail label="services" tone="on-dark">
          {SERVICES.map((service) => (
            <CardRailItem key={service.href}>
              {/* The card IS the link, exactly as the reference builds it. That
                  is why there is no <CardLink> stretched-overlay here: with an
                  <a> wrapping the whole plate there is nothing to stretch, and
                  no nested interactive element to reason about. */}
              <Link
                href={service.href}
                className="group/card flex h-full min-h-64 flex-col gap-2 rounded-2xl bg-[linear-gradient(180deg,rgb(255_255_255/0.05)_0%,rgb(31_85_255/0.22)_100%)] p-6 ring-1 ring-inset ring-white/10 backdrop-blur-sm transition-colors duration-fast hover:bg-white/10 hover:ring-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="flex items-start justify-between gap-4">
                  {/* WHITE, not brand-400. brand-400 (#7d7dff) is hue 240 and
                      passes contrast at 5.54:1, but at 75% lightness it is the
                      periwinkle the ramp warns about — as a thin 24px stroke
                      sitting on a #0000ff glow it read lavender. The brand is
                      carried by the GLOW here, at the true logo blue; the line
                      art is neutral so nothing in this band drifts violet. */}
                  <NavIcon
                    name={service.icon}
                    className="h-6 w-6 shrink-0 text-fg-on-dark"
                  />
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-fg-on-dark-muted transition-colors duration-fast group-hover/card:text-white"
                  />
                </span>

                <h3 className="mt-6 text-body-lg font-medium text-white">{service.title}</h3>
                <p className="text-small leading-5 text-fg-on-dark-secondary">{service.body}</p>
              </Link>
            </CardRailItem>
          ))}
        </CardRail>
      </Reveal>
    </Section>
  );
}
