import "server-only";
import { NextResponse } from "next/server";
import { getUser, type SessionUser } from "./auth";
import { sameOrigin } from "./request";
import { PageError } from "./pages";
import { UploadError } from "./uploads";

/**
 * Wrapper for JSON route handlers used by the editor: session required,
 * same-origin required for anything that changes state (CSRF), and typed
 * errors turned into JSON responses instead of 500s.
 */
export function withUser<C>(handler: (req: Request, user: SessionUser, ctx: C) => Promise<Response | object>) {
  return async (req: Request, ctx: C) => {
    if (req.method !== "GET" && req.method !== "HEAD" && !sameOrigin(req)) return NextResponse.json({ error: "Cross-site request blocked" }, { status: 403 });
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Your session has ended. Log in again." }, { status: 401 });
    try {
      const out = await handler(req, user, ctx);
      return out instanceof Response ? out : NextResponse.json(out);
    } catch (err) {
      if (err instanceof PageError) return NextResponse.json({ error: err.message, issues: err.issues }, { status: err.status });
      if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: 400 });
      console.error(err);
      return NextResponse.json({ error: "Something went wrong on our side. Try again." }, { status: 500 });
    }
  };
}

export type IdCtx = { params: Promise<{ id: string }> };
