import Link from "next/link";
import { cn } from "@/lib/utils";
import { INK, Label, MUTED, Wrap } from "@/components/retell/kit";
import { Icon, type IconName } from "@/components/retell/icons";
import { Reveal } from "@/components/animations/reveal";
import { formatPrice, lowestRate } from "@/data/pricing";
import { formatDesignPrice, designFromPrice } from "@/data/design-plans";
import { formatSeoPrice, seoFromPrice } from "@/data/seo-plans";
import { formatSocialPrice, socialFromPrice } from "@/data/social-plans";
import { formatCarePrice, careFromPrice } from "@/data/care-plans";

/**
 * "Or pick the pieces" — every Serverlys service with its real starting
 * price, each read from the same data file its own page renders, so this
 * grid can never disagree with the page it links to. No bundle discount is
 * implied: these are the standard prices.
 *
 * Business email's prices live on /business-email itself (page-local), so
 * its figure is written here; keep it in step with that page.
 */

type Service = {
  icon: IconName;
  name: string;
  price: string;
  body: string;
  href: string;
};

const SERVICES: Service[] = [
  {
    icon: "server",
    name: "Cloud hosting",
    price: `From ${formatPrice(lowestRate)}/mo`,
    body: "Fast LiteSpeed hosting with free SSL, daily backups and free migration.",
    href: "/cloud-hosting",
  },
  {
    icon: "layout",
    name: "Website design",
    price: `From ${formatDesignPrice(designFromPrice)}`,
    body: "A custom website built on WordPress, one-time project price.",
    href: "/website-design",
  },
  {
    icon: "pin",
    name: "SEO",
    price: `From ${formatSeoPrice(seoFromPrice)}/mo`,
    body: "Local SEO, content and links that get you found on Google.",
    href: "/seo",
  },
  {
    icon: "pen",
    name: "Social media",
    price: `From ${formatSocialPrice(socialFromPrice)}/mo`,
    body: "Posts planned, designed and published for you, every month.",
    href: "/social-media",
  },
  {
    icon: "shield",
    name: "Site management",
    price: `From ${formatCarePrice(careFromPrice)}/mo`,
    body: "Updates, backups, security and content changes, handled.",
    href: "/site-management",
  },
  {
    icon: "code",
    name: "Web development",
    price: "$129/hr",
    body: "Custom features, bookings, payments and integrations.",
    href: "/website-development",
  },
  {
    icon: "doc",
    name: "Business email",
    price: "From $5.95/mo",
    body: "Professional mailboxes at your own domain.",
    href: "/business-email",
  },
  {
    icon: "team",
    name: "AI agents",
    price: "Chat and voice",
    body: "AI that answers your website chat and your phone, day and night.",
    href: "/ai-agents",
  },
  {
    icon: "loop",
    name: "Automations",
    price: "Built to fit",
    body: "Enquiries turned into bookings, records and follow-ups automatically.",
    href: "/automations",
  },
];

export function Services() {
  return (
    <section aria-labelledby="biz-services-heading" className="bg-white py-20 lg:py-28">
      <Wrap>
        <Label className="text-center">Or pick the pieces</Label>
        <h2
          id="biz-services-heading"
          className={cn(
            "mx-auto mt-4 max-w-[760px] text-center font-display text-[32px] leading-[1.15] font-normal tracking-[-0.025em] sm:text-[40px] lg:text-[46px]",
            INK,
          )}
        >
          Every service, from one supplier
        </h2>
        <p
          className={cn(
            "mx-auto mt-5 max-w-[640px] text-center text-[17px] leading-[1.6]",
            MUTED,
          )}
        >
          Already have a website? Add only what you need. It all lives in one account,
          on one bill, with one team to call.
        </p>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal as="li" key={s.name} delay={(i % 3) * 80}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl bg-[#f4f4f7] p-6 transition-colors duration-fast hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span className="text-[13px] font-semibold text-primary">
                    {s.price}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-6 text-[22px] leading-tight tracking-[-0.01em]",
                    INK,
                  )}
                >
                  {s.name}
                </span>
                <span className={cn("mt-2 flex-1 text-[14px] leading-[1.6]", MUTED)}>
                  {s.body}
                </span>
                <span className="mt-5 text-[14px] font-semibold text-primary">
                  See {s.name.replace(/^(?!SEO|AI)\w/, (c) => c.toLowerCase())}{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
