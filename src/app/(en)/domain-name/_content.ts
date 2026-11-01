import type { HeroCopy } from "@/components/ref/domain/hero";
import type { FaqItem } from "@/components/ref/faqs";

/**
 * Domain name search page content.
 *
 * A 1:1 rebuild of hostinger.com/domain-name-search on the same terms as
 * /cloud-hosting and /ecommerce-hosting: the reference's section order, grid,
 * type scale and copy, brand noun swapped, links repointed at our routes.
 * Measurements live in components/ref/kit.tsx.
 *
 * PRICES ARE NOT HERE. Every figure on this page comes from `data/tlds.ts`,
 * which holds our real first-year registration prices, and availability comes
 * from `/api/domains/check`. Nothing on this page is a hardcoded price.
 *
 * Removed from the reference, matching the calls made on the other two clones:
 * the "Trusted by 4+ million website owners" review carousel (their customers,
 * not ours) and the promo strip offering a free month of a plan we do not run.
 */

export const HERO: HeroCopy = {
  title: "Search for a domain name",
  lede: "Check availability against the registry, then register at Serverlys.",
  promo: {
    title: "Free WHOIS privacy on every eligible extension",
    body: "Applies wherever the registry permits masked contact details.",
  },
  stats: [
    { value: "500+", label: "domain extensions at checkout" },
    { value: "RDAP", label: "live registry answers, never a guess" },
  ],
  aside: {
    label: "Domain transfer",
    body: "Already own the name? Move it and keep the remaining registration.",
    href: "/transfer-domain",
  },
};

export const REASONS = {
  title: "Why buy domain names at Serverlys?",
  cta: { label: "Find your domain", href: "#search" },
  items: [
    {
      icon: "shield" as const,
      title: "Trusted domain registrar",
      body: "Registration runs through our WHMCS billing system, which is the authority on what is sellable and at what price — our search is a fast first opinion, never the last word.",
    },
    {
      icon: "lock" as const,
      title: "Privacy",
      body: "When you register a domain, your contact details may appear in public RDAP/WHOIS records. For supported extensions, Serverlys includes free privacy protection to keep your personal information hidden from third parties.",
    },
    {
      icon: "chat" as const,
      title: "24/7 support",
      body: "Our agents are available on live chat or email, and a person reads the whole conversation rather than a summary.",
    },
    {
      icon: "gear" as const,
      title: "Quick setup, easy management",
      body: "Register your domain in a few clicks, then manage everything in one place — renewals, DNS settings, and connections to your website or email.",
    },
  ],
};

export const STEPS = {
  title: "How to get the best domain name",
  items: [
    {
      title: "Include your brand name",
      body: "Use your brand name or keywords to boost recognition and visibility in search results.",
    },
    {
      title: "Keep it short",
      body: "Domain names under three words are easier to read and remember.",
    },
    {
      title: "Less is more",
      body: "Avoid hyphens, numbers, slang, and hard-to-spell words.",
    },
    {
      title: "Think locally",
      body: "If .com is taken, try a country-specific extension like .co.uk, .us, or .pk for better regional targeting.",
    },
    {
      title: "Domain availability search",
      body: "Search for your desired custom domain to see if it’s available. Remember to check that it hasn’t been trademarked.",
      cta: "Start search",
    },
    {
      title: "Act fast",
      body: "Great domains sell quickly – search and secure yours today.",
    },
  ],
};

export const FAQ_HEAD = {
  title: "Domain name search FAQs",
  description: "Find answers to frequently asked questions about our domain checker tool.",
};

