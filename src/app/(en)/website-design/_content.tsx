import type { FeatureGroup } from "@/components/retell/features-scroller";
import type { BrandSlug } from "@/components/retell/brands";
import { formatDesignPrice, designPlans } from "@/data/design-plans";
import { HomepageMock, LaunchMock, StyleGuideMock } from "./_components/mocks";

/**
 * /website-design copy on the shared Retell-style kit, 2026-10-13. Plans and
 * prices live in data/design-plans.ts. Nothing here promises a turnaround
 * time or claims a result; "every plan" means what designIncludes lists.
 */

export const STEPS = [
  {
    title: "Tell us what the site has to do",
    body: "Book, call, order or enquire: we start from the two or three actions that matter to your business, and design every page around them.",
  },
  {
    title: "Approve a written scope",
    body: "Your plan, your page list and a fixed price in writing. Anything beyond your plan is priced in the scope before work starts, never after.",
  },
  {
    title: "See the design first",
    body: "Your custom homepage and web style guide come first. You approve the look before we build the rest of the pages on it.",
  },
  {
    title: "Launch, measured",
    body: "We build it on WordPress, set up analytics and launch it, so from day one you can see who visits and what they do.",
  },
] as const;

export const USES = [
  {
    title: "Designed around the call, the booking or the quote",
    body: "Most small-business sites look fine and convert badly. Yours is designed around the action that pays the bills, with the button for it where people look first, on every page.",
    src: "/mock/design-call.jpg",
    alt: "A smiling business owner taking a call on his phone",
    position: "center 35%",
  },
  {
    title: "Looks right on the phone in your customer’s hand",
    body: "Most visitors arrive on a phone, often in a hurry. Every page is designed for a small screen first, with tap-to-call and short forms that work with a thumb.",
    src: "/mock/design-mobile.jpg",
    alt: "An electrician in a hard hat installing wiring",
    position: "center 35%",
  },
  {
    title: "Built to be found, not retrofitted",
    body: "Structure, page titles, speed and an SEO-friendly blog are part of the build. Retrofitting SEO onto a finished site always costs more, and our SEO plans pick up from here if you want them.",
    src: "/mock/design-local.jpg",
    alt: "A landscaper trimming the edge of a lawn outside a house",
    position: "center 40%",
  },
  {
    title: "Turns visits into leads while you’re on the job",
    body: "Clear quote forms and contact details mean enquiries arrive while you work, and analytics shows which pages bring them. Add ConvoAI and visitors get answers in the moment, too.",
    src: "/mock/design-leads.jpg",
    alt: "A roofer working on a roof with a power drill",
    position: "center 40%",
  },
  {
    title: "A custom design, not a template",
    body: "Your homepage is designed from scratch, and a web style guide records its colours, type and buttons so every page after it, ours or yours, stays consistent.",
    src: "/mock/design-wireframe.jpg",
    alt: "Hand-drawn watercolour wireframe sketches of website layouts",
    position: "center 50%",
  },
];

export const PROMISES = [
  {
    title: "A price against a written scope",
    body: "Your plan, page list and price are agreed in writing before any work starts. If something would change the price, you hear it first.",
  },
  {
    title: "You approve the design first",
    body: "The homepage and style guide come before the build. Nothing goes live until you have looked at it and said yes.",
  },
  {
    title: "Mobile-first and accessible",
    body: "Keyboard, contrast and readable type on a phone are part of the design, not a later pass.",
  },
] as const;

export const GROUPS: FeatureGroup[] = [
  {
    tab: "Design",
    visual: <StyleGuideMock />,
    backdrop: "/mock/design-tablet.jpg",
    features: [
      [
        "A 100% custom homepage",
        "Designed from scratch around your business and the action you want visitors to take, not picked from a template gallery.",
      ],
      [
        "A web style guide",
        "Your colours, type and buttons documented, so every page we build, and every page you add later, matches.",
      ],
      [
        "Your approval before the build",
        "You see and sign off the design before the rest of the site is built on it.",
      ],
    ],
  },
  {
    tab: "Build",
    visual: <HomepageMock />,
    backdrop: "/mock/design-studio.jpg",
    features: [
      [
        "WordPress implementation",
        "Built on WordPress, so you can change text, photos and posts yourself without calling anyone.",
      ],
      [
        "5, 10 or 15 subpages",
        "Services, about, contact, service areas: your plan sets how many pages come designed and built.",
      ],
      [
        "Fast and mobile-first",
        "Every page designed for the phone first and built to load quickly on it.",
      ],
    ],
  },
  {
    tab: "Launch",
    visual: <LaunchMock />,
    backdrop: "/mock/design-local.jpg",
    features: [
      [
        "An SEO-friendly blog",
        "A blog set up with clean structure and titles, ready to publish the posts that bring in searches.",
      ],
      [
        "Analytics setup",
        "Google Analytics in place at launch, so you can see visits, calls and quote requests from day one.",
      ],
      [
        "Room to grow",
        "SEO plans, hosting and development hours pick up from launch whenever you want them.",
      ],
    ],
  },
];

export const TOOLS: readonly [BrandSlug[], BrandSlug[]] = [
  [
    "wordpress",
    "woocommerce",
    "googleanalytics",
    "googletagmanager",
    "googlesearchconsole",
    "pagespeedinsights",
  ],
  ["google", "googlemaps", "calendly", "googlecalendar", "stripe", "mailchimp", "yelp"],
];

export const FAQS = [
  {
    question: "How much does a custom website cost?",
    answer: `Our website design plans are one-time project prices: ${designPlans
      .map(
        (p) =>
          `${p.name} starts at ${formatDesignPrice(p.price)} with ${p.subpages} subpages`,
      )
      .join(
        ", ",
      )}. Every plan includes a custom homepage, WordPress implementation, a web style guide, an SEO-friendly blog and analytics setup. Your final price is agreed in a written scope before work starts.`,
  },
  {
    question: "What counts as a subpage?",
    answer:
      "Any page beyond the homepage, such as About, a service page, a service-area page or Contact. If you need more pages than your plan includes, the extra pages are priced in your written scope before any work starts.",
  },
  {
    question: "Can I edit the website myself?",
    answer:
      "Yes. Every site is built on WordPress, so you can change text, swap photos and publish blog posts yourself. The web style guide means anything you add can match the rest of the site.",
  },
  {
    question: "What is a web style guide?",
    answer:
      "A short reference of your site’s colours, typefaces, buttons and spacing. It keeps every page consistent, and it is what a designer or developer uses later to add pages that look like they belong.",
  },
  {
    question: "How long does a website take?",
    answer:
      "It depends on the plan and how quickly content and feedback come back, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit to anything.",
  },
  {
    question: "Will my new website show up on Google?",
    answer:
      "Every site is built with clean structure, page titles, speed and an SEO-friendly blog, which is the foundation search engines need. Ranking for competitive searches takes ongoing work, which is what our SEO plans are for.",
  },
  {
    question: "What happens after launch?",
    answer:
      "Your analytics are live from day one. For changes and new features after launch, our web development team works by the hour or on a monthly retainer, and SEO plans can pick up the search side.",
  },
] as const;

export const RELATED = [
  ["Restaurant websites", "/restaurant-websites"],
  ["Cleaning company websites", "/cleaning-company-websites"],
  ["Web development", "/website-development"],
  ["SEO services", "/seo"],
  ["Site management", "/site-management"],
  ["WordPress hosting", "/wordpress-hosting"],
  ["Free site migration", "/migrations"],
  ["Business email", "/business-email"],
] as const;
