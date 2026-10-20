# Hostinger Link in Bio: functional audit (benchmark for Serverlys Bio)

Captured 2026-10-19. Raw downloads are in `/private/tmp/claude-501/-Users-edgarmartinez/4d2cc0a2-24c0-45b3-9354-e6b0e3bb5c69/scratchpad/hostinger/`. They were fetched with curl as raw SSR HTML and Nuxt `__NUXT_DATA__`, plus a headless-Chrome rendered DOM, and support articles came through the public WordPress REST API at `/support/wp-json/wp/v2/posts`.

Evidence tags:
- **[C]** CONFIRMED. Seen in fetched markup, data or docs, with the URL cited.
- **[I]** INFERRED. A reasoned conclusion from confirmed evidence that was not directly observed.
- **[U]** UNVERIFIED or INACCESSIBLE. Behind login or a Cloudflare challenge, or not documented. Nothing here was observed first-hand.

Short source keys used below:
| Key | URL |
|---|---|
| LP | https://www.hostinger.com/link-in-bio |
| BUN | https://www.hostinger.com/bundles/link-in-bio-custom-domain (`/domain-name-search/link-in-bio-custom-domain` redirects here) |
| TPL | https://www.hostinger.com/templates/website/link-in-bio |
| S-LIB | https://www.hostinger.com/support/12015082-hostinger-ai-builder-manual-mode-link-in-bio-websites/ (WP id 270, modified 2026-10-02) |
| S-USE | https://www.hostinger.com/support/6611782-how-to-use-hostinger-ai-builder-manual-mode/ |
| S-EL | https://www.hostinger.com/support/6435894-hostinger-ai-builder-manual-mode-how-to-add-and-customize-website-elements/ |
| S-LNK | https://www.hostinger.com/support/6454367-hostinger-ai-builder-manual-mode-how-to-add-links/ |
| S-SOC | https://www.hostinger.com/support/6474611-hostinger-ai-builder-manual-mode-how-to-add-social-media-icon-element/ |
| S-HSOC | https://www.hostinger.com/support/10625194-hostinger-ai-builder-manual-mode-how-to-add-social-media-icons-in-your-header/ |
| S-AN | https://www.hostinger.com/support/6816041-hostinger-ai-builder-manual-mode-how-to-check-the-website-s-traffic/ |
| S-QR | https://www.hostinger.com/support/8908627-hostinger-ai-builder-manual-mode-how-to-generate-a-qr-code-of-a-page/ |
| S-PUB | https://www.hostinger.com/support/6475340-hostinger-ai-builder-manual-mode-how-to-publish-a-website/ |
| S-DOM | https://www.hostinger.com/support/8347449-how-to-connect-a-domain-to-hostinger-ai-builder-manual-mode/ |
| S-META | https://www.hostinger.com/support/6466356-hostinger-ai-builder-manual-mode-how-to-add-meta-titles-and-descriptions/ |
| S-KW | https://www.hostinger.com/support/6972483-hostinger-ai-builder-manual-mode-how-to-add-keywords/ |
| S-TPLC | https://www.hostinger.com/support/6494671-hostinger-ai-builder-manual-mode-how-to-choose-a-website-template/ |
| S-CUST | https://www.hostinger.com/support/6475646-hostinger-ai-builder-manual-mode-how-to-customize-a-website-template/ |
| S-STY | https://www.hostinger.com/support/6618106-hostinger-ai-builder-manual-mode-how-to-customize-the-website-s-style/ |
| S-PAGES | https://www.hostinger.com/support/6456705-hostinger-ai-builder-manual-mode-how-to-add-more-pages/ |
| S-NAV | https://www.hostinger.com/support/6435707-hostinger-ai-builder-manual-mode-how-to-manage-the-navigation-menu-of-a-website/ |
| S-PW | https://www.hostinger.com/support/6899183-hostinger-ai-builder-manual-mode-how-to-password-protect-a-page/ |
| S-HIDE | https://www.hostinger.com/support/6721428-hostinger-ai-builder-manual-mode-how-to-hide-elements-and-sections/ |
| S-GEN | https://www.hostinger.com/support/6521387-hostinger-ai-builder-manual-mode-general-website-settings/ |
| S-FAV | https://www.hostinger.com/support/6466373-hostinger-ai-builder-manual-mode-how-to-add-a-favicon/ |
| S-INT | https://www.hostinger.com/support/6463270-hostinger-ai-builder-manual-mode-how-to-add-integrations/ |
| S-CODE | https://www.hostinger.com/support/7987118-hostinger-ai-builder-manual-mode-how-to-add-custom-code-third-party-integrations/ |
| S-SOON | https://www.hostinger.com/support/9745020-hostinger-ai-builder-manual-mode-coming-soon-mode/ |
| S-MOBOFF | https://www.hostinger.com/support/8343692-hostinger-ai-builder-manual-mode-how-to-disable-the-mobile-view/ |
| S-RES | https://www.hostinger.com/support/6491230-hostinger-ai-builder-manual-mode-how-to-resize-elements-and-sections/ |
| S-RUN | https://www.hostinger.com/support/hostinger-ai-builder-how-to-add-a-running-text-element-in-manual-mode/ |
| S-MARQ | https://www.hostinger.com/support/hostinger-ai-builder-manual-mode-how-to-add-a-logo-marquee-section/ |
| S-REACH | https://www.hostinger.com/support/hostinger-reach-how-to-add-a-form-built-with-reach-to-your-ai-builder-manual-mode-site/ |
| S-ECO | https://www.hostinger.com/support/hostinger-ecommerce-what-is-hostinger-ecommerce/ |
| S-SM | https://www.hostinger.com/support/hostinger-ecommerce-how-to-navigate-the-store-manager/ |
| S-PAYL | https://www.hostinger.com/support/hostinger-ecommerce-how-to-create-a-payment-link/ |
| S-QLS | https://www.hostinger.com/support/hostinger-ecommerce-how-to-create-and-manage-a-quick-link-store/ |
| S-DIG | https://www.hostinger.com/support/6538373-hostinger-ecommerce-digital-products/ |
| S-APPT | https://www.hostinger.com/support/6538407-hostinger-ecommerce-how-to-accept-appointments/ |
| S-DON | https://www.hostinger.com/support/6911441-hostinger-ecommerce-how-to-accept-donations/ |

