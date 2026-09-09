/**
 * Core Web Vitals measurement.
 *
 * Runs against a PRODUCTION build — dev-server numbers are meaningless
 * (unminified bundles, HMR overhead) and quoting them would be misleading.
 *
 *   npm run build && PORT=3200 npx next start
 *   node scripts/cwv.mjs
 *
 * Throttling mimics the low-end mobile profile Google's field data skews to,
 * so a pass here is a pessimistic estimate rather than an optimistic one.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { readFileSync } from "node:fs";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9788;
const c = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/cdp-cwv",
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
const send = (m, params = {}, s) =>
  new Promise((r) => {
    const i = ++id;
    p.set(i, r);
    ws.send(JSON.stringify({ id: i, method: m, params, sessionId: s }));
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
  if (r.result?.exceptionDetails) return { err: r.result.exceptionDetails.text };
  return r.result?.result?.value;
};

// Moto G4-ish: 4x CPU throttle + Fast 3G, the profile Google's field data skews to.
// Cache disabled, so every page is measured as a FIRST visit. Without this the
// first route measured pays for the shared JS and CSS and every later route
// reads artificially fast — the numbers stop being comparable to each other and
// stop describing the visitor who has never been here before.
await send("Network.setCacheDisabled", { cacheDisabled: true }, sessionId);
await send("Emulation.setCPUThrottlingRate", { rate: 4 }, sessionId);
await send(
  "Network.emulateNetworkConditions",
  {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  },
  sessionId,
);
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  sessionId,
);

// Every built, indexable page — read from the route registry rather than
// hand-listed, so a new page cannot ship unmeasured. Plus one article, which
// is the only template with a different layout.
const routeSrc = readFileSync(new URL("../src/data/routes.ts", import.meta.url), "utf8");
const pages = [
  ...[...routeSrc.matchAll(/path: "([^"]+)",\n    name: "[^"]*",\n    group: "[^"]*",\n    built: true,\n    indexable: true/g)].map(
    (m) => m[1],
  ),
  "/blog/how-to-read-hosting-renewal-pricing",
];
// Preflight. Without this the script navigates to a connection-refused error
// page and reports 0.00s / 0 KB for every route — numbers that look like a
// spectacular pass and mean nothing. An audit that cannot tell "fast" from
// "not running" is worse than no audit.
const ORIGIN = "http://localhost:3200";
try {
  const probe = await fetch(ORIGIN + "/", { redirect: "manual" });
  if (probe.status >= 500) throw new Error("server returned " + probe.status);
} catch (e) {
  console.error(
    `\n✗ Nothing serving ${ORIGIN} (${e.message}).\n` +
      "  This audit needs a PRODUCTION build — dev-server numbers are meaningless:\n" +
      "      npm run build && PORT=3200 npx next start\n",
  );
  c.kill();
  process.exit(1);
}

console.log("\nMobile · 4x CPU throttle · Fast 3G\n");
console.log(
  "page".padEnd(20) +
    "TTFB".padStart(9) +
    "FCP".padStart(9) +
    "LCP".padStart(9) +
    "CLS".padStart(9) +
    "  transfer",
);
console.log("-".repeat(70));
for (const path of pages) {
  await send("Page.navigate", { url: "http://localhost:3200" + path }, sessionId);
  await sleep(6000);
  const m = await ev(`
    const nav=performance.getEntriesByType('navigation')[0];
    const fcp=performance.getEntriesByName('first-contentful-paint')[0];
    let lcp=0,cls=0,lcpEl='';
    await new Promise(res=>{
      // Record WHAT the LCP element is, not just when it painted. Without it a
      // slow page tells you nothing about which element to fix.
      new PerformanceObserver(l=>{for(const e of l.getEntries()){
        if(e.startTime>=lcp){lcp=e.startTime;
          lcpEl=e.url||(e.element?e.element.tagName.toLowerCase()+
            (e.element.className?'.'+String(e.element.className).split(' ')[0]:'')+
            ' “'+(e.element.innerText||'').trim().slice(0,40)+'”':'');}}}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) cls+=e.value}).observe({type:'layout-shift',buffered:true});
      setTimeout(res,500);
    });
    const bytes=performance.getEntriesByType('resource').reduce((a,r)=>a+(r.transferSize||0),0)+(nav.transferSize||0);
    return JSON.stringify({ttfb:nav.responseStart,fcp:fcp?fcp.startTime:0,lcp,cls,bytes,lcpEl});`);
  const d = JSON.parse(m);
  const f = (n) => (n / 1000).toFixed(2) + "s";
  console.log(
    path.padEnd(20) +
      f(d.ttfb).padStart(9) +
      f(d.fcp).padStart(9) +
      f(d.lcp).padStart(9) +
      d.cls.toFixed(3).padStart(9) +
      "  " +
      (d.bytes / 1024).toFixed(0) +
      " KB",
  );
  // Only for pages worth investigating — naming the LCP element on a 0.3s page
  // is noise.
  if (d.lcp > 1500 && d.lcpEl) console.log(" ".repeat(22) + "↳ LCP element: " + d.lcpEl);
}
console.log("\nGood thresholds: LCP ≤ 2.50s · CLS ≤ 0.10 · TTFB ≤ 0.80s");
ws.close();
c.kill();
