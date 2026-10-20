import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "./env";

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hmac(value: string): string {
  return createHmac("sha256", env.authSecret).update(value).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Visitor fingerprint for analytics: salted per UTC day with the server
 * secret, so it counts uniques within a day and cannot be reversed or joined
 * across days. The raw IP is never written anywhere.
 */
export function visitorHash(ip: string, userAgent: string, day = new Date().toISOString().slice(0, 10)): string {
  return hmac(`visitor:${day}:${ip}:${userAgent}`).slice(0, 32);
}

export function ipHash(ip: string): string {
  return hmac(`ip:${ip}`).slice(0, 24);
}
