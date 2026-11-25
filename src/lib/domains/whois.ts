import { domainToUnicode } from "node:url";
import { parseDomainInput } from "./normalize";
import {
  eppStatus,
  isoDate,
  parseWhois,
  pick,
  whoisQuery,
  whoisServerFor,
} from "./whois43";

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
  /** Registry object handle, e.g. "2900183757_DOMAIN_COM-VRSN". */
  handle?: string;
  /** Registrar website and abuse contact, from the registrar entity. */
  registrarUrl?: string;
  /** Registrar's WHOIS/RDAP server, as published. */
  whoisServer?: string;
  /** Unicode form of an internationalised name (münchen.de), for display. */
  unicode?: string;
  abuseEmail?: string;
  abusePhone?: string;
  /**
   * Contacts as published — by the registrar's own RDAP server when the
   * registry links to one (thin registries like .com keep none themselves).
   * Mostly redacted under GDPR/ICANN policy; we show exactly what is given.
   */
  contacts?: WhoisContact[];
  /** The RDAP documents as received, for the "Raw RDAP registry data" panel. */
  raw?: { registry?: unknown; registrar?: unknown; whois?: string };
  /** Why the lookup could not answer. Only set for unsupported/error. */
  reason?: string;
};

export type WhoisContact = {
  role: "registrant" | "administrative" | "technical" | "billing";
  fields: { label: string; value: string }[];
};

const RDAP_BASE = "https://rdap.org/domain/";
const USER_AGENT = "Serverlys-WhoisLookup/1.0 (+https://serverlys.com)";
const TIMEOUT_MS = 8000;

/** Registries with a public RDAP server that IANA's bootstrap file does not list. */
const RDAP_DIRECT: Record<string, string> = {
  de: "https://rdap.denic.de/domain/",
};

/** RDAP `entities` carry the registrar name inside a jCard array. */
type RdapEntity = {
  roles?: string[];
  vcardArray?: unknown;
  publicIds?: { type?: string; identifier?: string }[];
  links?: RdapLink[];
  entities?: RdapEntity[];
};
type RdapLink = { rel?: string; href?: string; type?: string; value?: string };

/** The jCard fields we show, in display order. Empty ones are skipped. */
function vcardFields(entity: RdapEntity): { label: string; value: string }[] {
  const card = entity.vcardArray;
  if (!Array.isArray(card) || !Array.isArray(card[1])) return [];
  const out: { label: string; value: string }[] = [];
  const get = (name: string) =>
    (card[1] as unknown[]).filter(
      (f): f is unknown[] => Array.isArray(f) && f[0] === name,
    );
  const text = (v: unknown) =>
    typeof v === "string"
      ? v.trim()
      : Array.isArray(v)
        ? v.filter((x) => typeof x === "string" && x.trim()).join(", ")
        : "";
  const push = (label: string, v: unknown) => {
    const t = text(v);
    if (t) out.push({ label, value: t });
  };
  for (const f of get("fn")) push("Name", f[3]);
  for (const f of get("org")) push("Organization", f[3]);
  for (const f of get("adr")) {
    const v = f[3];
    if (Array.isArray(v)) {
      // [pobox, ext, street, locality, region, code, country]
      push("Street", v[2]);
      push("City", v[3]);
      push("State/Province", v[4]);
      push("Postal code", v[5]);
      push("Country", v[6]);
    }
    const params = f[1] as Record<string, unknown> | undefined;
    if (
      params &&
      typeof params.cc === "string" &&
      !out.some((x) => x.label === "Country")
    )
      push("Country", params.cc);
  }
  for (const f of get("tel"))
    push("Phone", typeof f[3] === "string" ? f[3].replace(/^tel:/, "") : f[3]);
  for (const f of get("email")) push("Email", f[3]);
  return out;
}

const CONTACT_ROLES = ["registrant", "administrative", "technical", "billing"] as const;

function contactsFrom(entities: RdapEntity[] | undefined): WhoisContact[] {
  const out: WhoisContact[] = [];
  for (const e of entities ?? []) {
    for (const role of CONTACT_ROLES) {
      if (!e.roles?.includes(role) || out.some((c) => c.role === role)) continue;
      const fields = vcardFields(e);
      if (fields.length) out.push({ role, fields });
    }
  }
  return out;
}

async function fetchJson(url: string, ms: number): Promise<unknown | null> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/rdap+json", "User-Agent": USER_AGENT },
      redirect: "follow",
      signal: c.signal,
      cache: "no-store",
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function registrarName(entity: RdapEntity): string | undefined {
  // jCard: ["vcard", [ ["version",{},"text","4.0"], ["fn",{},"text","Name"] ]]
  const card = entity.vcardArray;
  if (!Array.isArray(card) || card.length < 2 || !Array.isArray(card[1]))
    return undefined;
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
  handle?: string;
  links?: RdapLink[];
};

