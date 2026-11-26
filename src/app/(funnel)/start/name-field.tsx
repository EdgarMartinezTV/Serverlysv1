"use client";

import { useId, useRef, useState } from "react";
import { billing } from "@/data/company";
import { canAddInPlace } from "@/lib/domains/cart";
import type { CheckOutcome, DomainResult } from "@/lib/domains/types";

/**
 * /start's one action: business name → domain → Starter Cloud (12 months,
 * WHMCS pid 1, free first-year domain) in the cart.
 *
 *   1. The visitor types a business name ("Fresh Bakery") or a domain.
 *   2. We check it with /api/domains/check (WHMCS lookup, ResellerClub).
 *   3. AVAILABLE → "Continue": Starter Cloud + the domain go into the cart
 *      in one step and the visitor lands on checkout (see addPlanWithDomain).
 *      TAKEN → available alternatives (same as above), plus "It's mine":
 *      use it where it is (owndomain) or transfer it (transfer) — both also
 *      go straight into the cart with the plan, then checkout.
 *
 * Off the billing origin (localhost) an in-place add is impossible, so every
 * choice falls back to the order page with the name filled in on the right tab.
 */
const PID = 1;
const CHECKOUT_URL = `${billing.root}/cart.php?a=checkout`;
/**
 * A transfer needs the EPP/auth code from the current registrar. Sending it to
 * checkout made WHMCS bounce back here with a red "You must enter the EPP
 * code" error (verified live 2026-11-26); landing here first asks for it plainly.
 */
const TRANSFER_URL = `${billing.root}/cart.php?a=confdomains`;

type Option = "register" | "transfer" | "owndomain";

/**
 * Verified live 2026-11-25 (and the carts emptied again):
 *   register .com → Starter Cloud $83.40 + domain $0.00 → $52.54 due today
 *   register .io  → Starter Cloud $83.40 + domain $80.95 (charged)
 *   transfer      → Starter Cloud + "Domain Transfer" line
 *   owndomain     → Starter Cloud with the domain on the hosting line
 * The CSRF token is the visitor's own WHMCS session token, read from their
 * cart page — this only works same-origin, which is why canAddInPlace() gates it.
 */
async function addPlanWithDomain(option: Option, r: DomainResult): Promise<boolean> {
  try {
    if (option === "owndomain") {
      const res = await fetch(cartUrl("owndomain", r), { credentials: "include", cache: "no-store" });
      return res.ok && (await res.text()).includes(r.domain);
    }
    const view = await fetch(`${billing.root}/cart.php?a=view`, { credentials: "include", cache: "no-store" });
    const token = /name="token" value="([^"]+)"/.exec(await view.text())?.[1];
    if (!token) return false;
    const body = new URLSearchParams({ token, domainoption: option });
    body.append("domains[]", r.domain);
    body.append(`domainsregperiod[${r.domain}]`, "1");
    const res = await fetch(
      `${billing.root}/cart.php?a=add&pid=${PID}&domainselect=1&billingcycle=annually&skipconfig=1`,
      { method: "POST", credentials: "include", body },
    );
    return res.ok && (await res.text()).includes(r.domain);
  } catch {
    return false;
  }
}
/** WHMCS freedomaintlds on annual+ plans (verified with a cart: domain $0). */
const FREE_TLDS = new Set([".com", ".net", ".org", ".biz", ".info"]);

