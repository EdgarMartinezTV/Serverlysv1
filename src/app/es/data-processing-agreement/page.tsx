import EnPage, { metadata as enMetadata } from "@/app/(en)/data-processing-agreement/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";
import { CourtesyNotice } from "@/i18n/courtesy-notice";

/** /es/data-processing-agreement — Spanish twin of /data-processing-agreement: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/data-processing-agreement");

export default function SpanishPage() {
  setLocale("es");
  return <><CourtesyNotice path="/data-processing-agreement" /><EnPage /></>;
}
