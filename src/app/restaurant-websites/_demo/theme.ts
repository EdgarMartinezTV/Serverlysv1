import { Cormorant_Garamond } from "next/font/google";

/**
 * Lumbre's identity — a fictional client brand, deliberately not Serverlys.
 *
 * Charcoal, ivory, champagne and olive. Contrast is measured, not guessed:
 *   ivory on charcoal 16.2:1 · champagne on charcoal 8.3:1 · MUTED_DARK on
 *   charcoal 6.6:1 · olive on ivory 4.7:1 · MUTED_LIGHT on ivory 6.5:1.
 * Champagne on ivory is 1.9:1, so on light grounds it is ORNAMENT only (rules,
 * numerals in display sizes); small accent text there uses OLIVE.
 */
export const CHAR = "#111411";
export const IVORY = "#F4EFE6";
export const SOFT = "#FAF8F3";
export const CHAMPAGNE = "#C8A97E";
export const OLIVE = "#696D55";
/** Secondary text on charcoal. */
export const MUTED_DARK = "#9C9A90";
/** Secondary text on ivory and soft white. */
export const MUTED_LIGHT = "#55574C";

/**
 * Display face. Cormorant Garamond for the editorial voice; UI and body copy
 * stay on the site's DM Sans (`font-display`), so the demo adds one family.
 * Latin subset covers Spanish (á é í ñ ó ú ¿ ¡ are Latin-1).
 */
export const display = Cormorant_Garamond({
  weight: ["300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  // Not preloaded: four files at high priority competed with the critical CSS
  // on mobile, and the LCP text (the hero sub-paragraph) is in DM Sans. The
  // serif arrives from the stylesheet a beat later and swaps in.
  preload: false,
});

/** Kept for the components that predate the rebrand. */
export const serif = display;
