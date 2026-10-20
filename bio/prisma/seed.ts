/**
 * Seeds the template library into the Template table.
 *
 *   npm run db:seed
 *
 * Idempotent: re-running updates name/category/description/content/sortOrder/
 * featured from src/lib/bio/templates.ts, but never touches `active` — admins
 * toggle that in the dashboard and a re-seed must not undo it.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { TEMPLATES } from "../src/lib/bio/templates.ts";

try {
  process.loadEnvFile?.(".env");
} catch {
  // No .env file (CI / production): the variables come from the environment.
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

async function main() {
  for (const [index, t] of TEMPLATES.entries()) {
    const data = {
      name: t.name,
      category: t.category,
      description: t.description,
      content: t.doc,
      sortOrder: index,
      featured: t.featured ?? false,
    };
    await db.template.upsert({
      where: { id: t.id },
      create: { id: t.id, ...data },
      update: data,
    });
  }
  console.log(`Seeded ${TEMPLATES.length} templates.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
