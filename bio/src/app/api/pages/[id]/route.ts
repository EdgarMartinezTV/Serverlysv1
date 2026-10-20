import { z } from "zod";
import { withUser, type IdCtx } from "@/lib/server/api";
import { db } from "@/lib/server/db";
import { ownedPage, renamePage, setUsername } from "@/lib/server/pages";

const patch = z.object({ name: z.string().max(80).optional(), notifyLeads: z.boolean().optional(), username: z.string().max(60).optional() });

/** Page settings that live outside the document (name, lead emails, username). */
export const PATCH = withUser<IdCtx>(async (req, user, { params }) => {
  const id = (await params).id;
  const body = patch.parse(await req.json());
  await ownedPage(user.id, id);
  if (body.name !== undefined) await renamePage(user.id, id, body.name);
  if (body.notifyLeads !== undefined) await db.bioPage.update({ where: { id }, data: { notifyLeads: body.notifyLeads } });
  let username: string | undefined;
  if (body.username) username = await setUsername(user.id, id, body.username);
  return { ok: true, username };
});
