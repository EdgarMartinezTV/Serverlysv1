// Classify in-scope files: server-only, client (directive or imported from a client module), shared.
import { readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { parse } from "@babel/parser";
const ROOT = resolve("src"); const exts = ["", ".tsx", ".ts", "/index.tsx", "/index.ts"];
const scope = JSON.parse(readFileSync("scripts/i18n/scope.json", "utf8"));
const all = new Map(scope.map((f) => [resolve(f.file), f]));
const imports = new Map();
for (const [f] of all) {
  const src = readFileSync(f, "utf8"); let ast; try { ast = parse(src, { sourceType: "module", plugins: ["typescript", "jsx"] }); } catch { continue; }
  const out = [];
  for (const n of ast.program.body) { const s = n.source && n.source.value; if (!s || n.importKind === "type") continue;
    let base = s.startsWith("@/") ? resolve(ROOT, s.slice(2)) : s.startsWith(".") ? resolve(dirname(f), s) : null; if (!base) continue;
    for (const e of exts) { const p = base + e; if (existsSync(p) && statSync(p).isFile()) { out.push(p); break; } } }
  imports.set(f, out);
}
const clientReach = new Set();
const visit = (f) => { if (clientReach.has(f)) return; clientReach.add(f); for (const i of imports.get(f) || []) visit(i); };
for (const [f, v] of all) if (v.client) visit(f);
const serverReach = new Set();
const sv = (f) => { if (serverReach.has(f) || (all.get(f) || {}).client) return; serverReach.add(f); for (const i of imports.get(f) || []) sv(i); };
const entries = [...all.keys()].filter((f) => /\/app\/\(en\)\//.test(f) && /page\.tsx$/.test(f));
for (const f of entries) sv(f);
["src/components/navigation/site-header.tsx", "src/components/layout/site-footer.tsx", "src/components/consent/cookie-consent.tsx", "src/components/navigation/announcement-bar.tsx", "src/components/navigation/promo-ticker.tsx"].forEach((c) => sv(resolve(c)));
const env = {};
for (const [f] of all) { const r = relative(process.cwd(), f); const c = clientReach.has(f), s = serverReach.has(f);
  env[r] = (all.get(f).client) ? "client" : c && s ? "shared" : c ? "client-dep" : "server"; }
writeFileSync("scripts/i18n/env.json", JSON.stringify(env, null, 1));
const cnt = {}; for (const v of Object.values(env)) cnt[v] = (cnt[v] || 0) + 1; console.log(cnt);
for (const [f, v] of Object.entries(env)) if (v === "shared" && /\.tsx$/.test(f)) console.log("  shared component:", f);
