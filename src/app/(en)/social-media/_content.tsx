import type { FeatureGroup } from "@/components/retell/features-scroller";
import type { BrandSlug } from "@/components/retell/brands";
import { formatSocialPrice, socialPlans } from "@/data/social-plans";
import {
  CalendarMock,
  InboxMock,
  PostMock,
  SocialReportMock,
} from "./_components/mocks";

/**
 * /social-media copy on the shared Retell-style kit, 2026-10-13. Plans live
 * in data/social-plans.ts (the WHMCS store). Every feature named here is one
 * a plan in that file includes, with the tier that includes it.
 */

export const STEPS = [
  {
    title: "Tell us about your business",
    body: "Your customers, your voice, what you sell and what you want more of. We optimize your profiles and research the hashtags people in your area actually follow.",
  },
  {
    title: "Get next month’s plan",
    body: "Your posts planned on a content calendar with branded graphics and written captions, from 8 a month on Starter to 25+ on Enterprise.",
  },
  {
    title: "We post and reply",
    body: "Posts are scheduled and published for you. From Growth up, comments are monitored and answered; on Enterprise, community management is daily.",
  },
  {
    title: "See what it did",
    body: "A performance report every month: reach, followers and clicks. Growth adds a monthly strategy call, Pro bi-weekly updates and Enterprise weekly calls.",
  },
] as const;

export const USES = [
  {
    title: "Show up every week without lifting a finger",
    body: "The hard part is not writing one post. It is writing the ninetieth while running the business. We plan, design, write and schedule every post, so your feed stays active even on your busiest weeks.",
    src: "/mock/social-food.jpg",
    alt: "A person photographing a table of food with their phone",
    position: "center 45%",
  },
  {
    title: "Posts that look like your brand, not a template",
    body: "Branded graphics on every plan, custom carousels from Growth, and from Pro a full brand design for your stories and highlight covers, so your profile looks the same everywhere.",
    src: "/mock/social-hero.jpg",
    alt: "A fashion designer photographing a dress in her studio",
    position: "center 40%",
  },
  {
    title: "Short-form video that gets seen",
    body: "Reels and short videos reach people who do not follow you yet. Pro adds short-form video content creation, and Enterprise adds Reels on top.",
    src: "/mock/social-video.jpg",
    alt: "A phone on a tripod set up to film beside a window",
    position: "center 50%",
  },
  {
    title: "Every comment and message answered",
    body: "A question left unanswered is a customer lost. From Growth up we monitor and reply to comments; Enterprise adds daily community management and influencer outreach.",
    src: "/mock/social-engage.jpg",
    alt: "A smiling woman replying to messages on her phone at a café table",
    position: "center 35%",
  },
  {
    title: "Know what your social media is doing for you",
    body: "Every plan includes a monthly performance report. Pro adds competitor analysis and paid ads setup on Meta or Google; Enterprise adds in-depth ROI reporting and a dedicated account manager.",
    src: "/mock/social-report.jpg",
    alt: "A woman looking at her phone at a wooden table",
    position: "center 40%",
  },
];

export const PROMISES = [
  {
    title: "Your voice, not an agency’s",
    body: "Captions are written to sound like your business talking to its regulars, not like a marketing department.",
  },
  {
    title: "No bought followers",
    body: "No fake followers, no engagement pods, no bots. Every number in your report is real people.",
  },
  {
    title: "Reports that mean something",
    body: "Reach, clicks and messages, tied back to what they led to. Not a screenshot of likes.",
  },
] as const;

