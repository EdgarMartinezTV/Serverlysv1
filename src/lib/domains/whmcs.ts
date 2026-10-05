import { priceFor } from "@/data/tlds";
import { parseDomainInput } from "./normalize";
import { rdapProvider } from "./rdap";
import { whmcsConfig } from "@/lib/env";
import type { DomainProvider, DomainResult } from "./types";

/**
 * WHMCS availability provider — the PRODUCTION authority.
 *
 * It asks WHMCS the way the WHMCS cart itself does: POST
 * `index.php?rp=/domain/check` inside a cart session. That endpoint answers
 * through the install's Domain Lookup Provider (the registrar), so a result
 * here is exactly what the customer will see at checkout, with the price and
 * the premium flag WHMCS will charge.
 *
 * WHY NOT THE API'S `DomainWhois`. It was wired first and verified live on
 * 2026-10-05: it reads raw WHOIS through WHMCS's whois server table, which is
 * wrong for some of the TLDs we sell. `.info` hits a server that replies "TLD
 * is not supported" and `.website` replies "is available for registration" in
 * wording WHMCS does not match; both came back "unavailable" for a name the
 * registry and the cart agree is free. The cart endpoint got all eight right.
 *
 * ┌─ CONFIGURATION ──────────────────────────────────────────────────────────┐
 * │ WHMCS_API_URL         its origin locates the install: the cart base is   │
 * │                       this URL minus `/includes/api.php`. In production │
 * │                       it is the INTERNAL proxy address,                  │
 * │                       http://webhosting_billing-proxy/billing/...        │
 * │ WHMCS_API_IDENTIFIER  } kept for API actions; the cart check needs no    │
 * │ WHMCS_API_SECRET      } credentials, only a session and its CSRF token.  │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * The response shape is an internal contract of the WHMCS cart, not a
 * versioned API, so anything unrecognised falls back to RDAP for that name
 * (whose results link to the WHMCS search, never straight into the cart)
 * rather than guessing. Re-verify after a WHMCS upgrade.
 */

type CartSession = { cookie: string; token: string; expiresAt: number };

/** Well inside PHP's default 24-minute session lifetime. */
const SESSION_TTL_MS = 10 * 60_000;

let session: Promise<CartSession> | null = null;

function cartBase(apiUrl: string) {
  return apiUrl.replace(/\/includes\/api\.php$/, "");
}

async function openSession(base: string, signal: AbortSignal): Promise<CartSession> {
  const res = await fetch(`${base}/cart.php?a=add&domain=register`, {
    redirect: "manual",
    cache: "no-store",
    signal,
  });
  const html = await res.text();
  const cookie = res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  const token = /name="token" value="([a-f0-9]+)"/.exec(html)?.[1];
  if (!res.ok || !cookie || !token) throw new Error("Could not open a WHMCS cart session.");
  return { cookie, token, expiresAt: Date.now() + SESSION_TTL_MS };
}

/** One shared session; concurrent callers wait on the same open. */
async function getSession(base: string, signal: AbortSignal, fresh = false) {
  if (!fresh && session) {
    const current = await session.catch(() => null);
    if (current && current.expiresAt > Date.now()) return current;
  }
  const opening = openSession(base, signal);
  session = opening;
  opening.catch(() => {
    if (session === opening) session = null;
  });
  return opening;
}

type CartResult = {
  domainName?: string;
  isAvailable?: boolean;
  isRegistered?: boolean;
  isValidDomain?: boolean;
  isPremium?: boolean;
  pricing?: Record<string, { register?: string }>;
};

async function lookup(
  base: string,
  domain: string,
  signal: AbortSignal,
): Promise<CartResult[] | null> {
  for (const fresh of [false, true]) {
    const { cookie, token } = await getSession(base, signal, fresh);
    const res = await fetch(`${base}/index.php?rp=/domain/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        Cookie: cookie,
      },
      body: new URLSearchParams({ token, a: "checkDomain", domain, type: "domain" }),
      cache: "no-store",
      signal,
    });
    // An expired session or token comes back as an empty body, not an error
    // status: retry once on a fresh session before giving up.
    const text = await res.text();
    try {
      const data = JSON.parse(text) as { result?: unknown };
      if (Array.isArray(data.result)) return data.result as CartResult[];
    } catch {}
  }
  return null;
}

/** "$14.95 USD" → 14.95 */
function parsePrice(value: string | undefined): number | null {
  const n = Number.parseFloat((value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

async function checkOne(
  domain: string,
  signal: AbortSignal,
  base: string,
): Promise<DomainResult> {
  const parsed = parseDomainInput(domain);
  const tld = parsed.ok && parsed.tld ? parsed.tld : "";
  const row: Omit<DomainResult, "status"> = {
    domain,
    sld: parsed.ok ? parsed.sld : domain,
    tld,
    price: priceFor(tld),
    source: "whmcs",
  };

  let results: CartResult[] | null;
  try {
    results = await lookup(base, domain, signal);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    results = null;
  }
  if (!results) {
    // WHMCS did not answer: a registry answer beats a dead end, and RDAP rows
    // route Register through the WHMCS search, which checks again.
    const [fallback] = await rdapProvider.check([domain], signal);
    return fallback;
  }

  // For a TLD the install does not sell, WHMCS silently answers for the same
  // name on its default TLD instead. Only an exact match is an answer.
  const hit = results.find((r) => r.domainName?.toLowerCase() === domain);
  if (!hit || hit.isValidDomain === false) {
    return { ...row, price: null, status: "unsupported" };
  }

  const price = parsePrice(hit.pricing?.["1"]?.register) ?? row.price;
  if (hit.isPremium) {
    return {
      ...row,
      price,
      status: "unknown",
      reason: "Premium name: the registry sets its price. Search it in the cart to see it.",
    };
  }
  if (hit.isAvailable === true) return { ...row, price, status: "available" };
  if (hit.isRegistered === true || hit.isAvailable === false) {
    return { ...row, price, status: "registered" };
  }
  return {
    ...row,
    status: "unknown",
    reason: "The billing system did not return a definite answer.",
  };
}

export function createWhmcsProvider(): DomainProvider | null {
  const config = whmcsConfig();
  if (!config) return null;
  const base = cartBase(config.url);
  return {
    name: "whmcs",
    async check(domains, signal) {
      return Promise.all(domains.map((d) => checkOne(d, signal, base)));
    },
  };
}
