/**
 * Console, exception and failed-request sweep across every indexable route.
 *
 * A React hydration mismatch, a null deref in a client component or a 404 on an
 * asset shows up only at runtime, only in the console, and only on the page it
 * affects. Type checks and builds pass straight through all three. The homepage
 * suite covers one page; this covers all of them.
 *
 * Run against the DEV server: production strips the hydration-mismatch warnings
 * that are the most valuable thing here.
 *
 * Usage: node scripts/test-console.mjs [baseUrl]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const base = process.argv[2] ?? "http://localhost:3000";

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .sort();

const port = 9410 + (Math.floor(process.uptime() * 1000) % 80);
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/cdp-console-${port}`,
  "about:blank",
]);
async function endpoint() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); return (await r.json()).webSocketDebuggerUrl; }
    catch { await sleep(250); }
  }
  throw new Error("no debugger endpoint");
}
const ws = new WebSocket(await endpoint());
await new Promise((res) => { ws.onopen = res; });

let id = 0;
const pending = new Map();
let bucket = [];
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result ?? {}); pending.delete(m.id); return; }
  if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params.type)) {
    bucket.push(`console.${m.params.type}: ${m.params.args.map((a) => a.value ?? a.description ?? a.type).join(" ")}`);
  }
  if (m.method === "Runtime.exceptionThrown") {
    bucket.push(`exception: ${m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text}`);
  }
  if (m.method === "Network.loadingFailed" && !m.params.errorText.includes("ERR_ABORTED")) {
    bucket.push(`request failed: ${m.params.type} ${m.params.errorText}`);
  }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send("Network.enable", {}, sessionId);
await send("Emulation.setDeviceMetricsOverride",
  { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);

const ignorable = (line) =>
  line.includes("Download the React DevTools") ||
  line.includes("react-devtools") ||
  line.includes("Fast Refresh") ||
  line.includes("[Fast Refresh]");

const problems = [];
for (const route of routes) {
  bucket = [];
  await send("Page.navigate", { url: base + route }, sessionId);
  await sleep(1200);
  // Scroll the whole page so lazy/observer-driven components actually mount.
  await send("Runtime.evaluate", {
    expression: `(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}window.scrollTo(0,0);})()`,
    awaitPromise: true,
  }, sessionId);
  await sleep(400);
  const real = bucket.filter((l) => !ignorable(l));
  if (real.length) problems.push(`${route}\n    ${[...new Set(real)].slice(0, 3).join("\n    ")}`);
  process.stdout.write(real.length ? "✗" : ".");
}
console.log(`\n\n${routes.length} routes checked`);
if (problems.length) {
  console.log(`\n${problems.length} route(s) with problems:\n`);
  for (const p of problems) console.log("  " + p + "\n");
} else {
  console.log("✓ no console errors, exceptions or failed requests on any route");
}
ws.close(); chrome.kill();
process.exit(problems.length ? 1 : 0);
