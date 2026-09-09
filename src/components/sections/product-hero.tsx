import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

/**
 * Product page hero.
 *
 * Same visual family as the homepage hero — dark band, layered light source,
 * technical grid — and it now carries a PRODUCT VISUAL. A hero of heading,
 * paragraph and two buttons was the pattern the gap analysis called out; every
 * page hero here shows the software it is selling.
 *
 * The spec row lets someone qualify the product in about two seconds without
 * scrolling.
 */
export function ProductHero({
  eyebrow,
  title,
  lede,
  breadcrumb,
  specs,
  primary,
  secondary,
  visual,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  breadcrumb: ReadonlyArray<{ name: string; href?: string }>;
  specs?: ReadonlyArray<{ label: string; value: string }>;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /** Rendered to the right on desktop, below the copy on mobile. */
  visual?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-canvas-abyss">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(65%_55%_at_25%_-5%,rgb(34_126_255/0.34)_0%,transparent_68%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(45%_40%_at_88%_20%,rgb(34_211_238/0.14)_0%,transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />

      <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12">
        <Breadcrumbs trail={breadcrumb} tone="dark" />

        <div
          className={cn(
            "mt-10 grid gap-12",
            visual ? "lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14" : "",
          )}
        >
          <div className={visual ? "" : "max-w-3xl"}>
            <span className="font-mono text-caption uppercase text-accent-on-dark">
              {eyebrow}
            </span>
            <h1 className="mt-4 text-h1 text-white">{title}</h1>
            <p className="mt-5 max-w-xl text-body-lg text-fg-on-dark-secondary">
              {lede}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={primary.href} variant="inverse" size="lg" block>
                {primary.label}
              </Button>
              <Button href={secondary.href} variant="inverseOutline" size="lg" block>
                {secondary.label}
              </Button>
            </div>

            {specs && (
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line-on-dark pt-7 sm:grid-cols-4">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="font-mono text-caption uppercase text-fg-on-dark-muted">
                      {spec.label}
                    </dt>
                    <dd className="mt-1.5 text-body font-semibold text-white">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {visual && (
            <Reveal delay={80} className="lg:-mr-10 xl:-mr-20">
              {visual}
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
