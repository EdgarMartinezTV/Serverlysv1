/**
 * Responsive screenshot tool (Chrome DevTools Protocol).
 *
 * Chrome's --window-size clamps the viewport to ~500px minimum, so it cannot
 * render true phone widths. This drives Emulation.setDeviceMetricsOverride
 * instead, which sets the real CSS viewport at any width, and captures
 * full-page images with captureBeyondViewport.
 *
 * Usage: node scripts/shoot.mjs <url> <outDir> [width,width,...] [--full]
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [, , url = "http://localhost:3000", outDir = "shots", widthsArg] = process.argv;
const full = process.argv.includes("--full");
const widths = (
  widthsArg && !widthsArg.startsWith("--")
    ? widthsArg
    : "1440,1280,1024,834,768,640,430,390,375"
)
  .split(",")
  .map(Number);

mkdirSync(outDir, { recursive: true });

const port = 9222 + (Math.floor(process.uptime() * 1000) % 500);
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  "--user-data-dir=/tmp/cdp-shoot-profile",
  "about:blank",
]);

async function endpoint() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      return (await r.json()).webSocketDebuggerUrl;
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Chrome did not expose a debugging endpoint");
}

const wsUrl = await endpoint();
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

let id = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params, sessionId }));
  });

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", {
  targetId,
  flatten: true,
});

await send("Page.enable", {}, sessionId);

for (const width of widths) {
  await send(
    "Emulation.setDeviceMetricsOverride",
    {
      width,
      height: 1000,
      deviceScaleFactor: 2,
      mobile: width < 768,
    },
    sessionId,
  );
  await send("Page.navigate", { url }, sessionId);
  await sleep(1400);

  const shot = await send(
    "Page.captureScreenshot",
    { format: "png", captureBeyondViewport: full },
    sessionId,
  );
  writeFileSync(`${outDir}/w${width}.png`, Buffer.from(shot.data, "base64"));
  console.log(`✓ ${width}px`);
}

/** Report any element wider than the viewport — the horizontal-scroll check. */
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: 375, height: 1000, deviceScaleFactor: 1, mobile: true },
  sessionId,
);
await send("Page.navigate", { url }, sessionId);
await sleep(1400);
await send("Runtime.enable", {}, sessionId);
const probe = await send(
  "Runtime.evaluate",
  {
    expression: `(() => {
      const vw = document.documentElement.clientWidth;
      const bad = [...document.querySelectorAll('*')]
        .filter(el => el.getBoundingClientRect().right > vw + 1)
        .slice(0, 12)
        .map(el => el.tagName.toLowerCase() +
          (el.className && typeof el.className === 'string'
            ? '.' + el.className.split(' ').slice(0,3).join('.') : '') +
          ' → ' + Math.round(el.getBoundingClientRect().right) + 'px');
      return JSON.stringify({
        viewport: vw,
        scrollWidth: document.documentElement.scrollWidth,
        overflowing: bad
      }, null, 2);
    })()`,
    returnByValue: true,
  },
  sessionId,
);
console.log("\n── overflow probe @375 ──");
console.log(probe.result.value);

ws.close();
chrome.kill();
