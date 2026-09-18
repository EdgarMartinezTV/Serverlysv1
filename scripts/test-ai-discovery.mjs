/**
 * AI-discovery checks.
 *
 * What an answer engine needs from this site, asserted rather than assumed:
 *
 *   1. robots.txt does not block the bots that produce AI citations. This is
 *      the one failure that is both silent and total — the site simply stops
 *      appearing in AI answers, with nothing in any dashboard to say why.
 *   2. /llms.txt exists, is text/plain, and every link in it resolves. A
 *      404 in the file an assistant trusts most is worse than no file.
 *   3. Pages answer without JavaScript. Most AI crawlers do not execute it.
 *      This asserts extractable prose in the RAW HTML, not in a rendered DOM.
 *   4. Structured data parses, and every provider/publisher reference resolves
 *      to the one canonical Organization node rather than an anonymous stub.
 *
 * Usage: node scripts/test-ai-discovery.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? "http://localhost:3000";

let passed = 0;
const failures = [];
const ok = (name) => {
  passed++;
  console.log(`  ✓ ${name}`);
};
const bad = (name, detail) => {
  failures.push(`${name} — ${detail}`);
  console.log(`  ✗ ${name}\n      ${detail}`);
};
const check = (cond, name, detail) => (cond ? ok(name) : bad(name, detail));

const text = async (path) => {
  const r = await fetch(`${BASE}${path}`);
  return { status: r.status, type: r.headers.get("content-type") ?? "", body: await r.text() };
};

/** Strip scripts/styles, then tags, to approximate what a non-JS crawler reads. */
const extractable = (html) =>
  html
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const jsonLd = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1].replace(/\\u003c/g, "<")),
  );

// ── 1. robots.txt ──────────────────────────────────────────────────────────
console.log("\n── robots.txt ──");
const robots = await text("/robots.txt");
check(robots.status === 200, "robots.txt served", `status ${robots.status}`);

// The bots that actually produce citations. If any of these is disallowed the
// site drops out of that assistant's answers entirely.
const ANSWER_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
];

// robots.txt groups: "User-Agent: x" lines accumulate until a directive line.
const groups = [];
{
  let agents = [];
  let rules = [];
  for (const raw of robots.body.split("\n")) {
    const line = raw.trim();
    const ua = line.match(/^User-Agent:\s*(.+)$/i);
    if (ua) {
      if (rules.length) {
        groups.push({ agents, rules });
        agents = [];
        rules = [];
      }
      agents.push(ua[1].trim());
      continue;
    }
    const rule = line.match(/^(Allow|Disallow):\s*(.*)$/i);
    if (rule) rules.push({ kind: rule[1].toLowerCase(), path: rule[2].trim() });
  }
  if (agents.length) groups.push({ agents, rules });
}

for (const bot of ANSWER_BOTS) {
  const group =
    groups.find((g) => g.agents.some((a) => a.toLowerCase() === bot.toLowerCase())) ??
    groups.find((g) => g.agents.includes("*"));
  const blanketBlock = group?.rules.some((r) => r.kind === "disallow" && r.path === "/");
  check(
    group && !blanketBlock,
    `${bot} may crawl the site`,
    group ? "matched a group with Disallow: /" : "no matching group and no wildcard fallback",
  );
}

check(
  /Sitemap:\s*https:\/\/\S+\/sitemap\.xml/.test(robots.body),
  "robots.txt points at the XML sitemap",
  "no Sitemap: directive found",
);

