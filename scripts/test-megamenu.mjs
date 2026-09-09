/**
 * Mega menu interaction tests (CDP).
 * Covers the three-zone panel: category rail, grouped content, promo panel,
 * page dimming, and the header's auxiliary controls.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.argv[2] ?? "http://localhost:3000";
const PORT = 9866;
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/cdp-mega",
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

const KEYS = {
  Tab: [9, "Tab"],
  Enter: [13, "Enter"],
  Escape: [27, "Escape"],
  ArrowDown: [40, "ArrowDown"],
  ArrowUp: [38, "ArrowUp"],
  ArrowRight: [39, "ArrowRight"],
  Home: [36, "Home"],
  End: [35, "End"],
};
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
  await sleep(140);
}
async function hover(sel, i = 0) {
  const box =
    await ev(`const el=document.querySelectorAll(${JSON.stringify(sel)})[${i}];
    if(!el)return null;const r=el.getBoundingClientRect();
    return JSON.stringify({x:r.left+r.width/2,y:r.top+r.height/2});`);
  if (!box) throw new Error("no hover target " + sel);
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
  await sleep(220);
}
const viewport = (w, m = false) =>
  send(
    "Emulation.setDeviceMetricsOverride",
    { width: w, height: 900, deviceScaleFactor: 1, mobile: m },
    sessionId,
  );
const load = async () => {
  await send("Page.navigate", { url: URL }, sessionId);
  await sleep(1900);
};
const TRIG = 'nav[aria-label="Main"] button[aria-expanded]';

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

console.log("\n── Structure ──");
await viewport(1440);
await load();
check(
  "three disclosure triggers (Pricing is a plain link)",
  await ev(`return document.querySelectorAll('${TRIG}').length===3 &&
    !!document.querySelector('[data-nav-link="Pricing"]')`),
);
await ev(
  `document.querySelectorAll('${TRIG}')[0].click(); await new Promise(r=>setTimeout(r,300)); return true`,
);
check(
  "panel has all three zones: rail, content, promo",
  await ev(`const b=document.querySelectorAll('${TRIG}')[0];
    const panel=document.getElementById(b.getAttribute('aria-controls'));
    return !!panel.querySelector('[role="tablist"][aria-orientation="vertical"]')
      && !!panel.querySelector('[role="tabpanel"]')
      && /Explore|Compare|Search|Talk|See/.test(panel.textContent);`),
);
check(
  "rail is a vertical tablist with 5 categories",
  await ev(`const t=document.querySelector('[role="tablist"][aria-orientation="vertical"]');
    return t.querySelectorAll('[role="tab"]').length===5`),
);
check(
  "items carry icon, title, description and badges",
  await ev(`const b=document.querySelectorAll('${TRIG}')[0];
    const panel=document.getElementById(b.getAttribute('aria-controls'));
    const items=[...panel.querySelectorAll('[role="tabpanel"] li')];
    const wellFormed=items.length>0 && items.every(li=>
      !!li.querySelector('svg') && li.textContent.trim().length>20);
    const convo=items.find(li=>/ConvoAI/.test(li.textContent));
    return wellFormed && !!convo
      && /Answers your customers/.test(convo.textContent)
      && /LIVE/i.test(convo.textContent);`),
);
check(
  "grouped sections have headings and a rule between them",
  await ev(`const b=document.querySelectorAll('${TRIG}')[0];
    const panel=document.getElementById(b.getAttribute('aria-controls'));
    return panel.querySelectorAll('[role="tabpanel"] section').length===2
      && /ANSWER AND AUTOMATE/i.test(panel.textContent);`),
);

console.log("\n── Category rail ──");
check(
  "first category is active",
  await ev(`const t=document.querySelectorAll('[role="tablist"][aria-orientation="vertical"] [role="tab"]');
    return t[0].getAttribute('aria-selected')==='true'`),
);
check(
  "switching category swaps content in place",
  await ev(`const t=[...document.querySelectorAll('[role="tablist"][aria-orientation="vertical"] [role="tab"]')];
    const panel=t[0].closest('[id*="-panel-"]');
    const before=panel.querySelector('[role="tabpanel"]').textContent;
    const h=panel.getBoundingClientRect().height;
    t[1].click(); await new Promise(r=>setTimeout(r,300));
    const after=panel.querySelector('[role="tabpanel"]').textContent;
    return before!==after && /Cloud hosting/.test(after);`),
);
// Scoped to the OPEN panel: all three panels exist in the DOM and each
// legitimately keeps its own selected category while hidden.
check(
  "only one category selected at a time within the open panel",
  await ev(`const panel=document.querySelector('[id*="-panel-"]:not([hidden])');
    return [...panel.querySelectorAll('[role="tab"]')]
      .filter(t=>t.getAttribute('aria-selected')==='true').length===1`),
);
check(
  "promo panel changes with the category",
  await ev(`const panel=document.querySelector('[id*="-panel-"]:not([hidden])');
    return /Year two, before you buy/.test(panel.textContent);`),
);
await ev(
  `document.querySelectorAll('[role="tablist"][aria-orientation="vertical"] [role="tab"]')[0].focus(); return true`,
);
await press("ArrowDown");
check(
  "ArrowDown moves down the rail",
  await ev(`return document.activeElement.getAttribute('aria-selected')==='true'
    && /Hosting/.test(document.activeElement.textContent)`),
);
await press("End");
check(
  "End jumps to the last category",
  await ev(`return /Email/.test(document.activeElement.textContent)`),
);

console.log("\n── Open / close ──");
await load();
await hover(TRIG, 0);
check(
  "mouse hover opens the panel",
  await ev(
    `return document.querySelectorAll('${TRIG}')[0].getAttribute('aria-expanded')==='true'`,
  ),
);
await load();
check(
  "TOUCH hover does NOT open (would double-toggle against click)",
  await ev(`const b=document.querySelectorAll('${TRIG}')[0];
    b.parentElement.dispatchEvent(new PointerEvent('pointerenter',{bubbles:false,pointerType:'touch'}));
    await new Promise(r=>setTimeout(r,120));
    return b.getAttribute('aria-expanded')==='false'`),
);
await ev(`document.querySelectorAll('${TRIG}')[0].focus(); return true`);
await press("Enter");
check(
  "Enter opens the panel",
  await ev(
    `return document.querySelectorAll('${TRIG}')[0].getAttribute('aria-expanded')==='true'`,
  ),
);
await press("Escape");
check(
  "Escape closes and restores focus to the trigger",
  await ev(`return document.querySelectorAll('${TRIG}')[0].getAttribute('aria-expanded')==='false'
    && document.activeElement===document.querySelectorAll('${TRIG}')[0]`),
);
await press("ArrowDown");
check(
  "ArrowDown opens and moves focus into the panel",
  await ev(`const b=document.querySelectorAll('${TRIG}')[0];
    const panel=document.getElementById(b.getAttribute('aria-controls'));
    return b.getAttribute('aria-expanded')==='true' && panel.contains(document.activeElement)`),
);
check(
  "only one top-level menu open at a time",
  await ev(`const t=[...document.querySelectorAll('${TRIG}')];
    t[0].click(); await new Promise(r=>setTimeout(r,150));
    t[1].click(); await new Promise(r=>setTimeout(r,200));
    return t.filter(x=>x.getAttribute('aria-expanded')==='true').length===1`),
);
check(
  "closed panels leave the tab order",
  await ev(`const panels=[...document.querySelectorAll('[id*="-panel-"]')];
    return panels.filter(p=>p.hidden).every(p=>[...p.querySelectorAll('a[href]')].every(a=>a.offsetParent===null))`),
);

console.log("\n── Backdrop / dimming ──");
await load();
await ev(
  `document.querySelectorAll('${TRIG}')[0].click(); await new Promise(r=>setTimeout(r,320)); return true`,
);
check(
  "backdrop becomes visible when a menu opens",
  await ev(`const bd=[...document.querySelectorAll('div[aria-hidden="true"]')]
      .find(d=>getComputedStyle(d).position==='fixed' && getComputedStyle(d).zIndex==='40');
    return !!bd && parseFloat(getComputedStyle(bd).opacity) > 0.5`),
);
check(
  "header sits above the backdrop",
  await ev(`return getComputedStyle(document.querySelector('header')).zIndex==='50'`),
);
check(
  "clicking the backdrop closes the menu",
  await ev(`const bd=[...document.querySelectorAll('div[aria-hidden="true"]')]
      .find(d=>getComputedStyle(d).position==='fixed' && getComputedStyle(d).zIndex==='40');
    bd.click(); await new Promise(r=>setTimeout(r,250));
    return document.querySelectorAll('${TRIG}')[0].getAttribute('aria-expanded')==='false'`),
);

console.log("\n── Header controls ──");
await load();
check(
  "language selector opens and states what is available",
  await ev(`const b=[...document.querySelectorAll('button[aria-haspopup="true"]')][0];
    b.click(); await new Promise(r=>setTimeout(r,220));
    return b.getAttribute('aria-expanded')==='true' && /only language/i.test(document.body.textContent)`),
);
check(
  "account control links to the real client area",
  await ev(`const a=[...document.querySelectorAll('header a')].find(x=>/Client login/.test(x.textContent));
    return !!a && a.getAttribute('href').includes('/billing/login')`),
);
check(
  "no dead links anywhere in the header",
  await ev(`return [...document.querySelectorAll('header a')]
    .every(a=>{const h=a.getAttribute('href'); return h && h!=='#' && h!==''});`),
);

console.log("\n── Panel bounds ──");
for (const w of [1440, 1366, 1280, 1024]) {
  await viewport(w);
  await load();
  const report = await ev(`const out=[];
    for (const b of document.querySelectorAll('${TRIG}')) {
      b.click(); await new Promise(r=>setTimeout(r,180));
      const p=document.getElementById(b.getAttribute('aria-controls'));
      const r=p.getBoundingClientRect();
      out.push({l:Math.round(r.left),r:Math.round(r.right),vw:document.documentElement.clientWidth,
        label:b.textContent.trim().split(String.fromCharCode(10))[0]});
      b.click(); await new Promise(r=>setTimeout(r,120));
    } return JSON.stringify(out);`);
  for (const b of JSON.parse(report))
    check(
      `${w}px — "${b.label}" panel within viewport`,
      b.l >= 0 && b.r <= b.vw + 1,
      `l${b.l} r${b.r} vw${b.vw}`,
    );
}

console.log("\n── Mobile 390 ──");
await viewport(390, true);
await load();
check(
  "desktop nav hidden, hamburger shown",
  await ev(`return document.querySelector('nav[aria-label="Main"]').offsetParent===null
    && document.querySelector('[aria-controls="mobile-nav-panel"]').offsetParent!==null`),
);
await ev(
  `document.querySelector('[aria-controls="mobile-nav-panel"]').click(); await new Promise(r=>setTimeout(r,320)); return true`,
);
check(
  "drawer is a modal dialog covering the viewport",
  await ev(`const d=document.querySelector('[role="dialog"]');const r=d.getBoundingClientRect();
    return d.getAttribute('aria-modal')==='true' && Math.round(r.height)===window.innerHeight`),
);
check(
  "drawer has its own close button and logo",
  await ev(`return !!document.querySelector('[aria-label="Close menu"]') &&
    !!document.querySelector('#mobile-nav-panel a[aria-label*="home"]')`),
);
check(
  "expanding a section reveals nested categories and items",
  await ev(`const b=document.querySelector('#mobile-nav-panel button[aria-controls^="mnav-"]');
    b.click(); await new Promise(r=>setTimeout(r,420));
    const s=document.getElementById(b.getAttribute('aria-controls'));
    return b.getAttribute('aria-expanded')==='true' && !s.hasAttribute('inert')
      && /AI and automation/.test(s.textContent) && /ConvoAI/.test(s.textContent);`),
);
check(
  "drawer shows CTA, login and language",
  await ev(`const t=document.querySelector('#mobile-nav-panel').textContent;
    return /Get started/.test(t) && /Client login/.test(t) && /English/.test(t)`),
);
check(
  "no horizontal overflow on mobile",
  await ev(
    `return document.documentElement.scrollWidth<=document.documentElement.clientWidth+1`,
  ),
);

console.log(
  `\n${fail === 0 ? "✓ ALL PASS" : "✗ FAILURES"} — ${pass} passed, ${fail} failed\n`,
);
ws.close();
chrome.kill();
process.exit(fail === 0 ? 0 : 1);
