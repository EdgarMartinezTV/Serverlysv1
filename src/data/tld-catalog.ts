/**
 * Every domain extension the store sells, for the /tld/<ext> landing pages.
 *
 * PRICES: read from the WHMCS public feed (serverlys.com/feeds/domainpricing.php)
 * on PRICES_AS_OF. Register, transfer and renewal are listed separately because
 * the feed lists them separately — today they are equal for every extension,
 * which is the point the pages make: no first-year discount that doubles at
 * renewal. Re-read the feed before changing a number, and update PRICES_AS_OF
 * in the same edit.
 *
 * This is NOT data/tlds.ts. That file is the 8-extension set the domain search,
 * RDAP lookup and pricing components are built around; widening it changes
 * what the search accepts. This catalog only feeds pages. Where the two overlap
 * the prices must agree.
 *
 * COPY: `about` and `rules` state only what is true of the extension itself
 * (who runs it in general terms, who may register it). Nothing here is a claim
 * about search ranking — Google treats generic extensions alike.
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
  /** What it is. Two or three sentences, specific to this extension. */
  about: string;
  /** Registration conditions beyond "anyone may register". */
  rules?: string;
  /** Slugs worth comparing on this page. */
  related: readonly string[];
};

export const tldCatalog: readonly TldEntry[] = [
  {
    slug: "com",
    register: 14.95, transfer: 14.95, renew: 14.95,
    forWhom: "Any business that wants the address customers type by default.",
    about: "The original commercial extension and still the one people assume when they hear a business name. Open to anyone, anywhere, for any purpose.",
    related: ["net", "co", "us", "shop", "online"],
  },
  {
    slug: "net",
    register: 16.95, transfer: 16.95, renew: 16.95,
    forWhom: "Tech, network and internet businesses, or a fallback when the .com is taken.",
    about: "Created for network infrastructure providers and now used by every kind of business. Open to anyone with no residency or purpose requirement.",
    related: ["com", "org", "io", "cloud", "host"],
  },
  {
    slug: "org",
    register: 16.95, transfer: 16.95, renew: 16.95,
    forWhom: "Non-profits, communities, open-source projects and causes.",
    about: "Long associated with non-profit organisations, though registration is open to anyone. Readers tend to read a .org as a mission rather than a shop.",
    related: ["com", "net", "info", "social", "blog"],
  },
  {
    slug: "biz",
    register: 21.95, transfer: 21.95, renew: 21.95,
    forWhom: "Businesses that want a clearly commercial address when the .com is gone.",
    about: "An extension intended for business and commercial use. The registry's policy expects names to be used for bona fide business purposes.",
    rules: "Intended for commercial use; personal or non-commercial sites are outside the registry's stated purpose.",
    related: ["com", "pro", "store", "shop", "online"],
  },
  {
    slug: "info",
    register: 27.95, transfer: 27.95, renew: 27.95,
    forWhom: "Guides, resource sites and informational projects.",
    about: "A generic extension for informational sites. Open to anyone with no purpose requirement.",
    related: ["org", "blog", "site", "website", "online"],
  },
  {
    slug: "cloud",
    register: 26.95, transfer: 26.95, renew: 26.95,
    forWhom: "SaaS products, cloud services and software companies.",
    about: "A generic extension aimed at cloud and software businesses. Short and descriptive for anything delivered online.",
    related: ["io", "host", "net", "online", "site"],
  },
  {
    slug: "eu",
    register: 9.95, transfer: 9.95, renew: 9.95,
    country: "the European Union",
    forWhom: "Businesses and people based in the EU who want a European identity.",
    about: "The country-code extension for the European Union, run for the EU institutions. It signals a European presence to customers across the member states.",
    rules: "The registrant must be an EU or EEA citizen, resident, or an organisation established in the EU/EEA. Registrations that stop meeting this can be suspended.",
    related: ["com", "org", "net", "info", "name"],
  },
  {
    slug: "io",
    register: 69.95, transfer: 69.95, renew: 69.95,
    country: "the British Indian Ocean Territory",
    forWhom: "Tech start-ups, developer tools and software products.",
    about: "Technically the country code of the British Indian Ocean Territory, adopted by the tech industry because I/O reads as input/output. Open to registrants anywhere.",
    related: ["cloud", "dev", "com", "net", "xyz"],
  },
  {
    slug: "store",
    register: 69.95, transfer: 69.95, renew: 69.95,
    forWhom: "Online shops that want the address to say what they do.",
    about: "A generic extension for retail and ecommerce. It tells a visitor they can buy something before the page loads.",
    related: ["shop", "online", "com", "biz", "site"],
  },
  {
    slug: "online",
    register: 44.95, transfer: 44.95, renew: 44.95,
    forWhom: "Any business whose main presence is on the web.",
    about: "A generic extension open to anyone, often chosen when the .com of a short brand name is taken.",
    related: ["site", "website", "store", "com", "live"],
  },
  {
    slug: "pro",
    register: 31.95, transfer: 31.95, renew: 31.95,
    forWhom: "Consultants, freelancers and professional practices.",
    about: "A generic extension positioned for professionals. It reads as credentials-first, which suits service businesses built on expertise.",
    related: ["biz", "com", "name", "design", "me"],
  },
  {
    slug: "shop",
    register: 41.95, transfer: 41.95, renew: 41.95,
    forWhom: "Stores of any size, from a single product to a full catalogue.",
    about: "A generic extension for retail, recognisable in any language. Open to anyone.",
    related: ["store", "online", "com", "biz", "site"],
  },
  {
    slug: "xyz",
    register: 16.95, transfer: 16.95, renew: 16.95,
    forWhom: "Side projects, new brands and anyone who wants a short, available name.",
    about: "A generic extension with no implied industry, which makes short names far easier to find than on .com.",
    related: ["site", "online", "io", "club", "rocks"],
  },
  {
    slug: "live",
    register: 35.95, transfer: 35.95, renew: 35.95,
    forWhom: "Streamers, events, venues and live entertainment.",
    about: "A generic extension for anything that happens in real time: streams, shows, events and broadcasts.",
    related: ["tv", "social", "club", "rocks", "online"],
  },
  {
    slug: "club",
    register: 22.95, transfer: 22.95, renew: 22.95,
    forWhom: "Clubs, memberships, fan groups and communities.",
    about: "A generic extension for member-based groups, from sports clubs to subscription communities.",
    related: ["social", "org", "live", "rocks", "xyz"],
  },
  {
    slug: "site",
    register: 46.95, transfer: 46.95, renew: 46.95,
    forWhom: "Portfolios, small business sites and personal projects.",
    about: "A plain, generic extension that says exactly what it is. Open to anyone.",
    related: ["website", "online", "xyz", "store", "info"],
  },
  {
    slug: "me",
    register: 38.95, transfer: 38.95, renew: 38.95,
    country: "Montenegro",
    forWhom: "Personal brands, CVs, portfolios and about-me pages.",
    about: "The country code of Montenegro, opened to registrants worldwide and widely used for personal sites because it reads as a word.",
    related: ["name", "pro", "blog", "design", "com"],
  },
  {
    slug: "tv",
    register: 44.95, transfer: 44.95, renew: 44.95,
    country: "Tuvalu",
    forWhom: "Video creators, channels, studios and media brands.",
    about: "The country code of Tuvalu, open to registrants worldwide and adopted by video and broadcast brands because it reads as television.",
    related: ["live", "social", "me", "rocks", "online"],
  },
  {
    slug: "rocks",
    register: 21.95, transfer: 21.95, renew: 21.95,
    forWhom: "Bands, creative projects and brands with a sense of humour.",
    about: "A generic extension that turns a name into a phrase. Open to anyone.",
    related: ["live", "club", "xyz", "social", "design"],
  },
  {
    slug: "name",
    register: 11.95, transfer: 11.95, renew: 11.95,
    forWhom: "Individuals who want a site or email address at their own name.",
    about: "A generic extension for personal names, such as firstname.lastname.name. Open to anyone.",
    related: ["me", "pro", "blog", "com", "eu"],
  },
  {
    slug: "blog",
    register: 34.95, transfer: 34.95, renew: 34.95,
    forWhom: "Writers, publications and company blogs.",
    about: "A generic extension for blogs and publishing. It works as a standalone blog address or alongside a main business domain.",
    related: ["me", "info", "name", "site", "social"],
  },
  {
    slug: "us",
    register: 11.95, transfer: 11.95, renew: 11.95,
    country: "the United States",
    forWhom: "Businesses and people based in the United States.",
    about: "The country-code extension for the United States. Short, inexpensive, and a clear signal of a US presence.",
    rules: "Registrants must have a bona fide connection to the US: a US citizen or resident, a US-organised business, or an organisation with a real presence in the US. You confirm this at registration.",
    related: ["com", "net", "org", "biz", "name"],
  },
  {
    slug: "design",
    register: 61.95, transfer: 61.95, renew: 61.95,
    forWhom: "Designers, studios, agencies and creative portfolios.",
    about: "A generic extension for design work of any kind, from graphic and product design to interiors and fashion.",
    related: ["pro", "me", "site", "rocks", "store"],
  },
  {
    slug: "host",
    register: 116.95, transfer: 116.95, renew: 116.95,
    forWhom: "Hosting companies, servers and infrastructure projects.",
    about: "A generic extension for hosting and infrastructure. Its price keeps short names more available than on cheaper extensions.",
    related: ["cloud", "net", "io", "online", "site"],
  },
  {
    slug: "social",
    register: 41.95, transfer: 41.95, renew: 41.95,
    forWhom: "Communities, social projects and agencies that run social media.",
    about: "A generic extension for anything built around people talking to each other.",
    related: ["club", "live", "blog", "org", "me"],
  },
  {
    slug: "website",
    register: 39.95, transfer: 39.95, renew: 39.95,
    forWhom: "Businesses that want an unmistakable web address.",
    about: "A generic extension that names itself. Open to anyone, often with short names still available.",
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
