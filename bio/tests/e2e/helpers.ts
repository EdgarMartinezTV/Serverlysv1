import { Client } from "pg";
import type { Page } from "@playwright/test";

try {
  process.loadEnvFile(".env");
} catch {}

export async function sql<T = Record<string, unknown>>(q: string, params: unknown[] = []): Promise<T[]> {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  try {
    return (await c.query(q, params)).rows as T[];
  } finally {
    await c.end();
  }
}

/** The newest logged email to `to` (dev: emails are stored, not sent). */
export async function lastEmail(to: string, kind: string) {
  const rows = await sql<{ body: string }>(`SELECT body FROM "OutboundEmail" WHERE "to" = $1 AND kind = $2 ORDER BY "createdAt" DESC LIMIT 1`, [to, kind]);
  return rows[0]?.body ?? "";
}

export function linkIn(body: string): string {
  const m = body.match(/https?:\/\/\S+/);
  if (!m) throw new Error("No link in email: " + body);
  return m[0];
}

export function uniqueEmail(tag: string) {
  return `e2e-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e4)}@example.com`;
}

export async function signup(page: Page, email: string, password = "correct horse battery 9") {
  await page.goto("/signup");
  await page.getByLabel("Name").fill("E2E Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByLabel(/I agree to the/).check();
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL(/verify-email/);
}

export async function verify(page: Page, email: string) {
  const link = linkIn(await lastEmail(email, "verify-email"));
  await page.goto(link.replace(/^https?:\/\/[^/]+/, ""));
  await page.waitForURL(/dashboard/);
}

/** Wait until the editor reports every change as saved. */
export async function waitSaved(page: Page) {
  await page.locator('[data-save-state="saved"]').waitFor({ timeout: 15_000 });
}

/** Sign up + verify a fresh user; returns their email. */
export async function newVerifiedUser(page: Page, tag: string) {
  const email = uniqueEmail(tag);
  await signup(page, email);
  await verify(page, email);
  return email;
}

/** Create a page from a template via the real onboarding route; returns its id. */
export async function createPageFromTemplate(page: Page, template = "personal-ava") {
  await page.goto(`/dashboard/new?template=${template}`);
  await page.waitForURL(/\/editor\//);
  return page.url().split("/editor/")[1].split("?")[0];
}

/** Same-origin JSON call from inside the page (sends Origin + session cookie). */
export async function api<T = unknown>(page: Page, url: string, method = "GET", body?: unknown): Promise<{ status: number; data: T }> {
  return page.evaluate(
    async ([u, m, b]) => {
      const res = await fetch(u as string, { method: m as string, headers: b ? { "content-type": "application/json" } : undefined, body: b ? JSON.stringify(b) : undefined });
      const text = await res.text();
      let data: unknown = text;
      try {
        data = JSON.parse(text);
      } catch {}
      return { status: res.status, data: data as never };
    },
    [url, method, body] as const,
  );
}

export async function publish(page: Page, pageId: string, username: string) {
  const r = await api<{ username?: string; error?: string }>(page, `/api/pages/${pageId}/publish`, "POST", { username });
  if (r.status !== 200) throw new Error(`publish failed ${r.status} ${JSON.stringify(r.data)}`);
  return r.data;
}

export const uname = (p: string) => `${p}${Date.now().toString(36)}${Math.floor(Math.random() * 1e3)}`;
