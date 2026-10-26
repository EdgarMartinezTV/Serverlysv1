import { JsonLd } from "@/components/ui/json-ld";
import { faqGraph, pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import {
  Faqs,
  Hero,
  HowItWorks,
  MUTED,
  NavyBand,
  PanelCard,
  PhotoCta,
  PricingPanel,
  Promises,
  Related,
  UseCases,
} from "@/components/retell/kit";
import {
  CONVO_MONTHLY,
  CONVO_TOTAL,
  FAQS,
  HOSTING_MAX,
  HOSTING_MIN,
  PCT,
  PROMISES,
  STEPS,
  TERMS,
  USES,
} from "./_content";

/**
 * /affiliates — the affiliate program, built 2026-10-25 on the shared
 * Retell-style kit.
 *
 * ⚠ NOINDEX until the affiliate agreement is published: the page states
 * terms that need a contract behind them. Flip `index` here and `indexable`
 * in data/routes.ts together.
 *
 * The worked example is labelled as an example on purpose — it is arithmetic
 * on our own prices, never a claim about what affiliates typically earn.
 */

const PATH = "/affiliates";
const DESCRIPTION = `Earn ${PCT(TERMS.hostingFirstPayment)} of the first payment on Serverlys hosting and ${PCT(TERMS.convoShare)} of ConvoAI Pro for ${TERMS.convoMonths} months. Free to join, paid monthly.`;

export const metadata = pageMetadata({
  title: "Affiliate Program — Earn Recommending Serverlys | Serverlys",
  description: DESCRIPTION,
  path: PATH,
  index: false,
});

/* Worked example: 3 hosting customers on the cheapest plan + 2 on ConvoAI Pro. */
const EXAMPLE_HOSTING = 3;
const EXAMPLE_CONVO = 2;
const EXAMPLE_TOTAL =
  EXAMPLE_HOSTING * Number(HOSTING_MIN.slice(1)) +
  EXAMPLE_CONVO * TERMS.convoPrice * TERMS.convoShare * TERMS.convoMonths;

function Rate({ big, small, blue }: { big: string; small: string; blue?: boolean }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span
        className={cn(
          "text-[40px] leading-none font-semibold tracking-[-0.03em]",
          blue ? "text-white" : "text-[#0b1530]",
        )}
      >
        {big}
      </span>
      <span className={cn("text-[14px]", blue ? "text-white/80" : MUTED)}>{small}</span>
    </p>
  );
}

export default function AffiliatesPage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      <Hero
        id="aff-hero-heading"
        title="Recommend Serverlys. Get Paid Every Month."
        photo={{
          src: "/mock/move-phone.jpg",
          alt: "A craftsman in his workshop celebrating something on his phone",
        }}
        photoClassName="object-[55%_30%] lg:object-[45%_30%]"
        kicker={[
          "Free to join",
          `${TERMS.cookieDays}-day cookie`,
          `Payouts from $${TERMS.minPayout}`,
        ]}
        lede={`Share your link with the people who ask you where to host a website or how to answer customers after hours. Earn ${PCT(TERMS.hostingFirstPayment)} of their first hosting payment, and ${PCT(TERMS.convoShare)} of ConvoAI Pro every month for a year.`}
        cta={{ label: "Join the program", href: billing.affiliates }}
        badgeCaption="Every affiliate"
        badges={[
          { label: "No fees", icon: "shield" },
          { label: "Live dashboard", icon: "report" },
          { label: "Recurring", icon: "loop" },
          { label: "Paid monthly", icon: "calendar" },
        ]}
      />

      <HowItWorks
        id="aff-how-heading"
        title="Four steps, and only the first one takes any effort"
        steps={STEPS}
      />

      <PricingPanel
        id="aff-rates-heading"
        label="Commissions"
        title="What you earn on each referral"
        footnote={`Commissions are held ${TERMS.holdDays} days, then paid once your balance reaches $${TERMS.minPayout}. Rates apply to the referred customer’s payments, after any discount.`}
      >
        <PanelCard
          icon="server"
          name="Hosting"
          summary="Cloud, WordPress and ecommerce hosting, any plan."
          price={
            <Rate
              big={PCT(TERMS.hostingFirstPayment)}
              small={`of the first payment · ${HOSTING_MIN} to ${HOSTING_MAX}`}
            />
          }
          cta={{ label: "See hosting plans", href: "/hosting" }}
          listTitle="Good to know"
          list={[
            "Paid once per new customer",
            "Every plan and every hosting type counts",
            "Free migration makes it an easy switch to suggest",
          ]}
        />
        <PanelCard
          blue
          delay={80}
          icon="loop"
          name="ConvoAI Pro"
          badge="Recurring"
          summary="AI chat for a business website, with the team stepping in when needed."
          price={
            <Rate
              blue
              big={PCT(TERMS.convoShare)}
              small={`for ${TERMS.convoMonths} months · ${CONVO_MONTHLY}/mo, up to ${CONVO_TOTAL}`}
            />
          }
          cta={{ label: "See ConvoAI", href: "https://convoai.cloud/" }}
          listTitle="Good to know"
          list={[
            "Paid on every monthly payment, not just the first",
            `Up to ${TERMS.convoMonths} payments per customer`,
            "The best fit for consultants and agencies",
          ]}
        />
        <PanelCard
          delay={160}
          icon="team"
          name="Projects"
          summary="Website design, development and voice agents."
          price={<Rate big="Agreed" small="in writing, per project" />}
          cta={{ label: "Tell us about a referral", href: billing.sales }}
          listTitle="Good to know"
          list={[
            "Introduce the client before the scope is signed",
            "Fee agreed up front, paid when they pay",
          ]}
        />
      </PricingPanel>

      <NavyBand
        id="aff-example-heading"
        kicker="An example, not a promise"
        title="Five referrals, one year"
        body={`Say ${EXAMPLE_HOSTING} people take our starter hosting and ${EXAMPLE_CONVO} businesses stay on ConvoAI Pro for a year. That is arithmetic on our own prices. What you actually earn depends on who you know and what they buy.`}
        aside={`${EXAMPLE_HOSTING} × [${HOSTING_MIN}] + ${EXAMPLE_CONVO} × [${CONVO_TOTAL}] = [$${EXAMPLE_TOTAL.toFixed(2)}] over twelve months.`}
        cta={{ label: "Join the program", href: billing.affiliates }}
      />

      <UseCases
        id="aff-uses-heading"
        label="Who it’s for"
        title="For people who already get asked"
        items={USES}
      />

      <Promises
        id="aff-promise-heading"
        label="The rules"
        intro="An affiliate program is only worth joining if the terms do not move. These are ours."
        items={PROMISES}
      />

      <Faqs id="aff-faq-heading" items={FAQS} />

      <Related
        id="aff-related-heading"
        label="What you’ll be recommending"
        items={[
          ["Cloud hosting", "/cloud-hosting"],
          ["WordPress hosting", "/wordpress-hosting"],
          ["Free migration", "/migrations"],
          ["AI agents", "/ai-agents"],
          ["Pricing", "/pricing"],
          ["Affiliate agreement", "/affiliate-agreement"],
        ]}
      />

      <PhotoCta
        id="aff-cta-heading"
        photo={{
          src: "/mock/seo-cta.jpg",
          alt: "A barista using a tablet at the counter of his coffee shop",
          position: "60% 40%",
        }}
        thumb="/mock/care-typing.jpg"
        title="Get your link"
        body="Sign in, switch on the affiliate program and your link is ready to share."
        primary={{ label: "Join the program", href: billing.affiliates }}
      />
    </>
  );
}
