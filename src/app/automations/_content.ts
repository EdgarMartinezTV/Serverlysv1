import type { FaqItem } from "@/components/ref/faqs";

/**
 * Automations page content.
 *
 * WHAT THIS PAGE IS. Serverlys builds and runs automations for businesses: the
 * daily admin — an enquiry that has to become a record, a booking that has to
 * reach a calendar, a form that has to reach the right person — handled by a
 * workflow instead of by someone remembering. Built on n8n, on infrastructure
 * we manage, set up by us and owned by the customer.
 *
 * WHAT IT IS NOT, ANY MORE. This page was briefly a 1:1 clone of
 * hostinger.com/self-hosted-n8n — a VPS page selling KVM plans to people who
 * wanted to self-host n8n themselves. The LAYOUT survived that and is still the
 * reference's (see _components/ and components/ref/kit.tsx); the PROPOSITION
 * did not. Nothing about renting a server belongs here now.
 *
 * Three things went with it, all on the owner's instruction:
 *   · the four KVM plans — we do not sell VPS tiers, and this page is
 *     consultative: every CTA goes to sales and no price is quoted;
 *   · seven named testimonials that were real reviews of HOSTINGER;
 *   · a Google / HostAdvice / WPBeginner strip rating a competitor.
 * Do not reintroduce any of them. Nothing on this page is now a claim about
 * someone else's product or reputation.
 *
 * ⚠ THE ONE CLAIM TO KEEP HONEST. The promise is that automations remove HUMAN
 * error — the forgotten step, the figure typed twice, the enquiry nobody picked
 * up. It must never promise that nothing ever fails: an API goes down, a
 * credential expires. That is exactly why RELIABILITY below sells retries,
 * alerts and a run history rather than perfection. Keep that distinction — it
 * is the difference between a claim we can stand behind and one we cannot.
 */

/* ==========================================================================
   Hero
   ======================================================================== */

export const HERO = {
  eyebrowPrefix: "Automations for ",
  eyebrowAccent: "everyday",
  eyebrowSuffix: " business admin",
  title: "The daily work, done without anyone remembering to do it",
  bullets: [
    "Enquiries, bookings and forms handled the moment they arrive",
    "The same steps every time, whoever is busy",
    "Built on n8n, set up by us, owned by you",
  ],
  cta: "Talk through a workflow",
  guarantee: "A call first — we map the task before quoting anything",
};

/**
 * The sticky rail. Order follows the page, which the Hostinger original's did
 * not — its labels pointed at bands that did not match them.
 */
export const SUBNAV = [
  { id: "how-it-works", label: "How it works" },
  { id: "workflows", label: "Workflows" },
  { id: "integrations", label: "Integrations" },
  { id: "faq", label: "FAQ" },
] as const;

/* ==========================================================================
   How it works — the band that replaced the plan cards
   ======================================================================== */

export const PROCESS = {
  title: "How an automation gets built",
  description:
    "No software to learn and nothing to configure. We start from the task you already do by hand, and you get it back working.",
  steps: [
    {
      key: "map",
      n: "01",
      title: "We map the task",
      body: "What happens today, who does it, and where it gets dropped. The useful detail is usually the exception nobody wrote down.",
    },
    {
      key: "build",
      n: "02",
      title: "We build it",
      body: "On n8n, on infrastructure we run. Connected to the tools you already pay for rather than replacing them.",
    },
    {
      key: "watch",
      n: "03",
      title: "We watch it",
      body: "Every run is recorded. Failures retry, and if one keeps failing a person is told — you should not be the monitoring.",
    },
    {
      key: "own",
      n: "04",
      title: "You own it",
      body: "Open any workflow, see what it does, change it or ask us to. It is not a black box and you are not locked in.",
    },
  ],
  cta: "Book the mapping call",
};

export type IncludedItem = { label: string; addon?: boolean };

/** Repurposed from the reference's "everything you need" panel. */
export const INCLUDED: {
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  columns: readonly (readonly IncludedItem[])[];
  addonLabel: string;
} = {
  titleBefore: "Every automation comes with ",
  titleAccent: "the parts people forget",
  titleAfter: "",
  columns: [
    [
      { label: "Full run history" },
      { label: "Automatic retries on failure" },
      { label: "Alerts when something needs a person" },
    ],
    [
      { label: "Hosting and updates handled" },
      { label: "Credentials stored, never shared" },
      { label: "Changes made by us on request" },
    ],
    [
      { label: "Workflows you can open and edit" },
      { label: "No per-task or per-run pricing" },
      { label: "Your data stays yours", addon: true },
    ],
  ],
  addonLabel: "Never resold",
};

/* ==========================================================================
   Workflows — what we actually automate
   ======================================================================== */

export const BENTO = {
  title: "The jobs worth automating first",
  cards: [
    {
      key: "setup",
      title: "Enquiry to record",
      body: "A message arrives by chat, call or form and becomes a row with the details already filled in — name, need, number — before anyone has opened a tab.",
    },
    {
      key: "unlimited",
      title: "Booking to calendar",
      body: "A held slot reaches the right calendar with the address and job notes attached, and the customer gets the confirmation.",
    },
    {
      key: "value",
      title: "Form to the right person",
      body: "Routed by what the form actually says, not by whoever checks the shared inbox first.",
    },
    {
      key: "nodes",
      title: "The follow-up nobody sends",
      body: "The quote chased on day three, the review asked for after the job, the renewal flagged before it lapses. Small, dull, and the first thing dropped in a busy week.",
    },
  ],
} as const;

/* ==========================================================================
   Integrations
   ======================================================================== */

