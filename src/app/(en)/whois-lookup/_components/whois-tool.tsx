"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { tc } from "@/i18n/t";
import { lh } from "@/i18n/href";
import { billing } from "@/data/company";
import { checkDomains } from "@/lib/domains/client";
import type { Tld } from "@/data/tlds";
import type { WhoisRecord } from "@/lib/domains/whois";

/**
 * /whois-lookup's hero search and results, rebuilt from hostinger.com/whois
 * as it renders a real lookup (2026-11-24):
 *
 *   hero    lavender band, 56/64 title, pill search with a soft ring and a
 *           32px round arrow button, "Buy a domain" / "Domain transfer".
 *   results ?domain=x#domain-results. Left: "WHOIS lookup" + "Updated:", then
 *           accordion sections — Domain information (open), Registrar
 *           details, contacts per role, Notice, Raw RDAP registry data. Right:
 *           "Want similar domain name?" with three AVAILABLE extensions
 *           (checked live, WHMCS prices, cart buttons) + "See all domains",
 *           then "Is x your domain? — Transfer now".
 *
 * The record comes from /api/domains/whois (RDAP, registry + registrar).
 * Departure from the reference, on purpose: the transfer card is not shown
 * for a domain that is available — there is nothing to transfer.
 */

/** Translate a template with {named} slots, then fill them ("whois|" keys). */
function T(s: string, vars: Record<string, string | number> = {}) {
  return tc("whois", s).replace(/\{(\w+)\}/g, (m, k: string) =>
    k in vars ? String(vars[k]) : m,
  );
}

const HOST = /^([a-z0-9-]{1,63}\.)+[a-z][a-z0-9-]{1,62}$/;

