/** Capture a viewport-sized shot at a given scroll offset. Args: url out width y */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [, , url, out, width = "1440", ys = "0"] = process.argv;
mkdirSync(out, { recursive: true });
const port = 9411;
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  "--user-data-dir=/tmp/cdp-at",
  "about:blank",
]);
async function ep() {
  for (let i = 0; i < 60; i++) {
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
    p.get(m.id)(m.result);
    p.delete(m.id);
  }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res) => {
    const i = ++id;
    p.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params, sessionId }));
  });
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: +width, height: 1000, deviceScaleFactor: 2, mobile: +width < 768 },
  sessionId,
);
await send("Page.navigate", { url }, sessionId);
await sleep(1600);
for (const y of ys.split(",")) {
  await send("Runtime.evaluate", { expression: `window.scrollTo(0,${y})` }, sessionId);
  await sleep(1300); // let scroll-reveal transitions settle before capture
  const s = await send("Page.captureScreenshot", { format: "png" }, sessionId);
  writeFileSync(`${out}/y${y}.png`, Buffer.from(s.data, "base64"));
  console.log("✓ y=" + y);
}
ws.close();
chrome.kill();
