# Serverlys — Production Architecture

**Date:** 2026-09-08
**Status:** Design only. Nothing in this document is implemented yet.
**Basis:** `PROJECT_AUDIT.md`, `DESIGN_SYSTEM.md`, `DEPLOY.md`.

---

## 0. Governing constraints

Five facts drive nearly every decision below. They are not preferences.

1. **WHMCS owns commerce.** Checkout, accounts, auth, tickets and domain lookup
   all live at `serverlys.com/billing` on the cPanel host. This application
   links and posts to it. It never re-implements it.
2. **`/billing` is same-origin and must be reverse-proxied** before DNS cutover,
   or checkout dies. This is a deployment-topology constraint, not app code.
3. **108 legacy URLs are indexed.** URL preservation outranks URL tidiness.
4. **The content is static and authored in-repo.** There is no runtime data
   source, so there is no data-fetching layer to design.
5. **Zero runtime dependencies today.** Every addition must earn its place
   against a stated benefit.

**Architectural consequence:** this is a **content-and-conversion site with an
external commerce boundary**, not a web application. The correct architecture is
a static-first, server-rendered site with a very small client surface. Most of
the machinery a "production architecture" usually implies — data layer, auth,
state management, API design, caching strategy — is **deliberately absent**, and
absence is the design decision.

---

## 1. Application structure

**Rendering model: static-first.**

| Mode          | Used for                             | Why                                                                                           |
| ------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| Static (SSG)  | Every marketing, legal and blog page | Content changes on deploy, not per request. Fastest possible TTFB behind the Easypanel proxy. |
| Dynamic (SSR) | Nothing currently                    | No per-request data exists                                                                    |
| ISR           | Not used                             | Would only matter if content moved to a CMS                                                   |
| Client        | 5 leaf components (§7)               | Interaction only                                                                              |

We deploy the **Node runtime** (`output: "standalone"`) rather than a static
export — not because pages are dynamic, but because it keeps `headers()`,
route handlers, `next/image` optimisation and future ISR available without a
re-architecture. Pages are still statically prerendered.

**Layer boundaries — strictly one-directional:**

```
app/  (routes: compose + own metadata)
  ↓ imports
components/sections/  (page bands: presentational, props-in)
  ↓ imports
components/ui/  (primitives: zero domain knowledge)

data/   ← imported ONLY by app/ and lib/, never by ui/ or sections/
lib/    ← pure functions; no React, no side effects
```

**Rule:** a component in `ui/` or `sections/` must never import from `data/`.
Pages read data and pass it down. This is a change from the current homepage,
where `Hero` imports `pricing` and `TrustBar`/`Migration` hard-code their
content — acceptable for one page, unworkable across twelve product pages that
need the same sections with different content. **Justification: reuse, not
purity.**

---

## 2. Routing architecture

### 2.1 Principles

- **URLs are inherited, not invented.** Every route mirrors a legacy path.
- **Explicit route directories, not a catch-all.** A `[slug]` catch-all makes
  all twelve product pages structurally identical and fights you the moment one
  needs to differ — which it will (domains ≠ hosting ≠ services). Explicit
  directories also preserve Next 16 typed routes and keep 404s honest. The cost
  is twelve thin `page.tsx` files; each is ~15 lines that compose shared
  sections from typed data.
- **A catch-all IS correct for the blog**, where 73 posts genuinely share one
  template.

### 2.2 Route groups

```
(marketing)  full-width shell, indexable, conversion-oriented
(legal)      narrow prose layout, thin-content pages get index:false
blog         listing + [slug]
```

Route groups do not affect URLs — they exist so legal pages get a genuinely
different layout (narrow measure, no CTA bands, table-of-contents) instead of a
marketing shell with the CTAs deleted.

### 2.3 The route registry — single source of truth

```ts
// src/data/routes.ts
export type RouteMeta = {
  path: string;
  title: string;
  group: "marketing" | "legal" | "blog" | "tool";
  status: "live" | "soon";
  sitemap: { include: boolean; priority: number; changeFrequency: ... };
  breadcrumb?: readonly { name: string; path: string }[];
};
```

**One registry feeds four consumers:** navigation, `sitemap.ts`,
breadcrumb structured data, and the legacy redirect map. Today the nav is
hand-maintained and there is no sitemap; without a registry those two will
drift, and a sitemap that disagrees with the nav is worse than none.

### 2.4 Redirects

