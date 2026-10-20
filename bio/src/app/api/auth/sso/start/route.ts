import { NextResponse } from "next/server";
import { discovery, pkce, redirectUri, ssoEnabled } from "@/lib/server/sso";
import { env } from "@/lib/server/env";
import { safeNext } from "@/lib/server/auth";

export async function GET(req: Request) {
  if (!ssoEnabled()) return NextResponse.redirect(new URL("/login", req.url));
  const d = await discovery();
  const p = pkce();
  const next = safeNext(new URL(req.url).searchParams.get("next"));
  const url = new URL(d.authorization_endpoint);
  url.search = new URLSearchParams({ response_type: "code", client_id: env.oidc.clientId, redirect_uri: redirectUri(), scope: "openid profile email", state: p.state, nonce: p.nonce, code_challenge: p.challenge, code_challenge_method: "S256" }).toString();
  const res = NextResponse.redirect(url);
  res.cookies.set("sbio_sso", JSON.stringify({ v: p.verifier, s: p.state, n: next }), { httpOnly: true, secure: env.isProd, sameSite: "lax", path: "/api/auth/sso", maxAge: 600 });
  return res;
}
