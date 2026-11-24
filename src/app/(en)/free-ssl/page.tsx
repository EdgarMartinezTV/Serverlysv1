import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";
import { faqGraph, pageMetadata } from "@/lib/seo";
import { FAQS, FAQ_HEAD } from "./_content";
import { Difference, Hero, How, Plans, Reasons } from "./_components/sections";

const PATH = "/free-ssl";

export const metadata = pageMetadata({
  title: "Free SSL Certificate with Every Hosting Plan | Serverlys",
  description:
    "Get a free SSL certificate with Serverlys hosting: issued automatically for every domain, renewed before it expires, and trusted by every browser. HTTPS and the padlock at no extra cost.",
  path: PATH,
});

/**
 * Free SSL. Layout rebuilt from hostinger.com/free-ssl-certificate; copy,
 * facts and artwork are Serverlys' own — see the header of _content.ts.
 * `font-display` sets the page in DM Sans, as the reference does; the
 * text-wrap resets undo globals.css's balance/pretty so lines break normally.
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

export default function FreeSslPage() {
  return (
    <div className="font-display [&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={faqGraph(FAQ_TEXT, PATH)} />
      <Hero />
      <Plans />
      <Difference />
      <Reasons />
      <How />
      <Faqs idPrefix="ssl" title={FAQ_HEAD.title} description={FAQ_HEAD.description} items={FAQS} size="lg" defaultOpen={0} />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </div>
  );
}
