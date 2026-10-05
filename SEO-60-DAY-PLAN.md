# 60-day SEO plan

**This plan promises no rankings.** Google decides indexing, sitelinks, site name, logo and positions. What this plan controls is eligibility, clarity and steady, measurable work. Every number you report should come from Search Console or analytics, not from estimates.

## Day 0: launch prerequisites (the clock starts here, not before)

| # | Prerequisite | Why |
|---|---|---|
| 1 | **The `/billing/*` reverse proxy is live and verified on staging** (DEPLOY.md, "Blocker") | Without it, every checkout, login and domain cart 404s after DNS cutover |
| 2 | Production build with `NEXT_PUBLIC_SITE_URL=https://serverlys.com` (and `NEXT_PUBLIC_ALLOW_INDEXING` unset or `true`) | Canonicals, sitemap, JSON-LD and robots all derive from it (`src/lib/env.ts`) |
| 3 | **301 the Easypanel staging host → serverlys.com (same path)**, or set `NEXT_PUBLIC_ALLOW_INDEXING=false` on it | Prevents a duplicate host competing with production |
| 4 | Brotli enabled at the proxy (Traefik/Cloudflare) | Measured −350 ms simulated mobile LCP, +2–3 Lighthouse points |
| 5 | SEO-LAUNCH-CHECKLIST.md completed | Search Console property, sitemap, URL inspection |

## The 13 priorities, mapped to the timeline

| Priority | Main window |
|---|---|
| 1. Branded search for "Serverlys" | Days 1–14 |
| 2. Indexation of all commercial pages | Days 1–14 |
| 3. Correct site name, logo and favicon in Google | Days 1–30 (Google refreshes these slowly) |
| 4. Passing Core Web Vitals (field data) | Days 8–45 (CrUX needs about 28 days of traffic) |
| 5. Strong technical SEO | Days 1–7, then weekly checks |
| 6. Long-tail commercial hosting terms | Days 15–60 |
| 7. WordPress hosting | Days 15–45 |
| 8. Cloud hosting | Days 15–45 |
| 9. Small-business hosting searches | Days 15–60 |
| 10. Website-migration intent | Days 15–30 |
| 11. Domain and business-email terms | Days 31–45 (email has no product page, so domains only until one exists) |
| 12. AI agents for small business | Days 31–60 |
| 13. Website development and SEO services | Days 46–60 |

## Days 1–7: get indexed, correctly

- **Search Console:** add the Domain property (DNS TXT at NameHero), submit `https://serverlys.com/sitemap.xml`, and confirm robots.txt fetches and allows crawling.
- **URL Inspection:** request indexing for the homepage, /hosting, /cloud-hosting, /wordpress-hosting, /ecommerce-hosting, /managed-hosting, /domain-name, /ai-agents, /website-development, /seo, /pricing and /blog.
- **Bing Webmaster Tools:** import from GSC and set `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
- **Crawl errors:** run `npm run audit:seo` and `npm run audit:links` against production and fix any non-200.
- **Brand entity:** update every profile you control (X, Instagram, TikTok, the ConvoAI and CallFlow sites) to the same name "Serverlys", the same logo (`/brand/logo-square.png`), the serverlys.com URL and the same one-line description.
- **Rich Results Test:** run the homepage (Organization and WebSite), one product page (Product/AggregateOffer, FAQPage) and one article (Article, BreadcrumbList).

## Days 8–14: verify what Google sees

- **Coverage:** in Pages, check indexed vs "Discovered – not indexed". Re-request indexing for commercial pages only, never bulk-request the blog.
- **Branded queries:** confirm "serverlys" returns the homepage first, and check whether the site name shows as "Serverlys". If it doesn't, keep `WebSite.name` and `og:site_name` consistent and wait. Google can take weeks.
- **Duplicate host:** confirm no staging URL is indexed (`site:` search on the Easypanel hostname).
- **CWV baseline:** record lab numbers (`node scripts/lighthouse.mjs https://serverlys.com --runs=3`). Field data isn't available yet.
- **Cannibalization:** decide on the register in SEO-KEYWORD-MAP.md (merge or differentiate) **before** Google settles on which URL ranks.

