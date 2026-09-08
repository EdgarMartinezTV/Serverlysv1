import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

/**
 * Product page hero. Reusable across all four hosting product pages.
 *
 * Same visual family as the homepage hero — dark band, brand light source,
 * technical grid — but deliberately shorter and simpler. A product page hero's
 * job is to confirm "yes, this is the thing you were looking for" and route to
 * plans; the homepage hero has to do positioning work this one does not.
 *
 * The spec row is the one piece of hero furniture that earns its place: it lets
 * someone qualify the product in about two seconds without scrolling.
 */
export function ProductHero({
  eyebrow,
  title,
  lede,
  breadcrumb,
  specs,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  breadcrumb: ReadonlyArray<{ name: string; href?: string }>;
  specs: ReadonlyArray<{ label: string; value: string }>;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  return (
    <section className="relative isolate overflow-hidden bg-canvas-dark">
      <div aria-hidden="true" className="absolute inset-0 bg-hero-glow" />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />

      <Container className="relative pb-14 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
        <Breadcrumbs trail={breadcrumb} tone="dark" />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <span className="font-mono text-caption uppercase text-primary-on-dark">
              {eyebrow}
            </span>
            <h1 className="mt-4 text-h1 text-white">{title}</h1>
            <p className="mt-5 max-w-xl text-body-lg text-fg-on-dark-secondary">
              {lede}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Button href={primary.href} variant="inverse" size="lg" block>
              {primary.label}
            </Button>
            <Button href={secondary.href} variant="inverseOutline" size="lg" block>
              {secondary.label}
            </Button>
          </div>
        </div>

        {/* At-a-glance qualification. */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line-on-dark pt-8 sm:grid-cols-4">
          {specs.map((spec) => (
            <div key={spec.label}>
              <dt className="font-mono text-caption uppercase text-fg-on-dark-muted">
                {spec.label}
              </dt>
              <dd className="mt-1.5 text-body-lg font-semibold text-white">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
