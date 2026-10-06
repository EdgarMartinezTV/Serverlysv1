import Link from "next/link";
import { ArrowUpRight, CtaButton, Grid, PillLabel } from "@/components/ref/kit";
import { formatPrice, groupById, lowestRate } from "@/data/pricing";

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
    href: "https://convoai.cloud/",
  },
  {
    pill: "Live",
    title: "CallFlow",
    body: "A voice agent that answers the phone, books the job and sends the transcript.",
    href: "https://callflow.serverlys.com/",
  },
] as const;

export function PromoBento() {
  const starter = groupById("cloud")?.plans.find((p) => p.monthly === lowestRate);
  return (
    <section aria-labelledby="promo-heading" className="bg-canvas py-12 md:py-16">
      <Grid>
        <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
          {/* The brand card carries the one claim the company sells on: the
              rate you start on and the rate it renews at, side by side. */}
          <div className="relative isolate grid gap-8 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-7 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 -z-10 w-2/3 bg-white/[0.07] [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 -z-10 w-1/3 bg-white/[0.06] [clip-path:polygon(55%_0,100%_0,100%_100%,0_100%)]"
            />
            <div>
              <PillLabel tone="on-dark" className="w-fit">
                Pricing
              </PillLabel>
              <h2
                id="promo-heading"
                className="mt-10 text-[26px] leading-8 font-medium tracking-[-0.02em] text-white"
              >
                Both prices, before you pay
              </h2>
              <p className="mt-2 max-w-[440px] text-small text-fg-on-brand-muted">
                Every plan shows the rate it renews at next to the rate you start on, with
                the same tools and free migration.
              </p>
              <div className="mt-6">
                <CtaButton href="/pricing" tone="light">
                  Compare all plans
                </CtaButton>
              </div>
            </div>
            <div className="flex gap-8 text-white md:flex-col md:gap-4 md:text-right">
              <p>
                <span className="block text-small text-fg-on-brand-muted">Starts at</span>
                <span className="tabular block text-[48px] leading-none font-medium tracking-[-0.03em]">
                  {formatPrice(lowestRate)}
                  <span className="ml-1 text-body font-normal tracking-normal text-fg-on-brand-muted">
                    /mo
                  </span>
                </span>
              </p>
              {starter && (
                <p>
                  <span className="block text-small text-fg-on-brand-muted">Renews at</span>
                  <span className="tabular block text-h4">{formatPrice(starter.standard)}/mo</span>
                  {starter.setupFee ? (
                    <span className="block text-micro text-fg-on-brand-muted">
                      plus {formatPrice(starter.setupFee)} one-off setup
                    </span>
                  ) : null}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {SIDE.map((s, i) => (
              <Link
                key={s.title}
                href={s.href}
                className="group relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-brand-50 p-6 transition-colors duration-fast hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="flex items-start justify-between gap-4">
                  <PillLabel tone="brand">{s.pill}</PillLabel>
                  <ArrowUpRight className="size-5 shrink-0 text-fg transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="mt-6 block pr-20 text-body-lg font-medium text-fg">{s.title}</span>
                <span className="mt-1 block pr-20 text-small text-fg-secondary">{s.body}</span>
                <span
                  aria-hidden="true"
                  className="absolute right-5 bottom-5 inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-e3 ring-8 ring-white/70"
                >
                  {i === 0 ? (
                    <svg viewBox="0 0 24 24" fill="none" className="size-6">
                      <path d="M5 6h14v9H9l-4 3V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="size-6">
                      <path d="M6.6 4h3l1.5 4-2 1.3a10 10 0 0 0 5.6 5.6l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.6 6.2 2 2 0 0 1 6.6 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Grid>
    </section>
  );
}