---

## 0. Product framing: the key finding

- **[C]** Hostinger's "Link in Bio" is **not a standalone link-list app**. It is a **one-page website template category ("one-pager") inside Hostinger AI Builder manual mode**, the drag-and-drop website builder formerly called Website Builder and powered by Zyro, whose screenshots come from `cdn.zyrosite.com`. S-LIB opens with: "Link in Bio, also known as one-pager, is a mobile-optimized website that you can create with Hostinger AI Builder manual mode." (S-LIB; template previews point to `builder.hostinger.com/templates/one-pagers?preview=…` in LP)
- **[C]** The schema.org `Service` on LP declares `serviceType: "Website builder"` (LP JSON-LD).
- **[C]** Every editor feature is therefore the general website builder's, with free-form drag-and-drop canvas, sections, elements, pages, store and blog, not a structured "blocks list" editor (S-USE, S-EL).
- **[C]** Its main differentiator against Linktree-style tools, as Hostinger states it, is that the page "scales into a full website" with pages, blog and store in the same editor without losing content (LP "The link that grows with you" section and FAQ; S-LIB FAQ).
- **[C]** It is **paid**. Publishing needs a paid plan. TPL FAQ: you can start building with any template "for free, with no credit card required", but "you'll need to upgrade to a paid plan when you're ready to publish". Plans start at $2.49/mo.
- **[C]** There is also a domain-bundle entry point that sells "a branded link-in-bio page from $1.99/month" when bundled with a domain at checkout (BUN).

Implication for Serverlys Bio: a free, structured, block-based link-in-bio is a different product shape. The benchmark is useful for the *feature surface* (commerce, email capture, analytics, QR, SEO, custom domain), not for editor UX.

---

## 1. Landing page (LP) section hierarchy, in DOM order

`<title>`: "Link in bio tool | Share, sell, and grow with one powerful link" [C]. Meta/JSON-LD description says to create a customizable link-in-bio page that shows products, bookings, socials and content [C]. The root element has `data-qa="link-in-bio-page"` [C].

