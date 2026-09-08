# Serverlys — Project Audit

**Date:** 2026-09-08
**Audited commit:** `1867bf8` (working tree clean)
**Auditor scope:** full repository inspection, no modifications made.

---

## 0. Method and honest framing

Every claim below was verified by inspecting files, running the build, and
measuring output — not recalled. Where something does not exist, this document
says so plainly rather than describing intent as if it were implementation.

**The single most important fact in this audit:** the project is **1 page of a
108-page site**. `~/Desktop/Archive` contains 35 service/legal pages and 73 blog
posts that are live today and not yet ported. Most of the 30 audit categories
below evaluate to *"does not exist yet"*, and that is a scope statement, not a
defect. Conflating "not built" with "built badly" would misdirect the roadmap.

---

## 1. Current architecture

```
Next.js 16.3.4 (App Router, Turbopack)  ·  React 19.2.8  ·  TypeScript 5  ·  Tailwind v4
Deploy target: Node runtime on Easypanel (output: "standalone")
Checkout: WHMCS at serverlys.com/billing — external, same origin, NOT served by this app
```

**41 tracked source files · 2,758 LOC · zero runtime dependencies beyond
`next` / `react` / `react-dom`.**

```
src/
├── app/            layout.tsx, page.tsx, globals.css, favicon.ico   ← 1 route
├── components/
│   ├── ui/         button, badge, container, section, json-ld        ← primitives
│   ├── layout/     site-header, mobile-nav, site-footer, wordmark
│   ├── sections/   hero, trust-bar, migration, faq, final-cta
│   └── pricing/    pricing-table
├── data/           company, pricing, navigation, faqs                ← content layer
└── lib/            seo, utils
```

Content is **data-driven**: pages compose typed data modules rather than
hard-coding copy. Three client components (`site-header`, `mobile-nav`,
`pricing-table`); everything else is a server component.

---

## 2. Category-by-category findings

| # | Area | State | Verdict |
|---|---|---|---|
| 1 | Framework | Next.js 16.3.4, App Router, Turbopack | **PRESERVE** |
| 2 | React/Next version | React 19.2.8, current | **PRESERVE** |
| 3 | TypeScript config | `strict: true`, but no `noUncheckedIndexedAccess`, `noUnusedLocals`, `noImplicitOverride`; `target: ES2017` | **IMPROVE** |
| 4 | Tailwind config | v4 CSS-first `@theme`, no JS config. Correct for v4 | **PRESERVE** |
| 5 | Existing CSS | 259 lines, all tokens + base + a11y utils. No stray CSS files | **PRESERVE** |
| 6 | Components | 14 components, typed variant APIs, no `className` override leakage | **PRESERVE** |
| 7 | Layouts | Single root layout: fonts, entity graph, skip link, header/main/footer | **PRESERVE** |
| 8 | Routing | **1 route (`/`) of 108 pages.** No route groups, no dynamic segments | **BUILD OUT** |
| 9 | API routes | **None (0).** | **BUILD (minimal)** |
| 10 | Backend integrations | WHMCS by outbound link only. Correctly centralised in `data/company.ts` | **PRESERVE** |
| 11 | Authentication | **None, and none required.** WHMCS owns all auth | **PRESERVE (do not build)** |
| 12 | Forms | **None.** Legacy has 2, both submitting to WHMCS | **BUILD** |
| 13 | Database | **None, and none required** | **PRESERVE (do not build)** |
| 14 | Environment variables | **None.** No `.env`, no `.env.example` | **IMPROVE** |
| 15 | SEO | Metadata helper, canonicals, OG/Twitter. Global-brand positioning applied | **PRESERVE + EXTEND** |
| 16 | Metadata | `metadataBase`, title template, per-page override. Correct | **PRESERVE** |
| 17 | Sitemap | **MISSING.** No `sitemap.ts` | **BUILD — critical** |
| 18 | Robots | **MISSING.** No `robots.ts` | **BUILD — critical** |
| 19 | Structured data | One `@id`-linked Organization + WebSite + FAQPage. No address/geo, no invented facts | **PRESERVE** |
| 20 | Image handling | `next/image` used **once** (logo). AVIF/WebP + explicit `deviceSizes` configured | **CONFIG PRESERVE / CONTENT GAP** |
| 21 | Font handling | `next/font` self-hosted, `display: swap`. **3 families, 20 woff2 files, 528 KB** | **IMPROVE** |
| 22 | Performance | 44 KB CSS, 676 KB static chunks, minimal client JS. No images to regress LCP | **GOOD, with caveats** |
| 23 | Accessibility | Audited: 1 h1, 0 heading skips, all landmarks labelled, contrast computed | **PRESERVE** |
| 24 | Responsive | Verified at 10 breakpoints; `scrollWidth == viewport` at 375 | **PRESERVE** |
| 25 | Third-party packages | **Zero beyond the framework.** No bloat | **PRESERVE** |
| 26 | Build config | `standalone`, security headers, image formats, `poweredByHeader: false` | **PRESERVE** |
| 27 | Deploy config | Dockerfile (multi-stage, non-root), `.dockerignore`, DEPLOY.md | **PRESERVE** |
| 28 | Existing pages | 1 built / 108 live | **BUILD OUT** |
| 29 | Existing functionality | Mega menu, mobile drawer, pricing tabs + term toggle, FAQ | **PRESERVE** |
| 30 | Brand assets | **1 logo file.** No reversed logo, no photography, no product imagery, no OG image | **CRITICAL GAP** |

