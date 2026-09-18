/**
 * Product page interaction tests (CDP).
 *
 * Asserts that every interactive element on a PricingTable-backed product page
 * actually works and that no CTA is a dead link.
 *
 * ⚠ TARGET MATTERS — /wordpress-hosting is the only page this fits.
 *
 * It asserts a FULL product page: the <PricingTable> controls (the "Hosting
 * type" tablist, the billing-term radiogroup, four plan cards in
 * single-product mode), a comparison table, a <details> FAQ and a #plans
 * anchor. Two other pages look like candidates and are not:
 *
 *   · /cloud-hosting  — redesigned around its own <input type="range"> slider
 *     showing one tier at a time. No tablist, no radiogroup, no four cards.
 *     This used to be the default target, so the script failed three
 *     assertions and then crashed on a null control.
 *   · /migrations     — reuses <PricingTable only="cloud"> but is not a
 *     product page: no comparison table, no FAQ disclosures, no #plans.
 *
 * Point it anywhere else and the checks below now FAIL with a reason rather
 * than throwing, but they are still telling you the target is wrong.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.argv[2] ?? "http://localhost:3000/wordpress-hosting";
const PORT = 9655;
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/cdp-product",
  "about:blank",
]);
async function ep() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      return (await r.json()).webSocketDebuggerUrl;
    } catch {
      await sleep(250);
    }
  }
  throw new Error("no cdp");
}
const ws = new WebSocket(await ep());
await new Promise((r, j) => {
  ws.onopen = r;
  ws.onerror = j;
});
let id = 0;
const p = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && p.has(m.id)) {
    p.get(m.id)(m);
    p.delete(m.id);
  }
};
const send = (method, params = {}, s) =>
  new Promise((r) => {
    const i = ++id;
    p.set(i, r);
    ws.send(JSON.stringify({ id: i, method, params, sessionId: s }));
  });
const {
  result: { targetId },
} = await send("Target.createTarget", { url: "about:blank" });
const {
  result: { sessionId },
} = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
const ev = async (expression) => {
  const r = await send(
    "Runtime.evaluate",
    {
      expression: `(async()=>{${expression}})()`,
      returnByValue: true,
      awaitPromise: true,
    },
    sessionId,
  );
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.text);
  return r.result?.result?.value;
};
async function viewport(w, mobile = false) {
  await send(
    "Emulation.setDeviceMetricsOverride",
    { width: w, height: 900, deviceScaleFactor: 1, mobile },
    sessionId,
  );
}
async function load() {
  await send("Page.navigate", { url: URL }, sessionId);
  await sleep(1600);
}

let pass = 0,
  fail = 0;
const check = (name, ok, detail = "") => {
  if (ok) {
    pass++;
    console.log(`  \u2713 ${name}`);
  } else {
    fail++;
    console.log(`  \u2717 ${name}${detail ? `  \u2014 ${detail}` : ""}`);
  }
};

console.log("\n── Desktop 1440 ──");
await viewport(1440);
await load();

check(
  "single-product mode hides the hosting-type tablist",
  // Scoped by LABEL, not by container. The header's mega-menu rail is a
  // tablist, and so is the live hosting console's site switcher inside <main>
  // ("Choose a site") — a positional selector picks those up and reports a bug
  // that is not there. Only the pricing control is labelled "Hosting type".
  await ev(
    `return document.querySelectorAll('[role="tablist"][aria-label="Hosting type"]').length === 0`,
  ),
);
check(
  "billing-term radiogroup still present",
  await ev(
    `return document.querySelectorAll('input[name="billing-term"]').length === 2`,
  ),
);
check(
  // Derived from the URL, not hardcoded to Cloud: this script takes a page and
  // every product page renders its own group's four tiers.
  "only this product's four plans render",
  await ev(`const want = location.pathname.includes('wordpress') ? 'WordPress'
      : location.pathname.includes('ecommerce') ? 'Ecommerce' : 'Cloud';
    const others = ['Cloud','WordPress','Ecommerce'].filter(n=>n!==want);
    const h=[...document.querySelectorAll('h3')].map(e=>e.textContent||'');
    return h.filter(t=>t.includes(want+' ')||t.endsWith(want)).length>=4
      && !others.some(o=>h.some(t=>t.includes(o+' Cloud')||t.startsWith(o+' ')));`),
);

// Prices and rate names both changed when the store figures were verified —
// see the header of data/pricing.ts. The term framing was dropped on
// 2026-09-16, so the toggle is now monthly rate vs standard rate, and the
// entry tier is $7.95 against a $12.62 standard.
const onPromo = await ev(`return document.body.innerText.includes('$7.95')`);
await ev(`document.querySelector('input[name="billing-term"][value="standard"]')?.click();
  await new Promise(r=>setTimeout(r,250)); return true`);
const atStandard = await ev(`return document.body.innerText.includes('$12.62')`);
check(
  "rate toggle actually changes prices",
  onPromo && atStandard,
  `monthly $7.95=${onPromo}, standard $12.62=${atStandard}`,
);
check(
  "the standard rate is shown beside the monthly rate",
  await ev(`document.querySelector('input[name="billing-term"][value="monthly"]')?.click();
    await new Promise(r=>setTimeout(r,250));
    return document.body.innerText.includes('Standard rate')`),
);

check(
  "comparison table scroll region is keyboard reachable + labelled",
  await ev(`const r=document.querySelector('[role="region"][aria-label]');
    return !!r && r.tabIndex===0 && r.getAttribute('aria-label').length>0`),
);
check(
  "comparison table uses scoped headers",
  await ev(`const t=document.querySelector('table'); if(!t) return false;
    return t.querySelectorAll('th[scope="col"]').length>=5 && t.querySelectorAll('th[scope="row"]').length>=5`),
);
check(
  "table has a caption",
  await ev(`return !!document.querySelector('table caption')?.textContent.trim()`),
);

/* The breadcrumb assertion that used to sit here was removed with the trail
   itself: components/ui/breadcrumbs.tsx became a no-op on 2026-09-11, on
   request, and renders nothing on any page. The BreadcrumbList JSON-LD is
   still emitted and is covered by the SEO audit, not here. */

