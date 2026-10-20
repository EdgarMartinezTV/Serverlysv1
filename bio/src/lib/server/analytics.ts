import "server-only";
import { db } from "./db";
import { visitorHash } from "./crypto";

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|quora link|whatsapp|telegrambot|discordbot|headless|lighthouse|pagespeed|curl|wget|python-requests|httpclient|go-http|axios|node-fetch|java\/|okhttp|monitor|uptime|pingdom|scan/i;

export function isBot(ua: string): boolean {
  return !ua || BOT_UA.test(ua);
}

export function deviceOf(ua: string): "mobile" | "tablet" | "desktop" {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|windows phone/i.test(ua)) return "mobile";
  return "desktop";
}

const SOCIAL = /(^|\.)(instagram|l\.instagram|facebook|fb|lm\.facebook|m\.facebook|tiktok|t\.co|twitter|x|linkedin|lnkd|youtube|pinterest|reddit|threads|snapchat)\./;
const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|baidu|yandex|search\.brave)\./;

/** Bucket a referrer into a traffic source. Instagram's in-app browser sends no referrer, so UA is checked too. */
export function sourceOf(referrer: string, ua: string, ownHost: string): { source: string; referrer: string } {
  if (/Instagram/i.test(ua)) return { source: "instagram", referrer: referrer ? hostOnly(referrer) : "" };
  if (/FBAN|FBAV/i.test(ua)) return { source: "facebook", referrer: referrer ? hostOnly(referrer) : "" };
  if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) return { source: "tiktok", referrer: "" };
  if (!referrer) return { source: "direct", referrer: "" };
  const host = hostOnly(referrer);
  if (!host || host === ownHost) return { source: "direct", referrer: "" };
  const m = host.match(/(instagram|facebook|tiktok|linkedin|youtube|pinterest|reddit|threads|snapchat)/);
  if (m) return { source: m[1], referrer: host };
  if (/(^|\.)(t\.co|twitter\.com|x\.com)$/.test(host)) return { source: "x", referrer: host };
  if (SOCIAL.test(host + ".")) return { source: "social", referrer: host };
  if (SEARCH.test(host + ".")) return { source: "search", referrer: host };
  return { source: "referral", referrer: host };
}

function hostOnly(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").slice(0, 120);
  } catch {
    return "";
  }
}

/** Country from an upstream geo header, if the edge provides one. Never derived from a stored IP. */
export function countryFrom(h: Headers): string {
  const c = h.get("cf-ipcountry") ?? h.get("x-vercel-ip-country") ?? h.get("x-country-code") ?? "";
  return /^[A-Z]{2}$/.test(c) && c !== "XX" && c !== "T1" ? c : "";
}

export async function recordEvent(e: { pageId: string; type: "VIEW" | "CLICK"; blockId?: string | null; ip: string; ua: string; referrer: string; headers: Headers; ownHost: string }) {
  if (isBot(e.ua)) return;
  const { source, referrer } = sourceOf(e.referrer, e.ua, e.ownHost);
  const hash = visitorHash(e.ip, e.ua);
  // A double-fired beacon (or a double-tap) within 10s is one event, not two.
  const dupe = await db.analyticsEvent.findFirst({
    where: { pageId: e.pageId, type: e.type, blockId: e.blockId ?? null, visitorHash: hash, createdAt: { gte: new Date(Date.now() - 10_000) } },
    select: { id: true },
  });
  if (dupe) return;
  await db.analyticsEvent.create({
    data: {
      pageId: e.pageId,
      type: e.type,
      blockId: e.blockId ?? null,
      visitorHash: hash,
      referrer,
      source,
      device: deviceOf(e.ua),
      country: countryFrom(e.headers),
    },
  });
}
