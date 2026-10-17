import { JsonLd } from "@/components/ui/json-ld";
import { articleGraph, canonical } from "@/lib/seo";
import { Hero, PhotoCta, Related } from "@/components/retell/kit";
import { formatMonthly, formatSetup, restaurantPlans } from "@/data/restaurant-plans";
import {
  DEMO_HREF,
  GuideBreadcrumbs,
  GuideList,
  GuideSection,
  GuideTable,
  InlineLink,
  REVIEW_HREF,
  guideMetadata,
} from "../_guides/guide-ui";

/**
 * /restaurant-websites/cost — "how much does a restaurant website cost?"
 *
 * The cost SERP is informational guides, not service pages, so this is a
 * guide (Article schema) that answers the question honestly and then shows
 * our prices, rather than a second pricing page competing with the plans on
 * /restaurant-websites.
 *
 * ⚠ EVERY THIRD-PARTY FIGURE IS QUOTED FROM ITS SOURCE, LINKED, AND WAS
 * CHECKED ON `CHECKED`. Re-check them before changing that date. Do not add a
 * figure without a source a reader can open, and do not restate a range
 * as our own estimate.
 */

const PATH = "/restaurant-websites/cost";
const TITLE = "How Much Does a Restaurant Website Cost? (2026) | Serverlys";
const DESCRIPTION =
  "What a restaurant website costs in 2026: DIY builders, freelancers, agencies and restaurant platforms, the fees that come on top, and what Serverlys charges.";
const PUBLISHED = "2026-10-17";
const CHECKED = "October 17, 2026";

export const metadata = guideMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const SOURCES = {
  wix: "https://www.wix.com/blog/restaurant-website-cost",
  fleksa: "https://fleksa.com/en/geo/restaurant-website-miami",
  owner: "https://www.owner.com/pricing",
  upmenu: "https://www.upmenu.com/restaurant-website-development/",
} as const;

const DRIVERS = [
  {
    title: "Pages and menu size",
    body: "A one-page site with hours and a menu is a different job from a site with a page per menu, events, catering, private dining and several locations.",
  },
  {
    title: "Design and photography",
    body: "A custom design around your food and brand costs more than a template. Good photos of your dishes and dining room matter as much as the design, and a photo shoot is usually priced separately.",
  },
  {
    title: "Languages",
    body: "A site in English and Spanish is two sets of pages to write, review and keep in step, not a translate button.",
  },
  {
    title: "Ordering and reservations",
    body: "Connecting an ordering or reservation provider is setup work on the website side, and the provider adds its own monthly or per-order costs on top.",
  },
  {
    title: "Google and local SEO",
    body: "Setting up your Google Business Profile, restaurant and menu markup, and the same name, address and hours everywhere takes time that a basic build skips.",
  },
  {
    title: "Ongoing updates",
    body: "Menus, prices, hours and specials change. Who makes those changes, and how many a month are included, is often the largest difference between two quotes.",
  },
] as const;

const ON_TOP = [
  {
    title: "Domain name",
    body: "Your restaurant’s web address is renewed every year. Make sure it is registered in your restaurant’s name.",
  },
  {
    title: "Online ordering",
    body: "Ordering providers charge for payment processing and, depending on the provider, a monthly or per-order fee. Restaurant platforms may also charge per order.",
  },
  {
    title: "Reservations",
    body: "Reservation systems charge their own subscription and, with some providers, per-guest fees. A request form that emails your team has no third-party fee.",
  },
  {
    title: "Marketplaces",
    body: "DoorDash, Uber Eats and similar apps set their own commission on the orders they bring. Your own website does not replace them, but it gives guests a direct way to order.",
  },
  {
    title: "Photography",
    body: "Professional photos of your food and space, if you do not already have them.",
  },
] as const;

const QUESTIONS = [
  {
    title: "Who owns the domain and the content?",
    body: "The domain should be registered in your restaurant’s name, and your menu, photos and text should be yours to take with you.",
  },
  {
    title: "What does the monthly fee include?",
    body: "Hosting, security certificates, backups and a number of updates a month, or only hosting? Ask for it in writing.",
  },
  {
    title: "Who updates the menu, and how fast?",
    body: "If you will not edit the site yourself, find out how many changes are included and what each extra one costs.",
  },
  {
    title: "Is there a fee on every order?",
    body: "Some platforms charge a percentage or a fee per order on top of the subscription. Add it to the monthly cost at your real order volume.",
  },
  {
    title: "What happens if I leave?",
    body: "Find out whether the website, the domain and your guest data come with you, or stay with the platform.",
  },
] as const;

