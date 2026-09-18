"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { planGroups, formatPrice, orderUrl } from "@/data/pricing";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * Plan finder.
 *
 * Occupies the target's prompt-and-chips band, but does real work rather than
 * pretending to be an AI. Choosing what you run maps to a genuine
 * recommendation drawn from the pricing data — the same tiers sold in the
 * pricing section, with the same renewal figures — and hands off to the real
 * WHMCS product.
 *
 * No free-text box: a text field implies a language model that would have to
 * be either built or faked. Chips answer the same question honestly and are
 * faster to use.
 */
type Workload = {
  id: string;
  label: string;
  detail: string;
  group: string;
  tier: "starter" | "plus" | "turbo" | "business";
};

const WORKLOADS: readonly Workload[] = [
  {
    id: "blog",
    label: "A blog or brochure site",
    detail: "One site, steady traffic",
    group: "cloud",
    tier: "starter",
  },
  {
    id: "wordpress",
    label: "A WordPress site",
    detail: "Cached and auto-updated",
    group: "wordpress",
    tier: "plus",
  },
  {
    id: "store",
    label: "An online store",
    detail: "Checkout under load",
    group: "ecommerce",
    tier: "turbo",
  },
  {
    id: "agency",
    label: "Several client sites",
    detail: "Unlimited sites, one bill",
    group: "cloud",
    tier: "turbo",
  },
  {
    id: "traffic",
    label: "Something with spikes",
    detail: "Campaigns, launches, press",
    group: "cloud",
    tier: "business",
  },
];

export function PlanFinder() {
  const [chosen, setChosen] = useState<Workload | null>(null);

  const group = chosen ? planGroups.find((g) => g.id === chosen.group) : null;
  const plan = group?.plans.find((p) => p.tier === chosen?.tier);

  return (
    <section
      aria-labelledby="finder-heading"
      className="relative isolate overflow-hidden border-b border-line bg-canvas-secondary"
    >
      {/* Soft brand wash, mirroring the target's tinted band. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgb(34_126_255/0.10)_0%,transparent_70%)]"
      />
      <Container className="relative py-14 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-surface shadow-e2 ring-1 ring-line"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5 text-primary">
              <path
                d="M10 2.5 12 8l5.5 2-5.5 2-2 5.5L8 12l-5.5-2L8 8l2-5.5Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <h2 id="finder-heading" className="mt-6 text-h1 text-fg">
            Tell us what you are running.{" "}
            <span className="block text-primary">We will name the plan.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-body-lg text-fg-secondary">
            No sales call, no quiz. Pick the closest description and we will show you
            the tier that fits — with what it renews at.
          </p>
        </Reveal>

        <Reveal delay={80} className="mx-auto mt-10 max-w-3xl">
          <fieldset>
            <legend className="sr-only">What are you running?</legend>
            <div className="flex flex-wrap justify-center gap-2.5">
              {WORKLOADS.map((w) => {
                const active = chosen?.id === w.id;
                return (
                  <label
                    key={w.id}
                    className={cn(
                      "group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-small font-medium transition-colors duration-fast",
                      "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
                      active
                        ? "bg-primary text-white shadow-e2"
                        : "bg-surface text-fg-secondary shadow-e1 ring-1 ring-line hover:text-fg hover:ring-line-strong",
                    )}
                  >
                    <input
                      type="radio"
                      name="workload"
                      value={w.id}
                      checked={active}
                      onChange={() => setChosen(w)}
                      className="sr-only-focusable"
                    />
                    {w.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Result. aria-live so the recommendation is announced, not just seen. */}
          <div aria-live="polite" className="mt-8">
            {group && plan && chosen ? (
              <div className="flex flex-col items-start gap-5 rounded-xl bg-surface p-6 shadow-e3 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <p className="font-mono text-caption uppercase text-primary">
                    {chosen.detail}
                  </p>
                  <p className="mt-2 text-h3 text-fg">{plan.name}</p>
                  <p className="mt-1.5 text-small text-fg-secondary">
                    <span className="tabular font-semibold text-fg">
                      {formatPrice(plan.monthly)}
                    </span>
                    /mo · standard rate{" "}
                    <span className="tabular">{formatPrice(plan.standard)}</span>/mo
                  </p>
                </div>
                <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row">
                  <Button href={orderUrl(group, plan)} size="lg">
                    Get {plan.name}
                  </Button>
                  <Button href="#plans" variant="secondary" size="lg">
                    See all tiers
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-small text-fg-muted">
                Still unsure?{" "}
                <a
                  href={billing.sales}
                  className="inline-block rounded-sm py-1 font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Describe it to us
                </a>{" "}
                and we will answer honestly — including if the cheapest tier is enough.
              </p>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
