import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, groupById } from "@/data/pricing";

/**
 * Typical setups.
 *
 * The reference band this replaces is a masonry of customer reviews. There is
 * no review data on this site and there is no honest way to manufacture one:
 * an invented quote with an invented name attached is a fabricated record, and
 * putting one on a real company's homepage is not a design decision.
 *
 * So this is the same shape carrying something we can actually stand behind —
 * configurations, each one assembled from products and prices that exist in the
 * data files. The heading says "setups" and every card is written in the second
 * person precisely so nothing here can be misread as a testimonial. When real
 * reviews exist, they belong here and this can go.
 *
 * Masonry is CSS columns rather than grid. A grid row is as tall as its tallest
 * card, and these cards differ by 60-odd pixels — enough that a grid leaves a
 * visible ragged gap under every short one.
 */
export function SetupsGrid() {
  const cloud = groupById("cloud");
  const starter = cloud?.plans.find((plan) => plan.tier === "starter");
  const turbo = cloud?.plans.find((plan) => plan.tier === "turbo");

  const setups = [
    {
      tag: "One site",
      title: "A business card that loads instantly",
      body: starter
        ? `${starter.name} at ${formatPrice(starter.monthly)}/mo, against a ${formatPrice(starter.standard)}/mo standard rate. ${starter.specs.sites}, ${starter.specs.visits}, free SSL and daily backups.`
        : "A single site on the entry cloud tier, with free SSL and daily backups.",
    },
    {
      tag: "Trades and services",
      title: "Nobody answers the phone at 6pm, so CallFlow does",
      body: "Hosting for the site, CallFlow on the number. Missed calls come back as a booking and a transcript instead of a voicemail you still have to return.",
    },
    {
      tag: "Agency",
      title: "Twenty client sites on one account",
      body: turbo
        ? `${turbo.name} at ${formatPrice(turbo.monthly)}/mo, against a ${formatPrice(turbo.standard)}/mo standard rate. ${turbo.specs.sites}, one-click staging on each, and free migration for every site you bring across.`
        : "Unlimited sites on one plan, with staging on each and free migration.",
    },
    {
      tag: "Store",
      title: "A checkout that holds up on the day it matters",
      body: "WooCommerce on ecommerce hosting, NVMe storage and LiteSpeed caching in front of it. The traffic spike is the thing you planned for, not the thing that took the site down.",
    },
    {
      tag: "Moving in",
      title: "Leaving a host that got expensive at renewal",
      body: "Free migration, and the renewal rate printed next to the promo rate before you buy, so the second year is not a surprise. Thirty days to change your mind either way.",
    },
    {
      tag: "Hands off",
      title: "Someone else does the updates",
      body: "Managed hosting on the same infrastructure — our team handles patching, monitoring and security, and tells you what changed rather than leaving you to notice.",
    },
  ];

  return (
    <Section surface="light" spacing="base" width="wide" labelledBy="setups-heading">
      <Reveal>
        <SectionHeader
          eyebrow="Typical setups"
          title="What people put together here"
          lede="Six common shapes, priced from the same table as everything else on this page."
          id="setups-heading"
          align="center"
        />
      </Reveal>

      <Reveal delay={80} className="mt-12">
        <ul className="gap-5 sm:columns-2 lg:columns-3">
          {setups.map((setup) => (
            <li key={setup.title} className="mb-5 break-inside-avoid">
              <Card variant="elevated" padding="lg">
                <Badge tone="brand" className="w-fit">
                  {setup.tag}
                </Badge>
                <h3 className="mt-4 text-h4 text-fg">{setup.title}</h3>
                <p className="mt-3 text-body text-fg-secondary">{setup.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
