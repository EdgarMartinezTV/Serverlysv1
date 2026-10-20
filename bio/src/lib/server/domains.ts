import "server-only";
import { promises as dns } from "node:dns";
import { db } from "./db";
import { env } from "./env";
import { randomToken } from "./crypto";
import { PageError, ownedPage } from "./pages";
import { invalidateHost } from "./public-pages";
import { audit } from "./audit";

/**
 * Customer-owned domains (free — connecting a domain you own never needs a
 * Serverlys subscription).
 *
 * Ownership: a TXT record `_serverlys-bio.<host>` = the issued token.
 * Routing:   an A record to our edge IP, or a CNAME to bio.serverlys.com.
 * Both must pass for VERIFIED; only VERIFIED hosts are served (src/proxy.ts)
 * and only they are allowed a certificate (GET /api/tls/ask).
 */

export const MAX_DOMAINS_PER_PAGE = 10;
const BLOCKED = /(^|\.)(serverlys\.com|serverlys\.net|convoai\.cloud|localhost|local|internal|example\.(com|net|org))$/;

export function normalizeHost(raw: string): string | null {
  let h = raw.trim().toLowerCase();
  h = h.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/\.$/, "");
  if (h.length > 253 || !/^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/.test(h)) return null;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return null;
  if (!/\.[a-z]{2,63}$/.test(h) && !/\.xn--[a-z0-9-]+$/.test(h)) return null;
  return h;
}

export async function addDomain(userId: string, pageId: string, raw: string) {
  await ownedPage(userId, pageId);
  const hostname = normalizeHost(raw);
  if (!hostname) throw new PageError("Enter a domain like links.yourbusiness.com");
  if (BLOCKED.test(hostname)) throw new PageError("That domain can't be connected.");
  if ((await db.domain.count({ where: { pageId } })) >= MAX_DOMAINS_PER_PAGE) throw new PageError(`That's ${MAX_DOMAINS_PER_PAGE} domains on one page — our anti-abuse safeguard. Email support@serverlys.com if you need more; it's free.`);
  const existing = await db.domain.findUnique({ where: { hostname } });
  if (existing) throw new PageError(existing.pageId === pageId ? "Already added." : "That domain is connected to another page. If it's yours, remove it there first.");
  const d = await db.domain.create({ data: { pageId, hostname, verificationToken: `sbio-${randomToken(16)}` } });
  await audit(userId, "domain.add", "domain", d.id, { hostname });
  return d;
}

type Check = { txt: boolean; routing: boolean; detail: string[] };

async function inspect(hostname: string, token: string): Promise<Check> {
  const detail: string[] = [];
  let txt = false;
  try {
    const records = (await dns.resolveTxt(`_serverlys-bio.${hostname}`)).map((r) => r.join(""));
    txt = records.includes(token);
    if (!txt) detail.push(`TXT _serverlys-bio.${hostname} found but doesn't match (${records.slice(0, 2).join(", ")})`);
  } catch {
    detail.push(`No TXT record at _serverlys-bio.${hostname} yet`);
  }
  let routing = false;
  try {
    const cname = await dns.resolveCname(hostname);
    routing = cname.some((c) => c.replace(/\.$/, "").toLowerCase() === env.domainTargetHost);
    if (!routing) detail.push(`CNAME points to ${cname.join(", ")}, expected ${env.domainTargetHost}`);
  } catch {
    try {
      const a = await dns.resolve4(hostname);
      routing = a.includes(env.domainTargetIp);
      if (!routing) detail.push(`A record is ${a.join(", ")}, expected ${env.domainTargetIp}`);
    } catch {
      detail.push(`No A or CNAME record for ${hostname} yet`);
    }
  }
  return { txt, routing, detail };
}

export async function verifyDomain(userId: string | null, domainId: string) {
  const d = await db.domain.findUnique({ where: { id: domainId }, include: { page: { select: { ownerId: true } } } });
  if (!d || (userId && d.page.ownerId !== userId)) throw new PageError("Domain not found", 404);
  const c = await inspect(d.hostname, d.verificationToken);
  const ok = c.txt && c.routing;
  const updated = await db.domain.update({
    where: { id: d.id },
    data: { status: ok ? "VERIFIED" : d.status === "VERIFIED" ? "FAILED" : "PENDING", verifiedAt: ok ? (d.verifiedAt ?? new Date()) : d.verifiedAt, lastCheckedAt: new Date(), lastError: ok ? null : c.detail.join(" · ") },
  });
  if (updated.status !== d.status) {
    invalidateHost(d.hostname);
    if (userId) await audit(userId, `domain.${updated.status.toLowerCase()}`, "domain", d.id, { hostname: d.hostname });
  }
  return { ...updated, check: c };
}

/** Does the domain actually serve this page over HTTPS? (Certificate is live.) */
export async function checkHttps(hostname: string): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch(`https://${hostname}/`, { redirect: "manual", signal: AbortSignal.timeout(8000) });
    if (res.headers.get("x-serverlys-bio") === "1") return { ok: true, detail: "HTTPS certificate is active." };
    return { ok: false, detail: `Reached ${hostname} over HTTPS but it isn't serving this page yet (status ${res.status}).` };
  } catch (err) {
    return { ok: false, detail: `HTTPS isn't ready yet (${err instanceof Error ? err.message.slice(0, 80) : "connection failed"}). Certificates are issued within minutes of verification.` };
  }
}

export async function removeDomain(userId: string, domainId: string) {
  const d = await db.domain.findUnique({ where: { id: domainId }, include: { page: { select: { ownerId: true } } } });
  if (!d || d.page.ownerId !== userId) throw new PageError("Domain not found", 404);
  await db.domain.delete({ where: { id: d.id } });
  invalidateHost(d.hostname);
  await audit(userId, "domain.remove", "domain", d.id, { hostname: d.hostname });
}
