import EnPage, { metadata as enMetadata } from "@/app/(en)/data-processing-agreement/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/data-processing-agreement — Spanish twin of /data-processing-agreement: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/data-processing-agreement");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
