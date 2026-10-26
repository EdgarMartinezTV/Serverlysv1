import { notFound } from "next/navigation";
import { industries, industryBySlug } from "@/data/industries";
import { IndustryPage, industryMetadata } from "../_industry/industry-page";

/** /website-design/<industry> — English. Statically generated; unknown slugs 404. */
export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/website-design/[industry]">) {
  const industry = industryBySlug((await props.params).industry);
  return industry ? industryMetadata(industry, "en") : {};
}

export default async function IndustryWebsitePage(props: PageProps<"/website-design/[industry]">) {
  const industry = industryBySlug((await props.params).industry);
  if (!industry) notFound();
  return <IndustryPage industry={industry} locale="en" />;
}
