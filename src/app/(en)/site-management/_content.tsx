import type { FeatureGroup } from "@/components/retell/features-scroller";
import type { BrandSlug } from "@/components/retell/brands";
import { carePlans, formatCarePrice } from "@/data/care-plans";
import {
  CareReportMock,
  ChangeRequestMock,
  MonitorMock,
  UpdatesMock,
} from "./_components/mocks";

/**
 * /site-management copy on the shared Retell-style kit, 2026-10-13. Plans
 * live in data/care-plans.ts (WHMCS ServerCare, pids 17–19). The first four
 * FAQs are the page's existing answers, carried over unchanged.
 */

const PATH = "/site-management";

export const STEPS = [
  {
    title: "Pick a ServerCare plan",
    body: "Essential, Plus or Premium: the plans differ in how often updates, scans and reports happen, how many content hours you get, and how fast support answers.",
  },
  {
    title: "We back it up and take over",
    body: "Daily backups start on day one. Then updates, security scans and link checks run on your plan’s schedule: monthly, bi-weekly or weekly.",
  },
  {
    title: "Send us the changes",
    body: "New opening hours, a team member, a price update: 1, 2 or 4 hours of content updates a month, depending on your plan.",
  },
  {
    title: "Get the report",
    body: "A performance report on your plan’s schedule: what was updated, what was found, and how fast the site is.",
  },
] as const;

export const USES = [
  {
    title: "Updates done, so nothing breaks or gets hacked",
    body: "Plugins go out of date, themes fall behind, and an unmaintained WordPress site is a security incident with a date on it. Updates run monthly on Essential, bi-weekly on Plus and weekly on Premium.",
    src: "/mock/care-mechanic.jpg",
    alt: "A smiling mechanic leaning on an open car in his garage",
    position: "center 35%",
  },
  {
    title: "Watched around the clock",
    body: "24/7 uptime monitoring on every plan, with email alerts on Essential and instant alerts on Plus. Premium adds an uptime SLA, malware removal and automatic removal from weekly scans.",
    src: "/mock/care-vet.jpg",
    alt: "A veterinarian sitting with a dog in his clinic",
    position: "center 40%",
  },
  {
    title: "Changes made without you logging in",
    body: "Swap a phone number, add a team member, update your hours. Every plan includes content updates: 1 hour a month on Essential, 2 on Plus and 4 on Premium.",
    src: "/mock/care-dental.jpg",
    alt: "A dentist at work in a bright, modern dental office",
    position: "center 40%",
  },
  {
    title: "Fast enough to keep visitors",
    body: "Speed optimization on every plan, enhanced on Plus, and on Premium advanced optimization with a CDN set up, so pages load quickly wherever your customers are.",
    src: "/mock/care-tablet.jpg",
    alt: "A smiling woman reading on a tablet at a wooden table",
    position: "center 40%",
  },
  {
    title: "Still visible on Google",
    body: "Broken links and slow pages quietly cost rankings. Link checks run on every plan, with SEO audits quarterly on Essential, bi-monthly on Plus and monthly with recommendations on Premium.",
    src: "/mock/care-laptop.jpg",
    alt: "A business owner smiling at his laptop",
    position: "center 35%",
  },
];

export const PROMISES = [
  {
    title: "Backed up every day",
    body: "Daily backups on every plan, so a bad update or a bad day is a restore, not a rebuild.",
  },
  {
    title: "Told when something happens",
    body: "If the site goes down or a scan finds something, you hear about it from us, not from a customer.",
  },
  {
    title: "Monthly, and you can stop",
    body: "ServerCare is a monthly service, not a long contract. We would rather keep you by doing the work.",
  },
] as const;

