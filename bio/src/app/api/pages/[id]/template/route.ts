import { z } from "zod";
import { withUser, type IdCtx } from "@/lib/server/api";
import { switchTemplate } from "@/lib/server/pages";

const body = z.object({ templateId: z.string().min(1).max(60), replaceContent: z.boolean().default(false) });

export const POST = withUser<IdCtx>(async (req, user, { params }) => {
  const { templateId, replaceContent } = body.parse(await req.json());
  const doc = await switchTemplate(user.id, (await params).id, templateId, replaceContent);
  return { doc };
});
