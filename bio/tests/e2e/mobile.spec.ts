import { expect, test } from "@playwright/test";
import { api, createPageFromTemplate, newVerifiedUser, publish, uname } from "./helpers";

const overflow = (page: import("@playwright/test").Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test("mobile: public page, editor and dashboard fit a phone", async ({ page, browser }) => {
  await newVerifiedUser(page, "mobile");
  expect(await overflow(page)).toBeLessThanOrEqual(0);

  // Dashboard nav is a drawer on phones.
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Analytics" })).toBeVisible();
  await page.getByRole("button", { name: "Close menu" }).last().click();

  const id = await createPageFromTemplate(page, "restaurant-bistro");
  expect(await overflow(page)).toBeLessThanOrEqual(0);
  // Editor: Edit / Preview tabs.
  await page.getByRole("tab", { name: "Preview" }).click();
  await expect(page.locator("[data-device]")).toBeVisible();
  await page.getByRole("tab", { name: "Edit" }).click();
  await page.locator('[data-section="blocks"]').click();
  await page.locator("[data-block-row]").first().getByRole("button").nth(1).click();
  // On phones the properties panel stacks under the list.
  await expect(page.getByText("Content", { exact: true }).first()).toBeVisible();

  const u = uname("mob");
  await publish(page, id, u);
  for (const t of ["personal-ava", "store-goods", "events-night-market", "real-estate-agent"]) {
    const v = await (await browser.newContext({ viewport: { width: 360, height: 780 }, isMobile: true })).newPage();
    await v.goto(t === "personal-ava" ? `/${u}` : `/t/${t}`);
    expect(await overflow(v), t).toBeLessThanOrEqual(0);
  }
  for (const path of ["/login", "/signup", "/dashboard/analytics", "/dashboard/leads", "/dashboard/domains", "/dashboard/settings", "/dashboard/templates"]) {
    await page.goto(path);
    expect(await overflow(page), path).toBeLessThanOrEqual(0);
  }
  void api;
});
