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

## 6. Cutover risk — CLOSED

The legacy site has **108 indexed URLs**. Launching without a verified 1:1 map
would have lost rankings. State as of 2026-09-15:

1. ~~Reconcile against Archive's `_redirects`.~~ Done. 37 legacy non-article
   URLs are covered by `redirects()` in `next.config.ts`; the remaining 71 are
   the blog archive, which was **ported rather than redirected** (below).
2. ~~Crawl all 108 legacy URLs against staging.~~ Done — all 108 return 200.
   Re-run before cutover:

   ```
   node -e 'const fs=require("fs");const u=fs.readFileSync("legacy-urls.txt","utf8").split("\n").filter(l=>l.startsWith("/"));(async()=>{let bad=0;for(const p of u){const r=await fetch("http://localhost:3001"+p);if(r.status!==200){bad++;console.log(p,r.status)}}console.log(u.length+" checked, "+bad+" failing")})()'
   ```

3. Confirm `NEXT_PUBLIC_SITE_URL` is production, so `robots.ts` stops
   disallowing. **Still outstanding — this is a deploy-time env var.**
4. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, then submit the sitemap and
   monitor 404s in Search Console. **Still outstanding.**

Two traps that were live and are now fixed, recorded so they are not
reintroduced:

- `/contact-us` 301'd to `/contact`, and `/contact` had been deleted. A
  permanent redirect into a 404 discards the equity on the old URL instead of
  passing it on. It now points at `/support`.
- `/features`, `/callflow*`, `/case-studies` and `/success-stories` are live
  on the current site and are not rebuilt here. They now redirect; see the
  comment block in `next.config.ts` for why each destination was chosen.

---

## 7. The ported archive (added 2026-09-15)

71 posts — ~132,000 words — were live and indexed on serverlys.com and did not
exist in this rebuild. They are now in `src/data/articles/legacy/`, one file
per post, generated by `npm run port:legacy` from `~/Desktop/Archive/blog`.

**Why ported and not redirected.** Mass-redirecting 71 ranking articles to
product pages is treated as a soft 404 by Google: the destination does not
answer the query the URL ranks for. The rankings are lost either way, and the
topical depth that makes the commercial pages rank goes with them.

**What the generator guarantees.** Every post asserts ≥97% of its source prose
words survived conversion (the actual minimum is 98.2%; the residual is a
tokenisation artifact, not lost text). It throws rather than skipping on an
unmapped HTML entity, an unhandled tag, or a suspiciously short parse — a
regex converter's real failure mode is silent loss, not a crash.

**The editorial pass is not in the generator, and must not be.** The originals
made claims this site's rules forbid: "we tested 15 providers", "after
optimizing hundreds of WordPress sites", fabricated benchmark tables,
statistics with no source. 46 were found, reviewed and rewritten by hand.
`npm run audit:claims` finds them and is wired into `npm run verify`; it holds
a short allowlist of reviewed exceptions (sentences that *debunk* an absolute
guarantee necessarily contain the phrase the rule looks for).

**Re-running the generator will destroy that pass.** It reads the unedited
source. If a post must be regenerated, regenerate it alone and re-apply the
edits.

### No category routes

There are deliberately **no** `/blog/category/<slug>` pages. The whole archive
is grouped by subject on `/blog` itself, and the category chips in the hero are
in-page anchors into those groups — so a separate route per category would be
eight URLs whose entire content already exists on a page Google is crawling
anyway.

The problem those hubs would solve is real, though, and is solved here instead:
76 posts in one flat recent-first list leaves the tail effectively orphaned.
The grouped section at the bottom of `/blog` is the fix — it is the one place
every article is linked from a single page.

If the archive grows past the point where one page can carry it, category
routes become the right answer again. `categorySlug()` in
`src/data/articles/index.ts` already produces the segment.

### Search Console

`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_BING_SITE_VERIFICATION`
are read in `lib/env.ts` and emitted from the root layout. Absent by default,
and an absent token emits no tag at all — an empty verification meta reads as a
failed verification, not an absent one. Nothing else in this document can be
measured until the Search Console property exists.

---

## 8. Browser and device support (added 2026-09-15)

### The baseline the stack imposes

Tailwind 4.3 and Next 16 set the floor, not this code. The built CSS uses
`@property` (71 rules), `color-mix()` (115 occurrences, every one guarded by
`@supports`), relative colour syntax and `:has()`. That is Tailwind v4's
documented target:

| engine  | minimum |
|---------|---------|
| Safari / iOS | 16.4 |
| Chrome / Edge | 111 |
| Firefox | 128 |

Below those, the page still renders — the layout is flexbox and the colours
degrade through the `@supports` guards — but it is not pixel-correct, and
nothing in this repo tests it. Do not promise older support without checking.

Prefixes are handled: the bundle emits `-webkit-backdrop-filter` and
`-webkit-mask-image` alongside the unprefixed properties.

### Images

`next/image` negotiates on `Accept`, verified end to end:

| client | served | bytes (1440w) |
|--------|--------|---------------|
| Chrome / Firefox / Safari 16+ | AVIF | 60 KB |
| Safari 14–15, older Chrome | WebP | 141 KB |
| Safari 13 and older | PNG | 360 KB |

The 1.68 MB source is never sent.

**Every fixed-size `<Image>` needs a `sizes`.** Without it the browser assumes
`sizes="100vw"` and takes the largest candidate in the srcset. Both logo
components were doing exactly that — fetching the 1920px variant (19 KB of
AVIF) to paint a 162px-wide mark, on every page, in the header's `priority`
critical path. With `sizes` set to the real rendered width they resolve to
2.9 KB at 1× and 4.8 KB at 2×, and all three engines agree on the choice.

