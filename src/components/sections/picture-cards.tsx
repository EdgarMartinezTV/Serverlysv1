import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type PictureCard = {
  title: string;
  body: string;
  /** The card's own visual — a code-built surface or supplied artwork. */
  visual: React.ReactNode;
  /**
   * Fill the tile edge to edge, with no padding and no inset ground.
   *
   * For supplied artwork, which arrives already composed on its own background:
   * padding it would draw a second frame inside the card, and the tile's dark
   * ground would show as a border around a picture that has its own.
   */
  bleed?: boolean;
};

/**
 * Three cards, each with its visual on top and copy beneath.
 *
 * The reference fills these with photography. Ours are code-built surfaces for
 * the same reason every other visual on this site is: a screenshot dates the
 * moment the UI changes, and a stock photo of someone at a laptop says nothing
 * about what the product does.
 */
export function PictureCards({
  eyebrow,
  title,
  lede,
  cards,
  cta,
  surface = "light",
  id,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  cards: readonly PictureCard[];
  cta?: { label: string; href: string };
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

      {/* min-w-0 on BOTH the grid item and the card. A grid track defaults to
          min-content, and these visuals are product mocks with an intrinsic
          width of ~380px — so at 375px the track refused to shrink and pushed
          the whole page 20px wide. The overflow-hidden clips what is left. */}
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {cards.map((card, i) => (
          <Reveal as="li" key={card.title} delay={i * 80} className="min-w-0">
            <Card
              variant="elevated"
              padding="none"
              className="h-full min-w-0 overflow-hidden"
            >
              {/* 3:2, not the reference's 1:1.
                  Theirs are square because theirs are photographs, where a crop
                  costs nothing. Ours are interface artwork at 3:2 — cropping
                  that to a square cuts the sidebar off one edge and the panels
                  off the other, which loses the actual content of the picture.
                  One ratio for the whole row, so the three titles below stay on
                  a shared baseline. */}
              <div
                className={cn(
                  "flex aspect-[3/2] min-w-0 items-center overflow-hidden bg-canvas-abyss",
                  !card.bleed && "p-5",
                )}
              >
                {card.bleed ? card.visual : <div className="w-full">{card.visual}</div>}
              </div>
              <div className="flex min-w-0 flex-col gap-2 p-6">
                <h3 className="text-h4 text-fg">{card.title}</h3>
                <p className="text-body text-fg-secondary">{card.body}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>

      {cta && (
        <Reveal delay={200} className="mt-10">
          <Button href={cta.href} variant="primary" size="lg">
            {cta.label}
          </Button>
        </Reveal>
      )}
    </Section>
  );
}
