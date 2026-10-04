import { Check, Grid, Headline } from "@/components/ref/kit";
import { billing } from "@/data/company";
import { INCLUDED } from "../_content";

/**
 * Plans — 2026-10-03, in the reference's plan-card format (four-up dark cards,
 * featured card lifted with a ribbon, specs under a rule, then the "every
 * plan includes" box).
 *
 * ⚠ NO PRICES. Automation work is quoted after the mapping call (see the FAQ
 * "How much does it cost?") and never priced per task or per run. Each card
 * says so instead of showing a number; inventing tier prices here would
 * contradict the FAQ two scrolls down.
 */
const PLANS = [
  {
    name: "One workflow",
    summary: "One job that keeps getting dropped, handled every time.",
    specs: ["One workflow, mapped and built", "Connected to the tools you use", "Hosted and monitored by us", "Changes on request"],
  },
  {
    name: "Workflow set",
    summary: "The daily admin, end to end: enquiry, booking, follow-up.",
    featured: true,
    specs: ["Several connected workflows", "AI steps where they earn it", "Chat, call and form triggers", "Hosted and monitored by us"],
  },
  {
    name: "Ongoing automation",
    summary: "New workflows as the business changes, without a new project.",
    specs: ["New workflows as needs change", "Changes and fixes prioritised", "Run review on request", "Hosted and monitored by us"],
  },
] as const;

export function Plans() {
  return (
    <section id="plans" aria-labelledby="n8n-plans-heading" className="scroll-mt-32 bg-canvas-dark py-14 xl:py-20">
      <Grid>
        <Headline
          id="n8n-plans-heading"
          title="Pick how much you want automated"
          description="Every option starts with a free mapping call. We quote after it, never per task or per run."
          tone="dark"
          className="mb-12 xl:mb-14"
        />

        <ul className="grid items-end gap-4 md:grid-cols-3">
          {PLANS.map((p) => {
            const featured = "featured" in p && p.featured;
            return (
              <li key={p.name} className="relative">
                {featured && (
                  <div className="rounded-t-2xl bg-primary py-2 text-center text-small font-semibold text-white">
                    Best place to start
                  </div>
                )}
                <article
                  className={`flex flex-col p-6 ${
                    featured ? "rounded-b-2xl bg-[#0a1a3e] ring-2 ring-primary" : "rounded-2xl bg-surface-dark ring-1 ring-white/10"
                  }`}
                >
                  <h3 className="text-[20px] leading-7 font-semibold tracking-[-0.01em] text-white">{p.name}</h3>
                  <p className="mt-1.5 min-h-10 text-small text-fg-on-dark-secondary">{p.summary}</p>

                  <p className="mt-5 text-[30px] leading-none font-semibold tracking-[-0.03em] text-white">Custom quote</p>
                  <p className="mt-1.5 text-micro text-fg-on-dark-muted">After a free mapping call</p>

                  <a
                    href={billing.sales}
                    className={`mt-6 flex h-12 items-center justify-center rounded-md text-body font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      featured ? "bg-white text-fg hover:bg-ink-100" : "text-white ring-1 ring-inset ring-white/50 hover:bg-white/10"
                    }`}
                  >
                    Book the mapping call
                  </a>
                  <p className="mt-3 text-micro text-fg-on-dark-muted">No per-task or per-run billing. Nothing to sign before the call.</p>

                  <ul className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
                    {p.specs.map((s) => (
                      <li key={s} className="flex items-center gap-2.5 text-small text-white">
                        <Check className="size-4 shrink-0 text-success-fill" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Every option includes — moved here from How it works. */}
        <div className="mt-4 rounded-2xl bg-surface-dark px-3 py-8 xl:px-12">
          <h3 className="text-center text-[20px] leading-7 font-semibold tracking-[-0.01em] text-fg-on-dark lg:text-[24px] lg:leading-8">
            {INCLUDED.titleBefore}
            <b className="font-semibold text-brand-400">{INCLUDED.titleAccent}</b>
            {INCLUDED.titleAfter}
          </h3>
          <div className="mt-8 flex flex-col items-center gap-8 xl:flex-row xl:items-start xl:justify-center xl:gap-x-24">
            {INCLUDED.columns.map((column, i) => (
              <ul key={i} className="flex flex-col gap-3">
                {column.map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-small text-fg-on-dark">
                    <Check className="size-5 shrink-0 text-success-fill" />
                    <span>{item.label}</span>
                    {item.addon && <span className="shrink-0 text-micro font-semibold text-brand-400">{INCLUDED.addonLabel}</span>}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Grid>
    </section>
  );
}
