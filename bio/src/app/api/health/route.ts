import { db } from "@/lib/server/db";

/** Liveness + DB reachability for the container HEALTHCHECK and uptime monitor. */
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
