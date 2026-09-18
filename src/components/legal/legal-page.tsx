import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section } from "@/components/ui/section";
import { company, emailDisplay } from "@/data/company";

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
  >;
};

export function LegalPage({
  title,
  intro,
  effective,
  sections,
  trail,
  contact,
}: {
  title: string;
  intro: string;
  /** ISO date this version took effect. */
  effective: string;
  sections: readonly LegalSection[];
  trail: ReadonlyArray<{ name: string; href?: string }>;
  /** Closing line naming who to write to about this document. */
  contact: string;
}) {
  const effectiveLabel = new Date(`${effective}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <section className="bg-canvas-abyss">
        <Container className="pb-12 pt-8 sm:pb-14 sm:pt-10">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-h2 text-white">{title}</h1>
            <p className="mt-4 text-body-lg text-fg-on-dark-secondary">{intro}</p>
            <p className="mt-6 font-mono text-caption uppercase tracking-wider text-fg-on-dark-muted">
              In effect from <time dateTime={effective}>{effectiveLabel}</time>
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
          <nav aria-label="Contents" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-caption font-semibold uppercase tracking-wider text-fg-muted">
              Contents
            </p>
            <ol className="mt-4 flex flex-col gap-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex min-h-[2.5rem] items-center gap-3 rounded-md px-3 text-small text-fg-secondary transition-colors hover:bg-canvas-secondary hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span aria-hidden="true" className="font-mono text-caption text-fg-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-[70ch]">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 [&+section]:mt-12">
                <h2 className="flex items-baseline gap-3 text-h4 text-fg">
                  <span aria-hidden="true" className="font-mono text-small text-fg-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.heading}
                </h2>
                {s.blocks.map((b, j) => {
                  if (b.type === "p")
                    return (
                      <p key={j} className="mt-4 text-body text-fg-secondary">
                        {b.text}
                      </p>
                    );
                  if (b.type === "note")
                    return (
                      <p
                        key={j}
                        className="mt-5 rounded-lg border-l-2 border-primary bg-canvas-secondary p-4 text-small text-fg-secondary"
                      >
                        {b.text}
                      </p>
                    );
                  return (
                    <ul key={j} className="mt-4 flex flex-col gap-2.5">
                      {b.items.map((item) => (
                        <li key={item} className="flex gap-3 text-body text-fg-secondary">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                })}
              </section>
            ))}

            <div className="mt-14 border-t border-line pt-8">
              <h2 className="text-h4 text-fg">Questions about this document</h2>
              <p className="mt-3 text-body text-fg-secondary">{contact}</p>
              <p className="mt-4 text-body text-fg-secondary">
                Write to{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
                >
                  {emailDisplay}
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
