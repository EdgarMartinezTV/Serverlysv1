import "server-only";
import dgram from "node:dgram";
import net from "node:net";
import { randomInt } from "node:crypto";

/**
 * A minimal DNS client that speaks the wire protocol (RFC 1035) directly.
 *
 * Why not node:dns? Its Resolver hides everything the propagation checker is
 * about: it gives no TTL for anything but A/AAAA, folds NXDOMAIN, SERVFAIL and
 * REFUSED into one error, cannot clear the RD bit (so it cannot ask an
 * authoritative server non-recursively) and never shows a referral. A checker
 * that cannot tell "this server has no record" from "this server is broken" is
 * guessing, so we read the packets ourselves.
 *
 * Scope is deliberately small: one question per query, the record types the
 * checker offers, EDNS0 for 1232-byte UDP answers, TCP retry on truncation.
 */

export { RECORD_TYPES, type RecordType } from "./types";

const TYPE_CODE: Record<string, number> = {
  A: 1, NS: 2, CNAME: 5, SOA: 6, MX: 15, TXT: 16, AAAA: 28, SRV: 33, OPT: 41, CAA: 257,
};
const CODE_TYPE: Record<number, string> = Object.fromEntries(
  Object.entries(TYPE_CODE).map(([k, v]) => [v, k]),
);

export const RCODE = { NOERROR: 0, FORMERR: 1, SERVFAIL: 2, NXDOMAIN: 3, NOTIMP: 4, REFUSED: 5 } as const;

export type RR = {
  /** Owner name, lowercase, no trailing dot. */
  name: string;
  type: string;
  ttl: number;
  /** Presentation form, normalised so two servers' answers compare as strings. */
  value: string;
};

export type DnsMessage = {
  rcode: number;
  aa: boolean;
  tc: boolean;
  answers: RR[];
  authority: RR[];
  additional: RR[];
};

export class DnsTimeout extends Error {
  constructor() {
    super("timeout");
  }
}

/* ── Encoding ──────────────────────────────────────────────────────────── */

function encodeName(name: string): Buffer {
  const parts = name.replace(/\.$/, "").split(".").filter(Boolean);
  const bufs: Buffer[] = [];
  for (const p of parts) {
    const b = Buffer.from(p, "ascii");
    bufs.push(Buffer.from([b.length]), b);
  }
  bufs.push(Buffer.from([0]));
  return Buffer.concat(bufs);
}

/**
 * EDNS Client Subnet (RFC 7871) option for an IPv4 /24: asks an authoritative
 * server "what would you answer a client in this network?". Geo-routed domains
 * (CDNs, Google, …) answer differently per location, so this is how we know
 * what a resolver far away SHOULD have, rather than calling it stale.
 */
function ecsOption(ip: string): Buffer {
  const octets = ip.split(".").map(Number).slice(0, 3);
  const body = Buffer.from([0, 1, 24, 0, ...octets]);
  const head = Buffer.alloc(4);
  head.writeUInt16BE(8, 0);
  head.writeUInt16BE(body.length, 2);
  return Buffer.concat([head, body]);
}

function buildQuery(id: number, name: string, type: string, recursive: boolean, ecs?: string): Buffer {
  const header = Buffer.alloc(12);
  header.writeUInt16BE(id, 0);
  // RD bit only; checking-disabled stays off so a validating resolver's
  // DNSSEC failures surface as SERVFAIL, which is what a real visitor gets.
  header.writeUInt16BE(recursive ? 0x0100 : 0x0000, 2);
  header.writeUInt16BE(1, 4); // QDCOUNT
  header.writeUInt16BE(0, 6);
  header.writeUInt16BE(0, 8);
  header.writeUInt16BE(1, 10); // ARCOUNT: the OPT record
  const q = Buffer.alloc(4);
  q.writeUInt16BE(TYPE_CODE[type], 0);
  q.writeUInt16BE(1, 2); // IN
  // EDNS0 OPT: root name, type 41, UDP size 4096. The DNS-flag-day value
  // (1232) makes resolvers cut big answers (a domain with 20 TXT records is
  // ~1.7 KB) and send us to TCP, which many ISP resolvers refuse from outside
  // their network. Asking for 4096 gets the whole answer over UDP from most.
  const options = ecs && /^\d+\.\d+\.\d+\.\d+$/.test(ecs) ? ecsOption(ecs) : Buffer.alloc(0);
  const opt = Buffer.from([0, 0, 41, 0x10, 0x00, 0, 0, 0, 0, options.length >> 8, options.length & 0xff]);
  return Buffer.concat([header, encodeName(name), q, opt, options]);
}

/* ── Decoding ──────────────────────────────────────────────────────────── */

function readName(buf: Buffer, start: number): { name: string; next: number } {
  const labels: string[] = [];
  let pos = start;
  let next = -1;
  for (let jumps = 0; jumps < 64; jumps++) {
    if (pos >= buf.length) throw new Error("name out of bounds");
    const len = buf[pos];
    if (len === 0) {
      if (next < 0) next = pos + 1;
      return { name: labels.join(".").toLowerCase(), next };
    }
    if ((len & 0xc0) === 0xc0) {
      if (next < 0) next = pos + 2;
      pos = ((len & 0x3f) << 8) | buf[pos + 1];
      continue;
    }
    labels.push(buf.toString("latin1", pos + 1, pos + 1 + len));
    pos += 1 + len;
  }
  throw new Error("name loop");
}

