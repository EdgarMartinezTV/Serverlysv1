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

const pages = ["/", "/cloud-hosting", "/register-domain"];
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
    let lcp=0,cls=0;
    await new Promise(res=>{
      new PerformanceObserver(l=>{for(const e of l.getEntries()) lcp=Math.max(lcp,e.startTime)}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) cls+=e.value}).observe({type:'layout-shift',buffered:true});
      setTimeout(res,500);
    });
    const bytes=performance.getEntriesByType('resource').reduce((a,r)=>a+(r.transferSize||0),0)+(nav.transferSize||0);
    return JSON.stringify({ttfb:nav.responseStart,fcp:fcp?fcp.startTime:0,lcp,cls,bytes});`);
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
}
console.log("\nGood thresholds: LCP ≤ 2.50s · CLS ≤ 0.10 · TTFB ≤ 0.80s");
ws.close();
c.kill();
