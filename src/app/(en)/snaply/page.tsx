import Link from "next/link";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { company } from "@/data/company";
import { canonical, faqGraph, pageMetadata } from "@/lib/seo";
import { StatsRoll } from "../business-email/_components/stats-roll";
import { MotionIn } from "../business-email/_components/mail-motion";
import { EmailFaq } from "../business-email/_components/email-faq";
import { HeroStage } from "./_components/hero-stage";
import { ExplainStage } from "./_components/explain-stage";
import { FeatureTabs } from "./_components/feature-tabs";
import { BrowserShot, Check, Eyebrow, G, Glyph, SnaplyMark } from "./_components/kit";
import { t as tx, tc } from "@/i18n/t";
import { lh } from "@/i18n/href";

/**
 * Snaply — Serverlys' free screenshot and screen-recorder Chrome extension.
 *
 * Built in the business-email page's visual language (2026-11-10, after the
 * first version read as a generic template): folded-slab hero with real
 * product UI, dark rolling-stats band, word-reveal statement band, dark
 * chaptered feature panel, brand banners, two-column FAQ.
 *
 * The extension is in Chrome Web Store review (item nkelhlncjjnfndcoclbnmngbajpbokna).
 * Until it is public every install button is a disabled "Coming soon". When the
 * listing is live, set STORE_URL — every button becomes a real link.
 *
 * Every image is a real capture of the extension (public/snaply, from the Snaply
 * repo's store assets). Feature claims mirror the store listing — do not add one
 * the extension cannot do.
 */

const PATH = "/snaply";
/** Chrome Web Store URL — empty until the listing is approved. */
const STORE_URL = "";
const AVAILABLE = STORE_URL !== "";

const DESCRIPTION =
  "Snaply is a free Chrome extension for screenshots, full-page captures and screen recordings, with an editor to annotate, blur, redact and trim. No account, no watermark, and nothing leaves your device.";

