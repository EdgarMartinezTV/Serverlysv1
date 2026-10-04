import { NextResponse } from "next/server";

/**
 * Liveness probe for the container HEALTHCHECK and external uptime monitors.
 *
 * Deliberately touches nothing upstream — no OpenAI, no registry, no WHMCS. A
 * health check that fails when a third party is slow restarts a healthy
 * container for someone else's outage. What it proves is that the Node process
 * is up and its event loop is answering, which is exactly what a hung or
 * crashed server cannot do.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { ok: true, uptimeSeconds: Math.round(process.uptime()) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
