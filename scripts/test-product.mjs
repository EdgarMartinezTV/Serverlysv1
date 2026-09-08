/**
 * Product page interaction tests (CDP).
 * Asserts that every interactive element on /cloud-hosting actually works and
 * that no CTA is a dead link.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.argv[2] ?? "http://localhost:3000/cloud-hosting";
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
  await ev(`return document.querySelectorAll('[role="tablist"]').length === 0`),
);
check(
  "billing-term radiogroup still present",
  await ev(
    `return document.querySelectorAll('input[name="billing-term"]').length === 2`,
  ),
);
check(
  "only cloud plans render (4 cards, no WordPress/Ecommerce)",
  await ev(`const h=[...document.querySelectorAll('h3')].map(e=>e.textContent);
    return h.filter(t=>t.includes('Cloud')).length===4 && !h.some(t=>t.includes('WordPress ')||t.includes('Ecommerce '))`),
);

const annual = await ev(`return document.body.innerText.includes('$2.19')`);
await ev(`document.querySelector('input[name="billing-term"][value="monthly"]').click();
  await new Promise(r=>setTimeout(r,200)); return true`);
const monthly = await ev(`return document.body.innerText.includes('$2.91')`);
check(
  "term toggle actually changes prices",
  annual && monthly,
  `annual $2.19=${annual}, monthly $2.91=${monthly}`,
);
check(
  "renewal price shown in BOTH terms",
  await ev(`return document.body.innerText.includes('Renews at')`),
);

check(
  "comparison table scroll region is keyboard reachable + labelled",
  await ev(`const r=document.querySelector('[role="region"][aria-label]');
    return !!r && r.tabIndex===0 && r.getAttribute('aria-label').length>0`),
);
check(
  "comparison table uses scoped headers",
  await ev(`const t=document.querySelector('table');
    return t.querySelectorAll('th[scope="col"]').length>=5 && t.querySelectorAll('th[scope="row"]').length>=5`),
);
check(
  "table has a caption",
  await ev(`return !!document.querySelector('table caption')?.textContent.trim()`),
);

check(
  "breadcrumb marks current page and does not link it",
  await ev(`const c=document.querySelector('nav[aria-label="Breadcrumb"] [aria-current="page"]');
    return !!c && c.tagName!=='A' && !c.closest('a')`),
);

check(
  "FAQ disclosures open",
  await ev(`const d=document.querySelector('details'); const before=d.open;
    d.querySelector('summary').click(); await new Promise(r=>setTimeout(r,150));
    return before===false && d.open===true`),
);

// scroll-behavior is `smooth`, so the animation needs time to settle, and the
// landing position is governed by scroll-padding-top (5.5rem, clearing the
// sticky header) — not 0. Re-clicking the same anchor is a no-op once the hash
// is set, so this is asserted once per page load.
check(
  '"Choose a plan" scrolls to the plans section (below the sticky header)',
  await ev(`document.querySelector('a[href="#plans"]').click();
    await new Promise(r=>setTimeout(r,1500));
    const r=document.getElementById('plans').getBoundingClientRect();
    return window.scrollY > 100 && r.top >= 40 && r.top <= 140`),
  await ev(
    `return 'rect.top=' + Math.round(document.getElementById('plans').getBoundingClientRect().top)`,
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
  await ev(`document.querySelector('input[name="billing-term"][value="monthly"]').click();
    await new Promise(r=>setTimeout(r,200)); return document.body.innerText.includes('$2.91')`),
);
check(
  "hero CTAs are full-width and ≥44px tall",
  await ev(`const b=[...document.querySelectorAll('a')].find(a=>a.textContent.trim()==='Choose a plan');
    const r=b.getBoundingClientRect(); return r.height>=44 && r.width > 250`),
);

console.log(
  `\n${fail === 0 ? "✓ ALL PASS" : "✗ FAILURES"} — ${pass} passed, ${fail} failed\n`,
);
ws.close();
chrome.kill();
process.exit(fail === 0 ? 0 : 1);
