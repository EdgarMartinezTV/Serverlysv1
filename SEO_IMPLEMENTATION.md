# Serverlys — SEO Implementation

Companion to `SEO_AUDIT.md`. That document records what was **found**; this one
records what was **changed**, and why each change has a technical reason behind
it rather than a checklist behind it.

The short version: two defects were fixed, three test-coverage gaps were closed,
and nothing else was touched. No page was restyled, no metadata was rewritten,
no schema was added for the sake of adding schema.

---

## 1. Files changed

| File | Change | Phase |
|---|---|---|
| `src/data/articles/index.ts` | `relatedArticles()` rewritten — cyclic walk replaces `slice(0, 3)` | 9 |
| `src/app/error.tsx` | **new** — route error boundary | 13 |
| `src/app/global-error.tsx` | **new** — root-layout error boundary | 13 |
| `scripts/seo-audit.mjs` | +3 check groups: redirect hygiene, trailing slash, inbound-link distribution | 24 |
| `SEO_AUDIT.md` | **new** | 25 |
| `SEO_IMPLEMENTATION.md` | **new** | 25 |

Six files. That is the whole change set, and it is small because the audit
found the existing SEO layer to be sound.

## 2. What was deliberately NOT changed

Recorded so the absence reads as a decision rather than an oversight.

| Area | Why not |
|---|---|
| Metadata | 123/123 pages already had unique title, description, self-referencing canonical, full OG and Twitter sets. Nothing to add |
| `robots.ts` | Already correct, including a considered AI-crawler policy. Blocks nothing important |
| `sitemap.ts` | Already canonical-only, 123 URLs, one deliberate exclusion |
| Structured data | Already validated per-type with `@id` linking and no dangling refs. Adding types would be schema for schema's sake |
| Images | 23/23 alt, all through `next/image`, `priority` correctly preloaded. No defect |
| Performance | LCP 1.41s max, CLS 0.025 max, 0/48 pages over threshold. Optimising this would be churn |
| URLs | Already lowercase, descriptive, stable, parameter-free |
| Analytics | Absent by documented decision. Inventing a measurement ID would make the cookie policy false |
| Local SEO | The project decided **global brand, no geographic targeting**. Schema carries no address or geo. Adding location pages would contradict a live decision and risk doorway pages |
| Content | 76 articles, already linking out to services. No AI filler was generated to raise page count |
| Backlinks | None created. See §8 |

## 3. Internal linking — the substantive fix

**Problem.** `relatedArticles()` returned `[...sameCategory, ...rest].slice(0, 3)`
— the first three in array order. Every article in a category linked to the same
three. 18 articles had exactly one inbound link, and it was the blog index.

**Why nothing caught it.** None of those articles was *orphaned*. They were
reachable, just starved — and reachability is all a link checker looks for. The
audit checked that links resolve, not how inbound links are distributed.

**Fix.** Walk the same-category list cyclically from the article's own index:

```
category of k articles, each links to the next 3
  → every article receives exactly 3 inbound links
  → no article is starved, none is over-weighted
```

Padding for the two-article categories (AI, Ecommerce) begins at a slug-derived
offset, so small-category articles do not all pad onto the same first few posts.

**Determinism is a requirement here, not a preference.** These pages are
statically generated; the link graph must be byte-identical across builds or it
reshuffles on every deploy and churns crawl signals for no editorial reason.
`stableOffset()` is a character-sum hash. `Math.random()` would have been a bug.

**Measured result:** pages with 1–2 inbound links **34 → 2**; articles with
exactly one inbound link **18 → 0**. The remaining two are the AI and Ecommerce
categories at two articles each — the structural floor.

## 4. Error handling

`error.tsx` and `global-error.tsx` did not exist. The SEO argument is not the
status code (Next sends 500 correctly) but the *markup*: the default page
contains nothing identifying itself as an error, so it reads as a thin page that
everyone bounces off.

Both reuse the 404's recovery shape — centred column, one primary action, one
quiet secondary, same type scale and tokens — so a visitor who hits two
failures in one session sees the same site being honest twice.

Three implementation details that are load-bearing:

- **`global-error.tsx` renders its own `<html>`/`<body>`.** Hard App Router
  requirement: it catches errors thrown *by* the root layout, so no document
  exists to attach to. Returning a fragment produces a blank page.
