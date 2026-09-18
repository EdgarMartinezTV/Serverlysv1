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
/**
 * Capture as a reduced-motion user sees it.
 *
 * Scroll-reveal is gated behind `prefers-reduced-motion: no-preference`, so
 * under `reduce` the hidden initial state does not exist at all and every
 * section renders regardless of whether an IntersectionObserver ever fired.
 * The scroll walk below is best-effort — observer callbacks are coalesced
 * during a fast programmatic scroll, so on a very tall page some reveals are
 * missed and the shot shows empty bands that are not empty in a real browser.
 * Use this flag when you are auditing LAYOUT rather than entrance animation.
 */
const reduced = process.argv.includes("--reduced");
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
await send("Runtime.enable", {}, sessionId);

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
  if (reduced) {
    await send(
      "Emulation.setEmulatedMedia",
      { features: [{ name: "prefers-reduced-motion", value: "reduce" }] },
      sessionId,
    );
  }
  await send("Page.navigate", { url }, sessionId);
  await sleep(1400);

  // Full-page capture does not scroll, so IntersectionObserver-driven reveals
  // never fire and every below-fold section renders at opacity 0. Walk the
  // page first to trigger them, then return to the top before capturing.
  if (full) {
    await send(
      "Runtime.evaluate",
      {
        expression: `(async () => {
          const step = window.innerHeight * 0.8;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 90));
          }
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 500));
        })()`,
        awaitPromise: true,
      },
      sessionId,
    );
  }

  /*
   * Grow the VIEWPORT to the page instead of asking for a capture beyond it.
   *
   * `captureBeyondViewport: true` re-lays the page out for the capture, and
   * when media emulation is active it does so against the real headless window
   * rather than the metrics override — so every `--reduced` shot came back
   * rendered at the BASE breakpoint. No md:, no xl:, every responsive layout
   * collapsed to its narrowest form at every width requested. The DOM was
   * correct throughout; only the image was wrong, which is the worst way for
   * this to fail: the tool used to audit layout was silently reporting a
   * layout the browser never showed anyone.
   *
   * Overriding the height instead keeps one real viewport at one real width,
   * so the capture is of the page as rendered. The cap is Chrome's texture
   * limit — beyond it the capture comes back blank rather than truncated.
   */
  if (full) {
    const h = await send(
      "Runtime.evaluate",
      { expression: "document.documentElement.scrollHeight", returnByValue: true },
      sessionId,
    );
    const pageHeight = Math.min(Math.ceil(h.result?.value ?? 1000), 16000);
    await send(
      "Emulation.setDeviceMetricsOverride",
      { width, height: pageHeight, deviceScaleFactor: 2, mobile: width < 768 },
      sessionId,
    );
    if (reduced) {
      await send(
        "Emulation.setEmulatedMedia",
        { features: [{ name: "prefers-reduced-motion", value: "reduce" }] },
        sessionId,
      );
    }
    await sleep(300);
  }

  const shot = await send("Page.captureScreenshot", { format: "png" }, sessionId);
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
