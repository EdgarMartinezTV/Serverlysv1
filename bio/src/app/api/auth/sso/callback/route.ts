import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchange, ssoEnabled } from "@/lib/server/sso";
import { createSession } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { safeEqual } from "@/lib/server/crypto";
import { env } from "@/lib/server/env";

/**
 * Account linking rules: an existing link (ssoSubject) wins; otherwise a
 * VERIFIED Serverlys email links to the matching Bio account; otherwise a new
 * Bio account is created. An unverified provider email never links to an
 * existing account (that would let anyone claim it).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fail = (m: string) => NextResponse.redirect(new URL(`/login?sso_error=${encodeURIComponent(m)}`, url));
  if (!ssoEnabled()) return fail("Serverlys sign-in isn't enabled.");
  const jar = await cookies();
  const raw = jar.get("sbio_sso")?.value;
  jar.delete({ name: "sbio_sso", path: "/api/auth/sso" });
  if (!raw) return fail("Your sign-in session expired. Try again.");
  const st = JSON.parse(raw) as { v: string; s: string; n: string };
  if (!safeEqual(url.searchParams.get("state") ?? "", st.s)) return fail("Sign-in state mismatch. Try again.");
  const code = url.searchParams.get("code");
  if (!code) return fail(url.searchParams.get("error_description") ?? "Sign-in was cancelled.");

  try {
    const p = await exchange(code, st.v);
    let user = await db.user.findUnique({ where: { ssoSubject: p.sub } });
    if (!user && p.emailVerified) {
      const byEmail = await db.user.findUnique({ where: { email: p.email } });
      if (byEmail) user = await db.user.update({ where: { id: byEmail.id }, data: { ssoSubject: p.sub, emailVerifiedAt: byEmail.emailVerifiedAt ?? new Date() } });
    }
    if (!user) {
      if (await db.user.findUnique({ where: { email: p.email } })) return fail("An account with this email exists. Log in with your password, then link Serverlys from settings.");
      user = await db.user.create({
        data: { email: p.email, name: p.name, ssoSubject: p.sub, emailVerifiedAt: p.emailVerified ? new Date() : null, role: env.adminEmails.includes(p.email) ? "ADMIN" : "USER" },
      });
    }
    if (user.status === "SUSPENDED") return fail("This account is suspended.");
    await createSession(user.id);
    return NextResponse.redirect(new URL(st.n || "/dashboard", url));
  } catch (err) {
    console.error("SSO callback", err);
    return fail("Couldn't complete Serverlys sign-in. Try again.");
  }
}
