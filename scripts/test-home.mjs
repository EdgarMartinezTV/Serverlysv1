/**
 * Homepage interaction + runtime-error test (CDP).
 *
 * A type check and a build both pass on a homepage whose accordion re-opens
 * itself, whose carousel arrows are dead, and whose console is full of
 * hydration errors. This drives the real page in a real browser and asserts on
 * observable state.
 *
 * Every console error, page exception and failed request is collected across
 * the whole run and reported at the end — a React hydration mismatch shows up
 * only at runtime, and only in the console.
 *
 * Usage: node scripts/test-home.mjs [url]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.argv[2] ?? "http://localhost:3000";

const port = 9600 + (Math.floor(process.uptime() * 1000) % 150);
/**
 * A FRESH profile every run. This suite answers the cookie notice, and that
 * answer is persisted; a reused profile meant the next run started with the
 * banner already dismissed and five consent assertions failed for no reason
 * anyone could reproduce on demand.
 */
const profile = `/tmp/cdp-home-${port}-${Math.floor(Math.random() * 1e9)}`;
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
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
const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];

ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result ?? { __error: msg.error });
    pending.delete(msg.id);
    return;
  }
  if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) {
    consoleErrors.push(
      `${msg.params.type}: ${msg.params.args.map((a) => a.value ?? a.description ?? a.type).join(" ")}`,
    );
  }
  if (msg.method === "Runtime.exceptionThrown") {
    pageErrors.push(msg.params.exceptionDetails.exception?.description ?? "exception");
  }
  if (msg.method === "Network.loadingFailed") {
    failedRequests.push(`${msg.params.type} ${msg.params.errorText}`);
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
await send("Runtime.enable", {}, sessionId);
await send("Network.enable", {}, sessionId);
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false },
  sessionId,
);

const evaluate = async (expression) => {
  const r = await send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (r?.exceptionDetails) {
    throw new Error(r.exceptionDetails.exception?.description ?? "eval failed");
  }
  return r?.result?.value;
};

