import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * The band where the reference runs customer testimonials and third-party
 * review scores.
 *
 * ⚠ Neither is possible here honestly, and the substitution is deliberate.
 *
 *   · There is no review data anywhere in this repo. An invented quote with an
 *     invented name and job title attached is a fabricated record, and putting
 *     one on a real company's site is not a design decision.
 *   · The reference also shows rating badges from Google, HostAdvice and
 *     WPBeginner. Serverlys has no published score on any of them that this
 *     repo can cite, and drawing the badges anyway asserts a third party's
 *     endorsement that was never given.
 *
 * So this carries commitments instead — each one verifiable elsewhere on this
 * site, and each one something the company can be held to. When real reviews
 * exist they belong here and this goes.
 */
export function ProofBand({
  eyebrow,
  title,
  lede,
  items,
  surface = "light",
  id,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  items: readonly { tag: string; title: string; body: string }[];
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
          align="center"
          tone={surface === "dark" ? "dark" : "light"}
        />
      </Reveal>

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 80}>
            <Card variant="elevated" padding="lg" className="h-full">
              <Badge tone="brand" className="w-fit">
                {item.tag}
              </Badge>
              <h3 className="mt-4 text-h4 text-fg">{item.title}</h3>
              <p className="mt-3 text-body text-fg-secondary">{item.body}</p>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
