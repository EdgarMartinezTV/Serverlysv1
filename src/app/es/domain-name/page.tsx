import EnPage, { metadata as enMetadata } from "@/app/(en)/domain-name/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/domain-name — Spanish twin of /domain-name: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/domain-name");
export const revalidate = 3600;

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
