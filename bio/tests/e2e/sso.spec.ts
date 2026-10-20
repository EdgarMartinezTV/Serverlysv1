import { expect, test } from "@playwright/test";
import { sql } from "./helpers";

/**
 * "Continue with your Serverlys account". Needs the app started with
 * SERVERLYS_OIDC_ISSUER=http://localhost:3299 SERVERLYS_OIDC_CLIENT_ID=bio
 * SERVERLYS_OIDC_CLIENT_SECRET=mock-secret and tests/fixtures/mock-oidc.mjs running.
 */
test.skip(!process.env.SSO_MOCK, "set SSO_MOCK=1 with the mock provider running");

test("Serverlys SSO creates a verified account, then signs the same person back in", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: /Continue with your Serverlys account/ }).click();
  await page.waitForURL(/\/dashboard/);
  const rows = await sql<{ emailVerifiedAt: Date | null; ssoSubject: string }>(`SELECT "emailVerifiedAt", "ssoSubject" FROM "User" WHERE email = 'sso-user@example.com'`);
  expect(rows).toHaveLength(1);
  expect(rows[0].ssoSubject).toBe("whmcs-sso-user@example.com");
  expect(rows[0].emailVerifiedAt).not.toBeNull();
  await page.context().clearCookies();
  await page.goto("/login");
  await page.getByRole("link", { name: /Continue with your Serverlys account/ }).click();
  await page.waitForURL(/\/dashboard/);
  expect((await sql(`SELECT 1 FROM "User" WHERE email = 'sso-user@example.com'`)).length).toBe(1);
});
