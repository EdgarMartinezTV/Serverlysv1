"use server";

import { z } from "zod";
import { db } from "@/lib/server/db";
import { clientIp } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rate-limit";
import { sendEmail } from "@/lib/server/email";
import { env } from "@/lib/server/env";
import { isEmail } from "@/lib/bio/urls";
import type { FormState } from "./auth";
import { REPORT_REASONS } from "@/lib/bio/report-reasons";


const schema = z.object({
  pageId: z.string().min(1).max(40),
  reason: z.enum(REPORT_REASONS),
  details: z.string().max(3000),
  email: z.string().max(200),
});

export async function reportPageAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = schema.safeParse({ pageId: fd.get("pageId"), reason: fd.get("reason"), details: fd.get("details") ?? "", email: fd.get("email") ?? "" });
  if (!parsed.success) return { error: "Choose a reason." };
  const { pageId, reason, details, email } = parsed.data;
  if (email && !isEmail(email)) return { fieldErrors: { email: "Enter a valid email or leave it empty" } };
  if (!(await rateLimit(`report:${await clientIp()}`, 5, 3600)).ok) return { error: "You've sent several reports already. Try again later." };
  const page = await db.bioPage.findUnique({ where: { id: pageId }, select: { id: true, username: true } });
  if (!page) return { error: "That page no longer exists." };
  await db.report.create({ data: { pageId, reason, details: details.trim(), reporterEmail: email.trim().toLowerCase() } });
  const admins = await db.user.findMany({ where: { role: "ADMIN" }, select: { email: true } });
  for (const a of admins) {
    await sendEmail({ to: a.email, kind: "abuse-report", subject: `Report: ${reason} — /${page.username ?? page.id}`, text: `${reason}\n\n${details || "(no details)"}\n\nReview: ${env.appUrl}/admin/reports` }).catch(() => {});
  }
  return { ok: "Thanks — our team will review this page. If it breaks our rules it'll be taken down." };
}
