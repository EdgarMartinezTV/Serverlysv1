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
/**
 * Closing banner, shared by ~24 pages. 2026-10-03: the reference's closing
 * band (brand blue, angled slabs, big headline, one white button) replaces
 * the flat two-button row. Same props, same links.
 */
export function FinalCta({ plansHref = "/#plans" }: { plansHref?: string } = {}) {
  return (
    <section aria-labelledby="final-cta-heading" className="relative isolate overflow-hidden bg-primary">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[60%] bg-white/[0.06] [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]" />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[35%] bg-white/[0.05] [clip-path:polygon(45%_0,100%_0,100%_100%,0_100%)]" />
      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="max-w-[620px]">
          <h2 id="final-cta-heading" className="display-lg text-white">
            A plan that still makes sense in year two
          </h2>
          <p className="mt-5 max-w-[480px] text-body-lg text-white/85">
            Free migration, free SSL and daily backups on every plan, with a 30-day
            money-back guarantee.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={plansHref} variant="inverse" size="lg">
              Compare plans
            </Button>
            <Button href={billing.sales} variant="onBrand" size="lg">
              Talk to an expert
            </Button>
          </div>
          <p className="mt-8 text-small text-white/80">
            Prefer the phone?{" "}
            <a href={company.phoneHref} className="tabular inline-block py-1 text-white underline underline-offset-2">
              {company.phone}
            </a>{" "}
            · Existing customer?{" "}
            <a href={billing.login} className="inline-block py-1 text-white underline underline-offset-2">
              Client login
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