## Days 15–30: commercial pages and the clusters behind them

- **Merges:** apply the owner-approved merges with 301s in `next.config.ts`, starting with the two migration guides and the two Core Web Vitals articles.
- **Internal links:** work through gaps 1–5 in SEO-INTERNAL-LINK-MAP.md (/transfer-domain, /migrations, /website-development, /site-management, /ecommerce-hosting).
- **Commercial pages:** each priority page (/hosting, /cloud-hosting, /wordpress-hosting, /migrations) gets one paragraph answering the top question visible in GSC queries. Add it to visible copy, not hidden text.
- **CTR:** for pages with impressions but low CTR, test one title or description change per page, one at a time, and leave it at least 14 days.
- **Content refresh:** re-verify every price, renewal rate and "2026" claim in the WordPress and hosting clusters against `data/pricing.ts`, then run `npm run audit:claims`.

## Days 31–45: authority and the second tier

- **Domains:** strengthen the /domain-name, /register-domain and /transfer-domain cluster links. Add the registrar-of-record name to `/domain-registration-agreement` once it's known. This is an open item and a trust signal.
- **AI:** build out the AI cluster (it has only 2 articles). Write one genuinely useful piece per product, based on real usage (for example "what CallFlow does with an after-hours call"), with no invented stats.
- **Backlinks:** start the first outreach batch (see below).
- **CWV:** check the GSC Core Web Vitals report once enough field data exists, and fix any URL group flagged "Poor" or "Needs improvement".

## Days 46–60: services, review and the next cycle

- **Services:** improve /website-development, /seo and /website-design with real process detail and published examples (only real client work, with permission).
- **Query analysis:** export the GSC queries and list the terms where you sit in positions 8–20. Those are the next content-refresh targets.
- **Content refreshes:** update the 5 articles with the most impressions and the lowest CTR.
- **Review:** compare against the Day-14 baseline for indexed pages, branded clicks, non-branded impressions and CWV status. Set the next 60-day plan from that data.

## Ethical authority and digital PR

**Never:** PBNs, paid links, link farms, comment spam, mass guest posts, fake profiles or fake reviews.

| Opportunity | Fit | Notes |
|---|---|---|
| Hosting/software directories that review real providers | High | Submit accurate plan data. Renewal transparency is the angle. |
| Partner and vendor pages (registrar partner, WHMCS marketplace, n8n community/partners if eligible) | High | Only where a genuine relationship exists |
| ConvoAI and CallFlow sites (sister products) | High | Consistent cross-links and the same Organization data. These are your own properties, so use them honestly, not as a link scheme. |
| Business profiles (Google Business Profile **only if eligible**, Bing Places, BBB, chamber listings) | Medium | Positioning is global. Only list where Serverlys has a real, verifiable presence. Do not create location pages. |
| Founder interviews and podcasts (small-business and hosting topics) | Medium | Topic: why publish renewal prices |
| Original research | High | For example, an annual "advertised vs renewal price" study of public hosting price pages. Cite your sources and publish the method. |
| Technical guest contributions | Medium | One or two strong pieces a quarter on reputable dev/SMB sites, not volume |

## Linkable assets that fit Serverlys

| Asset | Status | Recommendation |
|---|---|---|
| WHOIS/RDAP lookup (`/whois-lookup`) | **Exists** | Promote it as a free tool and add it to tool directories |
| Domain search (`/domain-name`) | **Exists** | Keep |
| `downtime-cost-calculator` | **Article only.** Despite the slug, it's prose and tables, not an interactive calculator. | Either build a real calculator (revenue/hour × outage hours × affected share) or retitle it to stop promising one |
| **Renewal-cost calculator** | Doesn't exist | **Top recommendation.** Enter the intro price, renewal price, term and setup fee to get the true 1-, 2- and 3-year cost. It is the core differentiator turned into a tool, it's citable, and it supports `how-to-read-hosting-renewal-pricing`. |
| Website migration checklist | Partly covered by articles | Printable checklist page tied to /migrations |
| WordPress performance checklist | Covered by `speed-up-wordpress` | Optional |
| Core Web Vitals checker | Not recommended | PageSpeed already does this. Low unique value. |
