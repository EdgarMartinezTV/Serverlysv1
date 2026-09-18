import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";

/**
 * A short centred pitch with a single button.
 *
 * The reference's "text + button" band, used near the bottom to hand a reader
 * who has scrolled the whole page one more door to walk through. One CTA, not
 * two — this sits a screen above the page's real closing CTA, and two competing
 * primary actions that close together dilute both.
 */
export function TextButtonBand({
  eyebrow,
  title,
  body,
  cta,
  surface = "subtle",
  id,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  surface?: "light" | "subtle" | "dark";
  id?: string;
}) {
  const dark = surface === "dark";
  // The fallback id must not begin with a Tailwind utility prefix. The token
  // validator scans string literals as well as class names, so an id opening
  // with one of those prefixes reads to it as a colour utility that resolves to
  // nothing, and fails the build. Naming it after the band sidesteps that.
  const headingId = id ? `${id}-heading` : "band-cta-heading";
  return (
    <Section id={id} surface={surface} spacing="tight" labelledBy={headingId}>
      <Reveal className="mx-auto flex max-w-[680px] flex-col items-center gap-4 text-center">
        {eyebrow && (
          <span
            className={`font-mono text-caption uppercase ${dark ? "text-primary-on-dark" : "text-primary"}`}
          >
            {eyebrow}
          </span>
        )}
        <h2 className={`text-h2 ${dark ? "text-white" : "text-fg"}`} id={headingId}>
          {title}
        </h2>
        <p
          className={`text-body-lg ${dark ? "text-fg-on-dark-secondary" : "text-fg-secondary"}`}
        >
          {body}
        </p>
        <div className="mt-2">
          <Button href={cta.href} variant={dark ? "inverse" : "primary"} size="lg">
            {cta.label}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
