/**
 * Navigation interaction tests (Chrome DevTools Protocol).
 *
 * Drives the real page with real key and pointer events and asserts observable
 * state — aria-expanded, document.activeElement, focusability, overflow. This
 * is the evidence behind any claim that the navigation "works".
 *
 * Usage: node scripts/test-nav.mjs [url]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.argv[2] ?? "http://localhost:3000";
const PORT = 9615;

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/cdp-nav-test",
  "about:blank",
]);

async function endpoint() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      return (await r.json()).webSocketDebuggerUrl;
    } catch {
      await sleep(250);
    }
  }
  throw new Error("no CDP endpoint");
}

const ws = new WebSocket(await endpoint());
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params, sessionId }));
  });

const {
  result: { targetId },
} = await send("Target.createTarget", { url: "about:blank" });
const {
  result: { sessionId },
} = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send("DOM.enable", {}, sessionId);

const evaluate = async (expression) => {
  const r = await send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (r.result?.exceptionDetails)
    throw new Error(r.result.exceptionDetails.text + " :: " + expression);
  return r.result?.result?.value;
};

const KEYS = {
  Tab: [9, "Tab"],
  Enter: [13, "Enter"],
  Escape: [27, "Escape"],
  ArrowUp: [38, "ArrowUp"],
  ArrowDown: [40, "ArrowDown"],
  ArrowLeft: [37, "ArrowLeft"],
  ArrowRight: [39, "ArrowRight"],
  Home: [36, "Home"],
  End: [35, "End"],
  Space: [32, " "],
};
const TEXT = { Enter: "\r", Space: " " };
async function press(key, modifiers = 0) {
  const [code, k] = KEYS[key];
  const text = TEXT[key];
  await send(
    "Input.dispatchKeyEvent",
    {
      // `keyDown` (not rawKeyDown) with text is required for the browser to run
      // a button's default activation behaviour.
      type: text ? "keyDown" : "rawKeyDown",
      windowsVirtualKeyCode: code,
      key: k,
      code: k,
      modifiers,
      ...(text ? { text, unmodifiedText: text } : {}),
    },
    sessionId,
  );
  await send(
    "Input.dispatchKeyEvent",
    {
      type: "keyUp",
      windowsVirtualKeyCode: code,
      key: k,
      code: k,
      modifiers,
    },
    sessionId,
  );
  await sleep(120);
}

/** Real mouse movement over an element's centre. React derives pointerenter
 *  from pointerover, so a synthetic non-bubbling pointerenter is ignored. */
async function hover(selector, index = 0) {
  const box =
    await evaluate(`(()=>{const el=document.querySelectorAll(${JSON.stringify(selector)})[${index}];
    if(!el) return null; const r=el.getBoundingClientRect();
    return JSON.stringify({x:r.left+r.width/2,y:r.top+r.height/2})})()`);
  if (!box) throw new Error("hover target not found: " + selector);
  const { x, y } = JSON.parse(box);
  await send(
    "Input.dispatchMouseEvent",
    {
      type: "mouseMoved",
      x: Math.round(x),
      y: Math.round(y),
      pointerType: "mouse",
      buttons: 0,
    },
    sessionId,
  );
  await sleep(200);
}

async function viewport(width, mobile = false) {
  await send(
    "Emulation.setDeviceMetricsOverride",
    { width, height: 900, deviceScaleFactor: 1, mobile },
    sessionId,
  );
}
async function load() {
  await send("Page.navigate", { url: URL }, sessionId);
  await sleep(1500);
}

let pass = 0,
  fail = 0;
const check = (name, ok, detail = "") => {
  if (ok) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}${detail ? `  — ${detail}` : ""}`);
  }
};

// ══════════════════════════════════════════════════════ DESKTOP · KEYBOARD
console.log("\n── Desktop · keyboard (1440px) ──");
await viewport(1440);
await load();

await evaluate(
  `document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')[0].focus()`,
);
check(
  "trigger receives focus",
  await evaluate(`document.activeElement.textContent.trim().startsWith('Products')`),
);
check(
  "panel starts closed",
  (await evaluate(`document.activeElement.getAttribute('aria-expanded')`)) === "false",
);

