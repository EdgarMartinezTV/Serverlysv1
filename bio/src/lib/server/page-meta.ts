import "server-only";
import type { Metadata } from "next";
import type { PublicPage } from "./public-pages";
import { env } from "./env";

/** Canonical URL: a verified custom domain wins over bio.serverlys.com/{username}. */
export function canonicalFor(page: PublicPage, customHost?: string): string {
  return customHost ? `https://${customHost}/` : `${env.appUrl}/${page.username}`;
}

export function absolute(url: string): string {
  return url.startsWith("/") ? `${env.appUrl}${url}` : url;
}

export function publicMetadata(page: PublicPage, customHost?: string): Metadata {
  const { doc } = page;
  const title = doc.seo.title || `${doc.profile.name || page.username} | Links`;
  const description = doc.seo.description || doc.profile.bio.slice(0, 160) || `Links and contact for ${doc.profile.name || page.username}.`;
  const canonical = canonicalFor(page, customHost);
  const image = doc.seo.image || doc.profile.avatar;
  return {
    title,
    description,
    alternates: { canonical },
    robots: doc.seo.noindex || doc.settings.sensitive ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "profile",
      title,
      description,
      url: canonical,
      siteName: "Serverlys Bio",
      // An uploaded/explicit image wins; otherwise the generated OG card.
      images: image ? [{ url: absolute(image) }] : [{ url: `${env.appUrl}/api/og/${page.id}`, width: 1200, height: 630 }],
    },
    twitter: { card: image ? "summary" : "summary_large_image", title, description },
  };
}

/** schema.org ProfilePage — the type Google documents for creator profile pages. */
export function profileJsonLd(page: PublicPage, customHost?: string) {
  const { doc } = page;
  const url = canonicalFor(page, customHost);
  const sameAs = doc.socials.items.filter((s) => s.platform !== "email" && /^https?:\/\//.test(s.url)).map((s) => s.url);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    dateModified: page.publishedAt,
    mainEntity: {
      "@type": "Person",
      name: doc.profile.name || page.username,
      alternateName: page.username,
      description: doc.profile.bio || undefined,
      image: doc.profile.avatar ? absolute(doc.profile.avatar) : undefined,
      sameAs: sameAs.length ? sameAs : undefined,
    },
  };
}