| # | Section (paraphrased) | Contents observed | Evidence |
|---|---|---|---|
| 0 | Global header | Hostinger logo, mega-menu (Products / Solutions / Resources / Developers / Pricing), locale selector (`locale-selector-trigger`, "EN"), Log in link to `auth.hostinger.com/login`, and after hydration an "Agent" chatbot button (`aria-controls=chatbot-float-box`) plus a mobile "Open menu" button | [C] LP raw + rendered DOM |
| 1 | Hero, H1 "Turn clicks into customers with a link in bio" | Subtext about one custom page linking your sites, socials and content. One CTA "Get started" (`href="#pricing"`). Trust line "30-day money-back guarantee". A collage image of 8 phone-format bio pages. A Trustpilot widget iframe (4–5 star filter) is injected client-side | [C] LP; Trustpilot iframe [C] in rendered DOM only |
| 2 | Pricing, H2 paraphrased "built to scale beyond a bio link" (`id="pricing"`) | Badges for money-back, cancel anytime and 24/7 support. A 3-card plan carousel (Premium, Unlimited, Cloud Startup) rendered twice (mobile and desktop variants), with dots "Go to slide 1–3". Fair Usage Policy link. Note: "All plans are paid upfront…" | [C] LP |
| 3 | Value props, H2 "Turn your passion into profit" | 3 image cards with H3s: brand-building (drag-and-drop editor + own domain), marketing ("built-in SEO, analytics, email capture, and marketing integrations"), selling ("physical products, digital downloads, coaching calls, affiliates, print-on-demand merch"). A slide-dots carousel on mobile | [C] LP |
| 4 | How it works, H2 "Create your link in bio in 3 steps" | Accordion (`role=button`, `aria-expanded`). Step 1 is open by default. 1) choose a template, 2) add links and customize (colors, fonts, images via drag-and-drop), 3) go live (custom domain free, publish instantly). Image on the left. "Get started" CTA links to #pricing | [C] LP |
| 5 | Template showcase, H2 "Choose a link in bio website template…" | "Get started" CTA. A tab strip (`role=tab`) with 6 tabs: Portfolio, Business showcase, Online store, Blog, **Link in bio**, Other (a "Link in bio" label shows the current tab). SSR and rendered DOM contain only the Link in bio panel: 4 thumbnails linking in a new tab to `builder.hostinger.com/templates/one-pagers?preview={leaf,juicy,rush,onepagetemplate1}` | [C] LP; other tabs' content [U] (not in SSR or headless DOM, probably loaded on click [I]) |
| 6 | Growth/scale, H2 "The link that grows with you" | 4 feature blurbs: unlimited scalability (add pages/sections; AI redesign), integrated store ("up to 1000 products, 100+ payment methods", "zero hidden transaction fees"), built-in blog, AI tools suite (copy, visuals, SEO) | [C] LP |
| 7 | Testimonial | One quote card (name, site, photo) about Website Builder ease of use | [C] LP |
| 8 | Closing CTA, H2 "Create your link in bio website" | Short line plus "Get started" (no href in SSR; becomes `#pricing` after hydration) | [C] LP raw vs rendered |
| 9 | FAQ, H2 "Link in bio FAQs" | Accordion of 7 Qs, first open: what a link in bio is; meaning on IG/TikTok/FB; how to add to IG/TikTok/FB (step lists, including the TikTok 1,000-follower requirement); benefits; how to create (3 steps); what you can link to (socials, blogs, stores, portfolios, videos, booking forms, newsletter sign-ups, affiliate products); how it differs from Linktree (full builder, scale to website, monetize via products/bookings/donations/email list) | [C] LP |
| 10 | Footer | Product link columns, socials, legal, payment logos, "Prices are listed without VAT" | [C] LP |
| 11 | Cookie banner | Accept all / Reject all / Cookie settings | [C] LP |

### 1a. Landing interaction matrix

| Control | Result | Evidence |
|---|---|---|
| Hero "Get started" | Jumps to the pricing section (`#pricing`) | [C] LP href |
| 3-steps "Get started", templates "Get started", closing "Get started" | Jump to `#pricing` (the closing one only after hydration) | [C] LP raw / rendered |
| Pricing "Choose plan" (×3 desktop, ×3 mobile; data-qa `…add-to-cart-button-hosting:hostinger_premium / unlimited / cloud_economy`) | Adds that hosting plan to the cart and goes to checkout. The anchor has no href; the behaviour is JS | [C] data-qa; destination [I] |
| Pricing carousel dots "Go to slide 1/2/3" | Moves the plan carousel (mobile layout) | [C] markup; behaviour [I] |
| Value-prop carousel dots ×3 | Moves the 3-card carousel (mobile) | [C] markup; [I] |
| 3-steps accordion headers (`aria-controls v-0-1..3`) | Expands one step's text and probably swaps the step image. Step 1 is expanded by default | [C] aria-expanded; image swap [I] |
| Template tabs (6) | Switch the template grid category | [C] role=tab; content of non-default tabs [U] |
| Template thumbnail (4) | Opens the template live preview in a new tab on builder.hostinger.com | [C] href/target. The preview itself is [U]: the Cloudflare challenge blocked curl (403) and headless Chrome |
| FAQ accordion (7) | Expand/collapse; first item open | [C] |
| Locale selector, Log in, Agent chatbot, mega-menu, cookie buttons | Site chrome (locale switch, auth.hostinger.com login, AI support chat, nav, consent) | [C] |
| Trustpilot widget | Third-party review badge | [C] rendered DOM |

