# SEO & Analytics Setup

How analytics, attribution and search-engine verification work on serverlys.com,
what has to be configured outside this repo, and what still has to be built in
WHMCS. Written 2026-10-05.

---

## 1. How it fits together

```
visitor ──► cookie banner ──(Accept analytics)──► components/analytics/analytics.tsx
                                                    ├─ GTM container ──► GA4 (configured in GTM)
                                                    ├─ gtag.js direct   (ONLY if no GTM ID)
                                                    └─ Microsoft Clarity
every event ──► lib/analytics track()  ──sanitize──► dataLayer (GTM) or gtag (fallback) + clarity("event")
WHMCS links ──► lib/analytics/clicks.ts adds utm_* / gclid / gbraid / wbraid / fbclid
```

| File | Role |
|---|---|
| `src/lib/analytics/config.ts` | Resolves IDs from env, decides on/off, builds CSP sources and cookie-panel disclosures. No hardcoded IDs. |
| `src/lib/analytics/index.ts` | `track()` is the only way to send an event. Consent check, PII scrubbing, one transport. |
| `src/lib/analytics/vendors.ts` | Loads GTM / gtag / Clarity once each; shuts them down and deletes cookies on withdrawal. |
| `src/lib/analytics/clicks.ts` | One delegated click listener: phone, email, WhatsApp, contact, plan, checkout, get-started. Adds attribution to WHMCS links. |
| `src/lib/analytics/attribution.ts` | Captures campaign parameters from the landing URL and carries them into WHMCS. |
| `src/components/analytics/analytics.tsx` | Mounted once in the root layout. Page views, Web Vitals, consent reactions. |
| `src/lib/sera/analytics.ts` | Turns a filed Sera request into `generate_lead` + the service-specific lead event. |
| `src/components/domain/domain-search-app.tsx` | Fires `domain_search`. |
| `next.config.ts` | CSP opens only for the vendors the build loads. |

### Rules the code enforces

- **Consent first.** Nothing is requested from Google or Microsoft until the visitor
  accepts *Analytics*. Events before that are dropped, not queued. Rejecting later
  flips consent to denied, sets GA's `ga-disable-<ID>` kill switch, stops routing
  events and deletes `_ga*` / Clarity cookies. The next page load fetches nothing.
- **No duplicates.** GTM and direct gtag.js are mutually exclusive; each script is
  injected once (module flag + DOM check). GTM's `<noscript>` iframe is deliberately
  not rendered: it would load before any consent answer.
- **No personal data.** `sanitize()` drops keys like email/phone/name/address/password/
  card/message, redacts any value that looks like an email or phone number, and
  sends scalars only. Domain search sends the extension and result, never the name.
  Page URLs drop the `domain`, `query`, `email` and `q` parameters.
- **Off in development.** Analytics only runs in a production build whose
  `NEXT_PUBLIC_SITE_URL` is `https://serverlys.com`, unless
  `NEXT_PUBLIC_ANALYTICS_ENABLED=true`.

---

## 2. Environment variables

All are `NEXT_PUBLIC_*`, inlined at **build** time. On Easypanel: add them to the
`serverlys` service environment, then **force a rebuild** — an unchanged commit
skips the build and the old values stay baked in. The Dockerfile declares an
`ARG` for each.