// ── 2. llms.txt ────────────────────────────────────────────────────────────
console.log("\n── llms.txt ──");
const llms = await text("/llms.txt");
check(llms.status === 200, "/llms.txt served", `status ${llms.status}`);
check(
  llms.type.includes("text/plain"),
  "/llms.txt is text/plain",
  `content-type was "${llms.type}"`,
);
check(/^# \S/m.test(llms.body), "/llms.txt opens with an H1", "no leading '# Name' line");
check(/^> \S/m.test(llms.body), "/llms.txt carries a blockquote summary", "no '> ' line");

const links = [...llms.body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
check(links.length >= 20, "/llms.txt lists the site", `only ${links.length} links`);

// Resolve every link against the server under test, not the canonical host —
// production URLs are correct in the file but not fetchable from a dev box.
const origin = new URL(BASE);
const broken = [];
await Promise.all(
  links.map(async (href) => {
    const u = new URL(href);
    u.protocol = origin.protocol;
    u.host = origin.host;
    const r = await fetch(u, { redirect: "follow" });
    if (!r.ok) broken.push(`${href} -> ${r.status}`);
  }),
);
check(broken.length === 0, "every /llms.txt link resolves", broken.slice(0, 5).join(", "));

// The claims this file exists to keep out. See data/llms.ts.
const BANNED = [/\b\d{1,2}\.\d%\s*uptime/i, /\b\d+M\+/, /trustpilot/i, /wordpress\.org/i];
const leaked = BANNED.filter((re) => re.test(llms.body)).map(String);
check(
  leaked.length === 0,
  "/llms.txt carries no unverified proof claims",
  `matched ${leaked.join(", ")}`,
);

// ── 3. No-JavaScript extraction ────────────────────────────────────────────
console.log("\n── extraction without JavaScript ──");
const PAGES = [
  "/",
  "/pricing",
  "/convoai",
  "/callflow-ai",
  "/automations",
  "/wordpress-hosting",
  "/website-design",
  "/seo",
  "/faq",
];
const pages = new Map();
for (const path of PAGES) {
  const res = await text(path);
  pages.set(path, res);
  const prose = extractable(res.body);
  check(
    res.status === 200 && prose.length > 1200,
    `${path} — readable without JS`,
    `status ${res.status}, ${prose.length} chars of extractable text`,
  );
}

// ── 4. Structured data ─────────────────────────────────────────────────────
console.log("\n── structured data ──");
const ORG_ID = "https://serverlys.com/#organization";

const home = jsonLd(pages.get("/").body);
const flat = home.flatMap((b) => b["@graph"] ?? [b]);
check(
  flat.some((n) => n["@type"] === "Organization" && n["@id"] === ORG_ID),
  "homepage declares the canonical Organization node",
  "no Organization at " + ORG_ID,
);

const SERVICE_PAGES = ["/convoai", "/callflow-ai", "/automations", "/website-design", "/seo"];
for (const path of SERVICE_PAGES) {
  const blocks = jsonLd(pages.get(path).body).flatMap((b) => b["@graph"] ?? [b]);
  const service = blocks.find((n) => n["@type"] === "Service");
  check(service != null, `${path} — emits a Service node`, "none found");
  if (service) {
    check(
      service.provider?.["@id"] === ORG_ID,
      `${path} — Service provider resolves to the Organization`,
      `provider was ${JSON.stringify(service.provider)}`,
    );
    check(
      typeof service.description === "string" && service.description.length > 40,
      `${path} — Service carries a description`,
      "missing or too short",
    );
  }
}

// An anonymous Organization stub anywhere defeats entity resolution.
for (const [path, res] of pages) {
  const blocks = jsonLd(res.body).flatMap((b) => b["@graph"] ?? [b]);
  const stubs = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (node["@type"] === "Organization" && !node["@id"]) stubs.push(node.name ?? "unnamed");
    for (const v of Object.values(node)) walk(v);
  };
  blocks.forEach(walk);
  check(stubs.length === 0, `${path} — no anonymous Organization stubs`, stubs.join(", "));
}

// ── Result ─────────────────────────────────────────────────────────────────
console.log(
  failures.length
    ? `\n✗ ${failures.length} FAILED, ${passed} passed\n` + failures.map((f) => "  " + f).join("\n")
    : `\n✓ ALL PASS — ${passed} passed, 0 failed`,
);
process.exit(failures.length ? 1 : 0);
