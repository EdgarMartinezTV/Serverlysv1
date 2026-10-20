import { parseDoc, type PageDoc } from "./schema.ts";

/**
 * The starter template library — rebuilt 2026-10-19 to Linktree's template
 * formula (Edgar: the earlier busy mini-pages were "not even close" to
 * linktr.ee/s/templates). Every template is:
 *
 *   · ONE full-bleed vertical photo (or a rich gradient) that carries the
 *     design, with open space at the bottom where the art shows through;
 *   · a classic header: round avatar (or a monogram), bold name, 1–2 line bio;
 *   · 3–5 short link buttons in ONE signature style (frosted pill, white pill,
 *     icon rows, torn paper, wavy edge, hard rectangle, outline, coloured pill),
 *     optionally one small line of text between them;
 *   · the social icon row UNDER the buttons.
 *
 * No product cards, carousels, forms or embeds — customers add those in the
 * editor. Names and copy are original (no Linktree template names reused).
 * Images are real Unsplash stock photos, each URL checked to return
 * 200 + image/* when written; nothing AI-generated, no visible brand logos.
 *
 * Block ids are positional ("t-<prefix>-1", "-2", …). Template ids are stable:
 * the marketing site and existing fixtures reference them.
 */

export const TEMPLATE_CATEGORIES = [
  { id: "personal", label: "Personal brand" },
  { id: "restaurant", label: "Restaurants" },
  { id: "beauty", label: "Beauty salons" },
  { id: "barber", label: "Barbershops" },
  { id: "real-estate", label: "Real estate" },
  { id: "store", label: "Online stores" },
  { id: "creator", label: "Content creators" },
  { id: "music", label: "Musicians" },
  { id: "photo", label: "Photographers" },
  { id: "coach", label: "Coaches" },
  { id: "freelance", label: "Freelancers" },
  { id: "services", label: "Professional services" },
  { id: "podcast", label: "Podcasts" },
  { id: "fitness", label: "Fitness" },
  { id: "events", label: "Events" },
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]["id"];

export type TemplateDef = {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  featured?: boolean;
  doc: PageDoc;
};

/* ── photos (all verified 200 image/jpeg) ───────────────────────────────── */

