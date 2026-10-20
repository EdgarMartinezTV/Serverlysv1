# Serverlys Bio — QA acceptance criteria

How to run: `npm run test:unit`; with the app running on :3200 (started with
`RATE_LIMIT_DISABLED=1` so repeated sign-ups aren't throttled) run
`npx playwright test`. Set `MARKETING_BASE_URL` (the marketing site's origin)
to include steps 1–2 of the journey; set `SSO_MOCK=1` with
`tests/fixtures/mock-oidc.mjs` running and the app started with the mock OIDC
env (see `tests/e2e/sso.spec.ts`) to include SSO.

Status column reflects the last full run recorded in `docs/completion-report.md`.

| # | Criterion | Verified by |
|---|---|---|
| A1 | A new user can register, verify, choose a template, add a photo and three links, reorder, restyle, save, preview, pick a username, publish, see the page as an anonymous visitor, click a link, see that view+click in analytics, edit, republish and see the change | `journey.spec.ts` (21 steps) |
| A2 | An unverified user can build but not publish | `security.spec.ts` |
| A3 | User B gets 404 for user A's editor, draft preview, draft/publish/settings/versions/stats APIs and can't attach a domain to A's page; B's lead export and leads screen never contain A's leads | `security.spec.ts` |
| A4 | Signed-out API calls return 401; dashboard redirects to login with `next` | `security.spec.ts` |
| A5 | A state-changing request with a foreign Origin is rejected (403) | `security.spec.ts` |
| A6 | `/go/<page>/<block>` never redirects to a visitor-supplied URL | `security.spec.ts` |
| A7 | `javascript:`, private-network and empty URLs block publishing with per-block issues; unsafe URLs never render as `href` | `publishing.spec.ts`, unit |
| A8 | Unpublished and never-published pages return 404 publicly; republish restores | `publishing.spec.ts` |
| A9 | Reserved names refused; taken names refused with suggestions; usernames case-insensitive; renamed username 308-redirects and stays reserved | `publishing.spec.ts`, unit |
| A10 | Hidden, not-yet-started and expired blocks are invisible to visitors and unreachable via `/go` | `publishing.spec.ts` |
| A11 | Contact form stores the lead with consent, notifies the owner, honeypot submissions store nothing, lead appears in dashboard and CSV | `publishing.spec.ts` |
| A12 | Image uploads are re-encoded to WebP and served with `nosniff`; HTML disguised as an image or PDF is rejected | `publishing.spec.ts` |
| A13 | A custom domain serves the page only once VERIFIED, carries the custom canonical, exposes no dashboard routes; the TLS ask endpoint answers only for verified hosts | `publishing.spec.ts` |
| A14 | QR (PNG) and vCard downloads work for published pages | `publishing.spec.ts` |
| A15 | Non-admins can't open `/admin`; admins can suspend (public 404) and restore (public 200) a page, and both are written to the audit log | `admin.spec.ts` |
| A16 | Dashboard, editor, auth screens and public pages have no horizontal overflow on phones; mobile drawer and editor Edit/Preview tabs work | `mobile.spec.ts` |
| A17 | Serverlys SSO creates a verified, linked account and signs the same person back in | `sso.spec.ts` (mock provider) |
| A18 | URL normalisation, embed parsing, username rules, schema limits, publish validation, schedule logic and all 16 templates are valid | `tests/unit/rules.test.ts` |
| A19 | `tsc --noEmit` and `eslint` report no errors; `next build` succeeds | CI commands in DEPLOY.md |

## Not covered by automation (manual QA list)

- Inline text editing in the preview, undo/redo history, template switch +
  version restore, saved styles, gallery/FAQ/testimonial editors, per-device
  visibility in tablet/desktop preview.
- Password reset end to end (logic shares the tested token code path).
- Real DNS verification and certificate issuance for a real domain.
- Real Resend delivery (dev logs emails to `OutboundEmail`).
- Real WHMCS OIDC (only the mock provider is tested).
- Screen-reader pass of the editor (keyboard reorder is tested; ARIA labels
  exist on every control, but no AT run has been recorded).
- Lighthouse / Core Web Vitals on production infrastructure.
