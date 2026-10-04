import { CtaButton, Grid, Headline } from "@/components/ref/kit";
import { billing } from "@/data/company";
import { PROCESS } from "../_content";

/**
 * "How an automation gets built".
 *
 * This band occupies the slot the reference used for four VPS plan cards, and
 * is the clearest sign the page is no longer selling a server. We do not
 * publish a tier for this work — what it costs depends on how many workflows
 * and what they touch — so the band that used to quote prices now explains the
 * engagement and sends people to the mapping call instead.
 *
 * Shape is inherited rather than invented: four cards in a row on the 1280
 * grid at the reference's 16px gutter, `surface-dark` at a 24px radius, over
 * the same full-width panel the reference used for "everything you need".
 * Keeping the geometry means the page still reads as one design after the
 * content underneath it changed completely.
 */
export function Process() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="n8n-process-heading"
      className="scroll-mt-32 bg-canvas-dark py-12 xl:py-12"
    >
      <Grid>
        <Headline
          id="n8n-process-heading"
          title={PROCESS.title}
          description={PROCESS.description}
          tone="dark"
          className="mb-10 xl:mb-12"
        />

        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PROCESS.steps.map((step) => (
            <li key={step.key} className="flex h-full flex-col rounded-3xl bg-surface-dark p-6">
              {/* The step number is decorative — the list is already ordered,
                  so announcing "01" as content would just repeat it. */}
              <span
                aria-hidden
                className="text-[14px] leading-5 font-semibold tracking-[0.08em] text-brand-400"
              >
                {step.n}
              </span>
              <h3 className="mt-3 text-[20px] leading-7 font-semibold tracking-[-0.1px] text-fg-on-dark">
                {step.title}
              </h3>
              <p className="mt-2 text-body text-fg-on-dark-secondary">{step.body}</p>
            </li>
          ))}
        </ol>


        <div className="mt-10 flex justify-center">
          <CtaButton href={billing.sales} tone="on-dark">
            {PROCESS.cta}
          </CtaButton>
        </div>
      </Grid>
    </section>
  );
}

/**
 * "Every automation comes with the parts people forget".
 *
 * Three columns that read DOWN, not across — they are grouped by theme
 * (what you can see / what we handle / what stays yours) and re-flowing them
 * into row order would scramble that.
 */
