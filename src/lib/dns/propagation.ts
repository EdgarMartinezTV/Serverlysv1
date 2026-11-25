import "server-only";
import { DNS_SERVERS, type DnsServer } from "./servers";
import { DnsTimeout, RCODE, query, type DnsMessage, type RR, type RecordType } from "./wire";
import { lookupWhois } from "@/lib/domains/whois";

/**
 * DNS propagation check.
 *
 * 1. THE TRUTH. Walk the delegation ourselves, from the TLD's servers down to
 *    the domain's own nameservers, asking non-recursively. That gives the
 *    records as they are right now, with no cache in the way — a recursive
 *    resolver could hand us a stale copy, which is the very thing we measure.
 * 2. THE WORLD. Ask every resolver in servers.ts at once, recursively, the way
 *    a visitor's computer would.
 * 3. Compare. A resolver is "live" when it returns exactly the current set.
 */

export type RowStatus = "live" | "notLive" | "timedOut" | "failed";
export type AnswerKind = "records" | "noRecords" | "notFoundYet" | "noResponse" | "serverError";
export type Outcome = "propagating" | "noAnswers" | "allFailed" | "noRecords" | "notPublished";
export type CheckState = "completed" | "notFound" | "notRegistered" | "noNameservers";

export type Row = {
  id: string;
  ip: string;
  provider: string;
  city: string;
  country: string;
  cc: string;
  lat: number;
  lon: number;
  status: RowStatus;
  answer: { kind: AnswerKind; values: string[] };
  /** Seconds this server may keep its copy; null when it did not say. */
  ttl: number | null;
  ms: number;
};

export type CurrentRecords = {
  /** The domain is a CNAME and the type asked is not: live = follows it here. */
  cname: string | null;
  records: { value: string; ttl: number }[];
  /** Nameserver that answered, e.g. ns1.example.com. */
  source: string | null;
  nameservers: string[];
  /** The domain's nameservers answer differently by location or over time. */
  dynamic: boolean;
};

export type CheckResult = {
  domain: string;
  type: RecordType;
  state: CheckState;
  checkedAt: string;
  current: CurrentRecords | null;
  rows: Row[];
  summary: {
    total: number;
    counts: Record<RowStatus, number>;
    outcome: Outcome | null;
  };
};

/** Recursive resolvers we use only to find nameserver addresses. */
const HELPERS = ["1.1.1.1", "8.8.8.8", "9.9.9.9"];

async function viaHelpers(name: string, type: string): Promise<DnsMessage | null> {
  for (const ip of HELPERS) {
    try {
      return await query(ip, name, type, { timeoutMs: 2500 });
    } catch {
      /* next */
    }
  }
  return null;
}

async function addressesOf(hosts: string[], limit = 3): Promise<string[]> {
  const out = await Promise.all(
    hosts.slice(0, limit).map(async (h) => {
      const m = await viaHelpers(h, "A");
      return m?.answers.filter((r) => r.type === "A").map((r) => r.value) ?? [];
    }),
  );
  return out.flat();
}

/** TLD nameserver addresses, cached for six hours — they almost never change. */
const tldCache = new Map<string, { ips: string[]; at: number }>();
async function tldServers(tld: string): Promise<string[]> {
  const hit = tldCache.get(tld);
  if (hit && Date.now() - hit.at < 6 * 3600_000) return hit.ips;
  const m = await viaHelpers(tld, "NS");
  const hosts = m?.answers.filter((r) => r.type === "NS").map((r) => r.value) ?? [];
  const ips = await addressesOf(hosts, 4);
  if (ips.length) tldCache.set(tld, { ips, at: Date.now() });
  return ips;
}

/**
 * Ask servers in turn until one gives a usable answer (NOERROR or NXDOMAIN).
 * REFUSED/SERVFAIL from one nameserver is a reason to try the next, not an
 * answer — a lame server is common and says nothing about the domain.
 */