`lib/redirects.ts` exports a typed map reconciled against Archive's
`_redirects`, consumed by `next.config.ts` `redirects()`. Every legacy URL
resolves 200 or 301 — never 404. A launch checklist item crawls all 108 legacy
URLs against staging.

---

## 3. Component architecture

### 3.1 Four layers

| Layer                                   | Knows about             | May import               | Example                                 |
| --------------------------------------- | ----------------------- | ------------------------ | --------------------------------------- |
| `ui/`                                   | Nothing domain-specific | `lib/utils`              | `Button`, `Field`, `Tabs`, `Disclosure` |
| `layout/`                               | Site shell, nav shape   | `ui/`, `data/navigation` | `SiteHeader`, `SiteFooter`              |
| `sections/`                             | A page band's shape     | `ui/`                    | `Hero`, `FaqSection`, `ProofBar`        |
| domain (`pricing/`, `domain/`, `blog/`) | One business concept    | `ui/`, its own types     | `PricingTable`, `DomainSearch`          |

`layout/` is the one permitted exception to the no-data rule: the header and
footer are site-wide singletons whose content _is_ the navigation data.

### 3.2 Component contract

- **Typed variants over `className` overrides.** Components expose
  `variant`/`size`/`tone`. Passing a `className` that overrides `display` or
  `color` silently loses to base classes — stylesheet order decides, not the
  author. **This bug has already shipped once** (`Log in` failed to hide on
  mobile). Add a variant; to hide responsively, wrap the component.
- **Sections accept `children` or slots** where a page needs to deviate, rather
  than growing a boolean prop per variation.
- **No component fetches or reads global state.** Props in, markup out.
- **Every interactive primitive owns its accessibility.** A consumer must not be
  able to render `Tabs` or `Disclosure` in an inaccessible state.

### 3.3 Primitives to add

Only these, and only when first needed: `Field` (label + control + error +
description wiring), `Input`, `Tabs` (extracted from `PricingTable`),
`Disclosure`, `Table` (comparison), `Prose` (legal/blog long-form).

---

## 4. Design-system architecture

Three tiers, all in `app/globals.css` under `@theme`:

```
1. Primitive scales   brand-50…950, ink-50…950, success/warn/danger
2. Semantic aliases   canvas, canvas-subtle, canvas-dark, canvas-dark-lifted
3. Component variants Button/Badge variant maps (in TS, not CSS)
```

**Rules that already exist and stay:**

- No arbitrary values in components; a value used twice becomes a token.
- Verified contrast floors are binding: `ink-400` fails as text on white
  (2.95:1); `ink-500`/`ink-600` fail on the dark band. Warn _text_ uses
  `warn-600`.
- `Section` owns vertical rhythm; `Container` owns horizontal gutters. Sections
  never invent padding.

**Additions:**

- A **surface contract**: every section declares `surface="light|subtle|dark"`,
  and text-colour tokens are chosen by surface. This is what prevents the dark
  band contrast failures from recurring as the site grows.
- A **contrast test in CI** that re-computes every documented pair and fails the
  build on regression. The ratios are already computed manually; automating it
  costs one script.
- Dark mode remains **out of scope**. Shipping it half-working is worse than not
  shipping it; the token structure supports adding it later without a rewrite.

---

## 5. Data architecture

**All content is TypeScript modules in `src/data/`.** No CMS, no database, no
runtime fetching.

```
data/
  company.ts       identity, contact, WHMCS URLs        ← single BILLING constant
  routes.ts        route registry (§2.3)
  navigation.ts    header + footer IA (derives from routes)
  pricing.ts       plan groups, tiers, verified WHMCS slugs
  products.ts      per-product page content (12 product pages)
  faqs.ts          scoped Q&A — also the FAQPage source
  testimonials.ts  social proof
  legal.ts         legal page metadata + last-updated dates
```

**Why TypeScript and not a schema validator:** the data is static, in-repo and
compiled. `tsc` already rejects a malformed plan at build time. Zod would add a
dependency to validate data that cannot vary at runtime. If content ever moves
to a CMS, validation gets added **at that boundary** — not before.

**Derived values live in `lib/`, never duplicated in data.** `orderUrl()`,
`lowestAnnualRate`, `faqsFor()` are functions over the data, so a price appears
in exactly one place.

**Invariants enforced by types, not convention:**

- A `Plan` cannot exist without a `renewal` price — the type requires it, so the
  commercial commitment ("always show the renewal rate") cannot be dropped by
  omission.
- Plan `slug` is the WHMCS contract. Comment marks it as such. The WordPress
  slugs look wrong and are correct.

