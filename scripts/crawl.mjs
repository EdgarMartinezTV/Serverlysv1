/**
 * Full-site internal crawl.
 *
 * Follows every internal link from the homepage until nothing new is found,
 * then reports one row per route: status, whether the shared header and footer
 * rendered, whether the SEO essentials are present, and whether it has an h1.
 *
 * This is the check that catches what a route registry cannot: a link written
 * by hand in page copy that points at a path nobody registered.
 */
const ORIGIN = process.argv[2] ?? "http://localhost:3000";

const seen = new Set();
const queue = ["/"];
const rows = [];
/** Where each path was first linked from, so a bad link can be found. */
const referrer = new Map([["/", "(seed)"]]);

const strip = (href) => {
  const [p] = href.split("#");
  return p.replace(/\/$/, "") || "/";
};

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);

  const res = await fetch(ORIGIN + path, { redirect: "manual" });
  const status = res.status;

  if (status >= 300 && status < 400) {
    const to = res.headers.get("location") ?? "";
    rows.push({ path, status, note: `→ ${to.replace(ORIGIN, "")}` });
    const next = strip(to.replace(ORIGIN, ""));
    if (next.startsWith("/") && !seen.has(next)) {
      queue.push(next);
      referrer.set(next, path);
    }
    continue;
  }

  if (status !== 200) {
    rows.push({ path, status, note: `from ${referrer.get(path)}` });
    continue;
  }

  const html = await res.text();
  const has = (re) => re.test(html);

  rows.push({
    path,
    status,
    header: has(/<header/i),
    footer: has(/<footer/i),
    h1: (html.match(/<h1/gi) ?? []).length,
    title: (html.match(/<title>([^<]*)<\/title>/i) ?? [])[1] ?? "",
    desc: has(/name="description"/i),
    canonical: has(/rel="canonical"/i),
    og: has(/property="og:image"/i),
    jsonld: (html.match(/application\/ld\+json/gi) ?? []).length,
  });

  for (const m of html.matchAll(/href="(\/[^"#][^"]*)"/g)) {
    const next = strip(m[1]);
    if (next.startsWith("/api/") || next.startsWith("/og/")) continue;
    if (next.startsWith("/_next/")) continue;
    if (/\.(xml|txt|png|jpg|webp|svg|ico)$/.test(next)) continue;
    if (!seen.has(next) && !queue.includes(next)) {
      queue.push(next);
      referrer.set(next, path);
    }
  }
}

rows.sort((a, b) => a.path.localeCompare(b.path));

const bad = rows.filter((r) => r.status >= 400);
const noHeader = rows.filter((r) => r.status === 200 && !r.header);
const noFooter = rows.filter((r) => r.status === 200 && !r.footer);
const badH1 = rows.filter((r) => r.status === 200 && r.h1 !== 1);
const noSeo = rows.filter(
  (r) => r.status === 200 && (!r.title || !r.desc || !r.canonical || !r.og),
);

console.log(`Crawled ${rows.length} routes from ${ORIGIN}\n`);
console.log(
  "status  header  footer  h1  seo   jsonld  route",
);
console.log("-".repeat(74));
for (const r of rows) {
  if (r.status !== 200) {
    console.log(`${String(r.status).padEnd(8)}${"—".padEnd(8)}${"—".padEnd(8)}${"—".padEnd(4)}${"—".padEnd(6)}${"—".padEnd(8)}${r.path}  ${r.note ?? ""}`);
    continue;
  }
  const seo = r.title && r.desc && r.canonical && r.og ? "ok" : "MISSING";
  console.log(
    `${String(r.status).padEnd(8)}${(r.header ? "yes" : "NO").padEnd(8)}${(r.footer ? "yes" : "NO").padEnd(8)}` +
      `${String(r.h1).padEnd(4)}${seo.padEnd(6)}${String(r.jsonld).padEnd(8)}${r.path}`,
  );
}

console.log("");
const problems =
  bad.length + noHeader.length + noFooter.length + badH1.length + noSeo.length;
if (bad.length) console.log(`✗ ${bad.length} route(s) returned 4xx/5xx:`, bad.map((r) => `${r.path} (${r.status}, from ${r.note})`).join(", "));
if (noHeader.length) console.log(`✗ ${noHeader.length} without a header:`, noHeader.map((r) => r.path).join(", "));
if (noFooter.length) console.log(`✗ ${noFooter.length} without a footer:`, noFooter.map((r) => r.path).join(", "));
if (badH1.length) console.log(`✗ ${badH1.length} without exactly one h1:`, badH1.map((r) => `${r.path} (${r.h1})`).join(", "));
if (noSeo.length) console.log(`✗ ${noSeo.length} missing SEO essentials:`, noSeo.map((r) => r.path).join(", "));
console.log(problems ? `\n✗ ${problems} problem(s)` : "\n✓ every reachable route is complete");
process.exit(problems ? 1 : 0);
