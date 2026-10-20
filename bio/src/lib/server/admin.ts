import "server-only";
import { db } from "./db";
import { env } from "./env";
import { storage } from "./storage";

/**
 * Read models for the admin area. Every function here is called only from
 * pages under app/(app)/admin, whose layout runs requireAdmin(); mutations
 * live in lib/actions/admin.ts and re-check the role themselves.
 */

const DAY = 864e5;

export async function platformOverview() {
  const now = Date.now();
  const d7 = new Date(now - 7 * DAY);
  const d30 = new Date(now - 30 * DAY);
  const [users, users7, users30, byStatus, events, leads30, openReports, storageAgg, emails, series] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: d7 } } }),
    db.user.count({ where: { createdAt: { gte: d30 } } }),
    db.bioPage.groupBy({ by: ["status"], _count: { _all: true } }),
    db.analyticsEvent.groupBy({ by: ["type"], where: { createdAt: { gte: d30 } }, _count: { _all: true } }),
    db.lead.count({ where: { createdAt: { gte: d30 } } }),
    db.report.count({ where: { status: "OPEN" } }),
    db.asset.aggregate({ _sum: { bytes: true }, _count: { _all: true } }),
    db.outboundEmail.groupBy({ by: ["status"], where: { createdAt: { gte: d7 } }, _count: { _all: true } }),
    db.$queryRaw<Array<{ day: Date; views: bigint; uniques: bigint; clicks: bigint }>>`
      SELECT date_trunc('day', "createdAt" AT TIME ZONE 'UTC') AS day,
        COUNT(*) FILTER (WHERE type = 'VIEW') AS views,
        COUNT(DISTINCT "visitorHash") FILTER (WHERE type = 'VIEW') AS uniques,
        COUNT(*) FILTER (WHERE type = 'CLICK') AS clicks
      FROM "AnalyticsEvent" WHERE "createdAt" >= ${d30} GROUP BY 1 ORDER BY 1`,
  ]);
  const status = Object.fromEntries(byStatus.map((s) => [s.status, s._count._all])) as Record<string, number>;
  const ev = Object.fromEntries(events.map((e) => [e.type, e._count._all])) as Record<string, number>;
  const em = Object.fromEntries(emails.map((e) => [e.status, e._count._all])) as Record<string, number>;
  const byDay = new Map(series.map((r) => [r.day.toISOString().slice(0, 10), r]));
  const filled = [];
  const start = Date.UTC(d30.getUTCFullYear(), d30.getUTCMonth(), d30.getUTCDate());
  for (let t = start; t <= now; t += DAY) {
    const k = new Date(t).toISOString().slice(0, 10);
    const r = byDay.get(k);
    filled.push({ date: k, views: Number(r?.views ?? 0), uniques: Number(r?.uniques ?? 0), clicks: Number(r?.clicks ?? 0) });
  }
  return {
    users,
    users7,
    users30,
    pages: { DRAFT: status.DRAFT ?? 0, PUBLISHED: status.PUBLISHED ?? 0, UNPUBLISHED: status.UNPUBLISHED ?? 0, SUSPENDED: status.SUSPENDED ?? 0 },
    views30: ev.VIEW ?? 0,
    clicks30: ev.CLICK ?? 0,
    leads30,
    openReports,
    storageBytes: storageAgg._sum.bytes ?? 0,
    assetCount: storageAgg._count._all,
    emails7: { SENT: em.SENT ?? 0, LOGGED: em.LOGGED ?? 0, FAILED: em.FAILED ?? 0 },
    series: filled,
  };
}

export async function serviceHealth() {
  const t0 = performance.now();
  let dbOk = true;
  let dbError = "";
  try {
    await db.$queryRaw`SELECT 1`;
  } catch (e) {
    dbOk = false;
    dbError = String(e).slice(0, 200);
  }
  const dbMs = Math.round(performance.now() - t0);

  const driver = process.env.S3_BUCKET ? "s3" : "local";
  let storageOk = false;
  let storageError = "";
  const s0 = performance.now();
  try {
    const key = "health/probe.txt";
    const body = Buffer.from(`probe ${Date.now()}`);
    await storage().put(key, body, "text/plain");
    const back = await storage().get(key);
    await storage().remove(key);
    storageOk = Boolean(back && back.equals(body));
    if (!storageOk) storageError = "Read-back did not match what was written";
  } catch (e) {
    storageError = String(e).slice(0, 200);
  }
  const storageMs = Math.round(performance.now() - s0);

  const hourAgo = new Date(Date.now() - 3600e3);
  const [eventsHour, failedEmails] = await Promise.all([
    dbOk ? db.analyticsEvent.count({ where: { createdAt: { gte: hourAgo } } }) : Promise.resolve(0),
    dbOk ? db.outboundEmail.findMany({ where: { status: "FAILED" }, orderBy: { createdAt: "desc" }, take: 10, select: { id: true, to: true, subject: true, error: true, createdAt: true } }) : Promise.resolve([]),
  ]);

  return {
    db: { ok: dbOk, ms: dbMs, error: dbError },
    redis: { configured: Boolean(env.redisUrl) },
    storage: { driver, ok: storageOk, ms: storageMs, error: storageError, location: driver === "s3" ? process.env.S3_BUCKET : env.storageDir },
    email: { resendConfigured: Boolean(env.resendKey), from: env.emailFrom },
    eventsHour,
    failedEmails,
    node: process.version,
    uptimeSec: Math.round(process.uptime()),
    env: process.env.NODE_ENV ?? "",
  };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}
