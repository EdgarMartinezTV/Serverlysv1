import { z } from "zod";

/**
 * The bio-page document — the single contract shared by the editor, the
 * autosave API, the publish step, templates and the public renderer.
 *
 * Two levels of strictness, on purpose:
 *  · `pageDocSchema` is what a DRAFT must satisfy. A half-typed link (empty
 *    URL) is a legitimate draft, so URL fields accept "".
 *  · `publishIssues()` is what PUBLISHING requires on top of that: every
 *    visible link resolves to a safe absolute URL, and so on.
 *
 * Everything is bounded (string lengths, array sizes) so one document can
 * never become a storage or rendering problem — these bounds ARE the
 * documented anti-abuse limits.
 */

export const LIMITS = {
  blocks: 300,
  trash: 30,
  galleryImages: 48,
  faqItems: 30,
  socials: 20,
  shortText: 120,
  mediumText: 400,
  longText: 3000,
  url: 2048,
} as const;

/* ── primitives ─────────────────────────────────────────────────────────── */

const short = z.string().max(LIMITS.shortText);
const medium = z.string().max(LIMITS.mediumText);
const long = z.string().max(LIMITS.longText);
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex colour like #1a2b3c");
/** "" while a draft is incomplete; publishIssues() enforces a real URL. */
const draftUrl = z.string().max(LIMITS.url);
/** Images and files are either our own uploads (/media/…) or https URLs. */
const mediaUrl = z
  .string()
  .max(LIMITS.url)
  .refine((v) => v === "" || v.startsWith("/media/") || /^https:\/\//i.test(v), "Must be an uploaded file or an https URL");
const isoDate = z.string().max(40).refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "Invalid date");

export const SOCIAL_PLATFORMS = [
  "instagram",
  "tiktok",
  "youtube",
  "facebook",
  "x",
  "linkedin",
  "threads",
  "pinterest",
  "snapchat",
  "whatsapp",
  "telegram",
  "spotify",
  "soundcloud",
  "applemusic",
  "twitch",
  "discord",
  "github",
  "behance",
  "dribbble",
  "email",
  "website",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

const socialItem = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  url: draftUrl,
});

export const FONTS = [
  "inter",
  "dm-sans",
  "poppins",
  "montserrat",
  "outfit",
  "space-grotesk",
  "archivo",
  "playfair",
  "cormorant",
  "fraunces",
  "lora",
  "libre-baskerville",
  "bebas",
  "caveat",
  "jetbrains-mono",
] as const;
export type FontId = (typeof FONTS)[number];

export const ANIMATIONS = ["none", "fade", "lift", "pulse", "wobble", "shine"] as const;

/* ── per-block style (the right-hand properties panel) ───────────────────── */

