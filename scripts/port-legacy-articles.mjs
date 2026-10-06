/**
 * One-shot port of the legacy serverlys.com blog into data/articles/legacy.
 *
 * WHY THIS IS A SCRIPT AND NOT A HAND EDIT. 71 posts, ~155,000 words, all of
 * it currently live and indexed. Retyping that loses content silently; a
 * converter either produces a block or throws, and the assertions at the end
 * are what make "nothing was dropped" a checked claim instead of a hope.
 *
 * WHAT IT DOES NOT DO. It makes no editorial judgements. The source posts
 * contain claims this site's rules forbid — invented customer counts,
 * unattributed statistics, first-person testing claims. Those are handled by
 * a separate reviewed pass (scripts/audit-article-claims.mjs), deliberately
 * NOT by regex here, because "rewrite this sentence to be true" is not a
 * transformation a script can be trusted with.
 *
 * Usage: node scripts/port-legacy-articles.mjs [sourceDir]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const SOURCE = resolve(
  process.argv[2] ?? join(process.env.HOME, "Desktop/Archive/blog"),
);
const OUT_DIR = resolve("src/data/articles/legacy");

/* ── Category assignment ───────────────────────────────────────────────────
 *
 * Hand-assigned, not inferred from the title. These are the topic clusters the
 * archive is organised into, and each one has a commercial page it should feed
 * links into — "WordPress" to /wordpress-hosting, "Security" to /managed-
 * hosting, "Domains" to /register-domain. Getting this wrong just scatters the
 * internal link graph, which is the main thing 71 posts are FOR.
 */
const CATEGORY = {
  "ai-tools-small-business": "AI",
  "best-free-wordpress-themes": "WordPress",
  "best-hosting-startups": "Hosting",
  "best-web-hosting-small-business": "Hosting",
  "best-wordpress-hosting-2026": "WordPress",
  "build-website-from-scratch": "Getting started",
  "cdn-setup-guide": "Performance",
  "cloud-vs-shared-hosting": "Hosting",
  "contact-form-guide": "WordPress",
  "conversion-rate-optimization": "Getting started",
  "core-web-vitals-guide": "Performance",
  "cpanel-beginners-guide": "Hosting",
  "cpanel-vs-plesk": "Hosting",
  "database-optimization": "Performance",
  "dns-records-explained": "Domains",
  "domain-name-generators": "Domains",
  "domain-name-seo": "Domains",
  "domain-parking-guide": "Domains",
  "domain-transfer-guide": "Domains",
  "downtime-cost-calculator": "Hosting",
  "email-security-spf-dkim-dmarc": "Security",
  "expired-domains-guide": "Domains",
  "free-ssl-setup": "Security",
  "freelancer-vs-agency": "Getting started",
  "gdpr-website-compliance": "Security",
  "google-analytics-4-guide": "Getting started",
  "google-analytics-setup": "WordPress",
  "google-pagespeed-score": "Performance",
  "green-web-hosting": "Hosting",
  "gzip-vs-brotli": "Performance",
  "hosting-red-flags": "Hosting",
  "hosting-uptime-explained": "Hosting",
  "htaccess-redirects": "Hosting",
  "http3-quic-guide": "Performance",
  "image-optimization-web": "Performance",
  "install-wordpress-guide": "WordPress",
  "litespeed-vs-apache-nginx": "Performance",
  "local-seo-guide": "Getting started",
  "malware-scanning-tools": "Security",
  "managed-hosting-guide": "Hosting",
  "migrate-website-new-host": "Hosting",
  "mobile-speed-optimization": "Performance",
  "must-have-wordpress-plugins": "WordPress",
  "mysql-database-guide": "Hosting",
  "nameservers-explained": "Domains",
  "nvme-vs-ssd-hosting": "Hosting",
  "online-store-setup-guide": "Ecommerce",
  "reduce-ttfb": "Performance",
  "setup-business-email": "Getting started",
  "speed-up-wordpress": "WordPress",
  "ssl-certificate-explained": "Security",
  "stop-ddos-attacks": "Security",
  "subdomain-vs-subdirectory": "Domains",
  "tld-comparison-guide": "Domains",
  "two-factor-authentication": "Security",
  "web-application-firewall": "Security",
  "web-hosting-cost-2026": "Hosting",
  "website-backup-strategy": "Security",
  "website-backup-tutorial": "Hosting",
  "website-caching-guide": "Performance",
  "website-cost-guide": "Getting started",
  "website-hacked-recovery": "Security",
  "website-security-checklist": "Security",
  "website-speed-seo": "Performance",
  "whois-privacy-protection": "Domains",
  "woocommerce-vs-shopify": "Ecommerce",
  "wordpress-security-guide": "WordPress",
  "wordpress-seo-guide": "WordPress",
  "wordpress-staging-site": "WordPress",
  "wordpress-vs-webflow-squarespace": "Getting started",
  "wordpress-white-screen-death": "WordPress",
};

