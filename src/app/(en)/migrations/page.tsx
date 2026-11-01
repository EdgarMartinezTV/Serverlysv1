import { JsonLd } from "@/components/ui/json-ld";
import { canonical, faqGraph, pageMetadata, serviceGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import { BLACK_FRIDAY, bfPrice, blackFridayActive, formatPrice, formatSavings, groupById, orderUrl, saleMonthly } from "@/data/pricing";
import {
  Faqs,
  Features,
  Hero,
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
import { GROUPS, PROMISES, RELATED, TOOLS, USES } from "./_retell-content";
import { ZeroDowntime } from "./_components/zero-downtime";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";
import { t as tx } from "@/i18n/t";
import { lh } from "@/i18n/href";

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
  "Free website migration service with every cloud plan: we move WordPress or any site, its database and email, stage it and switch with no downtime.";

export const metadata = pageMetadata({
  title: "Website Migration Service, Free with Hosting | Serverlys",
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
    ? formatPrice(Math.min(...CLOUD.plans.map((p) => saleMonthly(p))))
    : null;
  /* "From" prices are the Black Friday first month while the sale runs. */
  const bfNote = blackFridayActive() ? ` (Black Friday first month, until ${BLACK_FRIDAY.endsLabel})` : "";
  return (
    <>
      <JsonLd data={migrationServiceGraph()} />
      <JsonLd data={faqGraph(FAQ_TEXT, PATH)} />

      <Hero
        id="move-hero-heading"
        title={tx("Free website migration service, without closing for a minute")}
        photo={{
          src: "/mock/move-hero.jpg",
          alt: "A smiling shop owner holding an open sign in her shop",
        }}
        photoClassName="object-[50%_35%] lg:object-[40%_35%]"
        kicker={[
          "Free with every cloud plan",
          ...(from ? [`Plans from ${from}/mo${bfNote}`] : []),
        ]}
        lede={tx("Our team copies your website to Serverlys, tests it in private, syncs the last changes and switches your domain at a quiet time you pick. Your old host keeps serving customers until the new site is proven, so it never goes offline.")}
        cta={{ label: "See how it works", href: "#how-it-works" }}
        badgeCaption={tx("Every move")}
        badges={[
          { label: "Done for you", icon: "team" },
          { label: "Staged first", icon: "eye" },
          { label: "No downtime", icon: "clock" },
          { label: "Unlimited sites", icon: "server" },
        ]}
      />
      <ZeroDowntime />
      <UseCases
        id="move-uses-heading"
        label={tx("What we handle")}
        title={tx("A move you barely have to think about")}
        items={tx(USES)}
      />
      <NavyBand
        id="move-navy-heading"
        kicker={tx("Free with every cloud hosting plan")}
        title={tx("We move it. You keep running your business.")}
        body={tx("Most people put off changing hosts because moving a site sounds like a weekend lost. With Serverlys it is a form and a yes: our team does the rest, and your site never goes dark.")}
        aside={tx(`[Free migration] with every cloud plan${from ? `, from [${from}/mo]${bfNote}` : ""}. [One site or a hundred.]`)}
        cta={{ label: "See cloud plans", href: "#plans" }}
      />
      <Promises
        id="move-promise-heading"
        intro={tx("Moving a website should not be a gamble. These are the things you can hold us to.")}
        items={tx(PROMISES)}
      />
      <Features
        id="move-features-heading"
        title={tx("How your website moves to Serverlys")}
        groups={tx(GROUPS)}
      />
      <ToolsMarquee
        id="move-tools-heading"
        title={tx("WordPress migration and the other platforms we move every day")}
        cta={{ label: "See cloud plans", href: "#plans" }}
        rows={TOOLS}
      />
      {CLOUD && (
        <PricingPanel
          id="move-plans-heading"
          title={tx("Cloud hosting plans, with free migration")}
          columns={4}
          footnote={
            <>{tx("Every plan includes free website migration and a 30-day money-back guarantee.")}{" "}
              <a
                href={lh("/cloud-hosting#pricing")}
                className="font-semibold text-primary hover:text-primary-hover"
              >{tx("Compare cloud hosting in full")}</a>{" "}{tx("or")}{" "}
              <a
                href={lh(billing.sales)}
                className="font-semibold text-primary hover:text-primary-hover"
              >{tx("ask the team")}</a>
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
                blue={tx(blue)}
                icon={PLAN_ICON[p.tier]}
                name={p.name}
                badge={blue ? tx("Most popular") : undefined}
                summary={tx(p.summary)}
                price={
                  <div>
                    <p className={cn("text-[13px]", blue ? "text-white/70" : MUTED)}>
                      {/* During Black Friday the struck figure is the regular monthly price. */}
                      <span className="line-through">{tx(formatPrice(blackFridayActive() ? p.monthly : p.standard))}</span>{" "}
                      <span
                        className={cn(
                          "ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                          blue ? "bg-white/20 text-white" : "bg-brand-50 text-primary",
                        )}
                      >
                        {blackFridayActive() ? tx(`Black Friday · ${Math.round(BLACK_FRIDAY.pct * 100)}% off`) : tx(`Save ${formatSavings(p)}`)}
                      </span>
                    </p>
                    <p className="mt-1 flex items-baseline gap-1">
                      <span
                        className={cn(
                          "tabular text-[36px] leading-none font-semibold tracking-[-0.03em]",
                          blue ? "text-white" : INK,
                        )}
                      >
                        {tx(formatPrice(saleMonthly(p)))}
                      </span>
                      <span className={blue ? "text-white/80" : MUTED}>{tx("/mo")}</span>
                    </p>
                    <p
                      className={cn("mt-2 text-[12px]", blue ? "text-white/75" : MUTED)}
                    >
                      {blackFridayActive() ? tx(`Black Friday first month, until ${BLACK_FRIDAY.endsLabel}. `) : ""}{tx("Renews at ")}{tx(formatPrice(p.monthly))}{tx("/mo")}{p.setupFee
                        ? tx(`, plus a one-off ${formatPrice(blackFridayActive() ? bfPrice(p.setupFee) : p.setupFee)} setup fee`)
                        : tx(". No setup fee")}
                      .
                    </p>
                  </div>
                }
                cta={{ label: "Choose plan", href: orderUrl(CLOUD, p) }}
                listTitle={tx("What’s included")}
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
      <Faqs id="move-faq-heading" items={tx(FAQ_TEXT)} />
      <Related id="move-related-heading" items={tx(RELATED)} />
      <PhotoCta
        id="move-cta-heading"
        photo={{
          src: "/mock/move-cta.jpg",
          alt: "A smiling couple holding an open sign in their café",
          position: "50% 35%",
        }}
        thumb="/mock/move-boxes.jpg"
        title={tx("Ready to move? We’ll do the heavy lifting.")}
        body={`Pick a cloud plan and send us your site’s details. Migration is free${from ? `, and plans start at ${from}/mo${bfNote}` : ""}.`}
        primary={{ label: "See cloud plans", href: "#plans" }}
      />
      <PageBreadcrumbs trail={tx(breadcrumbTrail(PATH))} />
    </>
  );
}
