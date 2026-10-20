import { NextResponse } from "next/server";
import { getPublishedById } from "@/lib/server/public-pages";
import { recordEvent } from "@/lib/server/analytics";
import { ipFromRequest } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rate-limit";
import { mapsHref, normalizeUrl } from "@/lib/bio/urls";
import { isLive } from "@/lib/bio/validate";
import type { Block } from "@/lib/bio/schema";

/**
 * Click-through redirect for every http(s) link on a public page.
 *
 * Open-redirect safe by construction: the destination is read from the
 * PUBLISHED document by (pageId, blockId) — nothing in the request can choose
 * where it goes — and is re-validated as a public http(s) URL.
 */
function destination(b: Block, key: string | null): string | null {
  switch (b.type) {
    case "link":
    case "featured":
    case "booking":
    case "product":
    case "service":
    case "video":
      return normalizeUrl(b.url);
    case "image":
      return b.url ? normalizeUrl(b.url) : null;
    case "custom":
      return normalizeUrl(b.buttonUrl);
    case "map":
      return b.address ? mapsHref(b.address) : null;
    case "file":
      return b.src.startsWith("/media/") ? b.src : null;
    case "social": {
      const item = key ? b.items.find((s) => s.platform === key) : undefined;
      return item ? normalizeUrl(item.url) : null;
    }
    default:
      return null;
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ pageId: string; blockId: string }> }) {
  const { pageId, blockId } = await params;
  const url = new URL(req.url);
  const page = await getPublishedById(pageId);
  const block = page?.doc.blocks.find((b) => b.id === blockId);
  const dest = block && isLive(block) ? destination(block, url.searchParams.get("k")) : null;
  if (!page || !dest) return NextResponse.redirect(new URL(page ? `/${page.username}` : "/", url), 302);

  const ip = ipFromRequest(req);
  // Count at most 30 clicks per visitor per minute so a script can't inflate a link.
  if ((await rateLimit(`click:${ip}:${pageId}`, 30, 60)).ok) {
    await recordEvent({
      pageId,
      type: "CLICK",
      blockId,
      ip,
      ua: req.headers.get("user-agent") ?? "",
      referrer: req.headers.get("referer") ?? "",
      headers: req.headers,
      ownHost: url.host,
    }).catch(() => {});
  }
  const res = NextResponse.redirect(dest.startsWith("/") ? new URL(dest, url) : dest, 302);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Referrer-Policy", "strict-origin");
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}
