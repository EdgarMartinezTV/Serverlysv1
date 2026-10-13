import { JsonLd } from "@/components/ui/json-ld";
import { canonical, faqGraph, pageMetadata, serviceGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import { formatPrice, formatSavings, groupById, orderUrl } from "@/data/pricing";
import {
  Faqs,
  Features,
  Hero,
  HowItWorks,
  INK,
  MUTED,
  NavyBand,
  PanelCard,
  PhotoCta,
  PricingPanel,
  Promises,
  Related,
  ToolsMarquee,
  UseCases,
} from "@/components/retell/kit";
import { FAQS } from "./_content";
import { GROUPS, PROMISES, RELATED, STEPS, TOOLS, USES } from "./_retell-content";

/**
 * /migrations — rebuilt 2026-10-13 on the shared Retell-style kit, the same
 * layout as the other service pages. The previous Hostinger-style version is
 * in git history.
 *
 * Migration is free with a cloud hosting plan, so the pricing panel is the
 * cloud group from data/pricing.ts: the same plans, prices, renewal rates
 * and order links as /cloud-hosting. The renewal rate stays beside the
 * monthly rate, as on every plan card on the site.
 */

const PATH = "/migrations";
const DESCRIPTION =
  "Free website migration with every Serverlys cloud hosting plan: we move your site, database and email, stage it, and switch when you say, with no downtime.";

export const metadata = pageMetadata({
  title: "Free Website Migration to Cloud Hosting | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) =>
      b.type === "ul" ? b.items.join(" ") : b.runs.map((r) => r.text).join(""),
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  scopes: [PATH],
}));

const CLOUD = groupById("cloud");
const PLAN_ICON = {
  starter: "pin",
  plus: "growth",
  turbo: "rocket",
  business: "building",
} as const;

function migrationServiceGraph() {
  const base = serviceGraph({
    name: "Free website migration",
    serviceType: "Website migration",
    description: DESCRIPTION,
    path: PATH,
  });
  if (!CLOUD) return base;
  return {
    ...base,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free with any Serverlys cloud hosting plan",
      url: canonical(PATH),
    },
  };
}