### 1b. Responsive behaviour (from CSS)
- **[C]** Inline CSS breakpoints are mobile-first: `width>=768px` (68 rules), `width>=1025px` (71), `width>=1140px` (20), plus `width<=767px` (15) and `width<=1140px` (13). There are also 7 `prefers-reduced-motion: reduce` rules (LP raw HTML).
- **[C]** The pricing table is rendered as two DOM variants (`carousel-pricing-table-mobile-…` and `carousel-pricing-table-…`), so the layout is swapped by breakpoint, not reflowed (LP).
- **[I]** Below 768px the value-prop cards and pricing become swipeable carousels with dot navigation. Desktop shows grids.
- **[C]** Template thumbnails and the hero collage show bio pages as phone-width (about 9:16) cards. On desktop, the template screenshots show the page as a centred narrow column over a full-bleed background (TPL screenshots `leaf.png`, `juicy.png`).

---

## 2. Templates

- **[C]** LP Link-in-bio tab shows 4: **Leaf, Juicy, Rush, Summer** (`onepagetemplate1`).
- **[C]** TPL (`/templates/website/link-in-bio`) lists **12 link-in-bio templates** (2 Agentic + 10 Manual):
  - Link in bio (music): *Agentic*
  - Thompson (content creator): *Agentic*
  - Aura Link: Manual
  - Have Fun (link in bio): Manual
  - Higgins (link in bio): Manual
  - Juicy: Manual
  - Leaf: Manual
  - Maria (link in bio): Manual
  - Ramus: Manual
  - Ribot: Manual
  - Rush: Manual
  - Summer: Manual
  - Each card has a "Preview" button (`data-qa=media-card-button`) and a mode tag (Agentic/Manual).
- **[C]** Two editing modes per template (TPL FAQ):
  - **Manual**: drag-and-drop editor plus AI Writer.
  - **Agentic**: a "vibe coding" mode where you describe font and colour changes to an AI agent and get full code access.
- **[C]** TPL page has a template search box (`templates-input-search`) and a category filter. Link in bio sits under "Collections" next to Blank, Coming soon, Landing page, Popular, Modern and Simple. About 90 site-wide category routes exist (TPL / NUXT route list).
- **[C]** Visual anatomy shared by observed templates (thumbnails `cdn.zyrosite.com/cdn-builder-prod-screenshots/*.png` and LP hero collage):
  - an avatar or hero image, sometimes an organic blob mask
  - a name/headline
  - a short bio paragraph
  - a row of social icons
  - a divider
  - a vertical stack of full-width link buttons. Styles seen: outlined pill, solid rectangle, dark pill, underlined text links with ornaments.
  - Optional pieces: an email subscribe field + button, and a large photo block.
  - Background types seen: flat colour, full-bleed photo.
- **[C]** The template choice is **fixed after site creation**. Changing it means recreating the site and moving the domain (S-TPLC).
- **[C]** Template categories are only for browsing. All templates share the same tools (S-TPLC).

---

## 3. Creation journey (from docs, as documented and not observed)

1. **[C]** Purchase or have a hosting plan that includes AI Builder. Building is free; publishing needs a plan (TPL FAQ). A free trial path exists: "Create with AI website builder" goes to `auth.hostinger.com/register?redirectUrl=…hpanel.hostinger.com/ai-builder-trial…` (TPL).
2. **[C]** Log in, go to hPanel → **Websites**, then **Create website → AI Builder** (S-LIB, S-TPLC).
3. **[C]** Choose **Manual** (S-LIB).
4. **[C]** Either browse **Pre-made templates** and pick one from the "Link in Bio" category, or **write a prompt** so the AI generates the page (S-LIB, S-TPLC). Hover a template, then **Preview**, then **Use template** (S-TPLC).
5. **[C]** Optionally **Connect domain** from the top-right during setup: enter the domain, confirm, click Next. Otherwise the site gets an auto **preview domain** like `random-word-ID.builder-preview.com` (S-DOM).
6. **[C]** In the editor, add content: social links, products, content links (blog/video/podcast) and contact info (S-LIB step 2).
7. **[C]** Click **Publish** (top right). Until the first publish, the site is a private draft, and visiting it may give a 404 or SSL error (S-PUB).
8. **[C]** The publish confirmation dialog offers: **View site**, **View on mobile** (QR to open on a phone), **Social icons** (create share posts), **Link** (copy URL), and **QR code** (customise + download) (S-PUB).
9. **[C]** Paste the URL into IG/TikTok/FB bios. The LP FAQ gives per-platform steps (LP, S-LIB).
10. **[C]** Later edits are applied with the same button, which re-publishes (S-PUB). An "unpublish" article exists (linked from S-PUB) [C link, content not fetched].

