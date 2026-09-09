import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { AutomationMock, ChatMock } from "@/components/product-ui/mocks";
import { DashboardMock } from "@/components/product-ui/dashboard";
import { billing } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph } from "@/lib/seo";

const PATH = "/automations";
const DESCRIPTION =
  "Serverlys automations turn an enquiry into a record, a booking into a calendar entry and a form into the right notification — built on n8n, set up for you.";

export const metadata = pageMetadata({
  title: "Automations — workflows that run without you | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

export default function AutomationsPage() {
  const faqs = faqsFor(PATH);

  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Automations", path: PATH }])} />
      <JsonLd data={faqGraph(faqs)} />

      <ProductHero
        eyebrow="Automations"
        title="The work between the work"
        lede="An enquiry arrives and something has to happen: a record created, a person told, a date held. That chain is the part that gets dropped when everyone is busy."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Automations" }]}
        specs={[
          { label: "Built on", value: "n8n" },
          { label: "Triggers", value: "Chat, call, form" },
          { label: "Set up", value: "By us" },
          { label: "Editable", value: "By you" },
        ]}
        primary={{ label: "Talk through a workflow", href: billing.sales }}
        secondary={{ label: "See AI agents", href: "/ai-agents" }}
        visual={<AutomationMock />}
      />

      <FeatureGrid
        eyebrow="Running already"
        title="Some of it is on before you ask"
        lede="Backups, scaling and certificate renewal are automations too — they just come switched on."
        surface="light"
        columns={3}
        items={[
          { label: "Nightly backups", detail: "Taken and kept ready. Restores are free.", icon: "shield" },
          { label: "Capacity scaling", detail: "Traffic spikes absorbed, not throttled.", icon: "gauge" },
          { label: "Certificate renewal", detail: "SSL reissued before it expires.", icon: "shield" },
          { label: "Enquiry to record", detail: "Chat and call outcomes written down.", icon: "book" },
          { label: "Booking to calendar", detail: "Held dates reach the right calendar.", icon: "compass" },
          { label: "Form to the right person", detail: "Routed by what the form actually says.", icon: "mail" },
        ]}
      />

      <ShowcaseSplit
        id="trigger"
        eyebrow="The trigger"
        title="It usually starts with a conversation"
        body="Most useful workflows begin when a customer says something. The agent captures it; the workflow decides what happens next."
        cta={{ label: "See ConvoAI", href: "/convoai" }}
        visual={<ChatMock />}
        side="right"
        surface="subtle"
      />

      <ShowcaseSplit
        id="visible"
        eyebrow="Visible"
        title="You can see what ran, and when"
        body="Automations are listed in the panel with their last run. An automation you cannot inspect is one you will eventually stop trusting."
        cta={{ label: "See the platform", href: "/hosting" }}
        visual={<DashboardMock />}
        side="left"
        surface="dark"
        bleed
      />

      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
