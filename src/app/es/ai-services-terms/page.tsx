import EnPage, { metadata as enMetadata } from "@/app/(en)/ai-services-terms/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";
import { CourtesyNotice } from "@/i18n/courtesy-notice";

/** /es/ai-services-terms — Spanish twin of /ai-services-terms: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/ai-services-terms");

export default function SpanishPage() {
  setLocale("es");
  return <><CourtesyNotice path="/ai-services-terms" /><EnPage /></>;
}
