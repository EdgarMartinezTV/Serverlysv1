# Serverlys — SEO content architecture

**Positioning (decided 2026-09-08):** global brand, **no local/Miami targeting**.
See `DESIGN_SYSTEM.md` and `PROJECT_AUDIT.md §9`. Do not reintroduce city
keywords without revisiting that decision.

---

## 1. The strategic wedge

Serverlys' commercial differentiator — **publishing the renewal price next to
the introductory price** — is also its best organic opportunity.

The head terms (`web hosting`, `cloud hosting`) are dominated by hosts with
enormous domain authority. Competing head-on is a multi-year, high-spend play.
But the *renewal* cluster is high-intent, under-served, and something Serverlys
can answer honestly where competitors structurally cannot:

- "web hosting renewal price"
- "why did my hosting price go up"
- "hosting renewal cost year 2"
- "cheap hosting that doesn't increase price"
- "hosting price after first year"

These have buying intent, low competition, and map directly to a page that
already tells the truth. **This is the content programme to invest in.** Head
terms are a long game; the renewal cluster is winnable now.

Nothing on the site should be written to hit a keyword. Every page below earns
its terms by answering the question properly.

---

## 2. Built pages

### `/` — Homepage

| | |
|---|---|
| **Primary keyword** | web hosting |
| **Search intent** | Commercial investigation — "who should host my site" |
| **Secondary topics** | managed cloud hosting, WordPress hosting, ecommerce hosting, free website migration, hosting renewal pricing |
| **Conversion objective** | Plan selection (`#plans`), or domain search entry |
| **Internal links out** | `/cloud-hosting`, `/register-domain`, `#plans`, `#migration`, WHMCS checkout |
| **H1** | "Hosting priced honestly. Including year two." |
| **Structured data** | Organization, WebSite, FAQPage |

The H1 deliberately does not contain "web hosting". The term appears naturally
in the lede, the products grid and the FAQ. A headline written for the crawler
would weaken the one thing that differentiates the page.

### `/cloud-hosting` — Cloud hosting

| | |
|---|---|
| **Primary keyword** | cloud hosting |
| **Search intent** | Commercial investigation → transactional |
| **Secondary topics** | auto-scaling hosting, cloud vs shared hosting, cloud vs VPS, NVMe hosting, traffic spikes, unmetered transfer |
| **Conversion objective** | Plan selection → WHMCS checkout |
| **Internal links out** | `#plans`, `#migration`, WHMCS store + sales |
| **Internal links in** | Homepage products grid, homepage technology CTA, mega menu, footer |
| **H1** | "Servers that grow with your traffic" |
| **Structured data** | BreadcrumbList, Product + AggregateOffer, FAQPage |

The comparison section targets `cloud vs shared hosting` and `cloud vs VPS`
honestly — including rows where cloud loses. Those comparisons are real
search demand, and answering them straight is what makes the page rank *and*
convert.

### `/register-domain` — Domain registration

| | |
|---|---|
| **Primary keyword** | register a domain |
| **Search intent** | Transactional — the user wants to search a name now |
| **Secondary topics** | domain search, domain availability, free WHOIS privacy, .com price, domain transfer |
| **Conversion objective** | Domain search → WHMCS cart |
| **Internal links out** | WHMCS cart (register + transfer) |
| **Internal links in** | Mega menu, footer, 404 page |
| **H1** | "Find the name first" |
| **Structured data** | BreadcrumbList, Product + AggregateOffer, FAQPage |

The search tool is above the fold because the intent is transactional. Content
sits *below* it — the page's job is to let someone act, then answer questions.

---

## 3. Planned pages

Priority order matches `PROJECT_AUDIT.md`'s roadmap.

| Path | Primary keyword | Intent | Conversion objective |
|---|---|---|---|
| `/pricing` | web hosting prices | Commercial | Plan selection |
| `/wordpress-hosting` | wordpress hosting | Commercial → transactional | Plan selection |
| `/store-hosting` | woocommerce hosting | Commercial → transactional | Plan selection |
| `/managed-hosting` | managed hosting | Commercial | Sales enquiry |
| `/transfer-domain` | transfer a domain | Transactional | Cart (transfer) |
| `/wp-migrations` | wordpress migration service | Commercial | Sales enquiry |
| `/hosting-alternatives` | hosting comparison | Informational | Plan selection |
| `/blog/*` | long-tail informational | Informational | Newsletter / plan |

