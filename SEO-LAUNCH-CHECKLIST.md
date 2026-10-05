# SEO launch checklist

What to do, in order, when this app becomes the public face of the brand. The
infrastructure side of the cutover (the `/billing` proxy, port exposure,
secrets) lives in [DEPLOY.md](DEPLOY.md) and must be finished first — a site
that ranks but cannot check anyone out is worse than one that does not rank.

Nothing here can make Google show a site name, logo, sitelinks or rich
results. These steps make Serverlys **eligible** and **unambiguous**; Google
decides what appears.

---

## 1. One environment variable decides the SEO identity

Every canonical, `og:url`, JSON-LD `@id`, sitemap entry and `robots.txt` line
derives from `NEXT_PUBLIC_SITE_URL` (see `src/lib/env.ts`). WHMCS links are a
separate, transactional origin (`NEXT_PUBLIC_BILLING_ORIGIN`) and never follow
the site URL.

| Situation | `NEXT_PUBLIC_SITE_URL` | `NEXT_PUBLIC_ALLOW_INDEXING` | Result |
|---|---|---|---|
| Staging, private (today) | `https://webhosting-serverlys.rf90qw.easypanel.host` | *(unset)* | `Disallow: /` + `noindex` on every page; canonicals point at staging itself |
| Staging used temporarily as the public site | staging origin | `true` | Indexable; canonicals self-reference staging. **Must be 301'd to serverlys.com at cutover** |
| **Production** | `https://serverlys.com` | *(unset)* | Indexable, canonicals on serverlys.com |
| Emergency de-index | any | `false` | `noindex` everywhere |

Both are **build-time** values (they are inlined and the pages are
prerendered). In Easypanel they must be set as **build arguments**, then the
service rebuilt — changing them at runtime does nothing.

> Why staging scores SEO 69 in PageSpeed today: Lighthouse's `is-crawlable`
> audit fails because staging is deliberately blocked. That is correct
> behaviour, not a defect. Built as production, every audited route scores
> SEO 100.

### Switching to serverlys.com

1. Easypanel → service → Build args: `NEXT_PUBLIC_SITE_URL=https://serverlys.com`,
   remove `NEXT_PUBLIC_ALLOW_INDEXING` (or leave it empty). Rebuild.
2. Point `serverlys.com` (and `www`) at the service. `www` must **301** to the
   apex — configure it in Easypanel's domain settings (Next does not see the
   `www` host to redirect it).
3. If the staging host was ever indexable: add a host-level **301** from
   `webhosting-serverlys.rf90qw.easypanel.host/*` → `https://serverlys.com/*`
   (same path). Never leave two indexable copies.
4. Verify:
   ```bash
   curl -s https://serverlys.com/robots.txt            # Allow: / + Sitemap: https://serverlys.com/sitemap.xml
   curl -s https://serverlys.com/ | grep -o '<link rel="canonical"[^>]*>'
   curl -s https://serverlys.com/ | grep -o 'name="robots" content="[^"]*"'   # index, follow
   curl -sI http://serverlys.com/ | head -1            # 301 → https
   curl -sI https://www.serverlys.com/ | grep -i location   # → https://serverlys.com/
   curl -sI https://serverlys.com/pricing/ | grep -i location # → /pricing (308)
   npm run audit:seo -- https://serverlys.com          # 0 failures expected
   ```

## 2. Google Search Console

1. **Add property → Domain** (not URL-prefix) for `serverlys.com`. A Domain
   property covers http/https and every subdomain, so www/non-www and
   protocol duplicates show up in one place.
2. **Verify** with the DNS TXT record Google gives you, added at the DNS host
   (NameHero for serverlys.com). Do not use the HTML-tag method for a Domain
   property — it cannot verify one.
   - Optional: also add a URL-prefix property for `https://serverlys.com/`.
     That one *can* use the meta tag: set
     `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token>` as a build arg (Bing:
     `NEXT_PUBLIC_BING_SITE_VERIFICATION`). Leave both **empty** on staging.
3. **Sitemaps → Add** `https://serverlys.com/sitemap.xml`. Expect ~128 URLs
   (every indexable page + every article). Pages carry no `lastmod` on
   purpose; articles carry their real publication date.