check(
  "FAQ disclosures open",
  await ev(`const d=document.querySelector('details'); const before=d?.open;
    d?.querySelector('summary')?.click(); await new Promise(r=>setTimeout(r,150));
    return before===false && d?.open===true`),
);

// scroll-behavior is `smooth`, so the animation needs time to settle, and the
// landing position is governed by scroll-padding-top (5.5rem, clearing the
// sticky header) — not 0. Re-clicking the same anchor is a no-op once the hash
// is set, so this is asserted once per page load.
check(
  '"Choose a plan" scrolls to the plans section (below the sticky header)',
  await ev(`document.querySelector('a[href="#plans"]')?.click();
    await new Promise(r=>setTimeout(r,2600));
    const el=document.getElementById('plans'); if(!el) return false;
    const r=el.getBoundingClientRect();
    return window.scrollY > 100 && r.top >= 40 && r.top <= 170`),
  await ev(
    `const el=document.getElementById('plans');
     return el ? 'rect.top=' + Math.round(el.getBoundingClientRect().top) : 'no #plans on this page'`,
  ),
);

// No dead links anywhere on the page.
const dead = await ev(`return JSON.stringify([...document.querySelectorAll('a')]
  .filter(a=>{const h=a.getAttribute('href'); return !h || h==='#' || h==='' || h==='javascript:void(0)'})
  .map(a=>(a.textContent||'').trim().slice(0,30)))`);
check("no dead links (empty href or bare #)", JSON.parse(dead).length === 0, dead);

const ctas = await ev(`return JSON.stringify([...document.querySelectorAll('a')]
  .map(a=>a.getAttribute('href')).filter(h=>h && h.includes('/billing/'))
  .filter((v,i,s)=>s.indexOf(v)===i).slice(0,8))`);
check(
  "checkout CTAs point at real WHMCS paths",
  JSON.parse(ctas).length > 0,
  JSON.parse(ctas).join(" "),
);

console.log("\n── Mobile 375 ──");
await viewport(375, true);
await load();
check(
  "no page-level horizontal scroll",
  await ev(
    `return document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1`,
  ),
);
check(
  "wide table is contained by its scroll region, not the page",
  await ev(`const r=document.querySelector('[role="region"][aria-label]');
    return r.scrollWidth > r.clientWidth && document.documentElement.scrollWidth <= document.documentElement.clientWidth+1`),
);
check(
  "term toggle works on mobile",
  await ev(`document.querySelector('input[name="billing-term"][value="standard"]')?.click();
    await new Promise(r=>setTimeout(r,250)); return document.body.innerText.includes('$12.62')`),
);
check(
  // Found by POSITION, not by label. Each product page writes its own hero CTA
  // copy, and hardcoding one page's wording makes this script unusable against
  // the others — which is the whole point of it taking a URL.
  "hero CTAs are full-width and ≥44px tall",
  await ev(`const hero=document.querySelector('main section, main header') || document.body;
    const b=[...hero.querySelectorAll('a')].find(a=>{const r=a.getBoundingClientRect(); return r.height>=40 && r.width>200;});
    if(!b) return false;
    const r=b.getBoundingClientRect(); return r.height>=44 && r.width > 250`),
);

console.log(
  `\n${fail === 0 ? "✓ ALL PASS" : "✗ FAILURES"} — ${pass} passed, ${fail} failed\n`,
);
ws.close();
chrome.kill();
process.exit(fail === 0 ? 0 : 1);
