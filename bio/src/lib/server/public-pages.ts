import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { parseDoc, type PageDoc } from "@/lib/bio/schema";

/**
 * Read path for PUBLIC pages, behind a small in-process cache keyed by tag.
 *
 * Why not Next's data cache (unstable_cache + revalidateTag)? It was the
 * first implementation, and in practice `revalidateTag(tag, { expire: 0 })`
 * still served ONE stale render after a publish — an owner republishing and
 * immediately checking their page saw the old version (caught by
 * journey.spec step 21, reproduced with curl). Publishing must be read-your-
 * own-writes, so invalidation here is a synchronous Map delete.
 *
 * Single process: entries also expire after TTL_MS, which bounds staleness on
 * other replicas if the app is ever scaled out (see DEPLOY.md).
 */
const TTL_MS = 60_000;
const MAX_ENTRIES = 5_000;
type Entry = { at: number; value: unknown; tags: string[] };
// On globalThis, not module scope: route handlers (where publish runs) and
// pages are separate bundles, each with its own copy of this module, so a
// module-level Map cleared by the publish route would leave the page's copy stale.
const g = globalThis as unknown as { __sbioPublicCache?: Map<string, Entry> };
const store = (g.__sbioPublicCache ??= new Map<string, Entry>());

async function cached<T>(key: string, tags: string[], load: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;
  const value = await load();
  if (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value!);
  store.set(key, { at: Date.now(), value, tags });
  return value;
}

function dropTag(tag: string) {
  for (const [k, e] of store) if (e.tags.includes(tag)) store.delete(k);
}

export type PublicPage = {
  id: string;
  username: string;
  doc: PageDoc;
  publishedAt: string;
  ownerId: string;
};

export type Lookup = { kind: "page"; page: PublicPage } | { kind: "redirect"; to: string } | { kind: "none" };

const pageTag = (id: string) => `page:${id}`;
const userTag = (username: string) => `username:${username}`;
const hostTag = (host: string) => `host:${host}`;

function toPublic(row: { id: string; username: string | null; published: unknown; publishedAt: Date | null; ownerId: string }): PublicPage | null {
  if (!row.username || !row.published) return null;
  try {
    return { id: row.id, username: row.username, doc: parseDoc(row.published), publishedAt: (row.publishedAt ?? new Date()).toISOString(), ownerId: row.ownerId };
  } catch {
    return null;
  }
}

const select = { id: true, username: true, published: true, publishedAt: true, ownerId: true, status: true, owner: { select: { status: true } } } as const;

export function lookupUsername(username: string): Promise<Lookup> {
  return cached(`u:${username}`, [userTag(username)], async (): Promise<Lookup> => {
      const row = await db.bioPage.findUnique({ where: { username }, select });
      if (row) {
        if (row.status !== "PUBLISHED" || row.owner.status !== "ACTIVE") return { kind: "none" };
        const page = toPublic(row);
        return page ? { kind: "page", page } : { kind: "none" };
      }
      const redirect = await db.usernameRedirect.findUnique({ where: { username }, include: { page: { select: { username: true, status: true } } } });
      if (redirect?.page.username && redirect.page.status === "PUBLISHED") return { kind: "redirect", to: redirect.page.username };
      return { kind: "none" };
  });
}

export function getPublishedById(id: string): Promise<PublicPage | null> {
  return cached(`p:${id}`, [pageTag(id)], async () => {
      const row = await db.bioPage.findUnique({ where: { id }, select });
      if (!row || row.status !== "PUBLISHED" || row.owner.status !== "ACTIVE") return null;
      return toPublic(row);
  });
}

/** Verified custom domain → its page. */
export function lookupHost(host: string): Promise<PublicPage | null> {
  return cached(`h:${host}`, [hostTag(host)], async () => {
      const domain = await db.domain.findUnique({ where: { hostname: host }, select: { status: true, pageId: true } });
      if (!domain || domain.status !== "VERIFIED") return null;
      const row = await db.bioPage.findUnique({ where: { id: domain.pageId }, select });
      if (!row || row.status !== "PUBLISHED" || row.owner.status !== "ACTIVE") return null;
      return toPublic(row);
  });
}

/** Drop every cached view of a page. Call after any change visitors can see. */
export async function invalidatePublicPage(pageId: string, extraUsernames: string[] = []) {
  const page = await db.bioPage.findUnique({ where: { id: pageId }, select: { username: true, domains: { select: { hostname: true } } } });
  dropTag(pageTag(pageId));
  for (const u of [page?.username, ...extraUsernames]) {
    if (!u) continue;
    dropTag(userTag(u));
    revalidatePath(`/${u}`);
  }
  for (const d of page?.domains ?? []) dropTag(hostTag(d.hostname));
}

export function invalidateHost(host: string) {
  dropTag(hostTag(host));
}
