import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { AutomationCanvas } from "@/components/product-ui/live/automation-canvas";

/**
 * Automation band.
 *
 * The workflow is the section. It is a full-bleed panel with the copy pushed
 * into a narrow rail beside it, rather than the usual heading-over-content —
 * which is the point of putting it here in the page order, between two bands
 * that are both centred. Three centred sections in a row is what makes a page
 * read as a template.
 *
 * The canvas is operable: run it, or select any step to see what that step
 * does. Every step is a real Serverlys behaviour built on n8n. Nothing here is
 * an invented capability, and the "what it does" text for each node is the
 * honest description, not a benefit statement.
 */
const OUTCOMES = [
  {
    title: "Nothing waits until morning",
    body: "An enquiry that lands at 11pm is answered at 11pm, in your wording — not by an autoresponder that says someone will be in touch.",
  },
  {
    title: "Nothing gets re-keyed",
    body: "The contact, the message and the classification all land in the CRM together. Nobody copies an email address into a spreadsheet.",
  },
  {
    title: "Nothing gets lost",
    body: "Triage is done before a human sees it, so the urgent one is not sitting three below a newsletter signup.",
  },
] as const;

export function AutomationBand() {
  return (
    <section
      aria-labelledby="automation-title"
      className="relative isolate overflow-hidden bg-canvas-abyss py-14 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(50%_44%_at_18%_0%,rgb(0_0_255/0.24)_0%,transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />

      <Container width="wide" className="relative">
        {/*
          Rail beside the canvas, then the outcomes as a full-width row beneath.

          The outcomes used to sit in the rail, which made the left column about
          twice the height of the canvas and left a ~250px dead zone to the right
          of it. Splitting them out balances the two columns and gives the band a
          second, different composition instead of one lopsided pair.
        */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <span className="text-micro text-primary-on-dark font-semibold">
              Automations
            </span>
            <h2 id="automation-title" className="mt-4 text-h2 text-white">
              The busywork between an enquiry and a booking.
            </h2>
            <p className="mt-4 text-body-lg text-fg-on-dark-secondary">
              Built on n8n and set up for you. Press run and watch one enquiry go all
              the way through.
            </p>

            <Button href="/automations" variant="inverse" className="mt-7">
              How automations work
            </Button>
          </div>

          {/* The product itself. */}
          <Reveal delay={100} className="min-w-0">
            <AutomationCanvas tone="dark" />
          </Reveal>
        </div>

        <dl className="mt-12 grid gap-x-8 gap-y-7 border-t border-line-on-dark pt-10 sm:grid-cols-3 lg:mt-16">
          {OUTCOMES.map((item) => (
            <div key={item.title}>
              <dt className="text-body font-semibold text-white">{item.title}</dt>
              <dd className="mt-1.5 text-small text-fg-on-dark-secondary">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
