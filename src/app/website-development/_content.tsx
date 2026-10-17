import type { FeatureGroup } from "@/components/retell/features-scroller";
import type { BrandSlug } from "@/components/retell/brands";
import { DeployMock, ScopeMock, StagingMock } from "./_components/mocks";

/**
 * /website-development copy on the shared Retell-style kit
 * (components/retell/kit.tsx), 2026-10-13. Commitments, rates and FAQs stay
 * in ./_copy.ts, which carries the rules they were written under (Edgar's own
 * rate card, no turnaround promise, no invented reviews).
 */

export const STEPS = [
  {
    title: "Tell us the outcome",
    body: "Describe what it has to do in your own words, not as a feature list. You get one named contact who holds the scope and the reasons behind each decision.",
  },
  {
    title: "Get a scope and a price",
    body: "We come back with a written scope and a fixed price, or a range with the specific things that would move it. Nothing starts until you have agreed both.",
  },
  {
    title: "Review it on a staged copy",
    body: "We build on a copy of your site, never the running one. You click through the real thing and leave comments where you want changes.",
  },
  {
    title: "Approve and go live",
    body: "Once you say yes, we deploy it onto servers we already operate, with backups, certificates and patching already handled.",
  },
] as const;

export const USES = [
  {
    title: "Build the feature a plugin can’t",
    body: "Custom features, customer portals and logged-in areas built around how your business actually works, on WordPress or as a custom application when an off-the-shelf platform is the wrong tool.",
    src: "/mock/webdev-build.jpg",
    alt: "A developer working at her desk with two monitors",
    position: "center 35%",
  },
  {
    title: "Take bookings and payments your way",
    body: "Booking and scheduling that follows your rules, and payments, checkout and subscription flows that match how you sell, including deposits, lead times and closed days.",
    src: "/mock/webdev-store.jpg",
    alt: "An online store owner checking an order on her phone beside a stack of parcels",
    position: "center 40%",
  },
  {
    title: "Connect the tools you already use",
    body: "Your site talking to your calendar, your email list, your CRM and your payment provider, and data moved out of spreadsheets and into the site where it belongs.",
    src: "/mock/webdev-team.jpg",
    alt: "A small team working together around laptops at a meeting table",
    position: "center 45%",
  },
  {
    title: "Rescue a build someone walked away from",
    body: "A half-finished project, a theme that fights you, or a site cleaned up after a hack with the hole closed. We pick it up, tell you honestly what it needs and finish it.",
    src: "/mock/webdev-fix.jpg",
    alt: "A developer thinking through a problem at her computer",
    position: "center 40%",
  },
  {
    title: "Make a slow site fast enough to keep people",
    body: "Bloated images, heavy plugins and slow queries trimmed until pages load fast on a phone, with design changes that were never in the theme made along the way.",
    src: "/mock/webdev-review.jpg",
    alt: "Two people reviewing code together on a laptop",
    position: "center 40%",
  },
];

export const GROUPS: FeatureGroup[] = [
  {
    tab: "Scope",
    visual: <ScopeMock />,
    backdrop: "/mock/webdev-team.jpg",
    features: [
      [
        "One person who owns the answer",
        "A named contact for the whole project, not a queue. You never re-explain your own business to whoever picked up the ticket.",
      ],
      [
        "A written scope you have read",
        "Every line of work spelled out before anything starts, so you can see exactly what the price buys.",
      ],
      [
        "A fixed price, or an honest range",
        "A defined project gets a fixed price, or a range with the specific things that would move it.",
      ],
    ],
  },
  {
    tab: "Build",
    visual: <StagingMock />,
    backdrop: "/mock/webdev-code.jpg",
    features: [
      [
        "Built on a staged copy",
        "Work happens on a copy of your site. Your live site keeps running, untouched, the whole time.",
      ],
      [
        "Click through the real thing",
        "You review the working feature, not a description of it, and leave comments right where you want changes.",
      ],
      [
        "WordPress, WooCommerce or custom",
        "WordPress and WooCommerce are the most common; custom applications when an off-the-shelf platform is the wrong tool.",
      ],
    ],
  },
  {
    tab: "Launch",
    visual: <DeployMock />,
    backdrop: "/mock/webdev-build.jpg",
    features: [
      [
        "Deployed onto servers we run",
        "Approved work lands on infrastructure we already operate, so there is no second company to coordinate with.",
      ],
      [
        "It survives after launch",
        "Backups, certificates, patching and scaling are already handled. A build that breaks in month four is not finished.",
      ],
      [
        "Changes later, when you want them",
        "Ongoing work is what the retainer is for, and you can start it after launch rather than deciding now.",
      ],
    ],
  },
];

export const TOOLS: readonly [BrandSlug[], BrandSlug[]] = [
  [
    "wordpress",
    "woocommerce",
    "php",
    "mysql",
    "javascript",
    "react",
    "nextdotjs",
    "nodedotjs",
    "cpanel",
  ],
  [
    "stripe",
    "paypal",
    "googlecalendar",
    "calendly",
    "zapier",
    "mailchimp",
    "hubspot",
    "googleanalytics",
    "git",
  ],
];

export const RELATED = [
  ["Website design", "/website-design"],
  ["Restaurant websites", "/restaurant-websites"],
  ["SEO services", "/seo"],
  ["WordPress hosting", "/wordpress-hosting"],
  ["Cloud hosting", "/cloud-hosting"],
  ["Free site migration", "/migrations"],
  ["Automations", "/automations"],
] as const;
