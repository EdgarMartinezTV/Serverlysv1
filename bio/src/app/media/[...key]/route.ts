import { storage } from "@/lib/server/storage";
import { db } from "@/lib/server/db";

/**
 * Serves uploaded assets. Keys are random and never reused, so responses are
 * immutable — a CDN in front can cache them forever. Files the scanner/sniffer
 * typed as documents are always served as attachments, never inline, so an
 * uploaded file can't render as a page on our origin.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  const asset = await db.asset.findUnique({ where: { key }, select: { mime: true, fileName: true } });
  if (!asset) return new Response("Not found", { status: 404 });
  const body = await storage().get(key);
  if (!body) return new Response("Not found", { status: 404 });
  const inline = asset.mime.startsWith("image/") || asset.mime.startsWith("video/") || asset.mime.startsWith("audio/");
  const name = (asset.fileName || key.split("/").pop() || "file").replace(/[^\w.-]+/g, "_");
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": asset.mime,
      "Content-Length": String(body.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${name}"`,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
