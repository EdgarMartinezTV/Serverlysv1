import EnPage, { metadata as enMetadata } from "@/app/(en)/acceptable-use-policy/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";
import { CourtesyNotice } from "@/i18n/courtesy-notice";

/** /es/acceptable-use-policy — Spanish twin of /acceptable-use-policy: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/acceptable-use-policy");

export default function SpanishPage() {
  setLocale("es");
  return <><CourtesyNotice path="/acceptable-use-policy" /><EnPage /></>;
}
