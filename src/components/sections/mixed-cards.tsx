import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { Card, CardLink } from "@/components/ui/card";

/**
 * One large media card beside a stack of smaller ones.
 *
 * The reference's "mixed cards" band: the feature it wants you to look at gets
 * a wide panel with a live surface in it, and the supporting ones get compact
 * cards down the side. Same 1.4 / 1 split as the homepage promo, deliberately —
 * the two bands do the same job and should not each invent a ratio.
 */
export function MixedCards({
  eyebrow,
  title,
  lede,
  feature,
  cards,
  surface = "light",
  id,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  feature: {
    eyebrow?: string;
    title: string;
    body: string;
    visual: React.ReactNode;
    cta?: { label: string; href: string };
  };
  cards: readonly { title: string; body: string; href: string }[];
  surface?: "light" | "subtle" | "dark";
  id?: string;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <Section id={id} surface={surface} spacing="base" width="wide" labelledBy={headingId}>
      <Reveal>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          lede={lede}
          id={headingId}
          tone={surface === "dark" ? "dark" : "light"}
        />
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="relative isolate flex flex-col overflow-hidden rounded-2xl bg-canvas-abyss p-6 shadow-e4 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_0%,rgb(34_126_255/0.38)_0%,transparent_70%)]"
          />
          {feature.eyebrow && (
            <span className="font-mono text-caption uppercase text-primary-on-dark">
              {feature.eyebrow}
            </span>
          )}
          <h3 className="mt-3 text-h3 text-white">{feature.title}</h3>
          <p className="mt-3 max-w-lg text-body text-fg-on-dark-secondary">
            {feature.body}
          </p>
          <div className="mt-7">{feature.visual}</div>
          {feature.cta && (
            <div className="mt-7">
              <Button href={feature.cta.href} variant="inverse">
                {feature.cta.label}
              </Button>
            </div>
          )}
        </Reveal>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {cards.map((card, i) => (
            <Reveal as="li" key={card.title} delay={80 + i * 60} className="h-full">
              <Card variant="interactive" padding="lg" className="h-full">
                <h3 className="text-h4 text-fg">
                  <CardLink href={card.href}>{card.title}</CardLink>
                </h3>
                <p className="mt-2 text-body text-fg-secondary">{card.body}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
