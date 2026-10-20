import { expect, test } from "@playwright/test";
import { lastEmail, linkIn, sql, uniqueEmail, waitSaved } from "./helpers";
import path from "node:path";

/**
 * The critical customer journey, end to end, in one browser session plus an
 * incognito visitor context. Step numbers match the brief.
 */
test("create, publish, visit, track, edit and republish a bio page", async ({ page, browser, baseURL }) => {
  const email = uniqueEmail("journey");
  const username = `e2e${Date.now().toString(36)}`;

  // 1–2. Marketing page → "Create Your Free Bio" (when the marketing site is running).
  const marketing = process.env.MARKETING_BASE_URL;
  if (marketing) {
    await page.goto(`${marketing}/bio`);
    await page.getByRole("link", { name: /Create Your Free Bio/i }).first().click();
    await page.waitForURL(/\/signup/);
  } else {
    await page.goto("/signup");
  }

  // 3. Register.
  await page.getByLabel("Name").fill("Journey Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("correct horse battery 9");
  await page.getByLabel(/I agree to the/).check();
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL(/verify-email/);

  // 4. Verify the account via the emailed link.
  const link = linkIn(await lastEmail(email, "verify-email"));
  await page.goto(link.replace(/^https?:\/\/[^/]+/, ""));
  await page.waitForURL(/\/dashboard/);
  await expect(page.getByText("Email confirmed")).toBeVisible();

  // 5. Choose a template.
  await page.goto("/dashboard/new");
  await page.locator('[data-template="personal-ava"]').click();
  await page.waitForURL(/\/editor\/[^/?]+\?wizard=1/);
  const pageId = page.url().split("/editor/")[1].split("?")[0];
  await expect(page.getByText("Step 2 of 3")).toBeVisible();

  // 6. Profile information.
  await page.locator('[data-section="profile"]').click();
  await page.getByLabel("Display name").fill("Journey Tester");
  await page.getByLabel("Bio", { exact: true }).fill("Testing every step of Serverlys Bio.");

  // 7. Upload an avatar (through the crop dialog).
  await page.locator('input[data-upload="avatar"]').setInputFiles(path.join(__dirname, "../fixtures/avatar.jpg"));
  await page.locator("[data-crop-confirm]").click();
  await expect(page.locator(".bio-avatar[src^='/media/']")).toBeVisible();

  // 8. Add three links.
  const links = [
    { title: "First link", url: "https://example.com/one" },
    { title: "Second link", url: "https://example.com/two" },
    { title: "Third link", url: "https://example.com/three" },
  ];
  await page.locator('[data-section="blocks"]').click();
  // Start clean: remove the template's sample blocks.
  while ((await page.locator("[data-block-row]").count()) > 0) {
    await page.locator("[data-block-row]").first().getByRole("button", { name: "Delete block" }).click();
  }
  for (const l of links) {
    await page.locator('[data-section="add"]').click();
    await page.locator('[data-add="link"]').click();
    const props = page.getByRole("complementary", { name: "Properties" });
    await props.getByLabel("Title", { exact: true }).fill(l.title);
    await props.getByLabel("URL", { exact: true }).fill(l.url);
  }
  await expect(page.locator("[data-block-row]")).toHaveCount(3);

  // 9. Reorder: move "Third link" to the top with the keyboard sensor.
  const handle = page.locator("[data-block-row]").nth(2).locator("[data-drag-handle]");
  await handle.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Space");
  await expect(page.locator("[data-block-row]").first().getByLabel("Link title")).toHaveValue("Third link");

  // 10. Modify appearance.
  await page.locator('[data-section="appearance"]').click();
  await page.getByRole("button", { name: "Apply Midnight palette" }).click();

  // 11. Save the draft (autosave, then explicit Cmd/Ctrl+S).
  await page.keyboard.press("ControlOrMeta+s");
  await waitSaved(page);
  const [{ draft }] = await sql<{ draft: { blocks: Array<{ title?: string }>; theme: { background: { color: string } } } }>(`SELECT draft FROM "BioPage" WHERE id = $1`, [pageId]);
  expect(draft.blocks.map((b) => b.title)).toEqual(["Third link", "First link", "Second link"]);
  expect(draft.theme.background.color).toBe("#0b0d12");

  // 12. Preview the draft.
  const preview = await page.context().newPage();
  await preview.goto(`/preview/${pageId}`);
  await expect(preview.getByRole("heading", { name: "Journey Tester" })).toBeVisible();
  await expect(preview.getByText("Draft preview")).toBeVisible();
  await preview.close();

  // 13–14. Choose a username and publish.
  await page.locator("[data-publish]").click();
  await page.locator("[data-username-input]").fill(username);
  await expect(page.locator("[data-username-status]")).toHaveText("Available");
  await page.locator("[data-publish-confirm]").click();
  await expect(page.locator("[data-live-url]")).toContainText(username);
  await page.getByRole("button", { name: "Keep editing" }).click();

  // 15–16. Visit as an anonymous visitor and click a link.
  const visitorCtx = await browser.newContext({ baseURL });
  const visitor = await visitorCtx.newPage();
  await visitor.goto(`/${username}`);
  await expect(visitor.getByRole("heading", { name: "Journey Tester" })).toBeVisible();
  await expect(visitor.locator(".bio-block a.bio-btn").first()).toHaveText(/Third link/);
  await visitor.waitForTimeout(800); // let the view beacon land
  const [nav] = await Promise.all([visitor.waitForRequest((r) => r.url().startsWith("https://example.com/three")), visitor.locator(".bio-block a.bio-btn").first().click()]);
  expect(nav.url()).toBe("https://example.com/three");

  // 17–18. Back in the dashboard: analytics recorded the view and the click.
  await expect
    .poll(async () => (await sql<{ n: string }>(`SELECT COUNT(*)::text n FROM "AnalyticsEvent" WHERE "pageId" = $1 AND type = 'CLICK'`, [pageId]))[0].n)
    .toBe("1");
  await page.goto(`/dashboard/analytics?page=${pageId}`);
  await expect(page.getByTestId("kpi-views")).toHaveText("1");
  await expect(page.getByTestId("kpi-clicks")).toHaveText("1");
  await expect(page.getByRole("table", { name: "Top links" })).toContainText("Third link");

  // 19. Edit the profile.
  await page.goto(`/editor/${pageId}`);
  await page.locator('[data-section="profile"]').click();
  await page.getByLabel("Display name").fill("Journey Tester Updated");
  await waitSaved(page);

  // Not live until republished.
  await visitor.goto(`/${username}`);
  await expect(visitor.getByRole("heading", { name: "Journey Tester", exact: true })).toBeVisible();

  // 20. Republish.
  await page.locator("[data-publish]").click();
  await page.locator("[data-publish-confirm]").click();
  await expect(page.locator("[data-live-url]")).toBeVisible();

  // 21. Public page shows the change.
  await visitor.goto(`/${username}`);
  await expect(visitor.getByRole("heading", { name: "Journey Tester Updated" })).toBeVisible();
  await visitorCtx.close();
});