| Variable | Value | Effect when empty |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | `GTM-KRBXM4VV` | No GTM. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-2E9P7H997E` | With GTM: GTM tag must hold the ID itself. Without GTM: no GA. |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | from clarity.microsoft.com → Settings → Overview | No Clarity. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | the `content` value of Search Console's HTML tag | No meta tag. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | the `msvalidate.01` content value | No meta tag. |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | leave empty in production | `true` forces on (local testing), `false` forces off. |

To test locally against the real container:
`NEXT_PUBLIC_ANALYTICS_ENABLED=true NEXT_PUBLIC_GTM_ID=… npm run build && npm start`
— that sends real hits; prefer GTM Preview mode.

---

## 3. Events

Every event below goes to the dataLayer as `{ event: "<name>", ...params }`.

| Event | Fires when | Params | Status |
|---|---|---|---|
| `page_view` | Every route, including client-side navigations, and the current page the moment consent is given | `page_location`, `page_path`, `page_title` | ✅ verified in a production build |
| `domain_search` | A domain search returns results | `search_tld`, `availability`, `result_count`, `source` | ✅ verified |
| `select_hosting_plan` | Click on any `/billing/store/<group>/<plan>` link | `plan_group`, `plan_name`, `link_text`, `link_location` | ✅ verified |
| `begin_checkout` | Same plan click, or any `cart.php?a=add` domain link | `item_category` (`hosting`/`domain`/`domain_transfer`), `plan_group`, `plan_name` | ✅ verified (plan); domain cart links use the same code path |
| `click_get_started` | Link text "Get started", "Start now", "Start a project", or `data-analytics-event="click_get_started"` | `link_text`, `link_location`, `link_path` | ✅ verified |
| `click_contact` | `mailto:`, `/support` (`/contact` redirects there), or a WHMCS sales-ticket CTA | `contact_method` (`email`/`support_page`/`sales_ticket`), `link_location` | ✅ verified (email, sales ticket) |
| `click_phone` | Any `tel:` link | `link_location` | ✅ verified |
| `click_whatsapp` | `wa.me` / `api.whatsapp.com` / `whatsapp:` links | `link_location` | ⚠ wired, but the site has **no WhatsApp link today**, so it cannot fire yet |
| `generate_lead` | Sera files a request successfully (not a duplicate) | `lead_source=sera`, `lead_type` (workflow id) | ⚠ wired, not verified end-to-end — that needs a real filed request |
| `web_development_lead` | …the workflow is WEBSITE_DEVELOPMENT or WEBSITE_MAINTENANCE | same | ⚠ as above |
| `seo_service_lead` | …the workflow is SEO | same | ⚠ as above |
| `ai_agent_lead` | …the workflow is AI_AGENT, CHATBOT or AUTOMATION | same | ⚠ as above |
| `web_vitals` | LCP, INP, CLS, FCP, TTFB for real visitors (CLS ×1000) | `metric_name`, `value`, `metric_rating`, `metric_id`, `page_path` | ✅ verified |
| `sign_up` | — | — | ❌ happens inside WHMCS; see §6 |
| `purchase` | — | — | ❌ happens inside WHMCS; see §6 |

`link_location` is `header`, `footer`, `nav`, `assistant` or `main`.

Debug in the browser console:
`addEventListener("serverlys:analytics", e => console.log(e.detail))` — fires for
every event, consent or not, and never leaves the page.

---

## 4. Google configuration (outside this repo)

### Google Tag Manager — container GTM-KRBXM4VV

1. **Variables → User-Defined → New → Data Layer Variable** for each of:
   `ga_measurement_id`, `page_location`, `page_path`, `page_title`, `link_text`,
   `link_location`, `link_path`, `plan_group`, `plan_name`, `item_category`,
   `contact_method`, `search_tld`, `availability`, `result_count`, `source`,
   `lead_source`, `lead_type`, `metric_name`, `value`, `metric_rating`, `metric_id`.
   Name them `DLV - <key>`.
2. **Tag: Google tag.** Tag ID `G-2E9P7H997E` (or `{{DLV - ga_measurement_id}}`).
   Configuration parameter `send_page_view` = `false` (the site sends its own
   page_view, once per route). Trigger: **Initialization – All Pages**.
3. **Trigger: Custom Event.** Event name, *use regex matching*:
   `^(page_view|domain_search|select_hosting_plan|click_get_started|click_contact|click_phone|click_whatsapp|generate_lead|sign_up|begin_checkout|purchase|web_development_lead|seo_service_lead|ai_agent_lead|web_vitals)$`
4. **Tag: Google Analytics: GA4 Event.** Measurement ID `G-2E9P7H997E`, Event
   name `{{Event}}`, Event parameters: one row per DLV above (parameter name =
   key, value = `{{DLV - key}}`). Trigger: the custom event from step 3.
5. **Admin → Container settings → Consent overview**: on. The site pushes
   `gtag('consent','default', …)` before GTM loads — analytics granted, ads
   denied unless the visitor accepted Marketing.
6. **Preview** with Tag Assistant, accept the banner, click around, then **Submit**
   and publish. Nothing reaches GA4 until the container is published.

⚠ The CSP allows GTM, GA4 and Clarity origins only. A tag added later in GTM that
loads from another origin (Google Ads, Meta pixel, a chat widget) will be
blocked until its origins are added to `analyticsCspSources()` in
`src/lib/analytics/config.ts`. That tag also has to be listed in the cookie
panel (`analyticsDisclosures()` or the `marketing` list in `src/lib/consent`).

### Google Analytics 4 — property with stream G-2E9P7H997E

1. **Data streams → Serverlys → Enhanced measurement → Page views → Show advanced
   settings → turn OFF "Page changes based on browser history events".** The site
   already sends one page_view per route; leaving this on double-counts every
   client-side navigation.
2. **Admin → Events / Key events**: mark `generate_lead`, `begin_checkout`,
   `purchase`, `sign_up`, `web_development_lead`, `seo_service_lead`,
   `ai_agent_lead` as key events once they first appear.
3. **Admin → Custom definitions**: event-scoped dimensions for `plan_name`,
   `plan_group`, `link_location`, `contact_method`, `lead_type`, `item_category`,
   `search_tld`, `availability`, `metric_name`, `metric_rating`; a custom metric
   for `value` if you want Web Vitals averages.
4. **Admin → Data retention**: 14 months.
5. **Admin → Data collection**: leave Google signals off (the site denies ad
   storage and its policy says advertising features are off).
6. **Admin → Product links → Search Console**: link once Search Console is verified.
7. GA's "Test your website" and "tag not detected" checks will keep failing: the
   tag only exists after a visitor accepts. Verify with **Reports → Realtime** or
   GTM Preview instead.

### Google Search Console

1. Add property `https://serverlys.com/` (URL prefix) → **HTML tag** → copy only the
   `content="…"` value into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, rebuild, deploy,
   then click **Verify**. (A Domain property verified by DNS TXT at NameHero also
   works and needs no code.)
