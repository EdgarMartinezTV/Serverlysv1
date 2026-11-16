import Link from "next/link";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { tutorialBySlug, tutorialCategories, tutorialPath, tutorials, type Tutorial } from "@/data/tutorials";
import { collectionGraph, pageMetadata } from "@/lib/seo";
import { AllTutorials, HeroSearch } from "./_components/index-client";
import { CardGrid, COL, SectionHead } from "./_components/index-ui";
import { categoryAnchor } from "./_components/tutorial-ui";

const PATH = "/tutorials";

const TITLE = "Tutorials — step-by-step guides for your site and domain";
const DESCRIPTION =
  "Point a domain, set up DKIM and DMARC, move WordPress, fix database errors, transfer a domain. Complete procedures with the exact records, settings and commands.";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

/**
 * Tutorials index — LAYOUT rebuilt on hostinger.com/tutorials (measured at
 * 1440 on 2026-11-16, at Edgar's request): topic bar → blue search hero →
 * three curated bands of three cards → a topic band with "View all" under its
 * subtitle → every tutorial, newest first, paginated.
 *
 * CONTENT is ours and honest: we have no view counts and no weekly editorial
 * rota, so the reference's "Most popular" and "Weekly editor's pick" become
 * "Start here" and "When something breaks" — chosen by subject, and labelled
 * as such. Dates are real first-publication dates; the byline is the company.
 *
 * Each guide lives at /tutorials/[slug] with its own HowTo markup; this page
 * is a collection and emits only CollectionPage JSON-LD.
 */
const pick = (...slugs: string[]) =>
  slugs.map((s) => tutorialBySlug(s)).filter((t): t is Tutorial => Boolean(t));

const START_HERE = pick("point-your-domain", "force-https", "email-deliverability");
const WORDPRESS = pick("wordpress-fast-on-day-one", "move-wordpress-to-a-new-host", "harden-wordpress-login");
const BREAKS = pick("fix-error-establishing-database-connection", "restore-a-backup", "reset-wordpress-password-phpmyadmin");
const EMAIL = pick("set-up-dkim", "set-up-dmarc", "connect-google-workspace-or-microsoft-365");

const anchor = (c: Tutorial["category"]) => `#all/${categoryAnchor(c)}`;

export default function TutorialsPage() {
  return (
    <div className="bg-white font-display text-[#18181a] [&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd
        data={collectionGraph({
          name: "Serverlys tutorials",
          description: DESCRIPTION,
          path: PATH,
          items: tutorials.map((t) => ({ name: t.title, path: tutorialPath(t) })),
        })}
      />

      <TopicBar />

      {/* Hero: 570px band, 46/51 light heading, a 620px pill input and a
          189px navy button, over soft circles — in the logo blue. */}
      <section
        aria-labelledby="tutorials-heading"
        className="relative isolate flex min-h-[440px] items-center overflow-hidden bg-[#1f3dff] py-20 md:min-h-[506px]"
      >
        <div aria-hidden className="absolute inset-0 -z-10">
          <span className="absolute -top-[260px] -left-[180px] size-[620px] rounded-full bg-white/[0.06]" />
          <span className="absolute -top-[120px] -right-[260px] size-[700px] rounded-full bg-white/[0.07]" />
          <span className="absolute -bottom-[420px] left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-white/[0.06]" />
          <span className="absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_120%,#0000d4,transparent_70%)]" />
        </div>
        <div className={`${COL} text-center`}>
          <h1 id="tutorials-heading" className="text-[34px] leading-[40px] font-light text-white md:text-[46px] md:leading-[51px]">
            Follow a guide and get the job done
          </h1>
          <HeroSearch />
        </div>
      </section>

      <Band id="start-here" title="Start here" sub="New site or new to Serverlys? These are the first jobs almost every website needs done.">
        <CardGrid items={START_HERE} />
      </Band>

      <Band
        id="wordpress"
        title="WordPress"
        sub="Whether you are launching your first site or moving a busy one, these cover setup, speed, moving hosts and keeping the login safe."
        viewAll={anchor("WordPress")}
      >
        <CardGrid items={WORDPRESS} />
      </Band>

      <Band id="when-it-breaks" title="When something breaks" sub="The guides to open first when a site is down, a password is lost or a change needs undoing.">
        <CardGrid items={BREAKS} />
      </Band>

      <Band
        id="email"
        title="Email"
        sub="Get your mail delivered instead of filtered: the records that prove it is really you, and how to connect the mailbox you already use."
        viewAll={anchor("Email")}
        viewAllBelow
      >
        <CardGrid items={EMAIL} />
      </Band>

      <section id="all" aria-labelledby="all-heading" className="scroll-mt-24 pt-[110px] pb-24">
        <div className={COL}>
          <SectionHead
            id="all-heading"
            title="All Serverlys tutorials"
            sub="Domains, DNS, email, WordPress, security and recovery, newest first. Every guide gives the exact records, settings and commands."
          />
          <AllTutorials />
        </div>
      </section>

      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Tutorials", path: PATH },
        ]}
      />
    </div>
  );
}

function Band({
  id,
  title,
  sub,
  viewAll,
  viewAllBelow,
  children,
}: {
  id: string;
  title: string;
  sub: string;
  viewAll?: string;
  viewAllBelow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="pt-[110px]">
      <div className={COL}>
        <SectionHead id={`${id}-heading`} title={title} sub={sub} viewAll={viewAll} viewAllBelow={viewAllBelow} />
        <div className={viewAllBelow ? "mt-[30px]" : "mt-[52px]"}>{children}</div>
      </div>
    </section>
  );
}

/**
 * The reference's second bar: a segmented "Tutorials | Learning lab" switch,
 * then the topics. Ours pairs Tutorials with the blog and lists our five
 * topics, each filtering the "All" band.
 */
function TopicBar() {
  return (
    <nav aria-label="Tutorial topics" className="border-b border-[#e3e4e8] bg-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 overflow-x-auto px-4 md:px-5 [scrollbar-width:none]">
        <div className="flex shrink-0 rounded-[10px] bg-[#f2f3f6] p-1 text-[14px] font-semibold">
          <span aria-current="page" className="rounded-lg bg-white px-4 py-2 shadow-sm">
            Tutorials
          </span>
          <Link href="/blog" className="rounded-lg px-4 py-2 hover:text-primary">
            Blog
          </Link>
        </div>
        <ul className="flex h-full shrink-0 items-stretch text-[14px]">
          <li className="flex">
            <a href="#all" className="flex items-center border-b-2 border-primary px-4 text-primary">
              All Tutorials
            </a>
          </li>
          {tutorialCategories.map((c) => (
            <li key={c} className="flex">
              <a href={anchor(c)} className="flex items-center border-b-2 border-transparent px-4 text-[#58585e] hover:text-primary">
                {c}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
