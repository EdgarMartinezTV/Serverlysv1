import { Container } from "@/components/ui/container";

/**
 * Guarantee strip, directly under the hero.
 *
 * Purpose: remove purchase risk at the moment interest is highest. Every claim
 * here is one Serverlys already makes and is contractually backed — refund
 * policy, free migration, free SSL and backups.
 *
 * Deliberately NOT a logo wall or a metrics row: no customer logos exist to
 * show, and inventing an uptime figure or a customer count to fill the space
 * would undermine the exact thing this section is for.
 *
 * ⚠ IT STILL READS AS A SPECIFICATION, NOT AS FOUR CARDS. That was the original
 * decision and it is the right one for infrastructure — rules between items,
 * one continuous object, no floating tiles. What changed is the CONTAINMENT.
 *
 * WHY IT IS NOW A PANEL THAT OVERLAPS THE HERO. Three faults, all visible in a
 * screenshot rather than in the markup:
 *
 *  1. IT WAS THE FLATTEST THING ON THE PAGE. A full-bleed white band with
 *     hairline rules, landing directly beneath a hero carrying three radial
 *     gradients and a grid overlay. Everything else on this page is a
 *     deliberate object — plan cards, the bento, the console. This was the only
 *     band that looked like a footnote, and it is the one making the money-back
 *     promise.
 *
 *  2. THE HERO ALREADY SAYS THREE OF THESE FOUR THINGS. Its check row is
 *     "30-day money-back · Free migration · Free domain & SSL · Daily backups",
 *     about 150px above. Read as two separate bands, the second one is a
 *     repetition and reads as padding. Read as ONE object crossing the seam,
 *     the check row is the promise and the panel is the specification behind
 *     it — same words, different job, and the overlap is what makes that
 *     relationship legible instead of redundant.
 *
 *  3. THE TEXT TOUCHED THE RULES. `max-w-[26ch]` against a quarter of a wide
 *     container put "Included on all plans, and restores are" hard against the
 *     divider beside it. Cell padding now owns that clearance, so no measure
 *     can collide with a rule regardless of copy length.
 *
 * ⚠ NO MOTION, BY THE DESIGN SYSTEM'S RULE. This is above-the-fold content:
 * animation here delays LCP and reads as latency. The depth is static — ring,
 * shadow and the overlap itself.
 */
const GUARANTEES = [
  {
    stat: "Free",
    label: "Migration",
    detail: "Site, database and email moved to staging before DNS changes.",
  },
  {
    stat: "30-day",
    label: "Money back",
    detail: "On every hosting plan, no questions asked.",
  },
  {
    stat: "Daily",
    label: "Backups",
    detail: "Included on all plans, and restores are free.",
  },
  {
    stat: "$0",
    label: "Setup fees",
    detail: "Free SSL and free WHOIS privacy included too.",
  },
] as const;

