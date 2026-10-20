import {
  Archivo,
  Bebas_Neue,
  Caveat,
  Cormorant_Garamond,
  DM_Sans,
  Fraunces,
  Inter,
  JetBrains_Mono,
  Libre_Baskerville,
  Lora,
  Montserrat,
  Outfit,
  Playfair_Display,
  Poppins,
  Space_Grotesk,
} from "next/font/google";
import type { FontId } from "./schema.ts";

/*
 * (next/font requires a literal options object per call — no shared spread.)
 *
 * Every font a page can choose. Self-hosted by next/font and NOT preloaded:
 * the @font-face rules are tiny, and a browser only downloads a file when a
 * page actually uses that family, so offering 15 costs a visitor nothing.
 */
const inter = Inter({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-dm-sans" });
const poppins = Poppins({ subsets: ["latin"], display: "swap", preload: false, weight: ["400", "500", "600", "700"], variable: "--f-poppins" });
const montserrat = Montserrat({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-montserrat" });
const outfit = Outfit({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-outfit" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-space-grotesk" });
const archivo = Archivo({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-archivo" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-playfair" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], display: "swap", preload: false, weight: ["400", "500", "600", "700"], variable: "--f-cormorant" });
const fraunces = Fraunces({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-fraunces" });
const lora = Lora({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-lora" });
const libreBaskerville = Libre_Baskerville({ subsets: ["latin"], display: "swap", preload: false, weight: ["400", "700"], variable: "--f-libre-baskerville" });
const bebas = Bebas_Neue({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--f-bebas" });
const caveat = Caveat({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-caveat" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-jetbrains-mono" });

/** Apply on the page root so every family's CSS variable is defined. */
export const fontVariables = [inter, dmSans, poppins, montserrat, outfit, spaceGrotesk, archivo, playfair, cormorant, fraunces, lora, libreBaskerville, bebas, caveat, jetbrains]
  .map((f) => f.variable)
  .join(" ");

export const FONT_META: Record<FontId, { label: string; stack: string; kind: "sans" | "serif" | "display" | "script" | "mono" }> = {
  inter: { label: "Inter", stack: "var(--f-inter), system-ui, sans-serif", kind: "sans" },
  "dm-sans": { label: "DM Sans", stack: "var(--f-dm-sans), system-ui, sans-serif", kind: "sans" },
  poppins: { label: "Poppins", stack: "var(--f-poppins), system-ui, sans-serif", kind: "sans" },
  montserrat: { label: "Montserrat", stack: "var(--f-montserrat), system-ui, sans-serif", kind: "sans" },
  outfit: { label: "Outfit", stack: "var(--f-outfit), system-ui, sans-serif", kind: "sans" },
  "space-grotesk": { label: "Space Grotesk", stack: "var(--f-space-grotesk), system-ui, sans-serif", kind: "sans" },
  archivo: { label: "Archivo", stack: "var(--f-archivo), system-ui, sans-serif", kind: "sans" },
  playfair: { label: "Playfair Display", stack: "var(--f-playfair), Georgia, serif", kind: "serif" },
  cormorant: { label: "Cormorant Garamond", stack: "var(--f-cormorant), Georgia, serif", kind: "serif" },
  fraunces: { label: "Fraunces", stack: "var(--f-fraunces), Georgia, serif", kind: "serif" },
  lora: { label: "Lora", stack: "var(--f-lora), Georgia, serif", kind: "serif" },
  "libre-baskerville": { label: "Libre Baskerville", stack: "var(--f-libre-baskerville), Georgia, serif", kind: "serif" },
  bebas: { label: "Bebas Neue", stack: "var(--f-bebas), Impact, sans-serif", kind: "display" },
  caveat: { label: "Caveat", stack: "var(--f-caveat), cursive", kind: "script" },
  "jetbrains-mono": { label: "JetBrains Mono", stack: "var(--f-jetbrains-mono), ui-monospace, monospace", kind: "mono" },
};

/** Curated pairings shown as one-click presets in Appearance. */
export const FONT_PAIRS: Array<{ name: string; heading: FontId; body: FontId }> = [
  { name: "Clean", heading: "inter", body: "inter" },
  { name: "Editorial", heading: "playfair", body: "inter" },
  { name: "Luxury", heading: "cormorant", body: "dm-sans" },
  { name: "Friendly", heading: "poppins", body: "dm-sans" },
  { name: "Tech", heading: "space-grotesk", body: "inter" },
  { name: "Bold", heading: "bebas", body: "montserrat" },
  { name: "Warm", heading: "fraunces", body: "lora" },
  { name: "Handmade", heading: "caveat", body: "outfit" },
  { name: "Classic", heading: "libre-baskerville", body: "lora" },
  { name: "Studio", heading: "archivo", body: "jetbrains-mono" },
];
