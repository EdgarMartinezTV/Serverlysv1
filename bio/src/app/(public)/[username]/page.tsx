import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { lookupUsername } from "@/lib/server/public-pages";
import { publicMetadata } from "@/lib/server/page-meta";
import { PublicView } from "@/components/bio/public-view";
import { normalizeUsername } from "@/lib/bio/username";

type Props = { params: Promise<{ username: string }> };

async function resolve(raw: string) {
  const username = normalizeUsername(decodeURIComponent(raw));
  // Canonical form is lowercase: /MiamiBakery → /miamibakery.
  if (username !== raw) permanentRedirect(`/${username}`);
  const found = await lookupUsername(username);
  if (found.kind === "redirect") permanentRedirect(`/${found.to}`);
  if (found.kind === "none") notFound();
  return found.page;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const found = await lookupUsername(normalizeUsername(decodeURIComponent(username)));
  if (found.kind !== "page") return { title: "Page not found", robots: { index: false } };
  return publicMetadata(found.page);
}

export default async function PublicProfile({ params }: Props) {
  const { username } = await params;
  const page = await resolve(username);
  return <PublicView page={page} />;
}
