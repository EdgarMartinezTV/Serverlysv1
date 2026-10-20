"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/server/db";
import { requireAdmin, sendVerificationEmail } from "@/lib/server/auth";
import { audit } from "@/lib/server/audit";
import { invalidatePublicPage } from "@/lib/server/public-pages";
import { verifyDomain } from "@/lib/server/domains";
import { safeParseDoc } from "@/lib/bio/schema";

/**
 * Admin mutations. Each one calls requireAdmin() itself — the /admin layout
 * guard is for pages, not for Server Actions, which are reachable directly.
 * Every action that changes data writes an AuditLog row.
 */

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

function back(fd: FormData, fallback: string, msg?: string) {
  const to = str(fd, "back");
  const target = to.startsWith("/admin") ? to : fallback;
  if (msg) redirect(`${target}${target.includes("?") ? "&" : "?"}msg=${encodeURIComponent(msg)}`);
  redirect(target);
}

/* ── users ─────────────────────────────────────────────────────────────── */

export async function setUserSuspended(fd: FormData) {
  const admin = await requireAdmin();
  const userId = str(fd, "userId");
  const suspend = str(fd, "suspend") === "1";
  if (userId === admin.id) back(fd, "/admin/users", "You can't suspend yourself.");
  const user = await db.user.update({ where: { id: userId }, data: { status: suspend ? "SUSPENDED" : "ACTIVE" }, select: { email: true, pages: { select: { id: true, username: true } } } });
  if (suspend) await db.session.deleteMany({ where: { userId } });
  for (const p of user.pages) await invalidatePublicPage(p.id, p.username ? [p.username] : []);
  await audit(admin.id, suspend ? "admin.user.suspend" : "admin.user.unsuspend", "user", userId, { email: user.email, pages: user.pages.length });
  revalidatePath("/admin/users");
  back(fd, "/admin/users", suspend ? "User suspended." : "User restored.");
}

export async function setUserRole(fd: FormData) {
  const admin = await requireAdmin();
  const userId = str(fd, "userId");
  const role = str(fd, "role") === "ADMIN" ? "ADMIN" : "USER";
  if (userId === admin.id && role !== "ADMIN") back(fd, "/admin/users", "You can't remove your own admin role.");
  const user = await db.user.update({ where: { id: userId }, data: { role }, select: { email: true } });
  await audit(admin.id, role === "ADMIN" ? "admin.user.promote" : "admin.user.demote", "user", userId, { email: user.email });
  revalidatePath("/admin/users");
  back(fd, "/admin/users", role === "ADMIN" ? "Promoted to admin." : "Admin role removed.");
}

export async function resendUserVerification(fd: FormData) {
  const admin = await requireAdmin();
  const userId = str(fd, "userId");
  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, emailVerifiedAt: true } });
  if (!user || user.emailVerifiedAt) back(fd, "/admin/users", "Nothing to send — already verified.");
  await sendVerificationEmail(user!);
  await audit(admin.id, "admin.user.resend_verification", "user", userId, { email: user!.email });
  back(fd, "/admin/users", `Verification email sent to ${user!.email}.`);
}

/* ── pages ─────────────────────────────────────────────────────────────── */

async function suspendPage(adminId: string, pageId: string, reason: string) {
  const page = await db.bioPage.update({ where: { id: pageId }, data: { status: "SUSPENDED", suspendedReason: reason.slice(0, 300) || "Violation of the acceptable use policy" }, select: { username: true } });
  await invalidatePublicPage(pageId, page.username ? [page.username] : []);
  await audit(adminId, "admin.page.suspend", "page", pageId, { username: page.username, reason });
}

export async function suspendPageAction(fd: FormData) {
  const admin = await requireAdmin();
  await suspendPage(admin.id, str(fd, "pageId"), str(fd, "reason"));
  revalidatePath("/admin/pages");
  back(fd, "/admin/pages", "Page suspended.");
}