2. **Sitemaps** → submit `https://serverlys.com/sitemap.xml`.

### Bing Webmaster Tools

Fastest: **Import from Google Search Console** (no tag needed). Otherwise add the
site → meta tag → `msvalidate.01` content value into
`NEXT_PUBLIC_BING_SITE_VERIFICATION`, rebuild, verify, and submit the same sitemap.

### Microsoft Clarity

1. Create a project for serverlys.com; copy the project ID into
   `NEXT_PUBLIC_CLARITY_PROJECT_ID`.
2. **Settings → Masking → Strict.** Balanced already masks form inputs; Strict also
   masks page text, which keeps anything a visitor types into Sera out of recordings.
3. **Settings → Setup → Cookie consent**: on. The site calls Clarity's
   `consentv2` API after an Accept.
4. Optional: **Settings → Google Analytics integration**.

---

## 5. Campaign attribution into WHMCS

On every navigation the site reads `utm_source`, `utm_medium`, `utm_campaign`,
`utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid` and `fbclid` from the URL.
When a visitor clicks any link into `NEXT_PUBLIC_BILLING_ORIGIN`
(`https://serverlys.com/billing`), the stored values are appended, unless that
link already has them. Verified: landing on
`/cloud-hosting?utm_source=newsletter&gclid=…` and clicking *Choose plan* opened
`/billing/store/cloud-hosting/starter-cloud?utm_source=newsletter&gclid=…`.

- Kept in memory for the tab (survives client-side navigation, no consent needed —
  nothing is stored on the device).
- Copied to `sessionStorage` (`serverlys.attribution`) only with Analytics or
  Marketing consent, so it also survives a reload. Removed on withdrawal.
