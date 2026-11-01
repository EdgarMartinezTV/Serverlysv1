import Link from "next/link";
import { Section } from "@/components/ui/section";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { tutorials, tutorialCategories, tutorialPath } from "@/data/tutorials";
import { collectionGraph, pageMetadata } from "@/lib/seo";
import { PageHero } from "../resources/_components/page-hero";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { categoryAnchor, TutorialsHelpCta } from "./_components/tutorial-ui";

const PATH = "/tutorials";

const TITLE = "Tutorials — step-by-step guides for your site and domain";
const DESCRIPTION =
  "Point a domain, set up DKIM and DMARC, move WordPress, fix database errors, transfer a domain. Complete procedures with the exact records, settings and commands.";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

/**
 * Tutorials index.
 *
 * Until 2026-10-26 every guide was rendered in full on this one page, which
 * meant none of them had a URL of its own and none could rank for its own
 * query. Each now lives at /tutorials/[slug] with its own HowTo markup; this
 * page groups them by category and links to each.
 *
 * The HowTo JSON-LD moved with the content: emitting it here as well would
 * describe the same procedure under two URLs. This page is a collection.
 */
export default function TutorialsPage() {
  return (
    <>
      <JsonLd
        data={collectionGraph({
          name: "Serverlys tutorials",
          description: DESCRIPTION,
          path: PATH,
          items: tutorials.map((t) => ({ name: t.title, path: tutorialPath(t) })),
        })}
      />

      <PageHero
        trail={[
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
          { name: "Tutorials" },
        ]}
        label="Tutorials"
        title="Get the job done"
        lede={
          <p>
            Complete procedures with the actual record values, settings and commands. Each
            one names the mistake people make, because that is usually why you are here.
          </p>
        }
        visual={<DnsMock />}
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {tutorialCategories.map((c) => (
            <li key={c}>
              <a
                href={`#${categoryAnchor(c)}`}
                className="inline-flex min-h-9 items-center rounded-full bg-canvas-secondary px-3.5 text-small font-medium text-fg ring-1 ring-line transition-colors hover:text-primary"
              >
                {c}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <Section>
        <div className="flex flex-col gap-16">
          {tutorialCategories.map((category) => (
            <section
              key={category}
              id={categoryAnchor(category)}
              aria-labelledby={`${categoryAnchor(category)}-title`}
              className="scroll-mt-28"
            >
              <h2 id={`${categoryAnchor(category)}-title`} className="display-md text-fg">
                {category}
              </h2>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tutorials
                  .filter((t) => t.category === category)
                  .map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={tutorialPath(t)}
                        className="group flex h-full flex-col rounded-2xl bg-canvas p-6 ring-1 ring-line transition-colors hover:ring-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <h3 className="text-body-lg font-semibold text-fg group-hover:text-primary">
                          {t.title}
                        </h3>
                        <p className="mt-2 flex-1 text-small text-fg-secondary">{t.summary}</p>
                        <p className="mt-4 text-caption text-fg-muted">
                          {t.steps.length} steps · About {t.minutes} minutes
                        </p>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <TutorialsHelpCta />

      <FinalCta />
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Tutorials", path: PATH },
        ]}
      />
    </>
  );
}

/**
 * The first tutorial's subject, drawn: a DNS zone with the records a site
 * and its mail need. Values are documentation addresses (RFC 5737) and
 * placeholders, so nothing here points anywhere real.
 */
function DnsMock() {
  const rows = [
    ["A", "@", "192.0.2.10"],
    ["CNAME", "www", "yourbrand.com"],
    ["MX", "@", "mail.yourbrand.com"],
    ["TXT", "@", "v=spf1 include:_spf… ~all"],
  ];
  return (
    <div aria-hidden="true" className="mx-auto max-w-[480px] overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
      <div className="flex items-center justify-between border-b border-line-subtle px-4 py-3">
        <span className="text-small font-semibold text-fg">DNS zone · yourbrand.com</span>
        <span className="rounded-md bg-primary px-2.5 py-1 text-micro font-semibold text-white">Add record</span>
      </div>
      <table className="w-full text-left text-micro">
        <thead className="bg-canvas-secondary text-fg-muted">
          <tr>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-subtle">
          {rows.map(([t, n, v]) => (
            <tr key={t + n}>
              <td className="px-4 py-2.5"><span className="rounded bg-brand-50 px-1.5 py-0.5 font-semibold text-primary">{t}</span></td>
              <td className="px-4 py-2.5 text-fg">{n}</td>
              <td className="max-w-0 truncate px-4 py-2.5 text-fg-secondary">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="flex items-center gap-2 border-t border-line-subtle px-4 py-3 text-micro text-success">
        <span className="size-1.5 rounded-full bg-success-fill" />
        Propagated · HTTPS certificate issued
      </p>
    </div>
  );
}