/** "Fresh Bakery & Co." → "freshbakeryandco"; "https://www.Bakery.net/x" → "bakery.net". */
function toQuery(raw: string): string {
  let v = raw.trim().toLowerCase();
  v = v.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
  v = v.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  v = v.replace(/&/g, "and").replace(/['’]/g, "");
  // A domain keeps its dots; a business name loses its spaces and punctuation.
  const looksLikeDomain = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v.replace(/\s+/g, ""));
  if (looksLikeDomain) return v.replace(/\s+/g, "");
  return v.replace(/[^a-z0-9-]+/g, "").replace(/^-+|-+$/g, "").slice(0, 63);
}

function cartUrl(option: Option, r: { sld: string; tld: string }) {
  const p = new URLSearchParams({
    a: "add",
    pid: String(PID),
    billingcycle: "annually",
    domainoption: option,
    sld: r.sld,
    tld: r.tld,
  });
  if (option === "owndomain") p.set("skipconfig", "1");
  return `${billing.root}/cart.php?${p}`;
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

export function NameField({ id, variant }: { id: string; variant: "dark" | "light" }) {
  const dark = variant === "dark";
  const [state, setState] = useState<State>({ step: "idle" });
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

  /** Available name → into the cart, then the plan page with it linked. */
  /**
   * Plan + domain into the cart, then checkout. On serverlys.com this is the
   * same POST the WHMCS order page sends (frmProductDomainSelections), so the
   * domain is attached to the plan and priced by WHMCS: free first year on
   * the free-domain TLDs, the TLD's price otherwise. If anything about it
   * fails — or we are off the billing origin — the visitor lands on the
   * order page with the name filled in instead, which still completes.
   */
  async function addAndCheckout(option: Option, r: DomainResult) {
    setGoing(`${option}:${r.domain}`);
    if (canAddInPlace() && (await addPlanWithDomain(option, r))) {
      // WHMCS checkout, served by the front-door proxy — not a Next.js route.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(option === "transfer" ? TRANSFER_URL : CHECKOUT_URL);
      return;
    }
    window.location.assign(cartUrl(option, r));
  }

  const busy = state.step === "checking";
  const sub = dark ? "text-white/70" : "text-white/80";
  const panel = dark ? "bg-white/[0.08] text-white" : "bg-white text-black";
  const muted = dark ? "text-white/65" : "text-black/60";
  const primaryBtn = dark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85";
  const ghostBtn = dark ? "border border-white/30 text-white hover:bg-white/10" : "border border-black/20 text-black hover:bg-black/5";

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
          <p className={`mt-3 px-4 text-[13px] ${sub}`}>Checking {state.query.includes(".") ? state.query : `${state.query}.com`}…</p>
        )}

        {state.step === "error" && <p className={`mt-3 px-4 text-[13px] ${sub}`}>{state.message}</p>}

        {state.step === "result" && (
          <div className={`mt-3 rounded-[24px] p-4 ${panel}`}>
            {state.primary.status === "available" ? (
              <>
                <p className="flex items-center gap-2 text-[15px] font-semibold">
                  <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-[11px] text-white">✓</span>
                  {state.primary.domain} is available
                </p>
                <p className={`mt-1 pl-7 text-[13px] ${muted}`}>
                  {FREE_TLDS.has(state.primary.tld)
                    ? "Free for the first year with your plan."
                    : `${fmt(state.primary.price)} for the first year, added to your plan.`}
                </p>
                <button
                  type="button"
                  onClick={() => addAndCheckout("register", state.primary)}
                  disabled={going !== null}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition-colors ${primaryBtn}`}
                >
                  {going === `register:${state.primary.domain}` ? <Spinner /> : null}
                  Continue with {state.primary.domain} <Arrow className="size-4" />
                </button>
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
                            onClick={() => addAndCheckout("register", r)}
                            disabled={going !== null}
                            className={`flex w-full items-center justify-between gap-3 rounded-full px-4 py-2.5 text-left text-[14px] transition-colors ${ghostBtn}`}
                          >
                            <span className="font-semibold">{r.domain}</span>
                            <span className={`flex items-center gap-2 text-[12px] ${muted}`}>
                              {FREE_TLDS.has(r.tld) ? "Free 1st year" : `${fmt(r.price)}/yr`}
                              {going === `register:${r.domain}` ? <Spinner /> : <Arrow className="size-4" />}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <OwnedChoice result={state.primary} going={going} onGo={addAndCheckout} muted={muted} primaryBtn={primaryBtn} ghostBtn={ghostBtn} lead={`Is ${state.primary.domain} yours?`} />
              </>
            ) : (
              <>
                <p className="text-[15px] font-semibold">We could not confirm {state.primary.domain} right now.</p>
                <p className={`mt-1 text-[13px] ${muted}`}>Continue and we will check it again on the next step.</p>
                <button
                  type="button"
                  onClick={() => {
                    setGoing(state.primary.domain);
                    window.location.assign(cartUrl("register", state.primary));
                  }}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold ${primaryBtn}`}
                >
                  Continue <Arrow className="size-4" />
                </button>
              </>
            )}

            {state.primary.status === "available" && (
              <p className={`mt-3 text-center text-[12px] ${muted}`}>
                Already own a domain? Type it above to use it or transfer it.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OwnedChoice({
  result,
  going,
  onGo,
  muted,
  primaryBtn,
  ghostBtn,
  lead,
}: {
  result: DomainResult;
  going: string | null;
  onGo: (option: Option, r: DomainResult) => void;
  muted: string;
  primaryBtn: string;
  ghostBtn: string;
  lead: string;
}) {
  return (
    <div className="mt-4 text-left">
      <p className={`text-[13px] ${muted}`}>{lead}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onGo("owndomain", result)}
          disabled={going !== null}
          className={`rounded-2xl px-4 py-2.5 text-left text-[14px] font-semibold transition-colors ${primaryBtn}`}
        >
          Use {result.domain}
          <span className="block text-[11px] font-normal opacity-70">Keep it where it is, point it here</span>
        </button>
        <button
          type="button"
          onClick={() => onGo("transfer", result)}
          disabled={going !== null}
          className={`rounded-2xl px-4 py-2.5 text-left text-[14px] font-semibold transition-colors ${ghostBtn}`}
        >
          Transfer it to Serverlys
          <span className="block text-[11px] font-normal opacity-70">Manage domain and site in one place</span>
        </button>
      </div>
    </div>
  );
}
