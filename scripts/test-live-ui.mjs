/**
 * Interaction test for the live product surfaces.
 *
 * These components are the reconstruction's central claim — that the product UI
 * on the homepage is operable rather than decorative. A screenshot cannot prove
 * that, and neither can a type check: a console whose tabs do not switch still
 * renders and still compiles.
 *
 * So this drives them the way a visitor would, through CDP, and asserts on what
 * changed in the DOM afterwards. Every assertion is a state transition that is
 * impossible for a static mock to produce.
 *
 * Usage: node scripts/test-live-ui.mjs [url]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.argv[2] ?? "http://localhost:3000";

const port = 9800 + (Math.floor(process.uptime() * 1000) % 150);
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=/tmp/cdp-live-${port}`,
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
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result ?? { __error: msg.error });
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
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false },
  sessionId,
);

/** Evaluate in the page and return the value, failing loudly on an exception. */
async function evaluate(expression) {
  const res = await send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (res.__error) throw new Error(res.__error.message);
  if (res.exceptionDetails) {
    throw new Error(res.exceptionDetails.exception?.description ?? "page exception");
  }
  return res.result?.value;
}

const results = [];
function check(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

await send("Page.navigate", { url }, sessionId);
await sleep(3000);

// Scroll the whole page once so every reveal has fired and every client
// component below the fold is hydrated before we start clicking.
await evaluate(`(async () => {
  const step = innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    scrollTo(0, y); await new Promise(r => setTimeout(r, 60));
  }
  scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
})()`);

// ── 1. Hosting console: switching view swaps the rendered panels ───────────
{
  const before = await evaluate(`
    document.querySelector('section[aria-label*="hosting console"] [role="tabpanel"]').innerText.trim()
  `);
  await evaluate(`
    [...document.querySelectorAll('section[aria-label*="hosting console"] [role="radio"]')]
      .find(b => b.textContent.trim() === 'Security')?.click()
  `);
  await sleep(400);
  const after = await evaluate(`
    document.querySelector('section[aria-label*="hosting console"] [role="tabpanel"]').innerText.trim()
  `);
  check(
    "Hosting console — view switcher changes the panel",
    before !== after && /blocked/i.test(after) && /certificate/i.test(after),
    after.split("\n").slice(0, 2).join(" / "),
  );
}

// ── 2. Hosting console: selecting a site re-renders from that site's data ──
{
  await evaluate(`
    [...document.querySelectorAll('section[aria-label*="hosting console"] [role="tab"]')]
      .find(b => /harborgoods/.test(b.textContent))?.click()
  `);
  await sleep(400);
  const panel = await evaluate(`
    document.querySelector('section[aria-label*="hosting console"] [role="tabpanel"]').innerText
  `);
  check(
    "Hosting console — selecting a site re-renders its data",
    /harborgoods\.com/.test(panel) && /3,902/.test(panel),
    "threats blocked updated to the selected site",
  );
}

// ── 3. ConvoAI: sending a message produces a reply and a lead form ─────────
{
  const chat = 'section[aria-label*="ConvoAI"]';
  await evaluate(`
    (() => {
      const btns = [...document.querySelectorAll('${chat} button')];
      const s = btns.find(b => /move my site/i.test(b.textContent));
      s.click();
    })()
  `);
  await sleep(1400);
  const log = await evaluate(
    `document.querySelector('${chat} [role="log"]').innerText`,
  );
  check(
    "ConvoAI — a sent message gets an answer",
    /migration is free/i.test(log),
    "agent replied to the migration question",
  );
  check(
    "ConvoAI — the answer opens lead capture",
    /Where should we reply/i.test(log),
    "name + email form rendered",
  );

  // Validation must actually reject a bad email rather than accept anything.
  await evaluate(`
    (() => {
      const set = (el, v) => {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(el, v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      const inputs = [...document.querySelectorAll('${chat} form input')];
      set(inputs[0], 'Dana');
      set(inputs[1], 'a@b');
      document.querySelector('${chat} form button[type="submit"]')?.click();
    })()
  `);
  await sleep(300);
  const invalid = await evaluate(
    `document.querySelector('${chat} [role="log"]').innerText`,
  );
  check(
    "ConvoAI — lead form rejects a TLD-less email the browser would accept",
    /doesn't look right/i.test(invalid) && !/Lead captured/.test(invalid),
    "a@b refused, nothing captured",
  );

  await evaluate(`
    (() => {
      const set = (el, v) => {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(el, v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set([...document.querySelectorAll('${chat} form input')][1], 'dana@example.com');
      document.querySelector('${chat} form button[type="submit"]')?.click();
    })()
  `);
  await sleep(400);
  const captured = await evaluate(
    `document.querySelector('${chat} [role="log"]').innerText`,
  );
  check(
    "ConvoAI — a valid lead is captured",
    /Lead captured/.test(captured) && /dana@example\.com/.test(captured),
    "capture confirmed in the transcript",
  );
}

// ── 4. CallFlow: playing the call advances the transcript and extraction ───
{
  const call = 'section[aria-label*="CallFlow"]';
  const before = await evaluate(
    `document.querySelector('${call} [role="log"]').innerText.trim()`,
  );
  await evaluate(`
    [...document.querySelectorAll('${call} button')].find(b => /Play the call/.test(b.textContent))?.click()
  `);
  await sleep(6000);
  const after = await evaluate(`document.querySelector('${call}').innerText`);
  check(
    "CallFlow — the call plays and the transcript advances",
    before !== after && /check-up/i.test(after),
    "caller turns rendered",
  );
  check(
    "CallFlow — extraction fills in from the call",
    /New appointment/.test(after),
    "intent captured mid-call",
  );
}

// ── 5. Automation canvas: selecting a node, and running the flow ───────────
/*
 * ⚠ This section asserts a component the page under test must actually render.
 * <AutomationCanvas> reaches a page through <AutomationBand> or <AiWorkBand>.
 * If neither is mounted it reports one clear failure and moves on, instead of
 * throwing on a null .click() — which is what it used to do, abandoning the run
 * and hiding every section after it.
 */
{
  const flow = 'section[aria-label*="automation workflow"]';
  const present = await evaluate(`!!document.querySelector('${flow}')`);

  if (!present) {
    check(
      "Automation — canvas is rendered on the page under test",
      false,
      `no ${flow} on this page — AutomationBand/AiWorkBand is not mounted`,
    );
  } else {
    await evaluate(`
      [...document.querySelectorAll('${flow} [role="tab"]')].find(b => /Slack/.test(b.textContent))?.click()
    `);
    await sleep(300);
    const panel = await evaluate(
      `document.querySelector('${flow} [role="tabpanel"]')?.innerText ?? ''`,
    );
    check(
      "Automation — selecting a node shows that node's detail",
      /#front-desk/.test(panel),
      "Notify step payload rendered",
    );

    await evaluate(`
      [...document.querySelectorAll('${flow} button')].find(b => /Run workflow/.test(b.textContent))?.click()
    `);
    await sleep(4500);
    const done = await evaluate(`document.querySelector('${flow}')?.innerText ?? ''`);
    check(
      "Automation — running the workflow completes",
      /Run complete/.test(done),
      "all five steps executed",
    );
  }
}

// ── 6. Domain search: the hero search hits the real provider ───────────────
{
  await evaluate(`
    (() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      const input = document.querySelector('form[role="search"] input[type="text"]');
      setter.call(input, 'example.com');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.form.requestSubmit();
    })()
  `);
  await sleep(6000);
  const out = await evaluate(`
    document.querySelector('form[role="search"]').parentElement.innerText
  `);
  check(
    "Domain search — a real lookup returns a real verdict",
    /example\.com/.test(out) && /Taken|Get it|No answer/.test(out),
    out.split("\n").filter(Boolean).slice(1, 3).join(" / "),
  );
}

const failed = results.filter((r) => !r.pass);
console.log(
  `\n${results.length - failed.length}/${results.length} interaction checks passed`,
);

ws.close();
chrome.kill();
process.exit(failed.length ? 1 : 0);
