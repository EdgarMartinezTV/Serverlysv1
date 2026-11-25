"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { World, type Marker, type MarkerTone, type View } from "./world";
import type { CheckResult, Row, RowStatus } from "@/lib/dns/propagation";
import { DNS_SERVERS } from "@/lib/dns/servers";
import { RECORD_TYPES } from "@/lib/dns/types";

/**
 * The DNS propagation checker — form, map, summary, current records and the
 * table of every server's answer. Layout and behaviour follow
 * hostinger.com/dns-propagation-checker; the checking itself is ours, in
 * /api/dns/propagation (lib/dns/propagation.ts).
 *
 * Auto-refresh: while the page is open, a check that still has servers "not
 * live yet" is repeated 15 seconds after it finishes, for up to 10 minutes. It
 * stops when every server is live and pauses while the tab is hidden.
 */

const REFRESH_EVERY = 15;
const REFRESH_FOR = 10 * 60;
const CLIENT_HOST = /^([a-z0-9_-]{1,63}\.)+[a-z][a-z0-9-]{1,62}$/;

type Notice = { kind: "rateLimited" | "failed"; retryAt?: number } | null;
type Filter = "all" | RowStatus;

const STATUS_LABEL: Record<RowStatus, string> = {
  live: "Live",
  notLive: "Not live yet",
  timedOut: "Timed out",
  failed: "Failed",
};
const ORDER: RowStatus[] = ["notLive", "failed", "timedOut", "live"];
/** Rows shown before "Show all": the ones that need attention sort first. */
const PAGE = 12;

function flag(cc: string) {
  return cc.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export function formatTtl(s: number | null) {
  if (s === null) return "–";
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  const h = Math.round(s / 3600);
  return m < 60 ? `${m}m` : h < 24 ? `${h}h` : `${Math.round(s / 86400)}d`;
}

function formatDuration(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = Math.floor(s % 60);
  return h ? `${h}h ${m}m` : m ? `${m}m ${r}s` : `${r}s`;
}

function cleanInput(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, "")
    .replace(/\.+$/, "");
}