4. **URL Inspection → Request indexing**, one at a time, for:

   | Page | URL |
   |---|---|
   | Homepage | `/` |
   | Web Hosting | `/hosting` |
   | Cloud Hosting | `/cloud-hosting` |
   | WordPress Hosting | `/wordpress-hosting` |
   | Ecommerce Hosting | `/ecommerce-hosting` |
   | Managed Hosting | `/managed-hosting` |
   | Domains | `/domain-name` |
   | AI Agents | `/ai-agents` |
   | Website Development | `/website-development` |
   | SEO | `/seo` |
   | Pricing | `/pricing` |
   | Blog | `/blog` |

   In each inspection confirm: *URL is on Google* (or eligible), *Indexing
   allowed: Yes*, *User-declared canonical = Google-selected canonical*, and
   that the rendered HTML screenshot shows the page, not a blank shell.
5. **Enhancements** (appear after a crawl): Breadcrumbs, Products, FAQ. Any
   error here is a real defect: fix and *Validate fix*. Note: since 2023
   Google shows FAQ *rich results* only for well-known government and health
   sites, so the FAQ markup will validate but should not be expected to add
   accordions to Serverlys results — it is there because it describes visible
   content and helps AI answers.
6. **Core Web Vitals report**: needs ~28 days of Chrome field data. Lab scores
   do not populate it.

Bing Webmaster Tools: *Import from Google Search Console* after step 2 — it
copies the property and sitemap.

## 3. What makes Serverlys eligible for a brand-style result

All implemented; verify once live with the
[Rich Results Test](https://search.google.com/test/rich-results) and the
[Schema Markup Validator](https://validator.schema.org/).

| Surface | What the site provides | Where |
|---|---|---|
| Site name "Serverlys" | `WebSite` with `name`, `alternateName` (`Serverlys Hosting`, `serverlys.com`), `url` = homepage | `organizationGraph()` in `src/lib/seo.ts`, root layout |
| Logo | `Organization.logo` → `/brand/logo-square.png`, 512×512 PNG, mark on white | same |
| Favicon | `/favicon.ico` (16/32), `/icon.png` 192×192 (multiple of 48), `/apple-icon.png` 180, manifest | `src/app/` file conventions, `src/app/manifest.ts` |
| Entity | ONE `@id`-linked `Organization`: name, legalName "Serverlys, LLC", email, telephone, contactPoint, `sameAs` (X, Instagram, TikTok — the profiles the footer links), offer catalogue | `src/lib/seo.ts`, `src/data/company.ts`, `src/data/navigation.ts` |
| Breadcrumbs | Visible trail above the footer + matching `BreadcrumbList`, one component | `src/components/ui/page-breadcrumbs.tsx` |
| Articles | `Article` with headline, description, image, datePublished, dateModified, author/publisher → Organization | `articleGraph()` |
| Sitelinks | Not markup — earned from clear hierarchy, consistent nav anchors and internal links. See SEO-INTERNAL-LINK-MAP.md | — |

Deliberately absent (do not add without real data): physical address,
`LocalBusiness`, `foundingDate`, founders, `aggregateRating`, reviews, awards.

## 4. First-week watch list

- **Pages → Why pages aren't indexed**: "Duplicate without user-selected
  canonical" or "Alternate page with proper canonical" pointing at the
  Easypanel host means step 1.3 was missed.
- **Crawl stats**: any `/billing/*` 404s mean the proxy is wrong (DEPLOY.md).
- `site:serverlys.com` in Google after ~1 week: the homepage should show the
  favicon and "Serverlys" as the site name. Site-name and favicon changes can
  take weeks; do not change the markup while waiting.
- Re-run `npm run audit:lighthouse -- https://serverlys.com --runs=3` and
  `npm run audit:seo -- https://serverlys.com` against production.

## 5. Owner-only items (cannot be done from code)

- [ ] Easypanel build args per §1, and the `www` → apex 301
- [ ] Staging host 301 (only if staging was ever made indexable)
- [ ] Search Console Domain property + DNS TXT at NameHero
- [ ] Bing import
- [ ] Brotli at the proxy (measured: −350 ms simulated mobile LCP, +2–3
      Lighthouse points) — Easypanel's Traefik `compress` middleware with
      `encodings: [br, gzip]`, or Cloudflare in front. Next.js itself only
      speaks gzip.
- [ ] Decide the copy flags in SEO-TECHNICAL-AUDIT.md §"Claims to verify"
      ("24/7 support", "79% off")
