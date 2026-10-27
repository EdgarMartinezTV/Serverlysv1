import Link from "next/link";
import { Button } from "@/components/ui/button";
import { billing } from "@/data/company";
import { formatPrice, groupById } from "@/data/pricing";
import { Pill } from "./band";

/**
 * Shared pieces for the hosting tiers that are NOT on sale yet (/shared-hosting,
 * /vps-hosting).
 *
 * Two rules these exist to enforce in one place:
 *
 *  1. A coming-soon page states its status before it describes the product,
 *     and describes everything as planned. No price, no launch date.
 *  2. The plans these pages DO show are the cloud plans, which are real and
 *     orderable today. They are read from `src/data/pricing.ts` and always
 *     printed with both the advertised and the standard (renewal) rate, plus
 *     Starter's setup fee — never the advertised rate alone.
 */

/** "Not on sale yet" notice with the ask-us / tell-me-when action. */
export function ComingSoonNotice({ product }: { product: string }) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-warning-soft/60 p-7 ring-1 ring-warning/20 sm:flex-row sm:items-center sm:p-9">
      <div>
        <Pill tone="warning">Coming soon · not on sale yet</Pill>
        <p className="mt-4 max-w-2xl text-body text-fg">
          {product} is not available to order today, and we are not publishing a price or a launch
          date until both are real. Everything on this page describes the plan as we are building
          it. If it is what you need, tell us: requests are how we decide what the first plans
          include, and we will reply on the same ticket when it opens.
        </p>
      </div>
      <Button href={billing.sales} external>
        Ask to be told at launch
      </Button>
    </div>
  );
}

/** The four cloud plans, real prices, both rates. */
export function CloudPlansToday() {
  const cloud = groupById("cloud");
  if (!cloud) return null;
  const setup = cloud.plans.find((p) => p.setupFee);

  return (
    <div className="mt-12">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cloud.plans.map((plan) => (
          <li key={plan.tier} className="flex flex-col rounded-2xl bg-canvas p-6 ring-1 ring-line">
            <span className="flex items-center justify-between gap-2">
              <h3 className="text-body-lg font-semibold text-fg">{plan.name}</h3>
              <Pill tone="success">Available now</Pill>
            </span>
            <p className="mt-4 text-h4 font-semibold text-fg">
              {formatPrice(plan.monthly)}
              <span className="text-small font-normal text-fg-secondary">/mo</span>
            </p>
            <p className="mt-1 text-small text-fg-secondary">
              Renews at {formatPrice(plan.standard)}/mo
              {plan.setupFee ? ` · ${formatPrice(plan.setupFee)} setup fee` : ""}
            </p>
            <dl className="mt-5 flex flex-1 flex-col gap-1.5 border-t border-line-subtle pt-4 text-small">
              {(
                [
                  ["Memory", plan.specs.memory],
                  ["Websites", plan.specs.sites],
                  ["Visits", plan.specs.visits],
                  ["Storage", plan.specs.storage],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-fg-muted">{k}</dt>
                  <dd className="text-right font-medium text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <Button href="/cloud-hosting#pricing">See the cloud plans</Button>
        <p className="max-w-[720px] text-micro text-fg-muted">
          Monthly rates excluding applicable taxes. The first figure is the advertised rate and the
          plan renews at the second.
          {setup?.setupFee ? ` ${setup.name} carries a one-off ${formatPrice(setup.setupFee)} setup fee.` : ""}{" "}
          Unlimited storage and unmetered bandwidth are subject to fair use. Full feature list on{" "}
          <Link href="/cloud-hosting" className="font-semibold text-primary hover:text-primary-hover">
            the cloud hosting page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