export const INTEGRATE = {
  title: "Connects the tools you already pay for",
  body: "n8n speaks to around 500 services out of the box — spreadsheets, calendars, inboxes, CRMs, accounting, messaging — and to anything else with an API. Nothing here asks you to move your business into new software.",
  chips: [
    "500+ services supported",
    "Custom API connections",
    "Chat, call and form triggers",
    "AI steps where they earn it",
  ],
  cta: "Ask about your stack",
};

/* ==========================================================================
   Reliability — the band that replaced the data-centre map
   ======================================================================== */

export const RELIABILITY = {
  title: "The same steps, every single time",
  /** ⚠ Deliberately does not claim nothing fails. See the file header. */
  body: "Most business mistakes are not bad decisions, they are missed steps — the enquiry logged late, the figure typed twice, the confirmation nobody sent. A workflow does not get busy, distracted, or leave on Friday. And when something outside it does break, the run retries, the failure is recorded, and a person is told rather than the job quietly vanishing.",
  points: [
    { label: "Every run recorded", detail: "What ran, when, and what it touched." },
    { label: "Retries before it alerts", detail: "A momentary outage is not an incident." },
    {
      label: "Nothing fails silently",
      detail: "A workflow that keeps failing reaches us, not a log nobody reads.",
    },
  ],
  cta: "See what we would automate",
};

/* ==========================================================================
   Triggers — reuses the reference's chat band
   ======================================================================== */

export const TRIGGERS = {
  title: "Most of it starts with a customer saying something",
  body: "A question in a chat box, a call to a number nobody could answer, a form at eleven at night. The useful automations begin there — the agent captures what was said, and the workflow decides what has to happen next.",
  cta: "See how the agent answers",
  ctaHref: "/convoai",
  features: [
    {
      icon: "chart",
      title: "Captured as it is said",
      body: "Name, need and number written down while the conversation is happening, not reconstructed from memory afterwards.",
    },
    {
      icon: "shield",
      title: "Routed by what it is",
      body: "A quote request, a complaint and a booking are not the same job and do not go to the same place.",
    },
    {
      icon: "restore",
      title: "Answered out of hours",
      body: "The enquiry that arrives at eleven is handled at eleven, and you read the summary in the morning.",
    },
  ],
} as const;

/* ==========================================================================
   Tutorials
   ======================================================================== */

export const TUTORIALS = {
  title: "See what this looks like in practice",
  cta: "All guides",
  ctaHref: "/tutorials",
  /** Art is drawn in SVG — see _components/visuals.tsx. */
  cards: [
    { key: "setup", title: "From enquiry to booked job", href: "/tutorials" },
    { key: "api", title: "Connecting the tools you already use", href: "/tutorials" },
    { key: "mcp", title: "What to automate first", href: "/tutorials" },
  ],
} as const;

/* ==========================================================================
   Closing banner
   ======================================================================== */

export const BANNER = {
  overline: "Start with one task",
  title: "Tell us the job nobody wants to do",
  cta: "Book the mapping call",
};

/* ==========================================================================
   FAQs
   ======================================================================== */

export const FAQ_HEAD = {
  title: "Questions about business automation",
  description: "What we automate, what it runs on, and what happens when something goes wrong.",
};

export const FAQS: readonly FaqItem[] = [
  {
    q: "What kind of tasks can you automate?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Anything repetitive that moves information between places: an enquiry becoming a record, a booking reaching a calendar, a form reaching the right person, an invoice chased, a report assembled every Monday. The test is whether a person currently does it the same way each time — if so, it can be a workflow.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Judgement calls are a poor fit, and we will say so rather than automate something that needs a person deciding.",
          },
        ],
      },
    ],
  },
  {
    q: "Do I need to know n8n, or any software?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "No. The workflows are built and run for you, and the day-to-day experience is that the work simply happens. n8n matters because it means you can open any automation and see exactly what it does — but you never have to.",
          },
        ],
      },
    ],
  },
  {
    q: "What happens when something goes wrong?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "A workflow removes human error, not every possible failure — an API can go down and a password can expire. So every run is recorded, failures retry automatically, and anything that keeps failing raises an alert to us rather than disappearing into a log nobody reads.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "You can see the run history for every automation, including the ones that worked. An automation you cannot inspect is one you will eventually stop trusting.",
          },
        ],
      },
    ],
  },
  {
    q: "What does it connect to?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Around 500 services are supported directly — spreadsheets, calendars, shared inboxes, CRMs, accounting packages, messaging apps — and anything with an API can be connected on request. We work with the tools you already pay for instead of asking you to move.",
          },
        ],
      },
    ],
  },
  {
    q: "How long does it take?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "A single well-understood workflow is usually days rather than weeks. The mapping call decides it: most of the time goes into the exceptions — what happens when the form is half-filled, when the same customer enquires twice, when the slot is already taken.",
          },
        ],
      },
    ],
  },
  {
    q: "What does it cost?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "It depends on how many workflows you need and what they touch, so we quote after the mapping call rather than publishing a tier that would be wrong for most people. What we do not do is charge per task or per run — a busy month should not produce a surprise bill.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          { text: "If you would rather start by talking it through, " },
          { text: "get in touch", href: "/support" },
          { text: "." },
        ],
      },
    ],
  },
  {
    q: "Who owns the workflows?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "You do. They are standard n8n workflows, not a proprietary format, and they can be exported. We would rather you stayed because the service is good than because leaving is difficult.",
          },
        ],
      },
    ],
  },
  {
    q: "What happens to my data?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "It passes through the workflow to the places you have told it to go, and it stays yours. Credentials are stored encrypted and are never shared between customers. We do not sell, resell or train anything on your business data.",
          },
        ],
      },
    ],
  },
];
