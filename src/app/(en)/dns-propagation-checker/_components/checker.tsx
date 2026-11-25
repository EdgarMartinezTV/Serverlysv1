"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { World, type Marker, type MarkerTone, type View } from "./world";
import type { CheckResult, Row, RowStatus } from "@/lib/dns/propagation";
import { DNS_SERVERS } from "@/lib/dns/servers";
import { RECORD_TYPES } from "@/lib/dns/types";
import { tc } from "@/i18n/t";
import { lh } from "@/i18n/href";

/**
 * The DNS propagation checker — form, pinned summary bar, map, the table of
 * every server's answer, and the current records. Layout and behaviour were
 * taken from hostinger.com/dns-propagation-checker as it renders a real check
 * in a real browser (2026-11-24): summary bar pinned under the header with
 * one dot per server, legend + Globe/Flat map over the globe, filter chips,
 * a sortable bordered table showing every server, and "Your current records"
 * as its own card below. The checking itself is ours, in /api/dns/propagation.
 *
 * Auto-refresh (off by default, as on the reference): while the page is open,
 * a check that still has servers "not live yet" is repeated 15 seconds after
 * it finishes, for up to 10 minutes. It stops when every server is live and
 * pauses while the tab is hidden.
 */

const REFRESH_EVERY = 15;
const REFRESH_FOR = 10 * 60;
const CLIENT_HOST = /^([a-z0-9_-]{1,63}\.)+[a-z][a-z0-9-]{1,62}$/;

type Notice = { kind: "rateLimited" | "failed"; retryAt?: number } | null;
type Filter = "all" | RowStatus;
type SortKey = "location" | "ttl" | "status";

const STATUS_LABEL: Record<RowStatus, string> = {
  live: "Live",
  notLive: "Not live yet",
  timedOut: "Timed out",
  failed: "Failed",
};
const ORDER: RowStatus[] = ["notLive", "failed", "timedOut", "live"];

/** Colours shared by the summary dots, the map markers and the legend. */
export const DOT = {
  live: "#009e5b",
  notLive: "#a1a1aa",
  noAnswer: "#d12c35",
  pending: "#dedee2",
} as const;
const dotFor = (s: RowStatus) =>
  s === "live" ? DOT.live : s === "notLive" ? DOT.notLive : DOT.noAnswer;

/**
 * Translate a template with {named} slots, then fill the slots. Domains,
 * record types and counts go in AFTER the lookup, so one dictionary entry
 * ("{domain} isn't registered") covers every domain. English: identity.
 * Call only while rendering (t() reads the dictionary from React context).
 */
