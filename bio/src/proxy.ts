import { NextResponse, type NextRequest } from "next/server";

/**
 * Host routing.
 *
 *  · The app host (bio.serverlys.com, localhost) is served as-is.
 *  · Any OTHER host is a customer's custom domain: "/" is rewritten to
 *    /cd/<host>, which renders the page bound to that verified domain.
 *    Assets, the click redirect, tracking and lead endpoints pass through
 *    untouched so the page works on its own domain; everything else 404s
 *    rather than exposing the dashboard on a customer's hostname.
 */
const APP_HOSTS = new Set(
  [process.env.APP_URL ? new URL(process.env.APP_URL).host : "", "localhost:3200", "127.0.0.1:3200", ...(process.env.EXTRA_APP_HOSTS ?? "").split(",")]
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean),
);

const PASS_THROUGH = /^\/(_next|go|media|api\/(track|leads|vcard|og)|favicon\.ico|robots\.txt)(\/|$)/;

export function proxy(request: NextRequest) {
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").toLowerCase();
  if (!host || APP_HOSTS.has(host) || host.endsWith(".localhost:3200")) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (PASS_THROUGH.test(pathname)) return NextResponse.next();
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/cd/${encodeURIComponent(host.replace(/:\d+$/, ""))}`;
    const res = NextResponse.rewrite(url);
    // Lets the Domains screen confirm HTTPS really reaches this app.
    res.headers.set("x-serverlys-bio", "1");
    return res;
  }
  return new NextResponse("Not found", { status: 404 });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
