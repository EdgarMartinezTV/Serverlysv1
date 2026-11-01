import EnPage, { metadata as enMetadata } from "@/app/(en)/support/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/support — Spanish twin of /support: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/support");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