- The last campaign seen wins, wholesale.

Because WHMCS is served on the **same origin** (`serverlys.com/billing`, proxied by
Easypanel), the `_ga` cookie and the GA4 session continue into WHMCS
automatically. No cross-domain linker is needed. **If billing ever moves to a
subdomain**, add it under GA4 → Data stream → Configure tag settings → Configure
your domains.

---

## 6. What still has to be built in WHMCS

None of this can be done from this repo: WHMCS runs on the cPanel host and its
templates/hooks live there (the theme work is in `~/Desktop/whmcs`). Test every
snippet on a staging copy of WHMCS first. They are starting points, not tested
code.

### 6.1 Load GTM in WHMCS, behind the same consent

Same origin means WHMCS can read the site's consent choice from `localStorage`.
**The key must match `CONSENT_KEY` in `src/lib/consent/index.ts`** (currently
`serverlys.consent.2026-10-05`). Update the hook whenever `CONSENT_VERSION` changes.

`includes/hooks/serverlys_analytics.php`:

```php
<?php
use WHMCS\Database\Capsule;

if (!defined('WHMCS')) die('Access denied');

const SERVERLYS_GTM_ID = 'GTM-KRBXM4VV';
const SERVERLYS_CONSENT_KEY = 'serverlys.consent.2026-10-05';

/** Push any pending events, then load GTM only if analytics was accepted. */
add_hook('ClientAreaHeadOutput', 1, function ($vars) {
    $pending = $_SESSION['serverlys_dl'] ?? [];
    unset($_SESSION['serverlys_dl']);
    $events = json_encode($pending, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    $gtm = SERVERLYS_GTM_ID;
    $key = SERVERLYS_CONSENT_KEY;
    return <<<HTML
<script>
(function () {
  var c = null;
  try { c = JSON.parse(localStorage.getItem("$key") || "null"); } catch (e) {}
  if (!c || c.analytics !== true) return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  var ads = c.marketing === true ? "granted" : "denied";
  gtag("consent", "default", { analytics_storage: "granted", ad_storage: ads, ad_user_data: ads, ad_personalization: ads });
  ($events).forEach(function (e) { dataLayer.push({ ecommerce: null }); dataLayer.push(e); });
  dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  var s = document.createElement("script"); s.async = true;
  s.src = "https://www.googletagmanager.com/gtm.js?id=$gtm";
  document.head.appendChild(s);
})();
</script>
HTML;
});
```

WHMCS pages need their own `page_view`: in GTM, add a **second** GA4 Event tag
`page_view` on a *Page View* trigger limited to `Page Path starts with /billing`,
since the WHMCS pages do not run the site's route tracker.

### 6.2 `sign_up`

```php
add_hook('ClientAdd', 1, function ($vars) {
    // No user id, email or name — just the fact of the sign-up.
    $_SESSION['serverlys_dl'][] = ['event' => 'sign_up', 'method' => 'whmcs'];
});
```

The event is queued in the session and pushed on the next client-area page by the
head hook above.

### 6.3 `purchase`

```php
add_hook('ShoppingCartCheckoutCompletePage', 1, function ($vars) {
    $orderId = (int) ($vars['orderid'] ?? 0);
    if (!$orderId) return '';
    $order = Capsule::table('tblorders')->where('id', $orderId)->first();
    if (!$order) return '';
    $currency = Capsule::table('tblclients')
        ->join('tblcurrencies', 'tblcurrencies.id', '=', 'tblclients.currency')
        ->where('tblclients.id', $order->userid)->value('tblcurrencies.code') ?: 'USD';
    $items = [];
    foreach (Capsule::table('tblhosting')->where('orderid', $orderId)->get() as $h) {
        $name = Capsule::table('tblproducts')->where('id', $h->packageid)->value('name');
        $items[] = ['item_id' => 'pid_' . $h->packageid, 'item_name' => $name,
                    'item_category' => 'hosting', 'price' => (float) $h->firstpaymentamount, 'quantity' => 1];
    }
    foreach (Capsule::table('tbldomains')->where('orderid', $orderId)->get() as $d) {
        $tld = substr($d->domain, strpos($d->domain, '.'));   // extension only — never the name
        $items[] = ['item_id' => 'domain' . $tld, 'item_name' => 'Domain ' . $tld,
                    'item_category' => 'domain', 'price' => (float) $d->firstpaymentamount, 'quantity' => 1];
    }
    $_SESSION['serverlys_dl'][] = ['event' => 'purchase', 'ecommerce' => [
        'transaction_id' => (string) $order->ordernum,
        'value' => (float) $order->amount,
        'currency' => $currency,
        'items' => $items,
    ]];
    return '';
});
```

