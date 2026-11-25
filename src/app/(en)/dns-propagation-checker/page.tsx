import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";
import { faqGraph, pageMetadata } from "@/lib/seo";
import { FAQS, FAQ_HEAD } from "./_content";
import { Checker } from "./_components/checker";

const PATH = "/dns-propagation-checker";

export const metadata = pageMetadata({
  title: "DNS Checker: Check DNS Propagation Worldwide | Serverlys",
  description:
    "Check DNS propagation for free. See which DNS servers around the world already return your new A, AAAA, CNAME, MX, NS, SRV, TXT, CAA or SOA records, and which still have the old ones.",
  path: PATH,
});

/**
 * DNS propagation checker.
 *
 * Layout rebuilt from hostinger.com/dns-propagation-checker (2026-11-24):
 * hero + form card, the cropped dot globe with a pinned summary, the results
 * card, and the FAQ, all on the reference's #f5f5f6 canvas. The tool is real:
 * <Checker> calls /api/dns/propagation, which walks the domain's delegation
 * to its own nameservers and asks ~50 resolvers worldwide (lib/dns/*).
 */
const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.runs.map((r) => r.text).join("")))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  scopes: [PATH],
}));

export default function DnsPropagationCheckerPage() {
  return (
    <div className="bg-[#f5f5f6] font-display [&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={faqGraph(FAQ_TEXT, PATH)} />
      <Checker />
      <div className="[&>section]:bg-[#f5f5f6] [&>section]:py-14 xl:[&>section]:py-20">
        <Faqs idPrefix="dns" title={FAQ_HEAD.title} description={FAQ_HEAD.description} items={FAQS} size="lg" defaultOpen={0} />
      </div>
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </div>
  );
}
