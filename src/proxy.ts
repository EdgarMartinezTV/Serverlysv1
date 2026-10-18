import { NextResponse, type NextRequest } from "next/server";

/**
 * Markdown content negotiation for AI agents.
 *
 * A GET/HEAD for a page whose Accept header asks for `text/markdown` (and does
 * not prefer HTML) is rewritten to /agent-md/<path>, which returns the same page
 * as Markdown. Browsers never send that Accept value, so every human request
 * passes straight through untouched.
 */
export function proxy(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";
  if (!/text\/markdown/i.test(accept)) return NextResponse.next();
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  url.pathname = `/agent-md${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Pages only: not APIs, Next internals, the markdown route itself, or files with an extension.
  matcher: ["/((?!api/|_next/|agent-md|mcp|\\.well-known/|.*\\.[a-zA-Z0-9]+$).*)"],
};
