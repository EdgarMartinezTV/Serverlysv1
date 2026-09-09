/**
 * Design-token validator.
 *
 * Tailwind silently ignores a class it cannot resolve, so a renamed or deleted
 * token produces NO build error — the style just disappears. This walks every
 * colour utility in the codebase and fails if it does not resolve to a token
 * defined in globals.css.
 *
 * Also re-computes the documented contrast floors so a palette edit cannot
 * quietly drop a pair below WCAG AA.
 *
 * Usage: node scripts/validate-tokens.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync("src/app/globals.css", "utf8");
const defined = new Set([...css.matchAll(/--color-([a-z0-9-]+):/g)].map((m) => m[1]));

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

const UTILS = "bg|text|ring|border|divide|from|to|via|fill|stroke|accent";
const pattern = new RegExp(
  String.raw`(?:^|[\s"'\`])(?:(?:hover|focus|focus-visible|focus-within|active|group-hover|peer-checked|checked|disabled|sm|md|lg|xl):)*` +
    String.raw`(${UTILS})-([a-z][a-z0-9-]*?)(?:\/\d+)?(?=[\s"'\`]|$)`,
  "g",
);

// Utilities whose value is not a colour token.
const NON_COLOUR = new Set([
  "inherit",
  "current",
  "transparent",
  "white",
  "black",
  "none",
  "auto",
  "left",
  "right",
  "center",
  "balance",
  "pretty",
  "wrap",
  "nowrap",
  "clip",
  "ellipsis",
  "solid",
  "dashed",
  "inset",
  "collapse",
  "separate",
  "hidden",
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "body",
  "body-lg",
  "small",
  "caption",
  "mono",
  "sans",
  "start",
  "end",
  "justify",
  "top",
  "bottom",
  // Directional / structural utilities that share the same prefixes.
  "t",
  "b",
  "l",
  "r",
  "x",
  "y",
  "s",
  "e",
  "0",
  "1",
  "2",
  "4",
  "8",
  "px",
  "reverse",
  // Gradient direction utilities share the `bg-` prefix but carry no colour.
  "gradient-to-b",
  "gradient-to-t",
  "gradient-to-l",
  "gradient-to-r",
  "gradient-to-br",
  "gradient-to-bl",
  "gradient-to-tr",
  "gradient-to-tl",
  // Named background utilities defined in @layer utilities, not @theme.
  "grid-dark",
  "hero-glow",
  // Border/divide width resets share the prefix but set no colour.
  "t-0",
  "b-0",
  "l-0",
  "r-0",
  "x-0",
  "y-0",
]);

const failures = [];
for (const file of walk("src")) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(pattern)) {
    const [, util, name] = m;
    if (NON_COLOUR.has(name)) continue;
    if (!defined.has(name)) failures.push(`${util}-${name}  →  ${file}`);
  }
}

// --- contrast re-check -----------------------------------------------------
const hexOf = (token) => {
  let v = new RegExp(`--color-${token}:\\s*([^;]+);`).exec(css)?.[1]?.trim();
  for (let i = 0; i < 5 && v?.startsWith("var("); i++) {
    const inner = /var\(--color-([a-z0-9-]+)\)/.exec(v)?.[1];
    v = new RegExp(`--color-${inner}:\\s*([^;]+);`).exec(css)?.[1]?.trim();
  }
  return v;
};
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => {
  const n = h.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const cr = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const FLOORS = [
  ["fg", "canvas", 4.5],
  ["fg-secondary", "canvas", 4.5],
  ["fg-muted", "canvas", 4.5],
  ["fg-muted", "canvas-secondary", 4.5],
  ["primary", "canvas", 4.5],
  ["primary", "primary-soft", 4.5],
  ["success", "canvas", 4.5],
  ["warning", "canvas", 4.5],
  ["error", "canvas", 4.5],
  ["fg-on-dark-secondary", "canvas-dark", 4.5],
  ["fg-on-dark-muted", "canvas-dark", 4.5],
  ["primary-on-dark", "canvas-dark", 4.5],
  ["fg-on-brand", "primary", 4.5],
  ["fg-on-brand-muted", "primary", 4.5],
  ["fg-secondary", "canvas-tint", 4.5],
  ["fg-secondary", "canvas-lavender", 4.5],
  ["accent-on-dark", "canvas-dark", 4.5],
  ["primary-on-dark", "canvas-abyss", 4.5],
  ["line-input", "canvas", 3.0],
  ["line-input", "canvas-secondary", 3.0],
];
const contrastFails = [];
for (const [fg, bg, min] of FLOORS) {
  const a = hexOf(fg),
    b = hexOf(bg);
  if (!a || !b) {
    contrastFails.push(`${fg} on ${bg}: token missing`);
    continue;
  }
  const r = cr(a, b);
  if (r < min) contrastFails.push(`${fg} on ${bg}: ${r.toFixed(2)}:1 (needs ${min})`);
}

if (failures.length) {
  console.error("✗ Unresolved colour utilities (these render as NOTHING):\n");
  [...new Set(failures)].forEach((f) => console.error("   " + f));
}
if (contrastFails.length) {
  console.error("\n✗ Contrast floor violations:\n");
  contrastFails.forEach((f) => console.error("   " + f));
}
if (failures.length || contrastFails.length) process.exit(1);
console.log(
  `✓ ${defined.size} tokens defined · all colour utilities resolve · ${FLOORS.length} contrast floors pass`,
);
