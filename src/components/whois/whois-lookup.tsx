"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { billing } from "@/data/company";
import type { WhoisRecord } from "@/lib/domains/whois";

/**
 * Registration lookup.
 *
 * Real data from the registry over RDAP — nothing here is fabricated, and when
 * the registry cannot answer the UI says so instead of inventing a record.
 *
 * States, all of which are reachable and all of which are handled:
 *   idle · loading · registered · available · unsupported · error
 *
 * The result region is aria-live="polite" and aria-busy during the fetch, so a
 * screen reader hears the answer arrive rather than having to go looking for
 * it. An in-flight request is aborted when a new one starts, so a slow first
 * lookup cannot overwrite a fast second one.
 */

type State =
  | { kind: "idle" }
  | { kind: "loading"; domain: string }
  | { kind: "done"; record: WhoisRecord }
  | { kind: "failed"; reason: string; domain: string };

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Days until expiry. Negative means it has already lapsed. */
function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return null;
  return Math.round((d - Date.now()) / 86_400_000);
}

export function WhoisLookup() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState<string | null>(null);
  const inFlight = useRef<AbortController | null>(null);
  const regionId = useId();
  const inputId = useId();
  const descId = `${inputId}-desc`;
  const errId = `${inputId}-err`;

  async function run(raw: string) {
    const query = raw.trim().toLowerCase();
    if (!query) {
      setInvalid("Enter a domain name.");
      return;
    }
    if (!query.includes(".")) {
      setInvalid("Include the extension — serverlys.com, not serverlys.");
      return;
    }
    setInvalid(null);
    window.history.replaceState(null, "", `?domain=${encodeURIComponent(query)}`);

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    setState({ kind: "loading", domain: query });

    try {
      const res = await fetch(`/api/domains/whois?domain=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });
      const body = await res.json();
      if (controller.signal.aborted) return;
      if (!body.ok) {
        setState({ kind: "failed", reason: body.reason ?? "That lookup failed.", domain: query });
        return;
      }
      setState({ kind: "done", record: body.record as WhoisRecord });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setState({
        kind: "failed",
        domain: query,
        reason: "Could not reach the lookup service. Check your connection and try again.",
      });
    }
  }

  /* Deep links: /whois-lookup?domain=example.com opens with that lookup run,
     and every lookup writes its domain back to the URL so it can be shared. */
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("domain");
    if (!d) return;
    // Deferred a tick so the state updates happen in a callback, not the effect body.
    const t = setTimeout(() => {
      setValue(d);
      void run(d);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const busy = state.kind === "loading";

  return (
    <div>
      {/* Same pill as the domain search (2026-10-03). */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(value);
        }}
        className="flex flex-col gap-3"
      >
        <label htmlFor={`${inputId}`} className="sr-only">
          Domain name
        </label>
        <div
          className={cn(
            "flex h-16 items-center gap-2 rounded-full bg-white pr-2 pl-5 shadow-[0_10px_40px_rgb(0_0_60/0.25)] ring-2 transition-[box-shadow] duration-200",
            invalid
              ? "ring-error"
              : "ring-brand-300 focus-within:shadow-[0_0_0_6px_rgb(31_85_255/0.25),0_10px_40px_rgb(0_0_60/0.25)] focus-within:ring-primary",
          )}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0 text-fg">
            <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="m13.5 13.5 3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            id={inputId}
            name="whois"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (invalid) setInvalid(null);
            }}
            placeholder="Look up any domain, e.g. serverlys.com"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            inputMode="url"
            enterKeyHint="search"
            aria-invalid={invalid ? true : undefined}
            aria-describedby={invalid ? `${descId} ${errId}` : descId}
            className="h-12 min-w-0 flex-1 bg-transparent text-body-lg text-fg outline-none placeholder:text-fg-muted"
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-canvas-secondary hover:text-fg focus-visible:outline-2 focus-visible:outline-primary"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
                <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="sr-only">Clear</span>
            </button>
          )}
          <button
            type="submit"
            aria-busy={busy || undefined}
            disabled={busy}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 text-body font-semibold text-white shadow-e2 transition-colors hover:bg-primary-hover active:scale-[0.98] disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {busy ? <Spinner size="sm" className="text-white" /> : null}
            {busy ? "Looking up…" : "Look up"}
          </button>
        </div>
        <p id={descId} className="text-center text-small text-fg-on-dark-secondary">
          Any registered domain — yours or someone else&apos;s.
        </p>
        <p id={errId} role="alert" className={cn("rounded-lg bg-white/95 px-3 py-2 text-small text-error", !invalid && "hidden")}>
          {invalid}
        </p>
      </form>

      <div
        id={regionId}
        aria-live="polite"
        aria-busy={state.kind === "loading"}
        className={cn("mt-6", state.kind !== "idle" && "rounded-3xl bg-white p-4 text-left shadow-[0_24px_60px_rgb(0_0_60/0.25)] sm:p-6")}
      >
        {state.kind === "idle" && (
          <p className="text-center text-small text-fg-on-dark-secondary">
            Results come straight from the domain registry over RDAP, the
            protocol that replaced WHOIS. Nothing is cached.
          </p>
        )}

        {state.kind === "loading" && (
          <div className="flex items-center gap-3 rounded-xl bg-canvas-secondary p-6 ring-1 ring-inset ring-line">
            <Spinner size="sm" label={`Looking up ${state.domain}`} />
            <p className="text-body text-fg-secondary">
              Asking the registry about{" "}
              <span className="font-mono text-fg">{state.domain}</span>…
            </p>
          </div>
        )}

        {state.kind === "failed" && (
          <div className="rounded-xl bg-error-soft p-6 ring-1 ring-inset ring-error/25">
            <h3 className="text-body-lg font-semibold text-fg">Lookup did not complete</h3>
            <p className="mt-2 text-body text-fg-secondary">{state.reason}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => void run(state.domain)} variant="secondary">
                Try again
              </Button>
              <Button href="/register-domain" variant="ghost">
                Search for a domain instead
              </Button>
            </div>
          </div>
        )}

        {state.kind === "done" && <Record record={state.record} />}
      </div>
    </div>
  );
}

function Record({ record }: { record: WhoisRecord }) {
  if (record.status === "available") {
    return (
      <div className="rounded-xl bg-success-soft p-6 ring-1 ring-inset ring-success/25 sm:p-8">
        <p className="text-micro text-success font-semibold">
          Not registered
        </p>
        <h3 className="mt-2 text-h4 text-fg">
          <span className="font-mono">{record.domain}</span> has no registry record
        </h3>
        <p className="mt-3 max-w-[60ch] text-body text-fg-secondary">
          The registry holds nothing for this name, which means it is available
          to register. Premium and reserved names are the exception — the cart
          will tell you before you pay.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={`${billing.registerDomain}&query=${encodeURIComponent(record.domain)}`} external>
            Register {record.domain}
          </Button>
          <Button href="/register-domain" variant="secondary">
            Check other extensions
          </Button>
        </div>
      </div>
    );
  }

  if (record.status === "unsupported" || record.status === "error") {
    return (
      <div className="rounded-xl bg-canvas-secondary p-6 ring-1 ring-inset ring-line sm:p-8">
        <p className="text-micro text-fg-muted font-semibold">
          No answer
        </p>
        <h3 className="mt-2 text-h4 text-fg">We cannot tell you about this one</h3>
        <p className="mt-3 max-w-[60ch] text-body text-fg-secondary">
          {record.reason ??
            "The registry for this extension does not publish machine-readable records."}{" "}
          Rather than guess, we are telling you we do not know.
        </p>
        <Button href="/support" variant="secondary" className="mt-6">
          Ask us to check manually
        </Button>
      </div>
    );
  }

  const expiresIn = daysUntil(record.expires);
  const rows: ReadonlyArray<[string, React.ReactNode]> = [
    ["Registrar", record.registrar ?? "Not published"],
    [
      "Registered",
      formatDate(record.registered) ?? "Not published",
    ],
    ["Last changed", formatDate(record.updated) ?? "Not published"],
    [
      "Expires",
      formatDate(record.expires) ? (
        <>
          {formatDate(record.expires)}
          {expiresIn !== null && (
            <span className={expiresIn < 60 ? "ml-2 text-warning" : "ml-2 text-fg-muted"}>
              ({expiresIn < 0 ? "lapsed" : `in ${expiresIn} days`})
            </span>
          )}
        </>
      ) : (
        "Not published"
      ),
    ],
    [
      "DNSSEC",
      record.dnssec === undefined ? "Not published" : record.dnssec ? "Signed" : "Not signed",
    ],
  ];

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-inset ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-canvas-secondary px-6 py-4">
        <div>
          <p className="text-micro text-fg-muted font-semibold">
            Registered
          </p>
          <h3 className="mt-1 font-mono text-body-lg font-semibold text-fg">
            {record.domain}
          </h3>
        </div>
        <Button href="/transfer-domain" variant="secondary">
          Transfer it to Serverlys
        </Button>
      </div>

      <dl className="grid gap-px bg-line sm:grid-cols-2">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={cn("bg-canvas px-6 py-4", rows.length % 2 === 1 && i === rows.length - 1 && "sm:col-span-2")}
          >
            <dt className="text-micro text-fg-muted font-semibold">
              {label}
            </dt>
            <dd className="mt-1 text-body text-fg">{value}</dd>
          </div>
        ))}
      </dl>

      {record.nameservers && record.nameservers.length > 0 && (
        <div className="border-t border-line px-6 py-4">
          <p className="text-micro text-fg-muted font-semibold">
            Nameservers
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            {record.nameservers.map((ns) => (
              <li key={ns} className="font-mono text-small text-fg">
                {ns}
              </li>
            ))}
          </ul>
        </div>
      )}

      {record.epp && record.epp.length > 0 && (
        <div className="border-t border-line px-6 py-4">
          <p className="text-micro text-fg-muted font-semibold">
            Status codes
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {record.epp.map((code) => (
              <li
                key={code}
                className="rounded-full bg-canvas-inset px-2.5 py-1 font-mono text-caption text-fg-secondary"
              >
                {code}
              </li>
            ))}
          </ul>
          <p className="mt-3 max-w-[62ch] text-small text-fg-muted">
            A code containing <span className="font-mono">transfer prohibited</span> means
            the domain is locked and must be unlocked at its current registrar
            before it can move.
          </p>
        </div>
      )}

      <p className="border-t border-line bg-canvas-secondary px-6 py-4 text-small text-fg-muted">
        Registrant contact details are redacted by the registries under GDPR and
        ICANN policy. We show everything we are given and nothing we are not.
      </p>
    </div>
  );
}
