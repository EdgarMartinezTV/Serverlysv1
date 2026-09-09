import { renderOgImage } from "@/lib/og";
import { ogCardByKey, ogKeys } from "@/data/og-cards";

/**
 * OpenGraph card images.
 *
 * Keyed, never free-text: an unknown key 404s rather than rendering, so this
 * endpoint cannot be used to put arbitrary words on a Serverlys-branded image.
 * Every key is known at build time, so every card is prerendered.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return ogKeys().map((key) => ({ key }));
}

export async function GET(_request: Request, ctx: RouteContext<"/og/[key]">) {
  const { key } = await ctx.params;
  const card = ogCardByKey(key);
  if (!card) return new Response("Not found", { status: 404 });
  return renderOgImage(card);
}
