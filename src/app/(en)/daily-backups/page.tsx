import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";
import { faqGraph, pageMetadata } from "@/lib/seo";
import { FAQS, FAQ_HEAD } from "./_content";
import { Difference, Hero, How, Plans, Reasons } from "./_components/sections";

const PATH = "/daily-backups";

export const metadata = pageMetadata({
  title: "Daily Website Backups with Free Restores | Serverlys",
  description:
    "Every Serverlys hosting plan is backed up daily: files, databases and email. Restore a single file or the whole site from cPanel in a few clicks, and every restore is free.",
  path: PATH,
});

/**
 * Daily backups. Same layout as /free-ssl (rebuilt from
 * hostinger.com/free-ssl-certificate — the reference has no backups page);
 * copy, facts and artwork are Serverlys' own — see the header of _content.ts.
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

export default function DailyBackupsPage() {
  return (
    <div className="font-display [&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={faqGraph(FAQ_TEXT, PATH)} />
      <Hero />
      <Plans />
      <Difference />
      <Reasons />
      <How />
      <Faqs idPrefix="bk" title={FAQ_HEAD.title} description={FAQ_HEAD.description} items={FAQS} size="lg" defaultOpen={0} />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </div>
  );
}
