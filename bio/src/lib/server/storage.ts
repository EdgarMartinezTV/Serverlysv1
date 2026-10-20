import "server-only";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

/**
 * Object storage. Two drivers behind one interface:
 *  · local — files under STORAGE_DIR (a mounted volume in production).
 *  · s3    — any S3-compatible bucket when S3_BUCKET is set (R2, B2, MinIO…).
 *
 * Public URLs are always /media/<key>, served by app/media/[...key]/route.ts
 * with immutable cache headers, so the driver can change without rewriting
 * a single saved page and a CDN in front caches every asset forever.
 */

interface Driver {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<Buffer | null>;
  remove(key: string): Promise<void>;
}

const SAFE_KEY = /^[a-z0-9][a-z0-9/_.-]{0,200}$/i;

function assertKey(key: string) {
  if (!SAFE_KEY.test(key) || key.includes("..")) throw new Error("Invalid storage key");
}

const local: Driver = {
  async put(key, body) {
    assertKey(key);
    const file = path.join(env.storageDir, key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, body);
  },
  async get(key) {
    assertKey(key);
    try {
      return await readFile(path.join(env.storageDir, key));
    } catch {
      return null;
    }
  },
  async remove(key) {
    assertKey(key);
    await rm(path.join(env.storageDir, key), { force: true });
  },
};

function s3Driver(): Driver {
  const bucket = process.env.S3_BUCKET!;
  const client = new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: process.env.S3_ACCESS_KEY_ID
      ? { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "" }
      : undefined,
  });
  return {
    async put(key, body, contentType) {
      assertKey(key);
      await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
    },
    async get(key) {
      assertKey(key);
      try {
        const out = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
        return out.Body ? Buffer.from(await out.Body.transformToByteArray()) : null;
      } catch {
        return null;
      }
    },
    async remove(key) {
      assertKey(key);
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },
  };
}

let driver: Driver | null = null;
export function storage(): Driver {
  driver ??= process.env.S3_BUCKET ? s3Driver() : local;
  return driver;
}

export function mediaUrl(key: string): string {
  return `/media/${key}`;
}
