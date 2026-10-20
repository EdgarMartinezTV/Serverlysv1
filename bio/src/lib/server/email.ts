import "server-only";
import { Resend } from "resend";
import { db } from "./db";
import { env } from "./env";

type Mail = { to: string; subject: string; kind: string; text: string; html?: string };

/**
 * Transactional email. With RESEND_API_KEY set the message goes out through
 * Resend from the verified serverlys.com domain; without it (local dev, CI)
 * it is LOGGED to OutboundEmail with its body, which is how a developer — and
 * the Playwright suite — follows a verification link. Every message is
 * recorded either way so admins can see delivery failures.
 */
export async function sendEmail(mail: Mail): Promise<void> {
  if (!env.resendKey) {
    await db.outboundEmail.create({ data: { to: mail.to, subject: mail.subject, kind: mail.kind, status: "LOGGED", body: mail.text } });
    if (!env.isProd) console.info(`[email:${mail.kind}] → ${mail.to}\n${mail.text}`);
    return;
  }
  try {
    const resend = new Resend(env.resendKey);
    const { data, error } = await resend.emails.send({ from: env.emailFrom, to: mail.to, subject: mail.subject, text: mail.text, html: mail.html ?? textToHtml(mail.text) });
    if (error) throw new Error(error.message);
    await db.outboundEmail.create({ data: { to: mail.to, subject: mail.subject, kind: mail.kind, status: "SENT", providerId: data?.id ?? null } });
  } catch (err) {
    await db.outboundEmail.create({ data: { to: mail.to, subject: mail.subject, kind: mail.kind, status: "FAILED", error: String(err).slice(0, 500) } });
  }
}

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

function textToHtml(text: string): string {
  const body = esc(text)
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color:#0000ff">$1</a>')
    .replace(/\n/g, "<br>");
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6;color:#101011;max-width:560px;margin:0 auto;padding:24px"><p style="font-weight:600;font-size:17px;margin:0 0 16px">Serverlys Bio</p>${body}<p style="color:#6f6f78;font-size:12px;margin-top:32px">Serverlys Bio is a free product by Serverlys.</p></div>`;
}
