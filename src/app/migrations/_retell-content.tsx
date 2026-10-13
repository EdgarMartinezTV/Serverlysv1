import type { FeatureGroup } from "@/components/retell/features-scroller";
import type { BrandSlug } from "@/components/retell/brands";
import { CutoverMock, MoveProgressMock, StagingCheckMock } from "./_components/mocks";

/**
 * /migrations copy on the shared Retell-style kit, 2026-10-13. Migration is
 * free with a cloud hosting plan, so the pricing panel is the cloud plans
 * (data/pricing.ts). Claims here are the ones the page already made: free,
 * unlimited, staged first, switched when you say, no downtime.
 * FAQs stay in ./_content.ts.
 */

export const STEPS = [
  {
    title: "Choose a cloud plan",
    body: "Pick the cloud hosting plan with the resources your site needs. Migration is free with every plan, for one site or a hundred.",
  },
  {
    title: "Send us the details",
    body: "Your site’s address, the logins for your current host and anything we should know. That is the only part you do.",
  },
  {
    title: "We copy it to a staged site",
    body: "Files, database and email are moved onto Serverlys while your live site keeps running and taking orders on the old host.",
  },
  {
    title: "Check it, then we switch",
    body: "You look over the staged copy. When you say go, we switch DNS at a time you pick, so there is no gap in service.",
  },
] as const;

export const USES = [
  {
    title: "Moved for you, not by you",
    body: "No exporting databases, no FTP, no guessing which files matter. Send us your logins and our team moves the site, the database and the email onto Serverlys.",
    src: "/mock/move-boxes.jpg",
    alt: "A business owner unpacking boxes in her new space",
    position: "center 40%",
  },
  {
    title: "Open for business the whole time",
    body: "Your site stays live on your old host while it is copied and checked. Customers keep browsing and ordering; nothing switches until the new copy is ready.",
    src: "/mock/move-open.jpg",
    alt: "A shop owner proudly holding up an open sign in his window",
    position: "center 35%",
  },
  {
    title: "Check every page before it goes live",
    body: "The move lands on a staged copy first. You click through it, we fix anything that looks wrong, and only then is it switched over.",
    src: "/mock/move-phone.jpg",
    alt: "A craftsman smiling at his phone in his workshop",
    position: "center 35%",
  },
  {
    title: "One site or a hundred, still free",
    body: "Migration is free with any cloud hosting plan, whether you are moving a single brochure site or every client site an agency looks after.",
    src: "/mock/move-carry.jpg",
    alt: "A man carrying a crate of belongings into a new office",
    position: "center 40%",
  },
  {
    title: "Faster from the day it lands",
    body: "Cloud plans run on LiteSpeed servers with NVMe storage and caching built in, with free SSL and daily backups, so the site you move arrives faster and safer than it left.",
    src: "/mock/move-celebrate.jpg",
    alt: "A business owner celebrating at her laptop surrounded by parcels",
    position: "center 40%",
  },
];

export const PROMISES = [
  {
    title: "Free, every time",
    body: "Migration costs nothing with a cloud hosting plan, whether that is one site or a hundred.",
  },
  {
    title: "Staged before it switches",
    body: "Your site is copied and checked on Serverlys before anything changes for your visitors.",
  },
  {
    title: "Switched when you say",
    body: "DNS changes at a time you pick, so there is no gap in service and no surprise.",
  },
] as const;

export const GROUPS: FeatureGroup[] = [
  {
    tab: "Copy",
    visual: <MoveProgressMock />,
    backdrop: "/mock/move-room.jpg",
    features: [
      [
        "Files, database and email",
        "Everything that makes up the site, moved by our team, not by a plugin you have to babysit.",
      ],
      [
        "WordPress and more",
        "WordPress and WooCommerce are the most common, and other sites move too.",
      ],
      [
        "Live the whole time",
        "Your current site keeps running on the old host while the copy is made.",
      ],
    ],
  },
  {
    tab: "Check",
    visual: <StagingCheckMock />,
    backdrop: "/mock/move-desk.jpg",
    features: [
      [
        "A staged copy on Serverlys",
        "The move lands on a staging address first, where you can click through the real thing.",
      ],
      [
        "We fix what looks wrong",
        "Broken images, odd redirects or a form that will not send are sorted before the switch.",
      ],
      [
        "Nothing changes until you say",
        "Your visitors see the old site until you are happy with the new one.",
      ],
    ],
  },
  {
    tab: "Switch",
    visual: <CutoverMock />,
    backdrop: "/mock/move-open.jpg",
    features: [
      [
        "DNS switched at a time you pick",
        "We change where your domain points when it suits you, so there is no gap in service.",
      ],
      [
        "SSL and backups from day one",
        "A free SSL certificate and daily backups are in place on the new plan.",
      ],
      [
        "Faster hosting underneath",
        "LiteSpeed, NVMe storage and caching built in, on every cloud plan.",
      ],
    ],
  },
];

export const TOOLS: readonly [BrandSlug[], BrandSlug[]] = [
  ["wordpress", "woocommerce", "cpanel", "php", "mysql", "javascript"],
  ["react", "nextdotjs", "nodedotjs", "git", "googleanalytics", "googlesearchconsole"],
];

export const RELATED = [
  ["Cloud hosting", "/cloud-hosting"],
  ["WordPress hosting", "/wordpress-hosting"],
  ["Ecommerce hosting", "/ecommerce-hosting"],
  ["Site management", "/site-management"],
  ["Website design", "/website-design"],
  ["Compare all plans", "/pricing"],
] as const;
