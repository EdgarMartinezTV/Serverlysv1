/**
 * Homepage section interaction tests (CDP).
 *
 * Covers the two most interactive reconstruction sections: the native
 * exclusive-accordion automation band and the scale stepper. Drives real key
 * and pointer events and asserts observable state.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9840;
const c = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/cdp-new",
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
const ev = async (x) => {
  const r = await send(
    "Runtime.evaluate",
    { expression: `(async()=>{${x}})()`, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.text);
  return r.result?.result?.value;
};
const KEYS = { ArrowRight: [39, "ArrowRight"], Enter: [13, "Enter"] };
async function press(key) {
  const [code, k] = KEYS[key];
  const text = key === "Enter" ? "\r" : undefined;
  await send(
    "Input.dispatchKeyEvent",
    {
      type: text ? "keyDown" : "rawKeyDown",
      windowsVirtualKeyCode: code,
      key: k,
      code: k,
      ...(text ? { text, unmodifiedText: text } : {}),
    },
    sessionId,
  );
  await send(
    "Input.dispatchKeyEvent",
    { type: "keyUp", windowsVirtualKeyCode: code, key: k, code: k },
    sessionId,
  );
  await sleep(150);
}
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  sessionId,
);
await send("Page.navigate", { url: "http://localhost:3000" }, sessionId);
await sleep(2200);
let pass = 0,
  fail = 0;
const check = (n, ok, d = "") => {
  if (ok) {
    pass++;
    console.log(`  ✓ ${n}`);
  } else {
    fail++;
    console.log(`  ✗ ${n}${d ? "  — " + d : ""}`);
  }
};

console.log("\n── Automation accordion (native <details name>) ──");
check(
  "first item open by default",
  await ev(
    `const d=[...document.querySelectorAll('details[name="automation"]')];return d.length===5 && d[0].open`,
  ),
);
check(
  "opening another closes the first (exclusive)",
  await ev(`const d=[...document.querySelectorAll('details[name="automation"]')];
    d[2].querySelector('summary').click(); await new Promise(r=>setTimeout(r,250));
    return d[2].open && !d[0].open`),
);
check(
  "summaries are keyboard focusable",
  await ev(`const s=document.querySelector('details[name="automation"] summary');
    s.focus(); return document.activeElement===s`),
);
check(
  "panel copy is in the DOM even when closed (crawlable)",
  await ev(`return document.body.textContent.includes('Certificate renewal') &&
    document.body.textContent.includes('renews on its own')`),
);

console.log("\n── Scale stepper ──");
check(
  "is a real tablist with 3 tabs",
  await ev(`const t=document.querySelector('[aria-label="Traffic scenarios"]');
    return t?.getAttribute('role')==='tablist' && t.querySelectorAll('[role="tab"]').length===3`),
);
const before = await ev(
  `return document.querySelector('#__next, body').textContent.includes('Most requests never reach')`,
);
await ev(`document.querySelectorAll('[aria-label="Traffic scenarios"] [role="tab"]')[1].click();
  await new Promise(r=>setTimeout(r,300)); return true`);
check(
  "clicking a step changes the panel copy",
  before &&
    (await ev(`return document.body.textContent.includes('Capacity follows demand')`)),
);
check(
  "chart path actually changes between steps",
  await ev(`const p1=document.querySelector('svg path[stroke="var(--color-cyan-400)"]').getAttribute('d');
    document.querySelectorAll('[aria-label="Traffic scenarios"] [role="tab"]')[2].click();
    await new Promise(r=>setTimeout(r,300));
    const p2=document.querySelector('svg path[stroke="var(--color-cyan-400)"]').getAttribute('d');
    return p1!==p2`),
);
// Click (not just focus) the first tab: with a roving tabindex and automatic
// activation, selection and focus always move together, so focusing a
// tabIndex=-1 tab while another is selected is a state a user cannot reach.
await ev(`document.querySelectorAll('[aria-label="Traffic scenarios"] [role="tab"]')[0].click();
  await new Promise(r=>setTimeout(r,250));
  document.querySelectorAll('[aria-label="Traffic scenarios"] [role="tab"]')[0].focus();
  return true`);
await press("ArrowRight");
check(
  "ArrowRight moves between steps",
  await ev(`return document.activeElement.getAttribute('aria-selected')==='true' &&
    document.activeElement.textContent.includes('A spike')`),
);
check(
  "only one tab is selected at a time",
  await ev(`return [...document.querySelectorAll('[aria-label="Traffic scenarios"] [role="tab"]')]
    .filter(t=>t.getAttribute('aria-selected')==='true').length===1`),
);

console.log("\n── Mobile 375 ──");
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: 375, height: 800, deviceScaleFactor: 1, mobile: true },
  sessionId,
);
await send("Page.navigate", { url: "http://localhost:3000" }, sessionId);
await sleep(2200);
check(
  "no page-level horizontal overflow",
  await ev(
    `return document.documentElement.scrollWidth <= document.documentElement.clientWidth+1`,
  ),
);
check(
  "stepper buttons meet 44px touch target",
  await ev(`const b=[...document.querySelectorAll('[aria-label="Traffic scenarios"] [role="tab"]')];
    return b.length===3 && b.every(x=>x.getBoundingClientRect().height>=44)`),
);
console.log(
  `\n${fail === 0 ? "✓ ALL PASS" : "✗ FAILURES"} — ${pass} passed, ${fail} failed\n`,
);
ws.close();
c.kill();
process.exit(fail === 0 ? 0 : 1);
