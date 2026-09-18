import Image from "next/image";
import { ProductHero } from "@/components/sections/product-hero";
import { ProductFit } from "@/components/sections/product-fit";
import { SectionNav } from "@/components/sections/section-nav";
import { MixedCards } from "@/components/sections/mixed-cards";
import { PictureCards } from "@/components/sections/picture-cards";
import { ContentSwitch } from "@/components/sections/content-switch";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { ProofBand } from "@/components/sections/proof-band";
import { TextButtonBand } from "@/components/sections/text-button-band";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Section, SectionHeader } from "@/components/ui/section";
import { PricingTable } from "@/components/pricing/pricing-table";
import { JsonLd } from "@/components/ui/json-ld";
import {
  HostingMock,
  AutomationMock,
  ChatMock,
} from "@/components/product-ui/mocks";
import { UptimePanel } from "@/components/product-ui/panels";
import { TerminalMock } from "@/components/product-ui/infra";
import { billing } from "@/data/company";
import { groupById, formatPrice } from "@/data/pricing";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, productGraph } from "@/lib/seo";

const PATH = "/wordpress-hosting";
const DESCRIPTION =
  "Managed WordPress hosting with server-level LiteSpeed caching, automatic core updates and free migration. Renewal pricing published beside the first-year price.";

const group = groupById("wordpress");
const prices = group?.plans.map((p) => p.monthly) ?? [0];

