"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DomainResultRow } from "./domain-result-row";
import { parseDomainInput } from "@/lib/domains/normalize";
import {
  checkDomains,
  recentSearches,
  recentStore,
  shortlist,
  shortlistStore,
  type ShortlistItem,
} from "@/lib/domains/client";
import type { CheckError, DomainResult } from "@/lib/domains/types";
import { tlds } from "@/data/tlds";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * Domain search.
 *
 * Availability comes from a real provider via /api/domains/check — never from
 * client-side invention. Every state below corresponds to something that can
 * actually happen, and "we do not know" is a first-class outcome rather than
 * being rounded to "available".
 *
 * The cart lives in WHMCS. What we keep locally is a SHORTLIST — saved names,
 * persisted in localStorage — and each one hands off to the real WHMCS cart.
 * Presenting a local list as a cart would imply we hold state that we do not.
 */

type Phase =
  | { kind: "idle" }
  | { kind: "loading"; query: string }
  | { kind: "results"; query: string; results: DomainResult[]; source: string }
  | { kind: "error"; query: string; error: CheckError };

export function DomainSearchApp() {
  const [value, setValue] = useState("");
  const [preferredTld, setPreferredTld] = useState(".com");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [validation, setValidation] = useState<string | null>(null);
  const recent = useSyncExternalStore(
    recentStore.subscribe,
    recentStore.getSnapshot,
    recentStore.getServerSnapshot,
  );
  const saved = useSyncExternalStore(
    shortlistStore.subscribe,
    shortlistStore.getSnapshot,
    shortlistStore.getServerSnapshot,
  );
  const [slow, setSlow] = useState(false);
  const [retryIn, setRetryIn] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const errorId = `${baseId}-error`;

  // Countdown for a rate-limit response, so the user knows when to retry.
  useEffect(() => {
    if (retryIn <= 0) return;
    const t = setTimeout(() => setRetryIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [retryIn]);

  // "Still searching" only after the wait becomes noticeable. `slow` is reset
  // in run() (an event handler) rather than here, so nothing sets state
  // synchronously inside an effect.
  useEffect(() => {
    if (phase.kind !== "loading") return;
    const t = setTimeout(() => setSlow(true), 3500);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(
    async (rawQuery: string) => {
      const parsed = parseDomainInput(rawQuery);
      if (!parsed.ok) {
        setValidation(parsed.message);
        inputRef.current?.focus();
        return;
      }
      setValidation(null);

      const query = parsed.tld
        ? `${parsed.sld}${parsed.tld}`
        : `${parsed.sld}${preferredTld}`;

      // Duplicate guard: identical query already on screen, nothing to do.
      if (phase.kind === "results" && phase.query === query) return;

      // Supersede any in-flight request rather than racing it.
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setSlow(false);
      setPhase({ kind: "loading", query });

      const outcome = await checkDomains(query, controller.signal);
      if (controller.signal.aborted) return;

      if (outcome.ok) {
        setPhase({
          kind: "results",
          query,
          results: outcome.data.results,
          source: outcome.data.source,
        });
        recentStore.set(recentSearches.add(query));
      } else {
        if (
          outcome.error.kind === "network" &&
          outcome.error.message === "Search cancelled."
        )
          return;
        setPhase({ kind: "error", query, error: outcome.error });
        if (outcome.error.kind === "rate_limited")
          setRetryIn(outcome.error.retryAfterSeconds);
      }
    },
    [phase, preferredTld],
  );

  const onToggleSave = useCallback((result: DomainResult) => {
    shortlistStore.set(
      shortlist.toggle({ domain: result.domain, price: result.price }),
    );
  }, []);

  const isSaved = (domain: string) => saved.some((s) => s.domain === domain);
  const busy = phase.kind === "loading";
  const [featured, ...alternates] =
    phase.kind === "results" ? phase.results : ([] as DomainResult[]);

  return (
    <div className="flex flex-col gap-8">
      {/* ── Search ─────────────────────────────────────────────────────── */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          void run(value);
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <label htmlFor={`${baseId}-input`} className="sr-only">
            Search for a domain name
          </label>
          <div
            className={cn(
              "flex flex-col gap-2 rounded-xl bg-surface p-2 shadow-e3 ring-1 sm:flex-row sm:items-center",
              validation ? "ring-error" : "ring-line",
            )}
          >
            <div className="flex flex-1 items-center gap-2.5 px-3">
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-fg-muted"
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
                ref={inputRef}
                id={`${baseId}-input`}
                name="query"
                type="text"
                inputMode="url"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="search"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (validation) setValidation(null);
                }}
                aria-invalid={validation ? true : undefined}
                aria-describedby={validation ? errorId : undefined}
                placeholder="yourbusiness"
                className="h-12 w-full bg-transparent text-body text-fg outline-none placeholder:text-fg-muted"
              />
            </div>
            <Button type="submit" size="lg" loading={busy} className="sm:w-auto">
              {busy ? "Searching" : "Search"}
            </Button>
          </div>

          <p
            id={errorId}
            role="alert"
            className={cn("mt-2 text-small text-error", !validation && "hidden")}
          >
            {validation}
          </p>
        </div>

        {/* TLD preference — used when the query has no extension of its own. */}
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Preferred extension</legend>
          <span className="mr-1 text-small text-fg-muted">Prefer</span>
          {tlds
            .filter((t) => t.suggest)
            .map((t) => (
              <label
                key={t.tld}
                className={cn(
                  "inline-flex min-h-9 cursor-pointer items-center rounded-full px-3.5 font-mono text-caption transition-colors",
                  "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
                  preferredTld === t.tld
                    ? "bg-primary text-white"
                    : "bg-canvas-inset text-fg-secondary hover:text-fg",
                )}
              >
                <input
                  type="radio"
                  name="preferred-tld"
                  value={t.tld}
                  checked={preferredTld === t.tld}
                  onChange={() => setPreferredTld(t.tld)}
                  className="sr-only-focusable"
                />
                {t.tld}
              </label>
            ))}
        </fieldset>
      </form>

      {/* ── Recent ─────────────────────────────────────────────────────── */}
      {phase.kind === "idle" && recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-small text-fg-muted">Recent</span>
          {recent.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setValue(q);
                void run(q);
              }}
              className="inline-flex min-h-9 items-center rounded-full bg-canvas-inset px-3.5 text-small text-fg-secondary transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {q}
            </button>
          ))}
          <button
            type="button"
            onClick={() => recentStore.set(recentSearches.clear())}
            className="inline-flex min-h-9 items-center rounded-sm px-2 text-small text-fg-muted underline underline-offset-4 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Clear
          </button>
        </div>
      )}

      {/* ── Results / states ───────────────────────────────────────────── */}
      <div aria-live="polite" aria-busy={busy}>
        {busy && (
          <div>
            <p className="mb-4 flex items-center gap-2.5 text-small text-fg-secondary">
              <Spinner size="sm" />
              Checking {phase.query} and alternatives…
            </p>
            <ul className="flex flex-col gap-3">
              {Array.from({ length: 5 }, (_, i) => (
                <li
                  key={i}
                  className="h-[4.5rem] animate-pulse rounded-lg bg-canvas-inset"
                />
              ))}
            </ul>
            {slow && (
              <p className="mt-4 text-small text-fg-muted">
                Still going — some registries are slower than others.
              </p>
            )}
          </div>
        )}

        {phase.kind === "error" && (
          <ErrorState
            error={phase.error}
            retryIn={retryIn}
            onRetry={() => void run(phase.query)}
          />
        )}

        {phase.kind === "results" && featured && (
          <div className="flex flex-col gap-6">
            <ul className="flex flex-col gap-3">
              <DomainResultRow
                result={featured}
                featured
                saved={isSaved(featured.domain)}
                onToggleSave={onToggleSave}
              />
            </ul>

            {alternates.length > 0 && (
              <div>
                <h3 className="mb-3 font-mono text-caption uppercase text-fg-muted">
                  {featured.status === "available"
                    ? "Also available"
                    : "Try these instead"}
                </h3>
                <ul className="flex flex-col gap-3">
                  {alternates.map((r) => (
                    <DomainResultRow
                      key={r.domain}
                      result={r}
                      saved={isSaved(r.domain)}
                      onToggleSave={onToggleSave}
                    />
                  ))}
                </ul>
              </div>
            )}

            {phase.results.every((r) => r.status === "unknown") && (
              <p className="rounded-lg bg-warning-soft p-4 text-small text-warning">
                No registry answered just now. This is usually temporary — try again in
                a moment, or search from the cart directly.
              </p>
            )}

            <p className="text-small text-fg-muted">
              Prices are standard first-year registration. Premium names are priced by
              the registry and labelled before checkout.
              {phase.source === "rdap" && (
                <> Availability is read live from the domain registry.</>
              )}
            </p>
          </div>
        )}
      </div>

      {/* ── Shortlist ──────────────────────────────────────────────────── */}
      {saved.length > 0 && <Shortlist items={saved} />}
    </div>
  );
}

