import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section } from "@/components/ui/section";
import { company, emailDisplay } from "@/data/company";
import {
  CATEGORY_BLURB,
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  PRECEDENCE,
  documentsIn,
  legalDoc,
  relatedDocs,
} from "@/data/legal";
import { t as tx, isSpanish } from "@/i18n/t";
import { lh } from "@/i18n/href";

/**
 * Legal document layout.
 *
 * ⚠ THESE DOCUMENTS NEED COUNSEL REVIEW BEFORE LAUNCH.
 *
 * The content is real, specific and grounded in commitments Serverlys already
 * publishes — the 30-day refund window, non-refundable domain registrations,
 * free restores. It is not filler. But policy text is legally operative: it
 * binds the business, and a lawyer in the operating jurisdiction should read
 * it before it goes live. That review is a launch task, tracked in
 * ARCHITECTURE.md, not something to resolve in code.
 *
 * No "draft" or "under review" banner is rendered. A published policy that
 * disclaims itself is worse than useless — it invites the argument that no
 * terms were agreed at all. Either the document is in force or it should not
 * be on the site.
 *
 * Structure: numbered sections, a sticky contents list, and a stated effective
 * date. Legal pages are read by people looking for one clause, so navigation
 * matters more here than on any other page type.
 */

export type LegalSection = {
  id: string;
  heading: string;
  /** Paragraphs and lists, in order. */
  blocks: ReadonlyArray<
    | { type: "p"; text: string }
    | { type: "ul"; items: readonly string[] }
    | { type: "note"; text: string }
    /**
     * The grouped index of every document in the set, read from
     * `data/legal.ts`. Declarative rather than a React slot so the index
     * stays a numbered section like any other — it appears in the sticky
     * contents list, and the hub page keeps its data/presentation split.
     *
     * Only `/legal-information` uses this. It is a block type rather than a
     * bespoke page so that the hub gets the same heading rhythm, contents
     * behaviour and scroll offsets as the documents it lists.
     */
    | { type: "index" }
    /** The stated order of precedence, from `PRECEDENCE` in data/legal.ts. */
    | { type: "precedence" }
  >;
};

