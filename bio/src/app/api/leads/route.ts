import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getPublishedById } from "@/lib/server/public-pages";
import { ipFromRequest } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rate-limit";
import { sendEmail } from "@/lib/server/email";
import { env } from "@/lib/server/env";
import { isEmail } from "@/lib/bio/urls";

const body = z.object({
  pageId: z.string().min(1).max(40),
  blockId: z.string().min(1).max(40),
  name: z.string().max(120).default(""),
  email: z.string().max(200),
  phone: z.string().max(40).default(""),
  message: z.string().max(3000).default(""),
  consent: z.boolean(),
  website: z.string().max(200).default(""),
  elapsed: z.number().default(0),
});

const err = (error: string, status = 400) => NextResponse.json({ error }, { status });

/**
 * Lead capture for newsletter + contact-form blocks. Spam layers: JSON-only
 * (blocks cross-site form posts), per-IP and per-page rate limits, a honeypot
 * field, a minimum fill time, and the block must exist on the PUBLISHED page.
 */
export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) return err("Unsupported request", 415);
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return err("Please check the form and try again.");
  const d = parsed.data;
  const ip = ipFromRequest(req);
  if (!(await rateLimit(`lead:ip:${ip}`, 5, 600)).ok) return err("Too many submissions. Try again in a few minutes.", 429);
  if (!(await rateLimit(`lead:page:${d.pageId}`, 200, 3600)).ok) return err("This form is busy. Try again later.", 429);

  // Bots: pretend success so they don't adapt, store nothing.
  if (d.website.trim() || d.elapsed < 1500) return NextResponse.json({ ok: true });

  const page = await getPublishedById(d.pageId);
  const block = page?.doc.blocks.find((b) => b.id === d.blockId);
  if (!page || !block || (block.type !== "newsletter" && block.type !== "form")) return err("This form is no longer available.", 404);
  if (!isEmail(d.email)) return err("Enter a valid email address.");
  if (block.consentText && !d.consent) return err("Please tick the consent box.");
  if (block.type === "form" && !d.message.trim()) return err("Add a message.");

  const lead = await db.lead.create({
    data: {
      pageId: page.id,
      blockId: block.id,
      kind: block.type === "newsletter" ? "NEWSLETTER" : "CONTACT",
      name: d.name.trim(),
      email: d.email.trim().toLowerCase(),
      phone: block.type === "form" && block.askPhone ? d.phone.trim() : "",
      message: block.type === "form" ? d.message.trim() : "",
      consentText: block.consentText,
      consentGiven: d.consent,
    },
  });

  const owner = await db.bioPage.findUnique({ where: { id: page.id }, select: { notifyLeads: true, owner: { select: { email: true, emailVerifiedAt: true } } } });
  if (owner?.notifyLeads && owner.owner.emailVerifiedAt) {
    await sendEmail({
      to: owner.owner.email,
      kind: "lead-notification",
      subject: `New ${lead.kind === "NEWSLETTER" ? "subscriber" : "message"} on bio.serverlys.com/${page.username}`,
      text: `${lead.kind === "NEWSLETTER" ? "New newsletter signup" : "New contact form message"} from ${lead.name || lead.email}.\n\nEmail: ${lead.email}${lead.phone ? `\nPhone: ${lead.phone}` : ""}${lead.message ? `\n\n${lead.message}` : ""}\n\nSee all leads: ${env.appUrl}/dashboard/leads\n\nTurn these emails off in the page's Settings tab.`,
    }).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
