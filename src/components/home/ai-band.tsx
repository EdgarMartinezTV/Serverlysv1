import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { ConvoChat } from "@/components/product-ui/live/convo-chat";
import { CallFlowConsole } from "@/components/product-ui/live/callflow-console";
import { FloatingMetric } from "@/components/product-ui/live/floating-metric";
import { sisterProducts } from "@/data/company";

/**
 * The AI band.
 *
 * Both products are here as working interfaces: you can hold a conversation
 * with ConvoAI and play a CallFlow call. That is the point of the section —
 * "AI answers your customers" is a claim, and a claim you can operate is a
 * different kind of argument than a claim beside a screenshot.
 *
 * The two are stacked on an offset rather than sat in equal columns. Equal
 * columns would say these are alternatives; they are not, they are the same
 * capability on two channels, and the offset reads as one thing continuing.
 *
 * Content is Serverlys' real AI products — ConvoAI (chat) and CallFlow (voice).
 * Neither is an invented assistant, and both link to the real product.
 */
export function AiBand() {
  const convo = sisterProducts.find((p) => p.name === "ConvoAI");
  const callflow = sisterProducts.find((p) => p.name === "CallFlow");

  return (
    <section
      aria-labelledby="ai-band-title"
      className="relative isolate overflow-hidden bg-canvas-dark py-14 sm:py-24 lg:py-28"
    >
      {/*
        ⚠ CYAN, NOT VIOLET. This wash was `rgb(0 0 255 / 0.20)` —
        `violet-500`. Recoloured rather than deleted for the same reason as the
        hero's: each of these dark bands is lit by TWO sources, and dropping one
        leaves a flat half.

        Cyan is the substitute because globals.css already nominates it —
        `--color-accent-on-dark: var(--color-cyan-400)` — so the band keeps two
        visibly distinct hues without inventing a third. Alpha comes down from
        0.20 to 0.14 because cyan is markedly more luminous than violet at the
        same opacity and read as a teal spotlight at parity.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(52%_46%_at_78%_-4%,rgb(34_211_238/0.14)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(48%_44%_at_12%_60%,rgb(34_126_255/0.16)_0%,transparent_72%)]"
      />

      <Container width="wide" className="relative">
        {/* Heading, deliberately off to one side. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <div className="max-w-2xl">
            <span className="text-micro text-primary-on-dark font-semibold">
              AI that works your hours
            </span>
            <h2 id="ai-band-title" className="mt-4 text-h1 text-white">
              Nobody is on the phone at 2am. Something should be.
            </h2>
          </div>
          <p className="text-body-lg text-fg-on-dark-secondary">
            The enquiries that arrive out of hours are the ones that go unanswered — and
            then go elsewhere. Both of these are running right here on this page. Try
            them.
          </p>
        </div>

        {/* ── Two live products, offset ────────────────────────────────── */}
        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          {/* Chat — the taller plane, sits lower. */}
          <Reveal className="lg:col-span-5 lg:col-start-1 lg:pt-16">
            <div className="relative">
              <ConvoChat tone="dark" />
              {/* Bottom-LEFT, not top-right: the chat's "Live demo" marker sits
                  top-right, and covering it is not a cosmetic problem — that
                  marker is what stops a reader taking the transcript for their
                  own account. */}
              <FloatingMetric
                className="absolute -left-6 bottom-6 hidden xl:flex"
                label="Answered in"
                value="< 2s"
                trend="Day or night"
                accent="violet"
              />
            </div>
            <div className="mt-5">
              <h3 className="text-h4 text-white">ConvoAI · chat</h3>
              <p className="mt-2 text-body text-fg-on-dark-secondary">
                Answers questions on your site, books the appointment and hands you the
                lead with the whole conversation attached.
              </p>
              {convo && (
                <Button
                  href={convo.href}
                  variant="inverseOutline"
                  size="sm"
                  className="mt-3"
                >
                  See ConvoAI
                </Button>
              )}
            </div>
          </Reveal>

          {/* Voice — the wider plane, sits higher. */}
          <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
            <CallFlowConsole />
            <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div>
                <h3 className="text-h4 text-white">CallFlow · voice</h3>
                <p className="mt-2 max-w-md text-body text-fg-on-dark-secondary">
                  Picks up when you cannot, takes the booking, and writes it into the
                  calendar before the caller has hung up.
                </p>
              </div>
              {callflow && (
                <Button href={callflow.href} variant="inverse" size="sm">
                  See CallFlow
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
