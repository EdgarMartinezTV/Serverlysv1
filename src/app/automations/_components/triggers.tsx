import { CtaButton, Grid } from "@/components/ref/kit";
import { TRIGGERS } from "../_content";
import { ConversationArt, FeatureIcon } from "./visuals";

/**
 * "Most of it starts with a customer saying something".
 *
 * Occupies the slot the reference used to advertise an AI assistant that
 * manages a VPS by chat — a product we do not sell, and one this page has no
 * reason to describe. The band keeps its shape and its chat artwork because
 * the honest version of it is also a conversation: ConvoAI and CallFlow are
 * real, they are where most workflows are triggered from, and the art now
 * shows a customer enquiry rather than a snapshot request.
 *
 * Measured at 1440: one 1280-wide `surface-dark` panel at a 16px radius, art
 * bled to the left edge against a copy column that stops 80px short of the
 * right, then a three-column row across the foot on 48px padding. Heading
 * 32/40 at -0.16px, feature titles 20/28, bodies 16/24.
 */
export function Triggers() {
  return (
    <section aria-labelledby="n8n-triggers-heading" className="bg-canvas-dark py-12 xl:py-12">
      <Grid>
        <div className="overflow-hidden rounded-2xl bg-surface-dark">
          <div className="grid items-center gap-10 xl:grid-cols-2 xl:gap-x-12">
            {/* The art bleeds to the panel's left and top edges but must not
                run into the feature row beneath it, hence the bottom inset. */}
            <ConversationArt className="pb-6 xl:pb-12" />

            <div className="flex flex-col px-6 pb-6 md:px-10 xl:py-12 xl:pr-20 xl:pl-0">
              <h2
                id="n8n-triggers-heading"
                className="text-[28px] leading-9 font-normal tracking-[-0.14px] text-fg-on-dark lg:text-[32px] lg:leading-10 lg:tracking-[-0.16px]"
              >
                {TRIGGERS.title}
              </h2>
              <p className="mt-4 text-body text-fg-on-dark-secondary">{TRIGGERS.body}</p>
              <div className="mt-6">
                <CtaButton
                  href={TRIGGERS.ctaHref}
                  tone="on-dark"
                  className="h-10 px-6 text-[14px]"
                >
                  {TRIGGERS.cta}
                </CtaButton>
              </div>
            </div>
          </div>

          <ul className="grid gap-x-12 gap-y-6 px-6 pb-10 md:px-10 xl:grid-cols-3 xl:px-12 xl:pb-12">
            {TRIGGERS.features.map((f) => (
              <li key={f.title} className="flex flex-col gap-2">
                <FeatureIcon kind={f.icon} className="size-10 text-brand-500" />
                <p className="text-[20px] leading-7 tracking-[-0.1px] text-fg-on-dark">{f.title}</p>
                <p className="text-body text-fg-on-dark-secondary">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Grid>
    </section>
  );
}
