import "server-only";
import { db } from "./db";
import type { Prisma } from "@/generated/prisma/client";
import { emptyDoc, parseDoc, safeParseDoc, type PageDoc } from "@/lib/bio/schema";
import { publishIssues, type Issue } from "@/lib/bio/validate";
import { normalizeUsername, usernameProblem, suggestUsernames } from "@/lib/bio/username";
import { invalidatePublicPage } from "./public-pages";
import { getTemplate } from "@/lib/bio/templates";

/**
 * Owner-side page operations. EVERY function takes the acting user's id and
 * scopes its query by ownerId, so a guessed page id from another account
 * resolves to "not found" — tenant isolation lives here, not in the UI.
 */

/**
 * Serverlys Bio is free with no tiers, so nothing here is a plan limit. This is
 * an anti-abuse ceiling (spam farms create pages by the hundred) set far above
 * any real use; anyone who needs more just asks support.
 */
export const MAX_PAGES_PER_USER = 100;
export const MAX_VERSIONS = 40;
const REDIRECT_DAYS = 90;

export class PageError extends Error {
  constructor(
    message: string,
    public status = 400,
    public issues?: Issue[],
  ) {
    super(message);
  }
}

const json = (doc: PageDoc) => doc as unknown as Prisma.InputJsonValue;

export async function ownedPage(userId: string, pageId: string) {
  const page = await db.bioPage.findFirst({ where: { id: pageId, ownerId: userId } });
  if (!page) throw new PageError("Page not found", 404);
  return page;
}

export async function listPages(userId: string) {
  return db.bioPage.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, username: true, status: true, templateId: true, publishedAt: true, updatedAt: true, draft: true, suspendedReason: true },
  });
}

/** Template doc, with the owner's name dropped in so the first preview feels like theirs. */
export async function templateDoc(templateId: string | null | undefined): Promise<PageDoc> {
  if (!templateId) return emptyDoc();
  const row = await db.template.findFirst({ where: { id: templateId, active: true } });
  if (row) return parseDoc(row.content);
  const def = getTemplate(templateId);
  return def ? parseDoc(def.doc) : emptyDoc();
}

export async function createPage(userId: string, opts: { templateId?: string | null; name?: string; ownerName?: string }) {
  const count = await db.bioPage.count({ where: { ownerId: userId } });
  if (count >= MAX_PAGES_PER_USER) throw new PageError(`You've reached our anti-spam safeguard of ${MAX_PAGES_PER_USER} pages per account. It's still free — email support@serverlys.com and we'll raise it for you.`, 403);
  const doc = await templateDoc(opts.templateId);
  return db.bioPage.create({
    data: { ownerId: userId, name: opts.name?.slice(0, 80) || doc.profile.name || "My bio page", templateId: opts.templateId ?? null, draft: json(doc) },
    select: { id: true },
  });
}

