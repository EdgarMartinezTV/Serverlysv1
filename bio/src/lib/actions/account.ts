"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/server/db";
import { destroySession, normalizeEmail, requireUser, sendVerificationEmail, verifyPassword } from "@/lib/server/auth";
import { audit } from "@/lib/server/audit";
import { storage } from "@/lib/server/storage";
import { invalidatePublicPage } from "@/lib/server/public-pages";
import { isEmail } from "@/lib/bio/urls";
import type { FormState } from "./auth";

export async function updateProfileAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = String(fd.get("name") ?? "").trim().slice(0, 80);
  const email = normalizeEmail(String(fd.get("email") ?? ""));
  const marketing = fd.get("marketing") === "on";
  if (!name) return { fieldErrors: { name: "Name can't be empty" } };
  if (!isEmail(email)) return { fieldErrors: { email: "Enter a valid email" } };
  const emailChanged = email !== user.email;
  if (emailChanged && (await db.user.findUnique({ where: { email } }))) return { fieldErrors: { email: "That email is already in use" } };
  const updated = await db.user.update({ where: { id: user.id }, data: { name, marketingConsent: marketing, ...(emailChanged ? { email, emailVerifiedAt: null } : {}) } });
  if (emailChanged) {
    await sendVerificationEmail(updated);
    await audit(user.id, "account.email_change", "user", user.id);
  }
  revalidatePath("/dashboard", "layout");
  return { ok: emailChanged ? `Saved. Confirm ${email} with the link we just sent.` : "Saved." };
}

export async function revokeSessionAction(sessionId: string) {
  const user = await requireUser();
  await db.session.deleteMany({ where: { id: sessionId, userId: user.id } });
  revalidatePath("/dashboard/settings");
}

export async function revokeOtherSessionsAction() {
  const user = await requireUser();
  await db.session.deleteMany({ where: { userId: user.id, id: { not: user.sessionId } } });
  revalidatePath("/dashboard/settings");
}

/**
 * Permanent account deletion: pages (and with them analytics, leads, domains,
 * versions) cascade in Postgres; uploaded files are removed from storage.
 */
export async function deleteAccountAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  if (String(fd.get("confirm") ?? "") !== "DELETE") return { fieldErrors: { confirm: 'Type DELETE to confirm' } };
  if (user.passwordHash && !(await verifyPassword(user.passwordHash, String(fd.get("password") ?? "")))) return { fieldErrors: { password: "Password is incorrect" } };
  const pages = await db.bioPage.findMany({ where: { ownerId: user.id }, select: { id: true, username: true } });
  const assets = await db.asset.findMany({ where: { ownerId: user.id }, select: { key: true } });
  await audit(user.id, "account.delete", "user", user.id, { email: user.email, pages: pages.length });
  await db.user.delete({ where: { id: user.id } });
  for (const a of assets) await storage().remove(a.key).catch(() => {});
  for (const p of pages) await invalidatePublicPage(p.id, p.username ? [p.username] : []).catch(() => {});
  await destroySession();
  redirect("/login?deleted=1");
}