---

## 6. API boundaries

### 6.1 What this application exposes

| Route                     | Purpose                          | Auth                |
| ------------------------- | -------------------------------- | ------------------- |
| `GET /api/health`         | Easypanel container health check | None                |
| `POST /api/domains/check` | Domain availability lookup       | None (rate-limited) |

**AMENDED 2026-09-08.** This document originally stated domain search would be
an HTML `GET` form to WHMCS with no route handler. That remains the no-JS
fallback and is still what the marketing-page search widget does. The
_interactive_ search added on `/register-domain` needs a server route for three
reasons that are not negotiable:

1. WHMCS admin credentials must never reach the browser.
2. Calling RDAP from the client hits CORS and leaks per-user rate limits.
3. Caching and de-duplication have to be shared, not per-tab.

The route reads no user data, stores nothing, and holds an in-memory cache and
rate limiter — both **per instance**, so horizontal scaling requires moving them
to a shared store. Provider selection lives behind a `DomainProvider` interface
with two implementations (WHMCS, RDAP) and **no mock**: an unconfigured
deployment returns a 503 the UI renders honestly, because a fabricated
"available" would send someone to checkout for a name they cannot buy.

### 6.2 What it does NOT own

| Concern                                         | Owner | Integration                               |
| ----------------------------------------------- | ----- | ----------------------------------------- |
| Checkout / cart                                 | WHMCS | Outbound link                             |
| Client accounts, login, sessions                | WHMCS | Outbound link                             |
| Domain availability lookup                      | WHMCS | **HTML `GET` form → `cart.php`**          |
| Support tickets, abuse reports, sales enquiries | WHMCS | **HTML `POST` form → `submitticket.php`** |
| Billing, invoices, provisioning                 | WHMCS | Outbound link                             |

### 6.3 Why no server-side proxying of WHMCS

Forms submit **directly to WHMCS from the browser**. Routing them through a
Server Action or route handler would:

- break WHMCS CSRF and session validation (it expects its own origin/cookies),
- add a hop and a failure mode to the revenue path,
- make our server responsible for data it should never hold.

Native form `action` attributes are also the progressive-enhancement path: the
forms work with JavaScript disabled.

**Explicitly not built: authentication, database, ORM, session handling,
server-side form processing.** Rebuilding what WHMCS already does correctly is
the most expensive available mistake.

---

## 7. Server / client component strategy

**Server by default. Client is an exception that must be justified.**

Permitted client components — all **leaves**, never wrapping large trees:

| Component       | Why client                            | Fallback without JS                                    |
| --------------- | ------------------------------------- | ------------------------------------------------------ |
| `SiteHeader`    | Menu open state, scroll state         | Links render; panels reachable via mobile nav          |
| `MobileNav`     | Dialog state, focus trap, scroll lock | Hidden; desktop nav present                            |
| `PricingTable`  | Tab + billing-term state              | **Must render one group + annual pricing server-side** |
| `DomainSearch`  | Optional input polish only            | **Form fully functional without JS**                   |
| `CookieConsent` | Consent state, storage                | No banner; no non-essential scripts load               |
| `Analytics`     | Script injection post-consent         | No tracking                                            |

**Rules:**

- A client component may not import a server component as a child; pass it as
  `children` instead.
- No client component wraps a page or layout.
- Interactive state must degrade: the pricing table renders real prices in HTML
  before hydration, so search engines and no-JS users see the offer.

---

## 8. SEO architecture

### 8.1 Metadata

`lib/seo.ts` remains the single factory. Every page calls `pageMetadata()`;
none hand-writes a `Metadata` object. Titles are absolute per page.

### 8.2 Structured data — one entity graph

```
Root layout (once)   Organization  ← the canonical @id
                     WebSite       ← publisher → Organization
                     ImageObject   ← logo
Per page (as earned) BreadcrumbList
Product pages        Product + Offer  (price, priceCurrency, availability)
Pricing + home       FAQPage        ← must mirror visibly rendered Q&A
Blog posts           BlogPosting    ← author/publisher by @id reference
```

**Binding rules:** no `LocalBusiness`, no `address`, no `geo`, no invented
`foundingDate` or `founder`. Every `publisher`/`provider` references
`{"@id": ".../#organization"}` rather than repeating a stub. Global brand
positioning — no city keywords.

### 8.3 Crawl surface

