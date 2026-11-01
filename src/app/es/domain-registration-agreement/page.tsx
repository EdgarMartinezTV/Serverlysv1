import EnPage, { metadata as enMetadata } from "@/app/(en)/domain-registration-agreement/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/domain-registration-agreement — Spanish twin of /domain-registration-agreement: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/domain-registration-agreement");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