function clean(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
    .split(/[/?#]/)[0]
    .replace(/^www\./, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

/** "2027-07-17T20:51:26Z" → "2027-07-17 20:51" (UTC). */
function when(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 16).replace("T", " ");
}

type Suggestion = { domain: string; price: number; renew: number };
type LookupState =
  | { kind: "idle" }
  | { kind: "loading"; domain: string }
  | { kind: "done"; record: WhoisRecord }
  | { kind: "error"; domain: string; message: string };

export function WhoisTool({
  hero,
  pricing,
}: {
  hero: {
    title: string;
    lede: string;
    placeholder: string;
    links: { label: string; href: string }[];
  };
  pricing: readonly Tld[];
}) {
  const [input, setInput] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [state, setState] = useState<LookupState>({ kind: "idle" });
  const seq = useRef(0);
  const resultsRef = useRef<HTMLElement>(null);

  const run = useCallback(async (domain: string, scroll: boolean) => {
    const my = ++seq.current;
    setState({ kind: "loading", domain });
    if (scroll)
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    try {
      const res = await fetch(
        `/api/domains/whois?domain=${encodeURIComponent(domain)}`,
        { cache: "no-store" },
      );
      const body = await res.json().catch(() => null);
      if (my !== seq.current) return;
      if (res.ok && body?.ok) {
        const record = body.record as WhoisRecord;
        setState({ kind: "done", record });
        // Show what was actually looked up (google.com for mail.google.com).
        setInput(record.unicode ?? record.domain);
        const shown = record.unicode ?? record.domain;
        if (shown !== domain) {
          const url = new URL(window.location.href);
          url.searchParams.set("domain", shown);
          window.history.replaceState(null, "", url);
        }
      } else if (res.status === 429)
        setState({
          kind: "error",
          domain,
          message: "Too many lookups. Try again in a moment.",
        });
      else
        setState({
          kind: "error",
          domain,
          message:
            body?.reason ?? "We couldn't look up that domain. Try again in a minute.",
        });
    } catch {
      if (my === seq.current)
        setState({
          kind: "error",
          domain,
          message: "We couldn't look up that domain. Try again in a minute.",
        });
    }
  }, []);

  const submit = useCallback(
    (raw: string, scroll = true) => {
      let domain = clean(raw);
      // As the reference: an empty search does nothing, and a bare name is
      // looked up as .com.
      if (!domain) return;
      if (!domain.includes(".")) domain = `${domain}.com`;
      if (!/[^\x00-\x7f]/.test(domain) && !HOST.test(domain))
        return setFieldError("Enter a valid domain name, like example.com");
      setFieldError(null);
      const url = new URL(window.location.href);
      url.searchParams.set("domain", domain);
      url.hash = "domain-results";
      window.history.replaceState(null, "", url);
      void run(domain, scroll);
    },
    [run],
  );

  // ?domain=… on arrival (a shared link, or the reference's own URL shape).
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("domain");
    if (d) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL on arrival
      setInput(d);
      submit(d, Boolean(window.location.hash));
    }
  }, [submit]);

  return (
    <>
      <section
        aria-labelledby="whois-hero-heading"
        className="bg-[#f5f6ff] px-4 pt-12 pb-14 md:px-10 md:pt-[88px] md:pb-[60px]"
      >
        <div className="mx-auto flex max-w-[1050px] flex-col items-center text-center">
          <h1
            id="whois-hero-heading"
            className="text-[48px] leading-[56px] font-normal tracking-[-0.24px] text-[#18181a] md:text-[56px] md:leading-[64px] md:tracking-[-0.28px]"
          >
            {T(hero.title)}
          </h1>
          <p className="mt-4 text-[16px] leading-6 text-[#36344d] md:text-[18px] md:leading-[26px]">
            {T(hero.lede)}
          </p>

          <form
            role="search"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="mt-12 w-full max-w-[600px]"
          >
            <div
              className={cn(
                "flex h-[52px] items-center gap-3 rounded-full border-2 bg-white pr-2 pl-5 shadow-[0_0_0_4px_rgba(0,0,255,0.08)] transition-colors focus-within:border-primary",
                fieldError ? "border-error-fill" : "border-brand-200",
              )}
            >
              <SearchIcon className="size-5 shrink-0 text-[#36344d]" />
              <label htmlFor="whois-domain" className="sr-only">
                {T("Domain name")}
              </label>
              <input
                id="whois-domain"
                type="text"
                inputMode="url"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder={T(hero.placeholder)}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (fieldError) setFieldError(null);
                }}
                aria-invalid={fieldError ? true : undefined}
                aria-describedby={fieldError ? "whois-domain-error" : undefined}
                className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-[#18181a] outline-none placeholder:text-[#6d6b80]"
              />
              <button
                type="submit"
                aria-label={T("Search")}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover"
              >
                {state.kind === "loading" ? (
                  <Spinner className="size-4" />
                ) : (
                  <ArrowIcon className="size-4" />
                )}
              </button>
            </div>
            {fieldError && (
              <p
                id="whois-domain-error"
                className="mt-2 text-left text-[14px] text-error md:pl-5"
              >
                {T(fieldError)}
              </p>
            )}
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2">
            {hero.links.map((l) => (
              <Link
                key={l.href}
                href={lh(l.href)}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-[16px] font-semibold text-primary hover:text-primary-hover"
              >
                {T(l.label)}
                <ExternalIcon className="size-[18px]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {state.kind !== "idle" && (
        <section
          ref={resultsRef}
          id="domain-results"
          aria-label={T("WHOIS lookup")}
          className="scroll-mt-24 bg-white pt-10 pb-6 md:pt-20"
        >
          <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 md:px-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)] lg:gap-16 xl:gap-20 xl:px-20">
            <Record state={state} />
            <Aside state={state} pricing={pricing} />
          </div>
        </section>
      )}
    </>
  );
}

/* ── Left: the record ────────────────────────────────────────────────────── */

