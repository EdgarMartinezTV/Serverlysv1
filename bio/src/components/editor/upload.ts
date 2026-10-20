export type Uploaded = { id: string; url: string; bytes: number; width: number | null; height: number | null; mime: string; fileName: string };
export type Kind = "avatar" | "cover" | "image" | "background" | "file";

export async function upload(file: File, kind: Kind, pageId: string, crop?: { x: number; y: number; width: number; height: number } | null): Promise<Uploaded> {
  const fd = new FormData();
  fd.set("file", file);
  fd.set("kind", kind);
  fd.set("pageId", pageId);
  if (crop) fd.set("crop", JSON.stringify(crop));
  const res = await fetch("/api/uploads", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return data as Uploaded;
}
