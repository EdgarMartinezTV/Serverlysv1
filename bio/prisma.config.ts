import { defineConfig } from "prisma/config";

// Prisma 7 reads the connection string here, not from schema.prisma.
// `node --env-file` style loading: Next loads .env for the app; the CLI needs it explicitly.
try {
  process.loadEnvFile?.(".env");
} catch {
  // No .env file (CI / production): the variables come from the environment.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --experimental-strip-types --no-warnings prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
