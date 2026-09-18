import { WHAT_IS } from "../_content";
import { Bolt, CtaButton, Gear, Grid, ShieldCheck } from "@/components/ref/kit";
import { IconChip, StorePanel } from "./visuals";

const ICONS = { bolt: Bolt, shield: ShieldCheck, gear: Gear } as const;

/**
 * "What is cloud hosting?" — a full-width split card, then a three-up card row
 * inside a second full-width panel. Both sit in one band 16px apart, which is
 * why they are siblings here rather than two bands.
 *
 * The split card is `--reverse` on the reference: media left, copy right.
 */
export function WhatIs() {
  return (
    <section aria-labelledby="cloud-what-is-heading" className="bg-canvas py-8 xl:py-12">
      <Grid>
        <div className="flex flex-col gap-4">
          {/* Split card. */}
          <div className="flex flex-col gap-6 overflow-hidden rounded-2xl bg-canvas-secondary xl:flex-row xl:gap-12">
            <StorePanel className="aspect-[614/542] w-full shrink-0 xl:w-[614px]" />
            <div className="flex flex-col justify-center gap-4 p-6 xl:py-6 xl:pr-20 xl:pl-0">
              <h2
                id="cloud-what-is-heading"
                className="text-[24px] leading-8 font-normal tracking-[-0.12px] text-fg xl:text-[32px] xl:leading-10 xl:tracking-[-0.16px]"
              >
                {WHAT_IS.title}
              </h2>
              <p className="text-body text-fg-secondary">{WHAT_IS.description}</p>
              <div className="mt-2">
                <CtaButton href="#pricing" className="w-full xl:w-auto">
                  {WHAT_IS.cta}
                </CtaButton>
              </div>
            </div>
          </div>

          {/* Three-up card row. */}
          <div className="rounded-2xl bg-canvas-secondary p-8 xl:p-12">
            <div className="grid gap-x-6 gap-y-8 xl:grid-cols-3">
              {WHAT_IS.cards.map((c) => {
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
