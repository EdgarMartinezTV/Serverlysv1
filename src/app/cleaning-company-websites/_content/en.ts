/**
 * English copy for /cleaning-company-websites.
 *
 * Every price comes from data/design-plans.ts and data/care-plans.ts (the
 * approved WHMCS products); cleaning-specific add-ons have no approved price
 * and say "quoted" instead. Brisa Clean Co. is the fictional demo company and
 * is always presented as a sample. Serverlys builds websites for cleaning
 * companies; it does not clean, and the industries section says so.
 */
export const en = {
  meta: {
    title: "Cleaning Company Website Design in Miami | Serverlys",
    description:
      "Professional cleaning company website design in Miami. Custom websites with quote requests, booking integrations, mobile-friendly design and SEO. Get a free consultation.",
  },
  breadcrumb: { home: "Home", page: "Cleaning company websites" },
  switchTo: { label: "Español", aria: "Ver esta página en español" },

  hero: {
    kicker: "Cleaning company website design · Miami-Dade",
    title: "Professional Cleaning Company Websites Built to Win More Customers",
    lede: "We design high-performance cleaning business websites that help you generate quote requests, showcase your services, and turn local searches into real business opportunities.",
    ctaPrimary: "Get My Free Website Consultation",
    ctaDemo: "Explore Live Demo",
    points: ["Instant quote requests", "Booking integrations", "English + Spanish", "Built for Google"],
    mock: {
      brand: "Brisa Clean Co.",
      nav: ["Services", "Pricing", "Areas"],
      headline: "Spotless homes. Zero hassle.",
      sub: "Home and office cleaning across Miami-Dade.",
      cta: "Get an instant quote",
      quoteTitle: "Instant quote",
      bedrooms: "Bedrooms",
      baths: "Bathrooms",
      service: "Service",
      zip: "ZIP code",
      bedroomsValue: "3",
      bathsValue: "2",
      serviceValue: "Deep clean",
      zipValue: "33178",
      estimateLabel: "Estimate",
      estimate: "$240 – $280",
      button: "Request my quote",
      toastTitle: "Quote request received",
      toastBody: "Brisa will confirm by text.",
      notif: "New quote request",
      notifDetail: "Deep clean · 3 bed · Doral",
      sample: "Sample site · illustrative prices",
      chips: { mobile: "Mobile-friendly", seo: "SEO ready", booking: "Online booking", leads: "Lead generation" },
    },
  },

  why: {
    label: "Why it matters",
    title: "Your next customer checks your website before they call.",
    intro:
      "Most people pick a cleaning company in a few minutes on a phone: they search, compare two or three sites, and contact the one that looks trustworthy and makes it easy to ask for a price.",
    items: [
      {
        title: "Credibility at first glance",
        body: "A clean, professional site with your real team, your services and your license and insurance details reassures people before they invite you into their home or office.",
      },
      {
        title: "Visibility on Google",
        body: "Service pages, service-area pages and correct technical SEO give Google a clear picture of what you clean and where, so you can appear when nearby customers search.",
      },
      {
        title: "Inquiries while you work",
        body: "A quote form, booking link and click-to-call buttons collect requests at 9 PM on a Sunday, when your phone is off and your crew is resting.",
      },
      {
        title: "Visitors who become customers",
        body: "Clear prices or estimates, honest reviews and one obvious next step on every page turn more of your existing traffic into booked jobs.",
      },
    ],
  },

  features: {
    label: "Features",
    title: "Everything your cleaning website needs",
    intro: "Built around how cleaning customers actually buy. Pick a goal to see the features behind it.",
    filterLabel: "Show features for",
    groups: { all: "Everything", win: "Win the job", show: "Show your work", found: "Get found", run: "Run smoothly" },
    items: [
      { id: "services", group: "show", title: "Residential and commercial services", body: "Separate, clear sections for homes and businesses, so a homeowner and a facility manager each find their path in one click." },
      { id: "quote", group: "win", title: "Instant quote requests", body: "A short form or an estimator by bedrooms, bathrooms, square footage and service type, sent straight to your inbox or CRM." },
      { id: "booking", group: "win", title: "Online appointment scheduling", body: "Connect the booking tool you already use, such as Jobber, Housecall Pro, BookingKoala or ZenMaid, or start with a request form." },
      { id: "pages", group: "found", title: "A page for every service", body: "Deep cleaning, move-out, post-construction, office janitorial: each with its own page that answers questions and ranks on its own." },
      { id: "areas", group: "found", title: "Service-area coverage", body: "Show exactly where you work, with useful area pages where you have real local information to share, not copy-pasted city pages." },
      { id: "gallery", group: "show", title: "Before-and-after galleries", body: "Your own before-and-after photos, organised by service, with a comparison slider customers can drag." },
      { id: "reviews", group: "show", title: "Verified customer testimonials", body: "Real reviews from your customers, linked to their source such as your Google profile. We never write or invent reviews." },
      { id: "maps", group: "found", title: "Google Maps integration", body: "Your service area and Google Business Profile connected to the site, with the same name, phone and hours everywhere." },
      { id: "call", group: "win", title: "WhatsApp and click-to-call", body: "One tap to call or message you from any phone, in the header and at every decision point on the page." },
      { id: "bilingual", group: "win", title: "English and Spanish", body: "A complete bilingual website, written by people, so Spanish-speaking customers get the same experience, not a translate button." },
      { id: "ai", group: "run", title: "Optional ConvoAI chatbot", body: "Our own AI assistant answers questions about services, areas and availability around the clock and passes quote requests to your team." },
      { id: "hosting", group: "run", title: "Secure hosting and maintenance", body: "Fast hosting, SSL, backups and updates handled by the same team that built the site, so it stays secure and current." },
    ],
  },

  demo: {
    label: "Live demo",
    title: "Try a cleaning company website before you buy one.",
    body: "Brisa Clean Co. is a fictional Miami-Dade cleaning company we built to show what your site can do. Get an instant estimate, request an appointment, switch to Spanish and open it on your phone.",
    points: ["Interactive quote estimator", "Appointment request", "Mobile navigation", "English and Spanish"],
    cta: "Explore the live demo",
    note: "Demo only: no bookings, payments or messages are sent.",
  },

  industries: {
    label: "Who we build for",
    title: "Websites for every kind of cleaning business",
    intro: "Each type of cleaning company sells differently. The site is built around how your customers choose.",
    note: "These are the cleaning businesses Serverlys builds websites for. Serverlys is a web design company and does not provide cleaning services.",
    items: [
      { id: "residential", title: "Residential cleaning", body: "Recurring home cleaning sold on trust: team photos, clear pricing ranges and easy weekly or biweekly booking.", photo: "/cleaning/living-bright.jpg", alt: "A bright, tidy living room" },
      { id: "commercial", title: "Commercial cleaning", body: "Proposals, not impulse buys: capabilities, insurance details, industries served and a request-a-walkthrough form.", photo: "/cleaning/office-open.jpg", alt: "An open-plan office with large windows" },
      { id: "janitorial", title: "Office janitorial services", body: "Nightly and weekly contracts for offices, clinics and warehouses, with a page per facility type and a bid request.", photo: "/cleaning/office-mopping.jpg", alt: "A cleaner mopping an office lobby at night" },
      { id: "airbnb", title: "Airbnb turnover cleaning", body: "Fast turnovers for hosts: checklists, linen service, photo reports and scheduling around guest check-outs.", photo: "/cleaning/bedroom-crisp.jpg", alt: "A freshly made bed in a guest bedroom" },
      { id: "deep", title: "Deep cleaning", body: "One-time jobs that need a clear scope: what is included room by room, how long it takes and an instant estimate.", photo: "/cleaning/kitchen-bright.jpg", alt: "A spotless bright kitchen" },
      { id: "move", title: "Move-in and move-out cleaning", body: "Timed to closings and lease ends, with landlord-friendly checklists and quotes by home size.", photo: "/cleaning/living-empty.jpg", alt: "An empty, freshly cleaned living room" },
      { id: "construction", title: "Post-construction cleaning", body: "For builders and remodelers: rough, final and touch-up phases, safety practices and a fast bid form.", photo: "/cleaning/construction.jpg", alt: "A construction site seen from above" },
      { id: "carpet", title: "Carpet and specialty cleaning", body: "Carpet, upholstery, windows and floors, with before-and-after galleries and per-room pricing.", photo: "/cleaning/vacuum-carpet.jpg", alt: "A vacuum cleaning a carpet" },
    ],
  },

  local: {
    label: "Miami-Dade local SEO",
    title: "Built to be found in Miami-Dade",
    intro:
      "Customers search for cleaning near them, often in Spanish, and Google answers with businesses it understands. We build your site so it clearly explains what you clean and where you work.",
    pillars: [
      { title: "Location-relevant pages", body: "Area pages only where you have something real to say about the area: the neighborhoods you serve, local jobs and the details customers there ask about." },
      { title: "Service pages", body: "One focused page per service, each answering the questions that decide the booking, with internal links between related services." },
      { title: "Technical SEO", body: "Fast pages, clean URLs, titles, meta descriptions, structured data, XML sitemap and correct indexing, set up and checked before launch." },
      { title: "Internal linking", body: "A clear structure from your home page to services to areas, so visitors and Google can always find the next relevant page." },
      { title: "Google Business Profile", body: "Your profile and website linked and consistent: same name, phone, hours, service area and categories." },
    ],
    areasTitle: "Where our clients work",
    areasIntro: "We build websites for cleaning companies across Miami-Dade County, and anywhere else in the United States.",
    areas: [
      "Miami",
      "Doral",
      "Downtown Doral",
      "Hialeah",
      "Hialeah Gardens",
      "Coral Gables",
      "Miami Beach",
      "Miami Lakes",
      "Miami Gardens",
      "North Miami",
      "North Miami Beach",
      "Aventura",
      "South Miami",
      "Miami Springs",
      "Sweetwater",
      "Homestead",
      "Cutler Bay",
      "Pinecrest",
      "Palmetto Bay",
      "Kendall",
      "Brickell",
      "Wynwood",
      "Downtown Miami",
      "Little Havana",
      "Westchester",
    ],
    insightsTitle: "What a Miami-Dade cleaning website should account for",
    insights: [
      {
        title: "Bilingual customers",
        body: "In much of the county, many households speak Spanish at home. A complete Spanish version of your site, not a widget, reaches them directly.",
      },
      {
        title: "Commercial demand in Doral",
        body: "The City of Doral reports more than 2,600 trade and logistics companies and over 250 corporate headquarters, a large market for office and warehouse janitorial contracts.",
        source: { label: "City of Doral economic snapshot", href: "https://www.cityofdoral.com/businesses/economic-snapshot/" },
      },
      {
        title: "Licensing on display",
        body: "Miami-Dade businesses need a local business tax receipt, and those inside a city need the city's too. Showing your licensing and insurance clearly builds trust with commercial buyers.",
        source: { label: "Miami-Dade Tax Collector", href: "https://www.mdctaxcollector.gov/en/services/local-business-tax-receipt" },
      },
    ],
    visitTitle: "We meet in person in Downtown Doral",
    visitBody: "For cleaning companies in Miami-Dade, we can sit down with you in person, open your current website and Google listing on a phone, and show you what customers see, in English or Spanish.",
  },

  pricing: {
    label: "Pricing",
    title: "Transparent starting prices",
    intro:
      "Cleaning company websites are built on our standard website design plans. Features specific to cleaning businesses, like a quote estimator or booking integration, are scoped and quoted for your company.",
    from: "From",
    oneTime: "one-time",
    subpages: "{n} subpages",
    includesTitle: "Every plan includes",
    /** Labels for the shared plan inclusions (data/design-plans.ts); English is the source. */
    includeLabels: {} as Record<string, string>,
    fit: {
      starter: "A good fit for a new or smaller cleaning business with a few core services.",
      plus: "A good fit for established companies with more services and service-area pages.",
      pro: "A good fit for commercial and multi-service companies with lots of pages.",
    },
    order: "Order {plan}",
    consult: "Ask about {plan}",
    addonsTitle: "Cleaning-specific features",
    addonsIntro: "Quoted for your business after the free consultation. You approve the price before any work starts.",
    addons: [
      { name: "Interactive quote estimator", detail: "Estimates by home size, service and frequency" },
      { name: "Booking software integration", detail: "Jobber, Housecall Pro, BookingKoala, ZenMaid and others" },
      { name: "Complete Spanish version", detail: "Every page, written in Spanish" },
      { name: "Before-and-after galleries", detail: "With a comparison slider" },
      { name: "ConvoAI chatbot", detail: "Answers questions and collects quote requests" },
      { name: "Service-area pages", detail: "Only where there is real local content" },
    ],
    quote: "Request a quote",
    careTitle: "Hosting and maintenance",
    careBody: "ServerCare website maintenance plans start at {price} a month and include updates, backups, security monitoring and content changes.",
    careCta: "See maintenance plans",
    perMonth: "/mo",
    footnote: "Prices in USD, plus applicable tax. Third-party software such as booking tools is billed by its provider.",
  },

  process: {
    label: "How it works",
    title: "From first call to launch, in five steps",
    steps: [
      { title: "Discovery", body: "We learn your services, areas, customers and goals, and review your current site and Google listing." },
      { title: "Design", body: "A custom design around your brand and photos, reviewed on a private preview before any build work." },
      { title: "Development", body: "We build the site, quote forms and integrations, mobile-first and fast, on our own hosting." },
      { title: "SEO setup", body: "Titles, descriptions, structured data, sitemap, Google Business Profile and analytics, configured and checked." },
      { title: "Launch and support", body: "We launch, monitor and keep improving, with updates and changes handled by the same team." },
    ],
  },

  portfolio: {
    label: "Our work",
    title: "See the work before you commit",
    intro:
      "We only show client projects with the client's permission. Until then, the best way to judge our work is to try it: the live demo is a complete cleaning company website, built the way we build yours.",
    demoTitle: "Brisa Clean Co. — live demo",
    demoBody: "Fictional Miami-Dade cleaning company. Quote estimator, appointment request, gallery, mobile navigation and English/Spanish.",
    demoCta: "Open the demo",
    more: "More of our work",
    moreHref: "/website-design",
  },

  faq: {
    label: "FAQ",
    title: "Questions cleaning company owners ask us",
    items: [
      {
        question: "How much does a cleaning company website cost?",
        answer:
          "Our website design plans start at $1,399 (Starter), $1,899 (Plus) and $2,699 (Pro), one-time. Cleaning-specific features such as a quote estimator, booking integration or a full Spanish version are quoted for your business after a free consultation, and you approve the price before any work starts.",
      },
      {
        question: "How long does website development take?",
        answer:
          "It depends on the number of pages, your content and the integrations you need. We agree the timeline in a written scope before work begins, so you know the launch date up front.",
      },
      {
        question: "Can customers request cleaning quotes online?",
        answer:
          "Yes. We can add a simple quote form or an interactive estimator by home size, service and frequency. Requests go to your email or CRM, and estimates are shown as ranges you control.",
      },
      {
        question: "Can my website connect to booking software?",
        answer:
          "Yes. If you use a tool like Jobber, Housecall Pro, BookingKoala or ZenMaid, we connect its booking or request form to your site. That software has its own subscription with its provider.",
      },
      {
        question: "Will the website work on mobile devices?",
        answer: "Yes. Every site is designed mobile-first, because most cleaning customers find and contact you from a phone.",
      },
      {
        question: "Can you redesign my existing cleaning website?",
        answer:
          "Yes. We review what you have, keep what works, and rebuild the rest, taking care to keep the pages that already bring you customers from Google.",
      },
      {
        question: "Do you provide hosting and maintenance?",
        answer:
          "Yes. We host the sites we build, and our ServerCare maintenance plans start at $149.95 a month for updates, backups, security monitoring and content changes.",
      },
      {
        question: "Can Serverlys help with local SEO?",
        answer:
          "Yes. Every site launches with technical SEO and Google Business Profile setup, and we offer ongoing SEO services. We do not promise rankings; nobody can honestly guarantee a position on Google.",
      },
      {
        question: "Do you build bilingual cleaning websites?",
        answer: "Yes. We build complete English and Spanish websites, written by people, and our team works in both languages.",
      },
      {
        question: "Do you work with cleaning companies outside Miami?",
        answer:
          "Yes. We build websites for cleaning companies anywhere in the United States. In Miami-Dade we can meet in person; everywhere else we work over video calls, email and phone.",
      },
    ],
  },

  cta: {
    label: "Free consultation",
    title: "Ready to Grow Your Cleaning Business Online?",
    body: "Tell us about your company. We’ll review your current website and Google presence and recommend the right plan, whether or not you hire us.",
    bullets: ["A real review of your current site", "A clear recommendation and price", "In English or Spanish"],
    call: "Prefer to talk? Call",
  },

  form: {
    title: "Request your free consultation",
    required: "required",
    optional: "optional",
    fields: {
      name: "Full name",
      company: "Company name",
      email: "Email address",
      phone: "Phone number",
      city: "City",
      cityHint: "For example: Doral, FL",
      website: "Existing website",
      websiteHint: "Leave empty if you don’t have one yet",
      type: "Type of cleaning company",
      services: "Services you’re interested in",
      servicesHint: "Choose all that apply",
      budget: "Project budget",
      notes: "Project notes",
      notesHint: "Anything we should know: services, areas, goals, timing.",
    },
    types: {
      residential: "Residential / maid service",
      commercial: "Commercial / janitorial",
      both: "Residential and commercial",
      specialty: "Specialty (carpet, post-construction, Airbnb)",
      other: "Other",
    },
    choose: "Choose one",
    services: {
      website: "New website",
      redesign: "Redesign my current site",
      quote: "Quote requests or estimator",
      booking: "Booking integration",
      seo: "Local SEO",
      bilingual: "English and Spanish",
      hosting: "Hosting and maintenance",
      ai: "ConvoAI chatbot",
    },
    budgets: {
      under1500: "Under $1,500",
      b1500: "$1,500 – $2,500",
      b2500: "$2,500 – $5,000",
      over5000: "$5,000+",
      unsure: "Not sure yet",
    },
    submit: "Get My Free Consultation",
    sending: "Sending…",
    privacy: "We use these details only to prepare your consultation and contact you about it. Read our",
    privacyLink: "privacy policy",
    errors: {
      summary: "Please fix the following:",
      required: "This field is required.",
      email: "Enter a valid email address.",
      phone: "Enter a complete phone number.",
      url: "Enter a valid website address, like example.com.",
      services: "Choose at least one service.",
      choose: "Please choose an option.",
      rateLimited: "Too many requests from this connection. Please wait a few minutes or call us.",
      network: "We couldn’t reach our server. Check your connection and try again, or call us.",
    },
    success: {
      title: "Thank you. Your request is in.",
      notified: "Your request is with the Serverlys team. We’ll contact you by phone or email to schedule your consultation.",
      saved: "Your request has been saved. If you don’t hear from us within one business day, please call us.",
      reference: "Your reference",
      again: "Send another request",
    },
    failure: { title: "Something went wrong", body: "Your request was not sent. Please try again or call us.", ticket: "Open a sales ticket" },
  },

  related: {
    label: "More from Serverlys",
    items: [
      ["Website design", "/website-design"],
      ["SEO services", "/seo"],
      ["Website maintenance", "/site-management"],
      ["Restaurant websites", "/restaurant-websites"],
      ["Business email", "/business-email"],
      ["AI agents", "/ai-agents"],
    ] as [string, string][],
  },

  mobileBar: { consult: "Free consultation", call: "Call" },
};

export type CleaningCopy = typeof en;