async function askAny(ips: string[], name: string, type: string): Promise<{ m: DnsMessage; ip: string } | null> {
  for (const ip of ips.slice(0, 4)) {
    try {
      const m = await query(ip, name, type, { recursive: false, timeoutMs: 2000 });
      if (m.rcode === RCODE.NOERROR || m.rcode === RCODE.NXDOMAIN) return { m, ip };
    } catch {
      /* next */
    }
  }
  return null;
}

const isUnder = (child: string, parent: string) => child === parent || child.endsWith(`.${parent}`);

type Authoritative =
  | { kind: "answer"; records: RR[]; cname: RR | null; source: string | null; nameservers: string[]; authIp: string | null }
  | { kind: "nxdomain"; registryLevel: boolean; zone: string }
  | { kind: "unreachable"; registryLevel: boolean; nameservers: string[] };

async function authoritative(name: string, type: RecordType): Promise<Authoritative> {
  const tld = name.split(".").pop()!;
  let servers = await tldServers(tld);
  let zone = tld;
  let level = 0;
  let nameservers: string[] = [];
  let source: string | null = null;
  let ipToHost = new Map<string, string>();

  for (let hop = 0; hop < 10; hop++) {
    const got = await askAny(servers, name, type);
    if (!got) return { kind: "unreachable", registryLevel: level === 0, nameservers };
    const m = got.m;
    source = ipToHost.get(got.ip) ?? (level > 0 ? got.ip : null);

    if (m.rcode === RCODE.NXDOMAIN) {
      const soa = m.authority.find((r) => r.type === "SOA");
      return { kind: "nxdomain", registryLevel: level === 0, zone: soa?.name ?? zone };
    }

    const cname = m.answers.find((r) => r.type === "CNAME" && r.name === name) ?? null;
    if (m.aa || m.answers.length) {
      const records = m.answers.filter((r) => r.type === type && r.name === name);
      return {
        kind: "answer",
        records,
        cname: type !== "CNAME" ? cname : null,
        source,
        nameservers,
        authIp: got.ip,
      };
    }

    const ns = m.authority.filter((r) => r.type === "NS");
    const cut = ns[0]?.name;
    if (!cut || !isUnder(name, cut) || cut.length <= zone.length) {
      // Neither an answer nor a referral further down: the zone has nothing.
      return { kind: "answer", records: [], cname: null, source, nameservers, authIp: got.ip };
    }
    zone = cut;
    level++;
    nameservers = [...new Set(ns.map((r) => r.value))];
    const glue = m.additional.filter((r) => r.type === "A" && nameservers.includes(r.name));
    ipToHost = new Map(glue.map((r) => [r.value, r.name]));
    servers = glue.map((r) => r.value);
    if (!servers.length) {
      for (const host of nameservers.slice(0, 3)) {
        for (const ip of await addressesOf([host], 1)) {
          servers.push(ip);
          ipToHost.set(ip, host);
        }
      }
    }
    if (!servers.length) return { kind: "unreachable", registryLevel: false, nameservers };
  }
  return { kind: "unreachable", registryLevel: false, nameservers };
}

/* ── Comparing one resolver's answer to the truth ───────────────────────── */

const norm = (values: string[]) => [...new Set(values)].sort();
const same = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