function eventDate(res: RdapResponse, action: string): string | undefined {
  return res.events?.find((e) => e.eventAction === action)?.eventDate;
}

/** Build the record from a registry RDAP document (and the registrar's, if linked). */
async function parseRecord(
  domain: string,
  body: RdapResponse,
  selfUrl: string,
): Promise<WhoisRecord> {
  const registrar = body.entities?.find((e) => e.roles?.includes("registrar"));

  /*
   * Thin registries (.com, .net) hold no contacts; they link to the
   * registrar's own RDAP server, which does. Follow that one link, briefly:
   * a slow registrar costs the contacts panel, never the whole lookup.
   */
  const related = body.links?.find(
    (l) =>
      l.rel === "related" &&
      l.href &&
      /rdap/i.test(`${l.type} ${l.href}`) &&
      l.href !== selfUrl,
  )?.href;
  const registrarDoc = related?.startsWith("https://")
    ? ((await fetchJson(related, 4000)) as
        (RdapResponse & { entities?: RdapEntity[] }) | null)
    : null;

  const abuse = [
    ...(registrar?.entities ?? []),
    ...(registrarDoc?.entities?.find((e) => e.roles?.includes("registrar"))?.entities ??
      []),
  ].find((e) => e.roles?.includes("abuse"));
  const abuseFields = abuse ? vcardFields(abuse) : [];
  const contacts = contactsFrom(registrarDoc?.entities);
  for (const c of contactsFrom(body.entities))
    if (!contacts.some((x) => x.role === c.role)) contacts.push(c);

  return {
    handle: body.handle,
    registrarUrl: registrar?.links?.find(
      (l) => l.rel === "about" && l.href?.startsWith("http"),
    )?.href,
    // The registrar's own lookup server, as the reference's "WHOIS server" row.
    whoisServer:
      registrar?.links?.find((l) => l.rel === "about" && l.value?.startsWith("http"))
        ?.value ?? (related ? new URL(related).origin + "/" : undefined),
    abuseEmail: abuseFields.find((f) => f.label === "Email")?.value,
    abusePhone: abuseFields.find((f) => f.label === "Phone")?.value,
    contacts,
    raw: { registry: body, ...(registrarDoc ? { registrar: registrarDoc } : {}) },
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
      ?.map((n) => n.ldhName?.toLowerCase().replace(/\.$/, ""))
      .filter((n): n is string => Boolean(n)),
    epp: body.status,
    dnssec: body.secureDNS?.delegationSigned,
  };
}

/**
 * Two-label public suffixes a subdomain must never be reduced to: asking the
 * registry about "co.uk" itself would answer for the suffix, not a domain.
 */
const SUFFIXES = new Set(
  "co.uk org.uk me.uk ltd.uk plc.uk net.uk sch.uk ac.uk gov.uk com.au net.au org.au edu.au co.nz org.nz net.nz com.br net.br org.br com.mx org.mx com.ar com.co com.pe com.ec com.uy com.ve com.tr com.sg com.hk com.cn com.tw co.jp ne.jp or.jp co.kr co.in net.in org.in co.za com.es com.pl co.il com.my com.ph com.vn com.pk com.ng com.eg com.sa co.id".split(
    " ",
  ),
);

export async function lookupWhois(input: string): Promise<WhoisRecord> {
  const parsed = parseDomainInput(input);
  if (!parsed.ok) return { domain: input, status: "error", reason: parsed.message };
  if (!parsed.tld) {
    return {
      domain: parsed.sld,
      status: "error",
      reason: "Include the extension — for example serverlys.com, not serverlys.",
    };
  }
  /*
   * A hostname like mail.google.com is not a registration: try the full
   * name, then its parents, stopping above a public suffix. The first one
   * the registry knows is the answer (as the reference does for subdomains).
   */
  const labels = `${parsed.sld}${parsed.tld}`.split(".");
  const candidates: string[] = [];
  for (let i = 0; i <= labels.length - 2; i++) {
    const name = labels.slice(i).join(".");
    if (i > 0 && SUFFIXES.has(name)) break;
    candidates.push(name);
  }
  let result: WhoisRecord = {
    domain: candidates[0],
    status: "error",
    reason: "Could not reach the registry.",
  };
  for (const name of candidates) {
    result = await lookupOne(name);
    if (result.status !== "available") break;
  }
  // An unregistered hostname reports its full name, not its last parent.
  if (result.status === "available") result = { ...result, domain: candidates[0] };
  if (result.domain.includes("xn--"))
    result.unicode = domainToUnicode(result.domain) || undefined;
  return result;
}

