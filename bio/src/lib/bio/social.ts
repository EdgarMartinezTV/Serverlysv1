import type { SocialPlatform } from "./schema.ts";

const HOSTS: Array<[RegExp, SocialPlatform]> = [
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "facebook"],
  [/(^|\.)(x\.com|twitter\.com)$/, "x"],
  [/(^|\.)linkedin\.com$/, "linkedin"],
  [/(^|\.)threads\.(net|com)$/, "threads"],
  [/(^|\.)(pinterest\.[a-z.]+|pin\.it)$/, "pinterest"],
  [/(^|\.)snapchat\.com$/, "snapchat"],
  [/(^|\.)(wa\.me|whatsapp\.com)$/, "whatsapp"],
  [/(^|\.)(t\.me|telegram\.me)$/, "telegram"],
  [/(^|\.)spotify\.com$/, "spotify"],
  [/(^|\.)soundcloud\.com$/, "soundcloud"],
  [/(^|\.)music\.apple\.com$/, "applemusic"],
  [/(^|\.)twitch\.tv$/, "twitch"],
  [/(^|\.)(discord\.gg|discord\.com)$/, "discord"],
  [/(^|\.)github\.com$/, "github"],
  [/(^|\.)behance\.net$/, "behance"],
  [/(^|\.)dribbble\.com$/, "dribbble"],
];

/** Pick the icon for a pasted URL — "instagram.com/x" → instagram. */
export function detectPlatform(raw: string): SocialPlatform | null {
  const v = raw.trim();
  if (/^mailto:|^[^\s@/]+@[^\s@/]+\.[a-z]{2,}$/i.test(v)) return "email";
  try {
    const host = new URL(/^[a-z]+:\/\//i.test(v) ? v : `https://${v}`).hostname.toLowerCase();
    for (const [re, p] of HOSTS) if (re.test(host)) return p;
    return host.includes(".") ? "website" : null;
  } catch {
    return null;
  }
}
