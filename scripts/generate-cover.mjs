#!/usr/bin/env node
/**
 * Generate a blog cover image for one article.
 *
 *   npm run cover -- <article-slug> "<what the image should show>"
 *
 * Writes public/blog/covers/<slug>.webp (1200x800, 3:2) in the same house
 * style as the existing 76 covers. If the article is new, also add its slug
 * to src/data/articles/covers.ts so the blog uses the photo.
 *
 * ⚠ THE API KEY IS NOT IN THIS REPO AND MUST NEVER BE.
 * It is read from the macOS Keychain item "serverlys-openai-images", which
 * exists only on Edgar's Mac and is used by nothing but this script — not
 * Sera, not the server, not .env. To store or replace it:
 *
 *   security add-generic-password -U -a "$USER" -s serverlys-openai-images -w 'sk-...'
 *
 * The script only ever calls the image generation endpoint. For a hard
 * guarantee, make the key itself a restricted key in the OpenAI dashboard
 * (API keys → Restricted → Images: Write, everything else: None).
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const [slug, ...rest] = process.argv.slice(2);
const subject = rest.join(" ").trim();
if (!slug || !subject || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run cover -- <article-slug> "<what the image should show>"');
  process.exit(1);
}

function keychainKey() {
  try {
    return execFileSync("security", ["find-generic-password", "-s", "serverlys-openai-images", "-w"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    console.error('No key in the Keychain. Store it with:\n  security add-generic-password -U -a "$USER" -s serverlys-openai-images -w \'sk-...\'');
    process.exit(1);
  }
}

// The house style every cover shares — keep it identical so new covers match.
const STYLE =
  "Realistic editorial photograph for a small-business technology blog cover. Natural soft light, " +
  "modern and clean, shallow depth of field, consistent cool blue accent tones. Any screen content is " +
  "simplified and plausible. Absolutely no brand logos, no real product or company names, no watermarks, " +
  "no readable text except very short generic labels. Subject: ";

const res = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: { Authorization: `Bearer ${keychainKey()}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "gpt-image-2.5-flare",
    prompt: STYLE + subject,
    size: "1536x1024",
    quality: "medium",
    n: 1,
  }),
});
const json = await res.json();
if (!res.ok) {
  console.error("OpenAI error:", json.error?.message ?? res.status);
  process.exit(1);
}

const item = json.data[0];
const raw = item.b64_json
  ? Buffer.from(item.b64_json, "base64")
  : Buffer.from(await (await fetch(item.url)).arrayBuffer());

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "blog", "covers", `${slug}.webp`);
const webp = await sharp(raw).resize(1200, 800, { fit: "cover", position: "centre" }).webp({ quality: 82 }).toBuffer();
writeFileSync(out, webp);
console.log(`Saved ${out}`);
console.log(`If ${slug} is a new article, add "${slug}" to src/data/articles/covers.ts.`);
