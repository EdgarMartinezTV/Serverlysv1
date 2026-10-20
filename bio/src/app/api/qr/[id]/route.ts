import sharp from "sharp";
import { db } from "@/lib/server/db";
import { env } from "@/lib/server/env";
import { qrSvg } from "@/lib/bio/qr";

/** Downloadable QR code for a page's public address (its custom domain if verified). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await db.bioPage.findUnique({ where: { id }, select: { username: true, domains: { where: { status: "VERIFIED" }, select: { hostname: true }, take: 1 } } });
  if (!page?.username) return new Response("Not found", { status: 404 });
  const url = page.domains[0] ? `https://${page.domains[0].hostname}/` : `${env.appUrl}/${page.username}`;
  const svg = qrSvg(url, { margin: 3 });
  const format = new URL(req.url).searchParams.get("format") === "svg" ? "svg" : "png";
  const name = `serverlys-bio-${page.username}-qr.${format}`;
  if (format === "svg") {
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "no-store" } });
  }
  const png = await sharp(Buffer.from(svg), { density: 600 }).resize(1024, 1024, { kernel: "nearest" }).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "no-store" } });
}