/** IPv6 in its canonical compressed form (RFC 5952), via the URL parser. */
function ipv6(bytes: Buffer): string {
  const groups: string[] = [];
  for (let i = 0; i < 16; i += 2) groups.push(bytes.readUInt16BE(i).toString(16));
  try {
    return new URL(`http://[${groups.join(":")}]`).hostname.slice(1, -1);
  } catch {
    return groups.join(":");
  }
}

function charStrings(buf: Buffer, start: number, end: number): string[] {
  const out: string[] = [];
  let p = start;
  while (p < end) {
    const len = buf[p];
    out.push(buf.toString("utf8", p + 1, p + 1 + len));
    p += 1 + len;
  }
  return out;
}

function rdata(buf: Buffer, type: string, start: number, len: number): string {
  const end = start + len;
  switch (type) {
    case "A":
      return Array.from(buf.subarray(start, end)).join(".");
    case "AAAA":
      return ipv6(buf.subarray(start, end));
    case "NS":
    case "CNAME":
      return readName(buf, start).name;
    case "MX":
      return `${buf.readUInt16BE(start)} ${readName(buf, start + 2).name}`;
    case "SRV":
      return `${buf.readUInt16BE(start)} ${buf.readUInt16BE(start + 2)} ${buf.readUInt16BE(start + 4)} ${readName(buf, start + 6).name}`;
    case "TXT":
      // One logical string: 255-byte chunks are a wire detail, not content.
      return charStrings(buf, start, end).join("");
    case "CAA": {
      const flags = buf[start];
      const tagLen = buf[start + 1];
      const tag = buf.toString("ascii", start + 2, start + 2 + tagLen);
      const value = buf.toString("utf8", start + 2 + tagLen, end);
      return `${flags} ${tag} "${value}"`;
    }
    case "SOA": {
      const m = readName(buf, start);
      const r = readName(buf, m.next);
      const p = r.next;
      const nums = [0, 4, 8, 12, 16].map((o) => buf.readUInt32BE(p + o));
      return `${m.name} ${r.name} ${nums.join(" ")}`;
    }
    default:
      return buf.subarray(start, end).toString("hex");
  }
}

function parse(buf: Buffer): DnsMessage {
  if (buf.length < 12) throw new Error("short packet");
  const flags = buf.readUInt16BE(2);
  const counts = [4, 6, 8, 10].map((o) => buf.readUInt16BE(o));
  let pos = 12;
  for (let i = 0; i < counts[0]; i++) pos = readName(buf, pos).next + 4;

  const sections: RR[][] = [[], [], []];
  for (let s = 0; s < 3; s++) {
    for (let i = 0; i < counts[s + 1]; i++) {
      const { name, next } = readName(buf, pos);
      const code = buf.readUInt16BE(next);
      const ttl = buf.readUInt32BE(next + 4);
      const len = buf.readUInt16BE(next + 8);
      const start = next + 10;
      const type = CODE_TYPE[code] ?? `TYPE${code}`;
      if (type !== "OPT") {
        sections[s].push({ name, type, ttl, value: rdata(buf, type, start, len) });
      }
      pos = start + len;
    }
  }
  return {
    rcode: flags & 0x000f,
    aa: Boolean(flags & 0x0400),
    tc: Boolean(flags & 0x0200),
    answers: sections[0],
    authority: sections[1],
    additional: sections[2],
  };
}

/* ── Transport ─────────────────────────────────────────────────────────── */

function overUdp(server: string, packet: Buffer, id: number, timeoutMs: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const sock = dgram.createSocket(server.includes(":") ? "udp6" : "udp4");
    const done = (fn: () => void) => {
      clearTimeout(timer);
      sock.close();
      fn();
    };
    const timer = setTimeout(() => done(() => reject(new DnsTimeout())), timeoutMs);
    sock.on("error", (err) => done(() => reject(err)));
    sock.on("message", (msg) => {
      // Ignore anything that is not the reply to this query (spoofing guard).
      if (msg.length >= 2 && msg.readUInt16BE(0) === id) done(() => resolve(msg));
    });
    sock.send(packet, 53, server);
  });
}

function overTcp(server: string, packet: Buffer, timeoutMs: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host: server, port: 53 });
    let data = Buffer.alloc(0);
    const timer = setTimeout(() => {
      sock.destroy();
      reject(new DnsTimeout());
    }, timeoutMs);
    sock.on("connect", () => {
      const len = Buffer.alloc(2);
      len.writeUInt16BE(packet.length);
      sock.write(Buffer.concat([len, packet]));
    });
    sock.on("data", (chunk) => {
      data = Buffer.concat([data, chunk]);
      if (data.length >= 2 && data.length >= 2 + data.readUInt16BE(0)) {
        clearTimeout(timer);
        sock.destroy();
        resolve(data.subarray(2, 2 + data.readUInt16BE(0)));
      }
    });
    sock.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

/**
 * Ask one server one question. Throws DnsTimeout when it does not answer in
 * time; any other throw is a network or parse failure.
 */
export async function query(
  server: string,
  name: string,
  type: string,
  {
    recursive = true,
    timeoutMs = 3000,
    ecs,
  }: { recursive?: boolean; timeoutMs?: number; ecs?: string } = {},
): Promise<DnsMessage> {
  const id = randomInt(0, 0xffff);
  const packet = buildQuery(id, name, type, recursive, ecs);
  const started = Date.now();
  const msg = parse(await overUdp(server, packet, id, timeoutMs));
  if (!msg.tc) return msg;
  const left = Math.max(800, timeoutMs - (Date.now() - started));
  try {
    return parse(await overTcp(server, packet, left));
  } catch {
    // TCP refused or too slow: the cut-short UDP answer (tc still set) is
    // better than nothing — the caller decides what a partial answer proves.
    return msg;
  }
}
