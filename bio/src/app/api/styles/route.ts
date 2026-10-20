import { z } from "zod";
import { withUser } from "@/lib/server/api";
import { db } from "@/lib/server/db";
import { themeSchema } from "@/lib/bio/schema";
import { PageError } from "@/lib/server/pages";
import type { Prisma } from "@/generated/prisma/client";

/** Saved, reusable styles (a theme the owner can apply to any of their pages). */
export const GET = withUser<unknown>(async (_req, user) => ({
  styles: await db.savedStyle.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, select: { id: true, name: true, theme: true, createdAt: true } }),
}));

const create = z.object({ name: z.string().trim().min(1).max(60), theme: themeSchema });

export const POST = withUser<unknown>(async (req, user) => {
  const { name, theme } = create.parse(await req.json());
  if ((await db.savedStyle.count({ where: { userId: user.id } })) >= 200) throw new PageError("That's 200 saved styles — delete a few you don't use to save another.");
  return db.savedStyle.create({ data: { userId: user.id, name, theme: theme as unknown as Prisma.InputJsonValue }, select: { id: true, name: true, theme: true, createdAt: true } });
});

export const DELETE = withUser<unknown>(async (req, user) => {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  await db.savedStyle.deleteMany({ where: { id, userId: user.id } });
  return { ok: true };
});
