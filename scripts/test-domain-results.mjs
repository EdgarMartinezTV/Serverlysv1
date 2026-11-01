/**
 * Hostinger-parity tests for the domain results flow (CDP, live API).
 *
 *   node scripts/test-domain-results.mjs [origin]
 *
 * Covers what test-domain-search.mjs does not: the hero → /domain-name-results
 * handoff, old deep links, the exact-match / great-alternative / bundle cards,
 * category tabs loading their extensions, add-to-cart links, the free-domain
 * strip and phone widths. Live on purpose (WHMCS answers through the real
 * provider chain); names are random so "available" is stable.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ORIGIN = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const PORT = 9702;
const FREE = `zqsvtest${Date.now().toString(36)}`;
/** .com registered, most other extensions free — the "great alternative" case. */
const TAKEN = "bluefernstudio";

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/cdp-domain-results",
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
}
const ws = new WebSocket(await ep());
await new Promise((r) => {
  ws.onopen = r;
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
await send("Network.enable", {}, sessionId);

const ev = async (x) => {
  const r = await send(
    "Runtime.evaluate",
    { expression: `(async()=>{${x}})()`, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (r.result?.exceptionDetails)
    throw new Error(r.result.exceptionDetails.text + " :: " + x.slice(0, 90));
  return r.result?.result?.value;
};
const viewport = (w, m = false) =>
  send(
    "Emulation.setDeviceMetricsOverride",
    { width: w, height: 900, deviceScaleFactor: 1, mobile: m },
    sessionId,
  );

const search = async (q) =>
  ev(`
  const i=document.querySelector('input[name="query"]');
  const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  setter.call(i, ${JSON.stringify(q)});
  i.dispatchEvent(new Event('input',{bubbles:true}));
  i.form.requestSubmit();
  return true;`);

let failures = 0;
let passes = 0;
function check(name, ok, detail = "") {
  if (ok) passes++;
  else failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${!ok && detail ? `  (${detail})` : ""}`);
}
const go = async (path, wait = 1800) => {
  await send("Page.navigate", { url: `${ORIGIN}${path}` }, sessionId);
  await sleep(wait);
};
const waitFor = async (js, ms = 25000) => {
  const t = Date.now();
  while (Date.now() - t < ms) {
    if (await ev(js).catch(() => false)) return true;
    await sleep(300);
  }
  return false;
};
const text = () => ev("return document.body.innerText");

console.log("\n── Hero hands off to the results page ──");
await viewport(1280);
await go("/domain-name");
await search(`${FREE}.com`);
check(
  "hero search navigates to /domain-name-results?domain=…",
  await waitFor(`return location.pathname==='/domain-name-results' && new URLSearchParams(location.search).get('domain')==='${FREE}.com'`),
);
check("results page runs the search on arrival", await waitFor(`return /exact match/i.test(document.body.innerText)`));

console.log("\n── Available exact match ──");
check(
  "exact card has price, renewal and 'Make it yours' to the WHMCS cart",
  await ev(`const li=[...document.querySelectorAll('li')].find(l=>/exact match/i.test(l.textContent));
    const a=li && [...li.querySelectorAll('a')].find(a=>/make it yours/i.test(a.textContent));
    return !!a && a.getAttribute('href').includes('domains[]=${FREE}.com') && /renews at/i.test(li.textContent) && li.textContent.includes('/1st yr')`),
);
check(
  "bundle offers .com + .org + .info in one cart link",
  await ev(`const li=[...document.querySelectorAll('li')].find(l=>/bundle/i.test(l.textContent));
    const a=li && [...li.querySelectorAll('a')].find(a=>/get all three/i.test(a.textContent));
    const h=a?.getAttribute('href')||''; return ['.com','.org','.info'].every(t=>h.includes('domains[]=${FREE}'+t))`),
);
check("free-domain-with-hosting strip is shown", /free domain for the first year with hosting/i.test(await text()));
check(
  "category tabs: Popular selected, All present",
  await ev(`const t=[...document.querySelectorAll('[role=tab]')]; return t.length>=3 && t[0].getAttribute('aria-selected')==='true' && /popular/i.test(t[0].textContent) && t.some(x=>x.textContent.trim()==='All')`),
);
check(
  "Popular tab lists available alternates with 'Get it' cart links",
  await ev(`const links=[...document.querySelectorAll('[role=tabpanel] a')].filter(a=>/^get it/i.test(a.textContent.trim()));
    return links.length>=5 && links.every(a=>a.getAttribute('href').includes('domain=register'))`),
);

console.log("\n── A tab checks the extensions it has not checked yet ──");
await ev(`window.__checks=[]; const f=window.fetch; window.fetch=(u,o)=>{ if(String(u).includes('/api/domains/check')) window.__checks.push(o&&o.body); return f(u,o); }; return 1`);
await ev(`[...document.querySelectorAll('[role=tab]')].find(t=>t.textContent.trim()==='Shopping').click(); return 1`);
check(
  "Shopping tab requests only its unchecked extensions",
  await waitFor(`return (window.__checks||[]).some(b=>(b||'').includes('"tlds"') && (b||'').includes('.shop'))`, 8000),
);
check(
  "Shopping tab then shows .shop and .store",
  await waitFor(`const p=document.querySelector('[role=tabpanel]'); return p && p.textContent.includes('${FREE}.shop') && p.textContent.includes('${FREE}.store')`),
);
await ev(`window.__checks=[]; [...document.querySelectorAll('[role=tab]')].find(t=>t.textContent.trim()==='Popular').click(); return 1`);
await sleep(800);
check("going back to a checked tab does not refetch", await ev(`return window.__checks.length===0`));

console.log("\n── Taken exact match ──");
await go(`/domain-name-results?domain=${TAKEN}.com`);
await waitFor(`return /taken/i.test(document.body.innerText)`);
check(
  "says it is taken and offers a great alternative",
  await waitFor(`const t=document.body.innerText.toLowerCase(); return t.includes('is already taken. we found a great alternative') && [...document.querySelectorAll('li')].some(l=>/great alternative/i.test(l.textContent) && /make it yours/i.test(l.textContent))`, 8000),
);
check(
  "taken row: transfer + WHOIS, no cart link",
  await ev(`const li=[...document.querySelectorAll('li')].find(l=>l.textContent.includes('${TAKEN}.com')&&/taken/i.test(l.textContent));
    return !!li && /transfer it here/i.test(li.textContent) && !li.querySelector('a[href*="domain=register"]')`),
);

console.log("\n── Old deep links ──");
await go(`/domain-name?domain=${FREE}.net`, 2500);
check(
  "/domain-name?domain=… redirects to the results page",
  await waitFor(`return location.pathname==='/domain-name-results' && location.search.includes('${FREE}.net')`, 8000),
);

console.log("\n── Phone widths ──");
for (const w of [320, 375, 430]) {
  await viewport(w, true);
  await go(`/domain-name-results?domain=${FREE}.com`, 1500);
  await waitFor(`return /exact match/i.test(document.body.innerText)`);
  await sleep(600);
  check(
    `${w}px: no horizontal overflow, cart buttons ≥44px`,
    await ev(`const ok=document.documentElement.scrollWidth<=document.documentElement.clientWidth+1;
      const btn=[...document.querySelectorAll('main a')].filter(a=>/^(make it yours|get it|get all three)/i.test(a.textContent.trim())&&a.getBoundingClientRect().width>0);
      return ok && btn.length>0 && btn.every(a=>a.getBoundingClientRect().height>=44)`),
  );
}

console.log(failures ? `\n✗ FAILURES — ${passes} passed, ${failures} failed` : `\n✓ ALL PASS — ${passes} passed, 0 failed`);
chrome.kill();
process.exit(failures ? 1 : 0);