async function lookupOne(domain: string): Promise<WhoisRecord> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(RDAP_BASE + encodeURIComponent(domain), {
      headers: { Accept: "application/rdap+json", "User-Agent": USER_AGENT },
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
    });

    if (res.status === 404) {
      /*
       * Two very different 404s. A registry that has no record of the name
       * (available) — and rdap.org saying it knows no RDAP server for the
       * extension at all ("No RDAP service is available"), which says nothing
       * about the name. Reading the second as "available" showed registered
       * .de domains as free. Known registries missing from IANA's bootstrap
       * are asked directly; the rest are reported as unsupported.
       */
      const notFound = (await res.json().catch(() => null)) as {
        title?: string;
      } | null;
      if (!/no rdap service/i.test(notFound?.title ?? ""))
        return { domain, status: "available" };
      const direct = RDAP_DIRECT[domain.split(".").pop()!];
      if (!direct) return viaWhois(domain);
      const retry = await fetch(direct + encodeURIComponent(domain), {
        headers: { Accept: "application/rdap+json", "User-Agent": USER_AGENT },
        signal: controller.signal,
        cache: "no-store",
      });
      if (retry.status === 404) return { domain, status: "available" };
      if (!retry.ok)
        return {
          domain,
          status: "error",
          reason: `The registry returned ${retry.status}.`,
        };
      return parseRecord(domain, (await retry.json()) as RdapResponse, retry.url);
    }
    if (res.status === 501 || res.status === 400) return viaWhois(domain);
    if (res.status === 429) {
      return {
        domain,
        status: "error",
        reason: "The registry is rate-limiting lookups right now. Try again shortly.",
      };
    }
    if (!res.ok) {
      return {
        domain,
        status: "error",
        reason: `The registry returned ${res.status}.`,
      };
    }

    return parseRecord(domain, (await res.json()) as RdapResponse, res.url);
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

/** Classic WHOIS for registries without RDAP (see whois43.ts). */
async function viaWhois(domain: string): Promise<WhoisRecord> {
  const unsupported: WhoisRecord = {
    domain,
    status: "unsupported",
    reason: "This registry does not publish RDAP data.",
  };
  const server = await whoisServerFor(domain.split(".").pop()!);
  if (!server) return unsupported;
  let text: string;
  try {
    text = await whoisQuery(server, domain);
  } catch {
    return { domain, status: "error", reason: "The registry did not respond in time." };
  }
  const p = parseWhois(text);
  if (p.available) return { domain, status: "available" };
  if (!p.fields.size) return { ...unsupported, raw: { whois: text } };

  const one = (...k: string[]) => pick(p, ...k)?.[0];
  const contacts: WhoisContact[] = [];
  for (const [role, prefix] of [
    ["registrant", "registrant"],
    ["administrative", "admin"],
    ["technical", "tech"],
    ["billing", "billing"],
  ] as const) {
    const fields = (
      [
        ["Name", "name"],
        ["Organization", "organization"],
        ["Street", "street"],
        ["City", "city"],
        ["State/Province", "state/province"],
        ["Postal code", "postal code"],
        ["Country", "country"],
        ["Phone", "phone"],
        ["Email", "email"],
      ] as const
    )
      .map(([label, key]) => ({ label, value: one(`${prefix} ${key}`) ?? "" }))
      .filter((f) => f.value);
    if (fields.length) contacts.push({ role, fields });
  }
  const dnssec = one("dnssec", "signed", "registrar dnssec");
  return {
    domain,
    status: "registered",
    handle: one("registry domain id", "domain id"),
    registrar: one(
      "registrar",
      "sponsoring registrar",
      "registrar organization",
      "registrar name",
    ),
    registrarIanaId: one("registrar iana id"),
    registrarUrl: one("registrar url", "registrar website", "registrar web"),
    whoisServer: one("registrar whois server"),
    abuseEmail: one("registrar abuse contact email"),
    abusePhone: one("registrar abuse contact phone"),
    registered: isoDate(
      one("creation date", "created on", "created", "registered", "registration date"),
    ),
    updated: isoDate(
      one("updated date", "last updated", "last update", "changed", "last modified"),
    ),
    expires: isoDate(
      one(
        "registry expiry date",
        "registrar registration expiration date",
        "expiration date",
        "expiry date",
        "expire date",
        "expires",
      ),
    ),
    nameservers: [
      ...new Set(
        (
          pick(
            p,
            "name server",
            "nserver",
            "name servers",
            "nameservers",
            "name servers values",
            "nameservers values",
          ) ?? []
        ).map((n) => n.split(/\s+/)[0].toLowerCase().replace(/\.$/, "")),
      ),
    ],
    epp: (pick(p, "domain status", "status") ?? []).map(eppStatus),
    dnssec: dnssec ? !/unsigned|no|inactive/i.test(dnssec) : undefined,
    contacts,
    raw: { whois: text },
  };
}
