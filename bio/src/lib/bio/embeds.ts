import { normalizeUrl } from "./urls.ts";

/**
 * Allow-listed embeds. A customer pastes a normal share URL; we derive the
 * provider's official embed URL and render it in a sandboxed iframe. Raw
 * embed HTML is never accepted — on our origin it would be stored XSS.
 */
export type Embed = { provider: string; src: string; defaultHeight: number };

export const EMBED_PROVIDERS = ["Spotify", "SoundCloud", "Apple Music", "Calendly", "Google Forms", "Typeform", "Bandcamp"] as const;

export function resolveEmbed(raw: string): Embed | null {
  const norm = normalizeUrl(raw);
  if (!norm) return null;
  const u = new URL(norm);
  const host = u.hostname.replace(/^www\./, "");

  if (host === "open.spotify.com") {
    const m = u.pathname.match(/^\/(?:intl-[a-z-]+\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/);
    if (m) return { provider: "Spotify", src: `https://open.spotify.com/embed/${m[1]}/${m[2]}`, defaultHeight: m[1] === "track" || m[1] === "episode" ? 152 : 352 };
  }
  if (host === "soundcloud.com") {
    return { provider: "SoundCloud", src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(norm)}&visual=false`, defaultHeight: 166 };
  }
  if (host === "music.apple.com") {
    return { provider: "Apple Music", src: `https://embed.music.apple.com${u.pathname}${u.search}`, defaultHeight: 175 };
  }
  if (host === "calendly.com") {
    return { provider: "Calendly", src: `https://calendly.com${u.pathname}?embed_type=Inline&hide_gdpr_banner=1`, defaultHeight: 680 };
  }
  if (host === "docs.google.com" && u.pathname.startsWith("/forms/")) {
    const path = u.pathname.replace(/\/(viewform|edit)?$/, "");
    return { provider: "Google Forms", src: `https://docs.google.com${path}/viewform?embedded=true`, defaultHeight: 640 };
  }
  if (host.endsWith("typeform.com") && u.pathname.startsWith("/to/")) {
    return { provider: "Typeform", src: `https://${host}${u.pathname}`, defaultHeight: 520 };
  }
  if (host === "bandcamp.com" && u.pathname.startsWith("/EmbeddedPlayer/")) {
    return { provider: "Bandcamp", src: norm, defaultHeight: 120 };
  }
  return null;
}
