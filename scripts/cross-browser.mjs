/**
 * Cross-engine, cross-device layout check.
 *
 * WHY THIS EXISTS. `scripts/shoot.mjs` and `scripts/a11y.mjs` both drive
 * Chromium, which means every check in this repo was blind to the two engines
 * that actually differ: WebKit (every browser on iOS, and Safari everywhere)
 * and Gecko. That is not a theoretical gap — it hid a header that made the dev
 * server unusable in Safari for months, and Chromium could never have caught
 * it, because Chromium is the engine that special-cases localhost.
 *
 * WHAT IT ASSERTS, per page × engine × viewport:
 *   · the page does not scroll horizontally
 *   · no element is wider than the viewport unless an ancestor clips or
 *     scrolls it (a deliberate bleed or a carousel is fine; a runaway table
 *     is not)
 *   · no uncaught JS errors and no failed requests
 *   · every <img> that is in the layout actually decoded
 *
 * Engines come from Playwright, which is NOT a dependency of this project —
 * it is a few hundred MB of browsers and does not belong in the deploy image.
 * Run it on demand:
 *
 *   npm i --no-save playwright
 *   npx playwright install webkit firefox chromium
 *   npm run audit:browsers                       # against the dev server
 *   npm run audit:browsers -- https://host:3443  # against a build
 *
 * `--no-save` is not a style choice: the Dockerfile runs `npm ci`, which
 * installs devDependencies, so putting playwright in package.json would pull
 * the browsers into the deploy image.
 *
 * ⚠ TESTING A PRODUCTION BUILD REQUIRES HTTPS. The production CSP carries
 * `upgrade-insecure-requests`, which rewrites every subresource to https.
 * Over plain http that is correct behaviour and total breakage at the same
 * time, so point this at a TLS-terminated origin, not at http://localhost.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium, webkit, firefox;
try {
  ({ chromium, webkit, firefox } = require("playwright"));
} catch {
  console.error(
    "playwright is not installed. Install it WITHOUT saving it:\n\n" +
      "  npm i --no-save playwright\n" +
      "  npx playwright install webkit firefox chromium\n\n" +
      "--no-save is deliberate: the Dockerfile runs `npm ci`, which installs\n" +
      "devDependencies, so adding playwright to package.json would pull a few\n" +
      "hundred MB of browsers into the deploy image.",
  );
  process.exit(2);
}

const ORIGIN = process.argv[2] ?? "http://localhost:3000";

/** Pages chosen for the layout risks they carry, not for importance. */
const PAGES = [
  ["/", "home — the banner, rails and every band"],
  ["/hosting", "pricing tables"],
  ["/pricing", "the widest table on the site"],
  ["/blog", "76-item grouped archive"],
  ["/blog/cpanel-beginners-guide", "article with tables and code blocks"],
  ["/domain-name", "search UI"],
  ["/faq", "accordions"],
];

/** Smallest shipping phone through to a 4K desktop. */
const VIEWPORTS = [
  ["320", 320, 568, 2],
  ["375", 375, 667, 2],
  ["390", 390, 844, 3],
  ["768", 768, 1024, 2],
  ["1024", 1024, 768, 2],
  ["1025", 1025, 800, 2],
  ["1440", 1440, 900, 2],
  ["1920", 1920, 1080, 1],
];

/*
 * Passed as a FUNCTION, not a string. Playwright evaluates a string predicate
 * via eval(), and the production CSP is `script-src 'self' 'unsafe-inline'`
 * with no 'unsafe-eval' — so Firefox blocks it and reports a page error, which
 * this script would then dutifully report as a defect in the site. Function
 * form uses Playwright's binding and leaves the CSP alone.
 */
const PROBE = () => {
  const de = document.documentElement;
  const errs = [];
  const overflow = de.scrollWidth - de.clientWidth;
  if (overflow > 0) errs.push("page scrolls horizontally by " + overflow + "px");

  // An element may exceed the viewport only if something clips or scrolls it.
  const contained = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const o = getComputedStyle(n).overflowX;
      if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return true;
    }
    return false;
  };
  const wide = [...document.body.querySelectorAll("*")]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > de.clientWidth + 1 && r.width > 0 && !contained(el);
    })
    .slice(0, 5)
    .map((el) => el.tagName.toLowerCase() + "." + (el.className.toString().split(" ")[0] || "?")
      + " " + Math.round(el.getBoundingClientRect().width) + "px");
  for (const w of wide) errs.push("overflows viewport: " + w);

  const broken = [...document.images]
    .filter((i) => i.getBoundingClientRect().width > 0 && !(i.complete && i.naturalWidth > 0))
    .slice(0, 5)
    .map((i) => (i.currentSrc || i.src || "?").split("/").pop().slice(0, 40));
  for (const b of broken) errs.push("image did not decode: " + b);

  return errs;
};

