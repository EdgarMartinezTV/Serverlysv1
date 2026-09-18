import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { stageById } from "./stages";

const stage = stageById("launch");

/**
 * Stage 2 — Launch.
 *
 * Built to measurements taken off Hostinger's own `#launch` row (2026-09-14,
 * 1440px), because "match it exactly" means the numbers, not the impression:
 *
 *   card      305 × 450, an anchor, no background of its own
 *   media     305 × 360, 16px radius, overflow hidden
 *   arrow     24 × 24, inset 16px from the top right
 *   label     20px below the media, column, 4px gap
 *   title     18px / 400 / 26px line-height / -0.09px tracking
 *   desc      14px / 400 / 20px line-height
 *   row       flex, 20px gap, cards at `flex: 1 1 0`
 *
 * 16px is written as a literal rather than `rounded-2xl`, which is 20px in this
 * system. Hostinger sets DM Sans too, so the type matches with nothing done to
 * it. Near-black is Serverlys' `--color-fg` (#0b0e14) rather than their
 * rgb(24,24,26) — indistinguishable at that value, and it keeps the card
 * consistent with the rest of the page.
 *
 * The expansion on hover lives in globals.css; the ratio it depends on is
 * documented there.
 *
 * ⚠ The images are Serverlys' own, out of `public/Hosting-images`, and the
 * descriptions are written here. Hostinger's card art is their licensed
 * photography and their sentences are their copy — the measurements are what
 * this is matching, not the contents.
 */
type LaunchTool = {
  title: string;
  desc: string;
  href: string;
  image: string;
  /**
   * Hostinger's arrow is near-black, which works because their artwork is pale.
   * Serverlys' art is not uniformly pale, so tone is set per card — the arrow
   * stays a bare arrow, no chip and no scrim added to the composition, and is
   * still legible on every one.
   *
   * ⚠ Measure this in the HOVERED state, which is the only state the arrow is
   * visible in, and measure it after the card has expanded — the crop moves
   * when the width changes. `Hosting` reads dark at rest and light once open;
   * picking its tone from the resting crop puts a white arrow on a white
   * backdrop at 1.33:1. Current hovered contrast: 13.4 / 12.2 / 16.3 / 5.4.
   */
  arrow: "dark" | "light";
};

/**
 * The four Launch cards, in Hostinger's order and taxonomy. Every one is a
 * product Serverlys actually sells and every href resolves to a real page — a
 * card here that led nowhere would be worse than a card that is missing.
 */
const TOOLS: readonly LaunchTool[] = [
  {
    title: "Hosting",
    desc: "NVMe storage and a managed LiteSpeed stack, on every plan.",
    href: "/hosting",
    image: "/Hosting-images/cloud-hosting-hero.png",
    arrow: "dark",
  },
  {
    title: "Domains",
    desc: "Register a new name, or move one in and keep the time you paid for.",
    href: "/register-domain",
    image: "/Hosting-images/Domains-DNS%20.png",
    arrow: "dark",
  },
  {
    title: "Business email",
    desc: "Mail on your own domain, with the MX records already pointed.",
    href: "/domain-name",
    image: "/Hosting-images/support-agent.png",
    arrow: "dark",
  },
  {
    title: "Free website migration",
    desc: "We move your existing site across, at no charge.",
    href: "/migrations",
    image: "/Hosting-images/Migration.png",
    arrow: "light",
  },
] as const;

export function StageLaunch() {
  return (
    <Section
      id={stage.id}
      surface="light"
      spacing="base"
      width="wide"
      labelledBy="launch-heading"
      className="scroll-mt-8"
    >
      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="02 · Launch"
          title={stage.heading}
          lede={stage.lede}
          id="launch-heading"
        />
        <div className="flex shrink-0 gap-3">
          <Button href="/register-domain" variant="primary">
            Find a domain
          </Button>
          <Button href="/transfer-domain" variant="outline">
            Transfer one in
          </Button>
        </div>
      </Reveal>

      <Reveal delay={80} className="mt-12">
        {/* Below lg this is a plain scroller holding the card at its real
            305px — there is no pointer to hover and four cards will not fit.
            At lg the cards become `flex: 1 1 0` and share the track, which is
            the layout the expansion needs to have something to redistribute. */}
        <ul
          aria-label="Launch tools"
          className="tools-row -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-pl-8 sm:px-8 lg:mx-0 lg:snap-none lg:overflow-visible lg:px-0"
        >
          {TOOLS.map((tool) => (
            <li
              key={tool.title}
              className="tools-card w-[min(305px,78vw)] shrink-0 snap-start lg:w-auto lg:min-w-0 lg:shrink lg:grow lg:basis-0"
            >
              <a
                href={tool.href}
                className="group block rounded-[16px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <div className="relative aspect-[305/360] w-full overflow-hidden rounded-[16px] bg-canvas-secondary lg:aspect-auto lg:h-[360px]">
                  <Image
                    src={tool.image}
                    alt=""
                    fill
                    sizes="(min-width: 64rem) 30vw, 305px"
                    className="object-cover"
                  />
                  {/* Hidden until the card is hovered or focused, at Hostinger's
                      0.3s — which is also why their near-black arrow never has
                      to survive a dark backdrop at rest. Focus is included so
                      the affordance exists for the keyboard, not just the
                      mouse. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
                      tool.arrow === "light" ? "text-white" : "text-fg",
                    )}
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6">
                      <path
                        d="M7 17 17 7M9 7h8v8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-1">
                  <span className="text-body-lg font-normal text-fg">
                    {tool.title}
                  </span>
                  <p className="text-[0.875rem] font-normal leading-[1.25rem] text-fg-secondary">
                    {tool.desc}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