/* ── Link rewriting ────────────────────────────────────────────────────────
 *
 * The posts link to the OLD site's URLs. Those paths now only exist as 308s,
 * and an internal link that redirects is a wasted hop on every crawl plus a
 * slower click for a reader. Rewrite them at the source so the archive links
 * straight at the live route.
 */
const LINK_MAP = {
  "/web-hosting": "/hosting",
  "/web-design": "/website-design",
  "/store-hosting": "/ecommerce-hosting",
  "/custom-development": "/website-development",
  "/seo-marketing": "/seo",
  "/socialmedia-management": "/social-media",
  "/domains": "/domain-name",
  "/wp-migrations": "/migrations",
  "/managed-wordpress": "/wordpress-hosting",
  "/features": "/hosting",
  "/case-studies": "/our-process",
  "/success-stories": "/our-process",
  "/callflow": "https://callflow.serverlys.com/",
  "/contact": "/support",
  "/contact-us": "/support",
  "/chatrep": "https://convoai.cloud/",
};

/** Routes that exist on the new site. Anything else is dropped to plain text. */
const LIVE_ROUTES = new Set(
  readdirSync(resolve("src/app"), { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("["))
    .map((d) => `/${d.name}`)
    .concat("/"),
);

const ENTITIES = {
  "&mdash;": "—",
  "&ndash;": "–",
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&hellip;": "…",
  "&times;": "×",
  "&rarr;": "→",
  "&check;": "✓",
  "&deg;": "°",
  "&eacute;": "é",
  "&le;": "≤",
  "&ge;": "≥",
  "&cent;": "¢",
  "&bull;": "•",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&euro;": "€",
  "&pound;": "£",
  "&minus;": "−",
};

function decode(s) {
  return s
    .replace(/&[a-zA-Z#0-9]+;/g, (e) => {
      if (ENTITIES[e]) return ENTITIES[e];
      const num = e.match(/^&#(\d+);$/);
      if (num) return String.fromCodePoint(Number(num[1]));
      const hex = e.match(/^&#x([0-9a-fA-F]+);$/);
      if (hex) return String.fromCodePoint(parseInt(hex[1], 16));
      throw new Error(`Unmapped HTML entity: ${e}`);
    })
    .replace(/\s+/g, " ")
    .trim();
}

function rewriteHref(href) {
  let h = href.trim();
  h = h.replace(/^https?:\/\/(www\.)?serverlys\.com/, "");
  if (h === "") h = "/";
  // Legacy callflow children all collapse onto the one product page.
  if (h.startsWith("/callflow/")) h = "https://callflow.serverlys.com/";
  h = h.replace(/\.html$/, "");
  h = LINK_MAP[h] ?? h;
  return h;
}

/**
 * Inline HTML → the marker syntax documented on `Block`.
 *
 * Order matters: <code> is converted before <strong>, so a bold word inside a
 * code span does not produce nested markers the renderer cannot parse.
 */
/** Inline tags this converter knows how to represent. */
const KNOWN_INLINE =
  /<\/?(code|strong|b|em|i|span|a|br|sup|sub|small|abbr|u|mark|time|kbd)\b[^>]*>/gi;

function inline(html, { slug, drops }) {
  /*
   * Check for tags we cannot represent FIRST, against the raw input.
   *
   * It cannot be done at the end: the posts contain escaped markup inside
   * <code> (`&lt;video&gt;`), and by the end of this function that has been
   * decoded to a literal "<video>" in the output string. A trailing scan reads
   * that as an unhandled tag and throws on perfectly good content.
   */
  const stray = html.replace(KNOWN_INLINE, "").match(/<[^>]+>/g);
  if (stray) {
    throw new Error(`${slug}: unhandled inline tags ${[...new Set(stray)].join(", ")}`);
  }

  let s = html;

  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_m, inner) => {
    const t = decode(inner.replace(/<[^>]+>/g, ""));
    // Backticks inside a backtick span would break the marker; the source has
    // none, but fail loudly rather than emit something unparseable.
    if (t.includes("`")) throw new Error(`${slug}: backtick inside <code>`);
    return t ? `\`${t}\`` : "";
  });

  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag, inner) => {
    const t = inner.replace(/<[^>]+>/g, "").trim();
    if (!t) return "";
    // Nested markers are not representable. Emphasis is the one we drop.
    if (t.includes("**")) return t;
    return `**${decode(t)}**`;
  });

  /*
   * <em>/<i> carry no distinct marker: the design system has no italic body
   * face, and faking one with <strong> would overstate the emphasis.
   *
   * The \b is load-bearing. Without it the `i` alternative matches the start of
   * <img>, <input> and <iframe> — and because <code> spans are decoded BEFORE
   * this line runs, `&lt;img&gt;` has already become a literal <img> by the
   * time it gets here. The result was code spans silently emptying themselves:
   * "width and height attributes on your `` tags".
   */
  s = s.replace(/<\/?(em|i|span)\b[^>]*>/gi, "");

  s = s.replace(
    /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_m, href, inner) => {
      const label = decode(inner.replace(/<[^>]+>/g, ""));
      if (!label) return "";
      const h = rewriteHref(href);
      // An internal link to a route that no longer exists becomes plain text
      // rather than a 404 the reader discovers by clicking.
      const internal = h.startsWith("/") && !h.startsWith("//");
      if (internal) {
        const top = `/${h.split("/")[1] ?? ""}`;
        const isBlog = h.startsWith("/blog/");
        if (!isBlog && !LIVE_ROUTES.has(top) && h !== "/") {
          drops.push(`${slug}: dropped dead link ${href}`);
          return label;
        }
      }
      if (label.includes("]") || h.includes(")")) {
        drops.push(`${slug}: dropped unrepresentable link ${href}`);
        return label;
      }
      return `[${label}](${h})`;
    },
  );

  s = s.replace(/<br\s*\/?>/gi, " ");

  return decode(s);
}