**The renewal cluster** (§1) should be built as blog content linking into
`/pricing` and `/cloud-hosting`. It is the highest-leverage content work
available and needs no new product.

---

## 4. Technical implementation

| Concern | Where | Notes |
|---|---|---|
| Metadata | `lib/seo.ts` → `pageMetadata()` | Every page calls it. None hand-writes a `Metadata` object. |
| Canonical | `pageMetadata()` | Absolute, self-referencing, no query strings |
| OpenGraph / Twitter | `lib/og.tsx` + per-route `opengraph-image.tsx` | One renderer; Next serves it for both `og:image` and `twitter:image` |
| Sitemap | `app/sitemap.ts` | Generated from the route registry — **only built, indexable routes** |
| Robots | `app/robots.ts` | Disallows everything when `NEXT_PUBLIC_SITE_URL` is not production |
| Route registry | `data/routes.ts` | Single source for sitemap, breadcrumbs, indexability, nav resolution |
| Entity graph | `lib/seo.ts` → `organizationGraph()` | Rendered **once** in the root layout |

### Entity rules (binding)

One `@id`-linked `Organization` at `#organization`; `WebSite` and `ImageObject`
reference it. **No `LocalBusiness`, no `address`, no `geo`, no invented
`foundingDate` or `founder`.** Every `publisher`/`seller`/`brand` field
references the org by `@id` rather than repeating an anonymous stub — duplicate
anonymous organisations actively prevent Google resolving a site name.

### Schema chosen per page type

- **Product + AggregateOffer** on pages that sell tiers. `AggregateOffer` is
  correct because several tiers exist; a single `Offer` would misstate the price.
- **FAQPage** only where the same Q&A is *visibly rendered*. Marking up hidden
  content misrepresents the page.
- **BreadcrumbList** on every child page, derived from the registry.
- **No `aggregateRating` or `review`.** No genuine ratings exist. Fabricating
  them is dishonest and a documented cause of manual action.
- **`Service` is deliberately not used yet.** No page currently sells a service
  distinct from the products, and adding an unused type is noise. Add it when
  `/web-design`, `/site-management` and `/seo-marketing` ship.

### Indexability

| Surface | Directive |
|---|---|
| Built commercial + marketing pages | index, follow |
| `/design-system` | **noindex** — internal tooling |
| `404` | **noindex, follow** — prevents soft-404s entering the index |
| `/api/*` | Disallowed in robots.txt |
| Any non-production origin | Entire site disallowed |

### Links to pages that do not exist

The navigation shows the full planned IA, but most of those pages are not built.
`resolveNavTarget()` in `data/routes.ts` decides what renders:

- **built** → a real link
- **not built, honest interim destination** → link to the interim
  (`/wordpress-hosting` → `/#plans`, which genuinely lists WordPress pricing)
- **not built, no interim** → plain text, not a link

Before this, every page on the site linked to **29 different 404s**. A visitor
finding a 404 is a bug; advertising 29 of them from every page is a crawl-budget
and trust problem. Flip `built: true` in the same commit that adds the page.

---

## 5. Audit

```bash
npm run dev                 # the audit crawls a running server
npm run audit:seo           # or: node scripts/seo-audit.mjs https://staging.example
```

It is deliberately **not** part of `npm run verify`: it needs a live server to
crawl, and a gate that cannot run in CI without one is a gate people disable.
Run it against staging before every cutover.

Parses **raw SSR HTML** — what a crawler sees before running JavaScript — and
checks per page: title presence and length, description presence and length,
duplicate titles/descriptions across pages, canonical (absolute,
self-referencing, no query string), robots directives against expected
indexability, the full OG and Twitter sets, exactly one `h1`, heading-level
skips, `img` alt text, `lang`, JSON-LD validity, required entity nodes, and
non-descriptive anchor text ("click here", "read more"). It then crawls every
internal link and fails on any 404, and checks `robots.txt` for a sitemap
directive.

Current status: **0 failures, 0 warnings.**

---

## 6. Cutover risk

The legacy site has **108 indexed URLs**. Launching without a verified 1:1 map
will lose rankings. Before DNS cutover:

1. Reconcile against Archive's `_redirects`.
2. Crawl all 108 legacy URLs against staging; every one must return 200 or 301.
3. Confirm `NEXT_PUBLIC_SITE_URL` is production, so `robots.ts` stops
   disallowing.
4. Submit the sitemap and monitor 404s in Search Console.

This is the single highest-risk SEO event in the project.
