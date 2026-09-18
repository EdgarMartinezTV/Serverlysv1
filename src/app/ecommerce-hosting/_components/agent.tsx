import { CtaButton, Grid, PillLabel, ShieldCheck, Spark, Store } from "@/components/ref/kit";
import { AGENT } from "../_content";
import { ConvoChat } from "@/components/product-ui/live/convo-chat";
import { IconChip } from "./visuals";

const ICONS = { spark: Spark, store: Store, shield: ShieldCheck } as const;

/**
 * The reference's `h-mixed-cards`: a full-width split card, then a three-up
 * card row inside a second full-width panel, 16px apart inside one band. Both
 * panels are the lavender surface.
 *
 * The reference fills this slot with "Hostinger Agent". Ours is ConvoAI, a
 * product we actually ship, so the copy is not the reference's — only the
 * layout is. See the note above AGENT in _content.ts.
 */
export function Agent() {
  return (
    <section aria-labelledby="ecom-agent-heading" className="bg-canvas py-8 xl:py-12">
      <Grid>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-6 overflow-hidden rounded-2xl bg-canvas-secondary xl:flex-row xl:gap-12">
            {/*
             * The real ConvoAI chat, not a still — it is operable, and
             * components/product-ui/live carries its own "Live demo" badge for
             * honesty. That badge must stay visible, so the panel sits in a
             * padded column rather than bleeding to the card edge like the
             * reference's video does.
             */}
            <div className="p-6 xl:w-[614px] xl:shrink-0 xl:py-10 xl:pl-10">
              <ConvoChat />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 xl:py-6 xl:pr-20 xl:pl-0">
              <PillLabel className="w-fit">
                {AGENT.label}
              </PillLabel>
              <h2
                id="ecom-agent-heading"
                className="text-[24px] leading-8 font-semibold tracking-[-0.12px] text-fg"
              >
                {AGENT.title}
              </h2>
              <p className="text-body text-fg-secondary">{AGENT.description}</p>
              <div className="mt-2">
                <CtaButton href={AGENT.ctaHref} className="w-full xl:w-auto">
                  {AGENT.cta}
                </CtaButton>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-canvas-secondary p-8 xl:p-12">
            <div className="grid gap-x-6 gap-y-8 xl:grid-cols-3">
              {AGENT.cards.map((c) => {
                const Icon = ICONS[c.icon];
                return (
                  <div key={c.title} className="flex flex-col gap-2">
                    <div className="mb-2">
                      <IconChip icon={Icon} />
                    </div>
                    <h3 className="text-[20px] leading-7 font-semibold tracking-[-0.1px] text-fg">
                      {c.title}
                    </h3>
                    <p className="text-body text-fg-secondary">{c.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}
