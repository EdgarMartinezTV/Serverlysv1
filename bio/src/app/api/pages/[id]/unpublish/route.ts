import { withUser, type IdCtx } from "@/lib/server/api";
import { unpublishPage } from "@/lib/server/pages";

export const POST = withUser<IdCtx>(async (_req, user, { params }) => {
  await unpublishPage(user.id, (await params).id);
  return { ok: true };
});
