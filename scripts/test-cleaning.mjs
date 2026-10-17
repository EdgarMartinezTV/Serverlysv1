/**
 * Interaction + SEO test for /cleaning-company-websites, its Spanish twin and
 * the Brisa Clean Co. demo. Drives real Chrome over CDP.
 *
 * ⚠ The form test SUBMITS A REAL LEAD to /api/cleaning-consultation (company
 * "TEST — automated check"). Never point this at production without
 * --no-submit.
 *
 * Usage: node scripts/test-cleaning.mjs [baseUrl] [--no-submit]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const base = (process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "http://localhost:3000").replace(/\/$/, "");
const submit = !process.argv.includes("--no-submit");

const port = 9600 + (Math.floor(process.uptime() * 1000) % 150);
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=/tmp/cdp-cleaning-${port}`,
  "about:blank",
]);

let wsUrl;
for (let i = 0; i < 80 && !wsUrl; i++) {
  try {
    wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl;
  } catch {
    await sleep(250);
  }
}
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = rej)));
let seq = 0;
const pending = new Map();
const errors = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  } else if (msg.method === "Runtime.exceptionThrown") {
    errors.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
  }
};
const raw = (method, params = {}, sessionId) =>
  new Promise((res) => {
    const i = ++seq;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params, sessionId }));
  });
const target = await raw("Target.createTarget", { url: "about:blank" });
const { sessionId } = await raw("Target.attachToTarget", { targetId: target.targetId, flatten: true });
const send = (m, p) => raw(m, p, sessionId);
await send("Page.enable");
await send("Runtime.enable");
// Headless pages are unfocused, so .focus() and key events go nowhere without this.
await send("Emulation.setFocusEmulationEnabled", { enabled: true });

async function go(path, width = 1280) {
  await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Page.navigate", { url: base + path });
  await sleep(2500);
  await js(`window.__set = (el, v) => {
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v);
    el.dispatchEvent(new Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
  };
  window.__btn = (text, root = document) => [...root.querySelectorAll("button, a")].find((b) => b.textContent.trim().toLowerCase().includes(text.toLowerCase()));`);
}
async function js(expression) {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
}

let passed = 0;
const failed = [];
function check(ok, name, detail = "") {
  if (ok) passed++;
  detail = String(detail).slice(0, 200);
  if (!ok) failed.push(`${name}${detail ? ` — ${detail}` : ""}`);
  console.log(`${ok ? "✓" : "✗"} ${name}${!ok && detail ? ` — ${detail}` : ""}`);
}


const nodesOf = (ld) => ld.flatMap((b) => b["@graph"] ?? [b]);
const events = async () => js(`JSON.stringify(window.__events ?? [])`);
const listen = () => js(`window.__events = []; addEventListener("serverlys:analytics", (e) => window.__events.push(e.detail))`);

// ── Landing (EN) ───────────────────────────────────────────────────────────
console.log("\n── /cleaning-company-websites ──");
await go("/cleaning-company-websites");
const head = await js(`({
  h1: [...document.querySelectorAll("h1")].map((h) => h.textContent),
  title: document.title,
  canonical: document.querySelector('link[rel=canonical]')?.href,
  alt: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map(l => l.hreflang + " " + new URL(l.href).pathname),
  ogLocale: document.querySelector('meta[property="og:locale"]')?.content,
  ogImage: document.querySelector('meta[property="og:image"]')?.content,
  twitter: document.querySelector('meta[name="twitter:card"]')?.content,
  robots: document.querySelector('meta[name=robots]')?.content,
  ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)),
  consult: document.querySelectorAll('a[href="#consultation"]').length,
  demo: [...document.querySelectorAll('a')].filter(a => new URL(a.href).pathname === "/cleaning-company-websites/demo").length,
  carts: [...document.querySelectorAll('#pricing a')].map(a => a.href).filter(h => h.includes("cart.php?a=add&pid=")),
  imgNoAlt: [...document.querySelectorAll('main img:not([alt])')].length,
})`);
check(head.h1.length === 1 && /Cleaning Company Websites Built to Win/i.test(head.h1[0]), "one English h1", head.h1.join(" | "));
check(head.title === "Cleaning Company Website Design in Miami | Serverlys", "title", head.title);
check(head.canonical?.endsWith("/cleaning-company-websites"), "canonical is self", head.canonical);
check(["en-US /cleaning-company-websites", "es-US /es/cleaning-company-websites", "x-default /cleaning-company-websites"].every((a) => head.alt.includes(a)), "hreflang en/es/x-default", head.alt.join(", "));
check(head.ogLocale === "en_US" && /\/og\//.test(head.ogImage ?? "") && head.twitter === "summary_large_image", "Open Graph + Twitter card");
const nodes = nodesOf(head.ld);
const service = nodes.find((n) => n["@type"] === "Service");
check(service?.provider?.["@id"]?.endsWith("/#organization"), "Service provider → Organization");
check(JSON.stringify(service?.areaServed ?? "").includes("Miami-Dade County"), "areaServed includes Miami-Dade County");
check(service?.hasOfferCatalog?.itemListElement?.map((o) => o.price).join(",") === "1399.00,1899.00,2699.00", "offers are the real plan prices", service?.hasOfferCatalog?.itemListElement?.map((o) => o.price).join(","));
check(nodes.some((n) => n["@type"] === "FAQPage") && nodes.some((n) => n["@type"] === "BreadcrumbList"), "FAQPage + BreadcrumbList emitted");
check(!nodes.some((n) => /LocalBusiness/.test(n["@type"]) || n.aggregateRating), "no LocalBusiness or ratings");
check(head.carts.length === 3 && head.carts.every((h) => /pid=(33|34|35)/.test(h)), "plan CTAs link to the real WHMCS products", head.carts.length);
check(head.consult >= 4 && head.demo >= 3, "consultation and demo CTAs present", `${head.consult} / ${head.demo}`);
check(head.imgNoAlt === 0, "every image has an alt attribute");
check(
  await js(`["Instant quote requests","Online appointment scheduling","Optional ConvoAI chatbot","Secure hosting and maintenance"].every((t) => document.body.innerHTML.includes(t))`),
  "all twelve features are server-rendered",
);
check(await js(`/does not provide cleaning services/.test(document.body.textContent)`), "says Serverlys does not clean");

await js(`[...document.querySelectorAll('button[aria-pressed]')].find(b => b.textContent.trim() === "Get found").click()`);
await sleep(300);
check((await js(`document.querySelectorAll('[data-highlighted]').length`)) === 3, "feature filter highlights its 3 cards", await js(`document.querySelectorAll('[data-highlighted]').length`));

// Form
await js(`document.querySelector('#consultation form button[type=submit]').click()`);
await sleep(300);
check((await js(`document.querySelectorAll('#consultation [role=alert] li').length`)) === 8, "empty submit lists 8 problems", await js(`document.querySelectorAll('#consultation [role=alert] li').length`));
check(await js(`document.activeElement?.getAttribute("role") === "alert"`), "error summary receives focus");
if (submit) {
  await listen();
  await js(`(() => {
    const v = { "cl-form-name": "Test Robot", "cl-form-company": "TEST — automated check", "cl-form-email": "test@example.com", "cl-form-phone": "305 555 0100", "cl-form-city": "Doral, FL" };
    for (const [id, val] of Object.entries(v)) __set(document.getElementById(id), val);
    __set(document.getElementById("cl-form-type"), "residential");
    __set(document.getElementById("cl-form-budget"), "unsure");
    document.querySelector('#consultation input[value=website]').click();
  })()`);
  await sleep(3200);
  await js(`document.querySelector('#consultation form button[type=submit]').click()`);
  await sleep(2500);
  const ok = await js(`document.querySelector('#consultation [role=status]')?.textContent ?? ""`);
  check(/SER-[A-Z0-9]{6}/.test(ok), "valid submit files a lead with a SER- reference", ok.slice(0, 120));
  const ev = await events();
  check(/generate_lead/.test(ev) && /consultation_request/.test(ev), "generate_lead + consultation_request fire", ev.slice(0, 160));
} else console.log("· lead submission skipped (--no-submit)");

const api = async (ct, body) => js(`fetch("/api/cleaning-consultation", { method: "POST", headers: { "Content-Type": "${ct}" }, body: ${JSON.stringify(body)} }).then(async (r) => r.status + " " + (await r.text()).slice(0, 80))`);
check((await api("text/plain", "{}")).startsWith("415"), "API refuses non-JSON (cross-site) posts");
check((await api("application/json", JSON.stringify({ elapsed: 9000 }))).startsWith("400"), "API validates server-side");

// ── Landing (ES) ───────────────────────────────────────────────────────────
console.log("\n── /es/cleaning-company-websites ──");
await go("/es/cleaning-company-websites");
check(/empresas de limpieza/i.test(await js(`document.querySelector("h1").textContent`)), "Spanish h1");
check((await js(`document.documentElement.lang`)) === "es", "html lang=es");
check((await js(`document.querySelector('link[rel=canonical]').href`)).endsWith("/es/cleaning-company-websites"), "Spanish canonical");
check(await js(`[...document.querySelectorAll('#pricing li')].some(li => li.textContent.includes("Página principal 100% a medida"))`), "plan inclusions translated");

// ── Demo ───────────────────────────────────────────────────────────────────
console.log("\n── /cleaning-company-websites/demo ──");
// Listen from the first script on the page, so the on-mount demo_view is caught.
const early = await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `window.__events = []; addEventListener("serverlys:analytics", (e) => window.__events.push(e.detail))`,
});
await go("/cleaning-company-websites/demo");
await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: early.identifier });
check(/noindex/.test(await js(`document.querySelector('meta[name=robots]')?.content ?? ""`)), "demo is noindex");
check(await js(`/fictional company/i.test(document.body.textContent)`), "demo says the company is fictional");
const est = () => js(`document.querySelector('[data-estimate]').dataset.estimate`);
check((await est()) === "240-280", "default estimate matches the hero ($240–$280)", await est());
await js(`document.querySelector('[aria-label="Bedrooms +1"]').click()`);
await sleep(200);
check((await est()) !== "240-280", "estimate updates with bedrooms", await est());
await js(`__set(document.getElementById("brisa-frequency"), "weekly")`);
await sleep(200);
const weekly = (await est()).split("-").map(Number);
check(weekly[0] < 260, "weekly frequency discounts the estimate", weekly.join("-"));
await js(`__btn("Request this quote").click()`);
await sleep(200);
await js(`[...document.querySelectorAll('#brisa-estimate form button[type=submit]')][0].click()`);
await sleep(200);
check(await js(`!!document.querySelector('#brisa-estimate [role=alert]')`), "quote request without details is refused");
await js(`__set(document.getElementById("brisa-est-name"), "Ana"); __set(document.getElementById("brisa-est-contact"), "305 555 0199"); __set(document.getElementById("brisa-est-zip"), "33178");`);
await js(`document.querySelector('#brisa-estimate form button[type=submit]').click()`);
await sleep(300);
check(/Demo quote request received/.test(await js(`document.querySelector('#brisa-estimate').textContent`)), "quote request confirms as a demo");
const evs = await events();
check(/demo_view/.test(evs), "demo_view fires when the demo opens", evs.slice(0, 160));
check(/quote_request/.test(evs), "quote_request event fires", evs.slice(0, 160));

check(await js(`[...document.querySelectorAll('input[name=brisa-day]')].some((i) => i.disabled)`), "booking disables closed days");
await js(`document.querySelector('#brisa-book form button[type=submit]').click()`);
await sleep(200);
check(await js(`!!document.querySelector('#brisa-book [role=alert]')`), "appointment without details is refused");
await js(`(() => { document.querySelector('input[name=brisa-day]:not(:disabled)').click(); document.querySelector('input[name=brisa-window]').click();
  __set(document.getElementById("brisa-book-name"), "Ana"); __set(document.getElementById("brisa-book-contact"), "ana@example.com");
  __set(document.getElementById("brisa-book-address"), "1 Example St"); __set(document.getElementById("brisa-book-zip"), "33178"); })()`);
await sleep(200);
await js(`document.querySelector('#brisa-book form button[type=submit]').click()`);
await sleep(300);
check(/Demo appointment requested/.test(await js(`document.querySelector('#brisa-book').textContent`)), "appointment confirms as a demo");

await js(`document.querySelectorAll('#brisa-gallery li button')[2].click()`);
await sleep(300);
check(await js(`document.querySelector('#brisa-gallery dialog').open`), "gallery opens a photo");
await js(`document.querySelector('#brisa-gallery dialog button[aria-label="Close photo"]').click()`);
await sleep(300);
check(await js(`!document.querySelector('#brisa-gallery dialog').open && document.activeElement === document.querySelectorAll('#brisa-gallery li button')[2]`), "closing returns focus to the photo");

await js(`document.querySelector('#brisa-contact form button[type=submit]').click()`);
await sleep(200);
check(await js(`!!document.querySelector('#brisa-contact [role=alert]')`), "contact form validates");

await js(`[...document.querySelectorAll('header button')].find((b) => b.textContent.trim() === "Español").click()`);
await sleep(300);
check(/Casas impecables/.test(await js(`document.querySelector('#brisa-hero-heading').textContent`)), "language switch turns the site Spanish");

await go("/cleaning-company-websites/demo", 390);
await js(`document.querySelector('#brisa-top').closest('div').querySelector('button[aria-label="Open menu"]').click()`);
await sleep(300);
const brisaMenu = `[...document.querySelectorAll('dialog')].find((d) => d.getAttribute('aria-label') === 'Brisa Clean Co.')`;
check(await js(`${brisaMenu}.open`), "phone menu opens");
await js(`${brisaMenu}.querySelector('a[href="#brisa-gallery"]').click()`);
await sleep(300);
check(await js(`!${brisaMenu}.open`), "choosing a section closes the phone menu");

// Reduced motion (go() emulates it): the hero story shows its finished state.
await go("/cleaning-company-websites");
check(await js(`getComputedStyle(document.querySelector('.cl-toast')).opacity === "1"`), "reduced motion: hero shows the confirmation statically");

// ── Discovery ──────────────────────────────────────────────────────────────
console.log("\n── sitemap / robots / llms ──");
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
check(sitemap.includes("/cleaning-company-websites</loc>") && sitemap.includes("/es/cleaning-company-websites</loc>"), "sitemap lists both locales");
check(!sitemap.includes("/cleaning-company-websites/demo</loc>"), "sitemap excludes the noindex demo");
check(!/Disallow: \/cleaning-company-websites\/demo/.test(await (await fetch(base + "/robots.txt")).text()), "robots.txt lets crawlers see the demo's noindex");
check((await (await fetch(base + "/llms.txt")).text()).includes("/cleaning-company-websites"), "llms.txt lists the page");

check(errors.length === 0, "no uncaught page errors", errors.slice(0, 3).join(" / "));

console.log(`\n${passed} passed, ${failed.length} failed`);
ws.close();
chrome.kill();
process.exit(failed.length ? 1 : 0);