export function Checker() {
  const [input, setInput] = useState("");
  const [type, setType] = useState<string>("A");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [query, setQuery] = useState<{ domain: string; type: string } | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("globe");
  const [auto, setAuto] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [nextAt, setNextAt] = useState<number | null>(null);
  const started = useRef<number>(0);
  const seq = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // One clock for "Checked 12s ago", the cooldown and the refresh countdown.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const run = useCallback(async (domain: string, recordType: string, fresh: boolean) => {
    const my = ++seq.current;
    setChecking(true);
    setNotice(null);
    setNextAt(null);
    setQuery({ domain, type: recordType });
    if (fresh) {
      setResult(null);
      setFilter("all");
      started.current = Date.now();
    }
    try {
      const res = await fetch(`/api/dns/propagation?domain=${encodeURIComponent(domain)}&type=${recordType}`, {
        cache: "no-store",
      });
      const body = await res.json().catch(() => null);
      if (my !== seq.current) return;
      if (res.status === 429) {
        setNotice({ kind: "rateLimited", retryAt: Date.now() + (Number(body?.retryAfter) || 60) * 1000 });
      } else if (res.status === 400) {
        setFieldError(body?.reason ?? "Enter a valid domain, like example.com");
        setQuery(null);
      } else if (!res.ok || !body?.ok) {
        setNotice({ kind: "failed" });
      } else {
        setResult(body.result as CheckResult);
      }
    } catch {
      if (my === seq.current) setNotice({ kind: "failed" });
    } finally {
      if (my === seq.current) setChecking(false);
    }
  }, []);

  const submit = useCallback(
    (raw: string, recordType: string) => {
      const domain = cleanInput(raw);
      if (!domain) {
        setFieldError("Enter a domain, like example.com");
        inputRef.current?.focus();
        return;
      }
      if (!/[^\x00-\x7f]/.test(domain) && !CLIENT_HOST.test(domain)) {
        setFieldError("Enter a valid domain, like example.com");
        inputRef.current?.focus();
        return;
      }
      setFieldError(null);
      const url = new URL(window.location.href);
      url.searchParams.set("domain", domain);
      url.searchParams.set("type", recordType);
      window.history.replaceState(null, "", url);
      void run(domain, recordType, true);
    },
    [run],
  );

  // Arriving with ?domain=…&type=… (a shared link) runs the check at once.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const d = p.get("domain");
    const t = (p.get("type") ?? "A").toUpperCase();
    const validType = (RECORD_TYPES as readonly string[]).includes(t) ? t : "A";
    if (d) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL on arrival
      setInput(d);
      setType(validType);
      submit(d, validType);
    }
  }, [submit]);

  /* ── Auto-refresh ─────────────────────────────────────────────────────── */
  const pending = result?.state === "completed" && result.summary.outcome === "propagating" && result.summary.counts.notLive > 0;
  useEffect(() => {
    if (!auto || checking || !pending || !query) return;
    if (Date.now() - started.current > REFRESH_FOR * 1000) return;
    const at = Date.now() + REFRESH_EVERY * 1000;
    setNextAt(at);
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() >= at) {
        window.clearInterval(id);
        void run(query.domain, query.type, false);
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [auto, checking, pending, query, run, result]);

  /* ── Derived ──────────────────────────────────────────────────────────── */
  const rows = useMemo(() => (result?.state === "completed" ? result.rows : []), [result]);
  const counts = result?.summary.counts ?? { live: 0, notLive: 0, timedOut: 0, failed: 0 };
  const total = result?.summary.total ?? DNS_SERVERS.length;
  const checkedAgo = result ? Math.max(0, Math.floor((now - Date.parse(result.checkedAt)) / 1000)) : 0;
  const cooldown = notice?.kind === "rateLimited" && notice.retryAt ? Math.max(0, Math.ceil((notice.retryAt - now) / 1000)) : 0;

  const markers: Marker[] = useMemo(() => {
    const byId = new Map(rows.map((r) => [r.id, r]));
    return DNS_SERVERS.map((s) => {
      const r = byId.get(s.id);
      let tone: MarkerTone = checking && !r ? "checking" : "idle";
      if (r) tone = r.status === "live" ? "live" : r.status === "notLive" ? "notLive" : "noAnswer";
      const status = r ? (r.status === "live" ? "Live" : r.status === "notLive" ? "Not live yet" : "No answer") : checking ? "Checking…" : "Waiting for a check";
      return { id: s.id, lat: s.lat, lon: s.lon, tone, label: `${s.city}, ${s.country}: ${status}` };
    });
  }, [rows, checking]);

  const showSummary = Boolean(result?.state === "completed") || (checking && !!query);

  return (
    <>
      {/* ── Hero + form ───────────────────────────────────────────────── */}
      <section aria-labelledby="dns-hero-heading" className="bg-[#f5f5f6] px-4 pt-[72px] md:px-10 md:pt-[96px]">
        <div className="mx-auto flex max-w-[880px] flex-col items-center text-center">
          <h1
            id="dns-hero-heading"
            className="text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-[#18181a] md:text-[48px] md:leading-[56px] md:tracking-[-0.24px]"
          >
            DNS checker
          </h1>
          <p className="mt-4 max-w-[736px] text-[16px] leading-6 text-black/75">
            See which DNS servers around the world already return your new records, and which still have the old ones.
          </p>
        </div>

        {notice && (
          <div
            role="alert"
            className="mx-auto mt-8 flex max-w-[880px] flex-col gap-3 rounded-2xl border border-[#e73a47]/30 bg-error-soft px-5 py-4 text-left sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-[16px] leading-6 font-semibold text-[#18181a]">
                {notice.kind === "rateLimited" ? "You've run a lot of checks in a short time" : "We couldn't run the check"}
              </p>
              <p className="text-[14px] leading-5 text-black/75">
                {notice.kind === "rateLimited"
                  ? `Wait a minute and check again.${result ? " The results below are from your last check." : ""}`
                  : "Something went wrong on our side. Try again in a minute."}
              </p>
            </div>
            {notice.kind === "failed" && query && (
              <button
                type="button"
                onClick={() => void run(query.domain, query.type, !result)}
                className="h-10 shrink-0 rounded-xl border border-black/15 bg-white px-4 text-[14px] font-semibold text-[#18181a] hover:bg-ink-50"
              >
                Try again
              </button>
            )}
          </div>
        )}

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!cooldown) submit(input, type);
          }}
          className="mx-auto mt-12 max-w-[880px] rounded-3xl border border-black/10 bg-white p-6 text-left shadow-[0_2px_6px_rgba(0,0,0,0.1)] md:mt-[48px]"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-3">
            <div className="min-w-0 flex-1">
              <label htmlFor="dns-domain" className="block pl-0.5 text-[14px] leading-5 font-semibold text-[#18181a]">
                Domain or hostname
              </label>
              <div
                className={cn(
                  "mt-2 flex h-12 items-center gap-2 rounded-xl border bg-white px-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
                  fieldError ? "border-error-fill" : "border-black/15",
                )}
              >
                <GlobeIcon className="size-5 shrink-0 text-[#36344d]" />
                <input
                  ref={inputRef}
                  id="dns-domain"
                  name="domain"
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="example.com"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (fieldError) setFieldError(null);
                  }}
                  aria-invalid={fieldError ? true : undefined}
                  aria-describedby={fieldError ? "dns-domain-error" : undefined}
                  className="h-full min-w-0 flex-1 bg-transparent text-[14px] leading-6 text-[#18181a] outline-none placeholder:text-[#6d6b80]"
                />
              </div>
              {fieldError && (
                <p id="dns-domain-error" className="mt-1.5 pl-0.5 text-[13px] leading-5 text-error">
                  {fieldError}
                </p>
              )}
            </div>

            <div className="md:w-[160px]">
              <label htmlFor="dns-type" className="block pl-0.5 text-[14px] leading-5 font-semibold text-[#18181a]">
                Record type
              </label>
              <div className="relative mt-2">
                <select
                  id="dns-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-black/15 bg-white pr-10 pl-4 text-[14px] text-[#18181a] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {RECORD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <Chevron className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#18181a]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={checking || cooldown > 0}
              aria-busy={checking || undefined}
              className="flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-[16px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-80 md:mt-7 md:w-[196px]"
            >
              {checking ? <Spinner className="size-5" label="Checking" /> : cooldown > 0 ? `Check again in ${cooldown}s` : "Check propagation"}
            </button>
          </div>
        </form>
      </section>

      {/* ── Map stage + results ───────────────────────────────────────── */}
      <section aria-label="Results" className="bg-[#f5f5f6] px-4 pt-8 pb-12 md:px-10 md:pt-12 xl:px-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="relative">
            <World markers={markers} view={view} />

            <div className="absolute top-0 right-0 flex rounded-full border border-black/10 bg-white p-1 text-[13px] font-semibold shadow-sm" role="group" aria-label="Map view">
              {(["globe", "map"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-full px-3 py-1 transition-colors",
                    view === v ? "bg-[#18181a] text-white" : "text-[#36344d] hover:bg-ink-100",
                  )}
                >
                  {v === "globe" ? "Globe" : "Flat map"}
                </button>
              ))}
            </div>

            {result?.state === "completed" && (
              <ul className="absolute bottom-3 left-0 hidden gap-4 text-[13px] text-[#36344d] sm:flex" aria-label="Map legend">
                <Legend color="bg-[#009e5b]" label="Live" />
                <Legend color="bg-[#e69800]" label="Not live yet" />
                <Legend color="bg-[#9d9ea4]" label="No answer" />
              </ul>
            )}

            {showSummary && (
              <Summary
                result={result}
                checking={checking}
                total={total}
                counts={counts}
                checkedAgo={checkedAgo}
                auto={auto}
                setAuto={setAuto}
                nextIn={nextAt ? Math.max(0, Math.ceil((nextAt - now) / 1000)) : null}
                recheck={() => query && void run(query.domain, query.type, false)}
                disabled={checking || cooldown > 0}
              />
            )}
          </div>

          <Results
            result={result}
            query={query}
            checking={checking}
            rows={rows}
            counts={counts}
            total={total}
            filter={filter}
            setFilter={setFilter}
            checkedAgo={checkedAgo}
            recheck={(d, t) => {
              setInput(d);
              setType(t);
              submit(d, t);
            }}
          />
        </div>
      </section>
    </>
  );
}