await send("Page.navigate", { url }, sessionId);
await sleep(3500);

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "  ok  " : " FAIL "} ${name}${detail ? ` — ${detail}` : ""}`);
};

// ── 1. Structure ──────────────────────────────────────────────────────────
const sections = await evaluate(
  `["build","launch","grow","manage","plans"].filter((id) => document.getElementById(id))`,
);
check("all five anchor targets exist", sections.length === 5, sections.join(","));

const h1s = await evaluate(`document.querySelectorAll("h1").length`);
check("exactly one h1", h1s === 1, `${h1s}`);

// ── 2. (removed) ──────────────────────────────────────────────────────────
// The hero stage rail and its swap choreography were removed from the hero
// on request, along with stage-rail.tsx and stage-mock.tsx. The assertions
// that covered them are gone rather than skipped: there is no longer a
// behaviour here to regress. Section 9 (hero scenes under reduced motion)
// went for the same reason — those .animate-stage-* rows lived in the mocks.

// ── 3. Manage panels: exclusive accordion that STAYS where the user put it ─
await evaluate(`document.getElementById("manage").scrollIntoView(); true`);
await sleep(1200);

const accordion = await evaluate(`(async () => {
  const panels = [...document.querySelectorAll('details[name="manage-panels"]')];
  if (panels.length < 2) return { error: "panels missing", count: panels.length };
  panels[2].querySelector("summary").click();
  await new Promise((r) => setTimeout(r, 400));
  const openAfterClick = panels.map((p) => p.open);
  // Force the surrounding Reveal to re-render by scrolling more into view.
  window.scrollBy(0, 400);
  await new Promise((r) => setTimeout(r, 900));
  return { openAfterClick, openAfterScroll: panels.map((p) => p.open), count: panels.length };
})()`);
check("five manage panels render", accordion.count === 5, `${accordion.count}`);
check(
  "opening one panel closes the others",
  accordion.openAfterClick && accordion.openAfterClick.filter(Boolean).length === 1,
  JSON.stringify(accordion.openAfterClick),
);
check(
  "panel stays open after a re-render",
  accordion.openAfterScroll && accordion.openAfterScroll[2] === true,
  JSON.stringify(accordion.openAfterScroll),
);

// ── 4. Card rails scroll, and their arrows disable at the ends ────────────
/*
 * Points at the SERVICES rail. This used to drive the Launch rail, which was a
 * CardRail until Launch was rebuilt to the expanding row below — but the thing
 * under test here is CardRail's arrow/scroll logic, not Launch specifically,
 * and services is still a CardRail. Retargeting keeps that coverage; deleting
 * it would have left CardRail untested on the homepage.
 */
const rail = await evaluate(`(async () => {
  const track = [...document.querySelectorAll("ul")].find((u) => u.getAttribute("aria-label") === "services");
  if (!track) return { error: "rail missing" };
  const next = [...document.querySelectorAll("button")].find((b) => (b.getAttribute("aria-label") || "").includes("services right"));
  const prev = [...document.querySelectorAll("button")].find((b) => (b.getAttribute("aria-label") || "").includes("services left"));
  const startDisabled = prev?.disabled;
  const before = track.scrollLeft;
  next?.click();
  await new Promise((r) => setTimeout(r, 900));
  return { startDisabled, before, after: track.scrollLeft, prevNowEnabled: !prev?.disabled };
})()`);
check("rail starts at scrollLeft 0 (snap padding)", rail.before === 0, `scrollLeft ${rail.before}`);
check("rail prev arrow starts disabled", rail.startDisabled === true, String(rail.startDisabled));
check("rail next arrow scrolls the track", rail.after > rail.before, `${rail.before} → ${rail.after}`);
check("rail prev arrow enables after scrolling", rail.prevNowEnabled === true);

// ── 4b. Launch row: four cards that share the track and expand on hover ───
/*
 * The expansion is pure CSS, so it is asserted against the CSSOM rather than a
 * synthetic hover — which also lets it check the one thing that silently breaks
 * it: the two rules carry equal specificity, so if the card-hover rule stops
 * being the LAST of the pair, the row-hover rule wins on the hovered card too
 * and every card flattens to 0.85. That failure looks like "the animation just
 * stopped working" and is invisible in a diff.
 */
const launch = await evaluate(`(() => {
  const row = document.querySelector("ul.tools-row");
  if (!row) return { error: "launch row missing" };
  const cards = [...row.children];
  const cs = getComputedStyle(cards[0]);
  const arrow = cards[0].querySelector("span[aria-hidden]");
  return {
    count: cards.length,
    grow: cs.flexGrow,
    basis: cs.flexBasis,
    widths: cards.map((c) => Math.round(c.getBoundingClientRect().width)),
    arrowOpacity: arrow && getComputedStyle(arrow).opacity,
  };
})()`);
check("launch row renders four cards", launch.count === 4, String(launch.count));
check(
  "launch cards share the track (flex 1 1 0)",
  launch.grow === "1" && launch.basis === "0px",
  `grow ${launch.grow} basis ${launch.basis}`,
);
check(
  "launch cards start equal width",
  new Set(launch.widths).size === 1,
  (launch.widths || []).join(","),
);
check("launch arrow is hidden until hover", launch.arrowOpacity === "0", String(launch.arrowOpacity));

/*
 * Driven with a REAL pointer rather than read off the CSSOM. The rules live in
 * a `@media` block that document.styleSheets does not surface here, so a
 * stylesheet walk reports them missing on a page where they are demonstrably
 * applying — it would have failed for a reason that has nothing to do with the
 * behaviour. Hovering and reading the computed value tests the thing itself.
 *
 * This still catches the ordering hazard the two rules carry: they have equal
 * specificity, so if the card-hover rule stops coming last, the row-hover rule
 * also claims the hovered card and `hovered` below reads 0.85 instead of 1.5.
 */
const hoverPos = await evaluate(`(async () => {
  document.querySelector("#launch").scrollIntoView({ block: "center" });
  await new Promise((r) => setTimeout(r, 900));
  const first = document.querySelector("ul.tools-row > li");
  const r = first.getBoundingClientRect();
  return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + 180) };
})()`);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...hoverPos }, sessionId);
await sleep(900);
const hovered = await evaluate(`(() => {
  const cards = [...document.querySelectorAll("ul.tools-row > li")];
  const arrow = cards[0].querySelector("span[aria-hidden]");
  return {
    grows: cards.map((c) => getComputedStyle(c).flexGrow),
    widths: cards.map((c) => Math.round(c.getBoundingClientRect().width)),
    arrowOpacity: getComputedStyle(arrow).opacity,
  };
})()`);
check(
  "hovering a launch card grows it to 1.5 and the rest to 0.85",
  hovered.grows[0] === "1.5" && hovered.grows.slice(1).every((g) => g === "0.85"),
  hovered.grows.join(","),
);
check(
  "the hovered card is visibly wider than its siblings",
  hovered.widths[0] > hovered.widths[1] * 1.6,
  hovered.widths.join(","),
);
check("the arrow fades in on hover", hovered.arrowOpacity === "1", String(hovered.arrowOpacity));

// ── 5. Sticky stage nav tracks the section being read ─────────────────────
const spy = await evaluate(`(async () => {
  document.getElementById("grow").scrollIntoView();
  await new Promise((r) => setTimeout(r, 900));
  const current = document.querySelector('nav[aria-label="Stages"] a[aria-current="true"]');
  return current?.getAttribute("href");
})()`);
check("stage rail highlights the current section", spy === "#grow", String(spy));

// ── 6. Brief band chips fill the textarea ─────────────────────────────────
const brief = await evaluate(`(async () => {
  const chip = [...document.querySelectorAll('button[aria-pressed]')][0];
  if (!chip) return { error: "no chip" };
  chip.click();
  await new Promise((r) => setTimeout(r, 300));
  const field = document.getElementById("brief");
  const send = [...document.querySelectorAll('a[href^="mailto:"]')][0];
  return { value: field?.value ?? "", pressed: chip.getAttribute("aria-pressed"), mailto: (send?.getAttribute("href") || "").length };
})()`);
check("chip fills the brief field", brief.value.length > 10, brief.value.slice(0, 40));
check("chip reports pressed state", brief.pressed === "true");
check("email fallback carries the brief", brief.mailto > 60, `${brief.mailto} chars`);

/*
 * ── 6a. The brief band hands the draft to Sera ───────────────────────────
 *
 * ⚠ ADDED WHEN THIS BECAME THE PRIMARY PATH. The band used to send only a
 * `mailto:`, and the assertion above — which still passes, because the email
 * handoff survives as the fallback — was the whole of its coverage. Now the
 * main control opens Sera with the draft as the first message, and shipping
 * that with no test would leave the section's actual job unverified.
 *
 * Asserts the contract rather than the wording: a control labelled "Ask Sera"
 * exists, pressing it opens the panel, the draft arrives as a visitor message,
 * and the textarea is cleared so a second press cannot double-send.
 */
const askSera = await evaluate(`(async () => {
  const band = document.querySelector('section[aria-labelledby="brief-heading"]');
  const button = [...band.querySelectorAll("button")]
    .find((b) => b.textContent.trim().startsWith("Ask Sera"));
  if (!button) return { error: "no Ask Sera control" };

  const draft = document.getElementById("brief").value;
  button.click();

  // The panel mounts on demand and the message lands on the next tick.
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    const panel = document.querySelector('[role="dialog"]');
    if (panel && panel.innerText.includes(draft.slice(0, 24))) {
      return { opened: true, carried: true, cleared: document.getElementById("brief").value === "" };
    }
  }
  const panel = document.querySelector('[role="dialog"]');
  return { opened: Boolean(panel), carried: false, cleared: false };
})()`);
check("Ask Sera control exists", !askSera.error, askSera.error ?? "found");
check("Ask Sera opens the panel", askSera.opened === true);
check("the draft arrives in Sera as a message", askSera.carried === true);
check("the draft is cleared after sending", askSera.cleared === true);

// ── 6b. Hero domain search, end to end against the real provider ─────────
const domain = await evaluate(`(async () => {
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
  const form = document.querySelector('form[role="search"]');
  const input = form?.querySelector('input[type="text"]');
  if (!input) return { error: "no hero search input" };

  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(input, "zzqx-free-77213.com");
  input.dispatchEvent(new Event("input", { bubbles: true }));
  form.querySelector('button[type="submit"]').click();

  // Real network call to a real registry.
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 250));
    if (form.parentElement.querySelectorAll("li").length) break;
  }
  const rows = [...form.parentElement.querySelectorAll("li")].map((li) => li.textContent.trim());
  const carts = [...form.parentElement.querySelectorAll('a[href*="cart.php"]')].map((a) => a.getAttribute("href"));
  return { rows: rows.slice(0, 4), carts: carts.slice(0, 3), count: rows.length };
})()`);
check("hero search returns rows from the live registry", domain.count > 0, `${domain.count} rows`);
check(
  "the searched name is row one",
  !!domain.rows && domain.rows[0]?.startsWith("zzqx-free-77213.com"),
  domain.rows?.[0]?.slice(0, 40),
);
check(
  "every row hands off to the WHMCS domain cart",
  !!domain.carts?.length &&
    domain.carts.every((h) => h.startsWith("https://serverlys.com/billing/cart.php?a=add&domain=register&query=")),
  domain.carts?.[0]?.slice(0, 78),
);

// A TLD with no registry lookup must never be guessed as available.
const unsold = await evaluate(`(async () => {
  const form = document.querySelector('form[role="search"]');
  const input = form.querySelector('input[type="text"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(input, "mysite.io");
  input.dispatchEvent(new Event("input", { bubbles: true }));
  form.querySelector('button[type="submit"]').click();
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 250));
    const first = form.parentElement.querySelector("li");
    if (first && first.textContent.includes("mysite.io")) break;
  }
  const first = form.parentElement.querySelector("li");
  return { text: first?.textContent.trim() ?? "", hasCart: !!first?.querySelector('a[href*="cart.php"]') };
})()`);
// A taken name must still offer the one purchase that applies: a transfer.
const taken = await evaluate(`(async () => {
  const form = document.querySelector('form[role="search"]');
  const input = form.querySelector('input[type="text"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(input, "example.com");
  input.dispatchEvent(new Event("input", { bubbles: true }));
  form.querySelector('button[type="submit"]').click();
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 250));
    const first = form.parentElement.querySelector("li");
    if (first && first.textContent.includes("example.com")) break;
  }
  const first = form.parentElement.querySelector("li");
  const t = first?.querySelector('a[href*="domain=transfer"]');
  return { text: first?.textContent.trim() ?? "", href: t?.getAttribute("href") ?? "" };
})()`);
check(
  "a taken name offers a transfer to checkout",
  taken.href.startsWith("https://serverlys.com/billing/cart.php?a=add&domain=transfer&query="),
  taken.href.slice(0, 74) || taken.text.slice(0, 40),
);

check(
  "an unanswerable TLD is never shown as available",
  !/\$|\/yr|Get it/.test(unsold.text),
  unsold.text.slice(0, 50),
);
check("it still reaches checkout", unsold.hasCart === true, unsold.text.slice(0, 50));

// ── 6c. Cookie consent ────────────────────────────────────────────────────
const consent = await evaluate(`(async () => {
  const panel = document.querySelector("[data-cookie-consent]");
  if (!panel) return { error: "no banner" };
  const btn = (label) => [...panel.querySelectorAll("button")].find((b) => b.textContent.trim() === label);
  const equalWeight = (() => {
    const a = btn("Accept all"), r = btn("Reject all");
    if (!a || !r) return false;
    const ar = a.getBoundingClientRect(), rr = r.getBoundingClientRect();
    // Reject must not be visually demoted: same height, comparable width.
    return Math.abs(ar.height - rr.height) < 2 && rr.width > ar.width * 0.7;
  })();
  const notModal = !panel.querySelector('[aria-modal="true"]');
  // Open settings: it IS a dialog, unlike the banner.
  btn("Cookie settings")?.click();
  await new Promise((r) => setTimeout(r, 300));
  const dialog = document.querySelector('[data-cookie-consent] [role="dialog"]');
  const boxes = [...(dialog?.querySelectorAll('input[type="checkbox"]') ?? [])];
  const necessaryLocked = boxes[0]?.disabled === true && boxes[0]?.checked === true;
  return { equalWeight, notModal, categories: boxes.length, necessaryLocked };
})()`);
check("cookie banner renders", !consent.error, consent.error ?? "");
check("Accept and Reject carry equal weight", consent.equalWeight === true);
check("the banner does not trap the page", consent.notModal === true);
check("settings lists three categories", consent.categories === 3, String(consent.categories));
check("necessary is locked on", consent.necessaryLocked === true);

// Rejecting must persist AND leave optional consent false.
const rejected = await evaluate(`(async () => {
  const panel = document.querySelector("[data-cookie-consent]");
  [...panel.querySelectorAll("button")].find((b) => b.textContent.trim() === "Reject all")?.click();
  await new Promise((r) => setTimeout(r, 300));
  const key = Object.keys(localStorage).find((k) => k.startsWith("serverlys.consent."));
  const stored = key ? JSON.parse(localStorage.getItem(key)) : null;
  return {
    gone: !document.querySelector("[data-cookie-consent]"),
    stored,
    stamped: document.documentElement.dataset.consent === "set",
  };
})()`);
check("rejecting dismisses the banner", rejected.gone === true);
check("the choice is persisted", !!rejected.stored, JSON.stringify(rejected.stored));
check(
  "reject stores optional categories as false",
  rejected.stored?.analytics === false && rejected.stored?.marketing === false,
  JSON.stringify(rejected.stored),
);
check("html is stamped so it cannot flash again", rejected.stamped === true);

// The footer control must bring it back — withdrawal has to be possible.
const reopened = await evaluate(`(async () => {
  const link = [...document.querySelectorAll("footer button")].find((b) => b.textContent.trim() === "Cookie settings");
  if (!link) return { error: "no footer control" };
  link.click();
  await new Promise((r) => setTimeout(r, 300));
  return { back: !!document.querySelector('[data-cookie-consent] [role="dialog"]') };
})()`);
check("footer reopens the settings panel", reopened.back === true, reopened.error ?? "");

// ── 7. Mega menu opens and renders its three zones ────────────────────────
const mega = await evaluate(`(async () => {
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 500));
  const trigger = [...document.querySelectorAll("header button")].find((b) => b.textContent.trim().startsWith("Products"));
  if (!trigger) return { error: "no trigger" };
  trigger.click();
  await new Promise((r) => setTimeout(r, 600));
  // Every top-level menu keeps its panel in the DOM behind hidden, so scope
  // the query to the one that is actually open.
  const open = [...document.querySelectorAll("header > div [id]")].find((n) => n.getAttribute("aria-labelledby") && !n.hidden);
  const tabs = open ? open.querySelectorAll('[role="tab"]').length : 0;
  const selected = open ? open.querySelectorAll('[role="tab"][aria-selected="true"]').length : 0;
  const links = open ? open.querySelectorAll('[role="tabpanel"] a').length : 0;
  // The inner card, not the positioning wrapper — the wrapper pt-2 is the 8px.
  // Measured against the HEADER's bottom edge, not the viewport: the page may
  // still be settling from a smooth scroll and the announcement bar above the
  // header makes the absolute offset depend on scroll position.
  const card = open?.firstElementChild?.getBoundingClientRect();
  const bar = document.querySelector("header").getBoundingClientRect();
  return {
    tabs, selected, links,
    gap: card ? Math.round(card.top - bar.bottom) : null,
    barHeight: Math.round(bar.height),
    width: card ? Math.round(card.width) : null,
  };
})()`);
check("mega menu rail renders tabs", mega.tabs > 0, `${mega.tabs} tabs`);
check("exactly one tab is selected", mega.selected === 1, `${mega.selected}`);
check("mega menu content has links", mega.links > 3, `${mega.links} links`);
check("header bar is 72px tall", mega.barHeight === 72, `${mega.barHeight}px`);
check("panel opens 8px under the bar", mega.gap === 8, `gap ${mega.gap}px`);

// ── 8. No horizontal overflow at any width ────────────────────────────────
const widths = [320, 360, 390, 414, 430, 768, 820, 1024, 1280, 1440, 1600, 1920, 2560];
const overflow = [];
for (const w of widths) {
  await send(
    "Emulation.setDeviceMetricsOverride",
    { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 },
    sessionId,
  );
  await sleep(500);
  const scrollWidth = await evaluate(
    `(() => { document.body.style.overflow=""; return Math.round(document.documentElement.scrollWidth); })()`,
  );
  if (scrollWidth > w + 1) overflow.push(`${w} → ${scrollWidth}`);
}
check("no horizontal overflow at any width", overflow.length === 0, overflow.join(", "));

// ── Report ────────────────────────────────────────────────────────────────
const ignorable = (line) =>
  line.includes("Download the React DevTools") ||
  line.includes("react-devtools") ||
  line.includes("Fast Refresh");

const errors = consoleErrors.filter((l) => !ignorable(l));
check("no console errors or warnings", errors.length === 0, errors.slice(0, 4).join(" | "));
check("no uncaught exceptions", pageErrors.length === 0, pageErrors.slice(0, 3).join(" | "));

const realFailures = failedRequests.filter((r) => !r.includes("net::ERR_ABORTED"));
check("no failed requests", realFailures.length === 0, realFailures.slice(0, 3).join(" | "));

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);

ws.close();
chrome.kill();
try {
  const { rmSync } = await import("node:fs");
  rmSync(profile, { recursive: true, force: true });
} catch {
  /* best effort — a leftover profile is harmless */
}
process.exit(failed.length ? 1 : 0);
