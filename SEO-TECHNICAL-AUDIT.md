# SEO & performance technical audit — 2026-10-04

Scope: the Next.js 16.3 (App Router, Turbopack, React 19.2, `output:
"standalone"`) rebuild of serverlys.com, deployed to staging at
`webhosting-serverlys.rf90qw.easypanel.host`. Every number below was measured,
not estimated; method at the end.

Companion documents: [SEO-LAUNCH-CHECKLIST.md](SEO-LAUNCH-CHECKLIST.md) ·
[SEO-KEYWORD-MAP.md](SEO-KEYWORD-MAP.md) ·
[SEO-INTERNAL-LINK-MAP.md](SEO-INTERNAL-LINK-MAP.md) ·
[SEO-60-DAY-PLAN.md](SEO-60-DAY-PLAN.md)

---

## 1. Original condition

The site was already in strong shape. Before any change:

| Check | Result |
|---|---|
| Indexable pages (sitemap) | 128 — all HTTP 200, one `<h1>` each, unique titles, unique descriptions, absolute self-canonical, structured data on every page |
| Internal links | every target resolves (`npm run audit:links`) |
| Console errors | none on any of 128 routes (`npm run test:console`) |
| Security headers | CSP, HSTS (preload), nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options already set |
| Redirects | http→https 301, trailing slash 308, 22 legacy paths 301'd, real 404s for unknown URLs |
| Structured data | one `@id`-linked Organization + WebSite, Product/AggregateOffer (no fake ratings), Service, FAQPage, BreadcrumbList, Article |

PageSpeed on **staging** (local Lighthouse 12, sequential runs):

| | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| Mobile `/` | 89 | 100 | 100 | 69 |
| Desktop `/` | 100 | 100 | 100 | 69 |

SEO 69 is a single audit, `is-crawlable`: staging's `robots.txt` is
`Disallow: /` **on purpose**. On a production build every audited route
scored SEO 100.

Baseline across the money pages (local production build, mobile, 1 run):
perf 87–94, with **`/domain-name` scoring 0** (no LCP recorded — see 3.1);
accessibility 100 except `/website-development` 96 (mobile), `/hosting` 97
and `/pricing` 90 (desktop).

## 2. Issues found

| # | Severity | Issue |
|---|---|---|
| 1 | **High** | `/domain-name`, `/register-domain`, `/transfer-domain`, `/whois-lookup` recorded **no LCP at all** → Lighthouse performance 0 |
| 2 | **High** | `company.url` hard-coded to `https://serverlys.com`: staging served canonicals/JSON-LD claiming serverlys.com while its robots.txt blocked everything; the Dockerfile comment promised otherwise |
| 3 | High | 48 pages emitted `BreadcrumbList` JSON-LD with **no visible breadcrumb** (visible trail removed 2026-09-11) — markup not matching visible content |
| 4 | High | `/pricing` comparison table: `<details>` inside `role="table"` → invalid ARIA tree (aria-required-children/parent); A11y 90 |
| 5 | Medium | Colour contrast 4.41:1 and 4.26:1 (< 4.5) in the live-demo shell (`/hosting` and every page using it) and `/website-development` |
| 6 | Medium | Hero LCP image on `/cloud-hosting` and `/wordpress-hosting` was `loading="lazy"` — 1.4–1.8 s load delay |
| 7 | Medium | Sitemap `lastmod` = build time on every page — tells Google every page changed on every deploy, which trains it to ignore lastmod |
| 8 | Medium | Organization logo was the 1653×409 wide lockup — renders as a sliver on square search surfaces |
| 9 | Medium | `Article` schema had no `image` (required for article rich results) and no `isPartOf` |
| 10 | Medium | A false claim in `ai-tools-small-business`: "every Serverlys hosting plan includes … AI widget, no setup required" |
| 11 | Low | 5 original articles linked to no commercial page; no article linked to `/seo`, `/ai-agents`, `/callflow-ai`, `/convoai` |
| 12 | Low | `/public` assets served `max-age=0` (revalidated every view); image optimizer cache 4 h |
| 13 | Low | Titles that under-used intent (`/seo`, `/ai-agents`, `/hosting`, home) or lacked the brand (`/cloud-hosting`, `/domain-name`, `/ecommerce-hosting`); `/ecommerce-hosting` description was generic copy containing an unverified "24/7 support" |
| 14 | Low | No web app manifest; `next/image` `priority` (deprecated in Next 16) |

