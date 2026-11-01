// i18n codemod: wrap rendered English in tx() (src/i18n/t.ts) without reformatting.
//   node scripts/i18n/codemod.mjs [--dry] [file ...]
// Default file set: scripts/i18n/scope.json minus EXCLUDE. Writes scripts/i18n/wrapped.json
// (every literal string it wrapped, for the dictionary). Idempotent: skips tx(...) calls.
//
// English output is unchanged by construction: tx() returns its argument unless the render is
// Spanish, JSX text is replaced by exactly the string React's JSX transform would have produced
// (cleanJsxText = Babel's whitespace rule), and only string-valued positions are wrapped.
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "@babel/parser";

const EXCLUDE = /^src\/(data\/|lib\/|i18n\/)|\/_content\b|\/_seo\b|\.ts$/; // non-JSX modules are rendered via their call sites
const DOM_TEXT_ATTRS = new Set(["alt", "aria-label", "placeholder", "title", "aria-description", "aria-valuetext", "aria-roledescription"]);
// Component props that are never prose (logic, styling, routing, ids). Everything else that is a string literal is wrapped.
const NON_TEXT_PROPS = new Set(["className", "href", "src", "id", "key", "type", "role", "variant", "size", "tone", "as", "icon", "rel", "target", "name", "htmlFor", "style", "width", "height", "loading", "decoding", "sizes", "method", "action", "autoComplete", "inputMode", "enterKeyHint", "lang", "dir", "value", "defaultValue", "step", "min", "max", "pattern", "accept", "scope", "align", "surface", "spacing", "labelledBy", "describedBy", "path", "slug", "group", "plan", "tier", "term", "kind", "mode", "status", "layout", "position", "side", "direction", "theme", "color", "accent", "ratio", "priority", "fetchPriority", "idPrefix", "svI", "svIs", "svIc", "image", "img", "photo", "video", "poster", "logo", "anchor", "hash", "query", "param", "field", "event", "trackId", "eventName", "category", "location", "section", "page", "route", "url", "link", "to", "from", "domain", "tld", "currency", "locale", "format", "unit", "animation", "delay", "duration", "easing", "gradient", "pattern", "shape", "orientation", "level", "columns", "cols", "rows", "gap", "maxWidth", "width", "objectPosition", "objectFit", "quality", "placeholder_", "fill", "stroke", "d", "viewBox", "points", "transform", "aria-hidden", "aria-controls", "aria-labelledby", "aria-describedby", "aria-current", "aria-expanded", "aria-haspopup", "aria-live", "aria-pressed", "aria-selected", "tabIndex", "formAction", "form", "accessKey", "data", "schema", "graph", "storageKey", "cookieKey", "version", "ns", "testId"]);
const SKIP_ELEMENTS = new Set(["script", "style", "JsonLd", "code", "pre", "Script"]);

const scope = JSON.parse(readFileSync("scripts/i18n/scope.json", "utf8"));
const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const explicit = args.filter((a) => !a.startsWith("--"));
const files = explicit.length ? explicit : scope.map((f) => f.file).filter((f) => !EXCLUDE.test(f) && /\.tsx$/.test(f));

function cleanJsxText(raw) {
  const lines = raw.split(/\r\n|\n|\r/);
  let last = 0;
  for (let i = 0; i < lines.length; i++) if (/[^ \t]/.test(lines[i])) last = i;
  let str = "";
  for (let i = 0; i < lines.length; i++) {
    let t = lines[i].replace(/\t/g, " ");
    if (i !== 0) t = t.replace(/^[ ]+/, "");
    if (i !== lines.length - 1) t = t.replace(/[ ]+$/, "");
    if (t) { if (i !== last) t += " "; str += t; }
  }
  return str;
}
const isText = (s) => /[A-Za-z]{2,}/.test(s);
const elName = (n) => n.type === "JSXIdentifier" ? n.name : n.type === "JSXMemberExpression" ? elName(n.object) + "." + n.property.name : "";
const isComponent = (name) => /^[A-Z]/.test(name) || name.includes(".");
const isTxCall = (e, fn) => e && e.type === "CallExpression" && e.callee.type === "Identifier" && e.callee.name === fn;