const slugId = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

/** Split the article body into top-level elements, in document order. */
function topLevel(html) {
  const out = [];
  const re =
    /<(h2|h3|p|ul|ol|table|pre|blockquote|div)\b([^>]*)>([\s\S]*?)<\/\1>|<(hr|img)\b[^>]*\/?>/gi;
  for (let m = re.exec(html); m !== null; m = re.exec(html)) {
    if (m[1]) out.push({ tag: m[1].toLowerCase(), attrs: m[2] ?? "", inner: m[3] });
    else out.push({ tag: m[4].toLowerCase(), attrs: "", inner: "" });
  }
  return out;
}

/**
 * Split a list's inner HTML into its TOP-LEVEL <li> contents.
 *
 * A plain non-greedy /<li>(.*?)<\/li>/ is wrong here: six of the ported posts
 * nest a <ul> inside an <li>, and the lazy match stops at the nested list's
 * first </li>, silently truncating the item and leaving stray tags behind.
 * This walks the string tracking list depth instead, so a nested list stays
 * attached to the item that owns it.
 */
function splitListItems(inner) {
  const items = [];
  const tag = /<(\/?)(ul|ol|li)\b[^>]*>/gi;
  let depth = 0;
  let start = -1;

  for (let m = tag.exec(inner); m !== null; m = tag.exec(inner)) {
    const closing = m[1] === "/";
    const name = m[2].toLowerCase();

    if (name === "li") {
      if (depth > 0) continue; // belongs to a nested list
      if (!closing) {
        start = m.index + m[0].length;
      } else if (start >= 0) {
        items.push(inner.slice(start, m.index));
        start = -1;
      }
      continue;
    }

    // ul/ol: opening one inside an item means we are now nested.
    if (closing) depth = Math.max(0, depth - 1);
    else depth += 1;
  }

  // An unclosed final <li> is legal HTML; take the remainder.
  if (start >= 0) items.push(inner.slice(start));

  return items;
}

