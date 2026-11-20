import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import {
  GLOSSARY,
  relatedTutorials,
  SCREENS,
  screenSrc,
  tutorialBySlug,
  tutorialPath,
  tutorials,
  type Tutorial,
} from "@/data/tutorials";
import { routeFor } from "@/data/routes";
import { howToGraph, pageMetadata } from "@/lib/seo";
import { PageHero } from "../../resources/_components/page-hero";
import { categoryAnchor, TutorialsHelpCta } from "../_components/tutorial-ui";

/**
 * One tutorial, on its own URL.
 *
 * Statically generated from data/tutorials.ts — generateStaticParams lists
 * every slug and dynamicParams=false makes any other slug a 404 rather than
 * an empty shell. The index at /tutorials links here.
 *
 * The HowTo JSON-LD is built from the same fields the page renders (title,
 * summary, step headings and paragraphs), so the markup cannot describe text
 * a reader does not see.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return tutorials.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/tutorials/[slug]">) {
  const { slug } = await props.params;
  const tutorial = tutorialBySlug(slug);
  if (!tutorial) return {};

  const base = pageMetadata({
    title:
      tutorial.title.length <= 46 && !/step by step/i.test(tutorial.title)
        ? `${tutorial.title}, step by step`
        : tutorial.title,
    description: `${tutorial.summary} ${tutorial.steps.length} steps, about ${tutorial.minutes} minutes.`,
    path: tutorialPath(tutorial),
  });
  return { ...base, openGraph: { ...base.openGraph, type: "article" } };
}

const stepAnchor = (i: number) => `step-${i + 1}`;

/** Product pages this tutorial applies to — built registry routes only. */
function productLinks(t: Tutorial) {
  return (t.products ?? []).flatMap((path) => {
    const route = routeFor(path);
    return route?.built && route.indexable ? [{ href: path, label: route.name }] : [];
  });
}

