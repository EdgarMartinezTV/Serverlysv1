/**
 * Every domain extension the store sells, for the /tld/<ext> landing pages.
 *
 * PRICES: read from the WHMCS public feed (serverlys.com/feeds/domainpricing.php)
 * on PRICES_AS_OF. Register, transfer and renewal are listed separately because
 * the feed lists them separately — today they are equal for every extension,
 * which is the point the pages make: no first-year discount that doubles at
 * renewal. Re-read the feed before changing a number, and update PRICES_AS_OF
 * in the same edit. The feed also lists a minimum term of one year for every
 * extension, which the page FAQs repeat.
 *
 * This is NOT data/tlds.ts. That file is the 8-extension set the domain search,
 * RDAP lookup and pricing components are built around; widening it changes
 * what the search accepts. This catalog only feeds pages. Where the two overlap
 * the prices must agree.
 *
 * COPY: `about` and `rules` state only what is true of the extension itself
 * (who runs it in general terms, who may register it). Nothing here is a claim
 * about search ranking — Google treats generic extensions alike. `uses` and
 * `tips` are practical advice, not registry facts; anything that IS a registry
 * fact (eligibility, character rules) carries its source in a comment.
 *
 * Sources checked 2026-10-26:
 * - .eu: EURid, "Who can register a .eu domain name?" (help.eurid.eu), EURid
 *   news "Introducing the .eu eligibility for EEA citizens" (in force
 *   2 Aug 2021), EURid UK withdrawal notice (from 1 Jan 2021), and EURid
 *   "Rules for domain names" (eurid.eu/en/register-a-eu-domain/rules-for-eu-domains/:
 *   minimum two characters; Latin, Greek and Cyrillic scripts).
 * - .us: about.us usTLD Nexus Requirements Policy (three nexus categories,
 *   continuing requirement), "Evidence Accepted for usTLD Nexus Checks", and the
 *   usTLD Privacy Services Policy (no privacy/proxy registrations; registry run
 *   under contract with the US Department of Commerce).
 * - .biz: ICANN .biz Registry Agreement Appendix 11, Registration Restrictions
 *   (bona fide business or commercial use; resale-only is not).
 * - .pro: restrictions to licensed professionals ended 16 Nov 2015 with the
 *   renewed ICANN registry agreement (registrar notices: Name.com, INWX).
 * - .me: second-level names open worldwide, no nexus (registrar policy pages).
 */
export const PRICES_AS_OF = "2026-10-26";

export type TldEntry = {
  /** Without the leading dot; also the URL slug. */
  slug: string;
  register: number;
  transfer: number;
  renew: number;
  /** Country-code extension (ccTLD) rather than generic (gTLD). */
  country?: string;
  /** Who it suits, one sentence. */
  forWhom: string;
  /** What it is. Two to four sentences, specific to this extension. */
  about: string;
  /** Registration conditions beyond "anyone may register". */
  rules?: string;
  /** Typical uses, one short sentence each. */
  uses: readonly string[];
  /** Name-picking advice specific to this extension. */
  tips: readonly string[];
  /** Extra questions only this extension raises. Text renders verbatim in the
      FAQ and its JSON-LD, so use typographic quotes. */
  extraFaqs?: readonly { question: string; answer: string }[];
  /** Slugs worth comparing on this page. */
  related: readonly string[];
};

