import EnPage, { metadata as enMetadata } from "@/app/(en)/legal-information/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";
import { CourtesyNotice } from "@/i18n/courtesy-notice";

/** /es/legal-information — Spanish twin of /legal-information: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/legal-information");

export default function SpanishPage() {
  setLocale("es");
  return <><CourtesyNotice path="/legal-information" /><EnPage /></>;
}