/* ── Summary (pinned over the map) ───────────────────────────────────────── */

function Summary({
  result,
  checking,
  total,
  counts,
  checkedAgo,
  auto,
  setAuto,
  nextIn,
  recheck,
  disabled,
}: {
  result: CheckResult | null;
  checking: boolean;
  total: number;
  counts: Record<RowStatus, number>;
  checkedAgo: number;
  auto: boolean;
  setAuto: (v: boolean) => void;
  nextIn: number | null;
  recheck: () => void;
  disabled: boolean;
}) {
  const [info, setInfo] = useState(false);
  const outcome = result?.summary.outcome ?? null;
  const percent = total ? Math.round((counts.live / total) * 100) : 0;
  const everywhere = counts.notLive === 0 && counts.live > 0 && outcome === "propagating";

  let headline: React.ReactNode;
  if (!result) headline = `Asking ${total} DNS servers…`;
  else if (outcome === "noAnswers") headline = `None of the ${total} servers answered`;
  else if (outcome === "allFailed") headline = `All ${total} servers failed to look up this domain`;
  else if (outcome === "noRecords") headline = `All ${total} servers agree there's no ${result.type} record`;
  else if (outcome === "notPublished") headline = `None of the ${total} servers can find this domain yet`;
  else if (everywhere) headline = "Live everywhere";
  else
    headline = (
      <>
        <strong className="font-semibold">{counts.live}</strong> of {total} servers are live.
      </>
    );

  const status = checking
    ? result
      ? "Checking again…"
      : "Checking now"
    : checkedAgo < 5
      ? "Checked just now"
      : checkedAgo < 60
        ? `Checked ${checkedAgo}s ago`
        : `Checked ${Math.floor(checkedAgo / 60)} min ago`;

  return (
    <div
      aria-live="polite"
      className="relative z-10 mx-auto -mt-6 w-full max-w-[560px] rounded-2xl border border-black/10 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] md:absolute md:top-6 md:left-1/2 md:mt-0 md:-translate-x-1/2 md:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[18px] leading-[26px] text-[#18181a]">{headline}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[13px] leading-5 text-black/60">
            {checking && <Spinner className="size-3.5" label="" />}
            {status}
          </p>
        </div>
        {result && outcome === "propagating" && !everywhere && (
          <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-[13px] font-semibold text-[#18181a]">{percent}% propagated</span>
        )}
      </div>

      {result && (
        <div
          role="meter"
          aria-label="Servers returning the current records"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={counts.live}
          aria-valuetext={`${counts.live} of ${total} servers are live`}
          className="mt-3 flex h-2 overflow-hidden rounded-full bg-ink-100"
        >
          <span className="bg-[#009e5b] transition-[width] duration-500" style={{ width: `${(counts.live / total) * 100}%` }} />
          <span className="bg-[#e69800] transition-[width] duration-500" style={{ width: `${(counts.notLive / total) * 100}%` }} />
        </div>
      )}

      {result && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex items-center gap-2 text-[14px] text-[#18181a]">
            <button
              type="button"
              role="switch"
              aria-checked={auto}
              onClick={() => setAuto(!auto)}
              className={cn("relative h-5 w-9 rounded-full transition-colors", auto ? "bg-primary" : "bg-ink-300")}
            >
              <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-[left]", auto ? "left-[18px]" : "left-0.5")} />
              <span className="sr-only">Auto-refresh</span>
            </button>
            <span aria-hidden>Auto-refresh</span>
            <button
              type="button"
              aria-label="How auto-refresh works"
              aria-expanded={info}
              onClick={() => setInfo(!info)}
              className="grid size-5 place-items-center rounded-full border border-black/20 text-[11px] font-semibold text-black/60 hover:text-[#18181a]"
            >
              i
            </button>
            {auto && nextIn !== null && !checking && <span className="text-[13px] text-black/60">· next in {nextIn}s</span>}
            {info && (
              <p className="absolute top-7 left-0 z-20 w-[280px] rounded-xl bg-ink-950 p-3 text-[13px] leading-5 text-white shadow-lg">
                While this page is open, every server is asked again 15 seconds after each check, for up to 10 minutes. It stops once all servers return
                the current record, and waits while this tab is in the background.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={recheck}
            disabled={disabled}
            className="h-9 rounded-xl border border-black/15 px-4 text-[14px] font-semibold text-[#18181a] hover:bg-ink-50 disabled:opacity-50"
          >
            Check again
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Results card ────────────────────────────────────────────────────────── */

function Results({
  result,
  query,
  checking,
  rows,
  counts,
  total,
  filter,
  setFilter,
  checkedAgo,
  recheck,
}: {
  result: CheckResult | null;
  query: { domain: string; type: string } | null;
  checking: boolean;
  rows: Row[];
  counts: Record<RowStatus, number>;
  total: number;
  filter: Filter;
  setFilter: (f: Filter) => void;
  checkedAgo: number;
  recheck: (domain: string, type: string) => void;
}) {
  const sorted = useMemo(
    () => [...rows].sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || a.country.localeCompare(b.country) || a.city.localeCompare(b.city)),
    [rows],
  );
  const [expanded, setExpanded] = useState(false);
  const filtered = filter === "all" ? sorted : sorted.filter((r) => r.status === filter);
  const shown = expanded ? filtered : filtered.slice(0, PAGE);

  let description = "Enter a domain above to see what DNS servers around the world return.";
  if (checking && !result && query) description = `Asking DNS servers around the world for ${query.domain}'s ${query.type} records…`;
  else if (result?.state === "completed") description = "Every server we asked, with its answer, how long it may keep it cached (TTL), and whether it's live.";
  else if (result) description = `What we found when we looked up ${result.domain}.`;

  return (
    <div className="relative z-[1] mt-6 rounded-3xl border border-black/10 bg-white p-6 md:mt-0 md:p-8" data-qa="dns-results">
      <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.1px] text-[#18181a] md:text-[24px] md:leading-8 md:tracking-[-0.12px]">
        All DNS server responses
      </h2>
      <p className="mt-1 flex items-center gap-2 text-[16px] leading-6 text-black/75">
        {checking && !result && <Spinner className="size-4 shrink-0" label="" />}
        {description}
      </p>

      {result && result.state !== "completed" && <StateCard result={result} />}

      {result?.state === "completed" && (
        <>
          <Strip result={result} checkedAgo={checkedAgo} recheck={recheck} />
          {result.current && <CurrentRecords result={result} />}

          <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Show servers">
            {(["all", "live", "notLive", "timedOut", "failed"] as const).map((f) => {
              const n = f === "all" ? total : counts[f];
              if (f !== "all" && n === 0 && filter !== f) return null;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "h-9 rounded-full border px-4 text-[14px] font-semibold transition-colors",
                    filter === f ? "border-[#18181a] bg-[#18181a] text-white" : "border-black/15 text-[#18181a] hover:bg-ink-50",
                  )}
                >
                  {f === "all" ? "All" : STATUS_LABEL[f]} <span className={filter === f ? "text-white/70" : "text-black/50"}>{n}</span>
                </button>
              );
            })}
          </div>

          <table className="mt-4 w-full border-collapse text-left text-[14px] leading-5 text-[#18181a]">
            <thead className="max-md:sr-only">
              <tr className="border-b border-black/10 text-[13px] text-black/60">
                <th scope="col" className="py-3 pr-4 font-semibold md:w-[24%]">Location</th>
                <th scope="col" className="py-3 pr-4 font-semibold md:w-[20%]">Provider</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Answer</th>
                <th scope="col" className="py-3 pr-4 font-semibold md:w-[8%]">TTL</th>
                <th scope="col" className="py-3 font-semibold md:w-[14%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <ResultRow key={r.id} row={r} />
              ))}
            </tbody>
          </table>
          {filtered.length > PAGE && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-4 h-10 w-full rounded-xl border border-black/15 text-[14px] font-semibold text-[#18181a] hover:bg-ink-50 md:w-auto md:px-5"
            >
              {expanded ? "Show fewer" : `Show all ${filtered.length} servers`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function ResultRow({ row }: { row: Row }) {
  const [ipOpen, setIpOpen] = useState(false);
  const [more, setMore] = useState(false);
  const values = row.answer.values;
  const visible = more ? values : values.slice(0, 3);
  return (
    <tr className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-black/10 py-4 last:border-b-0 md:table-row md:py-0">
      <td className="md:py-4 md:pr-4 md:align-top">
        <span className="flex items-center gap-2">
          <span aria-hidden className="text-[18px] leading-5">{flag(row.cc)}</span>
          <span>
            <span className="font-semibold">{row.city}</span>
            <span className="text-black/60">, {row.country}</span>
          </span>
        </span>
      </td>
      <td className="col-start-2 row-start-1 md:hidden">
        <StatusPill status={row.status} />
      </td>
      <td className="col-span-2 text-black/75 md:py-4 md:pr-4 md:align-top md:text-[#18181a]">
        <span className="inline-flex items-center gap-1.5">
          {row.provider}
          <button
            type="button"
            aria-label={`Show the resolver IP for ${row.provider}`}
            aria-expanded={ipOpen}
            onClick={() => setIpOpen(!ipOpen)}
            className="grid size-4 place-items-center rounded-full border border-black/25 text-[10px] font-semibold text-black/60 hover:text-[#18181a]"
          >
            i
          </button>
        </span>
        <span className="text-black/50 md:hidden"> · TTL {formatTtl(row.ttl)}</span>
        {ipOpen && <span className="block font-mono text-[12px] text-black/60">Resolver IP: {row.ip}</span>}
      </td>
      <td className="col-span-2 min-w-0 md:py-4 md:pr-4 md:align-top">
        {row.answer.kind === "records" ? (
          <ul className="flex flex-col gap-0.5">
            {visible.map((v) => (
              <li key={v} className="font-mono text-[12px] [overflow-wrap:anywhere] md:text-[13px]">{v}</li>
            ))}
            {values.length > 3 && (
              <li>
                <button type="button" onClick={() => setMore(!more)} className="text-[13px] font-semibold text-primary hover:underline">
                  {more ? "Show fewer" : `+${values.length - 3} more`}
                </button>
              </li>
            )}
            {row.status === "notLive" && <li className="text-[12px] font-semibold text-warning">Records differ</li>}
          </ul>
        ) : (
          <span className="text-black/60">
            {row.answer.kind === "noRecords"
              ? "No records"
              : row.answer.kind === "notFoundYet"
                ? "Not found yet"
                : row.answer.kind === "noResponse"
                  ? "No response"
                  : "Server error"}
          </span>
        )}
      </td>
      <td className="hidden md:table-cell md:py-4 md:pr-4 md:align-top">{formatTtl(row.ttl)}</td>
      <td className="hidden md:table-cell md:py-4 md:align-top">
        <StatusPill status={row.status} />
      </td>
    </tr>
  );
}

function StatusPill({ status }: { status: RowStatus }) {
  const tone = {
    live: "bg-success-soft text-success",
    notLive: "bg-warning-soft text-warning",
    timedOut: "bg-ink-100 text-black/70",
    failed: "bg-error-soft text-error",
  }[status];
  const dot = { live: "bg-[#009e5b]", notLive: "bg-[#e69800]", timedOut: "bg-[#9d9ea4]", failed: "bg-[#e73a47]" }[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] leading-4 font-semibold whitespace-nowrap", tone)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", dot)} />
      {STATUS_LABEL[status]}
    </span>
  );
}

/* ── Strips: what the result means ──────────────────────────────────────── */

function Strip({ result, checkedAgo, recheck }: { result: CheckResult; checkedAgo: number; recheck: (d: string, t: string) => void }) {
  const { domain, type, summary, rows, current } = result;
  const outcome = summary.outcome;
  const isRoot = domain.split(".").length === 2;

  let tone: "danger" | "warning" | "neutral" | "success" = "neutral";
  let title: React.ReactNode = null;
  let body: React.ReactNode = null;
  let action: React.ReactNode = null;

  if (outcome === "noAnswers") {
    tone = "danger";
    title = `We couldn't check ${domain} right now`;
    body = "None of the servers answered in time. This is usually a short-lived problem on our side or with the network, not with your domain. Try again in a minute.";
    action = <StripButton onClick={() => recheck(domain, type)}>Try again</StripButton>;
  } else if (outcome === "allFailed") {
    tone = "danger";
    title = `No server could look up ${domain}`;
    body = "Every server replied with an error. This usually means the domain's nameservers aren't working or its DNSSEC settings are wrong. Check them, then try again.";
    action = <StripButton onClick={() => recheck(domain, type)}>Try again</StripButton>;
  } else if (outcome === "noRecords") {
    tone = "warning";
    title = `None of the servers return ${type} records for ${domain}`;
    if (type === "CNAME" && isRoot) {
      body = `A root domain like ${domain} can't have a CNAME record. To see where it points, check its A records instead.`;
      action = <StripButton onClick={() => recheck(domain, "A")}>Check A records</StripButton>;
    } else if (type === "SRV" && !domain.startsWith("_")) {
      body = `SRV records sit on a service name, like _sip._tcp.${domain}, not on the domain itself. Check that name instead.`;
    } else if (type === "NS" && !isRoot) {
      body = `NS records list a domain's nameservers and sit on the domain itself, not on a name inside it like ${domain}. Check the domain instead.`;
    } else {
      body = `If you expected ${type} records, check that they're added in ${domain}'s DNS settings and that the domain uses the nameservers where you added them.`;
    }
  } else if (outcome === "notPublished") {
    tone = "warning";
    title = `${domain} is registered, but isn't live yet`;
    body =
      "No server can find it yet. A newly registered domain usually shows up within a few minutes, sometimes a few hours. If it's older, it may be suspended or have no nameservers set, so check with the company you registered it with.";
  } else if (summary.counts.notLive > 0) {
    const longest = Math.max(0, ...rows.filter((r) => r.status === "notLive").map((r) => r.ttl ?? 0));
    const left = longest - checkedAgo;
    if (left <= -60) {
      tone = "warning";
      title = "Some servers are taking longer than expected";
      body =
        "This is normal, and can happen if your nameservers changed recently or when a server keeps its copy for longer than its TTL. Most catch up within a few hours, and nameserver changes can take up to 48 hours.";
    } else if (left > 0) {
      title = (
        <>
          Servers that aren&apos;t live yet should all catch up when their cached copy expires, within{" "}
          <strong className="font-semibold">about {formatDuration(left)}</strong>.
        </>
      );
    } else {
      title = "Servers that aren't live yet should catch up any moment now, as their cached copy has expired.";
    }
  } else if (current?.dynamic) {
    title = `${domain} gives different answers depending on where and when it's asked`;
    body = `Large sites and CDNs send each visitor to a nearby server, so their ${type} records vary by location. Any server that returns ${type} records for ${domain} is counted as live.`;
  }

  if (!title) return null;
  const tones = {
    danger: "border-[#e73a47]/30 bg-error-soft",
    warning: "border-[#e69800]/40 bg-warning-soft",
    neutral: "border-black/10 bg-ink-50",
    success: "border-[#009e5b]/30 bg-success-soft",
  };
  return (
    <div className={cn("mt-6 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between", tones[tone])}>
      <div className="text-[14px] leading-5">
        <p className="text-[15px] leading-[22px] text-[#18181a]">{title}</p>
        {body && <p className="mt-1 text-black/75">{body}</p>}
      </div>
      {action}
    </div>
  );
}

function StripButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="h-10 shrink-0 rounded-xl border border-black/15 bg-white px-4 text-[14px] font-semibold text-[#18181a] hover:bg-ink-50">
      {children}
    </button>
  );
}

/* ── Not found / not registered / no nameservers ─────────────────────────── */

function StateCard({ result }: { result: CheckResult }) {
  const { domain, state } = result;
  const registrable = domain.split(".").slice(-2).join(".");
  const copy = {
    notFound: {
      title: `We couldn't find ${domain}`,
      body: "Check the spelling. If it's right, the domain may not be registered yet, so it could be available. Just registered it? Give it a few minutes to show up.",
      cta: true,
    },
    notRegistered: {
      title: `${domain} isn't registered`,
      body: "No owner, no records, just potential. Check its availability and make it yours.",
      cta: true,
    },
    noNameservers: {
      title: `${domain}'s nameservers aren't answering`,
      body: "Its nameservers are missing or not responding, so we can't tell what its current records are, and visitors can't reach it. Check the nameservers where you registered the domain. If you just changed them, it can take up to 24 hours.",
      cta: false,
    },
    completed: { title: "", body: "", cta: false },
  }[state];
  return (
    <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-black/10 bg-ink-50 p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[18px] leading-[26px] font-semibold text-[#18181a]">{copy.title}</p>
        <p className="mt-1 max-w-[720px] text-[14px] leading-5 text-black/75">{copy.body}</p>
      </div>
      {copy.cta && (
        <Link
          href={`/domain-name-results?domain=${encodeURIComponent(state === "notRegistered" ? registrable : domain)}`}
          className="inline-flex h-12 shrink-0 items-center rounded-xl bg-primary px-6 text-[16px] font-semibold text-white hover:bg-primary-hover"
        >
          Check availability
        </Link>
      )}
    </div>
  );
}

/* ── Your current records ────────────────────────────────────────────────── */

function CurrentRecords({ result }: { result: CheckResult }) {
  const current = result.current!;
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const list = current.records.filter((r) => r.value.toLowerCase().includes(q.trim().toLowerCase()));
  const visible = all ? list : list.slice(0, 5);
  const label = current.cname ? "CNAME" : result.type;
  const n = current.records.length;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-black/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[18px] leading-[26px] font-semibold text-[#18181a]">Your current records</h3>
          <p className="mt-0.5 text-[14px] leading-5 text-black/75">
            {current.cname
              ? `${result.domain} is a CNAME to ${current.cname}, so a server is live when it follows it there.`
              : `What ${result.domain}'s nameservers return right now. A server is live when it returns exactly these.`}
          </p>
        </div>
        {n > 0 && (
          <button
            type="button"
            onClick={() => copy(current.records.map((r) => r.value).join("\n"), "all")}
            className="h-9 rounded-xl border border-black/15 px-3 text-[14px] font-semibold text-[#18181a] hover:bg-ink-50"
          >
            {copied === "all" ? "Copied" : "Copy all"}
          </button>
        )}
      </div>

      {n === 0 ? (
        <p className="mt-4 text-[14px] text-black/60">{`${result.domain}'s nameservers return no ${result.type} records.`}</p>
      ) : (
        <>
          <p className="mt-4 text-[13px] text-black/60">
            {n === 1 ? `1 ${label} record` : `${n} ${label} records`}
            {current.source && (
              <>
                {" "}from <span className="font-mono">{current.source}</span>
              </>
            )}
          </p>
          {n > 5 && (
            <input
              type="search"
              aria-label="Filter records"
              placeholder="Filter records, e.g. google"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mt-3 h-10 w-full rounded-xl border border-black/15 px-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary md:max-w-[320px]"
            />
          )}
          <ul className="mt-3 flex flex-col divide-y divide-black/5 rounded-xl bg-ink-50">
            {visible.map((r) => (
              <li key={r.value} className="flex flex-col gap-1 px-3 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="min-w-0 font-mono text-[13px] leading-5 [overflow-wrap:anywhere] text-[#18181a]">{r.value}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-[12px] text-black/60">TTL {formatTtl(r.ttl)}</span>
                  <button
                    type="button"
                    aria-label={`Copy ${label} record`}
                    onClick={() => copy(r.value, r.value)}
                    className="text-[12px] font-semibold text-primary hover:underline"
                  >
                    {copied === r.value ? "Copied" : "Copy"}
                  </button>
                </span>
              </li>
            ))}
            {list.length === 0 && <li className="px-3 py-2.5 text-[13px] text-black/60">No records match “{q}”.</li>}
          </ul>
          {list.length > 5 && (
            <button type="button" onClick={() => setAll(!all)} className="mt-2 text-[14px] font-semibold text-primary hover:underline">
              {all ? "Show fewer" : `Show all ${list.length} records`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ── Atoms ───────────────────────────────────────────────────────────────── */

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span aria-hidden className={cn("size-2.5 rounded-full", color)} />
      {label}
    </li>
  );
}

function Spinner({ className, label }: { className?: string; label: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("animate-spin", className)} role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
