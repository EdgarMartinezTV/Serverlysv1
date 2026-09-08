import { tldSet } from "@/data/tlds";

/**
 * Parse and validate user input into a registrable domain.
 *
 * Accepts what people actually paste — "https://www.Example.com/pricing",
 * "EXAMPLE.COM.", "münchen.de" — and rejects what cannot be registered.
 * IDNs are converted to punycode with the URL parser, which implements UTS-46;
 * hand-rolling that conversion would be worse than not supporting it.
 */

export type ParsedInput =
  | { ok: true; sld: string; tld: string | null; domain: string | null }
  | { ok: false; message: string };

const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/** Convert a unicode label to punycode via the URL parser (UTS-46). */
function toAscii(host: string): string | null {
  try {
    const url = new URL(`https://${host}`);
    // The parser lowercases and punycodes the hostname for us.
    return url.hostname || null;
  } catch {
    return null;
  }
}

export function parseDomainInput(raw: string): ParsedInput {
  let value = raw.trim().toLowerCase();
  if (!value) return { ok: false, message: "Enter a domain name to search." };

  // Strip anything people paste around the name.
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, ""); // scheme
  value = value.split(/[/?#]/)[0]; // path, query, fragment
  value = value.replace(/^www\./, "");
  value = value.replace(/\.+$/, ""); // trailing root dot
  value = value.replace(/^@+/, "");

  if (!value) return { ok: false, message: "Enter a domain name to search." };
  if (value.includes(" "))
    return { ok: false, message: "Domain names cannot contain spaces." };
  if (value.includes("_"))
    return { ok: false, message: "Domain names cannot contain underscores." };
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value))
    return { ok: false, message: "That is an IP address, not a domain name." };

  // Punycode any non-ASCII input.
  if (/[^\x20-\x7e]/.test(value)) {
    const ascii = toAscii(value);
    if (!ascii)
      return { ok: false, message: "That name uses characters we cannot register." };
    value = ascii;
  }

  if (value.length > 253)
    return { ok: false, message: "That name is too long to register." };

  const parts = value.split(".");
  if (parts.some((p) => p.length === 0))
    return { ok: false, message: "Check the dots — part of that name is empty." };
  if (parts.some((p) => !LABEL.test(p))) {
    const bad = parts.find((p) => !LABEL.test(p)) ?? "";
    if (bad.startsWith("-") || bad.endsWith("-"))
      return { ok: false, message: "Names cannot start or end with a hyphen." };
    if (bad.length > 63)
      return {
        ok: false,
        message: "Each part of a name must be 63 characters or fewer.",
      };
    return { ok: false, message: "Use only letters, numbers and hyphens." };
  }

  // Bare name — the caller picks the TLDs to try.
  if (parts.length === 1) return { ok: true, sld: parts[0], tld: null, domain: null };

  // Longest suffix we recognise wins, so "example.co.uk" is not read as ".uk".
  for (let i = 1; i < parts.length; i++) {
    const candidate = "." + parts.slice(i).join(".");
    if (tldSet.has(candidate)) {
      return {
        ok: true,
        sld: parts.slice(0, i).join("."),
        tld: candidate,
        domain: value,
      };
    }
  }

  // A TLD we do not sell. Still valid input — treat the last label as the TLD so
  // the UI can say plainly that we do not offer it, rather than rejecting it.
  return {
    ok: true,
    sld: parts.slice(0, -1).join("."),
    tld: "." + parts[parts.length - 1],
    domain: value,
  };
}

/** True when a fully-qualified domain is syntactically registrable. */
export function isValidDomain(domain: string): boolean {
  const parsed = parseDomainInput(domain);
  return parsed.ok && parsed.domain !== null;
}
