import type { LandingCopy } from "../_i18n";

/**
 * /restaurant-websites — English copy.
 *
 * Claims rule, same as the rest of the site: nothing here promises a ranking,
 * a turnaround time or a result, and nothing quotes a customer we do not have.
 * Third-party systems (ordering, reservations, payments) are named as things
 * we CONNECT, with their fees stated as theirs.
 */
export const en: LandingCopy = {
  meta: {
    title: "Restaurant Websites with Online Ordering | Serverlys",
    description:
      "Restaurant websites with a digital menu, online ordering, reservations, local SEO and a bilingual AI assistant. Built and hosted by Serverlys. Free review.",
  },
  breadcrumb: { home: "Home", page: "Restaurant websites" },
  switchTo: { label: "Español", aria: "Ver esta página en español" },
  hero: {
    kicker: "Restaurant websites by Serverlys",
    title: "Restaurant websites that fill tables.",
    lede: "A beautiful website with a real digital menu, online ordering, reservations and an AI assistant that answers guests in English and Spanish. Designed, hosted and kept current by one team.",
    ctaReview: "Get a Free Restaurant Website Review",
    ctaDemo: "Explore Live Demo",
    points: ["Digital menus", "Online ordering", "Reservations", "Local SEO", "AI assistant"],
    chips: {
      order: "New pickup order",
      orderDetail: "2 items · $54.00",
      booking: "Table request",
      bookingDetail: "Party of 4 · Fri 8:00 PM",
      ai: "“Do you have gluten-free options?”",
    },
    mock: {
      tagline: "Wood-fire Latin kitchen",
      headline: "Cooked over fire.",
      order: "Order pickup",
      reserve: "Reserve",
      menu: "Menu",
      viewOrder: "View order · 2 · $54.00",
      dishes: ["Churrasco", "Pollo a la brasa", "Tuna tartare"],
    },
  },
  checks: {
    label: "Before they visit",
    title: "Five things every guest checks before choosing where to eat",
    items: [
      { title: "The menu", body: "Readable on a phone, with prices and dietary information." },
      { title: "Hours and location", body: "Open now? How far? Where do I park?" },
      { title: "Order", body: "Pickup or delivery, without hunting for the button." },
      { title: "Reserve", body: "A table for tonight in three taps, even at midnight." },
      { title: "Google", body: "Photos, hours and a website that matches them." },
    ],
  },
  explorer: {
    label: "What we build",
    title: "Everything your restaurant needs online, working together",
    intro:
      "Pick a part of the system to see how it works for your guests. Every plan is designed, built and hosted by Serverlys.",
    tablistLabel: "Restaurant website features",
    external: "Third-party account needed",
    tabs: [
      {
        id: "website",
        label: "Website",
        title: "A website that feels like your dining room",
        body: "Designed around your food, your photos and your brand, not a template with your logo dropped in. Built for the phone first, because that is where nearly every guest meets you.",
        bullets: [
          "Custom design around your food and brand",
          "Mobile-first and fast on a phone",
          "Hours, directions and tap-to-call on every page",
          "Hosting, SSL and daily backups included",
        ],
      },
      {
        id: "menu",
        label: "Digital menu",
        title: "A real menu, not a blurry PDF",
        body: "Your menu as a proper web page: easy to read on any phone, filterable by dietary needs and readable by Google. One QR code on every table that never needs reprinting.",
        bullets: [
          "Readable on any phone, searchable by Google",
          "Dietary and allergen labels guests can filter",
          "One QR code for every table, forever",
          "Price and dish changes handled by us each month",
        ],
      },
      {
        id: "ordering",
        label: "Online ordering",
        title: "Take orders on your own website",
        body: "An Order button on every page and on Google, connected to the ordering system you already use or one we help you choose. Guests order from you, not from a marketplace.",
        bullets: [
          "Connected to Toast, Square, Clover, ChowNow and others",
          "Pickup and delivery options",
          "Order button on your site and your Google listing",
          "Links to your DoorDash or Uber Eats pages if you keep them",
        ],
        note: "Requires an account with your ordering provider. Their fees and payment processing are separate and paid to them.",
      },
      {
        id: "reservations",
        label: "Reservations",
        title: "Book tables while you are closed",
        body: "Guests pick a party size, a date and a time in a few taps. We connect your reservation system, or set up a simple request form that sends every booking straight to your team.",
        bullets: [
          "OpenTable, Resy, Tock and others connected",
          "Or a request form that emails your team",
          "Reserve button on your site and on Google",
          "Private-event and catering requests on Restaurant Pro",
        ],
        note: "Reservation systems such as OpenTable or Resy need their own account and subscription.",
      },
      {
        id: "seo",
        label: "Local SEO",
        title: "Be the restaurant that shows up nearby",
        body: "We set up the things Google reads when someone nearby searches for dinner: your Business Profile, restaurant and menu markup, and the same name, address and hours everywhere.",
        bullets: [
          "Google Business Profile set up and optimized",
          "Restaurant, menu and opening-hours schema",
          "Consistent name, address and phone everywhere",
          "Monthly report on Growth and Restaurant Pro",
        ],
        note: "No ranking guarantees. Nobody can honestly promise a position on Google.",
      },
      {
        id: "ai",
        label: "AI assistant",
        title: "An assistant that answers guests in English and Spanish",
        body: "ConvoAI, our own AI assistant, learns your menu, hours and policies and answers guests on your website day and night. When a question needs a person, it hands it to your team.",
        bullets: [
          "Answers menu, allergen, hours and parking questions",
          "Collects reservation and catering requests",
          "Replies in the guest’s language, English or Spanish",
          "You approve everything it knows",
        ],
        note: "Included in Restaurant Pro. Powered by ConvoAI.",
      },
    ],
    ui: {
      desktop: "Desktop",
      mobile: "Mobile",
      previewLabel: "Preview size",
      allDishes: "All",
      vegetarian: "Vegetarian",
      glutenFree: "Gluten-free",
      scanToView: "Scan to view the menu",
      add: "Add",
      inCart: "in your order",
      checkout: "Checkout",
      partySize: "Party size",
      guests: "guests",
      pickTime: "Pick a time",
      requested: "Requested",
      openNow: "Open now · Closes 11 PM",
      directions: "Directions",
      call: "Call",
      seoChecklist: [
        "Google Business Profile verified",
        "Hours match the website",
        "Menu link on Google",
        "Restaurant schema on every page",
        "Order and Reserve buttons on Google",
      ],
      chatPrompts: [
        {
          q: "Do you have gluten-free options?",
          a: "Yes. Seven dishes are gluten-free, including the churrasco and the pollo a la brasa. Want me to show only those?",
        },
        {
          q: "Can I book a table for 4 on Friday?",
          a: "Friday has openings at 7:30 and 9:00 PM. Which one works? I’ll send the request to the host.",
        },
        {
          q: "¿Tienen estacionamiento?",
          a: "Sí, hay estacionamiento gratuito en el garaje de al lado. ¿Le ayudo con algo más?",
        },
      ],
      chatHint: "Tap a question",
      sample: "Sample conversation",
      menuFilterLabel: "Filter the menu",
      hoursDiffer: "Hours might differ",
      fewer: "Fewer guests",
      more: "More guests",
      previewAlt: "Preview of the Lumbre demo restaurant website.",
      typing: "The assistant is typing",
      seoCategory: "Latin restaurant · $$$ · Doral",
    },
  },
  demoBand: {
    label: "Live demo",
    title: "Try a real restaurant website before you buy one",
    body: "Lumbre is a fictional wood-fire kitchen we built to show exactly what your guests would get. Browse the menu, build an order, book a table and ask the assistant a question.",
    bullets: [
      "Interactive menu with dietary filters",
      "Cart with pickup or delivery",
      "Three-step reservation flow",
      "Sample AI assistant in English and Spanish",
    ],
    cta: "Explore Live Demo",
    disclaimer: "Fictional restaurant. No real payments, orders or bookings.",
  },
  steps: {
    label: "How it works",
    title: "From a free review to a website that takes orders, in four steps.",
    items: [
      {
        title: "Free website review",
        body: "We look at your website and Google listing on a phone, the way a hungry guest does, and show you what is costing you orders and bookings.",
      },
      {
        title: "A plan and a written scope",
        body: "You choose a plan. Pages, integrations, languages and the launch date are agreed in writing before any work starts.",
      },
      {
        title: "Design, build and review",
        body: "We design around your food and brand, connect ordering and reservations, and you review the full site on a private preview before it goes live.",
      },
      {
        title: "Launch, then keep it current",
        body: "We launch, connect Google, and handle your menu, hours and specials updates every month so the site never goes stale.",
      },
    ],
  },
  pricing: {
    label: "Pricing",
    title: "Restaurant website plans",
    intro:
      "One setup fee to design and launch your site. One monthly plan for hosting, updates and growth.",
    setup: "one-time setup",
    perMonth: "/mo",
    then: "then",
    cta: "Choose",
    recommended: "Recommended",
    listTitle: "Highlights",
    summaries: {
      starter: "Everything a guest checks before they visit, done right and kept current.",
      growth:
        "Take orders and reservations on your own site, in English and Spanish, and get found locally.",
      pro: "Adds an AI assistant that answers guests day and night, plus catering, events and up to three locations.",
    },
    highlights: {
      starter: [
        "Custom website, up to 5 pages",
        "Mobile-first digital menu and QR code",
        "Hosting, SSL and daily backups",
        "Restaurant schema and Google Business Profile link",
        "2 menu or hours updates a month",
      ],
      growth: [
        "Everything in Starter, up to 10 pages",
        "English and Spanish website",
        "Online ordering connected †",
        "Reservations connected †",
        "Google Business Profile optimization and local SEO",
        "6 updates a month and a monthly report",
      ],
      pro: [
        "Everything in Growth, up to 20 pages",
        "ConvoAI assistant, bilingual, trained on your menu",
        "Catering and private-event requests",
        "Up to 3 locations",
        "4 Google Business Profile posts a month",
        "12 updates a month and a quarterly strategy call",
      ],
    },
    footnote:
      "Setup is a one-time fee; the monthly plan starts at launch. Prices in USD, plus applicable tax. † Needs an account with a third-party provider, such as Toast, Square, OpenTable or Resy. Their fees, payment processing and terms are separate and paid to them directly.",
  },
  compare: {
    title: "Compare every feature",
    caption: "Restaurant website plans compared feature by feature",
    feature: "Feature",
    included: "Included",
    notIncluded: "Not included",
    externalLegend: "† Needs a third-party account; its fees are separate.",
    groups: [
      {
        title: "Website",
        rows: [
          { label: "Pages", values: ["Up to 5", "Up to 10", "Up to 20"] },
          { label: "Custom design", values: [true, true, true] },
          { label: "Mobile-first, fast-loading build", values: [true, true, true] },
          { label: "Languages", values: ["English or Spanish", "English + Spanish", "English + Spanish"] },
          { label: "Hosting, SSL and daily backups", values: [true, true, true] },
          { label: "Locations", values: ["1", "1", "Up to 3"] },
        ],
      },
      {
        title: "Menu",
        rows: [
          { label: "Digital menu (web page, not a PDF)", values: [true, true, true] },
          { label: "QR code for tables", values: [true, true, true] },
          { label: "Dietary and allergen labels", values: [true, true, true] },
          { label: "Menu, hours and specials updates", values: ["2 a month", "6 a month", "12 a month"] },
        ],
      },
      {
        title: "Orders and reservations",
        rows: [
          { label: "Order and Reserve buttons to your current pages", values: [true, true, true] },
          { label: "Online ordering integration", values: [false, true, true], external: true },
          { label: "Reservation system integration", values: [false, true, true], external: true },
          { label: "Catering and private-event requests", values: [false, false, true] },
        ],
      },
      {
        title: "Google and local SEO",
        rows: [
          { label: "Restaurant and menu schema markup", values: [true, true, true] },
          { label: "Google Business Profile", values: ["Linked", "Optimized", "Optimized + 4 posts a month"] },
          { label: "Local SEO setup", values: [false, true, true] },
          { label: "Monthly performance report", values: [false, true, true] },
        ],
      },
      {
        title: "AI assistant",
        rows: [
          { label: "ConvoAI website assistant", values: [false, false, true] },
          { label: "Answers in English and Spanish", values: [false, false, true] },
          { label: "Reservation and catering requests sent to your team", values: [false, false, true] },
        ],
      },
      {
        title: "Support",
        rows: [
          { label: "Support in English or Spanish", values: [true, true, true] },
          { label: "Quarterly strategy call", values: [false, false, true] },
        ],
      },
    ],
  },
  doral: {
    kicker: "Downtown Doral",
    title: "Own a restaurant in Downtown Doral? We’ll come to you.",
    body: "We visit restaurants in Downtown Doral in person. We sit down with you, open your website and Google listing on a phone, and show you exactly what a guest sees, in English or Spanish. Anywhere else in the United States, we do the same review on a video call.",
    points: [
      "In person in Downtown Doral",
      "Video call anywhere in the US",
      "In English or Spanish",
      "Free, with no obligation",
    ],
    aside: "[Free] review. [Bilingual] team. A [live demo] you can try on your own phone.",
    cta: "Get a Free Restaurant Website Review",
  },
  form: {
    label: "Free review",
    title: "Get a free restaurant website review",
    intro:
      "Tell us about your restaurant. We’ll review your website and Google listing the way a hungry guest does, on a phone, and walk you through what we find.",
    reviewTitle: "What we look at",
    reviewItems: [
      "How your site loads and reads on a phone",
      "Your menu: format, prices and dietary information",
      "The path from Google to an order or a booking",
      "Your Google Business Profile, hours and photos",
      "What to fix first, in plain language",
    ],
    contactLine: "Prefer to talk? Call",
    fields: {
      restaurant: "Restaurant name",
      contact: "Your name",
      website: "Current website",
      websiteHint: "Paste your web address, or tick the box if you don’t have one yet.",
      noWebsite: "We don’t have a website yet",
      phone: "Phone",
      email: "Email",
      location: "City or neighborhood",
      locationHint: "For example: Downtown Doral, FL",
      services: "What do you need help with?",
      servicesHint: "Choose all that apply.",
      plan: "Plan you’re interested in",
      planNone: "Not sure yet",
      language: "Preferred language",
      message: "Anything else we should know?",
      messageHint: "Your current ordering system, number of locations, timing.",
      optional: "optional",
      required: "required",
    },
    services: {
      website: "New website or redesign",
      menu: "Digital menu and QR code",
      ordering: "Online ordering",
      reservations: "Reservations",
      seo: "Google and local SEO",
      ai: "AI assistant (ConvoAI)",
      unsure: "Not sure, tell me what I need",
    },
    languages: { en: "English", es: "Spanish" },
    submit: "Get my free review",
    sending: "Sending…",
    privacy: "We use these details only to prepare your review and contact you about it. Read our",
    privacyLink: "privacy policy",
    errors: {
      summary: "Please check the highlighted fields:",
      required: "This field is required.",
      email: "Enter a valid email address.",
      phone: "Enter a complete phone number.",
      url: "Enter a valid web address, or tick “We don’t have a website yet”.",
      services: "Choose at least one option.",
      network: "We couldn’t reach our server. Check your connection and try again.",
      rateLimited: "Too many requests in a row. Please try again in a few minutes.",
    },
    success: {
      title: "Thank you, we’ve got it.",
      notified:
        "Your request is with the Serverlys team. We’ll contact you by phone or email to set up your review.",
      saved:
        "Your request is saved, but we couldn’t confirm it reached our inbox. So nothing is left to chance, please email support@serverlys.com quoting the reference below, or call us.",
      reference: "Reference",
      again: "Send another request",
    },
    failure: {
      title: "We couldn’t send your request",
      body: "Your details are still in the form. Please try again, call us, or open a sales ticket instead.",
      ticket: "Open a sales ticket",
    },
  },
  faq: {
    label: "FAQ",
    title: "Questions restaurant owners ask us",
    items: [
      {
        question: "Can you improve the website I already have, or do I need a new one?",
        answer:
          "Either. The free review tells you which makes sense. If your current site is sound, we can redesign and rebuild on Serverlys; if it is slow, hard to update or not built for phones, a new site is usually the faster path.",
      },
      {
        question: "Can you connect the online ordering system I already use?",
        answer:
          "Yes, on Growth and Restaurant Pro. We connect the ordering provider you already have, such as Toast, Square, Clover or ChowNow, or help you choose one. The provider’s fees and payment processing are separate and paid to them. Serverlys does not take a cut of your orders.",
      },
      {
        question: "What about DoorDash and Uber Eats?",
        answer:
          "We can link to your marketplace listings from your site. Ordering directly on your own website means the guest relationship stays with you; marketplace fees are set by the marketplaces.",
      },
      {
        question: "Will my menu be a PDF?",
        answer:
          "No. Your menu is a real web page: readable on any phone, filterable by dietary needs and readable by Google. Price and dish changes are handled by our team within your plan’s monthly updates.",
      },
      {
        question: "Can my website be in English and Spanish?",
        answer:
          "Yes. Starter is built in one language, English or Spanish. Growth and Restaurant Pro include both versions. Our team works in English and Spanish, and you approve every page before it goes live.",
      },
      {
        question: "What does the AI assistant actually do?",
        answer:
          "On Restaurant Pro, ConvoAI, our own AI assistant, answers guest questions on your website about your menu, allergens, hours, parking and policies, in English or Spanish. It collects reservation and catering requests and passes them to your team. It does not take payments, and you approve what it knows.",
      },
      {
        question: "How long does it take to launch?",
        answer:
          "It depends on your menu, photos and integrations. We agree the launch date in the written scope before any work starts, so you know it up front.",
      },
      {
        question: "Who owns the domain and the content?",
        answer:
          "Your domain is registered in your restaurant’s name, and your menu, photos and written content are yours.",
      },
      {
        question: "Is the website review really free?",
        answer:
          "Yes. We review your current website and Google listing and walk you through what we find, whether or not you hire us.",
      },
      {
        question: "Do you only work with restaurants in Doral?",
        answer:
          "No. We build restaurant websites for restaurants anywhere in the United States. In Downtown Doral we can meet you in person; everywhere else we work over video calls, email and phone.",
      },
    ],
  },
  related: {
    label: "More from Serverlys",
    items: [
      ["Website design", "/website-design"],
      ["SEO services", "/seo"],
      ["Social media management", "/social-media"],
      ["Business email", "/business-email"],
      ["Domain names", "/register-domain"],
      ["WordPress hosting", "/wordpress-hosting"],
      ["Website maintenance", "/site-management"],
      ["AI agents", "/ai-agents"],
    ],
  },
};
