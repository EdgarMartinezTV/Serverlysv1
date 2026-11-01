import EnPage, { metadata as enMetadata } from "@/app/(en)/terms-of-service/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/terms-of-service — Spanish twin of /terms-of-service: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/terms-of-service");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
