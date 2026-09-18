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

// Width/side utilities that share a prefix with the colour utilities:
// border-l-2, border-t, divide-x-2, ring-2. The capture group swallows the
// side and the numeric width, so these must be excluded by SHAPE rather than
// by name — otherwise every legitimate border width is reported as a dead
// colour token.
const SIDE_OR_WIDTH = /^(?:[xytrbles])?-?\d*$/;

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
  "hero",
  "h1",
  "h2",
  "h3",
  "h4",
  "body",
  "body-lg",
  "small",
  "caption",
  // The bottom two steps of the type scale, added 2026-09-17 with the 12px
  // floor. Without them here every `text-micro` / `text-ui` in the tree is
  // read as a colour utility and reported as rendering nothing.
  "micro",
  "ui",
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
  // Background-clip utilities share the `bg-` prefix but set no colour.
  "clip-text",
  "clip-border",
  "clip-padding",
  "clip-content",
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
    if (NON_COLOUR.has(name) || SIDE_OR_WIDTH.test(name)) continue;
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
  /*
   * `canvas-tint` and `canvas-lavender` were checked here until both were
   * deleted from globals.css — see the note there. `canvas-secondary` took
   * over all eleven of their usages, so the two floors those lines held are
   * re-stated against it rather than assumed.
   *
   * ⚠ `fg-secondary` IS LISTED EXPLICITLY even though `fg-muted` on the same
   * ground is already checked above and is the lighter of the two. Relying on
   * "the lighter one passes, so the darker one must" makes this table depend
   * on the ink ramp's ordering staying true, which is not something it
   * promises. Both are cheap to measure.
   */
  ["fg-secondary", "canvas-secondary", 4.5],
  ["primary", "canvas-secondary", 4.5],
  ["accent-on-dark", "canvas-dark", 4.5],
  ["primary-on-dark", "canvas-abyss", 4.5],
  ["error-on-dark", "canvas-dark", 4.5],
  ["error-on-dark", "canvas-abyss", 4.5],
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