export const GROUPS: FeatureGroup[] = [
  {
    tab: "Update",
    visual: <UpdatesMock />,
    backdrop: "/mock/care-typing.jpg",
    features: [
      [
        "Core, plugins and theme",
        "WordPress, plugins and theme kept current: monthly, bi-weekly or weekly by plan.",
      ],
      [
        "Backed up before every change",
        "Daily backups on every plan, so any update can be rolled back.",
      ],
      [
        "Held when it is risky",
        "An update that changes how something works is checked before it goes on your site.",
      ],
    ],
  },
  {
    tab: "Watch",
    visual: <MonitorMock />,
    backdrop: "/mock/care-vet.jpg",
    features: [
      [
        "24/7 uptime monitoring",
        "Email alerts on Essential, instant alerts on Plus, alerts and an uptime SLA on Premium.",
      ],
      [
        "Malware scans",
        "Monthly on Essential, bi-weekly on Plus, weekly with automatic removal on Premium.",
      ],
      [
        "Broken-link checks",
        "Run on the same schedule, so visitors and Google don’t hit dead ends.",
      ],
    ],
  },
  {
    tab: "Change",
    visual: <ChangeRequestMock />,
    backdrop: "/mock/care-dental.jpg",
    features: [
      [
        "Content updates included",
        "1, 2 or 4 hours a month for the small changes a business site always needs.",
      ],
      [
        "Ask the way you like",
        "Email on Essential, email and chat on Plus, and priority email, chat and phone on Premium.",
      ],
      [
        "Bigger work, quoted",
        "A redesign or a new feature is a project: our web development team quotes it separately.",
      ],
    ],
  },
  {
    tab: "Report",
    visual: <CareReportMock />,
    backdrop: "/mock/care-laptop.jpg",
    features: [
      [
        "Performance reports",
        "Monthly on Essential, bi-weekly on Plus, weekly with in-depth analytics on Premium.",
      ],
      [
        "SEO audits",
        "Quarterly, bi-monthly or monthly with recommendations, so the site stays visible.",
      ],
      [
        "Speed kept in check",
        "Speed optimization on every plan, with CDN setup on Premium.",
      ],
    ],
  },
];

export const TOOLS: readonly [BrandSlug[], BrandSlug[]] = [
  ["wordpress", "woocommerce", "php", "mysql", "cpanel", "googlesearchconsole"],
  [
    "pagespeedinsights",
    "lighthouse",
    "googleanalytics",
    "googletagmanager",
    "git",
    "xml",
  ],
];

export const FAQS = [
  {
    question: "How is this different from managed hosting?",
    answer:
      "Managed hosting is the server: patching, firewall, backups, the operating system. Site management is what you built on top of it: plugin and theme updates, content changes, broken links, forms that stopped sending. You can have either without the other, though most people who want one eventually want both.",
  },
  {
    question: "Do you make content changes?",
    answer:
      "Yes, within an agreed monthly allowance. Swapping a phone number, adding a team member, updating opening hours, publishing a page you have written — that is the work. A redesign or a new feature is a project, and we will quote it rather than absorb it and rush.",
  },
  {
    question: "What happens when an update breaks the site?",
    answer:
      "It gets caught before you see it, because updates are applied on a staging copy and checked first. If something does break in production, restoring a backup is free and immediate, and then we work out which update caused it.",
  },
  {
    question: "Is there a contract?",
    answer:
      "It is a monthly service and you can stop it. What you should not do is stop it and assume the site will look after itself — an unmaintained WordPress site is a security incident with a date on it.",
  },
  {
    question: "How much does website maintenance cost?",
    answer: `ServerCare plans are billed monthly: ${carePlans
      .map(
        (p) =>
          `${p.name} is ${formatCarePrice(p.price)}/mo with ${p.hours} hour${p.hours > 1 ? "s" : ""} of content updates`,
      )
      .join(", ")}.`,
  },
  {
    question: "Which ServerCare plan do I need?",
    answer:
      "Essential suits a small site that changes now and then. Plus suits a site that does real business, with bi-weekly updates and chat support. Premium suits sites that cannot go down, with weekly care, malware removal, CDN setup, an uptime SLA and phone support.",
  },
].map((f) => ({ ...f, scopes: [PATH] }));

export const RELATED = [
  ["Managed hosting", "/managed-hosting"],
  ["WordPress hosting", "/wordpress-hosting"],
  ["Web development", "/website-development"],
  ["Website design", "/website-design"],
  ["SEO services", "/seo"],
  ["Free site migration", "/migrations"],
] as const;
