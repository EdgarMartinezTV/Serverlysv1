import { withUser } from "@/lib/server/api";
import { checkUsername } from "@/lib/server/pages";
import { rateLimit } from "@/lib/server/rate-limit";
import { NextResponse } from "next/server";

/** Real-time availability for the username field. */
export const GET = withUser<unknown>(async (req, user) => {
  if (!(await rateLimit(`username:${user.id}`, 60, 60)).ok) return NextResponse.json({ available: false, reason: "Slow down a little" }, { status: 429 });
  const url = new URL(req.url);
  return checkUsername(url.searchParams.get("u") ?? "", url.searchParams.get("page") ?? undefined);
});