---

## 3. Existing strengths

These are real and should be defended against future churn.

1. **Zero dependency bloat.** 290 `node_modules` entries, all transitive from
   the framework. No UI kit, no animation library, no `clsx`/`tailwind-merge`.
   Every dependency added from here should have to justify itself.
2. **The content layer is the right abstraction.** Prices, plans, nav and FAQs
   are typed data consumed by presentational components. Porting the remaining
   pages is mostly data entry, not component work — this is the single biggest
   accelerator the codebase has.
3. **Checkout URLs are centralised.** One `BILLING` constant in
   `data/company.ts` drives every commercial link. If WHMCS ever moves to
   `billing.serverlys.com`, that is a one-line change, not a 76-link sweep.
4. **WHMCS slugs are verified, not inferred.** The WordPress plan slugs are
   legacy and do not match display names (`your-wordpress-journey-begins-here`
   → Starter). These were read off the live pages. **Do not "tidy" them.**
5. **Accessibility is structural, not bolted on.** Native `<details>` for FAQ,
   real `tablist` with arrow keys, `role="dialog"` drawer with focus trap and
   scroll lock, `hidden` on closed menus so links leave the tab order.
6. **Contrast floors are computed and documented.** `DESIGN_SYSTEM.md` records that
   `ink-400` fails on white (2.95:1) and `ink-500`/`ink-600` fail on the dark
   band. This prevents silent regression.
7. **Verification tooling exists.** `scripts/shoot.mjs` works around Chrome
   headless's 500px viewport clamp via CDP; `scripts/a11y.mjs` runs a structural
   audit. Responsive/a11y claims in this project are measured, not asserted.

---

## 4. Existing weaknesses

### 4.1 Critical — blocks launch

| Issue | Impact |
|---|---|
| **No `sitemap.ts`** | 108 pages with no discovery surface. The legacy site has one; regressing this loses crawl coverage. |
| **No `robots.ts`** | No crawl directives, no sitemap pointer. |
| **107 pages unported** | The site cannot replace serverlys.com until the commercial and legal pages exist. |
| **No cookie consent** | Legacy ships `cookie-consent.min.js` and a "Cookie Settings" control. Dropping it on a site with a GDPR-compliance blog post and an accessibility statement is a compliance regression, not a simplification. |
| **No OG/social image** | Every share of every page renders a blank card. |

### 4.2 High

- **No error, loading, or not-found boundaries.** `app/error.tsx`,
  `app/not-found.tsx`, `app/global-error.tsx` all absent. A runtime error today
  shows the default Next.js error page — off-brand and uninformative.
- **Only one image on the entire site.** See §6.
- **No `.env.example`.** Nothing documents what configuration a deploy needs.
- **No analytics.** No measurement of the conversion funnel this site exists to serve.

### 4.3 Medium

- **Three font families is one too many.** Inter and Inter Tight are close
  relatives; 20 woff2 files / 528 KB is heavy for the typographic differentiation
  gained. Dropping Inter Tight and using Inter with tighter tracking at display
  sizes would cut roughly a third of font bytes with little visual loss.
