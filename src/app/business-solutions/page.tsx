import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { DashboardMock } from "@/components/product-ui/dashboard";
import { AutomationMock, ChatMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, serviceGraph } from "@/lib/seo";

const PATH = "/business-solutions";
const DESCRIPTION =
  "The whole online side of a small business from one supplier: hosting, domains, the website, the AI that answers and the automations behind it — on one bill.";

export const metadata = pageMetadata({
  title: "Business Solutions — one supplier, one bill | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

export default function BusinessSolutionsPage() {
  const faqs = faqsFor("/");
  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "Small business technology package",
          serviceType: "Managed IT and web services",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Business solutions", path: PATH }])} />
      <JsonLd data={faqGraph(faqs)} />
      <ProductHero
        eyebrow="Business solutions"
        title="One supplier for the whole online side"
        lede="Most small businesses end up with a host, a registrar, a web designer and a marketing agency who have never spoken. When something breaks, each points at the others."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Business solutions" }]}
        specs={[
          { label: "One bill", value: "Everything" },
          { label: "One panel", value: "All of it" },
          { label: "One team", value: "To call" },
          { label: "Contracts", value: "Rolling" },
        ]}
        primary={{ label: "Tell us what you run", href: billing.sales }}
        secondary={{ label: "See pricing", href: "/pricing" }}
        visual={<DashboardMock />}
      />
      <FeatureGrid
        eyebrow="What that covers"
        title="Everything a business needs to be online"
        lede="Bought together, so nobody can blame the other supplier."
        surface="light"
        columns={3}
        items={[
          { label: "Hosting", detail: "Cloud, WordPress or ecommerce, on one stack.", icon: "server" },
          { label: "Domains", detail: "Registered, private and managed.", icon: "globe" },
          { label: "The website", detail: "Designed and built, or migrated as it is.", icon: "layout" },
          { label: "Business email", detail: "Mailboxes on your own name.", icon: "mail" },
          { label: "AI agents", detail: "Chat and phone answered around the clock.", icon: "sparkles" },
          { label: "Automations", detail: "Enquiries turned into records and bookings.", icon: "bolt" },
        ]}
      />
      <ShowcaseSplit
        id="answer"
        eyebrow="The enquiries"
        title="Nothing waits until Monday"
        body="Chat and phone are answered as they arrive. What can be handled is handled; what needs you reaches you with the conversation attached."
        cta={{ label: "See AI agents", href: "/ai-agents" }}
        visual={<ChatMock />}
        side="right"
        surface="subtle"
      />
      <ShowcaseSplit
        id="after"
        eyebrow="The follow-through"
        title="And the admin behind it runs itself"
        body="The record gets created, the calendar gets the booking, the right person gets told. That chain is what usually breaks when everyone is busy."
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