export const tldCatalog: readonly TldEntry[] = [
  {
    slug: "com",
    register: 14.95, transfer: 14.95, renew: 14.95,
    forWhom: "Any business that wants the address customers type by default.",
    about: "The original commercial extension, one of the first generic top-level domains created in 1985, and still the one people assume when they hear a business name. It is open to anyone, anywhere, for any purpose: you do not need to be a company. Because it is the default, short dictionary .com names are rarely unregistered, so most new .com names combine two words or add a qualifier.",
    uses: [
      "The main website and email address of a company or brand.",
      "Product and campaign names that people will hear once and type from memory.",
      "A defensive registration next to a country-code or newer extension, so the .com of your name reaches you.",
      "Redirect domains for common misspellings of a brand name.",
    ],
    tips: [
      "If the exact name is taken, add a word that says what you do (hearthbakery.com rather than hearth.com) instead of a hyphen or a number.",
      "Say the name to someone and ask them to type it. A .com that has to be spelled out loses the advantage of being the default.",
      "Check the name is not someone else’s trademark before you build on it: availability at the registry is not permission to trade under a name.",
    ],
    related: ["net", "co", "us", "shop", "online"],
  },
  {
    slug: "net",
    register: 16.95, transfer: 16.95, renew: 16.95,
    forWhom: "Tech, network and internet businesses, or a fallback when the .com is taken.",
    about: "One of the original 1985 generic extensions, created for network infrastructure providers and now used by every kind of business. It is open to anyone with no residency or purpose requirement. Like .com it is run by Verisign, and it is a familiar second choice when the .com of a name belongs to someone else.",
    uses: [
      "Internet, hosting, network and IT service providers.",
      "Infrastructure behind a .com brand: API, status-page, mail and download hostnames.",
      "A business whose .com is already registered by someone else.",
      "Online communities and network-style projects.",
    ],
    tips: [
      "If someone else owns the .com of your name, look at what is on it: visitors who type .com out of habit will land there.",
      "Keep the name identical to the brand rather than adding words; .net is already the qualifier.",
      "For a .com brand, .net works well for technical hostnames that should stay separate from the marketing site.",
    ],
    related: ["com", "org", "io", "cloud", "host"],
  },
  {
    slug: "org",
    register: 16.95, transfer: 16.95, renew: 16.95,
    forWhom: "Non-profits, communities, open-source projects and causes.",
    about: "One of the original 1985 generic extensions, long associated with non-profit organisations, though registration is open to anyone and no proof of status is asked for. Readers tend to read a .org as a mission rather than a shop. The registry is operated by Public Interest Registry.",
    uses: [
      "Charities, foundations and non-profit organisations.",
      "Open-source projects, standards groups and research collaborations.",
      "Clubs, associations, parent groups and other community organisations.",
      "Advocacy campaigns and causes that run separately from a company site.",
    ],
    tips: [
      "Use the name supporters already use, whether that is the full name or an acronym members say out loud.",
      "Register the .com of the name too if donors or members are likely to guess it.",
      "Because .org signals a cause, it is a poor fit for a purely commercial store: visitors may expect a non-profit.",
    ],
    related: ["com", "net", "info", "social", "blog"],
  },
  {
    slug: "biz",
    register: 21.95, transfer: 21.95, renew: 21.95,
    forWhom: "Businesses that want a clearly commercial address when the .com is gone.",
    about: "Introduced in 2001 as a generic extension specifically for business. Its registry agreement with ICANN restricts it to names used, or intended to be used, primarily for bona fide business or commercial purposes, which makes it one of the few generic extensions with a stated purpose.",
    rules: "Names must be used, or intended to be used, primarily for bona fide business or commercial purposes. Registering a name only to sell, trade or lease it does not count as business use under the registry’s rules.",
    uses: [
      "Small businesses and sole traders whose .com is taken.",
      "Business-to-business services and directories.",
      "Product or promotion sites for a commercial brand.",
      "A shorter commercial alternative to a long .com name.",
    ],
    tips: [
      "Pair .biz with a name that is obviously a business, so the extension reads as a choice rather than a fallback.",
      "Do not register a .biz purely to resell it: that falls outside the registry’s definition of business use.",
      "If the matching .com belongs to a competitor, choose a different name rather than one customers will confuse with theirs.",
    ],
    related: ["com", "pro", "store", "shop", "online"],
  },
  {
    slug: "info",
    register: 27.95, transfer: 27.95, renew: 27.95,
    forWhom: "Guides, resource sites and informational projects.",
    about: "A generic extension launched in 2001 for informational sites, among the first open extensions added after the originals. It is open to anyone with no purpose requirement, and it suits sites whose job is to explain rather than sell.",
    uses: [
      "Guides, FAQs, knowledge bases and help centres.",
      "Event, venue and visitor information pages.",
      "Community resource lists and directories.",
      "Product documentation kept apart from a sales site.",
    ],
    tips: [
      "Name the topic rather than the company: a .info address works best when it says what information is there.",
      "If it sits alongside a main brand domain, link the two both ways so readers know who publishes it.",
      "Keep it short; informational names tend to grow long quickly.",
    ],
    related: ["org", "blog", "site", "website", "online"],
  },
  {
    slug: "cloud",
    register: 26.95, transfer: 26.95, renew: 26.95,
    forWhom: "SaaS products, cloud services and software companies.",
    about: "A generic extension aimed at cloud and software businesses, open to anyone. It is short and descriptive for anything delivered over the internet, from a SaaS product to a self-hosted personal server.",
    uses: [
      "SaaS products and web applications.",
      "Managed IT, backup and cloud service providers.",
      "Customer dashboards or app logins for a brand whose marketing site lives elsewhere.",
      "Home labs and self-hosted services.",
    ],
    tips: [
      "Use the product name on its own: yourproduct.cloud already reads as the product’s home.",
      "Avoid repeating the word in the name (examplecloud.cloud).",
      "If the main brand lives on .com, .cloud makes the app login clearly separate from the marketing pages.",
    ],
    related: ["io", "host", "net", "online", "site"],
  },
  {
    slug: "eu",
    register: 9.95, transfer: 9.95, renew: 9.95,
    country: "the European Union",
    forWhom: "Businesses and people based in the EU who want a European identity.",
    about: "The top-level domain of the European Union, run by the non-profit registry EURid under EU regulation. It signals a European presence to customers across the member states rather than in one country. EURid also runs versions of the extension in Greek and Cyrillic script for names written in those alphabets.",
    rules: "You must be one of the following: a citizen of an EU member state, Iceland, Liechtenstein or Norway, wherever you live; a resident of one of those countries; or a business or organisation established in one of them. Registrations that stop meeting this can be suspended.",
    uses: [
      "Businesses that sell across several EU countries under one address.",
      "EU-based start-ups that want a European rather than a national identity.",
      "Associations, research projects and events that span member states.",
      "EU citizens living outside Europe who want a European personal domain.",
    ],
    tips: [
      "EURid requires at least two characters before the dot, and a name cannot start or end with a hyphen.",
      "If most customers are in one country, compare .eu with that country’s own extension: .eu is strongest when the audience is spread across Europe.",
      "Register in the name of the person or company that meets the eligibility rules, not an agency acting for them.",
    ],
    extraFaqs: [
      {
        question: "Can I register a .eu domain from the UK?",
        answer: "Only if you qualify another way. Since 1 January 2021, UK residents who are not EU citizens, and UK companies with no establishment in the EU, Iceland, Liechtenstein or Norway, cannot register new .eu names. A UK resident who holds citizenship of an EU country can, and so can a European subsidiary registering in its own name.",
      },
    ],
    related: ["com", "org", "net", "info", "name"],
  },
  {
    slug: "io",
    register: 69.95, transfer: 69.95, renew: 69.95,
    country: "the British Indian Ocean Territory",
    forWhom: "Tech start-ups, developer tools and software products.",
    about: "Technically the country code of the British Indian Ocean Territory, adopted by the tech industry because I/O reads as input/output. It is open to registrants anywhere, with no residency requirement. It costs several times what a .com does every year, which is worth weighing before you commit a brand to it.",
    uses: [
      "Start-ups and software products.",
      "Developer tools, APIs and open-source projects.",
      "Games and game studios.",
      "Documentation or status pages for a tech brand.",
    ],
    tips: [
      "Brevity is the reason people choose .io, so a long name loses the point.",
      "Budget for the renewal, not just the first year: the yearly rate stays the same and it is well above generic extensions.",
      "Register the .com of the name as well if you can; people type .com out of habit.",
    ],
    related: ["cloud", "dev", "com", "net", "xyz"],
  },
  {
    slug: "store",
    register: 69.95, transfer: 69.95, renew: 69.95,
    forWhom: "Online shops that want the address to say what they do.",
    about: "A generic extension for retail and ecommerce, open to anyone. It tells a visitor they can buy something before the page loads, and it works for shops with a physical counter as well as online-only brands.",
    uses: [
      "Online shops and direct-to-consumer brands.",
      "A shop for a brand whose main site lives on another domain.",
      "Marketplace sellers who want a storefront address of their own.",
      "Pop-up and seasonal stores.",
    ],
    tips: [
      "Use the brand name alone: hearth.store already says shop, so hearthshop.store repeats itself.",
      "Match the name to your social handles so customers find you either way.",
      "If the brand also lives on another domain, link or redirect the two so there is one checkout customers trust.",
    ],
    related: ["shop", "online", "com", "biz", "site"],
  },
  {
    slug: "online",
    register: 44.95, transfer: 44.95, renew: 44.95,
    forWhom: "Any business whose main presence is on the web.",
    about: "A generic extension open to anyone, often chosen when the .com of a short brand name is taken. It reads as a plain statement that the business is on the web, which suits service firms and creators alike.",
    uses: [
      "Businesses whose short .com is already registered.",
      "Online courses, coaching and digital services.",
      "Personal brands and creators.",
      "Launch and campaign sites.",
    ],
    tips: [
      "Keep the brand exact rather than adding words; .online is already the qualifier.",
      "Say it in a sentence: “brand dot online” should be easy to get across on a call or a podcast.",
      "Check for similar names on .com before you commit, so customers are not sent to a look-alike.",
    ],
    related: ["site", "website", "store", "com", "live"],
  },
  {
    slug: "pro",
    register: 31.95, transfer: 31.95, renew: 31.95,
    forWhom: "Consultants, freelancers and professional practices.",
    about: "A generic extension positioned for professionals. Until November 2015 it was restricted to licensed professionals; since the registry agreement was renewed that year, anyone can register one. It reads as credentials-first, which suits service businesses built on expertise.",
    uses: [
      "Consultants, freelancers and contractors.",
      "Practices such as accountants, architects, lawyers and therapists.",
      "Professional portfolios and CVs.",
      "Training and certification services.",
    ],
    tips: [
      "Use your own name or your practice’s name; .pro works as the credential, so the name does not need one.",
      "If your name is common, add your field (janesmithlaw.pro) rather than a number.",
      "Professional bodies may have their own rules on how members advertise. The extension does not change those.",
    ],
    related: ["biz", "com", "name", "design", "me"],
  },
  {
    slug: "shop",
    register: 41.95, transfer: 41.95, renew: 41.95,
    forWhom: "Stores of any size, from a single product to a full catalogue.",
    about: "A generic extension for retail, open to anyone. The English word is understood far beyond English-speaking countries, which makes it a clear signal for a store selling internationally.",
    uses: [
      "Independent retailers and makers.",
      "Brands opening an online shop next to an existing site.",
      "High-street shops that want a web address to match.",
      "Curated product and gift sites.",
    ],
    tips: [
      ".shop and .store do the same job; choose the one that sounds natural after your name.",
      "Short names first: a shop address appears on packaging, receipts and social posts.",
      "Use the same name on .shop and your social handles so customers can find you either way.",
    ],
    related: ["store", "online", "com", "biz", "site"],
  },
  {
    slug: "xyz",
    register: 16.95, transfer: 16.95, renew: 16.95,
    forWhom: "Side projects, new brands and anyone who wants a short, available name.",
    about: "A generic extension with no implied industry, which makes short names far easier to find than on .com. It is open to anyone, at the same yearly price as .net.",
    uses: [
      "Side projects and experiments.",
      "Short links and redirect domains.",
      "New brands that want a short name now.",
      "Personal sites and portfolios.",
    ],
    tips: [
      "Use the shortest version of the name: availability is the reason to choose .xyz.",
      "Because the extension says nothing about what you do, the name has to.",
      "When you say it aloud, spell the extension out (x-y-z) so it is not misheard.",
    ],
    related: ["site", "online", "io", "club", "rocks"],
  },
  {
    slug: "live",
    register: 35.95, transfer: 35.95, renew: 35.95,
    forWhom: "Streamers, events, venues and live entertainment.",
    about: "A generic extension for anything that happens in real time: streams, shows, events and broadcasts. It is open to anyone, and it suits names that should read as happening now.",
    uses: [
      "Streamers and live channels.",
      "Venues, festivals and event series.",
      "Live music and sports coverage.",
      "Webinars and online classes held at set times.",
    ],
    tips: [
      "Use your channel name or handle so viewers connect the domain with the stream.",
      "Point it at a schedule page or straight at the platform you stream on.",
      "If recorded video is the core of what you do, compare .tv as well.",
    ],
    related: ["tv", "social", "club", "rocks", "online"],
  },
  {
    slug: "club",
    register: 22.95, transfer: 22.95, renew: 22.95,
    forWhom: "Clubs, memberships, fan groups and communities.",
    about: "A generic extension for member-based groups, from sports clubs to subscription communities. It is open to anyone.",
    uses: [
      "Sports, hobby and social clubs.",
      "Fan clubs and book clubs.",
      "Paid memberships and subscription communities.",
      "Venues and social clubs.",
    ],
    tips: [
      "Use the name members already call the club, not its formal legal name.",
      "Register it in the club’s name rather than one volunteer’s, and give more than one person access.",
      "Turn on auto-renewal: committees change, and a forgotten renewal is how clubs lose their domain.",
    ],
    related: ["social", "org", "live", "rocks", "xyz"],
  },
  {
    slug: "site",
    register: 46.95, transfer: 46.95, renew: 46.95,
    forWhom: "Portfolios, small business sites and personal projects.",
    about: "A plain, generic extension that says exactly what it is. It is open to anyone, and because it implies no industry it fits any kind of website.",
    uses: [
      "Portfolios and personal sites.",
      "Small business websites.",
      "Landing pages for a single product or offer.",
      "Personal and hobby projects.",
    ],
    tips: [
      "Let the name carry the meaning: .site tells people it is a website, not what it is about.",
      "Keep the name short enough to fit on a business card next to the extension.",
      "If you also own another domain for the business, redirect one to the other so visitors see one address.",
    ],
    related: ["website", "online", "xyz", "store", "info"],
  },
  {
    slug: "me",
    register: 38.95, transfer: 38.95, renew: 38.95,
    country: "Montenegro",
    forWhom: "Personal brands, CVs, portfolios and about-me pages.",
    about: "The country code of Montenegro. Second-level names such as yourname.me are open to registrants worldwide with no residency requirement, and the extension is widely used for personal sites because it reads as a word.",
    uses: [
      "Personal sites, CVs and portfolios.",
      "About-me and link-in-bio pages.",
      "Phrase-style names that end with “me”.",
      "Personal email addresses at your own name.",
    ],
    tips: [
      "Your own name works best: firstnamelastname.me is easy to say and to put on a CV.",
      "If you want a phrase, read it aloud to check it says what you mean.",
      "Keep it personal; a company site on .me can read as one person’s project.",
    ],
    related: ["name", "pro", "blog", "design", "com"],
  },
  {
    slug: "tv",
    register: 44.95, transfer: 44.95, renew: 44.95,
    country: "Tuvalu",
    forWhom: "Video creators, channels, studios and media brands.",
    about: "The country code of Tuvalu, open to registrants worldwide and adopted by video and broadcast brands because it reads as television. Some short and dictionary .tv names are classed as premium by the registry and cost more than the standard price.",
    uses: [
      "Video channels and creators.",
      "Production studios and agencies.",
      "Shows, series and video podcasts.",
      "Media and broadcast brands.",
    ],
    tips: [
      "Use your channel name exactly, so the domain matches what viewers already search for.",
      "If a name comes back as premium, its price is set by the registry; checkout shows it before you pay.",
      "Point it at your channel or at a page that lists every platform you publish on.",
    ],
    related: ["live", "social", "me", "rocks", "online"],
  },
  {
    slug: "rocks",
    register: 21.95, transfer: 21.95, renew: 21.95,
    forWhom: "Bands, creative projects and brands with a sense of humour.",
    about: "A generic extension that turns a name into a phrase. It is open to anyone, and it suits projects that want to sound informal rather than corporate.",
    uses: [
      "Bands and musicians.",
      "Fan and appreciation sites.",
      "Creative projects and events.",
      "Informal brands and personal sites.",
    ],
    tips: [
      "Read it as a sentence: the name plus “rocks” should say something you mean.",
      "It works for an informal side site even if the main brand stays on .com.",
      "Avoid it where people expect formality, such as finance or legal services.",
    ],
    related: ["live", "club", "xyz", "social", "design"],
  },
  {
    slug: "name",
    register: 11.95, transfer: 11.95, renew: 11.95,
    forWhom: "Individuals who want a site or email address at their own name.",
    about: "A generic extension created for personal names, such as firstnamelastname.name. It is open to anyone, and it is one of the least expensive extensions the store sells.",
    uses: [
      "Personal websites at your own name.",
      "A permanent personal email address.",
      "Family sites and genealogy projects.",
      "Online CVs and portfolios.",
    ],
    tips: [
      "Use your name as you write it professionally, including a middle initial if that is how people know you.",
      "Register it early: a personal domain is most useful once it has been on your CV for years.",
      "Use it for email as well as a site, so the address stays yours whichever provider you use.",
    ],
    related: ["me", "pro", "blog", "com", "eu"],
  },
  {
    slug: "blog",
    register: 34.95, transfer: 34.95, renew: 34.95,
    forWhom: "Writers, publications and company blogs.",
    about: "A generic extension for blogs and publishing, open to anyone. It works as a standalone blog address or alongside a main business domain.",
    uses: [
      "Personal and professional blogs.",
      "Newsletters with a web archive.",
      "Company blogs separate from the main site.",
      "Niche publications and review sites.",
    ],
    tips: [
      "Use the publication’s name rather than your own if it may grow beyond one writer.",
      "For a company blog, the brand name on .blog reads as the official blog.",
      "Avoid dates or topics in the name that may stop being true.",
    ],
    related: ["me", "info", "name", "site", "social"],
  },
  {
    slug: "us",
    register: 11.95, transfer: 11.95, renew: 11.95,
    country: "the United States",
    forWhom: "Businesses and people based in the United States.",
    about: "The country-code extension for the United States, run under a contract with the US Department of Commerce. It is short, inexpensive, and a clear signal of a US presence.",
    rules: "Every registrant must meet the usTLD nexus requirements: a US citizen or permanent resident, or someone whose main home is in the US or its territories; an organisation incorporated or organised in the US; or a foreign organisation with a bona fide presence in the US, such as regular lawful business activity or an office there. You confirm this at registration, and it must stay true for as long as you hold the name.",
    uses: [
      "US businesses that want a national address.",
      "Individuals based in the US.",
      "US organisations, associations and non-profits.",
      "A short alternative when the .com of a US brand is taken.",
    ],
    tips: [
      "Make sure the registrant is the person or company that meets the nexus requirement.",
      "Remember the registrant details are published, so use business contact details for a company domain.",
      "If customers are outside the US too, a generic extension may suit them better.",
    ],
    extraFaqs: [
      {
        question: "What proof do I need for a .us domain?",
        answer: "None at checkout: you choose the nexus category that applies to you and confirm it. The registry runs nexus checks, and if your registration is checked it can ask for evidence, such as a US passport or green card for an individual, or a lease, tax ID or other official document showing a US address for an organisation.",
      },
    ],
    related: ["com", "net", "org", "biz", "name"],
  },
  {
    slug: "design",
    register: 61.95, transfer: 61.95, renew: 61.95,
    forWhom: "Designers, studios, agencies and creative portfolios.",
    about: "A generic extension for design work of any kind, from graphic and product design to interiors and fashion. It is open to anyone.",
    uses: [
      "Designer and studio portfolios.",
      "Design agencies.",
      "Interior, fashion and product design businesses.",
      "Design systems and style guides.",
    ],
    tips: [
      "Use the studio name or your own name; the extension already says what you do.",
      "A short name looks better on a portfolio, a business card and a credit line.",
      "Point it at your portfolio even if you also sell on other platforms.",
    ],
    related: ["pro", "me", "site", "rocks", "store"],
  },
  {
    slug: "host",
    register: 116.95, transfer: 116.95, renew: 116.95,
    forWhom: "Hosting companies, servers and infrastructure projects.",
    about: "A generic extension for hosting and infrastructure, open to anyone. It is the most expensive extension the store sells, which keeps short names more available than on cheaper extensions.",
    uses: [
      "Hosting companies and resellers.",
      "Server, game-server and infrastructure projects.",
      "Nameserver and mail hostnames for a hosting brand.",
      "Event hosts and hospitality businesses.",
    ],
    tips: [
      "Budget for the renewal: the yearly rate is the same after the first year, and it is the highest in the store.",
      "Use the brand name on its own; repeating hosting in the name is redundant.",
      "Keep customer-facing pages on your main domain if .host is only for infrastructure.",
    ],
    related: ["cloud", "net", "io", "online", "site"],
  },
  {
    slug: "social",
    register: 41.95, transfer: 41.95, renew: 41.95,
    forWhom: "Communities, social projects and agencies that run social media.",
    about: "A generic extension for anything built around people talking to each other. It is open to anyone.",
    uses: [
      "Social media agencies and consultants.",
      "Online communities and forums.",
      "Link-in-bio pages that list every profile.",
      "Social clubs and meet-up groups.",
    ],
    tips: [
      "Match the name to your handle so the domain and the profiles reinforce each other.",
      "Use it as the one link in your bio that points at all your profiles.",
      "Pick a name that still works if the platforms you use change.",
    ],
    related: ["club", "live", "blog", "org", "me"],
  },
  {
    slug: "website",
    register: 39.95, transfer: 39.95, renew: 39.95,
    forWhom: "Businesses that want an unmistakable web address.",
    about: "A generic extension that names itself. It is open to anyone, and short names are often still unregistered.",
    uses: [
      "Small business websites.",
      "Portfolios and personal sites.",
      "Web designers showing client work.",
      "Projects that need an obvious web address on print.",
    ],
    tips: [
      "Keep the name short, because the extension is long.",
      "It reads well on print and signage, where people need to recognise a web address at a glance.",
      "Check how the full address looks on a business card before you commit.",
    ],
    related: ["site", "online", "store", "info", "com"],
  },
];

const bySlug = new Map(tldCatalog.map((t) => [t.slug, t]));

export function tldBySlug(slug: string): TldEntry | undefined {
  return bySlug.get(slug);
}

/** Related entries that exist in the catalog, in the order given. */
export function relatedTlds(entry: TldEntry): TldEntry[] {
  return entry.related.map((s) => bySlug.get(s)).filter((t): t is TldEntry => Boolean(t));
}