async function ask(server: DnsServer, name: string, type: RecordType, expected: string[], viaCname: boolean, nx: boolean): Promise<Row> {
  const base = {
    id: server.id, ip: server.ip, provider: server.provider, city: server.city,
    country: server.country, cc: server.cc, lat: server.lat, lon: server.lon,
  };
  const started = Date.now();
  let m: DnsMessage;
  try {
    // UDP drops packets now and then; one quick resend separates a lost
    // packet from a server that is really not answering. 4.5s at most.
    m = await query(server.ip, name, type, { timeoutMs: 2500 }).catch((err) => {
      if (err instanceof DnsTimeout) return query(server.ip, name, type, { timeoutMs: 2000 });
      throw err;
    });
  } catch (err) {
    const ms = Date.now() - started;
    return err instanceof DnsTimeout
      ? { ...base, status: "timedOut", answer: { kind: "noResponse", values: [] }, ttl: null, ms }
      : { ...base, status: "failed", answer: { kind: "serverError", values: [] }, ttl: null, ms };
  }
  const ms = Date.now() - started;
  const negTtl = m.authority.find((r) => r.type === "SOA")?.ttl ?? null;

  if (m.rcode === RCODE.NXDOMAIN) {
    return { ...base, status: nx ? "live" : "notLive", answer: { kind: "notFoundYet", values: [] }, ttl: negTtl, ms };
  }
  if (m.rcode !== RCODE.NOERROR) {
    return { ...base, status: "failed", answer: { kind: "serverError", values: [] }, ttl: null, ms };
  }

  const relevant = viaCname
    ? m.answers.filter((r) => r.type === "CNAME" && r.name === name)
    : m.answers.filter((r) => r.type === type);
  // When the name is not a CNAME but the resolver followed one anyway (or the
  // answer is a chain), what matters is the final set of the asked type.
  const values = norm(relevant.map((r) => r.value));
  if (!values.length && m.tc) {
    // Truncated with nothing usable in it: we cannot tell what it holds.
    return { ...base, status: "failed", answer: { kind: "serverError", values: [] }, ttl: null, ms };
  }
  if (!values.length) {
    return {
      ...base,
      status: expected.length === 0 && !nx ? "live" : "notLive",
      answer: { kind: "noRecords", values: [] },
      ttl: negTtl,
      ms,
    };
  }
  const ttl = Math.min(...relevant.map((r) => r.ttl));
  // A truncated answer (too big for one packet, TCP refused) holds only part
  // of the set. If every record in that part is current, the server has the
  // current records; it just could not send them all.
  const partialButCurrent = m.tc && values.every((v) => expected.includes(v));
  return {
    ...base,
    status: same(values, expected) || partialButCurrent ? "live" : "notLive",
    answer: { kind: "records", values },
    ttl,
    ms,
  };
}

function summarise(rows: Row[], expectedEmpty: boolean, registeredButHidden: boolean): CheckResult["summary"] {
  const counts: Record<RowStatus, number> = { live: 0, notLive: 0, timedOut: 0, failed: 0 };
  for (const r of rows) counts[r.status]++;
  let outcome: Outcome = "propagating";
  if (registeredButHidden) outcome = "notPublished";
  else if (counts.live + counts.notLive + counts.failed === 0) outcome = "noAnswers";
  else if (counts.live + counts.notLive === 0) outcome = "allFailed";
  else if (expectedEmpty && counts.notLive === 0) outcome = "noRecords";
  return { total: rows.length, counts, outcome };
}

const emptySummary = (): CheckResult["summary"] => ({
  total: DNS_SERVERS.length,
  counts: { live: 0, notLive: 0, timedOut: 0, failed: 0 },
  outcome: null,
});

/*
 * Many visitors checking the same name at once (a launch, a shared link) would
 * each send ~50 queries to the same resolvers. Identical checks within 5
 * seconds share one run, so the resolvers see the load of one visitor.
 */
const recent = new Map<string, { at: number; run: Promise<CheckResult> }>();

export function checkPropagation(name: string, type: RecordType): Promise<CheckResult> {
  const key = `${name}|${type}`;
  const hit = recent.get(key);
  if (hit && Date.now() - hit.at < 5000) return hit.run;
  const run = runCheck(name, type);
  recent.set(key, { at: Date.now(), run });
  run.catch(() => recent.delete(key));
  if (recent.size > 500) {
    for (const [k, v] of recent) if (Date.now() - v.at > 5000) recent.delete(k);
  }
  return run;
}