/** Unsplash CDN photo, cropped server-side. */
const img = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const avatar = (id: string) => img(id, 400);
/** Full-page backgrounds: portrait crop so the art fills a phone screen. */
const bgPhoto = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=2400&q=70`;

const BG = {
  valley: "1426604966848-d7adac402bff",
  tulips: "1468327768560-75b778cbb551",
  goldenField: "1470252649378-9c29740c9fa8",
  beachSky: "1471922694854-ff1b63b20054",
  mistyLake: "1473448912268-2022ce9509d8",
  vinyl: "1483412033650-1015ddeb83d1",
  market: "1488459716781-31db52582fe9",
  sunsetFigure: "1490730141103-6cac27aaab94",
  cameraGrey: "1495121553079-4c61bcce1894",
  wood: "1495195134817-aeb325a55b65",
  cliffTown: "1499678329028-101435549a4e",
  coffeeDesk: "1499750310107-5fef28a66643",
  fieldDusk: "1500382017468-9049fed747ef",
  autumn: "1501973801540-537f08ccae7b",
  tree: "1502082553048-f009c37129b9",
  leaf: "1504198266287-1659872e6590",
  aerialSea: "1505142468610-359e7d316be0",
  spices: "1506368249639-73a05d6f6488",
  desert: "1509316785289-025f5b846b35",
  aloe: "1509423350716-97f9360b4e09",
  pizza: "1513104890138-7c749659a591",
  barbell: "1517963879433-6ad2b056d712",
  calmSea: "1518837695005-2083093ee35b",
  palmBeach: "1519046904884-53103b34b206",
  darkFlowers: "1519741497674-611481863552",
  skate: "1520045892732-304bc3ac5d8e",
  interior: "1524758631624-e2822e304c36",
  paintSplash: "1528459801416-a9e53bbf4e17",
  swimmer: "1530549387789-4c1017266635",
  peaks: "1534067783941-51c9c23ecefd",
  ink: "1541701494587-cb58502866ab",
  hiker: "1551632811-561732d1e306",
  acrylic: "1557672172-298e090bd0f1",
  orangeBlue: "1557800636-894a64c1696f",
  macarons: "1569864358642-9d1684040f43",
  poolGarden: "1576013551627-0cc20b96c2a7",
  paper: "1586075010923-2dd4570fb338",
  fruit: "1610832958506-aa56368176cf",
  latte: "1495474472287-4d71bcdd2085",
  barberShop: "1585747860715-2ba37e788b70",
  neonAlley: "1528360983277-13d401cdc186",
  crowd: "1459749411175-04bf5292ceea",
  forest: "1441974231531-c6227db76b6e",
  candle: "1603006905003-be475563bc59",
  lakeMountains: "1493246507139-91e8fad9978e",
  modernHouse: "1600585154340-be6161a56a0c",
} as const;

const FACE = {
  womanRedTop: "1494790108377-be9c29b29330",
  manSmiling: "1507003211169-0a1dd7228f2d",
  womanLake: "1438761681033-6461ffad8d80",
  manBlazer: "1500648767791-00dcc994a43e",
  womanBlueLight: "1534528741775-53994a69daeb",
  womanStripes: "1544005313-94ddf0286df2",
  manDark: "1506794778202-cad84cf45f1d",
  womanHoodie: "1517841905240-472988babdf9",
  womanCollar: "1531123897727-8f129e1688ce",
  womanBlazer: "1573496359142-b8d87734a5a2",
  womanBun: "1580489944761-15a19d654956",
  manHat: "1539571696357-5a69c17a67c6",
  manStripes: "1463453091185-61582044d556",
  womanBlonde: "1508214751196-bcfd4ca60f91",
  manSuit: "1519085360753-af0119f7cbe7",
  manSmile: "1522529599102-193c0d76b5b6",
  womanDark: "1524504388940-b1c1722653e1",
  womanPink: "1531746020798-e6953c6e8e04",
  manPlain: "1535713875002-d1d0cf377fde",
  womanSweater: "1504703395950-b89145a5425b",
  // added 2026-10-19 (Linktree formula pass)
  redFreckles: "1489424731084-a5d8b219a5bb",
  manJacketField: "1492562080023-ab3db95bfbce",
  manTee: "1508341591423-4347099e1f19",
  manBeanie: "1521119989659-a83eee488004",
  womanDenimField: "1526510747491-58f928ec870f",
  manScarf: "1527980965255-d3b416303d12",
  womanRedBg: "1544725176-7c40e5a71c5e",
  womanDenimTown: "1546961329-78bef0414d7c",
  manGlasses: "1547425260-76bcadfb4f2c",
  womanPalms: "1548142813-c348350df52b",
  womanFreckles: "1554151228-14d9def656e4",
  manArmsCrossed: "1557862921-37829c790f19",
  womanSmile: "1567532939604-b6b5b0db2604",
  manGrey: "1570295999919-56ceb5ecca61",
  womanCardigan: "1573497019940-1c28c88b4f3e",
  manBeard: "1599566150163-29194dcaad36",
  womanCollarBlue: "1607746882042-944635dfe10e",
} as const;

const OBJ = {
  espresso: "1511920170033-f8396924c348",
  bread: "1509440159596-0249088772ff",
  studioMic: "1478737270239-2f02b77fc618",
  boombox: "1487180144351-b8472da7d491",
  poppies: "1490750967868-88aa4486c946",
  fade: "1599351431202-1e0f0137899a",
} as const;

/* ── builder ────────────────────────────────────────────────────────────── */

type Platform = "instagram" | "tiktok" | "youtube" | "facebook" | "x" | "linkedin" | "threads" | "pinterest" | "whatsapp" | "spotify" | "soundcloud" | "applemusic" | "twitch" | "discord" | "github" | "behance" | "dribbble" | "email" | "website";

const SOCIAL_URL: Record<Platform, string> = {
  instagram: "https://instagram.com/yourhandle",
  tiktok: "https://tiktok.com/@yourhandle",
  youtube: "https://youtube.com/@yourhandle",
  facebook: "https://facebook.com/yourhandle",
  x: "https://x.com/yourhandle",
  linkedin: "https://linkedin.com/in/yourhandle",
  threads: "https://threads.net/@yourhandle",
  pinterest: "https://pinterest.com/yourhandle",
  whatsapp: "https://wa.me/15550100",
  spotify: "https://open.spotify.com/artist/yourhandle",
  soundcloud: "https://soundcloud.com/yourhandle",
  applemusic: "https://music.apple.com/artist/yourhandle",
  twitch: "https://twitch.tv/yourhandle",
  discord: "https://discord.gg/yourinvite",
  github: "https://github.com/yourhandle",
  behance: "https://behance.net/yourhandle",
  dribbble: "https://dribbble.com/yourhandle",
  email: "hello@example.com",
  website: "https://example.com",
};

/** A button ("Label"), a button with an icon or thumbnail, or a line of text. */
type Item = string | { t: string; icon?: Platform; thumb?: string; sub?: string } | { text: string };

type Spec = {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  featured?: boolean;
  prefix: string;
  person: { name: string; bio: string; avatar?: string; shape?: "circle" | "rounded" | "square" };
  socials: Platform[];
  items: Item[];
  /** Photo id from BG, or a gradient. */
  bg: { photo: string; overlay?: number; color?: string } | { from: string; to: string; angle?: number };
  colors: { text: string; muted: string; accent?: string; card?: string };
  fonts?: [heading: string, body: string];
  button: { style: "fill" | "outline" | "soft" | "hard-shadow" | "glass" | "torn" | "wavy"; color: string; text: string; radius: number; shadow?: "none" | "sm" | "md" };
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function build(s: Spec): TemplateDef {
  const blocks = s.items.map((it, i) => {
    const id = `t-${s.prefix}-${i + 1}`;
    if (typeof it === "string") return { id, type: "link", title: it, url: `https://example.com/${slug(it)}` };
    if ("text" in it) return { id, type: "text", text: it.text, style: { size: "sm", weight: "bold", spacing: "sm", color: s.colors.accent && s.colors.accent !== s.button.color ? s.colors.accent : s.colors.text } };
    return { id, type: "link", title: it.t, subtitle: it.sub ?? "", url: `https://example.com/${slug(it.t)}`, icon: it.icon ?? "", thumbnail: it.thumb ?? "" };
  });
  const background =
    "photo" in s.bg
      ? { kind: "image", image: bgPhoto(s.bg.photo), overlay: s.bg.overlay ?? 0, color: s.bg.color ?? "#1a1a1a" }
      : { kind: "gradient", from: s.bg.from, to: s.bg.to, angle: s.bg.angle ?? 180, color: s.bg.to };
  const [headingFont, bodyFont] = s.fonts ?? ["dm-sans", "dm-sans"];
  const doc = parseDoc({
    profile: { name: s.person.name, bio: s.person.bio, avatar: s.person.avatar ? avatar(s.person.avatar) : "", avatarShape: s.person.shape ?? "circle", layout: "classic" },
    socials: { position: "bottom", items: s.socials.map((p) => ({ platform: p, url: SOCIAL_URL[p] })) },
    blocks,
    theme: {
      background,
      text: s.colors.text,
      muted: s.colors.muted,
      accent: s.colors.accent ?? s.button.color,
      card: s.colors.card ?? (s.colors.text === "#ffffff" ? "#1c1c1f" : "#ffffff"),
      headingFont,
      bodyFont,
      button: { style: s.button.style, color: s.button.color, text: s.button.text, radius: s.button.radius, shadow: s.button.shadow ?? "none", animation: "lift" },
      layout: { width: "narrow", spacing: "normal", align: "center", desktop: "full" },
    },
    seo: { title: `${s.person.name} | Links`, description: s.person.bio },
    settings: { showBranding: true },
  });
  return { id: s.id, name: s.name, category: s.category, description: s.description, featured: s.featured, doc };
}

