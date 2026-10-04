import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { stageById } from "./stages";

const stage = stageById("manage");

const PANELS = [
  {
    title: "Daily backups you can restore yourself",
    body: "A full snapshot every day, kept for the retention window on your plan. Restore the whole account or pull one file out of it — without opening a ticket and without waiting for us.",
    meta: "Every plan",
  },
  {
    title: "Staging that is a copy, not a guess",
    body: "Clone the live site to a staging URL in one click, break it there, then push back when it holds. Plugin updates stop being a Friday-afternoon decision.",
    meta: "Every plan",
  },
  {
    title: "Updates that happen without you",
    body: "WordPress core and security patches applied automatically, with the backup taken first. You keep the switch — automatic is the default, not the only option.",
    meta: "WordPress and ecommerce plans",
  },
  {
    title: "A firewall and malware scanning in front of it",
    body: "Traffic filtered before it reaches PHP, and the file system scanned on a schedule. If something does land, the backup from before it landed is still there.",
    meta: "Every plan",
  },
  {
    title: "Or hand the whole list to us",
    body: "Managed hosting is the same infrastructure with our team doing the updates, the monitoring and the security work, and telling you what changed.",
    meta: "Managed hosting",
  },
] as const;

/** Repeated from the panels above on purpose — a summary is not a duplicate. */
const INCLUDED = [
  "Daily backups with self-service restore",
  "One-click staging",
  "Free SSL, issued and renewed",
  "Firewall and malware scanning",
  "Free migration from your current host",
] as const;

/**
 * Stage 4 — Manage.
 *
 * The panels are native <details> with a shared `name`, which makes them an
 * exclusive accordion in the browser with no JavaScript at all: open one and
 * the browser closes the others. Keyboard operation, the accessibility tree and
 * find-in-page all come from the element rather than from an ARIA imitation of
 * it. Where `name` is unsupported the group simply allows more than one open
 * panel — a degradation nobody notices, versus an accordion that does not open.
 *
 * `[&_summary::-webkit-details-marker]:hidden` and `list-none` remove the
 * default disclosure triangle; the chevron is ours so it can rotate.
 */
export function StageManage() {
  return (
    <Section
      id={stage.id}
      surface="light"
      spacing="tight"
      width="wide"
      labelledBy="manage-heading"
      className="scroll-mt-16"
    >
      <Reveal>
        <h2 id="manage-heading" className="display-md mx-auto max-w-[900px] text-center text-fg">
          {stage.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-[620px] text-center text-body-lg text-fg-secondary">
          {stage.lede}
        </p>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-start lg:gap-16">
        <Reveal className="flex flex-col border-t border-line">
          {PANELS.map((panel, index) => (
            <details
              key={panel.title}
              name="manage-panels"
              open={index === 0}
              className="group/panel border-b border-line"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span className="text-body-lg font-medium text-fg">{panel.title}</span>
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-fg transition-transform duration-fast ease-hover group-open/panel:rotate-45"
                >
                  <path
                    d="M8 3v10M3 8h10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <div className="max-w-[640px] pb-6">
                <p className="text-body text-fg-secondary">{panel.body}</p>
                <p className="mt-3 w-fit rounded-md bg-brand-50 px-2 py-0.5 text-micro font-semibold text-primary">
                  {panel.meta}
                </p>
              </div>
            </details>
          ))}
        </Reveal>

        <Reveal delay={80} className="lg:sticky lg:top-32">
          <div className="rounded-2xl bg-brand-50 p-7">
            <h3 className="text-h4 text-fg">Included before you ask</h3>
            <p className="mt-2 text-small text-fg-secondary">
              None of the five are an add-on, an upgrade prompt, or a line on the
              renewal invoice.
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-body text-fg-secondary">
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-success"
                  >
                    <path
                      d="m3.5 8.5 3 3 6-6.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Button href="/managed-hosting" variant="outline" block>
                See managed hosting
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

    </Section>
  );
}
