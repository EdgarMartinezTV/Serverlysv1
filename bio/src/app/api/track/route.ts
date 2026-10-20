import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublishedById } from "@/lib/server/public-pages";
import { recordEvent } from "@/lib/server/analytics";
import { ipFromRequest } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rate-limit";

const body = z.object({
  pageId: z.string().min(1).max(40),
  type: z.enum(["view", "click"]),
  blockId: z.string().max(60).optional(),
  referrer: z.string().max(2048).optional(),
});

/** Beacon endpoint for page views and non-http clicks (mailto/tel/wa/vCard/socials). */
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 204 });
  const { pageId, type, blockId, referrer } = parsed.data;
  const ip = ipFromRequest(req);
  if (!(await rateLimit(`track:${ip}`, 120, 60)).ok) return new NextResponse(null, { status: 204 });

  const page = await getPublishedById(pageId);
  if (!page) return new NextResponse(null, { status: 204 });
  if (type === "click") {
    // Only ids that exist on the published page (or a social platform on it) are counted.
    const ok = blockId?.startsWith("social:") ? page.doc.socials.items.some((s) => `social:${s.platform}` === blockId) || page.doc.blocks.some((b) => b.type === "social") : page.doc.blocks.some((b) => b.id === blockId);
    if (!ok) return new NextResponse(null, { status: 204 });
  }
  await recordEvent({
    pageId,
    type: type === "view" ? "VIEW" : "CLICK",
    blockId: type === "click" ? blockId : null,
    ip,
    ua: req.headers.get("user-agent") ?? "",
    referrer: referrer ?? "",
    headers: req.headers,
    ownHost: new URL(req.url).host,
  }).catch(() => {});
  return new NextResponse(null, { status: 204 });
}