export const metadata = pageMetadata({
  title: `WordPress Hosting — managed plans from ${formatPrice(Math.min(...prices))}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

/**
 * WordPress hosting.
 *
 * Built band-for-band against the reference page, in its order, with its
 * layouts and its media placement:
 *
 *    0  hero, visual right                    9  services grid (protection)
 *    1  sticky anchor rail                   10  content switch, media right
 *    2  pricing table + fair-use note        11  content switch, media right
 *    3  mixed cards (feature + side cards)   12  split, media LEFT (migration)
 *    4  three picture cards                  13  proof band
 *    5  split, media right                   14  text + button band
 *    6  split, media LEFT                    15  (see note)
 *    7  content switch, no media             16  FAQ
 *    8  split, media right                       + closing CTA
 *
 * The alternation of media sides is not decoration — it is the page's rhythm,
 * and three right-hand visuals in a row read as a list rather than a sequence.
 *
 * ⚠ SURFACES FOLLOW THE REFERENCE, NOT THE SITE'S USUAL ALTERNATION. Measured
 * off its live page: mostly white, two grey steps (#f5f5f6 / #f8f9fa, which our
 * canvas-secondary already matches at #f7f8fa), and TWO DARK SLABS — protection
 * and migration. Those two carry the whole page's structure, which is why the
 * runs of white between them are correct rather than lazy: strict light/subtle
 * alternation produced a uniform stripe with no hierarchy at all. Their dark is
 * #110c29, purple-cast; ours is the blue-cast abyss, because the brief was to
 * keep the blue.
 *
 * ⚠ TWO BANDS ARE DELIBERATELY NOT REPRODUCED, and the reasons are in the
 * components rather than here: the reference's customer testimonials and its
 * third-party rating badges (Google, HostAdvice, WPBeginner). This repo holds
 * no review data and no published score on any of those services, so both
 * would have to be invented. `ProofBand` carries verifiable commitments in
 * that slot instead. See its header.
 *
 * The anchor rail and the sections it points at share one wrapper, because
 * `sticky` is bounded by its scrolling ancestor — see SectionNav.
 */
const NAV = [
  { id: "plans", label: "Pricing" },
  { id: "managed", label: "Managed" },
  { id: "performance", label: "Performance" },
  { id: "features", label: "Features" },
] as const;

export default function WordPressHostingPage() {
  const faqs = faqsFor(PATH);
  const starter = group?.plans.find((p) => p.tier === "starter");

  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "WordPress hosting", path: PATH },
        ])}
      />
      <JsonLd
        data={productGraph({
          name: "Serverlys WordPress Hosting",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: prices.length,
        })}
      />
      <JsonLd data={faqGraph(faqs)} />

      {/* 0 — hero, visual right. LIGHT, as the reference's is: it carries no
          background of its own, so a white-backed image blends into the page
          instead of sitting on a dark band with its edges showing. */}
      <ProductHero
        tone="light"
        eyebrow="Managed hosting for WordPress"
        title="Run WordPress without running a server"
        lede="WordPress installed, LiteSpeed tuned for it, updates applied with a backup taken first, and staging on every site. You write the posts; we keep the machine out of your way."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "WordPress hosting" }]}
        specs={[
          { label: "From", value: `${formatPrice(Math.min(...prices))}/mo` },
          { label: "Storage", value: "Unlimited NVMe" },
          { label: "Migration", value: "Free" },
        ]}
        primary={{ label: "Start now", href: billing.store("wordpress-hosting") }}
        secondary={{ label: "Compare plans", href: "#plans" }}
        visual={
          /**
           * A supplied asset rather than a code-built mock, so it needs the
           * three things an <img> in a hero always needs:
           *
           *   · `priority` — this is the LCP element on the page, and Next
           *     lazy-loads by default, which would put the largest paint behind
           *     the loader;
           *   · intrinsic width/height — reserves the box so the copy beside it
           *     does not jump when the file lands (CLS);
           *   · `sizes` — without it Next serves the full 1584px file to a
           *     phone. It renders at ~640px on desktop and full width below.
           */
          <Image
            src="/Hosting-images/Wordpress-hero-pages.png"
            alt="The Serverlys editor with a page open, beside the hosting panel"
            width={1584}
            height={993}
            priority
            sizes="(min-width: 1024px) 640px, 100vw"
            /* No radius, no shadow, no ring — measured off the reference,
               whose hero image carries all three at zero. The PNG's own
               corners are already white (sampled at 253-255), so framing it
               draws a box around a picture that has no edge. */
            className="h-auto w-full"
          />
        }
      />

      {/* 1–12 share the rail's wrapper so `sticky` is bounded by them. */}
      <div>
        <SectionNav items={NAV} />

        {/* 2 — pricing table */}
        <Section
          id="plans"
          surface="subtle"
          spacing="base"
          width="wide"
          labelledBy="plans-heading"
          className="scroll-mt-8"
        >
          <SectionHeader
            id="plans-heading"
            eyebrow="Pricing"
            title="Explore managed WordPress plans"
            lede="Every card shows the monthly rate, the standard rate it discounts, and the setup fee where one applies."
            align="center"
          />
          <div className="mt-12">
            <PricingTable only="wordpress" />
          </div>
          {/* The reference attaches a "compare all features" block to this
              band (hgr-wordpress_hosting-pricing-table-compare-all-features).
              Ours compares our OWN range rather than competitors — see
              ProductFit for why. */}
          <div className="mt-14">
            <ProductFit />
          </div>

          <p className="mt-8 text-center text-small text-fg-muted">
            Unlimited storage and bandwidth are subject to fair use: they are sized for
            websites, not for file distribution or backup archives.
            {starter
              ? ` Starter carries a one-off ${formatPrice(starter.setupFee ?? 0)} setup fee.`
              : ""}
          </p>
        </Section>

        {/* 3 — mixed cards */}
        <MixedCards
          id="managed"
          eyebrow="Managed"
          title="Your WordPress site, looked after by default"
          lede="The maintenance list that normally lands on you is already running on the server before you log in."
          feature={{
            eyebrow: "Automations",
            title: "Updates, backups and scans on a schedule you never set",
            body: "Core and security patches applied automatically with a snapshot taken first, malware scanned nightly, and the cache rebuilt after. Watch the queue run rather than take our word for it.",
            visual: <AutomationMock />,
            cta: { label: "How automations work", href: "/automations" },
          }}
          cards={[
            {
              title: "One-click staging",
              body: "Clone live to a staging URL, break it there, push back when it holds.",
              href: "/site-management",
            },
            {
              title: "Daily backups",
              body: "A full snapshot every day, restorable yourself without opening a ticket.",
              href: "/site-management",
            },
            {
              title: "Managed by our team",
              body: "Or hand the whole list over and we do the updates and monitoring.",
              href: "/managed-hosting",
            },
          ]}
          surface="light"
        />

        {/* 4 — three picture cards */}
        <PictureCards
          eyebrow="Tooling"
          title="The parts of WordPress that usually need a plugin"
          lede="Server-level where it belongs, so it keeps working when a plugin is deactivated."
          cards={[
            {
              title: "Caching, at the server",
              body: "LiteSpeed cache configured for WordPress and rebuilt after every update — not a plugin you have to tune.",
              bleed: true,
              visual: (
                <Image
                  src="/Hosting-images/Caching-server .png"
                  alt="The Serverlys control panel showing a site's CPU, memory and storage"
                  width={1536}
                  height={1024}
                  sizes="(min-width: 768px) 420px, 100vw"
                  className="h-full w-full object-cover"
                />
              ),
            },
            {
              title: "Search visibility",
              body: "Clean URLs, fast Core Web Vitals and a sitemap that matches the site, so the crawl budget is not spent on redirects.",
              bleed: true,
              visual: (
                <Image
                  src="/Hosting-images/Search-visibility .png"
                  alt="A rankings panel showing tracked keywords and Core Web Vitals"
                  width={1536}
                  height={1024}
                  sizes="(min-width: 768px) 420px, 100vw"
                  className="h-full w-full object-cover"
                />
              ),
            },
            {
              title: "Domains and DNS",
              body: "Register or transfer in, then edit A, MX and TXT records yourself without raising a ticket.",
              bleed: true,
              visual: (
                <Image
                  src="/Hosting-images/Domains-DNS .png"
                  alt="A domain search showing availability and prices across extensions"
                  width={1536}
                  height={1024}
                  sizes="(min-width: 768px) 420px, 100vw"
                  className="h-full w-full object-cover"
                />
              ),
            },
          ]}
          cta={{ label: "Get started", href: billing.store("wordpress-hosting") }}
          surface="light"
        />

        {/* 5 — split, media right */}
        <ShowcaseSplit
          eyebrow="Infrastructure"
          title="The machine underneath, and what you can reach of it"
          body="NVMe storage, a managed LiteSpeed stack and real PHP version control. SSH and WP-CLI are there when you want them, and nothing breaks if you never open them."
          points={[
            { label: "NVMe storage", detail: "Unlimited, on every tier.", icon: "server" },
            { label: "PHP you choose", detail: "Switch version per site.", icon: "wrench" },
            { label: "SSH and WP-CLI", detail: "For the jobs a UI is slow at.", icon: "bolt" },
          ]}
          visual={<TerminalMock />}
          side="right"
          surface="light"
        />

        {/* 6 — split, media LEFT */}
        <ShowcaseSplit
          eyebrow="ConvoAI"
          title="Answer the enquiries the site already brings you"
          body="A chat agent trained on your own pages, sitting on the WordPress site you host here. It answers about your prices and your hours, qualifies, and hands you the transcript."
          points={[
            { label: "Trained on your pages", detail: "Not general knowledge.", icon: "chat" },
            { label: "Books and qualifies", detail: "Captures the lead, not just a reply.", icon: "sparkles" },
            { label: "Hands over cleanly", detail: "When it is not routine.", icon: "lifebuoy" },
          ]}
          cta={{ label: "See how it works", href: "/convoai" }}
          visual={<ChatMock />}
          side="left"
          surface="subtle"
        />

        {/* 7 — content switch, no media */}
        <ContentSwitch
          id="performance"
          eyebrow="Performance"
          title="Fast, and still fast on the day it matters"
          lede="Speed is not a number on a marketing page — it is what the site does under real traffic, on a real plan."
          items={[
            {
              label: "Quicker load times",
              body: "Server-level LiteSpeed caching serves a built page instead of rebuilding it per visitor, and NVMe storage keeps the database queries that remain short.",
              icon: "gauge",
            },
            {
              label: "No downtime, no lost visitors",
              body: "Auto-scaling absorbs spikes rather than throttling them, so a post that does well does not take the site down.",
              icon: "chart",
            },
            {
              label: "Better Core Web Vitals",
              body: "LCP and CLS are what search actually measures. A cached, uncluttered page moves both without a plugin promising to.",
              icon: "compass",
            },
            {
              label: "More of the traffic converts",
              body: "A page that paints quickly loses fewer people before it is read. That is the whole mechanism — there is no trick to it.",
              icon: "sparkles",
            },
          ]}
          visual={<UptimePanel />}
          side="right"
          surface="subtle"
        />

        {/* 8 — split, media right */}
        <ShowcaseSplit
          eyebrow="Control panel"
          title="Everything for the site in one place"
          body="Sites, PHP, cache, backups and DNS in a panel that shows the machine rather than a marketing dashboard. Open it and poke it before you pay for it."
          points={[
            { label: "Per-site controls", detail: "Each site has its own settings.", icon: "layout" },
            { label: "Free SSL", detail: "Issued and renewed automatically.", icon: "shield" },
            { label: "Email at your domain", detail: "MX records already pointed.", icon: "mail" },
          ]}
          visual={<HostingMock />}
          side="right"
          surface="light"
        />

        {/* 9 — services grid. DARK, as the reference is here.
            className puts it on the SAME ground as the migration band below:
            Section's `dark` is the neutral near-black (ink-950) while
            ShowcaseSplit's is the blue abyss, so without it the page carried
            two different darks a few sections apart.

            The `!` is load-bearing: Section already emits bg-canvas-dark for
            surface="dark", and two bg-* utilities of equal specificity are
            resolved by Tailwind's OUTPUT order, not by the order they appear in
            the class string — so the plain override silently lost. */}
        <ServicesGrid
          eyebrow="Protection"
          title="Maximum site protection, on by default"
          lede="None of these is an add-on, an upgrade prompt, or a line on the renewal invoice."
          items={[
            { label: "Web firewall", detail: "Traffic filtered before it reaches PHP.", icon: "shield" },
            { label: "Malware scanning", detail: "The file system checked on a schedule.", icon: "compass" },
            { label: "Free SSL", detail: "Every domain and subdomain, auto-renewed.", icon: "shield" },
            { label: "Daily backups", detail: "Kept for your plan's retention window.", icon: "server" },
            { label: "Automatic patching", detail: "Core and security, backup taken first.", icon: "wrench" },
            { label: "Self-service restore", detail: "Whole account or a single file.", icon: "lifebuoy" },
            { label: "WHOIS privacy", detail: "Your address off the public record.", icon: "globe" },
            { label: "Reachable support", detail: "A person, when it actually matters.", icon: "chat" },
          ]}
          surface="dark"
          className="bg-canvas-abyss!"
        />

        {/* 10 — content switch, media right */}
        <ContentSwitch
          id="features"
          eyebrow="Features"
          title="Hands-off hosting for WordPress"
          lede="Four things that would otherwise be four plugins and a recurring reminder."
          items={[
            {
              label: "Safely test before you publish",
              body: "One-click staging clones the live site to its own URL. Update plugins there, check it properly, then push back — so a Friday update stops being a decision.",
              icon: "layout",
            },
            {
              label: "Stay secure without lifting a finger",
              body: "A firewall in front of PHP, scheduled malware scanning, and security patches applied automatically with a snapshot taken before each one.",
              icon: "shield",
            },
            {
              label: "Never lose your data",
              body: "A full snapshot every day, kept for your plan's retention window, restorable by you — the whole account or one file out of it.",
              icon: "server",
            },
            {
              label: "Real developer tools",
              body: "SSH, WP-CLI, per-site PHP versions and Git deploys, for the jobs a control panel is simply slower at.",
              icon: "bolt",
            },
          ]}
          visual={<AutomationMock />}
          side="right"
          surface="light"
        />

        {/* 11 — content switch, media right */}
        <ContentSwitch
          eyebrow="Growth"
          title="Turn WordPress visitors into customers"
          lede="The site is the easy part. What happens to the people who arrive on it is the part that pays."
          items={[
            {
              label: "Answered the moment they ask",
              body: "ConvoAI sits on the site and answers about your prices, hours and availability — at 2am, in the reader's own words.",
              icon: "chat",
            },
            {
              label: "Picked up when you cannot",
              body: "CallFlow answers the phone, takes the details, books the slot and leaves you a transcript instead of a voicemail.",
              icon: "phone",
            },
            {
              label: "Followed up automatically",
              body: "A new enquiry routes to the right inbox, the invoice chases itself, and the weekly report writes itself.",
              icon: "bolt",
            },
            {
              label: "Found in the first place",
              body: "Technical SEO and the content that earns the ranking, measured against traffic rather than positions.",
              icon: "compass",
            },
          ]}
          visual={<ChatMock />}
          side="right"
          surface="light"
          cta={{ label: "See the AI tools", href: "/ai-tools" }}
        />

        {/* 12 — split, media LEFT */}
        <ShowcaseSplit
          eyebrow="Migration"
          title="Fast, free, unlimited migrations"
          body="Tell us where the site lives now. We move files, database and email onto a staging URL, you check it properly, and DNS changes only when you say so."
          points={[
            { label: "No impact on the live site", detail: "It stays up throughout.", icon: "shield" },
            { label: "Usually within a business day", detail: "Staging URL first, always.", icon: "gauge" },
            { label: "No limit on how many", detail: "Bring a whole portfolio.", icon: "server" },
          ]}
          cta={{ label: "Migrate your site", href: "/migrations" }}
          visual={
            /* No radius and no shadow, same as the hero. The artwork's own
               corners are dark navy (sampled 1,9,31 – 5,23,79) against the
               abyss band at 10,16,48, so it meets the ground rather than
               sitting on it — framing it would draw an edge where there is
               none. */
            <Image
              src="/Hosting-images/Migration.png"
              alt="A migration in progress, showing products, orders, media and customers transferred"
              width={1536}
              height={1024}
              sizes="(min-width: 1024px) 620px, 100vw"
              className="h-auto w-full"
            />
          }
          side="left"
          surface="dark"
        />
      </div>

      {/* 13 — proof band. See the component header for what it replaces. */}
      <ProofBand
        eyebrow="What you are actually buying"
        title="Commitments, not adjectives"
        lede="Each of these is published elsewhere on this site and can be held against us."
        items={[
          {
            tag: "Pricing",
            title: "The standard rate is on every card",
            body: "The monthly rate never appears without the rate it discounts, and the setup fee is printed where one applies. The renewal is not a surprise.",
          },
          {
            tag: "Migration",
            title: "We move it, to staging, for free",
            body: "Files, database and email. You approve it on a staging URL before DNS changes. No cap on how many sites.",
          },
          {
            tag: "Guarantee",
            title: "Thirty days to change your mind",
            body: "On every hosting plan, no questions. Domain registrations are excluded, as the registry charge is not refundable to us.",
          },
        ]}
        surface="light"
      />

      {/* 14 — text + button band */}
      <TextButtonBand
        eyebrow="Ecommerce"
        title="Selling as well as publishing?"
        body="WooCommerce runs on any WordPress plan. If the store is the main thing the site does, the ecommerce tier is the same infrastructure tuned for checkout under load."
        cta={{ label: "See ecommerce hosting", href: "/ecommerce-hosting" }}
        surface="light"
      />

      {/* 16 — FAQ, then the closing CTA */}
      <FaqSection items={faqs} />
      {/* This page owns an id="plans" section, so the closing CTA scrolls
          there rather than leaving for the homepage. */}
      <FinalCta plansHref="#plans" />
    </>
  );
}
