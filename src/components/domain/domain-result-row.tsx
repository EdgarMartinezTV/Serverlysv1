"use client";

import { Badge } from "@/components/ui/badge";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";
import type { DomainResult } from "@/lib/domains/types";

/**
 * One availability result.
 *
 * Status drives everything — the badge, the price, and which action is offered.
 * An "unknown" row NEVER shows a register CTA: we do not know it is available,
 * so offering to sell it would be the fabrication this whole feature avoids.
 */
export function DomainResultRow({
  result,
  featured = false,
  saved,
  onToggleSave,
}: {
  result: DomainResult;
  featured?: boolean;
  saved: boolean;
  onToggleSave: (result: DomainResult) => void;
}) {
  const { domain, status, price } = result;
  const sellable = status === "available" && price !== null;

  /* company.ts owns the cart contract and says to route through these rather
     than hand-building the URL; this file used to duplicate it. */
  const registerUrl = billing.searchDomain(domain);
  const transferUrl = billing.transferDomainSearch(domain);

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5",
        featured
          ? status === "available"
            ? "bg-success-soft ring-1 ring-inset ring-success/25"
            : "bg-canvas-secondary ring-1 ring-inset ring-line"
          : "bg-surface ring-1 ring-inset ring-line",
      )}
    >
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            className={cn(
              "break-all font-medium text-fg",
              featured ? "text-h4" : "text-body",
            )}
          >
            {domain}
          </span>
          {status === "available" && <Badge tone="success">Available</Badge>}
          {status === "registered" && <Badge tone="neutral">Taken</Badge>}
          {status === "unknown" && <Badge tone="warning">No answer</Badge>}
          {status === "unsupported" && <Badge tone="neutral">Not offered</Badge>}
        </p>

        {status === "unknown" && result.reason && (
          <p className="mt-1.5 text-small text-fg-muted">{result.reason}</p>
        )}
        {status === "available" && price === null && (
          <p className="mt-1.5 text-small text-fg-muted">
            We do not sell this extension yet.
          </p>
        )}
        {status === "registered" && (
          <p className="mt-1.5 text-small text-fg-muted">
            Already registered.{" "}
            <a
              href={transferUrl}
              className="rounded-sm font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Transfer it here
            </a>{" "}
            if it is yours.
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {sellable && (
          <p className="text-right">
            <span className="tabular text-body font-semibold text-fg">
              ${price.toFixed(2)}
            </span>
            <span className="block text-small text-fg-muted">first year</span>
          </p>
        )}

        {sellable && (
          <>
            <button
              type="button"
              onClick={() => onToggleSave(result)}
              aria-pressed={saved}
              className={cn(
                "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md ring-1 ring-inset transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                saved
                  ? "bg-primary-soft text-primary ring-primary/40"
                  : "bg-surface text-fg-muted ring-line hover:text-fg",
              )}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
                <path
                  d="M4 2.5h8v11l-4-2.75L4 13.5v-11Z"
                  fill={saved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">
                {saved ? `Remove ${domain} from saved names` : `Save ${domain}`}
              </span>
            </button>

            <a
              href={registerUrl}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-primary px-5 text-small font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Register
              <span className="sr-only"> {domain}</span>
            </a>
          </>
        )}
      </div>
    </li>
  );
}
