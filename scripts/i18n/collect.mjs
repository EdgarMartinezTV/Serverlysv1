// Collect translatable strings from the in-scope files.  node scripts/i18n/collect.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "@babel/parser";
const scope = JSON.parse(readFileSync("scripts/i18n/scope.json", "utf8"));
export const EXCLUDE = /^src\/(data\/articles|data\/industries|lib\/|data\/og-cards|data\/tutorials)/;
const files = scope.filter((f) => !EXCLUDE.test(f.file));
const VISIBLE_ATTR = new Set(["alt", "aria-label", "placeholder", "title", "label", "aria-description", "summary", "caption", "eyebrow", "heading", "subheading", "description", "lede", "cta", "text", "note", "tagline", "badge", "hint", "kicker", "ctaLabel", "name"]);
const looksText = (s) => /[A-Za-z]{2,}/.test(s) && !/^(https?:|mailto:|tel:|\/|#|\.|@|[a-z0-9_-]+$|[a-z]+[A-Z]|[a-z0-9]+(\.[a-z0-9]+)+$)/.test(s.trim()) && !/^[a-z-]+(\s+[a-z0-9:\[\]\/.#%-]+)+$/.test(s.trim()) && !/^(use client|use server)$/.test(s);
export function cleanJsxText(raw) { // Babel's JSX whitespace rule
  const lines = raw.split(/\r\n|\n|\r/); let last = 0;
  for (let i = 0; i < lines.length; i++) if (/[^ \t]/.test(lines[i])) last = i;
  let str = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i], first = i === 0, isLast = i === lines.length - 1, isLastNonEmpty = i === last;
    let t = line.replace(/\t/g, " ");
    if (!first) t = t.replace(/^[ ]+/, "");
    if (!isLast) t = t.replace(/[ ]+$/, "");
    if (t) { if (!isLastNonEmpty) t += " "; str += t; }
  }
  return str;
}
const out = new Map(); let words = 0;
function add(s, file, kind, client) {
  const k = s.trim(); if (!k || !looksText(k)) return;
  const e = out.get(k) || { files: new Set(), kinds: new Set(), client: false };
  e.files.add(file); e.kinds.add(kind); e.client ||= client; out.set(k, e);
}
function walk(node, file, client, parentKey) {
  if (!node || typeof node.type !== "string") return;
  if (node.type === "JSXText") { const s = cleanJsxText(node.value); if (s.trim()) add(s, file, "jsx", client); }
  else if (node.type === "JSXAttribute" && node.value && node.value.type === "StringLiteral") {
    const name = typeof node.name.name === "string" ? node.name.name : "";
    if (!/^(className|href|src|id|key|type|role|variant|size|tone|as|icon|rel|target|name|htmlFor|style|d|viewBox|fill|stroke|width|height|data-.*|aria-(controls|labelledby|describedby|hidden|current|expanded|haspopup|live|pressed|selected|level|orientation)|loading|decoding|sizes|method|action|autoComplete|inputMode|enterKeyHint|spellCheck|autoCapitalize|lang|dir|xmlns|strokeWidth|strokeLinecap|strokeLinejoin|fillRule|clipRule|points|cx|cy|r|x|y|x1|x2|y1|y2|transform|preserveAspectRatio|tabIndex|value|defaultValue|step|min|max|pattern|accept|form|scope|colSpan|rowSpan|align|surface|spacing|width|labelledBy|path|slug|group|plan|tier|term|kind|mode|status|layout|position|side|align|direction|theme|color|accent|ratio|priority|fetchPriority|crossOrigin|referrerPolicy|sandbox|allow|frameBorder|scrolling|idPrefix)$/.test(name)) add(node.value.value, file, "attr:" + name, client);
  }
  else if (node.type === "StringLiteral" && parentKey !== "source" && parentKey !== "key" && parentKey !== "attr") add(node.value, file, "lit", client);
  else if (node.type === "TemplateLiteral") for (const q of node.quasis) if (q.value.cooked && /[A-Za-z]{3,}\s+[A-Za-z]/.test(q.value.cooked)) add(q.value.cooked, file, "tpl", client);
  for (const [k, v] of Object.entries(node)) {
    if (k === "loc" || k === "start" || k === "end" || k === "leadingComments" || k === "trailingComments" || k === "innerComments") continue;
    if (node.type === "JSXAttribute" && k === "value") continue;
    if (node.type === "ImportDeclaration" || node.type === "ExportNamedDeclaration" && k === "source") { if (k === "source") continue; }
    const pk = (node.type === "ObjectProperty" && k === "key") ? "key" : (node.type === "CallExpression" && node.callee && /^(cn|clsx|twMerge|cva|require|import)$/.test(node.callee.name || "")) ? "attr" : k;
    if (Array.isArray(v)) v.forEach((c) => walk(c, file, client, pk)); else if (v && typeof v.type === "string") walk(v, file, client, pk);
  }
}
for (const f of files) {
  const src = readFileSync(f.file, "utf8");
  let ast; try { ast = parse(src, { sourceType: "module", plugins: ["typescript", "jsx"] }); } catch (e) { console.error("PARSE", f.file, e.message); continue; }
  walk(ast.program, f.file, f.client, null);
}
const arr = [...out].map(([k, v]) => ({ en: k, files: [...v.files], kinds: [...v.kinds], client: v.client }));
for (const a of arr) words += a.en.split(/\s+/).length;
writeFileSync("scripts/i18n/strings.json", JSON.stringify(arr, null, 0));
console.log("files:", files.length, "unique strings:", arr.length, "words:", words, "| client strings:", arr.filter((a) => a.client).length);
