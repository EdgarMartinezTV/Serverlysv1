import Link from "next/link";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { SeraOpenButton } from "@/components/sera/sera-open-button";
import { billing, company } from "@/data/company";
import { faqGraph, pageMetadata, productGraph } from "@/lib/seo";
import { FeatureShowcase } from "./_components/feature-showcase";
import { AppsCards } from "./_components/apps-cards";
import { MotionIn } from "./_components/mail-motion";
import { DomainStage, SeraStage } from "./_components/story-stages";
import { EmailFaq } from "./_components/email-faq";
import { ImpressionStage } from "./_components/impression-stage";
import { HeroShowcase } from "./_components/hero-showcase";
import { StatsRoll } from "./_components/stats-roll";
import { IncludedPanel, PlansShowcase } from "./_components/plans-showcase";

/**
 * /business-email — laid out section for section after Hostinger's business
 * email page (2026-10-06), with Serverlys's real product in every slot.
 *
 * ⚠ EVERY CLAIM HERE IS VERIFIED, AND SOME OF THE REFERENCE'S SECTIONS ARE
 * DELIBERATELY SUBSTITUTED:
 *  · Plans and prices are the WHMCS "Email Solutions" group, read 2026-10-06:
 *    Essentials $5.95 (35 GB, 2 accounts), Business Plus $7.95 (45 GB, 5),
 *    Enterprise Pro $14.95 (60 GB, 20), each + $2.95 one-time setup.
 *  · Protocols were probed on mail.serverlys.com: IMAP 993, POP3 995, SMTP
 *    465/587, cPanel webmail on 2096, Let's Encrypt TLS.
 *  · The reference's in-inbox AI, ChatGPT/Claude connectors, email-marketing
 *    product, review score and testimonials have NO Serverlys equivalent, so
 *    those slots carry apps support, domains and Sera instead of being faked.
 *  · No spam-filter, backup-retention or uptime claims: none were verified.
 * If the store changes, change PLANS.
 */

const PATH = "/business-email";
const GROUP = "email-solutions";

const PLANS = [
  {
    slug: "email-essentials",
    name: "Email Essentials",
    fit: "Best for: solo businesses",
    price: 5.95,
    storageGb: 35,
    accounts: 2,
  },
  {
    slug: "business-plus",
    name: "Business Plus",
    fit: "Best for: small teams",
    price: 7.95,
    storageGb: 45,
    accounts: 5,
    popular: true,
  },
  {
    slug: "enterprise-pro",
    name: "Enterprise Pro",
    fit: "Best for: growing companies",
    price: 14.95,
    storageGb: 60,
    accounts: 20,
  },
] as const;
const SETUP_FEE = 2.95;

const DESCRIPTION =
  "Professional email at your own domain from $5.95/mo. Webmail, IMAP, POP3 and secure SMTP, so it works in your browser, on your phone and in Outlook or Apple Mail.";

