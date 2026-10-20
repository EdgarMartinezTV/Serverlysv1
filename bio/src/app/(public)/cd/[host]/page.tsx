import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lookupHost } from "@/lib/server/public-pages";
import { publicMetadata } from "@/lib/server/page-meta";
import { PublicView } from "@/components/bio/public-view";

/**
 * A page served on a customer's own domain. src/proxy.ts rewrites
 * https://links.example.com/ to /cd/links.example.com; this is never linked
 * directly, and its canonical points at the custom domain.
 */
type Props = { params: Promise<{ host: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { host } = await params;
  const page = await lookupHost(decodeURIComponent(host).toLowerCase());
  return page ? publicMetadata(page, decodeURIComponent(host).toLowerCase()) : { title: "Not found", robots: { index: false } };
}

export default async function CustomDomainPage({ params }: Props) {
  const host = decodeURIComponent((await params).host).toLowerCase();
  const page = await lookupHost(host);
  if (!page) notFound();
  return <PublicView page={page} customHost={host} />;
}