export const blockStyleSchema = z.object({
  align: z.enum(["left", "center", "right"]).default("center"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
  weight: z.enum(["regular", "medium", "bold"]).default("medium"),
  /** "" = inherit the theme. */
  color: z.union([hex, z.literal("")]).default(""),
  bg: z.union([hex, z.literal("")]).default(""),
  /** -1 = inherit the theme radius. */
  radius: z.number().int().min(-1).max(40).default(-1),
  /** Space above the block. */
  spacing: z.enum(["none", "sm", "md", "lg"]).default("md"),
  width: z.enum(["full", "wide", "narrow"]).default("full"),
  animation: z.enum(ANIMATIONS).default("none"),
  visibility: z.enum(["all", "mobile", "desktop"]).default("all"),
});
export type BlockStyle = z.infer<typeof blockStyleSchema>;

const base = {
  id: z.string().min(1).max(40),
  hidden: z.boolean().default(false),
  /** Optional visibility window, ISO strings, "" = open-ended. */
  schedule: z
    .object({ start: isoDate.default(""), end: isoDate.default("") })
    .prefault({}),
  style: blockStyleSchema.prefault({}),
};

const imageRef = z.object({
  src: mediaUrl.default(""),
  alt: short.default(""),
});

/* ── blocks ─────────────────────────────────────────────────────────────── */

export const blockSchema = z.discriminatedUnion("type", [
  z.object({ ...base, type: z.literal("heading"), text: short.default("Heading"), level: z.union([z.literal(2), z.literal(3)]).default(2) }),
  z.object({ ...base, type: z.literal("text"), text: long.default("") }),
  z.object({
    ...base,
    type: z.literal("link"),
    title: short.default(""),
    subtitle: short.default(""),
    url: draftUrl.default(""),
    thumbnail: mediaUrl.default(""),
    icon: z.union([z.enum(SOCIAL_PLATFORMS), z.literal("")]).default(""),
    /** "Priority" links get the theme accent + the chosen animation. */
    highlight: z.boolean().default(false),
    /** rel="nofollow" for sponsored/affiliate links. */
    nofollow: z.boolean().default(false),
  }),
  z.object({
    ...base,
    type: z.literal("featured"),
    title: short.default(""),
    description: medium.default(""),
    url: draftUrl.default(""),
    image: mediaUrl.default(""),
    cta: short.default("Open"),
  }),
  z.object({ ...base, type: z.literal("social"), items: z.array(socialItem).max(LIMITS.socials).default([]), variant: z.enum(["icons", "pills"]).default("icons") }),
  z.object({
    ...base,
    type: z.literal("image"),
    src: mediaUrl.default(""),
    alt: short.default(""),
    url: draftUrl.default(""),
    aspect: z.enum(["auto", "1:1", "4:3", "16:9", "3:4", "4:5"]).default("auto"),
    /** Reposition inside the frame, 0–100 (object-position). */
    focusX: z.number().min(0).max(100).default(50),
    focusY: z.number().min(0).max(100).default(50),
    caption: short.default(""),
  }),
  z.object({
    ...base,
    type: z.literal("gallery"),
    images: z.array(imageRef).max(LIMITS.galleryImages).default([]),
    layout: z.enum(["grid", "carousel"]).default("grid"),
    columns: z.union([z.literal(2), z.literal(3)]).default(2),
  }),
  z.object({ ...base, type: z.literal("video"), url: draftUrl.default(""), title: short.default("") }),
  z.object({ ...base, type: z.literal("youtube"), url: draftUrl.default(""), title: short.default("") }),
  z.object({ ...base, type: z.literal("tiktok"), url: draftUrl.default(""), title: short.default("") }),
  z.object({
    ...base,
    type: z.literal("product"),
    title: short.default(""),
    description: medium.default(""),
    price: short.default(""),
    compareAt: short.default(""),
    badge: short.default(""),
    image: mediaUrl.default(""),
    url: draftUrl.default(""),
    cta: short.default("Buy now"),
    kind: z.enum(["physical", "digital"]).default("physical"),
  }),
  z.object({
    ...base,
    type: z.literal("service"),
    title: short.default(""),
    description: medium.default(""),
    price: short.default(""),
    duration: short.default(""),
    url: draftUrl.default(""),
    cta: short.default("Book"),
  }),
  z.object({ ...base, type: z.literal("booking"), title: short.default("Book an appointment"), url: draftUrl.default(""), note: short.default("") }),
  z.object({
    ...base,
    type: z.literal("contact"),
    title: short.default("Save my contact"),
    name: short.default(""),
    org: short.default(""),
    phone: short.default(""),
    email: short.default(""),
    website: draftUrl.default(""),
  }),
  z.object({ ...base, type: z.literal("whatsapp"), title: short.default("Chat on WhatsApp"), phone: short.default(""), message: medium.default("") }),
  z.object({ ...base, type: z.literal("email"), title: short.default("Email me"), email: short.default(""), subject: short.default("") }),
  z.object({ ...base, type: z.literal("phone"), title: short.default("Call us"), phone: short.default(""), sms: z.boolean().default(false) }),
  z.object({
    ...base,
    type: z.literal("map"),
    title: short.default("Find us"),
    address: medium.default(""),
    showEmbed: z.boolean().default(true),
  }),
  z.object({
    ...base,
    type: z.literal("newsletter"),
    title: short.default("Join the list"),
    description: medium.default(""),
    buttonLabel: short.default("Subscribe"),
    consentText: medium.default("I agree to receive emails. Unsubscribe any time."),
    successMessage: short.default("Thanks — you're subscribed."),
  }),
  z.object({
    ...base,
    type: z.literal("form"),
    title: short.default("Get in touch"),
    description: medium.default(""),
    askPhone: z.boolean().default(false),
    buttonLabel: short.default("Send"),
    consentText: medium.default("I agree that my details are stored so I can be contacted about this enquiry."),
    successMessage: short.default("Thanks — we'll be in touch soon."),
  }),
  z.object({
    ...base,
    type: z.literal("faq"),
    title: short.default("FAQ"),
    items: z.array(z.object({ q: short, a: long })).max(LIMITS.faqItems).default([]),
  }),
  z.object({
    ...base,
    type: z.literal("testimonial"),
    quote: medium.default(""),
    author: short.default(""),
    role: short.default(""),
    avatar: mediaUrl.default(""),
    rating: z.number().int().min(0).max(5).default(5),
  }),
  z.object({ ...base, type: z.literal("divider"), variant: z.enum(["line", "dots", "wave"]).default("line") }),
  z.object({ ...base, type: z.literal("spacer"), height: z.number().int().min(4).max(160).default(24) }),
  z.object({
    ...base,
    type: z.literal("file"),
    title: short.default("Download"),
    src: mediaUrl.default(""),
    fileName: short.default(""),
    bytes: z.number().int().min(0).default(0),
  }),
  z.object({ ...base, type: z.literal("qr"), title: short.default("Scan to visit"), url: draftUrl.default(""), caption: short.default("") }),
  z.object({
    ...base,
    type: z.literal("section"),
    title: short.default("Section"),
    description: medium.default(""),
    /** Blocks after this one, up to the next section, belong to it. */
    collapsible: z.boolean().default(false),
    collapsed: z.boolean().default(false),
    /** How the section's blocks are laid out: stacked, a swipeable row, or two columns. */
    layout: z.enum(["list", "carousel", "grid"]).default("list"),
  }),
  z.object({ ...base, type: z.literal("marquee"), text: short.default(""), speed: z.enum(["slow", "normal", "fast"]).default("normal") }),
  z.object({
    ...base,
    type: z.literal("embed"),
    /** Allow-listed providers only — see lib/bio/embeds.ts. Raw HTML is never accepted. */
    url: draftUrl.default(""),
    title: short.default(""),
    height: z.number().int().min(80).max(800).default(352),
  }),
  z.object({
    ...base,
    type: z.literal("custom"),
    title: short.default(""),
    text: long.default(""),
    image: mediaUrl.default(""),
    buttonLabel: short.default(""),
    buttonUrl: draftUrl.default(""),
    layout: z.enum(["stack", "side"]).default("stack"),
  }),
]);

export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];
export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;

