import Image from "next/image";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, faqGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { company, emailDisplay, sisterProducts } from "@/data/company";
import { formatPrice, groupById, lowestRate } from "@/data/pricing";
import { formatDesignPrice, designFromPrice } from "@/data/design-plans";
import { formatSeoPrice, seoFromPrice } from "@/data/seo-plans";
import { formatSocialPrice, socialFromPrice } from "@/data/social-plans";
import { formatCarePrice, careFromPrice } from "@/data/care-plans";
import { Faqs, PhotoCta, Wrap } from "@/components/retell/kit";
import { ChatButton } from "@/components/retell/chat-button";
import { Reveal } from "@/components/animations/reveal";

/**
 * About — 2026-10-13, rebuilt to the retellai.com/about-us layout, section for
 * section: "Our Story" → About Us + photo → Mission with three staggered
 * cards → serif manifesto → dark band → "Our Journey" vertical timeline →
 * "The Team Behind the Work" list → photo strip → investors-style grid →
 * join/contact → photo CTA. (Replaces the Hostinger-style version, in git.)
 *
 * FACTS: Edgar supplied founded "4 years ago" (→ 2022) and Miami. No
 * leaders, team photos, investors, headcount, customer counts or job
 * openings are on record, so the reference's slots are filled with things
 * that are true and checkable:
 *   - the leader list is the PROMISES LEDGER — each promise with live proof
 *     computed from the plan data the checkout uses (the unique feature);
 *   - the team photo strip shows small-business owners, captioned as the
 *     businesses we build for, never as staff;
 *   - the investors grid lists Serverlys products with live starting prices;
 *   - careers becomes "talk to us".
 * When Edgar supplies leaders, milestones or team photos, add them here;
 * never estimate them.
 */

const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], display: "swap" });

const PATH = "/about";
const FOUNDED = 2022;
const YEAR = new Date().getFullYear();
const YEARS = YEAR - FOUNDED;
const INK = "text-[#1f2124]";
const BLUE = "text-[#3b5bdb]";

export const metadata = pageMetadata({
  title: "About Serverlys | Our Story",
  description:
    "Serverlys, LLC is a Miami company founded in 2022 that hosts, builds, grows and manages websites for small businesses, with the renewal price shown up front.",
  path: PATH,
});

const CLOUD = groupById("cloud");

function Eyebrow({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <p className={cn("text-[13px] font-medium", BLUE, center && "text-center")}>
      {children}
    </p>
  );
}

/* ── 1. Our Story + About Us ─────────────────────────────────────────────── */

