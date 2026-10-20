import "server-only";
import { headers } from "next/headers";

/** Client IP as seen through Traefik (first X-Forwarded-For hop). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "").trim() || "0.0.0.0";
}

export async function userAgent(): Promise<string> {
  return (await headers()).get("user-agent") ?? "";
}

export function ipFromRequest(req: Request): string {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "").trim() || "0.0.0.0";
}

/**
 * CSRF guard for JSON route handlers. Server Actions check Origin themselves;
 * route handlers do not, so every mutating handler calls this. Cookies are
 * also SameSite=Lax, which is the second layer.
 */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") === "same-origin";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
