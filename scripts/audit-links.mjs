/**
 * Every interactive control on every page, and where it actually goes.
 *
 * Static grepping cannot answer this. A `<Button>` with no `href` compiles to a
 * `<button>`, and whether that button DOES anything lives in a React prop, not
 * in the HTML. So this drives a real browser, reads React's own props off the
 * DOM nodes, and classifies each control:
 *
 *   link      → an <a> with a resolvable destination
 *   action    → a <button> with a handler, a form, or disclosure semantics
 *   DEAD      → a control a person can click that does nothing at all
 *
 * It then fetches every distinct internal destination once and reports the
 * status, so a CTA pointing at an unbuilt route is a failure here rather than a
 * 404 a customer finds.
 *
 * Off-origin destinations (WHMCS billing, sister products) are NOT fetched —
 * /billing is not served by this app and a dev box cannot reach it. They are
 * pattern-checked instead, against the contract in data/company.ts.
 *
 * Usage: node scripts/audit-links.mjs [baseUrl] [--verbose]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const VERBOSE = process.argv.includes("--verbose");
const PORT = 9411;

// ── CDP plumbing ───────────────────────────────────────────────────────────
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=/tmp/cdp-links",
    "about:blank",
  ],
  { stdio: "ignore" },
);
const endpoint = async () => {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      return (await r.json()).webSocketDebuggerUrl;
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Chrome did not start");
};
const ws = new WebSocket(await endpoint());
await new Promise((r) => (ws.onopen = r));
let msgId = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
};
const send = (method, params = {}, sessionId) =>
  new Promise((r) => {
    const id = ++msgId;
    pending.set(id, r);
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });

const {
  result: { targetId },
} = await send("Target.createTarget", { url: "about:blank" });
const {
  result: { sessionId },
} = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false },
  sessionId,
);
// Reduced motion so reveal animations do not leave controls display:none and
// therefore invisible to the sweep. Same trap documented for shoot.mjs.
await send(
  "Emulation.setEmulatedMedia",
  { features: [{ name: "prefers-reduced-motion", value: "reduce" }] },
  sessionId,
);

const evaluate = async (expression) => {
  const r = await send(
    "Runtime.evaluate",
    { expression: `(async()=>{${expression}})()`, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (r.result?.exceptionDetails) {
    throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400));
  }
  return r.result?.result?.value;
};

// ── The in-page sweep ──────────────────────────────────────────────────────
// Reads React's props off each node. React attaches listeners at the root, so
// a plain `onclick` check reports every React handler as missing.
const SWEEP = String.raw`
const reactProps = (el) => {
  const key = Object.keys(el).find((k) => k.startsWith("__reactProps$"));
  return key ? el[key] : null;
};
const label = (el) =>
  (el.innerText || el.getAttribute("aria-label") || el.title || "")
    .trim().replace(/\s+/g, " ").slice(0, 60) || "(no label)";

// Where on the page it sits, so a bad control can be found again.
const region = (el) => {
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  if (el.closest("[role=dialog]")) return "dialog";
  const s = el.closest("section[id], section, main > div");
  return s?.id || s?.getAttribute("aria-label") || "body";
};

const out = [];
for (const el of document.querySelectorAll("a, button")) {
  // Skip what a person cannot reach: hidden subtrees and aria-hidden art.
  if (el.closest("[hidden]") || el.closest('[aria-hidden="true"]')) continue;
  const cs = getComputedStyle(el);
  if (cs.display === "none" || cs.visibility === "hidden") continue;

  const base = { label: label(el), region: region(el), tag: el.tagName.toLowerCase() };

  if (el.tagName === "A") {
    const raw = el.getAttribute("href");
    out.push({
      ...base,
      kind: "link",
      href: raw,
      resolved: raw ? el.href : null,
      target: el.getAttribute("target"),
      rel: el.getAttribute("rel"),
    });
    continue;
  }

  const props = reactProps(el) || {};
  const reasons = [];
  if (typeof props.onClick === "function") reasons.push("onClick");
  if (typeof props.onPointerDown === "function") reasons.push("onPointerDown");
  if (typeof props.onMouseDown === "function") reasons.push("onMouseDown");
  if (typeof props.onKeyDown === "function") reasons.push("onKeyDown");
  if (el.getAttribute("type") === "submit") reasons.push("submit");
  if (el.form) reasons.push("in-form");
  if (el.hasAttribute("popovertarget")) reasons.push("popover");
  if (el.hasAttribute("aria-controls")) reasons.push("aria-controls");
  if (el.hasAttribute("aria-expanded")) reasons.push("aria-expanded");
  if (el.hasAttribute("disabled")) reasons.push("disabled");
  if (el.getAttribute("role") === "tab") reasons.push("tab");
  if (typeof props.onChange === "function") reasons.push("onChange");

  out.push({ ...base, kind: reasons.length ? "action" : "DEAD", why: reasons.join("+") });
}
return JSON.stringify(out);
`;

// ── Routes, from the sitemap so this cannot drift from what ships ──────────
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .sort();

console.log(`Auditing ${paths.length} route(s) at ${BASE}\n`);

const controls = [];
for (const path of paths) {
  await send("Page.navigate", { url: `${BASE}${path}` }, sessionId);
  await sleep(700);
  let found;
  try {
    found = JSON.parse(await evaluate(SWEEP));
  } catch (err) {
    console.log(`  ! ${path} — sweep failed: ${String(err).slice(0, 120)}`);
    continue;
  }
  for (const c of found) controls.push({ ...c, page: path });
}

// ── Classify destinations ──────────────────────────────────────────────────
const origin = new URL(BASE);
const links = controls.filter((c) => c.kind === "link");
const buttons = controls.filter((c) => c.kind !== "link");

const dead = [];
const internal = new Map(); // pathname -> sample control
const external = new Map();
const anchors = [];
const mailtoTel = [];

for (const l of links) {
  const raw = (l.href ?? "").trim();
  if (!raw || raw === "#" || raw.toLowerCase().startsWith("javascript:")) {
    dead.push({ ...l, why: raw ? `href="${raw}"` : "no href" });
    continue;
  }
  if (raw.startsWith("#")) {
    anchors.push(l);
    continue;
  }
  if (/^(mailto|tel):/i.test(raw)) {
    mailtoTel.push(l);
    continue;
  }
  let url;
  try {
    url = new URL(l.resolved ?? raw, BASE);
  } catch {
    dead.push({ ...l, why: `unparseable href "${raw}"` });
    continue;
  }
  if (url.host === origin.host) {
    // /billing is the WHMCS install, same origin in production but NOT served
    // by this app. Treat it as external for reachability purposes.
    if (url.pathname.startsWith("/billing")) {
      if (!external.has(url.href)) external.set(url.href, l);
      continue;
    }
    const key = url.pathname + url.search;
    if (!internal.has(key)) internal.set(key, l);
  } else {
    if (!external.has(url.href)) external.set(url.href, l);
  }
}

for (const b of buttons) if (b.kind === "DEAD") dead.push({ ...b, why: "no handler" });

// ── Fetch every distinct internal destination once ─────────────────────────
const brokenInternal = [];
await Promise.all(
  [...internal.keys()].map(async (key) => {
    try {
      const r = await fetch(`${BASE}${key}`, { redirect: "follow" });
      if (!r.ok) brokenInternal.push({ key, status: r.status, sample: internal.get(key) });
    } catch (err) {
      brokenInternal.push({ key, status: String(err).slice(0, 60), sample: internal.get(key) });
    }
  }),
);

// ── Off-origin: pattern check, no fetch ────────────────────────────────────
const BILLING_SHAPES = [
  /^https:\/\/serverlys\.com\/billing\/?$/,
  /^https:\/\/serverlys\.com\/billing\/login$/,
  /^https:\/\/serverlys\.com\/billing\/submitticket\.php\?/,
  /^https:\/\/serverlys\.com\/billing\/cart\.php\?/,
  /^https:\/\/serverlys\.com\/billing\/store\/[a-z0-9-]+(\/[a-z0-9-]+)?$/,
];
const oddBilling = [];
const externalNoRel = [];
for (const [href, sample] of external) {
  if (href.includes("/billing")) {
    if (!BILLING_SHAPES.some((re) => re.test(href))) oddBilling.push({ href, sample });
    continue;
  }
  if (sample.target === "_blank" && !/noopener/.test(sample.rel ?? "")) {
    externalNoRel.push({ href, sample });
  }
}

// ── In-page anchors must have a target ─────────────────────────────────────
const anchorTargets = new Map();
for (const a of anchors) {
  if (!anchorTargets.has(a.page)) anchorTargets.set(a.page, []);
  anchorTargets.get(a.page).push(a.href.slice(1));
}
const brokenAnchors = [];
for (const [page, ids] of anchorTargets) {
  await send("Page.navigate", { url: `${BASE}${page}` }, sessionId);
  await sleep(500);
  const missing = JSON.parse(
    await evaluate(
      `return JSON.stringify(${JSON.stringify([...new Set(ids)])}.filter(
         (id) => !document.getElementById(id) && !document.getElementsByName(id).length))`,
    ),
  );
  for (const id of missing) brokenAnchors.push({ page, id });
}

// ── Same label, different destination ──────────────────────────────────────
// A "Get started" that lands somewhere different on two pages is not
// automatically wrong — but it is always worth a human look.
const byLabel = new Map();
for (const l of links) {
  if (!l.resolved || l.href?.startsWith("#")) continue;
  const key = l.label.toLowerCase();
  if (!byLabel.has(key)) byLabel.set(key, new Set());
  byLabel.get(key).add(l.resolved);
}
const inconsistent = [...byLabel.entries()]
  .filter(([label, set]) => set.size > 1 && label !== "(no label)" && label.length > 3)
  .map(([label, set]) => ({ label, destinations: [...set] }));

// ── Report ─────────────────────────────────────────────────────────────────
const say = (title, rows, render) => {
  if (!rows.length) return;
  console.log(`\n── ${title} (${rows.length}) ──`);
  for (const row of rows) console.log("  " + render(row));
};

console.log(
  `${controls.length} control(s): ${links.length} link(s), ` +
    `${buttons.filter((b) => b.kind === "action").length} action button(s)`,
);
console.log(
  `${internal.size} distinct internal destination(s), ${external.size} off-origin, ` +
    `${anchors.length} in-page anchor(s), ${mailtoTel.length} mailto/tel`,
);

say("DEAD CONTROLS — clickable, goes nowhere", dead, (d) =>
  `${d.page}  [${d.region}]  "${d.label}"  — ${d.why}`,
);
say("BROKEN INTERNAL DESTINATIONS", brokenInternal, (b) =>
  `${b.key} → ${b.status}   (first seen: ${b.sample.page} [${b.sample.region}] "${b.sample.label}")`,
);
say("IN-PAGE ANCHORS WITH NO TARGET", brokenAnchors, (a) => `${a.page} → #${a.id}`);
say("OFF-CONTRACT BILLING URLS", oddBilling, (o) => `${o.href}   (${o.sample.page})`);
say("EXTERNAL target=_blank WITHOUT rel=noopener", externalNoRel, (e) =>
  `${e.href}   (${e.sample.page} "${e.sample.label}")`,
);
say("SAME LABEL, DIFFERENT DESTINATION — review", inconsistent, (i) =>
  `"${i.label}"\n      ${i.destinations.join("\n      ")}`,
);

if (VERBOSE) {
  console.log("\n── every off-origin destination ──");
  for (const href of [...external.keys()].sort()) console.log("  " + href);
}

const failures = dead.length + brokenInternal.length + brokenAnchors.length + oddBilling.length;
console.log(
  failures
    ? `\n✗ ${failures} problem(s) that break a click` +
        (inconsistent.length ? `, plus ${inconsistent.length} label(s) to review` : "")
    : `\n✓ every control resolves` +
        (inconsistent.length ? ` — ${inconsistent.length} label(s) worth reviewing` : ""),
);

chrome.kill();
process.exit(failures ? 1 : 0);
