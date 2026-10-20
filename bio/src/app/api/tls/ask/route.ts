import { db } from "@/lib/server/db";
import { normalizeHost } from "@/lib/server/domains";

/**
 * On-demand TLS gate (Caddy `on_demand_tls { ask … }` contract): 200 only for
 * VERIFIED customer domains, so nobody can make the edge request certificates
 * for hosts we don't serve. See DEPLOY.md → Custom domains.
 */
export async function GET(req: Request) {
  const host = normalizeHost(new URL(req.url).searchParams.get("domain") ?? "");
  if (!host) return new Response("bad domain", { status: 400 });
  const d = await db.domain.findUnique({ where: { hostname: host }, select: { status: true } });
  return d?.status === "VERIFIED" ? new Response("ok") : new Response("unknown domain", { status: 404 });
}
