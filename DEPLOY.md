# Deploying Serverlys

Target: **Node runtime on Easypanel** (decided 2026-09-08).
`next.config.ts` sets `output: "standalone"`, which is required for this.

---

## ⚠️ Blocker: `/billing` must be reverse-proxied before DNS cutover

This is the single highest-risk item in the whole migration. **Read this before
pointing DNS at Easypanel.**

WHMCS is the entire Serverlys checkout and account system. It lives at
`https://serverlys.com/billing` — a *subdirectory of the same origin*, served
by the existing cPanel host. This Next.js app does **not** serve it and must
never try to.

The current site links into it heavily:

| Path | Purpose | Approx. links |
|---|---|---|
| `/billing/login` | Client login | 76 |
| `/billing/submitticket.php?step=2&deptid=1` | Sales enquiries | 21 |
| `/billing/cart.php?a=add&domain=register` | Domain registration | 18 |
| `/billing/cart.php?a=add&domain=transfer` | Domain transfer | 12 |
| `/billing/store/<group>/<plan>` | Plan checkout | all plan CTAs |

If `serverlys.com` resolves to Easypanel without a proxy rule, **every one of
those 404s** and the business cannot take an order.

### Required rule

In the Easypanel service, add a proxy rule that is matched *before* the app:

```
location ^~ /billing/ {
    proxy_pass         https://<cpanel-host-or-ip>/billing/;
    proxy_set_header   Host              serverlys.com;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto https;
    proxy_ssl_server_name on;
}
```

`Host: serverlys.com` matters — WHMCS builds absolute URLs and validates
sessions against the configured system URL. Sending the upstream's own
hostname will break login redirects and CSRF checks.

### Verify before cutover, on the staging hostname

```bash
curl -sI https://<staging-host>/billing/login | head -1        # expect 200
curl -sI "https://<staging-host>/billing/cart.php?a=add&domain=register" | head -1
```

Then log into WHMCS through the proxy and confirm the session survives a page
change. A 200 on the login *page* does not prove sessions work.

### The alternative, if a proxy is not wanted

Move WHMCS to `billing.serverlys.com`. That is a real migration, not a config
change: it changes the WHMCS system URL, invalidates existing sessions and
cookies, and needs 301s from every `/billing/*` path to preserve link equity.
Do not do it casually. If it is done, update **one** constant —
`BILLING` in `src/data/company.ts` — and every link in the app follows.

---

## Build & run

```bash
npm ci
npm run build          # emits .next/standalone
node .next/standalone/server.js
```

`standalone` does not copy `public/` or `.next/static` — the Dockerfile below
does it explicitly. Missing that step is why a standalone deploy renders
unstyled with broken images.

## Container

A `Dockerfile` is included. Easypanel: point the service at the repo, build
from the Dockerfile, expose port 3000.

Environment:

| Variable | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | |
| `PORT` | `3000` | Must match the exposed port |
| `HOSTNAME` | `0.0.0.0` | Standalone binds localhost otherwise, and the proxy cannot reach it |

## Hardening

### The origin must be reachable only through the proxy

This is a deployment control, and **no amount of application code substitutes
for it.** Every rate limit on this site keys off the visitor's address, and the
only place that address can be learned is a header — which means the limits are
worth exactly as much as the guarantee that our own proxy wrote that header.

`clientKey` (`src/lib/domains/provider.ts`) reads `X-Forwarded-For` counting
from the RIGHT, because each proxy appends what it observed: behind Traefik the
rightmost entry is Traefik's, and anything a caller injects is pushed left of
it and ignored. That property comes from there being a proxy at all. Reach the
container directly and the caller's own entry sits in that position, a rotating
header buys a fresh bucket per request, and every limit comes off at once. No
header distinguishes the two cases — this is not fixable in code.

So:

- [ ] Port 3000 is published **only** to Easypanel's internal network, never
      mapped to a public interface on the host. `EXPOSE 3000` in the Dockerfile
      is documentation; the port mapping in the service config is what binds.
- [ ] The host firewall permits 80/443 inbound and nothing else. Verify from
      OUTSIDE the machine — `nmap -Pn <host>` should show no 3000.
- [ ] If Cloudflare is put in front, set `TRUSTED_CLIENT_IP_HEADER=cf-connecting-ip`
      **and** restrict the origin to Cloudflare's IP ranges in the same change.
      Doing the first without the second makes things worse, not better: it
      turns a header anyone can send into the sole source of identity.

### Verify the limiter after any proxy change

A misconfigured chain fails silently — the site works, the limits do not. The
regression is covered in `scripts/test-sera.mjs`, and against the real
deployment:

```bash
# Rotating a forgeable header must NOT buy extra requests. Expect 429s.
for i in $(seq 1 25); do
  curl -s -o /dev/null -w "%{http_code} " \
    -H "X-Real-IP: 10.0.0.$i" \
    "https://serverlys.com/api/domains/whois?domain=example.com"
done; echo
```

25 × `200` means the limiter is keying on something the caller controls. Stop
and fix the proxy configuration before going further.

### Instance ceilings

Two limits are keyed on nothing at all, so they hold even if identity is fully
forged. They are the backstop for the case above, not a replacement for it:

| Ceiling | Where | Limit |
|---|---|---|
| Model calls (the OpenAI bill) | `GLOBAL_CHAT`, `src/lib/sera/rate-limit.ts` | 240/min |
| Domain + WHOIS lookups | `GLOBAL_MAX_PER_WINDOW`, `src/lib/domains/provider.ts` | 600/min |

Both are **per instance**. Running N replicas means the real ceiling is N times
the number above — size them deliberately before scaling out, and set
`SERA_SESSION_SECRET` at the same time or sessions break across containers.

### Secrets

- [ ] `SERA_SESSION_SECRET` generated (`openssl rand -base64 48`), not left to
      the per-process fallback
- [ ] `OPENAI_API_KEY` set as a secret in Easypanel, never in the image or repo
- [ ] `.env*` stays gitignored — confirm with `git check-ignore -v .env.local`

---

## Pre-cutover checklist

- [ ] `/billing/*` proxy rule live and verified on staging (login + session)
- [ ] `HOSTNAME=0.0.0.0` set, container reachable
- [ ] Port 3000 NOT publicly reachable (see Hardening) — verified with `nmap` from outside
- [ ] Rate-limit forgery check run against staging (see Hardening)
- [ ] `public/` and `.next/static` present in the image
- [ ] Redirects mapped for any legacy URL whose path changed
- [ ] `https://serverlys.com/sitemap.xml` and `robots.txt` served
- [ ] Reversed/white Serverlys logo supplied (see DESIGN_SYSTEM.md) — footer currently
      uses a typographic wordmark because no such asset exists
