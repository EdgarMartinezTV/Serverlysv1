/**
 * Multi-route Lighthouse runner with budgets — the performance regression gate.
 *
 *   node scripts/lighthouse.mjs [origin] [--runs=3] [--form=mobile,desktop]
 *                               [--routes=/,/pricing] [--json=out.json]
 *
 * Runs each route N times per form factor SEQUENTIALLY and reports the MEDIAN.
 * Sequential is load-bearing: two headless Chromes running at once starve each
 * other's compositor and first paint lands seconds late, which reads as a
 * performance regression that does not exist (measured 2026-10-04: desktop
 * 91 in parallel, 100 alone).
 *
 * Measure against a PRODUCTION build (`npm run build && npm start`) or a
 * deployed origin — never `next dev`. Exits 1 when any median breaches a
 * budget in `BUDGETS`, so it can gate CI, but it is NOT wired into `npm run
 * verify`: Lighthouse needs Chrome and minutes, and a build pipeline that
 * fails on lab noise gets switched off.
 *
 * WHY MOBILE PERFORMANCE HAS A LOWER FLOOR THAN 100. Lighthouse's mobile
 * score is simulated (Lantern, slow 4G, 4x CPU) and charges the LCP for every
 * byte REQUESTED before it, not only the bytes it needs. React + the Next
 * runtime are ~130KB gzipped of async script fetched from <head> on every App
 * Router page, so they land in that estimate even though the hero is plain
 * server HTML that really paints in ~300ms. Stripping every script from the
 * homepage as an experiment only reached 99. See SEO-TECHNICAL-AUDIT.md.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;

const ORIGIN = (
  args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000"
).replace(/\/$/, "");
const RUNS = Number(flag("runs", "3"));
const FORMS = flag("form", "mobile,desktop").split(",");
const OUT = flag("json", null);

/** The money pages plus one representative of each template. */
const DEFAULT_ROUTES = [
  "/",
  "/hosting",
  "/cloud-hosting",
  "/wordpress-hosting",
  "/ecommerce-hosting",
  "/managed-hosting",
  "/pricing",
  "/domain-name",
  "/ai-agents",
  "/website-development",
  "/seo",
  "/blog",
  "/blog/core-web-vitals-for-small-sites",
];
const ROUTES = flag("routes", null)?.split(",") ?? DEFAULT_ROUTES;

/**
 * Budgets, set from measured medians on 2026-10-04 — a floor to defend, not an
 * aspiration. Raise them as the numbers improve; never lower one to make a
 * run pass without writing down why.
 */
const BUDGETS = {
  mobile: {
    performance: 85,
    accessibility: 100,
    "best-practices": 100,
    seo: 100,
    lcp: 4500,
    cls: 0.05,
    tbt: 200,
  },
  desktop: {
    performance: 95,
    accessibility: 100,
    "best-practices": 100,
    seo: 100,
    lcp: 1500,
    cls: 0.05,
    tbt: 100,
  },
};

const CHROME_PATH =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const dir = mkdtempSync(join(tmpdir(), "lh-"));
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

function runOnce(url, form) {
  const out = join(dir, "r.json");
  execFileSync(
    "npx",
    [
      "-y",
      "lighthouse@12",
      url,
      "--output=json",
      `--output-path=${out}`,
      "--quiet",
      "--chrome-flags=--headless=new --no-sandbox",
      ...(form === "desktop" ? ["--preset=desktop"] : []),
    ],
    { env: { ...process.env, CHROME_PATH }, stdio: ["ignore", "ignore", "inherit"] },
  );
  const r = JSON.parse(readFileSync(out, "utf8"));
  const score = (k) => Math.round((r.categories[k]?.score ?? 0) * 100);
  const m = r.audits.metrics.details.items[0];
  const failing = [];
  for (const [cat, c] of Object.entries(r.categories)) {
    for (const ref of c.auditRefs) {
      const a = r.audits[ref.id];
      if (ref.weight > 0 && a.score !== null && a.score < 1)
        failing.push(`${cat}:${ref.id}`);
    }
  }
  return {
    performance: score("performance"),
    accessibility: score("accessibility"),
    "best-practices": score("best-practices"),
    seo: score("seo"),
    fcp: Math.round(m.firstContentfulPaint),
    lcp: Math.round(m.largestContentfulPaint),
    si: Math.round(m.speedIndex),
    tbt: Math.round(m.totalBlockingTime),
    cls: Math.round(m.cumulativeLayoutShift * 1000) / 1000,
    lcpElement:
      r.audits[
        "largest-contentful-paint-element"
      ]?.details?.items?.[0]?.items?.[0]?.node?.snippet?.slice(0, 120) ?? "",
    failing,
  };
}

const results = [];
let breaches = 0;
for (const form of FORMS) {
  console.log(`\n${form.toUpperCase()} — median of ${RUNS} run(s), ${ORIGIN}`);
  console.log("perf a11y bp  seo  | FCP    LCP    SI     TBT   CLS   | route");
  for (const route of ROUTES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) runs.push(runOnce(ORIGIN + route, form));
    const med = Object.fromEntries(
      Object.keys(runs[0])
        .filter((k) => k !== "failing" && k !== "lcpElement")
        .map((k) => [k, median(runs.map((r) => r[k]))]),
    );
    const failing = [...new Set(runs.flatMap((r) => r.failing))];
    const b = BUDGETS[form];
    const over = Object.entries(b).filter(([k, v]) =>
      ["lcp", "cls", "tbt"].includes(k) ? med[k] > v : med[k] < v,
    );
    breaches += over.length;
    const p = (v, n) => String(v).padEnd(n);
    console.log(
      `${p(med.performance, 4)} ${p(med.accessibility, 4)} ${p(med["best-practices"], 3)} ${p(med.seo, 4)} | ${p(med.fcp, 6)} ${p(med.lcp, 6)} ${p(med.si, 6)} ${p(med.tbt, 5)} ${p(med.cls, 5)} | ${route}` +
        (over.length ? `  ✗ ${over.map(([k]) => k).join(",")}` : ""),
    );
    if (failing.length) console.log(`     failing audits: ${failing.join(" ")}`);
    console.log(`     LCP element: ${runs[0].lcpElement}`);
    results.push({ form, route, ...med, failing });
  }
}

if (OUT) writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(
  breaches ? `\n✗ ${breaches} budget breach(es)` : "\n✓ all medians within budget",
);
process.exit(breaches ? 1 : 0);
