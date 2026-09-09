/**
 * WHOIS lookup tests (CDP).
 *
 * Covers every reachable state of the tool: idle, loading, registered,
 * available, unsupported, error, plus validation and keyboard operation.
 *
 * UI states are STUBBED for determinism — RDAP is shared public
 * infrastructure and will rate-limit a suite that hammers it, producing
 * failures that look like product defects and are not. The real registry is
 * proved separately by one live probe at the end.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = (process.argv[2] ?? "http://localhost:3000") + "/whois-lookup";
const PORT = 9884;
spawn(CHROME, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/cdp-whois", "about:blank"]);
async function ep() {
  for (let i = 0; i < 80; i++) {
    try { return (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; }
    catch { await sleep(250); }
  }
}
const ws = new WebSocket(await ep());
await new Promise((r) => { ws.onopen = r; });
let id = 0; const p = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); } };
const send = (m, params = {}, s) => new Promise((r) => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params, sessionId: s })); });
const { result: { targetId } } = await send("Target.createTarget", { url: "about:blank" });
const { result: { sessionId } } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
const ev = async (x) => {
  const r = await send("Runtime.evaluate", { expression: `(async()=>{${x}})()`, returnByValue: true, awaitPromise: true }, sessionId);
  if (r.result?.exceptionDetails) return "ERR:" + r.result.exceptionDetails.text;
  return r.result?.result?.value;
};
const key = (k, code, text) =>
  send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code, text, windowsVirtualKeyCode: code === "Enter" ? 13 : 0 }, sessionId)
    .then(() => send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code }, sessionId));

let pass = 0, fail = 0;
const check = (n, ok, extra = "") => { if (ok) { pass++; } else { fail++; } console.log(`  ${ok ? "✓" : "✗"} ${n}${ok ? "" : "   " + extra}`); };

await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
const load = async () => { await send("Page.navigate", { url: URL }, sessionId); await sleep(2500); };

/** Install a deterministic API stub for the whois endpoint. */
const stub = (payload, status = 200) => ev(`
  if (!window.__realFetch) window.__realFetch = window.fetch;
  window.fetch = async (u, o) =>
    String(u).includes('/api/domains/whois')
      ? new Response(${JSON.stringify(JSON.stringify(payload))}, {
          status: ${status}, headers: { 'Content-Type': 'application/json' } })
      : window.__realFetch(u, o);
  return true;`);

const region = `document.querySelector('input[name="whois"]').closest('form').parentElement.querySelector(':scope > [aria-live="polite"]')`;

const search = (q) => ev(`
  const i=document.querySelector('input[name="whois"]');
  const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  setter.call(i, ${JSON.stringify(q)});
  i.dispatchEvent(new Event('input',{bubbles:true}));
  i.form.requestSubmit();
  return true;`);

const settle = (ms = 6000) => ev(`
  const t=Date.now();
  while(Date.now()-t<${ms}){
    const r=${region};
    if(r && r.getAttribute('aria-busy')!=='true' && r.innerText.trim().length>40) return true;
    await new Promise(r=>setTimeout(r,150));
  }
  return false;`);

console.log("\n── Idle & validation ──");
await load();
check("idle shows provenance, not a fake result",
  await ev(`return document.body.innerText.includes('straight from the domain registry')`));
check("input is labelled and described",
  await ev(`const i=document.querySelector('input[name="whois"]');
    const lab=document.querySelector('label[for="'+i.id+'"]');
    return !!lab && !!i.getAttribute('aria-describedby')`));
await search("serverlys");
await sleep(300);
check("a name with no extension is rejected before any request",
  await ev(`const i=document.querySelector('input[name="whois"]');
    return i.getAttribute('aria-invalid')==='true'
      && /include the extension/i.test(document.body.innerText)`));
await search("");
await sleep(300);
check("an empty query is rejected",
  await ev(`return /enter a domain name/i.test(document.body.innerText)`));

console.log("\n── Loading state ──");
await load();
await ev(`if(!window.__realFetch) window.__realFetch=window.fetch;
  window.fetch=async(u,o)=> String(u).includes('/api/domains/whois')
    ? new Promise(()=>{})  // never resolves — hold the loading state
    : window.__realFetch(u,o);
  return true;`);
await search("example.com");
await sleep(400);
check("loading shows a busy region and a spinner",
  await ev(`const r=${region};
    return r.getAttribute('aria-busy')==='true' && /asking the registry/i.test(r.innerText)`));
check("submit button reports busy",
  await ev(`return !!document.querySelector('button[aria-busy="true"]')`));

console.log("\n── Registered domain ──");
await load();
await stub({ ok: true, record: {
  domain: "example.com", status: "registered", registrar: "Test Registrar LLC",
  registrarIanaId: "9999", registered: "2001-04-02T00:00:00Z",
  updated: "2024-06-01T00:00:00Z", expires: "2030-04-02T00:00:00Z",
  nameservers: ["ns1.example.net", "ns2.example.net"],
  epp: ["client transfer prohibited"], dnssec: true } });