export default async function TutorialPage(props: PageProps<"/tutorials/[slug]">) {
  const { slug } = await props.params;
  const tutorial = tutorialBySlug(slug);
  if (!tutorial) notFound();

  const path = tutorialPath(tutorial);
  const related = relatedTutorials(tutorial);
  const products = productLinks(tutorial);

  return (
    <>
      <JsonLd
        data={howToGraph({
          name: tutorial.title,
          description: tutorial.summary,
          path,
          minutes: tutorial.minutes,
          steps: tutorial.steps.map((s, i) => ({ name: s.title, text: s.detail, anchor: stepAnchor(i), image: s.shot && screenSrc(s.shot.id) })),
        })}
      />

      <PageHero
        trail={[
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
          { name: "Tutorials", href: "/tutorials" },
          { name: tutorial.title },
        ]}
        label={tutorial.category}
        title={tutorial.title}
        lede={<p>{tutorial.summary}</p>}
      >
        <p className="mt-6 flex flex-wrap items-center gap-3 text-small text-fg-muted">
          <Link
            href={`/tutorials#${categoryAnchor(tutorial.category)}`}
            className="rounded-full bg-canvas-secondary px-3 py-1 font-medium text-fg ring-1 ring-line hover:text-primary"
          >
            All {tutorial.category} tutorials
          </Link>
          <span>{tutorial.steps.length} steps</span>
          <span aria-hidden="true">·</span>
          <span>About {tutorial.minutes} minutes</span>
        </p>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
          <nav aria-label="Steps" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-small font-semibold text-fg">On this page</p>
            <ol className="mt-4 flex flex-col gap-1">
              {tutorial.steps.map((s, i) => (
                <li key={s.title}>
                  <a
                    href={`#${stepAnchor(i)}`}
                    className="flex min-h-[2.75rem] items-center gap-3 rounded-md px-3 text-small text-fg-secondary transition-colors hover:bg-canvas-secondary hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="w-4 shrink-0 text-fg-muted">{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0">
            <div className="rounded-2xl p-5 ring-1 ring-line">
              <h2 className="text-body font-semibold text-fg">What this does, in plain words</h2>
              <p className="mt-2 max-w-[62ch] text-body text-fg-secondary">{tutorial.intro}</p>
            </div>

            {tutorial.terms.length > 0 && (
              <details className="group mt-4 rounded-2xl bg-canvas-secondary p-5 ring-1 ring-line" open={tutorial.terms.length <= 4}>
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-body font-semibold text-fg [&::-webkit-details-marker]:hidden">
                  <span>
                    Words you will see{" "}
                    <span className="font-normal text-fg-muted">({tutorial.terms.length})</span>
                  </span>
                  <span aria-hidden="true" className="text-fg-muted transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                  {tutorial.terms.map((k) => (
                    <div key={k}>
                      <dt className="text-small font-semibold text-fg">{GLOSSARY[k].term}</dt>
                      <dd className="mt-1 text-small text-fg-secondary">{GLOSSARY[k].def}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}

            <div className="mt-4 rounded-2xl bg-brand-50 p-5">
              <h2 className="text-small font-semibold text-fg">What you need before you start</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {tutorial.before.map((b) => (
                  <li key={b} className="flex gap-2.5 text-small text-fg-secondary">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <ol className="mt-8 flex flex-col divide-y divide-line border-t border-line">
              {tutorial.steps.map((s, i) => (
                <li key={s.title} id={stepAnchor(i)} className="flex scroll-mt-28 gap-5 py-6">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-micro font-semibold text-white"
                  >
                    {i + 1}
                  </span>
                  {/* overflow-x-clip: a long code line ("dig +short TXT _dmarc…") still
                      widened the page to 402px at 320 even though its <pre> scrolls. */}
                  <div className="min-w-0 overflow-x-clip">
                    <h2 className="text-body font-semibold text-fg">
                      <span className="sr-only">Step {i + 1}: </span>
                      {s.title}
                    </h2>
                    {s.where && s.where.length > 0 && (
                      <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-small">
                        <span className="font-medium text-fg-muted">Where:</span>
                        {s.where.map((w, j) => (
                          <span key={w + j} className="inline-flex items-center gap-1.5">
                            {j > 0 && <span aria-hidden="true" className="text-fg-muted">›</span>}
                            <span className="rounded-md bg-canvas-secondary px-2 py-0.5 font-medium text-fg ring-1 ring-line">{w}</span>
                          </span>
                        ))}
                      </p>
                    )}
                    <p className="mt-2 max-w-[62ch] text-body text-fg-secondary">{s.detail}</p>
                    {s.code && (
                      <pre className="mt-3 overflow-x-auto rounded-lg bg-canvas-abyss p-4">
                        <code className="font-mono text-small text-fg-on-dark-secondary">{s.code}</code>
                      </pre>
                    )}
                    {s.shot && (
                      <figure className="mt-4 max-w-[640px]">
                        <a
                          href={screenSrc(s.shot.id)}
                          target="_blank"
                          rel="noopener"
                          className="block overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md"
                        >
                          <Image
                            src={screenSrc(s.shot.id)}
                            alt={SCREENS[s.shot.id].alt}
                            width={SCREENS[s.shot.id].w}
                            height={SCREENS[s.shot.id].h}
                            sizes="(min-width: 768px) 640px, 100vw"
                            className="h-auto w-full"
                          />
                        </a>
                        <figcaption className="mt-2 text-small text-fg-secondary">{s.shot.caption}</figcaption>
                      </figure>
                    )}
                    {s.check && (
                      <p className="mt-3 flex max-w-[62ch] gap-2.5 rounded-lg bg-success-soft px-3.5 py-2.5 text-small text-fg">
                        <span aria-hidden="true" className="font-bold text-success">✓</span>
                        <span>
                          <span className="font-semibold">You should now see: </span>
                          {s.check}
                        </span>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex gap-4 rounded-2xl bg-success-soft p-5">
              <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-success text-small font-bold text-white">✓</span>
              <div>
                <h2 className="text-body font-semibold text-fg">How you know you are done</h2>
                <p className="mt-2 max-w-[62ch] text-small text-fg-secondary">{tutorial.done}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-4 rounded-2xl bg-warning-soft p-5">
              <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-warning-fill text-small font-bold text-white">!</span>
              <div>
                <h2 className="text-body font-semibold text-fg">The mistake people make</h2>
                <p className="mt-2 max-w-[62ch] text-small text-fg-secondary">{tutorial.gotcha}</p>
              </div>
            </div>

            {products.length > 0 && (
              <div className="mt-8 rounded-2xl p-5 ring-1 ring-line">
                <h2 className="text-body font-semibold text-fg">On Serverlys</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {products.map((p) => (
                    <li key={p.href}>
                      <Link
                        href={p.href}
                        className="inline-flex min-h-9 items-center rounded-full bg-canvas-secondary px-3.5 text-small font-medium text-primary ring-1 ring-line hover:text-primary-hover"
                      >
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </div>
      </Section>

      {related.length > 0 && (
        <Section surface="subtle" spacing="tight" labelledBy="related-tutorials">
          <h2 id="related-tutorials" className="display-md text-fg">
            Related tutorials
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <li key={t.slug}>
                <Link
                  href={tutorialPath(t)}
                  className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-line transition-colors hover:ring-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Badge>{t.category}</Badge>
                  <h3 className="mt-4 text-body-lg font-semibold text-fg group-hover:text-primary">{t.title}</h3>
                  <p className="mt-2 text-small text-fg-secondary">{t.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <TutorialsHelpCta />

      <FinalCta />
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Tutorials", path: "/tutorials" },
          { name: tutorial.title, path },
        ]}
      />
    </>
  );
}