export const metadata = pageMetadata({
  title: "Snaply — Free Screenshot & Screen Recorder for Chrome | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

const FAQS = [
  {
    question: "Is Snaply really free?",
    answer:
      "Yes. Every feature is free, with no account, no trial, no watermark and no limit on how many screenshots or recordings you make. Serverlys builds it as a tool for our customers and for anyone else who finds it useful.",
  },
  {
    question: "When can I install it?",
    answer:
      "Snaply has been submitted to the Chrome Web Store and is waiting for Google's review. The Add to Chrome buttons on this page go live the day it is approved.",
  },
  {
    question: "Where do my screenshots and recordings go?",
    answer:
      "Nowhere but your own computer. They are kept in Chrome's storage for the extension until you download, copy or delete them. Snaply has no servers, no analytics and no upload feature, and its pages are technically blocked from contacting the internet.",
  },
  {
    question: "Which browsers does it work in?",
    answer:
      "Google Chrome on desktop: Windows, macOS, Linux and ChromeOS. It does not run on Chrome for phones, because Chrome on mobile does not support extensions.",
  },
  {
    question: "Can it record my whole screen, or only the browser?",
    answer:
      "Both. You can record the current tab with its sound, another tab, a single window, your entire screen, or just your webcam. Microphone and a webcam bubble are optional, and you can pause and resume as you go.",
  },
  {
    question: "How long can a recording be?",
    answer:
      "There is no fixed limit. Recordings are written to your disk in one-second chunks rather than held in memory, so long recordings stay stable, and an unfinished recording can be recovered if Chrome closes unexpectedly.",
  },
  {
    question: "Is redaction safe to use on passwords and personal data?",
    answer:
      "The Redact tool draws a solid box that is flattened into the exported image, so the hidden content is gone from the file, not just covered by a layer someone could remove. Blur and pixelate are there too, but use Redact for anything that must not be recoverable.",
  },
  {
    question: "What permissions does it ask for, and why?",
    answer:
      "Only what capturing needs: access to the tab you are on when you click Snaply, the ability to draw the selection overlay, tab recording, downloads and local storage. It does not ask to read every website you visit. The Snaply privacy policy explains each one.",
  },
] as const;

/** What it is good for — the problems it solves, not the feature list. */
const USES = [
  {
    icon: G.bug,
    title: "Reporting a problem",
    body: "Capture the page, circle the error, number the steps. Snaply's issue report bundles the image and your notes into one ZIP for the support ticket.",
    tag: "Support tickets",
  },
  {
    icon: G.layout,
    title: "Feedback on a website",
    body: "Reviewing a new site or a design? Put the arrow exactly where you mean instead of describing which button, on which page, near the top.",
    tag: "Design reviews",
  },
  {
    icon: G.video,
    title: "Quick how-to videos",
    body: "Record your screen with your voice and a webcam bubble, and show a customer or a colleague how it is done once, instead of on every call.",
    tag: "Training",
  },
  {
    icon: G.page,
    title: "Saving a whole page",
    body: "Full-page capture stitches a long scrolling page into one image: receipts, articles, competitor pages, or your own site before a redesign.",
    tag: "Records",
  },
  {
    icon: G.shield,
    title: "Sharing without exposing",
    body: "Redact an email address, a balance or an API key before the screenshot goes anywhere. The redaction is burned into the file, not layered on top.",
    tag: "Privacy",
  },
  {
    icon: G.chat,
    title: "Async updates for a team",
    body: "A two-minute recording often replaces a meeting. Trim the start and end, cut the mistakes, and send it as a video or a short GIF.",
    tag: "Teams",
  },
] as const;

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

/** The install action: a real link once STORE_URL is set, a disabled "Coming soon" until then. */
function InstallButton({ tone = "primary" }: { tone?: "primary" | "white" }) {
  const look =
    tone === "white"
      ? "bg-white text-primary hover:bg-white/90"
      : "bg-primary text-white shadow-[0_10px_30px_-10px_rgb(0_0_255/0.7)] hover:bg-primary-hover";
  const chip = tone === "white" ? "bg-brand-50 text-primary" : "bg-white/20 text-white";
  const inner = (
    <>
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.6" fill="currentColor" />
        <path d="M12 8.4h8.6M8.9 13.8 4.6 6.4M15.1 13.8l-4.3 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      {tx("Add to Chrome")}
      {!AVAILABLE && <span className={`rounded-full px-2.5 py-0.5 text-micro font-semibold ${chip}`}>{tc("snaply", "Coming soon")}</span>}
    </>
  );
  const cls = `inline-flex h-12 items-center gap-2.5 rounded-md px-7 text-body font-semibold transition-colors ${look}`;
  return AVAILABLE ? (
    <a href={STORE_URL} target="_blank" rel="noopener" className={cls}>
      {inner}
    </a>
  ) : (
    <span role="button" aria-disabled="true" title={tx("Snaply is in Chrome Web Store review")} className={`${cls} cursor-not-allowed`}>
      {inner}
    </span>
  );
}

export default function SnaplyPage() {
  return (
    <>
      <JsonLd data={softwareGraph()} />
      <JsonLd data={faqGraph(FAQS.map((f) => ({ ...f, scopes: [PATH] })), PATH)} />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-10 lg:pb-28 lg:pt-20">
          <div>
            <p className="flex items-center gap-2 text-small font-semibold text-primary">
              <SnaplyMark className="size-5" />
              {tx("Snaply by Serverlys")}
            </p>
            <h1 className="mt-3 font-display text-[40px] font-normal leading-[1.08] tracking-[-0.03em] text-fg sm:text-[52px]">
              {tx("Screenshots and screen recordings, ")}
              <span className="text-primary">{tx("explained")}</span>
            </h1>
            <ul className="mt-6 flex flex-col gap-2.5">
              {[
                "Capture a screen, an area, an element or a whole scrolling page",
                "Annotate, blur and redact before you share",
                "Record your tab, a window or your entire screen",
              ].map((t) => (
                <li key={t} className="flex gap-2.5 text-body text-fg-secondary">
                  <Check className="mt-1 size-4 shrink-0 text-success" />
                  {tx(t)}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <InstallButton />
              <a
                href={lh("#features")}
                className="inline-flex h-12 items-center rounded-md px-6 text-body font-semibold text-primary ring-1 ring-inset ring-brand-200 transition-colors hover:bg-brand-50"
              >
                {tc("snaply", "See what it does")}
              </a>
            </div>
            <p className="mt-4 text-small text-fg-secondary">
              <span className="font-semibold text-fg">{tx("Free")}</span>
              {tx(" · No account · No watermark · Chrome on desktop")}
            </p>
          </div>
          <HeroStage />
        </div>
      </section>

      {/* ── Stats band ──────────────────────────────────────────────────── */}
      <section aria-label={tx("Snaply at a glance")} className="bg-canvas-abyss">
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <StatsRoll
            stats={[
              { prefix: "$", value: "0", label: "Every feature, with no trial and no watermark" },
              { value: "4", label: "Ways to screenshot: visible, area, element, full page" },
              { value: "5", label: "Things to record: this tab, any tab, a window, the screen, your webcam" },
              { value: "0", label: "Bytes uploaded. Your captures stay on your computer" },
            ]}
          />
        </div>
      </section>

      {/* ── Statement band ─────────────────────────────────────────────── */}
      <section aria-labelledby="explain" className="bg-canvas">
        <ExplainStage />
      </section>

      {/* ── Feature chapters (dark) ─────────────────────────────────────── */}
      <section id="features" aria-labelledby="features-title" className="relative isolate scroll-mt-20 overflow-hidden bg-[#030a1f]">
        <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[70%] w-[min(1400px,140vw)] -translate-x-1/2 bg-[radial-gradient(50%_55%_at_50%_0%,rgb(31_85_255/0.4),transparent_75%)]" />
        <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <FeatureTabs cta={{ label: "Read how it handles your data", href: "/snaply/privacy" }} />
        </div>
      </section>

      {/* ── What it is good for ─────────────────────────────────────────── */}
      <section aria-labelledby="uses-title" className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--color-canvas-secondary),#ffffff_45%,var(--color-brand-50))]">
        <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[520px] w-[min(1200px,120vw)] -translate-x-1/2 bg-[radial-gradient(50%_55%_at_50%_0%,rgb(31_85_255/0.12),transparent_70%)]" />
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:py-28">
          <Eyebrow className="mx-auto">What it is good for</Eyebrow>
          <h2 id="uses-title" className="mx-auto mt-5 max-w-[760px] text-center font-display text-[36px] font-normal leading-[1.08] tracking-[-0.03em] text-fg sm:text-[52px]">
            {tx("When a picture ")}
            <span className="text-primary">{tx("saves a paragraph")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-body-lg text-fg-secondary">
            {tx("Six everyday jobs where a screenshot or a short recording does the explaining for you.")}
          </p>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {USES.map((u, i) => (
              <li key={u.title}>
                <MotionIn variant="rise" delay={(i % 3) * 0.08}>
                  <div className="group h-full rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_18px_40px_-24px_rgb(0_0_255/0.35)] ring-1 ring-brand-100 transition-shadow hover:shadow-[0_1px_2px_rgb(15_23_42/0.04),0_24px_50px_-22px_rgb(0_0_255/0.5)] sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3d6bff,#0000e0)] text-white shadow-[0_10px_24px_-10px_rgb(0_0_255/0.8)]">
                        <Glyph d={u.icon} className="size-5" />
                      </span>
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-micro font-semibold text-primary">{tx(u.tag)}</span>
                    </div>
                    <h3 className="mt-6 text-[20px] font-semibold tracking-[-0.01em] text-fg">{tx(u.title)}</h3>
                    <p className="mt-2 text-body text-fg-secondary">{tx(u.body)}</p>
                  </div>
                </MotionIn>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Private by design (brand banner) ───────────────────────────── */}
      <section aria-labelledby="private-title" className="relative isolate overflow-hidden bg-primary">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[55%] bg-white/[0.07] [clip-path:polygon(25%_0,100%_0,100%_100%,0_100%)]" />
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[30%] bg-white/[0.06] [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]" />
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-28">
          <div>
            <h2 id="private-title" className="max-w-[520px] font-display text-[40px] font-normal leading-[1.05] tracking-[-0.02em] text-white sm:text-[56px]">
              {tx("Your captures stay on your computer")}
            </h2>
            <p className="mt-6 max-w-[460px] text-body text-white/85">
              {tx("A screenshot tool sees whatever is on your screen, so it should be the last thing that phones home. Snaply does not phone home at all.")}
            </p>
            <Link
              href={lh("/snaply/privacy")}
              className="mt-8 inline-flex h-12 items-center rounded-md bg-white px-7 text-body font-semibold text-primary transition-colors hover:bg-white/90"
            >
              {tx("Read the privacy policy")}
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              [G.user, "No account", "Install it and use it. There is nothing to sign up for."],
              [G.cloudOff, "No uploads", "Captures live in Chrome's storage on your machine until you download or share them."],
              [G.lock, "No tracking", "No analytics, no ads, no telemetry. Its pages cannot even reach the internet."],
              [G.code, "No remote code", "Everything runs from the package Google reviewed. Nothing is downloaded later."],
            ].map(([d, title, body], i) => (
              <li key={title}>
                <MotionIn variant="rise" delay={i * 0.08}>
                  <div className="h-full rounded-2xl bg-white/[0.08] p-5 ring-1 ring-white/15 backdrop-blur">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-white text-primary">
                      <Glyph d={d} className="size-5" />
                    </span>
                    <p className="mt-4 text-body font-semibold text-white">{tx(title)}</p>
                    <p className="mt-1 text-small text-white/75">{tx(body)}</p>
                  </div>
                </MotionIn>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Getting started ────────────────────────────────────────────── */}
      <section aria-labelledby="start-title" className="relative isolate overflow-hidden bg-canvas">
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
          <MotionIn variant="rise">
            <div className="relative">
              <div aria-hidden="true" className="absolute -left-4 -top-4 h-[80%] w-[80%] rounded-[28px] bg-brand-100" />
              <BrowserShot
                className="relative"
                src="/snaply/library.jpg"
                alt="Snaply Projects: captures saved on this device, with the storage they use"
                width={1600}
                height={1000}
                url="Snaply Projects"
                sizes="(min-width: 1024px) 600px, 100vw"
              />
            </div>
          </MotionIn>
          <div className="text-center lg:text-left">
            <Eyebrow className="mx-auto lg:mx-0">Getting started</Eyebrow>
            <h2 id="start-title" className="mt-5 font-display text-[36px] font-normal leading-[1.08] tracking-[-0.03em] text-fg sm:text-[52px]">
              {tx("Ready in ")}
              <span className="text-primary">{tx("under a minute")}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-body-lg text-fg-secondary lg:mx-0">
              {tx("Once Snaply is live on the Chrome Web Store, this is all it takes.")}
            </p>
            <ol className="mx-auto mt-8 flex max-w-[440px] flex-col gap-4 text-left lg:mx-0">
              {[
                ["Add it to Chrome", "One click on this page, then confirm in the Chrome Web Store. No account, no card."],
                ["Pin the icon", "Open Chrome's puzzle-piece menu and pin Snaply, so it is one click away on every page."],
                ["Capture or record", "Pick a capture or press a shortcut. Your first screenshot opens straight in the editor."],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-3.5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[12px] font-semibold text-white shadow-[0_6px_14px_-4px_rgb(0_0_255/0.6)]">
                    {tx(i + 1)}
                  </span>
                  <span>
                    <span className="block text-body font-semibold text-fg">{tx(title)}</span>
                    <span className="block text-small text-fg-secondary">{tx(body)}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-9 flex justify-center lg:justify-start">
              <InstallButton />
            </div>
          </div>
        </div>
      </section>

      <EmailFaq items={tx(FAQS)} supportEmail={tx(company.email)} heading={["Questions about ", "Snaply"]} lede="Free, private, and here is exactly how it works." />

      {/* ── Closing band ───────────────────────────────────────────────── */}
      <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-primary">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[45%] bg-white/[0.07] [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <h2 id="cta-title" className="font-display text-[40px] font-normal tracking-[-0.02em] text-white sm:text-[56px]">
            {tx(AVAILABLE ? "Get Snaply for Chrome" : "Snaply is almost here")}
          </h2>
          <p className="mt-4 max-w-[480px] text-body text-white/85">
            {tx(
              AVAILABLE
                ? "Free screenshots and screen recordings, with nothing leaving your computer."
                : "Snaply is in review on the Chrome Web Store. The install button goes live here the day Google approves it.",
            )}
          </p>
          <div className="mt-8">
            <InstallButton tone="white" />
          </div>
        </div>
      </section>

      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Snaply", path: PATH }]} />
    </>
  );
}
