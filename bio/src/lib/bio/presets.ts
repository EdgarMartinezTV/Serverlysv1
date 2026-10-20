import type { Theme } from "./schema.ts";

type Preset = { name: string; theme: Partial<Omit<Theme, "button" | "background">> & { background: Partial<Theme["background"]>; button: Partial<Theme["button"]> } };

/** One-click colour palettes in Appearance. Each sets colours only — fonts and layout stay. */
export const PALETTES: Preset[] = [
  { name: "Serverlys", theme: { background: { kind: "solid", color: "#f5f7ff" }, text: "#101011", muted: "#55555c", accent: "#0000ff", card: "#ffffff", button: { color: "#0000ff", text: "#ffffff" } } },
  { name: "Midnight", theme: { background: { kind: "solid", color: "#0b0d12" }, text: "#f4f4f6", muted: "#a5a7b0", accent: "#7d9bff", card: "#171a22", button: { color: "#f4f4f6", text: "#0b0d12" } } },
  { name: "Paper", theme: { background: { kind: "solid", color: "#f6f1e9" }, text: "#2a2420", muted: "#6b6058", accent: "#b4532a", card: "#fffaf3", button: { color: "#2a2420", text: "#f6f1e9" } } },
  { name: "Sage", theme: { background: { kind: "gradient", from: "#e7efe4", to: "#cddcc6", angle: 160 }, text: "#1f2b1d", muted: "#4f5d4b", accent: "#3f6f3a", card: "#f6faf4", button: { color: "#1f2b1d", text: "#ffffff" } } },
  { name: "Sunset", theme: { background: { kind: "gradient", from: "#ffb88c", to: "#de6262", angle: 200 }, text: "#2b0f0f", muted: "#5a2a24", accent: "#2b0f0f", card: "#fff4ee", button: { color: "#ffffff", text: "#2b0f0f" } } },
  { name: "Ocean", theme: { background: { kind: "gradient", from: "#0f2027", to: "#2c5364", angle: 180 }, text: "#ffffff", muted: "#c3d6de", accent: "#5ee0d6", card: "#14303b", button: { color: "#5ee0d6", text: "#0f2027" } } },
  { name: "Blush", theme: { background: { kind: "solid", color: "#fdeef0" }, text: "#3a1d24", muted: "#7a4f58", accent: "#c2405b", card: "#ffffff", button: { color: "#c2405b", text: "#ffffff" } } },
  { name: "Mono", theme: { background: { kind: "solid", color: "#ffffff" }, text: "#000000", muted: "#555555", accent: "#000000", card: "#f4f4f4", button: { color: "#000000", text: "#ffffff" } } },
  { name: "Neon", theme: { background: { kind: "solid", color: "#111111" }, text: "#f5f5f5", muted: "#a0a0a0", accent: "#c6ff00", card: "#1d1d1d", button: { color: "#c6ff00", text: "#111111" } } },
  { name: "Lavender sky", theme: { background: { kind: "gradient", from: "#e0eaff", to: "#fdfbff", angle: 180 }, text: "#141a33", muted: "#4b5270", accent: "#1f55ff", card: "#ffffff", button: { color: "#141a33", text: "#ffffff" } } },
];

export function applyPalette(t: Theme, p: Preset): Theme {
  return { ...t, ...p.theme, background: { ...t.background, ...p.theme.background }, button: { ...t.button, ...p.theme.button } } as Theme;
}
