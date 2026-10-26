import { NextResponse } from "next/server";
import { clientKey } from "@/lib/domains/provider";
import { check, type Window } from "@/lib/sera/rate-limit";
import { log } from "@/lib/sera/observability";
import { newReference } from "@/lib/sera/notify/store";

/**
 * POST /api/report-abuse
 *
 * The /report-abuse form, emailed to the abuse inbox (Edgar, 2026-10-26:
 * "I need to receive these forms via email Edgar@Serverlys.com").
 *
 * It used to POST straight to WHMCS submitticket.php, which silently failed
 * for anyone not logged in: WHMCS has "require login for tickets" on, and a
 * person reporting phishing is almost never a client.
 *
 * Multipart, because evidence files ride along as email attachments. Same
 * abuse controls as /api/cleaning-consultation, cheapest first: a declared
 * body size cap read BEFORE parsing (formData() has no limit of its own), a
 * honeypot and minimum fill time (answered with a quiet 200), then
 * per-address and instance-wide rate limits.
 *
 * Env: ABUSE_RESEND_API_KEY (Resend, sending-only), ABUSE_REPORT_TO
 * (default edgar@serverlys.com), ABUSE_EMAIL_FROM.
 */
export const dynamic = "force-dynamic";

const BY_ADDRESS: Window = { limit: 5, windowMs: 10 * 60_000 };
const GLOBAL: Window = { limit: 40, windowMs: 10 * 60_000 };
const MIN_FILL_MS = 3_000;

const MAX_FILES = 5;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
/** Five full files plus the text fields and multipart overhead. */
const MAX_BODY_BYTES = MAX_FILES * MAX_FILE_BYTES + 256 * 1024;
const FILE_TYPES = /\.(pdf|jpe?g|png|webp|txt|eml)$/i;

/** Field name -> [label, max length, required]. Order is the email's order. */
const FIELDS = {
  abuseType: ["Abuse type", 120, true],
  reporterName: ["Reporter", 200, true],
  org: ["Organisation or role", 200, false],
  reporterEmail: ["Email", 254, true],
  country: ["Country of residence", 100, false],
  target: ["Abuser website or service", 2000, true],
  description: ["Description of the issue", 8000, true],
  capacity: ["Capacity", 300, false],
  work: ["Copyrighted work", 4000, false],
  infringing: ["Infringing material", 4000, false],
  signature: ["Electronic signature", 200, false],
} as const satisfies Record<string, readonly [string, number, boolean]>;

type Field = keyof typeof FIELDS;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(reason: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, reason }, { status, headers });
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
    return fail("malformed", 415);
  }
  const length = Number(request.headers.get("content-length"));
  if (!length) return fail("malformed", 411);
  if (length > MAX_BODY_BYTES) return fail("too_large", 413);

  const own = check(clientKey(request, "report-abuse"), BY_ADDRESS);
  const all = check("report-abuse:global", GLOBAL);
  const limited = !own.ok ? own : !all.ok ? all : null;
  if (limited) {
    log.warn("rate_limited", { workflow: "report_abuse", error: own.ok ? "form_global" : "form_by_address" });
    return fail("rate_limited", 429, { "Retry-After": String(limited.retryAfterSeconds) });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("malformed", 400);
  }

  const text = (n: string) => {
    const v = form.get(n);
    return typeof v === "string" ? v.trim() : "";
  };

  const elapsed = Number(text("elapsed")) || 0;
  if (text("fax_number") || elapsed < MIN_FILL_MS) {
    log.warn("form_lead_dropped", { workflow: "report_abuse", error: text("fax_number") ? "honeypot" : "too_fast" });
    return NextResponse.json({ ok: true, reference: null });
  }

  const values = {} as Record<Field, string>;
  const errors: string[] = [];
  for (const [name, [, max, required]] of Object.entries(FIELDS) as [Field, (typeof FIELDS)[Field]][]) {
    const v = text(name).slice(0, max);
    if (required && !v) errors.push(name);
    values[name] = v;
  }
  if (values.reporterEmail && !EMAIL.test(values.reporterEmail)) errors.push("reporterEmail");
  if (text("declaration") !== "on") errors.push("declaration");
  if (errors.length) return NextResponse.json({ ok: false, reason: "invalid", errors }, { status: 400 });

  const files = form.getAll("attachments[]").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) return fail("too_many_files", 400);
  if (files.some((f) => f.size > MAX_FILE_BYTES || !FILE_TYPES.test(f.name))) return fail("bad_file", 400);

  const reference = newReference();
  const lines: string[] = [];
  for (const [name, [label]] of Object.entries(FIELDS) as [Field, (typeof FIELDS)[Field]][]) {
    const v = values[name];
    if (!v) continue;
    lines.push(v.includes("\n") || v.length > 80 ? `${label}:\n${v}\n` : `${label}: ${v}`);
  }
  lines.push(
    "Declaration accepted: yes",
    files.length ? `Evidence attached: ${files.map((f) => f.name).join(", ")}` : "Evidence attached: none",
    "",
    `Reference: ${reference}`,
    `Submitted: ${new Date().toISOString()}`,
    "Sent from https://serverlys.com/report-abuse. Reply to this email to answer the reporter.",
  );

  const key = process.env.ABUSE_RESEND_API_KEY?.trim() || process.env.RESEND_API_KEY?.trim();
  if (!key) {
    log.error("notification_unconfigured", { workflow: "report_abuse", reference, ok: false });
    return fail("failed", 502);
  }

  const attachments = await Promise.all(
    files.map(async (f) => ({ filename: f.name.slice(0, 120), content: Buffer.from(await f.arrayBuffer()).toString("base64") })),
  );

  const startedAt = Date.now();
  let delivered = false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ABUSE_EMAIL_FROM?.trim() || "Serverlys Abuse Reports <abuse@serverlys.com>",
        to: [process.env.ABUSE_REPORT_TO?.trim() || "edgar@serverlys.com"],
        reply_to: values.reporterEmail,
        subject: `Abuse report: ${values.abuseType} [${reference}]`,
        text: lines.join("\n"),
        ...(attachments.length ? { attachments } : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    delivered = res.ok;
  } catch {
    delivered = false;
  }

  log.info("form_lead_verify", {
    workflow: "report_abuse",
    reference,
    ms: Date.now() - startedAt,
    channel: "resend",
    count: files.length,
    ok: delivered,
  });
  if (!delivered) return fail("failed", 502);
  return NextResponse.json({ ok: true, reference }, { headers: { "Cache-Control": "no-store" } });
}