- `app/sitemap.ts` generated from the route registry — never hand-maintained.
- `app/robots.ts` with the sitemap pointer.
- Canonicals absolute on every page.
- Thin legal pages: `index: false, follow: true`.
- `soon` products: indexable (they carry demand signal) but must never render a
  purchase CTA.

### 8.4 Cutover protection

A launch script crawls all 108 legacy URLs against staging and fails on any
404 or unintended redirect chain. This is the single highest-risk SEO event in
the project.

---

## 9. Image strategy

**Current reality: one image exists.** The strategy therefore covers both how
images are handled and how the asset gap gets closed.

| Concern    | Decision                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Component  | `next/image` exclusively. No raw `<img>`.                                                                                                  |
| Formats    | AVIF → WebP → original. Already configured.                                                                                                |
| Hosting    | **Self-hosted in `public/`.** No remote patterns; no third-party image hosts.                                                              |
| Sizing     | Every image passes explicit `sizes`. Intrinsic `width`/`height` always set — zero CLS.                                                     |
| LCP        | Exactly one `priority` image per page, above the fold. Never more.                                                                         |
| Decorative | `alt=""` + `aria-hidden`. Never invent alt text for ornament.                                                                              |
| OG images  | `app/opengraph-image.tsx` via `ImageResponse` — generated from title + brand, so every page gets a real card with no design work per page. |

**Asset organisation:**

```
public/brand/     logo, favicons, OG fallback
public/product/   cPanel / WHMCS / dashboard screenshots
public/photo/     photography
```

**Asset gap (blocking, tracked in the audit):** no product screenshots, no
photography, no reversed logo. Recommended source is **real cPanel/WHMCS
screenshots** — authentic, free, and more persuasive than stock. Until assets
exist, sections must be designed to work typographically rather than shipped
with placeholders.

---

## 10. Font strategy

**Recommendation: reduce three families to two.**

|         | Current                   | Proposed                       |
| ------- | ------------------------- | ------------------------------ |
| Display | Inter Tight (500/600/700) | **Inter** at negative tracking |
| Body/UI | Inter (400/500/600)       | **Inter** (400/500/600)        |
| Numeric | JetBrains Mono (400/500)  | **JetBrains Mono** (400/500)   |
| Payload | 20 files / **528 KB**     | ~2/3 of that                   |

Inter and Inter Tight are close relatives; the display voice is recoverable with
`letter-spacing` at large sizes, which the type scale already applies. The saving
is real and fonts are the heaviest asset class on a site that currently has no
images — and images are coming.

**This is a design call, not purely technical.** Flagging it for confirmation
rather than assuming it. If the tighter display voice is judged worth 170 KB,
keeping Inter Tight is defensible — but then it should be display-only at 600
weight, dropping 500 and 700.

**Mechanics either way:** `next/font` self-hosting (no Google runtime request),
`display: swap`, subset to `latin`, only weights actually used, CSS variables
consumed via `@theme`. Numeric UI uses `font-variant-numeric: tabular-nums`.

---

## 11. Animation strategy

**CSS-first. No animation library.**

- Two easings and three durations, already tokenised.
- Permitted: hover/focus transitions, disclosure open/close, menu reveal,
  subtle scroll-triggered entrances via CSS `animation-timeline` where
  supported, degrading to no animation elsewhere.
- **Motion never carries information.** Anything conveyed by movement must also
  be conveyed by text, state or ARIA.
- `prefers-reduced-motion: reduce` removes all of it — already implemented
  globally.
- No parallax, no scroll-jacking, no entrance animation on content above the
  fold (it delays LCP and reads as latency).

**When a library would be justified:** a genuinely orchestrated sequence with
interruption and shared-element continuity. Nothing on the roadmap needs that.
If one appears, evaluate then — do not pre-install.

---

## 12. Error handling

Because there is no backend, errors are rendering or routing errors.

| Boundary          | File                        | Behaviour                                                                                                                                              |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Route segment     | `app/(marketing)/error.tsx` | On-brand recovery page, `reset()` retry, links to home/pricing/support                                                                                 |
| Root              | `app/global-error.tsx`      | Self-contained (own `<html>`), minimal inline styles — must not depend on the design system it may be failing to load                                  |
| Not found         | `app/not-found.tsx`         | Branded 404 with search-intent links: plans, domains, blog, support. **404s will happen at cutover; this page is a recovery surface, not a dead end.** |
| Blog post missing | `notFound()` in `[slug]`    | Falls through to `not-found.tsx`                                                                                                                       |

