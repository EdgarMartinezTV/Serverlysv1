import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

/**
 * Automation band.
 *
 * Reproduces the target's dark section: centred heading, then a large flow
 * diagram on the left and an accordion on the right with the first item open.
 *
 * The accordion is native <details name="..."> — the HTML exclusive-accordion
 * feature. It needs no JavaScript, is keyboard operable and correctly announced
 * out of the box. Where `name` is unsupported the panels simply stop being
 * mutually exclusive, which is a harmless degradation.
 *
 * Every item is a real Serverlys behaviour — backups, scaling, certificate
 * renewal, WordPress updates, ConvoAI handover. Nothing here is an invented
 * capability.
 */
const ITEMS = [
  {
    title: "Backups and restore",
    body: "A full snapshot is taken daily and kept ready. Restoring one costs nothing and does not need a support ticket — the point of a backup is that it is there when you are panicking.",
    tag: "Daily",
  },
  {
    title: "Scaling under load",
    body: "Cloud plans absorb a traffic spike by adding capacity rather than throttling you. There is no per-gigabyte overage, so a good week does not produce a surprise invoice.",
    tag: "Automatic",
  },
  {
    title: "Certificate renewal",
    body: "SSL is issued when the domain points at us and renews on its own. Nobody has to remember an expiry date, which is how most certificate outages actually start.",
    tag: "Free",
  },
  {
    title: "WordPress core updates",
    body: "On managed plans we apply core updates for you and check the site still renders afterwards. Plugin updates stay yours to control.",
    tag: "Managed",
  },
  {
    title: "ConvoAI handover",
    body: "The agent answers what it can and escalates what it cannot, so a refund request reaches a person instead of being guessed at.",
    tag: "Included",
  },
] as const;

export function AutomationBand() {
  return (
    <section
      aria-labelledby="automation-heading"
      className="relative isolate overflow-hidden bg-canvas-abyss py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(34_126_255/0.26)_0%,transparent_68%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-50" />

      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-caption uppercase text-accent-on-dark">
            Runs without you
          </span>
          <h2 id="automation-heading" className="mt-5 text-h1 text-white">
            Put the boring parts on autopilot
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-body-lg text-fg-on-dark-secondary">
            The work that keeps a site alive is the work nobody remembers to do. These
            run whether you think about them or not.
          </p>
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal>
            <RequestFlow />
          </Reveal>

          <Reveal delay={80}>
            <ul className="flex flex-col">
              {ITEMS.map((item, i) => (
                <li
                  key={item.title}
                  className="border-b border-line-on-dark first:border-t"
                >
                  <details
                    // Native exclusive accordion: opening one closes the rest,
                    // with no JavaScript and no ARIA to hand-maintain.
                    name="automation"
                    open={i === 0}
                    className="group"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
                      <span className="flex-1 text-h4 text-white">{item.title}</span>
                      <span className="rounded-full bg-white/8 px-2.5 py-1 font-mono text-caption uppercase text-fg-on-dark-muted ring-1 ring-inset ring-white/12">
                        {item.tag}
                      </span>
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-fg-on-dark-muted transition-transform duration-normal ease-hover group-open:rotate-45"
                      >
                        <svg viewBox="0 0 16 16" className="h-4 w-4">
                          <path
                            d="M8 3v10M3 8h10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </summary>
                    <p className="max-w-prose pb-6 pr-10 text-body text-fg-on-dark-secondary">
                      {item.body}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/**
 * Request path diagram.
 *
 * A real description of what happens to a request — visitor, cache, app,
 * database — with the automated jobs hanging off it. Decorative as a whole
 * (the accordion beside it carries the meaning), so it is aria-hidden.
 */
function RequestFlow() {
  const nodes = [
    { label: "Visitor", sub: "request" },
    { label: "LiteSpeed", sub: "cache hit" },
    { label: "App server", sub: "PHP · Node" },
    { label: "Database", sub: "MySQL" },
  ];

  return (
    <div
      aria-hidden="true"
      className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-inset ring-white/10 backdrop-blur-sm sm:p-8"
    >
      <p className="font-mono text-caption uppercase text-fg-on-dark-muted">
        Request path
      </p>

      {/* Main path */}
      <ol className="mt-5 flex flex-col gap-2.5">
        {nodes.map((node, i) => (
          <li key={node.label} className="flex items-stretch gap-3.5">
            <div className="flex w-6 flex-col items-center">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[0.5625rem]",
                  i === 1
                    ? "bg-cyan-400 text-canvas-abyss"
                    : "bg-white/12 text-fg-on-dark-secondary",
                )}
              >
                {i + 1}
              </span>
              {i < nodes.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-white/15" />
              )}
            </div>
            <div
              className={cn(
                "flex flex-1 items-center justify-between rounded-xl px-4 py-3",
                i === 1
                  ? "bg-cyan-400/12 ring-1 ring-inset ring-cyan-400/30"
                  : "bg-white/[0.05]",
              )}
            >
              <span className="text-small font-medium text-white">{node.label}</span>
              <span className="font-mono text-caption text-fg-on-dark-muted">
                {node.sub}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {/* Automated jobs hanging off the path */}
      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="font-mono text-caption uppercase text-fg-on-dark-muted">
          Running alongside
        </p>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {[
            ["Backup", "02:00 daily"],
            ["Scale", "on demand"],
            ["SSL", "auto-renew"],
          ].map(([label, when]) => (
            <li
              key={label}
              className="rounded-lg bg-white/[0.05] px-3 py-2.5 ring-1 ring-inset ring-white/8"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success-fill" />
                <span className="text-small font-medium text-white">{label}</span>
              </span>
              <span className="mt-0.5 block font-mono text-caption text-fg-on-dark-muted">
                {when}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