function listItems(inner, ctx) {
  const items = [];

  for (const raw of splitListItems(inner)) {
    // Capture group 2 is the nested list's INNER html. Passing the wrapper
    // tags back into listItems would make splitListItems see the opening <ul>
    // as a nesting level and skip every item inside it — which silently
    // dropped six-item sub-lists down to nothing.
    const nested = raw.match(/<(ul|ol)\b[^>]*>([\s\S]*)<\/\1>/i);

    if (!nested) {
      const t = inline(raw, ctx);
      if (t) items.push(t);
      continue;
    }

    /*
     * The block format has no nested list, and adding one would complicate
     * every consumer for twelve occurrences across 71 posts. Flatten instead:
     * the parent's own text becomes an item, and each child becomes a
     * following item prefixed with an em dash, which is how the subordination
     * still reads on the page.
     */
    const lead = inline(raw.slice(0, nested.index), ctx);
    if (lead) items.push(lead);
    for (const child of listItems(nested[2], ctx)) items.push(`— ${child}`);

    const trail = inline(raw.slice(nested.index + nested[0].length), ctx);
    if (trail) items.push(trail);
  }

  return items;
}

function parseTable(inner, ctx) {
  const head = [];
  const headRow = inner.match(/<thead[\s\S]*?<tr[^>]*>([\s\S]*?)<\/tr>/i);
  if (headRow) {
    const re = /<th\b[^>]*>([\s\S]*?)<\/th>/gi;
    for (let m = re.exec(headRow[1]); m !== null; m = re.exec(headRow[1]))
      head.push(inline(m[1], ctx));
  }

  const rows = [];
  const body = inner.match(/<tbody[^>]*>([\s\S]*)<\/tbody>/i)?.[1] ?? inner;
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  for (let r = rowRe.exec(body); r !== null; r = rowRe.exec(body)) {
    if (/<th\b/i.test(r[1]) && head.length > 0) continue;
    const cells = [];
    const cellRe = /<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;
    for (let c = cellRe.exec(r[1]); c !== null; c = cellRe.exec(r[1]))
      cells.push(inline(c[1], ctx));
    if (cells.length) rows.push(cells);
  }
  return { head, rows };
}

