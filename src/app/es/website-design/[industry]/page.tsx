import { notFound } from "next/navigation";
import { industries, industryBySlug } from "@/data/industries";
import { IndustryPage, industryMetadata } from "@/app/website-design/_industry/industry-page";

/** /es/website-design/<industry> — the Spanish twin of /website-design/<industry>. */
export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/es/website-design/[industry]">) {
  const industry = industryBySlug((await props.params).industry);
  return industry ? industryMetadata(industry, "es") : {};
}

export default async function SitioWebPorSectorPage(props: PageProps<"/es/website-design/[industry]">) {
  const industry = industryBySlug((await props.params).industry);
  if (!industry) notFound();
  return <IndustryPage industry={industry} locale="es" />;
}
