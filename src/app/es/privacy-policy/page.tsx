import EnPage, { metadata as enMetadata } from "@/app/(en)/privacy-policy/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";
import { CourtesyNotice } from "@/i18n/courtesy-notice";

/** /es/privacy-policy — Spanish twin of /privacy-policy: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/privacy-policy");

export default function SpanishPage() {
  setLocale("es");
  return <><CourtesyNotice path="/privacy-policy" /><EnPage /></>;
}
