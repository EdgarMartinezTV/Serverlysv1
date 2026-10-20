import { withUser } from "@/lib/server/api";
import { db } from "@/lib/server/db";

/** Data portability: everything we hold about the signed-in account, as JSON. */
export const GET = withUser<unknown>(async (_req, user) => {
  const data = await db.user.findUnique({
    where: { id: user.id },
    select: {
      email: true,
      name: true,
      createdAt: true,
      emailVerifiedAt: true,
      marketingConsent: true,
      pages: { select: { id: true, name: true, username: true, status: true, draft: true, published: true, publishedAt: true, createdAt: true, leads: true, domains: { select: { hostname: true, status: true } } } },
      savedStyles: { select: { name: true, theme: true } },
      assets: { select: { key: true, mime: true, bytes: true, fileName: true, createdAt: true } },
      sessions: { select: { createdAt: true, lastSeenAt: true, userAgent: true } },
    },
  });
  return new Response(JSON.stringify(data, null, 2), { headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="serverlys-bio-account.json"', "Cache-Control": "no-store" } });
});
