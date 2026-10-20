import "server-only";
import { createHash } from "node:crypto";
import { env } from "./env";
import { randomToken } from "./crypto";

/**
 * "Sign in with Serverlys" — OpenID Connect against the Serverlys account
 * system (WHMCS ships an OIDC provider: Setup → OpenID Connect). Off unless
 * SERVERLYS_OIDC_ISSUER / _CLIENT_ID / _CLIENT_SECRET are set, so a missing
 * config never shows a broken button. A Serverlys hosting purchase is never
 * required: any Serverlys account can sign in, and email/password sign-up
 * works without one.
 */

export function ssoEnabled(): boolean {
  const o = env.oidc;
  return Boolean(o.issuer && o.clientId && o.clientSecret);
}

type Discovery = { authorization_endpoint: string; token_endpoint: string; userinfo_endpoint: string; issuer: string };
let cached: { at: number; d: Discovery } | null = null;

export async function discovery(): Promise<Discovery> {
  if (cached && Date.now() - cached.at < 3600e3) return cached.d;
  const url = process.env.SERVERLYS_OIDC_DISCOVERY_URL || `${env.oidc.issuer.replace(/\/$/, "")}/.well-known/openid-configuration`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`OIDC discovery failed (${res.status})`);
  const d = (await res.json()) as Discovery;
  cached = { at: Date.now(), d };
  return d;
}

export function redirectUri() {
  return `${env.appUrl}/api/auth/sso/callback`;
}

export function pkce() {
  const verifier = randomToken(32);
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge, state: randomToken(16), nonce: randomToken(16) };
}

export type SsoProfile = { sub: string; email: string; emailVerified: boolean; name: string };

export async function exchange(code: string, verifier: string): Promise<SsoProfile> {
  const d = await discovery();
  const body = new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri(), code_verifier: verifier, client_id: env.oidc.clientId, client_secret: env.oidc.clientSecret });
  const tok = await fetch(d.token_endpoint, { method: "POST", body, headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" }, signal: AbortSignal.timeout(10000) });
  if (!tok.ok) throw new Error(`Token exchange failed (${tok.status})`);
  const { access_token } = (await tok.json()) as { access_token: string };
  const info = await fetch(d.userinfo_endpoint, { headers: { authorization: `Bearer ${access_token}` }, signal: AbortSignal.timeout(10000) });
  if (!info.ok) throw new Error(`Userinfo failed (${info.status})`);
  const u = (await info.json()) as { sub: string; email?: string; email_verified?: boolean; name?: string; given_name?: string; family_name?: string };
  if (!u.sub || !u.email) throw new Error("The Serverlys account returned no email address.");
  return { sub: String(u.sub), email: u.email.toLowerCase(), emailVerified: u.email_verified !== false, name: u.name ?? [u.given_name, u.family_name].filter(Boolean).join(" ") };
}
