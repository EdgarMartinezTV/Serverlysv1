# SEO keyword / page map

Built 2026-10-04 from the source (`src/app/**`, `src/data/routes.ts`, `src/data/navigation.ts`, `src/data/articles/**`). **There are no search-volume numbers here on purpose.** None have been measured, so none are quoted. Fill in real impressions from Search Console after launch (see SEO-60-DAY-PLAN.md).

**Positioning rule (decided 2026-09-08, do not reverse silently):** global brand with no Miami/local targeting. Do not add city keywords, `areaServed` or local landing pages.

**What doesn't exist:** there is no business-email product page. Email intent is served by the `setup-business-email` article only. Do not map commercial email keywords to a page until one is actually built and sold.

"Inbound (articles)" counts the article source files that link to the URL. `original.ts` holds 5 articles and counts as one file. Every page below is also reachable from the header mega-menu and/or the footer, and now from the footer breadcrumb strip.

## Commercial and hub pages

| URL | Type | Primary intent | Primary topic | Secondary topics | Funnel | C / I | Inbound (articles) | Should link to | Cannibalization concerns |
|---|---|---|---|---|---|---|---|---|---|
| `/` | Home / brand hub | Navigational ("serverlys") + broad commercial | Web hosting, domains & AI for small business | renewal pricing, free migration, AI agents | All | C | n/a (site root) | /hosting, /pricing, /domain-name, /ai-agents, /website-design | Must not try to rank for "web hosting" against /hosting. Keep it brand-first. |
| `/hosting` | Category hub | Commercial: web hosting for small business | Web hosting | managed plans, from $7.95/mo, compare tiers | MoFu | C | 15 | /cloud-hosting, /wordpress-hosting, /ecommerce-hosting, /managed-hosting, /hosting-alternatives, /pricing | Article `best-web-hosting-small-business` targets nearly the same phrase (see register) |
| `/cloud-hosting` | Product | Transactional: managed cloud hosting | Managed cloud hosting | NVMe, LiteSpeed, free migration, scaling | BoFu | C | 50 | /pricing, /migrations, /managed-hosting | Over-linked (88 link instances): it absorbs anchors that belong to /hosting or /wordpress-hosting |
| `/wordpress-hosting` | Product | Transactional: managed WordPress hosting | Managed WordPress hosting | LiteSpeed cache, auto updates, WooCommerce | BoFu | C | 13 | /ecommerce-hosting, /migrations, /pricing | `best-wordpress-hosting-2026` (comparison intent) |
| `/ecommerce-hosting` | Product | Transactional: WooCommerce hosting | Ecommerce / WooCommerce hosting | store speed, SSL, backups | BoFu | C | 6 | /wordpress-hosting, /pricing, /migrations | Overlaps /wordpress-hosting on "WooCommerce". Keep ecommerce = store owners. |
| `/managed-hosting` | Product / explainer | Commercial: managed hosting service | Managed hosting | patching, monitoring, backups | MoFu | C | 6 | /cloud-hosting, /vps-hosting, /site-management | `managed-hosting-guide` (definition intent) |
| `/shared-hosting` | Product (coming soon) | Informational-commercial | Shared hosting | when to outgrow it | MoFu | C | 0 | /cloud-hosting, /hosting-alternatives | Overlaps `shared-cloud-vps-or-dedicated` and `cloud-vs-shared-hosting`. Not sold yet, so don't push it. |
| `/vps-hosting` | Product (quoted) | Commercial: VPS hosting | VPS hosting | root access, managed vs unmanaged | MoFu | C | 0 | /managed-hosting, /dedicated-servers | Low risk |
| `/dedicated-servers` | Product (quoted) | Commercial: dedicated servers | Dedicated servers | single-tenant, compliance | MoFu | C | 0 | /vps-hosting, /support | Low risk |
| `/hosting-alternatives` | Comparison hub | Informational-commercial: compare hosting types | Hosting comparison | shared / cloud / VPS / dedicated | ToFu–MoFu | I→C | 1 | /hosting, each tier page | **High:** `shared-cloud-vps-or-dedicated`, `cloud-vs-shared-hosting` |
| `/pricing` | Pricing hub | Transactional: hosting prices | Hosting & domain pricing | renewal rate shown, 30-day guarantee | BoFu | C | 26 | product pages, /refund-policy | `web-hosting-cost-2026` and `how-to-read-hosting-renewal-pricing` (informational, should feed /pricing) |
| `/migrations` | Service | Transactional: free website migration | Website migration service | no downtime, done for you | BoFu | C | 4 | /cloud-hosting, /wordpress-hosting, /support | **High:** two migration how-to articles (see register) |
| `/domain-name` | Tool / category hub | Transactional: domain name search | Domain search & availability | TLD prices, WHOIS privacy | BoFu | C | 0 | /register-domain, /transfer-domain, /whois-lookup | Overlaps /register-domain. Keep /domain-name = search, /register-domain = registration. |
| `/register-domain` | Product | Transactional: register a domain | Domain registration | from $9.95, renewal shown, privacy | BoFu | C | 11 | /domain-name, /transfer-domain, /domain-registration-agreement | see /domain-name |
| `/transfer-domain` | Product | Transactional: transfer a domain | Domain transfer | 60-day rule, no downtime | BoFu | C | 1 | /register-domain, /domain-registration-agreement | `domain-transfer-guide` (how-to). Should link up to here. |
| `/whois-lookup` | Free tool | Informational / tool | WHOIS / RDAP lookup | expiry, registrar, nameservers | ToFu | I | 6 | /domain-name, /transfer-domain | `whois-privacy-protection` (different intent, keep) |
| `/ai-agents` | Category hub | Commercial: AI agents for small business | AI chat & phone agents | lead capture, booking, hand-off | MoFu | C | 2 | /convoai, /callflow-ai, /automations | `what-ai-agents-can-do…`, `ai-tools-small-business` |
| `/convoai` | Product | Transactional: AI chatbot for business | AI website chatbot | trained on your site, lead capture | BoFu | C | 1 | /ai-agents, /ai-services-terms | /ai-tools compares the same products |
| `/callflow-ai` | Product | Transactional: AI phone answering | AI voice agent | missed calls, booking, messages | BoFu | C | 1 | /ai-agents, /ai-services-terms | /ai-tools |
| `/automations` | Service | Commercial: business automation | Built-and-run automations (n8n) | daily admin, owned by customer | MoFu | C | 0 | /ai-agents, /our-process | Low. **No price is quoted, by design.** |
| `/ai-tools` | Comparison | Informational-commercial | Which AI tool solves which problem | ConvoAI vs CallFlow vs Automations | MoFu | I→C | 0 | the three product pages | Overlaps /ai-agents. Differentiate as the "which one" decision page. |
| `/website-design` | Service | Commercial: website design for small business | Website design | conversion, hosting included | MoFu | C | 7 | /website-development, /our-process, /seo | `freelancer-vs-agency`, `website-cost-guide` (supporting) |
| `/website-development` | Service | Commercial: custom web development | Web apps & integrations | built on our infrastructure | MoFu | C | **0** | /website-design, /our-process | Low risk. Under-linked. |
| `/seo` | Service | Commercial: SEO services for small business | SEO services | technical + content SEO, honest reporting | MoFu | C | 2 | /website-design, /marketing | SEO blog articles (informational). Must link UP here. |
| `/marketing` | Service | Commercial: small-business marketing | Marketing measured in enquiries | search, email | MoFu | C | 0 | /seo, /social-media | Low |
| `/social-media` | Service | Commercial: social media management | Social media management | content, scheduling | MoFu | C | 0 | /marketing | Low |
| `/site-management` | Service | Commercial: website maintenance | Website care plans | updates, backups verified, uptime | MoFu | C | 0 | /managed-hosting, /support | Overlaps /managed-hosting. Differentiate: site layer vs server layer. |
| `/business-solutions` | Bundle hub | Commercial: one supplier for everything online | Bundled services | one bill | MoFu | C | 0 | all service hubs | Low |
| `/our-process` | Trust / process | Informational (pre-sale) | How a project runs | stages, deliverables | MoFu | I | 1 | /website-design, /website-development | none |
| `/about` | Trust / entity | Navigational / brand | Who Serverlys is | pricing philosophy | All | I | 0 | /support, /legal-information | none |
| `/support` | Trust / support | Navigational | Getting help | tickets, migration requests | Post-sale | I | 0 | /faq, /customer-service-policy | none |
| `/faq` | Hub | Informational | FAQ across products | renewals, refunds, migration | MoFu | I | 0 | product pages | FAQPage markup duplicates some product FAQs. Keep answers consistent. |
| `/resources` | Hub | Navigational | Guides, tools, answers | — | ToFu | I | 0 | /blog, /tutorials, /faq, /domain-name | none |
| `/blog` | Hub (archive) | Informational | Articles index | clusters below | ToFu | I | n/a | each cluster's commercial page | none |
| `/tutorials` | Hub | Informational: how-to | Step-by-step procedures | DNS, email, HTTPS, restores | ToFu | I | 0 | /support, /hosting | Overlaps how-to articles. Keep tutorials procedural only. |
| Legal (14 pages) | Trust | Navigational | Policies | — | Post-sale | I | 0 | /legal-information | `/domain-registration-agreement` and `/ai-services-terms` have only one inbound link each |

