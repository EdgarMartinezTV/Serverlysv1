import EnPage, { metadata as enMetadata } from "@/app/(en)/customer-service-policy/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";
import { CourtesyNotice } from "@/i18n/courtesy-notice";

/** /es/customer-service-policy — Spanish twin of /customer-service-policy: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/customer-service-policy");

export default function SpanishPage() {
  setLocale("es");
  return <><CourtesyNotice path="/customer-service-policy" /><EnPage /></>;
}
