/**
 * Whole-site responsive sweep (CDP).
 *
 * Every indexable route, at every breakpoint that matters, asserting the two
 * failures that actually break a page on a real device:
 *
 *   1. horizontal overflow — the page scrolls sideways, which on a phone means
 *      content is unreachable and the layout jitters under the thumb;
 *   2. sub-24px tap targets — WCAG 2.5.8, and the reason a link is impossible
 *      to hit on a touch screen.
 *
 * One viewport is set per width and every route is walked at that width, rather
 * than re-emulating per page: the device-metrics override is the slow call.
 *
 * Run against a PRODUCTION build. The dev server compiles routes on first hit,
 * so the first visit to each page measures the compiler, not the layout.
 *
 * Usage: node scripts/test-responsive.mjs [url]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const base = process.argv[2] ?? "http://localhost:3200";

// 320 is the narrowest phone still in use (SE 1st gen, Fold cover screen);
// 430 is the widest current iPhone; 834/1024 are iPad portrait/landscape.
const WIDTHS = [320, 375, 390, 430, 768, 834, 1024, 1280, 1440];

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .sort();

const port = 9700 + (Math.floor(process.uptime() * 1000) % 90);
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=/tmp/cdp-resp-${port}`,
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

const ws = new WebSocket(await endpoint());
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

let id = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result ?? {});
    pending.delete(m.id);
  }
};
/*
 * Every CDP call is bounded. Without this the sweep hangs FOREVER on a single
 * unanswered command: it prints one line per width, so a stall in the first
 * width's 46 navigations produced no output at all and looked like a slow run
 * rather than a dead one. A timeout turns that into a named failure.
 */
const CDP_TIMEOUT_MS = 15000;
const send = (method, params = {}, sessionId) =>
  new Promise((res, rej) => {
    const i = ++id;
    const timer = setTimeout(() => {
      pending.delete(i);
      rej(new Error(`CDP timeout after ${CDP_TIMEOUT_MS}ms: ${method}`));
    }, CDP_TIMEOUT_MS);
    pending.set(i, (v) => { clearTimeout(timer); res(v); });
    ws.send(JSON.stringify({ id: i, method, params, sessionId }));
  });

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);

const evaluate = async (expression) => {
  const r = await send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  return r?.result?.value;
};

// Reduced motion so scroll-reveal never leaves a band measured while hidden.
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
}, sessionId);

const PROBE = `(() => {
  const vw = document.documentElement.clientWidth;
  const scrollWidth = Math.round(document.documentElement.scrollWidth);
  const culprits = [];
  if (scrollWidth > vw + 1) {
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > vw + 1 || r.left < -1) {
        // Ignore anything inside a deliberate horizontal scroller.
        let p = el.parentElement, inScroller = false;
        while (p) {
          const ox = getComputedStyle(p).overflowX;
          if (ox === "auto" || ox === "scroll") { inScroller = true; break; }
          p = p.parentElement;
        }
        if (!inScroller) culprits.push(el.tagName.toLowerCase() + "." + (el.className.toString().split(" ")[0] || "") + " → " + Math.round(r.right));
      }
    }
  }
  const small = [];
  for (const el of document.querySelectorAll("a[href], button:not([disabled]), input, select, textarea, summary")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") continue;
    // Visually-hidden by construction, not a missed tap target: the sr-only
    // skip link and the real <input> inside a styled Choice both collapse to
    // 1x1 with a clip. They are reached by focus or by their label, never by a
    // tap on themselves, so measuring them reports 47 phantom failures a page.
    if (r.width <= 2 && r.height <= 2) continue;
    const label = el.closest("label");
    if (label && label !== el) {
      const lr = label.getBoundingClientRect();
      if (lr.height >= 24 && lr.width >= 24) continue;
    }
    // WCAG 2.5.8 exempts a target that is "in a sentence or its size is
    // otherwise constrained by the line-height of non-target text".
    //
    // The old test for that was "the parent holds at least 12 more characters
    // than the link" — an arbitrary margin that misread real prose. The legal
    // pages end with "Write to support@serverlys.com." : nine characters of
    // lead-in plus a full stop, ten in total, so a plainly inline link in a
    // plainly ordinary sentence was reported as a 21px tap target on five
    // pages at all nine widths — 45 of the sweep's 45 findings, all false.
    //
    // What the exemption actually turns on is whether the target sits among
    // other text in its block, not how much of it there is.
    const parent = el.parentElement;
    const surrounding = parent
      ? parent.textContent.replace(el.textContent || "", "").trim()
      : "";
    const inline =
      parent &&
      getComputedStyle(el).display.startsWith("inline") &&
      surrounding.length > 0;
    if (!inline && (r.height < 24 || r.width < 24)) {
      small.push((el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 28) + " " + Math.round(r.width) + "x" + Math.round(r.height));
    }
  }
  return { vw, scrollWidth, culprits: culprits.slice(0, 4), small: [...new Set(small)].slice(0, 4) };
})()`;

const failures = [];
for (const width of WIDTHS) {
  await send(
    "Emulation.setDeviceMetricsOverride",
    { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 },
    sessionId,
  );
  let bad = 0;
  for (const route of routes) {
    await send("Page.navigate", { url: base + route }, sessionId);
    // 320ms measured pages mid-hydration and reported transient sizes — a
    // 20x40 button on /seo that does not exist once layout settles. Boxes must
    // be measured after the page has stopped moving, or the sweep reports
    // ghosts and real failures get ignored alongside them.
    await sleep(650);
    const r = await evaluate(PROBE);
    if (!r) continue;
    if (r.scrollWidth > r.vw + 1) {
      failures.push(`${width}px ${route} — overflow ${r.scrollWidth}>${r.vw} ${r.culprits.join(" ")}`);
      bad++;
    }
    if (r.small.length) {
      failures.push(`${width}px ${route} — small targets: ${r.small.join(", ")}`);
      bad++;
    }
  }
  console.log(`${bad === 0 ? "  ok  " : " FAIL "} ${width}px — ${routes.length} routes${bad ? ` · ${bad} problem(s)` : ""}`);
}

if (failures.length) {
  console.log(`\n${failures.length} problem(s):`);
  for (const f of failures.slice(0, 40)) console.log("  " + f);
} else {
  console.log(`\n✓ ${routes.length} routes × ${WIDTHS.length} widths — no overflow, no sub-24px targets`);
}

ws.close();
chrome.kill();
process.exit(failures.length ? 1 : 0);
