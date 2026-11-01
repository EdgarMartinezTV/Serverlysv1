import EnPage, { metadata as enMetadata } from "@/app/(en)/report-abuse/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";
import { CourtesyNotice } from "@/i18n/courtesy-notice";

/** /es/report-abuse — Spanish twin of /report-abuse: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/report-abuse");

export default function SpanishPage() {
  setLocale("es");
  return <><CourtesyNotice path="/report-abuse" /><EnPage /></>;
}
