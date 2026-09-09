import { parseDomainInput } from "./normalize";

/**
 * Registration lookup, over RDAP.
 *
 * The availability provider throws the RDAP response body away — it only needs
 * the status code. This reads the body, which is where the useful record lives:
 * registrar, the registration and expiry dates, nameservers, EPP status codes
 * and whether DNSSEC is signed.
 *
 * WHY RDAP AND NOT WHOIS: WHOIS is an unstructured text protocol with a
 * different format per registry, so parsing it means maintaining dozens of
 * regexes that break without warning. RDAP (RFC 7482/9083) is the IETF
 * successor and returns JSON. It needs no credentials, so this is real
 * registry data rather than a stand-in.
 *
 * HONEST LIMITS, surfaced in the UI rather than hidden:
 *  · Registrant contact details are redacted by the registries themselves
 *    under GDPR and ICANN policy. We cannot show what we are not given, and a
 *    lookup tool that claims otherwise is lying.
 *  · ccTLD coverage is uneven. Some national registries publish no RDAP at
 *    all; those return `unsupported`, never a guess.
 */

export type WhoisStatus = "registered" | "available" | "unsupported" | "error";

export type WhoisRecord = {
  domain: string;
  status: WhoisStatus;
  registrar?: string;
  registrarIanaId?: string;
  /** ISO strings, straight from the registry. */
  registered?: string;
  updated?: string;
  expires?: string;
  nameservers?: readonly string[];
  /** EPP status codes, e.g. "client transfer prohibited". */
  epp?: readonly string[];
  dnssec?: boolean;
  /** Why the lookup could not answer. Only set for unsupported/error. */
  reason?: string;
};

const RDAP_BASE = "https://rdap.org/domain/";
const USER_AGENT = "Serverlys-WhoisLookup/1.0 (+https://serverlys.com)";
const TIMEOUT_MS = 8000;

/** RDAP `entities` carry the registrar name inside a jCard array. */
type RdapEntity = {
  roles?: string[];
  vcardArray?: unknown;
  publicIds?: { type?: string; identifier?: string }[];
};

function registrarName(entity: RdapEntity): string | undefined {
  // jCard: ["vcard", [ ["version",{},"text","4.0"], ["fn",{},"text","Name"] ]]
  const card = entity.vcardArray;
  if (!Array.isArray(card) || card.length < 2 || !Array.isArray(card[1])) return undefined;
  for (const field of card[1] as unknown[]) {
    if (Array.isArray(field) && field[0] === "fn" && typeof field[3] === "string") {
      return field[3];
    }
  }
  return undefined;
}

type RdapResponse = {
  ldhName?: string;
  status?: string[];
  events?: { eventAction?: string; eventDate?: string }[];
  entities?: RdapEntity[];
  nameservers?: { ldhName?: string }[];
  secureDNS?: { delegationSigned?: boolean };
};

function eventDate(res: RdapResponse, action: string): string | undefined {
  return res.events?.find((e) => e.eventAction === action)?.eventDate;
}

export async function lookupWhois(input: string): Promise<WhoisRecord> {
  const parsed = parseDomainInput(input);
  if (!parsed.ok) {
    return { domain: input, status: "error", reason: parsed.message };
  }
  // A bare name with no extension cannot be looked up — there is no registry
  // to ask. The UI validates for this too; this is the server-side backstop.
  if (!parsed.tld) {
    return {
      domain: parsed.sld,
      status: "error",
      reason: "Include the extension — for example serverlys.com, not serverlys.",
    };
  }
  const domain = `${parsed.sld}${parsed.tld}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(RDAP_BASE + encodeURIComponent(domain), {
      headers: { Accept: "application/rdap+json", "User-Agent": USER_AGENT },
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
    });

    if (res.status === 404) return { domain, status: "available" };
    if (res.status === 501 || res.status === 400) {
      return {
        domain,
        status: "unsupported",
        reason: "This registry does not publish RDAP data.",
      };
    }
    if (res.status === 429) {
      return {
        domain,
        status: "error",
        reason: "The registry is rate-limiting lookups right now. Try again shortly.",
      };
    }
    if (!res.ok) {
      return { domain, status: "error", reason: `The registry returned ${res.status}.` };
    }

    const body = (await res.json()) as RdapResponse;
    const registrar = body.entities?.find((e) => e.roles?.includes("registrar"));

    return {
      domain: body.ldhName?.toLowerCase() ?? domain,
      status: "registered",
      registrar: registrar ? registrarName(registrar) : undefined,
      registrarIanaId: registrar?.publicIds?.find((p) =>
        p.type?.toLowerCase().includes("iana"),
      )?.identifier,
      registered: eventDate(body, "registration"),
      updated: eventDate(body, "last changed"),
      expires: eventDate(body, "expiration"),
      nameservers: body.nameservers
        ?.map((n) => n.ldhName?.toLowerCase())
        .filter((n): n is string => Boolean(n)),
      epp: body.status,
      dnssec: body.secureDNS?.delegationSigned,
    };
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return {
      domain,
      status: "error",
      reason: aborted
        ? "The registry did not respond in time."
        : "Could not reach the registry.",
    };
  } finally {
    clearTimeout(timer);
  }
}
