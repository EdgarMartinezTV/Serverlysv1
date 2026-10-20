import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hash as argonHash, verify as argonVerify } from "@node-rs/argon2";
import { db } from "./db";
import { env } from "./env";
import { ipHash, randomToken, sha256 } from "./crypto";
import { clientIp, userAgent } from "./request";
import { sendEmail } from "./email";
import type { User } from "@/generated/prisma/client";

export const SESSION_COOKIE = "sbio_session";
const SESSION_DAYS = 30;
/** Don't write lastSeenAt on every request — once per 10 minutes is plenty. */
const TOUCH_MS = 10 * 60 * 1000;

/* ── passwords ─────────────────────────────────────────────────────────── */

export const PASSWORD_MIN = 10;

export function passwordProblem(pw: string): string | null {
  if (pw.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters`;
  if (pw.length > 200) return "That password is too long";
  if (/^(.)\1+$/.test(pw)) return "Choose a less predictable password";
  return null;
}

export function hashPassword(pw: string): Promise<string> {
  // argon2id, OWASP-recommended parameters (19 MiB, 2 iterations).
  return argonHash(pw, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
}

export async function verifyPassword(stored: string | null, pw: string): Promise<boolean> {
  if (!stored) return false;
  try {
    return await argonVerify(stored, pw);
  } catch {
    return false;
  }
}

/** Used when the email is unknown, so timing does not reveal account existence. */
let dummyHash: Promise<string> | null = null;
export async function burnPasswordCheck(pw: string) {
  dummyHash ??= hashPassword(randomToken());
  await verifyPassword(await dummyHash, pw);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/* ── sessions ──────────────────────────────────────────────────────────── */

export async function createSession(userId: string): Promise<void> {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db.session.create({
    data: { tokenHash: sha256(token), userId, expiresAt, userAgent: (await userAgent()).slice(0, 300), ipHash: ipHash(await clientIp()) },
  });
  await db.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export type SessionUser = Pick<User, "id" | "email" | "name" | "role" | "status" | "emailVerifiedAt" | "marketingConsent" | "passwordHash"> & { sessionId: string };

/** The signed-in user for this request, or null. Memoised per request. */
export const getUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: { select: { id: true, email: true, name: true, role: true, status: true, emailVerifiedAt: true, marketingConsent: true, passwordHash: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  if (session.user.status === "SUSPENDED") return null;
  if (Date.now() - session.lastSeenAt.getTime() > TOUCH_MS) {
    await db.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } }).catch(() => {});
  }
  return { ...session.user, sessionId: session.id };
});

/** For pages: redirect to login when signed out. */
export async function requireUser(next?: string): Promise<SessionUser> {
  const user = await getUser();
  if (!user) redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return user;
}

export async function requireVerifiedUser(next?: string): Promise<SessionUser> {
  const user = await requireUser(next);
  if (!user.emailVerifiedAt) redirect("/verify-email");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser("/admin");
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: sha256(token) } });
  jar.delete(SESSION_COOKIE);
}

/* ── one-time tokens (verify email, reset password) ───────────────────── */

export async function issueToken(userId: string, type: "EMAIL_VERIFY" | "PASSWORD_RESET"): Promise<string> {
  const token = randomToken();
  const ttl = type === "EMAIL_VERIFY" ? 48 * 3600e3 : 3600e3;
  // A new link invalidates older unused ones of the same kind.
  await db.verificationToken.updateMany({ where: { userId, type, usedAt: null }, data: { usedAt: new Date() } });
  await db.verificationToken.create({ data: { userId, type, tokenHash: sha256(token), expiresAt: new Date(Date.now() + ttl) } });
  return token;
}

/** Marks the token used and returns its user id, or null if invalid/expired/used. */
export async function consumeToken(token: string, type: "EMAIL_VERIFY" | "PASSWORD_RESET"): Promise<string | null> {
  const row = await db.verificationToken.findUnique({ where: { tokenHash: sha256(token) } });
  if (!row || row.type !== type || row.usedAt || row.expiresAt < new Date()) return null;
  const claimed = await db.verificationToken.updateMany({ where: { id: row.id, usedAt: null }, data: { usedAt: new Date() } });
  return claimed.count === 1 ? row.userId : null;
}

export async function sendVerificationEmail(user: { id: string; email: string; name: string }) {
  const token = await issueToken(user.id, "EMAIL_VERIFY");
  const link = `${env.appUrl}/verify-email/confirm?token=${token}`;
  await sendEmail({
    to: user.email,
    kind: "verify-email",
    subject: "Confirm your email for Serverlys Bio",
    text: `Hi${user.name ? ` ${user.name}` : ""},\n\nConfirm your email address to publish your bio page:\n${link}\n\nThis link expires in 48 hours. If you didn't create a Serverlys Bio account, ignore this email.`,
  });
}

export async function sendPasswordResetEmail(user: { id: string; email: string }) {
  const token = await issueToken(user.id, "PASSWORD_RESET");
  const link = `${env.appUrl}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    kind: "password-reset",
    subject: "Reset your Serverlys Bio password",
    text: `Someone asked to reset the password for this Serverlys Bio account.\n\nChoose a new password:\n${link}\n\nThe link expires in 1 hour. If it wasn't you, ignore this email — your password is unchanged.`,
  });
}

/** Safe post-login redirect: same-site paths only. */
export function safeNext(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
