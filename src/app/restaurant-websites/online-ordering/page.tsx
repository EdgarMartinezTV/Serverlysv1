import { JsonLd } from "@/components/ui/json-ld";
import { serviceGraph } from "@/lib/seo";
import { Faqs, Hero, HowItWorks, PhotoCta, Promises, Related } from "@/components/retell/kit";
import {
  DEMO_HREF,
  GuideBreadcrumbs,
  GuideSection,
  InlineLink,
  REVIEW_HREF,
  guideMetadata,
  guideServiceProps,
  planPrice,
} from "../_guides/guide-ui";

/**
 * /restaurant-websites/online-ordering — the ordering integration, in depth.
 *
 * Targets "restaurant online ordering website" and the POS-integration
 * queries. Every claim here is one /restaurant-websites already makes: the
 * integration is on Growth and Restaurant Pro, Starter links to the ordering
 * page a restaurant already has, the provider's fees are theirs, and
 * Serverlys takes no cut of orders. No provider fee figures are quoted,
 * because they change and are not ours to state.
 */

const PATH = "/restaurant-websites/online-ordering";
const TITLE = "Restaurant Online Ordering Website Integration | Serverlys";
const DESCRIPTION =
  "Take pickup and delivery orders on your own restaurant website, connected to Toast, Square, Clover or ChowNow. Serverlys takes no cut of your orders.";

export const metadata = guideMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const STEPS = [
  {
    title: "We look at what you already use",
    body: "In the free review we check whether your point of sale already sells online ordering. Toast, Square and Clover each offer their own, and when yours does it is usually the simplest path: web orders arrive in the same system as your dine-in tickets.",
  },
  {
    title: "You choose the provider, we connect it",
    body: "If you have nothing yet, we walk you through the options and how each one charges, so you decide with the fees in front of you. The account is opened in your restaurant’s name and stays yours.",
  },
  {
    title: "Order buttons wherever guests decide",
    body: "We put Order on every page, on the menu and in the phone header, and add your ordering link to your Google Business Profile, all pointing to pickup and delivery from your own provider.",
  },
  {
    title: "You try it before it goes live",
    body: "You review the whole site on a private preview, on your own phone, and follow the ordering path the way a guest will before anything is published.",
  },
] as const;

const DIRECT_VS_MARKETPLACE = [
  {
    title: "Guests order from you",
    body: "On your own website the order is placed with your restaurant, under your name, from your menu, not inside a marketplace that lists your competitors on the same screen.",
  },
  {
    title: "Fees you can see",
    body: "Direct ordering providers charge for payment processing and sometimes a monthly or per-order fee; marketplaces set their own commission. We lay both out before you choose.",
  },
  {
    title: "Serverlys takes no cut",
    body: "Your Serverlys plan is a flat monthly price. We do not add a fee to your orders or take a percentage of your sales.",
  },
  {
    title: "Keep the marketplaces that work",
    body: "If DoorDash or Uber Eats bring you guests, keep them. We can link to your marketplace pages from your site alongside your own ordering.",
  },
  {
    title: "Pickup and delivery",
    body: "Guests choose pickup or delivery wherever your provider supports it. Whether delivery uses your own drivers or a courier is set in your provider’s account.",
  },
  {
    title: "Your menu, kept current",
    body: "The menu on your website is a real web page, and price and dish changes are handled by our team within your plan’s monthly updates.",
  },
] as const;

const FAQS = [
  {
    question: "Which online ordering systems can you connect?",
    answer:
      "Toast, Square, Clover and ChowNow are the ones restaurant owners ask about most, and we connect others too. If your provider gives you an online ordering page or an ordering link, we can put it on your website. The free review confirms what yours supports.",
  },
  {
    question: "Is online ordering included in every plan?",
    answer:
      "The ordering integration is included in Growth and Restaurant Pro. Starter includes Order and Reserve buttons that point to the ordering page you already have.",
  },
  {
    question: "Does Serverlys charge a fee per order?",
    answer: "No. Your plan is a flat setup fee and a flat monthly price. Serverlys does not take a cut of your orders.",
  },
  {
    question: "Who processes the payments?",
    answer:
      "Your ordering provider. Card payments are taken by them, under your account and their terms, and Serverlys never sees or stores card details.",
  },
  {
    question: "Do I need a new point-of-sale system?",
    answer:
      "Not usually. If your current system sells online ordering, connecting it is often the simplest option. If it does not, we help you compare providers that work alongside it.",
  },
  {
    question: "Will my Google listing show an Order button?",
    answer:
      "We add your ordering link to your Google Business Profile. Google decides how and where ordering options appear in search and Maps, so we can set it up but not promise exactly how it is displayed.",
  },
] as const;