## 3. Changes

### 3.1 Performance
- **NO_LCP fix (#1).** The "popular domains" rails are `snap-x
  snap-mandatory` with `px-*` padding but no `scroll-padding`, so mandatory
  snapping scrolled them ~16 px on load. Chrome treats that scroll as the end
  of the load and stops recording LCP. Added matching `scroll-px-*`
  (`popular-rail.tsx`, `ref/domain/popular.tsx`). All four pages now record
  their H1 as LCP at 236–332 ms.
- **Eager hero LCP images (#6).** `MockPhoto eager` now emits
  `loading="eager" fetchPriority="high"` (Next 16 guidance) instead of the
  deprecated `priority`; applied to the two hero photos that are the LCP
  element. Below-the-fold photos stay lazy.
- **Caching (#12).** `/brand`, `/mock`, `/Hosting-images` and icons:
  `public, max-age=86400, stale-while-revalidate=604800` (not immutable — the
  filenames are not hashed). `images.minimumCacheTTL` 30 days. Hashed
  `/_next/static` was already `immutable`.

### 3.2 Crawl, index & canonical
- `NEXT_PUBLIC_SITE_URL` is now the single SEO identity: `company.url` derives
  from it (normalised, no trailing slash). WHMCS stays on its own
  `NEXT_PUBLIC_BILLING_ORIGIN`, so checkout/login links never follow staging.
- New `publicEnv.allowIndexing` (`NEXT_PUBLIC_ALLOW_INDEXING`, build-time,
  passed through the Dockerfile) drives both `robots.txt` and per-page
  `robots` meta. Default: index only on `https://serverlys.com`.
- Indexable pages now emit `max-image-preview:large, max-snippet:-1`.
- Sitemap: page `lastmod` removed (#7); articles keep their real date.
- `llms.txt` billing line uses the billing origin, not the site URL.

### 3.3 Structured data
- `WebSite`: `url` is the homepage with trailing slash, `alternateName`
  `["Serverlys Hosting", "serverlys.com"]`, `inLanguage`.
- `Organization.logo` → `/brand/logo-square.png` (new): 512×512 PNG, the
  official mark cropped from the existing lockup onto white — nothing redrawn.
- `Article`: `image` (the article's own OG card), `isPartOf`, optional
  `dateModified` that defaults to the published date — never build time.
- `BreadcrumbList`: now rendered by `PageBreadcrumbs`, which outputs the
  visible trail and the JSON-LD from one array (#3). Commercial pages use the
  registry hierarchy (`breadcrumbTrail(PATH)`): *Home › Hosting › WordPress
  hosting*, *Home › AI agents › ConvoAI*, *Home › Domain names › Transfer a
  domain*. `/managed-hosting` moved under Hosting.
- Untouched on purpose: no address/LocalBusiness, no foundingDate/founder,
  no ratings/reviews, no SearchAction (there is no site search).

### 3.4 Metadata
| Page | Before | After |
|---|---|---|
| `/` | Serverlys — Premium web hosting, domains and cloud solutions | Serverlys — Web Hosting, Domains & AI for Small Business |
| `/hosting` | Web Hosting — managed plans from $7.95/mo \| Serverlys | Web Hosting for Small Business from $7.95/mo \| Serverlys |
| `/cloud-hosting` | Managed cloud hosting \| NVMe, LiteSpeed and free migration | Managed NVMe Cloud Hosting, Free Migration \| Serverlys |
| `/wordpress-hosting` | WordPress Hosting — managed plans from $7.95/mo \| Serverlys | Managed WordPress Hosting from $7.95/mo \| Serverlys |
| `/ecommerce-hosting` | Managed WooCommerce hosting for your eCommerce store | Ecommerce Hosting for WooCommerce Stores \| Serverlys |
| `/domain-name` | Domain Name Search – Check and Buy a Domain In Minutes | Domain Name Search — Check & Register \| Serverlys |
| `/seo` | SEO — get found by people ready to buy \| Serverlys | SEO Services for Small Businesses \| Serverlys |
| `/ai-agents` | AI Agents — chat and voice for your business \| Serverlys | AI Agents for Small Business — Chat & Phone \| Serverlys |
| `/website-design` | Website Design — sites built to convert \| Serverlys | Website Design for Small Business \| Serverlys |

Prices in titles are computed from `data/pricing.ts`, not typed. The
`/ecommerce-hosting` description now lists only verified plan features;
`/customer-service-policy` description trimmed under 160 characters. The other
119 titles were already distinct and specific and were kept.

### 3.5 Accessibility
- `/pricing` compare table: one valid table per collapsible group, with a
  screen-reader-only header row naming the plans; the visible sticky header
  is no longer a fake rowgroup. Visual output unchanged.
- Live-demo shell: "Live demo" badge and inactive console tabs moved from
  `fg-muted` (4.41:1 on `canvas-inset`) to `fg-secondary`.
- `/website-development` diff badge on the dark editor mock: brighter green.
- Breadcrumb strip: `<nav aria-label="Breadcrumb">` + `<ol>`, current page
  `aria-current="page"` and not linked, separators `aria-hidden`, ≥24 px
  targets.

### 3.6 Internal links & content
Thirteen contextual links added in existing sentences (full list in
SEO-INTERNAL-LINK-MAP.md); the false AI-widget claim replaced with the
`/convoai` page's own description of ConvoAI. `npm run audit:claims` passes.

### 3.7 Tooling
- `npm run audit:lighthouse` (`scripts/lighthouse.mjs`): N sequential runs per
  route and form factor, median, failing audits, LCP element, budgets; exits
  1 on a breach. Deliberately not wired into `npm run verify` (needs Chrome and
  minutes; a gate that fails on lab noise gets switched off).
- `src/app/manifest.ts`.

## 4. Final results

Local production build, Lighthouse 12. Mobile = **median of 3** sequential
runs; desktop = 1 run (desktop is stable at 99–100).

| Route | Mobile perf | Mobile LCP | TBT | CLS | Desktop perf | A11y | BP | SEO |
|---|---|---|---|---|---|---|---|---|
| `/` | 89 | 3.70 s | 71 ms | 0 | 100 | 100 | 100 | 100 |
| `/hosting` | 89 | 3.67 s | 81 ms | 0 | 99 | 100 | 100 | 100 |
| `/cloud-hosting` | 86 | 3.88 s | 156 ms | 0 | 100 | 100 | 100 | 100 |
| `/wordpress-hosting` | 87 | 3.88 s | 158 ms | 0 | 100 | 100 | 100 | 100 |
| `/ecommerce-hosting` | 89 | 3.66 s | 70 ms | 0 | 100 | 100 | 100 | 100 |
| `/managed-hosting` | 92 | 3.29 s | 74 ms | 0 | 100 | 100 | 100 | 100 |
| `/pricing` | 92 | 3.35 s | 65 ms | 0 | 100 | 100 | 100 | 100 |
| `/domain-name` | 89 (was **0**) | 3.79 s | 64 ms | 0 | 99 (was **0**) | 100 | 100 | 100 |
| `/ai-agents` | 93 | 3.24 s | 53 ms | 0 | — | 100 | 100 | 100 |
| `/website-development` | 90 | 3.53 s | 69 ms | 0 | — | 100 (was 96) | 100 | 100 |
| `/seo` | 86 | 4.10 s | 68 ms | 0 | — | 100 | 100 | 100 |
| `/blog` | 92 | 3.28 s | 71 ms | 0 | — | 100 | 100 | 100 |
| `/blog/core-web-vitals-for-small-sites` | 93 | 3.23 s | 48 ms | 0 | — | 100 | 100 | 100 |

Desktop "—" = final pass still running at commit time; the baseline pass on
the same routes scored 99–100. Desktop accessibility: `/pricing` 90 → 100,
`/hosting` 97 → 100.

**Accessibility, Best Practices and SEO: 100 on every route measured, both
form factors** (SEO on a production-configured build; staging stays 69 by
design until `NEXT_PUBLIC_ALLOW_INDEXING=true` or the domain switch).
CLS 0 everywhere; TBT ≤ 160 ms. Real-browser LCP (unthrottled) is 0.2–0.35 s.

Mobile performance on pages that already worked is essentially unchanged
(86–93; run-to-run noise is ±2). The gains are the four domain pages
(0 → 89), accessibility and correctness. Section 5 explains the ceiling. The
mobile LCP budget in `scripts/lighthouse.mjs` is 4.5 s — the measured worst
case (`/seo`, 4.1 s) plus headroom — so it catches regressions, not today.

## 5. What prevents mobile Performance 100

**Audit:** `largest-contentful-paint` (and to a lesser degree
`first-contentful-paint`) in Lighthouse's **simulated** mobile mode.

**Why:** Lantern estimates LCP from a dependency graph that includes every
request *started* before the observed LCP. Next.js emits React + its runtime
(~130 KB gzipped, plus ~50 KB of this site's client code) as async scripts in
`<head>`, so they start immediately and are always charged to LCP — even
though the hero is plain server HTML that really paints in ~300 ms. The page's
interactivity (live demos, Sera, domain search, pricing toggles) is that code.

**Experiments, all measured and reverted where they lost:**

| Experiment | Effect on mobile score |
|---|---|
| Strip **all** JS from the homepage (not shippable — reference only) | 89 → 99 |
| Brotli instead of gzip at the proxy | +2 to +3 (LCP −350 ms) — **recommended, infra** |
| `experimental.inlineCss` | 89 → **78** (CSS ends up in the HTML twice; HTML 60→151 KB gz) — reverted |
| Mount mega-menu panels only when open | ±0 (−4 KB) and loses crawlable links — reverted |
| Drop font preloads | −1 (LCP better, FCP worse) — not applied |

**What 100 would require:** removing React hydration from the marketing pages
(an islands/static rebuild in which the live demos, Sera and the domain
search become separately loaded widgets) — a redesign of the architecture,
excluded by the brief. Field data (CrUX), which is what Google ranks on, is
expected to be much better than the lab score because real devices paint the
server-rendered hero almost immediately.

## 6. Remaining issues (not changed, need an owner decision)

### Claims to verify (copy, not code)
- `/ecommerce-hosting` plan bullet and `/cloud-hosting` copy promise **"24/7
  (priority) support"**; the customer-service policy deliberately publishes no
  guaranteed response time.
- `/cloud-hosting` promises **"free domain-based emails"** — no email product
  page exists.
- `/ecommerce-hosting` eyebrow **"79% off"** — looks inherited from the
  reference layout; verify against real pricing.

### Other
- Cannibalization pairs (SEO-KEYWORD-MAP.md §register) — three true
  duplicates recommended for merge + 301, left for the owner.
- `/domain-registration-agreement` and `/ai-services-terms` have one inbound
  link each (from `/legal-information`).
- `.env.example` is matched by `.env*` in `.gitignore`, so it has never been
  committed; add `!.env.example` if it should be.
- Pre-existing test failures (identical on unmodified HEAD, verified by
  building HEAD separately): `test:nav` (announcement bar is switched off),
  `test:live` (automation canvas not mounted anywhere), `test:domains`
  (homepage no longer has the search input), `test:product` (3 checks on its
  default target).
- Brotli and `www`→apex at the proxy (SEO-LAUNCH-CHECKLIST.md §5).

## 7. Launch requirements

See SEO-LAUNCH-CHECKLIST.md. In short: finish DEPLOY.md's `/billing` proxy,
build with `NEXT_PUBLIC_SITE_URL=https://serverlys.com`, 301 `www` and (if it
was ever indexable) the staging host, add the Search Console **Domain**
property via DNS TXT, submit `/sitemap.xml`, inspect the 12 priority URLs.

## Method

Lighthouse 12 via `npx`, Chrome headless, **sequential** runs (parallel
instances starve each other's compositor — desktop read 91 in parallel and 100
alone). Local numbers come from `next build && next start` with production
config (`NEXT_PUBLIC_SITE_URL` unset ⇒ serverlys.com), which is the only way
to measure SEO without the staging block. Performance on localhost is close
to staging (staging mobile `/` 89; local 89–90) because Lantern simulates the
network. The PageSpeed Insights API was over its anonymous daily quota.
