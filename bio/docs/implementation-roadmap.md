# Serverlys Bio — implementation roadmap & checklist

Durable checklist: tick only what is built **and** verified. Continue from the
first unticked item.

## Phase 0 — Research & architecture ✅
- [x] Benchmark audit (`hostinger-functional-audit.md`, `feature-inventory.md`, 142 items, evidence-graded)
- [x] Architecture: separate `bio/` Next.js 16 app (Postgres/Prisma 7) beside the static marketing site; host-based routing for custom domains; multiple root layouts so public pages load only the renderer CSS

## Phase 1 — Foundation ✅
- [x] Prisma schema + migration (users, sessions, tokens, pages draft/published, versions, redirects, styles, templates, assets, analytics, leads, domains, reports, audit, outbound email)
- [x] Page document contract (`lib/bio/schema.ts`, Zod, bounded) + publish validation + URL safety
- [x] Auth: argon2id, DB sessions (hashed tokens, httpOnly/SameSite=Lax), verify email, reset password, logout, change password, sessions, delete account, data export
- [x] Email via Resend or logged to DB; rate limits (memory/Redis); audit log; storage (local/S3); upload pipeline (sniff, re-encode, quota, optional clamd)

## Phase 2 — Rendering & publishing ✅
- [x] Single renderer for public/editor/templates/thumbnails (container queries)
- [x] 30 block types, sections/grouping, schedules, per-block style, 15 fonts, 5 button styles, animations, mobile adjustments
- [x] Public route, custom-domain route, draft preview, template preview, 404s
- [x] Click redirect, view/click beacon, vCard, QR (PNG/SVG + block), OG image, sitemap, robots, ProfilePage JSON-LD
- [x] Username claim/rename/redirect, publish/unpublish/revert, version snapshots

## Phase 3 — Builder ✅
- [x] Onboarding wizard (template → customize → publish)
- [x] Template library (16 templates / 15 categories, seeded to DB) + gallery, filter, search, live preview
- [x] Editor: sidebar sections, live preview (phone/tablet/desktop), properties panel, dnd + keyboard reorder, inline text editing, undo/redo, autosave with conflict detection, image crop, template switch, saved styles, version restore

## Phase 4 — Dashboard ✅
- [x] Overview, My Bio Pages, Create New, Templates, Editor, Analytics (charts, filters, comparison, CSV), Leads (filter, export, notify), Domains, Account Settings, Help
- [x] Report a page; Admin (overview, users, pages, reports, domains, templates, health, audit)

## Phase 5 — Marketing ✅
- [x] `serverlys.com/bio` in the marketing site (hero, live editor demo, live template previews, features, 3 steps, FAQ, CTA) + footer link

## Phase 6 — Quality ✅ (see completion report for the exact run)
- [x] Unit tests (rules), Playwright: journey, security, publishing, admin, mobile, SSO (mock)
- [x] tsc + eslint clean; production build; Docker image

## Next (not built — ordered by value)
1. [ ] Custom-domain TLS at the edge (DEPLOY.md option A or B) — required before advertising custom domains as HTTPS-ready
2. [ ] Password-protected pages (benchmark F033)
3. [ ] Favicon per page (F076) — use the avatar
4. [ ] "Open in new tab" link option (F065)
5. [ ] Built-in checkout (Stripe Connect) — schema already carries price/kind; needs payment provider decision + legal
6. [ ] GA4 / Meta Pixel per page, consent-gated on the visitor side (F114)
7. [ ] Instagram feed block (F045) — needs Meta app review
8. [ ] AI writer / SEO suggestions (F029/F030/F095)
9. [ ] Analytics rollups + retention job; shared Next cache handler for multi-replica
10. [ ] Real WHMCS OIDC client registration and an end-to-end run against it
