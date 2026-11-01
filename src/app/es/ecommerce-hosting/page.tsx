import EnPage, { metadata as enMetadata } from "@/app/(en)/ecommerce-hosting/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/ecommerce-hosting — Spanish twin of /ecommerce-hosting: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/ecommerce-hosting");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
