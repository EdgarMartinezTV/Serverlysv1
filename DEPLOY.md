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

## Pre-cutover checklist

- [ ] `/billing/*` proxy rule live and verified on staging (login + session)
- [ ] `HOSTNAME=0.0.0.0` set, container reachable
- [ ] `public/` and `.next/static` present in the image
- [ ] Redirects mapped for any legacy URL whose path changed
- [ ] `https://serverlys.com/sitemap.xml` and `robots.txt` served
- [ ] Reversed/white Serverlys logo supplied (see DESIGN_SYSTEM.md) — footer currently
      uses a typographic wordmark because no such asset exists
