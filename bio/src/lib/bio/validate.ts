import type { Block, PageDoc } from "./schema.ts";
import { isEmail, isPhone, isSafeUrl, tiktokId, videoSource, youtubeId } from "./urls.ts";

export type Issue = { blockId?: string; field: string; message: string };

/** Is this block visible to a visitor at `now` (hidden flag + schedule)? */
export function isLive(block: Block, now = new Date()): boolean {
  if (block.hidden) return false;
  const { start, end } = block.schedule;
  if (start && Date.parse(start) > now.getTime()) return false;
  if (end && Date.parse(end) <= now.getTime()) return false;
  return true;
}

function needUrl(issues: Issue[], b: Block, field: string, value: string, label = "Link") {
  if (!value.trim()) issues.push({ blockId: b.id, field, message: `${label} needs a URL` });
  else if (!isSafeUrl(value)) issues.push({ blockId: b.id, field, message: `${label} URL is not a valid public http(s) address` });
}

function optionalUrl(issues: Issue[], b: Block, field: string, value: string) {
  if (value.trim() && !isSafeUrl(value)) issues.push({ blockId: b.id, field, message: "URL is not a valid public http(s) address" });
}

/**
 * Everything that must be true before a draft can become the public page.
 * Hidden blocks are still checked: un-hiding later must not publish a broken
 * link without another publish, and it keeps the rule simple to explain.
 */
export function publishIssues(doc: PageDoc): Issue[] {
  const issues: Issue[] = [];
  if (!doc.profile.name.trim()) issues.push({ field: "profile.name", message: "Add a display name" });
  for (const s of doc.socials.items) {
    if (s.platform === "email" ? !isEmail(s.url) : !isSafeUrl(s.url)) issues.push({ field: "socials", message: `${s.platform} link is not valid` });
  }
  for (const b of doc.blocks) {
    switch (b.type) {
      case "link":
        if (!b.title.trim()) issues.push({ blockId: b.id, field: "title", message: "Link needs a title" });
        needUrl(issues, b, "url", b.url);
        break;
      case "featured":
        needUrl(issues, b, "url", b.url, "Featured link");
        break;
      case "image":
        if (!b.src) issues.push({ blockId: b.id, field: "src", message: "Image block has no image" });
        optionalUrl(issues, b, "url", b.url);
        break;
      case "social":
        for (const s of b.items) {
          if (s.platform === "email" ? !isEmail(s.url) : !isSafeUrl(s.url)) issues.push({ blockId: b.id, field: "items", message: `${s.platform} link is not valid` });
        }
        break;
      case "youtube":
        if (!youtubeId(b.url)) issues.push({ blockId: b.id, field: "url", message: "Not a YouTube video URL" });
        break;
      case "tiktok":
        if (!tiktokId(b.url)) issues.push({ blockId: b.id, field: "url", message: "Use the full TikTok video URL (tiktok.com/@user/video/…)" });
        break;
      case "video":
        if (!videoSource(b.url)) issues.push({ blockId: b.id, field: "url", message: "Use a Vimeo link or a direct .mp4/.webm file" });
        break;
      case "product":
      case "service":
        if (!b.title.trim()) issues.push({ blockId: b.id, field: "title", message: `${b.type === "product" ? "Product" : "Service"} needs a title` });
        optionalUrl(issues, b, "url", b.url);
        break;
      case "booking":
        needUrl(issues, b, "url", b.url, "Booking link");
        break;
      case "contact":
        if (!b.name.trim()) issues.push({ blockId: b.id, field: "name", message: "Contact card needs a name" });
        if (b.email && !isEmail(b.email)) issues.push({ blockId: b.id, field: "email", message: "Email address is not valid" });
        if (b.phone && !isPhone(b.phone)) issues.push({ blockId: b.id, field: "phone", message: "Phone number is not valid" });
        optionalUrl(issues, b, "website", b.website);
        break;
      case "whatsapp":
      case "phone":
        if (!isPhone(b.phone)) issues.push({ blockId: b.id, field: "phone", message: "Add a phone number with country code" });
        break;
      case "email":
        if (!isEmail(b.email)) issues.push({ blockId: b.id, field: "email", message: "Email address is not valid" });
        break;
      case "map":
        if (!b.address.trim()) issues.push({ blockId: b.id, field: "address", message: "Map needs an address" });
        break;
      case "file":
        if (!b.src.startsWith("/media/")) issues.push({ blockId: b.id, field: "src", message: "Upload a file to share" });
        break;
      case "qr":
        optionalUrl(issues, b, "url", b.url);
        break;
      case "custom":
        optionalUrl(issues, b, "buttonUrl", b.buttonUrl);
        break;
      default:
        break;
    }
  }
  return issues;
}
