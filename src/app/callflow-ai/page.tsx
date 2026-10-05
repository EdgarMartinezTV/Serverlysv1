import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { CallFlowConsole } from "@/components/product-ui/live/callflow-console";
import { AutomationMock } from "@/components/product-ui/mocks";
import { DashboardMock as Panel } from "@/components/product-ui/dashboard";
import { billing, sisterProducts } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";

const PATH = "/callflow-ai";
const DESCRIPTION =
  "CallFlow is the Serverlys voice agent: it answers the phone when nobody can, handles routine calls, books appointments and takes a proper message otherwise.";

export const metadata = pageMetadata({
  title: "AI Voice Agent for Your Business — CallFlow | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

export default function CallFlowPage() {
  const faqs = faqsFor(PATH);
  const callflow = sisterProducts.find((p) => p.name === "CallFlow");

  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "CallFlow — AI voice agent",
          serviceType: "AI voice agent",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd data={faqGraph(faqs, "/callflow-ai")} />

      <ProductHero
        eyebrow="CallFlow"
        title="An AI voice agent, because a missed call is a lost customer"
        lede="People still ring, and they rarely ring twice. This AI voice agent answers, handles what it can, books what it should and takes a message worth reading when it cannot."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "AI agents", href: "/ai-agents" }, { name: "CallFlow" }]}
        specs={[
          { label: "Answers", value: "Every call" },
          { label: "Books", value: "To your calendar" },
          { label: "Messages", value: "With callback" },
          { label: "Status", value: "In development" },
        ]}
        primary={{ label: "See CallFlow", href: callflow?.href ?? billing.sales }}
        secondary={{ label: "Ask about early access", href: billing.sales }}
        visual={<CallFlowConsole />}
      />

      <FeatureGrid
        eyebrow="On the call"
        title="What it does while the phone is ringing"
        surface="light"
        columns={3}
        items={[
          { label: "Answers immediately", detail: "No hold music, no queue, no voicemail.", icon: "phone" },
          { label: "Says what it is", detail: "Callers are told they are speaking to an assistant.", icon: "shield" },
          { label: "Handles the routine", detail: "Hours, location, availability, directions.", icon: "compass" },
          { label: "Books appointments", detail: "Straight into the calendar, with confirmation.", icon: "book" },
          { label: "Takes real messages", detail: "Name, number, reason — not just a missed call.", icon: "mail" },
          { label: "Escalates", detail: "Urgent calls are routed to a person.", icon: "lifebuoy" },
        ]}
      />

      <ShowcaseSplit
        id="after-call"
        eyebrow="After the call"
        title="The call becomes an appointment"
        body="A finished call triggers the same workflow engine as chat: the booking reaches the calendar, the record is created, and the right person is told."
        cta={{ label: "See automations", href: "/automations" }}
        visual={<AutomationMock />}
        side="left"
        surface="dark"
        bleed
      />

      <ShowcaseSplit
        id="panel"
        eyebrow="In the panel"
        title="Calls sit beside everything else"
        body="Calls, chats, sites and domains are in the same control panel. You are not reconciling a phone dashboard against a hosting account."
        cta={{ label: "See the platform", href: "/hosting" }}
        visual={<Panel />}
        side="right"
        surface="subtle"
      />

      <FaqSection items={faqs} />
      <FinalCta />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