- **It uses only inline styles and system fonts.** The layer it catches
  failures in is the one that loads `globals.css` and the font files. Importing
  the design system would make the error page depend on the broken thing.
- **A plain `<a href="/">`, with the lint rule disabled and the reason
  written down.** `next/link` depends on the router, which is inside the blast
  radius when the root layout fails. A full document request cannot fail the
  same way.

`error.tsx` logs `error.digest`, never `error.message` — Next replaces server
error text with an opaque digest in production precisely so stack contents never
reach a browser, and the digest is what correlates to the full server log.

## 5. Test suite — three gaps closed

Added to `scripts/seo-audit.mjs`, which already covered titles, descriptions,
canonicals, robots directives, OG/Twitter, H1 count, alt text, `lang`, JSON-LD
validity and per-type required fields.

### 5.1 Redirect hygiene
Parses `source:` out of `next.config.ts` and follows every literal redirect.
**Fails** on a chain (>1 hop), a loop, or a redirect landing on a non-200;
**warns** if a configured source does not redirect at all. Parsed rather than
hand-listed, so adding a redirect without testing it is not possible.

### 5.2 Trailing-slash canonicalisation
Asserts `/path/` → 308 → `/path`. Checked rather than assumed because flipping
`trailingSlash`, or adding middleware that intercepts first, would silently give
every page two crawlable URLs.

### 5.3 Inbound-link distribution
Builds the full inbound-link map. **Fails** on 0 inbound (orphan); **warns** on
exactly 1 (legitimate for a footer-only legal page, a symptom for anything else).

### ⚠ All three were proven to fire

A check that only ever reports success is worse than no check, so each was
validated against a deliberately broken build:

| Check | Bug reintroduced | Result |
|---|---|---|
| Inbound distribution | `relatedArticles` reverted to `slice()` | **18 warnings**, each naming the starved article and its single source |
| Redirect chains | temporary `/chain-probe → /store-hosting → /ecommerce-hosting` | **1 failure**: `/chain-probe chains through 2 hops → /ecommerce-hosting` |

Both bugs were then removed and the clean build re-audited to 0/0. The probe
redirect returns 404 again, confirmed.

## 6. Strategy of record

**Metadata** — one utility, `pageMetadata()` in `lib/seo.ts`. Every route calls
it; no route hand-writes tags. Titles describe the page, not the keyword set.

**Canonical** — absolute, self-referencing, query-free, one spelling per URL
enforced by the trailing-slash redirect. No page canonicalises to another.

**Sitemap** — `app/sitemap.ts`, canonical and indexable URLs only, one
deliberate exclusion. Never 404s, redirects or noindex pages.

**Robots** — allow all valuable content; disallow `/api/` and
`/design-system`. AI search and AI training crawlers named explicitly and
currently allowed, so the decision is visible rather than defaulted.

**Structured data** — the type that actually describes the page, `@id`-linked,
one `Organization` and one `WebSite`. No `aggregateRating` while the
testimonials are placeholders. `FAQPage` validated against visible copy.

**Internal linking** — navigation for the hubs, `relatedArticles` for the
clusters, contextual links from articles to services. Distribution is now
measured, not assumed.

**Images** — `next/image` everywhere, real alt text, `fill` where the container
sizes it, `priority` (and therefore `<link rel=preload>`) on LCP candidates.

## 7. Google Search Console checklist

Nothing here has been done — no property access exists in this environment, and
this document does not claim otherwise.

1. Verify the property. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and
   `NEXT_PUBLIC_BING_SITE_VERIFICATION` are already wired in `lib/env.ts` and
   documented in `.env.example` — set one and the tag renders.
2. Choose **domain property** over URL-prefix, so `www` and apex are covered by
   one property.
3. Submit `https://serverlys.com/sitemap.xml`.
4. Confirm `robots.txt` fetches cleanly.
5. URL-inspect these first, in this order:
   `/` · `/pricing` · `/hosting` · `/wordpress-hosting` · `/cloud-hosting` ·
   `/ecommerce-hosting` · `/domain-name` · `/migrations` · `/blog`
6. Watch **Pages → Not indexed** for the 13 legacy 308s; they should settle to
   "Page with redirect" and their targets should be indexed.
