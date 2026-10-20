import { withUser, type IdCtx } from "@/lib/server/api";
import { ownedPage } from "@/lib/server/pages";
import { pageStats } from "@/lib/server/stats";

/** Last-7-days summary for the editor's Analytics tab. */
export const GET = withUser<IdCtx>(async (_req, user, { params }) => {
  const page = await ownedPage(user.id, (await params).id);
  const to = new Date();
  const from = new Date(to.getTime() - 7 * 864e5);
  return pageStats([page.id], from, to);
});