/** The grouped document index. See the `index` block type above. */
function DocumentIndex() {
  return (
    <div className="mt-6 flex flex-col gap-10">
      {CATEGORY_ORDER.map((category) => {
        const docs = documentsIn(category);
        if (docs.length === 0) return null;
        return (
          <section key={category} aria-labelledby={`index-${category}`}>
            <h3 id={`index-${category}`} className="text-h4 text-fg">
              {tx(CATEGORY_LABEL[category])}
            </h3>
            <p className="mt-1 text-small text-fg-muted">{tx(CATEGORY_BLURB[category])}</p>
            <ul className="mt-5 flex flex-col gap-px overflow-hidden rounded-lg bg-line">
              {docs.map((doc) => (
                <li key={doc.path}>
                  <Link
                    href={lh(doc.path)}
                    className="group flex flex-col gap-1 bg-surface p-4 transition-colors duration-fast hover:bg-canvas-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:p-5"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-body font-semibold text-fg group-hover:text-primary">
                        {tx(doc.title)}
                      </span>
                      <time
                        dateTime={doc.effective}
                        className="text-micro text-fg-muted"
                      >
                        {tx(doc.effective)}
                      </time>
                    </span>
                    <span className="text-small text-fg-secondary">{tx(doc.summary)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/** The stated order of precedence. See the `precedence` block type above. */
function Precedence() {
  return (
    <ol className="mt-4 flex flex-col gap-3">
      {PRECEDENCE.map((rule, i) => (
        <li key={rule} className="flex gap-3 text-body text-fg-secondary">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-micro font-semibold text-primary"
          >
            {tx(i + 1)}
          </span>
          <span>{tx(rule)}</span>
        </li>
      ))}
    </ol>
  );
}

export function LegalPage({
  path,
  title,
  intro,
  sections,
  trail,
  contact,
}: {
  /**
   * This document's own path. Load-bearing: the effective date and the
   * cross-links below are read from the registry in `data/legal.ts` under
   * this key, so the date cannot drift from the one the index shows, and an
   * unregistered path fails the build rather than rendering a blank.
   */
  path: string;
  title: string;
  intro: string;
  sections: readonly LegalSection[];
  trail: ReadonlyArray<{ name: string; href?: string }>;
  /** Closing line naming who to write to about this document. */
  contact: string;
}) {
  const doc = legalDoc(path);
  const related = relatedDocs(doc.related);
  const effectiveLabel = new Date(`${doc.effective}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      {/* 2026-10-03: light document header (pill, display title, date chip)
          instead of the dark navy band, matching the rebuilt pages. */}
      <section className="relative isolate overflow-hidden border-b border-line bg-canvas-secondary">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_85%_0%,rgb(0_0_255/0.07),transparent_70%)]" />
        <Container className="pb-12 pt-8 sm:pb-16 sm:pt-10">
          <Breadcrumbs trail={tx(trail)} tone="light" />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-small font-medium text-primary">{tx("Legal")}</span>
            <h1 className="display-lg mt-5 text-fg">{tx(title)}</h1>
            <p className="mt-5 text-body-lg text-fg-secondary">
              {tx(intro)}
              {/* Spanish pages are a courtesy translation (Edgar, 2026-11-01): said in the
                  intro itself so the page layout stays identical to the English one. */}
              {isSpanish() ? " Esta es una traducción de cortesía: si hay alguna diferencia, rige la versión en inglés." : null}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1.5 text-small text-fg-secondary ring-1 ring-line">
              <span className="size-1.5 rounded-full bg-success-fill" />{tx("In effect from ")}<time dateTime={doc.effective} className="font-medium text-fg">{tx(effectiveLabel)}</time>
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
          <nav aria-label={tx("Contents")} className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-small font-semibold text-fg">{tx("Contents")}</p>
            <ol className="mt-4 flex flex-col gap-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={lh(`#${s.id}`)}
                    className="flex min-h-[2.5rem] items-center gap-3 rounded-md px-3 text-small text-fg-secondary transition-colors hover:bg-canvas-secondary hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span aria-hidden="true" className="tabular w-5 text-micro text-fg-muted">
                      {tx(i + 1)}
                    </span>
                    {tx(s.heading)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-[70ch]">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 [&+section]:mt-12">
                <h2 className="text-h3 font-medium tracking-[-0.02em] text-fg">{tx(s.heading)}</h2>
                {s.blocks.map((b, j) => {
                  if (b.type === "index") return <DocumentIndex key={j} />;
                  if (b.type === "precedence") return <Precedence key={j} />;
                  if (b.type === "p")
                    return (
                      <p key={j} className="mt-4 text-body text-fg-secondary">
                        {tx(b.text)}
                      </p>
                    );
                  if (b.type === "note")
                    return (
                      <p
                        key={j}
                        className="mt-5 rounded-xl bg-brand-50 p-4 text-small text-fg"
                      >
                        {tx(b.text)}
                      </p>
                    );
                  return (
                    <ul key={j} className="mt-4 flex flex-col gap-2.5">
                      {b.items.map((item) => (
                        <li key={item} className="flex gap-3 text-body text-fg-secondary">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                          />
                          <span>{tx(item)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                })}
              </section>
            ))}

            {related.length > 0 && (
              <nav aria-labelledby="related-heading" className="mt-14 border-t border-line pt-8">
                <h2 id="related-heading" className="text-h4 text-fg">{tx("Related documents")}</h2>
                {/*
                 * Each link carries the sibling's one-line summary, not just
                 * its title. Someone lands on a legal page from a search
                 * result far more often than from the index, so this block is
                 * usually their FIRST view of the document set — a bare list
                 * of titles would make them go and open each one.
                 */}
                <ul className="mt-4 flex flex-col gap-3">
                  {related.map((r) => (
                    <li key={r.path}>
                      <Link
                        href={lh(r.path)}
                        className="group block rounded-md py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <span className="text-body font-medium text-primary underline-offset-4 group-hover:underline">
                          {tx(r.title)}
                        </span>
                        <span className="mt-0.5 block text-small text-fg-secondary">
                          {tx(r.summary)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-small text-fg-muted">
                  <Link
                    href={lh("/legal-information")}
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
                  >{tx("All legal documents")}</Link>{" "}{tx("— including the order they take precedence in when two of them appear to disagree.")}</p>
              </nav>
            )}

            <div className="mt-14 border-t border-line pt-8">
              <h2 className="text-h4 text-fg">{tx("Questions about this document")}</h2>
              <p className="mt-3 text-body text-fg-secondary">{tx(contact)}</p>
              <p className="mt-4 text-body text-fg-secondary">{tx("Write to")}{" "}
                <a
                  href={lh(`mailto:${company.email}`)}
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
                >
                  {tx(emailDisplay)}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
