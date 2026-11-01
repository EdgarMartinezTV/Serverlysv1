// Files reachable (via imports) from the Spanish-target pages + site chrome.
// node scripts/i18n/scope.mjs > scripts/i18n/scope.json
import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { parse } from "@babel/parser";
const ROOT = resolve("src");
export const PAGES = ["/", "/hosting", "/cloud-hosting", "/wordpress-hosting", "/ecommerce-hosting", "/business-email", "/domain-name", "/domain-name-results", "/register-domain", "/transfer-domain", "/whois-lookup", "/pricing", "/ai-agents", "/automations", "/about", "/support", "/faq", "/migrations",
  "/privacy-policy", "/terms-of-service", "/refund-policy", "/acceptable-use-policy", "/cookie-policy", "/dmca-policy", "/data-processing-agreement", "/domain-registration-agreement", "/legal-information", "/report-abuse", "/accessibility", "/law-enforcement-requests", "/information-security-policy", "/responsible-disclosure-policy", "/abuse-handling-policy", "/ai-services-terms", "/customer-service-policy"];
const CHROME = ["src/components/navigation/site-header.tsx", "src/components/layout/site-footer.tsx", "src/components/consent/cookie-consent.tsx", "src/components/navigation/announcement-bar.tsx", "src/components/navigation/promo-ticker.tsx"];
const entry = (p) => `src/app/(en)${p === "/" ? "" : p}/page.tsx`;
const exts = ["", ".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts"];
function resolveImp(from, spec) {
  let base;
  if (spec.startsWith("@/")) base = resolve(ROOT, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(from), spec);
  else return null;
  for (const e of exts) { const f = base + e; if (existsSync(f) && statSync(f).isFile()) return f; }
  return null;
}
const seen = new Map();
function walk(f) {
  if (seen.has(f) || !/\.(tsx?|jsx?)$/.test(f)) return;
  const src = readFileSync(f, "utf8");
  let ast; try { ast = parse(src, { sourceType: "module", plugins: ["typescript", "jsx"] }); } catch { seen.set(f, { client: false, err: true }); return; }
  const client = /^\s*(\/\*[\s\S]*?\*\/\s*|\/\/[^\n]*\n\s*)*["']use client["']/.test(src);
  seen.set(f, { client });
  for (const n of ast.program.body) {
    const spec = (n.type === "ImportDeclaration" || n.type === "ExportNamedDeclaration" || n.type === "ExportAllDeclaration") && n.source ? n.source.value : null;
    if (spec && !(n.importKind === "type")) { const r = resolveImp(f, spec); if (r) walk(r); }
  }
}
for (const p of PAGES) { const f = resolve(entry(p)); if (existsSync(f)) walk(f); else console.error("missing", p); }
for (const c of CHROME) walk(resolve(c));
const files = [...seen].map(([f, v]) => ({ file: relative(process.cwd(), f), client: v.client }));
console.log(JSON.stringify(files, null, 0));