- **`tsconfig` strictness is default-level.** `noUncheckedIndexedAccess` in
  particular would have caught the `planGroups[0]` and `tiers[i]` indexing
  patterns already in `pricing.ts`.
- **No Prettier**, despite the engineering standard naming it. Formatting is
  currently consistent only because one author wrote it in one sitting.
- **No `typecheck` npm script.** `tsc --noEmit` is run manually; it should be a
  named script and a CI gate.
- **No CI.** Nothing enforces the quality gates on future commits.
- **`scripts/shoot.mjs` and `scripts/shoot-at.mjs` overlap** — ~70% duplicated
  CDP boilerplate.

---

## 5. Technical debt

Genuinely small, because the codebase is young. Recording it before it compounds:

1. **`Button` uses a `Record<string, unknown>` cast** to split anchor vs button
   props. It is type-safe at the call site but loose internally. Acceptable
   today; revisit if the component grows.
2. **`min-h-14` on plan summaries** reserves two lines to hold card alignment.
   This breaks if a summary ever needs three lines. CSS subgrid is the
   structural fix — not urgent, but note it.
3. **Two arbitrary values remain** (`text-[0.625rem]`, `tracking-[0.14em]`) in
   the footer wordmark, against the project's own no-arbitrary-values rule.
   Should become tokens if reused.
4. **The footer wordmark is a typographic stand-in**, not the brand mark,
   because no reversed logo exists. This is a documented asset gap, not a design
   decision — it should not calcify into one.

---

## 6. UI/UX problems

### 6.1 The imagery gap — the most material UI finding

The supplied Hostinger reference was analysed as a visual specification. The
structural differences that matter:

| Dimension | Hostinger reference | Serverlys today |
|---|---|---|
| Product imagery | Real UI screenshots in nearly every section | **None** |
| Photography | Lifestyle imagery in the 4-up "essentials" grid | **None** |
| Hero | Centred, dark gradient, interactive prompt input as primary action | Split copy + plan card, light |
| Content exploration | Segmented tabs (Build / Launch / Grow / Manage) | Tabs on pricing only |
| Section rhythm | Alternating image-left / image-right splits | Uniform typographic bands |
| Pricing | 3 cards, dark highlight on the middle | 4 cards, ring highlight |
| Renewal price | Not surfaced on the card | **Always shown — Serverlys is better here** |

**The finding is not "add images because Hostinger has images."** It is that a
hosting purchase is a decision about a product the buyer cannot see. Every
credible competitor shows the control panel, the dashboard, the migration flow.
Serverlys currently asks the buyer to take all of it on trust from body copy.
That is a conversion weakness with a concrete cause.

**However — this is blocked on assets, not code.** No screenshots, photography,
or illustration exist in the repo or in `~/Desktop/Archive` beyond the logo and
a handful of legacy stock `.webp` files. Recommending an image-led redesign
without securing assets would produce placeholder-driven work, which the
engineering standard explicitly forbids. **Asset acquisition must precede the
visual work.** Realistic sources: real cPanel/WHMCS screenshots (authentic and
free), and the existing `~/Desktop/Serverlys-themes/images` library.

### 6.2 Other UI/UX observations

- **The homepage has no domain search.** The legacy homepage leads with one.
  Domain search is a top-of-funnel entry point for hosting, and its absence
  removes a whole acquisition path. (See §7 — this is far easier than assumed.)
- **Four pricing cards is dense at 1024–1280px.** It holds, but three tiers with
  a comparison table below is the stronger commercial pattern; the fourth tier
  currently competes with the "most popular" signal.
- **No social proof anywhere.** Legacy has `/case-studies`, `/success-stories`
  and testimonials. The homepage makes claims with nothing corroborating them.
- **No visible uptime/performance proof.** For a hosting company this is a
  standard and expected trust signal.

---

## 7. Correction to a previous assumption (important)

I previously stated that domain search "needs a real registrar/EPP integration."
**Inspecting the legacy site shows that is wrong.**

The legacy domain search is a plain `GET` form:

```html
<form action="https://serverlys.com/billing/cart.php" method="GET">
  <input type="hidden" name="a"      value="add" />
  <input type="hidden" name="domain" value="register" />
  <input type="text"   name="query" />
</form>
```

