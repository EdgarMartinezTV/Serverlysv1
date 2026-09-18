import Link from "next/link";
import { ArrowUpRight, CtaButton, Grid, PillLabel } from "@/components/ref/kit";
import { lowestRate } from "@/data/pricing";

/**
 * The reference's `homepage-agents-hero` bento: one wide brand card spanning
 * two thirds, and two stacked light cards on the right that link out.
 *
 * Measured: 80px band padding, 16px card radius, the wide card carrying a
 * label pill, a 32/40 heading, a lede and a light CTA; the two right cards
 * each carry a pill, a 24/32 title, one line of body and a corner arrow.
 */
const SIDE = [
  {
    pill: "Live",
    title: "ConvoAI",
    body: "A chat agent trained on your own site, answering before you wake up.",
    href: "/convoai",
  },
  {
    pill: "Live",
    title: "CallFlow",
    body: "A voice agent that answers the phone, books the job and sends the transcript.",
    href: "/callflow-ai",
  },
] as const;

export function PromoBento() {
  return (
    <section aria-labelledby="promo-heading" className="bg-canvas py-14 md:py-16 xl:py-20">
      <Grid>
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="flex flex-col justify-end rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 p-10 xl:col-span-2">
            <PillLabel tone="on-dark" className="w-fit">
              Pricing
            </PillLabel>
            <h2
              id="promo-heading"
              className="mt-8 text-[28px] leading-9 font-normal tracking-[-0.14px] text-white lg:text-[32px] lg:leading-10 lg:tracking-[-0.16px]"
            >
              Plans and prices
            </h2>
            <p className="mt-3 max-w-[520px] text-body text-fg-on-brand-muted">
              Every plan carries the tools, the free migration and the renewal rate up front —
              from ${lowestRate.toFixed(2)}/mo.
            </p>
            <div className="mt-8">
              <CtaButton href="/pricing" tone="light">
                Explore all offers
              </CtaButton>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {SIDE.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group flex flex-1 flex-col rounded-2xl bg-canvas-secondary p-8 ring-1 ring-line transition-colors duration-fast hover:bg-canvas-inset"
              >
                <span className="flex items-start justify-between gap-4">
                  <PillLabel tone="success">{s.pill}</PillLabel>
                  <ArrowUpRight className="size-6 shrink-0 text-fg transition-transform duration-fast group-hover:translate-x-0.5" />
                </span>
                <p className="mt-8 text-[24px] leading-8 font-normal tracking-[-0.12px] text-fg">
                  {s.title}
                </p>
                <p className="mt-2 text-body text-fg-secondary">{s.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </Grid>
    </section>
  );
}
