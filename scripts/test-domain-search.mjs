/**
 * Domain search UI state tests (CDP).
 * Exercises every state the component can enter, against the real API.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.argv[2] ?? "http://localhost:3000/register-domain";
const PORT = 9701;
const AVAILABLE = "zzq-serverlys-probe-5521";
const TAKEN = "google.com";

// Wait out any rate-limit window left by earlier requests.
for (let i = 0; i < 70; i++) {
  const r = await fetch("http://localhost:3000/api/domains/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "warmup-probe-0001.com" }),
  });
  if (r.status !== 429) break;
  await sleep(2000);
}

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/cdp-domain",
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
const load = async () => {
  await send("Page.navigate", { url: URL }, sessionId);
  await sleep(1700);
};
const offline = (v) =>
  send(
    "Network.emulateNetworkConditions",
    { offline: v, latency: 0, downloadThroughput: -1, uploadThroughput: -1 },
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
// NOTE: badges are text-transform:uppercase and Chrome's innerText reflects
// that ("Taken" renders as "TAKEN"), so every text assertion here is
// case-insensitive. Matching on mixed case produced false negatives.
const waitResults = async (ms = 20000) =>
  ev(`
  const t=Date.now();
  const re=/available|taken|did not complete|unavailable/i;
  while(Date.now()-t<${ms}){
    if(re.test(document.body.innerText)) return true;
    await new Promise(r=>setTimeout(r,200));
  } return false;`);

let pass = 0,
  fail = 0;
const check = (name, ok, detail = "") => {
  if (ok) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}${detail ? `  — ${detail}` : ""}`);
  }
};

console.log("\n── Idle & validation ──");
await viewport(1440);
await load();
// The Chrome profile persists between runs; clear stored state so shortlist
// and history counts are deterministic.
await ev(`localStorage.clear(); return true`);
await load();
check(
  "idle: no results rendered yet",
  await ev(
    `return !document.body.innerText.includes('Available') && !document.body.innerText.includes('Taken')`,
  ),
);
check(
  "search input is labelled",
  await ev(`const i=document.querySelector('input[name="query"]');
    return !!document.querySelector('label[for="'+i.id+'"]')`),
);
check(
  "TLD preference is a real radiogroup",
  await ev(
    `return document.querySelectorAll('input[name="preferred-tld"]').length >= 5`,
  ),
);

await search("my site.com");
await sleep(400);
check(
  "invalid input shows a validation message and aria-invalid",
  await ev(`const i=document.querySelector('input[name="query"]');
    return i.getAttribute('aria-invalid')==='true' && document.body.innerText.includes('cannot contain spaces')`),
);
check(
  "validation message is linked via aria-describedby",
  await ev(`const i=document.querySelector('input[name="query"]');
    const d=i.getAttribute('aria-describedby'); return !!d && !!document.getElementById(d)`),
);

console.log("\n── Loading & results ──");
await load();
const loadingState = await ev(`
  const i=document.querySelector('input[name="query"]');
  const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  setter.call(i, 'loading-probe-' + Math.random().toString(36).slice(2,10) + '.com');
  i.dispatchEvent(new Event('input',{bubbles:true}));
  i.form.requestSubmit();
  await new Promise(r=>setTimeout(r,80));
  const region=document.querySelector('[aria-live="polite"]');
  return JSON.stringify({
    busy: region.getAttribute('aria-busy')==='true',
    skeletons: region.querySelectorAll('.animate-pulse').length,
    button: !!document.querySelector('button[aria-busy="true"]'),
  });`);
const ls = JSON.parse(loadingState);
check(
  "loading: busy region + skeletons shown",
  ls.busy && ls.skeletons > 0,
  loadingState,
);
check("submit button shows a loading state", ls.button);
await waitResults();

await load();
await search(TAKEN);
await waitResults();
check(
  "registered domain reports Taken (real registry answer)",
  await ev(`return /\\bTAKEN\\b/i.test(document.body.innerText)`),
);
check(
  "taken domain offers transfer, not registration",
  await ev(`return document.body.innerText.includes('Transfer it here')`),
);
check(
  "no Register CTA on a taken row",
  await ev(`const rows=[...document.querySelectorAll('li')].filter(l=>l.textContent.includes('google.com')&&/taken/i.test(l.textContent));
    return rows.length>0 && rows.every(r=>!r.querySelector('a[href*="domain=register"]'))`),
);

await load();
await search(AVAILABLE);
await waitResults();
check(
  "available domain reports Available with a price",
  await ev(
    `return /\\bAVAILABLE\\b/i.test(document.body.innerText) && document.body.innerText.includes('$14.95')`,
  ),
);
check(
  "available row links to the real WHMCS cart",
  await ev(`const a=[...document.querySelectorAll('a')].find(a=>(a.getAttribute('href')||'').includes('a=add&domain=register&query='));
    return !!a && a.getAttribute('href').includes('${AVAILABLE}')`),
);
check(
  "alternate TLD suggestions rendered",
  await ev(
    `return document.body.innerText.includes('.net') && document.body.innerText.includes('.org')`,
  ),
);
check(
  "provenance disclosed (registry-sourced)",
  await ev(
    `return document.body.innerText.includes('read live from the domain registry')`,
  ),
);

console.log("\n── Shortlist & history ──");
check(
  "save adds to shortlist",
  await ev(`localStorage.removeItem('serverlys.domain.shortlist.v1');
    document.querySelector('button[aria-pressed="false"]').click();
    await new Promise(r=>setTimeout(r,250));
    return document.body.innerText.includes('Saved names (1)')`),
);
await load();
check(
  "shortlist persists across reload",
  await ev(`return document.body.innerText.includes('Saved names (1)')`),
);
check(
  "recent searches persist",
  await ev(`return /recent/i.test(document.body.innerText)`),
);
check(
  "shortlist item links to WHMCS cart",
  await ev(`const s=[...document.querySelectorAll('section')].find(s=>s.innerText.includes('Saved names'));
    return !!s.querySelector('a[href*="a=add&domain=register&query="]')`),
);
check(
  "remove clears the shortlist",
  await ev(`const s=[...document.querySelectorAll('section')].find(s=>s.innerText.includes('Saved names'));
    [...s.querySelectorAll('button')].find(b=>b.innerText.includes('Clear all')).click();
    await new Promise(r=>setTimeout(r,250));
    return !document.body.innerText.includes('Saved names')`),
);

console.log("\n── Duplicate & network failure ──");
await load();
await search(TAKEN);
await waitResults();
const before = await ev(
  `return performance.getEntriesByType('resource').filter(e=>e.name.includes('/api/domains/check')).length`,
);
await search(TAKEN);
await sleep(900);
const after = await ev(
  `return performance.getEntriesByType('resource').filter(e=>e.name.includes('/api/domains/check')).length`,
);
check("duplicate search does not refetch", after === before, `${before} → ${after}`);

await load();
await offline(true);
await search("offline-probe-3312.com");
await sleep(2500);
check(
  "network failure shows an error state, not a fake result",
  await ev(
    `return /did not complete/i.test(document.body.innerText) && !/\\bAVAILABLE\\b/i.test(document.body.innerText)`,
  ),
);
check(
  "error state offers a retry",
  await ev(
    `return [...document.querySelectorAll('button')].some(b=>b.innerText.includes('Try again'))`,
  ),
);
check(
  "error state keeps the WHMCS fallback reachable",
  await ev(
    `return [...document.querySelectorAll('a')].some(a=>a.innerText.includes('Search in the cart'))`,
  ),
);
await offline(false);

console.log("\n── Mobile 375 ──");
await viewport(375, true);
await load();
check(
  "no horizontal overflow",
  await ev(
    `return document.documentElement.scrollWidth <= document.documentElement.clientWidth+1`,
  ),
);
check(
  "search input is ≥44px tall",
  await ev(
    `return document.querySelector('input[name="query"]').getBoundingClientRect().height>=44`,
  ),
);
await search(AVAILABLE);
await waitResults();
check(
  "results readable on mobile without overflow",
  await ev(`return document.documentElement.scrollWidth <= document.documentElement.clientWidth+1
    && /\\bAVAILABLE\\b/i.test(document.body.innerText)`),
);
// Filter to VISIBLE controls: the closed mega-menu contains a "Register a
// domain" link that is correctly 0px tall while hidden.
check(
  "every visible Register control meets the 44px touch target",
  await ev(`const links=[...document.querySelectorAll('a')]
      .filter(a=>/^register/i.test(a.textContent.trim()))
      .filter(a=>a.getBoundingClientRect().width>0);
    return links.length>0 && links.every(a=>a.getBoundingClientRect().height>=44)`),
);

console.log(
  `\n${fail === 0 ? "✓ ALL PASS" : "✗ FAILURES"} — ${pass} passed, ${fail} failed\n`,
);
ws.close();
chrome.kill();
process.exit(fail === 0 ? 0 : 1);
