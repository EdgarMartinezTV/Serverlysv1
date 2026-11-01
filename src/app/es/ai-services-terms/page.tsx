import EnPage, { metadata as enMetadata } from "@/app/(en)/ai-services-terms/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/ai-services-terms — Spanish twin of /ai-services-terms: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/ai-services-terms");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
