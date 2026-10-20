import { getPublishedById } from "@/lib/server/public-pages";
import { cleanPhone, normalizeUrl } from "@/lib/bio/urls";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => `\\${c}`);

/** "Save contact" button: a vCard 3.0 built from the published contact block. */
export async function GET(_req: Request, { params }: { params: Promise<{ pageId: string; blockId: string }> }) {
  const { pageId, blockId } = await params;
  const page = await getPublishedById(pageId);
  const b = page?.doc.blocks.find((x) => x.id === blockId);
  if (!page || !b || b.type !== "contact") return new Response("Not found", { status: 404 });
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${esc(b.name)}`, `N:${esc(b.name)};;;;`];
  if (b.org) lines.push(`ORG:${esc(b.org)}`);
  if (b.phone) lines.push(`TEL;TYPE=CELL:${cleanPhone(b.phone)}`);
  if (b.email) lines.push(`EMAIL;TYPE=INTERNET:${esc(b.email)}`);
  const site = normalizeUrl(b.website);
  if (site) lines.push(`URL:${site}`);
  lines.push(`NOTE:${esc(`bio.serverlys.com/${page.username}`)}`, "END:VCARD");
  const file = (b.name || page.username).replace(/[^\w.-]+/g, "_").slice(0, 60) || "contact";
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/vcard; charset=utf-8", "Content-Disposition": `attachment; filename="${file}.vcf"`, "Cache-Control": "no-store" },
  });
}
