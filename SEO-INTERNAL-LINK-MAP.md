# Internal link map

Derived from source on 2026-10-04: `src/data/navigation.ts` (header, mega-menu, footer) and every `[label](/path)` link in `src/data/articles/**`. To re-derive the article counts:

```bash
grep -o '](/[a-z0-9/-]*' -r src/data/articles | sed 's#.*](##' | grep -v '^/blog' | sort | uniq -c | sort -rn
```

## Hub → spoke structure

```
Serverlys (/)
├── Hosting (/hosting)
│   ├── Cloud hosting (/cloud-hosting)
│   ├── WordPress hosting (/wordpress-hosting)
│   ├── Ecommerce hosting (/ecommerce-hosting)
│   ├── Managed hosting (/managed-hosting)
│   ├── Shared (/shared-hosting) · VPS (/vps-hosting) · Dedicated (/dedicated-servers)
│   ├── Compare tiers (/hosting-alternatives)
│   └── Free migration (/migrations)
├── Domains (/domain-name)
│   ├── Register (/register-domain)
│   ├── Transfer (/transfer-domain)
│   └── WHOIS lookup (/whois-lookup)
├── AI agents (/ai-agents)
│   ├── ConvoAI (/convoai)
│   ├── CallFlow AI (/callflow-ai)
│   ├── Automations (/automations)
│   └── Which tool? (/ai-tools)
├── Websites & growth (no hub page; /business-solutions is the bundle)
│   ├── Website design (/website-design)
│   ├── Website development (/website-development)
│   ├── SEO (/seo) · Marketing (/marketing) · Social media (/social-media)
│   ├── Site management (/site-management)
│   └── Our process (/our-process)
├── Pricing (/pricing)
├── Resources (/resources)
│   ├── Blog (/blog) → 8 clusters, see SEO-KEYWORD-MAP.md
│   ├── Tutorials (/tutorials)
│   └── FAQ (/faq)
├── Support (/support) · About (/about)
└── Legal & trust (/legal-information) → 14 policies
```

The breadcrumb hierarchy (`parents` in `src/data/routes.ts`) mirrors this tree. As of 2026-10-04 `/managed-hosting` is parented under `/hosting`. Breadcrumbs now render visibly in the footer strip (`components/ui/page-breadcrumbs.tsx`), and every crumb is a real `<a>`.

## Inbound links from articles to commercial pages

"Files" counts the article source files that link to the page; `original.ts` holds 5 articles and counts as one file. "Instances" counts every link.

| Page | Instances | Files | Status |
|---|---|---|---|
| /cloud-hosting | 88 | 50 | **Over-concentrated.** It receives links from articles whose topic belongs to another parent (GDPR, SSL, email security). |
| /pricing | 29 | 26 | OK |
| /wordpress-hosting | 20 | 13 | OK |
| /hosting | 16 | 15 | OK |
| /register-domain | 15 | 11 | OK |
| /website-design | 10 | 7 | OK |
| /whois-lookup | 8 | 6 | OK |
| /ecommerce-hosting | 8 | 6 | Thin for a money page |
| /managed-hosting | 6 | 6 | OK |
| /migrations | 5 | 4 | Under-linked for a key conversion page |
| /seo | 2 | 2 | Under-linked (new this session) |
| /ai-agents | 2 | 2 | Under-linked (new this session) |
| /transfer-domain | 2 | 1 | **Under-linked** |
| /convoai, /callflow-ai, /hosting-alternatives, /our-process | 1 each | 1 | Under-linked (new this session) |
| /website-development, /business-solutions, /site-management, /automations, /domain-name, /vps-hosting, /dedicated-servers, /marketing, /social-media | 0 | 0 | **No article links.** They're reachable only through nav, footer and the footer breadcrumb. |

## Links added this session (2026-10-04)

| Source | Anchor → target | Note |
|---|---|---|
| `original.ts` · how-to-read-hosting-renewal-pricing | "every plan" → /pricing | |
| `original.ts` · move-a-website-without-downtime | "migration is free" → /migrations | |
| `original.ts` · shared-cloud-vps-or-dedicated | "The four categories" → /hosting-alternatives | |
| `original.ts` · shared-cloud-vps-or-dedicated | "choose managed" → /managed-hosting | |
| `original.ts` · core-web-vitals-for-small-sites | "hosting response time" → /blog/reduce-ttfb | |
| `original.ts` · core-web-vitals-for-small-sites | "full Core Web Vitals guide" → /blog/core-web-vitals-guide | Interim signal for the merge (see the cannibalization register) |
| `original.ts` · what-ai-agents-can-do-for-a-small-business | "AI agent" → /ai-agents | |
| `original.ts` · what-ai-agents-can-do-for-a-small-business | "ring out" → /callflow-ai | |
| `legacy/ai-tools-small-business` | "ConvoAI" → /convoai, "AI agents" → /ai-agents | Also **replaced a false claim** that every hosting plan includes the AI widget |
| `legacy/local-seo-guide` | "SEO services" → /seo | |
| `legacy/wordpress-seo-guide` | "SEO services" → /seo | |
| `legacy/website-cost-guide` | "Our process" → /our-process | |

## Remaining gaps (in priority order)

1. **/transfer-domain:** only `domain-transfer-guide` links to it today. Add links from `expired-domains-guide`, `nameservers-explained` and `whois-privacy-protection`.
2. **/migrations:** already linked from `cloud-vs-shared-hosting`, `best-hosting-startups`, `migrate-website-new-host` and `original.ts`. Add `cpanel-vs-plesk`, `hosting-red-flags` and `wordpress-staging-site`.
3. **/website-development:** link from `freelancer-vs-agency`, `build-website-from-scratch` and `conversion-rate-optimization` where custom work is discussed.
4. **/site-management:** link from `wordpress-security-guide`, `website-hacked-recovery` and `website-backup-strategy` (the "someone does the updates" passages).
5. **/ecommerce-hosting:** link from `online-store-setup-guide`, `woocommerce-vs-shopify`, `contact-form-guide` and `conversion-rate-optimization`.
6. **/seo:** link from `website-speed-seo`, `domain-name-seo` and `google-pagespeed-score`.
7. **/automations:** link from `what-ai-agents-can-do…` (the CRM/inbox capture bullet) and `contact-form-guide`.
8. **Rebalance /cloud-hosting:** retarget some links. Security articles go to /managed-hosting, WordPress-context ones to /wordpress-hosting, and generic "hosting" mentions to /hosting.
9. **Legal:** `/domain-registration-agreement` and `/ai-services-terms` each have exactly one inbound link (from /legal-information). Add a fine-print link from /register-domain and /transfer-domain, and from /convoai and /callflow-ai.

## Anchor-text rules

- **Describe, don't stuff.** Use the words the sentence already says ("migration is free", "choose managed"), not "best cheap cloud hosting".
- **No repeated exact-match anchors.** No more than about 1 in 5 links to a page may use its primary keyword verbatim. Today "cloud hosting" is used as the anchor dozens of times. Vary it.
- **One link per target per article,** usually in the paragraph where the reader would act. A "Serverlys Tip" callout counts.
- **Articles link up to their cluster's parent** (see the keyword map). Commercial pages link across to siblings and down to at most 1–2 supporting guides.
- **Never link to an unbuilt route.** `resolveNavTarget()` in `routes.ts` already enforces this for nav, and `npm run audit:links` checks the rest.
- **No sitewide footer/keyword link blocks** beyond the existing nav and legal lists.
