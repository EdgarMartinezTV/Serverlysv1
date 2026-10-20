/** Dev only: publish every template as a page under a fixture account, for visual QA. */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { TEMPLATES } from "../src/lib/bio/templates.ts";
try { process.loadEnvFile(".env"); } catch {}
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const user = await db.user.upsert({ where: { email: "fixture@example.com" }, create: { email: "fixture@example.com", name: "Fixture", emailVerifiedAt: new Date() }, update: {} });
for (const t of TEMPLATES) {
  const username = `t-${t.id}`.slice(0, 30).replace(/-$/, "");
  await db.bioPage.upsert({
    where: { username },
    create: { ownerId: user.id, name: t.name, username, status: "PUBLISHED", templateId: t.id, draft: t.doc as object, published: t.doc as object, publishedAt: new Date() },
    update: { draft: t.doc as object, published: t.doc as object, status: "PUBLISHED" },
  });
  console.log(username);
}
await db.$disconnect();
