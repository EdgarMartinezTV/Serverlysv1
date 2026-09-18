/**
 * Technical SEO audit.
 *
 * Parses RAW SSR HTML rather than the rendered DOM — that is what a crawler
 * receives before running JavaScript, so it is the correct thing to assert on.
 *
 * Usage: node scripts/seo-audit.mjs [origin]
 */
import { readFileSync } from "node:fs";

const ORIGIN = process.argv[2] ?? "http://localhost:3000";

const findings = [];
const note = (level, page, msg) => findings.push({ level, page, msg });
const fail = (page, msg) => note("FAIL", page, msg);
const warn = (page, msg) => note("WARN", page, msg);

const get = async (path) => {
  const res = await fetch(ORIGIN + path, { redirect: "manual" });
  return { status: res.status, html: await res.text(), headers: res.headers };
};

const meta = (html, key) => {
  const patterns = [
    new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]+content="([^"]*)"`, "i"),
    new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${key}"`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  return null;
};
const tag = (html, re) => (html.match(re) || [null, null])[1];
const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

// ── Discover pages from the sitemap, plus known non-indexed surfaces ───────
const sitemapXml = (await get("/sitemap.xml")).html;
const sitemapUrls = all(sitemapXml, /<loc>([^<]+)<\/loc>/g);
const paths = sitemapUrls.map((u) => new URL(u).pathname || "/");
const extraPaths = ["/design-system", "/this-page-does-not-exist"];

console.log(
  `Auditing ${paths.length} indexable page(s) + ${extraPaths.length} control(s)\n`,
);

const seenTitles = new Map();
const seenDescriptions = new Map();
const internalLinks = new Set();

