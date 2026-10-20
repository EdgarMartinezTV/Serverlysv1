import { NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/actions/auth";

/** The link in the verification email. GET so it works from any mail client. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const ok = await verifyEmailToken(url.searchParams.get("token") ?? "");
  return NextResponse.redirect(new URL(ok ? "/dashboard?verified=1" : "/verify-email?error=1", url));
}