export default function RestaurantWebsiteCostPage() {
  const setups = restaurantPlans.map((p) => p.setup).sort((a, b) => a - b);
  const monthlies = restaurantPlans.map((p) => p.monthly).sort((a, b) => a - b);
  const plansRows = restaurantPlans.map(
    (p) =>
      [
        p.name,
        formatSetup(p.setup),
        `${formatMonthly(p.monthly)} a month`,
        `Up to ${p.pages} pages, ${p.updates} updates a month, ${p.locations === 1 ? "1 location" : `up to ${p.locations} locations`}`,
      ] as const,
  );

  return (
    <>
      <JsonLd
        data={{
          ...articleGraph({
            headline: "How much does a restaurant website cost?",
            description: DESCRIPTION,
            path: PATH,
            published: PUBLISHED,
            section: "Restaurant websites",
            image: [canonical("/restaurant/diners.jpg")],
          }),
          about: { "@id": `${canonical("/restaurant-websites")}#service` },
        }}
      />

      <Hero
        id="rc-hero-heading"
        title="How Much Does a Restaurant Website Cost?"
        photo={{ src: "/restaurant/diners.jpg", alt: "Guests sharing dishes around a full restaurant table" }}
        photoClassName="object-[50%_50%]"
        kicker={[`Updated ${CHECKED}`, "Prices in USD"]}
        lede="From nothing up front on a do-it-yourself builder to $15,000 or more for a custom agency build, plus monthly costs for hosting, updates and the ordering or reservation services you add. Here is what drives the price, what comes on top, and what we charge."
        cta={{ label: "Get a Free Restaurant Website Review", href: REVIEW_HREF }}
        badgeCaption="This guide covers"
        badges={[
          { label: "Price ranges", icon: "report" },
          { label: "Hidden fees", icon: "eye" },
          { label: "Our prices", icon: "doc" },
          { label: "What to ask", icon: "team" },
        ]}
      />

      <GuideSection id="rc-ranges-heading" label="The short answer" title="What restaurant websites cost, by who builds them">
        <p>
          These are published ranges and list prices, not quotes. Each comes from the source linked beside it, checked on{" "}
          {CHECKED}.
        </p>
        <GuideTable
          caption="Published restaurant website price ranges by type of provider"
          head={["Option", "Up front", "Monthly", "Source"]}
          rows={[
            [
              "Do-it-yourself website builder",
              "$0",
              "$0 to $70 or more",
              <InlineLink key="s" href={SOURCES.wix}>
                Wix
              </InlineLink>,
            ],
            [
              "Freelance web developer",
              "$500 to $10,000 or more",
              "Varies",
              <InlineLink key="s" href={SOURCES.wix}>
                Wix
              </InlineLink>,
            ],
            [
              "Agency custom build (Miami)",
              "$3,000 to $15,000",
              "$50 to $200 maintenance",
              <InlineLink key="s" href={SOURCES.fleksa}>
                Fleksa
              </InlineLink>,
            ],
            [
              "Restaurant website agency",
              "From $890",
              "Varies",
              <InlineLink key="s" href={SOURCES.upmenu}>
                UpMenu
              </InlineLink>,
            ],
            [
              "Restaurant platform (Owner.com)",
              "Not listed",
              "$249 + 5% per order, or $499 flat",
              <InlineLink key="s" href={SOURCES.owner}>
                Owner.com
              </InlineLink>,
            ],
            [
              "Serverlys restaurant plans",
              `${formatSetup(setups[0])} to ${formatSetup(setups[setups.length - 1])}`,
              `${formatMonthly(monthlies[0])} to ${formatMonthly(monthlies[monthlies.length - 1])}`,
              "This page",
            ],
          ]}
        />
        <p>
          The gap between the lowest and highest numbers is mostly about who does the work. With a builder you design,
          write and update the site yourself. With a developer or an agency you pay for that work, and the monthly fee
          decides whether updates are included or billed one by one.
        </p>
      </GuideSection>

      <GuideSection id="rc-drivers-heading" label="What drives the price" title="Six things that move a quote up or down" tone="gray">
        <GuideList items={DRIVERS} />
      </GuideSection>

      <GuideSection id="rc-extras-heading" label="On top of the website" title="Costs that are not in the website price">
        <p>
          The website is rarely the only bill. These are paid to other companies, whoever builds your site, so compare
          quotes with them added in.
        </p>
        <GuideList items={ON_TOP} />
      </GuideSection>

      <GuideSection id="rc-ours-heading" label="What we charge" title="Serverlys restaurant website prices" tone="gray">
        <p>
          A one-time setup fee, then a flat monthly plan that starts at launch. Hosting, SSL and daily backups are on every
          plan. Prices are in USD, plus applicable tax.
        </p>
        <GuideTable caption="Serverlys restaurant website plans" head={["Plan", "Setup", "Monthly", "Includes"]} rows={plansRows} />
        <p>
          Growth adds English and Spanish, online ordering and reservations connected, and local SEO. Restaurant Pro adds
          the ConvoAI assistant, catering and private-event requests and up to three locations. Ordering and reservation
          providers bill you separately, and Serverlys takes no cut of your orders. Every feature is compared plan by plan
          on <InlineLink href="/restaurant-websites#plans">our restaurant websites page</InlineLink>.
        </p>
        <p>
          How the integrations work: <InlineLink href="/restaurant-websites/online-ordering">online ordering</InlineLink>{" "}
          and <InlineLink href="/restaurant-websites/reservations">reservations</InlineLink>.
        </p>
      </GuideSection>

      <GuideSection id="rc-ask-heading" label="Before you pay anyone" title="Five questions to ask any restaurant web designer">
        <GuideList items={QUESTIONS} />
        <p>
          You can see what a finished restaurant website does, from menu to checkout to booking, on our{" "}
          <InlineLink href={DEMO_HREF}>live demo restaurant</InlineLink>.
        </p>
      </GuideSection>

      <Related
        id="rc-related-heading"
        label="More on restaurant websites"
        items={[
          ["Restaurant websites", "/restaurant-websites"],
          ["Online ordering websites", "/restaurant-websites/online-ordering"],
          ["Reservation integrations", "/restaurant-websites/reservations"],
          ["Try the live demo", DEMO_HREF],
          ["Website design", "/website-design"],
        ]}
      />
      <PhotoCta
        id="rc-cta-heading"
        photo={{ src: "/restaurant/room-industrial.jpg", alt: "An industrial-style restaurant dining room with warm lighting", position: "50% 50%" }}
        thumb="/restaurant/fine-table.jpg"
        title="Get a price for your restaurant, not a range"
        body="Tell us about your restaurant. We will review your current website and Google listing and recommend the plan that fits, whether or not you hire us."
        primary={{ label: "Get a free review", href: REVIEW_HREF }}
      />
      <GuideBreadcrumbs name="Cost guide" path={PATH} />
    </>
  );
}