Because the complete page renders `{$headoutput}` after this hook runs, the push
normally lands on the same page; if it does not, it lands on the next one. In GTM
add a GA4 Event tag `purchase` with **Send Ecommerce data → Data Layer** on a Custom
Event trigger `purchase`.

Caveats to decide on:
- This counts **orders placed**, including unpaid ones (bank transfer, failed card).
  For paid-only revenue, send `purchase` server-side from the `InvoicePaid` hook via
  the GA4 Measurement Protocol instead. That needs the visitor's `client_id`, so
  store the `_ga` cookie value on the order at checkout.
- `transaction_id` deduplicates a reloaded complete page in GA4.

### 6.4 Keep the campaign on the order

GA4 already attributes the purchase through the shared session. To also see the
source **inside WHMCS** (admin order view):

```php
add_hook('ClientAreaPage', 1, function ($vars) {
    $keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid'];
    $found = array_intersect_key($_GET, array_flip($keys));
    if ($found) $_SESSION['serverlys_attribution'] = array_map(fn ($v) => substr((string) $v, 0, 200), $found);
});

add_hook('AfterShoppingCartCheckout', 1, function ($vars) {
    $a = $_SESSION['serverlys_attribution'] ?? null;
    if (!$a || empty($vars['OrderID'])) return;
    $line = 'Attribution: ' . http_build_query($a);
    Capsule::table('tblorders')->where('id', (int) $vars['OrderID'])
        ->update(['notes' => Capsule::raw("CONCAT(COALESCE(notes,''), '\n', " . Capsule::connection()->getPdo()->quote($line) . ")")]);
});
```

`gclid` on the order is also what Google Ads offline conversion import needs, if
you ever run Ads.

---

## 7. SEO status

Already in place before this change (verified by audit):
- `sitemap.xml` (`src/app/sitemap.ts`): every built, indexable route plus every blog article.
- `robots.txt` (`src/app/robots.ts`): disallows `/api/` and noindex routes, lists the sitemap, and blocks everything on non-production origins.
- Canonical URLs from `NEXT_PUBLIC_SITE_URL` (`https://serverlys.com`) via `pageMetadata()`, which also emits Open Graph and Twitter `summary_large_image` metadata with a 1200×630 card per page.
- Organization + WebSite JSON-LD site-wide; BreadcrumbList on every page except the home page; Product (hosting, domains), Service (agency pages), Article, FAQPage, CollectionPage.

Changed in this pass:
- FAQPage `@id` is now per page. All 30 FAQ blocks used to share `https://serverlys.com/#faq`.
- Service schema added to `/shared-hosting`, `/vps-hosting`, `/managed-hosting` and `/dedicated-servers`. These pages had no product schema. They get Service rather than Product because two are "coming soon" and one is quoted: an in-stock offer would be false.
- Domain products are categorised "Domain Registration", not "Web Hosting".
- Removed the non-standard `Host:` line from robots.txt.
- Verification tags ignore empty values. The Dockerfile passes unset args as `""`, which would otherwise emit an empty, failing meta tag.

Not changed, and why:
- **No SearchAction**: the site has no site-search results URL.
- **Core Web Vitals**: lab LCP is already 160–320 ms on the pages tested. Analytics adds nothing before consent and loads async after it. The new `web_vitals` event reports real-visitor numbers so regressions show up in GA4.