const wrapped = new Map();
let changedFiles = 0;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  let ast;
  try { ast = parse(src, { sourceType: "module", plugins: ["typescript", "jsx"] }); } catch (e) { console.error("PARSE FAIL", file, e.message); continue; }
  // Choose an import name that nothing in the file binds.
  const ids = new Set(src.match(/\b[A-Za-z_$][\w$]*\b/g));
  const FN = ["tx", "txI18n", "i18nTx"].find((n) => !ids.has(n) || /import \{ t as tx \} from "@\/i18n\/t"/.test(src)) || "i18nTx";
  const edits = [];
  const record = (s, kind) => { const k = s.trim(); if (!k) return; const e = wrapped.get(k) || { files: new Set(), kinds: new Set() }; e.files.add(file); e.kinds.add(kind); wrapped.set(k, e); };

  function visit(node, ctx) {
    if (!node || typeof node.type !== "string") return;
    if (node.type === "JSXElement") {
      const name = elName(node.openingElement.name);
      if (SKIP_ELEMENTS.has(name) || node.openingElement.attributes.some((a) => a.type === "JSXAttribute" && a.name.name === "dangerouslySetInnerHTML")) {
        return; // never translate inside these
      }
      const comp = isComponent(name);
      for (const a of node.openingElement.attributes) {
        if (a.type !== "JSXAttribute" || !a.value) continue;
        const pname = typeof a.name.name === "string" ? a.name.name : a.name.name.name;
        const textual = comp ? !NON_TEXT_PROPS.has(pname) && !/^(on[A-Z]|data-|aria-(?!label|description))/.test(pname) : DOM_TEXT_ATTRS.has(pname);
        if (!textual) { if (a.value.type === "JSXExpressionContainer") visit(a.value.expression, ctx); continue; }
        if (a.value.type === "StringLiteral" && isText(a.value.value)) {
          edits.push([a.value.start, a.value.end, `{${FN}(${JSON.stringify(a.value.value)})}`]); record(a.value.value, "attr:" + pname);
        } else if (a.value.type === "JSXExpressionContainer") {
          const ex = a.value.expression;
          if (ex.type === "StringLiteral" && isText(ex.value)) { edits.push([ex.start, ex.end, `${FN}(${JSON.stringify(ex.value)})`]); record(ex.value, "attr:" + pname); }
          else if (ex.type === "TemplateLiteral" || ex.type === "JSXEmptyExpression" || isTxCall(ex, FN) || ex.type === "ArrowFunctionExpression" || ex.type === "FunctionExpression" || ex.type === "ObjectExpression" || ex.type === "ArrayExpression" || ex.type === "JSXElement" || ex.type === "JSXFragment" || ex.type === "NumericLiteral" || ex.type === "BooleanLiteral") visit(ex, ctx);
          else wrapValue(ex, ctx);
        }
      }
      for (const c of node.children) visitChild(c, ctx);
      return;
    }
    if (node.type === "JSXFragment") { for (const c of node.children) visitChild(c, ctx); return; }
    for (const [k, v] of Object.entries(node)) {
      if (k === "loc" || k.endsWith("Comments") || k === "extra") continue;
      if (Array.isArray(v)) v.forEach((x) => visit(x, ctx)); else if (v && typeof v.type === "string") visit(v, ctx);
    }
  }
  const ARRAY_METHODS = new Set(["map", "filter", "flatMap", "slice", "reverse", "sort", "concat", "toSorted", "toReversed"]);
  const wrapWhole = (ex) => { edits.push([ex.start, ex.start, `${FN}(`]); edits.push([ex.end, ex.end, ")"]); };
  // Wrap a JSX value precisely: string leaves are wrapped (and recorded), JSX is visited, arrays are left alone.
  function wrapValue(ex, ctx) {
    if (!ex) return;
    switch (ex.type) {
      case "StringLiteral": if (isText(ex.value)) { edits.push([ex.start, ex.end, `${FN}(${JSON.stringify(ex.value)})`]); record(ex.value, "lit"); } return;
      case "ConditionalExpression": visit(ex.test, ctx); wrapValue(ex.consequent, ctx); wrapValue(ex.alternate, ctx); return;
      case "LogicalExpression": if (ex.operator === "&&") { visit(ex.left, ctx); wrapValue(ex.right, ctx); } else { wrapValue(ex.left, ctx); wrapValue(ex.right, ctx); } return;
      case "ParenthesizedExpression": wrapValue(ex.expression, ctx); return;
      case "JSXElement": case "JSXFragment": case "NumericLiteral": case "BooleanLiteral": case "NullLiteral": case "ArrowFunctionExpression": case "FunctionExpression": case "ObjectExpression": case "ArrayExpression": visit(ex, ctx); return;
      case "TemplateLiteral": wrapWhole(ex); ex.quasis.forEach((q) => q.value.cooked && isText(q.value.cooked) && record(q.value.cooked, "tpl")); ex.expressions.forEach((e) => visit(e, ctx)); return;
      case "CallExpression": case "OptionalCallExpression": {
        const callee = ex.callee; const prop = callee && (callee.property && callee.property.name);
        if (isTxCall(ex, FN)) return;
        if (ARRAY_METHODS.has(prop)) { visit(ex, ctx); return; }
        wrapWhole(ex); visit(ex, ctx); return;
      }
      case "Identifier": if (ex.name === "children" || ex.name === "undefined") return; wrapWhole(ex); return;
      default: wrapWhole(ex); visit(ex, ctx); return;
    }
  }
  function visitChild(c, ctx) {
    if (c.type === "JSXText") {
      const s = cleanJsxText(c.value);
      if (s.trim() && isText(s)) { edits.push([c.start, c.end, `{${FN}(${JSON.stringify(s)})}`]); record(s, "jsx"); }
      return;
    }
    if (c.type === "JSXExpressionContainer") {
      const ex = c.expression;
      if (ex.type === "JSXEmptyExpression" || isTxCall(ex, FN)) return;
      if (ex.type === "StringLiteral") { if (isText(ex.value)) { edits.push([ex.start, ex.end, `${FN}(${JSON.stringify(ex.value)})`]); record(ex.value, "jsx"); } return; }
      if (ex.type === "JSXElement" || ex.type === "JSXFragment" || ex.type === "NumericLiteral") { visit(ex, ctx); return; }
      wrapValue(ex, ctx);
      return;
    }
    visit(c, ctx);
  }
  visit(ast.program, {});
  if (!edits.length) continue;
  // Apply edits from the end; insertions at the same offset keep their push order.
  edits.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  let out = src;
  for (const [s, e, r] of edits) out = out.slice(0, s) + r + out.slice(e);
  if (!new RegExp(`import \\{ t as ${FN} \\} from "@/i18n/t"`).test(out)) {
    const lastImport = [...ast.program.body].filter((n) => n.type === "ImportDeclaration").pop();
    const imp = `import { t as ${FN} } from "@/i18n/t";\n`;
    if (lastImport) {
      // offset of the last import in the ORIGINAL source == same offset in `out`? Only if no edits before it — imports precede JSX, so yes.
      const at = lastImport.end;
      out = out.slice(0, at) + "\n" + imp.trimEnd() + out.slice(at);
    } else {
      const dir = out.match(/^\s*["']use client["'];?\s*\n/);
      out = dir ? out.slice(0, dir[0].length) + imp + out.slice(dir[0].length) : imp + out;
    }
  }
  try { parse(out, { sourceType: "module", plugins: ["typescript", "jsx"] }); } catch (e) { console.error("RESULT PARSE FAIL", file, e.message); continue; }
  if (!DRY) writeFileSync(file, out);
  changedFiles++;
}
const prev = (() => { try { return JSON.parse(readFileSync("scripts/i18n/wrapped.json", "utf8")); } catch { return []; } })();
const merged = new Map(prev.map((x) => [x.en, { files: new Set(x.files), kinds: new Set(x.kinds) }]));
for (const [k, v] of wrapped) { const e = merged.get(k) || { files: new Set(), kinds: new Set() }; v.files.forEach((f) => e.files.add(f)); v.kinds.forEach((x) => e.kinds.add(x)); merged.set(k, e); }
if (!DRY) writeFileSync("scripts/i18n/wrapped.json", JSON.stringify([...merged].map(([en, v]) => ({ en, files: [...v.files], kinds: [...v.kinds] }))));
console.log(`${DRY ? "[dry] " : ""}files changed: ${changedFiles}/${files.length}, strings wrapped this run: ${wrapped.size}`);