for (const path of [...paths, ...extraPaths]) {
  const { status, html } = await get(path);
  const isIndexable = paths.includes(path);
  const label = path;

  if (status !== 200 && isIndexable) {
    fail(label, `sitemap URL returns ${status}`);
    continue;
  }

  // ── Title ──
  const title = tag(html, /<title>([^<]*)<\/title>/i);
  if (!title) fail(label, "no <title>");
  else {
    if (title.length > 60)
      warn(label, `title ${title.length} chars — may truncate in SERP`);
    if (title.length < 15) warn(label, `title only ${title.length} chars`);
    if (isIndexable) {
      if (seenTitles.has(title))
        fail(label, `duplicate title with ${seenTitles.get(title)}`);
      else seenTitles.set(title, label);
    }
  }

  // ── Description ──
  const desc = meta(html, "description");
  if (!desc && isIndexable) fail(label, "no meta description");
  else if (desc) {
    if (desc.length > 165)
      warn(label, `description ${desc.length} chars — may truncate`);
    if (desc.length < 70) warn(label, `description only ${desc.length} chars`);
    if (isIndexable) {
      if (seenDescriptions.has(desc))
        fail(label, `duplicate description with ${seenDescriptions.get(desc)}`);
      else seenDescriptions.set(desc, label);
    }
  }

  // ── Canonical ──
  const canonical = tag(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i);
  if (isIndexable) {
    if (!canonical) fail(label, "no canonical");
    else {
      if (!canonical.startsWith("http")) fail(label, "canonical is not absolute");
      const expected = path === "/" ? "" : path;
      if (canonical && !canonical.endsWith(expected))
        fail(label, `canonical ${canonical} does not self-reference ${path}`);
      if (canonical.includes("?")) fail(label, "canonical contains a query string");
    }
  }

  // ── Robots ──
  const robotsMeta = meta(html, "robots") ?? "";
  if (isIndexable && /noindex/i.test(robotsMeta))
    fail(label, "indexable page is marked noindex");
  if (!isIndexable && !/noindex/i.test(robotsMeta))
    fail(label, "non-indexable page is missing noindex");

  // ── OpenGraph / Twitter ──
  if (isIndexable) {
    for (const k of [
      "og:title",
      "og:description",
      "og:url",
      "og:type",
      "og:site_name",
      "og:image",
    ]) {
      if (!meta(html, k)) fail(label, `missing ${k}`);
    }
    for (const k of [
      "twitter:card",
      "twitter:title",
      "twitter:description",
      "twitter:image",
    ]) {
      if (!meta(html, k)) fail(label, `missing ${k}`);
    }
    const ogUrl = meta(html, "og:url");
    if (ogUrl && canonical && ogUrl !== canonical)
      warn(label, "og:url differs from canonical");
  }

  // ── Headings ──
  const headings = [...html.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => ({
    level: Number(m[1][1]),
    text: m[2].replace(/<[^>]*>/g, "").trim(),
  }));
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length === 0) fail(label, "no <h1>");
  if (h1s.length > 1) fail(label, `${h1s.length} <h1> elements`);
  for (let i = 1; i < headings.length; i++) {
    const jump = headings[i].level - headings[i - 1].level;
    if (jump > 1)
      fail(
        label,
        `heading skip h${headings[i - 1].level}→h${headings[i].level} at "${headings[i].text.slice(0, 40)}"`,
      );
  }

  // ── Images ──
  for (const img of [...html.matchAll(/<img[^>]*>/gi)].map((m) => m[0])) {
    if (!/\salt=/.test(img)) fail(label, `<img> without alt: ${img.slice(0, 70)}`);
  }

  // ── lang ──
  if (!/<html[^>]+lang="/.test(html)) fail(label, "<html> has no lang attribute");

  // ── Structured data ──
  const blocks = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((m) => m[1]);
  if (isIndexable && blocks.length === 0) fail(label, "no structured data");
  const types = [];
  for (const raw of blocks) {
    try {
      const json = JSON.parse(raw.replace(/\\u003c/g, "<"));
      const collect = (n) => {
        if (Array.isArray(n)) return n.forEach(collect);
        if (n && typeof n === "object") {
          if (n["@type"]) types.push(n["@type"]);
          if (n["@graph"]) collect(n["@graph"]);
        }
      };
      collect(json);
    } catch (e) {
      fail(label, `invalid JSON-LD: ${e.message}`);
    }
  }
  // Required-property validation. Checking that a @type is merely PRESENT is
  // not enough — Google rejects nodes that lack required fields, and a
  // dangling @id reference defeats the entire point of an entity graph.
  {
    const nodes = [];
    const refs = [];
    const walk = (n) => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (n && typeof n === "object") {
        if (n["@type"]) nodes.push(n);
        if (n["@id"] && Object.keys(n).length === 1) refs.push(n["@id"]);
        Object.values(n).forEach((v) => {
          if (v && typeof v === "object") walk(v);
        });
      }
    };
    for (const raw of blocks) {
      try {
        walk(JSON.parse(raw.replace(/\\u003c/g, "<")));
      } catch {
        /* reported above */
      }
    }
    const ids = new Set(nodes.map((n) => n["@id"]).filter(Boolean));
    const need = (n, keys, what) =>
      keys.forEach((k) => {
        if (!n[k]) fail(label, `${what} missing ${k}`);
      });

    for (const n of nodes) {
      switch (n["@type"]) {
        case "Organization":
          need(n, ["name", "url"], "Organization");
          if (n.address || n.geo || n.priceRange)
            fail(
              label,
              "Organization has address/geo/priceRange — prohibited by the entity rules",
            );
          break;
        case "WebSite":
          need(n, ["url", "name", "publisher"], "WebSite");
          break;
        case "Product":
          need(n, ["name", "description", "offers"], "Product");
          break;
        case "AggregateOffer":
          need(n, ["priceCurrency", "lowPrice", "availability"], "AggregateOffer");
          if (n.lowPrice && !/^\d+\.\d{2}$/.test(String(n.lowPrice)))
            fail(
              label,
              `AggregateOffer lowPrice is not a clean decimal: ${n.lowPrice}`,
            );
          if (n.highPrice && Number(n.highPrice) < Number(n.lowPrice))
            fail(label, "AggregateOffer highPrice < lowPrice");
          break;
        case "BreadcrumbList":
          if (!Array.isArray(n.itemListElement))
            fail(label, "BreadcrumbList has no itemListElement");
          else
            n.itemListElement.forEach((li, i) => {
              if (li.position !== i + 1)
                fail(label, `BreadcrumbList position out of order at index ${i}`);
              if (!li.name || !li.item)
                fail(label, "BreadcrumbList item missing name or item");
            });
          break;
        case "FAQPage": {
          const entries = n.mainEntity ?? [];
          if (!Array.isArray(entries) || entries.length === 0)
            fail(label, "FAQPage has no mainEntity");
          const visible = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
          for (const q of entries) {
            if (!q.name || !q.acceptedAnswer?.text)
              fail(label, "FAQ Question missing name or acceptedAnswer.text");
            // Marking up Q&A that is not rendered misrepresents the page.
            else if (!visible.includes(q.name.slice(0, 30)))
              fail(label, `FAQ question not visible on page: "${q.name.slice(0, 46)}"`);
          }
          break;
        }
      }
    }
    for (const ref of refs)
      if (!ids.has(ref)) fail(label, `dangling @id reference: ${ref}`);
  }

  if (isIndexable) {
    if (!types.includes("Organization")) fail(label, "no Organization node");
    if (types.filter((t) => t === "Organization").length > 1)
      fail(label, "duplicate Organization nodes");
    if (!types.includes("WebSite")) fail(label, "no WebSite node");
    if (path !== "/" && !types.includes("BreadcrumbList"))
      warn(label, "no BreadcrumbList on a child page");
  }

  // ── Collect internal links ──
  for (const href of all(html, /<a[^>]+href="([^"]+)"/g)) {
    if (href.startsWith("/") && !href.startsWith("//"))
      internalLinks.add(href.split("#")[0] || "/");
  }

  // ── Anchor text quality ──
  for (const m of html.matchAll(/<a[^>]*>([\s\S]{0,120}?)<\/a>/g)) {
    const text = m[1]
      .replace(/<[^>]*>/g, "")
      .trim()
      .toLowerCase();
    if (["click here", "here", "read more", "learn more", "more"].includes(text))
      warn(label, `non-descriptive anchor text: "${text}"`);
  }
}

