# Serverlys Bio — feature parity matrix

Benchmark: hostinger.com/link-in-bio. Benchmark evidence comes from
`hostinger-functional-audit.md` / `feature-inventory.md` (ids F001–F142):
**C** = confirmed in a fetched page or Hostinger support doc, **U** = marketing
claim / not documented / behind login (never counted as parity).
Test results: e2e = Playwright (`tests/e2e/*.spec.ts`), unit = `tests/unit/rules.test.ts`.
"Pass" means a test asserts it, not that a screen exists.

Context the table can't show: Hostinger's link-in-bio is a template inside its
paid website builder (publishing needs a plan, F002/F003). Serverlys Bio is a
dedicated, free link-in-bio product, so some rows are deliberately *different
shapes* of the same need (username URL vs builder preview domain).

## Core journey

| Feature | Benchmark evidence | Serverlys implementation | Test result |
|---|---|---|---|
| Sign up without a card | C (F002, free to build) | `src/app/(app)/(auth)/signup`, `lib/actions/auth.ts` | Pass — journey.spec step 3 |
| Publishing is free | C: requires paid plan (F002) — we exceed | `lib/server/pages.ts publishPage` (no plan check exists) | Pass — journey.spec 13–14 |
| Email verification | I (account system) | `lib/server/auth.ts issueToken/consumeToken`, `/verify-email/confirm` | Pass — journey.spec 4; security.spec "unverified can't publish" |
| Password reset | I | `forgot-password`, `reset-password`, `resetPasswordAction` | Not e2e-tested (manual: link logged to OutboundEmail) |
| Serverlys SSO | n/a (Hostinger account) | `lib/server/sso.ts`, `/api/auth/sso/*` (OIDC + PKCE) | Pass — sso.spec against a mock OIDC provider; **not tested against real WHMCS** |
| Template selection | C (F010, F013) | `dashboard/new`, `components/dashboard/template-gallery.tsx`, `/t/[id]` live preview | Pass — journey.spec 5 |
| 15+ templates, category filter, search | C: 12 templates (F010), gallery filter (F012) | `lib/bio/templates.ts` (16 templates, 15 categories) | Pass — unit "template library" |
| Switch template keeping content | C: **locked after creation** (F014) — we exceed | `lib/server/pages.ts switchTemplate` | Manual only |
| Restore previous design / version history | C (F027) | `PageVersion` model, `switchTemplate` snapshot, `/api/pages/[id]/versions` | Manual only (admin.spec covers audit, not restore) |
| Reusable saved styles | C global styles (F070–F072) | `SavedStyle`, `/api/styles`, Appearance → Saved styles | Manual only |
| Visual editor: 3 regions | C free-form canvas (F019) | `components/editor/editor-app.tsx` (sidebar / live preview / properties) | Pass — journey.spec 6–11 |
| Drag-and-drop ordering (incl. keyboard) | C (F019) | `panels/blocks-panel.tsx` (dnd-kit pointer + keyboard sensors) | Pass — journey.spec 9 (keyboard reorder) |
| Add / duplicate / hide / delete / restore blocks | C (F020) | `state.ts insertBlock/removeBlock/restoreBlock`, block list + preview toolbar | Delete: pass (journey); others manual |
| Inline text editing | C | `preview.tsx Editable` (contentEditable plaintext) | Manual only |
| Undo / redo | C (F026) | `state.ts reducer` (coalesced history), ⌘Z/⇧⌘Z | Manual only |
| Autosave + manual save | C (F026) | `editor-app.tsx flush` (900 ms debounce, ⌘S, optimistic concurrency) | Pass — journey.spec 11 |
| Draft vs published | C (F080) | `BioPage.draft` / `.published`, `/preview/[id]` | Pass — journey.spec 19–21 |
| Phone / tablet / desktop preview | C separate mobile editor (F024) | `preview.tsx` (container-query renderer, 390/768/1280) | Manual only |
| Per-device visibility | C (F025) | block `style.visibility` + container queries in `bio.css` | Manual only |
| Image upload + crop/reposition | C (F031, F039) | `image-field.tsx` (react-easy-crop) → `lib/server/uploads.ts` (sharp) | Pass — journey.spec 7, publishing.spec uploads |
| Publish / unpublish | C (F080, F081) | `/api/pages/[id]/publish`, `/unpublish` | Pass — publishing.spec |
| Public URL bio.serverlys.com/{username} | U for Hostinger (F083: random preview domain) — we exceed | `(public)/[username]/page.tsx` | Pass |
| Real-time username availability, reserved names | U | `/api/username`, `lib/bio/username.ts` | Pass — publishing.spec, unit |
| Safe redirect after username change | n/a | `UsernameRedirect` (90 days, not claimable) | Pass — publishing.spec |
| Post-publish dialog: copy link, QR | C (F088) | `publish-dialog.tsx` | Pass — journey.spec 14 |

