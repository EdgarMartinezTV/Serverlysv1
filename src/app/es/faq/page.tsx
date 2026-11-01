import EnPage, { metadata as enMetadata } from "@/app/(en)/faq/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/faq — Spanish twin of /faq: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/faq");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
