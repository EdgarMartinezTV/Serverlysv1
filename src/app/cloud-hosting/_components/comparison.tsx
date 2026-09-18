import { COMPARISON } from "../_content";
import { ArrowLink, Band, Grid, Headline } from "@/components/ref/kit";
import { PerformancePanel, ResourcePanel, StatusPanel } from "./visuals";

const PANELS = {
  performance: PerformancePanel,
  status: StatusPanel,
  resources: ResourcePanel,
} as const;

/**
 * "Shared, cloud, or VPS" — three cards, each a 4:3 product still over a
 * heading, description and one link. 3-up from 1280, 2-up from 768.
 */
export function Comparison() {
  return (
    <Band labelledBy="cloud-comparison-heading">
      <Grid>
        <Headline
          id="cloud-comparison-heading"
          title={COMPARISON.title}
          description={COMPARISON.description}
          className="mb-8 xl:mb-12"
        />
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 md:gap-y-10 xl:grid-cols-3">
          {COMPARISON.cards.map((c) => {
            const Panel = PANELS[c.panel];
            return (
              <article key={c.title} className="flex flex-col items-start gap-4">
                <Panel className="aspect-[411/309] w-full" />
                <h3 className="mt-2 text-[24px] leading-8 font-semibold tracking-[-0.12px] text-fg">
                  {c.title}
                </h3>
                <p className="text-body text-fg-secondary">{c.description}</p>
                <ArrowLink href={c.link.href} className="mt-1">
                  {c.link.label}
                </ArrowLink>
              </article>
            );
          })}
        </div>
      </Grid>
    </Band>
  );
}
