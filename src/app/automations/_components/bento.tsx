import { Grid, Headline } from "@/components/ref/kit";
import { BENTO } from "../_content";
import { CommunityArt, RunsArt, TemplatesArt, ValueArt } from "./visuals";

/**
 * "The jobs worth automating first".
 *
 * Measured at 1440: a 16px-gutter bento inside the 1280 grid — a 524px card on
 * the left running the full 873px height, and a 740px right column holding two
 * 362px cards over one full-width card. Every card is `surface-dark` at a 16px
 * radius with its art bled to the card's edges and a 24px copy block beneath,
 * heading 24/32 semibold at -0.12px over 16/24 body.
 *
 * The tracks are written as fractions of the measured widths rather than fixed
 * px so the same proportions hold between 1280 and 1600, where the grid's cap
 * changes but the reference's ratio does not.
 */
export function Bento() {
  const [setup, unlimited, value, nodes] = BENTO.cards;

  return (
    <section
      id="workflows"
      aria-labelledby="n8n-bento-heading"
      className="scroll-mt-32 bg-canvas-dark py-12 xl:py-12"
    >
      <Grid>
        <Headline
          id="n8n-bento-heading"
          title={BENTO.title}
          tone="dark"
          className="mb-10 xl:mb-12"
        />

        <div className="grid gap-4 xl:grid-cols-[524fr_740fr]">
          <Card title={setup.title} body={setup.body} art={<TemplatesArt />} />

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card title={unlimited.title} body={unlimited.body} art={<RunsArt />} />
              <Card title={value.title} body={value.body} art={<ValueArt />} />
            </div>
            <Card title={nodes.title} body={nodes.body} art={<CommunityArt />} />
          </div>
        </div>
      </Grid>
    </section>
  );
}

function Card({ title, body, art }: { title: string; body: string; art: React.ReactNode }) {
  return (
    /* `overflow-hidden` is what lets the art meet the card's rounded corners
       without each piece having to carry its own clip path. */
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-surface-dark">
      <div className="grow">{art}</div>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-[20px] leading-7 font-semibold tracking-[-0.1px] text-fg-on-dark lg:text-[24px] lg:leading-8 lg:tracking-[-0.12px]">
          {title}
        </h3>
        <p className="text-body text-fg-on-dark-secondary">{body}</p>
      </div>
    </article>
  );
}