WHMCS performs the lookup. A **fully functional, non-faked** domain search is
therefore a progressively-enhanced HTML form — no API, no credentials, no
integration boundary. This moves domain search from "large integration" to
"small, high-value feature" and it should be promoted in the roadmap
accordingly.

The same applies to forms generally: both legacy forms POST/GET to WHMCS
(`submitticket.php`, `cart.php`). **No API routes, no database, and no
server-side form handling are required.** The one API route worth adding is a
lightweight `/api/health` for Easypanel container health checks.

---

## 8. Performance

**Current state is good, but it is measured on a page with no images.**

| Metric | Value | Note |
|---|---|---|
| CSS | 44 KB | Reasonable for a full token system |
| Static chunks | 676 KB total | Per-route first-load not emitted by Next 16's table |
| Fonts | 528 KB / 20 files | **Heaviest asset class on the site** |
| Client components | 3 | Header, mobile nav, pricing table — all justified |
| Images | 1 (5 KB logo) | LCP is currently a text node |

**Risks ahead, not present today:**
- Adding hero imagery will move LCP from text to image. `priority`, correct
  `sizes`, and AVIF are configured — but this needs re-measurement after.
- The scroll listener in `site-header.tsx` is passive and sets a boolean; fine.
- No bundle analyzer configured, so regressions will be invisible.

**Not yet measured:** real Core Web Vitals. No Lighthouse run, no field data.
Any performance claim beyond the table above would be unsubstantiated.

---

## 9. SEO problems

| Problem | Severity |
|---|---|
| **No sitemap** | Critical |
| **No robots.txt** | Critical |
| **107 pages missing** — including 73 indexed blog posts that carry the site's long-tail traffic | Critical |
| No OG image | High |
| No breadcrumb structured data (helper exists, unused — nothing to apply it to yet) | Medium |
| No `Product`/`Offer` schema on pricing | Medium |
| No redirect map from legacy URLs | High (at cutover) |

**Strengths to preserve:** the `@id`-linked entity graph is correct and is the
hard part of technical SEO. Canonicals are absolute and correct. The
global-brand positioning decision is applied consistently. `formatDetection`
is disabled so phone numbers are not auto-linked into junk markup.

**Cutover risk:** the legacy site has 108 indexed URLs. Launching without a
verified 1:1 URL map — or with different paths — will drop rankings. The legacy
`_redirects` file (3.4 KB) exists in Archive and must be reconciled.

---

## 10. Accessibility

**The strongest area of the project.** Verified by `scripts/a11y.mjs`:

- 1 `<h1>`, **0 heading-level skips** across 26 headings
- All 4 landmarks present; **0 unlabelled `<nav>`**
- 0 images without `alt`; 0 controls without an accessible name
- `lang="en"`, working skip link
- Contrast computed for every token pair; 5 failures found and fixed
- Targets meet the WCAG 2.2 24px minimum, with only legitimate exceptions
  (skip link, visually-hidden radios whose labels provide 36px targets, and two
  links inline within a sentence)

