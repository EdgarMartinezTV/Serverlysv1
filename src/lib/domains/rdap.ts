import { priceFor, tldSet } from "@/data/tlds";
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
 * Authoritative RDAP endpoints, so the common TLDs skip rdap.org entirely.
 *
 * rdap.org is a bootstrap service: it answers with a 302 to the registry that
 * actually holds the data. That is one extra round trip per lookup AND a single
 * shared choke point — under a burst of searches it starts refusing, every
 * lookup degrades to "unknown", and the search looks broken while the
 * registries themselves are perfectly healthy. That is exactly what happened in
 * testing.
 *
 * Only endpoints VERIFIED to return 200 for a registered name and 404 for a
 * free one are listed here; 404-means-available is the whole contract and
 * guessing a URL that 404s for another reason would report every name as
 * available. Everything else still goes through rdap.org, which is correct if
 * slower. Checked 2026-09-11.
 */
const REGISTRY_RDAP: Record<string, string> = {
  ".com": "https://rdap.verisign.com/com/v1/domain/",
  ".net": "https://rdap.verisign.com/net/v1/domain/",
  ".org": "https://rdap.publicinterestregistry.org/rdap/domain/",
};

function endpointFor(domain: string, tld: string): { url: string; direct: boolean } {
  const base = REGISTRY_RDAP[tld];
  if (base) return { url: base + encodeURIComponent(domain), direct: true };
  return { url: RDAP_BASE + encodeURIComponent(domain), direct: false };
}

/**
 * Is a 404 actually an answer?
 *
 * 404 means "no such domain" ONLY when a registry said it. rdap.org answers its
 * own 404 — body `"No RDAP service is available for this resource"` — when it
 * cannot route the TLD at all, which is a routing failure and says nothing
 * about the name. Treating that as available reported every .io, .de and .co.uk
 * name as free and would have sent people to checkout for names they cannot
 * buy. Caught by mysite.io coming back "available" on 2026-09-11.
 *
 * A second guard on top: even a genuine registry 404 is only trusted for a TLD
 * we have a verified endpoint for, or one we actually sell. Outside those we
 * can neither price the name nor be sure it is registrable at all
 * ("sub.example.co.uk" 404s at Nominet because it is a subdomain, not because
 * it is for sale), so it goes to WHMCS instead of being guessed at.
 */
async function notFoundMeansAvailable(
  res: Response,
  direct: boolean,
  tld: string,
): Promise<boolean> {
  if (direct) return true;
  if (!tldSet.has(tld)) return false;
  try {
    const body = await res.clone().text();
    return !/no rdap service/i.test(body);
  } catch {
    return false;
  }
}
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
    const { url, direct } = endpointFor(domain, tld);
    const res = await fetch(url, {
      headers: {
        Accept: "application/rdap+json",
        "User-Agent": USER_AGENT,
      },
      redirect: "follow",
      signal: timer.signal,
      cache: "no-store",
    });

    if (res.status === 404) {
      if (await notFoundMeansAvailable(res, direct, tld)) {
        return { ...base, status: "available" };
      }
      return {
        ...base,
        status: "unknown",
        reason: "No registry lookup is available for that extension.",
      };
    }
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
