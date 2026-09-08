import { priceFor } from "@/data/tlds";
import { parseDomainInput } from "./normalize";
import { whmcsConfig } from "@/lib/env";
import type { DomainProvider, DomainResult } from "./types";

/**
 * WHMCS availability provider — the intended PRODUCTION authority.
 *
 * WHMCS is the only source that knows what Serverlys will actually sell and at
 * what price: premium/aftermarket names, registry reservations, promotions and
 * TLD availability all live there. RDAP cannot see any of it.
 *
 * ┌─ REQUIRED CONFIGURATION ────────────────────────────────────────────────┐
 * │ WHMCS_API_URL         e.g. https://serverlys.com/billing/includes/api.php│
 * │ WHMCS_API_IDENTIFIER  API credential identifier (WHMCS admin → API)      │
 * │ WHMCS_API_SECRET      API credential secret                              │
 * │ DOMAIN_PROVIDER       optional: force "whmcs" | "rdap" | "none"          │
 * │                                                                          │
 * │ The API credential needs the `DomainWhois` permission and the deploying  │
 * │ server's IP must be on the WHMCS API allow-list.                         │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * ⚠ STATUS: written against the documented WHMCS `DomainWhois` action but NEVER
 * executed against a live instance — no credentials exist in this environment.
 * Treat the response mapping below as unverified until it has been run once
 * against staging. It is deliberately conservative: anything it does not
 * recognise becomes "unknown", never "available".
 */
async function checkOne(
  domain: string,
  signal: AbortSignal,
  config: NonNullable<ReturnType<typeof whmcsConfig>>,
): Promise<DomainResult> {
  const parsed = parseDomainInput(domain);
  const tld = parsed.ok && parsed.tld ? parsed.tld : "";
  const base: Omit<DomainResult, "status"> = {
    domain,
    sld: parsed.ok ? parsed.sld : domain,
    tld,
    price: priceFor(tld),
    source: "whmcs",
  };

  try {
    const body = new URLSearchParams({
      identifier: config.identifier,
      secret: config.secret,
      action: "DomainWhois",
      domain,
      responsetype: "json",
    });

    const res = await fetch(config.url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal,
      cache: "no-store",
    });

    if (!res.ok)
      return {
        ...base,
        status: "unknown",
        reason: `Billing API returned ${res.status}.`,
      };

    const data: unknown = await res.json();
    const status =
      typeof data === "object" && data !== null && "status" in data
        ? String((data as { status: unknown }).status).toLowerCase()
        : "";

    if (status === "available") return { ...base, status: "available" };
    if (status === "unavailable") return { ...base, status: "registered" };
    return {
      ...base,
      status: "unknown",
      reason: "The billing system did not return a definite answer.",
    };
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return {
      ...base,
      status: "unknown",
      reason: aborted
        ? "The billing system did not respond in time."
        : "Could not reach the billing system.",
    };
  }
}

export function createWhmcsProvider(): DomainProvider | null {
  const config = whmcsConfig();
  if (!config) return null;
  return {
    name: "whmcs",
    async check(domains, signal) {
      return Promise.all(domains.map((d) => checkOne(d, signal, config)));
    },
  };
}