## Blocks and links

| Feature | Benchmark evidence | Serverlys implementation | Test result |
|---|---|---|---|
| Text / heading | C (F037) | `heading`, `text` blocks | Manual |
| Button/link: URL, nofollow | C (F038, F066) | `link` block (`nofollow` → rel="nofollow sponsored") | Pass (link render/click) |
| Link targets: phone, email, WhatsApp, file | C (F060–F064) | `phone`, `email`, `whatsapp`, `file` blocks | vCard + file covered; others manual |
| Open in new tab | C (F065) | Not offered — links open in the same tab by design (in-app browsers) | Gap (deliberate) |
| Image (+link) | C (F039) | `image` block | Pass (render) |
| Gallery | C (F040) | `gallery` (grid / carousel) | Manual |
| Video (YouTube, Vimeo, file) | C (F041) | `youtube`, `video`, `tiktok` blocks | Unit (id parsing) |
| Map | C (F044) | `map` block (embed + directions) | Manual |
| Contact form + inbox | C (F046, F132) | `form` block → `/api/leads` → Leads dashboard | Pass — publishing.spec leads |
| Email subscribe form | C (F047, F130) | `newsletter` block | Covered by same pipeline |
| Social icons, auto-detect from URL | C (F048, F049) | profile socials + `social` block, `lib/bio/social.ts` | Unit |
| Embed code | C (F050) | `embed` block — **allow-listed providers only** (Spotify, SoundCloud, Apple Music, Calendly, Google Forms, Typeform, Bandcamp). Raw HTML refused (stored-XSS risk on our origin) | Unit |
| Running text ticker | C (F052) | `marquee` block | Manual |
| Product sections / add to bag | C (F054, F055) | `product` card (price, compare-at, badge, physical/digital) → external checkout | Manual — **no built-in checkout** |
| Instagram feed | C (F045) | Not built | Gap |
| Site search, shape, sticky bar, logo marquee | C (F042, F051, F053, F057) | Not built (website-builder elements) | Gap |
| Link scheduling | U (F069) — we exceed | `schedule.start/end` on every block | Pass — publishing.spec |
| Link thumbnails / icons / highlight animation | U (F069) | `link.thumbnail`, `link.icon`, `highlight` + theme animation | Manual |
| Section grouping / collapsible groups | — | `section` block | Manual |
| FAQ, testimonial, service card, booking, vCard, QR, divider, spacer, custom section | partly (cards F043) | catalog in `lib/bio/catalog.ts` (30 block types) | vCard + QR pass |

## Appearance

| Feature | Benchmark evidence | Serverlys implementation | Test result |
|---|---|---|---|
| Colour palette presets + custom | C (F070) | `lib/bio/presets.ts`, Appearance panel | Pass — journey.spec 10 |
| Font pairs | C (F071) | `lib/bio/fonts.ts` (15 families, 10 pairs) | Manual |
| Button shape / style / animation | C (F072, F073) | theme.button (5 styles, radius, shadow, 6 animations) | Manual |
| Per-element overrides | C (F074) | block `style` (align, size, weight, colours, radius, width, spacing, animation) | Manual |
| Background solid / gradient / image | C (F017) | theme.background | Manual |
| Mobile-specific adjustments | C (F024) | theme.mobile (font scale, compact) | Manual |
| Custom font upload | C (F075) | Not built | Gap |
| Favicon | C (F076) | Not built | Gap |
| Custom head/body code | C (F077) | Deliberately not offered (security on shared origin) | Gap (deliberate) |
| Password-protected page | C (F033) | Not built | Gap |
| Coming-soon mode | C (F032) | Unpublish covers "not live yet"; no custom placeholder page | Partial |

## Domains, SEO, sharing

