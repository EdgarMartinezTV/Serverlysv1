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
 * /restaurant-websites/reservations — the reservation integration, in depth.
 *
 * Targets "restaurant reservation website" and the OpenTable/Resy/Tock
 * integration queries. Claims match /restaurant-websites: a reservation system
 * connected on Growth and Restaurant Pro, or a request form that emails the
 * team; private-event and catering requests on Restaurant Pro; ConvoAI
 * collects requests but does not confirm tables. No third-party prices.
 */

const PATH = "/restaurant-websites/reservations";
const TITLE = "Restaurant Reservation Website Integration | Serverlys";
const DESCRIPTION =
  "Let guests book a table from your restaurant website and Google listing, through OpenTable, Resy, Tock or a simple request form your team confirms.";

export const metadata = guideMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const STEPS = [
  {
    title: "Start from how you take bookings today",
    body: "Phone, a reservation system, a message on Instagram or walk-ins only: in the free review we look at where your bookings come from now and where guests give up.",
  },
  {
    title: "Connect a system, or start with a form",
    body: "If you use OpenTable, Resy or Tock, we place their booking on your website so the times guests see are always the system’s own. If you would rather not pay for one, a request form sends every booking to your team to confirm.",
  },
  {
    title: "A Reserve button where guests decide",
    body: "Reserve sits in the header of every page, next to the menu and on your Google Business Profile, so a guest can book from wherever they found you.",
  },
  {
    title: "Private events and catering",
    body: "Restaurant Pro adds a separate request for private events and catering, asking for the date, party size and details your team needs to quote.",
  },
] as const;

const SYSTEM_VS_FORM = [
  {
    title: "Live availability",
    body: "A reservation system shows the times that are really open and confirms the table on the spot. A request form does not: your team confirms each request.",
  },
  {
    title: "Cost",
    body: "Reservation systems charge their own subscription and, with some providers, per-guest fees, all set by them. A request form has no third-party fee.",
  },
  {
    title: "Deposits and no-shows",
    body: "Deposits, card holds and reminder messages come from the reservation system, where it offers them. A request form does not take payments.",
  },
  {
    title: "Your team’s time",
    body: "A system takes bookings while you are closed with nobody answering. A request form means someone replies, usually by phone or email.",
  },
  {
    title: "Guest details stay yours",
    body: "With either option, bookings arrive in your own account or your own inbox, under your restaurant’s name.",
  },
  {
    title: "Easy to change later",
    body: "Many restaurants start with a form and move to a system when bookings grow. The Reserve buttons simply point somewhere new.",
  },
] as const;

const FAQS = [
  {
    question: "Which reservation systems can you connect?",
    answer:
      "OpenTable, Resy and Tock are the ones restaurant owners ask about most, and we connect others too. If your system gives you a booking page or a booking widget, we can place it on your website. The free review confirms what yours supports.",
  },
  {
    question: "What does the request form do?",
    answer:
      "A guest chooses a party size, a date and a time and leaves a name and a phone number or email. The request is emailed to your team, who confirm the table with the guest. It does not hold tables or take payments.",
  },
  {
    question: "Is it included in every plan?",
    answer:
      "The reservation integration is included in Growth and Restaurant Pro. Starter includes a Reserve button that points to the booking page you already have.",
  },
  {
    question: "Does Serverlys charge per booking?",
    answer: "No. Your plan is a flat setup fee and a flat monthly price, however many tables you book.",
  },
  {
    question: "Can the AI assistant take reservations?",
    answer:
      "On Restaurant Pro, ConvoAI, our AI assistant, collects reservation and catering requests in English or Spanish and passes them to your team. It does not confirm tables itself; your reservation system or your team does.",
  },
] as const;

export default function ReservationsPage() {
  return (
    <>
      <JsonLd
        data={{
          ...serviceGraph({
            name: "Restaurant reservation integration",
            serviceType: "Restaurant reservation website integration",
            description: DESCRIPTION,
            path: PATH,
          }),
          ...guideServiceProps,
        }}
      />

      <Hero
        id="rr-hero-heading"
        title="Table Reservations on Your Restaurant Website"
        photo={{ src: "/restaurant/reserved.jpg", alt: "A reserved card on a set restaurant table" }}
        photoClassName="object-[50%_50%]"
        kicker={["Included in Growth and Restaurant Pro", "OpenTable · Resy · Tock · request form"]}
        lede="Guests pick a party size, a date and a time in a few taps, on your website or from your Google listing, through the reservation system you already run, or a simple request form that sends every booking straight to your team."
        cta={{ label: "Get a Free Restaurant Website Review", href: REVIEW_HREF }}
        badgeCaption="Every integration"
        badges={[
          { label: "Party, date, time", icon: "calendar" },
          { label: "Your system", icon: "link" },
          { label: "Google listing", icon: "pin" },
          { label: "No per-booking fee", icon: "shield" },
        ]}
      />
      <HowItWorks
        id="rr-how-heading"
        title="From how you book tables today to bookings on your own website."
        steps={STEPS}
      />
      <Promises
        id="rr-choice-heading"
        label="Reservation system or request form?"
        intro="Both put a Reserve button on your website. The difference is who confirms the table, and what it costs you."
        items={SYSTEM_VS_FORM}
      />
      <GuideSection id="rr-cost-heading" label="What it costs" title="What you pay, and to whom" tone="gray">
        <p>
          The reservation integration is part of the Growth plan ({planPrice("growth")}) and Restaurant Pro (
          {planPrice("pro")}), together with the website, hosting, menu and monthly updates. A reservation system, if you
          use one, bills you directly for its subscription and any per-guest fees.
        </p>
        <p>
          Read the <InlineLink href="/restaurant-websites/cost">restaurant website cost guide</InlineLink> for the full
          picture, or try the three-step booking flow on our <InlineLink href={DEMO_HREF}>live demo restaurant</InlineLink>
          . Taking orders too? See{" "}
          <InlineLink href="/restaurant-websites/online-ordering">online ordering on your own website</InlineLink>.
        </p>
      </GuideSection>
      <Faqs id="rr-faq-heading" title="Reservation questions" items={FAQS} />
      <Related
        id="rr-related-heading"
        label="More on restaurant websites"
        items={[
          ["Restaurant websites", "/restaurant-websites"],
          ["Online ordering websites", "/restaurant-websites/online-ordering"],
          ["Restaurant website cost guide", "/restaurant-websites/cost"],
          ["Try the live demo", DEMO_HREF],
          ["Sitios web para restaurantes", "/es/restaurant-websites"],
        ]}
      />
      <PhotoCta
        id="rr-cta-heading"
        photo={{ src: "/restaurant/room-moody.jpg", alt: "A dimly lit restaurant dining room set for service", position: "50% 50%" }}
        thumb="/restaurant/cocktails.jpg"
        title="Find out where your bookings are slipping away"
        body="We will look at your website and Google listing on a phone, the way a guest trying to book a table does, and walk you through what we find."
        primary={{ label: "Get a free review", href: REVIEW_HREF }}
      />
      <GuideBreadcrumbs name="Reservations" path={PATH} />
    </>
  );
}