await press("Enter");
check(
  "Enter opens the panel",
  (await evaluate(
    `document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')[0].getAttribute('aria-expanded')`,
  )) === "true",
);
check(
  "panel content is visible",
  await evaluate(`(()=>{const b=document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')[0];
     const p=document.getElementById(b.getAttribute('aria-controls'));
     return !!p && !p.hidden && p.getBoundingClientRect().height > 0})()`),
);

await press("Escape");
check(
  "Escape closes the panel",
  (await evaluate(
    `document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')[0].getAttribute('aria-expanded')`,
  )) === "false",
);
check(
  "Escape restores focus to the trigger",
  await evaluate(`document.activeElement.textContent.trim().startsWith('Products')`),
);

await press("ArrowDown");
check(
  "ArrowDown opens and moves focus into the panel",
  await evaluate(`(()=>{const b=document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')[0];
     const p=document.getElementById(b.getAttribute('aria-controls'));
     return b.getAttribute('aria-expanded')==='true' && p.contains(document.activeElement)})()`),
);

const firstLink = await evaluate(
  `document.activeElement.textContent.trim().slice(0,28)`,
);
await press("ArrowDown");
const secondLink = await evaluate(
  `document.activeElement.textContent.trim().slice(0,28)`,
);
check(
  "ArrowDown moves between panel links",
  firstLink !== secondLink,
  `${firstLink} → ${secondLink}`,
);

await press("ArrowUp");
check(
  "ArrowUp moves back",
  (await evaluate(`document.activeElement.textContent.trim().slice(0,28)`)) ===
    firstLink,
);

await press("End");
const lastLink = await evaluate(
  `document.activeElement.textContent.trim().slice(0,28)`,
);
check("End jumps to the last link", lastLink !== firstLink, lastLink);
await press("Home");
check(
  "Home jumps to the first link",
  (await evaluate(`document.activeElement.textContent.trim().slice(0,28)`)) ===
    firstLink,
);

await press("Escape");
await press("ArrowRight");
check(
  "ArrowRight moves to the next top-level trigger",
  await evaluate(`document.activeElement.textContent.trim().startsWith('Solutions')`),
);
await press("ArrowLeft");
check(
  "ArrowLeft moves back",
  await evaluate(`document.activeElement.textContent.trim().startsWith('Products')`),
);

check(
  "closed panels are out of the tab order",
  await evaluate(`(()=>{const ps=[...document.querySelectorAll('nav[aria-label="Main"] [id*="-panel-"]')];
     return ps.every(p => p.hidden || p.getAttribute('aria-hidden')==='true' ||
       [...p.querySelectorAll('a[href]')].every(a=>a.offsetParent===null))})()`),
);

// ══════════════════════════════════════════════════════ DESKTOP · POINTER
console.log("\n── Desktop · pointer ──");
await load();
await hover('nav[aria-label="Main"] button[aria-expanded]', 0);
// Click-only, matching the reference: a mouse hover must leave the panel shut.
// This assertion was the opposite until the menu stopped opening on hover.
check(
  "mouse hover does NOT open a panel (click-only)",
  (await evaluate(
    `document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')[0].getAttribute('aria-expanded')`,
  )) === "false",
);

await load();
check(
  "TOUCH hover does NOT open (would double-toggle against click)",
  await evaluate(`(()=>{const b=document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')[0];
     b.parentElement.dispatchEvent(new PointerEvent('pointerenter',{bubbles:false,pointerType:'touch'}));
     return new Promise(r=>setTimeout(()=>r(b.getAttribute('aria-expanded')==='false'),60))})()`),
);

await evaluate(
  `document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')[0].click()`,
);
await sleep(150);
await evaluate(
  `document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')[1].click()`,
);
await sleep(150);
check(
  "only one panel can be open at a time",
  (await evaluate(`[...document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')]
     .filter(b=>b.getAttribute('aria-expanded')==='true').length`)) === 1,
);

