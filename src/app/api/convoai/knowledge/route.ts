import { buildFeed } from "@/lib/assistant/feed";

/**
 * GET /api/convoai/knowledge — the feed ConvoAI syncs into the Serverlys assistant every hour
 * (src/lib/assistant/feed.ts). Public facts only: the same prices, policies and pages the site shows.
 * Computed per request so a sale starting or ending is picked up without a rebuild.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(buildFeed(), {
    headers: { "Cache-Control": "public, max-age=300", "X-Robots-Tag": "noindex" },
  });
}
