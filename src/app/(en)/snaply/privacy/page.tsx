import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { t as tx } from "@/i18n/t";

/**
 * Snaply (Chrome extension) privacy policy. The Chrome Web Store listing links
 * here, so this URL must stay stable. Source of truth for the content:
 * ~/Desktop/Snaply/docs/privacy/PRIVACY.md — keep the two in sync.
 */
const PATH = "/snaply/privacy";

export const metadata = pageMetadata({
  title: "Snaply Privacy Policy | Serverlys",
  description:
    "Snaply, the Serverlys screenshot and screen-recorder extension for Chrome, keeps every capture on your device. What it stores, where, and what it never does.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "summary",
    heading: "In short",
    blocks: [
      {
        type: "p",
        text: "Snaply is a screenshot and screen-recording extension for Google Chrome, published by Serverlys, LLC. It is built so that your captures never leave your device unless you choose to share them. Snaply has no accounts, no analytics and no servers of its own, so we never receive your screenshots, recordings or browsing data.",
      },
    ],
  },
  {
    id: "what-is-stored",
    heading: "What Snaply stores, and where",
    blocks: [
      { type: "p", text: "Everything Snaply keeps is stored inside Chrome on your own computer:" },
      {
        type: "ul",
        items: [
          "Screenshots, recordings, thumbnails and editing projects — in Chrome's IndexedDB storage for the Snaply extension. Deleted when you delete them in Projects, when optional auto-delete (off by default) removes them, when you clear Chrome's data for Snaply, or when you uninstall it.",
          "Unfinished recording chunks, kept so a recording can be recovered after a crash — in the same storage, until the recording is finalized, recovered, discarded or cleared.",
          "The address and title of the page a screenshot was taken on — stored with that screenshot, used for file names and optional issue reports, and deleted with it.",
          "Your settings (formats, theme, language, device choices) — in chrome.storage.local, removed on uninstall.",
          "The status of a recording in progress — in chrome.storage.session, which is memory only and cleared when the browser closes.",
          "Files you download — in your Downloads folder or the location you pick. Snaply never deletes these; they are yours.",
        ],
      },
    ],
  },
  {
    id: "what-it-does-not-do",
    heading: "What Snaply does not do",
    blocks: [
      {
        type: "ul",
        items: [
          "It does not upload screenshots, recordings, audio, projects or page data to Serverlys or anyone else. Its pages are technically prevented from contacting any server by their Content Security Policy.",
          "It has no accounts, analytics, telemetry, advertising or tracking, and it does not sell or share data.",
          "It does not read pages in the background. Snaply only touches a page after you start a capture on it, and then only to draw the selection overlay, measure and scroll the page, and temporarily hide fixed headers during a full-page capture. It never reads form fields, passwords or page text.",
          "It never records without your action. Recording starts only after you press Start recording, Chrome shows its own capture indicators, and recording stops when you press Stop or stop sharing.",
          "It does not load or run code from the internet. All of its code ships inside the extension package reviewed by Google.",
        ],
      },
    ],
  },
  {
    id: "permissions",
    heading: "Permissions",
    blocks: [
      {
        type: "ul",
        items: [
          "activeTab — temporary access to a tab only when you click the Snaply button or press a Snaply shortcut, so it can capture that tab.",
          "scripting — injects the selection overlay or full-page helper into the tab after you start an area, element or full-page capture.",
          "tabCapture — records the current tab and its sound when you choose \"This tab\" in the recorder.",
          "downloads — saves screenshots, recordings and exports to your computer.",
          "storage and unlimitedStorage — keep your settings, and let long recordings be written to local storage in small chunks instead of memory.",
        ],
      },
      {
        type: "p",
        text: "Camera and microphone access is requested through Chrome's own prompt the first time you turn them on, and you can revoke it in Chrome's settings at any time. Snaply requests no access to all websites, your tabs list, cookies or network traffic.",
      },
    ],
  },
  {
    id: "sharing",
    heading: "Sharing",
    blocks: [
      {
        type: "p",
        text: "Data leaves your device only when you download, copy or attach a file somewhere yourself — for example, attaching a Snaply issue-report ZIP to a support conversation. Once shared, that copy is governed by the policies of wherever you shared it.",
      },
    ],
  },
  {
    id: "children",
    heading: "Children",
    blocks: [
      {
        type: "p",
        text: "Snaply is a general-purpose productivity tool. It does not collect personal information from anyone, including children.",
      },
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    blocks: [
      {
        type: "p",
        text: "If a future version of Snaply changes how data is handled, we will update this page and its effective date, and note the change in the release notes before that version is published.",
      },
    ],
  },
];

export default function SnaplyPrivacyPage() {
  return (
    <>
      <LegalPage
        title={tx("Snaply privacy policy")}
        intro={tx("Snaply keeps your screenshots and recordings on your device. This page explains exactly what it stores, where, and what it never does.")}
        path={PATH}
        trail={[{ name: "Home", href: "/" }, { name: "Snaply", href: "/snaply" }, { name: "Privacy policy" }]}
        sections={tx(SECTIONS)}
        contact={tx("Questions about Snaply and your data? Write to us and we will answer directly.")}
      />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Snaply", path: "/snaply" }, { name: "Privacy policy", path: PATH }]} />
    </>
  );
}
