import { z } from "zod";
import { withUser } from "@/lib/server/api";
import { addDomain } from "@/lib/server/domains";
import { rateLimit } from "@/lib/server/rate-limit";
import { PageError } from "@/lib/server/pages";

const body = z.object({ pageId: z.string().min(1).max(40), hostname: z.string().min(3).max(260) });

export const POST = withUser<unknown>(async (req, user) => {
  if (!(await rateLimit(`domain-add:${user.id}`, 20, 3600)).ok) throw new PageError("Too many domain changes. Try again later.", 429);
  const { pageId, hostname } = body.parse(await req.json());
  return addDomain(user.id, pageId, hostname);
});