**Principles:** never surface a stack trace or raw message to a user. Every
error page offers at least one route back into the funnel and the support
contact. Errors are logged to the platform (stdout → Easypanel) — no client
error-reporting SDK unless a real need appears.

---

## 13. Loading states

**Honest position: this site is statically prerendered, so loading states are
mostly a safety net rather than a visible experience.**

- `app/blog/loading.tsx` — the one place a skeleton could genuinely show, if the
  blog later becomes CMS-backed.
- Route-level `loading.tsx` on marketing groups for navigation transitions.
- **No skeletons on static content.** A skeleton that flashes for 20ms is worse
  than nothing.
- Only genuinely async surface: none today.
- Client interactions (tab switch, menu open) are synchronous — no spinners.

**Rule:** do not build a loading state for something that never loads.

---

## 14. Empty states

Few, but each needs a real design rather than a blank region:

| Surface                 | Empty case                           | Treatment                                                                   |
| ----------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| Blog listing / category | No posts match a filter              | Explain, clear the filter, show recent posts                                |
| Blog search             | No results                           | Suggest popular posts + link to support                                     |
| 404                     | Unknown URL                          | Recovery links (§12)                                                        |
| Domain search           | _Not ours_ — results render on WHMCS | Our job is only to validate input before submit                             |
| `soon` products         | Product not purchasable              | Clear "coming soon" state with a notify/contact path — **never a dead CTA** |

**Rule:** an empty state always explains _why_ it is empty and offers the next
action.

---

## 15. Form handling

**Native HTML forms posting directly to WHMCS. No form library, no server
actions, no API routes.**

| Form            | Method | Target                                                   |
| --------------- | ------ | -------------------------------------------------------- |
| Domain search   | `GET`  | `billing/cart.php` (`a=add`, `domain=register`, `query`) |
| Domain transfer | `GET`  | `billing/cart.php` (`domain=transfer`)                   |
| Report abuse    | `POST` | `billing/submitticket.php` (`deptid`)                    |
| Sales / contact | `POST` | `billing/submitticket.php` (`deptid=1`)                  |

**Progressive enhancement contract:** every form is fully functional with
JavaScript disabled. Client JS may only add input normalisation (trimming a
pasted `https://` from a domain query), inline validation hints, and submit
affordance. It must never become required for submission.

**Validation:** HTML5 constraint validation first (`required`, `pattern`,
`type`). JS supplements with accessible messaging; it does not replace it.
Server-side validation is WHMCS's responsibility — we must not imply otherwise.

**Accessibility (non-negotiable):** every control has a visible `<label>`;
errors are `aria-describedby`-linked and announced via a polite live region;
errors appear inline at the field, never only as a summary; focus moves to the
first invalid field; no placeholder-as-label.

**Anti-pattern explicitly banned:** faking a result client-side. The previous
build derived domain availability from a hash of the query. The real lookup is
free — WHMCS does it.

---

## 16. Analytics architecture

**Purpose:** measure the funnel this site exists to serve — specifically
handoffs to WHMCS, which are the conversion events.

**Architecture:**

```
components/analytics/  provider (loads post-consent, next/script afterInteractive)
lib/analytics.ts       track(event) — typed event union, single call surface
data/events.ts         the event taxonomy
```

**Event taxonomy (small and deliberate):**
`plan_selected` (group, tier, term) · `checkout_started` (outbound to
`/billing/store/*`) · `domain_searched` · `contact_started` ·
`login_clicked` · `faq_opened`.

**Rules:**

- **Consent-gated.** Nothing non-essential loads before consent (§17). This is
  the same gate as the cookie banner — one mechanism, not two.
- **No PII.** No emails, no domain queries containing personal names, no form
  contents.
- Typed events only — no string literals at call sites, so the taxonomy cannot
  drift.
- Loaded `afterInteractive`; analytics must never compete with LCP.

**Vendor: decision required.** A privacy-first, cookieless tool (e.g. Plausible)
would let most measurement run without consent friction and is a better fit for
a site that already publishes a GDPR posture. GA4 is the alternative if
continuity with existing historical data matters. **Recommendation:
privacy-first; confirm before implementing** — this affects the consent design.

---

## 17. Security boundaries

