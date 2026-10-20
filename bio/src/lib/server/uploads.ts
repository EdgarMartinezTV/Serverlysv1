import "server-only";
import net from "node:net";
import sharp from "sharp";
import { db } from "./db";
import { storage, mediaUrl } from "./storage";
import { randomToken } from "./crypto";

/**
 * Upload pipeline. Nothing a customer uploads is stored as-is:
 *  · type is decided by magic bytes, never by the filename or the
 *    browser-supplied Content-Type;
 *  · images are decoded and RE-ENCODED to WebP by sharp, which strips EXIF
 *    (GPS!) and anything smuggled after the image data;
 *  · documents are allowed from a short list and, when CLAMAV_HOST is set,
 *    streamed through clamd before they are stored;
 *  · a generous anti-abuse storage ceiling (free — raised on request).
 */

export const IMAGE_MAX_BYTES = 8 * 1024 * 1024;
export const FILE_MAX_BYTES = 20 * 1024 * 1024;
/** Anti-abuse ceiling, not a plan: free accounts never pay for storage. */
export const QUOTA_BYTES = 2 * 1024 * 1024 * 1024;

export type UploadKind = "avatar" | "cover" | "image" | "background" | "file";

const IMAGE_LIMITS: Record<Exclude<UploadKind, "file">, number> = {
  avatar: 640,
  cover: 1800,
  image: 1600,
  background: 2400,
};

type Sniffed = { mime: string; ext: string; image: boolean };

export function sniff(buf: Buffer): Sniffed | null {
  const b = buf;
  const starts = (...bytes: number[]) => bytes.every((v, i) => b[i] === v);
  if (starts(0xff, 0xd8, 0xff)) return { mime: "image/jpeg", ext: "jpg", image: true };
  if (starts(0x89, 0x50, 0x4e, 0x47)) return { mime: "image/png", ext: "png", image: true };
  if (starts(0x47, 0x49, 0x46, 0x38)) return { mime: "image/gif", ext: "gif", image: true };
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return { mime: "image/webp", ext: "webp", image: true };
  if (b.subarray(4, 12).toString().match(/^ftyp(avif|avis|heic|heix|mif1)/)) return { mime: "image/avif", ext: "avif", image: true };
  if (starts(0x25, 0x50, 0x44, 0x46)) return { mime: "application/pdf", ext: "pdf", image: false };
  if (starts(0x50, 0x4b, 0x03, 0x04)) {
    // EPUB is a zip whose first entry is the literal "mimetype" file.
    if (b.subarray(30, 58).toString() === "mimetypeapplication/epub+zip") return { mime: "application/epub+zip", ext: "epub", image: false };
    return { mime: "application/zip", ext: "zip", image: false };
  }
  if (starts(0x49, 0x44, 0x33) || starts(0xff, 0xfb) || starts(0xff, 0xf3)) return { mime: "audio/mpeg", ext: "mp3", image: false };
  if (b.subarray(4, 8).toString() === "ftyp" && /^(isom|mp42|mp41|avc1|M4V )/.test(b.subarray(8, 12).toString())) return { mime: "video/mp4", ext: "mp4", image: false };
  return null;
}

export class UploadError extends Error {}

export type Crop = { x: number; y: number; width: number; height: number };

/** Ask clamd (INSTREAM) whether the bytes are clean. No CLAMAV_HOST = skipped. */
async function virusScan(buf: Buffer): Promise<void> {
  const host = process.env.CLAMAV_HOST;
  if (!host) return;
  const port = Number(process.env.CLAMAV_PORT ?? 3310);
  const verdict = await new Promise<string>((resolve, reject) => {
    const sock = net.createConnection({ host, port }, () => {
      sock.write("zINSTREAM\0");
      for (let i = 0; i < buf.length; i += 64 * 1024) {
        const chunk = buf.subarray(i, i + 64 * 1024);
        const len = Buffer.alloc(4);
        len.writeUInt32BE(chunk.length);
        sock.write(len);
        sock.write(chunk);
      }
      sock.write(Buffer.alloc(4));
    });
    let out = "";
    sock.setTimeout(30_000, () => sock.destroy(new Error("clamd timeout")));
    sock.on("data", (d) => (out += d.toString()));
    sock.on("end", () => resolve(out));
    sock.on("error", reject);
  });
  if (!/OK\0?$/.test(verdict.trim())) throw new UploadError("This file was rejected by the malware scanner.");
}

export async function storeUpload(opts: { ownerId: string; pageId?: string | null; kind: UploadKind; data: Buffer; fileName: string; crop?: Crop | null }) {
  const { ownerId, kind, data } = opts;
  const sniffed = sniff(data);
  if (!sniffed) throw new UploadError("Unsupported file type.");

  const used = await db.asset.aggregate({ where: { ownerId }, _sum: { bytes: true } });
  if ((used._sum.bytes ?? 0) + data.length > QUOTA_BYTES) throw new UploadError("You've uploaded 2 GB — our anti-abuse safeguard. It's still free: email support@serverlys.com and we'll raise it.");

  const id = randomToken(12).toLowerCase().replace(/[^a-z0-9]/g, "x");
  let body: Buffer;
  let mime: string;
  let ext: string;
  let width: number | null = null;
  let height: number | null = null;

  if (kind === "file") {
    if (data.length > FILE_MAX_BYTES) throw new UploadError("Files can be up to 20 MB.");
    await virusScan(data);
    body = data;
    mime = sniffed.mime;
    ext = sniffed.ext;
  } else {
    if (!sniffed.image) throw new UploadError("Upload an image (JPG, PNG, WebP, GIF or AVIF).");
    if (data.length > IMAGE_MAX_BYTES) throw new UploadError("Images can be up to 8 MB.");
    let img = sharp(data, { failOn: "error", limitInputPixels: 50_000_000 }).rotate();
    if (opts.crop) {
      const meta = await sharp(data).rotate().metadata();
      const c = opts.crop;
      const left = Math.max(0, Math.round(c.x));
      const top = Math.max(0, Math.round(c.y));
      const w = Math.min(Math.round(c.width), (meta.width ?? 0) - left);
      const h = Math.min(Math.round(c.height), (meta.height ?? 0) - top);
      if (w > 0 && h > 0) img = sharp(await img.toBuffer()).extract({ left, top, width: w, height: h });
    }
    const max = IMAGE_LIMITS[kind];
    try {
      const out = await img.resize({ width: max, height: max, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
      body = out.data;
      width = out.info.width;
      height = out.info.height;
    } catch {
      throw new UploadError("That image could not be read.");
    }
    mime = "image/webp";
    ext = "webp";
  }

  const key = `u/${ownerId}/${id}.${ext}`;
  await storage().put(key, body, mime);
  const asset = await db.asset.create({
    data: { ownerId, pageId: opts.pageId ?? null, key, kind, mime, bytes: body.length, width, height, fileName: opts.fileName.slice(0, 120) },
  });
  return { id: asset.id, url: mediaUrl(key), bytes: body.length, width, height, mime, fileName: asset.fileName };
}
