import { priceFor } from "@/data/tlds";
import { parseDomainInput } from "./normalize";
import type { DomainProvider, DomainResult } from "./types";

/**
 * RDAP availability provider.
 *
 * RDAP (RFC 7482) is the IETF successor to WHOIS. `rdap.org` bootstraps to the
 * authoritative registry server for each TLD. It needs no credentials, so this
 * returns REAL registration status rather than a fabricated stand-in.
 *
 *   404 → the registry has no record → registrable
 *   200 → a record exists → registered
 *
 * HONEST LIMITS, surfaced in the UI:
 *  · RDAP answers "is it registered", not "will Serverlys sell it to you".
 *    Premium/aftermarket pricing and registry reservations are invisible here —
 *    WHMCS knows those, RDAP does not.
 *  · Some registries rate-limit or omit RDAP. Those resolve to "unknown", never
 *    to a guess.
 */

const RDAP_BASE = "https://rdap.org/domain/";
/**
 * Registries reject requests with no User-Agent — Verisign's RDAP returns 403.
 * Identifying the client is also the correct etiquette for shared public
 * infrastructure, and gives operators someone to contact about our traffic.
 */
const USER_AGENT = "Serverlys-DomainSearch/1.0 (+https://serverlys.com)";
const PER_REQUEST_TIMEOUT_MS = 6000;
/** Politeness cap — public infrastructure, shared across all our users. */
const CONCURRENCY = 6;

async function checkOne(domain: string, signal: AbortSignal): Promise<DomainResult> {
  const parsed = parseDomainInput(domain);
  const sld = parsed.ok ? parsed.sld : domain;
  const tld = parsed.ok && parsed.tld ? parsed.tld : "";
  const base: Omit<DomainResult, "status"> = {
    domain,
    sld,
    tld,
    price: priceFor(tld),
    source: "rdap",
  };

  // Per-request timeout, also cancelled if the caller aborts.
  const timer = new AbortController();
  const timeout = setTimeout(() => timer.abort(), PER_REQUEST_TIMEOUT_MS);
  const onAbort = () => timer.abort();
  signal.addEventListener("abort", onAbort, { once: true });

  try {
    const res = await fetch(RDAP_BASE + encodeURIComponent(domain), {
      headers: {
        Accept: "application/rdap+json",
        "User-Agent": USER_AGENT,
      },
      redirect: "follow",
      signal: timer.signal,
      cache: "no-store",
    });

    if (res.status === 404) return { ...base, status: "available" };
    if (res.status === 200) return { ...base, status: "registered" };
    if (res.status === 429)
      return {
        ...base,
        status: "unknown",
        reason: "The registry is rate-limiting lookups right now.",
      };
    return {
      ...base,
      status: "unknown",
      reason: `The registry returned ${res.status}.`,
    };
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return {
      ...base,
      status: "unknown",
      reason: aborted
        ? "The registry did not respond in time."
        : "Could not reach the registry.",
    };
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", onAbort);
  }
}

/** Resolve `items` through `worker`, at most `limit` at a time. */
async function pooled<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await worker(items[i]);
    }
  });
  await Promise.all(runners);
  return out;
}

export const rdapProvider: DomainProvider = {
  name: "rdap",
  check(domains, signal) {
    return pooled(domains, CONCURRENCY, (d) => checkOne(d, signal));
  },
};
