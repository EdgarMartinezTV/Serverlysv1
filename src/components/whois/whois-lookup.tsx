"use client";

import { useId, useRef, useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(value);
        }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <Field
          name="whois"
          label="Domain name"
          description="Any registered domain — yours or someone else's."
          error={invalid ?? undefined}
          className="flex-1"
        >
          <Input
            name="whois"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="serverlys.com"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            inputMode="url"
            hasDescription
            invalid={Boolean(invalid)}
          />
        </Field>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          aria-busy={state.kind === "loading" || undefined}
        >
          {state.kind === "loading" ? "Looking up…" : "Look up"}
        </Button>
      </form>

      <div
        id={regionId}
        aria-live="polite"
        aria-busy={state.kind === "loading"}
        className="mt-8"
      >
        {state.kind === "idle" && (
          <p className="text-small text-fg-muted">
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
        <p className="font-mono text-caption uppercase tracking-wider text-success">
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
        <p className="font-mono text-caption uppercase tracking-wider text-fg-muted">
          No answer
        </p>
        <h3 className="mt-2 text-h4 text-fg">We cannot tell you about this one</h3>
        <p className="mt-3 max-w-[60ch] text-body text-fg-secondary">
          {record.reason ??
            "The registry for this extension does not publish machine-readable records."}{" "}
          Rather than guess, we are telling you we do not know.
        </p>
        <Button href="/contact" variant="secondary" className="mt-6">
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
          <p className="font-mono text-caption uppercase tracking-wider text-fg-muted">
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
        {rows.map(([label, value]) => (
          <div key={label} className="bg-canvas px-6 py-4">
            <dt className="font-mono text-caption uppercase tracking-wider text-fg-muted">
              {label}
            </dt>
            <dd className="mt-1 text-body text-fg">{value}</dd>
          </div>
        ))}
      </dl>

      {record.nameservers && record.nameservers.length > 0 && (
        <div className="border-t border-line px-6 py-4">
          <p className="font-mono text-caption uppercase tracking-wider text-fg-muted">
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
          <p className="font-mono text-caption uppercase tracking-wider text-fg-muted">
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