The rule: if an `<Image>` has explicit `width`/`height` rather than `fill`, it
needs `sizes` describing how wide it actually renders. `wordmark.tsx` and
`convoai-logo.tsx` both expose `sizes` as a prop for callers that render them
larger than the default.

### Two headers that must stay production-only

Both were breaking Safari on the dev server, and Chromium could not have
caught either because Chromium special-cases `localhost`:

- **`upgrade-insecure-requests`** rewrites every *subresource* to https while
  leaving the top-level navigation alone. On `next dev` the document loads over
  http and then every stylesheet, font and script is fetched over https against
  a server with no TLS. Safari renders the site as unstyled HTML. Chrome and
  Firefox treat `http://localhost` as potentially-trustworthy and skip it.
- **HSTS** (`max-age=63072000; includeSubDomains`) is recorded by Safari from
  localhost and force-upgrades it for two years — across *every* localhost
  port, because the policy is keyed on the host. Clearing it means wiping
  Safari's HSTS store by hand.

Both are gated on `isDev` in `next.config.ts`. Production is unchanged.

### Running the check

`npm run audit:browsers` drives Chromium, WebKit and Gecko over seven pages at
eight viewports (320 → 1920), asserting no horizontal scroll, no element
overflowing its container, no JS errors and no undecoded images.

Playwright is deliberately NOT a dependency — it is hundreds of MB of browsers
and has no place in the deploy image. Install it when you need it:

```
npm i --no-save playwright
npx playwright install webkit firefox chromium
```

`--no-save` matters: the Dockerfile runs `npm ci`, which installs
devDependencies, so adding playwright to `package.json` would pull the browsers
into the deploy image.

⚠ Point it at **https** when testing a production build. Over plain http the
production CSP's `upgrade-insecure-requests` breaks every subresource, which
looks like a catastrophic failure and is actually correct behaviour.

---

## AI answer engines (added 2026-09-14)

Showing up in ChatGPT, Gemini, Claude, Perplexity or Copilot is a different
retrieval problem from ranking in Google, and this site now addresses it
explicitly. Four things matter, in this order.

### 1. The bots must not be blocked — `src/data/ai-agents.ts`

`robots.txt` names AI crawlers in **two groups**, and the split is the point.
`AI_ANSWER_AGENTS` are the bots that fetch a page to answer a question someone
is asking right now, and they cite the source: `OAI-SearchBot`, `ChatGPT-User`,
`Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`,
`DuckAssistBot`, `MistralAI-User`, `YouBot`. `AI_TRAINING_AGENTS` are the
corpora bots: `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`,
`Amazonbot`, `meta-externalagent`, `CCBot`, `cohere-ai`.

Both are allowed today. **Emptying `AI_TRAINING_AGENTS` opts out of training
without touching AI search.** Blocking the answer group is what removes the site
from AI answers, and it is a silent failure — nothing appears in any dashboard.

Watch the user-triggered bots in particular (`ChatGPT-User`, `Claude-User`). The
failure mode there is a prospect explicitly asking their assistant to read
serverlys.com and being told it cannot.

⚠ These are robots.txt rules, which is the ORIGIN's answer. Anything in front of
the origin can override them — Cloudflare's "Block AI bots" toggle and most WAF
bot-management defaults block this exact list regardless of what we serve. After
DNS cutover, re-run `npm run test:ai` **against production**, not localhost.

### 2. `/llms.txt` — `src/app/llms.txt/route.ts`, copy in `src/data/llms.ts`

Generated from the same route registry as the sitemap, so it can never advertise
an unbuilt page or an internal surface. Sections are ordered by the question a
person actually asks an assistant, not by the navigation.

The editorial rule is stricter than for a marketing page: *if it would be wrong
for ChatGPT to tell a stranger "Serverlys says X", X does not belong in that
file.* A page is read with its context visible; an AI answer is not. Hence no
uptime figures, no customer or review counts, no prices. `test:ai` enforces this
with a banned-pattern check — it will fail the build if "99.9% uptime", "5M+",
"Trustpilot" or "WordPress.org" ever appear in `/llms.txt`.

### 3. Extraction without JavaScript

Most AI crawlers do not execute JS. Every page is server-rendered and its prose
is in the raw HTML — verified, not assumed: `test:ai` strips tags from the HTTP
response and asserts >1200 characters of readable text on nine key pages.
Anything moved behind a client-only fetch becomes invisible to answer engines
even though it looks fine in a browser.

### 4. Entity resolution — `serviceGraph()` in `src/lib/seo.ts`

`Service` nodes on the thirteen pages that sell services rather than plans, each
with `provider: {"@id": .../#organization"}`. This is what connects "who builds
AI phone agents for small businesses" to the answer "Serverlys". An anonymous
`{"@type":"Organization"}` stub resolves to nothing and defeats the whole graph,
so `test:ai` walks every JSON-LD block and fails on any un-`@id`'d Organization.

`serviceGraph` deliberately omits `areaServed` (global positioning), `offers`
(these services are quoted, not published) and `aggregateRating` (none are real).

### What this does NOT do

It makes the site eligible, legible and citable. It cannot make an assistant
choose to cite it — there is no ranking lever, no submission endpoint and no
dashboard. Retrieval depends on the model's index refresh, the phrasing of the
question and whatever else it found. Treat coverage as something to sample
manually over weeks, not something to verify on deploy day.

