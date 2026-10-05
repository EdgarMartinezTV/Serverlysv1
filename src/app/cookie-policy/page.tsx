import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { publicEnv } from "@/lib/env";
import { analyticsDisclosures } from "@/lib/analytics/config";

const ANALYTICS_ITEMS = analyticsDisclosures(publicEnv.analytics);

/**
 * Cookie policy.
 *
 * Promoted out of the privacy policy's "Cookies and this website" section into
 * a document of its own, because that is where regulators, cookie banners and
 * readers all expect to find it. The privacy policy keeps its section; this
 * page is the detail, and the two must not drift apart.
 *
 * ⚠ DESCRIBES WHAT THE SITE ACTUALLY SETS. The consent implementation in
 * components/consent/ stores a preference and nothing else by default, and the
 * site ships no advertising cookie, and an analytics cookie only when a GA4 ID
 * resolves (lib/analytics/config.ts — off unless the build sets its IDs). Do not add
 * a vendor to this page speculatively, and do not ship a tracker without
 * adding it here.
 */

const PATH = "/cookie-policy";

export const metadata = pageMetadata({
  title: "Cookie Policy | Serverlys",
  description:
    "What Serverlys stores in your browser, which cookies are strictly necessary, what we do not set, and how to change your choice at any time.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "what",
    heading: "What a cookie is here",
    blocks: [
      {
        type: "p",
        text: "A cookie is a small piece of data a site asks your browser to keep and send back on the next request. The same goes for local storage and similar browser storage, and this policy covers all of it — the mechanism matters less than what it is used for.",
      },
      {
        type: "p",
        text: "This policy covers serverlys.com. Our billing area runs on separate software under the same domain and sets its own session cookies, described below.",
      },
    ],
  },
  {
    id: "necessary",
    heading: "Strictly necessary — always on",
    blocks: [
      {
        type: "p",
        text: "These make the site work at all. They cannot be switched off from the site, because switching them off would break the thing you came to do.",
      },
      {
        type: "ul",
        items: [
          "Your cookie choice itself. Remembering that you accepted or rejected is the only way to stop asking you on every page.",
          "Notice and banner state — so a notice you dismissed stays dismissed.",
          "Your domain shortlist, which is held in your own browser so that names you saved survive a page reload. It is not sent to us as a profile.",
          "Billing and account session cookies, set when you sign in to the billing area. These identify your session so that you stay signed in, and are required for checkout to function.",
          "Security and abuse-prevention cookies used to protect forms and logins from automated attack.",
        ],
      },
      {
        type: "note",
        text: "Strictly necessary cookies do not require consent under the ePrivacy rules, which is why they are set before you answer the banner. They are also the only ones set before you answer it.",
      },
    ],
  },
  {
    id: "optional",
    heading: "Analytics and marketing",
    blocks: [
      {
        type: "p",
        text: "If analytics is enabled on the site, it is loaded only after you accept, and rejecting means it is never loaded at all — not loaded-and-told-not-to-record. If you accepted and change your mind, rejecting stops future collection.",
      },
      ...(ANALYTICS_ITEMS.length
        ? [
            {
              type: "p" as const,
              text: "Once you accept analytics, these are loaded. They record which pages you view, what you click, how you arrived and your general location — never your name, email, phone number, password or billing details. Google's advertising features are switched off. Rejecting later stops collection immediately and deletes their cookies on this site.",
            },
            { type: "ul" as const, items: ANALYTICS_ITEMS },
          ]
        : []),
      {
        type: "p",
        text: "We do not set advertising cookies, we do not run cross-site tracking pixels, and we do not sell or share browsing data with advertising networks. If that ever changes, this page changes first and the banner will ask again.",
      },
    ],
  },
  {
    id: "third-party",
    heading: "Third parties",
    blocks: [
      {
        type: "p",
        text: "Some pages embed content served by other companies — a video, a map, a payment form. Those providers can set their own cookies when their content loads, under their own policies rather than ours.",
      },
      {
        type: "p",
        text: "Payment pages are the main case. Card details are entered directly with the payment processor and are never stored on our systems, and the processor sets what it needs to complete and secure the transaction.",
      },
    ],
  },
  {
    id: "control",
    heading: "Changing your choice",
    blocks: [
      {
        type: "p",
        text: "Use the “Cookie settings” link in the footer of any page. It reopens the same panel you saw the first time, and your new answer takes effect immediately.",
      },
      {
        type: "p",
        text: "You can also clear or block cookies in your browser settings. Blocking the strictly necessary ones will break sign-in and checkout — that is a limitation of how the web works, not a choice we made.",
      },
      {
        type: "note",
        text: "Clearing your cookies also clears the record of your choice, so the banner will ask again on your next visit. There is no way around that: the only place the answer can be remembered is the storage you just cleared.",
      },
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    blocks: [
      {
        type: "p",
        text: "If we add a category of cookie that needs consent, we will update this page and ask again rather than relying on an answer you gave about something else. The effective date above tells you when the current version took effect.",
      },
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <LegalPage
        title="Cookie Policy"
        intro="What we store in your browser, what we deliberately do not, and how to change your mind at any time."
        path={PATH}
        sections={SECTIONS}
        trail={[{ name: "Home", href: "/" }, { name: "Cookie policy" }]}
        contact="Questions about what this site stores, or a request about your data? The privacy policy sets out your rights and how to exercise them."
      />
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Cookie policy", path: PATH },
        ]}
      />
    </>
  );
}