export async function saveDraft(userId: string, pageId: string, input: unknown, baseVersion: number) {
  const parsed = safeParseDoc(input);
  if (!parsed.success) throw new PageError("The page contains invalid data: " + parsed.error.issues.slice(0, 3).map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  const result = await db.bioPage.updateMany({
    where: { id: pageId, ownerId: userId, draftVersion: baseVersion },
    data: { draft: json(parsed.data), draftVersion: { increment: 1 } },
  });
  if (result.count === 0) {
    const page = await db.bioPage.findFirst({ where: { id: pageId, ownerId: userId }, select: { draftVersion: true } });
    if (!page) throw new PageError("Page not found", 404);
    throw new PageError("This page was changed in another tab. Reload to get the latest version.", 409);
  }
  return { version: baseVersion + 1 };
}

export type Availability = { available: boolean; normalized: string; reason?: string; suggestions?: string[] };

export async function checkUsername(raw: string, pageId?: string): Promise<Availability> {
  const normalized = normalizeUsername(raw);
  const problem = usernameProblem(normalized);
  if (problem) return { available: false, normalized, reason: problem };
  const [owner, redirect] = await Promise.all([
    db.bioPage.findUnique({ where: { username: normalized }, select: { id: true } }),
    db.usernameRedirect.findUnique({ where: { username: normalized }, select: { pageId: true, releasedAt: true } }),
  ]);
  const takenByOther = (owner && owner.id !== pageId) || (redirect && redirect.pageId !== pageId && redirect.releasedAt > new Date());
  if (takenByOther) {
    const suggestions: string[] = [];
    for (const s of suggestUsernames(normalized)) {
      if (suggestions.length >= 3) break;
      const busy = await db.bioPage.findUnique({ where: { username: s }, select: { id: true } });
      if (!busy) suggestions.push(s);
    }
    return { available: false, normalized, reason: "That username is taken", suggestions };
  }
  return { available: true, normalized };
}

/** Claim or change the username. The old one keeps redirecting for 90 days. */
export async function setUsername(userId: string, pageId: string, raw: string) {
  const page = await ownedPage(userId, pageId);
  const check = await checkUsername(raw, pageId);
  if (!check.available) throw new PageError(check.reason ?? "Username unavailable");
  if (page.username === check.normalized) return check.normalized;
  const old = page.username;
  await db.$transaction(async (tx) => {
    // Reclaiming one of this page's own old names removes its redirect row.
    await tx.usernameRedirect.deleteMany({ where: { username: check.normalized, pageId } });
    await tx.usernameRedirect.deleteMany({ where: { username: check.normalized, releasedAt: { lte: new Date() } } });
    await tx.bioPage.update({ where: { id: pageId }, data: { username: check.normalized } });
    if (old) {
      await tx.usernameRedirect.upsert({
        where: { username: old },
        create: { username: old, pageId, releasedAt: new Date(Date.now() + REDIRECT_DAYS * 864e5) },
        update: { pageId, releasedAt: new Date(Date.now() + REDIRECT_DAYS * 864e5) },
      });
    }
  });
  await invalidatePublicPage(pageId, old ? [old, check.normalized] : [check.normalized]);
  return check.normalized;
}

async function snapshot(pageId: string, kind: "PUBLISH" | "TEMPLATE_SWITCH" | "RESTORE" | "MANUAL", content: Prisma.InputJsonValue, label = "") {
  await db.pageVersion.create({ data: { pageId, kind, content, label } });
  const extra = await db.pageVersion.findMany({ where: { pageId }, orderBy: { createdAt: "desc" }, skip: MAX_VERSIONS, select: { id: true } });
  if (extra.length) await db.pageVersion.deleteMany({ where: { id: { in: extra.map((v) => v.id) } } });
}

export async function publishPage(userId: string, pageId: string, opts: { emailVerified: boolean }) {
  const page = await ownedPage(userId, pageId);
  if (!opts.emailVerified) throw new PageError("Confirm your email address before publishing.", 403);
  if (page.status === "SUSPENDED") throw new PageError("This page is suspended by Serverlys and can't be published. Contact support@serverlys.com.", 403);
  if (!page.username) throw new PageError("Choose a username first.");
  const doc = parseDoc(page.draft);
  const issues = publishIssues(doc);
  if (issues.length) throw new PageError("Fix these before publishing", 422, issues);
  await db.bioPage.update({ where: { id: pageId }, data: { published: json(doc), publishedAt: new Date(), status: "PUBLISHED" } });
  await snapshot(pageId, "PUBLISH", json(doc), "Published");
  await invalidatePublicPage(pageId);
  return { username: page.username };
}

export async function unpublishPage(userId: string, pageId: string) {
  const page = await ownedPage(userId, pageId);
  if (page.status === "SUSPENDED") throw new PageError("Suspended pages are managed by Serverlys.", 403);
  await db.bioPage.update({ where: { id: pageId }, data: { status: page.published ? "UNPUBLISHED" : "DRAFT" } });
  await invalidatePublicPage(pageId);
}

/** Discard draft edits: the draft goes back to what's live. */
export async function revertDraft(userId: string, pageId: string) {
  const page = await ownedPage(userId, pageId);
  if (!page.published) throw new PageError("This page has never been published.");
  await db.bioPage.update({ where: { id: pageId }, data: { draft: page.published as Prisma.InputJsonValue, draftVersion: { increment: 1 } } });
}

export async function duplicatePage(userId: string, pageId: string) {
  const page = await ownedPage(userId, pageId);
  const count = await db.bioPage.count({ where: { ownerId: userId } });
  if (count >= MAX_PAGES_PER_USER) throw new PageError(`You've reached our anti-spam safeguard of ${MAX_PAGES_PER_USER} pages per account. Email support@serverlys.com and we'll raise it — free.`, 403);
  return db.bioPage.create({
    data: { ownerId: userId, name: `${page.name} (copy)`.slice(0, 80), templateId: page.templateId, draft: page.draft as Prisma.InputJsonValue },
    select: { id: true },
  });
}

export async function deletePage(userId: string, pageId: string) {
  const page = await ownedPage(userId, pageId);
  await db.bioPage.delete({ where: { id: pageId } });
  await invalidatePublicPage(pageId, page.username ? [page.username] : []);
}

export async function renamePage(userId: string, pageId: string, name: string) {
  await ownedPage(userId, pageId);
  await db.bioPage.update({ where: { id: pageId }, data: { name: name.trim().slice(0, 80) || "Untitled page" } });
}

/**
 * Switch template, keeping the owner's CONTENT: profile text and photo,
 * social links and every block stay; the template's design (theme, header
 * layout, avatar shape, social placement) replaces the current one. With
 * `replaceContent` the template's sample blocks come too. The previous
 * draft is snapshotted so "Restore previous design" can undo it.
 */
export async function switchTemplate(userId: string, pageId: string, templateId: string, replaceContent: boolean) {
  const page = await ownedPage(userId, pageId);
  const current = parseDoc(page.draft);
  const tpl = await templateDoc(templateId);
  await snapshot(pageId, "TEMPLATE_SWITCH", json(current), `Before switching to ${getTemplate(templateId)?.name ?? templateId}`);
  const next: PageDoc = replaceContent
    ? { ...tpl, profile: { ...tpl.profile, name: current.profile.name || tpl.profile.name, avatar: current.profile.avatar || tpl.profile.avatar } }
    : {
        ...current,
        theme: tpl.theme,
        profile: { ...current.profile, layout: tpl.profile.layout, avatarShape: tpl.profile.avatarShape, cover: current.profile.cover || tpl.profile.cover },
        socials: { ...current.socials, position: tpl.socials.position },
      };
  await db.bioPage.update({ where: { id: pageId }, data: { draft: json(next), templateId, draftVersion: { increment: 1 } } });
  return next;
}

export async function listVersions(userId: string, pageId: string) {
  await ownedPage(userId, pageId);
  return db.pageVersion.findMany({ where: { pageId }, orderBy: { createdAt: "desc" }, select: { id: true, kind: true, label: true, createdAt: true } });
}

export async function restoreVersion(userId: string, pageId: string, versionId: string) {
  const page = await ownedPage(userId, pageId);
  const version = await db.pageVersion.findFirst({ where: { id: versionId, pageId } });
  if (!version) throw new PageError("Version not found", 404);
  await snapshot(pageId, "RESTORE", page.draft as Prisma.InputJsonValue, "Before restoring an earlier version");
  const doc = parseDoc(version.content);
  await db.bioPage.update({ where: { id: pageId }, data: { draft: json(doc), draftVersion: { increment: 1 } } });
  return doc;
}
