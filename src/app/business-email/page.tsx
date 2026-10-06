import Image from "next/image";
import Link from "next/link";
import { FaqSection } from "@/components/sections/faq";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { SeraOpenButton } from "@/components/sera/sera-open-button";
import { billing } from "@/data/company";
import { faqGraph, pageMetadata, productGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { FeatureTabs } from "./_components/feature-tabs";
import { MotionIn, Parallax } from "./_components/mail-motion";
import { ImpressionStage } from "./_components/impression-stage";
import { HeroFilm } from "./_components/hero-film";
import { StatsRoll } from "./_components/stats-roll";

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
    storage: "35 GB",
    accounts: 2,
  },
  {
    slug: "business-plus",
    name: "Business Plus",
    fit: "Best for: small teams",
    price: 7.95,
    storage: "45 GB",
    accounts: 5,
    popular: true,
  },
  {
    slug: "enterprise-pro",
    name: "Enterprise Pro",
    fit: "Best for: growing companies",
    price: 14.95,
    storage: "60 GB",
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
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:pb-28 lg:pt-20">
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
            <HeroFilm />
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
      <section aria-labelledby="impression" className="bg-[#030a1f]">
        <ImpressionStage />
        <div className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <FeatureTabs
            cta={{ label: "Choose plan", href: plansHref }}
            tabs={[
              {
                id: "setup",
                label: "Set-up",
                title: "Easy setup and migration",
                points: [
                  "Connect your mailbox to Outlook, Apple Mail and your phone",
                  "Bring your existing email with you when you move your site",
                  "Mailboxes created at your own domain, ready to use",
                ],
                image: "/email/phone-email.webp",
                imageAlt: "A business owner reading her work email on her phone",
              },
              {
                id: "anywhere",
                label: "Anywhere",
                title: "Your inbox, wherever you work",
                points: [
                  "Webmail in any browser, nothing to install",
                  "IMAP and POP3 for every email app on desktop and mobile",
                  "Send securely from any device with SMTP",
                ],
                image: "/email/laptop-email.webp",
                imageAlt: "A man replying to email on a laptop in a café",
              },
              {
                id: "scale",
                label: "Scale",
                title: "The inbox that scales with you",
                points: [
                  "From 2 accounts on Essentials to 20 on Enterprise Pro",
                  "Up to 60 GB of storage for mail and attachments",
                  "Move up a plan as the team grows",
                ],
                image: "/email/team-inbox.webp",
                imageAlt: "Two coworkers reading a shared inbox on a monitor",
              },
              {
                id: "secure",
                label: "Security",
                title: "Private by default",
                points: [
                  "Encrypted TLS connections for webmail, IMAP, POP3 and SMTP",
                  "Your mail on your domain, not a free provider's",
                  "Real people on support when something looks wrong",
                ],
                image: "/email/owner-phone.webp",
                imageAlt: "A smiling man holding his phone",
              },
            ]}
          />
        </div>
      </section>

      {/* ── Plans ─────────────────────────────────────────────────────── */}
      <section
        id="plans"
        aria-labelledby="plans-title"
        className="scroll-mt-20 bg-canvas-secondary"
      >
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:py-28">
          <h2
            id="plans-title"
            className="mx-auto max-w-[620px] text-center font-display text-[34px] font-normal leading-[1.15] tracking-[-0.02em] text-fg sm:text-[44px]"
          >
            Purchase your business email plan
          </h2>
          <ul className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
            {PLANS.map((p) => {
              const popular = "popular" in p && p.popular;
              return (
                <li
                  key={p.slug}
                  className={cn(
                    "flex flex-col rounded-2xl bg-canvas",
                    popular
                      ? "shadow-e4 ring-2 ring-primary lg:-mt-6"
                      : "shadow-e1 ring-1 ring-line",
                  )}
                >
                  {popular && (
                    <p className="rounded-t-[14px] bg-primary py-2.5 text-center text-caption font-semibold uppercase tracking-[0.08em] text-white">
                      Most popular
                    </p>
                  )}
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-h4 font-semibold text-fg">{p.name}</h3>
                    <p className="mt-1 text-small text-fg-secondary">{p.fit}</p>
                    <p className="mt-7 flex items-baseline gap-1">
                      <span className="font-display text-[44px] font-semibold leading-none tracking-[-0.02em] text-fg">
                        ${p.price}
                      </span>
                      <span className="text-body text-fg-secondary">/mo</span>
                    </p>
                    <a
                      href={billing.order(GROUP, p.slug)}
                      className={cn(
                        "mt-6 inline-flex h-12 items-center justify-center rounded-md text-body font-semibold transition-colors",
                        popular
                          ? "bg-primary text-white hover:bg-primary-hover"
                          : "text-primary ring-1 ring-inset ring-primary hover:bg-brand-50",
                      )}
                    >
                      Choose plan
                    </a>
                    <p className="mt-3 text-caption text-fg-muted">
                      Billed monthly. One-time ${SETUP_FEE} setup fee.
                    </p>
                    <ul className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
                      {[
                        `${p.accounts} email accounts`,
                        `${p.storage} email storage`,
                        "Email at your own domain",
                        "Webmail, IMAP, POP3 and SMTP",
                      ].map((f) => (
                        <li key={f} className="flex gap-2.5 text-small text-fg">
                          <svg
                            viewBox="0 0 16 16"
                            className="mt-0.5 size-4 shrink-0 text-primary"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m3.5 8.5 3 3 6-7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mx-auto mt-10 max-w-[1000px] rounded-2xl bg-canvas p-8 shadow-e1 ring-1 ring-line">
            <p className="text-center text-h4 font-medium text-fg">
              Every plan has <span className="text-primary">everything you need</span>
            </p>
            <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "An address at your own domain",
                "Webmail in any browser",
                "Works in Outlook and Apple Mail",
                "Works on iPhone and Android",
                "IMAP, POP3 and secure SMTP",
                "Encrypted TLS connections",
                "Mailboxes moved with your site",
                "Support from real people",
                "Upgrade as your team grows",
              ].map((f) => (
                <li key={f} className="flex gap-2.5 text-small text-fg">
                  <svg
                    viewBox="0 0 16 16"
                    className="mt-0.5 size-4 shrink-0 text-success"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-center text-caption text-fg-muted">
            Prices in USD, billed monthly. The setup fee is charged once, on the first
            invoice.
          </p>
        </div>
      </section>

      {/* ── Works with the apps you use (dark) ─────────────────────────── */}
      <section aria-labelledby="apps-title" className="bg-canvas-abyss">
        <div className="mx-auto max-w-[1280px] px-5 py-20 text-center sm:px-8 lg:px-10 lg:py-28">
          <p className="mx-auto w-fit rounded-full bg-white/10 px-3 py-1 text-caption font-semibold text-white/80">
            Anywhere
          </p>
          <h2
            id="apps-title"
            className="mt-4 font-display text-[34px] font-normal tracking-[-0.02em] text-white sm:text-[48px]"
          >
            Works with the apps you already use
          </h2>
          <ul className="mt-14 grid gap-5 text-left md:grid-cols-3">
            {[
              {
                kind: "webmail" as const,
                img: "/email/app-webmail.webp",
                w: 1367,
                h: 872,
                title: "Webmail in your browser",
                body: "Open your inbox from any computer. Nothing to install, nothing to configure.",
              },
              {
                kind: "desktop" as const,
                img: "/email/app-desktop.webp",
                w: 1409,
                h: 915,
                title: "Outlook and Apple Mail",
                body: "Add your account with IMAP and SMTP, and your folders stay in sync everywhere.",
              },
              {
                kind: "phone" as const,
                img: "/email/app-phone.webp",
                w: 690,
                h: 1429,
                title: "On your phone",
                body: "Read and reply from the mail app on iPhone or Android, the moment a customer writes.",
              },
            ].map((c, i) => (
              <li
                key={c.kind}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10"
              >
                <div className="relative h-60 bg-gradient-to-b from-white/[0.08] to-transparent px-5 pt-6">
                  <MotionIn
                    variant="rise"
                    delay={i * 140}
                    className="relative h-full w-full"
                  >
                    <div className="relative h-60 w-full transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
                      <Image
                        src={c.img}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 380px, 100vw"
                        className="object-contain object-bottom"
                      />
                    </div>
                  </MotionIn>
                </div>
                <div className="p-6">
                  <h3 className="text-body-lg font-semibold text-white">{c.title}</h3>
                  <p className="mt-2 text-small text-white/70">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
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
      <section aria-labelledby="domain-title" className="overflow-hidden bg-canvas">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
          <div className="relative mx-auto w-full max-w-[460px]">
            <MotionIn
              variant="left"
              className="relative aspect-[4/5] overflow-hidden rounded-3xl"
            >
              <Image
                src="/email/owner-phone.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 460px, 100vw"
                className="object-cover"
              />
            </MotionIn>
            <div className="absolute -bottom-10 left-1/2 w-[115%] -translate-x-1/2">
              <Parallax speed={40}>
                <MotionIn variant="rise" delay={250}>
                  <Image
                    src="/email/domain-card.webp"
                    alt=""
                    width={1343}
                    height={597}
                    sizes="(min-width: 1024px) 460px, 90vw"
                    className="h-auto w-full drop-shadow-[0_24px_40px_rgb(15_23_42/0.25)]"
                  />
                </MotionIn>
              </Parallax>
            </div>
          </div>
          <div>
            <p className="text-small font-semibold text-primary">Domains</p>
            <h2
              id="domain-title"
              className="mt-3 font-display text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-fg sm:text-[40px]"
            >
              Need a domain for your email?
            </h2>
            <p className="mt-4 max-w-[480px] text-body text-fg-secondary">
              Your email address lives at your domain. Find the right name, register it
              with Serverlys and set up your mailboxes on it in the same order.
            </p>
            <Link
              href="/domain-name"
              className="mt-8 inline-flex h-12 items-center rounded-md bg-primary px-7 text-body font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Find a domain
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sera ───────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="sera-title"
        className="overflow-hidden bg-canvas-secondary"
      >
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div className="relative mx-auto w-full max-w-[480px]">
            <MotionIn
              variant="left"
              className="relative aspect-[3/2] overflow-hidden rounded-3xl"
            >
              <Image
                src="/email/laptop-email.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
            </MotionIn>
            <Parallax
              speed={50}
              className="absolute -bottom-12 -right-4 w-[52%] sm:-right-10"
            >
              <MotionIn variant="pop" delay={300}>
                <Image
                  src="/email/sera-chat.webp"
                  alt=""
                  width={728}
                  height={857}
                  sizes="(min-width: 1024px) 260px, 50vw"
                  className="h-auto w-full drop-shadow-[0_24px_40px_rgb(15_23_42/0.3)]"
                />
              </MotionIn>
            </Parallax>
          </div>
          <div className="pt-8 lg:pt-0">
            <h2
              id="sera-title"
              className="font-display text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-fg sm:text-[40px]"
            >
              Sera, the Serverlys assistant, can:
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                "Help you choose the right email plan for your team",
                "Start a migration request for your site and mailboxes",
                "Answer questions about setting up your email apps",
                "Connect you with a person on the team when you need one",
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
            <div className="mt-8">
              <SeraOpenButton label="Ask Sera" />
            </div>
          </div>
        </div>
      </section>

      <FaqSection items={FAQS} />

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
