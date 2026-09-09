/** Structural accessibility probe over the live dev server. */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.argv[2] ?? "http://localhost:3000";
const port = 9500;
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  "--user-data-dir=/tmp/cdp-a11y",
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
const send = (m, params = {}, s) =>
  new Promise((r) => {
    const i = ++id;
    p.set(i, r);
    ws.send(JSON.stringify({ id: i, method: m, params, sessionId: s }));
  });
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false },
  sessionId,
);
await send("Page.navigate", { url }, sessionId);
await sleep(1800);
const res = await send(
  "Runtime.evaluate",
  {
    returnByValue: true,
    expression: `(() => {
  const out={};
  out.headings=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .map(h=>h.tagName+': '+h.textContent.trim().slice(0,58));
  const lv=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h=>+h.tagName[1]);
  out.headingSkips=lv.map((l,i)=>i&&l-lv[i-1]>1?\`\${lv[i-1]}→\${l}\`:null).filter(Boolean);
  out.h1Count=document.querySelectorAll('h1').length;
  out.imgsNoAlt=[...document.images].filter(i=>!i.hasAttribute('alt')).map(i=>i.src);
  out.namelessControls=[...document.querySelectorAll('a,button')].filter(el=>{
    const t=(el.innerText||'').trim();
    return !t && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.querySelector('img[alt]:not([alt=""])');
  }).map(el=>el.tagName+'.'+String(el.className).split(' ').slice(0,2).join('.'));
  out.landmarks={header:document.querySelectorAll('header').length,
    nav:document.querySelectorAll('nav').length,main:document.querySelectorAll('main').length,
    footer:document.querySelectorAll('footer').length};
  out.navsWithoutLabel=[...document.querySelectorAll('nav')].filter(n=>!n.getAttribute('aria-label')&&!n.getAttribute('aria-labelledby')).length;
  out.smallTargets=[...document.querySelectorAll('a,button,input')].filter(el=>{
    const r=el.getBoundingClientRect();
    if(!(r.width>0 && r.height>0 && r.height<24)) return false;
    // Visually-hidden controls (the skip link, sr-only labels) are 1x1 by
    // design and are not pointer targets until focused, so WCAG 2.5.8 does not
    // apply. Without this they mask real regressions on every page.
    const cs=getComputedStyle(el);
    if(cs.clip==='rect(0px, 0px, 0px, 0px)'||cs.clipPath==='inset(50%)') return false;
    // WCAG 2.2 SC 2.5.8 exempts a target that is "in a sentence or block of
    // text". A link inline in a paragraph is sized by the line box and cannot
    // be padded without breaking the line — the exception exists precisely for
    // this. Detect it by asking whether the parent holds text besides the link.
    const parent=el.parentElement;
    if(parent && cs.display.startsWith('inline')){
      const own=(el.innerText||'').trim();
      const around=(parent.innerText||'').trim();
      if(around.length > own.length + 1) return false;
    }
    return true;
  }).map(el=>el.tagName+' '+Math.round(el.getBoundingClientRect().height)+'px: '+(el.innerText||'').trim().slice(0,26));
  out.expandedTriggers=[...document.querySelectorAll('[aria-expanded]')].length;
  out.langAttr=document.documentElement.lang;
  out.skipLink=!!document.querySelector('a[href="#main"]');
  out.jsonLdBlocks=document.querySelectorAll('script[type="application/ld+json"]').length;
  out.title=document.title;
  out.metaDesc=document.querySelector('meta[name=description]')?.content?.slice(0,70);
  out.canonical=document.querySelector('link[rel=canonical]')?.href;
  return JSON.stringify(out,null,1);
})()`,
  },
  sessionId,
);
console.log(res.result.value);
ws.close();
chrome.kill();
