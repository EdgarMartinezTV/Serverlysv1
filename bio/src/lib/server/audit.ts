import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "./db";

/** Append-only record of sensitive actions (admin actions, account deletion, domain changes). */
export async function audit(actorId: string | null, action: string, targetType = "", targetId = "", meta?: Prisma.InputJsonValue) {
  await db.auditLog.create({ data: { actorId, action, targetType, targetId, meta } });
}
