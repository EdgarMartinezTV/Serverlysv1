import { expect, test } from "@playwright/test";
import { api, createPageFromTemplate, newVerifiedUser, publish, sql, uname } from "./helpers";

type Doc = { blocks: Array<Record<string, unknown>>; [k: string]: unknown };

async function getDraft(page: import("@playwright/test").Page, id: string) {
  return (await api<{ doc: Doc; version: number }>(page, `/api/pages/${id}/draft`)).data;
}
async function putDraft(page: import("@playwright/test").Page, id: string, doc: Doc, version: number) {
  return api<{ version: number; error?: string }>(page, `/api/pages/${id}/draft`, "PUT", { doc, version });
}
const link = (id: string, title: string, url: string, extra: Record<string, unknown> = {}) => ({ id, type: "link", title, url, ...extra });

test.describe("publishing rules", () => {
  test("unsafe and broken URLs are refused at publish; javascript: never renders", async ({ page }) => {
    await newVerifiedUser(page, "urls");
    const id = await createPageFromTemplate(page);
    const { doc, version } = await getDraft(page, id);
    doc.blocks = [link("l1", "Bad", "javascript:alert(1)"), link("l2", "Local", "http://127.0.0.1/admin"), link("l3", "Empty", "")];
    expect((await putDraft(page, id, doc, version)).status).toBe(200);
    const r = await api<{ error: string; issues: Array<{ blockId: string; message: string }> }>(page, `/api/pages/${id}/publish`, "POST", { username: uname("bad") });
    expect(r.status).toBe(422);
    expect(r.data.issues.map((i) => i.blockId).sort()).toEqual(["l1", "l2", "l3"]);
    // The draft preview renders the unsafe link as a non-navigable span, not an <a href="javascript:…">.
    await page.goto(`/preview/${id}`);
    await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
  });

  test("unpublished and draft pages are not public; republish restores", async ({ page, browser }) => {
    await newVerifiedUser(page, "unpub");
    const id = await createPageFromTemplate(page);
    const u = uname("unpub");
    const visitor = await (await browser.newContext()).newPage();
    expect((await visitor.goto(`/${u}`))?.status()).toBe(404);
    await publish(page, id, u);
    expect((await visitor.goto(`/${u}`))?.status()).toBe(200);
    expect((await api(page, `/api/pages/${id}/unpublish`, "POST")).status).toBe(200);
    expect((await visitor.goto(`/${u}`))?.status()).toBe(404);
    await publish(page, id, u);
    expect((await visitor.goto(`/${u}`))?.status()).toBe(200);
  });

  test("username rules: reserved, taken, case-insensitive, and redirect after rename", async ({ page, browser }) => {
    await newVerifiedUser(page, "names");
    const id = await createPageFromTemplate(page);
    const reserved = await api<{ available: boolean; reason: string }>(page, `/api/username?u=admin&page=${id}`);
    expect(reserved.data).toMatchObject({ available: false, reason: "That name is reserved" });
    const bad = await api<{ available: boolean }>(page, `/api/username?u=a..b&page=${id}`);
    expect(bad.data.available).toBe(false);

    const first = uname("first");
    await publish(page, id, first);
    const other = await (await browser.newContext()).newPage();
    await newVerifiedUser(other, "names2");
    const otherId = await createPageFromTemplate(other);
    const taken = await api<{ available: boolean; suggestions: string[] }>(other, `/api/username?u=${first.toUpperCase()}&page=${otherId}`);
    expect(taken.data.available).toBe(false);
    expect(taken.data.suggestions.length).toBeGreaterThan(0);

    // Rename → the old address 308-redirects, and nobody else can claim it.
    const second = uname("second");
    expect((await api(page, `/api/pages/${id}`, "PATCH", { username: second })).status).toBe(200);
    const res = await other.request.get(`/${first}`, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toBe(`/${second}`);
    expect((await api<{ available: boolean }>(other, `/api/username?u=${first}&page=${otherId}`)).data.available).toBe(false);
    // Mixed case in the URL is normalised.
    const upper = await other.request.get(`/${second.toUpperCase()}`, { maxRedirects: 0 });
    expect(upper.status()).toBe(308);
  });

  test("hidden and scheduled blocks are not shown to visitors", async ({ page, browser }) => {
    await newVerifiedUser(page, "sched");
    const id = await createPageFromTemplate(page);
    const { doc, version } = await getDraft(page, id);
    const future = new Date(Date.now() + 86400e3).toISOString();
    const past = new Date(Date.now() - 86400e3).toISOString();
    doc.blocks = [
      link("v1", "Visible link", "https://example.com/a"),
      link("h1", "Hidden link", "https://example.com/b", { hidden: true }),
      link("s1", "Future link", "https://example.com/c", { schedule: { start: future, end: "" } }),
      link("e1", "Expired link", "https://example.com/d", { schedule: { start: "", end: past } }),
    ];
    await putDraft(page, id, doc, version);
    const u = uname("sched");
    await publish(page, id, u);
    const v = await (await browser.newContext()).newPage();
    await v.goto(`/${u}`);
    await expect(v.getByText("Visible link")).toBeVisible();
    for (const t of ["Hidden link", "Future link", "Expired link"]) await expect(v.getByText(t)).toHaveCount(0);
    // A scheduled link can't be reached through the click redirect either.
    const r = await v.request.get(`/go/${id}/s1`, { maxRedirects: 0 });
    expect(r.headers().location).not.toContain("example.com/c");
  });

  test("lead forms: submission, honeypot, dashboard, notification email", async ({ page, browser }) => {
    const email = await newVerifiedUser(page, "leads");
    const id = await createPageFromTemplate(page);
    const { doc, version } = await getDraft(page, id);
    doc.blocks = [{ id: "f1", type: "form", title: "Get in touch", askPhone: true }];
    await putDraft(page, id, doc, version);
    const u = uname("leads");
    await publish(page, id, u);

    const v = await (await browser.newContext()).newPage();
    await v.goto(`/${u}`);
    await v.waitForTimeout(1600); // minimum fill time is a spam signal
    const form = v.locator("form.bio-form");
    await form.getByLabel("Name").fill("Visitor Person");
    await form.getByLabel("Email").fill("visitor@example.org");
    await form.getByLabel("Phone").fill("+1 305 555 0199");
    await form.getByLabel("Message").fill("Do you cater weddings?");
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Send" }).click();
    await expect(v.getByRole("status")).toContainText("Thanks");

    // Honeypot-filled submission is accepted silently and stored nowhere.
    const bot = await v.evaluate(async ([pageId]) => (await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pageId, blockId: "f1", email: "bot@spam.test", message: "buy", consent: true, website: "http://spam", elapsed: 5000 }) })).status, [id]);
    expect(bot).toBe(200);

    const rows = await sql<{ email: string; phone: string; consentGiven: boolean }>(`SELECT email, phone, "consentGiven" FROM "Lead" WHERE "pageId" = $1`, [id]);
    expect(rows).toEqual([{ email: "visitor@example.org", phone: "+1 305 555 0199", consentGiven: true }]);
    const mail = await sql(`SELECT 1 FROM "OutboundEmail" WHERE "to" = $1 AND kind = 'lead-notification'`, [email]);
    expect(mail.length).toBe(1);

    await page.goto("/dashboard/leads");
    await expect(page.getByText("visitor@example.org")).toBeVisible();
    await expect(page.getByText("Do you cater weddings?")).toBeVisible();
    const csv = await api<string>(page, "/api/leads/export");
    expect(csv.data).toContain("visitor@example.org");
  });

  test("uploads: images re-encoded to WebP, disguised files rejected", async ({ page }) => {
    await newVerifiedUser(page, "upload");
    const id = await createPageFromTemplate(page);
    const fs = await import("node:fs");
    const jpeg = fs.readFileSync("tests/fixtures/avatar.jpg").toString("base64");
    const result = await page.evaluate(
      async ([pageId, b64]) => {
        const send = async (bytes: Uint8Array, name: string, kind: string) => {
          const fd = new FormData();
          fd.set("file", new File([bytes as BlobPart], name));
          fd.set("kind", kind);
          fd.set("pageId", pageId);
          const r = await fetch("/api/uploads", { method: "POST", body: fd });
          return { status: r.status, body: await r.json() };
        };
        const img = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        const html = new TextEncoder().encode("<html><script>alert(1)</script></html>");
        return {
          good: await send(img, "me.jpg", "avatar"),
          disguised: await send(html, "evil.jpg", "image"),
          htmlAsFile: await send(html, "page.pdf", "file"),
        };
      },
      [id, jpeg] as const,
    );
    expect(result.good.status).toBe(200);
    expect(result.good.body.mime).toBe("image/webp");
    expect(result.disguised.status).toBe(400);
    expect(result.htmlAsFile.status).toBe(400);
    const served = await page.request.get(result.good.body.url);
    expect(served.headers()["content-type"]).toBe("image/webp");
    expect(served.headers()["x-content-type-options"]).toBe("nosniff");
  });

  test("custom domain: only VERIFIED hosts serve the page", async ({ page, request }) => {
    await newVerifiedUser(page, "domain");
    const id = await createPageFromTemplate(page);
    const u = uname("dom");
    await publish(page, id, u);
    const host = `links-${Date.now()}.e2e-test.dev`;
    const add = await api<{ id: string; verificationToken: string }>(page, "/api/domains", "POST", { pageId: id, hostname: host });
    expect(add.status).toBe(200);
    // Pending: not served.
    expect((await request.get("/", { headers: { host } })).status()).toBe(404);
    // Simulate a successful DNS verification (real DNS is covered by the DNS check unit).
    await sql(`UPDATE "Domain" SET status = 'VERIFIED' WHERE id = $1`, [add.data.id]);
    await api(page, `/api/pages/${id}/publish`, "POST", {}); // publish invalidates the host cache
    const res = await request.get("/", { headers: { host } });
    expect(res.status()).toBe(200);
    expect(res.headers()["x-serverlys-bio"]).toBe("1");
    const html = await res.text();
    expect(html).toContain(`<link rel="canonical" href="https://${host}"`);
    // Dashboard paths are never exposed on a customer domain.
    expect((await request.get("/dashboard", { headers: { host } })).status()).toBe(404);
    // TLS ask endpoint agrees.
    expect((await request.get(`/api/tls/ask?domain=${host}`)).status()).toBe(200);
    expect((await request.get(`/api/tls/ask?domain=not-ours.example.net`)).status()).toBe(404);
  });

  test("QR code and vCard downloads", async ({ page, request }) => {
    await newVerifiedUser(page, "qr");
    const id = await createPageFromTemplate(page);
    const { doc, version } = await getDraft(page, id);
    doc.blocks = [{ id: "c1", type: "contact", name: "Ana Pérez", phone: "+13055550100", email: "ana@example.com" }];
    await putDraft(page, id, doc, version);
    await publish(page, id, uname("qr"));
    const png = await request.get(`/api/qr/${id}?format=png`);
    expect(png.headers()["content-type"]).toBe("image/png");
    const vcf = await request.get(`/api/vcard/${id}/c1`);
    expect(await vcf.text()).toContain("FN:Ana Pérez");
  });
});
