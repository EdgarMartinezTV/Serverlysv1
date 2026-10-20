import type { PublicPage } from "@/lib/server/public-pages";
import { BioPage } from "./renderer";
import { canonicalFor, profileJsonLd } from "@/lib/server/page-meta";
import { env } from "@/lib/server/env";

/** A published page as a visitor gets it, on either URL form. */
export function PublicView({ page, customHost }: { page: PublicPage; customHost?: string }) {
  const url = canonicalFor(page, customHost);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd(page, customHost)).replace(/</g, "\\u003c") }} />
      <BioPage doc={page.doc} fixedBackground ctx={{ mode: "live", pageId: page.id, pageUrl: url, reportUrl: `${env.appUrl}/report/${page.id}` }} />
    </>
  );
}
