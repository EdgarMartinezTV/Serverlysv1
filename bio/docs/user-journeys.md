# Serverlys Bio — user journeys

Each journey lists the real routes involved. Journeys marked **[e2e]** are
executed end to end by Playwright.

## J1 — First page, from the marketing site to a live URL [e2e: journey.spec.ts]

1. `serverlys.com/bio` → **Create Your Free Bio** → `bio.serverlys.com/signup`
   (or **Use this template** → `/signup?template=<id>`, which skips step 5).
2. Sign up: name, email, password (≥10 chars), terms. Account is created and a
   session starts immediately; a confirmation email is sent.
3. `/verify-email` explains the email; the user may continue to the dashboard
   and build, but can't publish until the link is clicked.
4. Email link → `/verify-email/confirm?token=…` → `/dashboard?verified=1`.
5. **Step 1 — Choose a template**: `/dashboard/new` gallery with category tabs,
   search and a live preview dialog (`/t/<id>` in an iframe). Choosing creates
   the page and redirects.
6. **Step 2 — Customize**: `/editor/<id>?wizard=1` — the full editor with a
   "Step 2 of 3" bar. Profile → name, bio, photo (upload → crop → WebP). Links →
   add/reorder/delete. Appearance → palette, fonts, buttons. Autosaves.
7. **Step 3 — Publish**: "Continue to publish" opens the publish dialog with
   live username availability and suggestions. Publish → live URL, copy, QR
   PNG/SVG download.
8. Visitor opens `bio.serverlys.com/<username>`; view is counted by a
   cookieless beacon, link taps go through `/go/<page>/<block>` and are counted.
9. Owner sees views, clicks, CTR and top links at `/dashboard/analytics`.
10. Owner edits (draft), the live page is unchanged until **Republish**.

## J2 — Returning user edits a page
`/login` → `/dashboard` (overview: 7-day KPIs, pages, setup checklist) →
**Edit** → editor (no wizard bar) → changes autosave → Republish. "Discard
draft changes" (Settings tab) reverts the draft to the live version.

## J3 — Collecting leads [e2e: publishing.spec.ts]
Add **Email signup** or **Contact form** block → set consent text → publish.
Visitor submits (honeypot + min fill time + rate limits) → lead stored with the
consent text → owner emailed (toggle in Settings) → `/dashboard/leads` (filter,
search, mark read, delete, CSV export).

## J4 — Connecting an owned domain [e2e: publishing.spec.ts, DNS simulated]
`/dashboard/domains` → choose page, enter `links.example.com` → shown a TXT
(`_serverlys-bio.<host>`) and a CNAME (`bio.serverlys.com`; A record to the edge
IP for apex domains) → **Check DNS** → VERIFIED → edge issues a certificate
(gated by `/api/tls/ask`) → **Re-check DNS & HTTPS** confirms the domain serves
the page → canonical URL switches to the custom domain. Background re-checks
via `POST /api/cron/domains`. Disconnect stops serving immediately.

## J5 — Renaming a username [e2e: publishing.spec.ts]
Settings tab → Username → availability check → Save. Old URL 308-redirects
for 90 days and can't be claimed by anyone else in that window.

## J6 — Switching template / restoring a design
Appearance → Template → pick → Apply. Content (profile, links, blocks) is kept
and only the design changes, unless "Also replace my content" is on. The
previous draft is saved to Version history; **Restore** brings it back.

## J7 — Visitor reports a page
Public page footer → **Report this page** → `/report/<pageId>` → reason +
optional details/email → admins emailed → `/admin/reports` → resolve
(optionally suspend the page) or dismiss. All admin actions are audited.

## J8 — Account lifecycle
`/dashboard/settings`: change name/email (email change re-verifies), change
password (signs out other devices), list and revoke sessions, download all data
(JSON), delete account (password + typing DELETE; pages go offline, files are
removed). `/forgot-password` → email → `/reset-password?token=…`.

## J9 — Sign in with Serverlys [e2e: sso.spec.ts against a mock provider]
When `SERVERLYS_OIDC_*` is configured, login/signup show **Continue with your
Serverlys account** (OIDC + PKCE). A verified Serverlys email links to an
existing Bio account; otherwise a new verified account is created. No hosting
purchase is involved.

## J10 — Phone-only user [e2e: mobile.spec.ts]
Dashboard navigation is a drawer; the editor switches between **Edit** and
**Preview** tabs; properties stack under the block list; public pages and
dashboard screens have no horizontal overflow at 360–412 px.
