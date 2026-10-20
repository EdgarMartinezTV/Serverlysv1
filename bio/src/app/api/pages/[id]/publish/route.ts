import { z } from "zod";
import { withUser, type IdCtx } from "@/lib/server/api";
import { publishPage, setUsername } from "@/lib/server/pages";

const body = z.object({ username: z.string().max(60).optional() });

export const POST = withUser<IdCtx>(async (req, user, { params }) => {
  const id = (await params).id;
  const { username } = body.parse(await req.json().catch(() => ({})));
  if (username) await setUsername(user.id, id, username);
  return publishPage(user.id, id, { emailVerified: Boolean(user.emailVerifiedAt) });
});
