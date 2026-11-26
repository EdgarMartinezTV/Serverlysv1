import { createRequire } from "module";
import fs from "fs";
const require = createRequire("/Users/edgarmartinez/Desktop/ConvoAI/package.json");
const { chromium } = require("playwright-core");
const { SCENES, render } = await import("./scenes.mjs");
const want = fs.readFileSync(process.argv[2], "utf8").trim().split("\n");
const only = process.argv[3] ? process.argv[3].split(",") : null;
const missing = want.filter((s) => !SCENES[s]); if (missing.length) console.log("MISSING", missing);
fs.mkdirSync("out", { recursive: true });
const b = await chromium.launch({ executablePath: process.env.HOME + "/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-x64/chrome-headless-shell", args: ["--allow-file-access-from-files"] });
const p = await b.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
for (const s of want) { if (!SCENES[s] || (only && !only.includes(s))) continue;
  fs.writeFileSync(`out/${s}.html`, render(s));
  await p.goto("file://" + process.cwd() + `/out/${s}.html`); await p.waitForTimeout(250);
  await p.screenshot({ path: `out/${s}.png` }); }
await b.close(); console.log("done");
