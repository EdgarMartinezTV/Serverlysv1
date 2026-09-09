# Serverlys — route audit

Produced by `npm run audit:crawl`, which follows every internal link from the
homepage until nothing new is found. It is a crawl, not a list read back from
the route registry — that is the point. A registry cannot catch a link written
by hand in page copy that points at a path nobody registered.

Re-run it after any change to navigation or routing.

## Result

**Every reachable route returns 200, renders the shared header and footer,
has exactly one `<h1>`, and carries a title, meta description, canonical URL
and OpenGraph image.** No 404s, no redirect chains, no dead navigation.

| Check | Result |
|---|---|
| Routes crawled | 47 (46 pages + 1 alias redirect) |
| 4xx / 5xx | **0** |
| Missing header or footer | **0** |
| Wrong `<h1>` count | **0** |
| Missing title / description / canonical / og:image | **0** |
| Structured-data blocks | 4–8 per page |

Companion audits, all green at the same commit:

| Audit | Command | Result |
|---|---|---|
| SEO crawl | `npm run audit:seo` | 0 failures, 0 warnings across 42 indexable pages |
| Core Web Vitals | `npm run audit:cwv` | 43 pages, cold cache: LCP ≤ 1.22s, CLS ≤ 0.016 |
| Design tokens + contrast | `npm run validate:tokens` | 84 tokens resolve, 20 contrast floors pass |
| Typecheck, lint, build | `npm run verify` | clean |
| Functional tests | 6 suites | 187 passing |

## Columns

- **header / footer** — the shared `<header>` and `<footer>` rendered in the HTML.
- **h1** — count of `<h1>` elements. Must be exactly 1.
- **seo** — title, meta description, canonical and `og:image` all present.
- **jsonld** — number of `application/ld+json` blocks (Organization and WebSite
  come from the root layout; the rest are per-page breadcrumb, product, FAQ,
  Article or HowTo graphs).

## Full crawl output

```
Crawled 48 routes from http://localhost:3000

status  header  footer  h1  seo   jsonld  route
--------------------------------------------------------------------------
200     yes     yes     1   ok    4       /
200     yes     yes     1   ok    4       /about
200     yes     yes     1   ok    4       /accessibility
200     yes     yes     1   ok    6       /ai-agents
200     yes     yes     1   ok    6       /ai-tools
200     yes     yes     1   ok    6       /automations
200     yes     yes     1   ok    4       /blog
200     yes     yes     1   ok    6       /blog/core-web-vitals-for-small-sites
200     yes     yes     1   ok    6       /blog/how-to-read-hosting-renewal-pricing
200     yes     yes     1   ok    6       /blog/move-a-website-without-downtime
200     yes     yes     1   ok    6       /blog/shared-cloud-vps-or-dedicated
200     yes     yes     1   ok    6       /blog/what-ai-agents-can-do-for-a-small-business
200     yes     yes     1   ok    6       /business-solutions
200     yes     yes     1   ok    6       /callflow-ai
200     yes     yes     1   ok    8       /cloud-hosting
200     yes     yes     1   ok    4       /contact
200     yes     yes     1   ok    6       /convoai
200     yes     yes     1   ok    6       /dedicated-servers
200     yes     yes     1   ok    8       /domain-name
308     —       —       —   —     —       /domain-name-search  → /register-domain
200     yes     yes     1   ok    8       /ecommerce-hosting
200     yes     yes     1   ok    6       /faq
200     yes     yes     1   ok    8       /hosting
200     yes     yes     1   ok    6       /hosting-alternatives
200     yes     yes     1   ok    4       /legal-information
200     yes     yes     1   ok    6       /managed-hosting
200     yes     yes     1   ok    6       /marketing
200     yes     yes     1   ok    6       /our-process
200     yes     yes     1   ok    8       /pricing
200     yes     yes     1   ok    4       /privacy-policy
200     yes     yes     1   ok    4       /refund-policy
200     yes     yes     1   ok    8       /register-domain
200     yes     yes     1   ok    4       /report-abuse
200     yes     yes     1   ok    4       /resources
200     yes     yes     1   ok    6       /seo
200     yes     yes     1   ok    6       /shared-hosting
200     yes     yes     1   ok    6       /site-management
200     yes     yes     1   ok    6       /social-media
200     yes     yes     1   ok    4       /support
200     yes     yes     1   ok    4       /terms-of-service
200     yes     yes     1   ok    6       /transfer-domain
200     yes     yes     1   ok    6       /tutorials
200     yes     yes     1   ok    6       /vps-hosting
200     yes     yes     1   ok    6       /website-design
200     yes     yes     1   ok    6       /website-development
200     yes     yes     1   ok    6       /whois-lookup
200     yes     yes     1   ok    8       /wordpress-hosting
200     yes     yes     1   ok    6       /wp-migrations


✓ every reachable route is complete
```

## Deliberate exclusions

Three paths are **redirects, not pages**, and the crawl shows them as 308:

| Path | Redirects to | Why |
|---|---|---|
| `/chatrep` | `/convoai` | Campaign name for a product whose canonical name is ConvoAI |
| `/n8n-automations` | `/automations` | Tool name for the same service |
| `/domain-name-search` | `/register-domain` | Alias of the search page |

Building these as pages would create three sets of duplicate content competing
with their own canonical URL. None appears in the navigation.

Legacy URLs from the previous serverlys.com — `/store-hosting`, `/web-design`,
`/custom-development`, `/seo-marketing`, `/socialmedia-management`,
`/web-hosting`, `/domains` — also 308 to their successors, preserving inbound
links and search history. They are not linked from anywhere on the current
site, so the crawl does not reach them; they are verified separately.

`/case-studies` and `/success-stories` were **removed from the footer rather
than built**. Both require named customers, their results and their permission.
None have been supplied, and a case-studies page populated with invented
clients is the single most damaging thing that could go on this site — it is
exactly the claim a prospect checks. When real, permissioned stories exist,
each is one page.
