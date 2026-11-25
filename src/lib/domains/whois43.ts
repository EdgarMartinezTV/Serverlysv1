import "server-only";
import net from "node:net";

/**
 * Classic WHOIS (port 43), the fallback for registries that publish no RDAP
 * server in IANA's bootstrap file — .io, .co, .me, .us, .es, .mx, .it, .eu,
 * .gg, .so among them (checked 2026-11-24). Without it those lookups could
 * only say "this registry does not publish RDAP data", while the reference
 * page shows the record.
 *
 * The server for each TLD comes from IANA itself (whois.iana.org answers
 * "whois: <server>" for a TLD query) and is cached. The text is free-form, so
 * parsing is best-effort over the "Key: Value" lines most registries use;
 * whatever we cannot map still reaches the visitor in the raw panel.
 */

const TIMEOUT_MS = 6000;
const serverCache = new Map<string, { server: string | null; at: number }>();

export function whoisQuery(
  server: string,
  query: string,
  timeoutMs = TIMEOUT_MS,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host: server, port: 43 });
    const chunks: Buffer[] = [];
    let size = 0;
    const timer = setTimeout(() => {
      sock.destroy();
      reject(new Error("timeout"));
    }, timeoutMs);
    sock.on("connect", () => sock.write(`${query}\r\n`));
    sock.on("data", (c) => {
      size += c.length;
      if (size > 200_000) return sock.destroy(); // a WHOIS answer is never this big
      chunks.push(c);
    });
    sock.on("close", () => {
      clearTimeout(timer);
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    sock.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
  });
}

/** The registry WHOIS server for a TLD, from IANA. Cached for a day. */
export async function whoisServerFor(tld: string): Promise<string | null> {
  const hit = serverCache.get(tld);
  if (hit && Date.now() - hit.at < 86_400_000) return hit.server;
  try {
    const text = await whoisQuery("whois.iana.org", tld);
    const server = /^whois:\s*(\S+)/im.exec(text)?.[1] ?? null;
    serverCache.set(tld, { server, at: Date.now() });
    return server;
  } catch {
    return null;
  }
}

const NOT_FOUND =
  /^(no match|not found|no data found|no entries found|no object found|domain not found|the queried object does not exist)|status:\s*(free|available)|^%?\s*no match for|is available for registration/im;

export type Parsed = {
  available: boolean;
  fields: Map<string, string[]>;
};

/** "Key: Value" lines into a multimap with lowercased keys. */
export function parseWhois(text: string): Parsed {
  const fields = new Map<string, string[]>();
  const add = (k: string, v: string) => fields.set(k, [...(fields.get(k) ?? []), v]);
  /*
   * Two layouts exist. Most registries: flat "Key: Value" lines. Some (.eu,
   * .it): a section header ("Registrar", "Name servers:") followed by
   * indented "Key: value" lines or bare values. Indented keys are stored as
   * "<section> <key>" (e.g. "registrar name"), bare values as
   * "<section> values" — plus the flat key, so lookups find either.
   */
  let section = "";
  for (const raw of text.split(/\r?\n/)) {
    if (!raw.trim()) {
      section = "";
      continue;
    }
    const line = raw.trim();
    if (/^[%#*]|^>>>/.test(line)) continue;
    const indented = /^\s/.test(raw);
    const m = /^([A-Za-z][A-Za-z0-9 /().'-]{1,60}?)\s*:\s*(.*)$/.exec(line);
    if (!indented) {
      if (m && m[2].trim()) {
        add(m[1].trim().toLowerCase(), m[2].trim());
        section = "";
      } else {
        section = (m ? m[1] : line).trim().toLowerCase();
      }
      continue;
    }
    if (!section) {
      if (m && m[2].trim()) add(m[1].trim().toLowerCase(), m[2].trim());
      continue;
    }
    if (m && m[2].trim()) add(`${section} ${m[1].trim().toLowerCase()}`, m[2].trim());
    else if (!m) add(`${section} values`, line);
  }
  const hasRecord = [
    "creation date",
    "registrar",
    "created",
    "registered",
    "domain status",
    "registrar name",
    "registrar organization",
    "domain",
  ].some((k) => fields.has(k));
  return { available: !hasRecord && NOT_FOUND.test(text), fields };
}

export const pick = (p: Parsed, ...keys: string[]) => {
  for (const k of keys) {
    const v = p.fields.get(k);
    if (v?.length) return v;
  }
  return undefined;
};

/** WHOIS dates into ISO where the format is recognisable; otherwise as given. */
export function isoDate(v?: string): string | undefined {
  if (!v) return undefined;
  const t = Date.parse(v.replace(/^(\d{4})\.(\d\d)\.(\d\d)/, "$1-$2-$3"));
  return Number.isNaN(t) ? v : new Date(t).toISOString();
}

/** "clientTransferProhibited https://icann.org/epp#…" → "client transfer prohibited". */
export function eppStatus(v: string): string {
  const code = v.split(/\s+/)[0];
  return code.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}