const ENGINES = [
  ["chromium", chromium],
  ["webkit", webkit],
  ["firefox", firefox],
];

let failures = 0;
let checks = 0;

for (const [engineName, engine] of ENGINES) {
  let browser;
  try {
    browser = await engine.launch();
  } catch (e) {
    console.log(`\n${engineName}: NOT INSTALLED — ${e.message.split("\n")[0]}`);
    console.log(`  npx playwright install ${engineName}`);
    failures++;
    continue;
  }

  console.log(`\n=== ${engineName} ${browser.version()} ===`);

  for (const [path, why] of PAGES) {
    const problems = [];
    for (const [label, w, h, dpr] of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: h },
        deviceScaleFactor: dpr,
        // isMobile/hasTouch are Chromium-only; passing them elsewhere throws.
        ...(engineName === "chromium" && w < 768 ? { isMobile: true, hasTouch: true } : {}),
        ignoreHTTPSErrors: true,
      });
      const page = await ctx.newPage();
      const runtime = [];
      page.on("pageerror", (e) => runtime.push("js: " + e.message.split("\n")[0].slice(0, 90)));
      page.on("requestfailed", (r) => {
        const t = r.failure()?.errorText ?? "";
        // Aborted lazy loads are normal when a context closes mid-flight.
        if (!/ABORTED|NS_BINDING_ABORTED|cancell?ed/i.test(t)) {
          runtime.push(`req: ${r.url().split("/").pop().slice(0, 40)} ${t.slice(0, 40)}`);
        }
      });

      await page.goto(ORIGIN + path, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
      /*
       * Force every image to load, rather than scrolling and hoping.
       *
       * Walking the page does not reliably trigger `loading="lazy"`: the
       * IntersectionObserver callbacks are coalesced during a fast programmatic
       * scroll, so images pass through the viewport without ever starting —
       * the same caveat scripts/shoot.mjs documents for scroll-reveal. The
       * assertion below then reports "did not decode" for an image that is
       * merely still lazy, which is a false alarm that buries real ones.
       *
       * Flipping them to eager asks the question this check actually cares
       * about: is every image URL on this page valid and decodable by this
       * engine?
       */
      await page
        .evaluate(() => {
          for (const i of document.images) {
            i.loading = "eager";
            i.setAttribute("fetchpriority", "high");
          }
          scrollTo(0, 0);
        })
        .catch(() => {});
      /*
       * Wait for every in-layout image to finish decoding before asserting.
       *
       * A fixed settle is not enough: `next/image` transcodes on first request
       * per (source, width, quality, format), and turning a 1.7 MB PNG into
       * AVIF takes seconds of CPU. Each engine requests different widths
       * (different DPR, different `sizes` match), so a sweep across sixteen
       * viewports asks the optimiser for dozens of fresh encodes. Asserting
       * before they land reports "image did not decode" for images that are
       * merely still being made.
       */
      await page
        .waitForFunction(
          () =>
            [...document.images]
              .filter((i) => i.getBoundingClientRect().width > 0)
              .every((i) => i.complete && i.naturalWidth > 0),
          null,
          { timeout: 45000 },
        )
        .catch(() => {});
      await page.waitForTimeout(400);

      checks++;
      const errs = [...(await page.evaluate(PROBE)), ...runtime];
      if (errs.length) problems.push(`${label}: ${errs.join("; ")}`);
      await ctx.close();
    }

    const ok = problems.length === 0;
    if (!ok) failures += problems.length;
    console.log(`  ${ok ? "✓" : "✗"} ${path.padEnd(30)} ${why}`);
    for (const p of problems) console.log(`      ${p}`);
  }

  await browser.close();
}

console.log(
  failures
    ? `\n✗ ${failures} problem(s) across ${checks} page×viewport checks`
    : `\n✓ ${checks} page×viewport checks clean across ${ENGINES.length} engines`,
);
process.exit(failures ? 1 : 0);
