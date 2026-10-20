# syntax=docker/dockerfile:1
# Serverlys Bio — production image (Easypanel, Node runtime), built from THIS folder.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# prisma generate needs a syntactically valid URL at build time only.
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npm run build

# Prisma CLI with its full dependency tree, isolated so the runtime image
# stays the standalone bundle plus this one tool for `migrate deploy`.
FROM node:22-alpine AS migrator
WORKDIR /migrate
RUN npm init -y >/dev/null && npm install --omit=dev --no-audit --no-fund prisma@7.10.1

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3200 HOSTNAME=0.0.0.0 STORAGE_DIR=/app/.data/media
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Migrations run on boot from /migrate (CLI + schema + migrations + config).
COPY --from=migrator /migrate /migrate
COPY --from=builder /app/prisma /migrate/prisma
COPY --from=builder /app/prisma.config.ts /migrate/prisma.config.ts
RUN mkdir -p /app/.data/media && chown -R nextjs:nodejs /app/.data
USER nextjs
EXPOSE 3200
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s CMD wget -qO- http://127.0.0.1:3200/api/health >/dev/null || exit 1
CMD ["sh", "-c", "cd /migrate && node node_modules/prisma/build/index.js migrate deploy && cd /app && node server.js"]
