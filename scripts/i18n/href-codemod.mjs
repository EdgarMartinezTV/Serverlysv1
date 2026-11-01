// Wrap every JSX href attribute value in lh() (src/i18n/href.ts) across the i18n scope.
// English output unchanged by construction: lh() returns its argument unless the render is /es.
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "@babel/parser";
const files = JSON.parse(readFileSync("scripts/i18n/scope.json", "utf8")).map((x) => x.file)
  .filter((f) => !f.startsWith("src/i18n/") && !f.endsWith("language-selector.tsx") && /\.(tsx|jsx)$/.test(f));
let changed = 0, wrapped = 0;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const ast = parse(src, { sourceType: "module", plugins: ["typescript", "jsx"] });
  const ids = new Set(src.match(/\b[A-Za-z_$][\w$]*\b/g));
  const already = /import \{ lh \} from "@\/i18n\/href"/.test(src);
  if (ids.has("lh") && !already) { console.error("SKIP name clash", file); continue; }
  const edits = [];
  (function visit(n) {
    if (!n || typeof n.type !== "string") return;
    if (n.type === "JSXOpeningElement") {
      const name = n.name.type === "JSXIdentifier" ? n.name.name : "";
      if (name !== "link") for (const a of n.attributes) {
        if (a.type !== "JSXAttribute" || a.name.name !== "href" || !a.value) continue;
        const v = a.value;
        if (v.type === "StringLiteral") { edits.push([v.start, v.end, `{lh(${src.slice(v.start, v.end)})}`]); wrapped++; }
        else if (v.type === "JSXExpressionContainer" && v.expression.type !== "JSXEmptyExpression") {
          const e = v.expression;
          if (e.type === "CallExpression" && e.callee.name === "lh") continue;
          edits.push([e.start, e.start, "lh("], [e.end, e.end, ")"]); wrapped++;
        }
      }
    }
    for (const k of Object.keys(n)) { if (k === "loc") continue; const v = n[k]; if (Array.isArray(v)) v.forEach(visit); else if (v && typeof v.type === "string") visit(v); }
  })(ast.program);
  if (!edits.length) continue;
  edits.sort((a, b) => b[0] - a[0]);
  let out = src;
  for (const [s, e, r] of edits) out = out.slice(0, s) + r + out.slice(e);
  if (!already) {
    const last = ast.program.body.filter((n) => n.type === "ImportDeclaration").pop();
    const imp = `import { lh } from "@/i18n/href";`;
    if (last) out = out.slice(0, last.end) + "\n" + imp + out.slice(last.end);
    else { const d = out.match(/^\s*["']use client["'];?\s*\n/); out = d ? out.slice(0, d[0].length) + imp + "\n" + out.slice(d[0].length) : imp + "\n" + out; }
  }
  parse(out, { sourceType: "module", plugins: ["typescript", "jsx"] });
  writeFileSync(file, out); changed++;
}
console.log({ changed, wrapped });
