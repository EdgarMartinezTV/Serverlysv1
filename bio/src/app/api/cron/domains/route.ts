import { db } from "@/lib/server/db";
import { verifyDomain } from "@/lib/server/domains";
import { safeEqual } from "@/lib/server/crypto";

/**
 * Background re-verification. Call every ~15 min from a scheduler with
 * `Authorization: Bearer $CRON_SECRET`. Re-checks pending domains (so they
 * go live without the owner clicking "Check"), and verified ones daily so a
 * domain whose DNS moved away stops being served.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET ?? "";
  const got = (req.headers.get("authorization") ?? "").replace(/^Bearer /, "");
  if (!secret || !safeEqual(got, secret)) return new Response("unauthorized", { status: 401 });
  const dayAgo = new Date(Date.now() - 864e5);
  const due = await db.domain.findMany({
    where: { OR: [{ status: { in: ["PENDING", "FAILED"] }, createdAt: { gte: new Date(Date.now() - 14 * 864e5) } }, { status: "VERIFIED", OR: [{ lastCheckedAt: null }, { lastCheckedAt: { lt: dayAgo } }] }] },
    take: 200,
    select: { id: true },
  });
  let changed = 0;
  for (const d of due) {
    const before = await db.domain.findUnique({ where: { id: d.id }, select: { status: true } });
    const after = await verifyDomain(null, d.id).catch(() => null);
    if (after && before && after.status !== before.status) changed++;
  }
  return Response.json({ checked: due.length, changed });
}