function Record({ state }: { state: Exclude<LookupState, { kind: "idle" }> }) {
  const record = state.kind === "done" ? state.record : null;
  const updated = record?.status === "registered" ? when(record.updated) : null;

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-[24px] leading-8 font-semibold tracking-[-0.12px] text-[#18181a]">
          {T("WHOIS lookup")}
        </h2>
        {updated && (
          <p className="text-[16px] text-black/75">
            {T("Updated: {date}", { date: updated })}
          </p>
        )}
      </div>

      {state.kind === "loading" && (
        <div className="mt-6 space-y-3" aria-busy="true">
          <p className="flex items-center gap-2 text-[16px] text-black/75">
            <Spinner className="size-4" />
            {T("Looking up {domain}…", { domain: state.domain })}
          </p>
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="h-6 animate-pulse rounded bg-[#eceef6]"
              style={{ width: `${88 - i * 6}%` }}
            />
          ))}
        </div>
      )}

      {state.kind === "error" && (
        <Card
          title={T("We couldn't look up {domain}", { domain: state.domain })}
          body={T(state.message)}
        />
      )}

      {record?.status === "available" && (
        <Card
          title={T("{domain} is available", {
            domain: record.unicode ?? record.domain,
          })}
          body={T(
            "Good news – no one's claimed this domain yet. Buy it now and start building your online presence.",
          )}
          link={{
            label: T("Buy domain"),
            href: `${lh("/domain-name-results")}?domain=${encodeURIComponent(record.domain)}`,
          }}
        />
      )}

      {(record?.status === "unsupported" || record?.status === "error") && (
        <Card
          title={T("We can't show the record for {domain}", { domain: record.domain })}
          body={`${record.reason ? T(record.reason) : ""} ${T("Some country-code registries don't publish their records online. Check with the registry for that extension, or search the name to see if it's available.")}`}
          link={{
            label: T("Search this domain"),
            href: `${lh("/domain-name-results")}?domain=${encodeURIComponent(record.domain)}`,
          }}
        />
      )}

      {record?.status === "registered" && <RegisteredRecord record={record} />}
    </div>
  );
}

