import Image from "next/image";
import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { TextButtonBand } from "@/components/sections/text-button-band";
import { FaqSection } from "@/components/sections/faq";
import { JsonLd } from "@/components/ui/json-ld";
import type { Faq } from "@/data/faqs";
import { canonical, faqGraph, pageMetadata } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { t as tx } from "@/i18n/t";

/**
 * Snaply — Serverlys' free screenshot and screen-recorder Chrome extension.
 *
 * The extension is in Chrome Web Store review (item nkelhlncjjnfndcoclbnmngbajpbokna),
 * so the install button is a disabled "Coming soon" until the listing is public.
 * When it is: set STORE_URL below and drop `soon` from the hero's primary action
 * (and from the closing band).
 *
 * Every image is a real capture of the extension's own UI (from
 * ~/Desktop/Snaply/docs/publishing/store-assets/raw), not a mock.
 * Feature claims mirror the store listing (docs/publishing/STORE_LISTING.md) —
 * do not add one the extension cannot do.
 */

const PATH = "/snaply";
/** Chrome Web Store URL — empty until the listing is approved. */
const STORE_URL = "";
const AVAILABLE = STORE_URL !== "";

const DESCRIPTION =
  "Snaply is a free Chrome extension for screenshots, full-page captures and screen recordings, with an editor to annotate, blur and trim. No account, no watermark, and nothing leaves your device.";

export const metadata = pageMetadata({
  title: "Snaply — Free Screenshot & Screen Recorder for Chrome | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

const FAQS: readonly Faq[] = [
  {
    question: "Is Snaply really free?",
    answer:
      "Yes. Every feature is free, with no account, no trial, no watermark and no limit on how many screenshots or recordings you make. Serverlys builds it as a tool for our customers and for anyone else who finds it useful.",
    scopes: [PATH],
  },
  {
    question: "When can I install it?",
    answer:
      "Snaply has been submitted to the Chrome Web Store and is waiting for Google's review. The install button on this page goes live the day it is approved.",
    scopes: [PATH],
  },
  {
    question: "Where do my screenshots and recordings go?",
    answer:
      "Nowhere but your own computer. They are kept in Chrome's storage for the extension until you download, copy or delete them. Snaply has no servers, no analytics and no upload feature, and its pages are technically blocked from contacting the internet.",
    scopes: [PATH],
  },
  {
    question: "Which browsers does it work in?",
    answer:
      "Google Chrome on desktop — Windows, macOS, Linux and ChromeOS. It does not run on Chrome for phones, because Chrome on mobile does not support extensions.",
    scopes: [PATH],
  },
  {
    question: "Can it record my whole screen, or only the browser?",
    answer:
      "Both. You can record the current tab with its sound, another tab, a single window, your entire screen, or just your webcam. Microphone and a webcam bubble are optional, and you can pause and resume as you go.",
    scopes: [PATH],
  },
  {
    question: "How long can a recording be?",
    answer:
      "There is no fixed limit. Recordings are written to your disk in one-second chunks rather than held in memory, so long recordings stay stable, and an unfinished recording can be recovered if Chrome closes unexpectedly.",
    scopes: [PATH],
  },
  {
    question: "Is redaction safe to use on passwords and personal data?",
    answer:
      "The Redact tool draws a solid box that is flattened into the exported image, so the hidden content is gone from the file — not just covered by a layer someone could remove. Blur and pixelate are there too, but use Redact for anything that must not be recoverable.",
    scopes: [PATH],
  },
  {
    question: "What permissions does it ask for, and why?",
    answer:
      "Only what capturing needs: access to the tab you are on when you click Snaply, the ability to draw the selection overlay, tab recording, downloads and local storage. It does not ask to read every website you visit. The Snaply privacy policy explains each one.",
    scopes: [PATH],
  },
];

/** A real capture of the extension, framed like a browser window. */
function Shot({
  src,
  alt,
  width,
  height,
  title,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-surface shadow-[0_24px_60px_-20px_rgb(0_0_60/0.35)] ring-1 ring-line">
      <div className="flex items-center gap-2 border-b border-line bg-canvas-secondary px-4 py-2.5">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-line-strong" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-line-strong" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-line-strong" />
        <span className="ml-2 truncate text-micro text-fg-muted">{tx(title)}</span>
      </div>
      <Image src={src} alt={tx(alt)} width={width} height={height} className="block h-auto w-full" sizes="(min-width: 1024px) 600px, 100vw" />
    </figure>
  );
}

function softwareGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Snaply — Screenshot & Screen Recorder",
    applicationCategory: "BrowserApplication",
    operatingSystem: "Windows, macOS, Linux, ChromeOS",
    browserRequirements: "Requires Google Chrome (desktop)",
    description: DESCRIPTION,
    url: canonical(PATH),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Serverlys", url: canonical("/") },
  };
}