function ErrorState({
  error,
  retryIn,
  onRetry,
}: {
  error: CheckError;
  retryIn: number;
  onRetry: () => void;
}) {
  const limited = error.kind === "rate_limited";
  const blocked = limited && retryIn > 0;

  return (
    <div
      role="alert"
      className="rounded-lg bg-error-soft p-5 ring-1 ring-inset ring-error/25"
    >
      <p className="text-body font-medium text-fg">
        {error.kind === "unconfigured"
          ? "Domain search is unavailable"
          : "That search did not complete"}
      </p>
      <p className="mt-1.5 text-small text-fg-secondary">{error.message}</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {error.kind !== "unconfigured" && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onRetry}
            disabled={blocked}
          >
            {blocked ? `Try again in ${retryIn}s` : "Try again"}
          </Button>
        )}
        {/* Always available: the plain WHMCS form never depends on this API. */}
        <Button
          href={`${billing.root}/cart.php?a=add&domain=register`}
          variant="ghost"
          size="md"
        >
          Search in the cart instead
        </Button>
      </div>
    </div>
  );
}

function Shortlist({ items }: { items: ShortlistItem[] }) {
  const total = items.reduce((sum, i) => sum + (i.price ?? 0), 0);

  return (
    <section
      aria-labelledby="shortlist-heading"
      className="rounded-xl bg-canvas-secondary p-5 ring-1 ring-inset ring-line sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 id="shortlist-heading" className="text-h4 text-fg">
          Saved names ({items.length})
        </h3>
        <button
          type="button"
          onClick={() => shortlistStore.set(shortlist.clear())}
          className="min-h-9 rounded-sm text-small text-fg-muted underline underline-offset-4 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Clear all
        </button>
      </div>

      <ul className="mt-4 flex flex-col divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li
            key={item.domain}
            className="flex items-center justify-between gap-4 py-3"
          >
            <span className="min-w-0 break-all text-body text-fg">{item.domain}</span>
            <span className="flex shrink-0 items-center gap-3">
              {item.price !== null && (
                <span className="tabular text-small text-fg-secondary">
                  ${item.price.toFixed(2)}
                </span>
              )}
              <a
                href={`${billing.root}/cart.php?a=add&domain=register&query=${encodeURIComponent(item.domain)}`}
                className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-small font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Register
                <span className="sr-only"> {item.domain}</span>
              </a>
              <button
                type="button"
                onClick={() => shortlistStore.set(shortlist.remove(item.domain))}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-canvas-inset hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
                  <path
                    d="m4 4 8 8M12 4l-8 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="sr-only">Remove {item.domain}</span>
              </button>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-small text-fg-muted">
        <span className="tabular font-medium text-fg">${total.toFixed(2)}</span> first
        year, before tax. Registration completes in your Serverlys cart — each name is
        added there when you press Register.
      </p>
    </section>
  );
}
