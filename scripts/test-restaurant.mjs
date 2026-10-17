/**
 * Interaction + SEO test for the restaurant funnel:
 *   /restaurant-websites, /es/restaurant-websites and both Lumbre demos.
 *
 * Drives the pages through CDP the way a visitor would and asserts on the
 * state that changed — tabs that switch, a cart that counts, a reservation
 * that confirms, an assistant whose buttons move the rest of the page.
 *
 * ⚠ The form test SUBMITS A REAL LEAD to /api/restaurant-review. Locally,
 * with no SERA_WEBHOOK_URL / RESEND_API_KEY, that only appends a line to
 * .sera/requests.jsonl (restaurant "TEST — automated check"). Never point this
 * at production without --no-submit.
 *
 * Usage: node scripts/test-restaurant.mjs [baseUrl] [--no-submit]
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
  `--user-data-dir=/tmp/cdp-restaurant-${port}`,
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
async function key(k) {
  for (const type of ["keyDown", "keyUp"]) await send("Input.dispatchKeyEvent", { type, key: k, code: k, windowsVirtualKeyCode: k === "ArrowRight" ? 39 : k === "End" ? 35 : 36 });
}

let passed = 0;
const failed = [];
function check(ok, name, detail = "") {
  if (ok) passed++;
  detail = String(detail).slice(0, 200);
  if (!ok) failed.push(`${name}${detail ? ` — ${detail}` : ""}`);
  console.log(`${ok ? "✓" : "✗"} ${name}${!ok && detail ? ` — ${detail}` : ""}`);
}

// ── Landing (EN) ───────────────────────────────────────────────────────────
console.log("\n── /restaurant-websites ──");
await go("/restaurant-websites");
const head = await js(`({
  h1: document.querySelector("h1")?.textContent,
  canonical: document.querySelector('link[rel=canonical]')?.href,
  alt: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map(l => l.hreflang + " " + new URL(l.href).pathname),
  ogLocale: document.querySelector('meta[property="og:locale"]')?.content,
  robots: document.querySelector('meta[name=robots]')?.content,
  ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)),
  review: [...document.querySelectorAll('a[href="#review"]')].length,
  demo: [...document.querySelectorAll('a')].some(a => new URL(a.href).pathname === "/restaurant-websites/demo" && /demo/i.test(a.textContent)),
})`);
check(/fill tables/i.test(head.h1 ?? ""), "one English h1", head.h1);
check(head.canonical?.endsWith("/restaurant-websites"), "canonical is self", head.canonical);
check(["en-US /restaurant-websites", "es-US /es/restaurant-websites", "x-default /restaurant-websites"].every((a) => head.alt.includes(a)), "hreflang en/es/x-default", head.alt.join(", "));
check(head.ogLocale === "en_US", "og:locale en_US", head.ogLocale);
const nodes = head.ld.flatMap((b) => b["@graph"] ?? [b]);
const service = nodes.find((n) => n["@type"] === "Service");
check(service?.provider?.["@id"]?.endsWith("/#organization"), "Service provider → Organization");
check(service?.hasOfferCatalog?.itemListElement?.length === 3, "OfferCatalog has 3 plans");
check(nodes.some((n) => n["@type"] === "FAQPage"), "FAQPage emitted");
check(nodes.some((n) => n["@type"] === "BreadcrumbList"), "BreadcrumbList emitted");
check(head.review >= 2, "Free review CTA links to #review", `${head.review}`);
check(head.demo, "Explore Live Demo links to the demo");

// Explorer tabs
await js(`document.querySelector('#features [role=tab][aria-selected=true]').focus()`);
await key("ArrowRight");
await sleep(200);
const afterKey = await js(`document.activeElement.getAttribute('aria-selected') + "|" + document.activeElement.textContent.trim()`);
check(afterKey.startsWith("true|Digital menu"), "ArrowRight moves and selects the next tab", afterKey);
await key("End");
await sleep(200);
check((await js(`document.activeElement.textContent.trim()`)) === "AI assistant", "End jumps to the last tab");
await js(`[...document.querySelectorAll('#features [role=tab]')].find(t => t.textContent.includes("Online ordering")).click()`);
await sleep(300);
const before = await js(`document.querySelector('[role=tabpanel] [aria-live]').textContent`);
await js(`document.querySelector('[role=tabpanel] button[aria-label^="Add"]').click()`);
await sleep(200);
const after = await js(`document.querySelector('[role=tabpanel] [aria-live]').textContent`);
check(before !== after && /3 in your order/.test(after), "ordering preview counts an add", `${before} → ${after}`);

// Plan CTA → form preselect
await js(`__btn("Choose Growth").click()`);
await sleep(400);
check((await js(`location.hash`)) === "#review-growth", "plan CTA lands on #review-growth");
check((await js(`document.getElementById("rw-form-plan").value`)) === "growth", "form preselects Growth");

// Form validation
await js(`document.querySelector('#review form button[type=submit]').click()`);
await sleep(300);
const summary = await js(`(() => { const a = document.querySelector('#review [role=alert]'); return a ? { n: a.querySelectorAll("li").length, focused: document.activeElement === a } : null; })()`);
check(summary?.n === 7, "empty submit lists 7 problems", JSON.stringify(summary));
check(summary?.focused, "error summary receives focus");
check((await js(`document.getElementById("rw-form-email").getAttribute("aria-invalid")`)) === "true", "invalid field marked aria-invalid");

if (submit) {
  await js(`(() => {
    const v = { restaurant: "TEST — automated check", contact: "Test Runner", phone: "305 555 0100", email: "test@example.com", location: "Downtown Doral, FL", message: "Automated test from scripts/test-restaurant.mjs" };
    for (const [k, val] of Object.entries(v)) __set(document.getElementById("rw-form-" + k), val);
    document.querySelector('#review input[type=checkbox]:not([name])').click();
    document.querySelector('#review input[name=services][value=ordering]').click();
  })()`);
  await sleep(2800);
  await js(`document.querySelector('#review form button[type=submit]').click()`);
  await sleep(2500);
  const result = await js(`document.querySelector('#review [role=status]')?.textContent ?? document.querySelector('#review')?.textContent.slice(0, 300)`);
  check(/SER-[A-Z0-9]{6}/.test(result ?? ""), "valid submit files a lead with a SER- reference", (result ?? "").slice(0, 160));
}

// API rejects garbage server-side
const bad = await fetch(base + "/api/restaurant-review", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ restaurant: "", email: "nope", elapsed: 9000, services: ["hacking"] }),
});
const badBody = await bad.json();
if (bad.status === 429) console.log("· API validation not reached: rate limiter engaged (5 per 10 min) — rerun later");
else check(bad.status === 400 && badBody.errors?.email && badBody.errors?.services, "API validates server-side", `${bad.status} ${JSON.stringify(badBody).slice(0, 120)}`);

// ── Landing (ES) ───────────────────────────────────────────────────────────
console.log("\n── /es/restaurant-websites ──");
await go("/es/restaurant-websites");
const es = await js(`({ h1: document.querySelector("h1")?.textContent, lang: document.documentElement.lang, wrap: document.querySelector("main [lang=es]") != null, canonical: document.querySelector('link[rel=canonical]')?.href, faq: document.querySelector('#rw-faq-heading')?.textContent })`);
check(/llenan mesas/.test(es.h1 ?? ""), "Spanish h1", es.h1);
check(es.lang === "es" && es.wrap, "html lang=es and lang wrapper", `${es.lang} ${es.wrap}`);
check(es.canonical?.endsWith("/es/restaurant-websites"), "Spanish canonical", es.canonical);
check(/dueños/.test(es.faq ?? ""), "FAQ heading localised", es.faq);

// ── Demo ───────────────────────────────────────────────────────────────────
console.log("\n── /restaurant-websites/demo ──");
await go("/restaurant-websites/demo");
check(/noindex/.test(await js(`document.querySelector('meta[name=robots]')?.content ?? ""`)), "demo is noindex");
check(await js(`/fictional/i.test(document.body.textContent)`), "demo says the restaurant is fictional");

await js(`document.querySelector('button[aria-label="Add Asada tacos to order"]').click()`);
await sleep(200);
check(/1/.test(await js(`__btn("View order")?.textContent ?? ""`)), "add a dish → cart button shows 1");
await js(`document.querySelector('button[aria-label="Add Churrasco to order"]').click()`);
await sleep(300);
check(await js(`document.querySelector('dialog[aria-labelledby=lumbre-options-title]').open`), "dish with options opens a modal dialog");
await js(`document.querySelector('dialog[aria-labelledby=lumbre-options-title] button[type=submit]').click()`);
await sleep(300);
check(/2/.test(await js(`__btn("View order")?.textContent ?? ""`)) && !(await js(`document.querySelector('dialog[aria-labelledby=lumbre-options-title]').open`)), "options added → 2 items, dialog closed");

await js(`[...document.querySelectorAll('#menu button[aria-pressed]')].find(b => b.textContent.includes("Gluten-free")).click()`);
await sleep(200);
check((await js(`document.querySelectorAll('#menu li.group').length`)) === 7, "gluten-free filter shows 7 dishes", `${await js(`document.querySelectorAll('#menu li.group').length`)}`);

await js(`__btn("View order").click()`);
await sleep(300);
check(await js(`document.querySelector('dialog[aria-labelledby=lumbre-cart-title]').open`), "cart drawer opens");
await js(`document.querySelector('dialog[aria-labelledby=lumbre-cart-title] button[type=submit]').click()`);
await sleep(200);
check(await js(`!!document.querySelector('dialog[aria-labelledby=lumbre-cart-title] [role=alert]')`), "checkout without details is refused");
await js(`__set(document.getElementById("lumbre-name"), "Ana"); __set(document.getElementById("lumbre-phone"), "305 555 0199");`);
await js(`document.querySelector('dialog[aria-labelledby=lumbre-cart-title] button[type=submit]').click()`);
await sleep(400);
check(/Order #\d{4}/.test(await js(`document.querySelector('dialog[aria-labelledby=lumbre-cart-title]').textContent`)), "demo order confirms with a number");
await js(`document.querySelector('dialog[aria-labelledby=lumbre-cart-title]').close()`);

// Reservation
await js(`document.querySelector('#reserve').scrollIntoView(); __btn("Continue", document.querySelector('#reserve')).click()`);
await sleep(300);
const slot = await js(`(() => { const i = document.querySelector('#reserve input[name=lumbre-time]:not(:disabled)'); if (!i) return false; i.click(); return true; })()`);
check(slot, "step 2 offers an open time");
await js(`__btn("Continue", document.querySelector('#reserve')).click()`);
await sleep(300);
await js(`__set(document.getElementById("lumbre-r-name"), "Ana Pérez"); __set(document.getElementById("lumbre-r-contact"), "305 555 0199");`);
await js(`document.querySelector('#reserve form button[type=submit]').click()`);
await sleep(300);
check(/LMB-[A-Z0-9]{5}/.test(await js(`document.querySelector('#reserve').textContent`)), "demo reservation confirms with a code");

// Assistant
await js(`__btn("Do you have gluten-free options?", document.querySelector('#assistant')).click()`);
await sleep(2200);
const reply = await js(`[...document.querySelectorAll('#assistant [role=log] p')].map(p => p.textContent).join(" | ")`);
check(/7 dishes are gluten-free/.test(reply), "assistant answers from the menu data", reply.slice(0, 160));
await js(`__btn("Book a table for 4 on Friday", document.querySelector('#assistant')).click()`);
await sleep(2200);
const bookBtn = await js(`(() => { const b = [...document.querySelectorAll('#assistant [role=log] button')].find(b => /^Book /.test(b.textContent)); if (!b) return null; const t = b.textContent; b.click(); return t; })()`);
await sleep(600);
const reserveText = await js(`document.querySelector('#reserve').textContent`);
check(bookBtn && reserveText.includes(bookBtn.replace("Book ", "")) && /4 guests/.test(reserveText), "assistant 'Book' prefills the reservation", `${bookBtn}`);
await js(`__btn("¿Tienen estacionamiento?", document.querySelector('#assistant')).click()`);
await sleep(2200);
check(/estacionamiento gratuito/.test(await js(`document.querySelector('#assistant [role=log]').textContent`)), "assistant replies in Spanish to Spanish");

// ── Discovery ──────────────────────────────────────────────────────────────
console.log("\n── sitemap / llms.txt ──");
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
check(sitemap.includes("/restaurant-websites</loc>") && sitemap.includes("/es/restaurant-websites</loc>"), "sitemap lists both locales");
check(/hreflang="es-US"/.test(sitemap), "sitemap carries hreflang alternates");
check(!sitemap.includes("/demo</loc>"), "sitemap excludes the noindex demo");
check((await (await fetch(base + "/llms.txt")).text()).includes("/restaurant-websites"), "llms.txt lists the page");
const robotsTxt = await (await fetch(base + "/robots.txt")).text();
check(!/Disallow: \/(es\/)?restaurant-websites\/demo/.test(robotsTxt), "robots.txt lets crawlers reach the demo's noindex");

// ── Guides and server-rendered content ─────────────────────────────────────
console.log("\n── guides / server HTML ──");
const htmlOnly = async (path) => (await (await fetch(base + path)).text()).replace(/<script[\s\S]*?<\/script>/g, "");
const landingHtml = await htmlOnly("/restaurant-websites");
check(
  ["Take orders on your own website", "Book tables while you are closed", "Your menu as a proper web page"].every((t) => landingHtml.includes(t)),
  "every explorer panel is in the server HTML",
);
for (const guide of ["/restaurant-websites/online-ordering", "/restaurant-websites/reservations", "/restaurant-websites/cost"]) {
  const html = await htmlOnly(guide);
  const ok =
    (html.match(/<h1[\s>]/g) ?? []).length === 1 &&
    html.includes(`<link rel="canonical" href="https://serverlys.com${guide}"`) &&
    !/hrefLang=/i.test(html) &&
    sitemap.includes(`${guide}</loc>`) &&
    landingHtml.includes(`href="${guide}"`);
  check(ok, `${guide}: one h1, self canonical, no hreflang, in sitemap, linked from the landing page`);
}

// ── Demo analytics ─────────────────────────────────────────────────────────
await go("/restaurant-websites/demo");
await js(`window.__events = []; addEventListener("serverlys:analytics", (e) => window.__events.push(e.detail))`);
await js(`document.querySelector('button[aria-label="Add Asada tacos to order"]').click()`);
await sleep(300);
check(
  /restaurant_demo/.test(await js(`JSON.stringify(window.__events)`)) && /add_to_cart/.test(await js(`JSON.stringify(window.__events)`)),
  "demo add-to-cart fires restaurant_demo",
  await js(`JSON.stringify(window.__events).slice(0, 160)`),
);

// ── Lumbre experience ──────────────────────────────────────────────────────
console.log("\n── demo experience ──");
// Films honour reduced motion, which go() emulates; this block needs motion on.
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
await send("Page.navigate", { url: base + "/restaurant-websites/demo" });
await sleep(5000);
await js(`window.__set = (el, v) => { const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v); el.dispatchEvent(new Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true })); }`);
check(await js(`getComputedStyle(document.querySelector('[data-site-header]')).display === "none"`), "Serverlys header steps aside on the demo");
check(await js(`/Demo by Serverlys/.test(document.querySelector('[data-lumbre]').textContent)`), "demo frame says Demo by Serverlys");
const film = await js(`(() => { const v = document.querySelector('#lumbre-top video'); return v && { src: v.currentSrc, paused: v.paused } })()`);
check(film && /lumbre-hero\.(webm|mp4)$/.test(film.src) && !film.paused, "hero film loads and plays", JSON.stringify(film));
await js(`document.querySelector('[data-film-control="lumbre-hero"]').click()`);
await sleep(400);
check(await js(`document.querySelector('#lumbre-top video').paused`), "film pause control pauses it");
check(await js(`!document.querySelector('#fire video').currentSrc`), "second film waits until it nears the viewport");

await js(`[...document.querySelectorAll('[aria-labelledby=lumbre-signature-heading] nav button')].find((b) => b.textContent.trim() === "Desserts").click()`);
await sleep(900);
check(
  await js(`document.querySelectorAll('#menu li.group').length === 2 && document.querySelector('#menu [aria-pressed=true]').textContent.includes("Desserts")`),
  "signature index opens the menu on that section",
);

await js(`document.querySelector('#private form button[type=submit]').click()`);
await sleep(300);
check(
  await js(`document.querySelectorAll('#private [aria-invalid=true]').length === 3 && document.activeElement?.getAttribute("role") === "alert"`),
  "private inquiry validates and focuses the error summary",
);
await js(`(() => { const d = new Date(); d.setDate(d.getDate() + 10); const iso = d.toISOString().slice(0, 10);
  __set(document.getElementById("lumbre-pd-name"), "Ana Pérez"); __set(document.getElementById("lumbre-pd-email"), "ana@example.com"); __set(document.getElementById("lumbre-pd-date"), iso); })()`);
await js(`document.querySelector('#private form button[type=submit]').click()`);
await sleep(300);
check(await js(`/Demo inquiry received/.test(document.querySelector('#private').textContent)`), "private inquiry confirms as a demo");

await js(`document.querySelectorAll('#gallery li button')[0].click()`);
await sleep(400);
const box = `document.querySelector('#gallery dialog')`;
check(await js(`${box}.open && /1 of 8/.test(${box}.textContent)`), "gallery opens a lightbox at the photo");
await js(`${box}.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }))`);
await sleep(200);
check(await js(`/2 of 8/.test(${box}.textContent)`), "arrow key moves to the next photo");
await js(`${box}.querySelector('button[aria-label="Close gallery"]').click()`);
await sleep(300);
check(await js(`!${box}.open && document.activeElement === document.querySelectorAll('#gallery li button')[1]`), "closing returns focus to that photo");

await js(`__set(document.getElementById("lumbre-newsletter"), "not-an-email")`);
await js(`document.getElementById("lumbre-newsletter").form.requestSubmit()`);
await sleep(200);
check(await js(`document.getElementById("lumbre-newsletter").getAttribute("aria-invalid") === "true"`), "newsletter rejects an invalid email");
await js(`__set(document.getElementById("lumbre-newsletter"), "ana@example.com")`);
await js(`document.getElementById("lumbre-newsletter").form.requestSubmit()`);
await sleep(200);
check(await js(`/No email was saved/.test(document.getElementById("lumbre-newsletter-status").textContent)`), "newsletter confirms as a demo");

await go("/restaurant-websites/demo", 390);
check(await js(`!document.querySelector('#lumbre-top video').currentSrc`), "reduced motion: the film never loads, the poster stands in");
await js(`document.querySelector('[data-lumbre] header button[aria-label="Open menu"]').click()`);
await sleep(300);
const navDialog = `document.querySelector('[data-lumbre] header dialog')`;
check(await js(`${navDialog}.open`), "phone menu opens as a dialog");
await js(`[...${navDialog}.querySelectorAll('a')].find((a) => a.getAttribute("href") === "#menu").click()`);
await sleep(300);
check(await js(`!${navDialog}.open`), "choosing a section closes the phone menu");

check(errors.length === 0, "no uncaught page errors", errors.slice(0, 3).join(" / "));

console.log(`\n${passed} passed, ${failed.length} failed`);
ws.close();
chrome.kill();
process.exit(failed.length ? 1 : 0);
