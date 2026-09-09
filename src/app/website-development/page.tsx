import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { AutomationMock, HostingMock, SitePreviewMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph } from "@/lib/seo";

const PATH = "/website-development";
const DESCRIPTION =
  "Custom web development for applications, integrations and the things an off-the-shelf plugin cannot do — built on the infrastructure that will run them.";

export const metadata = pageMetadata({
  title: "Web Development — applications and integrations | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

export default function WebsiteDevelopmentPage() {
  const faqs = faqsFor("/");
  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Web development", path: PATH }])} />
      <JsonLd data={faqGraph(faqs)} />
      <ProductHero
        eyebrow="Web development"
        title="When a plugin will not do it"
        lede="Booking that has to match how you actually schedule, stock that has to match your warehouse, a portal your customers log into. Built by the people who will also host it."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Web development" }]}
        specs={[
          { label: "Built on", value: "Serverlys" },
          { label: "Integrations", value: "Yours" },
          { label: "Handover", value: "Full source" },
          { label: "Support", value: "Same team" },
        ]}
        primary={{ label: "Describe the problem", href: billing.sales }}
        secondary={{ label: "See hosting", href: "/hosting" }}
        visual={<SitePreviewMock />}
      />
      <FeatureGrid
        eyebrow="What we build"
        title="The awkward middle of a business"
        lede="The parts that are specific to how you work, and therefore never come in a box."
        surface="light"
        columns={3}
        items={[
          { label: "Customer portals", detail: "Accounts, orders and documents behind a login.", icon: "shield" },
          { label: "Booking systems", detail: "Availability that matches how you actually schedule.", icon: "compass" },
          { label: "Integrations", detail: "Your accounting, stock or CRM talking to the site.", icon: "bolt" },
          { label: "Data imports", detail: "Getting years of records out of the old system.", icon: "server" },
          { label: "Internal tools", detail: "The spreadsheet that has outgrown being a spreadsheet.", icon: "layout" },
          { label: "APIs", detail: "So the next thing you build can talk to this one.", icon: "wrench" },
        ]}
      />
      <ShowcaseSplit
        id="run"
        eyebrow="Built to be run"
        title="It has to survive after launch"
        body="We build on the infrastructure we operate, so backups, certificates and scaling are already handled. There is no handover to a host who did not write it."
        cta={{ label: "See the platform", href: "/hosting" }}
        visual={<HostingMock />}
        side="right"
        surface="subtle"
        bleed
      />
      <ShowcaseSplit
        id="connect"
        eyebrow="Connected"
        title="New systems still need the old ones"
        body="Automations connect what we build to what you already use, so a new booking lands in the calendar and the accounts package you have used for a decade."
        cta={{ label: "See automations", href: "/automations" }}
        visual={<AutomationMock />}
        side="left"
        surface="dark"
      />
      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
