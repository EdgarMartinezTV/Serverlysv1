import EnPage, { metadata as enMetadata } from "@/app/(en)/accessibility/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";
import { CourtesyNotice } from "@/i18n/courtesy-notice";

/** /es/accessibility — Spanish twin of /accessibility: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/accessibility");

export default function SpanishPage() {
  setLocale("es");
  return <><CourtesyNotice path="/accessibility" /><EnPage /></>;
}