function parseArticle(slug, html) {
  const ctx = { slug, drops: [] };
  const blocks = [];

  for (const el of topLevel(html)) {
    switch (el.tag) {
      case "h2": {
        const text = inline(el.inner, ctx);
        if (text) blocks.push({ type: "h2", id: slugId(text), text });
        break;
      }
      case "h3": {
        const text = inline(el.inner, ctx);
        if (text) blocks.push({ type: "h3", text });
        break;
      }
      case "p": {
        const text = inline(el.inner, ctx);
        if (text) blocks.push({ type: "p", text });
        break;
      }
      case "ul":
      case "ol": {
        const items = listItems(el.inner, ctx);
        if (items.length) blocks.push({ type: el.tag, items });
        break;
      }
      case "table": {
        const { head, rows } = parseTable(el.inner, ctx);
        if (rows.length) blocks.push({ type: "table", head, rows });
        break;
      }
      case "pre": {
        // <pre> preserves whitespace, so it must NOT go through the
        // whitespace-collapsing decode path the prose uses.
        const raw = el.inner.replace(/<\/?code[^>]*>/gi, "");
        if (/<[^>]+>/.test(raw)) throw new Error(`${slug}: markup inside <pre>`);
        const code = decodePre(raw);
        if (code) blocks.push({ type: "code", code });
        break;
      }
      case "blockquote": {
        const text = inline(el.inner.replace(/<\/?p[^>]*>/gi, " "), ctx)
          // The source wraps these in typographic quotes; the blockquote
          // styling already signals the quotation.
          .replace(/^["“]\s*/, "")
          .replace(/\s*["”]$/, "");
        if (text) blocks.push({ type: "quote", text });
        break;
      }
      case "div": {
        /*
         * The only <div> in the source is `.tip-box`, and there are 133 of
         * them. They are a single <p> opening with a bolded label — which is
         * exactly the shape of the existing `callout` block, so they become
         * callouts rather than being flattened into ordinary paragraphs (which
         * would lose the emphasis the author gave them) or skipped (which
         * silently deleted them, and is what the retention check caught).
         */
        if (!/\btip-box\b/.test(el.attrs)) {
          throw new Error(`${slug}: unrecognised <div${el.attrs}>`);
        }

        const para = el.inner.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        if (!para) throw new Error(`${slug}: tip-box with no paragraph`);

        const label = para[1].match(/^\s*<strong>([\s\S]*?)<\/strong>/i);
        const title = label ? decode(label[1]).replace(/:$/, "") : "Worth knowing";
        const rest = label ? para[1].slice(label[0].length) : para[1];
        const text = inline(rest, ctx);

        if (text) blocks.push({ type: "callout", title, text });
        break;
      }
      // <hr>/<img> carry no content this format represents.
      default:
        break;
    }
  }

  return { blocks, drops: ctx.drops };
}

function decodePre(s) {
  return s
    .replace(/&[a-zA-Z#0-9]+;/g, (e) => ENTITIES[e] ?? e)
    .replace(/^\n+|\s+$/g, "");
}

const q = (s) => JSON.stringify(s);

function emit(article) {
  const body = article.body
    .map((b) => {
      switch (b.type) {
        case "h2":
          return `    { type: "h2", id: ${q(b.id)}, text: ${q(b.text)} },`;
        case "h3":
          return `    { type: "h3", text: ${q(b.text)} },`;
        case "p":
          return `    { type: "p", text: ${q(b.text)} },`;
        case "ul":
        case "ol":
          return `    {\n      type: ${q(b.type)},\n      items: [\n${b.items
            .map((i) => `        ${q(i)},`)
            .join("\n")}\n      ],\n    },`;
        case "quote":
          return `    { type: "quote", text: ${q(b.text)} },`;
        case "callout":
          return `    {\n      type: "callout",\n      title: ${q(b.title)},\n      text: ${q(b.text)},\n    },`;
        case "code":
          return `    { type: "code", code: ${q(b.code)} },`;
        case "table":
          return `    {\n      type: "table",\n      head: [${b.head
            .map(q)
            .join(", ")}],\n      rows: [\n${b.rows
            .map((r) => `        [${r.map(q).join(", ")}],`)
            .join("\n")}\n      ],\n    },`;
        default:
          throw new Error(`unknown block ${b.type}`);
      }
    })
    .join("\n");

  return `import type { Article } from "../types";

export const article: Article = {
  slug: ${q(article.slug)},
  title: ${q(article.title)},
  description: ${q(article.description)},
  category: ${q(article.category)},
  published: ${q(article.published)},
  body: [
${body}
  ],
};
`;
}

/* ── Run ───────────────────────────────────────────────────────────────── */

const slugs = readdirSync(SOURCE, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(SOURCE, d.name, "index.html")))
  .map((d) => d.name)
  .sort();

mkdirSync(OUT_DIR, { recursive: true });

const allDrops = [];
const summary = [];

for (const slug of slugs) {
  const html = readFileSync(join(SOURCE, slug, "index.html"), "utf8");

  const articleHtml = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (!articleHtml) throw new Error(`${slug}: no <article> element`);

  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1) throw new Error(`${slug}: no <h1>`);

  const desc = html.match(/<meta name="description" content="([^"]*)"/i);
  if (!desc) throw new Error(`${slug}: no meta description`);

  const published = html.match(/"datePublished"\s*:\s*"([^"]+)"/);
  if (!published) throw new Error(`${slug}: no datePublished`);

  const category = CATEGORY[slug];
  if (!category) throw new Error(`${slug}: no category assigned`);

  const { blocks, drops } = parseArticle(slug, articleHtml[1]);
  allDrops.push(...drops);

  if (blocks.length < 5) throw new Error(`${slug}: only ${blocks.length} blocks parsed`);

  const article = {
    slug,
    title: decode(h1[1].replace(/<[^>]+>/g, "")),
    description: decode(desc[1]),
    category,
    published: published[1].slice(0, 10),
    body: blocks,
  };

  writeFileSync(join(OUT_DIR, `${slug}.ts`), emit(article));

  /*
   * Retention check.
   *
   * The failure mode of a regex converter is not a crash, it is a paragraph
   * that quietly vanishes because a tag nested in a way the pattern did not
   * expect. Counting words on both sides is the cheapest way to make that
   * loud: the source's prose (code blocks excluded on both sides, since they
   * are counted differently) against what actually got written.
   */
  const sourceWords = decode(
    articleHtml[1]
      .replace(/<(pre|script|style)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    // Entities must be decoded the SAME way both sides do it. Replacing them
    // with a space instead splits "$3&ndash;$15" into two tokens on the source
    // side and one on the ported side, which reads as 2% of the article going
    // missing on every post that quotes a price range.
    .split(/\s+/)
    .filter(Boolean).length;

  const words = blocks.reduce((n, b) => {
    const t =
      b.type === "ul" || b.type === "ol"
        ? b.items.join(" ")
        : b.type === "table"
          ? [...b.head, ...b.rows.flat()].join(" ")
          : b.type === "callout"
            ? `${b.title} ${b.text}`
            : b.type === "code"
              ? ""
              : b.text;
    return n + (t.trim() ? t.trim().split(/\s+/).length : 0);
  }, 0);
  const retention = words / sourceWords;
  if (retention < 0.97) {
    throw new Error(
      `${slug}: only ${(retention * 100).toFixed(1)}% of source words survived ` +
        `(${sourceWords} → ${words}). Something was dropped — fix the parser.`,
    );
  }

  summary.push({ slug, blocks: blocks.length, words, sourceWords, retention });
}

// Barrel. Explicit imports rather than a glob so the bundler can tree-shake
// and so an orphaned file shows up as a diff rather than silently shipping.
const barrel = `/**
 * The ported serverlys.com archive — 71 posts that were live and indexed
 * before this rebuild. GENERATED by scripts/port-legacy-articles.mjs from
 * ~/Desktop/Archive/blog, then edited by hand for the claims the originals
 * made that this site's editorial rules forbid.
 *
 * Do NOT re-run the generator over these files without re-applying that pass:
 * it reads the unedited source and would restore every claim that was removed.
 */
${slugs.map((s) => `import { article as ${s.replace(/-/g, "_")} } from "./${s}";`).join("\n")}
import type { Article } from "../types";

export const legacyArticles: readonly Article[] = [
${slugs.map((s) => `  ${s.replace(/-/g, "_")},`).join("\n")}
];
`;
writeFileSync(join(OUT_DIR, "index.ts"), barrel);

console.log(`Ported ${summary.length} articles → ${OUT_DIR}`);
console.log(`  blocks: ${summary.reduce((n, s) => n + s.blocks, 0)}`);
console.log(`  words:  ${summary.reduce((n, s) => n + s.words, 0).toLocaleString()}`);

const byRetention = [...summary].sort((a, b) => a.retention - b.retention);
console.log(`  retention: min ${(byRetention[0].retention * 100).toFixed(1)}% (${byRetention[0].slug})`);
console.log(
  `             all ${summary.length} posts \u2265 97% of source prose words`,
);
if (allDrops.length) {
  console.log(`\n${allDrops.length} link(s) dropped:`);
  for (const d of allDrops) console.log(`  ${d}`);
}
