/**
 * URL safety for everything a customer can put on a public page.
 *
 * The public page is on OUR origin, so a `javascript:` or `data:` link would
 * run in it. Only http(s) URLs reach an <a href>; mailto/tel/wa.me links are
 * built by us from validated fields, never accepted as raw input.
 */

/** Hostnames that resolve to the visitor's own machine or a private network. */
const PRIVATE_HOST = /^(localhost|.*\.localhost|.*\.local|.*\.internal|0\.0\.0\.0|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+|\[?::1\]?|\[?f[cd][0-9a-f]{2}:.*)$/i;

/**
 * Normalise what a person typed into an absolute https/http URL, or null.
 * "example.com/menu" → "https://example.com/menu".
 */
export function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!url.hostname.includes(".") && !url.hostname.startsWith("[")) return null;
  if (url.username || url.password) return null;
  if (PRIVATE_HOST.test(url.hostname)) return null;
  return url.toString();
}

export function isSafeUrl(raw: string): boolean {
  return normalizeUrl(raw) !== null;
}

/** Digits only, keeping a leading +. */
export function cleanPhone(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^\d]/g, "");
  return (trimmed.startsWith("+") ? "+" : "") + digits;
}

export function isPhone(raw: string): boolean {
  const digits = raw.replace(/[^\d]/g, "");
  return digits.length >= 6 && digits.length <= 16;
}

export function isEmail(raw: string): boolean {
  return /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[a-z]{2,}$/i.test(raw.trim());
}

export function whatsappHref(phone: string, message: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  const q = message.trim() ? `?text=${encodeURIComponent(message.trim())}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function mailtoHref(email: string, subject = ""): string {
  return `mailto:${email.trim()}${subject.trim() ? `?subject=${encodeURIComponent(subject.trim())}` : ""}`;
}

export function telHref(phone: string, sms = false): string {
  return `${sms ? "sms" : "tel"}:${cleanPhone(phone)}`;
}

export function mapsHref(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
}

export function mapsEmbedSrc(address: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address.trim())}&output=embed`;
}

/** YouTube watch/short/embed/youtu.be → video id. */
export function youtubeId(raw: string): string | null {
  const url = normalizeUrl(raw);
  if (!url) return null;
  const u = new URL(url);
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = u.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") id = u.searchParams.get("v");
    else {
      const m = u.pathname.match(/^\/(embed|shorts|live)\/([^/]+)/);
      if (m) id = m[2];
    }
  }
  return id && /^[\w-]{6,20}$/.test(id) ? id : null;
}

/** tiktok.com/@user/video/<id> → id. Short vm.tiktok.com links cannot be resolved offline. */
export function tiktokId(raw: string): string | null {
  const url = normalizeUrl(raw);
  if (!url) return null;
  const m = new URL(url).pathname.match(/\/video\/(\d{8,25})/);
  return m ? m[1] : null;
}

/** Vimeo page → id, or a direct .mp4/.webm file. */
export function videoSource(raw: string): { kind: "vimeo"; id: string } | { kind: "file"; src: string } | null {
  if (raw.startsWith("/media/")) return { kind: "file", src: raw };
  const url = normalizeUrl(raw);
  if (!url) return null;
  const u = new URL(url);
  if (u.hostname.replace(/^www\./, "").endsWith("vimeo.com")) {
    const m = u.pathname.match(/\/(\d{5,12})/);
    return m ? { kind: "vimeo", id: m[1] } : null;
  }
  if (/\.(mp4|webm|mov)$/i.test(u.pathname)) return { kind: "file", src: url };
  return null;
}

export function hostOf(raw: string): string {
  try {
    return new URL(raw).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
