"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { checkDomains } from "@/lib/domains/client";
import { parseDomainInput } from "@/lib/domains/normalize";
import type { CheckError, DomainResult } from "@/lib/domains/types";
import { billing } from "@/data/company";

/**
 * Hero domain search — the compact sibling of `DomainSearchApp`.
 *
 * Same real provider, same honest states, fewer affordances: no shortlist, no
 * recent searches, no TLD preference. Those belong on /domain-name-search where
 * someone has arrived to do the job properly. Here the goal is to answer one
 * question in one keystroke and hand off.
 *
 * Availability is never invented. "unknown" renders as unknown — RDAP can fail
 * or a registry can refuse, and rounding that to "available" would send someone
 * to checkout for a name they cannot have.
 *
 * But unknown is not a dead end either. EVERY row, every error, and the footer
 * hand the exact name to the WHMCS domain cart, which is the authority on what
 * this install sells and at what price. So any name at all can be searched from
 * here: names we price get a verdict and a price inline, and everything else
 * gets one click to the place that can answer properly.
 */

type Phase =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "results"; results: DomainResult[]; query: string }
  | { kind: "error"; error: CheckError; query: string };

const MAX_ROWS = 4;

export function HeroDomainSearch({ className }: { className?: string }) {
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [validation, setValidation] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const baseId = useId();
  const errorId = `${baseId}-error`;

  useEffect(() => () => abortRef.current?.abort(), []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const parsed = parseDomainInput(value);
    if (!parsed.ok) {
      setValidation(parsed.message);
      setPhase({ kind: "idle" });
      return;
    }
    setValidation(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase({ kind: "loading" });
    const outcome = await checkDomains(value, controller.signal);
    if (controller.signal.aborted) return;

    const query = parsed.domain ?? `${parsed.sld}.com`;
    if (outcome.ok) setPhase({ kind: "results", results: outcome.data.results, query });
    else setPhase({ kind: "error", error: outcome.error, query });
  }

  const rows = phase.kind === "results" ? phase.results.slice(0, MAX_ROWS) : [];

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={submit} role="search" aria-label="Search for a domain name">
        {/* ONE control, on every viewport.
            · It used to stack to `flex-col` below `sm`, which put a full-width
              Search button under the field inside a shared border and read as
              two separate inputs — on the primary conversion control of the
              site. It stays a row; the button loses horizontal padding instead
              of its place.
            · The ring is on this wrapper via `has-[:focus-visible]`, because
              the <input> inside carries `outline-none` and was therefore the
              one focusable thing on the page with no visible focus state.
              Keyboard focus now lights the field and its button as the single
              control they are. */}
        <div className="flex flex-row items-center gap-2 rounded-xl bg-white/[0.07] p-2 ring-1 ring-inset ring-white/15 backdrop-blur-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white">
          <label htmlFor={`${baseId}-input`} className="sr-only">
            Find your domain name
          </label>
          <div className="flex flex-1 items-center gap-2.5 px-3">
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-4.5 w-4.5 shrink-0 text-fg-on-dark-muted"
            >
              <circle
                cx="9"
                cy="9"
                r="6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="m13.5 13.5 3.5 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              id={`${baseId}-input`}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (validation) setValidation(null);
              }}
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Find your domain name"
              aria-describedby={validation ? errorId : undefined}
              aria-invalid={validation ? true : undefined}
              className="h-12 w-full bg-transparent text-body text-white outline-none placeholder:text-fg-on-dark-muted"
            />
          </div>
          <button
            type="submit"
            disabled={phase.kind === "loading"}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-4 text-body font-medium text-fg transition-colors duration-fast hover:bg-ink-100 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-6"
          >
            {phase.kind === "loading" && <Spinner className="h-4 w-4" />}
            Search
          </button>
        </div>
      </form>

      {validation && (
        <p id={errorId} role="alert" className="mt-2 text-small text-error-on-dark">
          {validation}
        </p>
      )}

      {/* Results. aria-live so a search performed by keyboard is announced. */}
      <div aria-live="polite" className="mt-2">
        {phase.kind === "error" && (
          <p
            role="alert"
            className="rounded-lg bg-white/[0.06] px-3.5 py-2.5 text-small text-fg-on-dark-secondary ring-1 ring-inset ring-white/12"
          >
            {phase.error.message}{" "}
            <a
              href={billing.searchDomain(phase.query)}
              className="font-medium text-primary-on-dark underline-offset-4 hover:underline"
            >
              Check {phase.query} at checkout
            </a>
          </p>
        )}

        {rows.length > 0 && (
          <ul className="overflow-hidden rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/12">
            {rows.map((result) => (
              <li
                key={result.domain}
                className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-white/8 px-3.5 py-2.5 last:border-b-0"
              >
                <span className="min-w-0 flex-1 truncate font-mono text-small text-white">
                  {result.domain}
                </span>

                {result.status === "available" && (
                  <>
                    <span className="tabular text-small text-fg-on-dark-secondary">
                      {result.price != null ? `$${result.price.toFixed(2)}/yr` : "—"}
                    </span>
                    <a
                      href={billing.searchDomain(result.domain)}
                      className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-[0.8125rem] font-medium text-white transition-colors duration-fast hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Get it
                      <span className="sr-only"> — {result.domain}</span>
                    </a>
                  </>
                )}

                {/* Taken is a real answer, and also a real intent: someone who
                    already owns it can move it here. The badge states the fact,
                    the link offers the only purchase that applies. */}
                {result.status === "registered" && (
                  <>
                    <span className="shrink-0 rounded-full bg-white/8 px-2.5 py-1 text-micro text-fg-on-dark-muted">
                      Taken
                    </span>
                    <a
                      href={billing.transferDomainSearch(result.domain)}
                      className="shrink-0 rounded-full px-2.5 py-1 text-micro text-primary-on-dark underline-offset-4 transition-colors duration-fast hover:bg-white/10 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Transfer it
                      <span className="sr-only"> — {result.domain}</span>
                    </a>
                  </>
                )}

                {/* Uncertain is not a dead end. RDAP could not answer — either
                    the registry stayed quiet or it is a TLD we do not price —
                    so the row hands the exact name to WHMCS, which knows what
                    this install actually sells. Never guessed as available. */}
                {(result.status === "unknown" || result.status === "unsupported") && (
                  <a
                    href={billing.searchDomain(result.domain)}
                    className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-micro text-fg-on-dark-secondary ring-1 ring-inset ring-white/15 transition-colors duration-fast hover:bg-white/[0.18] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Check at checkout
                    <span className="sr-only"> — {result.domain}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        {phase.kind === "results" && (
          <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[0.8125rem] text-fg-on-dark-muted">
            <a
              href={billing.searchDomain(phase.query)}
              className="text-primary-on-dark underline-offset-4 hover:underline"
            >
              Search every extension at checkout
            </a>
            <span aria-hidden="true">·</span>
            <Link
              href="/register-domain"
              className="text-primary-on-dark underline-offset-4 hover:underline"
            >
              Full search and shortlist
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
