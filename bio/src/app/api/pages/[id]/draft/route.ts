import { z } from "zod";
import { withUser, type IdCtx } from "@/lib/server/api";
import { ownedPage, saveDraft } from "@/lib/server/pages";
import { rateLimit } from "@/lib/server/rate-limit";
import { PageError } from "@/lib/server/pages";

const body = z.object({ doc: z.unknown(), version: z.number().int() });

export const GET = withUser<IdCtx>(async (_req, user, { params }) => {
  const page = await ownedPage(user.id, (await params).id);
  return { doc: page.draft, version: page.draftVersion };
});

/** Autosave target. Optimistic concurrency: a stale `version` gets a 409. */
export const PUT = withUser<IdCtx>(async (req, user, { params }) => {
  if (!(await rateLimit(`draft:${user.id}`, 120, 60)).ok) throw new PageError("Saving too fast — slow down for a moment.", 429);
  const { doc, version } = body.parse(await req.json());
  return saveDraft(user.id, (await params).id, doc, version);
});
