import { withUser, type IdCtx } from "@/lib/server/api";
import { ownedPage, revertDraft } from "@/lib/server/pages";

export const POST = withUser<IdCtx>(async (_req, user, { params }) => {
  const id = (await params).id;
  await revertDraft(user.id, id);
  const page = await ownedPage(user.id, id);
  return { doc: page.draft, version: page.draftVersion };
});