| Boundary           | Position                                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trust**          | This app is a public, unauthenticated, read-only site. It holds no secrets and no user data.                                                                                     |
| **`/billing`**     | The one sensitive boundary, and it is _outside_ this app. Proxy must forward `Host: serverlys.com` or WHMCS session/CSRF validation breaks. Verify with a real login on staging. |
| **Headers**        | HSTS, `nosniff`, `X-Frame-Options`, Referrer-Policy, Permissions-Policy — already shipped.                                                                                       |
| **CSP**            | **The notable gap.** See tension below.                                                                                                                                          |
| **External links** | `rel="noopener noreferrer"`, enforced by the `Button`/link components.                                                                                                           |
| **Container**      | Non-root user, multi-stage build, no build tooling in the runtime image.                                                                                                         |
| **Dependencies**   | Zero-dependency default. Any addition needs a stated justification and a `npm audit` clean.                                                                                      |
| **Secrets**        | None exist. If any appear, they are server-only; `NEXT_PUBLIC_*` is treated as published.                                                                                        |

**CSP tension worth stating plainly:** a nonce-based CSP requires middleware to
generate a per-request nonce, which forces dynamic rendering and forfeits static
prerendering across the whole site. Since this site injects inline JSON-LD and
`next/font` emits inline styles, the practical options are:

1. **Hash-based CSP** for the known inline blocks — preserves static rendering.
   _Recommended._
2. `Content-Security-Policy-Report-Only` first, to gather violations without
   risk, then enforce.
3. Nonce-based — only if the site later becomes dynamic anyway.

Ship (2) immediately, converge on (1).

---

## 18. Environment configuration

Minimal by design; there is almost nothing to configure.

| Variable                     | Scope  | Required | Purpose                                                              |
| ---------------------------- | ------ | -------- | -------------------------------------------------------------------- |
| `NODE_ENV`                   | server | yes      |                                                                      |
| `PORT`                       | server | yes      | Must match exposed container port                                    |
| `HOSTNAME`                   | server | yes      | `0.0.0.0` — standalone binds localhost otherwise                     |
| `NEXT_PUBLIC_SITE_URL`       | public | yes      | Canonicals/OG; must differ on staging or staging gets indexed        |
| `NEXT_PUBLIC_ANALYTICS_ID`   | public | no       | Absent ⇒ analytics disabled                                          |
| `NEXT_PUBLIC_BILLING_ORIGIN` | public | no       | Defaults to `https://serverlys.com/billing`; overridable for staging |

**`lib/env.ts`** validates at boot and **fails fast with a clear message** — a
missing `NEXT_PUBLIC_SITE_URL` must break the build, not silently emit
`undefined` canonicals. Hand-rolled; no dependency.

`.env.example` is committed and documents every variable. No `.env*` with real
values is ever committed.

---

## 19. Deployment architecture

```
GitHub ──► Easypanel (build from Dockerfile) ──► container :3000
                                                      │
Browser ──► Easypanel reverse proxy ──────────────────┤
                     │
                     └── /billing/* ──► cPanel host (WHMCS)   ← MUST EXIST
```

- **Image:** multi-stage Node 22 Alpine, non-root, `output: standalone`.
  `public/` and `.next/static` copied explicitly — standalone omits them, and
  missing that step is why a standalone deploy renders unstyled.
- **Health check:** `/api/health` for container readiness.
- **Environments:** staging on a separate hostname with
  `NEXT_PUBLIC_SITE_URL` pointed at it and `robots` set to `noindex` — a staging
  site that gets indexed is a real SEO incident.
- **Rollback:** image tags per deploy; roll back by retagging, not rebuilding.
- **Cutover sequence:** proxy verified with a real WHMCS login → legacy-URL
  crawl passes → DNS TTL lowered → cut over → re-crawl → monitor 404s.

---

## 20. Proposed directory structure

Adapted to this project. Where the example structure did not fit, that is noted
with a reason — the goal is a structure this codebase needs, not a conventional
one copied in.

