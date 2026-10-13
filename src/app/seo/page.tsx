import { JsonLd } from "@/components/ui/json-ld";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import {
  ChatSplit,
  Commitments,
  CtaCard,
  Faqs,
  Hero,
  Included,
  MadeEasy,
  Ongoing,
  Plans,
} from "./_components/sections";

const PATH = "/seo";
const DESCRIPTION =
  "Technical and content SEO for small businesses: fix what is broken, earn the searches that bring buyers, and report honestly on what changed.";

export const metadata = pageMetadata({
  title: "SEO Services for Small Businesses | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

/** Section order and rationale: see ./_components/sections.tsx. */
export default function SeoPage() {
  const faqs = faqsFor(PATH);
  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "Search engine optimization",
          serviceType: "Search engine optimization",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd data={faqGraph(faqs, PATH)} />
      <Hero />
      <MadeEasy />
      <Plans />
      <ChatSplit />
      <Commitments />
      <Included />
      <Ongoing />
      <CtaCard />
      <Faqs items={faqs} />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "SEO", path: PATH }]} />
    </>
  );
}