**Remaining gaps:**
- Mega menu has no Arrow-key navigation *within* an open panel (Tab works;
  APG's menu pattern would add arrows). Minor.
- No `prefers-contrast` handling.
- No automated a11y gate in CI — the audit is manual today.
- Untested with a real screen reader (VoiceOver/NVDA). Structural correctness
  is verified; lived experience is not.

---

## 11. Security concerns

| Item | State |
|---|---|
| Security headers | HSTS, `nosniff`, `X-Frame-Options`, Referrer-Policy, Permissions-Policy — **present** |
| **Content-Security-Policy** | **ABSENT** — the notable omission |
| `poweredByHeader` | Disabled |
| Container | Multi-stage, runs as non-root `nextjs` uid 1001 |
| Secrets | None in repo; nothing to leak |
| `dangerouslySetInnerHTML` | One use, in `JsonLd`, with `<` escaped. Data is author-controlled. Acceptable |
| External links | `rel="noopener noreferrer"` applied consistently |
| Dependencies | `npm audit`: **0 vulnerabilities** |

**Primary risk is operational, not code:** the `/billing` reverse proxy. If
misconfigured with the wrong `Host` header, WHMCS session and CSRF validation
break — that is an authentication-adjacent failure on the live checkout. It is
documented in `DEPLOY.md` and must be verified on staging with a real login,
not just a 200 on the login page.

---

## 12. Recommended architecture

**Recommendation: keep the current architecture. Extend it; do not restructure.**

The existing shape is appropriate for the problem and no material benefit would
come from changing it. Specifically:

- **Keep** App Router + server components by default. Three client components is
  the right amount.
- **Keep** the data-driven content layer. It is the main reason 107 pages is
  tractable.
- **Keep** zero-dependency discipline. The site needs no state manager, no data
  fetching library, no UI kit, and no animation library. Motion, if added,
  should be CSS-first; reach for a library only when a specific interaction
  genuinely requires orchestration.
- **Keep** WHMCS as an external boundary. Do not build auth, a database, or
  server-side form handling. Rebuilding what WHMCS already does correctly would
  be the single most expensive mistake available here.

**Add, minimally:**
- `sitemap.ts` / `robots.ts` (framework-native, no dependency)
- Error / loading / not-found boundaries
- A `/api/health` route for container health checks
- MDX for the 73 blog posts — this is the one place a dependency is clearly
  justified, versus hand-converting 73 HTML files into TSX

**Blog decision to make deliberately:** 73 posts is real content weight.
Options are (a) MDX files in-repo, (b) a headless CMS, (c) leave blog on the
legacy host and proxy `/blog/*`. Option (c) is the lowest-risk path to launch
and preserves all existing rankings immediately; (a) is the better end state.
This should be an explicit decision, not a default.

---

## 13. Recommended folder structure

Evolution of what exists — every addition earns its place:

```
src/
├── app/
│   ├── (marketing)/              route group: shared marketing shell
│   │   ├── page.tsx                        home
│   │   ├── pricing/page.tsx
│   │   ├── cloud-hosting/page.tsx
│   │   ├── wordpress-hosting/page.tsx
│   │   ├── store-hosting/page.tsx
│   │   ├── managed-hosting/page.tsx
│   │   ├── register-domain/page.tsx
│   │   ├── transfer-domain/page.tsx
│   │   └── ...services
│   ├── (legal)/                  route group: narrow, prose-width layout
│   │   ├── privacy-policy/page.tsx
│   │   ├── terms-of-service/page.tsx
│   │   ├── refund-policy/page.tsx
│   │   ├── legal-information/page.tsx
│   │   ├── accessibility/page.tsx
│   │   └── report-abuse/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── api/health/route.ts       Easypanel health check
│   ├── sitemap.ts                ← MISSING TODAY
│   ├── robots.ts                 ← MISSING TODAY
│   ├── opengraph-image.tsx       ← MISSING TODAY
│   ├── error.tsx  loading.tsx  not-found.tsx   ← MISSING TODAY
│   ├── layout.tsx  globals.css
├── components/
│   ├── ui/                       primitives (existing + input, field, tabs)
│   ├── layout/                   header, nav, footer, wordmark
│   ├── sections/                 reusable page bands
│   ├── pricing/                  pricing-table, comparison-table
│   ├── domain/                   domain-search form  ← WHMCS GET form
│   └── marketing/                proof, testimonials, logo wall
├── data/                         company, pricing, navigation, faqs,
│                                 products, testimonials, legal
├── content/blog/                 MDX posts (if option (a) chosen)
└── lib/                          seo, utils, redirects
```

**Rationale for route groups:** legal pages want a narrow prose layout and
`index: false` on thin pages; marketing pages want the full-width shell. Route
groups express that without affecting URLs.

---

## 14. Potential breaking changes

Ranked by blast radius.

1. **DNS cutover without the `/billing` proxy** — catastrophic. Every login and
   every checkout 404s. Verify on staging with a real WHMCS login *and* a page
   change to confirm the session survives.
2. **URL changes vs the 108 legacy URLs** — ranking loss. Reconcile against
   Archive's `_redirects` and produce a verified 1:1 map before launch.
3. **Editing WHMCS plan slugs** — silent checkout breakage. The WordPress slugs
   look wrong but are correct. They are the contract.
4. **Removing the renewal price from any pricing surface** — this is a stated
   commercial commitment and appears in the FAQ answers, which are also the
   FAQPage structured data. Changing one without the other makes the markup
   misrepresent the page.
5. **Re-introducing Miami/local SEO copy** — reverses a decision made 2026-09-08
   and re-fragments the entity.
6. **Adding `LocalBusiness`, `address`, or `geo` to schema** — explicitly
   prohibited by standing instruction.
7. **Passing `className` to `Button` that overrides `display` or `color`** —
   silently loses to base classes. This bug already occurred once (`Log in`
   failed to hide on mobile). Add a variant instead.
8. **Upgrading to Tailwind v5 or Next 17** — no benefit now; defer.

---

## 15. Prioritized implementation roadmap

Ordered by *risk removed per unit of effort*, not by convenience.

### Phase 1 — Launch blockers (nothing ships without these)
1. `sitemap.ts` + `robots.ts`
2. `error.tsx`, `not-found.tsx`, `loading.tsx` — on-brand failure states
3. `opengraph-image.tsx` — one shared OG card
4. **Domain search form** on the homepage → WHMCS `cart.php` *(now known to be
   small; high funnel value — see §7)*
5. Legal pages (6) — port from Archive under a `(legal)` route group
6. `.env.example` + `/api/health`

### Phase 2 — Commercial surface (the pages that earn money)
7. `/pricing` — full table + comparison, reusing `PricingTable`
8. Four hosting product pages: cloud, wordpress, store, managed
9. `/register-domain` + `/transfer-domain`
10. `Product` / `Offer` structured data on pricing surfaces
11. Social proof: testimonials, case studies, success stories

### Phase 3 — Trust, compliance, and measurement
12. **Cookie consent** — restore parity with legacy (compliance regression today)
13. Analytics + conversion tracking on every WHMCS CTA
14. Remaining company pages: about, our-process, features
15. Content-Security-Policy header
16. Redirect map reconciled against Archive `_redirects`

### Phase 4 — Content weight
17. **Decide the blog strategy** (MDX in-repo vs proxy `/blog/*` to legacy)
18. Port or proxy 73 posts, preserving every URL
19. Remaining service pages: web-design, custom-development, site-management,
    seo-marketing, socialmedia-management, wp-migrations
20. Tools: whois-lookup, ai-tools, tutorials, hosting-alternatives

### Phase 5 — Visual elevation (asset-gated — do not start without assets)
21. **Acquire imagery**: real cPanel/WHMCS screenshots, reversed logo, photography
22. Image-led section redesign per §6.1
23. Reconsider 4 → 3 pricing tiers with a comparison table
24. Motion pass — CSS-first, respecting `prefers-reduced-motion`

### Phase 6 — Engineering hygiene (continuous, start early)
25. Prettier + `typecheck` script
26. CI running typecheck / lint / build / a11y probe on every push
27. Tighten `tsconfig` (`noUncheckedIndexedAccess` first)
28. Reduce 3 font families → 2
29. Consolidate `shoot.mjs` / `shoot-at.mjs`
30. Screen-reader pass (VoiceOver + NVDA)

---

## 16. Summary verdict

| Verdict | Items |
|---|---|
| **PRESERVE** | Architecture, design tokens, data layer, component primitives, a11y patterns, SEO entity graph, WHMCS boundary, Docker/deploy config, zero-dependency discipline, verification scripts |
| **IMPROVE** | `tsconfig` strictness, font strategy (3→2 families), Prettier + CI, CSP header, mega-menu arrow keys, script consolidation |
| **REFACTOR** | *Nothing structural.* The folder layout and component boundaries are sound and should be extended, not reorganised |
| **REPLACE** | *Nothing.* No component, config, or dependency choice warrants replacement |
| **REMOVE** | *Nothing in `src/`.* Only the duplicated CDP boilerplate across the two screenshot scripts |
| **BUILD** | sitemap, robots, OG image, error boundaries, domain search, cookie consent, analytics, 107 pages |

**Overall:** the foundation is small, correct, well-verified, and deliberately
un-clever. Its weakness is not quality but **coverage** — it is 1% of the site
by page count. The highest-value next work is not refinement of what exists; it
is Phase 1, and specifically the sitemap/robots pair and the domain search form,
which together cost little and remove disproportionate risk.

The one thing that would most improve the *product* — real product imagery — is
blocked on assets rather than engineering, and should be unblocked in parallel
rather than waiting for Phase 5.
