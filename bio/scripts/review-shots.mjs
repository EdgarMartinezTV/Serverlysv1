import { chromium } from "@playwright/test";
import { Client } from "pg";
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
const email = "design-review-" + Date.now() + "@example.com";
await p.goto("http://localhost:3200/signup"); await p.getByLabel("Name").fill("Design Review"); await p.getByLabel("Email").fill(email); await p.getByLabel("Password").fill("correct horse battery 9"); await p.getByLabel(/I agree/).check(); await p.getByRole("button",{name:"Create account"}).click(); await p.waitForURL(/verify-email/);
try { process.loadEnvFile(".env"); } catch {}
const c = new Client({ connectionString: process.env.DATABASE_URL }); await c.connect();
const { rows } = await c.query('select body from "OutboundEmail" where "to"=$1 order by "createdAt" desc limit 1',[email]); await c.end();
await p.goto(rows[0].body.match(/https?:\/\/\S+/)[0]);
await p.goto("http://localhost:3200/dashboard/new?template=personal-ava"); await p.waitForURL(/editor/);
await p.addStyleTag({content:"nextjs-portal{display:none!important}"}); await p.waitForTimeout(1500);
await p.locator('[data-section="blocks"]').click(); await p.waitForTimeout(500);
await p.screenshot({ path: "/private/tmp/claude-501/-Users-edgarmartinez/4d2cc0a2-24c0-45b3-9354-e6b0e3bb5c69/scratchpad/lt/editor.png" });
await p.goto("http://localhost:3200/dashboard/templates"); await p.addStyleTag({content:"nextjs-portal{display:none!important}"}); await p.waitForTimeout(1500); await p.screenshot({ path: "/private/tmp/claude-501/-Users-edgarmartinez/4d2cc0a2-24c0-45b3-9354-e6b0e3bb5c69/scratchpad/lt/gallery.png" });
await p.goto("http://localhost:3200/dashboard"); await p.addStyleTag({content:"nextjs-portal{display:none!important}"}); await p.waitForTimeout(800); await p.screenshot({ path: "/private/tmp/claude-501/-Users-edgarmartinez/4d2cc0a2-24c0-45b3-9354-e6b0e3bb5c69/scratchpad/lt/dash.png" });
await b.close();