export function TrustBar() {
  return (
    <section
      aria-labelledby="guarantees-heading"
      /*
       * ⚠ ONE VARIABLE DRIVES BOTH THE PULL-UP AND THE BACKGROUND, and it has
       * to, because the first version got this wrong in a way that looked
       * right in the markup and was invisible in review.
       *
       * The pull-up alone is not enough. `bg-canvas` on this section fills its
       * whole box — including the part sitting over the hero — so the white
       * simply painted over the dark and the hero appeared to end 80px early.
       * Geometry said the panel overlapped; the screenshot showed a flush seam,
       * because the thing it overlapped had been covered up by this element's
       * own background.
       *
       * So the background is a gradient with a hard stop at `--overlap`:
       * transparent above it (the hero shows through, and the panel really does
       * float on the dark), opaque `--color-canvas` below it. Both the margin
       * and the stop read the same custom property, so they cannot drift apart.
       *
       * `relative` is what puts this above the hero. The hero sets `isolate`,
       * so it is its own stacking context and this later sibling paints over it
       * without needing a z-index to fight for.
       *
       * The band below the stop is still `--color-canvas`, so the surface
       * rhythm in `app/page.tsx` — abyss · white · lavender — is unchanged.
       */
      className={[
        "relative [--overlap:3.5rem] sm:[--overlap:4rem] lg:[--overlap:5rem]",
        "mt-[calc(var(--overlap)*-1)]",
        "bg-[linear-gradient(to_bottom,transparent_0,transparent_var(--overlap),var(--color-canvas)_var(--overlap))]",
        "pb-14 sm:pb-16 lg:pb-20",
      ].join(" ")}
    >
      <Container width="wide">
        <h2 id="guarantees-heading" className="sr-only">
          What is included with every plan
        </h2>

        <div className="overflow-hidden rounded-xl bg-canvas shadow-e4 ring-1 ring-line">
          {/*
            A single hairline of brand along the top edge — the one decorative
            mark on the panel, and it earns its place twice: it gives the white
            panel a defined edge where it crosses the dark band, and it ties the
            panel to the hero's own accent so the two read as one composition
            rather than as two bands that happen to touch.

            ⚠ IT FADES AT BOTH ENDS. A solid 2px brand bar across the full width
            was the first attempt and it read as a progress indicator — the eye
            waits for something to fill. Fading into the corners makes it a
            highlight on an edge instead, which is what it is, and it also
            avoids a hard blue terminus meeting the rounded corner.
          */}
          <div
            aria-hidden="true"
            className="h-0.5 w-full bg-[linear-gradient(90deg,transparent,var(--color-primary)_16%,var(--color-primary)_84%,transparent)]"
          />

          {/*
            ⚠ FOUR-UP AT `xl`, NOT AT `lg`. At 1024 the wide container divides
            into 236px columns, and 236 minus the 28px of padding each side
            leaves 180px of measure — narrow enough that "30-day MONEY BACK"
            wrapped onto two lines while the other three stats stayed on one.
            The result was a row of four cells whose headline baselines did not
            agree, which is the sort of thing that reads as carelessness rather
            than as a breakpoint being one step early.

            Two-up holds from 640 all the way to 1280, where the columns are
            comfortable again.
          */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {GUARANTEES.map((g, i) => (
              <div
                key={g.label}
                className={[
                  /*
                    Padding owns the clearance from the rules — see fault 3 in
                    the header. px-7 on both sides means the measure below can
                    never reach a divider, whatever the copy does.
                  */
                  "flex flex-col gap-2 border-line px-7 py-8 lg:py-9",
                  /*
                    ⚠ RULES, WORKED OUT PER BREAKPOINT RATHER THAN PATCHED.
                    The first version of this stacked five partly-contradictory
                    conditions (two of them identical) and got the 2-column case
                    wrong. The grid is 1 / 2 / 4 columns, so:

                      1 col  — a rule above every item but the first
                      2 cols — rule above the SECOND row only (items 2,3);
                               rule left of the right-hand column (items 1,3)
                      4 cols — no rules above at all; rule left of items 1,2,3

                    The column counts are 1 / sm:2 / xl:4, so the last line is
                    `xl:` — it has to track the grid, not the `lg` breakpoint
                    the overlap happens to use.

                    Each line below owns exactly one of those statements.
                  */
                  i > 0 && "border-t",
                  i === 1 && "sm:border-t-0",
                  i % 2 === 1 && "sm:border-l",
                  i > 0 && "xl:border-t-0 xl:border-l",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="tabular text-h3 leading-none text-fg">{g.stat}</span>
                  <span className="font-mono text-caption uppercase leading-none text-primary">
                    {g.label}
                  </span>
                </dt>
                {/*
                  No `max-w` in ch. The cell is already a quarter of a wide
                  container and its padding sets the measure; a second limit in
                  character units was what produced the collision with the rule
                  beside it, because it was tuned against a different width.
                */}
                <dd className="text-small leading-6 text-fg-secondary">{g.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