```
serverlys/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx                 full-width shell
│   │   │   ├── page.tsx                   home
│   │   │   ├── pricing/page.tsx
│   │   │   ├── cloud-hosting/page.tsx
│   │   │   ├── wordpress-hosting/page.tsx
│   │   │   ├── store-hosting/page.tsx
│   │   │   ├── managed-hosting/page.tsx
│   │   │   ├── shared-hosting/page.tsx        (soon)
│   │   │   ├── vps-hosting/page.tsx           (soon)
│   │   │   ├── dedicated-servers/page.tsx     (soon)
│   │   │   ├── register-domain/page.tsx
│   │   │   ├── transfer-domain/page.tsx
│   │   │   ├── web-design/page.tsx
│   │   │   ├── custom-development/page.tsx
│   │   │   ├── site-management/page.tsx
│   │   │   ├── seo-marketing/page.tsx
│   │   │   ├── socialmedia-management/page.tsx
│   │   │   ├── wp-migrations/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── our-process/page.tsx
│   │   │   ├── case-studies/page.tsx
│   │   │   ├── success-stories/page.tsx
│   │   │   ├── hosting-alternatives/page.tsx
│   │   │   ├── whois-lookup/page.tsx
│   │   │   ├── tutorials/page.tsx
│   │   │   ├── ai-tools/page.tsx
│   │   │   └── error.tsx
│   │   ├── (legal)/
│   │   │   ├── layout.tsx                 narrow prose shell
│   │   │   ├── privacy-policy/page.tsx
│   │   │   ├── terms-of-service/page.tsx
│   │   │   ├── refund-policy/page.tsx
│   │   │   ├── legal-information/page.tsx
│   │   │   ├── accessibility/page.tsx
│   │   │   └── report-abuse/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   └── loading.tsx
│   │   ├── api/health/route.ts
│   │   ├── layout.tsx                     root: fonts, entity graph, shell
│   │   ├── globals.css                    the ONLY stylesheet
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx
│   │   ├── not-found.tsx
│   │   ├── global-error.tsx
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── ui/            button, badge, container, section, json-ld,
│   │   │                  input, field, tabs, disclosure, table, prose
│   │   ├── layout/        site-header, site-footer, wordmark
│   │   ├── navigation/    mega-menu, mobile-nav, breadcrumbs
│   │   ├── sections/      hero, proof-bar, feature-grid, split-feature,
│   │   │                  migration, faq, final-cta, testimonials
│   │   ├── pricing/       pricing-table, comparison-table, plan-card
│   │   ├── domain/        domain-search, domain-pricing-table
│   │   ├── blog/          post-card, post-body, post-meta
│   │   ├── forms/         abuse-form, contact-form, field-error
│   │   └── analytics/     analytics-provider, cookie-consent
│   │
│   ├── data/              company, routes, navigation, pricing, products,
│   │                      faqs, testimonials, legal, events
│   ├── lib/               seo, utils, env, analytics, redirects, format
│   ├── hooks/             use-disclosure, use-scrolled   (see note)
│   └── content/blog/      MDX posts   (only if option (a) — see §21)
│
├── public/
│   ├── brand/             logo, reversed logo, favicons, OG fallback
│   ├── product/           cPanel / WHMCS / dashboard screenshots
│   └── photo/             photography
│
├── scripts/               shoot.mjs, a11y.mjs, contrast.mjs, crawl-legacy.mjs
├── ARCHITECTURE.md  PROJECT_AUDIT.md  DESIGN_SYSTEM.md  DEPLOY.md
├── Dockerfile  .dockerignore  .env.example
└── next.config.ts  tsconfig.json  eslint.config.mjs  .prettierrc
```

### Deviations from the example structure, and why

| Example folder           | Decision                                   | Reason                                                                                                                                                                                                                                                  |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `styles/`                | **Not used**                               | One stylesheet, `app/globals.css`. Tailwind v4 is CSS-first and the token system is ~260 lines. A `styles/` directory would hold one file and imply more CSS is coming — it isn't.                                                                      |
| `config/`                | **Not used**                               | Its contents already have better homes: site constants in `data/company.ts`, env in `lib/env.ts`, build config in `next.config.ts`. A third location invites duplication of the `BILLING` constant, which is exactly the thing that must stay singular. |
| `hooks/`                 | **Included, but stays empty until earned** | Created only when a hook is used twice. `use-disclosure` and `use-scrolled` are the two likely extractions from existing header/nav code. A hooks folder with one single-use hook is worse than inline state.                                           |
| `components/forms/`      | **Included**                               | Real forms exist (abuse, contact) and share field/validation patterns.                                                                                                                                                                                  |
| `components/navigation/` | **Split from `layout/`**                   | The mega menu and mobile nav are 550 LOC between them and are the most complex interactive code in the project. They deserve their own boundary rather than sitting beside a 40-line footer.                                                            |
| `content/`               | **Conditional**                            | Only exists if the blog is MDX in-repo (§21). If the blog is proxied, this folder never appears.                                                                                                                                                        |

---

## 21. Open decisions (needed before implementation)

Four, and each materially changes the build:

1. **Blog strategy** — MDX in-repo (better end state, 73 files to convert) vs
   proxy `/blog/*` to the legacy host (lowest cutover risk, preserves rankings
   immediately, defers the work). _Recommendation: proxy first, migrate to MDX
   after launch._
