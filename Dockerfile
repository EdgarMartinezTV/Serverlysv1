# syntax=docker/dockerfile:1

# Serverlys — production image for Easypanel (Node runtime).
# Multi-stage: deps are installed once, the build runs against them, and the
# final image carries only the standalone server output.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    # Standalone binds to localhost by default, which the reverse proxy
    # cannot reach from outside the container.
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# `output: standalone` does NOT include these two — copying them is required
# or the site serves unstyled with missing images.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Sera's local lead log (lib/sera/notify/store.ts) writes to /app/.sera.
# /app belongs to root, so without this the non-root user cannot create it and
# every lead write fails. Mount a volume here to keep the log across deploys.
RUN mkdir -p /app/.sera && chown nextjs:nodejs /app/.sera

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
