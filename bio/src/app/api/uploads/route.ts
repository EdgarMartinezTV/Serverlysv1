import { z } from "zod";
import { withUser } from "@/lib/server/api";
import { storeUpload, UploadError, FILE_MAX_BYTES } from "@/lib/server/uploads";
import { ownedPage } from "@/lib/server/pages";
import { rateLimit } from "@/lib/server/rate-limit";

const crop = z.object({ x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive() });

export const POST = withUser<unknown>(async (req, user) => {
  if (!(await rateLimit(`upload:${user.id}`, 40, 3600)).ok) throw new UploadError("Upload limit reached — try again in an hour.");
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > FILE_MAX_BYTES + 64 * 1024) throw new UploadError("Files can be up to 20 MB.");
  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) throw new UploadError("No file received.");
  const kind = z.enum(["avatar", "cover", "image", "background", "file"]).parse(fd.get("kind"));
  const pageId = typeof fd.get("pageId") === "string" ? String(fd.get("pageId")) : null;
  if (pageId) await ownedPage(user.id, pageId);
  const cropRaw = fd.get("crop");
  const parsedCrop = typeof cropRaw === "string" && cropRaw ? crop.safeParse(JSON.parse(cropRaw)) : null;
  return storeUpload({ ownerId: user.id, pageId, kind, data: Buffer.from(await file.arrayBuffer()), fileName: file.name, crop: parsedCrop?.success ? parsedCrop.data : null });
});
