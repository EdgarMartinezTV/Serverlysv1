// Build src/i18n/es.json (all translations, server) and es-client.json (strings that
// browser components can render: from "use client" files and from plain data/lib .ts
// modules, whose values are often passed into client components as props).
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
const dir = "scripts/i18n/es";
const all = {};
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) Object.assign(all, JSON.parse(readFileSync(`${dir}/${f}`, "utf8")));
const extra = (() => { try { return JSON.parse(readFileSync("scripts/i18n/es-extra.json", "utf8")); } catch { return {}; } })();
Object.assign(all, extra);
const es = {};
for (const [k, v] of Object.entries(all)) { const key = k.trim(); if (key && v !== k) es[key] = v.trim() === v ? v : v.trim(); }
const scope = JSON.parse(readFileSync("scripts/i18n/scope.json", "utf8"));
const todo = JSON.parse(readFileSync("scripts/i18n/todo-final.json", "utf8"));
// Server-only = rendered as JSX text inside Server Components and nowhere else
// (the codemod recorded each string's kind and file). Everything else may reach
// a browser component as data, so it ships in the client dictionary.
const clientFile = new Set(scope.filter((x) => x.client).map((x) => x.file));
const wrapped = JSON.parse(readFileSync("scripts/i18n/wrapped.json", "utf8"));
const serverOnly = new Set(wrapped.filter((x) => x.kinds.every((k) => k === "jsx" || k.startsWith("attr:")) && x.files.every((f) => !clientFile.has(f))).map((x) => x.en.trim()));
const forceClient = (() => { try { return JSON.parse(readFileSync("scripts/i18n/client-extra.json", "utf8")); } catch { return []; } })();
const client = {};
// Legal pages render through the server-only LegalPage, so their (long) text stays server-side.
const LEGAL = /\/(privacy-policy|terms-of-service|refund-policy|acceptable-use-policy|cookie-policy|dmca-policy|data-processing-agreement|domain-registration-agreement|legal-information|accessibility|law-enforcement-requests|information-security-policy|responsible-disclosure-policy|abuse-handling-policy|ai-services-terms|customer-service-policy)\/page\.tsx$/;
const fileOf = new Map();
for (const [file, arr] of Object.entries(todo)) for (const x of arr) { const k = x.trim(); (fileOf.get(k) || fileOf.set(k, new Set()).get(k)).add(file); }
const legalOnly = (k) => { const f = fileOf.get(k); return f && [...f].every((x) => LEGAL.test(x)); };
for (const [k, v] of Object.entries(es)) if (!legalOnly(k)) client[k] = v;
for (const k of forceClient) if (es[k]) client[k] = es[k];
for (const k of Object.keys(extra)) if (es[k.trim()]) client[k.trim()] = es[k.trim()];
const sort = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : 1)));
writeFileSync("src/i18n/es.json", JSON.stringify(sort(es), null, 0).replace(/","/g, '",\n"'));
writeFileSync("src/i18n/es-client.json", JSON.stringify(sort(client), null, 0).replace(/","/g, '",\n"'));
const missing = Object.values(todo).flat().filter((s) => !(s.trim() in all) && !(s in all));
console.log({ server: Object.keys(es).length, client: Object.keys(client).length, serverKB: Math.round(JSON.stringify(es).length / 1024), clientKB: Math.round(JSON.stringify(client).length / 1024), untranslated: new Set(missing).size });