async function runCheck(name: string, type: RecordType): Promise<CheckResult> {
  const checkedAt = () => new Date().toISOString();
  const auth = await authoritative(name, type);

  if (auth.kind === "unreachable") {
    if (auth.registryLevel) throw new Error("registry unreachable");
    return { domain: name, type, state: "noNameservers", checkedAt: checkedAt(), current: null, rows: [], summary: emptySummary() };
  }

  let notPublished = false;
  if (auth.kind === "nxdomain") {
    if (!auth.registryLevel) {
      return { domain: name, type, state: "notFound", checkedAt: checkedAt(), current: null, rows: [], summary: emptySummary() };
    }
    // The registry has no delegation. Registered-but-on-hold, or free?
    const suffixLabels = auth.zone.split(".").length;
    const registrable = name.split(".").slice(-(suffixLabels + 1)).join(".");
    const whois = await lookupWhois(registrable).catch(() => null);
    if (whois?.status === "available") {
      return { domain: name, type, state: "notRegistered", checkedAt: checkedAt(), current: null, rows: [], summary: emptySummary() };
    }
    if (whois?.status !== "registered") {
      return { domain: name, type, state: "notFound", checkedAt: checkedAt(), current: null, rows: [], summary: emptySummary() };
    }
    notPublished = true;
  }

  const current: CurrentRecords =
    auth.kind === "answer"
      ? {
          cname: auth.cname?.value ?? null,
          records: auth.cname
            ? [{ value: auth.cname.value, ttl: auth.cname.ttl }]
            : norm(auth.records.map((r) => r.value)).map((value) => ({
                value,
                ttl: auth.records.find((r) => r.value === value)!.ttl,
              })),
          source: auth.source,
          nameservers: auth.nameservers,
          dynamic: false,
        }
      : { cname: null, records: [], source: null, nameservers: [], dynamic: false };

  const expected = current.records.map((r) => r.value);
  const viaCname = current.cname !== null;
  const rows = await Promise.all(DNS_SERVERS.map((s) => ask(s, name, type, expected, viaCname, notPublished)));

  /*
   * Geo-routed and rotating domains (CDNs, Google, Facebook…). Their own
   * nameservers give different answers depending on who asks and when, so
   * "returns exactly our set" is meaningless — no two servers ever would.
   * Detect it by asking the domain's nameserver as clients in three
   * continents (EDNS Client Subnet) and once more plainly; if the answers
   * vary, the domain is dynamic, and any server that returns records of the
   * type is live. The page says so in plain words when this applies.
   */
  const authIp = auth.kind === "answer" ? auth.authIp : null;
  let dynamic = false;
  if (authIp && !viaCname && expected.length && rows.some((r) => r.status === "notLive" && r.answer.kind === "records")) {
    const samples = await Promise.all(
      ["", "8.8.8.0", "81.2.69.0", "1.0.175.0"].map((ecs) =>
        query(authIp, name, type, { recursive: false, timeoutMs: 2000, ecs: ecs || undefined })
          .then((m) => norm(m.answers.filter((x) => x.type === type).map((x) => x.value)))
          .catch(() => null),
      ),
    );
    const sets = samples.filter((x): x is string[] => x !== null);
    dynamic = sets.some((set) => !same(set, expected));
    if (dynamic) {
      for (const r of rows) if (r.status === "notLive" && r.answer.kind === "records") r.status = "live";
    }
  }
  current.dynamic = dynamic;

  return {
    domain: name,
    type,
    state: "completed",
    checkedAt: checkedAt(),
    current,
    rows,
    summary: summarise(rows, expected.length === 0, notPublished),
  };
}

/* ── Input ──────────────────────────────────────────────────────────────── */

const LABEL = /^(?!-)[a-z0-9_-]{1,63}(?<!-)$/;

/**
 * A hostname, not a registrable domain: "www." and "_sip._tcp." are kept,
 * because the record being checked may live exactly there.
 */
export function parseHostname(raw: string): { ok: true; name: string } | { ok: false; message: string } {
  let v = raw.trim().toLowerCase();
  if (!v) return { ok: false, message: "Enter a domain, like example.com" };
  v = v.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").split(/[/?#]/)[0].replace(/:\d+$/, "").replace(/\.+$/, "");
  if (/[^\x00-\x7f]/.test(v)) {
    try {
      v = new URL(`http://${v}`).hostname;
    } catch {
      return { ok: false, message: "Enter a valid domain, like example.com" };
    }
  }
  const labels = v.split(".");
  if (v.length > 253 || labels.length < 2 || !labels.every((l) => LABEL.test(l)) || !/^[a-z][a-z0-9-]*$/.test(labels.at(-1)!)) {
    return { ok: false, message: "Enter a valid domain, like example.com" };
  }
  return { ok: true, name: v };
}
