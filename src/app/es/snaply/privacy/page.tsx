import EnPage, { metadata as enMetadata } from "@/app/(en)/snaply/privacy/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/snaply/privacy — Spanish twin of /snaply/privacy: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/snaply/privacy");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
