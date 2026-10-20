"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";

/** Scoped by page owner in the WHERE clause — ids from another account match nothing. */
export async function markLeadsRead(ids: string[]) {
  const user = await requireUser();
  await db.lead.updateMany({ where: { id: { in: ids.slice(0, 500) }, page: { ownerId: user.id }, readAt: null }, data: { readAt: new Date() } });
  revalidatePath("/dashboard/leads");
}

export async function deleteLead(id: string) {
  const user = await requireUser();
  await db.lead.deleteMany({ where: { id, page: { ownerId: user.id } } });
  revalidatePath("/dashboard/leads");
}
