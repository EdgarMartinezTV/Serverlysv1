/** Availability outcome for one domain. Never invent one of these. */
export type DomainStatus =
  | "available"
  | "registered"
  /** Syntactically valid but the registry/provider could not answer. */
  | "unknown"
  /** The provider explicitly says it cannot be registered here. */
  | "unsupported";

export type DomainResult = {
  /** Full ASCII domain, lowercased. */
  domain: string;
  sld: string;
  tld: string;
  status: DomainStatus;
  /** Standard first-year price, USD. Null when we do not sell this TLD. */
  price: number | null;
  /**
   * Which provider answered. Surfaced in the UI, because RDAP reports
   * REGISTRATION status and cannot know about premium pricing or registry
   * reservations — WHMCS can.
   */
  source: "whmcs" | "rdap";
  /** Present when status is "unknown", to explain why. */
  reason?: string;
  /** Yearly renewal, USD, when WHMCS returned it with this lookup. */
  renew?: number | null;
  /**
   * True when `price`/`renew` were read from WHMCS Domain Pricing during this
   * very lookup (serverlys_domaincheck.php or the cart answer) — the real-time
   * price. The check route only falls back to its 60s price list when false.
   */
  livePrice?: boolean;
};

export type CheckOutcome =
  | { ok: true; results: DomainResult[]; source: "whmcs" | "rdap" }
  | { ok: false; error: CheckError };

export type CheckError =
  | { kind: "unconfigured"; message: string }
  | { kind: "invalid"; message: string }
  | { kind: "timeout"; message: string }
  | { kind: "rate_limited"; message: string; retryAfterSeconds: number }
  | { kind: "provider"; message: string }
  | { kind: "network"; message: string };

export interface DomainProvider {
  readonly name: "whmcs" | "rdap";
  /**
   * Check many domains. Implementations MUST resolve every input to a result —
   * returning "unknown" rather than omitting or guessing — so the UI can always
   * render a row per requested domain.
   */
  check(domains: string[], signal: AbortSignal): Promise<DomainResult[]>;
}
