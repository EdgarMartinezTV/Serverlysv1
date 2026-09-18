import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { billing, company } from "@/data/company";

/**
 * Closing conversion block.
 *
 * On the BRAND band rather than the dark one: the final CTA sat directly above
 * the dark footer, and two adjacent dark bands merged into a single block that
 * robbed the page of a closing beat. Brand blue separates them and makes this
 * the most assertive moment on the page — which is what a final CTA is for.
 *
 * Only `fg-on-brand` (white, 5.41:1) and `fg-on-brand-muted` (ink-100, 4.74:1)
 * are legible here. The brand ramp itself fails: brand-100 is 4.44:1.
 *
 * Two paths only — buy, or talk to someone. More choices measurably reduce action.
 *
 * ⚠ `plansHref` DEFAULTS TO THE HOMEPAGE ANCHOR, and that default is the fix
 * for a real bug. This section is rendered on 26 pages and used to hardcode
 * `#plans` — a same-page anchor. Only three pages own an `id="plans"` section
 * (the homepage, /hosting and /wordpress-hosting), so on the other 23 the
 * primary closing CTA was a click that did nothing at all: no navigation, no
 * scroll, no error. Pages that DO own the anchor pass `plansHref="#plans"` so
 * they scroll to their own plans instead of leaving for the homepage.
 *
 * `scripts/audit-links.mjs` is what found this and is what will catch it again.
 */
export function FinalCta({ plansHref = "/#plans" }: { plansHref?: string } = {}) {
  return (
    <Section
      surface="light"
      spacing="base"
      labelledBy="final-cta-heading"
      className="bg-primary"
    >
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-2xl">
          <h2 id="final-cta-heading" className="text-h2 text-fg-on-brand">
            Start on a plan that still makes sense in year two.
          </h2>
          <p className="mt-4 text-body-lg text-fg-on-brand-muted">
            Free migration, free SSL and daily backups on every plan, with a 30-day
            money-back guarantee. Not sure which tier fits? Tell us what the site does
            and we will say.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
          <Button href={plansHref} variant="inverse" size="lg" block>
            Compare plans
          </Button>
          <Button href={billing.sales} variant="onBrand" size="lg" block>
            Talk to an expert
          </Button>
        </div>
      </div>

      <p className="mt-10 border-t border-line-on-brand pt-6 text-small text-fg-on-brand-muted">
        Prefer the phone?{" "}
        <a
          href={company.phoneHref}
          className="tabular inline-block py-1 text-fg-on-brand underline underline-offset-2 hover:text-fg-on-brand-muted"
        >
          {company.phone}
        </a>{" "}
        · Existing customer?{" "}
        <a
          href={billing.login}
          className="inline-block py-1 text-fg-on-brand underline underline-offset-2 hover:text-fg-on-brand-muted"
        >
          Client login
        </a>
      </p>
    </Section>
  );
}
