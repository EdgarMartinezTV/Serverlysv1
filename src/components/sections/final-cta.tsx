import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { billing, company } from "@/data/company";

/**
 * Closing conversion block. Two paths only: buy now, or talk to someone.
 * Offering more choices here measurably reduces action.
 */
export function FinalCta() {
  return (
    <Section surface="dark" spacing="base" labelledBy="final-cta-heading">
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="final-cta-heading" className="text-display-3 text-white">
            Start on a plan that still makes sense in year two.
          </h2>
          <p className="mt-4 text-body-lg text-ink-400">
            Free migration, free SSL and daily backups on every plan, with a
            30-day money-back guarantee. Not sure which tier fits? Tell us what
            the site does and we will say.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
          <Button href="#plans" variant="inverse" size="lg" block>
            Compare plans
          </Button>
          <Button href={billing.sales} variant="inverseOutline" size="lg" block>
            Talk to an expert
          </Button>
        </div>
      </div>

      <p className="mt-8 border-t border-ink-800 pt-6 text-body-sm text-ink-400">
        Prefer the phone?{" "}
        <a href={company.phoneHref} className="tabular text-ink-300 hover:text-white">
          {company.phone}
        </a>{" "}
        · Existing customer?{" "}
        <a href={billing.login} className="text-ink-300 hover:text-white">
          Client login
        </a>
      </p>
    </Section>
  );
}