## Blog clusters (76 articles)

Each cluster names its **commercial parent**: the page the articles should hand readers to. Articles keep informational intent and must not target the parent's transactional phrase.

| Cluster | Commercial parent(s) | Articles (slugs) |
|---|---|---|
| Hosting (18) | /hosting, /cloud-hosting, /pricing, /managed-hosting | how-to-read-hosting-renewal-pricing, shared-cloud-vps-or-dedicated, best-web-hosting-small-business, cloud-vs-shared-hosting, managed-hosting-guide, best-hosting-startups, nvme-vs-ssd-hosting, cpanel-beginners-guide, web-hosting-cost-2026, downtime-cost-calculator, website-backup-tutorial, hosting-uptime-explained, migrate-website-new-host, cpanel-vs-plesk, hosting-red-flags, htaccess-redirects, green-web-hosting, mysql-database-guide |
| Getting started (9) | /website-design, /register-domain, /migrations | move-a-website-without-downtime, build-website-from-scratch, setup-business-email, website-cost-guide, local-seo-guide, wordpress-vs-webflow-squarespace, conversion-rate-optimization, google-analytics-4-guide, freelancer-vs-agency |
| Performance (13) | /cloud-hosting, /wordpress-hosting | core-web-vitals-for-small-sites, website-speed-seo, core-web-vitals-guide, google-pagespeed-score, cdn-setup-guide, image-optimization-web, website-caching-guide, database-optimization, mobile-speed-optimization, gzip-vs-brotli, litespeed-vs-apache-nginx, reduce-ttfb, http3-quic-guide |
| AI (2) | /ai-agents, /convoai, /callflow-ai | what-ai-agents-can-do-for-a-small-business, ai-tools-small-business |
| Domains (10) | /domain-name, /register-domain, /transfer-domain | domain-name-seo, tld-comparison-guide, dns-records-explained, domain-transfer-guide, whois-privacy-protection, domain-name-generators, expired-domains-guide, subdomain-vs-subdirectory, nameservers-explained, domain-parking-guide |
| WordPress (11) | /wordpress-hosting | speed-up-wordpress, install-wordpress-guide, best-wordpress-hosting-2026, wordpress-security-guide, best-free-wordpress-themes, contact-form-guide, must-have-wordpress-plugins, google-analytics-setup, wordpress-white-screen-death, wordpress-seo-guide, wordpress-staging-site |
| Ecommerce (2) | /ecommerce-hosting | online-store-setup-guide, woocommerce-vs-shopify |
| Security (11) | /managed-hosting, /cloud-hosting | website-security-checklist, free-ssl-setup, ssl-certificate-explained, stop-ddos-attacks, website-backup-strategy, two-factor-authentication, website-hacked-recovery, web-application-firewall, email-security-spf-dkim-dmarc, gdpr-website-compliance, malware-scanning-tools |

