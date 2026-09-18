import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { Card, CardLink } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HostingConsole } from "@/components/product-ui/live/hosting-console";
import { upcomingProducts } from "@/data/products";
import { OverlapCard } from "./overlap-card";
import { stageById } from "./stages";

const stage = stageById("build");

const LINKS = [
  { label: "Cloud hosting", href: "/cloud-hosting" },
  { label: "WordPress hosting", href: "/wordpress-hosting" },
  { label: "Ecommerce hosting", href: "/ecommerce-hosting" },
  { label: "Managed hosting", href: "/managed-hosting" },
] as const;

/** Facts, not an invented customer count. Each one is verifiable on this site. */
const PROOF = [
  "Free migration from any host",
  "NVMe + LiteSpeed on every tier",
  "30-day money-back guarantee",
] as const;

/**
 * Stage 1 — Build.
 *
 * The panel media is the real hosting console, the same operable component the
 * hero used to carry. Moving it down here was deliberate: it is a client
 * component, and above the fold it sat on the LCP path for a visual that most
 * visitors scroll past before touching. Here it loads after the fold and the
 * hero paints as static markup.
 *
 * The "hands-on control" pair below is VPS and dedicated, both `status: "soon"`
 * in the product data. They get a page link and a Soon badge and NO purchase
 * CTA — taking an order for hardware that is not sellable yet is the one thing
 * this block must not do.
 */
export function StageBuild() {
  const hands = upcomingProducts.filter((product) =>
    ["/vps-hosting", "/dedicated-servers"].includes(product.href),
  );

  return (
    <Section
      id={stage.id}
      surface="subtle"
      spacing="base"
      width="wide"
      labelledBy="build-heading"
      className="scroll-mt-8"
    >
      <Reveal>
        <SectionHeader
          eyebrow="01 · Build"
          title={stage.heading}
          lede={stage.lede}
          id="build-heading"
        />
      </Reveal>

      <Reveal delay={80} className="mt-12">
        <OverlapCard
          tone="dark"
          mediaSide="left"
          eyebrow="Hosting"
          title="A console that shows the machine, not a marketing dashboard"
          body="Real usage, real PHP versions, real cache controls. Open it — this is the component, wired to demo data, not a screenshot of one."
          links={LINKS}
          media={<HostingConsole />}
          footer={
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {PROOF.map((item) => (
                <li key={item} className="text-small text-fg-on-dark-muted">
                  {item}
                </li>
              ))}
            </ul>
          }
        />
      </Reveal>

      {/* ── Hands-on control ─────────────────────────────────────────────── */}
      <div className="mt-14">
        <Reveal>
          <h3 className="text-h3 text-fg">Want more hands-on control?</h3>
          <p className="mt-3 max-w-[680px] text-body text-fg-secondary">
            Root access and single-tenant hardware are being brought online. The pages
            below say where each one is and what it will include.
          </p>
        </Reveal>

        <ul className="mt-7 grid gap-5 sm:grid-cols-2">
          {hands.map((product, index) => (
            <Reveal as="li" key={product.href} delay={index * 80}>
              <Card variant="interactive" padding="lg" className="h-full">
                <Badge tone="warning" className="w-fit">Soon</Badge>
                <h4 className="mt-4 text-h4 text-fg">
                  <CardLink href={product.href}>{product.name}</CardLink>
                </h4>
                <p className="mt-2 text-body text-fg-secondary">{product.summary}</p>
                <p className="mt-4 text-small text-fg-muted">
                  Not orderable yet — the page takes your requirements so we size it
                  when it opens.
                </p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