function Card({
  title,
  body,
  link,
}: {
  title: string;
  body: string;
  link?: { label: string; href: string };
}) {
  return (
    <div className="mt-6 rounded-2xl border border-black/10 p-5 md:p-6">
      <p className="text-[18px] leading-[26px] font-semibold text-[#18181a] [overflow-wrap:anywhere]">
        {title}
      </p>
      <p className="mt-2 text-[16px] leading-6 text-[#18181a]">{body}</p>
      {link && (
        <Link
          href={link.href}
          className="mt-3 inline-block text-[14px] font-semibold text-primary hover:text-primary-hover"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}

const ROLE_TITLE: Record<string, string> = {
  registrant: "Registrant contacts",
  administrative: "Administrative contacts",
  technical: "Technical contacts",
  billing: "Billing contacts",
};

function RegisteredRecord({ record }: { record: WhoisRecord }) {
  const rows: [string, React.ReactNode][] = [
    [T("Domain name"), record.unicode ?? record.domain],
    ...(record.handle
      ? ([[T("Registry domain ID"), record.handle]] as [string, React.ReactNode][])
      : []),
    [T("Registered on"), when(record.registered) ?? "–"],
    [T("Updated on"), when(record.updated) ?? "–"],
    [T("Expires on"), when(record.expires) ?? "–"],
    [T("Status"), record.epp?.length ? <Lines items={record.epp} /> : "–"],
    [T("DNSSEC"), record.dnssec === undefined ? "–" : String(record.dnssec)],
    [
      T("Name servers"),
      record.nameservers?.length ? <Lines items={record.nameservers} /> : "–",
    ],
  ];
  // The reference's six rows, in its order.
  const registrarCandidates: [string, React.ReactNode][] = [
    [T("Name"), record.registrar],
    [T("IANA ID"), record.registrarIanaId],
    [T("WHOIS server"), record.whoisServer],
    [T("Abuse contact email"), record.abuseEmail],
    [T("Abuse contact phone"), record.abusePhone],
    [T("Registration expiration date"), when(record.expires)],
  ];
  const registrarRows = registrarCandidates.filter((r) => Boolean(r[1]));

  return (
    <div className="mt-6">
      <Section title={T("Domain information")} defaultOpen>
        <Rows rows={rows} />
      </Section>
      {registrarRows.length > 0 && (
        <Section title={T("Registrar details")}>
          <Rows rows={registrarRows} />
        </Section>
      )}
      {(record.contacts ?? []).map((c) => (
        <Section key={c.role} title={T(ROLE_TITLE[c.role])}>
          <Rows rows={c.fields.map((f) => [T(f.label), f.value])} />
        </Section>
      ))}
      {record.registrar && (
        <Section title={T("Notice")}>
          <p className="text-[16px] leading-6 text-[#18181a]">
            {T("This domain is registered with {registrar}.", {
              registrar: record.registrar.replace(/\.$/, ""),
            })}
          </p>
        </Section>
      )}
      {record.raw && (
        <Section
          title={T(
            record.raw.whois ? "Raw WHOIS registry data" : "Raw RDAP registry data",
          )}
          last
        >
          <pre className="max-h-[560px] overflow-auto rounded-xl bg-[#f6f7fb] p-4 font-mono text-[13px] leading-5 whitespace-pre-wrap text-[#18181a]">
            {record.raw.whois ??
              JSON.stringify(
                { registry: record.raw.registry, registrar: record.raw.registrar },
                null,
                2,
              )}
          </pre>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  defaultOpen = false,
  last = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  last?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `whois-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div className={cn("py-5", !last && "border-b border-black/10")}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between gap-4 text-left text-[18px] leading-[26px] font-semibold text-[#18181a]"
        >
          {title}
          <span aria-hidden className="text-[22px] leading-none font-normal">
            {open ? "–" : "+"}
          </span>
        </button>
      </h3>
      {open && (
        <div id={id} className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}

function Rows({ rows }: { rows: [string, React.ReactNode][] }) {
  // Phones: label above value, so long values (nameservers, IDs) are not
  // broken mid-word in a narrow column. sm+: the reference's two columns.
  return (
    <dl className="grid grid-cols-1 gap-y-1 sm:grid-cols-[minmax(140px,40%)_1fr] sm:gap-x-4 sm:gap-y-3 md:grid-cols-[245px_1fr]">
      {rows.map(([k, v], i) => (
        <div key={k} className="contents">
          <dt
            className={cn(
              "text-[14px] leading-5 font-semibold text-[#18181a] sm:mt-0 sm:pt-0.5",
              i > 0 && "mt-3",
            )}
          >
            {k}
          </dt>
          <dd className="min-w-0 text-[16px] leading-6 break-words text-[#18181a]">
            {v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Lines({ items }: { items: readonly string[] }) {
  return (
    <span className="flex flex-col gap-1">
      {items.map((i) => (
        <span key={i}>{i}</span>
      ))}
    </span>
  );
}

/* ── Right: suggestions + transfer ───────────────────────────────────────── */

function Aside({
  state,
  pricing,
}: {
  state: Exclude<LookupState, { kind: "idle" }>;
  pricing: readonly Tld[];
}) {
  const domain = state.kind === "done" ? state.record.domain : state.domain;
  const status = state.kind === "done" ? state.record.status : null;
  const dot = domain.indexOf(".");
  const sld = dot > 0 ? domain.slice(0, dot) : domain;
  const tld = dot > 0 ? domain.slice(dot) : "";

  return (
    <div className="min-w-0 space-y-6">
      <Similar key={domain} sld={sld} tld={tld} pricing={pricing} />
      {status !== "available" && (
        <div className="rounded-3xl border border-black/10 p-6 md:p-8">
          <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.12px] text-[#18181a] [overflow-wrap:anywhere] md:text-[24px]">
            {T("Is {domain} your domain?", { domain })}
          </h2>
          <p className="mt-3 text-[16px] leading-6 text-[#18181a]">
            {T(
              "Transfer this domain today. You can also choose to add hosting, email, SSL and more.",
            )}
          </p>
          <a
            href={billing.transferDomainSearch(domain)}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-xl border border-primary text-[16px] font-semibold text-primary transition-colors hover:bg-brand-50"
          >
            {T("Transfer now")}
          </a>
        </div>
      )}
    </div>
  );
}

function Similar({
  sld,
  tld,
  pricing,
}: {
  sld: string;
  tld: string;
  pricing: readonly Tld[];
}) {
  const [items, setItems] = useState<Suggestion[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!sld || sld.includes(".")) return;
    const ac = new AbortController();
    // Featured extensions first, then the rest of what we sell; check up to 16 (the API maximum).
    const candidates = pricing.filter((t) => t.tld !== tld).slice(0, 16);
    const byTld = new Map(pricing.map((t) => [t.tld, t]));
    void checkDomains(
      `${sld}${candidates[0]?.tld ?? ".com"}`,
      ac.signal,
      candidates.map((t) => t.tld),
    ).then((r) => {
      if (ac.signal.aborted) return;
      if (!r.ok) return setFailed(true);
      const avail = r.data.results
        .filter((x) => x.status === "available" && x.price !== null)
        .map((x) => ({
          domain: x.domain,
          price: x.price as number,
          renew:
            byTld.get(`.${x.tld.replace(/^\./, "")}`)?.renew ?? (x.price as number),
        }));
      setItems(avail.slice(0, 3));
    });
    return () => ac.abort();
  }, [sld, tld, pricing]);

  if (failed || (items && items.length === 0)) return null;

  return (
    <div>
      <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.12px] text-[#18181a] md:text-[24px]">
        {T("Want similar domain name?")}
      </h2>
      <p className="mt-1 text-[16px] leading-6 text-[#18181a]">
        {items
          ? T("There are currently {n} available extensions.", { n: items.length })
          : T("Checking other extensions…")}
      </p>
      <div className="mt-6 overflow-hidden rounded-3xl border border-black/10">
        {(items ?? [null, null, null]).map((s, i) => (
          <SuggestionRow key={s?.domain ?? i} s={s} />
        ))}
        <div className="border-t border-black/10 p-6">
          <Link
            href={`${lh("/domain-name-results")}?domain=${encodeURIComponent(sld + (tld || ".com"))}`}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-primary text-[16px] font-semibold text-primary transition-colors hover:bg-brand-50"
          >
            {T("See all domains")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function SuggestionRow({ s }: { s: Suggestion | null }) {
  const [busy, setBusy] = useState(false);
  const [tip, setTip] = useState(false);
  if (!s) {
    return (
      <div className="border-b border-black/10 p-6 last:border-b-0">
        <div className="h-6 w-1/2 animate-pulse rounded bg-[#eceef6]" />
        <div className="mt-4 h-5 w-1/4 animate-pulse rounded bg-[#eceef6]" />
      </div>
    );
  }
  const save = s.renew > s.price ? Math.round((1 - s.price / s.renew) * 100) : 0;
  const add = async () => {
    setBusy(true);
    // As the reference: straight to checkout with the name in the cart.
    window.location.href = billing.addDomain(s.domain);
  };
  return (
    <div className="flex items-start justify-between gap-4 border-b border-black/10 p-6">
      <div className="min-w-0">
        <p className="text-[18px] leading-[26px] font-semibold text-[#18181a] [overflow-wrap:anywhere]">
          {s.domain}
        </p>
        {save > 0 && (
          <p className="mt-3 text-[14px] text-black/60 line-through">
            ${s.renew.toFixed(2)}
          </p>
        )}
        <p
          className={cn(
            "text-[20px] leading-7 font-semibold text-primary",
            save === 0 && "mt-3",
          )}
        >
          ${s.price.toFixed(2)}
          {T("/yr")}
        </p>
        <p className="relative mt-0.5 flex items-center gap-1.5 text-[14px] text-[#18181a]">
          {T("For first year")}
          <button
            type="button"
            aria-label={T("Renewal price")}
            onMouseEnter={() => setTip(true)}
            onMouseLeave={() => setTip(false)}
            onFocus={() => setTip(true)}
            onBlur={() => setTip(false)}
            className="text-[#36344d]"
          >
            <InfoIcon className="size-4" />
          </button>
          {tip && (
            <span
              role="tooltip"
              className="absolute top-full left-0 z-10 mt-1 rounded-lg bg-ink-950 px-3 py-1.5 text-[13px] whitespace-nowrap text-white shadow-lg"
            >
              {save > 0
                ? T(
                    "Discounted price applies for the first year, then renews at the regular price",
                  )
                : T("Renews at ${price}/yr", { price: s.renew.toFixed(2) })}
            </span>
          )}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-4">
        {save > 0 && (
          <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[12px] leading-5 font-semibold tracking-wide text-primary uppercase">
            {T("Save {n}%", { n: save })}
          </span>
        )}
        <button
          type="button"
          onClick={add}
          disabled={busy}
          aria-label={T("Buy now")}
          title={T("Buy now")}
          className="grid size-12 place-items-center rounded-xl border border-primary text-primary transition-colors hover:bg-brand-50"
        >
          {busy ? <Spinner className="size-5" /> : <CartIcon className="size-5" />}
        </button>
      </div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */

const st = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...st}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...st} strokeWidth={2.2}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...st}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </svg>
  );
}
function CartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...st}>
      <path d="M3 4h2l2.4 11h10.2L20 8H6.2" />
      <circle cx="9" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </svg>
  );
}
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...st}>
      <circle cx="10" cy="10" r="8" />
      <path d="M10 9v5M10 6.2v.1" />
    </svg>
  );
}
function Spinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("animate-spin", className)} aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
