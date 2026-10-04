"use client";

import Link from "next/link";
import { useSeraOptional } from "@/components/sera/sera-provider";

/**
 * "Find the right hosting" strip. The reference runs a quiz; Serverlys has
 * Sera, which asks the same questions and answers from the real plans. If the
 * provider is not mounted it degrades to a link to the pricing page.
 */
export function MatchBanner() {
  const sera = useSeraOptional();
  const cls =
    "inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-white px-6 text-body font-semibold text-fg transition-colors duration-fast hover:bg-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <div className="relative mt-6 flex flex-col gap-5 overflow-hidden rounded-2xl bg-[linear-gradient(90deg,var(--color-brand-950)_0%,var(--color-brand-700)_55%,var(--color-brand-500)_100%)] p-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <h3 className="text-body-lg font-semibold text-white">
          Find the right hosting for your website
        </h3>
        <p className="mt-1 text-small text-fg-on-brand-muted">
          Tell Sera what you run and it recommends a plan, with the price it renews at.
        </p>
      </div>
      {sera ? (
        <button
          type="button"
          className={cls}
          onClick={() => {
            sera.open();
            sera.send("Help me choose the right cloud hosting plan", {
              label: "Cloud hosting",
            });
          }}
        >
          Ask Sera
        </button>
      ) : (
        <Link href="/pricing" className={cls}>
          Compare plans
        </Link>
      )}
    </div>
  );
}
