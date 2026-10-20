# Serverlys Bio — deployment

**Status: not deployed.** Nothing here has been applied to production. Every
step below needs Edgar's go-ahead (DNS, Easypanel, secrets).

## Shape

Two apps, one repo folder:

| App | Path | Serves | Runtime needs |
|---|---|---|---|
| Marketing site (existing) | `~/Desktop/Next js` | `serverlys.com/bio` (static page) + footer link | unchanged; new build ARG `NEXT_PUBLIC_BIO_APP_URL` (defaults to https://bio.serverlys.com) |
| Serverlys Bio | `~/Desktop/Next js/bio` | `bio.serverlys.com` (auth, dashboard, editor, admin, public pages, APIs) and verified customer domains | Postgres, a volume (or S3 bucket) for uploads, Resend key |

Why separate: the marketing site is deliberately static with no database
(ARCHITECTURE.md §0). Bio needs Postgres, sessions and per-request rendering;
keeping it in its own app keeps that out of the marketing site's build, LCP and
blast radius. The design tokens are mirrored in `bio/src/app/tokens.css`.

## Easypanel (project `webhosting`)

1. **Postgres service** `webhosting/bio-db` (Easypanel's Postgres template).
   Note the internal URL, e.g. `postgresql://postgres:<pw>@webhosting_bio-db:5432/serverlys_bio`.
2. **App service** `webhosting/bio` from the same GitHub repo, **build context
   `bio/`**, Dockerfile `bio/Dockerfile`. Port **3200**.
3. **Volume** mounted at `/app/.data` (uploads), unless S3 is configured.
4. **Env** (see `.env.example`): `DATABASE_URL`, `APP_URL=https://bio.serverlys.com`,
   `AUTH_SECRET` (`openssl rand -base64 48`), `MARKETING_URL=https://serverlys.com/bio`,
   `RESEND_API_KEY` (a **sending-only** key on the verified serverlys.com domain —
   never the full-access key), `EMAIL_FROM="Serverlys Bio <bio@serverlys.com>"`,
   `ADMIN_EMAILS=<Edgar's admin email>`, `CRON_SECRET`.
5. **Domain** `bio.serverlys.com` → `bio:3200` in Easypanel.
6. **DNS** (NameHero zone editor): `bio` A → `72.61.9.224`.
7. Boot runs `prisma migrate deploy` then the server. Seed templates once:
   `docker exec -it <bio container> node --experimental-strip-types prisma/seed.ts`
   (or run `npm run db:seed` locally against the production `DATABASE_URL`).
8. **Front door**: serverlys.com's edge nginx (billing-proxy, see the marketing
   repo's memory/DEPLOY notes) routes non-WHMCS paths to `serverlys:3000`; `/bio`
   is a normal marketing route, so **no edge change is needed** for the marketing
   page. bio.serverlys.com is its own Easypanel domain, not behind that nginx.
9. **Cron**: every 15 min `curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://bio.serverlys.com/api/cron/domains`
   (Easypanel cron, or a GitHub Actions schedule like the existing `uptime.yml`).
10. **Uptime**: add `https://bio.serverlys.com/api/health` to `.github/workflows/uptime.yml`.

### Marketing site
Set `NEXT_PUBLIC_BIO_APP_URL=https://bio.serverlys.com` (it's the default) and
force-rebuild (NEXT_PUBLIC_* is inlined at build). The CSP's `frame-src` already
allows that origin for the live template previews; bio's `/t/*` allows framing
from `MARKETING_ORIGINS`.

## Custom domains (customer-owned)

The app side is complete: ownership (TXT) + routing (CNAME/A) verification,
host routing in `src/proxy.ts`, cache invalidation, a certificate gate at
`GET /api/tls/ask?domain=<host>`, an HTTPS probe, and background re-checks.

**What the edge must do — open decision, not built:** Easypanel's Traefik
issues Let's Encrypt certificates only for domains added to a service. Two
options:

- **A. Caddy in front for customer domains (recommended).** Customers need a
  CNAME target that can terminate TLS for hostnames nobody configured in
  advance, which Traefik can't. Run a small Caddy service with `on_demand_tls { ask http://webhosting_bio:3200/api/tls/ask }`
  and `reverse_proxy webhosting_bio:3200`, give it its own IP/hostname (e.g.
  `domains.serverlys.com`), and set `CUSTOM_DOMAIN_TARGET=domains.serverlys.com`
  / `CUSTOM_DOMAIN_TARGET_IP=<its IP>`. Caddy then issues a certificate the
  first time a verified domain is requested and refuses all others.
- **B. Easypanel API automation.** On VERIFIED, call Easypanel's tRPC
  `domains.createDomain` for the bio service (the panel token handling is
  documented in the marketing site's memory notes). Simpler infra, but it
  depends on the panel API and its session token.

Until one is chosen, verified domains resolve and route correctly over HTTP but
**will not have HTTPS**, and the Domains screen says so via the HTTPS probe.

## Scaling notes

- Rate limits are in-process unless `REDIS_URL` is set — set it before running
  more than one replica.
- Public pages are cached in-process (`lib/server/public-pages.ts`, 60 s TTL)
  and dropped synchronously on publish, so the owner always sees their change
  immediately. With >1 replica, other replicas can serve the previous version
  for up to 60 s — move the cache to Redis (or add a pub/sub invalidation)
  before scaling out.
- Uploads: local volume is single-node; use `S3_*` (R2/B2/MinIO) for >1 replica.
- Analytics rows: one per view/click; indexes on (pageId, createdAt). At high
  volume, add a daily rollup table and prune raw events older than 13 months.

## Pre-launch checklist

- [ ] Legal review: Bio needs an acceptable-use addendum (user-generated
      pages) and the privacy policy must mention visitor analytics (cookieless,
      daily-rotated hash) and lead storage on customers' behalf.
- [ ] Choose custom-domain TLS option A or B.
- [ ] Resend sending-only key; `bio@serverlys.com` sender.
- [ ] `ADMIN_EMAILS` set; first admin logs in.
- [ ] Templates seeded; `/admin/health` all green.
- [ ] Run the Playwright suite against staging with `BIO_BASE_URL`.

## Local development

```bash
cd bio
cp .env.example .env            # set DATABASE_URL to a local Postgres
npx prisma migrate dev
npm run db:seed
RATE_LIMIT_DISABLED=1 npm run dev   # http://localhost:3200
npm run test:unit
npx playwright test             # app must be running
```
Emails are not sent locally; read them from the `OutboundEmail` table (the
verification link is in `body`).
