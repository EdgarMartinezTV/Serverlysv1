# Serverlys — route audit

Produced by `npm run audit:crawl`, which follows every internal link from the
homepage until nothing new is found. It is a crawl, not a list read back from
the route registry — that is the point. A registry cannot catch a link written
by hand in page copy that points at a path nobody registered.

Re-run it after any change to navigation or routing.

## Result

**Every reachable route returns 200, renders the shared header and footer,
has exactly one `<h1>`, and carries a title, meta description, canonical URL
and OpenGraph image.** No 404s, no dead navigation, and no internal link that
takes a redirect hop.

| Check | Result |
|---|---|
| Routes crawled | 47 |
| 4xx / 5xx | **0** |
| Missing header or footer | **0** |
| Wrong `<h1>` count | **0** |
| Missing title / description / canonical / og:image | **0** |
| Internal links landing on a 308 | **0** |
| Structured-data blocks | 4–8 per page |

Companion audits, all green at the same commit:

| Audit | Command | Result |
|---|---|---|
| SEO crawl | `npm run audit:seo` | 0 failures, 0 warnings — 47 indexable pages, 48 internal link targets |
| Core Web Vitals | `npm run audit:cwv` | 43 pages, mobile + 4× CPU throttle + Fast 3G: worst LCP **0.85s** (`/`), CLS **0.000**, ≤315 KB transfer |
| Structural a11y | `node scripts/a11y.mjs` | 1 `<h1>`, no heading skips, no unlabelled controls, no undersized targets, skip link present |
| Design tokens + contrast | `npm run validate:tokens` | 86 tokens resolve, 22 contrast floors pass |
| Typecheck, lint, build | `npm run verify` | clean — 0 errors, 0 warnings |
| Live product UI | `npm run test:live` | **11/11** interaction checks pass |

## Redirect hops

Four aliases are registered in `next.config.ts` and return 308 to a canonical
route. They exist for inbound and campaign links; **no internal link points at
them**, which is what keeps the crawl free of redirect chains.

| Alias | → | Verified |
|---|---|---|
| `/domain-name-search` | `/register-domain` | 308 |
| `/store-hosting` | `/ecommerce-hosting` | 308 |
| `/chatrep` | `/convoai` | 308 |
| `/n8n-automations` | `/automations` | 308 |

`/chatrep` and `/n8n-automations` are aliases rather than pages on purpose.
ChatRep is a campaign name for the product the live application ships as
ConvoAI, and n8n is the engine under Automations — building either as its own
page would put two URLs in the index competing for one intent, and would mean
naming a product Serverlys does not sell under that name.

## Live product UI coverage

These routes carry an **operable** product surface — real React state, real
controls, keyboard-navigable — rather than a static mockup. Each is labelled
"Live demo" in the interface so a reader cannot mistake the demonstration data
for their own account.

| Route | Surface |
|---|---|
| `/` | Hosting console · ConvoAI chat · CallFlow call · Automation workflow |
| `/hosting` | Hosting console |
| `/cloud-hosting` | Hosting console |
| `/convoai` | ConvoAI chat |
| `/callflow-ai` | CallFlow call |
| `/automations` | Automation workflow |

The domain search on `/`, `/register-domain` and `/transfer-domain` is not a
demonstration at all: it queries a real availability provider through
`/api/domains/check` and reports "no answer" when the registry does not
respond, rather than rounding an unknown to available.

## Columns

- **header / footer** — the shared `<header>` and `<footer>` rendered in the HTML.
- **h1** — count of `<h1>` elements. Must be exactly 1.
- **seo** — title, meta description, canonical and `og:image` all present.
- **jsonld** — number of `application/ld+json` blocks (Organization and WebSite
  come from the root layout; the rest are per-page breadcrumb, product, FAQ,
  Article or HowTo graphs).

## Full crawl output

```
Crawled 47 routes from http://localhost:3001

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
