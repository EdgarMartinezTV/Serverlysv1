"use client";

import { Badge } from "@/components/ui/badge";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";
import type { DomainResult } from "@/lib/domains/types";

/**
 * One result. Two shapes (2026-10-03, after Hostinger's results list):
 *
 *   featured   the exact name searched — a large verdict card: green when
 *              available (price at display size, Register, save), neutral
 *              when taken (transfer + WHOIS routes, never a Register CTA).
 *   row        an alternative — name with the extension in brand blue,
 *              status badge, optional "Best value", price "/1st yr", save,
 *              outline Register.
 *
 * Contracts the tests hold: Available / Taken badges, "Transfer it here" on a
 * taken name, no register link on a taken or unsold row, "do not sell this
 * extension" copy, aria-pressed save button, register links ≥44px.
 */
export function DomainResultRow({
  result,
  featured = false,
  bestValue = false,
  saved,
  onToggleSave,
}: {
  result: DomainResult;
  featured?: boolean;
  bestValue?: boolean;
  saved: boolean;
  onToggleSave: (result: DomainResult) => void;
}) {
  const { domain, status, price } = result;
  const sellable = status === "available" && price !== null;
  // A WHMCS "available" goes straight into the cart. Anything else (the RDAP
  // fallback) goes to the WHMCS search, which re-checks before selling it.
  const registerUrl = result.source === "whmcs" ? billing.addDomain(domain) : billing.searchDomain(domain);
  const transferUrl = billing.transferDomainSearch(domain);
  const dot = domain.indexOf(".");
  const name = (
    <>
      <span>{dot > 0 ? domain.slice(0, dot) : domain}</span>
      {dot > 0 && <span className="text-primary">{domain.slice(dot)}</span>}
    </>
  );

  const save = (
    <button
      type="button"
      onClick={() => onToggleSave(result)}
      aria-pressed={saved}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        saved ? "bg-brand-50 text-primary ring-brand-200" : "bg-white text-fg-muted ring-line hover:text-primary",
      )}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
        <path
          d="M8 13.5S2.5 10.3 2.5 6.4A2.9 2.9 0 0 1 8 5a2.9 2.9 0 0 1 5.5 1.4C13.5 10.3 8 13.5 8 13.5Z"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">{saved ? `Remove ${domain} from saved names` : `Save ${domain}`}</span>
    </button>
  );

  if (featured) {
    const ok = status === "available";
    return (
      <li
        className={cn(
          "relative isolate flex flex-col gap-5 overflow-hidden rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
          ok ? "bg-success-soft ring-1 ring-inset ring-success/25" : "bg-canvas-secondary ring-1 ring-inset ring-line",
        )}
      >
        <div className="flex min-w-0 items-start gap-4">
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-full",
              ok ? "bg-success-fill text-white" : "bg-white text-fg-muted ring-1 ring-line",
            )}
          >
            {ok ? (
              <svg viewBox="0 0 16 16" fill="none" className="size-5"><path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" className="size-5"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" /><path d="M4.2 11.8 11.8 4.2" stroke="currentColor" strokeWidth="1.5" /></svg>
            )}
          </span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="break-all text-[24px] leading-8 font-semibold tracking-[-0.02em] text-fg">{name}</span>
              {status === "available" && <Badge tone="success">Available</Badge>}
              {status === "registered" && <Badge tone="neutral">Taken</Badge>}
              {status === "unknown" && <Badge tone="warning">No answer</Badge>}
              {status === "unsupported" && <Badge tone="neutral">Not offered</Badge>}
            </p>
            <p className="mt-1 text-small text-fg-secondary">
              {status === "available" && price !== null && "Great choice — it's yours if you register it now."}
              {status === "available" && price === null && "We do not sell this extension yet."}
              {status === "registered" && (
                <>
                  Already registered.{" "}
                  <a
                    href={transferUrl}
                    className="rounded-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Transfer it here
                  </a>{" "}
                  if it is yours, or{" "}
                  <a
                    href={`/whois-lookup?domain=${encodeURIComponent(domain)}`}
                    className="rounded-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
                  >
                    see who owns it
                  </a>
                  .
                </>
              )}
              {status === "unknown" && (result.reason ?? "The registry did not answer in time.")}
            </p>
          </div>
        </div>

        {sellable && (
          <div className="flex shrink-0 items-center gap-3">
            <p className="text-right">
              <span className="tabular block text-[26px] leading-none font-semibold tracking-[-0.02em] text-fg">${price.toFixed(2)}</span>
              <span className="text-small text-fg-muted">first year</span>
            </p>
            {save}
            <a
              href={registerUrl}
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-body font-semibold text-white shadow-e2 transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Register
              <span className="sr-only"> {domain}</span>
            </a>
          </div>
        )}
      </li>
    );
  }

  return (
    <li className="group flex flex-col gap-3 rounded-2xl px-2 py-4 transition-colors hover:bg-canvas-secondary sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="break-all text-body-lg font-medium text-fg">{name}</span>
          {bestValue && sellable && (
            <span className="rounded-md bg-success-soft px-2 py-0.5 text-micro font-semibold text-success">Best value</span>
          )}
          {status === "available" && <Badge tone="success">Available</Badge>}
          {status === "registered" && <Badge tone="neutral">Taken</Badge>}
          {status === "unknown" && <Badge tone="warning">No answer</Badge>}
          {status === "unsupported" && <Badge tone="neutral">Not offered</Badge>}
        </p>
        {status === "unknown" && result.reason && <p className="mt-1 text-small text-fg-muted">{result.reason}</p>}
        {status === "available" && price === null && (
          <p className="mt-1 text-small text-fg-muted">We do not sell this extension yet.</p>
        )}
        {status === "registered" && (
          <p className="mt-1 text-small text-fg-muted">
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

      {sellable && (
        <div className="flex shrink-0 items-center gap-3">
          <p className="text-right">
            <span className="tabular text-body-lg font-semibold text-fg">${price.toFixed(2)}</span>
            <span className="text-small text-fg-muted">/1st yr</span>
          </p>
          {save}
          <a
            href={registerUrl}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full px-5 text-small font-semibold text-primary ring-1 ring-inset ring-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Register
            <span className="sr-only"> {domain}</span>
          </a>
        </div>
      )}
    </li>
  );
}
