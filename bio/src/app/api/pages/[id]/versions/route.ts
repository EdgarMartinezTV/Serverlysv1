import { z } from "zod";
import { withUser, type IdCtx } from "@/lib/server/api";
import { listVersions, restoreVersion } from "@/lib/server/pages";

export const GET = withUser<IdCtx>(async (_req, user, { params }) => ({ versions: await listVersions(user.id, (await params).id) }));

const body = z.object({ versionId: z.string().min(1).max(40) });

export const POST = withUser<IdCtx>(async (req, user, { params }) => {
  const { versionId } = body.parse(await req.json());
  return { doc: await restoreVersion(user.id, (await params).id, versionId) };
});
