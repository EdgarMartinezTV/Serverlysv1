import EnPage, { metadata as enMetadata } from "@/app/(en)/dmca-policy/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";
import { CourtesyNotice } from "@/i18n/courtesy-notice";

/** /es/dmca-policy — Spanish twin of /dmca-policy: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/dmca-policy");

export default function SpanishPage() {
  setLocale("es");
  return <><CourtesyNotice path="/dmca-policy" /><EnPage /></>;
}