7. Check **Enhancements** for the Product/AggregateOffer and FAQ results once
   crawling begins.
8. Set the international targeting to none — this is a global-brand decision,
   not an oversight.

## 8. Backlink opportunities — a report, not an action

**No backlinks were created, requested, or contacted.** No directory
submissions, no outreach, no automation. What follows is a list of categories a
human should evaluate; the domains are examples to check, not endorsements, and
relevance must be verified before anyone is approached.

| Type | Why it fits Serverlys | Approach | rel |
|---|---|---|---|
| Registrar / hosting industry bodies (ICANN accreditation lists, registrar directories) | Factual listing of a real hosting business | Apply as a business, factual data only | follow |
| US chambers of commerce and local business registries | Serverlys is a real US company (`Serverlys, LLC`) | Standard membership listing | follow |
| Software review platforms (G2, Capterra, Trustpilot) | Only once **real** customers can leave reviews | Claim the profile; never seed reviews | follow |
| WordPress / WooCommerce ecosystem directories | Genuine managed-WordPress offering | Submit the product page | follow |
| n8n / automation community showcases | The automation service is real and demonstrable | Contribute a genuine workflow write-up | follow |
| Developer publications and podcasts | The CWV and honest-renewal-pricing positions are both defensible editorial angles | Pitch the specific argument, not the brand | follow |
| Supplier and partner pages | Real vendor relationships already exist | Ask for reciprocal listing | follow |
| Any paid placement or sponsorship | — | — | **`sponsored`** |
| Any forum or comment link | — | — | **`ugc`** or **`nofollow`** |

**The strongest available asset is original data, not outreach.** The two
genuinely link-worthy things this site could publish, both of which it already
has the substance for:

1. **The renewal-rate transparency position.** Every plan card shows the
   renewal rate beside the term rate; the industry standard is to hide it.
   A comparison of published renewal multipliers across major hosts is
   original research, verifiable, and exactly the kind of page journalists cite.
2. **A migration or Core Web Vitals calculator.** `scripts/cwv.mjs` already
   measures the site at LCP 1.41s max. A public tool built on the same method
   is a linkable resource rather than a marketing page.

Do not pursue: PBNs, mass guest-post networks, paid ranking links, automated
exchanges, comment or forum spam, or AI-generated satellite sites. Each is a
documented manual-action risk and none is worth the exposure.

## 9. Remaining manual work

| Item | Owner | Blocking launch? |
|---|---|---|
| `/billing/*` reverse-proxy rule verified on staging incl. session survival | infra | **YES** — see `DEPLOY.md` |
| Set `SERA_SESSION_SECRET`, and the Sera transport vars | infra | yes, for Sera |
| Mount a volume for `SERA_REQUEST_LOG` | infra | yes, for Sera |
| Re-verify WordPress + WooCommerce prices against the WHMCS store | business | yes — wrong prices ship in `Product` schema |
| Set a Search Console verification token and submit the sitemap | marketing | no, but do it at cutover |
| Replace placeholder testimonials with real, attributable ones | business | no — gates `Review` schema |
| Reversed/white Serverlys logo asset | design | no — `DESIGN_SYSTEM.md §12` |
| `manifest.webmanifest` | eng | no |
| `loading.tsx` for route transitions | eng | no |
| Decide the two-beat `subtle` surface run on the homepage | design | no — noted in `app/page.tsx` |

## 10. Future content strategy

Built on what the site can honestly support, not on page count.

1. **Deepen the two thin clusters.** AI and Ecommerce hold two articles each,
   which is why they are the only pages left with fewer than three inbound
   links. Three or four more in each closes that structurally.
2. **Write to the renewal-pricing position.** It is the company's actual
   differentiator, it is already enforced in code (`data/pricing.ts` refuses to
   render a term rate alone), and no competitor wants to write about it.
3. **Migration content converts here.** Migration is free and handled by the
   team; the workflow already collects the details. Article → migration request
   is the shortest honest funnel on the site.
4. **Do not generate location pages.** The project decided global-brand
   targeting. Spinning up city pages would contradict it and is textbook
   doorway-page risk.
5. **Do not raise page count with AI filler.** 76 articles already need better
   inbound distribution more than they need siblings — which is exactly what
   §3 fixed, and what the audit now measures on every run.