export const GROUPS: FeatureGroup[] = [
  {
    tab: "Plan",
    visual: <CalendarMock />,
    backdrop: "/mock/social-latte.jpg",
    features: [
      [
        "A month planned ahead",
        "Your posts laid out on a content calendar, from 8 a month on Starter up to 25+ on Enterprise.",
      ],
      [
        "Profiles set up to convert",
        "Your bio, links, highlights and contact buttons optimized so visitors know what to do next.",
      ],
      [
        "Hashtags people follow",
        "Hashtag research on every plan; Enterprise adds trend optimization.",
      ],
    ],
  },
  {
    tab: "Create",
    visual: <PostMock />,
    backdrop: "/mock/social-food.jpg",
    features: [
      [
        "Branded graphics and carousels",
        "Designed posts on every plan, custom carousels from Growth, advanced graphics from Pro.",
      ],
      [
        "Captions written for you",
        "Professional caption writing on every plan, in your voice.",
      ],
      ["Short-form video", "Video content creation on Pro, plus Reels on Enterprise."],
    ],
  },
  {
    tab: "Engage",
    visual: <InboxMock />,
    backdrop: "/mock/social-engage.jpg",
    features: [
      [
        "Comments monitored and answered",
        "Community engagement and comment monitoring from Growth up.",
      ],
      [
        "Daily community management",
        "On Enterprise, engagement handled every day, plus influencer outreach and collaboration strategy.",
      ],
      [
        "Account monitoring",
        "Every plan watches your accounts, so nothing odd happens unnoticed.",
      ],
    ],
  },
  {
    tab: "Report",
    visual: <SocialReportMock />,
    backdrop: "/mock/social-report.jpg",
    features: [
      [
        "A monthly performance report",
        "Reach, followers and clicks every month on every plan, more detail from Growth.",
      ],
      [
        "Strategy calls",
        "Monthly on Growth, bi-weekly updates on Pro and weekly calls on Enterprise.",
      ],
      [
        "Paid ads, set up right",
        "On Pro, paid ads set up on Meta or Google (setup only), alongside competitor analysis.",
      ],
    ],
  },
];

// Only the networks a plan actually covers (plus Meta, for Pro's ads setup).
export const TOOLS: readonly [BrandSlug[], BrandSlug[]] = [
  ["instagram", "facebook", "linkedin", "tiktok", "x", "instagram", "facebook", "linkedin"],
  ["tiktok", "meta", "x", "instagram", "facebook", "linkedin", "tiktok", "meta"],
];

export const FAQS = [
  {
    question: "How much does social media management cost?",
    answer: `Plans are billed monthly: ${socialPlans
      .map(
        (p) =>
          `${p.name} is ${formatSocialPrice(p.price)}/mo for ${p.platforms} platform${p.platforms > 1 ? "s" : ""} and ${p.posts} posts`,
      )
      .join(", ")}.`,
  },
  {
    question: "Which platforms do you manage?",
    answer:
      "Starter covers one platform, Facebook or Instagram. Growth covers two of Facebook, Instagram or LinkedIn. Pro covers three, adding TikTok as an option. Enterprise covers five: Facebook, Instagram, LinkedIn, TikTok and X.",
  },
  {
    question: "Do I approve posts before they go out?",
    answer:
      "Your posts are planned on a content calendar ahead of the month, so you can see what is coming before it publishes. Tell us when you sign up how you want to review them and we will build that into the plan.",
  },
  {
    question: "Do you create videos and Reels?",
    answer:
      "Short-form video content creation is included on Pro, and Enterprise includes short-form video and Reels. Starter and Growth focus on designed graphics and carousels.",
  },
  {
    question: "Do you reply to comments and messages?",
    answer:
      "Community engagement and comment monitoring are included from Growth up, and Enterprise includes daily community management. Starter includes account monitoring.",
  },
  {
    question: "Do you run paid ads?",
    answer:
      "Pro includes paid ads setup on Meta or Google. That is setup only: the ad spend itself is paid by you directly to the platform.",
  },
  {
    question: "How do you measure results?",
    answer:
      "Every plan includes a monthly performance report. Growth adds a more detailed report and a monthly strategy call, Pro adds bi-weekly strategy and analytics updates, and Enterprise adds in-depth performance and ROI reporting with weekly calls.",
  },
] as const;

export const RELATED = [
  ["Marketing", "/marketing"],
  ["SEO services", "/seo"],
  ["Website design", "/website-design"],
  ["Web development", "/website-development"],
  ["Automations", "/automations"],
  ["Business solutions", "/business-solutions"],
] as const;
