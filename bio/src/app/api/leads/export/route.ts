import { withUser } from "@/lib/server/api";
import { db } from "@/lib/server/db";

const csv = (v: unknown) => {
  const s = String(v ?? "");
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export const GET = withUser<unknown>(async (req, user) => {
  const sp = new URL(req.url).searchParams;
  const kind = sp.get("kind");
  const leads = await db.lead.findMany({
    where: {
      page: { ownerId: user.id },
      ...(sp.get("page") ? { pageId: sp.get("page")! } : {}),
      ...(kind === "NEWSLETTER" || kind === "CONTACT" ? { kind } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50_000,
    include: { page: { select: { name: true, username: true } } },
  });
  const rows = [["received_utc", "type", "name", "email", "phone", "message", "page", "username", "consent_given", "consent_text"].join(",")];
  for (const l of leads) rows.push([l.createdAt.toISOString(), l.kind.toLowerCase(), l.name, l.email, l.phone, l.message, l.page.name, l.page.username ?? "", l.consentGiven, l.consentText].map(csv).join(","));
  return new Response(rows.join("\n") + "\n", {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="serverlys-bio-leads.csv"`, "Cache-Control": "no-store" },
  });
});
