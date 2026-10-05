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
# NEXT_PUBLIC_* values are inlined at BUILD time, so a runtime env var alone
# changes nothing. Staging must set this to its own origin: robots.txt then
# disallows everything and canonicals stop claiming serverlys.com.
# NEXT_PUBLIC_ALLOW_INDEXING: unset = index only when the origin IS
# serverlys.com; "true" opts a non-production origin in (its canonicals point
# at itself); "false" forces noindex. Inlined at build, like the URL.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_ALLOW_INDEXING
# Analytics + search-engine verification. Inlined at build like the URL, so
# they must be set BEFORE the image is built (Easypanel: change, then force a
# rebuild — an unchanged commit skips the build). Unset = that piece is off.
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_CLARITY_PROJECT_ID
ARG NEXT_PUBLIC_ANALYTICS_ENABLED
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ARG NEXT_PUBLIC_BING_SITE_VERIFICATION
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-https://serverlys.com} \
    NEXT_PUBLIC_ALLOW_INDEXING=${NEXT_PUBLIC_ALLOW_INDEXING} \
    NEXT_PUBLIC_GTM_ID=${NEXT_PUBLIC_GTM_ID} \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID} \
    NEXT_PUBLIC_CLARITY_PROJECT_ID=${NEXT_PUBLIC_CLARITY_PROJECT_ID} \
    NEXT_PUBLIC_ANALYTICS_ENABLED=${NEXT_PUBLIC_ANALYTICS_ENABLED} \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=${NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} \
    NEXT_PUBLIC_BING_SITE_VERIFICATION=${NEXT_PUBLIC_BING_SITE_VERIFICATION} \
    NEXT_TELEMETRY_DISABLED=1
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

# Swarm uses this twice. A container that stops answering is marked unhealthy
# and replaced, even though its process is still alive. And on a deploy (the
# service updates start-first), the new container must turn healthy before the
# old one is stopped, so a build that boots but cannot serve never takes the
# site down. Both the probe and the homepage must answer: the probe proves the
# server is up, the homepage proves the build can render.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health \
   && wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]