export default function OnlineOrderingPage() {
  return (
    <>
      <JsonLd
        data={{
          ...serviceGraph({
            name: "Restaurant online ordering integration",
            serviceType: "Restaurant online ordering website integration",
            description: DESCRIPTION,
            path: PATH,
          }),
          ...guideServiceProps,
        }}
      />

      <Hero
        id="ro-hero-heading"
        title="Online Ordering on Your Own Restaurant Website"
        photo={{ src: "/restaurant/tacos.jpg", alt: "Tacos plated and ready to go out from a restaurant kitchen" }}
        photoClassName="object-[50%_50%]"
        kicker={["Included in Growth and Restaurant Pro", "Toast · Square · Clover · ChowNow"]}
        lede="An Order button on every page and on your Google listing, connected to the ordering system you already run. Guests order from you, the order reaches the system your kitchen already uses, and Serverlys takes no cut."
        cta={{ label: "Get a Free Restaurant Website Review", href: REVIEW_HREF }}
        badgeCaption="Every integration"
        badges={[
          { label: "Your provider", icon: "link" },
          { label: "Order buttons", icon: "layout" },
          { label: "Google listing", icon: "pin" },
          { label: "No cut of orders", icon: "shield" },
        ]}
      />
      <HowItWorks
        id="ro-how-heading"
        title="From the system you already use to orders on your own website."
        steps={STEPS}
      />
      <Promises
        id="ro-direct-heading"
        label="Your website or a marketplace?"
        intro="Marketplaces are good at being found. Your own website is where the order, the menu and the guest stay yours. Most restaurants end up using both."
        items={DIRECT_VS_MARKETPLACE}
      />
      <GuideSection id="ro-cost-heading" label="What it costs" title="What you pay, and to whom" tone="gray">
        <p>
          The integration is part of the Growth plan ({planPrice("growth")}) and Restaurant Pro ({planPrice("pro")}),
          together with the website, hosting, menu and monthly updates. Your ordering provider bills
          you directly for its own service and payment processing.
        </p>
        <p>
          For a full breakdown of what restaurant websites cost, including the fees that come on top of the website itself,
          read our <InlineLink href="/restaurant-websites/cost">restaurant website cost guide</InlineLink>. To see the
          ordering flow from a guest’s side, add a dish to the cart on our{" "}
          <InlineLink href={DEMO_HREF}>live demo restaurant</InlineLink>.
        </p>
      </GuideSection>
      <Faqs id="ro-faq-heading" title="Online ordering questions" items={FAQS} />
      <Related
        id="ro-related-heading"
        label="More on restaurant websites"
        items={[
          ["Restaurant websites", "/restaurant-websites"],
          ["Reservation integrations", "/restaurant-websites/reservations"],
          ["Restaurant website cost guide", "/restaurant-websites/cost"],
          ["Try the live demo", DEMO_HREF],
          ["Sitios web para restaurantes", "/es/restaurant-websites"],
        ]}
      />
      <PhotoCta
        id="ro-cta-heading"
        photo={{ src: "/restaurant/diners.jpg", alt: "Guests sharing dishes around a full restaurant table", position: "50% 50%" }}
        thumb="/restaurant/skewers.jpg"
        title="See what direct ordering would look like for you"
        body="We will open your current website and Google listing on a phone, show you where orders are being lost, and tell you which ordering option fits."
        primary={{ label: "Get a free review", href: REVIEW_HREF }}
      />
      <GuideBreadcrumbs name="Online ordering" path={PATH} />
    </>
  );
}