function T(s: string, vars: Record<string, string | number> = {}) {
  // Keys are namespaced ("dns|Live") so words like "Live" and "Answer" get the
  // checker's meaning without changing how other pages translate them.
  return tc("dns", s).replace(/\{(\w+)\}/g, (m, k: string) =>
    k in vars ? String(vars[k]) : m,
  );
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

function Flag({ cc, className }: { cc: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 20px static icons; next/image adds nothing here
    <img
      src={`/flags/${cc.toLowerCase()}.png`}
      alt=""
      width={20}
      height={20}
      loading="lazy"
      className={cn(
        "size-5 shrink-0 rounded-full object-cover ring-1 ring-black/5",
        className,
      )}
    />
  );
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
  const [auto, setAuto] = useState(false);
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

  const run = useCallback(
    async (domain: string, recordType: string, fresh: boolean) => {
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
        const res = await fetch(
          `/api/dns/propagation?domain=${encodeURIComponent(domain)}&type=${recordType}`,
          {
            cache: "no-store",
          },
        );
        const body = await res.json().catch(() => null);
        if (my !== seq.current) return;
        if (res.status === 429) {
          setNotice({
            kind: "rateLimited",
            retryAt: Date.now() + (Number(body?.retryAfter) || 60) * 1000,
          });
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
    },
    [],
  );

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
  const pending =
    result?.state === "completed" &&
    result.summary.outcome === "propagating" &&
    result.summary.counts.notLive > 0;
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
  const rows = useMemo(
    () => (result?.state === "completed" ? result.rows : []),
    [result],
  );
  const counts = result?.summary.counts ?? {
    live: 0,
    notLive: 0,
    timedOut: 0,
    failed: 0,
  };
  const total = result?.summary.total ?? DNS_SERVERS.length;
  const checkedAgo = result
    ? Math.max(0, Math.floor((now - Date.parse(result.checkedAt)) / 1000))
    : 0;
  const cooldown =
    notice?.kind === "rateLimited" && notice.retryAt
      ? Math.max(0, Math.ceil((notice.retryAt - now) / 1000))
      : 0;

  // Translated once per render, outside the memo: t() reads React context,
  // which may not be called from inside useMemo.
  const L = {
    live: T("Live"),
    notLive: T("Not live yet"),
    noAnswer: T("No answer"),
    checking: T("Checking…"),
    waiting: T("Waiting for a check"),
  };
  const countryName: Record<string, string> = {};
  for (const s of DNS_SERVERS) {
    countryName[s.country] = T(s.country);
    countryName[s.city] = T(s.city);
  }
  const labels = JSON.stringify([L, countryName]);

  const markers: Marker[] = useMemo(() => {
    const [l, names] = JSON.parse(labels) as [typeof L, Record<string, string>];
    const byId = new Map(rows.map((r) => [r.id, r]));
    return DNS_SERVERS.map((s) => {
      const r = byId.get(s.id);
      let tone: MarkerTone = checking && !r ? "checking" : "idle";
      if (r)
        tone =
          r.status === "live"
            ? "live"
            : r.status === "notLive"
              ? "notLive"
              : "noAnswer";
      const status = r
        ? r.status === "live"
          ? l.live
          : r.status === "notLive"
            ? l.notLive
            : l.noAnswer
        : checking
          ? l.checking
          : l.waiting;
      return {
        id: s.id,
        lat: s.lat,
        lon: s.lon,
        tone,
        label: `${names[s.city]}, ${names[s.country]}: ${status}`,
      };
    });
  }, [rows, checking, labels]);

  const showSummary = Boolean(query) && (checking || result?.state === "completed");

  return (
    <>
      {/* ── Hero + form ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="dns-hero-heading"
        className="bg-[#f5f5f6] px-4 pt-[72px] md:px-10 md:pt-[96px]"
      >
        <div className="mx-auto flex max-w-[880px] flex-col items-center text-center">
          <h1
            id="dns-hero-heading"
            className="text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-[#18181a] md:text-[48px] md:leading-[56px] md:tracking-[-0.24px]"
          >
            {T("DNS checker")}
          </h1>
          <p className="mt-4 max-w-[736px] text-[16px] leading-6 text-black/75">
            {T(
              "See which DNS servers around the world already return your new records, and which still have the old ones.",
            )}
          </p>
        </div>

        {notice && (
          <div
            role="alert"
            className="mx-auto mt-8 flex max-w-[880px] flex-col gap-3 rounded-2xl border border-[#e73a47]/30 bg-error-soft px-5 py-4 text-left sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-[16px] leading-6 font-semibold text-[#18181a]">
                {T(
                  notice.kind === "rateLimited"
                    ? "You've run a lot of checks in a short time"
                    : "We couldn't run the check",
                )}
              </p>
              <p className="text-[14px] leading-5 text-black/75">
                {notice.kind === "rateLimited"
                  ? `${T("Wait a minute and check again.")}${result ? ` ${T("The results below are from your last check.")}` : ""}`
                  : T("Something went wrong on our side. Try again in a minute.")}
              </p>
            </div>
            {notice.kind === "failed" && query && (
              <button
                type="button"
                onClick={() => void run(query.domain, query.type, !result)}
                className="h-10 shrink-0 rounded-xl border border-black/15 bg-white px-4 text-[14px] font-semibold text-[#18181a] hover:bg-ink-50"
              >
                {T("Try again")}
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
          className="mx-auto mt-12 max-w-[880px] rounded-3xl border border-black/10 bg-white p-6 text-left shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-3">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="dns-domain"
                className="block pl-0.5 text-[14px] leading-5 font-semibold text-[#18181a]"
              >
                {T("Domain or hostname")}
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
                <p
                  id="dns-domain-error"
                  className="mt-1.5 pl-0.5 text-[13px] leading-5 text-error"
                >
                  {T(fieldError)}
                </p>
              )}
            </div>

            <div className="md:w-[160px]">
              <label
                htmlFor="dns-type"
                className="block pl-0.5 text-[14px] leading-5 font-semibold text-[#18181a]"
              >
                {T("Record type")}
              </label>
              <TypeSelect
                id="dns-type"
                value={type}
                onChange={setType}
                className="mt-2 h-12 text-[14px]"
              />
            </div>

            <button
              type="submit"
              disabled={checking || cooldown > 0}
              aria-busy={checking || undefined}
              className="flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-[16px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-80 md:mt-7 md:min-w-[196px] md:px-6 md:whitespace-nowrap"
            >
              {checking ? (
                <Spinner className="size-5" label={T("Checking")} />
              ) : cooldown > 0 ? (
                T("Check again in {s}s", { s: cooldown })
              ) : (
                T("Check propagation")
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ── Summary bar, map, results, records ────────────────────────── */}
      <section
        aria-label={T("Results")}
        className="bg-[#f5f5f6] px-4 pt-12 pb-12 md:px-10 md:pt-[136px] xl:px-20"
      >
        <div className="mx-auto max-w-[1440px]">
          {showSummary && query && (
            <SummaryBar
              domain={result?.domain ?? query.domain}
              type={query.type}
              result={result}
              checking={checking}
              total={total}
              counts={counts}
              rows={rows}
              checkedAgo={checkedAgo}
              auto={auto}
              setAuto={setAuto}
              nextIn={nextAt ? Math.max(0, Math.ceil((nextAt - now) / 1000)) : null}
              disabled={checking || cooldown > 0}
              recheck={() => void run(query.domain, query.type, false)}
              changeType={(t) => {
                setType(t);
                submit(query.domain, t);
              }}
            />
          )}

          <div className={cn("relative", showSummary && "mt-8 md:mt-12")}>
            {showSummary && (
              <>
                <ul
                  className="absolute top-0 left-0 z-10 flex flex-col gap-1 text-[14px] leading-5 text-[#18181a] md:text-[16px]"
                  aria-label={T("Map legend")}
                >
                  <Legend color={DOT.live} label={T("Live")} />
                  <Legend color={DOT.notLive} label={T("Not live yet")} />
                  <Legend color={DOT.noAnswer} label={T("No answer")} />
                </ul>

                <div
                  className="absolute top-0 right-0 z-10 flex rounded-full bg-[#ebebef] p-1 text-[13px] font-semibold md:text-[14px]"
                  role="group"
                  aria-label={T("Map view")}
                >
                  {(["globe", "map"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={view === v}
                      onClick={() => setView(v)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors",
                        view === v
                          ? "bg-white text-[#18181a] shadow-sm"
                          : "text-[#36344d] hover:text-[#18181a]",
                      )}
                    >
                      {v === "globe" ? (
                        <GlobeIcon className="size-4" />
                      ) : (
                        <PinIcon className="size-4" />
                      )}
                      {T(v === "globe" ? "Globe" : "Flat map")}
                    </button>
                  ))}
                </div>
              </>
            )}

            <World markers={markers} view={view} />
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

          {result?.state === "completed" && result.current && (
            <CurrentRecords result={result} />
          )}
        </div>
      </section>
    </>
  );
}

/* ── Record type select (form + summary bar) ─────────────────────────────── */

function TypeSelect({
  id,
  value,
  onChange,
  className,
  label,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        id={id}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full appearance-none rounded-xl border border-black/15 bg-white pr-10 pl-4 text-[#18181a] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      >
        {RECORD_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <Chevron className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#18181a]" />
    </div>
  );
}

/* ── Summary bar (pinned under the header) ───────────────────────────────── */

function SummaryBar({
  domain,
  type,
  result,
  checking,
  total,
  counts,
  rows,
  checkedAgo,
  auto,
  setAuto,
  nextIn,
  disabled,
  recheck,
  changeType,
}: {
  domain: string;
  type: string;
  result: CheckResult | null;
  checking: boolean;
  total: number;
  counts: Record<RowStatus, number>;
  rows: Row[];
  checkedAgo: number;
  auto: boolean;
  setAuto: (v: boolean) => void;
  nextIn: number | null;
  disabled: boolean;
  recheck: () => void;
  changeType: (t: string) => void;
}) {
  const [info, setInfo] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // Compact the dots once the bar is pinned, as the reference does.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), {
      rootMargin: "-85px 0px 0px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const outcome = result?.summary.outcome ?? null;
  const percent = total ? Math.round((counts.live / total) * 100) : 0;
  const everywhere =
    counts.notLive === 0 && counts.live > 0 && outcome === "propagating";
  const fresh = checking && !result;

  let headline: React.ReactNode;
  if (fresh) headline = T("Asking {total} DNS servers…", { total });
  else if (outcome === "noAnswers")
    headline = T("None of the {total} servers answered", { total });
  else if (outcome === "allFailed")
    headline = T("All {total} servers failed to look up this domain", { total });
  else if (outcome === "noRecords")
    headline = T("All {total} servers agree there's no {type} record", {
      total,
      type: result?.type ?? "",
    });
  else if (outcome === "notPublished")
    headline = T("None of the {total} servers can find this domain yet", { total });
  else {
    // "{live} of {total} servers are live." with the first number in bold.
    const [before, after] = T("{live} of {total} servers are live.", { total }).split(
      "{live}",
    );
    headline = (
      <>
        {before}
        <strong className="font-semibold">{counts.live}</strong>
        {after}
      </>
    );
  }

  const badge =
    fresh || !result ? null : everywhere ? (
      <span className="rounded-md bg-success-soft px-1.5 py-0.5 text-[13px] leading-4 font-semibold text-success">
        {T("Live everywhere")}
      </span>
    ) : outcome === "propagating" ? (
      <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[13px] leading-4 font-semibold text-[#36344d]">
        {T("{percent}% propagated", { percent })}
      </span>
    ) : null;

  const status = checking
    ? T(result ? "Checking again…" : "Checking now")
    : checkedAgo < 5
      ? T("Checked just now")
      : checkedAgo < 60
        ? T("Checked {s}s ago", { s: checkedAgo })
        : T("Checked {m} min ago", { m: Math.floor(checkedAgo / 60) });

  const ordered = useMemo(
    () => [...rows].sort((a, b) => ORDER.indexOf(b.status) - ORDER.indexOf(a.status)),
    [rows],
  );

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />
      <div
        data-stage-rail=""
        aria-live="polite"
        className={cn(
          "z-30 rounded-3xl md:sticky md:top-[84px] border border-black/10 bg-white px-5 py-4 transition-shadow md:px-8",
          stuck && "shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
        )}
      >
        <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="truncate text-[16px] leading-6 font-semibold text-[#18181a]"
                title={domain}
              >
                {domain}
              </span>
              <TypeSelect
                value={type}
                onChange={changeType}
                label={T("Record type")}
                className="h-9 w-[110px] shrink-0 text-[14px] md:w-[150px]"
              />
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-[14px] leading-5 text-black/75 md:text-[16px] md:leading-6">
              {checking && <Spinner className="size-3.5" label="" />}
              {status}
            </p>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
              <p className="text-[16px] leading-6 text-[#18181a]">{headline}</p>
              {badge}
            </div>
            <div
              role="meter"
              aria-label={T("Servers returning the current records")}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={counts.live}
              aria-valuetext={T("{live} of {total} servers are live", {
                live: counts.live,
                total,
              })}
              className={cn(
                "mt-2 flex flex-wrap",
                stuck ? "gap-1.5" : "gap-1.5 md:gap-2",
              )}
            >
              {(fresh ? Array.from({ length: total }, () => null) : ordered).map(
                (r, i) => (
                  <span
                    key={r?.id ?? i}
                    className={cn(
                      "rounded-full transition-[height,background-color] duration-300",
                      stuck ? "size-2" : "h-6 w-2",
                      !r && "animate-pulse",
                    )}
                    style={{ backgroundColor: r ? dotFor(r.status) : DOT.pending }}
                    title={
                      r
                        ? `${T(r.city)}, ${T(r.country)}: ${T(STATUS_LABEL[r.status])}`
                        : undefined
                    }
                  />
                ),
              )}
            </div>
          </div>

          <div className="relative flex flex-wrap items-center gap-3 lg:justify-end">
            <button
              type="button"
              role="switch"
              aria-checked={auto}
              aria-label={T("Auto-refresh")}
              onClick={() => setAuto(!auto)}
              className={cn(
                "relative h-6 w-10 shrink-0 rounded-full transition-colors",
                auto ? "bg-primary" : "bg-ink-300",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 size-4 rounded-full bg-white shadow transition-[left]",
                  auto ? "left-5" : "left-1",
                )}
              />
            </button>
            <span
              aria-hidden
              className={cn("text-[16px]", auto ? "text-[#18181a]" : "text-black/50")}
            >
              {T("Auto-refresh")}
              {auto && nextIn !== null && !checking && (
                <span className="text-[13px] text-black/50"> · {nextIn}s</span>
              )}
            </span>
            <button
              type="button"
              aria-label={T("How auto-refresh works")}
              aria-expanded={info}
              onClick={() => setInfo(!info)}
              onBlur={() => setInfo(false)}
              className="text-[#36344d] hover:text-[#18181a]"
            >
              <InfoIcon className="size-[18px]" />
            </button>
            {info && (
              <p
                role="tooltip"
                className="absolute top-9 right-0 z-40 w-[300px] rounded-xl bg-ink-950 p-3 text-[13px] leading-5 text-white shadow-lg"
              >
                {T(
                  "While this page is open, every server is asked again 15 seconds after each check, for up to 10 minutes. It stops once all servers return the current record, and waits while this tab is in the background.",
                )}
              </p>
            )}
            <button
              type="button"
              onClick={recheck}
              disabled={disabled}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-black/15 bg-white px-4 text-[14px] font-semibold text-[#18181a] hover:bg-ink-50 disabled:opacity-50 md:ml-2"
            >
              <RefreshIcon className={cn("size-4", checking && "animate-spin")} />
              {T("Check again")}
            </button>
          </div>
        </div>
      </div>
    </>
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
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({
    key: "status",
    dir: 1,
  });
  const sorted = useMemo(() => {
    const by = (a: Row, b: Row) => {
      if (sort.key === "location")
        return a.country.localeCompare(b.country) || a.city.localeCompare(b.city);
      if (sort.key === "ttl") return (a.ttl ?? -1) - (b.ttl ?? -1);
      return ORDER.indexOf(a.status) - ORDER.indexOf(b.status);
    };
    return [...rows].sort(
      (a, b) =>
        by(a, b) * sort.dir ||
        a.country.localeCompare(b.country) ||
        a.city.localeCompare(b.city),
    );
  }, [rows, sort]);
  const shown = filter === "all" ? sorted : sorted.filter((r) => r.status === filter);

  let description = T(
    "Enter a domain above to see what DNS servers around the world return.",
  );
  if (checking && !result && query)
    description = T(
      "Asking DNS servers around the world for {domain}'s {type} records…",
      {
        domain: query.domain,
        type: query.type,
      },
    );
  else if (result?.state === "completed")
    description = T(
      "Every server we asked, with its answer, how long it may keep it cached (TTL), and whether it's live.",
    );
  else if (result)
    description = T("What we found when we looked up {domain}.", {
      domain: result.domain,
    });

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 },
    );
  const chips: Filter[] = [
    "all",
    "live",
    "notLive",
    ...(counts.timedOut ? (["timedOut"] as const) : []),
    ...(counts.failed ? (["failed"] as const) : []),
  ];

  return (
    <div
      className="relative z-[1] rounded-3xl border border-black/10 bg-white p-6 md:p-8"
      data-qa="dns-results"
    >
      <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.1px] text-[#18181a] md:text-[24px] md:leading-8 md:tracking-[-0.12px]">
        {T("All DNS server responses")}
      </h2>
      <p className="mt-1 flex items-center gap-2 text-[16px] leading-6 text-black/75">
        {checking && !result && <Spinner className="size-4 shrink-0" label="" />}
        {description}
      </p>

      {result && result.state !== "completed" && <StateCard result={result} />}

      {result?.state === "completed" && (
        <>
          <Strip result={result} checkedAgo={checkedAgo} recheck={recheck} />

          <div
            className="mt-6 flex flex-wrap items-center gap-2"
            role="group"
            aria-label={T("Show servers")}
          >
            {chips.map((f) => {
              const n = f === "all" ? total : counts[f];
              const selected = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={selected}
                  disabled={n === 0 && !selected}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex h-8 items-center gap-1 rounded-3xl px-3 text-[16px] font-normal transition-colors",
                    selected
                      ? "bg-[#18181a] text-[#f8f9fa]"
                      : "text-[#18181a] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] hover:bg-ink-50",
                    "disabled:cursor-default disabled:text-black/30 disabled:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] disabled:hover:bg-transparent",
                  )}
                >
                  {selected && <CheckIcon className="size-4" />}
                  {T(f === "all" ? "All" : STATUS_LABEL[f])} {n}
                </button>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
            <table className="w-full border-collapse text-left text-[16px] leading-6 text-[#18181a]">
              <thead className="max-md:sr-only">
                <tr className="border-b border-black/10">
                  <SortHeader
                    label={T("Location")}
                    k="location"
                    sort={sort}
                    onSort={toggleSort}
                    className="w-[22%]"
                  />
                  <th scope="col" className="px-4 py-3 font-normal md:w-[33%]">
                    {T("Provider")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-normal">
                    {T("Answer")}
                  </th>
                  <SortHeader
                    label="TTL"
                    k="ttl"
                    sort={sort}
                    onSort={toggleSort}
                    className="w-[8%]"
                    align="right"
                  />
                  <SortHeader
                    label={T("Status")}
                    k="status"
                    sort={sort}
                    onSort={toggleSort}
                    className="w-[14%]"
                  />
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <ResultRow key={r.id} row={r} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function SortHeader({
  label,
  k,
  sort,
  onSort,
  className,
  align = "left",
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: 1 | -1 };
  onSort: (k: SortKey) => void;
  className?: string;
  align?: "left" | "right";
}) {
  const active = sort.key === k;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
      className={cn("px-4 py-3 font-normal", className)}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className={cn(
          "flex w-full items-center gap-2",
          align === "right" && "flex-row-reverse",
        )}
      >
        {label}
        {active ? (
          <ArrowIcon className={cn("size-4", sort.dir === -1 && "rotate-180")} />
        ) : (
          <SortIcon className="size-4 text-black/70" />
        )}
      </button>
    </th>
  );
}

function ResultRow({ row }: { row: Row }) {
  const [tip, setTip] = useState(false);
  const values = row.answer.values;
  return (
    <tr className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-black/10 px-4 py-4 last:border-b-0 hover:bg-[#f4f4f6] md:table-row md:p-0">
      <td className="md:px-4 md:py-3 md:align-middle">
        <span className="flex items-center gap-3">
          <Flag cc={row.cc} />
          <span className="leading-5">
            <span className="block text-[16px]">{T(row.city)}</span>
            <span className="block text-[14px] text-black/60">{T(row.country)}</span>
          </span>
        </span>
      </td>
      <td className="col-start-2 row-start-1 md:hidden">
        <StatusBadge status={row.status} />
      </td>
      <td className="col-span-2 md:px-4 md:py-3 md:align-middle">
        <span className="relative inline-flex items-center gap-2">
          {row.provider}
          <button
            type="button"
            aria-label={T("Show the resolver IP for {provider}", {
              provider: row.provider,
            })}
            aria-expanded={tip}
            onClick={() => setTip(!tip)}
            onMouseEnter={() => setTip(true)}
            onMouseLeave={() => setTip(false)}
            onBlur={() => setTip(false)}
            className="text-[#36344d] hover:text-[#18181a]"
          >
            <InfoIcon className="size-[18px]" />
          </button>
          {tip && (
            <span
              role="tooltip"
              className="absolute bottom-full left-0 z-20 mb-2 rounded-lg bg-ink-950 px-3 py-1.5 text-[13px] leading-5 whitespace-nowrap text-white shadow-lg"
            >
              {T("Resolver IP: {ip}", { ip: row.ip })}
            </span>
          )}
        </span>
        <span className="text-[14px] text-black/50 md:hidden">
          {" "}
          · TTL {formatTtl(row.ttl)}
        </span>
      </td>
      <td className="col-span-2 min-w-0 md:px-4 md:py-3 md:align-middle">
        {row.answer.kind === "records" ? (
          <span className="flex flex-col">
            {values.map((v) => (
              <span key={v} className="[overflow-wrap:anywhere]">
                {v}
              </span>
            ))}
            {row.status === "notLive" && (
              <span className="text-[13px] font-semibold text-black/60">
                {T("Records differ")}
              </span>
            )}
          </span>
        ) : (
          <span className="text-black/60">
            {T(
              row.answer.kind === "noRecords"
                ? "No records"
                : row.answer.kind === "notFoundYet"
                  ? "Not found yet"
                  : row.answer.kind === "noResponse"
                    ? "No response"
                    : "Server error",
            )}
          </span>
        )}
      </td>
      <td className="hidden text-right md:table-cell md:px-4 md:py-3 md:align-middle">
        {formatTtl(row.ttl)}
      </td>
      <td className="hidden md:table-cell md:px-4 md:py-3 md:align-middle">
        <StatusBadge status={row.status} />
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: RowStatus }) {
  const tone = {
    live: "bg-success-soft text-success",
    notLive: "bg-ink-100 text-[#36344d]",
    timedOut: "bg-error-soft text-error",
    failed: "bg-error-soft text-error",
  }[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xl py-0.5 pr-1.5 pl-0.5 text-[14px] leading-5 font-semibold whitespace-nowrap",
        tone,
      )}
    >
      {status === "live" ? (
        <CheckCircleIcon className="size-4" />
      ) : status === "notLive" ? (
        <ClockIcon className="size-4" />
      ) : (
        <AlertIcon className="size-4" />
      )}
      {T(STATUS_LABEL[status])}
    </span>
  );
}

/* ── Strips: what the result means ──────────────────────────────────────── */

function Strip({
  result,
  checkedAgo,
  recheck,
}: {
  result: CheckResult;
  checkedAgo: number;
  recheck: (d: string, t: string) => void;
}) {
  const { domain, type, summary, rows, current } = result;
  const outcome = summary.outcome;
  const isRoot = domain.split(".").length === 2;

  let tone: "danger" | "warning" | "neutral" | "success" = "neutral";
  let title: React.ReactNode = null;
  let body: React.ReactNode = null;
  let action: React.ReactNode = null;

  if (outcome === "noAnswers") {
    tone = "danger";
    title = T("We couldn't check {domain} right now", { domain });
    body = T(
      "None of the servers answered in time. This is usually a short-lived problem on our side or with the network, not with your domain. Try again in a minute.",
    );
    action = (
      <StripButton onClick={() => recheck(domain, type)}>{T("Try again")}</StripButton>
    );
  } else if (outcome === "allFailed") {
    tone = "danger";
    title = T("No server could look up {domain}", { domain });
    body = T(
      "Every server replied with an error. This usually means the domain's nameservers aren't working or its DNSSEC settings are wrong. Check them, then try again.",
    );
    action = (
      <StripButton onClick={() => recheck(domain, type)}>{T("Try again")}</StripButton>
    );
  } else if (outcome === "noRecords") {
    tone = "warning";
    title = T("None of the servers return {type} records for {domain}", {
      type,
      domain,
    });
    if (type === "CNAME" && isRoot) {
      body = T(
        "A root domain like {domain} can't have a CNAME record. To see where it points, check its A records instead.",
        { domain },
      );
      action = (
        <StripButton onClick={() => recheck(domain, "A")}>
          {T("Check A records")}
        </StripButton>
      );
    } else if (type === "SRV" && !domain.startsWith("_")) {
      body = T(
        "SRV records sit on a service name, like _sip._tcp.{domain}, not on the domain itself. Check that name instead.",
        { domain },
      );
    } else if (type === "NS" && !isRoot) {
      body = T(
        "NS records list a domain's nameservers and sit on the domain itself, not on a name inside it like {domain}. Check the domain instead.",
        { domain },
      );
    } else {
      body = T(
        "If you expected {type} records, check that they're added in {domain}'s DNS settings and that the domain uses the nameservers where you added them.",
        { type, domain },
      );
    }
  } else if (outcome === "notPublished") {
    tone = "warning";
    title = T("{domain} is registered, but isn't live yet", { domain });
    body = T(
      "No server can find it yet. A newly registered domain usually shows up within a few minutes, sometimes a few hours. If it's older, it may be suspended or have no nameservers set, so check with the company you registered it with.",
    );
  } else if (summary.counts.notLive > 0) {
    const longest = Math.max(
      0,
      ...rows.filter((r) => r.status === "notLive").map((r) => r.ttl ?? 0),
    );
    const left = longest - checkedAgo;
    if (left <= -60) {
      tone = "warning";
      title = T("Some servers are taking longer than expected");
      body = T(
        "This is normal, and can happen if your nameservers changed recently or when a server keeps its copy for longer than its TTL. Most catch up within a few hours, and nameserver changes can take up to 48 hours.",
      );
    } else if (left > 0) {
      const [before, after] = T(
        "Servers that aren't live yet should all catch up when their cached copy expires, within {about}.",
      ).split("{about}");
      title = (
        <>
          {before}
          <strong className="font-semibold">
            {T("about {duration}", { duration: formatDuration(left) })}
          </strong>
          {after}
        </>
      );
    } else {
      title = T(
        "Servers that aren't live yet should catch up any moment now, as their cached copy has expired.",
      );
    }
  } else if (current?.dynamic) {
    title = T(
      "{domain} gives different answers depending on where and when it's asked",
      { domain },
    );
    body = T(
      "Large sites and CDNs send each visitor to a nearby server, so their {type} records vary by location. Any server that returns {type} records for {domain} is counted as live.",
      { type, domain },
    );
  }

  if (!title) return null;
  const tones = {
    danger: "border-[#e73a47]/30 bg-error-soft",
    warning: "border-[#e69800]/40 bg-warning-soft",
    neutral: "border-black/10 bg-ink-50",
    success: "border-[#009e5b]/30 bg-success-soft",
  };
  return (
    <div
      className={cn(
        "mt-6 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between",
        tones[tone],
      )}
    >
      <div className="text-[14px] leading-5">
        <p className="text-[15px] leading-[22px] text-[#18181a]">{title}</p>
        {body && <p className="mt-1 text-black/75">{body}</p>}
      </div>
      {action}
    </div>
  );
}

function StripButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 shrink-0 rounded-xl border border-black/15 bg-white px-4 text-[14px] font-semibold text-[#18181a] hover:bg-ink-50"
    >
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
      title: T("We couldn't find {domain}", { domain }),
      body: T(
        "Check the spelling. If it's right, the domain may not be registered yet, so it could be available. Just registered it? Give it a few minutes to show up.",
      ),
      cta: true,
    },
    notRegistered: {
      title: T("{domain} isn't registered", { domain }),
      body: T(
        "No owner, no records, just potential. Check its availability and make it yours.",
      ),
      cta: true,
    },
    noNameservers: {
      title: T("{domain}'s nameservers aren't answering", { domain }),
      body: T(
        "Its nameservers are missing or not responding, so we can't tell what its current records are, and visitors can't reach it. Check the nameservers where you registered the domain. If you just changed them, it can take up to 24 hours.",
      ),
      cta: false,
    },
    completed: { title: "", body: "", cta: false },
  }[state];
  return (
    <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-black/10 bg-ink-50 p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[18px] leading-[26px] font-semibold text-[#18181a]">
          {copy.title}
        </p>
        <p className="mt-1 max-w-[720px] text-[14px] leading-5 text-black/75">
          {copy.body}
        </p>
      </div>
      {copy.cta && (
        <Link
          href={`${lh("/domain-name-results")}?domain=${encodeURIComponent(state === "notRegistered" ? registrable : domain)}`}
          className="inline-flex h-12 shrink-0 items-center rounded-xl bg-primary px-6 text-[16px] font-semibold text-white hover:bg-primary-hover"
        >
          {T("Check availability")}
        </Link>
      )}
    </div>
  );
}

/* ── Your current records (its own card, below the results) ─────────────── */

function CurrentRecords({ result }: { result: CheckResult }) {
  const current = result.current!;
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const list = current.records.filter((r) =>
    r.value.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const visible = all ? list : list.slice(0, 5);
  const label = current.cname ? "CNAME" : result.type;
  const n = current.records.length;
  const ttl = n ? Math.min(...current.records.map((r) => r.ttl)) : null;
  const from = current.nameservers.length
    ? current.nameservers.join(", ")
    : current.source;

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
    <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 md:p-8">
      <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.1px] text-[#18181a] md:text-[24px] md:leading-8 md:tracking-[-0.12px]">
        {T("Your current records")}
      </h2>
      <p className="mt-1 text-[16px] leading-6 text-black/75">
        {current.cname
          ? T(
              "{domain} is a CNAME to {target}, so a server is live when it follows it there.",
              {
                domain: result.domain,
                target: current.cname,
              },
            )
          : T(
              "What {domain}'s nameservers return right now. A server is live when it returns exactly these.",
              { domain: result.domain },
            )}
      </p>

      {n === 0 ? (
        <p className="mt-4 text-[16px] text-black/60">
          {T("{domain}'s nameservers return no {type} records.", {
            domain: result.domain,
            type: result.type,
          })}
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] leading-5 text-black/75">
              <strong className="font-semibold text-[#18181a]">
                {n === 1
                  ? T("1 {type} record", { type: label })
                  : T("{n} {type} records", { n, type: label })}
              </strong>
              {from && <> · {T("from {servers}", { servers: from })}</>}
              {ttl !== null && <> · TTL {formatTtl(ttl)}</>}
            </p>
            <button
              type="button"
              onClick={() =>
                copy(current.records.map((r) => r.value).join("\n"), "all")
              }
              className="flex h-9 items-center gap-1.5 rounded-xl border border-black/15 px-3 text-[14px] font-semibold text-[#18181a] hover:bg-ink-50"
            >
              <CopyIcon className="size-4" />
              {T(copied === "all" ? "Copied" : "Copy all")}
            </button>
          </div>
          {n > 5 && (
            <input
              type="search"
              aria-label={T("Filter records")}
              placeholder={T("Filter records, e.g. google")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mt-4 h-10 w-full rounded-xl border border-black/15 px-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary md:max-w-[320px]"
            />
          )}
          <ul className="mt-4 flex flex-col gap-2">
            {visible.map((r) => (
              <li
                key={r.value}
                className="flex items-center justify-between gap-3 rounded-xl bg-[#f4f4f6] px-4 py-3"
              >
                <span className="min-w-0 text-[14px] leading-5 [overflow-wrap:anywhere] text-[#18181a]">
                  {r.value}
                </span>
                <button
                  type="button"
                  aria-label={T("Copy {type} record", { type: label })}
                  onClick={() => copy(r.value, r.value)}
                  className="shrink-0 text-[#36344d] hover:text-[#18181a]"
                >
                  {copied === r.value ? (
                    <CheckIcon className="size-4 text-success" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </button>
              </li>
            ))}
            {list.length === 0 && (
              <li className="px-4 py-3 text-[14px] text-black/60">
                {T("No records match “{q}”.", { q })}
              </li>
            )}
          </ul>
          {list.length > 5 && (
            <button
              type="button"
              onClick={() => setAll(!all)}
              className="mt-3 text-[14px] font-semibold text-primary hover:underline"
            >
              {all ? T("Show fewer") : T("Show all {n} records", { n: list.length })}
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
    <li className="flex items-center gap-2">
      <span
        aria-hidden
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </li>
  );
}

const icon = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...icon}>
      <circle cx="10" cy="10" r="8" />
      <path d="M10 9v5M10 6.2v.1" />
    </svg>
  );
}
function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...icon}>
      <path d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6M16.5 3.5v3.5H13" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...icon}>
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  );
}
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <circle cx="10" cy="10" r="8" fill="currentColor" />
      <path
        d="m6.5 10.2 2.3 2.3 4.7-5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...icon}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6v4.2l2.6 1.6" />
    </svg>
  );
}
function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <circle cx="10" cy="10" r="8" fill="currentColor" />
      <path
        d="M10 6v4.5M10 13.5v.1"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...icon}>
      <rect x="7" y="7" width="9" height="10" rx="1.5" />
      <path d="M4 13V4.5A1.5 1.5 0 0 1 5.5 3H12" />
    </svg>
  );
}
function SortIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...icon}>
      <path d="M7 4v12M4 13l3 3 3-3M13 16V4M10 7l3-3 3 3" />
    </svg>
  );
}
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...icon}>
      <path d="M10 16V4M6 8l4-4 4 4" />
    </svg>
  );
}
function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...icon}>
      <path d="M10 18s-5.5-5.2-5.5-9.5a5.5 5.5 0 0 1 11 0C15.5 12.8 10 18 10 18Z" />
      <circle cx="10" cy="8.5" r="2" />
    </svg>
  );
}

function Spinner({ className, label }: { className?: string; label: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("animate-spin", className)}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
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

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