export async function restorePageAction(fd: FormData) {
  const admin = await requireAdmin();
  const pageId = str(fd, "pageId");
  const current = await db.bioPage.findUnique({ where: { id: pageId }, select: { published: true } });
  if (!current) back(fd, "/admin/pages", "Page not found.");
  const status = current!.published ? "PUBLISHED" : "DRAFT";
  const page = await db.bioPage.update({ where: { id: pageId }, data: { status, suspendedReason: null }, select: { username: true } });
  await invalidatePublicPage(pageId, page.username ? [page.username] : []);
  await audit(admin.id, "admin.page.restore", "page", pageId, { username: page.username, status });
  revalidatePath("/admin/pages");
  back(fd, "/admin/pages", "Page restored.");
}

/* ── reports ───────────────────────────────────────────────────────────── */

export async function resolveReportAction(fd: FormData) {
  const admin = await requireAdmin();
  const reportId = str(fd, "reportId");
  const outcome = str(fd, "outcome") === "DISMISSED" ? "DISMISSED" : "RESOLVED";
  const note = str(fd, "resolution").slice(0, 1000);
  const report = await db.report.update({ where: { id: reportId }, data: { status: outcome, resolution: note || null, resolvedById: admin.id, resolvedAt: new Date() }, select: { pageId: true, reason: true } });
  if (outcome === "RESOLVED" && fd.get("suspend") === "on") await suspendPage(admin.id, report.pageId, note || report.reason);
  await audit(admin.id, outcome === "DISMISSED" ? "admin.report.dismiss" : "admin.report.resolve", "report", reportId, { pageId: report.pageId, note, suspended: fd.get("suspend") === "on" });
  revalidatePath("/admin/reports");
  back(fd, "/admin/reports", outcome === "DISMISSED" ? "Report dismissed." : "Report resolved.");
}

/* ── domains ───────────────────────────────────────────────────────────── */

export async function recheckDomainAction(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "domainId");
  const d = await verifyDomain(null, id).catch((e: Error) => ({ status: "ERROR", hostname: "", lastError: e.message }));
  await audit(admin.id, "admin.domain.recheck", "domain", id, { status: d.status });
  revalidatePath("/admin/domains");
  back(fd, "/admin/domains", `Checked: ${d.status}${d.lastError ? ` — ${d.lastError}` : ""}`);
}

/* ── templates ─────────────────────────────────────────────────────────── */

export async function toggleTemplateAction(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "templateId");
  const field = str(fd, "field") === "featured" ? "featured" : "active";
  const value = str(fd, "value") === "1";
  await db.template.update({ where: { id }, data: { [field]: value } });
  await audit(admin.id, `admin.template.${field}`, "template", id, { value });
  revalidatePath("/admin/templates");
  back(fd, "/admin/templates");
}

export async function updateTemplateAction(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "templateId");
  const name = str(fd, "name").slice(0, 80);
  const description = str(fd, "description").slice(0, 400);
  const category = str(fd, "category").slice(0, 40);
  const sortOrder = Number(str(fd, "sortOrder")) || 0;
  const raw = str(fd, "content");
  const data: Prisma.TemplateUpdateInput = { description, sortOrder };
  if (name) data.name = name;
  if (category) data.category = category;
  if (raw) {
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      back(fd, `/admin/templates/${id}`, "Content is not valid JSON — nothing saved.");
    }
    const doc = safeParseDoc(parsedJson);
    if (!doc.success) back(fd, `/admin/templates/${id}`, `Content failed validation: ${doc.error!.issues.slice(0, 3).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
    data.content = doc.data as unknown as Prisma.InputJsonValue;
  }
  await db.template.update({ where: { id }, data });
  await audit(admin.id, "admin.template.update", "template", id, { name, category, sortOrder, content: Boolean(raw) });
  revalidatePath("/admin/templates");
  back(fd, `/admin/templates/${id}`, "Template saved.");
}
