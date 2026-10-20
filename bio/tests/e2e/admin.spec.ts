import { expect, test } from "@playwright/test";
import { signup, sql, uniqueEmail, verify } from "./helpers";

/**
 * Admin area: role gate, user directory, page moderation (suspend → public
 * 404, restore → 200) and the audit trail behind it.
 */

test("non-admins are kept out of /admin", async ({ page }) => {
  const email = uniqueEmail("nonadmin");
  await signup(page, email);
  await verify(page, email);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("/admin/users");
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("admin suspends and restores a published page, with an audit trail", async ({ page, browser, baseURL }) => {
  const email = uniqueEmail("admin");
  await signup(page, email);
  await verify(page, email);
  const [{ id: adminId }] = await sql<{ id: string }>(`UPDATE "User" SET role = 'ADMIN' WHERE email = $1 RETURNING id`, [email]);

  // A published page owned by a separate user, set up directly in the DB.
  const ownerEmail = uniqueEmail("owner");
  const [{ id: ownerId }] = await sql<{ id: string }>(`INSERT INTO "User" (id, email, name, "emailVerifiedAt", "updatedAt") VALUES ($1, $2, 'Owner', now(), now()) RETURNING id`, [`u${Date.now()}`, ownerEmail]);
  const username = `adm${Date.now().toString(36)}`;
  const pageId = `p${Date.now()}`;
  await sql(
    `INSERT INTO "BioPage" (id, "ownerId", name, username, status, draft, published, "publishedAt", "updatedAt")
     SELECT $1, $2, 'Moderation target', $3, 'PUBLISHED', content, content, now(), now() FROM "Template" WHERE id = 'personal-ava'`,
    [pageId, ownerId, username],
  );

  const visitor = await (await browser.newContext({ baseURL })).newPage();
  expect((await visitor.goto(`/${username}`))!.status()).toBe(200);

  // Overview + users directory render.
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Platform overview" })).toBeVisible();
  await page.goto(`/admin/users?q=${encodeURIComponent(ownerEmail)}`);
  await expect(page.locator(`[data-user-row="${ownerEmail}"]`)).toBeVisible();
  await expect(page.locator("body")).not.toContainText("$argon2");

  // Suspend from the pages directory.
  await page.goto(`/admin/pages?q=${username}`);
  const row = page.locator(`[data-admin-page="${username}"]`);
  await row.getByLabel("Suspension reason").fill("E2E: phishing test");
  await row.getByRole("button", { name: "Suspend" }).click();
  await expect(page.locator("[data-admin-flash]")).toHaveText("Page suspended.");
  expect((await visitor.goto(`/${username}`))!.status()).toBe(404);

  // Restore.
  await page.locator(`[data-admin-page="${username}"]`).getByRole("button", { name: "Restore" }).click();
  await expect(page.locator("[data-admin-flash]")).toHaveText("Page restored.");
  expect((await visitor.goto(`/${username}`))!.status()).toBe(200);

  // Audit trail.
  const audit = await sql<{ action: string }>(`SELECT action FROM "AuditLog" WHERE "actorId" = $1 AND "targetId" = $2 ORDER BY "createdAt"`, [adminId, pageId]);
  expect(audit.map((a) => a.action)).toEqual(["admin.page.suspend", "admin.page.restore"]);
  await page.goto("/admin/audit?action=admin.page");
  await expect(page.locator('[data-audit="admin.page.suspend"]').first()).toBeVisible();

  // The other sections render for an admin.
  for (const path of ["/admin/reports", "/admin/domains", "/admin/templates", "/admin/templates/personal-ava", "/admin/health", `/admin/pages/${pageId}`]) {
    const res = await page.goto(path);
    expect(res!.status(), path).toBe(200);
  }
  await expect(page.locator("body")).toContainText("Moderation target");
  await page.goto("/admin/health");
  await expect(page.locator('[data-health="Database (Postgres)"]')).toHaveText("OK");
  await expect(page.locator('[data-health="Object storage"]')).toHaveText("OK");
});
