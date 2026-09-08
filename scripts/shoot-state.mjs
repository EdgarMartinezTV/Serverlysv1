/** Screenshot after running a JS snippet (to open menus etc).
 *  Args: url out width mobile js */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [, , url, out, name, width = "1440", mobile = "false", js = ""] = process.argv;
mkdirSync(out, { recursive: true });
const port = 9633;
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  "--user-data-dir=/tmp/cdp-state",
  "about:blank",
]);
async function ep() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
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
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: +width, height: 1000, deviceScaleFactor: 2, mobile: mobile === "true" },
  sessionId,
);
await send("Page.navigate", { url }, sessionId);
await sleep(1600);
if (js) {
  // Wrapped in an async IIFE: Runtime.evaluate rejects top-level `await`
  // unless replMode is set, and a SyntaxError here fails silently.
  const r = await send(
    "Runtime.evaluate",
    { expression: `(async()=>{${js}})()`, awaitPromise: true },
    sessionId,
  );
  const err = r.result?.exceptionDetails;
  if (err) {
    console.error("✗ snippet threw:", err.text, err.exception?.description ?? "");
    process.exitCode = 1;
  }
  await sleep(600);
}
const shot = await send("Page.captureScreenshot", { format: "png" }, sessionId);
writeFileSync(`${out}/${name}.png`, Buffer.from(shot.result.data, "base64"));
console.log("✓ " + name);
ws.close();
chrome.kill();
