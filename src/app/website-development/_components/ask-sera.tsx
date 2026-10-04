"use client";

import { useSeraOptional } from "@/components/sera/sera-provider";
import { billing } from "@/data/company";

/** Opens Sera when it is mounted; otherwise the same control links to sales. */
export function AskSeraButton({ label }: { label: string }) {
  const sera = useSeraOptional();
  const cls =
    "inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-body font-semibold text-white transition-colors duration-fast hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  if (!sera) {
    return (
      <a href={billing.sales} className={cls}>
        {label}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={() => sera.open()}>
      {label}
    </button>
  );
}