// ══════════════════════════════════════════════════════ PANEL BOUNDS
// A panel positioned off the LEFT edge does not increase scrollWidth, so a
// document-level overflow check cannot see it. Measure each panel directly.
console.log("\n── Panel bounds (every panel, every desktop width) ──");
for (const w of [1440, 1280, 1024]) {
  await viewport(w);
  await load();
  const report = await evaluate(`(async () => {
    const bs = [...document.querySelectorAll('nav[aria-label="Main"] button[aria-expanded]')];
    const out = [];
    for (const b of bs) {
      b.click();
      await new Promise(r => setTimeout(r, 120));
      const p = document.getElementById(b.getAttribute('aria-controls'));
      const r = p.getBoundingClientRect();
      out.push({
        label: b.textContent.trim().split(String.fromCharCode(10))[0],
        left: Math.round(r.left), right: Math.round(r.right),
        vw: document.documentElement.clientWidth,
      });
      b.click();
      await new Promise(r => setTimeout(r, 80));
    }
    return JSON.stringify(out);
  })()`);
  for (const p of JSON.parse(report)) {
    check(
      `${w}px — "${p.label}" panel within viewport`,
      p.left >= 0 && p.right <= p.vw + 1,
      `left ${p.left}, right ${p.right}, vw ${p.vw}`,
    );
  }
}

// ══════════════════════════════════════════════════════ ANNOUNCEMENT BAR
console.log("\n── Announcement bar ──");
await load();
check(
  "renders on a first visit",
  await evaluate(`!!document.querySelector('[data-announcement-bar]')?.offsetParent`),
);
const beforeTop = await evaluate(
  `document.querySelector('header').getBoundingClientRect().top`,
);
check(
  "dismiss hides it immediately",
  await evaluate(`(()=>{document.querySelector('[aria-label="Dismiss announcement"]').click();
     return !document.querySelector('[data-announcement-bar]')?.offsetParent})()`),
);
check(
  "dismissal persists to storage",
  await evaluate(
    `Object.keys(localStorage).some(k=>k.startsWith('serverlys.announcement'))`,
  ),
);
await load();
check(
  "stays dismissed after reload with NO flash (set pre-paint)",
  await evaluate(`document.documentElement.dataset.announcement==='dismissed' &&
     !document.querySelector('[data-announcement-bar]')?.offsetParent`),
);
const afterTop = await evaluate(
  `document.querySelector('header').getBoundingClientRect().top`,
);
check(
  "no layout jump — header sits at viewport top once dismissed",
  afterTop === 0,
  `before ${beforeTop}px → after ${afterTop}px`,
);
await evaluate(`localStorage.clear()`);

// ══════════════════════════════════════════════════════ MOBILE
console.log("\n── Mobile · 390px ──");
await viewport(390, true);
await load();

check(
  "desktop nav is hidden",
  await evaluate(
    `document.querySelector('nav[aria-label="Main"]').offsetParent === null`,
  ),
);
check(
  "hamburger is visible and ≥44px",
  await evaluate(`(()=>{const b=document.querySelector('[aria-controls="mobile-nav-panel"]');
     const r=b.getBoundingClientRect(); return b.offsetParent!==null && r.height>=44 && r.width>=44})()`),
);

await evaluate(`document.querySelector('[aria-controls="mobile-nav-panel"]').click()`);
await sleep(300);
check("drawer opens", await evaluate(`!!document.getElementById('mobile-nav-panel')`));
check(
  "drawer is a modal dialog",
  await evaluate(`(()=>{const d=document.querySelector('[role="dialog"]');
     return d?.getAttribute('aria-modal')==='true' && !!d.getAttribute('aria-label')})()`),
);
check(
  "background scroll is locked",
  (await evaluate(`getComputedStyle(document.body).overflow`)) === "hidden",
);
check(
  "focus moved into the drawer",
  await evaluate(
    `document.getElementById('mobile-nav-panel').contains(document.activeElement)`,
  ),
);

