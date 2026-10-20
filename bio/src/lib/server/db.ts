import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * One Prisma client per process. In dev, Next re-evaluates modules on every
 * edit, so the instance is parked on globalThis or each reload would open a
 * new connection pool until Postgres refuses connections.
 */
const globalForDb = globalThis as unknown as { __bioDb?: PrismaClient };

function create() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
  return new PrismaClient({ adapter });
}

export const db = globalForDb.__bioDb ?? create();
if (process.env.NODE_ENV !== "production") globalForDb.__bioDb = db;
