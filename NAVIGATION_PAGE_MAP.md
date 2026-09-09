# Serverlys — navigation page map

Generated from `src/data/navigation.ts` and reconciled against `src/data/routes.ts`.
**72 navigation entries → 43 unique internal routes.**

This file is an audit, not a plan. The registry in `src/data/routes.ts` is the
machine-readable source of truth; `resolveNavTarget()` reads it and refuses to
render a link to a route that does not exist.

---

## HEADER

```
Pricing ─────────────────────────────────► /pricing                    ✅

Products ▾
├─ AI and automation
│  ├─ AI agents ─────────────────────────► /ai-agents                  ✅
│  ├─ ConvoAI ───────────────────────────► /convoai                    ✅
│  ├─ CallFlow ──────────────────────────► /callflow-ai                ✅
│  ├─ Automations ───────────────────────► /automations                ✅
│  └─ Daily backups · Auto-scaling · SSL ► /cloud-hosting              ✅
├─ Hosting
│  ├─ All hosting ───────────────────────► /hosting                    ✅
│  ├─ Cloud hosting ─────────────────────► /cloud-hosting              ✅
│  ├─ WordPress hosting ─────────────────► /wordpress-hosting          ✅
│  ├─ Ecommerce hosting ─────────────────► /ecommerce-hosting          ✅
│  ├─ Managed hosting ───────────────────► /managed-hosting            ⬜ BUILD
│  ├─ Shared hosting ────────────────────► /shared-hosting             ⬜ BUILD
│  ├─ VPS hosting ───────────────────────► /vps-hosting                ⬜ BUILD
│  └─ Dedicated servers ─────────────────► /dedicated-servers          ⬜ BUILD
├─ Domains
│  ├─ Domain names ──────────────────────► /domain-name                ✅
│  ├─ Register a domain ─────────────────► /register-domain            ✅
│  ├─ Transfer a domain ─────────────────► /transfer-domain            ⬜ BUILD
│  └─ WHOIS lookup ──────────────────────► /whois-lookup               ⬜ BUILD
├─ Websites and growth
│  ├─ Web design ────────────────────────► /website-design             ✅
│  ├─ Custom development ────────────────► /website-development        ✅
│  ├─ WP migrations ─────────────────────► /wp-migrations              ⬜ BUILD
│  ├─ SEO ───────────────────────────────► /seo                        ✅
│  ├─ Marketing ─────────────────────────► /marketing                  ✅
│  ├─ Site management ───────────────────► /site-management            ⬜ BUILD
│  └─ Social media ──────────────────────► /social-media               ✅
└─ Email ────────────────────────────────► /cloud-hosting              ✅

Solutions ▾
├─ By workload  → /business-solutions ✅ · /wordpress-hosting ✅
│                 /ecommerce-hosting ✅ · /cloud-hosting ✅
└─ By situation → /hosting ✅ · /pricing ✅ · /cloud-hosting ✅

Resources ▾
├─ Learn
│  ├─ All resources ─────────────────────► /resources                  ✅
│  ├─ Blog ──────────────────────────────► /blog                       ✅
│  ├─ Tutorials ─────────────────────────► /tutorials                  ⬜ BUILD
│  ├─ Hosting comparison ────────────────► /hosting-alternatives       ⬜ BUILD
│  └─ FAQ ───────────────────────────────► /faq                        ✅
└─ Support
   ├─ Support ──────────────────────────► /support                     ✅
   ├─ Contact us ───────────────────────► /contact                     ✅
   ├─ Client login ─────────────────────► WHMCS (external)             ✅
   └─ Report abuse ─────────────────────► /report-abuse                ⬜ BUILD
```

Mobile navigation renders the **same** `primaryNav` array — there is no second
menu to keep in sync, so every row above is also a mobile row.

## FOOTER

| Column | Link | Route | Status |
|---|---|---|---|
| Hosting | All hosting | `/hosting` | ✅ |
| Hosting | Cloud / WordPress / Ecommerce | `/cloud-hosting` `/wordpress-hosting` `/ecommerce-hosting` | ✅ |
| Hosting | Managed / Shared / VPS / Dedicated | `/managed-hosting` `/shared-hosting` `/vps-hosting` `/dedicated-servers` | ⬜ BUILD |
| Services | Web design / Custom development | `/website-design` `/website-development` | ✅ |
| Services | SEO / Marketing / Social media | `/seo` `/marketing` `/social-media` | ✅ |
| Services | Site management / WP migrations | `/site-management` `/wp-migrations` | ⬜ BUILD |
| Company | About / Contact / Blog | `/about` `/contact` `/blog` | ✅ |
| Company | Our process | `/our-process` | ⬜ BUILD |
| Company | Case studies · Success stories | — | ⛔ REMOVED — see below |
| Resources | Pricing / Resources / FAQ / Support / Domain names | `/pricing` `/resources` `/faq` `/support` `/domain-name` | ✅ |
| Resources | Tutorials / Hosting comparison / WHOIS / AI tools | `/tutorials` `/hosting-alternatives` `/whois-lookup` `/ai-tools` | ⬜ BUILD |
| Legal | Privacy / Terms / Refund / Legal info / Abuse / Accessibility | six routes | ⬜ BUILD |

---

## Two deliberate exceptions

**1. `/case-studies` and `/success-stories` are removed from the footer, not built.**

Both require named customers, their results, and their permission. Serverlys has
supplied none, and a case-studies page populated with invented clients is the
single most damaging thing that could be put on this site — it is the kind of
claim a prospect verifies. The instruction "do not include links to pages that
don't exist" is satisfied by removing the link. When real, permissioned customer
stories exist, both routes are one page each.

**2. `/chatrep`, `/n8n-automations` and `/domain-name-search` stay redirects.**

None of the three appears anywhere in the navigation, and the brief states the
navigation inventory is the source of truth. Each is an alias for a page that is
already built — `/convoai`, `/automations`, `/register-domain` — so building them
as pages would create three sets of duplicate content competing with their own
canonical URL in search. They 308 to the canonical page, which is a working
destination for anyone following an old link or a campaign URL.

⚠ **`ChatRep` vs `ConvoAI` is still an open naming question.** The live product
at convoai.cloud is ConvoAI; the brief says ChatRep. `/convoai` is canonical
here. If ChatRep is the customer-facing name, the canonical flips — one commit,
but it must be decided before launch because it changes the indexed URL.
