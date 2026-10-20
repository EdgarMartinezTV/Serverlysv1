import { expect, test } from "@playwright/test";
import { api, createPageFromTemplate, newVerifiedUser, publish, sql, uname } from "./helpers";

test.describe("authorization boundaries", () => {
  test("a user can't read or change another user's page, leads or analytics", async ({ browser }) => {
    const a = await (await browser.newContext()).newPage();
    const b = await (await browser.newContext()).newPage();
    await newVerifiedUser(a, "owner");
    await newVerifiedUser(b, "intruder");
    const pageId = await createPageFromTemplate(a);

    // Editor, draft preview and APIs all behave as if the page doesn't exist.
    const editor = await b.goto(`/editor/${pageId}`);
    expect(editor?.status()).toBe(404);
    expect((await b.goto(`/preview/${pageId}`))?.status()).toBe(404);
    await b.goto("/dashboard");
    expect((await api(b, `/api/pages/${pageId}/draft`)).status).toBe(404);
    expect((await api(b, `/api/pages/${pageId}/draft`, "PUT", { doc: {}, version: 1 })).status).toBe(404);
    expect((await api(b, `/api/pages/${pageId}/publish`, "POST", { username: uname("steal") })).status).toBe(404);
    expect((await api(b, `/api/pages/${pageId}`, "PATCH", { name: "pwned" })).status).toBe(404);
    expect((await api(b, `/api/pages/${pageId}/versions`)).status).toBe(404);
    expect((await api(b, `/api/pages/${pageId}/stats`)).status).toBe(404);
    expect((await api(b, `/api/domains`, "POST", { pageId, hostname: "links.attacker-test.dev" })).status).toBe(404);

    // Leads export only ever contains the caller's own leads.
    await sql(`INSERT INTO "Lead" (id, "pageId", "blockId", kind, email) VALUES ($1, $2, 'x', 'CONTACT', 'secret@victim.test')`, [`lead-${Date.now()}`, pageId]);
    const csv = await api<string>(b, "/api/leads/export");
    expect(csv.data).not.toContain("secret@victim.test");
    await b.goto("/dashboard/leads");
    await expect(b.getByText("secret@victim.test")).toHaveCount(0);

    // The owner's page name is untouched.
    const [row] = await sql<{ name: string }>(`SELECT name FROM "BioPage" WHERE id = $1`, [pageId]);
    expect(row.name).not.toBe("pwned");
  });

  test("signed-out requests are refused", async ({ page, request }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
    expect((await request.get("/api/leads/export")).status()).toBe(401);
    expect((await request.get("/api/analytics/export")).status()).toBe(401);
  });

  test("cross-site mutations are blocked (CSRF)", async ({ page }) => {
    await newVerifiedUser(page, "csrf");
    const pageId = await createPageFromTemplate(page);
    const res = await page.request.put(`/api/pages/${pageId}/draft`, { headers: { origin: "https://evil.example", "content-type": "application/json" }, data: { doc: {}, version: 1 } });
    expect(res.status()).toBe(403);
  });

  test("admin area is closed to normal users", async ({ page }) => {
    await newVerifiedUser(page, "notadmin");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("an unverified user can build but not publish", async ({ page }) => {
    const { signup, uniqueEmail } = await import("./helpers");
    await signup(page, uniqueEmail("unverified"));
    const pageId = await createPageFromTemplate(page);
    const r = await api<{ error: string }>(page, `/api/pages/${pageId}/publish`, "POST", { username: uname("unv") });
    expect(r.status).toBe(403);
    expect(r.data.error).toMatch(/Confirm your email/);
  });
});

test("click redirect can't be used as an open redirect", async ({ page, request }) => {
  await newVerifiedUser(page, "redirect");
  const pageId = await createPageFromTemplate(page);
  const u = uname("redir");
  await publish(page, pageId, u);
  // Unknown block / foreign query params never choose the destination.
  const res = await request.get(`/go/${pageId}/nope?url=https://evil.example`, { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers().location).toMatch(new RegExp(`/${u}$`));
});
