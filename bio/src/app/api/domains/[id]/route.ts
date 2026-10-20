import { withUser, type IdCtx } from "@/lib/server/api";
import { checkHttps, removeDomain, verifyDomain } from "@/lib/server/domains";
import { rateLimit } from "@/lib/server/rate-limit";
import { PageError } from "@/lib/server/pages";

/** POST = re-check DNS (and HTTPS once verified). */
export const POST = withUser<IdCtx>(async (_req, user, { params }) => {
  if (!(await rateLimit(`domain-check:${user.id}`, 30, 600)).ok) throw new PageError("Checking too often — DNS changes take a few minutes anyway.", 429);
  const d = await verifyDomain(user.id, (await params).id);
  const https = d.status === "VERIFIED" ? await checkHttps(d.hostname) : null;
  return { status: d.status, lastError: d.lastError, check: d.check, https };
});

export const DELETE = withUser<IdCtx>(async (_req, user, { params }) => {
  await removeDomain(user.id, (await params).id);
  return { ok: true };
});
