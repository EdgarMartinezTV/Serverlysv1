import EnPage, { metadata as enMetadata } from "@/app/(en)/snaply/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/snaply — Spanish twin of /snaply: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/snaply");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