| Feature | Benchmark evidence | Serverlys implementation | Test result |
|---|---|---|---|
| Connect own domain | C (F084), via paid plan | `lib/server/domains.ts` (TXT ownership + CNAME/A routing), free | Pass — publishing.spec (verified host served; pending 404; TLS ask) |
| HTTPS for custom domains | C | `/api/tls/ask` gate + HTTPS probe; issuance is the edge's job (DEPLOY.md) | Ask endpoint pass; **certificate issuance not tested** |
| Removal workflow | C (F085) | `DELETE /api/domains/[id]` + cache invalidation | Manual |
| SEO title / description | C (F094) | SEO panel → `lib/server/page-meta.ts` | Pass (canonical on custom domain) |
| OG image (custom + generated) | C (F097) | `seo.image` or `/api/og/[id]` | Manual (verified 200 image/png) |
| noindex | C (F100) | `seo.noindex`, sensitive pages forced noindex | Manual |
| Sitemap | C (F101) | `app/sitemap.ts` | Manual (verified output) |
| Structured data | U (F104) — we exceed | ProfilePage JSON-LD in `public-view.tsx` | Manual |
| `lang` attribute | C (F102) | `settings.language` | Manual |
| QR code download | C (F089) — custom domain only; we don't require one | `/api/qr/[id]` PNG/SVG, QR block | Pass |

## Analytics

| Feature | Benchmark evidence | Serverlys implementation | Test result |
|---|---|---|---|
| Cookieless analytics | C (F105) | `lib/server/analytics.ts` (daily-salted hash, no IP stored) | Pass — journey.spec 17–18 |
| Views over time, total + unique | C (F106) | `lib/server/stats.ts`, `/dashboard/analytics` | Pass |
| Country, device | C (F107, F108) | `country` (edge header only), `device` | Manual |
| Per-link clicks / CTR / top links | U (F112) — we exceed | `/go/[page]/[block]` redirect + beacon for non-http links | Pass — journey.spec 16–18 |
| Traffic sources / referrers | U (F113) — we exceed | `sourceOf()` | Manual |
| Period comparison, date filters | C ranges (F109) | 7/30/90 days + custom range, previous-period deltas | Manual |
| CSV export | — | `/api/analytics/export` (formula-injection safe) | Manual |
| Bot exclusion | — | UA filter + JS-only view beacon + 10s de-dupe | Manual |
| GA / GTM / Meta Pixel integrations | C (F114) | Not built | Gap |

## Commerce and leads

| Feature | Benchmark evidence | Serverlys implementation | Test result |
|---|---|---|---|
| Physical / digital product listings | C (F115, F116) | `product` block (kind physical/digital) | Manual |
| Payments / checkout / discount codes / subscriptions / donations | C (F119–F125) | **Not built.** Products link to the owner's checkout (Shopify, Stripe Payment Links…). Schema keeps `kind`/`price` so a checkout integration can be added without redesign | Gap (stated on marketing page) |
| Booking engine | C (F118) | `booking` block + `service` cards link to external booking tools | Partial |
| Lead storage, export, notifications, consent text | C (F130, F132) | `Lead`, `/dashboard/leads`, CSV, email notify toggle, per-form consent text | Pass — publishing.spec leads |
| Spam protection | — | honeypot, min fill time, rate limits, JSON-only endpoint | Pass (honeypot) |

## Platform

| Feature | Benchmark evidence | Serverlys implementation | Test result |
|---|---|---|---|
| Multiple bio pages per account | C (sites) | no tier limit; 100-page anti-spam safeguard (`MAX_PAGES_PER_USER`), raised on request; duplicate / delete | Manual |
| Admin, abuse reports, audit log | — | `/admin/*` (users, pages, reports, domains, templates, health, audit) | Pass — admin.spec |
| Tenant isolation | — | owner-scoped queries in `lib/server/pages.ts`, `withUser` | Pass — security.spec |
| CSRF | — | Origin check in `withUser`; Server Actions' own check; SameSite=Lax | Pass — security.spec |
| Open-redirect safety | — | `/go` reads destination from published doc only | Pass — security.spec |
| Upload validation | — | magic-byte sniffing, sharp re-encode, quota, optional clamd | Pass — publishing.spec |
| AI writer / AI SEO / AI assistant | C (F029, F030, F095) | Not built | Gap |
| Blog / multi-page site / internal links | C (F035, F036, F059) | Not in scope (single bio page per username) | Gap (by product shape) |
| Free domain for a year | C (F086, paid plans) | Not offered (we don't sell domains inside Bio) | Gap |

## Unverified benchmark items (not counted)

F005, F069, F083, F092, F104, F112, F113 and everything behind Hostinger's
login (the live editor itself) are **unverified** — the audit could only read
support documentation. Where Serverlys Bio implements one of these, the row
says "we exceed" relative to what is documented, not relative to what
Hostinger may actually ship.
