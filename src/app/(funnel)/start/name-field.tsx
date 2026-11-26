"use client";

import { useId, useRef, useState } from "react";
import { billing } from "@/data/company";
import { canAddInPlace } from "@/lib/domains/cart";
import type { CheckOutcome, DomainResult } from "@/lib/domains/types";

/**
 * /start's one action: business name → domain → plan (or no plan) → cart.
 *
 *   1. The visitor types a business name ("Fresh Bakery") or a domain.
 *   2. We check it with /api/domains/check (WHMCS lookup, ResellerClub).
 *   3. They pick the domain: the available name, an available alternative,
 *      or — when it is taken — "use it where it is" or "transfer it".
 *   4. They pick a Cloud plan (12 months) or "just the domain, no hosting".
 *   5. Plan + domain go into the WHMCS cart in ONE same-origin request and
 *      the visitor lands on checkout (a transfer lands on the domain step,
 *      which asks for the EPP code).
 *
 * Off the billing origin (localhost) an in-place add is impossible, so every
 * choice falls back to a plain navigation that still ends in the cart or on
 * the plan's order page with the name filled in.
 */

export type PlanOption = {
  /** WHMCS product id. Cloud: starter 1, plus 4, turbo 2, business 5 (verified live 2026-11-26). */
  pid: number;
  name: string;
  sites: string;
  /** 12-month price per month, after the sale when one is running. */
  perMonth: number;
  /** Charged today for the plan (12-month term, setup fee included). */
  today: number;
  /** What the 12-month term renews at. */
  renew: number;
  popular?: boolean;
};

type Option = "register" | "transfer" | "owndomain";
type Pick = { option: Option; domain: DomainResult };

const CHECKOUT_URL = `${billing.root}/cart.php?a=checkout`;
/**
 * A transfer needs the EPP/auth code from the current registrar. Sending it to
 * checkout made WHMCS bounce back here with a red "You must enter the EPP
 * code" error (verified live 2026-11-26); landing here first asks for it plainly.
 */
const DOMAIN_STEP_URL = `${billing.root}/cart.php?a=confdomains`;
/** WHMCS freedomaintlds on annual+ plans (verified with a cart: domain $0). */
const FREE_TLDS = new Set([".com", ".net", ".org", ".biz", ".info"]);

/** "Fresh Bakery & Co." → "freshbakeryandco"; "https://www.Bakery.net/x" → "bakery.net". */
function toQuery(raw: string): string {
  let v = raw.trim().toLowerCase();
  v = v.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
  v = v.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  v = v.replace(/&/g, "and").replace(/['’]/g, "");
  // A domain keeps its dots; a business name loses its spaces and punctuation.
  const compact = v.replace(/\s+/g, "");
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(compact)) return compact;
  return v.replace(/[^a-z0-9-]+/g, "").replace(/^-+|-+$/g, "").slice(0, 63);
}

/** Plan + domain, as a GET. Lands in the cart (owndomain) or on the plan's order page, name filled in. */
function planUrl(pid: number, p: Pick) {
  const q = new URLSearchParams({
    a: "add",
    pid: String(pid),
    billingcycle: "annually",
    domainoption: p.option,
    sld: p.domain.sld,
    tld: p.domain.tld,
  });
  if (p.option === "owndomain") q.set("skipconfig", "1");
  return `${billing.root}/cart.php?${q}`;
}

/** Domain only, as a GET. Verified live 2026-11-26: adds it and lands on the domain step. */
function domainOnlyUrl(p: Pick) {
  const d = p.domain.domain;
  return `${billing.root}/cart.php?a=add&domain=${p.option}&domains[]=${encodeURIComponent(d)}&domainsregperiod[${encodeURIComponent(d)}]=1`;
}

/**
 * Plan + domain into the cart in one step — the same POST the WHMCS order
 * page sends (frmProductDomainSelections), with the visitor's own session
 * token read from their cart page. WHMCS prices the domain. Verified live:
 *   register .com → plan + domain $0.00 (free year 1)
 *   register .io  → plan + domain $80.95 (charged)
 *   transfer      → plan + "Domain Transfer" line
 *   owndomain     → plan with the domain on the hosting line
 */
async function addPlan(pid: number, p: Pick): Promise<boolean> {
  const d = p.domain.domain;
  try {
    if (p.option === "owndomain") {
      const res = await fetch(planUrl(pid, p), { credentials: "include", cache: "no-store" });
      return res.ok && (await res.text()).includes(d);
    }
    const view = await fetch(`${billing.root}/cart.php?a=view`, { credentials: "include", cache: "no-store" });
    const token = /name="token" value="([^"]+)"/.exec(await view.text())?.[1];
    if (!token) return false;
    const body = new URLSearchParams({ token, domainoption: p.option });
    body.append("domains[]", d);
    body.append(`domainsregperiod[${d}]`, "1");
    const res = await fetch(
      `${billing.root}/cart.php?a=add&pid=${pid}&domainselect=1&billingcycle=annually&skipconfig=1`,
      { method: "POST", credentials: "include", body },
    );
    return res.ok && (await res.text()).includes(d);
  } catch {
    return false;
  }
}