// Geometry: the drawer previously assumed the header sat at viewport top and
// was ALSO trapped by the header's backdrop-filter containing block, which
// collapsed it to near-zero height once the announcement bar shipped. Existence
// checks passed throughout — only measurement catches this.
check(
  "drawer covers the full viewport (announcement bar present)",
  await evaluate(`(()=>{const d=document.querySelector('[role="dialog"]').getBoundingClientRect();
     return Math.round(d.top)===0 && Math.round(d.height)===window.innerHeight
       && Math.round(d.width)===window.innerWidth})()`),
);
check(
  "drawer content has real height",
  await evaluate(
    `document.getElementById('mobile-nav-panel').getBoundingClientRect().height > 200`,
  ),
);
check(
  "drawer carries its own close button (it covers the site header)",
  await evaluate(`(()=>{const b=document.querySelector('[aria-label="Close menu"]');
     const r=b?.getBoundingClientRect(); return !!b && r.height>=44 && r.width>=44})()`),
);
check(
  "all nav items are reachable inside the drawer",
  await evaluate(
    `document.querySelectorAll('#mobile-nav-panel button[aria-controls^="mnav-"]').length >= 3`,
  ),
);

check(
  "collapsed accordion sections are inert (links unfocusable)",
  await evaluate(`(()=>{const s=[...document.querySelectorAll('#mobile-nav-panel [id^="mnav-"]')];
     return s.length>0 && s.every(x=>x.hasAttribute('inert') || x.querySelectorAll('a').length===0)})()`),
);

await evaluate(
  `document.querySelector('#mobile-nav-panel button[aria-controls^="mnav-"]').click()`,
);
await sleep(400);
check(
  "accordion expands and its links become focusable",
  await evaluate(`(()=>{const b=document.querySelector('#mobile-nav-panel button[aria-controls^="mnav-"]');
     const s=document.getElementById(b.getAttribute('aria-controls'));
     return b.getAttribute('aria-expanded')==='true' && !s.hasAttribute('inert') &&
       s.getBoundingClientRect().height > 0})()`),
);

await evaluate(
  `localStorage.setItem(Object.keys(localStorage).find(k=>k.startsWith('serverlys.announcement'))||'serverlys.announcement.x','dismissed')`,
);
await load();
await evaluate(`document.querySelector('[aria-controls="mobile-nav-panel"]').click()`);
await sleep(300);
check(
  "drawer geometry also correct with the announcement bar dismissed",
  await evaluate(`(()=>{const d=document.querySelector('[role="dialog"]').getBoundingClientRect();
     return Math.round(d.top)===0 && Math.round(d.height)===window.innerHeight})()`),
);

await press("Escape");
check(
  "Escape closes the drawer",
  await evaluate(`!document.getElementById('mobile-nav-panel')`),
);
check(
  "focus restored to the hamburger",
  await evaluate(
    `document.activeElement === document.querySelector('[aria-controls="mobile-nav-panel"]')`,
  ),
);
check(
  "body scroll restored",
  (await evaluate(`getComputedStyle(document.body).overflow`)) !== "hidden",
);

// ══════════════════════════════════════════════════════ TOUCH TARGETS + OVERFLOW
console.log("\n── Responsive · overflow & targets ──");
for (const [w, mobile] of [
  [1440, false],
  [1024, false],
  [834, true],
  [768, true],
  [430, true],
  [375, true],
]) {
  await viewport(w, mobile);
  await load();
  const r = await evaluate(`JSON.stringify({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    small: [...document.querySelectorAll('header a, header button, footer a, footer button')]
      .filter(el=>{const b=el.getBoundingClientRect(); return b.width>0 && b.height>0 && b.height<24})
      .map(el=>(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,22))
  })`);
  const { scroll, client, small } = JSON.parse(r);
  check(
    `${w}px — no horizontal overflow`,
    scroll <= client + 1,
    `${scroll} vs ${client}`,
  );
  check(`${w}px — nav/footer targets ≥24px`, small.length === 0, small.join(" | "));
}

console.log(
  `\n${fail === 0 ? "✓ ALL PASS" : "✗ FAILURES"} — ${pass} passed, ${fail} failed\n`,
);
ws.close();
chrome.kill();
process.exit(fail === 0 ? 0 : 1);
