"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/server/db";
import {
  burnPasswordCheck,
  consumeToken,
  createSession,
  destroySession,
  getUser,
  hashPassword,
  normalizeEmail,
  passwordProblem,
  safeNext,
  sendPasswordResetEmail,
  sendVerificationEmail,
  verifyPassword,
} from "@/lib/server/auth";
import { clientIp } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rate-limit";
import { env } from "@/lib/server/env";
import { isEmail } from "@/lib/bio/urls";

export type FormState = { error?: string; fieldErrors?: Record<string, string>; ok?: string; values?: Record<string, string> };

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");

export async function signupAction(_: FormState, fd: FormData): Promise<FormState> {
  const values = { name: str(fd, "name").trim().slice(0, 80), email: normalizeEmail(str(fd, "email")) };
  const password = str(fd, "password");
  const fieldErrors: Record<string, string> = {};
  if (!values.name) fieldErrors.name = "Tell us your name";
  if (!isEmail(values.email)) fieldErrors.email = "Enter a valid email address";
  const pw = passwordProblem(password);
  if (pw) fieldErrors.password = pw;
  if (fd.get("terms") !== "on") fieldErrors.terms = "You need to accept the terms to continue";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const ip = await clientIp();
  if (!(await rateLimit(`signup:${ip}`, 5, 3600)).ok) return { error: "Too many sign-ups from this network. Try again later.", values };

  const existing = await db.user.findUnique({ where: { email: values.email } });
  if (existing) return { fieldErrors: { email: "An account with this email already exists. Log in instead." }, values };

  const user = await db.user.create({
    data: {
      email: values.email,
      name: values.name,
      passwordHash: await hashPassword(password),
      marketingConsent: fd.get("marketing") === "on",
      role: env.adminEmails.includes(values.email) ? "ADMIN" : "USER",
    },
  });
  await sendVerificationEmail(user);
  await createSession(user.id);
  redirect(`/verify-email${fd.get("next") ? `?next=${encodeURIComponent(safeNext(str(fd, "next")))}` : ""}`);
}

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const email = normalizeEmail(str(fd, "email"));
  const password = str(fd, "password");
  const ip = await clientIp();
  const limited = !(await rateLimit(`login:ip:${ip}`, 20, 900)).ok || !(await rateLimit(`login:email:${email}`, 8, 900)).ok;
  if (limited) return { error: "Too many attempts. Wait 15 minutes and try again.", values: { email } };

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    await burnPasswordCheck(password);
    return { error: "Email or password is incorrect.", values: { email } };
  }
  if (!(await verifyPassword(user.passwordHash, password))) return { error: "Email or password is incorrect.", values: { email } };
  if (user.status === "SUSPENDED") return { error: "This account is suspended. Contact support@serverlys.com.", values: { email } };
  if (env.adminEmails.includes(user.email) && user.role !== "ADMIN") await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  await createSession(user.id);
  redirect(user.emailVerifiedAt ? safeNext(str(fd, "next")) : "/verify-email");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function resendVerificationAction(): Promise<FormState> {
  const user = await getUser();
  if (!user) redirect("/login");
  if (user.emailVerifiedAt) redirect("/dashboard");
  if (!(await rateLimit(`verify-resend:${user.id}`, 3, 3600)).ok) return { error: "We've sent a few already. Check spam, or try again in an hour." };
  await sendVerificationEmail(user);
  return { ok: `Sent a new link to ${user.email}.` };
}

export async function verifyEmailToken(token: string): Promise<boolean> {
  const userId = await consumeToken(token, "EMAIL_VERIFY");
  if (!userId) return false;
  await db.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } });
  return true;
}

export async function forgotPasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const email = normalizeEmail(str(fd, "email"));
  if (!isEmail(email)) return { fieldErrors: { email: "Enter a valid email address" }, values: { email } };
  const ip = await clientIp();
  if ((await rateLimit(`forgot:${ip}`, 5, 3600)).ok && (await rateLimit(`forgot:${email}`, 3, 3600)).ok) {
    const user = await db.user.findUnique({ where: { email } });
    if (user && user.status === "ACTIVE") await sendPasswordResetEmail(user);
  }
  // Same answer whether or not the account exists.
  return { ok: "If an account exists for that email, a reset link is on its way. It expires in 1 hour." };
}

export async function resetPasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const token = str(fd, "token");
  const password = str(fd, "password");
  const problem = passwordProblem(password);
  if (problem) return { fieldErrors: { password: problem } };
  if (password !== str(fd, "confirm")) return { fieldErrors: { confirm: "Passwords don't match" } };
  const userId = await consumeToken(token, "PASSWORD_RESET");
  if (!userId) return { error: "This reset link is invalid or has expired. Request a new one." };
  await db.user.update({ where: { id: userId }, data: { passwordHash: await hashPassword(password), emailVerifiedAt: new Date() } });
  // A reset signs out every other device.
  await db.session.deleteMany({ where: { userId } });
  await createSession(userId);
  redirect("/dashboard");
}

const passwordChange = z.object({ current: z.string(), next: z.string() });

export async function changePasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await getUser();
  if (!user) redirect("/login");
  const { current, next } = passwordChange.parse({ current: str(fd, "current"), next: str(fd, "next") });
  if (user.passwordHash && !(await verifyPassword(user.passwordHash, current))) return { fieldErrors: { current: "Current password is incorrect" } };
  const problem = passwordProblem(next);
  if (problem) return { fieldErrors: { next: problem } };
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next) } });
  await db.session.deleteMany({ where: { userId: user.id, id: { not: user.sessionId } } });
  return { ok: "Password updated. Other devices were signed out." };
}
