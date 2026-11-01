import EnPage, { metadata as enMetadata } from "@/app/(en)/wordpress-hosting/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/wordpress-hosting — Spanish twin of /wordpress-hosting: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/wordpress-hosting");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
