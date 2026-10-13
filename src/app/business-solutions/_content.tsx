import type { FeatureGroup } from "@/components/retell/features-scroller";
import type { BrandSlug } from "@/components/retell/brands";
import { businessPlans, formatBusinessPrice } from "@/data/business-plans";
import { AccountMock, InvoiceMock, LeadMock } from "./_components/mocks";

/**
 * /business-solutions copy on the shared Retell-style kit, 2026-10-13. The
 * all-in-one plans are the WHMCS Contractor Website Plans
 * (data/business-plans.ts); individual services are priced from their own
 * data files in ./_components/services.tsx.
 */

const PATH = "/business-solutions";

export const STEPS = [
  {
    title: "Tell us how your business runs",
    body: "What you sell, where you work and how customers reach you. We recommend an all-in-one plan or just the pieces you are missing.",
  },
  {
    title: "We build your website",
    body: "On an all-in-one plan your website is built for you at no extra cost: up to 4 pages on Growth, up to 7 on Pro Contractor.",
  },
  {
    title: "Everything goes live together",
    body: "Hosting, SSL, backups, analytics and local SEO set up together, and your existing site moved over free if you have one.",
  },
  {
    title: "One team keeps it running",
    body: "One account, one bill and one team to call. When something needs fixing, nobody can blame another supplier.",
  },
] as const;

export const USES = [
  {
    title: "One supplier instead of four",
    body: "Most small businesses end up with a host, a registrar, a web designer and a marketing agency who have never spoken. When something breaks, each points at the others. With Serverlys, it is one team.",
    src: "/mock/biz-contractors.jpg",
    alt: "Two contractors in hard hats reviewing plans on a job site",
    position: "center 35%",
  },
  {
    title: "A website that brings in work",
    body: "Mobile-first design with contact forms and click-to-call on every plan. Pro Contractor adds conversion-optimized landing pages and service-area SEO pages for each place you work.",
    src: "/mock/biz-salon.jpg",
    alt: "A smiling salon owner in her salon",
    position: "center 35%",
  },
  {
    title: "Enquiries answered after hours",
    body: "On Pro Contractor, an AI chat assistant answers visitors on your site day and night and books appointments, with email and SMS lead notifications sent straight to you.",
    src: "/mock/biz-kitchen.jpg",
    alt: "A business owner checking a message on his phone in a bright kitchen",
    position: "center 35%",
  },
  {
    title: "Reviews and leads, tracked",
    body: "Pro Contractor automates review requests after a job and tracks every lead in a CRM-ready format, with a monthly performance report to show what the site brought in.",
    src: "/mock/biz-restaurant.jpg",
    alt: "Two restaurant owners standing together in their restaurant",
    position: "center 35%",
  },
  {
    title: "Kept fast, safe and current",
    body: "Daily backups, free SSL and speed optimization on every plan. Pro Contractor adds speed and uptime monitoring, priority support and quarterly website improvements.",
    src: "/mock/biz-designer.jpg",
    alt: "A designer on the phone while working at her laptop in her studio",
    position: "center 40%",
  },
];

export const PROMISES = [
  {
    title: "One bill",
    body: "Your website, hosting and the services you add are billed together by one company.",
  },
  {
    title: "One team to call",
    body: "Your site, your hosting and your domain sit with the same team, so nobody passes the problem along.",
  },
  {
    title: "You own your website",
    body: "Your website and your domain are yours, not licensed back to you, and your content stays yours if you ever leave.",
  },
] as const;

export const GROUPS: FeatureGroup[] = [
  {
    tab: "One account",
    visual: <AccountMock />,
    backdrop: "/mock/biz-meeting.jpg",
    features: [
      [
        "Every service in one place",
        "Website, hosting, domain, email and the extras you add, all in one Serverlys account.",
      ],
      [
        "One login, one support team",
        "One place to see everything and one team that knows your whole setup.",
      ],
      [
        "Free migration",
        "If you already have a site, we move it over for you at no cost.",
      ],
    ],
  },
  {
    tab: "More leads",
    visual: <LeadMock />,
    backdrop: "/mock/biz-kitchen.jpg",
    features: [
      [
        "AI chat assistant",
        "On Pro Contractor, visitors get answers and bookings even at 9:42 at night.",
      ],
      [
        "Email and SMS notifications",
        "Every new lead sent to you the moment it comes in.",
      ],
      [
        "Appointment booking",
        "Booking built into the site, so enquiries turn into jobs on the calendar.",
      ],
    ],
  },
  {
    tab: "One bill",
    visual: <InvoiceMock />,
    backdrop: "/mock/biz-deal.jpg",
    features: [
      [
        "One monthly invoice",
        "Your plan and anything you add, from one company, on one bill.",
      ],
      [
        "Website built in",
        "On an all-in-one plan the website is included, not a separate project invoice.",
      ],
      [
        "30-day satisfaction guarantee",
        "The Growth Plan carries a 30-day satisfaction guarantee.",
      ],
    ],
  },
];

export const TOOLS: readonly [BrandSlug[], BrandSlug[]] = [
  [
    "wordpress",
    "woocommerce",
    "google",
    "googlemaps",
    "googleanalytics",
    "googlesearchconsole",
  ],
  ["facebook", "instagram", "googlecalendar", "calendly", "stripe", "mailchimp"],
];

export const FAQS = [
  {
    question: "What are Serverlys business solutions?",
    answer:
      "The whole online side of a small business from one supplier: your website, hosting, domain and email, plus SEO, social media, site management, AI agents and automations if you want them, in one account and on one bill.",
  },
  {
    question: "How much do the all-in-one plans cost?",
    answer: `${businessPlans
      .map(
        (p) =>
          `${p.name} is ${formatBusinessPrice(p.price)}/mo with a website of up to ${p.pages} pages built for you`,
      )
      .join(", ")}. The website build is included in the monthly price.`,
  },
  {
    question: "Is the website really free?",
    answer:
      "On the all-in-one plans, yes: we build your website at no extra cost and you pay the monthly fee for hosting, management and the tools on your plan. Growth includes up to 4 pages and Pro Contractor up to 7.",
  },
  {
    question: "Do the plans only work for contractors?",
    answer:
      "They were designed around service businesses like contractors, where calls, quotes and bookings matter most, but they suit any local business that wins customers through its website and phone.",
  },
  {
    question: "Can I add services later?",
    answer:
      "Yes. SEO, social media, site management, business email, development hours and AI agents can be added to the same account at any time, at their standard prices.",
  },
  {
    question: "I already have a website. Can I still use Serverlys?",
    answer:
      "Yes. We migrate your existing site for free, and you can choose just the services you need rather than an all-in-one plan.",
  },
].map((f) => ({ ...f, scopes: [PATH] }));

export const RELATED = [
  ["Website design", "/website-design"],
  ["Cloud hosting", "/cloud-hosting"],
  ["SEO services", "/seo"],
  ["Social media", "/social-media"],
  ["AI agents", "/ai-agents"],
  ["Automations", "/automations"],
] as const;