async function addDomainOnly(p: Pick): Promise<boolean> {
  try {
    const res = await fetch(domainOnlyUrl(p), { credentials: "include", cache: "no-store" });
    return res.ok && (await res.text()).includes(p.domain.domain);
  } catch {
    return false;
  }
}

/** WHMCS pages are served by the front-door proxy — never a Next.js route. */
function leave(url: string) {
  window.location.assign(url);
}

type State =
  | { step: "idle" }
  | { step: "checking"; query: string }
  | { step: "result"; primary: DomainResult; alternates: DomainResult[] }
  | { step: "error"; message: string };

function Arrow({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} fill="none">
      <path d="M4 10h11m-4-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 animate-spin" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const fmt = (n: number | null | undefined) => (typeof n === "number" ? `$${n.toFixed(2)}` : "");

export function NameField({
  id,
  variant,
  plans,
}: {
  id: string;
  variant: "dark" | "light";
  plans: readonly PlanOption[];
}) {
  const dark = variant === "dark";
  const [state, setState] = useState<State>({ step: "idle" });
  const [pick, setPick] = useState<Pick | null>(null);
  const [going, setGoing] = useState<string | null>(null);
  const seq = useRef(0);
  const statusId = useId();

  async function check(raw: string) {
    const query = toQuery(raw);
    if (query.length < 2) {
      setState({ step: "error", message: "Type your business name, like “Fresh Bakery”." });
      return;
    }
    const n = ++seq.current;
    setPick(null);
    setState({ step: "checking", query });
    try {
      const res = await fetch("/api/domains/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = (await res.json()) as CheckOutcome;
      if (n !== seq.current) return;
      if (!data.ok) {
        setState({ step: "error", message: data.error.message });
        return;
      }
      const [primary, ...rest] = data.results;
      if (!primary) {
        setState({ step: "error", message: "We could not check that name. Try again." });
        return;
      }
      const alternates = rest
        .filter((r) => r.status === "available")
        .sort((a, b) => Number(FREE_TLDS.has(b.tld)) - Number(FREE_TLDS.has(a.tld)))
        .slice(0, 3);
      setState({ step: "result", primary, alternates });
    } catch {
      if (n === seq.current) setState({ step: "error", message: "We could not check that name. Try again." });
    }
  }

  async function choosePlan(plan: PlanOption, p: Pick) {
    setGoing(`plan:${plan.pid}`);
    if (canAddInPlace() && (await addPlan(plan.pid, p))) {
      leave(p.option === "transfer" ? DOMAIN_STEP_URL : CHECKOUT_URL);
      return;
    }
    leave(planUrl(plan.pid, p));
  }

  async function chooseDomainOnly(p: Pick) {
    setGoing("domain-only");
    if (canAddInPlace() && (await addDomainOnly(p))) {
      leave(p.option === "transfer" ? DOMAIN_STEP_URL : CHECKOUT_URL);
      return;
    }
    leave(domainOnlyUrl(p));
  }

  const busy = state.step === "checking";
  const sub = dark ? "text-white/70" : "text-white/80";
  const panel = dark ? "bg-white/[0.08] text-white" : "bg-white text-black";
  const muted = dark ? "text-white/65" : "text-black/60";
  const primaryBtn = dark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85";
  const ghostBtn = dark ? "border border-white/30 text-white hover:bg-white/10" : "border border-black/20 text-black hover:bg-black/5";
  const disabled = going !== null;

  return (
    <div className="w-full">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem("business") as HTMLInputElement;
          void check(input.value);
        }}
      >
        <label htmlFor={id} className="sr-only">
          Your business name or domain
        </label>
        <div
          className={`flex items-center rounded-full p-1.5 pl-5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white ${
            dark ? "border border-white/25 bg-black" : "bg-white"
          }`}
        >
          <input
            id={id}
            name="business"
            type="text"
            autoComplete="organization"
            autoCapitalize="words"
            spellCheck={false}
            aria-describedby={statusId}
            placeholder="Enter your business name"
            className={`min-w-0 flex-1 bg-transparent py-2.5 text-[17px] focus:outline-none ${
              dark ? "text-white placeholder:text-white/70" : "text-black placeholder:text-black/55"
            }`}
          />
          <button
            type="submit"
            aria-label="Check availability"
            disabled={busy}
            className={`grid size-11 shrink-0 place-items-center rounded-full transition-transform hover:scale-105 disabled:hover:scale-100 ${
              dark ? "text-white" : "bg-black text-white"
            }`}
          >
            {busy ? <Spinner /> : <Arrow />}
          </button>
        </div>
      </form>

      <div id={statusId} aria-live="polite" className="text-left">
        {state.step === "checking" && (
          <p className={`mt-3 px-4 text-[13px] ${sub}`}>
            Checking {state.query.includes(".") ? state.query : `${state.query}.com`}…
          </p>
        )}

        {state.step === "error" && <p className={`mt-3 px-4 text-[13px] ${sub}`}>{state.message}</p>}

        {/* Step 2 — pick a plan (or none) for the chosen domain. */}
        {state.step === "result" && pick && (
          <div className={`mt-3 rounded-[24px] p-4 ${panel}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold">
                  {pick.option === "register" && <>Pick a plan for {pick.domain.domain}</>}
                  {pick.option === "transfer" && <>Pick a plan — we transfer {pick.domain.domain}</>}
                  {pick.option === "owndomain" && <>Pick a plan for {pick.domain.domain}</>}
                </p>
                <p className={`mt-0.5 text-[12px] ${muted}`}>
                  {pick.option === "owndomain"
                    ? "Your domain stays where it is. 12-month plans."
                    : FREE_TLDS.has(pick.domain.tld)
                      ? "Domain free for the first year with any plan. 12-month plans."
                      : `Domain ${fmt(pick.domain.price)} for the first year, added to your order. 12-month plans.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPick(null)}
                disabled={disabled}
                className={`shrink-0 text-[12px] underline underline-offset-2 ${muted}`}
              >
                Change
              </button>
            </div>

            <ul className="mt-3 space-y-2">
              {plans.map((plan) => (
                <li key={plan.pid}>
                  <button
                    type="button"
                    onClick={() => choosePlan(plan, pick)}
                    disabled={disabled}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${
                      plan.popular ? primaryBtn : ghostBtn
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold">
                        {plan.name}
                        {plan.popular && (
                          <span className="rounded-full bg-[#0000ff] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Most popular
                          </span>
                        )}
                      </span>
                      <span className="block text-[12px] opacity-70">
                        {plan.sites} · {fmt(plan.today)} today · renews {fmt(plan.renew)}/yr
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-right">
                        <span className="block text-[17px] font-semibold leading-none">{fmt(plan.perMonth)}</span>
                        <span className="text-[11px] opacity-70">/mo</span>
                      </span>
                      {going === `plan:${plan.pid}` ? <Spinner /> : <Arrow className="size-4" />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {pick.option !== "owndomain" && (
              <button
                type="button"
                onClick={() => chooseDomainOnly(pick)}
                disabled={disabled}
                className={`mt-3 flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-left text-[13px] ${muted} hover:underline`}
              >
                <span>
                  No hosting — just {pick.option === "transfer" ? "transfer" : "register"} {pick.domain.domain}
                  {pick.option === "register" && pick.domain.price !== null ? ` (${fmt(pick.domain.price)}/yr)` : ""}
                </span>
                {going === "domain-only" ? <Spinner /> : <Arrow className="size-4" />}
              </button>
            )}
          </div>
        )}

        {/* Step 1 — the availability answer and the domain choice. */}
        {state.step === "result" && !pick && (
          <div className={`mt-3 rounded-[24px] p-4 ${panel}`}>
            {state.primary.status === "available" ? (
              <>
                <p className="flex items-center gap-2 text-[15px] font-semibold">
                  <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-[11px] text-white">✓</span>
                  {state.primary.domain} is available
                </p>
                <p className={`mt-1 pl-7 text-[13px] ${muted}`}>
                  {FREE_TLDS.has(state.primary.tld)
                    ? "Free for the first year with a hosting plan."
                    : `${fmt(state.primary.price)} for the first year.`}
                </p>
                <button
                  type="button"
                  onClick={() => setPick({ option: "register", domain: state.primary })}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition-colors ${primaryBtn}`}
                >
                  Get {state.primary.domain} <Arrow className="size-4" />
                </button>
                <p className={`mt-3 text-center text-[12px] ${muted}`}>
                  Already own a domain? Type it above to use it or transfer it.
                </p>
              </>
            ) : state.primary.status === "registered" ? (
              <>
                <p className="flex items-center gap-2 text-[15px] font-semibold">
                  <span className="grid size-5 place-items-center rounded-full bg-black/80 text-[11px] text-white ring-1 ring-white/30">✕</span>
                  {state.primary.domain} is taken
                </p>
                {state.alternates.length > 0 && (
                  <>
                    <p className={`mt-3 text-[13px] ${muted}`}>Available instead:</p>
                    <ul className="mt-2 space-y-2">
                      {state.alternates.map((r) => (
                        <li key={r.domain}>
                          <button
                            type="button"
                            onClick={() => setPick({ option: "register", domain: r })}
                            className={`flex w-full items-center justify-between gap-3 rounded-full px-4 py-2.5 text-left text-[14px] transition-colors ${ghostBtn}`}
                          >
                            <span className="font-semibold">{r.domain}</span>
                            <span className={`flex items-center gap-2 text-[12px] ${muted}`}>
                              {FREE_TLDS.has(r.tld) ? "Free 1st year" : `${fmt(r.price)}/yr`}
                              <Arrow className="size-4" />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="mt-4">
                  <p className={`text-[13px] ${muted}`}>Is {state.primary.domain} yours?</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPick({ option: "owndomain", domain: state.primary })}
                      className={`rounded-2xl px-4 py-2.5 text-left text-[14px] font-semibold transition-colors ${primaryBtn}`}
                    >
                      Use {state.primary.domain}
                      <span className="block text-[11px] font-normal opacity-70">Keep it where it is, point it here</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPick({ option: "transfer", domain: state.primary })}
                      className={`rounded-2xl px-4 py-2.5 text-left text-[14px] font-semibold transition-colors ${ghostBtn}`}
                    >
                      Transfer it to Serverlys
                      <span className="block text-[11px] font-normal opacity-70">Manage domain and site in one place</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-[15px] font-semibold">We could not confirm {state.primary.domain} right now.</p>
                <p className={`mt-1 text-[13px] ${muted}`}>Pick a plan and we will check it again on the next step.</p>
                <button
                  type="button"
                  onClick={() => setPick({ option: "register", domain: state.primary })}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold ${primaryBtn}`}
                >
                  Continue <Arrow className="size-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