2. **Analytics vendor** — privacy-first/cookieless vs GA4. Affects the consent
   design. _Recommendation: privacy-first._
3. **Font families** — 3 → 2, saving ~170 KB. _Recommendation: reduce; confirm
   the display-voice tradeoff._
4. **Pricing presentation** — keep 4 tiers, or 3 tiers plus a comparison table.
   _Recommendation: 3 + comparison; the fourth tier currently competes with the
   "most popular" signal._

---

## 22. What this architecture deliberately does not include

Stated so their absence reads as a decision rather than an oversight:

- No authentication, session handling or user accounts — WHMCS owns them.
- No database, ORM or migrations — there is no mutable state.
- No state-management library — server components plus five leaf components.
- No data-fetching library — nothing is fetched at runtime.
- No UI component library — the primitives are ~500 LOC and fully controlled.
- No animation library — CSS covers every planned interaction.
- No form library — native forms post to WHMCS.
- No i18n — single locale; adding it later is additive, not structural.
- No dark mode in v1 — tokens support it; shipping it half-working does not.
- No CMS — content is in-repo and versioned with the code.

Each is a reversible decision. None is reversible cheaply if made wrongly in the
other direction, which is why the default is to leave them out.

---

## Amendment — complete site build

### Route inventory

39 routes build. 24 pages plus 5 articles are indexable; `/design-system` is
built and deliberately `indexable: false`.

Hosting `/hosting` `/cloud-hosting` `/wordpress-hosting` `/ecommerce-hosting` ·
Domains `/domain-name` `/register-domain` · AI `/ai-agents` `/convoai`
`/callflow-ai` `/automations` · Services `/website-design`
`/website-development` `/seo` `/marketing` `/social-media`
`/business-solutions` · Company `/pricing` `/about` `/contact` `/resources`
`/blog` `/blog/[slug]` `/faq` `/support`.

### Redirects live in next.config.ts, not middleware

Two groups: legacy URLs from the previous serverlys.com, which carry inbound
links and search history; and aliases for campaign names that are not the
canonical route. All 308. Config-level redirects are handled at the edge before
the app runs, cost nothing per request, and cannot drift from the router the
way a middleware matcher can.

`/chatrep` → `/convoai`. **Open question for the client:** the brief says
"ChatRep", the live application at convoai.cloud says "ConvoAI". `/convoai` is
canonical here and ChatRep redirects to it. If ChatRep is the intended
customer-facing name, this reverses — one commit, but it must be decided before
launch because it changes the indexed URL.

### Editorial content is typed data, not markdown

`data/articles.ts` holds a small block union (`p`, `h2`, `ul`, `ol`, `callout`).
No markdown parser, no MDX, no prose stylesheet — the dependency count stays at
zero and articles render through the design system's own typography rather than
a second, competing one. The cost is that authoring requires editing a
TypeScript file; that is the right trade at five articles and should be
revisited if this becomes a real publishing surface.

`author` on the Article graph is the Organization. Serverlys has no named
bylines and inventing one would misrepresent the entity.

### OpenGraph cards are a keyed registry

`data/og-cards.ts` maps route path → card copy; `/og/[key]` renders it and
404s on an unknown key. Two reasons this is not per-route
`opengraph-image.tsx` files:

1. Every page declares `openGraph` explicitly via `pageMetadata`, which
   suppresses Next's file-based image for that route. 26 pages shipped with no
   `og:image` at all before this was caught by the SEO audit. A registry cannot
   silently miss a page.
2. A card route that takes `?title=` from the query string lets anyone render
   arbitrary words onto a Serverlys-branded image and share it as ours.

All keys are known at build time, so all 29 cards are prerendered.

### Still outstanding

- **`/billing` reverse proxy remains the launch blocker.** See DEPLOY.md.
- **The pricing source conflict is unresolved.** Documented in `data/pricing.ts`:
  legacy `/pricing` and `/cloud-hosting` disagree on renewal rates and RAM.
  Figures follow `/pricing`. WHMCS is the only authority and must be reconciled
  before launch.
- **Legal pages are unwritten** — `/privacy-policy`, `/terms-of-service`,
  `/refund-policy`, `/legal-information`, `/report-abuse`, `/accessibility`.
  They are registry entries with `built: false` and no interim, so the footer
  renders them as plain text rather than linking to a 404. These are real legal
  documents and are not something to draft speculatively.