Alternative journey **[C]**, from BUN: search a domain, add the link-in-bio tool at domain checkout ("from $1.99/month"), Hostinger auto-connects domain + page, then add links and share. The post-purchase UI is **[U]**.

**[U]** The actual editor, onboarding screens, the hPanel Websites list, the AI prompt generator and checkout were not observed (login required; builder.hostinger.com is behind a Cloudflare challenge).

---

## 4. Editor features (AI Builder manual mode, docs-only; the editor UI was not observed)

Layout and chrome **[C S-USE]**:
- Left toolbar: **Elements**, **Pages** ("Pages and navigation"), **Styles**, **Blog**, **Store**, **AI tools**, **SEO**, **More…** (languages, integrations, form submissions, media library). Website settings sit at bottom-left.
- Top toolbar: undo/redo, Save (most changes auto-save), Preview, Publish, and a mobile/desktop toggle (phone icon).
- An editor **dark theme** toggle (the canvas stays light) [C S-USE].

Canvas and editing model:
- **[C]** Free-form drag-and-drop of elements into sections. Click an element to insert it into the selected section. Corner handles resize elements; a section has a bottom drag handle for height (S-EL, S-RES).
- **[C]** Per element: Edit, Duplicate, visibility (eye icon), Delete, resize. Layering is supported for overlapping elements (S-SOC, S-CUST, S-EL).
- **[C]** Copy-paste elements and sections across sections and pages. Duplicate pages, sections and elements (S-CUST).
- **[C]** Add sections from a section library ("Add section"), including AI-generated sections and pages (S-MARQ links to the "generate pages and sections" article).
- **[C]** Unlimited pages, sections and elements (S-CUST FAQ, S-PAGES).
- **[C]** Hide an element or section separately on desktop or mobile. You can duplicate one and show different versions per device. Footer, store and blog sections can't be hidden (S-HIDE).
- **[C]** Separate **mobile editor**:
  - Mobile element order starts as the desktop insertion order. After that it is independent: reordering on desktop doesn't carry over.
  - Font size, alignment and line height can differ per device.
  - Mobile auto-positioning switches off after any manual mobile edit.
  - Sources: S-USE, S-CUST, and the search snippet of the 6475658 mobile article (that article's REST fetch failed).
- **[C]** Option to disable mobile view by pasting a viewport meta into custom code (S-MOBOFF).
- **[C]** Version history and backups exist. S-USE links "create and restore website backups", and the AI assistant can open "version history" (S-USE). The details are [U].
- **[C]** AI tools: AI Logo Maker, AI Writer, AI Blog Generator, AI Image Generator, and an **in-editor AI assistant chat**. The assistant can update SEO metadata, answer traffic questions, and render navigation buttons to settings (S-USE).
- **[C]** Media library and file uploads (S-USE).
- **[C]** Coming Soon mode:
  - a toggle under Pages
  - redirects every URL to a customizable Coming Soon page (default: text + social icons)
  - sets nofollow/noindex while active
  - Source: S-SOON.
- **[C]** Password-protect any page:
  - each page can have its own password and login-area design/text
  - hashed with SHA-256
  - preview mode bypasses the password
  - Source: S-PW.
- **[C]** Multiple languages ("additional languages" under More) (S-USE). The details are [U].

---

## 5. Block / content types (elements and sections)

**[C S-EL]** states "15 website elements". The documented list:
1. **Text**, with a shimmering text effect option.
2. **Running text**, an infinite scrolling ticker. Settings: text, text colour, background colour, font, size, animations [C S-RUN].
3. **Button**:
   - General tab: text, link target, open in new tab, nofollow.
   - Style tab: fill and text colour (normal + hover), font, size, border radius/shape [C S-CUST].
4. **"Add to bag" button**, linked to a store product.
5. **Image**, from a free image library or upload. Click action can open a link [C S-LNK].
6. **Gallery**.
7. **Video**: YouTube, Vimeo, Facebook video, or local upload.
8. **Shape**.
9. **Card**, a styled container with border, solid/gradient fill, preset or custom shadow.
10. **Map**.
11. **Instagram feed**.
12. **Contact form**. Submissions are listed under Form submissions [C S-USE].
13. **Subscription form**, which collects emails into a mailing list.
14. **Social icons**:
    - Paste a profile URL and the icon is auto-detected (e.g. LinkedIn).
    - An email address gives a mail icon. A bare digits number gives a phone icon.
    - An unknown domain falls back to a generic link icon.
    - Settings: add/remove, icon size, colour, layout.
    - Default suggestions are Twitter, Facebook and Instagram.
    - Sources: [C S-SOC, S-LNK].
15. **Embed code**, for third-party widgets in the body (calendars, countdowns, pop-ups) [C S-CODE].
16. **Search**, across products, blog and content.
- Also: **Reach form** element, an email-marketing form from Hostinger Reach [C S-REACH].
- Note: the count is 16+ in the list against "15" in the prose. The discrepancy is in Hostinger's doc.

**Link targets**, available for nav items, text, images and buttons [C S-LNK]:
- Web address (URL), existing Page, **File download** (upload), **Section anchor**, **Phone number**, **Email address**, **WhatsApp** number.
- Options: open in new tab; nofollow for buttons [C S-CUST]. Nav link labels may include emojis [C S-LNK].

**Sections** [C]:
- header (logo, nav, optional social icons via the "Show social icons" toggle [S-HSOC])
- footer
- regular sections
- **Logo marquee**. Settings: background, speed, logo size, spacing, grayscale, reverse direction, logo list [S-MARQ].
- product sections (single product / list) [S-DIG, S-DON]
- blog sections
- sticky bar (an article is linked from S-USE)
- full-width sections (linked from S-TPLC)

**Content that S-LIB says a bio page holds** [C]: social media links, products, content links (blog posts, videos, podcasts), contact information, and email capture forms.

---

## 6. Customization

- **[C]** Global **Styles** panel (S-STY, S-USE):
  - **Colors**: choose a palette or create your own.
  - **Text**: pick a font *pair* (headings + paragraphs/nav) and style H1–H6, paragraph and nav-link presets. Changing a preset affects every element using it.
  - **Buttons**: global shape.
  - **Animations**: global animation style.
- **[C]** Local overrides per element and per section (S-STY).
- **[C]** **Custom font upload** (S-CUST links "How to upload a custom font").
- **[C]** Logo and logo width. Header styling and spacing (S-RES).
- **[C]** Favicon: PNG/JPG/JPEG, 32×32 recommended (S-FAV).
- **[C]** Custom code in `<head>` (Integrations → Custom code) and `<body>` (Embed element) (S-CODE).
- **[C]** Option to disable copying or selecting site content (linked from S-EL).
- **[I]** Template backgrounds support solid colour and full-bleed image, based on the template screenshots.

---

## 7. Analytics

- **[C]** Built-in analytics:
  - Opened in the editor from the ellipsis menu (top-left) → **Analytics**.
  - Needs a published site. First data shows about 1 h after publishing, then refreshes **every 24 h**.
  - Metrics:
    - sessions over time
    - sessions by country
    - sessions by device (desktop vs mobile)
    - ranges of last 3, 7 or 30 days
    - total sessions (including bots) and **unique visitors**
  - Source: S-AN.
- **[C]** Cookieless: data is collected via the Cloudflare CDN, with no cookies and no third parties. Hostinger says it needs no consent or privacy-policy mention (S-AN).
- **[C]** hPanel dashboard → site → **Dashboard** shows a summary: sessions by country and device, a filter for 1/7/30 days, and ecommerce totals (sales, orders, AOV for the current month) (S-AN).
- **[C]** The AI assistant answers traffic questions in chat: totals, busiest days, device split, top countries (S-AN).
- **[C]** Integrations for deeper tracking (S-INT): Google Analytics, Google Tag Manager, Google Tag (Ads), Meta Pixel, Hotjar.
- **Conflict, so treat as [U]:** S-LIB and LP claim "click-through rates", "see which links perform best" and "traffic sources". The analytics feature doc (S-AN) lists **no per-link click metrics and no referrer/source breakdown**. Per-link click tracking is **not documented as a built-in feature**; it is marketing-claimed only.
- **[C]** Separately, Ecommerce Store Manager analytics has Sales and Traffic tabs with filters for date, channel, country and device (S-SM).

---

## 8. Domain / subdomain behaviour

- **[C]** Default: an auto-generated **preview domain** `random-word-ID.builder-preview.com` (S-DOM). S-LIB calls this "a free Hostinger subdomain".
- **[C]** Custom domain:
  - Any registrar is supported.
  - Hostinger-registered domains get DNS records automatically.
  - External domains must be pointed at Hostinger nameservers, with up to 24 h propagation. A-record pointing for manual mode is being deprecated (WP id 10515, title only).
  - You must **publish after connecting**.
  - "Change domain" is available in the site's ellipsis menu.
  - A Connect-domain button shows next to the site in Websites for one week.
  - Sources: S-DOM, S-PUB.
- **[C]** Domain is free for the first year on annual plans (S-LIB; LP plan cards: "Custom domain - free for 1 year").
- **[C]** WWW-prefix toggle in General settings (S-GEN).
- **[C]** BUN: domain-first bundle in which Hostinger connects the domain and bio page automatically, with "no manual configuration" (BUN FAQ).
- **[I]** There is no `hostinger.bio/username`-style handle namespace for builder sites. The free URL is the random preview domain. Contrast: Ecommerce **Quick link store** has a user-chosen globally-unique handle (2–63 chars, `[a-z0-9-]`, no leading/trailing hyphen; changes take effect instantly; the old handle is released immediately) (S-QLS). That is a separate product, not the bio page.

---

## 9. SEO

All [C] unless noted:
- SEO panel per page: **SEO title** (60-char recommendation), **meta description** (160 recommended), and keywords. The **AI SEO Assistant** generates the description and suggests keywords; you pick 3 (S-META, S-KW).
- Site title / brand name is set in SEO → Website Overview (S-META).
- **Social/preview image (OG)**, per page and site-wide (S-PAGES, S-GEN).
- Image alt text, heading tags, editable page URL slug, a **noindex** per page, dofollow/nofollow links, an auto **sitemap**, and a `lang` attribute (S-USE).
- Blog post titles and descriptions become meta automatically. Products have their own SEO settings (S-META).
- Coming Soon mode forces noindex/nofollow (S-SOON).
- Hidden-from-nav pages stay public and indexable unless noindex is set (S-NAV).
- Docs exist for Search Console verification (custom code) and index requests (S-INT, S-META).
- **[U]** Whether structured data (JSON-LD) is emitted on published bio pages was not checked; no live published sample was found.

---

## 10. QR codes

- **[C]** QR codes are generated **per page**: Pages panel → page "…" → **Create QR code**. You customise it, then **Download**. It also exists in product page and blog post settings (S-QR).
- **[C]** It **requires a published site on a custom (non-preview) domain** (S-QR).
- **[C]** You **cannot embed a logo** in the QR ("in their plans") (S-QR).
- **[C]** The publish dialog has "View on mobile" (a QR to open the site) and a "QR code" shortcut (S-PUB).
- **[U]** The exact customisation options (colours, frame, format: PNG or SVG) are not documented in text.
- **[C]** Ecommerce Payment Links also have "Show QR code" with copy, download and print (S-PAYL).

---

## 11. Commerce / payments / monetization

Through Hostinger Ecommerce (Store panel in builder; Store Manager in hPanel):
- **[C]** Product types: physical, **digital**, services, **appointments**, **donations**, print-on-demand via Printful, subscriptions, and gift cards (S-CUST, S-ECO, S-SM, S-DON, S-APPT, WP 455 title).
- **[C]** Digital products:
  - up to **10 files / 100 MB per product**, or an external link (Drive, OneDrive, Dropbox, Box, pCloud, Sync, Tresorit, Proton, IDrive, YouTube)
  - a secure download link is emailed after purchase
  - a whitelist of file types, scanned by Cloudflare
  - minimum price **1 USD**; no pay-what-you-want and no zero price
  - Source: S-DIG.
- **[C]** Donations:
  - a donation product type with **suggested amounts** and/or **custom amount** (required min, optional max)
  - displayed on the page through product sections
  - Source: S-DON.
- **[C]** Appointments:
  - global and per-product availability
  - a minimum duration of 15 min
  - buffers, minimum notice and a booking window
  - flexible slot interval
  - Google Calendar sync
  - free or paid
  - customer reschedule/cancel toggles
  - timezone conversion for the customer
  - Source: S-APPT, S-SM.
- **[C]** LP: up to **1000 products**, **100+ payment methods**, and "zero hidden transaction fees". Also S-LIB: "Zero transaction fees".
- **[C]** Express checkout (Stripe wallets: Google Pay and saved cards), discount codes, and order management with CSV export (S-QLS, S-SM).
- **[C]** **Payment Links** sell without a storefront. The URL is `checkout.hostinger.com/l/{slug}`, prefilled with the product, variant and quantity. Options: active toggle, discount codes, company logo. Share by copy or QR. Appointment products and products with required custom fields are not supported (S-PAYL).
- **[C]** Plan/packaging caveat: "New Unlimited or Cloud hosting subscriptions **no longer include Ecommerce**". Ecommerce is now a **standalone subscription**, one plan per store (S-ECO). This contradicts the LP plan cards, which still list "Ecommerce available" for Unlimited/Cloud. The docs (modified 2026-10-13) are newer.
- **[C]** Affiliate links are marketed as sellable (LP). **[I]** These are just outbound link buttons, with no affiliate tooling.
- **[C]** Ads monetization integrations: Google AdSense and AdMob (S-INT).

## 12. Email capture / marketing
- **[C]** Subscription form element with submissions in website settings (S-EL, S-USE).
- **[C]** Hostinger Reach (email marketing) integration and Reach form element. Ecommerce has an email marketing dashboard with abandoned-cart and purchase triggers (S-INT, S-REACH, S-SM).
- **[C]** LP Unlimited/Cloud cards list "Email marketing with Reach".

## 13. Integrations (built-in list) [C S-INT]
Custom Code (head), Google Analytics, Hotjar, Meta Pixel, Google Tag Manager, **WhatsApp** (chat widget), Google AdSense, Google AdMob, Shippo, Printful, Hostinger Reach, Google Tag. Also Pinterest (S-SOC). Recommended third-party embeds include Calendly, Tidio, Tawk.to, SoundCloud, Jotform, Elfsight and others (S-CODE).

## 14. Privacy / compliance features [C]
- Optional **cookie banner** (General settings) (S-GEN).
- Cookieless built-in analytics (S-AN).
- Password pages with SHA-256 (S-PW).

---

## 15. Limits and pricing (as captured 2026-10-19, US, prices without VAT)

| Item | Value | Evidence |
|---|---|---|
| Free tier | **None for publishing.** Building and previewing are free with no card; publishing needs a paid plan | [C] TPL FAQ |
| Premium | $2.49/mo intro (48-mo term, $119.52 upfront; regular $12.19/mo shown struck through), renews at $10.99/mo. Up to 3 websites, 2 mailboxes/site free 1 yr, custom domain free 1 yr, 250 AI credits one-time | [C] LP |
| Unlimited | $3.49/mo intro (48 mo, $167.52), renews $16.99/mo. Unlimited sites, 500 AI credits, "Ecommerce available", Reach email marketing | [C] LP |
| Cloud Startup | $7.99/mo intro (48 mo, $383.52), renews $25.99/mo. 1000 AI credits | [C] LP |
| Link-in-bio + domain bundle | "from $1.99/month" | [C] BUN; what that tier includes or excludes is [U] |
| Refund | 30-day money-back | [C] LP |
| Pages/sections/elements | Unlimited | [C] S-CUST |
| Products | "up to 1000" | [C] LP |
| Digital file | 10 files / 100 MB per product | [C] S-DIG |
| Min product price | 1 USD | [C] S-DIG, S-APPT |
| Analytics freshness | ~1 h first data, then 24 h refresh; max range 30 days | [C] S-AN |
| Meta title / description | Recommended 60 / 160 chars | [C] S-META |
| Favicon | PNG/JPG, 32×32 recommended | [C] S-FAV |
| Template | Locked after creation | [C] S-TPLC |
| Ecommerce | Single currency, single language | [C] S-ECO, S-DIG |

---

## 16. Inaccessible / unverified (do not build requirements from these as "observed")

- **[U]** The authenticated editor UI (builder.hostinger.com) and hPanel Websites flow: login required. Everything in §3–§6 comes from **support docs**, not observation.
- **[U]** Template live previews (`builder.hostinger.com/templates/one-pagers?preview=…`): Cloudflare challenge (curl 403; headless Chrome stuck on "Performing security verification").
- **[U]** Content of the 5 non-default template tabs on LP.
- **[U]** The AI prompt-to-page generator's inputs and outputs for link-in-bio.
- **[U]** The "$1.99/mo" bundle product's exact scope and editor (same builder or a lighter tool) and its post-checkout setup.
- **[U]** Per-link click analytics and traffic-source reporting (marketing claim only; see §7).
- **[U]** QR customisation options and export formats.
- **[U]** Published bio-page markup: SEO tags, JSON-LD, performance, "Made with Hostinger" badge. No public sample URL was obtained.
- **[U]** Mobile-editor article 6475658 (REST slug lookup returned empty). Its claims come from the web-search snippet and S-USE/S-CUST.
- **[U]** Scheduling of links, link thumbnails/icons per button, link reordering UX, link "spotlight"/animation per link, and sensitive-content gates. None of these is documented for Hostinger; they are not Hostinger features as far as the evidence shows.