await search("example.com");
await settle();
check("registrar is shown", await ev(`return document.body.innerText.includes('Test Registrar LLC')`));
check("dates are formatted, not raw ISO",
  await ev(`return document.body.innerText.includes('April 2, 2001')
    && !document.body.innerText.includes('2001-04-02T00:00:00Z')`));
check("expiry shows a countdown", await ev(`return /in \\d+ days/.test(document.body.innerText)`));
check("nameservers are listed",
  await ev(`return document.body.innerText.includes('ns1.example.net')
    && document.body.innerText.includes('ns2.example.net')`));
check("EPP status codes are shown and explained",
  await ev(`return document.body.innerText.includes('client transfer prohibited')
    && /must be unlocked/i.test(document.body.innerText)`));
check("DNSSEC state is reported", await ev(`return /signed/i.test(document.body.innerText)`));
check("redaction is disclosed rather than faked",
  await ev(`return /redacted by the registries/i.test(document.body.innerText)`));
check("offers a transfer route",
  await ev(`return [...document.querySelectorAll('a')].some(a=>a.getAttribute('href')==='/transfer-domain')`));

console.log("\n── Available domain ──");
await load();
await stub({ ok: true, record: { domain: "zzq-probe-5521.com", status: "available" } });
await search("zzq-probe-5521.com");
await settle();
check("reports no registry record",
  await ev(`return /no registry record/i.test(document.body.innerText)`));
check("links to the real WHMCS cart with the domain",
  await ev(`const a=[...document.querySelectorAll('a')].find(a=>(a.getAttribute('href')||'').includes('domain=register'));
    return !!a && a.getAttribute('href').includes('zzq-probe-5521.com')`));
check("is honest that premium names are the exception",
  await ev(`return /premium and reserved/i.test(document.body.innerText)`));

console.log("\n── Unsupported & error ──");
await load();
await stub({ ok: true, record: { domain: "example.xx", status: "unsupported",
  reason: "This registry does not publish RDAP data." } });
await search("example.xx");
await settle();
check("an unsupported registry says so, never guesses",
  await ev(`return /cannot tell you about this one/i.test(document.body.innerText)
    && /does not publish/i.test(document.body.innerText)`));

await load();
await stub({ ok: false, reason: "The registry is rate-limiting lookups right now." }, 429);
await search("example.com");
await settle();
check("a failed lookup shows an error, not an empty result",
  await ev(`return /lookup did not complete/i.test(document.body.innerText)`));
check("error state offers a retry",
  await ev(`return [...document.querySelectorAll('button')].some(b=>/try again/i.test(b.textContent))`));
check("error state offers the domain search as a fallback",
  await ev(`return [...document.querySelectorAll('a')].some(a=>a.getAttribute('href')==='/register-domain')`));

console.log("\n── Keyboard & mobile ──");
await load();
await stub({ ok: true, record: { domain: "example.com", status: "registered", registrar: "Test Registrar LLC" } });
await ev(`document.querySelector('input[name="whois"]').focus();
  const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  setter.call(document.querySelector('input[name="whois"]'),'example.com');
  document.querySelector('input[name="whois"]').dispatchEvent(new Event('input',{bubbles:true}));
  return true;`);
await key("Enter", "Enter", "\r");
await settle();
check("Enter in the field runs the lookup",
  await ev(`return document.body.innerText.includes('Test Registrar LLC')`));

await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 2, mobile: true }, sessionId);
await load();
check("no horizontal overflow on mobile",
  await ev(`return document.documentElement.scrollWidth<=window.innerWidth+1`),
  await ev(`return document.documentElement.scrollWidth+' vs '+window.innerWidth`));
check("input meets the 44px touch target",
  await ev(`return document.querySelector('input[name="whois"]').getBoundingClientRect().height>=44`));
check("submit button meets the 44px touch target",
  await ev(`return document.querySelector('form button[type="submit"]').getBoundingClientRect().height>=44`));

console.log("\n── Live integration (real registry, no stub) ──");
const live = await fetch((process.argv[2] ?? "http://localhost:3000") + "/api/domains/whois?domain=example.com");
const body = await live.json();
const ok = body.ok && body.record &&
  ["registered", "available", "unsupported", "error"].includes(body.record.status);
check("live API returns a well-formed record from the real registry", ok, JSON.stringify(body).slice(0, 200));
if (body.record?.status === "registered") {
  console.log(`    (registry answered: registrar ${body.record.registrar ?? "not published"})`);
} else {
  console.log(`    (registry status this run: ${body.record?.status})`);
}

console.log(`\n${fail ? "✗ FAILURES" : "✓ ALL PASS"} — ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