const WHITE = "#ffffff";
const SOFT_WHITE = "#f1efec";

/* ── the library ────────────────────────────────────────────────────────── */

const SPECS: Spec[] = [
  /* ── Personal brand ── */
  {
    id: "personal-golden-hour",
    name: "Golden Hour",
    category: "personal",
    featured: true,
    description: "Sunset field, white pill buttons — the classic creator page.",
    prefix: "gold",
    person: { name: "Noa Castillo", bio: "Slow mornings, long walks and a weekly letter.", avatar: FACE.womanBlonde },
    socials: ["instagram", "tiktok", "youtube", "email"],
    items: ["Read this week's letter", "My favourite things", "Photo prints", "Work with me"],
    bg: { photo: BG.goldenField, overlay: 25 },
    colors: { text: WHITE, muted: SOFT_WHITE },
    button: { style: "fill", color: WHITE, text: "#2a2420", radius: 40 },
  },
  {
    id: "personal-ava",
    name: "Grain",
    category: "personal",
    description: "Pale wood texture, dark pills, quiet type.",
    prefix: "grain",
    person: { name: "Ava Morales", bio: "Brand strategist & weekend ceramicist.", avatar: FACE.womanRedTop },
    socials: ["instagram", "linkedin", "threads", "email"],
    items: ["Latest essay", "Brand workshops", "Ceramics shop", "Speaking"],
    bg: { photo: BG.wood, overlay: 0, color: "#e9e4dc" },
    colors: { text: "#2b2622", muted: "#5d544c", card: "#ffffff" },
    fonts: ["fraunces", "dm-sans"],
    button: { style: "fill", color: "#2b2622", text: "#f6f1ea", radius: 40 },
  },
  {
    id: "personal-margins",
    name: "Margins",
    category: "personal",
    description: "Autumn leaves and dark torn-paper buttons for writers and readers.",
    prefix: "margins",
    person: { name: "Hazel Quinn", bio: "Reading my way through every bookshop in town.", avatar: FACE.redFreckles },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Book reviews", "Join my book club", "Sunday coffee chats", "Reading list"],
    bg: { photo: BG.autumn, overlay: 42 },
    colors: { text: WHITE, muted: "#fbeee0" },
    fonts: ["lora", "dm-sans"],
    button: { style: "torn", color: "#2a2520", text: "#f7efe4", radius: 0 },
  },

  /* ── Restaurants ── */
  {
    id: "restaurant-bistro",
    name: "Ember Table",
    category: "restaurant",
    featured: true,
    description: "Wood-fired pizza photo with cream torn-paper buttons.",
    prefix: "ember",
    person: { name: "Olive & Ember", bio: "Wood-fired kitchen · open late on weekends." },
    socials: ["instagram", "tiktok", "facebook", "whatsapp"],
    items: ["Reserve a table", "Tonight's menu", "Order pickup", "Gift cards"],
    bg: { photo: BG.pizza, overlay: 40 },
    colors: { text: WHITE, muted: "#f8ebe0" },
    fonts: ["playfair", "dm-sans"],
    button: { style: "torn", color: "#f3e9d8", text: "#6b1d12", radius: 0 },
  },
  {
    id: "restaurant-cafe",
    name: "First Pour",
    category: "restaurant",
    description: "Latte art from above, white pills, warm and simple.",
    prefix: "pour",
    person: { name: "Marigold Coffee", bio: "Small-batch roasts and flaky pastries. Open 7–4.", avatar: OBJ.espresso },
    socials: ["instagram", "tiktok", "facebook", "website"],
    items: ["Today's menu", "Order ahead", "Find us", "Beans by mail"],
    bg: { photo: BG.latte, overlay: 35 },
    colors: { text: WHITE, muted: "#f5ece3" },
    button: { style: "fill", color: WHITE, text: "#4a2c1d", radius: 40 },
  },
  {
    id: "restaurant-bakery",
    name: "Sugar Shell",
    category: "restaurant",
    featured: true,
    description: "Pastel macarons with scalloped cream buttons and red type.",
    prefix: "sugar",
    person: { name: "Rise Bakehouse", bio: "Plant-based bakery · baked at dawn." },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Book our afternoon tea", "Menu", "Monthly specials", "Gift cards", "Contact us"],
    bg: { photo: BG.macarons, overlay: 35, color: "#7a4a3e" },
    colors: { text: WHITE, muted: "#fff1ea", card: "#fff7ee" },
    button: { style: "wavy", color: "#fff7ee", text: "#b3261e", radius: 0 },
  },
  {
    id: "restaurant-juice",
    name: "Pulp",
    category: "restaurant",
    description: "Bright cut fruit and frosted pill buttons for juice bars.",
    prefix: "pulp",
    person: { name: "Pulp Juice Co.", bio: "Your daily dose of vitamin C.", avatar: BG.orangeBlue },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Our drinks", "Find us", "Wellbeing", "Our latest podcast"],
    bg: { photo: BG.fruit, overlay: 35 },
    colors: { text: WHITE, muted: "#fff4e6" },
    button: { style: "glass", color: WHITE, text: WHITE, radius: 40 },
  },
  {
    id: "restaurant-spice",
    name: "Spice Route",
    category: "restaurant",
    description: "Spoonfuls of spice on marble, crisp white rectangles with icons.",
    prefix: "spice",
    person: { name: "Saffron Lane", bio: "Home cooking classes & a monthly spice box." },
    socials: ["instagram", "youtube", "tiktok", "pinterest"],
    items: [{ t: "Cooking classes", icon: "website" }, { t: "Recipes", icon: "youtube" }, { t: "Spice box", icon: "instagram" }, { t: "Say hello", icon: "email" }],
    bg: { photo: BG.spices, overlay: 50 },
    colors: { text: WHITE, muted: "#f3eee6" },
    button: { style: "fill", color: WHITE, text: "#2b2a28", radius: 12, shadow: "sm" },
  },

  /* ── Beauty ── */
  {
    id: "beauty-salon",
    name: "Tulip",
    category: "beauty",
    description: "Tulips against a blue sky, white pills with rose type.",
    prefix: "tulip",
    person: { name: "Bloom Atelier", bio: "Hair, brows & nails by appointment.", avatar: FACE.womanBun },
    socials: ["instagram", "tiktok", "pinterest", "whatsapp"],
    items: ["Book an appointment", "Price list", "Gift vouchers", "Find the studio"],
    bg: { photo: BG.tulips, overlay: 35 },
    colors: { text: WHITE, muted: "#f7f2f4" },
    button: { style: "fill", color: WHITE, text: "#a3324f", radius: 40, shadow: "sm" },
  },
  {
    id: "beauty-glow",
    name: "Rosewater",
    category: "beauty",
    featured: true,
    description: "Rose-to-lilac gradient, white rounded buttons, soft and glossy.",
    prefix: "glow",
    person: { name: "Glow Ritual", bio: "Facials, lash lifts & skin consults.", avatar: FACE.womanFreckles },
    socials: ["instagram", "tiktok", "youtube", "pinterest"],
    items: ["Book a treatment", "Skin quiz", "Aftercare guide", "Shop skincare"],
    bg: { from: "#f9c9dc", to: "#c7a6f2", angle: 160 },
    colors: { text: "#3a1430", muted: "#5b2d4d", card: "#ffffff" },
    fonts: ["poppins", "dm-sans"],
    button: { style: "fill", color: WHITE, text: "#3a1430", radius: 16, shadow: "sm" },
  },

  /* ── Barbershops ── */
  {
    id: "barber-shop",
    name: "Iron Chair",
    category: "barber",
    description: "Moody shop interior, cream hard-edged buttons and condensed type.",
    prefix: "iron",
    person: { name: "Iron & Oak Barbers", bio: "Classic cuts & hot-towel shaves.", avatar: OBJ.fade },
    socials: ["instagram", "tiktok", "facebook", "whatsapp"],
    items: ["Book a chair", "Prices", "Find the shop", "Gift a cut"],
    bg: { photo: BG.barberShop, overlay: 55 },
    colors: { text: WHITE, muted: "#e8ded0" },
    fonts: ["bebas", "dm-sans"],
    button: { style: "fill", color: "#e9dcc6", text: "#1e1a16", radius: 0 },
  },
  {
    id: "barber-street",
    name: "Fade Lab",
    category: "barber",
    description: "Neon alley at night with peach torn-paper buttons.",
    prefix: "fadelab",
    person: { name: "Fade Lab", bio: "Fades, tapers & designs. Walk-ins after 3pm.", avatar: FACE.manBeard },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: [{ t: "Book now", icon: "website" }, { t: "TikTok cuts", icon: "tiktok" }, { t: "Instagram", icon: "instagram" }],
    bg: { photo: BG.neonAlley, overlay: 40 },
    colors: { text: WHITE, muted: "#f3e6ea" },
    button: { style: "torn", color: "#f2b38b", text: "#4a200d", radius: 0 },
  },

  /* ── Real estate ── */
  {
    id: "real-estate-agent",
    name: "Open Plan",
    category: "real-estate",
    featured: true,
    description: "Modern home at dusk, white cards with icons — calm and trustworthy.",
    prefix: "openplan",
    person: { name: "Nadia Brooks", bio: "Homes for first-time buyers · San Diego.", avatar: FACE.womanBlazer },
    socials: ["instagram", "linkedin", "youtube", "email"],
    items: [{ t: "Current listings", icon: "website" }, { t: "What's my home worth?", icon: "email" }, { t: "Buyer guide", icon: "youtube" }, { t: "Book a call", icon: "whatsapp" }],
    bg: { photo: BG.modernHouse, overlay: 35 },
    colors: { text: WHITE, muted: "#eef1f2" },
    button: { style: "fill", color: WHITE, text: "#1f2427", radius: 12, shadow: "sm" },
  },
  {
    id: "real-estate-luxury",
    name: "Poolside",
    category: "real-estate",
    description: "Garden pool and frosted glass pills for luxury listings.",
    prefix: "poolside",
    person: { name: "Celeste Ward", bio: "Luxury homes & penthouses.", avatar: FACE.womanBlueLight },
    socials: ["instagram", "linkedin", "youtube", "whatsapp"],
    items: ["Private viewings", "Featured homes", "Sell with me", "Contact"],
    bg: { photo: BG.poolGarden, overlay: 25 },
    colors: { text: WHITE, muted: "#eef4f2" },
    fonts: ["cormorant", "dm-sans"],
    button: { style: "glass", color: WHITE, text: WHITE, radius: 40 },
  },

  /* ── Online stores ── */
  {
    id: "store-goods",
    name: "Citrus",
    category: "store",
    featured: true,
    description: "A single orange on blue, sunny yellow pills with orange type.",
    prefix: "citrus",
    person: { name: "Sunny Side Goods", bio: "Small-batch kitchen goods, shipped plastic-free." },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Shop new arrivals", "Find us", "Wellbeing journal", "Our latest podcast"],
    bg: { photo: BG.orangeBlue, overlay: 0, color: "#3aa7e8" },
    colors: { text: WHITE, muted: "#eef8ff", card: "#ffffff" },
    button: { style: "fill", color: "#ffd400", text: "#b23a00", radius: 40 },
  },
  {
    id: "store-candles",
    name: "Hearth",
    category: "store",
    description: "Candlelight and cream retro buttons with a hard shadow.",
    prefix: "hearth",
    person: { name: "Hearth & Wick", bio: "Hand-poured candles from Vermont." },
    socials: ["instagram", "pinterest", "tiktok", "email"],
    items: ["Shop candles", "Bestsellers", "Wholesale", "Shipping & returns"],
    bg: { photo: BG.candle, overlay: 40 },
    colors: { text: WHITE, muted: "#f5ead9" },
    fonts: ["fraunces", "dm-sans"],
    button: { style: "hard-shadow", color: "#fbf3e6", text: "#2d2118", radius: 10 },
  },
  {
    id: "store-boutique",
    name: "Leaflet",
    category: "store",
    description: "A single leaf on white, black pills — clean boutique minimal.",
    prefix: "aloe",
    person: { name: "Thread & Needle", bio: "Slow fashion boutique · new drops on Fridays.", avatar: FACE.womanCardigan },
    socials: ["instagram", "pinterest", "tiktok", "email"],
    items: ["Fashion inspo", "Store list", "New this week", "Styling sessions"],
    bg: { photo: BG.leaf, overlay: 0, color: "#f4f4f2" },
    colors: { text: "#111111", muted: "#4b4b4b", card: "#ffffff" },
    button: { style: "fill", color: "#111111", text: WHITE, radius: 40 },
  },

  /* ── Content creators ── */
  {
    id: "creator-travel",
    name: "Cliffside",
    category: "creator",
    featured: true,
    description: "Clifftop village at dusk, white pills with platform icons.",
    prefix: "cliff",
    person: { name: "Mara Lin", bio: "Slow travel & camera-bag secrets.", avatar: FACE.womanHoodie },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: [{ t: "Travel vlog", icon: "youtube" }, { t: "Travel tips", icon: "tiktok" }, { t: "Hiking gear", icon: "website" }, { t: "Camera kit", icon: "instagram" }],
    bg: { photo: BG.cliffTown, overlay: 20 },
    colors: { text: WHITE, muted: "#f6eee8" },
    button: { style: "fill", color: WHITE, text: "#1c1c1f", radius: 40, shadow: "sm" },
  },
  {
    id: "creator-neon",
    name: "Ink",
    category: "creator",
    description: "Ink clouds in water and solid black pills — bold and electric.",
    prefix: "ink",
    person: { name: "KAI//NOVA", bio: "Late-night streams and lo-fi playlists.", avatar: FACE.manStripes },
    socials: ["twitch", "youtube", "discord", "tiktok"],
    items: [{ t: "Watch live", icon: "twitch" }, { t: "Join the Discord", icon: "discord" }, { t: "Latest videos", icon: "youtube" }, "Merch"],
    bg: { photo: BG.ink, overlay: 20 },
    colors: { text: WHITE, muted: "#ecebff" },
    fonts: ["space-grotesk", "dm-sans"],
    button: { style: "fill", color: "#0d0d14", text: WHITE, radius: 40 },
  },
  {
    id: "creator-aura",
    name: "Aura",
    category: "creator",
    description: "Your own photo, blurred into the background, with white icon pills.",
    prefix: "aura",
    person: { name: "Leila Haddad", bio: "Fashion advice from yours truly.", avatar: FACE.womanPink },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: [{ t: "YouTube", icon: "youtube" }, { t: "Pinterest", icon: "pinterest" }, { t: "Instagram", icon: "instagram" }, { t: "TikTok", icon: "tiktok" }],
    bg: { photo: "", overlay: 20 },
    colors: { text: WHITE, muted: "#fbeef3" },
    button: { style: "fill", color: WHITE, text: "#26131c", radius: 10 },
  },
  {
    id: "creator-skate",
    name: "Grip",
    category: "creator",
    description: "Skate deck close-up and hard white rectangles.",
    prefix: "grip",
    person: { name: "Rafa Ortiz", bio: "Skater, filmer, sometimes a cook.", avatar: FACE.manBeanie },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["My favourite parks", "Book me", "Affiliate links"],
    bg: { photo: BG.skate, overlay: 30 },
    colors: { text: WHITE, muted: "#f0ece6" },
    button: { style: "fill", color: WHITE, text: "#111111", radius: 6 },
  },

  /* ── Musicians ── */
  {
    id: "music-artist",
    name: "Crate",
    category: "music",
    featured: true,
    description: "Record spines in warm light, white outline pills.",
    prefix: "crate",
    person: { name: "Juno Vale", bio: "Indie soul. New single 'Low Tide' out now.", avatar: FACE.manDark },
    socials: ["spotify", "applemusic", "youtube", "instagram"],
    items: ["Listen to 'Low Tide'", "Tour dates", "Merch", "Mailing list"],
    bg: { photo: BG.vinyl, overlay: 68 },
    colors: { text: WHITE, muted: "#efe7dc" },
    button: { style: "outline", color: WHITE, text: WHITE, radius: 40 },
  },
  {
    id: "music-zine",
    name: "Cut & Paste",
    category: "music",
    description: "Crumpled paper and black torn-paper buttons — a gig flyer.",
    prefix: "zine",
    person: { name: "The Static Kids", bio: "Three-piece garage band from Detroit.", avatar: OBJ.boombox },
    socials: ["spotify", "youtube", "instagram", "tiktok"],
    items: ["Listen to 'Burnout'", "Tour dates", "Merch table", "Book us"],
    bg: { photo: BG.paper, overlay: 0, color: "#ececea" },
    colors: { text: "#111111", muted: "#3c3c3c", card: "#ffffff" },
    fonts: ["jetbrains-mono", "jetbrains-mono"],
    button: { style: "torn", color: "#111111", text: WHITE, radius: 0 },
  },
  {
    id: "music-acoustic",
    name: "Porch Light",
    category: "music",
    description: "Sunlit forest with scalloped cream buttons and serif type.",
    prefix: "porch",
    person: { name: "Eli Brennan", bio: "Folk songs written on the porch.", avatar: FACE.manHat },
    socials: ["spotify", "soundcloud", "youtube", "instagram"],
    items: ["Pre-save 'Long Way Home'", "On the road", "Songbook", "Porch letters"],
    bg: { photo: BG.forest, overlay: 50 },
    colors: { text: WHITE, muted: "#f1ebdc" },
    fonts: ["fraunces", "dm-sans"],
    button: { style: "wavy", color: "#f4ead5", text: "#4a3420", radius: 0 },
  },
  {
    id: "music-dj",
    name: "Afterhours",
    category: "music",
    description: "Dusk orange fading to black, crisp white rectangles — club night.",
    prefix: "afterhours",
    person: { name: "Shay Okon", bio: "Hard times, hard techno.", avatar: FACE.manScarf },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Boiler room set", "DJ set up", "Book me for a gig", "Next show"],
    bg: { from: "#e0782f", to: "#1c1c1f", angle: 180 },
    colors: { text: WHITE, muted: "#f4e2d4" },
    button: { style: "fill", color: WHITE, text: "#141414", radius: 4 },
  },

  /* ── Photographers ── */
  {
    id: "photo-portfolio",
    name: "Twin Lens",
    category: "photo",
    description: "A vintage camera on grey, black squared buttons in mono type.",
    prefix: "twinlens",
    person: { name: "Lena Hart", bio: "Elopement & adventure portraits.", avatar: FACE.womanStripes },
    socials: ["instagram", "pinterest", "behance", "email"],
    items: ["Portfolio", "Rates & availability", "Check my dates", "Email the studio"],
    bg: { photo: BG.cameraGrey, overlay: 0, color: "#d9d9d9" },
    colors: { text: "#121212", muted: "#3d3d3d", card: "#ffffff" },
    fonts: ["jetbrains-mono", "dm-sans"],
    button: { style: "fill", color: "#121212", text: WHITE, radius: 0 },
  },
  {
    id: "photo-mono",
    name: "Trailhead",
    category: "photo",
    description: "Hiker in the mountains, white outline rectangles.",
    prefix: "trail",
    person: { name: "Jun Okada", bio: "Street & landscape photographer.", avatar: FACE.manPlain },
    socials: ["instagram", "behance", "youtube", "email"],
    items: ["Hiking routes", "Trip schedule", "Prints", "Contact"],
    bg: { photo: BG.hiker, overlay: 30 },
    colors: { text: WHITE, muted: "#eef0ec" },
    button: { style: "outline", color: WHITE, text: WHITE, radius: 0 },
  },
  {
    id: "photo-coast",
    name: "Palm Shore",
    category: "photo",
    description: "Sunny beach with a palm, white pills and dark navy text.",
    prefix: "palm",
    person: { name: "Isla Moreau", bio: "Travel & resort photographer.", avatar: FACE.womanPalms },
    socials: ["instagram", "tiktok", "youtube", "pinterest"],
    items: ["Latest gallery", "Book a shoot", "Presets", "Workshops"],
    bg: { photo: BG.palmBeach, overlay: 0, color: "#bfe4f2" },
    colors: { text: "#0f2a3a", muted: "#244a5e", card: "#ffffff" },
    button: { style: "fill", color: WHITE, text: "#0f2a3a", radius: 40, shadow: "sm" },
  },

  /* ── Coaches ── */
  {
    id: "coach-career",
    name: "Reach",
    category: "coach",
    featured: true,
    description: "Silhouette at sunset on the water, frosted glass pills.",
    prefix: "reach",
    person: { name: "Dana Okafor", bio: "Career coach for mid-career switchers.", avatar: FACE.womanCollar },
    socials: ["linkedin", "youtube", "instagram", "email"],
    items: ["Free discovery call", "90-day programme", "Client stories", "Newsletter"],
    bg: { photo: BG.sunsetFigure, overlay: 35 },
    colors: { text: WHITE, muted: "#fde9e2" },
    button: { style: "glass", color: WHITE, text: WHITE, radius: 40 },
  },
  {
    id: "coach-mindset",
    name: "Summit",
    category: "coach",
    description: "Misty mountain range, white rounded buttons.",
    prefix: "summit",
    person: { name: "Marcus Hale", bio: "Mindset coach for first-time managers.", avatar: FACE.manSuit },
    socials: ["linkedin", "youtube", "x", "email"],
    items: ["1:1 coaching", "Manager bootcamp", "Free checklist", "Podcast"],
    bg: { photo: BG.peaks, overlay: 40 },
    colors: { text: WHITE, muted: "#eef1f3" },
    button: { style: "fill", color: WHITE, text: "#1f2a33", radius: 14 },
  },
  {
    id: "coach-yoga",
    name: "Sun Salutation",
    category: "coach",
    description: "Warm sunlit gradient with white pills — calm and friendly.",
    prefix: "salute",
    person: { name: "Priya Anand", bio: "A slow, kind yoga practice for busy people.", avatar: FACE.womanSmile },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Class schedule", "Studio info", "Upcoming events", "About"],
    bg: { from: "#f2a65a", to: "#e0703c", angle: 170 },
    colors: { text: WHITE, muted: "#fff1e4" },
    button: { style: "fill", color: WHITE, text: "#7a3414", radius: 40 },
  },

  /* ── Freelancers ── */
  {
    id: "freelance-designer",
    name: "Desk",
    category: "freelance",
    description: "Morning desk with coffee, white rounded buttons with icons.",
    prefix: "desk",
    person: { name: "Theo Park", bio: "Product designer · booking January.", avatar: FACE.manSmiling },
    socials: ["dribbble", "behance", "linkedin", "github"],
    items: [{ t: "Selected work", icon: "dribbble" }, { t: "Case studies", icon: "behance" }, { t: "My CV", icon: "linkedin" }, { t: "Start a project", icon: "email" }],
    bg: { photo: BG.coffeeDesk, overlay: 30 },
    colors: { text: WHITE, muted: "#f0e8df" },
    button: { style: "fill", color: WHITE, text: "#1d1d1f", radius: 10 },
  },
  {
    id: "freelance-brutal",
    name: "Block Party",
    category: "freelance",
    description: "Yellow-to-coral gradient and chunky retro buttons with a hard shadow.",
    prefix: "block",
    person: { name: "Rae Kowalski", bio: "Illustrator & motion designer.", avatar: FACE.womanDark },
    socials: ["instagram", "dribbble", "behance", "email"],
    items: ["See the portfolio", "Hire me", "Sticker shop", "Say hi"],
    bg: { from: "#ffe14d", to: "#ff7a59", angle: 160 },
    colors: { text: "#111111", muted: "#2b2b2b", card: "#ffffff" },
    fonts: ["space-grotesk", "space-grotesk"],
    button: { style: "hard-shadow", color: WHITE, text: "#111111", radius: 0 },
  },
  {
    id: "freelance-artist",
    name: "Splash",
    category: "freelance",
    description: "Watercolour splashes on white with soft outline pills.",
    prefix: "splash",
    person: { name: "Lexie Marsh", bio: "Pastel painter from Melbourne.", avatar: FACE.womanDenimTown },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Print store", "Commissions", "Contact me", "Brands I love"],
    bg: { photo: BG.paintSplash, overlay: 0, color: "#f6f4f2" },
    colors: { text: "#1d3a8a", muted: "#2f4c9b", card: "#ffffff" },
    button: { style: "fill", color: WHITE, text: "#1d3a8a", radius: 40, shadow: "sm" },
  },

  /* ── Professional services ── */
  {
    id: "services-accountant",
    name: "Evergreen",
    category: "services",
    description: "A single tree under a big sky, white squared buttons in green.",
    prefix: "evergreen",
    person: { name: "Calder Tax & Advisory", bio: "Flat-fee tax and bookkeeping.", avatar: FACE.manBlazer },
    socials: ["linkedin", "facebook", "email", "website"],
    items: ["Book a consultation", "Our services", "Tax deadlines", "Call the office"],
    bg: { photo: BG.tree, overlay: 35 },
    colors: { text: WHITE, muted: "#f0f5ee" },
    fonts: ["libre-baskerville", "dm-sans"],
    button: { style: "fill", color: WHITE, text: "#1f4d2c", radius: 6 },
  },
  {
    id: "services-legal",
    name: "Still Water",
    category: "services",
    description: "Lake and mountains at dawn, navy squared buttons and serif headings.",
    prefix: "stillwater",
    person: { name: "Harbor Counsel", bio: "Small-business law, plain answers." },
    socials: ["linkedin", "facebook", "email", "website"],
    items: ["Free consultation", "Practice areas", "Fees", "Contact"],
    bg: { photo: BG.lakeMountains, overlay: 30 },
    colors: { text: WHITE, muted: "#eaf0f5" },
    fonts: ["libre-baskerville", "dm-sans"],
    button: { style: "fill", color: "#12263f", text: WHITE, radius: 8 },
  },

  /* ── Podcasts ── */
  {
    id: "podcast-show",
    name: "Deep Water",
    category: "podcast",
    description: "Calm sea surface and frosted glass pills.",
    prefix: "deep",
    person: { name: "Late Shift Talks", bio: "Conversations after hours. New every Tuesday.", avatar: OBJ.studioMic },
    socials: ["spotify", "applemusic", "youtube", "instagram"],
    items: [{ t: "Latest episode", icon: "spotify" }, { t: "Apple Podcasts", icon: "applemusic" }, { t: "Watch on YouTube", icon: "youtube" }, "Be a guest"],
    bg: { photo: BG.calmSea, overlay: 25 },
    colors: { text: WHITE, muted: "#e6f0f4" },
    button: { style: "glass", color: WHITE, text: WHITE, radius: 40 },
  },
  {
    id: "podcast-studio",
    name: "On Air",
    category: "podcast",
    description: "Charcoal background with grey pills — a minimal studio look.",
    prefix: "onair",
    person: { name: "Off Air with Dana & Lou", bio: "Hit record. Every Monday.", avatar: FACE.manGlasses },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Subscribe to our podcast", "Latest episode", "Tour dates", "Our website"],
    bg: { from: "#2b2b2e", to: "#121214", angle: 180 },
    colors: { text: WHITE, muted: "#c9c9cf" },
    button: { style: "fill", color: "#6b6b72", text: WHITE, radius: 6 },
  },

  /* ── Fitness ── */
  {
    id: "fitness-studio",
    name: "Lift",
    category: "fitness",
    description: "Barbell on the gym floor with electric lime buttons.",
    prefix: "lift",
    person: { name: "Forge Strength", bio: "Small-group strength training · Denver." },
    socials: ["instagram", "tiktok", "youtube", "whatsapp"],
    items: ["Free first class", "Class schedule", "Memberships", "Message a coach"],
    bg: { photo: BG.barbell, overlay: 45 },
    colors: { text: WHITE, muted: "#e7ece4" },
    fonts: ["archivo", "dm-sans"],
    button: { style: "fill", color: "#c6ff3d", text: "#111111", radius: 6 },
  },
  {
    id: "fitness-yoga",
    name: "Mist",
    category: "fitness",
    description: "Misty lake and pines, white pills and soft white type.",
    prefix: "mist",
    person: { name: "Still Point Yoga", bio: "Slow flow & breathwork by the lake.", avatar: FACE.womanSweater },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["This week's classes", "Breathwork circle", "Online library", "Retreats"],
    bg: { photo: BG.mistyLake, overlay: 35 },
    colors: { text: WHITE, muted: "#eef2f0" },
    button: { style: "fill", color: WHITE, text: "#1e2b26", radius: 40, shadow: "sm" },
  },
  {
    id: "fitness-surf",
    name: "Swell",
    category: "fitness",
    description: "Aerial ocean and sand, white pills with a line of text between.",
    prefix: "swell",
    person: { name: "Teo Marin", bio: "Surf coach on the north shore.", avatar: FACE.manJacketField },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Surf school hours", "Lesson types", { text: "Never surfed before?" }, "Beginner course", "Group lessons"],
    bg: { photo: BG.aerialSea, overlay: 30 },
    colors: { text: WHITE, muted: "#eaf7f8" },
    button: { style: "fill", color: WHITE, text: "#0f3340", radius: 40 },
  },
  {
    id: "fitness-swim",
    name: "Lane Six",
    category: "fitness",
    description: "Swimmer in a blue pool, white scalloped buttons.",
    prefix: "lane",
    person: { name: "Dena Price", bio: "Long-distance swimmer & coach.", avatar: FACE.womanCollarBlue },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Training plans", "Open-water routes", "Nutrition"],
    bg: { photo: BG.swimmer, overlay: 35 },
    colors: { text: WHITE, muted: "#e6f2fb" },
    button: { style: "wavy", color: WHITE, text: "#0d3a66", radius: 0 },
  },

  /* ── Events ── */
  {
    id: "events-night-market",
    name: "Sand & Sky",
    category: "events",
    description: "Desert valley at golden hour, white torn-paper buttons.",
    prefix: "sand",
    person: { name: "Lantern Night Market", bio: "Street food & local makers, Fridays all summer." },
    socials: ["instagram", "facebook", "tiktok", "email"],
    items: ["This week's lineup", "Vendor map", "Become a vendor", "Volunteer"],
    bg: { photo: BG.desert, overlay: 15 },
    colors: { text: WHITE, muted: "#fbeee2" },
    button: { style: "torn", color: WHITE, text: "#5c2a12", radius: 0 },
  },
  {
    id: "events-wedding",
    name: "Ivy & Rowan",
    category: "events",
    description: "Dark florals with ivory outline pills and elegant serif type.",
    prefix: "ivy",
    person: { name: "Ivy and Rowan", bio: "Married 20.09.2027 · Scottish Highlands.", avatar: OBJ.poppies },
    socials: ["instagram", "email", "whatsapp", "website"],
    items: ["RSVP", "The weekend", "Places to stay", "Registry"],
    bg: { photo: BG.darkFlowers, overlay: 30 },
    colors: { text: WHITE, muted: "#f2ece4" },
    fonts: ["cormorant", "lora"],
    button: { style: "outline", color: "#f6efe4", text: "#f6efe4", radius: 40 },
  },
  {
    id: "events-community",
    name: "Common Ground",
    category: "events",
    description: "Cobalt blue gradient, white pills and a lime line of text.",
    prefix: "common",
    person: { name: "Mina Faulk", bio: "Local organiser · community gardens & clean-ups.", avatar: FACE.womanDenimField },
    socials: ["tiktok", "youtube", "x", "instagram"],
    items: ["Join our local garden", { text: "Volunteer days" }, "Neighbourhood clean-up", "Council meetings"],
    bg: { from: "#2a5be0", to: "#1a3aa6", angle: 200 },
    colors: { text: WHITE, muted: "#e5ecff", accent: "#d9ff3d" },
    button: { style: "fill", color: WHITE, text: "#12245e", radius: 40 },
  },
];

/** "photo": "" means the blurred-avatar background (see creator-aura). */
function fixAura(t: TemplateDef, spec: Spec): TemplateDef {
  if ("photo" in spec.bg && spec.bg.photo === "") {
    t.doc.theme.background = { ...t.doc.theme.background, kind: "avatar", image: "", overlay: spec.bg.overlay ?? 20, color: "#5b3a44" };
  }
  return t;
}

export const TEMPLATES: TemplateDef[] = SPECS.map((s) => fixAura(build(s), s));

const byId = new Map(TEMPLATES.map((t) => [t.id, t]));

export function getTemplate(id: string): TemplateDef | undefined {
  return byId.get(id);
}