// ── Internal links must not 404 ────────────────────────────────────────────
console.log(`Checking ${internalLinks.size} unique internal link target(s)…\n`);
const broken = [];
for (const href of internalLinks) {
  const { status } = await get(href);
  if (status >= 400) broken.push(`${href} → ${status}`);
}
if (broken.length) {
  for (const b of broken)
    fail(
      "(internal links)",
      `links to a ${b.split("→")[1].trim()}: ${b.split("→")[0].trim()}`,
    );
}

// ── robots.txt ─────────────────────────────────────────────────────────────
const robotsTxt = (await get("/robots.txt")).html;
if (!/Sitemap:/i.test(robotsTxt)) fail("/robots.txt", "no Sitemap directive");
if (!/Disallow: \/api\//.test(robotsTxt)) warn("/robots.txt", "/api/ not disallowed");
if (/Disallow: \/$/m.test(robotsTxt))
  warn("/robots.txt", "entire site disallowed (expected on staging only)");

/* ── Redirect hygiene ──────────────────────────────────────────────────────
 *
 * ⚠ ADDED BECAUSE NOTHING CHECKED IT. Every `redirects()` entry in
 * next.config.ts is a promise that an old URL still reaches content, and the
 * two ways that promise breaks silently are a CHAIN (301 → 301 → 200, which
 * bleeds signal and costs a round trip) and a LOOP. Both look fine in the
 * config file and are only visible by following the hops.
 *
 * Parsed out of next.config rather than hand-listed, so adding a redirect
 * without testing it is not possible. Parameterised sources (`:slug`) are
 * skipped — there is no single URL to follow for a pattern.
 */
{
  const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
  const sources = [...config.matchAll(/source:\s*"([^"]+)"/g)]
    .map((m) => m[1])
    .filter((src) => !src.includes(":") && !src.includes("*"));

  for (const src of sources) {
    let url = src;
    const hops = [];
    for (let i = 0; i < 6; i += 1) {
      const res = await fetch(ORIGIN + url, { redirect: "manual" });
      hops.push(res.status);
      if (res.status < 300 || res.status >= 400) break;
      const loc = res.headers.get("location") ?? "";
      const next = loc.startsWith("http") ? new URL(loc).pathname : loc;
      if (next === url) {
        fail("(redirects)", `${src} redirects to itself`);
        break;
      }
      url = next;
    }
    const redirects = hops.filter((st) => st >= 300 && st < 400).length;
    const landed = hops[hops.length - 1];
    if (redirects === 0) warn("(redirects)", `${src} does not redirect (${landed})`);
    else if (redirects > 1)
      fail("(redirects)", `${src} chains through ${redirects} hops → ${url}`);
    else if (landed !== 200)
      fail("(redirects)", `${src} redirects to a ${landed}: ${url}`);
  }
}

/* ── Trailing-slash canonicalisation ───────────────────────────────────────
 *
 * Next's default (`trailingSlash: false`) 308s `/path/` to `/path`, which is
 * what we want — one canonical spelling per URL. It is checked rather than
 * assumed because flipping that config, or adding middleware that intercepts
 * first, would silently produce two crawlable URLs for every page on the site.
 */
{
  for (const path of ["/hosting", "/pricing", "/blog"]) {
    const res = await fetch(`${ORIGIN}${path}/`, { redirect: "manual" });
    if (res.status < 300 || res.status >= 400) {
      fail("(trailing slash)", `${path}/ returns ${res.status} instead of redirecting`);
      continue;
    }
    const loc = res.headers.get("location") ?? "";
    if (!loc.endsWith(path))
      fail("(trailing slash)", `${path}/ redirects to ${loc}, expected ${path}`);
  }
}

/* ── Inbound internal links ────────────────────────────────────────────────
 *
 * ⚠ THIS IS THE CHECK THAT CAUGHT A REAL BUG. `relatedArticles` used to return
 * the first three posts in array order, so every article in a category linked
 * to the same three and the rest received no inbound link beyond the blog
 * index. Eighteen articles sat on a single inbound link. Nothing in the audit
 * noticed, because none of them was ORPHANED — they were reachable, just
 * starved, and "reachable" is all a link checker looks for.
 *
 * So this measures the DISTRIBUTION, not merely the existence, of inbound
 * links. A page nothing links to is a failure. A page one thing links to is a
 * warning: legitimate for a legal page reached only from the footer, and a
 * symptom for anything else.
 */
{
  const inbound = new Map(paths.map((p) => [p, new Set()]));
  for (const page of paths) {
    const { html } = await get(page);
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const target = m[1].replace(/\/$/, "") || "/";
      if (inbound.has(target) && target !== page) inbound.get(target).add(page);
    }
  }
  for (const [page, from] of inbound) {
    if (from.size === 0) fail("(internal links)", `${page} is orphaned — nothing links to it`);
    else if (from.size === 1)
      warn("(internal links)", `${page} has one inbound link (from ${[...from][0]})`);
  }
}

// ── Report ─────────────────────────────────────────────────────────────────
const fails = findings.filter((f) => f.level === "FAIL");
const warns = findings.filter((f) => f.level === "WARN");
for (const f of [...fails, ...warns]) {
  console.log(`  ${f.level === "FAIL" ? "✗" : "!"} ${f.page.padEnd(22)} ${f.msg}`);
}
console.log(
  `\n${fails.length === 0 ? "✓" : "✗"} ${fails.length} failure(s), ${warns.length} warning(s)\n`,
);
process.exit(fails.length === 0 ? 0 : 1);