SEO-intent articles (local-seo-guide, website-speed-seo, wordpress-seo-guide, domain-name-seo, google-pagespeed-score) form an implicit **SEO cluster** whose parent is `/seo`. Only local-seo-guide and wordpress-seo-guide link to it today.

## Cannibalization register (OWNER DECISION: none of these have been merged or redirected)

I checked each pair against its live title before listing it. A merge means: keep the stronger URL, fold in the unique content, and 301 the other to it (add the redirect in `next.config.ts`). Never delete without a redirect.

| Pages | Titles | Overlap | Recommendation |
|---|---|---|---|
| `core-web-vitals-for-small-sites` vs `core-web-vitals-guide` | "Core Web Vitals for small sites, without the jargon" / "Core Web Vitals in 2026: A Complete Guide to LCP, INP, CLS" | Same intent | **Merge** the short one into the guide (the guide is longer and older, so it carries more equity). Interim: the short one now links to the guide. |
| `google-analytics-4-guide` vs `google-analytics-setup` | "GA4 for Beginners: Set Up GA4 Properly" / "How to Add Google Analytics to WordPress the Right Way" | Partial: GA4 setup vs WordPress install | **Differentiate.** Keep the WP one strictly about WordPress plugin/snippet install and cross-link both. |
| `move-a-website-without-downtime` vs `migrate-website-new-host` | "How to move a website to a new host without downtime" / "How to Migrate Your Website to a New Host, No Downtime" | Same intent, near-identical titles | **Merge** into `migrate-website-new-host` (longer). Both already link to /migrations. |
| `website-backup-tutorial` vs `website-backup-strategy` | "How to Back Up and Restore… with cPanel or SSH" / "Backup Strategy: How Often Should You Back Up?" | Low: how-to vs policy | **Differentiate.** Keep both and cross-link. |
| `shared-cloud-vps-or-dedicated` vs `cloud-vs-shared-hosting` vs `/hosting-alternatives` | "Shared, cloud, VPS or dedicated: which one do you need?" / "Cloud Hosting vs Shared Hosting…" / "Hosting Comparison — how the four tiers differ" | High: the article and /hosting-alternatives share a four-way intent | **Merge** `shared-cloud-vps-or-dedicated` into `/hosting-alternatives` (the page is the hub). Keep `cloud-vs-shared-hosting` as the two-way comparison. |
| `what-ai-agents-can-do-for-a-small-business` vs `ai-tools-small-business` | "What an AI agent can genuinely do…" / "AI Tools for Small Business Websites…" | Partial | **Differentiate.** Agents = phone/chat front desk; tools = broader website AI. |
| `best-web-hosting-small-business` vs `/hosting` | "Best Web Hosting for Small Business in 2026" / "Web Hosting for Small Business from $7.95/mo" | High: same head phrase | **Differentiate.** The article stays comparison/criteria ("how to choose") and links to /hosting with a non-exact anchor. Consider retitling it "How to Choose Web Hosting for a Small Business". |
| `best-wordpress-hosting-2026` vs `/wordpress-hosting` | "Best WordPress Hosting in 2026: How to Compare Providers" / "Managed WordPress Hosting from $7.95/mo" | Medium | **Differentiate.** Already comparison-framed. Keep it, and link to the product page. |
| `managed-hosting-guide` vs `/managed-hosting` | "What Is Managed Hosting? Cost, Benefits…" / "Managed Hosting — we run the server…" | Medium: definition vs service | **Differentiate.** The guide answers "what is", the page sells. The guide already links to /managed-hosting. |
| `free-ssl-setup` vs `ssl-certificate-explained` | "How to Set Up Free SSL with Let's Encrypt" / "SSL Certificates Explained…" | Low | **Keep both** and cross-link. |
| `/domain-name` vs `/register-domain` | "Domain Name Search — Check & Register" / "Register a domain name from $9.95" | Medium | **Differentiate.** Search tool vs registration offer. Don't add "register" to more /domain-name copy. |
