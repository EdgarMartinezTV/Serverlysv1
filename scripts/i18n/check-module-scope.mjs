// Fails if tx()/lh()/isSpanish() is called at module scope (outside any function):
// such calls run once at import and would freeze one language for every request.
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { parse } from "@babel/parser";
const files = execSync("git ls-files src '*.tsx' '*.ts'; git ls-files -o --exclude-standard src", { encoding: "utf8" }).split("\n").filter((f) => /\.(tsx?|jsx?)$/.test(f) && f.startsWith("src/"));
const FN = new Set(["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression", "ObjectMethod", "ClassMethod"]);
let bad = 0;
for (const file of [...new Set(files)]) {
  let src; try { src = readFileSync(file, "utf8"); } catch { continue; }
  if (!/\b(tx|txI18n|i18nTx|lh|isSpanish)\(/.test(src)) continue;
  const ast = parse(src, { sourceType: "module", plugins: ["typescript", "jsx"] });
  (function visit(n, inFn) {
    if (!n || typeof n.type !== "string") return;
    const fn = inFn || FN.has(n.type);
    if (!inFn && n.type === "CallExpression" && n.callee.type === "Identifier" && /^(tx|txI18n|i18nTx|lh|isSpanish)$/.test(n.callee.name)) {
      bad++; console.log(`${file}:${n.loc.start.line} ${src.slice(n.start, Math.min(n.end, n.start + 70))}`);
    }
    for (const k of Object.keys(n)) { if (k === "loc") continue; const v = n[k]; if (Array.isArray(v)) v.forEach((x) => visit(x, fn)); else if (v && typeof v.type === "string") visit(v, fn); }
  })(ast.program, false);
}
console.log(bad ? `${bad} module-scope i18n calls` : "OK: no module-scope i18n calls");
process.exit(bad ? 1 : 0);