export const FAQS: FaqItem[] = [
  {
    q: "What is a domain name?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "A domain name, or simply domain, is similar to a home address in real life. It’s how people find your site online – they enter the domain in a web browser or search engine.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Serverlys.com is a domain, just like Google.com and Facebook.com. Ideally, a domain should be registered under the same name as the brand it’s representing.",
          },
        ],
      },
    ],
  },
  {
    q: "Why do I need to buy a domain name?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "It’s important to buy domain names to help potential visitors find your site. Without assigned website names, we would only be able to access them by entering their IP address, which is more difficult to remember.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "To find a good name while performing a domain search, you can include keywords or brand names.",
          },
        ],
      },
    ],
  },
  {
    q: "What is a subdomain, and how does it work?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "A subdomain is a part of your website that lives under your main domain, like blog.yoursite.com. It helps you create separate sections for things like a blog, store, or help page without needing a new domain.",
          },
        ],
      },
    ],
  },
  {
    q: "How to pick the right website name?",
    a: [
      { type: "p", runs: [{ text: "The best practices for buying domain names include the following:" }] },
      {
        type: "ul",
        items: [
          "Keep it short. Two to three words is ideal.",
          "Keep it simple. Avoid long or complex words.",
          "Use keywords. Include a keyword from your niche.",
          "Avoid numbers. Numbers can be confusing and harder to remember.",
          "Use your brand name, for maximum recognition.",
        ],
      },
      {
        type: "p",
        runs: [
          { text: "Once you have an idea, enter it into our " },
          { text: "domain search tool", href: "#search" },
          { text: " to check if it’s available." },
        ],
      },
    ],
  },
  {
    q: "Once I register a domain, can I change it later?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "No, you cannot change a domain name once it’s registered. However, you can register a new one and redirect your website to it. This means when someone visits your old domain, they’ll be sent to the new one automatically.",
          },
        ],
      },
    ],
  },
  {
    q: "How long does a domain name registration last?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "The minimum registration period for domain names is one year. With Serverlys, you can also register .com, .net, .org, and other domains for longer terms. Some domains, like .ai, require a minimum of two years.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          { text: "To keep your website online without interruption, we recommend enabling automatic renewal." },
        ],
      },
    ],
  },
  {
    q: "What are the requirements to buy domain names at Serverlys?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "It’s free to check domain availability and there are no special requirements for buying a domain name. We only require basic contact information and a valid payment method.",
          },
        ],
      },
      {
        type: "p",
        runs: [{ text: "You can also buy domains with us and point them to another hosting provider." }],
      },
    ],
  },
  {
    q: "I already purchased a domain name. Can I transfer it to Serverlys?",
    a: [
      {
        type: "p",
        runs: [
          { text: "Yes. When you buy a domain, it belongs to you – and not the domain registrar. It’s easy to use our " },
          { text: "domain transfer service", href: "/transfer-domain" },
          { text: " to switch to Serverlys. We’ll walk you through every step of the process." },
        ],
      },
    ],
  },
  {
    q: "What are TLDs, ccTLDs, and gTLDs?",
    a: [
      {
        type: "p",
        runs: [{ text: "TLD stands for top-level domain. This is the final component of a domain, like .com." }],
      },
      {
        type: "p",
        runs: [
          {
            text: "ccTLD stands for country-code top-level domain. This is a subcategory of TLDs used to identify a particular country – for example, .co.uk, .de, .mx, and .fr are all ccTLDs.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "gTLD stands for generic top-level domain. gTLDs are the most common type of domain name, in part because this category includes .com domains, which have more registrations than all ccTLDs combined.",
          },
        ],
      },
    ],
  },
  {
    q: "How long does it take to register a domain name?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Registration is usually complete within a couple of minutes of checkout, so your domain is ready to use right away.",
          },
        ],
      },
    ],
  },
  {
    q: "What if the website name is unavailable on the domain checker?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "If the website name has already been registered, you can try another extension. Often, the most popular extensions are already taken, but country-specific extensions such as .co.uk, or less common ones like .xyz or .online might still be available. Our domain search tool will also suggest other available options — and a registered name is a transfer candidate rather than a dead end.",
          },
        ],
      },
    ],
  },
  {
    q: "What is privacy protection?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Domain privacy protection is sometimes called RDAP (previously known as WHOIS) protection because it hides certain information about a domain name’s owner that would otherwise be discoverable through a public RDAP lookup.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Privacy protection lets the domain registrar replace your name, address, phone number, email address, and business name with a set of generic, non-identifiable information.",
          },
        ],
      },
    ],
  },
  {
    q: "What’s the difference between .com, .net, .org, and .info?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Each gTLD carries a slightly different meaning, so it’s usually best to pick one that’s most relevant to your website.",
          },
        ],
      },
      {
        type: "ul",
        items: [
          ".com is commonly used for commercial purposes, and is considered the default option.",
          ".net was originally used by networking companies but is now multipurpose.",
          ".org is still largely used as the gTLD for charities, communities, and local organizations.",
          ".info is aimed at information-based websites such as wikis and tutorial sites.",
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "There’s no rule saying you have to use one type of TLD or another. Treat the above as guidelines.",
          },
        ],
      },
    ],
  },
  {
    q: "What else can I do with a domain name besides building a website?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Besides building a website, you can use your domain to create a professional email address, like name@surname.com, which looks more credible than a generic one. You can also set up domain forwarding to redirect visitors to your social media profiles or any other page you want people to find easily.",
          },
        ],
      },
    ],
  },
  {
    q: "What’s the difference between a domain name and web hosting?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Think of your domain name as your home address and web hosting as the physical structure, like a house. A domain helps people find your site; hosting is the online space to store your website data. To publish a website, you’ll need both.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          { text: "Our " },
          { text: "hosting plans", href: "/hosting" },
          { text: " include a free domain for the first year on eligible terms." },
        ],
      },
    ],
  },
  {
    q: "What are premium domain names and why are they more expensive?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Premium domain names are high-value domains that are short, easy to remember, or include popular keywords. Due to their market value, they cost more upfront and often have higher renewal fees. Our search flags what it cannot price, and WHMCS is the authority on premium status at checkout.",
          },
        ],
      },
    ],
  },
];