export default function MigrationsPage() {
  const from = CLOUD
    ? formatPrice(Math.min(...CLOUD.plans.map((p) => p.monthly)))
    : null;
  return (
    <>
      <JsonLd data={migrationServiceGraph()} />
      <JsonLd data={faqGraph(FAQ_TEXT, PATH)} />

      <Hero
        id="move-hero-heading"
        title="Free Website Migration, Without Closing for a Minute"
        photo={{
          src: "/mock/move-hero.jpg",
          alt: "A smiling shop owner holding an open sign in her shop",
        }}
        photoClassName="object-[50%_35%] lg:object-[40%_35%]"
        kicker={[
          "Free with every cloud plan",
          ...(from ? [`Plans from ${from}/mo`] : []),
        ]}
        lede="We move your website, database and email to Serverlys cloud hosting, check it on a staged copy, and switch when you say. Your site stays open the whole time."
        cta={{ label: "See cloud plans", href: "#plans" }}
        badgeCaption="Every move"
        badges={[
          { label: "Done for you", icon: "team" },
          { label: "Staged first", icon: "eye" },
          { label: "No downtime", icon: "clock" },
          { label: "Unlimited sites", icon: "server" },
        ]}
      />
      <HowItWorks
        id="move-how-heading"
        title="Four steps, and only the first two are yours."
        steps={STEPS}
      />
      <UseCases
        id="move-uses-heading"
        label="What we handle"
        title="A move you barely have to think about"
        items={USES}
      />
      <NavyBand
        id="move-navy-heading"
        kicker="Free with every cloud hosting plan"
        title="We move it. You keep running your business."
        body="Most people put off changing hosts because moving a site sounds like a weekend lost. With Serverlys it is a form and a yes: our team does the rest, and your site never goes dark."
        aside={`[Free migration] with every cloud plan${from ? `, from [${from}/mo]` : ""}. [One site or a hundred.]`}
        cta={{ label: "See cloud plans", href: "#plans" }}
      />
      <Promises
        id="move-promise-heading"
        intro="Moving a website should not be a gamble. These are the things you can hold us to."
        items={PROMISES}
      />
      <Features
        id="move-features-heading"
        title="How your website moves to Serverlys"
        groups={GROUPS}
      />
      <ToolsMarquee
        id="move-tools-heading"
        title="The platforms we move every day"
        cta={{ label: "See cloud plans", href: "#plans" }}
        rows={TOOLS}
      />
      {CLOUD && (
        <PricingPanel
          id="move-plans-heading"
          title="Cloud hosting plans, with free migration"
          columns={4}
          footnote={
            <>
              Every plan includes free website migration and a 30-day money-back
              guarantee.{" "}
              <a
                href="/cloud-hosting#pricing"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Compare cloud hosting in full
              </a>{" "}
              or{" "}
              <a
                href={billing.sales}
                className="font-semibold text-primary hover:text-primary-hover"
              >
                ask the team
              </a>
              .
            </>
          }
        >
          {CLOUD.plans.map((p, i) => {
            const blue = Boolean(p.popular);
            return (
              <PanelCard
                key={p.tier}
                delay={i * 80}
                blue={blue}
                icon={PLAN_ICON[p.tier]}
                name={p.name}
                badge={blue ? "Most popular" : undefined}
                summary={p.summary}
                price={
                  <div>
                    <p className={cn("text-[13px]", blue ? "text-white/70" : MUTED)}>
                      <span className="line-through">{formatPrice(p.standard)}</span>{" "}
                      <span
                        className={cn(
                          "ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                          blue ? "bg-white/20 text-white" : "bg-brand-50 text-primary",
                        )}
                      >
                        Save {formatSavings(p)}
                      </span>
                    </p>
                    <p className="mt-1 flex items-baseline gap-1">
                      <span
                        className={cn(
                          "tabular text-[36px] leading-none font-semibold tracking-[-0.03em]",
                          blue ? "text-white" : INK,
                        )}
                      >
                        {formatPrice(p.monthly)}
                      </span>
                      <span className={blue ? "text-white/80" : MUTED}>/mo</span>
                    </p>
                    <p
                      className={cn("mt-2 text-[12px]", blue ? "text-white/75" : MUTED)}
                    >
                      Renews at {formatPrice(p.standard)}/mo
                      {p.setupFee
                        ? `, plus a one-off ${formatPrice(p.setupFee)} setup fee`
                        : ". No setup fee"}
                      .
                    </p>
                  </div>
                }
                cta={{ label: "Choose plan", href: orderUrl(CLOUD, p) }}
                listTitle="What’s included"
                list={[
                  ...new Map(
                    [
                      p.specs.sites,
                      p.specs.visits,
                      `${p.specs.memory} RAM`,
                      `${p.specs.storage} storage`,
                      `${p.specs.transfer} bandwidth`,
                      ...p.includes,
                    ].map((f) => [f.toLowerCase(), f] as const),
                  ).values(),
                ]}
              />
            );
          })}
        </PricingPanel>
      )}
      <Faqs id="move-faq-heading" items={FAQ_TEXT} />
      <Related id="move-related-heading" items={RELATED} />
      <PhotoCta
        id="move-cta-heading"
        photo={{
          src: "/mock/move-cta.jpg",
          alt: "A smiling couple holding an open sign in their café",
          position: "50% 35%",
        }}
        thumb="/mock/move-boxes.jpg"
        title="Ready to move? We’ll do the heavy lifting."
        body={`Pick a cloud plan and send us your site’s details. Migration is free${from ? `, and plans start at ${from}/mo` : ""}.`}
        primary={{ label: "See cloud plans", href: "#plans" }}
      />
    </>
  );
}