export default function SnaplyPage() {
  return (
    <>
      <JsonLd data={softwareGraph()} />
      <JsonLd data={faqGraph(FAQS, PATH)} />

      <ProductHero
        eyebrow={tx("Free Chrome extension")}
        title={tx("Capture anything. Explain everything.")}
        lede={tx("Snaply takes screenshots, captures whole scrolling pages and records your screen, then lets you mark them up before you send them. It is free, needs no account, adds no watermark — and your captures never leave your computer.")}
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Snaply" }]}
        specs={[
          { label: "Price", value: "Free" },
          { label: "Account", value: "Not needed" },
          { label: "Watermark", value: "None" },
          { label: "Works on", value: "Chrome desktop" },
        ]}
        primary={{ label: "Add to Chrome", href: STORE_URL || PATH, soon: !AVAILABLE }}
        secondary={{ label: "See what it does", href: "#features" }}
        visual={
          <div className="mx-auto max-w-[380px]">
            <Shot src="/snaply/popup.png" alt="The Snaply popup: visible area, select area, full page, element, and record screen" width={575} height={800} title="Snaply" />
          </div>
        }
      />

      <FeatureGrid
        id="good-for"
        eyebrow={tx("What it is good for")}
        title={tx("When a picture saves a paragraph")}
        lede={tx("Most explanations go faster with a screenshot, and most screenshots go faster with an arrow on them. Snaply is for the moments you would otherwise type out what you are looking at.")}
        surface="light"
        columns={3}
        items={[
          {
            label: "Reporting a problem",
            detail: "Show support exactly what broke: capture the page, circle the error, number the steps and attach it. Snaply's issue report bundles the image and your notes into one file.",
            icon: "lifebuoy",
          },
          {
            label: "Feedback on a website",
            detail: "Reviewing a new site or a design? Mark up the page with arrows and text instead of describing where on the page you mean.",
            icon: "layout",
          },
          {
            label: "Quick how-to videos",
            detail: "Record your screen with your voice and a webcam bubble to show a customer or a colleague how something is done, once, instead of explaining it on every call.",
            icon: "book",
          },
          {
            label: "Saving a whole page",
            detail: "Full-page capture stitches a long scrolling page into one image — receipts, articles, competitor pages, or your own site before a redesign.",
            icon: "globe",
          },
          {
            label: "Sharing without exposing",
            detail: "Redact an email address, a balance or an API key before the screenshot goes anywhere. The redaction is flattened into the file, not layered on top.",
            icon: "shield",
          },
          {
            label: "Async updates for a team",
            detail: "A two-minute recording often replaces a meeting. Trim the start and end, cut the mistakes, and send it as a video or a short GIF.",
            icon: "chat",
          },
        ]}
      />

      <ShowcaseSplit
        id="features"
        eyebrow={tx("Screenshots")}
        title={tx("Four ways to capture, one click each")}
        body={tx("Capture what is on screen, drag to select an area, click a single element on the page, or take the entire scrolling page in one image. Full-page capture handles sticky headers, shows its progress, can be cancelled with Esc and puts the page back where it was. High-DPI screens keep their real resolution.")}
        points={[
          { label: "Visible, area, element, full page", detail: "Each one has a keyboard shortcut as well as a button.", icon: "layout" },
          { label: "Save it your way", detail: "PNG or JPEG with adjustable quality, copy to the clipboard, rename before saving.", icon: "bolt" },
          { label: "Kept in Projects", detail: "Every capture is in one place to reopen, rename or delete later.", icon: "book" },
        ]}
        visual={<Shot src="/snaply/select.jpg" alt="Selecting an area of a web page with Snaply, showing the size of the selection" width={1600} height={1000} title="Select area" />}
        side="right"
        surface="subtle"
      />

      <ShowcaseSplit
        id="editor"
        eyebrow={tx("Editor")}
        title={tx("Point at it, then send it")}
        body={tx("Every screenshot opens in the editor. Add arrows, lines, boxes, text, a highlighter and numbered steps; blur or pixelate anything distracting; and use Redact for what must never be seen. Crop, rotate and resize, with undo all the way back.")}
        points={[
          { label: "Annotate", detail: "Arrows, shapes, pen, highlighter, text and numbered steps, in any colour.", icon: "sparkles" },
          { label: "Hide what is private", detail: "Blur, pixelate, or redact with a box that is burned into the export.", icon: "shield" },
          { label: "Report an issue", detail: "Describe the problem and export one ZIP to attach to a support ticket.", icon: "lifebuoy" },
        ]}
        visual={<Shot src="/snaply/editor.jpg" alt="The Snaply editor with an arrow, numbered steps, a highlight box and a redacted API key" width={1600} height={1000} title="Snaply editor" />}
        side="left"
        surface="light"
      />

      <ShowcaseSplit
        id="recording"
        eyebrow={tx("Screen recording")}
        title={tx("Record the tab, the window or the whole screen")}
        body={tx("Record the current tab with its sound, any other tab, a single window, your entire screen, or just your webcam. Add your microphone with a level meter, and a webcam bubble you can resize and drag to any corner. A countdown, pause and resume, and a stop button that is always within reach.")}
        points={[
          { label: "Built for long recordings", detail: "Written to disk in one-second chunks, and recoverable after a crash.", icon: "server" },
          { label: "Edit before you share", detail: "Trim, cut sections, adjust volume and add text overlays.", icon: "wrench" },
          { label: "Export what you need", detail: "WebM, MP4 where your Chrome supports it, or a short GIF.", icon: "bolt" },
        ]}
        visual={
          <div className="mx-auto max-w-[420px]">
            <Shot src="/snaply/recorder.png" alt="The Snaply recorder: choose this tab, screen or camera, with microphone and webcam options" width={545} height={500} title="Recorder" />
          </div>
        }
        side="right"
        surface="subtle"
      />

      <FeatureGrid
        id="privacy"
        eyebrow={tx("Private by design")}
        title={tx("Your captures stay on your computer")}
        lede={tx("A screenshot tool sees whatever is on your screen, so it should be the last thing that phones home. Snaply does not phone home at all.")}
        surface="light"
        columns={4}
        items={[
          { label: "No account", detail: "Install it and use it. There is nothing to sign up for.", icon: "compass" },
          { label: "No uploads", detail: "Captures live in Chrome's storage on your machine until you download or share them.", icon: "server" },
          { label: "No tracking", detail: "No analytics, no ads, no telemetry. Its pages cannot even reach the internet.", icon: "shield" },
          { label: "No remote code", detail: "Everything runs from the package Google reviewed; nothing is downloaded later.", icon: "wrench" },
        ]}
      />

      <FeatureGrid
        id="how-to-start"
        eyebrow={tx("Getting started")}
        title={tx("Ready in under a minute")}
        lede={tx("Once Snaply is live on the Chrome Web Store, this is all it takes.")}
        surface="subtle"
        columns={3}
        items={[
          { label: "1. Add it to Chrome", detail: "Click Add to Chrome on this page and confirm in the Chrome Web Store. No account, no card.", icon: "globe" },
          { label: "2. Pin the icon", detail: "Open Chrome's puzzle-piece menu and pin Snaply so it is one click away on every page.", icon: "layout" },
          { label: "3. Capture or record", detail: "Click the icon and pick a capture, or press a shortcut. Your first screenshot opens straight in the editor.", icon: "sparkles" },
        ]}
      />

      <FaqSection items={tx(FAQS)} surface="light" title="Questions about Snaply" lede="Free, private, and here is exactly how it works." />

      <TextButtonBand
        id="privacy-policy"
        eyebrow={tx("The details")}
        title={tx("Read exactly what Snaply stores")}
        body={tx("The Snaply privacy policy lists every piece of data the extension keeps, where it lives on your computer, and when it is deleted.")}
        cta={{ label: "Snaply privacy policy", href: "/snaply/privacy" }}
        surface="subtle"
      />

      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Snaply", path: PATH }]} />
    </>
  );
}
