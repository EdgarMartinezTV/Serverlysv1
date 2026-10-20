import type { Block, BlockType } from "./schema.ts";

/** Editor metadata for every block type: palette grouping, label, list summary. */

export type BlockGroup = "links" | "content" | "media" | "commerce" | "contact" | "leads" | "layout";

export const GROUPS: Array<{ id: BlockGroup; label: string }> = [
  { id: "links", label: "Links & buttons" },
  { id: "content", label: "Text & content" },
  { id: "media", label: "Media & embeds" },
  { id: "commerce", label: "Shop & services" },
  { id: "contact", label: "Contact" },
  { id: "leads", label: "Lead capture" },
  { id: "layout", label: "Layout" },
];

export const CATALOG: Record<BlockType, { label: string; group: BlockGroup; description: string; glyph: string }> = {
  link: { label: "Link", group: "links", description: "A button to any URL", glyph: "🔗" },
  featured: { label: "Featured link", group: "links", description: "Big card with image", glyph: "⭐" },
  booking: { label: "Booking", group: "links", description: "Calendly, Square, Fresha…", glyph: "📅" },
  social: { label: "Social icons", group: "links", description: "A row of profile icons", glyph: "👥" },
  heading: { label: "Heading", group: "content", description: "Section title", glyph: "H" },
  text: { label: "Paragraph", group: "content", description: "Plain text", glyph: "¶" },
  faq: { label: "FAQ", group: "content", description: "Questions & answers", glyph: "?" },
  testimonial: { label: "Testimonial", group: "content", description: "Quote with rating", glyph: "❝" },
  custom: { label: "Custom section", group: "content", description: "Image, text & button", glyph: "▣" },
  marquee: { label: "Scrolling text", group: "content", description: "Ticker banner", glyph: "↔" },
  image: { label: "Image", group: "media", description: "Photo, optional link", glyph: "🖼" },
  gallery: { label: "Gallery", group: "media", description: "Grid or carousel", glyph: "▦" },
  youtube: { label: "YouTube", group: "media", description: "Embed a video", glyph: "▶" },
  tiktok: { label: "TikTok", group: "media", description: "Embed a TikTok", glyph: "♪" },
  video: { label: "Video", group: "media", description: "Vimeo or .mp4", glyph: "🎬" },
  embed: { label: "Music & apps", group: "media", description: "Spotify, SoundCloud, Calendly…", glyph: "🎧" },
  product: { label: "Product", group: "commerce", description: "Price, image, checkout link", glyph: "🛍" },
  service: { label: "Service", group: "commerce", description: "Menu item or service", glyph: "✂" },
  whatsapp: { label: "WhatsApp", group: "contact", description: "Start a chat", glyph: "💬" },
  email: { label: "Email", group: "contact", description: "mailto button", glyph: "✉" },
  phone: { label: "Phone / SMS", group: "contact", description: "Tap to call or text", glyph: "📞" },
  contact: { label: "Save contact", group: "contact", description: "vCard download", glyph: "📇" },
  map: { label: "Map", group: "contact", description: "Address + directions", glyph: "📍" },
  newsletter: { label: "Email signup", group: "leads", description: "Collect subscribers", glyph: "📨" },
  form: { label: "Contact form", group: "leads", description: "Name, email, message", glyph: "📝" },
  section: { label: "Section", group: "layout", description: "Group the blocks below", glyph: "§" },
  divider: { label: "Divider", group: "layout", description: "Line, dots or wave", glyph: "—" },
  spacer: { label: "Spacer", group: "layout", description: "Empty space", glyph: "↕" },
  file: { label: "File download", group: "layout", description: "PDF, ZIP, MP3, EPUB", glyph: "⬇" },
  qr: { label: "QR code", group: "layout", description: "Scan to open a URL", glyph: "▩" },
};

/** One-line summary for the block list. */
export function summary(b: Block): string {
  switch (b.type) {
    case "heading":
    case "text":
    case "marquee":
      return b.text || "Empty";
    case "link":
    case "featured":
      return b.title || b.url || "Untitled link";
    case "booking":
    case "whatsapp":
    case "email":
    case "phone":
    case "contact":
    case "newsletter":
    case "form":
    case "map":
    case "file":
    case "qr":
    case "section":
    case "faq":
      return b.title || CATALOG[b.type].label;
    case "product":
    case "service":
      return [b.title, b.price].filter(Boolean).join(" · ") || CATALOG[b.type].label;
    case "testimonial":
      return b.author ? `“${b.quote.slice(0, 40)}” — ${b.author}` : b.quote || "Testimonial";
    case "image":
      return b.alt || b.caption || (b.src ? "Image" : "No image yet");
    case "gallery":
      return `${b.images.length} image${b.images.length === 1 ? "" : "s"}`;
    case "social":
      return b.items.map((i) => i.platform).join(", ") || "No profiles yet";
    case "youtube":
    case "tiktok":
    case "video":
    case "embed":
      return b.title || b.url || "No URL yet";
    case "custom":
      return b.title || "Custom section";
    case "divider":
      return b.variant;
    case "spacer":
      return `${b.height}px`;
  }
}

export function newId(): string {
  const r = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `b-${r.replace(/-/g, "").slice(0, 10)}`;
}
