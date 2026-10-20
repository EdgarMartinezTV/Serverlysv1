// Usage: node scripts/shoot.mjs <outDir> <width> <path...>
import { chromium } from "@playwright/test";
const [out, width, ...paths] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const page = await ctx.newPage();
for (const p of paths) {
  const errors = [];
  page.removeAllListeners("pageerror");
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://localhost:3200${p}`, { waitUntil: "networkidle" });
  // Grow the viewport to the page height: a fixed background (and lazy
  // iframes) only paint inside the viewport, so fullPage capture lies.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width: Number(width), height: Math.min(h, 12000) });
  await page.waitForTimeout(600);
  const name = p.replace(/[^\w-]+/g, "_") || "root";
  await page.screenshot({ path: `${out}/${name}-${width}.png`, fullPage: false });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.setViewportSize({ width: Number(width), height: 900 });
  console.log(p, "overflow", overflow, errors.length ? errors : "");
}
await browser.close();
