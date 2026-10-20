"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/server/auth";
import { createPage, deletePage, duplicatePage, PageError, publishPage, renamePage, unpublishPage } from "@/lib/server/pages";

export type ActionResult = { error?: string; ok?: boolean };

async function run(fn: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await fn();
    revalidatePath("/dashboard", "layout");
    return { ok: true };
  } catch (err) {
    if (err instanceof PageError) return { error: err.issues?.length ? `${err.message}: ${err.issues.map((i) => i.message).join("; ")}` : err.message };
    throw err;
  }
}

export async function createPageAction(templateId: string | null, claim?: string) {
  const user = await requireUser();
  let id: string;
  try {
    id = (await createPage(user.id, { templateId })).id;
  } catch (err) {
    if (err instanceof PageError) redirect(`/dashboard/pages?error=${encodeURIComponent(err.message)}`);
    throw err;
  }
  redirect(`/editor/${id}?wizard=1${claim ? `&username=${encodeURIComponent(claim)}` : ""}`);
}

export async function duplicatePageAction(pageId: string) {
  const user = await requireUser();
  return run(() => duplicatePage(user.id, pageId));
}

export async function deletePageAction(pageId: string) {
  const user = await requireUser();
  return run(() => deletePage(user.id, pageId));
}

export async function togglePublishAction(pageId: string, publish: boolean) {
  const user = await requireUser();
  return run(() => (publish ? publishPage(user.id, pageId, { emailVerified: Boolean(user.emailVerifiedAt) }) : unpublishPage(user.id, pageId)));
}

export async function renamePageAction(pageId: string, name: string) {
  const user = await requireUser();
  return run(() => renamePage(user.id, pageId, name));
}
