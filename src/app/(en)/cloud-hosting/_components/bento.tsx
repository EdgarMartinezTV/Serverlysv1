import { BENTO } from "../_content";
import { Band, CtaButton, Grid, Headline } from "@/components/ref/kit";
import { MigrationPanel, SecurityPanel, SpeedPanel, WordPressField } from "./visuals";

/**
 * "Everything you need to run a growing project" — the bento row.
 *
 * The reference lays this out on a 24-column grid: the wide cards span 16
 * columns, the narrow ones 8, with a 16px gutter. `grid-cols-3 gap-4` produces
 * the identical widths (741/363 at 1280, 848/416 at 1440) off one rule, so
 * that is what is used.
 *
 * Below 1280 the reference swaps the grid for a swipe carousel with dots. The
 * four cards stack here instead: same cards, same order, no JS, and nothing
 * hidden behind a gesture. That is the one deliberate departure in this
 * section.
 *
 * Surfaces here are brand blue end to end, measured rather than eyeballed. The
 * two pale cards used to take `canvas-lavender`, which is what read as purple
 * next to white; they use `primary-soft` (#eff6ff, hue 214°) now, the same hue
 * family as the brand.
 *
 * ⚠ THAT TOKEN NO LONGER EXISTS. `canvas-lavender` was deleted site-wide for
 * the same reason this section stopped using it years of commits earlier — see
 * globals.css. This note is kept because it records WHY these two cards are
 * `primary-soft` rather than a neutral: hue, not lightness, was the fault.
 *
 * The wide cards ramp brand-500 → brand-800 where the reference ramps light
 * periwinkle → purple. Both endpoints are brand blue on purpose: globals.css
 * reserves indigo for automation surfaces and violet for AI ones, so borrowing
 * either here would attach a meaning these cards do not have. The dark end
 * also keeps the bottom-left copy over brand-600 or deeper, which is where
 * white clears 4.5:1.
 */
export function Bento() {
  return (
    <Band labelledBy="cloud-bento-heading">
      <Grid>
        <Headline
          id="cloud-bento-heading"
          title={BENTO.title}
          className="mb-4 xl:mb-12"
        >
          <div className="mt-6 xl:mt-8">
            <CtaButton href="#pricing">{BENTO.cta}</CtaButton>
          </div>
        </Headline>

        <div className="grid gap-4 xl:grid-cols-3">
          {/* Row 1 — wide + narrow. */}
          <div className="relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 xl:col-span-2 xl:h-[447px] xl:flex-row xl:justify-between">
            {/* 440, not 424: keeps the reference's "WordPress tools, built / in"
                break in our wider DM Sans. See kit.tsx. */}
            <div className="relative z-10 flex max-w-[440px] flex-col justify-end gap-6 p-10">
              <h3 className="text-[32px] leading-10 font-normal tracking-[-0.16px] text-white xl:text-[36px] xl:leading-[44px] xl:tracking-[-0.18px]">
                {BENTO.wordpress.title}
              </h3>
              <p className="text-body text-white">{BENTO.wordpress.description}</p>
            </div>
            <WordPressField className="absolute inset-0 xl:relative xl:w-[408px] xl:shrink-0" />
          </div>

          <NarrowCard
            title={BENTO.data.title}
            description={BENTO.data.description}
            height="xl:h-[447px]"
          >
            <SecurityPanel className="h-[186px]" />
          </NarrowCard>

          {/* Row 2 — narrow + wide. */}
          <NarrowCard
            title={BENTO.fast.title}
            description={BENTO.fast.description}
            height="xl:h-[410px]"
          >
            <SpeedPanel className="h-[186px]" />
          </NarrowCard>

          <div className="flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 xl:col-span-2 xl:h-[410px]">
            <MigrationPanel className="h-[225px] w-full shrink-0" />
            <div className="flex flex-1 flex-col justify-end gap-4 pt-10 pr-8 pb-8 pl-10">
              <h3 className="text-[24px] leading-8 font-normal tracking-[-0.12px] text-white">
                {BENTO.migration.title}
              </h3>
              <p className="text-body text-white">{BENTO.migration.description}</p>
            </div>
          </div>
        </div>
      </Grid>
    </Band>
  );
}

/** The 8-column card: media band on top, copy beneath, on the lavender field. */
function NarrowCard({
  title,
  description,
  height,
  children,
}: {
  title: string;
  description: string;
  /** The reference's two rows are 447px and 410px tall, not one shared height. */
  height: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl bg-primary-soft ${height}`}
    >
      <div className="shrink-0">{children}</div>
      <div className="flex flex-1 flex-col justify-end gap-3 p-10">
        <h3 className="text-[24px] leading-8 font-normal tracking-[-0.12px] text-fg">
          {title}
        </h3>
        <p className="mt-1 text-body text-fg">{description}</p>
      </div>
    </div>
  );
}