/* ── theme ──────────────────────────────────────────────────────────────── */

export const themeSchema = z.object({
  background: z.object({
    /** "avatar" = the profile photo, blurred, as a full-bleed backdrop. */
    kind: z.enum(["solid", "gradient", "image", "avatar"]).default("solid"),
    color: hex.default("#f5f5f7"),
    from: hex.default("#e0eaff"),
    to: hex.default("#ffffff"),
    angle: z.number().int().min(0).max(360).default(180),
    image: mediaUrl.default(""),
    /** Where a background photo is anchored (Linktree-style art sits low). */
    position: z.enum(["center", "top", "bottom"]).default("center"),
    /** Darkening overlay over a background image, 0–80 (%). */
    overlay: z.number().int().min(0).max(80).default(0),
  }).prefault({}),
  text: hex.default("#101011"),
  muted: hex.default("#55555c"),
  accent: hex.default("#0000ff"),
  /** Surface for cards (product, form, FAQ). */
  card: hex.default("#ffffff"),
  headingFont: z.enum(FONTS).default("inter"),
  bodyFont: z.enum(FONTS).default("inter"),
  button: z.object({
    style: z.enum(["fill", "outline", "soft", "hard-shadow", "glass", "torn", "wavy"]).default("fill"),
    color: hex.default("#101011"),
    text: hex.default("#ffffff"),
    radius: z.number().int().min(0).max(40).default(14),
    shadow: z.enum(["none", "sm", "md"]).default("none"),
    animation: z.enum(ANIMATIONS).default("lift"),
  }).prefault({}),
  layout: z.object({
    width: z.enum(["narrow", "normal", "wide"]).default("normal"),
    spacing: z.enum(["compact", "normal", "relaxed"]).default("normal"),
    align: z.enum(["center", "left"]).default("center"),
    /** Desktop visitors: page sits on a card over the background, or fills it. */
    desktop: z.enum(["card", "full"]).default("full"),
  }).prefault({}),
  /** Mobile-specific adjustments (narrow viewports only). */
  mobile: z.object({
    fontScale: z.number().min(0.85).max(1.15).default(1),
    compact: z.boolean().default(false),
  }).prefault({}),
});
export type Theme = z.infer<typeof themeSchema>;

/* ── the whole document ─────────────────────────────────────────────────── */

export const pageDocSchema = z.object({
  version: z.literal(1).default(1),
  profile: z.object({
    name: short.default(""),
    bio: medium.default(""),
    avatar: mediaUrl.default(""),
    avatarShape: z.enum(["circle", "rounded", "square"]).default("circle"),
    cover: mediaUrl.default(""),
    coverFocusY: z.number().min(0).max(100).default(50),
    layout: z.enum(["classic", "cover", "hero"]).default("classic"),
    location: short.default(""),
  }).prefault({}),
  socials: z.object({
    items: z.array(socialItem).max(LIMITS.socials).default([]),
    position: z.enum(["top", "bottom", "hidden"]).default("top"),
  }).prefault({}),
  blocks: z.array(blockSchema).max(LIMITS.blocks).default([]),
  /** Deleted blocks, newest first — "restore" in the editor. */
  trash: z.array(blockSchema).max(LIMITS.trash).default([]),
  theme: themeSchema.prefault({}),
  seo: z.object({
    title: short.default(""),
    description: z.string().max(300).default(""),
    image: mediaUrl.default(""),
    noindex: z.boolean().default(false),
  }).prefault({}),
  settings: z.object({
    /** Small "Made with Serverlys Bio" footer. Free either way — no paywall. */
    showBranding: z.boolean().default(true),
    /** Shows a 18+ / sensitive-content interstitial before the page. */
    sensitive: z.boolean().default(false),
    language: z.string().max(10).default("en"),
  }).prefault({}),
});

export type PageDoc = z.infer<typeof pageDocSchema>;

/** Parse anything (DB JSON, template, request body) into a full document. */
export function parseDoc(input: unknown): PageDoc {
  return pageDocSchema.parse(input);
}

export function safeParseDoc(input: unknown) {
  return pageDocSchema.safeParse(input);
}

export function emptyDoc(): PageDoc {
  return pageDocSchema.parse({});
}

/** A fresh block of the given type with every default filled in. */
export function newBlock<T extends BlockType>(type: T, id: string, data: Partial<BlockOf<T>> = {}): BlockOf<T> {
  return blockSchema.parse({ ...data, type, id }) as BlockOf<T>;
}