function Story() {
  return (
    <section
      aria-labelledby="about-story-heading"
      className="bg-white pt-20 pb-20 lg:pt-28 lg:pb-28"
    >
      <Wrap>
        <h1
          id="about-story-heading"
          className={cn(
            serif.className,
            "text-[64px] leading-none tracking-[-0.03em] sm:text-[88px] lg:text-[104px]",
            INK,
          )}
        >
          Our Story
        </h1>
        <div className="mt-20 grid items-start gap-12 lg:mt-28 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>About Us</Eyebrow>
            <p
              className={cn(
                "mt-6 max-w-[460px] text-[32px] leading-[1.15] tracking-[-0.02em] lg:text-[38px]",
                INK,
              )}
            >
              Small businesses still run on calls, quotes and word of mouth. We started
              Serverlys to put their whole online side in one place.
            </p>
            <p className="mt-8 max-w-[440px] text-[16px] leading-[1.65] text-[#4a4f57]">
              Serverlys, LLC was founded in Miami, Florida, in {FOUNDED}. {YEARS} years
              on, we host, build, grow and look after websites for small businesses,
              with one team, one bill, and the renewal price printed next to every first
              price.
            </p>
          </div>
          <div className="relative aspect-[4/3.1] overflow-hidden rounded-lg">
            <Image
              src="/mock/about-miami.jpg"
              alt="The Miami skyline across Biscayne Bay"
              fill
              sizes="(min-width:1024px) 540px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ── 2. Mission + three staggered cards ──────────────────────────────────── */

const BELIEFS = [
  {
    t: "What We Believe",
    b: "A small business deserves the same honest pricing and real support a big one gets. Every plan shows what it renews at before you buy, and a person reads every message you send.",
    src: "/mock/biz-salon.jpg",
    offset: "",
  },
  {
    t: "How We Build",
    b: "One team for everything: the same people host your site, build it, rank it and keep it running. There is no hand-off to another company and nobody else to blame when something breaks.",
    src: "/mock/design-hero.jpg",
    offset: "lg:mt-14",
  },
  {
    t: "Why It Matters",
    b: "Most small businesses juggle a host, a registrar, a designer and an agency who have never spoken. Every hour spent chasing them is an hour not spent on the customers who pay the bills.",
    src: "/mock/mkt-bakery.jpg",
    offset: "lg:mt-28",
  },
];

function Mission() {
  return (
    <section
      aria-labelledby="about-mission-heading"
      className="bg-white pb-24 lg:pb-32"
    >
      <Wrap>
        <Eyebrow>Our Mission</Eyebrow>
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <h2
            id="about-mission-heading"
            className={cn(
              "text-[32px] leading-[1.12] tracking-[-0.02em] lg:text-[40px]",
              INK,
            )}
          >
            A world where every small business has a website that works for it, not
            against it.
          </h2>
          <p className="max-w-[420px] text-[16px] leading-[1.6] text-[#4a4f57] lg:justify-self-end lg:pt-3">
            Every day, small businesses win customers online: a quote request at night,
            a booking from a phone, a search for the shop around the corner. We build
            and run the websites behind those moments, so owners can do the work only
            they can do.
          </p>
        </div>
        <div className="mt-16 grid items-start gap-3 lg:grid-cols-3">
          {BELIEFS.map((c, i) => (
            <Reveal
              key={c.t}
              delay={i * 90}
              className={cn(
                "flex min-h-[340px] flex-col justify-between rounded-sm bg-[#f4f4f8] p-3",
                c.offset,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className={cn("pt-1 pl-1 text-[13px] font-medium", INK)}>{c.t}</h3>
                <div className="relative size-[96px] shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={c.src}
                    alt=""
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="mt-16 max-w-[300px] p-1 text-[14px] leading-[1.6] text-[#3a3f46]">
                {c.b}
              </p>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ── 3. Manifesto ────────────────────────────────────────────────────────── */

function Manifesto() {
  return (
    <section
      aria-labelledby="about-manifesto-heading"
      className="bg-white pb-24 lg:pb-32"
    >
      <Wrap>
        <Eyebrow center>Our Manifesto</Eyebrow>
        <h2
          id="about-manifesto-heading"
          className={cn(
            serif.className,
            "mt-8 text-center text-[56px] leading-[1.02] tracking-[-0.035em] text-[#3a3a3a] sm:text-[88px] lg:text-[128px]",
          )}
        >
          Year Two
          <br />
          Shouldn’t Be
          <br />
          <span className="lg:pr-[30%]">a Surprise.</span>
        </h2>
        <p className="mt-10 max-w-[300px] text-[16px] leading-[1.55] text-[#2f3238] lg:-mt-36 lg:ml-auto">
          The hosting, website and growth team for small businesses, built so nobody
          opens a renewal bill and wonders what happened.
        </p>
      </Wrap>
    </section>
  );
}

/* ── 4. Dark band (the reference's "please stay on the line" video) ──────── */

function DarkBand() {
  const lines = [
    "“Your plan now renews at a higher rate.”",
    "“Migration is a paid extra.”",
    "“Restoring a backup costs extra.”",
    "“Please hold for the next available agent.”",
  ];
  return (
    <section aria-labelledby="about-dark-heading" className="px-2">
      <div className="relative overflow-hidden rounded-xl bg-black px-6 py-24 lg:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(1px_1px_at_20%_30%,#fff_50%,transparent_51%),radial-gradient(1px_1px_at_70%_20%,#fff_50%,transparent_51%),radial-gradient(1.5px_1.5px_at_40%_70%,#fff_50%,transparent_51%),radial-gradient(1px_1px_at_85%_60%,#fff_50%,transparent_51%),radial-gradient(1px_1px_at_10%_80%,#fff_50%,transparent_51%),radial-gradient(1px_1px_at_55%_45%,#fff_50%,transparent_51%)] [background-size:340px_340px]"
        />
        <h2
          id="about-dark-heading"
          className="relative mx-auto max-w-[620px] text-center text-[15px] font-medium tracking-[0.08em] text-white/60 uppercase"
        >
          Things small businesses are used to hearing
        </h2>
        <ul className="relative mx-auto mt-10 flex max-w-[860px] flex-col items-center gap-5 text-center">
          {lines.map((l) => (
            <li
              key={l}
              className="text-[22px] font-medium tracking-[-0.01em] text-white/45 line-through decoration-[#e03131] decoration-2 sm:text-[30px]"
            >
              {l}
            </li>
          ))}
        </ul>
        <p className="relative mx-auto mt-12 max-w-[560px] text-center text-[17px] leading-[1.6] text-white">
          Not here. The renewal price is shown before you buy, migration and backup
          restores are free, and a person reads every message.
        </p>
      </div>
    </section>
  );
}

/* ── 5. Our Journey (vertical timeline) ──────────────────────────────────── */

const JOURNEY = [
  {
    year: String(FOUNDED),
    title: "Founded in Miami",
    body: "Serverlys, LLC starts in Miami, Florida, with one idea: a small business should have one team for its whole online side.",
  },
  {
    year: "Hosting",
    title: "Honest hosting",
    body: "Cloud, WordPress and WooCommerce hosting on LiteSpeed, with free migration and the renewal price shown on every plan.",
  },
  {
    year: "Websites",
    title: "Design and development",
    body: "The team that hosts a site builds and improves it too: custom designs, features, bookings and payments.",
  },
  {
    year: "Growth",
    title: "SEO, social and care",
    body: "SEO plans, social media management and ServerCare maintenance, for owners who want the marketing and upkeep handled.",
  },
  {
    year: "AI",
    title: sisterProducts.map((p) => p.name).join(" and "),
    body: "AI agents that answer customers by website chat and by phone, day and night.",
  },
  {
    year: String(YEAR),
    title: "Sera on serverlys.com",
    body: "A new serverlys.com, with Sera, an AI assistant that answers questions about plans and services on every page.",
  },
  {
    year: "Today",
    title: "The journey continues",
    body: `${YEARS} years in, still one team, one bill and one number to call. Thank you for being part of it.`,
  },
];

function Journey() {
  return (
    <section aria-labelledby="about-journey-heading" className="px-2 pt-24 lg:pt-32">
      <div className="rounded-xl bg-[#f3f3f7] py-20 lg:py-24">
        <Wrap>
          <Eyebrow>Milestones</Eyebrow>
          <h2
            id="about-journey-heading"
            className={cn("mt-5 text-[32px] tracking-[-0.02em] lg:text-[40px]", INK)}
          >
            Our Journey
          </h2>
          <ol className="relative mt-16">
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-4 w-px bg-[#d8dae3] lg:left-1/2"
            />
            {JOURNEY.map((j, i) => {
              const flip = i % 2 === 1;
              return (
                <li
                  key={j.title}
                  className="relative grid gap-4 pb-12 pl-12 lg:grid-cols-2 lg:gap-0 lg:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-3 left-4 size-3.5 -translate-x-1/2 rounded-full bg-[#3b5bdb] ring-4 ring-[#dbe2ff] lg:left-1/2"
                  />
                  <p
                    className={cn(
                      "text-[30px] tracking-[-0.02em]",
                      BLUE,
                      flip ? "lg:order-2 lg:pl-16" : "lg:pr-16 lg:text-right",
                    )}
                  >
                    {j.year}
                  </p>
                  <Reveal
                    className={cn(
                      "rounded-md bg-white p-5",
                      flip ? "lg:order-1 lg:mr-16" : "lg:ml-16",
                    )}
                  >
                    <h3
                      className={cn(
                        "text-[22px] leading-tight tracking-[-0.01em]",
                        INK,
                      )}
                    >
                      {j.title}
                    </h3>
                    <p className="mt-6 max-w-[320px] text-[14px] leading-[1.6] text-[#4a4f57]">
                      {j.body}
                    </p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </Wrap>
      </div>
    </section>
  );
}

/* ── 6. The promise behind the work (the reference's team list) ──────────── */

function Standard() {
  const plans = CLOUD?.plans ?? [];
  const n = plans.length;
  const count = (re: RegExp) =>
    plans.filter((p) => p.includes.some((f) => re.test(f))).length;
  const starter = plans[0];
  const rows = [
    {
      label: "Renewal shown",
      value: starter
        ? `${formatPrice(starter.monthly)} → ${formatPrice(starter.standard)}`
        : "",
      ok: plans.every((p) => p.standard > 0),
      href: "/pricing",
    },
    {
      label: "Free migration",
      value: `${count(/Website Migration/i)} of ${n} plans`,
      ok: count(/Website Migration/i) === n,
      href: "/migrations",
    },
    {
      label: "30-day money-back",
      value: `${count(/Money-Back/i)} of ${n} plans`,
      ok: count(/Money-Back/i) === n,
      href: "/refund-policy",
    },
    {
      label: "Free daily backups",
      value: `${count(/Daily Backups/i)} of ${n} plans`,
      ok: count(/Daily Backups/i) === n,
      href: "/pricing",
    },
    {
      label: "Free SSL",
      value: `${count(/SSL/i)} of ${n} plans`,
      ok: count(/SSL/i) === n,
      href: "/cloud-hosting",
    },
  ];
  return (
    <section aria-labelledby="about-team-heading" className="bg-white py-24 lg:py-32">
      <Wrap>
        <Eyebrow center>Our Standard</Eyebrow>
        <h2
          id="about-team-heading"
          className={cn(
            serif.className,
            "mt-8 text-[56px] leading-[1.02] tracking-[-0.035em] text-[#3a3a3a] sm:text-[88px] lg:text-[120px]",
          )}
        >
          <span className="block lg:pl-[4%]">The Promise</span>
          <span className="block text-right">Behind the</span>
          <span className="block">Work.</span>
        </h2>
        <div className="mt-8 text-[16px] leading-[1.55] text-[#2f3238] lg:-mt-28 lg:ml-auto lg:max-w-[300px]">
          <p>One team.</p>
          <p className="mt-4">Unreasonable standards.</p>
          <p className="mt-4">
            Most companies list their leaders here. We list the promises we keep, with
            live proof from the same plan data the checkout uses. If one ever stops
            being true, this list shows it.
          </p>
        </div>
        <ul className="mt-14 lg:ml-[36%]">
          {rows.map((r) => (
            <li
              key={r.label}
              className="grid grid-cols-[110px_1fr_auto] items-center gap-4 border-t border-[#e3e4e8] py-3 sm:grid-cols-[160px_1fr_auto]"
            >
              <span className={cn("text-[13px] font-medium", BLUE)}>{r.label}</span>
              <span
                className={cn(
                  serif.className,
                  "text-[28px] leading-tight tracking-[-0.02em] sm:text-[42px]",
                  INK,
                )}
              >
                {r.value}
              </span>
              <Link
                href={r.href}
                aria-label={`Check it: ${r.label}`}
                className={cn(
                  "flex size-7 items-center justify-center rounded-sm text-[12px] font-bold text-white",
                  r.ok ? "bg-[#0b1530] hover:bg-[#3b5bdb]" : "bg-[#e03131]",
                )}
              >
                {r.ok ? "✓" : "!"}
              </Link>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ── 7. Photo strip (the reference's team photos) ────────────────────────── */

const STRIP = [
  { src: "/mock/social-hero.jpg", cls: "left-[2%] top-[14%] w-[22%] aspect-[4/3]" },
  {
    src: "/mock/biz-contractors.jpg",
    cls: "left-[22%] top-[6%] w-[26%] aspect-[4/3.2]",
  },
  { src: "/mock/mkt-bikes.jpg", cls: "left-[46%] top-0 w-[18%] aspect-square" },
  { src: "/mock/move-cta.jpg", cls: "left-[62%] top-[10%] w-[22%] aspect-[4/3]" },
  { src: "/mock/biz-restaurant.jpg", cls: "left-[84%] top-[26%] w-[15%] aspect-[3/4]" },
];

function PhotoStrip() {
  return (
    <section
      aria-label="The businesses we build for"
      className="bg-white pb-24 lg:pb-32"
    >
      <div
        aria-hidden="true"
        className="relative mx-auto hidden h-[360px] max-w-[1400px] md:block"
      >
        {STRIP.map((p) => (
          <div key={p.src} className={cn("absolute overflow-hidden rounded-lg", p.cls)}>
            <Image src={p.src} alt="" fill sizes="320px" className="object-cover" />
          </div>
        ))}
      </div>
      <p className="mt-6 px-5 text-center text-[13px] text-[#6b7079]">
        The kinds of businesses we build for: studios, trades, shops, cafés and
        restaurants.
      </p>
    </section>
  );
}

/* ── 8. Products (the reference's investors grid) ────────────────────────── */

const PRODUCTS: { name: string; sub: string; href: string; src: string }[] = [
  {
    name: "Cloud hosting",
    sub: `From ${formatPrice(lowestRate)}/mo`,
    href: "/cloud-hosting",
    src: "/mock/about-servers.jpg",
  },
  {
    name: "Website design",
    sub: `From ${formatDesignPrice(designFromPrice)}`,
    href: "/website-design",
    src: "/mock/design-wireframe.jpg",
  },
  {
    name: "Web development",
    sub: "$129/hr",
    href: "/website-development",
    src: "/mock/webdev-code.jpg",
  },
  {
    name: "SEO",
    sub: `From ${formatSeoPrice(seoFromPrice)}/mo`,
    href: "/seo",
    src: "/mock/seo-local.jpg",
  },
  {
    name: "Social media",
    sub: `From ${formatSocialPrice(socialFromPrice)}/mo`,
    href: "/social-media",
    src: "/mock/social-latte.jpg",
  },
  {
    name: "Site management",
    sub: `From ${formatCarePrice(careFromPrice)}/mo`,
    href: "/site-management",
    src: "/mock/care-mechanic.jpg",
  },
  {
    name: "Free migration",
    sub: "With every cloud plan",
    href: "/migrations",
    src: "/mock/move-boxes.jpg",
  },
  {
    name: "Business email",
    sub: "From $5.95/mo",
    href: "/business-email",
    src: "/mock/care-typing.jpg",
  },
  {
    name: "ConvoAI",
    sub: "AI website chat",
    href: "https://convoai.cloud/",
    src: "/mock/biz-kitchen.jpg",
  },
  {
    name: "CallFlow",
    sub: "AI phone answering",
    href: "https://callflow.serverlys.com/",
    src: "/mock/design-call.jpg",
  },
  {
    name: "Automations",
    sub: "Leads to bookings, automatically",
    href: "/automations",
    src: "/mock/biz-meeting.jpg",
  },
  {
    name: "Business solutions",
    sub: "All-in-one plans",
    href: "/business-solutions",
    src: "/mock/biz-contractors.jpg",
  },
];

function Products() {
  return (
    <section aria-labelledby="about-products-heading" className="px-2">
      <div className="rounded-xl bg-[#f3f3f7] p-3 sm:p-12">
        <div className="rounded-xl bg-white px-6 py-14 sm:px-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <Eyebrow>Our Products</Eyebrow>
              <h2
                id="about-products-heading"
                className={cn(
                  "mt-5 text-[32px] tracking-[-0.02em] lg:text-[40px]",
                  INK,
                )}
              >
                Everything a Small Business Runs On
              </h2>
            </div>
            <p className="max-w-[360px] text-[15px] leading-[1.55] text-[#2f3238] lg:justify-self-end lg:pt-12">
              Twelve products, one account, one bill. Starting prices are read live from
              the same plan data as each product’s own page.
            </p>
          </div>
          <ul className="mt-12 grid gap-x-1 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <li key={p.name} className="border-b border-[#e3e4e8]">
                <a href={p.href} className="group flex items-center gap-4 py-4">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-sm">
                    <Image
                      src={p.src}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover grayscale transition group-hover:grayscale-0"
                    />
                  </span>
                  <span>
                    <span
                      className={cn(
                        "block text-[16px] font-medium group-hover:text-[#3b5bdb]",
                        INK,
                      )}
                    >
                      {p.name}
                    </span>
                    <span className="block text-[13px] text-[#6b7079]">{p.sub}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── 9. Talk to us (the reference's careers block) ───────────────────────── */

function TalkToUs() {
  return (
    <section
      aria-labelledby="about-join-heading"
      className="bg-white py-24 text-center lg:py-28"
    >
      <Wrap>
        <Eyebrow center>Talk to Serverlys</Eyebrow>
        <h2
          id="about-join-heading"
          className={cn(
            "mx-auto mt-5 max-w-[620px] text-[30px] leading-[1.15] tracking-[-0.02em] lg:text-[34px]",
            INK,
          )}
        >
          A person reads every message. Ask us anything.
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-[15px] text-[#4a4f57]">
          Call {company.phone}, email {emailDisplay}, or ask Sera now, and the team
          follows up on anything that needs a human.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <ChatButton size="sm">Ask Sera</ChatButton>
          <a
            href={company.phoneHref}
            className="inline-flex h-9 items-center rounded-[4px] bg-[#0b1530] px-3.5 text-[13px] font-semibold text-white hover:bg-[#1b2750]"
          >
            Call {company.phone}
          </a>
        </div>
      </Wrap>
    </section>
  );
}

/* ── 10. FAQ ─────────────────────────────────────────────────────────────── */

const FAQS = [
  {
    question: "Who owns Serverlys?",
    answer: `Serverlys is owned and operated by ${company.legalName}, a company based in Miami, Florida, founded in ${FOUNDED}.`,
  },
  {
    question: "Is Serverlys only a web hosting company?",
    answer:
      "No. Hosting is where it starts, but Serverlys also registers domains, designs and builds websites, runs SEO and social media, manages and maintains sites, provides business email, and offers AI agents that answer customers by chat and phone.",
  },
  {
    question: "Who is Serverlys for?",
    answer:
      "Small businesses that want their whole online side handled by one team: contractors and trades, restaurants and cafés, salons, shops and online stores, clinics and offices, and the agencies that look after them.",
  },
  {
    question: "What makes Serverlys different from other hosts?",
    answer:
      "Every plan shows the price it renews at next to the price you start at, so year two is never a surprise. And the same team that hosts your site can build it, grow it and look after it, on one bill.",
  },
  {
    question: "When might Serverlys not be the right choice?",
    answer:
      "If your site is on a closed website builder like Wix, Squarespace or Shopify, its files cannot be moved, so it would need rebuilding rather than migrating. If you need a large custom infrastructure contract, talk to us first so we can tell you honestly whether we are the right fit.",
  },
  {
    question: "How do I contact Serverlys?",
    answer: `Call ${company.phone}, email ${company.email}, open a ticket in the client area, or ask Sera in the chat on any page. A person reads every message.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={faqGraph(
          FAQS.map((f) => ({ ...f, scopes: [PATH] })),
          PATH,
        )}
      />
      <Story />
      <Mission />
      <Manifesto />
      <DarkBand />
      <Journey />
      <Standard />
      <PhotoStrip />
      <Products />
      <TalkToUs />
      <Faqs id="about-faq-heading" items={FAQS} />
      <PhotoCta
        id="about-cta-heading"
        photo={{
          src: "/mock/about-miami-night.jpg",
          alt: "Miami lit up at night across the water",
          position: "50% 50%",
        }}
        thumb="/mock/about-miami.jpg"
        title="Put your whole online side with one team"
        body={`Hosting from ${formatPrice(lowestRate)}/mo with free migration, or tell us what you need and we will scope it.`}
        primary={{ label: "See plans", href: "/pricing" }}
      />
    </>
  );
}