export const metadata = pageMetadata({
  title: "Business Email at Your Own Domain, from $5.95/mo | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

const FAQS = [
  {
    question: "What is a business email address?",
    answer:
      "An address at your own domain, like you@yourbusiness.com, instead of a free provider's. It tells customers the message really comes from your business, and it stays yours if you ever change provider.",
  },
  {
    question: "What is email hosting?",
    answer:
      "The service that stores your mailboxes and sends and receives mail for your domain. With Serverlys business email, your mailboxes run on our mail server and you read them in webmail or any email app.",
  },
  {
    question: "How much does business email cost?",
    answer:
      "Email Essentials is $5.95/mo for 2 accounts and 35 GB, Business Plus is $7.95/mo for 5 accounts and 45 GB, and Enterprise Pro is $14.95/mo for 20 accounts and 60 GB. Each plan has a one-time $2.95 setup fee.",
  },
  {
    question: "Will it work on my phone and with Outlook or Apple Mail?",
    answer:
      "Yes. Mailboxes support IMAP and POP3 for receiving and secure SMTP for sending, so they work in Outlook, Apple Mail, the mail app on iPhone and Android, and any other standard email app. There is also webmail in the browser.",
  },
  {
    question: "Do I need a domain first?",
    answer:
      "Your email lives at your domain, so yes. If you do not have one yet, search for it on our domains page and register it in the same order.",
  },
  {
    question: "Can I move my existing email to Serverlys?",
    answer:
      "Yes. When you move a site to Serverlys, the mailboxes move with it as part of the free migration. If you are only moving email, ask the team and we will tell you exactly what is involved before anything changes.",
  },
  {
    question: "Is it secure?",
    answer:
      "Connections to the mail server are encrypted with TLS for webmail, IMAP, POP3 and SMTP, so your password and messages are not sent in the clear.",
  },
].map((f) => ({ ...f, scopes: [PATH] }));

export default function BusinessEmailPage() {
  const plansHref = "#plans";

  return (
    <>
      <JsonLd
        data={productGraph({
          name: "Serverlys Business Email",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...PLANS.map((p) => p.price)),
          highPrice: Math.max(...PLANS.map((p) => p.price)),
          offerCount: PLANS.length,
          category: "Email Hosting",
        })}
      />
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-canvas">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10 lg:pb-28 lg:pt-20">
          <div>
            <p className="text-small font-semibold text-primary">
              Serverlys Business Email
            </p>
            <h1 className="mt-3 font-display text-[40px] font-normal leading-[1.08] tracking-[-0.03em] text-fg sm:text-[52px]">
              Business email that builds trust
            </h1>
            <ul className="mt-6 flex flex-col gap-2.5">
              {[
                "Look professional with an address at your own domain",
                "Works in your browser, on your phone and in any email app",
              ].map((t) => (
                <li key={t} className="flex gap-2.5 text-body text-fg-secondary">
                  <svg
                    viewBox="0 0 16 16"
                    className="mt-1 size-4 shrink-0 text-success"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
            <a
              href={plansHref}
              className="mt-8 inline-flex h-12 items-center rounded-md bg-primary px-8 text-body font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Choose plan
            </a>
            <p className="mt-4 text-small text-fg-secondary">
              From <span className="font-semibold text-fg">${PLANS[0].price}/mo</span>.
              One-time ${SETUP_FEE} setup.
            </p>
          </div>
          <div className="relative">
            <HeroShowcase />
          </div>
        </div>
      </section>

      {/* ── Stats band (rolling digits) ─────────────────────────────────── */}
      <section aria-label="Business email at a glance" className="bg-canvas-abyss">
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <StatsRoll
            stats={[
              {
                prefix: "$",
                value: "5.95",
                suffix: "/mo",
                label: "Business email at your own domain, starting from",
              },
              {
                value: "60",
                suffix: "GB",
                label: "Of email storage on Enterprise Pro",
              },
              { value: "20", label: "Email accounts on one plan, for the whole team" },
              { value: "3", label: "Plans, so you only pay for the mailboxes you use" },
            ]}
          />
        </div>
      </section>

      {/* ── Make the right impression (dark) ───────────────────────────── */}
      <section aria-labelledby="impression" className="bg-canvas">
        <ImpressionStage />
      </section>

      {/* ── Feature tabs (dark) ─────────────────────────────────────────── */}
      <section
        aria-labelledby="features-title"
        className="relative isolate overflow-hidden bg-[#030a1f]"
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 -z-10 h-[70%] w-[min(1400px,140vw)] -translate-x-1/2 bg-[radial-gradient(50%_55%_at_50%_0%,rgb(31_85_255/0.4),transparent_75%)]"
        />
        <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <FeatureShowcase cta={{ label: "Choose plan", href: plansHref }} />
        </div>
      </section>

      {/* ── Plans ─────────────────────────────────────────────────────── */}
      <section
        id="plans"
        aria-labelledby="plans-title"
        className="relative isolate scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,var(--color-canvas-secondary),#ffffff_45%,var(--color-brand-50))]"
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 -z-10 h-[520px] w-[min(1200px,120vw)] -translate-x-1/2 bg-[radial-gradient(50%_55%_at_50%_0%,rgb(31_85_255/0.12),transparent_70%)]"
        />
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:py-28">
          <p className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_1px_2px_rgb(15_23_42/0.06),0_0_0_1px_var(--color-brand-100)]">
            <span className="size-1.5 rounded-full bg-primary" />
            Pricing
          </p>
          <h2
            id="plans-title"
            className="mx-auto mt-5 max-w-[720px] text-center font-display text-[36px] font-normal leading-[1.08] tracking-[-0.03em] text-fg sm:text-[52px]"
          >
            Purchase your <span className="text-primary">business email</span> plan
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] text-center text-body-lg text-fg-secondary">
            Same mail server and features on every plan. Choose by how many
            mailboxes your team needs.
          </p>
          <PlansShowcase
            setupFee={SETUP_FEE}
            plans={PLANS.map((p) => ({
              slug: p.slug,
              name: p.name,
              fit: p.fit,
              price: p.price,
              storageGb: p.storageGb,
              accounts: p.accounts,
              popular: "popular" in p && p.popular,
              href: billing.order(GROUP, p.slug),
            }))}
          />
          <IncludedPanel />
          <p className="mt-6 text-center text-caption text-fg-muted">
            Prices in USD, billed monthly. The setup fee is charged once, on the first
            invoice.
          </p>
        </div>
      </section>

      {/* ── Works with the apps you use (dark) ─────────────────────────── */}
      <section
        aria-labelledby="apps-title"
        className="bg-[linear-gradient(180deg,#ffffff,var(--color-brand-50))]"
      >
        <div className="mx-auto max-w-[1280px] px-5 py-20 text-center sm:px-8 lg:px-10 lg:py-28">
          <p className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_1px_2px_rgb(15_23_42/0.06),0_0_0_1px_var(--color-brand-100)]">
            <span className="size-1.5 rounded-full bg-primary" />
            Anywhere
          </p>
          <h2
            id="apps-title"
            className="mt-5 font-display text-[36px] font-normal leading-[1.08] tracking-[-0.03em] text-fg sm:text-[52px]"
          >
            Works with the apps you already use
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-body-lg text-fg-secondary">
            One mailbox at your own domain, in the browser, on the desktop and in your
            pocket, without changing how you work.
          </p>
          <AppsCards />
          <a
            href={plansHref}
            className="mt-12 inline-flex h-12 items-center rounded-md bg-primary px-8 text-body font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Choose plan
          </a>
        </div>
      </section>

      {/* ── Bring your inbox with you (brand banner) ───────────────────── */}
      <section
        aria-labelledby="migrate-title"
        className="relative isolate overflow-hidden bg-primary"
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 -z-10 w-[55%] bg-white/[0.07] [clip-path:polygon(25%_0,100%_0,100%_100%,0_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 -z-10 w-[30%] bg-white/[0.06] [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]"
        />
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <h2
            id="migrate-title"
            className="max-w-[520px] font-display text-[40px] font-normal leading-[1.05] tracking-[-0.02em] text-white sm:text-[56px]"
          >
            Bring your inbox with you
          </h2>
          <p className="mt-6 max-w-[440px] text-body text-white/85">
            Moving from another provider? When your site moves to Serverlys, your
            mailboxes move with it as part of the free migration, staged first and
            switched over when you say.
          </p>
          <Link
            href="/migrations"
            className="mt-8 inline-flex h-12 items-center rounded-md bg-white px-7 text-body font-semibold text-primary transition-colors hover:bg-white/90"
          >
            Migrate mailbox
          </Link>
        </div>
      </section>

      {/* ── Get a domain for your email ────────────────────────────────── */}
      <section aria-labelledby="domain-title" className="relative isolate overflow-hidden bg-canvas">
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
          <MotionIn variant="rise">
            <DomainStage />
          </MotionIn>
          <div className="text-center lg:text-left">
            <p className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_1px_2px_rgb(15_23_42/0.06),0_0_0_1px_var(--color-brand-100)] lg:mx-0">
              <span className="size-1.5 rounded-full bg-primary" />
              Domains
            </p>
            <h2
              id="domain-title"
              className="mt-5 font-display text-[36px] font-normal leading-[1.08] tracking-[-0.03em] text-fg sm:text-[52px]"
            >
              Need a <span className="text-primary">domain</span> for your email?
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-body-lg text-fg-secondary lg:mx-0">
              Your email address lives at your domain. Find the name, register it with
              Serverlys and set up your mailboxes on it in the same order.
            </p>
            <ol className="mx-auto mt-8 flex max-w-[440px] flex-col gap-4 text-left lg:mx-0">
              {[
                ["Search for your name", "See which endings are free, like .com or .co."],
                ["Register it in the same order", "Add the domain and your email plan together."],
                ["Create your mailboxes on it", "you@yourbusiness.com, ready in webmail and your apps."],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-3.5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[12px] font-semibold text-white shadow-[0_6px_14px_-4px_rgb(0_0_255/0.6)]">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-body font-semibold text-fg">{title}</span>
                    <span className="block text-small text-fg-secondary">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/domain-name"
                className="inline-flex h-12 items-center rounded-xl bg-primary px-7 text-body font-semibold text-white shadow-[0_10px_30px_-10px_rgb(0_0_255/0.7)] transition-colors hover:bg-primary-hover"
              >
                Find a domain
              </Link>
              <a
                href={plansHref}
                className="inline-flex h-12 items-center rounded-xl px-6 text-body font-semibold text-primary ring-1 ring-inset ring-brand-200 transition-colors hover:bg-brand-50"
              >
                See email plans
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sera ───────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="sera-title"
        className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--color-brand-50),#ffffff)]"
      >
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-28">
          <div className="text-center lg:order-1 lg:text-left">
            <p className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_1px_2px_rgb(15_23_42/0.06),0_0_0_1px_var(--color-brand-100)] lg:mx-0">
              <span className="size-1.5 rounded-full bg-primary" />
              Sera · Serverlys assistant
            </p>
            <h2
              id="sera-title"
              className="mt-5 font-display text-[36px] font-normal leading-[1.08] tracking-[-0.03em] text-fg sm:text-[52px]"
            >
              Questions? <span className="text-primary">Ask Sera</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-body-lg text-fg-secondary lg:mx-0">
              Sera, the Serverlys assistant, knows the email plans and the setup, and
              brings in a person from the team when you need one.
            </p>
            <ul className="mt-8 grid gap-3 text-left sm:grid-cols-2">
              {[
                ["Pick the right plan", "Tell it your team size, get the plan that fits.", "M4 6h16M4 12h10M4 18h6"],
                ["Start a migration", "Request a move for your site and mailboxes.", "M4 12h12M12 6l6 6-6 6"],
                ["Set up your apps", "Outlook, Apple Mail, iPhone and Android.", "M7 3h10v18H7zM11 18h2"],
                ["Reach a real person", "Hand off to the team in the same chat.", "M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"],
              ].map(([title, body, d]) => (
                <li
                  key={title}
                  className="rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_12px_28px_-18px_rgb(0_0_255/0.3)] ring-1 ring-brand-100"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-primary ring-1 ring-brand-100">
                    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={d} />
                    </svg>
                  </span>
                  <span className="mt-3 block text-body font-semibold text-fg">{title}</span>
                  <span className="mt-0.5 block text-small text-fg-secondary">{body}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center lg:justify-start">
              <SeraOpenButton label="Ask Sera" />
            </div>
          </div>
          <MotionIn variant="rise">
            <SeraStage />
          </MotionIn>
        </div>
      </section>

      <EmailFaq items={FAQS} supportEmail={company.email} />

      {/* ── Start today ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="start-title"
        className="relative isolate overflow-hidden bg-primary"
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 -z-10 w-[45%] bg-white/[0.07] [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]"
        />
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <h2
            id="start-title"
            className="font-display text-[40px] font-normal tracking-[-0.02em] text-white sm:text-[56px]"
          >
            Start today
          </h2>
          <p className="mt-4 max-w-[460px] text-body text-white/85">
            Get your business email at your own domain up and running, with real people
            on support.
          </p>
          <a
            href={plansHref}
            className="mt-8 inline-flex h-12 items-center rounded-md bg-white px-8 text-body font-semibold text-primary transition-colors hover:bg-white/90"
          >
            Choose plan
          </a>
        </div>
      </section>

      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Business email", path: PATH },
        ]}
      />
    </>
  );
}
